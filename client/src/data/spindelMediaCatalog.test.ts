import { describe, expect, it } from "vitest";
import {
  getSpindelMediaForDay,
  groupSpindelMediaForDay,
  type SpindelApprovedMedia,
} from "./spindelMedia";

const media: SpindelApprovedMedia[] = [
  {
    driveFileId: "shared_anatomy_media_01",
    title: "Light through the eye",
    description: "Shows the path of light through the eye.",
    type: "video",
    moduleDays: [1, 2],
    embedUrl: "https://drive.google.com/file/d/shared_anatomy_media_01/preview",
    openUrl: "https://drive.google.com/file/d/shared_anatomy_media_01/view",
    aiGenerated: false,
    learningTier: "core",
    sourceLabel: "Bootcamp / explainingourbody",
    learningObjective: "Trace light from the cornea to the retina.",
  },
  {
    driveFileId: "extended_anatomy_media_02",
    title: "Alternate anatomy view",
    description: "A second view of ocular anatomy.",
    type: "video",
    moduleDays: [1],
    embedUrl: "https://drive.google.com/file/d/extended_anatomy_media_02/preview",
    openUrl: "https://drive.google.com/file/d/extended_anatomy_media_02/view",
    aiGenerated: true,
    learningTier: "extended",
    sourceLabel: "Bootcamp / dietician_adda",
    learningObjective: "Reinforce the location of major ocular structures.",
  },
];

describe("Spindel Bootcamp media placement", () => {
  it("reuses one canonical item in every intentionally mapped lesson", () => {
    expect(getSpindelMediaForDay(media, 1).map((item) => item.driveFileId)).toContain("shared_anatomy_media_01");
    expect(getSpindelMediaForDay(media, 2).map((item) => item.driveFileId)).toEqual(["shared_anatomy_media_01"]);
  });

  it("groups Core and Extended Learning without duplicating records", () => {
    expect(groupSpindelMediaForDay(media, 1)).toEqual({ core: [media[0]], extended: [media[1]] });
    expect(getSpindelMediaForDay(media, 1, "core")).toEqual([media[0]]);
  });
});
