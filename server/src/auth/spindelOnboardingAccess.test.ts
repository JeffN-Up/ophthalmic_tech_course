import { describe, expect, it } from "vitest";
import {
  createSpindelOnboardingEnrollment,
  isSpindelOnboardingPasswordValid,
  SPINDEL_ONBOARDING_OFFER_ID,
  validateSpindelOnboardingAccountInput,
} from "./spindelOnboardingAccess";

describe("spindelOnboardingAccess", () => {
  it("accepts only the Spindel onboarding universal password", () => {
    expect(isSpindelOnboardingPasswordValid(["68", "Camaro"].join(""))).toBe(
      true
    );
    expect(isSpindelOnboardingPasswordValid("wrong-password")).toBe(false);
  });

  it("creates a full-access Spindel onboarding enrollment", () => {
    const enrollment = createSpindelOnboardingEnrollment({
      employeeName: "New Tech",
      email: " New.Tech@SpindelEye.com ",
      now: "2026-09-11T12:00:00.000Z",
    });

    expect(enrollment).toMatchObject({
      enrollmentId: "spindel_onboarding_new_tech_new_tech_spindeleye_com",
      checkoutSessionId: "spindel_onboarding_new_tech_spindeleye_com",
      offerId: SPINDEL_ONBOARDING_OFFER_ID,
      learnerEmail: "new.tech@spindeleye.com",
      status: "active",
      accessStartedAt: "2026-09-11T12:00:00.000Z",
    });
    expect(new Date(enrollment.accessExpiresAt).getUTCFullYear()).toBe(2029);
  });

  it("requires an employee name and valid email", () => {
    expect(
      validateSpindelOnboardingAccountInput({
        employeeName: "",
        email: "tech@spindeleye.com",
      })
    ).toBe("Enter the employee name.");
    expect(
      validateSpindelOnboardingAccountInput({
        employeeName: "Tech",
        email: "not-an-email",
      })
    ).toBe("Enter a valid employee email address.");
    expect(
      validateSpindelOnboardingAccountInput({
        employeeName: "Tech",
        email: "tech@spindeleye.com",
      })
    ).toBeNull();
  });
});
