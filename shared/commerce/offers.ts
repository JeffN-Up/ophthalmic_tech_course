export interface CourseOffer {
  id: string;
  name: string;
  stripeLookupKey: string;
  priceCents: number;
  currency: "usd";
  accessMonths: number;
  description: string;
  includes: string[];
  limitations: string[];
}

export interface PracticePackOffer extends CourseOffer {
  seatCount: number;
  idealFor: string;
}

export interface PracticeInquiryOffer {
  id: "custom-practice-onboarding";
  name: string;
  description: string;
  idealFor: string;
  contactEmail: string;
  subject: string;
  emailBody: string;
  includes: string[];
  nextSteps: string[];
  limitations: string[];
}

export const foundingLearnerOffer: CourseOffer = {
  id: "founding-learner",
  name: "Founding Learner Access",
  stripeLookupKey: "optitech_founding_learner_299",
  priceCents: 29900,
  currency: "usd",
  accessMonths: 12,
  description:
    "Self-paced founding access to OptiTech Academy Ophthalmic Technician Foundations as published modules are released.",
  includes: [
    "Published Module 1 lessons and future modules released during the access period.",
    "Knowledge checks and module assessments for published content.",
    "Downloadable checklists and Skills Passport materials when available.",
    "Certificate of completion for finished published content after requirements are met.",
  ],
  limitations: [
    "Course completion is not certification.",
    "Online completion does not verify hands-on clinical competency.",
    "The course does not guarantee employment, exam eligibility, exam success, income, or promotion.",
    "Learners must follow employer policies, provider instructions, and applicable state or local rules.",
  ],
};

export const practicePackOffers: PracticePackOffer[] = [
  {
    id: "practice-six-seat-pack",
    name: "Six-Seat Practice Onboarding Pack",
    stripeLookupKey: "optitech_practice_6_seats_999",
    priceCents: 99900,
    currency: "usd",
    accessMonths: 12,
    seatCount: 6,
    idealFor:
      "Small practices training one hiring class or a few new team members.",
    description:
      "Practice onboarding access for up to six learners using the shared OptiTech Academy foundations course, Skills Passport, and career-readiness tools.",
    includes: [
      "Six learner seats with 12 months of access.",
      "Published course modules and future modules released during the access period.",
      "Skills Passport checklists for supervisor-led observation and signoff conversations.",
      "Career Toolkit materials learners can use for role-readiness conversations.",
    ],
    limitations: [
      "Online completion is not certification.",
      "OptiTech Academy does not independently verify hands-on competency.",
      "Supervisors remain responsible for practice-specific protocols, skill observation, and employment decisions.",
      "Practice-specific customization, live training, and implementation support require a separate agreement.",
    ],
  },
  {
    id: "practice-fifteen-seat-pack",
    name: "Fifteen-Seat Practice Onboarding Pack",
    stripeLookupKey: "optitech_practice_15_seats_1799",
    priceCents: 179900,
    currency: "usd",
    accessMonths: 12,
    seatCount: 15,
    idealFor:
      "Growing practices standardizing onboarding across multiple hires, locations, or supervisors.",
    description:
      "Expanded practice onboarding access for up to fifteen learners, designed to pair foundational online learning with supervisor-guided clinic training.",
    includes: [
      "Fifteen learner seats with 12 months of access.",
      "Shared onboarding language for clinic roles, scope, terminology, safety, and patient communication.",
      "Skills Passport materials for observed practice and supervisor feedback.",
      "Career and readiness tools that help learners discuss progress without overstating credentials.",
    ],
    limitations: [
      "Online completion is not certification.",
      "OptiTech Academy does not independently verify hands-on competency.",
      "The pack does not guarantee competency, retention, promotion, or staffing outcomes.",
      "Employer policies, provider instructions, and state or local requirements remain the practice's responsibility.",
    ],
  },
];

export const customPracticeInquiryOffer: PracticeInquiryOffer = {
  id: "custom-practice-onboarding",
  name: "Custom Practice Onboarding Conversation",
  description:
    "For larger teams, multi-location onboarding, Spindel pilot training, or practices that need help deciding which seat pack fits.",
  idealFor:
    "Practices that need more than 15 seats, want a rollout plan, or need to coordinate supervisors before purchase.",
  contactEmail: "jeff.chapin@spindeleye.com",
  subject: "OptiTech custom practice onboarding inquiry",
  emailBody: [
    "Hi Jeff,",
    "",
    "I am interested in OptiTech Academy practice onboarding.",
    "",
    "Practice name:",
    "Primary contact:",
    "Approximate learner count:",
    "Target onboarding timeline:",
    "Interested in: six seats / fifteen seats / larger custom quote",
    "Main onboarding challenge:",
    "",
    "I understand this course supports foundational learning and does not replace local supervision, clinical policy, or hands-on competency signoff.",
  ].join("\n"),
  includes: [
    "Seat-count planning before purchase.",
    "Discussion of supervisor roles and Skills Passport use.",
    "Review of what belongs in the national course versus local practice policy.",
  ],
  nextSteps: [
    "Share practice name, approximate learner count, and target onboarding timeline.",
    "Confirm whether the practice wants six seats, fifteen seats, or a larger custom quote.",
    "Keep clinical protocols, job duties, and hands-on signoff under local practice supervision.",
  ],
  limitations: [
    "A conversation is not a purchase agreement.",
    "Custom work, live training, and private practice-specific content require a separate written agreement.",
    "OptiTech Academy does not replace employer supervision, clinical policy, or hands-on competency signoff.",
  ],
};

export type CheckoutOffer = CourseOffer | PracticePackOffer;

export const checkoutOffers: CheckoutOffer[] = [
  foundingLearnerOffer,
  ...practicePackOffers,
];

export function getCheckoutOfferById(offerId?: string): CheckoutOffer {
  const selectedOfferId = offerId ?? foundingLearnerOffer.id;
  const offer = checkoutOffers.find(checkoutOffer => {
    return checkoutOffer.id === selectedOfferId;
  });

  if (!offer) {
    throw new Error("Unknown checkout offer.");
  }

  return offer;
}

export function isPracticePackOffer(
  offer: CheckoutOffer
): offer is PracticePackOffer {
  return "seatCount" in offer;
}

export function formatOfferPrice(offer: CourseOffer): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: offer.currency,
    maximumFractionDigits: 0,
  }).format(offer.priceCents / 100);
}

export function createMailtoHref({
  email,
  subject,
  body,
}: {
  email: string;
  subject: string;
  body?: string;
}): string {
  const params = [
    `subject=${encodeURIComponent(subject).replaceAll("%20", "+")}`,
  ];

  if (body) {
    params.push(`body=${encodeURIComponent(body)}`);
  }

  return `mailto:${email}?${params.join("&")}`;
}
