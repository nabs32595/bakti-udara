# Project Overview

## Background

Bakti Udara operates in the aviation **spare-parts trading** domain. Its operations team
("Operation" / `OPT`) coordinates the flow of spare parts between two external parties:

| Party | Role in the workflow |
|-------|----------------------|
| **OEM Customer** (interested party) | Airline / MRO that issues the enquiry and the purchase order, and ultimately pays. |
| **OEM Supplier** (OEM) | Manufacturer that supplies the quoted parts. |

The operational process is governed by the company **Quality Manual (QM-01)**, specifically the
*Sales & Order Processing* procedure (`FE/doc/sale.txt`). The Phase 1 mockup is a faithful,
UI-level representation of that procedure.

## The Problem

Today the process is manual and document-heavy (email + spreadsheets). Pain points include:

- No single source of truth for the status of an RFQ / Quotation / PO.
- Discrepancies between customer RFQ, OEM quotation and customer PO are caught late.
- Delivery lead-times (EDD) are tracked manually, making slippage hard to see.
- Audit trail (who edited what, when) is not captured.

## Goals of the System

1. **Digitise the sales pipeline** so every RFQ → Quotation → PO → Delivery is trackable.
2. **Enforce the QM-01 procedure** (review → discrepancy handling → approval → forwarding).
3. **Surface status & risk** (validity expiry, EDD slippage, AES classification) on a dashboard.
4. **Collaborate** by assigning collaborators and keeping an edit/status audit trail.

## Current Status — Phase 1

| Aspect | State in Phase 1 |
|--------|------------------|
| Frontend | ✅ Built (Vue 3 + TypeScript + Vite) |
| Workflow UI | ✅ RFQ, Quotation, PO, Delivery, Email, Roles, Dashboard |
| Data layer | 🟡 Mock data in `localStorage` (no backend) |
| Authentication | 🟡 UI-only (login screen, no real auth) |
| Authorisation | 🟡 Roles & permissions screen (static) |
| Email integration | 🟡 Templates & settings UI (no live send) |
| Backend / DB | ❌ Not started (see [Roadmap](/proposal/roadmap)) |

## Repository Layout

```text
bakti-udara/
├── docs/                 # This VitePress documentation site
├── FE/                   # Phase 1 frontend (Vue 3 + Vite)
│   ├── src/
│   │   ├── components/   # layouts, ui (shadcn-vue), module & detail components
│   │   ├── pages/        # Route pages (RFQ, Quotation, PO, Delivery, Email, Roles…)
│   │   ├── data/mockData/# Mock datasets used by the prototype
│   │   ├── composables/  # useLocalStorage and other helpers
│   │   ├── router/       # Vue Router configuration
│   │   └── lib/          # Utilities (e.g. cn class merge)
│   └── doc/sale.txt      # Source QM-01 sales procedure
└── netlify.toml          # Build config (currently builds FE)
```

## Next

- Read the [Business Process](/guide/business-process) to understand the domain flow.
- Read the [System Architecture](/guide/architecture) for the technical stack and structure.
