# Zen Architecture

## System overview

Zen is a monolithic Next.js App Router deployment that serves both the marketing experience (`src/app/page.tsx`) and the authenticated dashboard routes under `src/app/(dashboard)` plus server actions in `src/app/actions`. All HTTP APIs live in `src/app/api/**` so they can run close to the UI while sharing Prisma models and Supabase auth helpers.

At runtime every authenticated request follows the same pattern:

```
Browser or mobile client
    |
    +--> Next.js route handler (RSC, server action, or /api)
            |
            +--> Supabase session lookup via cookies (`src/lib/supabase/server.ts`)
            +--> Domain service (Prisma, OCR, LangChain, embeddings) in `src/services/**`
            +--> Response serialized to JSON/React payload
    |
    +--> Prisma Client -> Postgres (notes, flashcards, activities, etc.)
```

## Feature pillars

| Feature | Flow |
| --- | --- |
| **AI Notes + Flashcards** (`src/services/ai-notes.ts`, `/api/ai-notes/generate`) | Gemini 2.5 Flash Lite summarizes pasted study material and returns Markdown plus >= 20 flashcards. Output is persisted through Prisma (`note`, `flashcard`) and activity tracking before being surfaced in the dashboard. |
| **Goal Helper Chat** (`/api/goal-helper/chat`, `src/services/vector-store.ts`) | Uses OCR/Drive ingestion to populate a Supabase `documents` table with pgvector embeddings (`match_documents` RPC). Incoming prompts hydrate Gemini with a context block built from the best matches, then return markdown answers plus references. |
| **Weekly Wrapped** (`/api/weekly-wrapped`) | Aggregates the past two weeks of sessions, progress, notes, and exams via Prisma, then instructs Gemini to build a motivational wrap-up JSON payload that powers the dashboard's "cat personality" card. |
| **Flashcards & Study Deck** (`/api/flashcard`, `/api/study-deck`) | Flashcards store front/back content, answered state, and a `flashcardProgress` percentage on their parent `note`. Study deck queries the latest cards per course and formats data for dashboards. |
| **Sessions, Notes, and Exams** (`/api/study-session`, `/api/notes`, `/api/exam-score`, `/api/test`) | Timed sessions push cumulative `session` and `progress` metrics, note CRUD stores Slate/Markdown bodies, exams attach scores to notes and can be generated on-demand using Gemini. |
| **Text extraction pipeline** (`/api/extract-text`, `src/services/ocr-space.ts`) | Users upload PDF/DOCX or connect Google Drive; the route validates type/size, hits OCR.space, persists embeddings, and returns raw text for downstream AI features. |

## Data model & persistence

Prisma (`src/lib/prisma.ts`) targets the Postgres schema managed in `prisma/schema.prisma` (not shown here). Key tables visible from the services include:

- `profile` - Supabase user profile (email, username, streaks).
- `note` - Study notes, creation/modification timestamps, `flashcardProgress`, AI flag.
- `flashcard` - Belongs to a note & user, stores fronts/backs and answered state.
- `exam` - Records quiz/test attempts for a note with numeric score and submission date.
- `session` - Tracks the longest Pomodoro/study streak.
- `progress` - Daily aggregates from timer sessions.
- `activity` - Lightweight audit log for Notes, Flashcards, Exams, etc.
- `documents` - Supabase table with `content`, `metadata`, and `embedding` (pgvector) used for retrieval augmented chat.

Authentication and authorization are delegated to Supabase. Server routes grab the session via the cookie-based helpers in `src/lib/supabase/server.ts`, ensuring only logged-in users reach Prisma. Authorization is currently coarse-grained (checks `user.id` / `user.email` before each action); add row-level checks before exposing APIs publicly.

## External dependencies

- **Google Gemini** - `@google/generative-ai` and `@langchain/google-genai` power summarization, flashcard generation, practice tests, goal helper responses, etc. Configure `GEMINI_API_KEY` (and optionally `GOAL_HELPER_MODEL`).
- **OCR.space** - PDF/DOCX parsing with custom error handling (`OcrServiceError`). Requires `OCR_SPACE_API_KEY`.
- **Supabase** - Auth, storage for embeddings, RPC `match_documents` to perform pgvector similarity search.

## Extending the system

1. **Add a new API route** - colocate under `src/app/api/<feature>/route.ts`, import `createClient` for auth, and move heavy lifting into `src/services/<feature>.ts`.
2. **Share utilities** - expose only stable helpers under `src/lib` as noted in `AGENTS.md`; feature-specific logic belongs next to the components or routes it supports.
3. **Document changes** - update this file if you add a data store or integration, and list new endpoints in `docs/api-reference.md`.

Keeping domain logic in `src/services/**` while letting App Router handlers focus on auth + validation keeps the Next.js server bundle small and makes it easier to unit-test services independently.
