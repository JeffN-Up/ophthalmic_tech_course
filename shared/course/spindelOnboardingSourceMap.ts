export type SpindelOnboardingAssetKind =
  | "doctor-protocol"
  | "practice-workflow"
  | "checklist"
  | "training-reference";

export interface SpindelOnboardingLane {
  id: string;
  title: string;
  description: string;
  storageRoot: string;
  assetKinds: SpindelOnboardingAssetKind[];
  examples: string[];
  sourceReferences: SpindelOnboardingSourceReference[];
  requiredReview: string[];
}

export interface SpindelOnboardingSourceReference {
  title: string;
  url: string;
  notes: string;
}

export const spindelOnboardingCourseTitle = "Spindel Eye Technician Onboarding";

export const spindelOnboardingStorageRoot = "spindel-onboarding";

export const seaTechAlleyUrl = "https://sites.google.com/view/seatechalley";

export const spindelOnboardingLanes: SpindelOnboardingLane[] = [
  {
    id: "doctor-specific-protocols",
    title: "Doctor-Specific Protocols",
    description:
      "Provider preferences, workup rules, post-op/pre-op instructions, escalation preferences, and other SEA-only clinical workflow details.",
    storageRoot: `${spindelOnboardingStorageRoot}/doctor-protocols`,
    assetKinds: ["doctor-protocol", "checklist", "training-reference"],
    examples: [
      "Dr. Ramsey retina workup preferences",
      "Dr. Farahani post-op cataract workflow",
      "Provider-specific dry-eye workup notes",
    ],
    sourceReferences: [
      {
        title: "SEA Tech Alley: Clinical Workup Protocol",
        url: `${seaTechAlleyUrl}/clinical-workup-protocol`,
        notes:
          "Source queue for provider workup links including Spindel, Vazan, Guenena, Slentz, Farahani, Wood, O'Block, Nguyen, Leo, and Prendergast.",
      },
      {
        title: "SEA Tech Alley: Repository",
        url: `${seaTechAlleyUrl}/the-repository`,
        notes:
          "Source queue for doctor-specific post-op sheets, consent forms, B&L assistance forms, training resources, and master copies.",
      },
    ],
    requiredReview: [
      "Provider or clinical lead confirms the protocol is current.",
      "No patient information or staff-private details are present.",
      "The protocol is labeled as Spindel-only, not public OptiTech content.",
      "A review date and owner are recorded before onboarding use.",
    ],
  },
  {
    id: "sea-clinic-workflows",
    title: "SEA Clinic Workflows",
    description:
      "Practice-specific rooming, scheduling, triage, handoff, equipment, and internal communication workflows for Spindel onboarding.",
    storageRoot: `${spindelOnboardingStorageRoot}/clinic-workflows`,
    assetKinds: ["practice-workflow", "checklist", "training-reference"],
    examples: [
      "SEA technician rooming flow",
      "Practice-specific testing handoff checklist",
      "Internal escalation and communication workflow",
    ],
    sourceReferences: [
      {
        title: "SEA Tech Alley: Home",
        url: seaTechAlleyUrl,
        notes:
          "Source queue for technician expectations, clinic behavior standards, and leadership expectations.",
      },
      {
        title: "SEA Tech Alley: Clinical Workup Protocol",
        url: `${seaTechAlleyUrl}/clinical-workup-protocol`,
        notes:
          "Source queue for clinic-wide reminders, refraction guidance, Optomap guidance, OCT reporting, and post-op IOL workflows.",
      },
    ],
    requiredReview: [
      "Practice manager or training lead confirms this is appropriate for internal onboarding.",
      "No passwords, private links, patient information, or staff performance details are present.",
      "Public-course overlap is separated from internal workflow instructions.",
    ],
  },
  {
    id: "spindel-onboarding-assessments",
    title: "Spindel Onboarding Assessments",
    description:
      "Internal signoff checklists, supervised practice notes, and onboarding assessments tied to SEA workflows.",
    storageRoot: `${spindelOnboardingStorageRoot}/assessments`,
    assetKinds: ["checklist", "training-reference"],
    examples: [
      "New technician supervised practice checklist",
      "SEA onboarding milestone review",
      "Doctor-protocol readiness signoff",
    ],
    sourceReferences: [
      {
        title: "SEA Tech Alley: Minor Procedures",
        url: `${seaTechAlleyUrl}/minor-procedures`,
        notes:
          "Source queue for minor procedure and laser protocol references that need clinical-owner review before onboarding use.",
      },
      {
        title: "SEA Tech Alley: Repository Training Resources",
        url: `${seaTechAlleyUrl}/the-repository`,
        notes:
          "Source queue for training survival guide, training checklist, closing tasks, and related internal study materials.",
      },
    ],
    requiredReview: [
      "Supervisor confirms the assessment matches current local expectations.",
      "Assessment language avoids promising certification or independent competency without observation.",
      "Private employee performance notes are not stored in course source files.",
    ],
  },
];

export function getSpindelOnboardingLane(id: string): SpindelOnboardingLane {
  const lane = spindelOnboardingLanes.find(item => item.id === id);

  if (!lane) {
    throw new Error(`Unknown Spindel onboarding lane: ${id}`);
  }

  return lane;
}
