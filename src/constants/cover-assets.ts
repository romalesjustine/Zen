export const COVER_ASSETS = [
  "/cover/cover_1.png",
  "/cover/cover_2.png",
  "/cover/cover_3.png",
  "/cover/cover_4.png",
  "/cover/cover_5.png",
  "/cover/cover_6.png",
  "/cover/cover_7.png",
] as const;

export const DEFAULT_COURSE_ICON = COVER_ASSETS[0];
export const DEFAULT_FLASHCARD_COVER = COVER_ASSETS[1] ?? COVER_ASSETS[0];
