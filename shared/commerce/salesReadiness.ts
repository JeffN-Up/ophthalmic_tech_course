export interface BuyerPathSection {
  title: string;
  items: string[];
}

export interface LearnerStartStep {
  title: string;
  description: string;
}

export interface LearnerFirstMonthStep {
  timeframe: string;
  title: string;
  description: string;
}

export interface BuyerHandoffStep {
  title: string;
  description: string;
}

export interface BuyerConfidenceAnswer {
  question: string;
  answer: string;
}

export interface PurchaseAssurance {
  title: string;
  description: string;
}

export interface FoundingReleaseStatus {
  title: string;
  description: string;
}

export interface PracticeValueProofPoint {
  title: string;
  description: string;
}

export interface LearnerValueProofPoint {
  title: string;
  description: string;
}

export const individualLearnerSalesPath: BuyerPathSection[] = [
  {
    title: "Best fit",
    items: [
      "Career changers exploring ophthalmic assisting or technician work.",
      "Medical assistants who want eye-care vocabulary before changing roles.",
      "New technicians who need a safer way to learn clinic flow before hands-on practice.",
    ],
  },
  {
    title: "What learners can expect",
    items: [
      "Plain-language lessons for ophthalmic terms, clinic habits, and patient communication.",
      "Knowledge checks that help learners see what they understand and what needs review.",
      "Skills Passport language for future supervisor-observed practice.",
    ],
  },
  {
    title: "After payment",
    items: [
      "Stripe confirms payment and the app creates course access for the buyer email.",
      "The learner requests a passwordless sign-in link using the same email.",
      "Module 1 can be started right away when launch gates are enabled.",
    ],
  },
];

export const practiceBuyerSalesPath: BuyerPathSection[] = [
  {
    title: "Best fit",
    items: [
      "Practice managers onboarding more than one new technician.",
      "Supervisors who want every new hire to hear the same foundation first.",
      "Clinics that need online learning paired with local hands-on observation.",
    ],
  },
  {
    title: "What practices can expect",
    items: [
      "Seat packs for assigning access to multiple learner emails.",
      "Shared language for scope, safety, patient communication, and clinic readiness.",
      "Skills Passport materials that support supervisor feedback without replacing local signoff.",
    ],
  },
  {
    title: "After payment",
    items: [
      "Stripe confirms payment and the app creates the purchased seat pack.",
      "A manager uses the protected practice-seat tool to assign learner emails.",
      "Each assigned learner signs in with their own email and starts the course.",
    ],
  },
];

export const individualLearnerStartSteps: LearnerStartStep[] = [
  {
    title: "Use the same email at checkout",
    description:
      "Course access is created for the buyer email after Stripe confirms payment.",
  },
  {
    title: "Request your sign-in link",
    description:
      "Use the same email on the sign-in screen so the app can find your access.",
  },
  {
    title: "Start Module 1",
    description:
      "Begin with the published ophthalmic foundations lessons and knowledge checks.",
  },
  {
    title: "Keep hands-on skills supervised",
    description:
      "Use Skills Passport language with a supervisor, trainer, or future employer for observed practice.",
  },
];

export const individualLearnerFirstMonthPlan: LearnerFirstMonthStep[] = [
  {
    timeframe: "Days 1-3",
    title: "Get oriented",
    description:
      "Sign in with the checkout email, read the course limits, and complete the first Module 1 lesson without rushing.",
  },
  {
    timeframe: "Days 4-10",
    title: "Build the language",
    description:
      "Review ophthalmic vocabulary, clinic roles, patient communication, and knowledge checks until the words feel less unfamiliar.",
  },
  {
    timeframe: "Days 11-20",
    title: "Connect learning to practice",
    description:
      "Use the Skills Passport and Career Toolkit to write down what still needs supervisor observation or mentor discussion.",
  },
  {
    timeframe: "Days 21-30",
    title: "Prepare your next conversation",
    description:
      "Ask a supervisor, mentor, or future employer which hands-on skills should be observed next, without claiming independent competency.",
  },
];

export const individualBuyerHandoffSteps: BuyerHandoffStep[] = [
  {
    title: "Receipt and access email",
    description:
      "The buyer should see a Stripe receipt and know the same email is used for course sign-in.",
  },
  {
    title: "First sign-in attempt",
    description:
      "The learner requests a passwordless sign-in link and confirms Module 1 opens from their own account.",
  },
  {
    title: "First lesson completion",
    description:
      "The learner completes one short lesson or knowledge check so the purchase feels useful right away.",
  },
  {
    title: "Support path saved",
    description:
      "The buyer knows where to ask for account, refund-review, navigation, or technical help without sharing private clinical details.",
  },
];

export const practiceBuyerHandoffSteps: BuyerHandoffStep[] = [
  {
    title: "Receipt and seat pack record",
    description:
      "The practice buyer should see the Stripe receipt and know the purchase created a seat pack for the billing email.",
  },
  {
    title: "Practice lead identified",
    description:
      "A manager or supervisor is named as the person who will assign learner emails and answer local onboarding questions.",
  },
  {
    title: "Learner seats assigned",
    description:
      "Each learner gets their own email-based access, and the practice does not share one seat across multiple employees.",
  },
  {
    title: "Local signoff plan confirmed",
    description:
      "The practice pairs online foundations with local observation, hands-on training, and practice-specific protocols.",
  },
];

export const buyerConfidenceAnswers: BuyerConfidenceAnswer[] = [
  {
    question: "Is this a certification course?",
    answer:
      "No. OptiTech Academy is foundational education. It can help a learner understand ophthalmic vocabulary, clinic flow, and supervised practice expectations, but it does not replace certification, employer training, or hands-on competency signoff.",
  },
  {
    question: "Who is this best for?",
    answer:
      "It is best for career changers, medical assistants moving toward eye care, new ophthalmic technicians, and practices that want a consistent first layer of onboarding before local hands-on training.",
  },
  {
    question: "What happens after payment?",
    answer:
      "Stripe confirms the purchase, the app creates access for the buyer email, and the learner signs in with that same email to start the published course content.",
  },
  {
    question: "How do practice packs work?",
    answer:
      "A practice buys a seat pack, then assigns individual learner emails through the protected practice-seat tool. Supervisors still handle local protocols, observation, and job-specific signoff.",
  },
  {
    question: "Why buy while it is still a founding course?",
    answer:
      "Founding access gives early learners and practices the published foundations now, plus future modules released during the access period. Early feedback helps shape what gets improved next.",
  },
];

export const purchaseAssurances: PurchaseAssurance[] = [
  {
    title: "Stripe handles payment",
    description:
      "Checkout runs through Stripe, and this app does not store card details.",
  },
  {
    title: "Access follows the buyer email",
    description:
      "Use the same email for checkout and sign-in so the app can find the learner or practice access record.",
  },
  {
    title: "Support path is visible",
    description:
      "Buyers can contact support for account access, purchase questions, refund review, course navigation, and basic technical issues.",
  },
  {
    title: "Expectations stay honest",
    description:
      "The course supports foundational learning and supervised practice preparation; it does not promise certification, employment, or independent competency.",
  },
];

export const foundingReleaseStatus: FoundingReleaseStatus[] = [
  {
    title: "Published first",
    description:
      "Founding access starts with the published Module 1 foundations lessons, knowledge checks, and protected learner flow.",
  },
  {
    title: "Planned next",
    description:
      "The 10-day Bootcamp source path guides future releases after content review, asset migration, and accessibility checks.",
  },
  {
    title: "Reviewed before release",
    description:
      "Clinical education claims and course assets must pass review before they are presented as published learner content.",
  },
  {
    title: "Supervised skills stay local",
    description:
      "Hands-on practice, employer protocols, competency observation, and job decisions remain with the learner's practice or supervisor.",
  },
];

export const practiceValueProofPoints: PracticeValueProofPoint[] = [
  {
    title: "Same first explanation for every learner",
    description:
      "New hires hear the same foundation for clinic language, patient communication, scope, and safety before local hands-on training begins.",
  },
  {
    title: "Less repeated basic onboarding",
    description:
      "Supervisors can spend more time observing, coaching, and explaining practice-specific workflows instead of repeating the same starter vocabulary.",
  },
  {
    title: "Seat packs match small teams",
    description:
      "Six-seat and fifteen-seat packs give managers a simple way to plan access for one hiring class or a larger onboarding group.",
  },
  {
    title: "Local signoff stays local",
    description:
      "The course supports preparation and shared language, while clinical protocols, competency observation, and employment decisions stay with the practice.",
  },
];

export const learnerValueProofPoints: LearnerValueProofPoint[] = [
  {
    title: "Learn the language before the room feels overwhelming",
    description:
      "Build comfort with ophthalmic vocabulary, clinic roles, patient communication, and common exam flow before relying only on live shadowing.",
  },
  {
    title: "Study at your own pace",
    description:
      "Use 12 months of founding access to review published lessons, knowledge checks, and future released modules during the access period.",
  },
  {
    title: "Prepare for supervised practice conversations",
    description:
      "Skills Passport language helps learners talk with supervisors or future employers about what still needs hands-on observation.",
  },
  {
    title: "Explore eye care without overclaiming credentials",
    description:
      "The course helps learners decide whether ophthalmic assisting is a good direction while staying clear that completion is education, not certification.",
  },
];

export function getSalesPathItemCount(sections: BuyerPathSection[]): number {
  return sections.reduce((count, section) => count + section.items.length, 0);
}
