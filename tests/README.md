# Tests (documentation)

This project’s automated tests live under [`src/tests/`](../src/tests/).

## What types of tests exist?
- **Unit tests**: `src/tests/unit/*`
- **Integration tests**: `src/tests/integration/*` (Express routes + Mongoose + in-memory MongoDB)
- **Acceptance (E2E) tests**: `src/tests/acceptance/*` (Playwright browser tests)
- **Regression tests**: `src/tests/integration/regression.test.js`

## How to run
From the `src/` folder:

- Install dependencies:
  - `npm install`
- Run unit + integration (Jest):
  - `npm test`
- Run acceptance (Playwright):
  - `npm run playwright:install` (first time only)
  - `npm run test:acceptance`
- Run everything:
  - `npm run test:all`

