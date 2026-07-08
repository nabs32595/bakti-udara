# Module Breakdown

What is implemented and demoable in the Phase 1 mockup.

## Dashboard

- KPI cards: Total RFQs, Under Review, Sent to OEM, Quoted.
- **AES Distribution** (A vs E) and **Status Overview** breakdowns.
- **Recent RFQs** list with status + AES badges; links into RFQ details.
- Metrics and recent items are driven by mock data persisted via `useLocalStorage`.

## RFQ (Request for Quotation)

- **List** (`RFQListPage`): searchable/filterable table of enquiries.
- **Create** (`RFQCreatePage`): form for a new RFQ (description, P/N, AES, quantity, documents).
- **Details** (`EntityDetailsPage`): full RFQ view with:
  - `DetailHeader` (reference, status, AES)
  - `DocumentSection` (attached specs/drawings)
  - `CollaboratorsSection` + `AddCollaboratorDialog` (assign team members)
  - `StatusTimeline` (audit trail of status changes)
  - `ConflictResolutionDialog` (discrepancy handling, per QM-01 6.1.3 / 6.2.3)

## Quotation

- **List** (`QuotationsListPage`): quotations with validity status & days remaining.
- **Create** (`QuotationCreatePage`): builds a quotation from one or more RFQ line items.
- **Details**: `QuotationBasicInfo`, `QuotationLineItems` (per-line `rfqNo`, P/N, qty, unit price,
  TAT), `QuotationActions`. One quotation can group many RFQs.

## Purchase Order (PO)

- **List** (`PurchaseOrdersListPage`): PO lines with EDD, revised date, `daysDelta`, delivery status.
- **Create** (`PurchaseOrderCreatePage`): converts a quotation into a PO.
- **Details**: `POBasicInfo`, `POLineItemsTable`, `POActions`. Tracks `poReference`, `poDate`,
  `poNumber`, `expectedDeliveryDate`, `actualDeliveryDate`.

## Deliveries

- `DeliveriesPage`: monitors spares delivery against committed lead times; surfaces
  *REVISE EDD* / slippage states from the PO dataset.

## Email

- `EmailPage` + `EmailTemplates` + `EmailSettings`: centre for customer/supplier correspondence
  (RFQ forwarding, quotation send, PO forwarding, pickup & delivery notices per QM-01).
- UI-only in Phase 1 — no live mail send.

## Roles & Permissions

- `RolesPage`: RBAC model (GM / ADM / OPT and custom roles) and permission matrix.
- Static in Phase 1; becomes enforced once authentication lands.

## Authentication (UI)

- `LoginPage` / `LoginForm`: login screen with Google OAuth and passwordless (magic-link) options.
- Route protection redirects unauthenticated users to `/login`. No real session in Phase 1.

## Notifications

- `NotificationBell`: in-app notifications (e.g. discrepancies, PO readiness, delivery notices).

## Module Summary

| Module | List | Create | Details | Notes |
|--------|:----:|:------:|:-------:|-------|
| Dashboard | ✅ | — | — | KPIs + recent RFQs |
| RFQ | ✅ | ✅ | ✅ | Docs, collaborators, timeline, conflict dialog |
| Quotation | ✅ | ✅ | ✅ | Multi-RFQ line items, validity |
| PO | ✅ | ✅ | ✅ | EDD / delivery tracking |
| Deliveries | ✅ | — | — | Slippage monitoring |
| Email | ✅ | — | — | Templates + settings (UI only) |
| Roles | ✅ | — | — | Permission matrix (static) |
| Auth | ✅ | — | — | UI only |
| Notifications | ✅ | — | — | Bell + dropdown |
