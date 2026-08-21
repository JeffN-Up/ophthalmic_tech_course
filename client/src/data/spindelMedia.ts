export interface SpindelApprovedMedia {
  driveFileId: string;
  title: string;
  description: string;
  type: "video" | "audio" | "image";
  moduleDays: number[];
  embedUrl: string;
  openUrl: string;
}

export function getSpindelMediaForDay(
  media: SpindelApprovedMedia[],
  day: number,
): SpindelApprovedMedia[] {
  return media.filter((item) => item.moduleDays.includes(day));
}
