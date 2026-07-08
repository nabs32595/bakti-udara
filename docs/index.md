---
layout: home

hero:
  name: "Bakti Udara"
  text: "Spares Trading Platform"
  tagline: Technical documentation & client proposal for the aviation spare-parts trading system.
  actions:
    - theme: brand
      text: Project Overview
      link: /guide/overview
    - theme: alt
      text: Proposal
      link: /proposal/project-proposal
    - theme: alt
      text: Pricing
      link: /proposal/pricing
    - theme: alt
      text: Client Proposal
      link: /proposal/client-proposal

features:
  - title: Phase 1 — Frontend Mockup
    details: A production-grade, clickable UI prototype built with Vue 3 + TypeScript, demonstrating the full RFQ → Quotation → PO → Delivery → Invoice workflow.
    icon: 🧪
  - title: Standards-Aligned Process
    details: Implements the Sales & Order Processing procedure defined in the Quality Manual (QM-01) — enquiry handling, OEM quotation review, PO processing and delivery monitoring.
    icon: 📑
  - title: Roadmap to Production
    details: A phased plan covering backend API, relational data store, authentication/RBAC, email automation and deployment — detailed in the client proposal.
    icon: 🚀
---

## What is Bakti Udara?

Bakti Udara is an aviation **spare-parts trading** operation. The business sits between
**OEM customers** (airlines / MROs who need parts) and **OEM suppliers** (manufacturers who
provide them). The core value chain is:

1. Receive a spare-parts enquiry (**RFQ**) from a customer.
2. Source a price from the supplier and produce a **Quotation**.
3. Receive a **Purchase Order (PO)** from the customer and forward it to the supplier.
4. Monitor **Delivery** against the agreed lead time.
5. **Invoice** the customer once goods are ready.

This documentation site serves three audiences:

- **Engineering & Product** — the [technical documentation](/guide/overview) describing the
  architecture, modules and data model of the Phase 1 mockup.
- **Client / Stakeholders** — the [project proposal](/proposal/project-proposal) and
  [pricing & engagement models](/proposal/pricing) for the full Integrated Portal.
- **Internal reference** — the [client proposal](/proposal/client-proposal) capturing scope and
  phasing of the Phase 1 mockup.

> [!NOTE]
> The current deliverable (**Phase 1**) is a **frontend mockup**. It uses realistic mock data
> persisted in the browser so the workflow can be demoed end-to-end without a backend.
