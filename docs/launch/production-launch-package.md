# OptiTech Academy Production Launch Package

This package is the plain-English handoff for putting the course online and
opening paid enrollment. Keep it with the clinical review packet, Stripe setup
notes, and deployment records.

## Launch Rule

Do not set `ENABLE_PAID_ENROLLMENT=true` until every launch gate below is
complete and the deployed app reports paid launch readiness.

Paid checkout now fails closed unless all launch-critical gates are ready:

- Clinical review signoff is approved.
- Stripe checkout is configured.
- Stripe webhook fulfillment is configured.
- Passwordless sign-in email is configured.
- Practice-seat administration is configured.
- Alert-button administration is configured.
- Managed PostgreSQL is configured.
- Launch database tables are verified.
- `ENABLE_PAID_ENROLLMENT=true`.

## Current App Commands

Run these locally before deploying a release candidate:

```bash
pnpm launch:preflight
```

For a step-by-step beginner deployment recipe, use
`docs/launch/deployment-guide.md`.
For a Render Blueprint deployment path, use
`docs/launch/render-deployment-guide.md`.
For the first-hour path from restored code to deployed closed checkout, run
`pnpm launch:online-start` or use `docs/launch/online-start-guide.md`.
For continuing from the home PC named `jeffmini`, run `pnpm launch:jeffmini` or
use `docs/launch/jeffmini-resume-guide.md`.

For production domain, sitemap, and shared-link setup, use
`docs/launch/domain-and-sharing-guide.md`.
If a work computer blocks tests or launch commands, use
`docs/launch/home-pc-runbook.md`.
For the short home-PC command list, use
`docs/launch/home-pc-command-cheatsheet.md`.
For the outside-account setup sequence, run `pnpm launch:external-setup`.
For the simplest start-here launch board, run `pnpm launch:control`.
For first-customer outreach, sales scripts, and feedback tracking, use
`docs/launch/first-customers-sales-packet.md`.
For the first-buyer control panel with safe links, starter messages, and pause
rules, run `pnpm launch:first-buyer`.
For first paid buyer receipt, access, and welcome checks, use
`docs/launch/first-buyer-fulfillment-checklist.md` or run
`pnpm launch:fulfillment`.
For first-buyer feedback, testimonial consent, and the continue-or-pause
decision after access works, run `pnpm launch:first-buyer-feedback`.
For controlled first-buyer Stripe Payment Links while automated checkout is
paused, use `docs/launch/manual-payment-link-checklist.md` or run
`pnpm launch:manual-payment-links`.
For a static first-sale page that can be published separately while the backend
launch is still gated, use `docs/launch/static-first-sale-page-guide.md` or run
`pnpm launch:static-first-sale-page`.
For safe lead, purchase, refund, support, and weekly revenue tracking, use
`docs/launch/revenue-and-sales-tracker-template.md`.
For Stripe-specific setup, use `docs/launch/stripe-setup-guide.md`.
For passwordless sign-in email setup, use
`docs/launch/email-setup-guide.md`.
For managed PostgreSQL setup, use `docs/launch/database-setup-guide.md`.
For Module 1 clinical review setup, use
`docs/launch/clinical-review-guide.md`.
For the final launch-day sequence, use `docs/launch/go-live-checklist.md`.

Run this after the app is online:

```bash
LAUNCH_BASE_URL=https://your-deployed-site.example.com pnpm launch:smoke
```

The smoke test checks the health endpoint, launch readiness endpoint, browser
safety headers, `/robots.txt`, and the public buyer pages for home, checkout,
free preview, buyer guide, individual checkout return states, practice packs,
practice checkout return states, policies, curriculum, onboarding, Skills
Passport, Career Toolkit, and Certificate Preview.

Before the paid launch switch is enabled, the same smoke test can confirm the
deployed health endpoint, buyer pages, safety headers, and robots rules while
allowing `readyForPaidLaunch` to remain `false`:

```bash
LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_BASE_URL=https://your-deployed-site.example.com pnpm launch:smoke
```

Run one deployed smoke test with practice-inquiry capture enabled before sales
outreach:

```bash
LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_SMOKE_TEST_PRACTICE_INQUIRY=true LAUNCH_BASE_URL=https://your-deployed-site.example.com pnpm launch:smoke
```

Run one deployed smoke test with individual learner interest capture enabled
before learner outreach:

```bash
LAUNCH_SMOKE_ALLOW_NOT_READY=true LAUNCH_SMOKE_TEST_LEARNER_INTEREST=true LAUNCH_BASE_URL=https://your-deployed-site.example.com pnpm launch:smoke
```

Do not use `LAUNCH_SMOKE_ALLOW_NOT_READY=true` for the final go-live check.

Generate the production sitemap after `PUBLIC_APP_URL` is set to the real
deployed `https` domain:

```bash
PUBLIC_APP_URL=https://your-deployed-site.example.com pnpm launch:sitemap
```

For Docker deployments, pass the same domain as a build argument so the
container image includes `dist/public/sitemap.xml`:

```bash
docker build --build-arg PUBLIC_APP_URL=https://your-deployed-site.example.com --tag optitech-academy .
```

Create a local handoff folder for Google Drive after checks are complete:

```bash
pnpm launch:bundle
```

Run this after `DATABASE_URL` points to the managed PostgreSQL database:

```bash
pnpm db:setup
```

## Required Production Environment Variables

Set these in the host dashboard, not in Git:

```text
STRIPE_SECRET_KEY=
PUBLIC_APP_URL=
ENABLE_PAID_ENROLLMENT=false
STRIPE_WEBHOOK_SECRET=
AUTH_SESSION_SECRET=
TRANSACTIONAL_EMAIL_API_URL=https://api.resend.com/emails
TRANSACTIONAL_EMAIL_API_KEY=
SIGN_IN_FROM_EMAIL=
PRACTICE_SEAT_ADMIN_TOKEN=
ALERT_ADMIN_TOKEN=
DATABASE_URL=
DATABASE_SSL=true
MODULE_ONE_CLINICAL_REVIEWER_NAME=
MODULE_ONE_CLINICAL_REVIEWER_ROLE=
MODULE_ONE_CLINICAL_REVIEW_DATE=
MODULE_ONE_CLINICAL_APPROVED_VERSION=
MODULE_ONE_CLINICAL_REVIEW_APPROVED=false
```

Keep `ENABLE_PAID_ENROLLMENT=false` until the smoke test and manual checkout
tests pass. Keep `MODULE_ONE_CLINICAL_REVIEW_APPROVED=false` until the review
packet is approved and corrections are resolved.

## Clinical Review Gate

1. Download the review packet from the deployed app:
   `/api/launch/clinical-review-packet.md`
2. Have a qualified clinical reviewer approve or correct Module 1.
3. Record the reviewer name, reviewer role, review date, approved version, and
   approval status in the production environment variables.
4. Recheck `/api/launch/readiness`.

The clinical review gate is not ready until
`MODULE_ONE_CLINICAL_REVIEW_APPROVED=true` and all required signoff fields are
present.

## Database Gate

1. Create a managed PostgreSQL database with backups enabled.
2. Set `DATABASE_URL` and `DATABASE_SSL=true`.
3. Run `pnpm db:setup` against the managed database.
4. Recheck `/api/launch/readiness`.

The database gate is not ready until the readiness endpoint reports the launch
database schema as verified.

## Stripe Gate

1. Create Stripe products or use Checkout price data generated by the app.
2. Set `STRIPE_SECRET_KEY`.
3. Configure the Stripe webhook endpoint:
   `/api/stripe/webhook`
4. Set `STRIPE_WEBHOOK_SECRET`.
5. Run a Stripe test checkout for:
   - Individual learner offer.
   - Six-seat practice pack.
   - Fifteen-seat practice pack.
6. Confirm the webhook creates durable access records in PostgreSQL.

Checkout must remain closed until webhook fulfillment has been tested. The
webhook also fails closed unless `DATABASE_URL` is configured and the launch
database schema is verified, so Stripe events are not acknowledged into
temporary in-memory storage.

## Learner Flow Gate

Test the deployed app from purchase to learning:

1. Buy an individual learner offer with Stripe test mode.
2. Confirm the webhook provisions learner access.
3. Request passwordless sign-in.
4. Open Module 1 lessons.
5. Complete lesson progress.
6. Submit the Module 1 quiz.
7. Confirm certificate eligibility appears only after required completion.

## Practice Pack Gate

Test the deployed app for employer onboarding:

1. Buy a practice pack with Stripe test mode.
2. Confirm the webhook provisions the correct seat-pack size.
3. Open `/practice-seat-admin`.
4. Use the protected admin token.
5. Assign a learner email.
6. Confirm seat capacity cannot be exceeded.
7. Confirm the assigned learner receives course access.

## Browser And Accessibility Gate

Before turning on paid enrollment, check:

- Desktop layout.
- Mobile layout.
- Keyboard navigation.
- Form labels.
- Contrast/readability.
- Text overflow.
- Checkout error states.
- Sign-in error states.
- Course access denied states.

## Final Turn-On

Only after all gates pass:

1. Set `ENABLE_PAID_ENROLLMENT=true`.
2. Restart or redeploy the app so the new environment value is active.
3. Run:

```bash
LAUNCH_BASE_URL=https://your-deployed-site.example.com pnpm launch:smoke
```

4. Open `/api/launch/readiness` and confirm `readyForPaidLaunch` is `true`.
5. Run one final Stripe live-mode purchase with a low-risk internal buyer.

For a short owner-facing sequence from restored code to first controlled paid
buyer, run:

```bash
pnpm launch:first-revenue
pnpm launch:first-buyer
pnpm launch:fulfillment
pnpm launch:first-buyer-feedback
```

## Google Drive Handoff

When the launch package is ready to archive, save these files together:

- Generated `launch-evidence/` folder from `pnpm launch:bundle`
- `docs/launch/production-launch-package.md`
- `docs/launch/deployment-guide.md`
- `docs/launch/launch-control-checklist.md`
- `docs/launch/render-deployment-guide.md`
- `docs/launch/online-start-guide.md`
- `docs/launch/jeffmini-resume-guide.md`
- `docs/launch/deployment-cutover-checklist.md`
- `docs/launch/domain-and-sharing-guide.md`
- `docs/launch/github-and-source-backup-guide.md`
- `docs/launch/post-0716-workspace-handoff.md`
- `docs/launch/home-pc-runbook.md`
- `docs/launch/home-pc-command-cheatsheet.md`
- `docs/launch/first-customers-sales-packet.md`
- `docs/launch/individual-learner-decision-one-pager.md`
- `docs/launch/practice-manager-approval-one-pager.md`
- `docs/launch/manual-payment-link-checklist.md`
- `docs/launch/static-first-sale-page-guide.md`
- `docs/launch/first-buyer-fulfillment-checklist.md`
- First-buyer feedback packet from `pnpm launch:first-buyer-feedback`
- `docs/launch/revenue-and-sales-tracker-template.md`
- `docs/launch/stripe-setup-guide.md`
- `docs/launch/email-setup-guide.md`
- `docs/launch/database-setup-guide.md`
- `docs/launch/clinical-review-guide.md`
- `docs/launch/go-live-checklist.md`
- `docs/launch/production-env-checklist.md`
- `docs/launch/manual-launch-qa-evidence.md`
- `docs/launch/runtime-readiness-snapshot-guide.md`
- `docs/launch/first-sale-support-runbook.md`
- `docs/launch/bootcamp-content-migration-checklist.md`
- `docs/launch/module-1-clinical-review-packet.md`
- Downloaded `/api/launch/clinical-review-packet.md` after deployment, if needed
- Clinical reviewer signoff evidence
- Stripe webhook test notes
- Deployment smoke test output
- Browser/accessibility QA notes
- Generated `dist/public/sitemap.xml` or the hosted sitemap URL

Do not save `.env`, live secrets, raw magic-link tokens, session cookies,
database passwords, or Stripe secret keys to Google Drive.
