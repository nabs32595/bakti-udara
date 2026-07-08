# Integrated Company Portal

<div style="text-align:center; padding: 1rem 0 2rem;">
  <p style="font-size:1.25rem; opacity:0.75; margin:0;">Bakti Udara Sdn Bhd</p>
  <h1 style="margin:0.5rem 0;">From Spreadsheets to Systems.</h1>
  <p style="font-size:1.1rem; opacity:0.75; max-width:42rem; margin:0 auto;">
    One platform for procurement, repairs, documents & customer tracking —
    built around the way your team actually works.
  </p>
</div>

---

## At a Glance

| **12 Months** Total | **6 Months** Development | **6 Months** Support | **7 Core Modules** |
|---|---|---|---|

---

## The Problem Today

::: info Aircraft parts logistics running on **WhatsApp, email threads and Excel**.
:::

- Manual tracking causes missed deadlines.
- No transparency between customers and ops.
- Concurrent edits = overwritten work.
- Critical dates slip through the cracks.

---

## What Changes

::: tip One source of truth. Real-time visibility. Zero lost updates.
:::

- Every order, repair and document in one place.
- Customers and operators see the same status — instantly.
- Two people can edit the same record safely.
- The system watches your deadlines so you don't have to.

---

## What's Inside

### Core Modules

| | Module | What it does |
|---|---|---|
| **A** | **Authentication & RBAC** | MFA login, role-based access for Customer / Operator / Admin, audit log. |
| **B** | **Procurement Operations** | Purchasing & return/repair workflows, document management, real-time tracking. |
| **C** | **Document Repository** | Upload, tag, version, search — synced with your Synology NAS. |
| **D** | **Email Integration & Tracker** | Auto-emails on workflow updates + inbox doc detection linked to orders. |
| **E** | **Dashboard & Analytics** | Role-based dashboards with charts and KPIs. |
| **F** | **Reporting System** | One-click export to PDF, Excel, CSV. |
| **G** | **Internal Notifications** | In-app notification center with read/unread state. |

---

## The Two Things You Asked Us To Solve

### 1. Concurrent Editing — Without The Chaos

::: warning **Today's reality:** Two people open the same document. One saves last and wipes the other's changes.
:::

**Our fix — Branching Snapshot:**

1. User A opens the doc → **Snapshot A** is created.
2. User B opens the same doc → **Snapshot B** is created.
3. Both edit freely — no blocking.
4. On save, the system compares both snapshots with the database.
5. Conflicts? They're highlighted side-by-side in a merge screen.
6. User picks the final version → everything is logged.

> **Result:** No more lost edits. No more "who overwrote what?"

### 2. Due Dates That Track Themselves

::: warning **Today's reality:** Someone has a spreadsheet of "things expiring." It gets forgotten.
:::

**Our fix — Intelligent Cron Tracker:**

The system scans every record **daily** and fires a tiered email schedule:

| When | What |
|---|---|
| **30 days out** | Friendly first reminder |
| **14 days out** | Second nudge |
| **7 days out** | Urgent alert |
| **Day-of expiry** | Immediate action list |
| **Post-expiry** | Auto-trigger renewal workflow |

Tracks: quotation expiry · repair delivery · PO validity · document renewals.

> **Result:** Zero manual tracking. Zero missed renewals. Full audit trail.

---

## Technology Stack

Simple. Modern. Battle-tested.

<table>
<tr>
<td width="33%" valign="top">

### Frontend

- **Vue 3** — Composition API
- **TypeScript**
- **Vite** — dev & build
- **Tailwind CSS 4**
- **shadcn-vue** (Reka UI)
- **Vue Router**
- **Vee-Validate + Zod**

</td>
<td width="33%" valign="top">

### Backend

- **Node.js 20** + **TypeScript**
- **Firebase Auth** — Google OAuth + magic link
- **Cloud Functions** (2nd gen)
- **PostgreSQL** — relational store
- **Redis** — sessions & real-time
- **REST API**
- **FCM** — push notifications

</td>
<td width="33%" valign="top">

### Deployment

- **Docker** + docker-compose
- **AWS / Azure / GCP** (cloud-agnostic)
- **Synology NAS** — RAID + versioning
- **Auto-scaling** + load balancing
- **Daily backups** (30-day retention)
- **99.9% uptime** SLA target
- **CI/CD** via GitHub Actions

</td>
</tr>
</table>

---

## 6-Month Roadmap

```text
M1–2  Foundation          ████████  Auth · DB · Cloud · Schema
M3–4  Core Modules        ████████  Procurement · Repairs · Docs · Email
M4–5  Smart Features      ████████  Branching · Cron · Tracker · Notifications
M6    Test & Go-Live      ████████  UAT · Training · Production deploy
```

**After launch:** 6 months of included maintenance — 24/7 monitoring, bug fixes, security patches, up to **40 hrs/month** of support.

---

## The Team Behind It

**Nabs Digital Services** — led by Nabil, covering project management, full-stack
development, deployment and ongoing support.

**How we stay in sync:** bi-weekly progress calls · monthly demos · dedicated Telegram channel.

---

## Ready When You Are

::: tip Next step: pick your engagement model and we'll sign and start.
:::

- **Option A — One-Off Build** → full delivery, source code transferred on final payment.
- **Option B — Monthly Retainer** → RM 3,000/month, 4 hrs/day, 12-month minimum.

See **[Pricing & Engagement](/proposal/pricing)** for the full breakdown.

---

<div style="text-align:center; padding: 2rem 0; opacity:0.7;">
  <p style="margin:0;"><strong>Nabs Digital</strong></p>
  <p style="margin:0;">Nabil Khalid Alkaff · nabil.k.alkaff@gmail.com · 017-3432595</p>
</div>