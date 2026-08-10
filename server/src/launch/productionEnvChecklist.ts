export interface ProductionEnvironmentChecklistItem {
  variableName: string;
  source: string;
  validationRule: string;
  launchNote: string;
}

export interface ProductionEnvironmentChecklistInput {
  generatedAt?: string;
}

export const productionEnvironmentChecklist: ProductionEnvironmentChecklistItem[] =
  [
    {
      variableName: "PUBLIC_APP_URL",
      source: "Production host domain after deployment.",
      validationRule: "Must be the deployed https URL, not localhost.",
      launchNote: "Used for Stripe redirects and passwordless sign-in links.",
    },
    {
      variableName: "STRIPE_SECRET_KEY",
      source: "Stripe dashboard server-side API key.",
      validationRule: "Must start with sk_ and stay server-only.",
      launchNote: "Creates Stripe Checkout sessions.",
    },
    {
      variableName: "STRIPE_WEBHOOK_SECRET",
      source: "Stripe webhook endpoint signing secret.",
      validationRule: "Must start with whsec_ and stay server-only.",
      launchNote: "Verifies checkout.session.completed events.",
    },
    {
      variableName: "DATABASE_URL",
      source: "Managed PostgreSQL provider.",
      validationRule: "Must be a postgres or postgresql connection URL.",
      launchNote: "Stores purchases, access, sign-ins, progress, and quizzes.",
    },
    {
      variableName: "DATABASE_SSL",
      source: "Managed PostgreSQL provider requirement.",
      validationRule: "Usually true for hosted databases.",
      launchNote: "Enables SSL for production database connections.",
    },
    {
      variableName: "AUTH_SESSION_SECRET",
      source: "Generated with pnpm launch:secrets.",
      validationRule: "At least 32 characters and never committed.",
      launchNote: "Protects passwordless sign-in sessions.",
    },
    {
      variableName: "TRANSACTIONAL_EMAIL_API_URL",
      source:
        "Transactional email provider. Resend: https://api.resend.com/emails.",
      validationRule: "Must be an https API endpoint.",
      launchNote: "Sends passwordless sign-in links.",
    },
    {
      variableName: "TRANSACTIONAL_EMAIL_API_KEY",
      source: "Transactional email provider.",
      validationRule:
        "At least 16 characters and server-only. Resend keys should start with re_.",
      launchNote: "Authorizes passwordless email delivery.",
    },
    {
      variableName: "SIGN_IN_FROM_EMAIL",
      source: "Verified sender email at the email provider.",
      validationRule: "Must include an email address with @.",
      launchNote: "Shown as the sender for sign-in links.",
    },
    {
      variableName: "PRACTICE_SEAT_ADMIN_TOKEN",
      source: "Generated with pnpm launch:secrets.",
      validationRule: "At least 32 characters and never committed.",
      launchNote: "Protects temporary practice seat assignment tools.",
    },
    {
      variableName: "ALERT_ADMIN_TOKEN",
      source: "Generated with pnpm launch:secrets.",
      validationRule: "At least 32 characters and never committed.",
      launchNote: "Protects temporary alert-button admin tools.",
    },
    {
      variableName: "MODULE_ONE_CLINICAL_REVIEWER_NAME",
      source: "Clinical review signoff record.",
      validationRule: "Required after Module 1 review is approved.",
      launchNote: "Documents who approved Module 1 for paid launch.",
    },
    {
      variableName: "MODULE_ONE_CLINICAL_REVIEWER_ROLE",
      source: "Clinical review signoff record.",
      validationRule: "Required after Module 1 review is approved.",
      launchNote: "Documents reviewer role or credentials.",
    },
    {
      variableName: "MODULE_ONE_CLINICAL_REVIEW_DATE",
      source: "Clinical review signoff record.",
      validationRule: "Use the review approval date.",
      launchNote: "Documents when Module 1 was approved.",
    },
    {
      variableName: "MODULE_ONE_CLINICAL_APPROVED_VERSION",
      source: "Clinical review signoff record.",
      validationRule: "Use the approved module/content version.",
      launchNote: "Documents which content version was reviewed.",
    },
    {
      variableName: "MODULE_ONE_CLINICAL_REVIEW_APPROVED",
      source: "Clinical review signoff record.",
      validationRule: "Keep false until corrections are resolved; then true.",
      launchNote: "Unlocks the clinical review launch gate.",
    },
    {
      variableName: "ENABLE_PAID_ENROLLMENT",
      source: "Final launch decision.",
      validationRule: "Keep false until every launch gate passes.",
      launchNote: "Turns paid checkout on only after readiness is proven.",
    },
    {
      variableName: "PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER",
      source: "Optional Stripe dashboard Payment Link.",
      validationRule: "Leave blank or use a https://buy.stripe.com URL.",
      launchNote:
        "Shows a controlled manual payment link for first individual buyers.",
    },
    {
      variableName: "PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_6_SEATS",
      source: "Optional Stripe dashboard Payment Link.",
      validationRule: "Leave blank or use a https://buy.stripe.com URL.",
      launchNote:
        "Shows a controlled manual payment link for the six-seat practice pack.",
    },
    {
      variableName: "PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_15_SEATS",
      source: "Optional Stripe dashboard Payment Link.",
      validationRule: "Leave blank or use a https://buy.stripe.com URL.",
      launchNote:
        "Shows a controlled manual payment link for the fifteen-seat practice pack.",
    },
    {
      variableName: "VITE_ANALYTICS_ENDPOINT",
      source: "Optional analytics provider.",
      validationRule: "Leave blank to disable analytics.",
      launchNote: "Only needed if you want browser analytics at launch.",
    },
    {
      variableName: "VITE_ANALYTICS_WEBSITE_ID",
      source: "Optional analytics provider.",
      validationRule: "Leave blank to disable analytics.",
      launchNote: "Pairs with VITE_ANALYTICS_ENDPOINT when analytics is used.",
    },
    {
      variableName: "LAUNCH_SITEMAP_PATH",
      source: "Local launch command setting.",
      validationRule: "Optional; defaults to dist/public/sitemap.xml.",
      launchNote:
        "Used by pnpm launch:sitemap when saving a generated sitemap file.",
    },
  ];

export function renderProductionEnvChecklist({
  generatedAt = new Date().toISOString(),
}: ProductionEnvironmentChecklistInput = {}): string {
  return [
    "# OptiTech Academy Production Environment Checklist",
    "",
    `Generated at: ${generatedAt}`,
    "",
    "Use this as a fill-in checklist for your hosting dashboard. Leave actual values out of this file.",
    "",
    "Do not paste Stripe secret keys, webhook secrets, database passwords, email API keys, generated session secrets, or admin tokens into this checklist.",
    "",
    "| Set? | Variable | Source | Validation | Launch note |",
    "| --- | --- | --- | --- | --- |",
    ...productionEnvironmentChecklist.map(
      item =>
        `| [ ] | \`${item.variableName}\` | ${item.source} | ${item.validationRule} | ${item.launchNote} |`
    ),
    "",
    "## Host Dashboard Paste Template",
    "",
    "Use this as a starting point in Render or another production host's environment settings. Fill the blank values only inside the host dashboard.",
    "",
    "Never paste this template into GitHub, Google Drive, chat, tickets, or support notes after real values are added.",
    "",
    "## Render Blueprint Auto-Filled Values",
    "",
    "If you deploy with the repo's `render.yaml` Blueprint, Render should fill or generate these values for you:",
    "",
    "- `DATABASE_URL`: connected from the managed Render PostgreSQL database.",
    "- `DATABASE_SSL`: set to `true` by the Blueprint.",
    "- `AUTH_SESSION_SECRET`: generated by Render.",
    "- `PRACTICE_SEAT_ADMIN_TOKEN`: generated by Render.",
    "- `ALERT_ADMIN_TOKEN`: generated by Render.",
    "- `ENABLE_PAID_ENROLLMENT`: starts as `false`.",
    "- `MODULE_ONE_CLINICAL_REVIEW_APPROVED`: starts as `false`.",
    "",
    "Beginner translation: if Render already made a value, do not replace it with a blank value from the paste template. Only fill the dashboard fields that Render asks you to enter.",
    "",
    "```text",
    "PUBLIC_APP_URL=https://your-domain.example",
    "ENABLE_PAID_ENROLLMENT=false",
    "STRIPE_SECRET_KEY=",
    "STRIPE_WEBHOOK_SECRET=",
    "DATABASE_URL=",
    "DATABASE_SSL=true",
    "AUTH_SESSION_SECRET=",
    "TRANSACTIONAL_EMAIL_API_URL=https://api.resend.com/emails",
    "TRANSACTIONAL_EMAIL_API_KEY=",
    "SIGN_IN_FROM_EMAIL=",
    "PRACTICE_SEAT_ADMIN_TOKEN=",
    "ALERT_ADMIN_TOKEN=",
    "MODULE_ONE_CLINICAL_REVIEWER_NAME=",
    "MODULE_ONE_CLINICAL_REVIEWER_ROLE=",
    "MODULE_ONE_CLINICAL_REVIEW_DATE=",
    "MODULE_ONE_CLINICAL_APPROVED_VERSION=",
    "MODULE_ONE_CLINICAL_REVIEW_APPROVED=false",
    "PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER=",
    "PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_6_SEATS=",
    "PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_15_SEATS=",
    "```",
    "",
    "## Where Each Value Comes From",
    "",
    "- `PUBLIC_APP_URL`: the real `https` URL from Render or your custom domain after deploy.",
    "- `STRIPE_SECRET_KEY`: Stripe dashboard server-side secret key. Paste only in the host dashboard.",
    "- `STRIPE_WEBHOOK_SECRET`: Stripe webhook endpoint signing secret for `/api/stripe/webhook`.",
    "- `DATABASE_URL`: Render PostgreSQL or another managed PostgreSQL connection string.",
    "- `DATABASE_SSL`: usually `true` for managed production PostgreSQL.",
    "- `AUTH_SESSION_SECRET`: generated with `pnpm launch:secrets` on a trusted computer.",
    "- `TRANSACTIONAL_EMAIL_API_URL`: your email provider API endpoint. Resend uses `https://api.resend.com/emails`.",
    "- `TRANSACTIONAL_EMAIL_API_KEY`: email provider API key. Paste only in the host dashboard.",
    "- `SIGN_IN_FROM_EMAIL`: verified sender address at the email provider.",
    "- `PRACTICE_SEAT_ADMIN_TOKEN`: generated with `pnpm launch:secrets`.",
    "- `ALERT_ADMIN_TOKEN`: generated with `pnpm launch:secrets`.",
    "- `MODULE_ONE_CLINICAL_*`: clinical reviewer signoff fields from `pnpm launch:clinical-review`.",
    "- `ENABLE_PAID_ENROLLMENT`: final launch switch. Keep `false` until all gates pass.",
    "- `PUBLIC_STRIPE_PAYMENT_LINK_*`: optional public Stripe Payment Links for controlled first buyers while automated checkout stays paused.",
    "",
    "Keep `ENABLE_PAID_ENROLLMENT=false` and `MODULE_ONE_CLINICAL_REVIEW_APPROVED=false` until every launch gate is complete.",
    "",
    "Before pasting generated values, run `pnpm launch:secrets` on a trusted computer. After setting host values, run `pnpm launch:dashboard-proof` without printing secrets, then run `pnpm launch:doctor` or open `/api/launch/readiness` to confirm the app sees them.",
    "",
  ].join("\n");
}
