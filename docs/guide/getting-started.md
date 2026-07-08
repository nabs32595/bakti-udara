# Getting Started

## Prerequisites

- **Node.js** 20+ (Vite 7 requires Node 20.19+ / 22.12+).
- **npm** (or pnpm — both lockfiles exist in `FE/`).

## Run the Frontend (Phase 1 mockup)

```bash
# from repo root
cd FE
npm install        # or: pnpm install
npm run dev        # start Vite dev server
```

The app is served at `http://localhost:5173`.

### Build & preview

```bash
npm run build      # outputs to FE/dist
npm run preview    # serve the production build locally
```

## Run This Documentation Site (VitePress)

```bash
# from repo root
npm install        # installs vitepress (root devDependency)
npm run docs:dev    # http://localhost:5173 (VitePress default) — see terminal for port
npm run docs:build  # outputs to docs/.vitepress/dist
npm run docs:preview
```

> The root `package.json` only manages the docs site. The application itself lives in `FE/`.

## Demo Walkthrough

1. Open `/login` → use the UI login (no real credentials required in Phase 1).
2. Land on the **Dashboard** — review KPIs and recent RFQs.
3. Create an **RFQ**, attach a document, add a **collaborator**, advance its **status**.
4. Create a **Quotation** referencing that RFQ; add line items and a validity window.
5. Create a **Purchase Order** from the quotation; set PO reference and EDD.
6. Open **Deliveries** to see lead-time / slippage tracking.
7. Refresh the page — your edits persist via `localStorage`.

## Project Conventions

- Path alias `@` → `FE/src` (see `vite.config.js`).
- Components follow shadcn-vue layout: `index.ts` re-exports + `<Component>.vue`.
- Forms use **vee-validate + zod** schemas for validation.
- Class merging via `cn()` in `src/lib/utils.ts` (clsx + tailwind-merge + cva).

## Useful References

- Sales procedure source: [`FE/doc/sale.txt`](../guide/business-process)
- Client quotation (PDF): [`/bakti-udara-quotation.pdf`](/bakti-udara-quotation.pdf)
- [Module breakdown](/guide/modules) · [Data model](/guide/data-model)
