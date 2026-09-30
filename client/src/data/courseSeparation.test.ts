import { describe, expect, it } from "vitest";
import { courseContent } from "./courseContent";
import { curriculumModules } from "./curriculum";
import { spindelOnboardingLessons, spindelOnboardingModules } from "./spindelOnboarding";

describe("paid course and private onboarding separation", () => {
  it("keeps paid-course lessons and module descriptions free of Spindel-specific content", () => {
    const publicCourseText = JSON.stringify({ courseContent, curriculumModules }).toLowerCase();

    expect(publicCourseText).not.toContain("spindel");
    expect(publicCourseText).not.toContain("veradigm");
    expect(publicCourseText).not.toContain("physician-specific");
  });

  it("keeps the organization-specific onboarding material in its own private lesson set", () => {
    const onboardingText = JSON.stringify({ spindelOnboardingLessons, spindelOnboardingModules }).toLowerCase();

    expect(onboardingText).toContain("spindel");
  });
});
