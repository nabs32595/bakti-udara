# Roadmap & Phasing

A phased delivery plan taking Bakti Udara from the Phase 1 mockup to a production system.

## Phase Overview

```text
Phase 1  Frontend Mockup        ████████ (done)
Phase 2  Backend + Database     ░░░░░░░░ (proposed)
Phase 3  Auth, RBAC, Email      ░░░░░░░░ (proposed)
Phase 4  Integrations + BI      ░░░░░░░░ (proposed)
Phase 5  Hardening + Go-live    ░░░░░░░░ (proposed)
```

---

## Phase 1 — Frontend Mockup ✅

**Goal:** Validate UX and lock the data contract.

- Vue 3 + TS + Vite SPA; shadcn-vue UI; Tailwind 4.
- Modules: Dashboard, RFQ, Quotation, PO, Deliveries, Email, Roles, Auth UI.
- Mock data via `useLocalStorage`; `EntityDetailsPage` shared across entities.
- **Exit criteria:** Client sign-off (see [Client Proposal](/proposal/client-proposal)).

---

## Phase 2 — Backend API + Database (recommended next)

**Goal:** Make the system persistent and multi-user.

> Detailed design: [Backend Tech Spec — Firebase Auth & Cloud Functions](/guide/tech-spec).

- **Identity:** Firebase Authentication (Google OAuth + passwordless magic link).
- **API:** Google Cloud Functions (2nd gen, TypeScript) callable/HTTP functions.
- **Database:** **PostgreSQL on Cloud SQL** — schema derived from the [Data Model](/guide/data-model).
  - Normalise RFQ / Quotation / PO and their line items; enforce FKs (`rfqNo`, `quotationNo`).
  - Replace free-text statuses with **enums + state machine**.
  - Money as `NUMERIC(14,2)`; timestamps as `TIMESTAMPTZ` (ISO-8601 to client).
- **API:** Callable/HTTP functions; a thin service layer that swaps in behind the existing composables, so **UI changes are minimal**.
- **File storage:** **Google Cloud Storage** bucket with signed-URL uploads (replaces `#` URLs).
- **Audit:** Server-side event log backing the status timeline / edit trail.
- **Validation:** Reuse the existing **zod** schemas server-side (or share via a contract repo).

**Dependencies:** Phase 1 sign-off, cloud environment access.

---

## Phase 3 — Authentication, RBAC & Email Automation

**Goal:** Secure the system and automate QM-01 correspondence.

- **Auth:** Firebase Auth (Google OAuth + passwordless magic link) replacing the UI-only screen.
  ID-token bearer auth, route guards wired to the server.
- **RBAC:** Firebase Auth **custom claims** (`role`) enforce the `RolesPage` matrix
  (GM / ADM / OPT + custom) inside Cloud Functions.
- **Email:** Cloud Functions send live QM-01 correspondence (RFQ/Quotation/PO forward, pickup &
  delivery notices) via `EmailTemplates` + `EmailSettings` + **Resend**.
- **Notifications:** **Firebase Cloud Messaging (FCM)** for in-app and push notifications
  wired to the `NotificationBell`.
- **Notifications:** Push real events into the `NotificationBell` feed.

**Dependencies:** Phase 2 API + user store.

---

## Phase 4 — Integrations & Business Intelligence

**Goal:** Connect external parties and surface insight.

- **OEM / customer integrations:** Inbound RFQ and outbound PO via API/EDI where available.
- **Dashboards:** Server-computed KPIs (currently static mock metrics) + trend analytics.
- **Reporting:** Overdue EDD, expired quotations, discrepancy rate — operational dashboards.
- **Search & audit:** Full-text search across RFQ/Quotation/PO; exportable audit trail.

**Dependencies:** Phase 3 auth + persisted history.

---

## Phase 5 — Hardening & Go-live

**Goal:** Production readiness.

- Security review, pen-test, secrets management, rate limiting.
- Observability: logging, metrics, error tracking.
- Backups, DR, data-retention aligned to QM-01.
- CI/CD, environment promotion (dev → staging → prod), SLA definition.
- User training & handover.

---

## Suggested Timeline (indicative)

| Phase | Est. duration* | Parallelisable |
|-------|----------------|----------------|
| Phase 2 | 6–8 weeks | — |
| Phase 3 | 4–6 weeks | with Phase 2 hardening |
| Phase 4 | 4–6 weeks | after Phase 3 |
| Phase 5 | 2–4 weeks | after Phase 4 |

\* Subject to confirmed scope, team size and environment readiness.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Status fields are free-text in mock | Define enums + state machine in Phase 2 |
| Float money in mock data | Use `numeric`/decimal types from day one |
| `rfqNo` contains slashes | Treat as opaque string key; already handled in router |
| Scope creep before sign-off | Fix Phase 2 scope on Phase 1 acceptance |

## Decision Needed from Client

1. Approve Phase 1 and confirm branding/role model.
2. Choose engagement model (fixed-phase / T&M / milestone) — see proposal §5.
3. Provide cloud/environment details to start Phase 2.
