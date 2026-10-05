import { describe, expect, it } from "vitest";
import {
  spindelOnboardingLessons,
  spindelOnboardingModules,
  spindelOnboardingQuizzes,
} from "./spindelOnboarding";

const expectedTitles = [
  "Eye Anatomy & Visual Pathways",
  "Optics & Testing Physics",
  "Core Examination Skills",
  "Visual Acuity, Lensometry & Refraction",
  "Tonometry & Pressure Testing",
  "Diagnostic Imaging & Equipment",
  "Visit-Type Workups",
  "MD (Ophthalmologists) Workups",
  "OD (Optometrists) Workups",
  "Safety, Urgency & Final Readiness",
];

describe("Spindel technician training catalog", () => {
  it("keeps the ten-day progress contract while leading with technician skills", () => {
    expect(spindelOnboardingModules.map((module) => module.day)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
    expect(spindelOnboardingModules.map((module) => module.title)).toEqual(expectedTitles);
  });

  it("provides one lesson and one 80-percent quiz for every module", () => {
    expect(spindelOnboardingLessons.map((lesson) => lesson.day)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
    expect(spindelOnboardingQuizzes.map((quiz) => quiz.day)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
    expect(spindelOnboardingQuizzes.every((quiz) => quiz.passingScore === 80)).toBe(true);
  });
});
