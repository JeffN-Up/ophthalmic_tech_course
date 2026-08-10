# OptiTech Academy Render Deployment Guide

This is the easiest hosted path for getting the course online with one web app
and one managed PostgreSQL database. Think of Render as the landlord for your
online store: it runs the website, gives it a public URL, and keeps the database
nearby.

The repo includes `render.yaml`, which is a Render Blueprint. A Blueprint is a
safe setup recipe. It creates:

- A Node web service named `optitech-academy`.
- A managed PostgreSQL database named `optitech-academy-db`.
- The build command: `corepack enable && corepack prepare pnpm@10.4.1 --activate && pnpm install --frozen-lockfile && pnpm build`.
- The pre-deploy database setup command: `pnpm db:setup`.
- The start command: `node dist/index.js`.
- The health check path: `/api/health`.

For the short copy/paste checklist, run:

```bash
pnpm launch:render-setup
```

For a saveable first-deploy evidence packet, run:

```bash
LAUNCH_FIRST_RENDER_REPORT_PATH=launch-evidence/first-render-deploy-evidence.md pnpm launch:first-render-deploy https://your-render-or-custom-domain.example
```

Direct branch-specific Render deploy link:

```text
https://render.com/deploy?repo=https%3A%2F%2Fgithub.com%2FDown2pound%2Fophthalmic_tech_course%2Ftree%2Fcodex%2Foptitech-product-spec
```

This link points Render at the `codex/optitech-product-spec` branch. Beginner
translation: it tells Render which copy of the project to put online.

Before creating or updating the Blueprint, run:

```bash
pnpm launch:deployment-audit
```

That command checks that `render.yaml`, `Dockerfile`, `Procfile`, and launch CI
still match the safe production setup.

For the full owner path from restored code to one controlled paid buyer, run:

```bash
pnpm launch:first-revenue
```

## Before You Click Deploy

1. Push the latest Git branch to GitHub.
2. Make sure the repo contains `render.yaml`.
3. Keep real secrets out of Git and Google Drive.
4. Keep `ENABLE_PAID_ENROLLMENT=false` while setting up the first deployment.

## Create The Render Blueprint

1. Sign in to Render.
2. Choose **New +**.
3. Choose **Blueprint**.
4. Connect the GitHub repo.
5. Select the branch you want to deploy.
6. Let Render read `render.yaml`.
7. Review the web service and database it plans to create.

The Blueprint intentionally sets `autoDeployTrigger: off`. That means Render
will not automatically redeploy every time you push code. For launch, that is
safer because you can deploy only after checks pass.

## Fill In Dashboard Values

Render will ask for values marked `sync: false`. Add them in the Render
dashboard, not in code:

```text
PUBLIC_APP_URL=https://your-render-or-custom-domain.example
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER=
PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_6_SEATS=
PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_15_SEATS=
TRANSACTIONAL_EMAIL_API_URL=https://api.resend.com/emails
TRANSACTIONAL_EMAIL_API_KEY=
SIGN_IN_FROM_EMAIL=
MODULE_ONE_CLINICAL_REVIEWER_NAME=
MODULE_ONE_CLINICAL_REVIEWER_ROLE=
MODULE_ONE_CLINICAL_REVIEW_DATE=
MODULE_ONE_CLINICAL_APPROVED_VERSION=
```

Render generates these automatically from the Blueprint:

```text
AUTH_SESSION_SECRET
PRACTICE_SEAT_ADMIN_TOKEN
ALERT_ADMIN_TOKEN
```

Render connects this automatically from the Blueprint database:

```text
DATABASE_URL
```

The Blueprint starts with these safety values:

```text
ENABLE_PAID_ENROLLMENT=false
MODULE_ONE_CLINICAL_REVIEW_APPROVED=false
DATABASE_SSL=true
```

Leave paid enrollment off until every launch gate passes.

The `PUBLIC_STRIPE_PAYMENT_LINK_*` values are optional. Add them only when you
are using approved Stripe Payment Links for controlled first buyers while
automated checkout stays paused. They must start with `https://buy.stripe.com/`.

## Database Tables

The Blueprint runs this before the web service starts:

```bash
pnpm db:setup
```

That command creates the tables the app needs for purchases, learner access,
practice seat packs, sign-in links, lesson progress, and quiz attempts.

If the first deploy fails at the pre-deploy step, check that Render created the
database and connected `DATABASE_URL`. After fixing the database setting, run a
manual deploy again.

You can also rerun setup later from a Render shell:

```bash
pnpm db:setup
```

The setup is safe to rerun because it uses `CREATE TABLE IF NOT EXISTS`.

## After The First Deploy

After Render gives you the live URL, print the URL-specific command card:

```bash
pnpm launch:live-url https://your-render-or-custom-domain.example
```

Open the deployed URL and check:

```text
https://your-render-or-custom-domain.example/api/health
https://your-render-or-custom-domain.example/api/launch/readiness
https://your-render-or-custom-domain.example/api/checkout/availability
https://your-render-or-custom-domain.example/first-sale
```

The health endpoint should respond. The readiness endpoint will probably say
paid launch is not ready yet. That is expected until Stripe, email, clinical
review, and smoke testing are complete. The checkout availability endpoint
should return safe buyer-facing text that says whether enrollment is open or
paused. The first-sale page should load as the main buyer front door before
learners or practices reach checkout. The database section should say the launch
schema is verified after `pnpm db:setup` has run successfully.

The health endpoint also reports a safe release fingerprint when Render provides
Git metadata:

```json
{
  "ok": true,
  "service": "optitech-academy",
  "environment": "production",
  "uptimeSeconds": 12,
  "release": {
    "host": "render",
    "branch": "main",
    "commit": "1234567",
    "serviceName": "optitech-academy",
    "url": "https://your-render-or-custom-domain.example"
  }
}
```

Beginner translation: this is the label on the live app. If a buyer has trouble,
compare the `commit` value with GitHub so you know exactly which copy is online.

## Connect Stripe

In Stripe, create the webhook endpoint:

```text
https://your-render-or-custom-domain.example/api/stripe/webhook
```

Listen for:

```text
checkout.session.completed
```

Put the webhook signing secret into Render as `STRIPE_WEBHOOK_SECRET`.

## Final Smoke Checks

From your home PC or any machine that can run the project commands:

```bash
LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_BASE_URL=https://your-render-or-custom-domain.example LAUNCH_EXPECTED_COMMIT=CURRENT_COMMIT pnpm launch:smoke
LAUNCH_BASE_URL=https://your-render-or-custom-domain.example pnpm launch:go-no-go
```

Use that command before paid launch to confirm the deployed app and public buyer
pages load. Use the go/no-go command to decide whether you can share preview
links, collect practice inquiries, or send paid checkout links.

After every gate is complete and `ENABLE_PAID_ENROLLMENT=true`, run:

```bash
LAUNCH_BASE_URL=https://your-render-or-custom-domain.example LAUNCH_EXPECTED_COMMIT=CURRENT_COMMIT pnpm launch:smoke
LAUNCH_BASE_URL=https://your-render-or-custom-domain.example pnpm launch:go-no-go
```

Only accept real buyers after that final smoke test passes.

## Render Blueprint Notes

- Render's Blueprint docs say `render.yaml` belongs in the repo root.
- `preDeployCommand` runs `pnpm db:setup` after build and before the app starts.
- `sync: false` asks Render to collect secret values in the dashboard instead
  of storing them in Git.
- `fromDatabase` connects `DATABASE_URL` to the managed PostgreSQL database.
- `healthCheckPath` tells Render which URL proves the service is alive.
