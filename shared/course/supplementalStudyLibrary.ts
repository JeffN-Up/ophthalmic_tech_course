import {
  moduleStudyMaterialBundles,
  type ModuleStudyMaterialCategory,
} from "./moduleStudyMaterials";

export type SupplementalStudyPlacement = "course-wide" | "module-related";

export interface SupplementalStudyMaterial {
  title: string;
  kind: "video" | "pdf" | "audio" | "image" | "link" | "document";
  sourceFilename: string;
  storageKey: string;
  sourceUrl?: string;
  category: ModuleStudyMaterialCategory;
  placement: SupplementalStudyPlacement;
  relatedModuleNumbers: number[];
  sourceDayTitle?: string;
  freePreview: boolean;
}

export interface SupplementalStudySection {
  category: ModuleStudyMaterialCategory;
  label: string;
  description: string;
  materials: SupplementalStudyMaterial[];
}

const sectionCopy: Record<
  ModuleStudyMaterialCategory,
  { label: string; description: string }
> = {
  "video-audio-overview": {
    label: "Extra video and audio overviews",
    description:
      "Optional watch/listen resources for learners who want another explanation.",
  },
  "quick-reference": {
    label: "Quick reference sheets and documents",
    description:
      "Skimmable documents, printable references, and visual review aids.",
  },
  "specialized-bonus": {
    label: "Highly specialized bonus content",
    description:
      "Deeper-dive material, advanced cases, and extra enrichment that can stand outside the core module path.",
  },
};

// Add future loose bonus items here when they are helpful but do not fit cleanly
// inside a required module. Leave relatedModuleNumbers empty for course-wide extras.
const manuallyCuratedSupplementalMaterials: SupplementalStudyMaterial[] = [];

const mappedModuleMaterials: SupplementalStudyMaterial[] =
  moduleStudyMaterialBundles.flatMap(bundle =>
    bundle.groups.flatMap(group =>
      group.materials.map(material => ({
        title: material.title,
        kind: material.kind,
        sourceFilename: material.sourceFilename,
        storageKey: material.storageKey,
        sourceUrl: material.sourceUrl,
        category: group.category,
        placement: "module-related" as const,
        relatedModuleNumbers: [bundle.moduleNumber],
        sourceDayTitle: bundle.sourceDayTitle,
        freePreview: material.freePreview,
      }))
    )
  );

export const supplementalStudyMaterials: SupplementalStudyMaterial[] = [
  ...mappedModuleMaterials,
  ...manuallyCuratedSupplementalMaterials,
];

export const supplementalStudySections: SupplementalStudySection[] = (
  Object.keys(sectionCopy) as ModuleStudyMaterialCategory[]
)
  .map(category => ({
    category,
    ...sectionCopy[category],
    materials: supplementalStudyMaterials.filter(
      material => material.category === category
    ),
  }))
  .filter(section => section.materials.length > 0);

export function getSupplementalStudySection(
  category: ModuleStudyMaterialCategory
): SupplementalStudySection {
  const section = supplementalStudySections.find(
    item => item.category === category
  );

  if (!section) {
    throw new Error(`Unknown supplemental study section: ${category}`);
  }

  return section;
}
