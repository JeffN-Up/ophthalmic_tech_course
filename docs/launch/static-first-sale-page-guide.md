# OptiTech Academy Static First-Sale Page Guide

Use this if the full backend app is not online yet but you need a simple public
page for a controlled first-buyer conversation.

Simple translation: this is a one-page flyer the internet can open. It does not
replace the full app, the database, Stripe webhook fulfillment, or passwordless
course access.

Generate it with:

```bash
pnpm launch:static-first-sale-page
```

The output is:

```text
launch-static/first-sale.html
```

## Optional Payment Links

If you have Stripe Payment Links, set these before generating the page:

```text
PUBLIC_STRIPE_PAYMENT_LINK_FOUNDING_LEARNER=
PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_6_SEATS=
PUBLIC_STRIPE_PAYMENT_LINK_PRACTICE_15_SEATS=
```

Only `https://buy.stripe.com/...` links are used. Invalid or blank links become
disabled buttons.

## How To Use It

- Publish the HTML page only for a small approved first-buyer test.
- Send the buyer the preview, buyer guide, and policies before payment.
- Run `pnpm launch:manual-payment-links` before sending any payment link.
- Run `pnpm launch:fulfillment` immediately after a buyer pays.
- Do not treat this page as full automated launch proof.

## Stop Rules

Stop using the static page if:

- A buyer pays and access is delayed.
- The buyer misunderstands the course as certification.
- The payment amount or product does not match the offer.
- You cannot manually fulfill access the same day.

Do not paste Stripe secret keys, webhook secrets, card numbers, raw sign-in
links, session cookies, database passwords, patient information, or private
employee details into the generated page.
