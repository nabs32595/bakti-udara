# Client Proposal & Scope

**Prepared by:** Engineering & Product (Bakti Udara digitalisation)
**Subject:** Spares Trading Platform — Phase 1 deliverable & forward plan
**Status:** Proposal for client review

## 1. Executive Summary

We have delivered **Phase 1: a fully interactive frontend mockup** of the Bakti Udara spares
trading platform. It demonstrates the complete sales pipeline — from customer **RFQ** through
**Quotation**, **Purchase Order**, **Delivery** monitoring, to **Invoicing** readiness — exactly
as described in your Quality Manual (QM-01).

The mockup lets stakeholders **click through the real workflow**, validate the screens, and
confirm the data captured at each step, **before** any backend investment is made. This de-risks
the build and aligns the team on scope.

This document proposes the **scope, phasing and commercial framing** to take the system from
mockup to production.

## 2. What Phase 1 Delivers (now)

| Deliverable | Detail |
|-------------|--------|
| Clickable prototype | All core modules: Dashboard, RFQ, Quotation, PO, Deliveries, Email, Roles, Auth UI. |
| Realistic data | Mock datasets persisted in-browser, so the demo feels live. |
| Process fidelity | Implements QM-01 Sales & Order Processing steps 6.1–6.2. |
| Modern UI | Vue 3 + TypeScript + Tailwind + shadcn-vue; responsive & accessible. |
| Documentation | This technical site + data-model contract for the backend. |

**Out of scope for Phase 1:** real authentication, database, server-side business logic, live
email, and deployment.

## 3. Proposed Phases

| Phase | Focus | Outcome |
|-------|-------|---------|
| **Phase 1** (done) | Frontend mockup | Validated UX & data contract |
| **Phase 2** | Backend API + database | Persistent, multi-user system |
| **Phase 3** | Auth & RBAC + Email automation | Secure, automated workflow |
| **Phase 4** | Integrations & analytics | OEM/customer feeds, reporting |
| **Phase 5** | Hardening, audit & go-live | Production readiness |

See [Roadmap & Phasing](/proposal/roadmap) for the detailed breakdown, dependencies and
suggested timeline.

## 4. Scope of Work (recommended next — Phase 2)

1. **Relational data store** (PostgreSQL) modelled on the [Data Model](/guide/data-model).
2. **REST/GraphQL API** replacing the `localStorage` composable layer (UI unchanged).
3. **Status state machine** turning free-text statuses into enforced enums.
4. **File storage** for RFQ/Quotation/PO attachments (Google Cloud Storage).
5. **Audit logging** formalising the existing status-timeline / edit-trail.

## 5. Assumptions

- Client provides access to (or sign-off on) the target cloud environment for Phase 2+.
- QM-01 procedure (enquiry → order processing) remains the governing process.
- Initial users are internal (OPT / ADM / GM); customer/OEM portals are a later phase.
- Branding (logo, colour scheme) to be supplied; mockup currently uses a neutral palette.

## 6. Commercial Framing (indicative)

| Option | Description | Best when |
|--------|-------------|-----------|
| **Fixed-phase** | Agree Phase 2 scope & price up front | Scope is clear after this mockup |
| **Time & materials** | Monthly capacity on the roadmap | Evolving requirements |
| **Milestone** | Pay per accepted milestone | Need tight budget control |

We recommend a **fixed-price Phase 2** once the client signs off on this mockup, since the data
contract is now explicit.

## 7. Acceptance Criteria for Phase 1 Sign-off

- [ ] Client reviews the live mockup end-to-end.
- [ ] All QM-01 steps 6.1–6.2 are represented on screen.
- [ ] Data captured at each step matches the agreed [Data Model](/guide/data-model).
- [ ] Branding & role model confirmed.
- [ ] Phase 2 scope & engagement model agreed.

## 8. Next Step

Confirm Phase 1 acceptance and select an engagement model for **Phase 2**. We will then produce a
detailed Phase 2 estimate and technical plan.

> Reference quotation: [`/bakti-udara-quotation.pdf`](/bakti-udara-quotation.pdf)
