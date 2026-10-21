# Contributing

Thanks for helping out. Each change should be small and reviewable.

## Workflow

1. Pick an issue and comment that you are taking it.
2. Branch from `main`: `git checkout -b feature/short-name`
3. Make your change. Add or update tests if you touched `src/engine`.
4. Run `npm run typecheck && npm test`.
5. Open a pull request using the template. At least one teammate reviews before merging.

## Ground rules

- Do math only in `src/engine`, with unit tests. UI code calls the engine and never re-implements formulas.
- New screens live in `src/features/<name>/` and are added to `src/features/registry.ts`.
- Anything that produces advice goes through the `Advisor` interface in `src/advisor`.
- Keep user data local. No network calls with financial data unless the user opts in.
- Use the shared types in `src/types`. Avoid `any`.

## Commit messages

Short and in the imperative: `Add prepayment simulator`, `Fix EMI rounding`.
