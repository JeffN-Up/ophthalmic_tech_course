export type BootcampAssetKind = "video" | "pdf" | "audio" | "image";

export interface BootcampSourceAsset {
  title: string;
  kind: BootcampAssetKind;
  sourceFilename: string;
  storageKey: string;
  freePreview?: boolean;
}

export interface BootcampSourceDay {
  day: number;
  slug: string;
  title: string;
  subtitle: string;
  outcomes: string[];
  clinicTasks: string[];
  assets: BootcampSourceAsset[];
  notebook: {
    title: string;
    clinicalPearls: string[];
    reviewPrompts: string[];
  };
  freePreview?: boolean;
}

export const bootcampSourceFolderUrl =
  "https://drive.google.com/drive/folders/1tEGzMv4hXrCjZQwMnXyD2eWXqp1JkT5q";

export const bootcampNotebookLmUrl =
  "https://notebook.google.com/notebook/a4bc6fed-4059-4597-a60f-a43aa78ff3e1";

export const legacyBootcampNotebookLmUrl =
  "https://notebooklm.google.com/notebook/a4bc6fed-4059-4597-a60f-a43aa78ff3e1";

export const bootcampSiteCourseDataUrl =
  "https://drive.google.com/file/d/1TudG-Dq6Fgdl3-TFTQSeMKHahAe5leuI";

export const bootcampDriveAssetUrlsByFilename: Record<string, string> = {
  "Ophthalmic_Tech_Foundations.mp4":
    "https://drive.google.com/file/d/14Y-TfuF5TEgmUaJy6_XmCKqqfxgJ6gPr/view?usp=drivesdk",
  "Intro-Demystifying_the_Eye_Exam.mp4":
    "https://drive.google.com/file/d/1xQs-q7zdmpGQGHMSdwwwszblhySHXS98/view?usp=drivesdk",
  "The_Biological_Camera.pdf":
    "https://drive.google.com/file/d/1eOjJtoMa6OjBVU2tV6lyziyIqNob-rVd/view?usp=drivesdk",
  "Dutie overview infographic.png":
    "https://drive.google.com/file/d/1vvE8GonNYrjIFnCUvypEgY2m2KlO_WpL/view?usp=drivesdk",
  "Mod_2_Video_Overiew_Anatomy.mp4":
    "https://drive.google.com/file/d/1ioMTQG1VCXtOlZhjyoh2CubdwjfZ--4R/view?usp=drivesdk",
  "Mod_1_audio_overview.m4a":
    "https://drive.google.com/file/d/1bb4Y-wvKriX5exuL4xnzbXJxiZP-28OW/view?usp=drivesdk",
  "Ophthalmic_Technician_Blueprint.pdf":
    "https://drive.google.com/file/d/16jsqgMRaPwn5GS6r6aFfHMcY35UPFzsl/view?usp=drivesdk",
  "Day_3-_Diagnostics.mp4":
    "https://drive.google.com/file/d/1sNIlCT9jm8CQ-0-ID0Q9reoJuhReTb8c/view?usp=drivesdk",
  "Day_3-Diagnostic_slide_deck_(2).pdf":
    "https://drive.google.com/file/d/1MQb8WaF-X_jeFvBaw4jdJR0RdU9863AD/view?usp=drivesdk",
  "Mastering_Ophthalmic_Diagnostics_(2).pdf":
    "https://drive.google.com/file/d/1pGaICipwBsBzgZuhZ1HklKxr4jxCQMGO/view?usp=drivesdk",
  "Advanced_Ocular_Diagnostic_Masterclass.pdf":
    "https://drive.google.com/file/d/1LgDnbIWf08gdPMHTAA6FDU1zBzsaabKq/view?usp=drivesdk",
  "Diagnostics infographic.png":
    "https://drive.google.com/file/d/1E8nQkUobIj8yZSF3LClNqJoAJisnTFsu/view?usp=drivesdk",
  "Day_4-Common_Eye_Diseases.mp4":
    "https://drive.google.com/file/d/1YeZ21NeTEoaslUZrOaruOZP-JbWub-O0/view?usp=drivesdk",
  "Clinical Pattern Recognition & HPI Cheat Sheet.pdf":
    "https://drive.google.com/file/d/1z8WK7J8tWCZMphR7rAU0IIFf6676OiPI/view?usp=drivesdk",
  "Keratoconus image Jeff.png":
    "https://drive.google.com/file/d/1sf7Er-VydQoOuquKEtnWS6xNwR8vigh1/view?usp=drivesdk",
  "Lensometry__A_Practical_Guide.mp4":
    "https://drive.google.com/file/d/1qSqRYXOq8fW0_ZcijX19vFULezKvoBE9/view?usp=drivesdk",
  "Mastering_Manual_Lensometry.pdf":
    "https://drive.google.com/file/d/1ti9jf0wxmY894VVXJwwS4MQzyV4aGo9p/view?usp=drivesdk",
  "Lensometry_Blueprint_(3).pdf":
    "https://drive.google.com/file/d/1VkavmW_6F3aJ_jCvZ3bYFk9CKjsdkGYj/view?usp=drivesdk",
  "Clinical Guide_ Manual Lensometry Standards and Procedures.pdf":
    "https://drive.google.com/file/d/1mbyhMQlhD6aU1rVagpNE7XLgVNd1FfF_/view?usp=drivesdk",
  "Precision_Lens_Topography.pdf":
    "https://drive.google.com/file/d/1ZPMCeUtJsOrRumrJBvxXzyZC0FqSJmlu/view?usp=drivesdk",
  "Mastering_Tonometry.mp4":
    "https://drive.google.com/file/d/1O2zLy0mrA2lsq-Wzwl0ojkM2aqfVqjIb/view?usp=drivesdk",
  "Guide to Tonometry Infographic.png":
    "https://drive.google.com/file/d/1yunBZUEjPZQmuSI2LgRGTMfMEbvY3UFn/view?usp=drivesdk",
  "Goldmann jeff.png":
    "https://drive.google.com/file/d/1tzPmtpQ18mEnyZ1UVwASxWAQ6UMAqioI/view?usp=drivesdk",
  "Refraction_Troubleshooting.mp4":
    "https://drive.google.com/file/d/1TVeyDDm_tRkcsWiCSGnXkE-2HtabM8dH/view?usp=drivesdk",
  "Ocular_Diagnostic_Mapping.pdf":
    "https://drive.google.com/file/d/1Sx_3bs1maOg0mxlfuGcSR7FQyj7MFiXn/view?usp=drivesdk",
  "Day_5-Exam_Room_Skills_&_Pharma.mp4":
    "https://drive.google.com/file/d/12LLtfU7FWeRZ2u6ta0i4h6GpDPyDe96y/view?usp=drivesdk",
  "Clinical Guide_ Soft Skills and Patient Care for Ophthalmic Professionals.pdf":
    "https://drive.google.com/file/d/1mORkc-KtbikRBdbxcuFHcjmZ-3z83Kjx/view?usp=drivesdk",
  "Day_6-Professional_Skills_&_EMR.mp4":
    "https://drive.google.com/file/d/1d1dSPBVRx_cMvoxEwzaG2HtQn3wmuQ9d/view?usp=drivesdk",
  "Clinical_Simulation_Capstone_(2).pdf":
    "https://drive.google.com/file/d/15MoE6g3JPcaZzOj11JybxsbPbT_r9cin/view?usp=drivesdk",
  "COA_Certification_Guide.mp4":
    "https://drive.google.com/file/d/16z4WLmIV3HMZzfDmqV58RhxS15GJbFBa/view?usp=drivesdk",
  "COA_Certification_Roadmap.mp4":
    "https://drive.google.com/file/d/1iVFwJo0AS_B72ulcjUddermBpJxkVjyE/view?usp=drivesdk",
  "Career paths infographic.png":
    "https://drive.google.com/file/d/1VsqsOIQa5FFQAIbnJzs72jvlMnYuvqT3/view?usp=drivesdk",
};

export function getBootcampDriveAssetUrl(
  sourceFilename: string
): string | undefined {
  return bootcampDriveAssetUrlsByFilename[sourceFilename];
}

export const bootcampSourceDays: BootcampSourceDay[] = [
  {
    day: 1,
    slug: "foundations-first-patient-encounter",
    title: "Foundations and the First Patient Encounter",
    subtitle:
      "Clinic flow, patient intake, acuity basics, abbreviations, and infection control.",
    freePreview: true,
    outcomes: [
      "Explain the technician role in a busy ophthalmology clinic.",
      "Perform a pre-visit chart review and prepare the room.",
      "Document OD, OS, OU, chief complaint, and basic history accurately.",
    ],
    clinicTasks: [
      "Chart review",
      "Chief complaint",
      "Visual acuity",
      "Room turnover",
    ],
    assets: [
      {
        title: "Ophthalmic Tech Foundations",
        kind: "video",
        sourceFilename: "Ophthalmic_Tech_Foundations.mp4",
        storageKey: "videos/day-01/ophthalmic-tech-foundations.mp4",
        freePreview: true,
      },
      {
        title: "Intro: Demystifying the Eye Exam",
        kind: "video",
        sourceFilename: "Intro-Demystifying_the_Eye_Exam.mp4",
        storageKey: "videos/day-01/intro-demystifying-the-eye-exam.mp4",
        freePreview: true,
      },
      {
        title: "The Biological Camera",
        kind: "pdf",
        sourceFilename: "The_Biological_Camera.pdf",
        storageKey: "pdfs/day-01/the-biological-camera.pdf",
      },
      {
        title: "Duties Overview Infographic",
        kind: "image",
        sourceFilename: "Dutie overview infographic.png",
        storageKey: "images/day-01/duties-overview-infographic.png",
        freePreview: true,
      },
    ],
    notebook: {
      title: "First Encounter Study Notes",
      clinicalPearls: [
        "The best technician encounter starts before the patient enters the room.",
        "Accurate abbreviations prevent downstream clinical errors.",
        "Infection control is a patient-safety habit, not a closing task.",
      ],
      reviewPrompts: [
        "What must be checked before calling a patient back?",
        "How do OD, OS, and OU differ?",
        "When should pinhole testing be used?",
      ],
    },
  },
  {
    day: 2,
    slug: "anatomy-biological-camera",
    title: "Anatomy and the Biological Camera",
    subtitle:
      "Core eye structures, optical pathways, and how anatomy connects to testing.",
    outcomes: [
      "Identify major ocular structures and their clinical relevance.",
      "Describe how the cornea, lens, retina, and optic nerve support vision.",
      "Connect anatomy findings to common testing decisions.",
    ],
    clinicTasks: ["Anatomy language", "Patient education", "Exam preparation"],
    assets: [
      {
        title: "Module 2: Anatomy Overview",
        kind: "video",
        sourceFilename: "Mod_2_Video_Overiew_Anatomy.mp4",
        storageKey: "videos/day-02/mod-2-anatomy-overview.mp4",
      },
      {
        title: "Module 1 Audio Overview",
        kind: "audio",
        sourceFilename: "Mod_1_audio_overview.m4a",
        storageKey: "audio/day-02/mod-1-audio-overview.m4a",
      },
      {
        title: "Ophthalmic Technician Blueprint",
        kind: "pdf",
        sourceFilename: "Ophthalmic_Technician_Blueprint.pdf",
        storageKey: "pdfs/day-02/ophthalmic-technician-blueprint.pdf",
      },
    ],
    notebook: {
      title: "Anatomy Quick Recall",
      clinicalPearls: [
        "A technician does not need to diagnose to recognize which structure a test is evaluating.",
        "The cornea and lens shape incoming light before the retina interprets it.",
        "Optic nerve findings often connect visual fields, OCT, and pressure history.",
      ],
      reviewPrompts: [
        "What does the retina do?",
        "Why is corneal clarity important?",
        "Which tests relate to glaucoma monitoring?",
      ],
    },
  },
  {
    day: 3,
    slug: "diagnostic-testing-map",
    title: "Essential Diagnostic Testing",
    subtitle:
      "Tonometry, visual fields, OCT, fundus photography, pachymetry, and topography.",
    outcomes: [
      "State the purpose of six primary ophthalmic diagnostic tests.",
      "Separate normal from abnormal result patterns at an entry level.",
      "Prepare patients and equipment for common diagnostic workflows.",
    ],
    clinicTasks: [
      "IOP measurement",
      "OCT prep",
      "Visual field setup",
      "Topography basics",
    ],
    assets: [
      {
        title: "Day 3 Diagnostics Video",
        kind: "video",
        sourceFilename: "Day_3-_Diagnostics.mp4",
        storageKey: "videos/day-03/day-3-diagnostics.mp4",
      },
      {
        title: "Day 3 Diagnostic Slide Deck",
        kind: "pdf",
        sourceFilename: "Day_3-Diagnostic_slide_deck_(2).pdf",
        storageKey: "pdfs/day-03/day-3-diagnostic-slide-deck.pdf",
      },
      {
        title: "Mastering Ophthalmic Diagnostics",
        kind: "pdf",
        sourceFilename: "Mastering_Ophthalmic_Diagnostics_(2).pdf",
        storageKey: "pdfs/day-03/mastering-ophthalmic-diagnostics.pdf",
      },
      {
        title: "Advanced Ocular Diagnostic Masterclass",
        kind: "pdf",
        sourceFilename: "Advanced_Ocular_Diagnostic_Masterclass.pdf",
        storageKey: "pdfs/day-03/advanced-ocular-diagnostic-masterclass.pdf",
      },
      {
        title: "Diagnostics Infographic",
        kind: "image",
        sourceFilename: "Diagnostics infographic.png",
        storageKey: "images/day-03/diagnostics-infographic.png",
      },
    ],
    notebook: {
      title: "Diagnostics Pattern Notebook",
      clinicalPearls: [
        "A diagnostic test has three jobs: measure, document, and guide the physician's next decision.",
        "Visual field defects are described by location, reliability, and repeatability.",
        "Pachymetry changes how pressure readings are interpreted.",
      ],
      reviewPrompts: [
        "What does OCT image?",
        "Why does pachymetry matter for glaucoma?",
        "What makes a visual field unreliable?",
      ],
    },
  },
  {
    day: 4,
    slug: "common-eye-diseases",
    title: "Common Eye Diseases and Red Flags",
    subtitle:
      "Clinical pattern recognition for glaucoma, cataracts, diabetic eye disease, macular degeneration, and keratoconus.",
    outcomes: [
      "Recognize common disease patterns from symptoms and test findings.",
      "Capture an HPI that helps the physician localize the problem.",
      "Escalate urgent symptoms appropriately.",
    ],
    clinicTasks: ["HPI structure", "Disease vocabulary", "Urgency screening"],
    assets: [
      {
        title: "Common Eye Diseases",
        kind: "video",
        sourceFilename: "Common_Eye_Diseases.mp4",
        storageKey: "videos/day-04/common-eye-diseases.mp4",
      },
      {
        title: "Day 4 Common Eye Diseases",
        kind: "video",
        sourceFilename: "Day_4-Common_Eye_Diseases.mp4",
        storageKey: "videos/day-04/day-4-common-eye-diseases.mp4",
      },
      {
        title: "Clinical Pattern Recognition and HPI Cheat Sheet",
        kind: "pdf",
        sourceFilename: "Clinical Pattern Recognition & HPI Cheat Sheet.pdf",
        storageKey:
          "pdfs/day-04/clinical-pattern-recognition-hpi-cheat-sheet.pdf",
      },
      {
        title: "Keratoconus Corneal Morphology",
        kind: "image",
        sourceFilename: "Keratoconus image Jeff.png",
        storageKey: "images/day-04/keratoconus-image-jeff.png",
      },
    ],
    notebook: {
      title: "Disease Recognition Notebook",
      clinicalPearls: [
        "Symptoms, duration, laterality, and vision change are the backbone of HPI.",
        "Keratoconus often connects irregular astigmatism, topography changes, and reduced best-corrected acuity.",
        "Sudden vision loss, flashes, curtain vision, and severe pain require escalation.",
      ],
      reviewPrompts: [
        "Which symptoms are urgent?",
        "How does keratoconus affect topography?",
        "What should a technician document before the doctor enters?",
      ],
    },
  },
  {
    day: 5,
    slug: "lensometry-practical-guide",
    title: "Manual Lensometry",
    subtitle:
      "Lensometer setup, sphere/cylinder/axis, add power, prism, and troubleshooting.",
    outcomes: [
      "Set up a manual lensometer and neutralize lenses consistently.",
      "Record sphere, cylinder, axis, add, and prism using standard notation.",
      "Troubleshoot unclear mires and progressive lens markings.",
    ],
    clinicTasks: [
      "Lensometer calibration",
      "Rx reading",
      "Progressive lens verification",
    ],
    assets: [
      {
        title: "Lensometry: A Practical Guide",
        kind: "video",
        sourceFilename: "Lensometry__A_Practical_Guide.mp4",
        storageKey: "videos/day-05/lensometry-a-practical-guide.mp4",
      },
      {
        title: "Mastering Manual Lensometry",
        kind: "pdf",
        sourceFilename: "Mastering_Manual_Lensometry.pdf",
        storageKey: "pdfs/day-05/mastering-manual-lensometry.pdf",
      },
      {
        title: "Lensometry Blueprint",
        kind: "pdf",
        sourceFilename: "Lensometry_Blueprint_(3).pdf",
        storageKey: "pdfs/day-05/lensometry-blueprint.pdf",
      },
      {
        title: "Manual Lensometry Standards and Procedures",
        kind: "pdf",
        sourceFilename:
          "Clinical Guide_ Manual Lensometry Standards and Procedures.pdf",
        storageKey:
          "pdfs/day-05/manual-lensometry-standards-and-procedures.pdf",
      },
      {
        title: "Precision Lens Topography",
        kind: "pdf",
        sourceFilename: "Precision_Lens_Topography.pdf",
        storageKey: "pdfs/day-05/precision-lens-topography.pdf",
      },
    ],
    notebook: {
      title: "Lensometry Standards Notebook",
      clinicalPearls: [
        "Consistency matters more than speed while learning lensometry.",
        "Cylinder power and axis should be documented exactly as measured.",
        "Progressive lenses require locating reference markings before final verification.",
      ],
      reviewPrompts: [
        "How do you find axis?",
        "What does add power represent?",
        "What causes unclear mires?",
      ],
    },
  },
  {
    day: 6,
    slug: "tonometry-goldmann-and-alternatives",
    title: "Tonometry and Eye Pressure Methods",
    subtitle:
      "Goldmann applanation, non-contact tonometry, mires, calibration, and pressure documentation.",
    outcomes: [
      "Explain why Goldmann applanation is the clinical gold standard.",
      "Identify correct mire alignment and common endpoint errors.",
      "Compare Goldmann, NCT, iCare, Tonopen, and Schiotz methods.",
    ],
    clinicTasks: ["GAT setup", "Mire troubleshooting", "Pressure recording"],
    assets: [
      {
        title: "Mastering Tonometry",
        kind: "video",
        sourceFilename: "Mastering_Tonometry.mp4",
        storageKey: "videos/day-06/mastering-tonometry.mp4",
      },
      {
        title: "Guide to Tonometry Infographic",
        kind: "image",
        sourceFilename: "Guide to Tonometry Infographic.png",
        storageKey: "images/day-06/guide-to-tonometry-infographic.png",
      },
      {
        title: "Goldmann Tonometry Reference",
        kind: "image",
        sourceFilename: "Goldmann jeff.png",
        storageKey: "images/day-06/goldmann-jeff.png",
      },
    ],
    notebook: {
      title: "Tonometry Troubleshooting Notebook",
      clinicalPearls: [
        "Thick mires often suggest too much fluorescein or tearing.",
        "Thin mires often suggest dry eye or insufficient dye.",
        "Pressure readings are more useful when method, time, and reliability are clear.",
      ],
      reviewPrompts: [
        "What is the official GAT endpoint?",
        "When might NCT be less accurate?",
        "How do corneal factors affect IOP?",
      ],
    },
  },
  {
    day: 7,
    slug: "refraction-troubleshooting",
    title: "Refraction Support and Troubleshooting",
    subtitle:
      "How technicians support refraction workflow and recognize common testing problems.",
    outcomes: [
      "Prepare patients for refraction and document relevant history.",
      "Recognize causes of inconsistent acuity and refraction responses.",
      "Use pinhole, old glasses, and symptom history to improve context.",
    ],
    clinicTasks: [
      "Acuity troubleshooting",
      "Old Rx comparison",
      "Patient coaching",
    ],
    assets: [
      {
        title: "Refraction Troubleshooting",
        kind: "video",
        sourceFilename: "Refraction_Troubleshooting.mp4",
        storageKey: "videos/day-07/refraction-troubleshooting.mp4",
      },
      {
        title: "Ocular Diagnostic Mapping",
        kind: "pdf",
        sourceFilename: "Ocular_Diagnostic_Mapping.pdf",
        storageKey: "pdfs/day-07/ocular-diagnostic-mapping.pdf",
      },
      {
        title: "Ocular Diagnostic Mapping Edit",
        kind: "pdf",
        sourceFilename: "Ocular_Diagnostic_Mapping edit.pdf",
        storageKey: "pdfs/day-07/ocular-diagnostic-mapping-edit.pdf",
      },
    ],
    notebook: {
      title: "Refraction Support Notebook",
      clinicalPearls: [
        "Patient coaching should clarify choices without leading the patient.",
        "Old glasses provide context for large prescription changes.",
        "Reduced pinhole improvement can point the physician toward non-refractive causes.",
      ],
      reviewPrompts: [
        "Why compare old glasses?",
        "What does pinhole improvement suggest?",
        "How should uncertain responses be documented?",
      ],
    },
  },
  {
    day: 8,
    slug: "exam-room-skills-pharma",
    title: "Exam Room Skills and Pharmacology",
    subtitle:
      "Rooming, drops, patient safety, medication history, and supporting physician flow.",
    outcomes: [
      "Collect medication and allergy history safely.",
      "Support efficient exam-room flow without sacrificing patient care.",
      "Understand entry-level ophthalmic medication categories.",
    ],
    clinicTasks: ["Medication history", "Drop safety", "Physician support"],
    assets: [
      {
        title: "Day 5: Exam Room Skills and Pharma",
        kind: "video",
        sourceFilename: "Day_5-Exam_Room_Skills_&_Pharma.mp4",
        storageKey: "videos/day-08/day-5-exam-room-skills-and-pharma.mp4",
      },
      {
        title: "Soft Skills and Patient Care",
        kind: "pdf",
        sourceFilename:
          "Clinical Guide_ Soft Skills and Patient Care for Ophthalmic Professionals.pdf",
        storageKey: "pdfs/day-08/soft-skills-and-patient-care.pdf",
      },
    ],
    notebook: {
      title: "Exam Room Skills Notebook",
      clinicalPearls: [
        "A clear medication history includes name, dose when known, and patient confidence.",
        "Patient education should be simple, calm, and within technician scope.",
        "Safety checks prevent avoidable drop and allergy errors.",
      ],
      reviewPrompts: [
        "What belongs in medication history?",
        "What should be escalated to the physician?",
        "How can room flow stay patient-centered?",
      ],
    },
  },
  {
    day: 9,
    slug: "professional-skills-emr",
    title: "Professional Skills and EMR Documentation",
    subtitle:
      "Soft skills, documentation habits, scheduling awareness, and team communication.",
    outcomes: [
      "Use patient-centered communication during stressful visits.",
      "Document concise, useful exam-room notes.",
      "Understand how staffing and scheduling affect clinical flow.",
    ],
    clinicTasks: [
      "EMR documentation",
      "Team communication",
      "Patient service recovery",
    ],
    assets: [
      {
        title: "Day 6: Professional Skills and EMR",
        kind: "video",
        sourceFilename: "Day_6-Professional_Skills_&_EMR.mp4",
        storageKey: "videos/day-09/day-6-professional-skills-and-emr.mp4",
      },
      {
        title: "Clinical Guide: Soft Skills and Patient Care",
        kind: "pdf",
        sourceFilename:
          "Clinical Guide_ Soft Skills and Patient Care for Ophthalmic Professionals.pdf",
        storageKey: "pdfs/day-09/soft-skills-and-patient-care.pdf",
      },
      {
        title: "Spindel Smart Ops Scheduling Ecosystem",
        kind: "image",
        sourceFilename: "unnamed.png",
        storageKey: "images/day-09/scheduling-ecosystem.png",
      },
    ],
    notebook: {
      title: "Professional Workflow Notebook",
      clinicalPearls: [
        "Good EMR notes are specific, brief, and useful to the doctor.",
        "Soft skills directly affect exam efficiency and patient trust.",
        "Scheduling awareness helps technicians anticipate bottlenecks before they reach the physician.",
      ],
      reviewPrompts: [
        "What makes an EMR note useful?",
        "How should delays be communicated?",
        "What details should never be guessed?",
      ],
    },
  },
  {
    day: 10,
    slug: "capstone-certification-roadmap",
    title: "Simulation Capstone and Certification Roadmap",
    subtitle:
      "Clinical scenarios, final test preparation, COA pathway, and next career steps.",
    outcomes: [
      "Apply course skills to realistic patient-flow scenarios.",
      "Prepare for final review and COA certification next steps.",
      "Understand COA, COT, and COMT career-path progression.",
    ],
    clinicTasks: ["Scenario review", "Final test", "Certification planning"],
    assets: [
      {
        title: "Clinical Simulation Capstone",
        kind: "pdf",
        sourceFilename: "Clinical_Simulation_Capstone_(2).pdf",
        storageKey: "pdfs/day-10/clinical-simulation-capstone.pdf",
      },
      {
        title: "Ophthalmic Tech Final Test",
        kind: "video",
        sourceFilename: "Ophthalmic_Tech_Final_Test.mp4",
        storageKey: "videos/day-10/ophthalmic-tech-final-test.mp4",
      },
      {
        title: "COA Certification Guide",
        kind: "video",
        sourceFilename: "COA_Certification_Guide.mp4",
        storageKey: "videos/day-10/coa-certification-guide.mp4",
      },
      {
        title: "COA Certification Roadmap",
        kind: "video",
        sourceFilename: "COA_Certification_Roadmap.mp4",
        storageKey: "videos/day-10/coa-certification-roadmap.mp4",
      },
      {
        title: "Career Paths Infographic",
        kind: "image",
        sourceFilename: "Career paths infographic.png",
        storageKey: "images/day-10/career-paths-infographic.png",
      },
    ],
    notebook: {
      title: "Certification Roadmap Notebook",
      clinicalPearls: [
        "Certification progress is easier when study targets match real clinic skills.",
        "Scenario practice exposes gaps in communication, documentation, and test selection.",
        "COA is the first tier, with COT and COMT as later career milestones.",
      ],
      reviewPrompts: [
        "What are the COA requirements?",
        "Which course skills need more practice?",
        "What is the next career milestone after COA?",
      ],
    },
  },
];

export function getBootcampSourceDay(slug: string): BootcampSourceDay {
  const day = bootcampSourceDays.find(item => item.slug === slug);
  if (!day) {
    throw new Error(`Unknown bootcamp source day: ${slug}`);
  }
  return day;
}

export function getBootcampSourceAssetCount(): number {
  return bootcampSourceDays.reduce(
    (assetCount, day) => assetCount + day.assets.length,
    0
  );
}
