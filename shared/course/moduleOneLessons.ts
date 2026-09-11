import { getCourseSource } from "./sourceInventory";
import type { ContentReview, Lesson } from "./types";

const draftReview: ContentReview = {
  author: "OptiTech Academy",
  clinicalReviewer: "Clinical review required before production sale",
  reviewStatus: "draft-reviewed-for-structure",
  reviewDate: "2026-06-26",
  nextReviewDate: "2026-09-26",
};

export const moduleOneLessons: Lesson[] = [
  {
    id: "m1-l1-what-techs-do",
    moduleId: "entering-ophthalmic-care",
    title: "What Ophthalmic Technicians Do",
    durationMinutes: 12,
    status: "published",
    outcome:
      "A practical first look at how ophthalmic technicians support accurate, safe eye-care visits.",
    body: [
      "Ophthalmic technicians help the eye-care team collect accurate information before the provider examines the patient.",
      "Common beginner tasks include confirming history, checking vision, preparing rooms, helping with diagnostic testing, documenting carefully, and telling the provider when something needs attention.",
      "The technician role is powerful because small details can change the visit. A missed medication, wrong eye, new symptom, or unreliable test can affect care.",
    ],
    clinicContext:
      "A technician is often the first clinical person the patient meets. Calm, accurate, respectful work helps the provider make better decisions.",
    commonMistakes: [
      "Guessing instead of asking a supervisor.",
      "Using medical words the patient does not understand.",
      "Documenting what was not actually asked or observed.",
    ],
    patientFriendlyScript:
      "I am part of the clinical team. I will gather your history and perform some starting tests so the doctor has accurate information for your exam.",
    scenarioPrompt:
      "A patient asks whether their blurry vision means they have glaucoma. Choose the answer that stays inside the technician role.",
    scopeNote:
      "This lesson does not teach diagnosis. Learners practice role clarity, documentation, and escalation.",
    sources: [
      getCourseSource("drive-bootcamp-curriculum"),
      getCourseSource("onet-ophthalmic-medical-technicians"),
    ],
    review: draftReview,
  },
  {
    id: "m1-l2-patient-journey",
    moduleId: "entering-ophthalmic-care",
    title: "The Eye Clinic Patient Journey",
    durationMinutes: 15,
    status: "published",
    outcome: "Map the patient visit from check-in through provider handoff.",
    body: [
      "A typical eye visit moves from scheduling and check-in to technician workup, diagnostic testing, provider examination, checkout, and follow-up instructions.",
      "Technicians help the handoff work smoothly by checking identity, updating history, noting the chief complaint, recording testing quality, and flagging urgent symptoms.",
      "Different practices use different equipment and workflows. The important beginner habit is to understand the next person who needs your information.",
    ],
    clinicContext:
      "Clinic flow is like a relay race. If the technician passes clear information forward, the provider can move faster and safer.",
    commonMistakes: [
      "Treating every visit type the same.",
      "Forgetting to mention testing problems.",
      "Assuming the provider already knows a new symptom.",
    ],
    patientFriendlyScript:
      "I will start by confirming why you are here today and checking a few measurements. Then I will make sure the doctor has the key details.",
    scenarioPrompt:
      "A patient reports new flashes and floaters during a routine visit. Decide what should happen next.",
    scopeNote:
      "This lesson does not teach diagnosis. Learners practice recognizing when information should be escalated.",
    sources: [
      getCourseSource("drive-bootcamp-syllabus"),
      getCourseSource("drive-clinical-pattern-hpi"),
    ],
    review: draftReview,
  },
  {
    id: "m1-l3-professional-boundaries",
    moduleId: "entering-ophthalmic-care",
    title: "Professional Boundaries, Privacy, and Escalation",
    durationMinutes: 18,
    status: "published",
    outcome:
      "Choose safe responses when patients ask questions outside beginner scope.",
    body: [
      "Patients may ask technicians for results, predictions, medication advice, or reassurance. A safe technician does not guess.",
      "Privacy means discussing patient information only with the care team members who need it for the patient's care.",
      "Escalation is a strength. New pain, sudden vision change, wrong-eye confusion, medication allergy concerns, and uncertain instructions should be brought to the provider or supervisor.",
    ],
    clinicContext:
      "Professional boundaries protect the patient, the practice, and the learner. Clear escalation is one of the most important beginner skills.",
    commonMistakes: [
      "Answering a medical question because the patient seems anxious.",
      "Talking about patient details in public spaces.",
      "Waiting until the end of the visit to report urgent symptoms.",
    ],
    patientFriendlyScript:
      "That is an important question for the doctor. I will make sure it is brought to their attention.",
    scenarioPrompt:
      "A patient asks if they should stop an eye drop because it burns. Select the response that protects safety and scope.",
    scopeNote:
      "This lesson does not teach diagnosis or medication management. Learners practice privacy and escalation habits.",
    sources: [
      getCourseSource("drive-bootcamp-curriculum"),
      getCourseSource("drive-clinical-pattern-hpi"),
    ],
    review: draftReview,
  },
];
