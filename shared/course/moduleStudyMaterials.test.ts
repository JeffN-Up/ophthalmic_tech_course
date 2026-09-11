import { describe, expect, it } from "vitest";
import { optiTechCourse } from "./courseCatalog";
import {
  getModuleStudyMaterialBundle,
  moduleStudyMaterialBundles,
} from "./moduleStudyMaterials";

describe("moduleStudyMaterialBundles", () => {
  it("places study materials under every course module", () => {
    expect(moduleStudyMaterialBundles).toHaveLength(
      optiTechCourse.modules.length
    );
    expect(
      moduleStudyMaterialBundles.map(bundle => bundle.moduleNumber)
    ).toEqual(optiTechCourse.modules.map(module => module.moduleNumber));

    for (const bundle of moduleStudyMaterialBundles) {
      expect(bundle.groups.length).toBeGreaterThan(0);
      expect(bundle.studyNotes.clinicalPearls.length).toBeGreaterThan(0);
      expect(bundle.studyNotes.reviewPrompts.length).toBeGreaterThan(0);
    }
  });

  it("adds quick references, overviews, and specialized bonus materials", () => {
    const foundations = getModuleStudyMaterialBundle(1);
    const diagnostics = getModuleStudyMaterialBundle(3);
    const capstone = getModuleStudyMaterialBundle(10);

    expect(
      foundations.groups.find(
        group => group.category === "video-audio-overview"
      )?.materials
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceFilename: "Ophthalmic_Tech_Foundations.mp4",
        }),
      ])
    );
    expect(
      foundations.groups.find(group => group.category === "quick-reference")
        ?.materials
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceFilename: "The_Biological_Camera.pdf",
        }),
      ])
    );
    expect(
      diagnostics.groups.find(group => group.category === "specialized-bonus")
        ?.materials
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sourceFilename: "Advanced_Ocular_Diagnostic_Masterclass.pdf",
        }),
      ])
    );
    expect(
      capstone.groups.find(group => group.category === "specialized-bonus")
        ?.materials.length
    ).toBeGreaterThan(0);
  });

  it("uses app-hosted course asset URLs instead of Drive redirects", () => {
    const materials = moduleStudyMaterialBundles.flatMap(bundle =>
      bundle.groups.flatMap(group => group.materials)
    );
    const linkedMaterials = materials.filter(material => material.sourceUrl);

    expect(linkedMaterials.length).toBeGreaterThanOrEqual(30);
    expect(
      linkedMaterials.every(material =>
        material.sourceUrl?.startsWith("/course-assets/")
      )
    ).toBe(true);
    expect(
      linkedMaterials.some(material =>
        material.sourceUrl?.includes("drive.google.com")
      )
    ).toBe(false);
  });
});
