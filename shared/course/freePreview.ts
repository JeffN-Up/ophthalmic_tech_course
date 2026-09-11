export interface FreePreviewCheckpoint {
  prompt: string;
  safeAnswer: string;
  whyItMatters: string;
}

export interface FreePreviewLesson {
  title: string;
  audience: string;
  durationMinutes: number;
  outcome: string;
  lessonBody: string[];
  clinicConnection: string;
  patientFriendlyScript: string;
  checkpoint: FreePreviewCheckpoint;
  courseFit: string[];
  nextSteps: string[];
}

export const freePreviewLesson: FreePreviewLesson = {
  title: "What Ophthalmic Technicians Do",
  audience:
    "Career changers, medical assistants, new technicians, and practice managers previewing the teaching style.",
  durationMinutes: 8,
  outcome:
    "A practical first look at how ophthalmic technicians support accurate, safe eye-care visits.",
  lessonBody: [
    "Ophthalmic technicians help the eye-care team collect accurate information before the provider examines the patient.",
    "Common beginner tasks include confirming history, checking vision, preparing rooms, helping with diagnostic testing, documenting carefully, and telling the provider when something needs attention.",
    "The role matters because small details can change the visit. A missed medication, wrong eye, new symptom, or unreliable test can affect how smoothly the provider can care for the patient.",
  ],
  clinicConnection:
    "A technician is often the first clinical person the patient meets. Calm, accurate, respectful work helps the whole visit run better.",
  patientFriendlyScript:
    "I am part of the clinical team. I will gather your history and perform some starting tests so the doctor has accurate information for your exam.",
  checkpoint: {
    prompt:
      "A patient asks, 'Does my blurry vision mean I have glaucoma?' What is the safest beginner-tech response?",
    safeAnswer:
      "That is an important question for the doctor. I will make sure the provider knows what you are noticing.",
    whyItMatters:
      "The learner practices staying inside role boundaries while still helping the patient feel heard.",
  },
  courseFit: [
    "You want plain-language ophthalmic vocabulary before starting in clinic.",
    "You are a medical assistant exploring eye care.",
    "You train new hires and want everyone to hear the same first explanation.",
    "You want online foundations that pair with supervised hands-on practice.",
  ],
  nextSteps: [
    "Review the full curriculum to see the planned 10-day foundations path.",
    "Use the individual checkout page when paid enrollment is open.",
    "Use practice packs when a manager wants seats for a team.",
    "Read the policies page before buying so expectations stay clear.",
  ],
};
