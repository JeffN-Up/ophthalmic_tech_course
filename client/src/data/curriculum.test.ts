import { describe, expect, it } from "vitest";
import { curriculumModules } from "./curriculum";

describe("public curriculum media coverage", () => {
  it("advertises both a video and an audio overview for all ten modules", () => {
    expect(curriculumModules).toHaveLength(10);

    for (const module of curriculumModules) {
      expect(module.assets, `module ${module.day} video`).toContain(
        "Video Overview"
      );
      expect(module.assets, `module ${module.day} audio`).toContain(
        "Audio Overview"
      );
    }
  });
});
