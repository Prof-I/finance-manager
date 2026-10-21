# Finance Manager

A privacy-first personal finance planner. Enter your income, monthly expenses (by category) and loans, and the app shows how long each loan will take to clear, how much you can save every month, and how your spending compares with the 50/30/20 guideline.

Everything runs in your browser. Data is stored locally and never leaves your device.

## Run it

```bash
npm install
npm run dev      # start the app
npm test         # run engine tests
npm run build    # type-check and build
```

Requires Node 18+.

## How it is organised

```
src/
  types/       FinancialSnapshot, the one data shape everything shares
  engine/      Pure calculation functions (EMI, amortization, budget). No UI code. Tested.
  advisor/     Turns a snapshot into suggestions. Rule-based today, swappable later.
  store/       State plus localStorage persistence
  features/    One folder per screen; registered in features/registry.ts
  components/  Shared UI pieces
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

