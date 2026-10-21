# Architecture

```
UI (features/*)  →  store (state)  →  engine (pure math)
                         ↓
                  advisor (suggestions)
```

## FinancialSnapshot

Defined in `src/types/index.ts`. It holds income, expenses and loans. Every calculation and every advisor takes a snapshot, so new features (and future AI features) never need to know how the UI stores things.

## Engine

`src/engine` has no React imports. Functions are deterministic and covered by `engine.test.ts`. If a number appears on screen, it should come from here.

## Advisor

`Advisor.getAdvice(snapshot)` returns `Suggestion[]`. `ruleBasedAdvisor` runs the functions in `advisor/rules.ts`. To add a rule, write a `Rule` and add it to the `rules` array. To add an AI advisor, implement `Advisor` and change the export in `advisor/index.ts`. Keep calculations in the engine and let the AI explain or suggest.

## Features

Each screen is a component registered in `features/registry.ts`. The nav is generated from that list.

## Storage

`store/store.ts` keeps the snapshot in memory, persists to `localStorage` under `finance-manager:v1`, and exposes `useSnapshot()` and `update()`. If the shape of the data changes, bump the key version and add a migration.
