import { describe, expect, it } from "vitest";
import { courseContent } from "./courseContent";
import { curriculumModules } from "./curriculum";
import { spindelCrashCourseLessons, spindelCrashCourseModules } from "./spindelCrashCourse";

describe("paid course and private 10 Day Crash Course separation", () => {
  it("keeps paid-course lessons and module descriptions free of Spindel-specific content", () => {
    const publicCourseText = JSON.stringify({ courseContent, curriculumModules }).toLowerCase();

    expect(publicCourseText).not.toContain("spindel");
    expect(publicCourseText).not.toContain("veradigm");
    expect(publicCourseText).not.toContain("physician-specific");
  });

  it("keeps the organization-specific 10 Day Crash Course material in its own private lesson set", () => {
    const crashCourseText = JSON.stringify({ spindelCrashCourseLessons, spindelCrashCourseModules }).toLowerCase();

    expect(crashCourseText).toContain("spindel");
  });
});
