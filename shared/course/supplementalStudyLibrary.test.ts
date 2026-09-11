import { describe, expect, it } from "vitest";
import {
  getSupplementalStudySection,
  supplementalStudyMaterials,
  supplementalStudySections,
} from "./supplementalStudyLibrary";

describe("supplementalStudyLibrary", () => {
  it("creates a course-wide library from mapped source materials", () => {
    expect(supplementalStudySections.map(section => section.category)).toEqual([
      "video-audio-overview",
      "quick-reference",
      "specialized-bonus",
    ]);
    expect(supplementalStudyMaterials.length).toBeGreaterThan(30);
  });

  it("keeps module-related tags optional for future unrelated bonus content", () => {
    const bonus = getSupplementalStudySection("specialized-bonus");

    expect(bonus.materials).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          placement: "module-related",
          relatedModuleNumbers: expect.arrayContaining([3]),
          sourceFilename: "Advanced_Ocular_Diagnostic_Masterclass.pdf",
        }),
      ])
    );
    expect(
      supplementalStudyMaterials.every(material =>
        Array.isArray(material.relatedModuleNumbers)
      )
    ).toBe(true);
  });
});
