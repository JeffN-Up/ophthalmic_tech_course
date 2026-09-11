import {
  bootcampSourceDays,
  type BootcampSourceAsset,
} from "./bootcampSourceMap";

export type ModuleStudyMaterialCategory =
  | "video-audio-overview"
  | "quick-reference"
  | "specialized-bonus";

export interface ModuleStudyMaterial {
  title: string;
  kind: BootcampSourceAsset["kind"];
  sourceFilename: string;
  storageKey: string;
  category: ModuleStudyMaterialCategory;
  freePreview: boolean;
}

export interface ModuleStudyMaterialGroup {
  category: ModuleStudyMaterialCategory;
  label: string;
  description: string;
  materials: ModuleStudyMaterial[];
}

export interface ModuleSourceStudyNotes {
  sourceDaySlug: string;
  sourceDayTitle: string;
  notebookTitle: string;
  clinicalPearls: string[];
  reviewPrompts: string[];
}

export interface ModuleStudyMaterialBundle {
  moduleNumber: number;
  sourceDaySlug: string;
  sourceDayTitle: string;
  groups: ModuleStudyMaterialGroup[];
  studyNotes: ModuleSourceStudyNotes;
}

const categoryDescriptions: Record<
  ModuleStudyMaterialCategory,
  { label: string; description: string }
> = {
  "video-audio-overview": {
    label: "Video and audio overviews",
    description:
      "Use these first when you want a guided walk-through before reading details.",
  },
  "quick-reference": {
    label: "Quick reference sheets and documents",
    description:
      "Use these as printable or skim-friendly support while reviewing the module.",
  },
  "specialized-bonus": {
    label: "Specialized bonus content",
    description:
      "Use these after the core lesson when you want deeper or more advanced context.",
  },
};

const specializedPatterns = [
  /advanced/i,
  /masterclass/i,
  /precision/i,
  /capstone/i,
  /certification/i,
  /roadmap/i,
  /keratoconus/i,
  /topography/i,
];

function categorizeAsset(
  asset: BootcampSourceAsset
): ModuleStudyMaterialCategory {
  const combinedTitle = `${asset.title} ${asset.sourceFilename}`;

  if (specializedPatterns.some(pattern => pattern.test(combinedTitle))) {
    return "specialized-bonus";
  }

  if (asset.kind === "video" || asset.kind === "audio") {
    return "video-audio-overview";
  }

  return "quick-reference";
}

export const moduleStudyMaterialBundles: ModuleStudyMaterialBundle[] =
  bootcampSourceDays.map(sourceDay => {
    const materials = sourceDay.assets.map(asset => ({
      title: asset.title,
      kind: asset.kind,
      sourceFilename: asset.sourceFilename,
      storageKey: asset.storageKey,
      category: categorizeAsset(asset),
      freePreview: Boolean(asset.freePreview),
    }));

    const groups = (
      Object.keys(categoryDescriptions) as ModuleStudyMaterialCategory[]
    )
      .map(category => ({
        category,
        ...categoryDescriptions[category],
        materials: materials.filter(material => material.category === category),
      }))
      .filter(group => group.materials.length > 0);

    return {
      moduleNumber: sourceDay.day,
      sourceDaySlug: sourceDay.slug,
      sourceDayTitle: sourceDay.title,
      groups,
      studyNotes: {
        sourceDaySlug: sourceDay.slug,
        sourceDayTitle: sourceDay.title,
        notebookTitle: sourceDay.notebook.title,
        clinicalPearls: sourceDay.notebook.clinicalPearls,
        reviewPrompts: sourceDay.notebook.reviewPrompts,
      },
    };
  });

export function getModuleStudyMaterialBundle(
  moduleNumber: number
): ModuleStudyMaterialBundle {
  const bundle = moduleStudyMaterialBundles.find(
    item => item.moduleNumber === moduleNumber
  );

  if (!bundle) {
    throw new Error(`Unknown module study material bundle: ${moduleNumber}`);
  }

  return bundle;
}
