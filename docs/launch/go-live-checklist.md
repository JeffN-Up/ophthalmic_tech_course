# OptiTech Academy Go-Live Checklist

Use this as the final launch-day sequence. Do not turn on real paid enrollment
until every section is complete and the deployed app says it is ready.

## 1. Freeze The Release Candidate

- [ ] Choose the commit that will be deployed.
- [ ] Run `pnpm launch:preflight`.
- [ ] Confirm `pnpm launch:secret-scan` passes for the release candidate.
- [ ] Confirm `pnpm launch:offer-audit` passes for the release candidate.
- [ ] Confirm `pnpm launch:deployment-audit` passes for the release candidate.
- [ ] Save the generated `launch-evidence/` folder.
- [ ] Confirm no `.env`, secret keys, raw tokens, cookies, database passwords,
      or protected health information were saved.

## 2. Complete Clinical Review

Detailed guide: `docs/launch/clinical-review-guide.md`

- [ ] Module 1 clinical review packet was reviewed.
- [ ] Corrections were resolved.
- [ ] Reviewer name, role, date, approved version, and approval status were
      saved.
- [ ] Production host has the `MODULE_ONE_CLINICAL_*` values.
- [ ] `MODULE_ONE_CLINICAL_REVIEW_APPROVED=true` only after approval.

## 3. Connect Hosting And Database

Detailed guides:

- `docs/launch/deployment-guide.md`
- `docs/launch/database-setup-guide.md`

- [ ] App is deployed to a public `https` URL.
- [ ] `PUBLIC_APP_URL` matches the deployed URL.
- [ ] Managed PostgreSQL database exists.
- [ ] `DATABASE_URL` and `DATABASE_SSL=true` are configured in the host.
- [ ] `pnpm db:setup` completed against the production database.
- [ ] `/api/health` returns `ok: true`.
- [ ] `/api/launch/readiness` reports database schema verified.
- [ ] `/api/checkout/availability` returns a safe buyer-facing open/paused status.

## 4. Connect Stripe And Email

Detailed guides:

- `docs/launch/stripe-setup-guide.md`
- `docs/launch/email-setup-guide.md`

- [ ] Stripe test secret key is configured.
- [ ] `pnpm launch:offer-audit` passes so public prices, app checkout prices,
      and Stripe setup notes match.
- [ ] Stripe webhook endpoint points to `/api/stripe/webhook`.
- [ ] Webhook listens for `checkout.session.completed`.
- [ ] Webhook signing secret is configured.
- [ ] Transactional email endpoint and API key are configured.
- [ ] Sign-in sender address is verified.
- [ ] Test sign-in email arrives and opens the deployed app.
- [ ] `PRACTICE_SEAT_ADMIN_TOKEN` is configured so practice-seat assignment,
      buyer lookup, practice inquiries, and access revocation stay protected.
- [ ] `ALERT_ADMIN_TOKEN` is configured so the alert-button admin page is
      locked before public launch.

## 5. Run Paid Flow Tests

Record safe evidence in `manual-launch-qa-evidence.md`.

- [ ] Individual learner test checkout creates durable learner access.
- [ ] Six-seat practice pack test checkout creates the correct seat pack.
- [ ] Fifteen-seat practice pack test checkout creates the correct seat pack.
- [ ] Practice seat assignment works and cannot exceed purchased capacity.
- [ ] Learner can sign in, open Module 1, complete progress, submit quiz, and
      see certificate eligibility only after requirements are met.
- [ ] Individual learner interest path is visible and creates a durable lead
      record before paid checkout is fully opened.
- [ ] Custom practice inquiry path is visible and creates a durable lead record.
- [ ] Protected practice inquiry list shows the test lead without exposing
      secrets or private clinical details.
- [ ] Protected lead pipeline smoke test submits safe practice and learner
      leads, loads them from the dashboard, and marks both contacted:
      `LAUNCH_BASE_URL=https://your-domain.example LAUNCH_ADMIN_TOKEN=your_private_admin_token pnpm launch:lead-pipeline-smoke`.

## 6. Run Browser And Sharing Checks

- [ ] Desktop layout checked.
- [ ] Mobile layout checked.
- [ ] Keyboard navigation checked.
- [ ] Form labels checked.
- [ ] Contrast and readability checked.
- [ ] Text overflow checked.
- [ ] Checkout error states checked.
- [ ] Sign-in error states checked.
- [ ] Course access denied states checked.
- [ ] Sitemap generated with the production domain.
- [ ] Shared-link preview title and description checked.

## 7. Turn On Paid Enrollment

Only after every earlier section passes:

- [ ] Stripe live secret key is configured.
- [ ] Stripe live-mode webhook endpoint is configured.
- [ ] `/api/launch/readiness` no longer warns that Stripe is in test mode.
- [ ] Set `ENABLE_PAID_ENROLLMENT=true`.
- [ ] Redeploy or restart the app.
- [ ] Run `LAUNCH_BASE_URL=https://your-domain.example pnpm launch:smoke`.
- [ ] Confirm the smoke report includes individual and practice checkout
      success/cancel return pages.
- [ ] Confirm the smoke report says `Checkout availability endpoint: ok`.
- [ ] Open `/api/launch/readiness`.
- [ ] Confirm `readyForPaidLaunch` is `true`.
- [ ] Run `pnpm launch:live-purchase-test` and read the internal purchase
      rehearsal checklist.
- [ ] Run one low-risk internal live-mode purchase.
- [ ] Confirm live purchase creates durable access.
- [ ] Run `pnpm launch:first-buyer-feedback` after support issues are resolved
      so the first buyer feedback and testimonial consent path is ready.

If any live check fails, set `ENABLE_PAID_ENROLLMENT=false` before debugging.
Then run `pnpm launch:emergency-stop` and follow
`docs/launch/paid-launch-emergency-stop.md` before trying another live payment.

## 8. Archive The Launch Record

- [ ] Save the final `launch-evidence/` folder.
- [ ] Save clinical reviewer signoff evidence.
- [ ] Save Stripe test evidence without secrets.
- [ ] Save email delivery evidence without raw sign-in links.
- [ ] Save browser/accessibility QA notes.
- [ ] Save deployment smoke report.
- [ ] Save first-buyer feedback packet or note why feedback was not requested
      yet.

Do not archive `.env`, live secret keys, webhook secrets, email API keys,
database passwords, raw magic-link tokens, session cookies, card numbers, or
protected health information.
