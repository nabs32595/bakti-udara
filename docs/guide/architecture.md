# System Architecture

## Technology Stack

The frontend is a modern **Vue 3** single-page application, built with **Vite 7** and **TypeScript**.

| Concern | Choice | Notes |
|---------|--------|-------|
| Framework | Vue 3.5 (`<script setup>` Composition API) | |
| Language | TypeScript 5.9 | Strict typing across the app |
| Build tool | Vite 7.1 | HMR, alias resolution |
| Styling | Tailwind CSS 4.1 (`@tailwindcss/vite`) | Utility-first, CSS variables |
| UI kit | shadcn-vue (New York style) | Copied-in components under `src/components/ui` |
| Primitives | reka-ui 2.6 | Accessible dialog / sheet / navigation |
| Forms | vee-validate 4 + zod 3 (`@vee-validate/zod`) | Schema validation |
| Icons | lucide-vue-next | |
| Routing | vue-router 4.6 (`createWebHistory`) | |
| Utilities | class-variance-authority, clsx, tailwind-merge | Variant + class merging (`cn`) |
| State (Phase 1) | `useLocalStorage` composable | Mock data persisted in browser |
| Helpers | @vueuse/core | `useLocalStorage` etc. |

## Design System

- **shadcn-vue** components are vendored into the repo (`src/components/ui/*`), so they can be
  customised without fighting an external dependency.
- **Tailwind 4** with CSS variables and `baseColor: neutral`; `cssVariables: true`.
- The mockup currently uses a **greyscale** palette (no brand colour yet) — easy to re-theme.

## Project Structure

```text
FE/src/
├── App.vue                      # Root: picks Auth vs Dashboard layout
├── main.ts                      # App bootstrap
├── assets/                      # Static assets (vue.svg)
├── components/
│   ├── layouts/                 # AuthLayout, DashboardLayout
│   ├── ui/                      # shadcn-vue primitives (button, card, dialog, …)
│   ├── details/                 # DetailPageLayout, StatusTimeline, Collaborators, …
│   ├── modules/
│   │   ├── po/                  # POBasicInfo, POLineItemsTable, POActions
│   │   ├── quotation/           # QuotationBasicInfo, QuotationLineItems, …
│   │   └── rfq/                 # RFQBasicInfo, RFQActions
│   ├── NotificationBell.vue
│   └── ConflictResolutionDialog.vue
├── pages/                       # Route-level views
│   ├── login/                   # LoginPage, LoginForm
│   ├── email/                   # EmailPage, EmailTemplates, EmailSettings
│   ├── DashboardPage.vue
│   ├── RFQListPage / RFQCreatePage
│   ├── QuotationsListPage / QuotationCreatePage
│   ├── PurchaseOrdersListPage / PurchaseOrderCreatePage
│   ├── EntityDetailsPage.vue    # Shared detail view for RFQ/Quotation/PO
│   ├── DeliveriesPage.vue
│   └── RolesPage.vue
├── router/index.ts              # Route table
├── data/mockData/               # Static datasets (see Data Model)
├── composables/useLocalStorage.ts
└── lib/utils.ts                 # cn() class merge
```

## Routing

`vue-router` uses history mode. Key routes (from `router/index.ts`):

| Path | View |
|------|------|
| `/login` | LoginPage |
| `/` | DashboardPage |
| `/request-for-quotation` · `/create` | RFQ list / create |
| `/rfq/:rfqNo(.*)` | RFQ details (catch-all for slashed IDs) |
| `/quotations` · `/create` · `/quotations/:quotationNo` | Quotation list / create / details |
| `/purchase-orders` · `/create` · `/purchase-orders/:poReference` | PO list / create / details |
| `/deliveries` | Deliveries |
| `/roles` | Roles & Permissions |
| `/email` | Email centre |

`EntityDetailsPage` is a **single reusable detail component** parametrised by entity type —
RFQ, Quotation and PO all share it, keeping the three modules consistent.

## State Management (Phase 1)

There is **no central store** yet. Each page reads/writes its mock dataset through the
`useLocalStorage` composable, which hydrates from a static `INITIAL_*` export on first load and
persists edits to `localStorage`. This makes the prototype feel real (edits survive refresh)
without a backend.

```ts
// composables/useLocalStorage.ts (concept)
const recentRFQs = useLocalStorage('recentRFQs', INITIAL_RECENT_RFQS)
```

## Build & Deployment (current)

`netlify.toml` builds the frontend:

```toml
[build]
  base = "FE"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

The SPA fallback rewrite ensures `vue-router` deep links resolve on refresh.

## Architecture for Phase 2+

When the backend lands, the `useLocalStorage` layer becomes an **API client** boundary:

```text
Pages ──> composables (data access) ──> [Phase 1: localStorage]  ▒  [Phase 2+: REST/GraphQL API]
                                            mockData/*                ──> Backend ──> DB
```

Swapping the data source behind the composables keeps the UI unchanged — the mockup is built so
the service layer is the only thing that must be replaced.
