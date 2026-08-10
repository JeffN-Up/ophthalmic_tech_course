export interface BuyerDecisionPrompt {
  question: string;
  whyItMatters: string;
}

export interface BuyerObjectionResponse {
  concern: string;
  safeAnswer: string;
  nextStep: string;
}

export interface BuyerDecisionGuide {
  id: "individual-learner" | "practice-manager";
  title: string;
  subtitle: string;
  summary: string;
  priceSummary: string;
  goodFit: string[];
  notFit: string[];
  gets: Array<{
    included: string;
    whyItHelps: string;
  }>;
  decisionPrompts: BuyerDecisionPrompt[];
  objectionResponses: BuyerObjectionResponse[];
  safeShareMessage: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}

export const individualLearnerDecisionGuide: BuyerDecisionGuide = {
  id: "individual-learner",
  title: "Individual Learner Decision Guide",
  subtitle: "For career changers, medical assistants, and new techs",
  summary:
    "OptiTech Academy helps learners build beginner eye-care vocabulary, clinic-flow understanding, patient communication habits, knowledge checks, and supervised practice preparation.",
  priceSummary: "Founding Learner Access is $299 for 12 months.",
  goodFit: [
    "You are a medical assistant who wants to understand eye care better.",
    "You are a career changer exploring ophthalmic assisting.",
    "You are a new ophthalmic technician who wants plain-language foundations.",
    "You want vocabulary and clinic-flow practice before asking supervisor questions.",
    "You understand hands-on skill signoff still belongs with an employer, supervisor, or qualified trainer.",
  ],
  notFit: [
    "You need official certification.",
    "You need a guaranteed job, promotion, exam result, or income outcome.",
    "You need state-specific legal, billing, or scope-of-practice advice.",
    "You need a replacement for employer training.",
    "You need proof that you can perform hands-on clinical tasks without observation.",
  ],
  gets: [
    {
      included: "Self-paced foundations course",
      whyItHelps:
        "Learn key ideas without needing to be in clinic every minute.",
    },
    {
      included: "Beginner-friendly ophthalmic vocabulary",
      whyItHelps: "Understand common words before they feel overwhelming.",
    },
    {
      included: "Knowledge checks",
      whyItHelps: "See what you understand and what needs review.",
    },
    {
      included: "Skills Passport language",
      whyItHelps: "Talk with supervisors about what still needs observation.",
    },
    {
      included: "Career-readiness and onboarding supports",
      whyItHelps: "Connect learning to real workplace conversations.",
    },
  ],
  decisionPrompts: [
    {
      question: "Am I interested in eye care or ophthalmic assisting?",
      whyItMatters:
        "The course works best when the learner wants this specific career direction.",
    },
    {
      question: "Do I want beginner-friendly foundations?",
      whyItMatters:
        "The founding course starts with entry-level language and clinic context.",
    },
    {
      question: "Do I understand this is not certification?",
      whyItMatters:
        "Honest expectations prevent the course from being oversold.",
    },
    {
      question:
        "Do I have a supervisor, mentor, or future employer who can observe hands-on skills?",
      whyItMatters:
        "Online learning supports practice, but it does not replace supervised observation.",
    },
  ],
  objectionResponses: [
    {
      concern: "I am brand new to eye care.",
      safeAnswer:
        "That is the intended learner. The course starts with plain-language ophthalmic foundations before moving into clinic habits and knowledge checks.",
      nextStep: "Try the free preview, then review individual access.",
    },
    {
      concern: "Is this a certification course?",
      safeAnswer:
        "No. It is foundational education for ophthalmic vocabulary, clinic flow, patient communication, and supervised practice preparation.",
      nextStep: "Read the policies page before deciding.",
    },
    {
      concern: "I need to ask my manager first.",
      safeAnswer:
        "That is a good idea if you want the course to support your current or future supervised training.",
      nextStep: "Use the safe share message or send the buyer guide.",
    },
    {
      concern: "What if it is not a fit?",
      safeAnswer:
        "The course has posted policies and a support path for account, navigation, purchase, and refund-review questions.",
      nextStep: "Review policies and support expectations before checkout.",
    },
  ],
  safeShareMessage:
    "I am considering OptiTech Academy, a self-paced ophthalmic technician foundations course. It focuses on beginner ophthalmic vocabulary, clinic flow, patient communication, knowledge checks, and supervised practice preparation. It is not certification and does not replace employer training or hands-on competency signoff. Would this be useful before or during supervised training?",
  primaryCta: {
    label: "Review individual access",
    href: "/checkout",
  },
  secondaryCta: {
    label: "Try the free preview",
    href: "/preview",
  },
};

export const practiceManagerDecisionGuide: BuyerDecisionGuide = {
  id: "practice-manager",
  title: "Practice Manager Approval Guide",
  subtitle: "For managers, supervisors, owners, and training leads",
  summary:
    "OptiTech Academy gives new ophthalmic technicians and medical assistants a more consistent onboarding starting point before the practice teaches local workflow.",
  priceSummary:
    "Practice options include six seats for $999, fifteen seats for $1,799, and custom conversations for larger rollouts.",
  goodFit: [
    "Your practice trains new ophthalmic technicians or medical assistants.",
    "Supervisors repeat the same starter explanations often.",
    "You want every new learner to hear the same first layer of vocabulary and safety expectations.",
    "You want online foundations paired with local hands-on observation.",
    "You need a simple seat-pack option for one hiring class or onboarding group.",
  ],
  notFit: [
    "You need a certification program.",
    "You need the course to replace local policy, supervision, or competency signoff.",
    "You need practice-specific protocols written into the national course.",
    "You need guaranteed staffing, retention, productivity, or promotion outcomes.",
  ],
  gets: [
    {
      included: "Shared first explanation",
      whyItHelps:
        "New hires start with the same vocabulary, scope, and safety language.",
    },
    {
      included: "Seat packs",
      whyItHelps:
        "Managers can buy access for a small hiring class or larger onboarding group.",
    },
    {
      included: "Skills Passport language",
      whyItHelps:
        "Supervisors get cleaner prompts for observed practice conversations.",
    },
    {
      included: "Career and readiness tools",
      whyItHelps:
        "Learners can discuss progress without overstating credentials.",
    },
  ],
  decisionPrompts: [
    {
      question: "How many learners need access?",
      whyItMatters:
        "The answer points to six seats, fifteen seats, or a custom conversation.",
    },
    {
      question: "Who will be the practice contact?",
      whyItMatters: "Seat assignment and follow-up need a clear owner.",
    },
    {
      question: "Who will supervise Skills Passport review?",
      whyItMatters: "Hands-on observation stays inside the practice.",
    },
    {
      question: "Which start date or hiring class is this for?",
      whyItMatters: "A clear timeline makes the purchase easier to approve.",
    },
  ],
  objectionResponses: [
    {
      concern: "Can this replace in-office training?",
      safeAnswer:
        "No. It can make the first layer of onboarding more consistent, but local protocols, observation, and hands-on signoff still belong with the practice.",
      nextStep: "Use the practice-pack page or a custom practice conversation.",
    },
    {
      concern: "How do I justify this to an owner?",
      safeAnswer:
        "The practice-pack page includes a planning tool that compares seat-pack cost with supervisor time spent repeating basic onboarding foundations. It is an estimate, not a promise.",
      nextStep: "Send the practice-pack page and buyer guide.",
    },
    {
      concern: "What if we need more than 15 seats?",
      safeAnswer:
        "Larger rollouts should start with a custom practice conversation so seat count, timeline, and onboarding goals are clear before purchase.",
      nextStep: "Use the custom practice inquiry form.",
    },
    {
      concern: "Can we add our doctor-specific protocols?",
      safeAnswer:
        "Practice-specific workflows and doctor protocols should stay in the private Spindel/practice onboarding layer, not the national public course.",
      nextStep:
        "Discuss private onboarding needs separately from public course checkout.",
    },
  ],
  safeShareMessage:
    "I am reviewing OptiTech Academy as a possible onboarding support tool for new ophthalmic technicians and medical assistants moving into eye care. The course is self-paced and focuses on ophthalmic vocabulary, clinic flow, patient communication, knowledge checks, and supervised practice preparation. It is not a certification program and does not replace our internal policies, hands-on training, or competency signoff. Could we review whether this fits our onboarding budget?",
  primaryCta: {
    label: "Review practice packs",
    href: "/practice-packs",
  },
  secondaryCta: {
    label: "Try the free preview",
    href: "/preview",
  },
};

export const buyerDecisionGuides = [
  individualLearnerDecisionGuide,
  practiceManagerDecisionGuide,
] as const;
