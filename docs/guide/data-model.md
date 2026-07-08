# Data Model

Phase 1 uses static mock datasets in `FE/src/data/mockData/*.js`. These shapes are the
**contract** the future backend API should fulfil. Field names below follow the current mock data.

## RFQ (`requestForQuotation.js`)

```ts
interface RFQ {
  no: number
  desc: string                 // e.g. "PANEL ASSY, FLOOR, LH"
  referenceNo: string          // e.g. "04"
  rfqNo: string                // e.g. "SPQM50-04012024-0001-NORMAL"
  pno: string                  // part number
  aes: 'A' | 'E'
  quantity: number
  status: RFQStatus            // Created | Under Review | Sent to OEM | Quoted | …
  date: string                 // display date
  timestamp: number
  lastEditedBy: { name: string; initials: string; timestamp: string }
  statusTimeline: { status: string; timestamp: string }[]
  collaborators: { id: string; name: string; email: string; initials: string; addedAt: string }[]
  documents: { id: number; name: string; type: string; size: string; uploadDate: string; url: string }[]
}
```

## Quotation (`quotations.js`)

```ts
interface Quotation {
  no: number
  quotationNo: string          // e.g. "20081072"
  referenceNo: string
  offerDate: string
  validityDate: string
  validityStatus: string       // Expired | …
  daysRemaining: number
  currency: string             // e.g. "CHF"
  totalAmount: number
  rfqNo: string                // header compatibility (first line item's RFQ)
  lineItems: QuotationLineItem[]
  lastEditedBy: { name: string; initials: string; timestamp: string }
  statusTimeline: { status: string; timestamp: string }[]
}

interface QuotationLineItem {
  no: number
  rfqNo: string                // links back to the source RFQ
  desc: string
  pno: string
  aes: 'A' | 'E'
  quantity: number
  unitOfMeasure: string        // e.g. "EA"
  unitPrice: number
  totalPrice: number
  tat: number                  // turn-around time (days)
}
```

## Purchase Order (`purchaseOrders.js`)

```ts
interface PurchaseOrder {
  no: number
  id: string                   // composite key
  desc: string
  rfqNo: string
  pno: string
  aes: 'A' | 'E'
  quantity: number
  quotationNo: string          // links to the source quotation
  offerDate: string
  validityDate: string
  tat: number
  daysRemaining: number
  validityStatus: string
  poReference: string          // e.g. "MA070324-00186L1534-M2"
  poDate: string
  lineNo: number
  totalPrice: number
  expectedDeliveryDate: string // EDD
  revisedDate: string | null
  daysDelta: number            // EDD vs committed
  deliveryStatus: string       // e.g. "REVISE EDD"
  poNumber: string | null
  actualDeliveryDate: string | null
  lastEditedBy: { name: string; initials: string; timestamp: string }
}
```

## Supporting Entities

| Entity | Source | Purpose |
|--------|--------|---------|
| `User` | `rfqDetails.js` (`INITIAL_AVAILABLE_USERS`) | `{ id, name, email }` for collaborators |
| `Role` | `roles.js` | RBAC roles & permission matrix |
| `EmailTemplate` | `emailTemplates.js` | Reusable correspondence templates |
| `EmailSettings` | `emailSettings.js` | Mail account / signature config |
| `Notification` | `notifications.js` | In-app notification feed |

## Entity Relationships

```text
RFQ (1) ──< (many) QuotationLineItem >── (1) Quotation
Quotation (1) ──< (many) PO line items >── (1) PurchaseOrder
PurchaseOrder ──> Delivery (EDD / actualDeliveryDate)
User (many) ──< collaborates on >── RFQ / Quotation / PO
```

Key linkage fields: `rfqNo` (RFQ ↔ Quotation line), `quotationNo` (Quotation ↔ PO).

## Notes for the Backend Team

- `rfqNo` may contain slashes — store as a string key, never parse as a path.
- Monetary values are `number` here; the API should return decimals/strings to avoid float drift.
- `timestamp` is epoch ms; the API should return ISO-8601 and let the client format.
- `status` / `validityStatus` / `deliveryStatus` are free-text in the mock — should become
  **enums** with a defined state machine in the backend.
