export type FlashcardSummary = {
  id: string;
  noteId: string;
  courseName: string;
  progress: number;
  imageUrl?: string;
};

export type CourseSummary = {
  id: string;
  courseName: string;
  icon?: string;
  deadline?: string | null;
};

export type StudyDeckData = {
  userName: string;
  recentFlashcards: FlashcardSummary[];
  myCourses: CourseSummary[];
  weeklyProgress: number;
};
