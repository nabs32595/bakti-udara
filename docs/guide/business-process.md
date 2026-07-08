# Business Process

This chapter maps the domain workflow from the **Quality Manual (QM-01)** — *Sales & Order
Processing* procedure — onto the screens implemented in the Phase 1 mockup.

## Actors

| Code | Role | Responsibility in this system |
|------|------|-------------------------------|
| `GM` | General Manager | Approvals / oversight. |
| `ADM` | Admin | Record keeping, user & role administration. |
| `OPT` | Operation | Day-to-day execution: receive RFQ, review, quote, process PO, monitor delivery. |
| **OEM Customer** | Interested party | Raises RFQ, issues PO, receives quotation & goods. |
| **OEM** | Supplier | Provides quotation & order confirmation, delivers goods. |

## End-to-End Flow

```text
OEM Customer          OPT (Bakti Udara)            OEM (Supplier)
     │                       │                          │
     │  1. RFQ (email/sys)   │                          │
     ├──────────────────────>│                          │
     │                       │ 2. Review RFQ            │
     │                       │ 3. Resolve discrepancies │
     │                       │ 4. Forward RFQ ──────────>│
     │                       │                          │ 5. OEM quotation
     │                       │<─────────────────────────│
     │                       │ 6. Review quotation      │
     │ 7. Quotation ─────────>│  (match vs RFQ)         │
     │                       │                          │
     │  8. PO (email)        │                          │
     ├──────────────────────>│                          │
     │                       │ 9. Review PO             │
     │                       │10. Forward PO ──────────>│
     │                       │                          │11. Order confirmation
     │ 12. Order conf. ──────>│<────────────────────────│
     │                       │13. Monitor delivery (EDD)│
     │14. Ready for pickup ──>│                          │
     │                       │15. Delivery notice ──────│
     │                       │16. Invoicing             │
```

## Procedure Detail (QM-01)

### 6.1 Enquiry (RFQ) — Spares

1. `OPT` monitors and receives the RFQ from the interested party via email or system.
2. `OPT` reviews the RFQ for clear information.
3. If discrepancies exist, `OPT` informs the interested party for amendment.
4. If clear, `OPT` emails the RFQ to the OEM.
5. `OPT` reviews the OEM quotation to ensure it matches the RFQ.
6. If discrepancies, `OPT` informs the OEM for amendment.
7. If clear, `OPT` emails / uploads the quotation into the interested party's system.

### 6.2 Order Processing

1. `OPT` receives PO-readiness notification from the interested party via email.
2. `OPT` collects and reviews the PO.
3. If discrepancies, `OPT` informs the interested party for amendment.
4. If clear, `OPT` emails the PO to the OEM.
5. `OPT` receives order confirmation from the OEM.
6. `OPT` forwards the order confirmation to the interested party.
7. `OPT` monitors spares delivery per the delivery terms on the order confirmation.
8. `OPT` notifies the interested party of consignment readiness for pickup (email).
9. `OPT` receives delivery notification from OEM (email).
10. `OPT` proceeds to invoicing.

## Domain Concepts

### RFQ Numbering

RFQ numbers embed structured metadata, e.g. `SPQM50-04012024-0001-NORMAL`. The mockup preserves
the full string (including slashes) in the route via a catch-all param
(`/rfq/:rfqNo(.*)`), so references are never truncated.

### AES Classification

Parts are classified **AES A** or **AES E**. The dashboard and lists surface this so the team can
prioritise high-criticality (A) components.

### Quotation Validity

Each quotation carries an `offerDate` and `validityDate`. The UI computes `daysRemaining` and a
`validityStatus` (e.g. *Expired* / *Offer Expired*) to flag risk before committing a PO.

### Delivery Lead Time (EDD)

Purchase-order lines track an `expectedDeliveryDate` (EDD), an optional `revisedDate`, and a
`daysDelta` vs. the committed date. The `deliveryStatus` (e.g. *REVISE EDD*) highlights slippage.

## Module ↔ Procedure Mapping

| QM-01 Step | System Module | Status in Phase 1 |
|------------|---------------|-------------------|
| 6.1.1–6.1.4 Receive & review RFQ | RFQ (list / create / details) | ✅ UI |
| 6.1.5–6.1.7 OEM quotation & send | Quotation (list / create / details) | ✅ UI |
| 6.2.1–6.2.6 PO & order confirmation | Purchase Order | ✅ UI |
| 6.2.7–6.2.9 Delivery monitoring | Deliveries | ✅ UI |
| 6.2.10 Invoicing | (future) | ❌ |
| Collaboration / audit | Collaborators, Status Timeline, Edit trail | ✅ UI |
