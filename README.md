# OptiTech Academy â€” Ophthalmic Technician Foundations

A full-stack, ten-module ophthalmic technician education platform built with React, TypeScript, Vite, and Express.

## One-click Render deployment

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/JeffN-Up/ophthalmic_tech_course)

The repository includes a production `render.yaml` Blueprint. Select the button above, authorize Render to access the GitHub repository, review the Blueprint, enter the secret environment values requested by Render, and approve deployment.

Add these private values in Render to enable enrollment, email, and protected media. The public site and health check can start before these optional integrations are configured:

```env
STRIPE_SECRET_KEY=
STRIPE_STANDARD_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
SUPPORT_EMAIL=
SALES_NOTIFICATION_EMAIL=
BUSINESS_LEGAL_NAME=
BUSINESS_ADDRESS=
SPINDEL_MANAGER_EMAIL=
SPINDEL_MANAGER_PASSWORD=
SPINDEL_MEDIA_CATALOG_JSON=
COURSE_MEDIA_CATALOG_JSON=
```

Render automatically generates `SESSION_SECRET`, assigns `PUBLIC_APP_URL`, and configures the persistent `DATA_FILE`. The manager name defaults to `Spindel Administrator`, and the seat limit defaults to `100` unless changed in Render.

The manager password should be unique, at least 12 characters long, and must not be committed to GitHub or sent through ordinary email or chat.

The internal portal is available at `/spindel` after a successful deployment. See [`SPINDEL_ONBOARDING_SETUP.md`](SPINDEL_ONBOARDING_SETUP.md) for employee invitation and testing instructions.

## Included Features

- Public course and curriculum pages
- Individual and practice-team enrollment
- One-time Stripe Checkout at $699 for an individual seat or $1,200 for a five-seat practice package
- Stripe payment verification before account activation
- Password hashing with Node `scrypt`
- Signed, HTTP-only login sessions
- Protected student dashboard and lessons
- Ten instructional modules with practice checklists and clinical safety notes
- One protected video overview and one protected audio overview for every public module
- End-of-module quizzes with saved scores
- Practice-manager invitation links and team progress
- Private Spindel Eye Associates employee onboarding portal
- Printable certificate of course completion
- Persistent local account/progress data
- GitHub Actions type-check and production-build validation

## Curriculum

1. Ophthalmic Foundations & Patient Communication
2. Refraction & Lensometry
3. Tonometry & Intraocular Pressure Measurement
4. Slit Lamp Examination & Anterior Segment Imaging
5. Retinal Imaging & OCT Interpretation
6. Visual Field Testing & Interpretation
7. Advanced Imaging & Specialized Procedures
8. Patient Communication & Soft Skills
9. Clinical Documentation & EHR Proficiency
10. Professional Development & Career Pathways

## Local Development

```bash
cp .env.example .env
pnpm install
pnpm dev
```

The development frontend runs through Vite. A production build bundles the Express server and creates the static client files.

```bash
pnpm run check
pnpm run build
pnpm start
```

## Required Production Environment Variables

```env
PUBLIC_APP_URL=https://course.example.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_STANDARD_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
SESSION_SECRET=a-long-random-secret
DATA_FILE=/var/data/course-data.json
RESEND_API_KEY=re_...
EMAIL_FROM=OptiTech Academy <course@example.com>
SUPPORT_EMAIL=support@example.com
BUSINESS_LEGAL_NAME=Your legal business name
BUSINESS_ADDRESS=Your business mailing address
```

Configure two one-time Stripe Prices: **$699 for individual enrollment** and **$1,200 for the five-seat practice package**.

The public paid course requires the Stripe, email, support, and legal-business values before production startup. The Spindel manager bootstrap values are documented in `SPINDEL_ONBOARDING_SETUP.md`.

## Persistent Storage Requirement

Accounts, password hashes, practice invitations, and quiz progress are stored in the JSON file configured by `DATA_FILE`. The hosting platform must provide a durable writable volume. Ephemeral or read-only deployments will lose account data after a restart and are not appropriate without replacing `server/store.ts` with a managed database adapter.

The data file is written with restricted file permissions and is ignored by Git. Back it up according to the organization's security and retention policies.

## Stripe Test Checklist

1. Create one-time test Prices for $699 individual enrollment and the $1,200 five-seat practice package.
2. Add the test secret key and Price ID to the deployment.
3. Complete an individual purchase with a Stripe test card.
4. Confirm that the payment-success page creates a password and signs in.
5. Complete all quiz flows and verify progress remains after sign-out/sign-in.
6. Complete a multi-seat practice purchase and redeem each private invitation link.
7. Replace test credentials with live credentials only after successful testing.

## Certificate Scope

The generated certificate confirms completion of this independent educational course. It is not licensure, JCAHPO certification, or proof of independent clinical competency. Students and employers must verify current certification eligibility and scope requirements with the appropriate official organizations and applicable regulations.

