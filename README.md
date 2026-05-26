# Compliance Monitor (Local)

A local-first Compliance Monitor that evaluates actions against process standards using the `facebook/bart-large-mnli` Zero-Shot NLI model. Results are stored entirely in the browser via `localStorage` and the TanStack Query cache. No database or auth required.

---

## What This Demonstrates

| Signal | Implementation |
| --- | --- |
| Local-first persistence | All analyses stored in `localStorage`; TanStack Query's `persistQueryClient` restores the cache instantly on reload |
| Layered architecture | Storage / HuggingFace service / TanStack Query hooks: each layer has one responsibility |
| Type safety end-to-end | Zod schemas, TypeScript types: no `any` |
| Server/Client boundary | HuggingFace API called directly from the browser; token scoped to inference only |
| Server state | TanStack Query v5: `useMutation` + `useQuery`, not `useState` + raw fetch |
| Soft delete | Records are never hard-deleted: auditable, append-only history |
| HF edge cases | Cold start retry (3 attempts, 2s / 4s backoff), 45s timeout, typed error classification |
| Domain language | UI speaks compliance domain vocabulary throughout |
| Component library | shadcn/ui throughout |
| E2E coverage | Playwright: 5 user flows |

---

## Tech Stack

- **Framework:** Vite + React 19 + TypeScript 5 (strict)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Server state:** TanStack Query v5
- **Persistence:** `localStorage` via `persistQueryClient`
- **Validation:** Zod v4
- **Testing:** Playwright

---

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd compliance-monitor-local
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in the value:

```bash
cp .env.example .env.local
```

| Variable | How to get it |
| --- | --- |
| `VITE_HUGGINGFACE_API_TOKEN` | Create a free account at [huggingface.co](https://huggingface.co), then go to Profile -> Settings -> Access Tokens -> New token (Read) |

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). No sign-up required. Start running compliance checks immediately.

---

## Running Tests

### Playwright E2E

The tests call the real HuggingFace API, so allow up to 60 seconds per test for model inference.

**Requirements:**

- `.env.local` must be configured with a valid `VITE_HUGGINGFACE_API_TOKEN`

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Open Playwright UI for interactive debugging
npm run test:e2e:ui
```

**Test coverage:**

| Test | Flow |
| --- | --- |
| Compliant action -> COMPLIES | Open dialog -> fill form -> submit -> assert badge -> close -> assert log entry |
| Deviating action -> DEVIATES | Open dialog -> fill form -> submit -> assert badge -> close -> assert log entry |
| Persistence across reload | Open dialog -> submit -> reload -> assert log entry survives |
| Edit and resubmit | Submit -> close -> edit -> resubmit -> assert updated result |
| Soft delete | Submit -> close -> delete -> confirm -> assert removed -> assert survives reload |

---

## Project Structure

```text
compliance-monitor-local/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui primitives
│   │   ├── compliance-monitor.tsx # "use client" orchestrator
│   │   ├── check-dialog.tsx       # Run / edit dialog with inline result
│   │   ├── analysis-form.tsx
│   │   ├── result-panel.tsx
│   │   ├── history-list.tsx
│   │   └── history-item.tsx
│   ├── hooks/                     # TanStack Query hooks
│   ├── lib/
│   │   ├── storage.ts             # localStorage CRUD (replaces DB layer)
│   │   ├── huggingface.ts         # HuggingFace inference client
│   │   ├── validations.ts
│   │   └── utils.ts
│   ├── types/
│   ├── providers.tsx              # PersistQueryClientProvider
│   ├── App.tsx
│   └── main.tsx
└── e2e/                           # Playwright tests
```

---

## API

All data operations are local. There is no server. The HuggingFace inference API is called directly from the browser using the token from `.env.local`.

| Operation | Implementation |
| --- | --- |
| Run compliance check | `callHuggingFace()` + `createAnalysis()` in `localStorage` |
| List analyses | `getAnalyses()` from `localStorage`, filtered and sorted |
| Edit and resubmit | `callHuggingFace()` + `updateAnalysis()` in `localStorage` |
| Soft delete | `softDeleteAnalysis()` sets `deletedAt` in `localStorage` |
