# FashioMe E2E test suite (Playwright)

## What's covered

- `tests/auth/` — register, login, logout, session persistence, protected-route
  redirects, and the full forgot/reset password round trip via MailHog.
- `tests/admin/` — full CRUD (create/read/update/delete) for the Clothes and
  Users admin sections: search, category/status filters, pagination, view
  details, form validation, and delete confirmation.
- `tests/dashboard/` — admin dashboard load, sidebar navigation, and
  route-level auth guard.
- `tests/api/` — network interception asserting HTTP methods, status codes,
  and request/response payloads for login and clothes CRUD.
- `tests/ui/` — mobile-viewport responsiveness checks (runs under the
  `responsive` project in `playwright.config.ts`).

## One-time setup

1. Copy `playwright.env.example` to `playwright.env` and adjust if your ports differ.
2. Install browsers: `npm run test:e2e:install`.
3. Start MailHog (used to verify the password-reset email):
   ```
   docker run -d --name mailhog -p 1025:1025 -p 8025:8025 mailhog/mailhog
   ```
4. In `Fashiome_Backend/.env`, point email sending at MailHog:
   ```
   EMAIL_HOST=localhost
   EMAIL_PORT=1025
   EMAIL_USER=test@fashiome.local
   EMAIL_PASSWORD=anything
   ```
   (MailHog ignores the credentials — they only need to be non-empty so the
   backend's `EmailService` considers itself configured.)
5. Seed the admin account the suite logs in as: `npm run create-admin` from
   `Fashiome_Backend` (creates `admin@fashiome.com` / `admin123`).

## Running

Before every run, make sure these are up:

- MongoDB
- Backend: `npm run dev` in `Fashiome_Backend` (port 8089)
- Frontend: `npm run dev` in this project (port 3000)
- MailHog (see above)

Then:

```
npm run test:e2e            # headless run, all projects
npm run test:e2e:ui         # interactive UI mode
npm run test:e2e:headed     # headed browser
npm run test:e2e:report     # open the last HTML report
```

`global-setup.ts` runs once before the suite: it logs in as the seeded admin
and registers+logs in a fresh member account through the real UI, then saves
both as storage state files under `playwright/.auth/` (gitignored). Specs opt
into a state with `test.use({ storageState: '...' })`; auth specs instead
start from a clean, logged-out context.

## Notes / known gaps

- The Clothes table has search, category/status filters, and pagination, but
  no clickable column sorting in the current UI — `admin/read.spec.ts` tests
  what exists (search, filter, pagination, view) rather than a sort feature.
- This suite is E2E only. Component-level unit tests (e.g. Jest + React
  Testing Library for individual components) are a separate piece of work
  and are not included here.
- CI: point `E2E_BASE_URL`/`E2E_API_BASE_URL` at whatever the pipeline starts
  the frontend/backend on, start MongoDB + MailHog as services, run
  `npm run create-admin` once, then `npm run test:e2e`.
