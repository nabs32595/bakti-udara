# Backend Tech Spec — Firebase Auth & Cloud Functions

This specification defines the **production backend** for Bakti Udara, replacing the Phase 1
`localStorage` mock layer. It uses **Firebase Authentication** for identity and **Google Cloud
Functions (2nd gen)** for the API and automation, keeping the existing Vue 3 frontend intact.

## Design Principle

The frontend already isolates data access inside composables (e.g. `useLocalStorage`). Phase 2
swaps that boundary for a **Firebase/Cloud Functions client** — **no UI rewrites** required.

```text
Vue Pages ──> composables (data access)
                 │
   Phase 1 ──────┴──> localStorage  + mockData/*      (current mockup)
   Phase 2 ──────┴──> Firebase Auth + Cloud Functions (this spec)
```

## Locked Stack (this spec)

| Concern | Choice |
|---------|--------|
| Identity | **Firebase Authentication** — Google OAuth + passwordless (magic link) |
| API / automation | **Google Cloud Functions** (2nd gen, Node 20, TypeScript) |
| Database | **PostgreSQL** on **Cloud SQL** |
| File storage | **Google Cloud Storage (GCS)** |
| Transactional email | **Resend** (`api.resend.com`) |
| Push notifications | **Firebase Cloud Messaging (FCM)** |
| Secrets | **Google Secret Manager** |
| Region | `asia-southeast1` (Singapore) |

## 1. Firebase Project & Tooling

| Item | Choice |
|------|--------|
| Platform | Firebase (Blaze/paid plan — required for Cloud Functions outbound + 3rd-party email) |
| Functions runtime | Cloud Functions **2nd gen** (Cloud Run under the hood), Node 20, TypeScript |
| Local emulation | Firebase Emulator Suite (Auth, Functions, Storage) + local Postgres in Docker for the DB |
| IaC | `firebase.json` + `firestore.rules` + `storage.rules`; optionally Terraform for IAM |
| Deploy | `firebase deploy --only functions,hosting` (or via CI/CD) |

## 2. Authentication — Firebase Auth

Replaces the UI-only `LoginPage`. Implements both login options already shown in the mockup.

### 2.1 Providers

- **Google OAuth** — one-click sign-in (`signInWithPopup` / `signInWithRedirect`).
- **Passwordless (magic link)** — `sendSignInLinkToEmail` with `actionCodeSettings`
  (`handleCodeInApp: true`); email link completes the session.

### 2.2 Session & Token Flow

```text
Browser ──signInWithPopup/EmailLink──> Firebase Auth
Browser <─── ID token (JWT) ────────── Firebase Auth
Browser ── Authorization: Bearer <idToken> ──> Cloud Function (onCall/onRequest)
Cloud Function ── admin.auth().verifyIdToken(idToken) ──> uid + claims
```

- The frontend attaches the ID token to every API call (interceptor in the data composable).
- Cloud Functions verify the token with the **Firebase Admin SDK** before any work.

### 2.3 Authorization (RBAC)

The `RolesPage` matrix (GM / ADM / OPT + custom) is enforced server-side:

- Store each user's `role` in a Postgres `app_user` row (mirrored to custom claims).
- Mirror it into Firebase Auth **custom claims** (`auth().setCustomUserClaims(uid, { role })`)
  so `idToken` carries `role` — no extra lookup on hot paths.
- Cloud Functions read `context.auth.token.role` and reject unauthorised calls with `PERMISSION_DENIED`.

| Role | Capabilities |
|------|--------------|
| `GM` | Read all; approve; manage users/roles |
| `ADM` | Full CRUD; user & role administration |
| `OPT` | Create/edit RFQ, Quotation, PO; monitor delivery; send email |

## 3. API — Google Cloud Functions

All business logic lives in **callable** and **HTTP** functions. Data shapes follow the
[Data Model](/guide/data-model).

### 3.1 Function Inventory

| Function | Type | Purpose |
|----------|------|---------|
| `createRFQ` | callable | Create RFQ; attach docs; audit `Created` |
| `listRFQs` | callable | Paginated/filtered RFQ list (role-scoped) |
| `getRFQ` | callable | RFQ details + timeline + collaborators |
| `updateRFQStatus` | callable | Advance status via state machine; append timeline |
| `addCollaborator` | callable | Assign user; notify |
| `createQuotation` | callable | Build quotation from RFQ line items |
| `listQuotations` / `getQuotation` | callable | Read quotations; compute `daysRemaining`/`validityStatus` |
| `createPO` | callable | Convert quotation → PO; set EDD |
| `listPOs` / `getPO` | callable | PO + delivery status |
| `resolveConflict` | callable | Record discrepancy + amendment (QM-01 6.1.3 / 6.2.3) |
| `onRFQWritten` | callable | Called after an RFQ create/update; fires notifications + email |
| `sendEmail` | callable / trigger | Send QM-01 correspondence via Resend template |
| `computeDeliveryRisk` | **scheduled** | Cloud Scheduler → Pub/Sub → 2nd-gen function → flag `REVISE EDD`, notify OPT |

### 3.2 Example (TypeScript, 2nd gen callable)

```ts
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { Pool } from 'pg'

const pool = new Pool({ /* Cloud SQL connection via VPC connector */ })

export const updateRFQStatus = onCall({ region: 'asia-southeast1' }, async (req) => {
  const { uid, token } = req.auth ?? {}
  if (!uid) throw new HttpsError('unauthenticated', 'Login required')
  if (!['ADM', 'OPT'].includes(token?.role as string))
    throw new HttpsError('permission-denied', 'Role not authorised')

  const { rfqNo, fromStatus, toStatus } = req.data as {
    rfqNo: string
    fromStatus: string
    toStatus: string
  }
  if (!ALLOWED_TRANSITIONS[fromStatus]?.includes(toStatus))
    throw new HttpsError('failed-precondition', 'Invalid status transition')

  const now = new Date()
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `UPDATE rfq SET status = $1, updated_at = $2 WHERE rfq_no = $3`,
      [toStatus, now, rfqNo]
    )
    await client.query(
      `INSERT INTO rfq_status_event (rfq_no, status, actor_uid, at) VALUES ($1, $2, $3, $4)`,
      [rfqNo, toStatus, uid, now]
    )
    await client.query(
      `INSERT INTO audit_log (actor_uid, action, entity, entity_id, payload) VALUES ($1, $2, $3, $4, $5)`,
      [uid, 'rfq.status_changed', 'rfq', rfqNo, { from: fromStatus, to: toStatus }]
    )
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw new HttpsError('internal', 'Update failed')
  } finally {
    client.release()
  }
  return { ok: true }
})
```

### 3.3 Status State Machine

Free-text statuses from the mock become an enforced state machine in code (and SQL `ENUM`
columns). Example RFQ transitions:

```text
Created → Under Review → Sent to OEM → Quoted → (Quotation/PO follow-on)
                 │                │
          discrepancy       discrepancy
                 └────────────────┘──> amend & return to prior state
```

## 4. Data Store — Cloud SQL (PostgreSQL)

A managed **PostgreSQL** instance on **Cloud SQL** gives us relational integrity (FKs for
RFQ ↔ Quotation ↔ PO linkages), reporting-ready SQL, and strict enums for statuses.

### 4.1 Connection

- Cloud SQL private IP + **Serverless VPC Connector** so Cloud Functions can reach it.
- Connection pooling via `pg.Pool` (per-function instance); set `max` per cold/warm instance.
- Migrations managed with **node-pg-migrate** (or Prisma Migrate) checked into the repo.
- TLS required; IAM database auth (Cloud SQL IAM) where possible, otherwise strong password in
  Secret Manager.

### 4.2 Schema (core tables)

Field names mirror the Phase 1 [Data Model](/guide/data-model). `rfqNo` and `poReference`
remain opaque strings — never parsed as paths.

```sql
-- Reference / enumerations
CREATE TYPE rfq_status     AS ENUM ('Created','Under Review','Sent to OEM','Quoted','Amended','Closed');
CREATE TYPE po_delivery_status AS ENUM ('Pending','On Track','REVISE EDD','Delivered','Invoiced');
CREATE TYPE aes_class      AS ENUM ('A','E');
CREATE TYPE user_role      AS ENUM ('GM','ADM','OPT');

-- People
CREATE TABLE app_user (
  uid         TEXT PRIMARY KEY,            -- Firebase Auth UID
  email       TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  role        user_role NOT NULL DEFAULT 'OPT',
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RFQ
CREATE TABLE rfq (
  rfq_no        TEXT PRIMARY KEY,
  reference_no  TEXT NOT NULL,
  desc          TEXT NOT NULL,
  p_no          TEXT NOT NULL,
  aes           aes_class NOT NULL,
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  status        rfq_status NOT NULL DEFAULT 'Created',
  created_by    TEXT NOT NULL REFERENCES app_user(uid),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_rfq_status ON rfq(status);
CREATE INDEX idx_rfq_created_at ON rfq(created_at DESC);

CREATE TABLE rfq_status_event (
  id        BIGSERIAL PRIMARY KEY,
  rfq_no    TEXT NOT NULL REFERENCES rfq(rfq_no) ON DELETE CASCADE,
  status    rfq_status NOT NULL,
  actor_uid TEXT NOT NULL REFERENCES app_user(uid),
  at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note      TEXT
);

CREATE TABLE rfq_collaborator (
  rfq_no    TEXT NOT NULL REFERENCES rfq(rfq_no) ON DELETE CASCADE,
  uid       TEXT NOT NULL REFERENCES app_user(uid),
  added_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (rfq_no, uid)
);

-- Quotation
CREATE TABLE quotation (
  quotation_no     TEXT PRIMARY KEY,
  reference_no     TEXT NOT NULL,
  offer_date       DATE NOT NULL,
  validity_date    DATE NOT NULL,
  currency         CHAR(3) NOT NULL,
  total_amount     NUMERIC(14,2) NOT NULL,
  rfq_no_header    TEXT REFERENCES rfq(rfq_no),
  created_by       TEXT NOT NULL REFERENCES app_user(uid),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quotation_line (
  id              BIGSERIAL PRIMARY KEY,
  quotation_no    TEXT NOT NULL REFERENCES quotation(quotation_no) ON DELETE CASCADE,
  line_no         INTEGER NOT NULL,
  rfq_no          TEXT NOT NULL REFERENCES rfq(rfq_no),
  desc            TEXT NOT NULL,
  p_no            TEXT NOT NULL,
  aes             aes_class NOT NULL,
  quantity        INTEGER NOT NULL,
  unit_of_measure TEXT NOT NULL DEFAULT 'EA',
  unit_price      NUMERIC(14,2) NOT NULL,
  total_price     NUMERIC(14,2) NOT NULL,
  tat_days        INTEGER NOT NULL,
  UNIQUE (quotation_no, line_no)
);

-- Purchase Order
CREATE TABLE purchase_order (
  po_reference          TEXT PRIMARY KEY,
  quotation_no          TEXT NOT NULL REFERENCES quotation(quotation_no),
  po_date               DATE NOT NULL,
  po_number             TEXT,
  total_price           NUMERIC(14,2) NOT NULL,
  expected_delivery_date DATE NOT NULL,
  revised_date          DATE,
  delivery_status       po_delivery_status NOT NULL DEFAULT 'Pending',
  actual_delivery_date  DATE,
  created_by            TEXT NOT NULL REFERENCES app_user(uid),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_po_delivery_status ON purchase_order(delivery_status);
CREATE INDEX idx_po_edd ON purchase_order(expected_delivery_date);

CREATE TABLE po_line (
  id            BIGSERIAL PRIMARY KEY,
  po_reference  TEXT NOT NULL REFERENCES purchase_order(po_reference) ON DELETE CASCADE,
  line_no       INTEGER NOT NULL,
  rfq_no        TEXT NOT NULL REFERENCES rfq(rfq_no),
  desc          TEXT NOT NULL,
  p_no          TEXT NOT NULL,
  aes           aes_class NOT NULL,
  quantity      INTEGER NOT NULL,
  total_price   NUMERIC(14,2) NOT NULL,
  UNIQUE (po_reference, line_no)
);

-- Attachments (links to GCS)
CREATE TABLE attachment (
  id              BIGSERIAL PRIMARY KEY,
  rfq_no          TEXT REFERENCES rfq(rfq_no) ON DELETE CASCADE,
  quotation_no    TEXT REFERENCES quotation(quotation_no) ON DELETE CASCADE,
  po_reference    TEXT REFERENCES purchase_order(po_reference) ON DELETE CASCADE,
  file_name       TEXT NOT NULL,
  mime_type       TEXT NOT NULL,
  size_bytes      BIGINT NOT NULL,
  gcs_object      TEXT NOT NULL,           -- gs://bakti-udara-attachments/...
  uploaded_by     TEXT NOT NULL REFERENCES app_user(uid),
  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit log (append-only)
CREATE TABLE audit_log (
  id        BIGSERIAL PRIMARY KEY,
  actor_uid TEXT REFERENCES app_user(uid),
  action    TEXT NOT NULL,
  entity    TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  payload   JSONB NOT NULL,
  at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_entity ON audit_log(entity, entity_id, at DESC);
```

### 4.3 Money & Time

- All monetary values: `NUMERIC(14,2)` — never floating point.
- Timestamps: `TIMESTAMPTZ` stored UTC; the API returns ISO-8601 strings; client formats.
- `daysRemaining` / `validityStatus` are **computed in SQL or in the function**, not persisted.

### 4.4 Server-side Enforcement

- RBAC + status state machine are enforced **in Cloud Functions**, not in the DB alone.
- `audit_log` row written inside the same transaction as the business mutation.
- Read endpoints scope results by `request.auth.token.role` (e.g. `OPT` sees only their
  assigned RFQs; `ADM`/`GM` see all).

## 5. File Storage — Google Cloud Storage

RFQ/Quotation/PO attachments (`DocumentSection`) move from `#` URLs to **Google Cloud Storage
(GCS)**:

- Bucket: `gs://bakti-udara-attachments`.
- Object path: `rfqs/{rfqNo}/{fileId}`, `quotations/{quotationNo}/{fileId}`,
  `pos/{poReference}/{fileId}`.
- Client uploads via **V4 signed URLs** generated by a Cloud Function (`POST /signed-upload-url`).
- Read access via short-lived **V4 signed GET URLs** (download) or proxied through the function.
- Uniform bucket-level access **enabled**; per-object ACLs disabled. Public access prevention
  enforced (`--public-access-prevention`).
- Bucket lifecycle: standard storage for active files; Nearline coldline transition after 365
  days; lifecycle rule to delete `tmp/` prefix after 7 days.
- Encryption: default Google-managed keys (CMEK optional if compliance requires).
- Audit: bucket access logs to a dedicated logs bucket; object versioning on.

## 6. Email Automation — Resend

Replaces the UI-only Email module; implements QM-01 correspondence. All transactional mail is
sent through **Resend** (`https://api.resend.com/emails`).

| Trigger | Email |
|---------|-------|
| RFQ reviewed & clear | Forward RFQ to OEM |
| OEM quotation reviewed & clear | Send quotation to customer |
| PO reviewed & clear | Forward PO to OEM |
| EDD slippage | Notify OPT + customer (pickup/delivery) |
| PO ready for pickup | Notify interested party |

### 6.1 `sendEmail` Cloud Function (Resend)

Templates from the `emailTemplates` mock become **Resend React Email templates** (or stored
HTML in `email_settings`). `EmailSettings` drives the `from`, reply-to, and signature.

```ts
import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'

const RESEND_API_KEY = defineSecret('RESEND_API_KEY')

export const sendEmail = onCall(
  { region: 'asia-southeast1', secrets: [RESEND_API_KEY] },
  async (req) => {
    if (!req.auth) throw new HttpsError('unauthenticated', 'Login required')
    if (!['ADM', 'OPT'].includes((req.auth.token as any).role))
      throw new HttpsError('permission-denied', 'Role not authorised')

    const { to, templateId, data } = req.data as {
      to: string
      templateId: string
      data: Record<string, unknown>
    }

    const html = renderTemplate(templateId, data) // from emailTemplates / EmailSettings

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY.value()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM!,        // e.g. "Bakti Udara <noreply@baktiudara.com>"
        to,
        subject: data.subject,
        html
      })
    })
    if (!res.ok) throw new HttpsError('internal', `Resend error: ${res.status}`)
    return { ok: true }
  }
)
```

### 6.2 Domain Authentication

- SPF / DKIM / DMARC set up in Resend for the `baktiudara.com` domain (Resend-managed DNS
  records).
- Custom return-path and bounce/complaint webhooks (Resend → Cloud Function → `audit_log`).

### 6.3 Trigger Pattern

- Most emails are fired by **callable** `sendEmail` from the UI flow.
- Time-based flows (e.g. pickup reminder) use a **scheduled function** (Cloud Scheduler →
  Pub/Sub → 2nd-gen function) that scans `purchase_order` and calls `sendEmail` per recipient.

## 7. Notifications

`NotificationBell` becomes live: `onRFQCreate` / status-change triggers write to
`notifications/{uid}` and optionally push via **Firebase Cloud Messaging (FCM)**.

## 8. Regions & Naming

- Deploy to `asia-southeast1` (Singapore) — close to operations.
- Function naming: kebab-case; 2nd gen `service` labels per module (rfq, quotation, po, email).

## 9. Security & Ops

- All functions **require `req.auth`**; enforce RBAC via custom claims.
- Secrets (Resend `RESEND_API_KEY`, DB password, OAuth client) in **Secret Manager**, referenced
  by functions via `defineSecret`.
- Logs → Cloud Logging; errors → Error Reporting; metrics → Cloud Monitoring.
- IAM: least-privilege service account for Functions; **Serverless VPC Connector** for Cloud SQL.
- Backup: Cloud SQL automated backups + PITR; weekly export to GCS.

## 10. Migration from Phase 1

1. Implement Auth + claims; wire `LoginPage` to Firebase Auth.
2. Stand up the Postgres schema from the Data Model.
3. Port `useLocalStorage` composables to a `useApi` layer calling Cloud Functions.
4. Move mock attachments to Cloud Storage signed URLs.
5. Enable email triggers + notifications.
6. Run against **Emulator Suite** locally, then deploy to a staging project.

## 11. Open Questions for Client

- Single Firebase project or separate dev/staging/prod projects?
- Customer/OEM-facing portals in Phase 4 (affects data isolation model)?
- `baktiudara.com` domain access in Resend to wire SPF/DKIM/DMARC.
- Backup / DR retention targets for Cloud SQL.
