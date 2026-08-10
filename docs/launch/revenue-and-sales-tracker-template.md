# OptiTech Academy Revenue And Sales Tracker Template

Use this as the simple business notebook for the course. The goal is to track
who is interested, who bought, who needs help, and what to do next.

## Safe Tracking Rules

This tracker is safe for Google Drive when you keep it to business notes only.
Do not paste secrets, private medical details, or raw access links.

Safe to track:

- Buyer name, practice name, and business email.
- Purchase amount and offer name.
- Stripe Checkout session ID or Stripe event ID.
- Follow-up date, status, and next step.
- General support themes, such as "sign-in email not received."

Do not track:

- Credit card numbers.
- Stripe secret keys, webhook secrets, passwords, or API keys.
- Patient names, patient charts, medical record numbers, or PHI.
- Raw magic sign-in links or session cookies.
- Staff performance details that do not belong in a sales tracker.

## Lead Tracker

Use this table before someone buys.

| Date Added | Lead Type  | Name Or Practice | Source   | Buyer Path        | Status | Next Follow-Up | Safe Notes                              |
| ---------- | ---------- | ---------------- | -------- | ----------------- | ------ | -------------- | --------------------------------------- |
| 2026-07-13 | Individual | Example Learner  | LinkedIn | Individual course | New    | 2026-07-16     | Wants beginner-friendly tech training.  |
| 2026-07-13 | Practice   | Example Eye Care | Referral | Six-seat pack     | Warm   | 2026-07-17     | Asked about onboarding new technicians. |

Status ideas:

- New
- Contacted
- Warm
- Demo requested
- Waiting on buyer
- Won
- Lost

## Purchase Tracker

Use this table after someone pays.

| Purchase Date | Buyer Type | Buyer Name Or Practice | Buyer Email         | Offer                  | Amount | Stripe Checkout Session ID | Stripe Event ID  | Fulfillment Status | Sign-In Confirmed | Support Needed | Safe Notes                  |
| ------------- | ---------- | ---------------------- | ------------------- | ---------------------- | -----: | -------------------------- | ---------------- | ------------------ | ----------------- | -------------- | --------------------------- |
| 2026-07-13    | Individual | Example Learner        | learner@example.com | Individual learner     |    299 | cs_test_example            | evt_test_example | Access sent        | No                | No             | Send welcome email.         |
| 2026-07-13    | Practice   | Example Eye Care       | admin@example.com   | Six-seat practice pack |    999 | cs_test_example            | evt_test_example | Seats created      | No                | Yes            | Needs seat assignment help. |

Fulfillment status ideas:

- Paid, waiting on webhook
- Access sent
- Seats created
- Welcome email sent
- Complete
- Needs manual review

## Practice Seat Tracker

Use this table when a practice buys seats for employees.

| Practice         | Pack Size | Seats Assigned | Seats Remaining | Practice Contact  | Onboarding Lead | Next Check-In | Safe Notes                             |
| ---------------- | --------: | -------------: | --------------: | ----------------- | --------------- | ------------- | -------------------------------------- |
| Example Eye Care |         5 |              2 |               3 | admin@example.com | Jeff            | 2026-07-20    | Two new technicians starting Module 1. |

## Practice Inquiry Tracker

Use this table for larger-practice conversations that start before purchase.
Do not save patient details, private employee performance notes, passwords,
card data, raw sign-in links, or secrets.

| Date       | Inquiry ID               | Practice         | Contact Email       | Estimated Learners | Timeline          | Status | Next Step              |
| ---------- | ------------------------ | ---------------- | ------------------- | -----------------: | ----------------- | ------ | ---------------------- |
| 2026-07-13 | practice_inquiry_example | Example Eye Care | manager@example.com |                 18 | Next hiring class | New    | Schedule rollout call. |

## Refund And Support Tracker

Use this table when someone needs help or requests a refund.

| Request Date | Buyer Type | Buyer Name Or Practice | Category     | Offer              | Stripe Refund ID | Status | Follow-Up Date | Safe Reason Theme  | Safe Notes                                      |
| ------------ | ---------- | ---------------------- | ------------ | ------------------ | ---------------- | ------ | -------------- | ------------------ | ----------------------------------------------- |
| 2026-07-13   | Individual | Example Learner        | Sign-in help | Individual learner | N/A              | Open   | 2026-07-14     | Email not received | Resend sign-in after confirming email spelling. |

Category ideas:

- Sign-in help
- Access missing
- Seat assignment help
- Billing question
- Refund request
- Content question
- Practice onboarding question

## First 24-Hour Sale Review

Use this table for the first few real purchases. It connects the fulfillment
checklist to the sales plan, so you do not keep sending checkout links if the
first buyer needed manual rescue.

| Purchase Date | Buyer Type | Offer                   | Access Worked Without Manual Fix | Sign-In Worked | Support Issue Found                       | Outreach Decision            | Safe Notes                                                |
| ------------- | ---------- | ----------------------- | -------------------------------- | -------------- | ----------------------------------------- | ---------------------------- | --------------------------------------------------------- |
| 2026-07-13    | Individual | Founding Learner Access | Yes / No                         | Yes / No       | None / Sign-in / Access / Payment / Other | Continue / Pause / Fix first | Example: buyer reached Module 1 without staff workaround. |

Outreach decision ideas:

- Continue: buyer paid, received access, signed in, and no blocking issue
  appeared.
- Pause: buyer needed manual help or readiness changed from ready to not ready.
- Fix first: one specific page, email, checkout setting, webhook, or support
  step needs correction before more outreach.

## First Buyer Fulfillment Checklist

Run `pnpm launch:sales-tracker` to create
`first-buyer-fulfillment-checklist.csv` with the other sales tracker templates.

Use that CSV like a simple launch clipboard for the first real buyer. It helps
you check payment, webhook delivery, buyer lookup, welcome email, sign-in, and
Module 1 access without saving unsafe private data.

For individual learners, the green light is:

- Payment is paid.
- Checkout webhook delivered.
- Buyer lookup shows an active enrollment.
- Welcome email or safe skip reason is recorded.
- The buyer can request sign-in with the checkout email.
- The buyer can open Module 1.

For practice buyers, the green light is:

- Practice seat pack exists.
- Seat count and remaining seats are correct.
- Manager can assign learner seats.
- Assigned learner can request sign-in.

If any row fails, pause broad outreach and fix that one issue before sending
more checkout links.

## First Buyer Feedback Tracker

Run `pnpm launch:first-buyer-feedback` after the first buyer has paid, signed
in, opened Module 1, and any urgent support issue is resolved. Then use
`first-buyer-feedback-tracker.csv` from `pnpm launch:sales-tracker`.

| Feedback Date | Buyer Type | Offer                   | Feedback Received | Top Useful Theme                  | Top Confusing Theme | Next Improvement       | Testimonial Consent  | Approved Public Quote |
| ------------- | ---------- | ----------------------- | ----------------- | --------------------------------- | ------------------- | ---------------------- | -------------------- | --------------------- |
| 2026-08-06    | Individual | Founding Learner Access | Yes / No          | Beginner-friendly clinic language | None yet            | Improve welcome email. | Yes / No / Not asked |                       |

Only publish testimonials with written permission. Do not save patient
information, protected health information, private employee performance notes,
raw sign-in links, card data, passwords, Stripe secret keys, webhook secrets,
database passwords, or admin tokens.

## Weekly Business Review

Answer these once a week. Think of it like checking the course dashboard, but
for real customers.

| Week Of    | Leads Added | Sales Closed | Revenue | Refunds | Biggest Blocker          | Best Source   | Next Experiment             |
| ---------- | ----------: | -----------: | ------: | ------: | ------------------------ | ------------- | --------------------------- |
| 2026-07-13 |           0 |            0 |       0 |       0 | Need first outreach list | Not known yet | Email five local practices. |

Weekly questions:

- Which lead source brought the best conversations?
- Which buyer type was easiest to explain: individual learners or practices?
- Where did people get confused before buying?
- Did anyone need help after paying?
- Is there one page, email, or offer that should be clearer?
- What is the next small action that could create a sale?

## Simple Follow-Up Script

Use this when a lead is interested but has not bought yet:

```text
Hi [Name],

I wanted to follow up on OptiTech Academy. It is built for new ophthalmic
technicians, medical assistants, and practices that want a more structured
onboarding path.

The course starts with beginner-friendly eye care foundations, then helps
learners build confidence with real clinic workflows.

Would it be helpful if I sent the individual course link or the practice seat
pack option?

Thank you,
[Your Name]
```

## What Good Looks Like

You are not trying to build a giant spreadsheet. You are trying to answer four
simple business questions:

1. Who might buy?
2. Who already bought?
3. Did they get access successfully?
4. What should I do next?
