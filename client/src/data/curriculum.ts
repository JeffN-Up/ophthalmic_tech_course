/**
 * Curriculum Module Configuration
 * Centralized data structure for course modules
 * Easily extensible for adding new modules
 */

export interface CurriculumModule {
  id: string;
  day: number;
  title: string;
  description: string;
  objectives: string[];
  topics: string[];
  assets: string[];
  icon: string;
  duration?: string; // Optional: estimated duration in hours
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
}

export const curriculumModules: CurriculumModule[] = [
  {
    id: "module-01-foundations",
    day: 1,
    title: "Ophthalmic Foundations & Patient Communication",
    description:
      "Understand eye anatomy, master patient history taking, and develop empathic communication skills.",
    objectives: [
      "Understand the anatomy and physiology of the eye",
      "Master patient history taking techniques",
      "Develop active listening and empathic communication skills",
      "Learn the EMPATHY framework for patient interactions",
    ],
    topics: [
      "Ocular anatomy overview",
      "Common chief complaints and differential diagnosis",
      "History taking protocols",
      "Nonverbal communication essentials",
      "Managing difficult patients",
      "Dementia and elderly patient considerations",
    ],
    assets: ["Audio Overview", "Video Overview", "Flashcards"],
    icon: "👁️",
    duration: "2.5 hours",
    difficulty: "Beginner",
  },
  {
    id: "module-02-refraction",
    day: 2,
    title: "Refraction & Lensometry",
    description:
      "Master manual and automated lensometry techniques and refraction principles.",
    objectives: [
      "Master manual and automated lensometry techniques",
      "Understand refraction principles",
      "Perform accurate lens power measurements",
      "Identify lens defects and materials",
    ],
    topics: [
      "Lensometry fundamentals (manual and automated)",
      "Spherocylinder lens reading",
      "Plus and minus cylinder notation",
      "Bifocal and progressive lens measurement",
      "Lens materials identification",
      "Phoroptor maintenance and calibration",
    ],
    assets: ["Audio Overview", "Video Overview", "Infographic", "Flashcards", "Data Table"],
    icon: "👓",
    duration: "2 hours",
    difficulty: "Intermediate",
  },
  {
    id: "module-03-tonometry",
    day: 3,
    title: "Tonometry & Intraocular Pressure Measurement",
    description: "Master Goldmann Applanation Tonometry and IOP measurement principles.",
    objectives: [
      "Master Goldmann Applanation Tonometry (GAT)",
      "Understand IOP measurement principles",
      "Perform accurate tonometry procedures",
      "Troubleshoot common tonometry errors",
    ],
    topics: [
      "Tonometry types and principles",
      "Goldmann Applanation Tonometer operation",
      "Calibration and maintenance",
      "Patient positioning and technique",
      "Anxiety management during tonometry",
      "IOP interpretation and normal ranges",
    ],
    assets: ["Audio Overview", "Video Overview", "Slide Deck", "Flashcards", "Quiz"],
    icon: "📊",
    duration: "1.5 hours",
    difficulty: "Intermediate",
  },
  {
    id: "module-04-slit-lamp",
    day: 4,
    title: "Slit Lamp Examination & Anterior Segment Imaging",
    description:
      "Perform comprehensive slit lamp examinations and master anterior segment evaluation.",
    objectives: [
      "Perform comprehensive slit lamp examinations",
      "Master anterior segment evaluation",
      "Understand imaging modalities",
      "Identify common anterior segment pathology",
    ],
    topics: [
      "Slit lamp anatomy and operation",
      "Anterior segment examination techniques",
      "Corneal assessment",
      "Lens evaluation and cataract grading",
      "Anterior chamber depth assessment",
      "Slit lamp maintenance and troubleshooting",
    ],
    assets: ["Audio Overview", "Video Overview", "Slide Deck", "Infographic", "Flashcards"],
    icon: "🔬",
    duration: "2.5 hours",
    difficulty: "Intermediate",
  },
  {
    id: "module-05-retinal-imaging",
    day: 5,
    title: "Retinal Imaging & OCT Interpretation",
    description: "Master retinal imaging techniques and OCT scan interpretation.",
    objectives: [
      "Master retinal imaging techniques (Optos, OCT)",
      "Understand ultra-widefield imaging",
      "Interpret OCT scans accurately",
      "Recognize common retinal pathology",
    ],
    topics: [
      "Optomap retinal imaging principles",
      "Ultra-widefield (UWF) imaging advantages",
      "OCT fundamentals and image acquisition",
      "Macular OCT interpretation",
      "Optic nerve head assessment",
      "Common retinal findings (AMD, DR, RVO)",
      "Peripheral retinal lesion detection",
    ],
    assets: ["Audio Overview", "Video Overview", "Slide Deck", "Infographic", "Data Table"],
    icon: "🎯",
    duration: "3 hours",
    difficulty: "Advanced",
  },
  {
    id: "module-06-visual-field",
    day: 6,
    title: "Visual Field Testing & Interpretation",
    description: "Perform and interpret visual field tests accurately.",
    objectives: [
      "Perform confrontation visual field testing",
      "Understand automated visual field testing",
      "Interpret visual field results",
      "Identify common VF defects",
    ],
    topics: [
      "Confrontation visual field techniques",
      "Automated perimetry principles",
      "Visual field defect patterns",
      "False positives and negatives",
      "VF progression analysis",
      "Common VF patterns (glaucoma, neurological, retinal)",
    ],
    assets: ["Audio Overview", "Video Overview", "Slide Deck", "Infographic", "Quiz"],
    icon: "👁️",
    duration: "2 hours",
    difficulty: "Advanced",
  },
  {
    id: "module-07-advanced-imaging",
    day: 7,
    title: "Advanced Imaging & Specialized Procedures",
    description:
      "Master B-scan ultrasonography, Pentacam imaging, and surgical assisting.",
    objectives: [
      "Master B-scan ultrasonography",
      "Understand Pentacam imaging",
      "Learn surgical assisting fundamentals",
      "Prepare for advanced clinical scenarios",
    ],
    topics: [
      "B-scan ultrasound principles and technique",
      "Pentacam corneal topography",
      "Anterior segment OCT",
      "Surgical assisting basics",
      "Instrument handling and sterilization",
      "Operating room protocols",
    ],
    assets: ["Audio Overview", "Video Overview", "Slide Deck", "Infographic", "Flashcards"],
    icon: "🏥",
    duration: "2.5 hours",
    difficulty: "Advanced",
  },
  {
    id: "module-08-soft-skills",
    day: 8,
    title: "Patient Communication & Soft Skills",
    description: "Master therapeutic communication and conflict resolution techniques.",
    objectives: [
      "Master therapeutic communication techniques",
      "Develop conflict resolution skills",
      "Build patient rapport and trust",
      "Manage challenging patient interactions",
    ],
    topics: [
      "Active and reflective listening",
      "Empathic expression and validation",
      "Breaking bad news (SPIKES protocol)",
      "Shared decision-making",
      "Cultural competency in healthcare",
      "Compassion fatigue prevention",
      "Bedside manner excellence",
    ],
    assets: ["Audio Overview", "Video Overview", "Slide Deck", "Flashcards", "Quiz"],
    icon: "💬",
    duration: "2 hours",
    difficulty: "Beginner",
  },
  {
    id: "module-09-documentation",
    day: 9,
    title: "Clinical Documentation & EHR Proficiency",
    description: "Master medical record documentation and EHR systems.",
    objectives: [
      "Master medical record documentation",
      "Understand HIPAA compliance",
      "Develop EHR proficiency",
      "Learn proper medical scribing",
    ],
    topics: [
      "Medical record fundamentals",
      "HIPAA privacy and security",
      "Electronic health record systems",
      "Proper documentation standards",
      "Chief complaint and history documentation",
      "Pertinent positives and negatives",
      "Medical scribing best practices",
      "Accuracy and compliance",
    ],
    assets: ["Audio Overview", "Video Overview", "Slide Deck", "Infographic", "Data Table", "Flashcards", "Quiz"],
    icon: "📝",
    duration: "1.5 hours",
    difficulty: "Beginner",
  },
  {
    id: "module-10-professional-development",
    day: 10,
    title: "Professional Development & Career Pathways",
    description:
      "Understand certification pathways and plan your career advancement.",
    objectives: [
      "Understand certification pathways (COA, COT, COMT)",
      "Develop professional growth strategies",
      "Learn continuing education requirements",
      "Plan career advancement",
    ],
    topics: [
      "Certified Ophthalmic Assistant (COA) requirements",
      "Certified Ophthalmic Technician (COT) requirements",
      "Certified Ophthalmic Medical Technician (COMT) requirements",
      "JCAHPO examination content areas",
      "Continuing education resources",
      "Career advancement opportunities",
      "Professional organizations and networking",
      "Lifelong learning strategies",
    ],
    assets: ["Audio Overview", "Video Overview", "Slide Deck", "Infographic", "Data Table", "Flashcards", "Quiz"],
    icon: "🎓",
    duration: "2 hours",
    difficulty: "Intermediate",
  },
];

/**
 * Utility functions for curriculum management
 */

export const getModuleById = (id: string): CurriculumModule | undefined => {
  return curriculumModules.find((module) => module.id === id);
};

export const getModulesByDay = (day: number): CurriculumModule[] => {
  return curriculumModules.filter((module) => module.day === day);
};

export const getModulesByDifficulty = (
  difficulty: "Beginner" | "Intermediate" | "Advanced"
): CurriculumModule[] => {
  return curriculumModules.filter((module) => module.difficulty === difficulty);
};

export const getTotalCourseDuration = (): number => {
  return curriculumModules.reduce((total, module) => {
    const hours = module.duration ? parseFloat(module.duration) : 0;
    return total + hours;
  }, 0);
};

export const addNewModule = (module: CurriculumModule): void => {
  // Add validation if needed
  if (curriculumModules.find((m) => m.id === module.id)) {
    console.warn(`Module with ID ${module.id} already exists`);
    return;
  }
  curriculumModules.push(module);
};

export const updateModule = (id: string, updates: Partial<CurriculumModule>): void => {
  const moduleIndex = curriculumModules.findIndex((m) => m.id === id);
  if (moduleIndex > -1) {
    curriculumModules[moduleIndex] = {
      ...curriculumModules[moduleIndex],
      ...updates,
    };
  }
};

export const deleteModule = (id: string): void => {
  const index = curriculumModules.findIndex((m) => m.id === id);
  if (index > -1) {
    curriculumModules.splice(index, 1);
  }
};
