import { describe, expect, it } from "vitest";
import { isSpindelStaffEmail, staffNameFromEmail, verifySpindelStaffCode } from "./spindelStaffAccess";

describe("Spindel staff access", () => {
  it("accepts only exact Spindel email domains", () => {
    expect(isSpindelStaffEmail("Tech@SpindelEye.com")).toBe(true);
    expect(isSpindelStaffEmail("tech@spindeleye.com.example.org")).toBe(false);
    expect(isSpindelStaffEmail("tech@other.com")).toBe(false);
  });

  it("requires the configured code and rejects incorrect values", () => {
    expect(verifySpindelStaffCode("test-code", "test-code")).toBe(true);
    expect(verifySpindelStaffCode("test-code", "different-code")).toBe(false);
    expect(verifySpindelStaffCode("test-code", undefined)).toBe(false);
  });

  it("creates a display name without another required form step", () => {
    expect(staffNameFromEmail("jane.smith@spindeleye.com")).toEqual({ firstName: "Jane", lastName: "Smith" });
  });
});
