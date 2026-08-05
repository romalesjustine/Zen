import { cookies } from "next/headers";
import type { StudyDeckData } from "@/types/study-deck";
import StudyDeckDashboardClient from "./StudyDeckDashboardClient";

const FALLBACK_DATA: StudyDeckData = {
  userName: "Learner",
  recentFlashcards: [],
  myCourses: [],
  weeklyProgress: 0,
};

const getBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL;

  if (!url) {
    return "http://localhost:3000";
  }

  return url.startsWith("http") ? url : `https://${url}`;
};

const serializeCookies = async () =>
  (await cookies())
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

const fetchStudyDeckData = async (): Promise<StudyDeckData> => {
  const cookieHeader = await serializeCookies();
  const response = await fetch(`${getBaseUrl()}/api/study-deck`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch study deck data.");
  }

  const data = (await response.json()) as StudyDeckData;
  console.log("Study deck data fetched:", data);
  return data;
};

export default async function StudyDeckDashboardPage() {
  const data = await fetchStudyDeckData().catch((error) => {
    console.error("Failed to load study deck data:", error);
    return FALLBACK_DATA;
  });

  return <StudyDeckDashboardClient data={data} />;
}
