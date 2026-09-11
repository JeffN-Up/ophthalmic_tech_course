import { describe, expect, it } from "vitest";
import {
  getSpindelOnboardingLane,
  seaTechAlleyUrl,
  spindelOnboardingCourseTitle,
  spindelOnboardingLanes,
  spindelOnboardingStorageRoot,
} from "./spindelOnboardingSourceMap";

describe("spindelOnboardingSourceMap", () => {
  it("defines a private onboarding course lane for doctor-specific protocols", () => {
    const doctorProtocols = getSpindelOnboardingLane(
      "doctor-specific-protocols"
    );

    expect(spindelOnboardingCourseTitle).toBe(
      "Spindel Eye Technician Onboarding"
    );
    expect(spindelOnboardingStorageRoot).toBe("spindel-onboarding");
    expect(doctorProtocols.storageRoot).toBe(
      "spindel-onboarding/doctor-protocols"
    );
    expect(doctorProtocols.assetKinds).toContain("doctor-protocol");
    expect(doctorProtocols.sourceReferences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "SEA Tech Alley: Clinical Workup Protocol",
          url: `${seaTechAlleyUrl}/clinical-workup-protocol`,
          notes: expect.stringContaining("Farahani"),
        }),
      ])
    );
    expect(doctorProtocols.requiredReview).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Spindel-only"),
        expect.stringContaining("No patient information"),
      ])
    );
  });

  it("keeps every private lane under the Spindel onboarding storage root", () => {
    expect(spindelOnboardingLanes.length).toBeGreaterThanOrEqual(3);

    for (const lane of spindelOnboardingLanes) {
      expect(lane.storageRoot).toMatch(/^spindel-onboarding\//);
      expect(lane.examples.length).toBeGreaterThan(0);
      expect(lane.sourceReferences.length).toBeGreaterThan(0);
      expect(lane.requiredReview.length).toBeGreaterThan(0);
    }
  });

  it("keeps SEA Tech Alley protocol gathering private to Spindel onboarding", () => {
    expect(seaTechAlleyUrl).toBe("https://sites.google.com/view/seatechalley");
    expect(
      spindelOnboardingLanes.flatMap(lane =>
        lane.sourceReferences.map(source => source.url)
      )
    ).toEqual(
      expect.arrayContaining([
        "https://sites.google.com/view/seatechalley/clinical-workup-protocol",
        "https://sites.google.com/view/seatechalley/the-repository",
        "https://sites.google.com/view/seatechalley/minor-procedures",
      ])
    );
  });

  it("rejects unknown private onboarding lanes", () => {
    expect(() => getSpindelOnboardingLane("public-optitech-course")).toThrow(
      "Unknown Spindel onboarding lane"
    );
  });
});
