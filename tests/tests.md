## Test suite overview

This repo includes the following automated test categories:

- **Unit Testing**: tests small helpers in isolation (no database, no server).
  - Example: `src/tests/unit/util.test.js`

- **Integration Testing**: tests the Express routes and Mongoose models working together using an **in-memory MongoDB**.
  - Example: `src/tests/integration/routes.test.js`

- **Acceptance Testing (E2E)**: tests user workflows in a real browser using **Playwright** against the running server.
  - Example: `src/tests/acceptance/e2e.spec.js`

- **Regression Testing**: locks down critical behaviors so future changes don’t break them.
  - Example: `src/tests/integration/regression.test.js`

## How to run (quick)

From `src/`:
- `npm test`
- `npm run test:acceptance`
- `npm run test:all`
