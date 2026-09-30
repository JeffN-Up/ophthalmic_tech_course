export interface SpindelApprovedMedia {
  driveFileId: string;
  title: string;
  description: string;
  type: "video" | "audio" | "image";
  moduleDays: number[];
  embedUrl: string;
  openUrl: string;
  aiGenerated: boolean;
  learningTier: "core" | "extended";
  sourceLabel: string;
  learningObjective: string;
}

export function getSpindelMediaForDay(
  media: SpindelApprovedMedia[],
  day: number,
  tier?: SpindelApprovedMedia["learningTier"],
): SpindelApprovedMedia[] {
  return media.filter((item) => item.moduleDays.includes(day) && (!tier || item.learningTier === tier));
}

export function groupSpindelMediaForDay(
  media: SpindelApprovedMedia[],
  day: number,
): { core: SpindelApprovedMedia[]; extended: SpindelApprovedMedia[] } {
  return {
    core: getSpindelMediaForDay(media, day, "core"),
    extended: getSpindelMediaForDay(media, day, "extended"),
  };
}

export function getApprovedMediaEndpoint(organizationName?: string): string {
  return organizationName?.trim().toLowerCase().includes("spindel eye")
    ? "/api/course/spindel-media"
    : "/api/course/media";
}
