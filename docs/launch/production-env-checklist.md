# OptiTech Academy Production Environment Checklist

Use this as a fill-in checklist for your hosting dashboard. Leave actual values
out of this file.

Simple translation: this is the list of switches and locked boxes the online
app needs before it can safely take payments.

Do not paste Stripe secret keys, webhook secrets, database passwords, email API
keys, generated session secrets, or admin tokens into this checklist.

## Required Host Dashboard Values

| Set? | Variable                               | Source                                                                 | Validation                                                                   | Launch note                                                |
| ---- | -------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [ ]  | `PUBLIC_APP_URL`                       | Production host domain after deployment.                               | Must be the deployed https URL, not localhost.                               | Used for Stripe redirects and passwordless sign-in links.  |
| [ ]  | `STRIPE_SECRET_KEY`                    | Stripe dashboard server-side API key.                                  | Must start with `sk_` and stay server-only.                                  | Creates Stripe Checkout sessions.                          |
| [ ]  | `STRIPE_WEBHOOK_SECRET`                | Stripe webhook endpoint signing secret.                                | Must start with `whsec_` and stay server-only.                               | Verifies `checkout.session.completed` events.              |
| [ ]  | `DATABASE_URL`                         | Managed PostgreSQL provider.                                           | Must be a postgres or postgresql connection URL.                             | Stores purchases, access, sign-ins, progress, and quizzes. |
| [ ]  | `DATABASE_SSL`                         | Managed PostgreSQL provider requirement.                               | Usually `true` for hosted databases.                                         | Enables SSL for production database connections.           |
| [ ]  | `AUTH_SESSION_SECRET`                  | Generated with `pnpm launch:secrets`.                                  | At least 32 characters and never committed.                                  | Protects passwordless sign-in sessions.                    |
| [ ]  | `TRANSACTIONAL_EMAIL_API_URL`          | Transactional email provider. Resend: `https://api.resend.com/emails`. | Must be an https API endpoint.                                               | Sends passwordless sign-in links.                          |
| [ ]  | `TRANSACTIONAL_EMAIL_API_KEY`          | Transactional email provider.                                          | At least 16 characters and server-only. Resend keys should start with `re_`. | Authorizes passwordless email delivery.                    |
| [ ]  | `SIGN_IN_FROM_EMAIL`                   | Verified sender email at the email provider.                           | Must include an email address with `@`.                                      | Shown as the sender for sign-in links.                     |
| [ ]  | `PRACTICE_SEAT_ADMIN_TOKEN`            | Generated with `pnpm launch:secrets`.                                  | At least 32 characters and never committed.                                  | Protects temporary practice seat assignment tools.         |
| [ ]  | `ALERT_ADMIN_TOKEN`                    | Generated with `pnpm launch:secrets`.                                  | At least 32 characters and never committed.                                  | Protects temporary alert-button admin tools.               |
| [ ]  | `MODULE_ONE_CLINICAL_REVIEWER_NAME`    | Clinical review signoff record.                                        | Required after Module 1 review is approved.                                  | Documents who approved Module 1 for paid launch.           |
| [ ]  | `MODULE_ONE_CLINICAL_REVIEWER_ROLE`    | Clinical review signoff record.                                        | Required after Module 1 review is approved.                                  | Documents reviewer role or credentials.                    |
| [ ]  | `MODULE_ONE_CLINICAL_REVIEW_DATE`      | Clinical review signoff record.                                        | Use the review approval date.                                                | Documents when Module 1 was approved.                      |
| [ ]  | `MODULE_ONE_CLINICAL_APPROVED_VERSION` | Clinical review signoff record.                                        | Use the approved module/content version.                                     | Documents which content version was reviewed.              |
| [ ]  | `MODULE_ONE_CLINICAL_REVIEW_APPROVED`  | Clinical review signoff record.                                        | Keep `false` until corrections are resolved; then `true`.                    | Unlocks the clinical review launch gate.                   |
| [ ]  | `ENABLE_PAID_ENROLLMENT`               | Final launch decision.                                                 | Keep `false` until every launch gate passes.                                 | Turns paid checkout on only after readiness is proven.     |

## Optional Values

| Set? | Variable                                       | Source                                  | Validation                                         | Launch note                                                                |
| ---- | ---------------------------------------------- | --------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------- |
| [ ]  | `PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER`  | Optional Stripe dashboard Payment Link. | Leave blank or use a `https://buy.stripe.com` URL. | Shows a controlled manual payment link for first individual buyers.        |
| [ ]  | `PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_6_SEATS`  | Optional Stripe dashboard Payment Link. | Leave blank or use a `https://buy.stripe.com` URL. | Shows a controlled manual payment link for the six-seat practice pack.     |
| [ ]  | `PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_15_SEATS` | Optional Stripe dashboard Payment Link. | Leave blank or use a `https://buy.stripe.com` URL. | Shows a controlled manual payment link for the fifteen-seat practice pack. |
| [ ]  | `VITE_ANALYTICS_ENDPOINT`                      | Optional analytics provider.            | Leave blank to disable analytics.                  | Only needed if you want browser analytics at launch.                       |
| [ ]  | `VITE_ANALYTICS_WEBSITE_ID`                    | Optional analytics provider.            | Leave blank to disable analytics.                  | Pairs with `VITE_ANALYTICS_ENDPOINT` when analytics is used.               |
| [ ]  | `LAUNCH_SITEMAP_PATH`                          | Local launch command setting.           | Optional; defaults to `dist/public/sitemap.xml`.   | Used by `pnpm launch:sitemap` when saving a generated sitemap file.        |

## Host Dashboard Paste Template

Use this as a starting point in Render or another production host's environment
settings. Fill the blank values only inside the host dashboard.

Never paste this template into GitHub, Google Drive, chat, tickets, or support
notes after real values are added.

## Render Blueprint Auto-Filled Values

If you deploy with the repo's `render.yaml` Blueprint, Render should fill or
generate these values for you:

- `DATABASE_URL`: connected from the managed Render PostgreSQL database.
- `DATABASE_SSL`: set to `true` by the Blueprint.
- `AUTH_SESSION_SECRET`: generated by Render.
- `PRACTICE_SEAT_ADMIN_TOKEN`: generated by Render.
- `ALERT_ADMIN_TOKEN`: generated by Render.
- `ENABLE_PAID_ENROLLMENT`: starts as `false`.
- `MODULE_ONE_CLINICAL_REVIEW_APPROVED`: starts as `false`.

Beginner translation: if Render already made a value, do not replace it with a
blank value from the paste template. Only fill the dashboard fields that Render
asks you to enter.

```text
PUBLIC_APP_URL=https://your-domain.example
ENABLE_PAID_ENROLLMENT=false
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
DATABASE_URL=
DATABASE_SSL=true
AUTH_SESSION_SECRET=
TRANSACTIONAL_EMAIL_API_URL=https://api.resend.com/emails
TRANSACTIONAL_EMAIL_API_KEY=
SIGN_IN_FROM_EMAIL=
PRACTICE_SEAT_ADMIN_TOKEN=
ALERT_ADMIN_TOKEN=
MODULE_ONE_CLINICAL_REVIEWER_NAME=
MODULE_ONE_CLINICAL_REVIEWER_ROLE=
MODULE_ONE_CLINICAL_REVIEW_DATE=
MODULE_ONE_CLINICAL_APPROVED_VERSION=
MODULE_ONE_CLINICAL_REVIEW_APPROVED=false
PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER=
PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_6_SEATS=
PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_15_SEATS=
```

## Where Each Value Comes From

- `PUBLIC_APP_URL`: the real `https` URL from Render or your custom domain after
  deploy.
- `STRIPE_SECRET_KEY`: Stripe dashboard server-side secret key. Paste only in
  the host dashboard.
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook endpoint signing secret for
  `/api/stripe/webhook`.
- `DATABASE_URL`: Render PostgreSQL or another managed PostgreSQL connection
  string.
- `DATABASE_SSL`: usually `true` for managed production PostgreSQL.
- `AUTH_SESSION_SECRET`: generated with `pnpm launch:secrets` on a trusted
  computer.
- `TRANSACTIONAL_EMAIL_API_URL`: your email provider API endpoint. Resend uses
  `https://api.resend.com/emails`.
- `TRANSACTIONAL_EMAIL_API_KEY`: email provider API key. Paste only in the host
  dashboard.
- `SIGN_IN_FROM_EMAIL`: verified sender address at the email provider.
- `PRACTICE_SEAT_ADMIN_TOKEN`: generated with `pnpm launch:secrets`.
- `ALERT_ADMIN_TOKEN`: generated with `pnpm launch:secrets`.
- `MODULE_ONE_CLINICAL_*`: clinical reviewer signoff fields from
  `pnpm launch:clinical-review`.
- `ENABLE_PAID_ENROLLMENT`: final launch switch. Keep `false` until all gates
  pass.
- `PUBLIC_STRIPE_PAYMENT_LINK_*`: optional public Stripe Payment Links for
  controlled first buyers while automated checkout stays paused.

Keep `ENABLE_PAID_ENROLLMENT=false` and
`MODULE_ONE_CLINICAL_REVIEW_APPROVED=false` until every launch gate is complete.

Before pasting generated values, run `pnpm launch:secrets` on a trusted
computer. After setting host values, run `pnpm launch:dashboard-proof` without
printing secrets, then run `pnpm launch:doctor` or open
`/api/launch/readiness` to confirm the app sees them.
