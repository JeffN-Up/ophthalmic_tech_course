import { describe, expect, it } from "vitest";
import {
  clinicProtocolGuides,
  getProtocolsForModuleDay,
  spindelDoctorProtocols,
} from "./spindelProtocols";

const expectedDoctors = [
  "Dr. Spindel",
  "Dr. Vazan",
  "Dr. Guenena",
  "Dr. Slentz",
  "Dr. Farahani",
  "Dr. Wood",
  "Dr. O'Block",
  "Dr. Nguyen",
  "Dr. Leo",
  "Dr. Noall",
];

describe("approved Spindel workup protocols", () => {
  it("includes every required doctor and excludes Dr. Prendergast", () => {
    expect(spindelDoctorProtocols.map((protocol) => protocol.doctorName)).toEqual(expectedDoctors);
    expect(JSON.stringify(spindelDoctorProtocols).toLowerCase()).not.toContain("prendergast");
    expect(getProtocolsForModuleDay(8)).toHaveLength(5);
    expect(getProtocolsForModuleDay(9)).toHaveLength(5);
  });

  it("keeps each protocol tied to a reviewed source and visit sequence", () => {
    for (const protocol of spindelDoctorProtocols) {
      expect(protocol.source.url).toMatch(/^https:\/\/(drive|docs)\.google\.com\//);
      expect(protocol.source.reviewedOn).toBe("2026-09-30");
      expect(protocol.visits.length).toBeGreaterThan(0);
      expect(protocol.visits.every((visit) => visit.steps.length > 0)).toBe(true);
    }
  });

  it("preserves important doctor differences instead of flattening them", () => {
    const spindel = spindelDoctorProtocols.find((item) => item.id === "spindel");
    const guenena = spindelDoctorProtocols.find((item) => item.id === "guenena");
    const wood = spindelDoctorProtocols.find((item) => item.id === "wood");
    const leo = spindelDoctorProtocols.find((item) => item.id === "leo");
    const noall = spindelDoctorProtocols.find((item) => item.id === "noall");

    expect(JSON.stringify(spindel)).toContain("All dilated patients get Optomap");
    expect(JSON.stringify(guenena)).toContain("cylinder of -2.50 D or greater");
    expect(JSON.stringify(wood)).toContain("40 or older");
    expect(JSON.stringify(leo)).toContain("difference between eyes is greater than 4 mmHg");
    expect(JSON.stringify(noall)).toContain("Established patients 40 and older");
  });

  it("marks the unavailable day-to-day OCT source without inventing content", () => {
    const unavailable = clinicProtocolGuides.find((guide) => guide.id === "oct-day-to-day");
    expect(unavailable?.source.available).toBe(false);
    expect(unavailable?.points).toEqual([]);
  });
});
