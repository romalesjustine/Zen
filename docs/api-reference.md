# Zen API Reference

All endpoints live inside the Next.js App Router under `src/app/api/**`. Unless stated otherwise, routes require a valid Supabase session cookie; unauthenticated requests receive `401 Unauthorized`.

| Endpoint | Methods | Purpose |
| --- | --- | --- |
| `/api/ai-notes/generate` | `POST` | Summarize raw text with Gemini and persist notes + flashcards. |
| `/api/goal-helper/chat` | `POST` | Retrieval-augmented coaching assistant. |
| `/api/extract-text` | `POST` | OCR for PDF/DOCX uploads and embedding ingestion. |
| `/api/weekly-wrapped` | `GET` | AI-generated study recap for the last week. |
| `/api/test` | `POST` | Create practice exams from an existing note. |
| `/api/study-session` | `POST` | Record timer sessions and daily progress. |
| `/api/study-deck` | `GET` | Snapshot of flashcards, courses, and progress. |
| `/api/flashcard` | `POST`, `PUT`, `DELETE` | Create, update, and delete flashcards; log activity. |
| `/api/notes` | `POST` | Create notes (usually from AI outputs). |
| `/api/notes/:noteId` | `PATCH`, `DELETE` | Update or delete a single note plus dependents. |
| `/api/exam-score` | `POST` | Persist quiz/test scores for a note. |

## Common conventions

- **Auth** – All routes call `createClient()` from `src/lib/supabase/server.ts` and abort with `401` if `supabase.auth.getUser()` does not return an `id`. Tests or scripts should include the Supabase session cookie.
- **Errors** – JSON payload with `{ error: string }` or `{ message: string }`. Some services expose more detailed status codes (e.g., OCR errors bubble up via `OcrServiceError.statusCode`).
- **Timestamps** – ISO strings unless otherwise documented. Server handlers often normalize dates to midnight (see `/api/study-session`).

---

### POST `/api/ai-notes/generate`
- **Body**: `{ "text": "raw input" }`
- **Flow**: Validates `text`, loads the Supabase user, calls `generateAndPersistStudyMaterials` (`src/services/ai-notes.ts`) which in turn invokes Gemini 2.5 Flash Lite twice (summary + flashcards). Notes + flashcards are saved through Prisma.
- **Success response**: `{ title, markdownContent, flashcardsCreated, noteId, content }`
- **Failure cases**: `400` for missing text, `401` if unauthenticated, `500` with `{ error: string }` for AI/DB failures (e.g., not enough flashcards generated).

### POST `/api/goal-helper/chat`
- **Body**: `{ "prompt": string, "history": [{ "role": "user"|"assistant", "content": string }] }`
- **Flow**: Requires auth. Fetches relevant documents from Supabase pgvector via `searchRelevantDocuments`, builds a context block, and calls Gemini (`MODEL_NAME` defaults to `gemini-2.0-flash-lite`). Returns markdown plus references.
- **Success response**: `{ "answer": string, "references": [{ "id": string, "similarity": number, "metadata": object }] }`
- **Errors**: `400` if prompt missing, `401` if unauthenticated, `500` for upstream failures.

### POST `/api/extract-text`
- **Body**: `multipart/form-data` with fields: `file` (PDF/DOCX `<=5MB`), optional `source` (`upload` or `google_drive`).
- **Flow**: Auth check, `extractTextViaOcrSpace` validates file type/size and hits OCR.space, `embedAndStoreDocument` stores text + embeddings in Supabase, returns raw text.
- **Success response**: `{ "text": "..." }`
- **Errors**: `400` for missing/invalid file, `401` if unauthenticated, `4xx/5xx` depending on `OcrServiceError`.

### GET `/api/weekly-wrapped`
- **Query**: none.
- **Flow**: Auth check, aggregates past 7–14 days of sessions, notes, exams, etc. via Prisma, crafts a structured prompt, and asks Gemini for JSON output (`weeklyWrapStats`). Adds `startDate`/`endDate`.
- **Success response**: `{ "weeklyWrapStats": { totalNotes, prevTotalNotes, longestStudySession, ... } }`
- **Errors**: `401` if logged out, `500` if AI parsing fails.

### POST `/api/test`
- **Body**: `{ "selectedTypes": ["multipleChoice"|"trueOrFalse"|"identification", ...], "id": "<noteId>" }`
- **Flow**: Validates note id and question types, fetches note content, logs an `activity` row, then asks Gemini to return five questions adhering to the type list.
- **Success response**: `{ "questions": [{ "question", "type", "choices": [], "answer", "selectedAnswer": "" }, ...] }`
- **Errors**: `400` for invalid payload, `401` if unauthenticated, `404` if note missing, `500` on AI/DB failure.

### POST `/api/study-session`
- **Body**: `{ "duration": number /* minutes or hours depending on client */, "dateStopped": ISO string }`
- **Flow**: Auth check by email, finds/creates the user’s `session` row storing longest session stats, normalizes `dateStopped` to midnight, upserts into `progress` for that day.
- **Success response**: `{ "success": true }`
- **Errors**: `400` for invalid duration/date, `401` unauthenticated, `404` if profile missing, `500` otherwise.

### GET `/api/study-deck`
- **Flow**: Auth required. Fetches notes with flashcards, derives icon initials, calculates note-level progress percentages, collects the latest card per note, and computes weekly progress averages.
- **Success response**:
  ```json
  {
    "userName": "string",
    "recentFlashcards": [{ "id": "...", "noteId": "...", "courseName": "...", "progress": 42, "imageUrl": "/flashcard-bg.png" }],
    "myCourses": [{ "id": "...", "courseName": "...", "icon": "Z" }],
    "weeklyProgress": 57
  }
  ```
- **Errors**: `401` unauthenticated, `500` catch-all.

### `/api/flashcard`
- **POST** – Create a flashcard for the authenticated user. Body: `{ "id": "<noteId>", "front": string, "back": string }`. Persists via Prisma, logs `activityType: "FLASHCARDS"`.
- **PUT** – Update card content or answered progress. Body variant:
  - Progress update: `{ "type": "progress update", "id": "<flashcardId>", "isAnswered": boolean, "progress": number }` (also updates parent `note.flashcardProgress`).
  - Content edit: `{ "id": "<flashcardId>", "front": string, "back": string }`.
- **DELETE** – Body: `{ "id": "<flashcardId>" }`. Removes card and logs activity.
- **Responses**: Prisma entity JSON on success.
- **Errors**: `401` unauthenticated, `500` for validation/DB errors.

### POST `/api/notes`
- **Body**: `{ "title": string, "content": any, "isAiGenerated": boolean, "lastModified": ISO string, "flashcards": [{ "Front": string, "Back": string }, ...] }`
- **Flow**: Auth check, creates the note and associated AI flashcards in one transaction, records `activityType: "NOTES"`.
- **Response**: Newly created note JSON.
- **Errors**: `401` unauthenticated, `500` for DB issues.

### PATCH `/api/notes/:noteId`
- **Body**: Partial note fields (title, content, etc.) that Prisma should update.
- **Flow**: Auth check, updates the note, logs notes activity.
- **Response**: Updated note JSON.
- **Errors**: `401` unauthenticated, `500` for invalid note/data.

### DELETE `/api/notes/:noteId`
- **Flow**: Auth check, wraps a Prisma transaction that deletes child flashcards and exams before removing the note and logging an activity row.
- **Response**: `{ "message": "Note deleted successfully" }`
- **Errors**: `401` unauthenticated, `500` for cascading delete failures.

### POST `/api/exam-score`
- **Body**: `{ "id": "<noteId>", "score": number }`
- **Flow**: Auth check, writes a row to `exam` with `noteId`, `userId`, and `score`.
- **Response**: `{ "success": true }`
- **Errors**: `401` unauthenticated, `404` if Supabase user missing, `500` otherwise.

---

## Testing the APIs

- Use `npm run dev` so Next.js watches for changes and hot-reloads route handlers.
- When calling authenticated routes from scripts or API clients, copy the `sb` cookies from the browser session; Supabase’s server helpers rely on them.
- If you add new routes, extend the summary table above and capture auth/validation details similar to the existing sections.
