export const OCULAR_CATEGORIES = ['Anatomy & vision', 'Everyday eye care', 'Procedures', 'Eye curiosities'] as const;

export interface OcularEducationVideo {
  driveFileId: string;
  thumbnailFileId: string;
  title: string;
  category: typeof OCULAR_CATEGORIES[number];
  creator: string;
  sourceUrl: string;
  embedUrl: string;
  openUrl: string;
  thumbnailUrl: string;
}
