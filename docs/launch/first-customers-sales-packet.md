# OptiTech Academy First Customers Sales Packet

Use this after the launch gates are almost ready and you want to start finding
real buyers. This is not a technical checklist. It is the simple sales plan for
the first people who may pay for the course.

Simple translation: the app is the store, Stripe is the cash register, and this
packet is the script for inviting the first customers inside.

## Current Offers

| Buyer              | Offer                                   |         Price | Best Fit                                                                            |
| ------------------ | --------------------------------------- | ------------: | ----------------------------------------------------------------------------------- |
| Individual learner | Founding Learner Access                 |        `$299` | Career changers, medical assistants, and new techs who want ophthalmic foundations. |
| Practice buyer     | Six-Seat Practice Onboarding Pack       |        `$999` | Small practices training one hiring class or a few new team members.                |
| Practice buyer     | Fifteen-Seat Practice Onboarding Pack   |      `$1,799` | Growing practices standardizing onboarding across locations, hires, or supervisors. |
| Larger practice    | Custom Practice Onboarding Conversation | Contact first | More than 15 seats, Spindel pilot training, or custom rollout planning.             |

Do not promise certification, employment, promotion, clinical competency, exam
success, income, or that the course replaces hands-on supervision.

## Links To Send When The Site Is Live

Replace `https://your-real-domain.example` with the final production domain:

```powershell
$env:PUBLIC_APP_URL="https://your-real-domain.example"
pnpm launch:first-sales
```

That command prints the same buyer links with your real domain already filled
in.

For the whole path from restored project to first controlled paid buyer, run:

```bash
pnpm launch:first-revenue
```

For a day-by-day first week outreach plan, run:

```bash
pnpm launch:first-week-sales
```

Before sending a payment path to an interested person, run:

```bash
pnpm launch:lead-qualifier
```

Beginner translation: use this quick scorecard to decide whether to send the
free preview, buyer guide, practice-pack page, inquiry path, or paid checkout
path.

```text
First buyer overview: https://your-real-domain.example/first-sale
Individual learners: https://your-real-domain.example/first-sale
Individual checkout or interest list: https://your-real-domain.example/checkout
Practice buyers: https://your-real-domain.example/practice-packs
Course overview: https://your-real-domain.example/
Free lesson preview: https://your-real-domain.example/preview
Buyer decision guide: https://your-real-domain.example/buyer-guide
Policies: https://your-real-domain.example/policies
```

Send the individual learner link to career changers, medical assistants, and
new technicians buying for themselves. Send the practice pack link to managers,
supervisors, owners, or training leads buying seats for a team.
Use the first buyer overview as the safest public front door because it explains
both buyer paths before anyone reaches checkout.
When someone needs proof before buying, send the free lesson preview first.
When someone asks whether the course fits their situation, send the buyer
decision guide.
When a practice manager is trying to justify the purchase, send the practice
pack page and point them to the practice value planner.

Do not send paid checkout links broadly until:

- `/api/launch/readiness` reports paid launch readiness is complete.
- The final deployment smoke test passes without
  `LAUNCH_SMOKE_ALLOW_NOT_READY=true`.
- A Stripe test purchase has created durable access.
- Clinical review signoff is saved.

If someone asks before paid enrollment is open, send the course overview or
practice inquiry path instead of a checkout link.

## The First 10 Buyer Targets

Start small. The first goal is not to sell to everyone. The first goal is to
learn what real buyers understand, what confuses them, and what makes them trust
the course.

Track these 10 conversations:

| #   | Name / Practice | Buyer Type            | Contact Date | Status                                                    | Notes |
| --- | --------------- | --------------------- | ------------ | --------------------------------------------------------- | ----- |
| 1   |                 | Individual / Practice |              | Not contacted / Contacted / Interested / Bought / Not now |       |
| 2   |                 | Individual / Practice |              | Not contacted / Contacted / Interested / Bought / Not now |       |
| 3   |                 | Individual / Practice |              | Not contacted / Contacted / Interested / Bought / Not now |       |
| 4   |                 | Individual / Practice |              | Not contacted / Contacted / Interested / Bought / Not now |       |
| 5   |                 | Individual / Practice |              | Not contacted / Contacted / Interested / Bought / Not now |       |
| 6   |                 | Individual / Practice |              | Not contacted / Contacted / Interested / Bought / Not now |       |
| 7   |                 | Individual / Practice |              | Not contacted / Contacted / Interested / Bought / Not now |       |
| 8   |                 | Individual / Practice |              | Not contacted / Contacted / Interested / Bought / Not now |       |
| 9   |                 | Individual / Practice |              | Not contacted / Contacted / Interested / Bought / Not now |       |
| 10  |                 | Individual / Practice |              | Not contacted / Contacted / Interested / Bought / Not now |       |

Safe places to start:

- Medical assistants curious about eye care.
- New ophthalmic technicians who want plain-language foundations.
- Practice managers who train new hires.
- Office managers at small eye-care practices.
- Supervisors who repeat the same onboarding explanations often.
- Local career changers interested in health care.

Do not collect patient details, employee performance details, private employer
data, or protected health information in sales notes.

## Short Individual Learner Message

Subject:

```text
Ophthalmic technician foundations course
```

Message:

```text
Hi [Name],

I am getting ready to launch OptiTech Academy, a self-paced ophthalmic
technician foundations course for career changers, medical assistants, and new
eye-care team members.

It focuses on plain-language ophthalmic vocabulary, clinic flow, patient
communication, knowledge checks, and supervised practice preparation. It is not
a certification program and it does not replace hands-on training, but it can
help someone feel much less lost when starting in eye care.

Founding Learner Access is $299 for 12 months.

Free preview:
[Preview link]

Buyer guide:
[Buyer guide link]

Would you be open to taking a look when enrollment opens?

[Your Name]
```

## Short Practice Buyer Message

Subject:

```text
New ophthalmic technician onboarding course
```

Message:

```text
Hi [Name],

I am preparing to launch OptiTech Academy, a self-paced foundations course for
new ophthalmic technicians and medical assistants moving into eye care.

The practice packs are designed for onboarding: each learner gets their own
access, and supervisors can pair the course with local hands-on observation and
practice-specific protocols.

Current founding practice options are:

- Six seats for $999
- Fifteen seats for $1,799

The course does not replace employer supervision, clinical policy, or hands-on
competency signoff. The goal is to make the first layer of training more
consistent before the learner practices in clinic.

Free preview:
[Preview link]

Buyer guide:
[Buyer guide link]

Would it be useful for your team if I sent the course overview link when it is
ready?

[Your Name]
```

## Follow-Up Message

Send this 3 to 5 days after the first message if they do not reply:

```text
Hi [Name],

Just checking back on this. I am collecting early feedback before opening paid
enrollment more broadly.

The main question I am trying to answer is simple: would a plain-language
ophthalmic foundations course make onboarding easier for learners or practices?

No pressure either way. If it is not a fit right now, a quick "not now" is
totally fine.

[Your Name]
```

## Common Buyer Objections

Use these when someone is interested but unsure. Keep the answer short, helpful,
and honest. The goal is to lower confusion, not pressure someone.

| If they say...                             | Safe answer                                                                                                                                                                         | Next step                                                              |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| "Is this a certification course?"          | "No. It is foundational education for ophthalmic vocabulary, clinic flow, patient communication, and supervised practice preparation."                                              | Send the policies page with the course overview.                       |
| "I need to talk to my manager first."      | "That makes sense. The practice-pack page explains seat options, limits, and how supervisors can pair the course with local hands-on training."                                     | Ask: "Can you send me the practice pack link and the policies page?"   |
| "What if I am brand new to eye care?"      | "That is the intended learner. The course starts with plain-language foundations before moving into clinic habits and knowledge checks."                                            | Send the individual learner link and invite one question.              |
| "Can this replace our in-office training?" | "No. It can make the first layer of onboarding more consistent, but local protocols, observation, and hands-on signoff still belong with the practice."                             | Offer the practice pack page or a custom practice conversation.        |
| "Why should we buy now?"                   | "The founding version is priced for early buyers who want structured foundations and are willing to share feedback as the course improves."                                         | Ask whether individual access or a practice pack fits their situation. |
| "How do I justify this to an owner?"       | "The practice-pack page includes a planning tool that compares seat-pack cost with supervisor time spent repeating basic onboarding foundations. It is an estimate, not a promise." | Send the practice pack page and buyer guide.                           |
| "What if it is not a fit?"                 | "The course has clear policies and support expectations. Refund review is available under the posted refund policy."                                                                | Send the policies page and support email.                              |

Do not pressure the buyer or offer medical, legal, hiring, billing, or
certification advice. If someone needs employer approval, give them the correct
link and let them decide.

## First Sales Call Questions

Ask simple questions. Listen more than you talk.

- Who usually trains new ophthalmic staff?
- What confuses new hires the most in the first 30 days?
- Do medical assistants struggle with eye-care vocabulary before they feel
  comfortable?
- Would online foundations before hands-on clinic training save supervisor time?
- How many learners would need access in the next 3 to 6 months?
- What would make you trust the course enough to buy?
- What would stop you from buying?

Do not give medical, legal, billing, hiring, or certification advice during the
call.

## Safe Sales Claims

Use wording like this:

- Helps learners build foundational ophthalmic vocabulary.
- Supports onboarding before hands-on practice.
- Gives supervisors shared language for feedback.
- Helps medical assistants explore eye-care knowledge.
- Includes knowledge checks and Skills Passport language.
- Designed to pair with employer-supervised clinical training.

Avoid wording like this:

- Certified ophthalmic technician program.
- Guarantees employment.
- Guarantees promotion.
- Proves clinical competency.
- Replaces supervisor training.
- Approved by every employer or credentialing body.
- Covers every state, role, specialty, or practice policy.

## Early Buyer Feedback Form

After someone buys or seriously reviews the course, ask:

```text
1. What made the course feel useful?
2. What made you hesitate?
3. Which page or explanation was confusing?
4. What topic should be added next?
5. Would you recommend this to an individual learner, a practice, or both?
6. Can I quote your feedback publicly without your private details?
```

Only publish testimonials with written permission. Never include patient
details, private staff details, or private employer details.

For the first paid buyer, use the dedicated feedback packet so the questions,
testimonial consent, and continue-or-pause decision are recorded the same way
each time:

```bash
LAUNCH_FIRST_BUYER_FEEDBACK_REPORT_PATH=launch-evidence/first-buyer-feedback-packet.md pnpm launch:first-buyer-feedback https://your-real-domain.example -- --buyer-type=individual --email=buyer@example.com --offer=founding-learner
```

## First 30 Days After Launch

Week 1:

- Contact 10 warm leads.
- Ask for 3 feedback conversations.
- Run at least one full test purchase before sharing widely.
- Use `pnpm launch:first-week-sales` to split the work into daily actions.

Week 2:

- Follow up with anyone who replied.
- Ask one practice buyer what would make a seat pack easier to approve.
- Write down confusing questions and improve the FAQ or sales page.

Week 3:

- Share the individual learner link with career changers and medical assistants.
- Review `/checkout` learner interest leads in the protected Practice Seat
  Manager, send the learner decision one-pager, and invite founding access when
  paid enrollment opens.
- Share the practice pack link with managers or supervisors.
- Collect testimonials only with permission.

Week 4:

- Review sales, refund requests, support questions, and failed checkouts.
- Improve one buyer-facing page based on real feedback.
- Decide whether the next push should focus on individual learners or practices.

## Evidence To Save

Save this with launch evidence:

- First 10 buyer tracker.
- Outreach dates.
- Non-private feedback themes.
- Support questions.
- Refund requests and reasons.
- Safe testimonials with written permission.
- Sales-page improvements made from feedback.

Do not save secrets, raw checkout links, card numbers, patient information,
private learner details, private staff details, or private employer details.
