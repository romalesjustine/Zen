"use client";
import React, { useMemo, useState } from "react";
import Markdown from "react-markdown";
import { NotebookPen, ChevronLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Note } from "@prisma/client";
import EditorProvider, { CustomElement } from "@/providers/editor-provider";
import RichTextbox from "@/components/ui/rich-textbox";
import { Descendant } from "slate";
import { useRouter } from "next/navigation";
import { extractHeadings } from "@/lib/utils";
import NoteSidebar from "@/components/studydeck/[id]/note-sidebar";
import CreateTest from "@/components/modals/create-test-modal";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkSlate from "remark-slate";

const EMPTY_DOCUMENT: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const markdownToSlate = (markdown: string): Descendant[] => {
  if (!markdown || typeof markdown !== "string") {
    return EMPTY_DOCUMENT;
  }

  const trimmed = markdown.trim();
  if (!trimmed) {
    return EMPTY_DOCUMENT;
  }

  try {
    const processed = unified()
      .use(remarkParse)
      .use(remarkSlate)
      .processSync(trimmed);

    const result = (processed.result ?? processed.value) as
      | Descendant[]
      | undefined;

    if (Array.isArray(result) && result.length > 0) {
      return result;
    }
  } catch (error) {
    console.error("Failed to convert markdown to Slate nodes:", error);
  }

  const fallbackBlocks = trimmed
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (fallbackBlocks.length === 0) {
    return EMPTY_DOCUMENT;
  }

  return fallbackBlocks.map((block) => ({
    type: "paragraph",
    children: [{ text: block }],
  }));
};

const parseContent = (content: Note["content"]): Descendant[] => {
  if (!content) {
    return EMPTY_DOCUMENT;
  }

  if (Array.isArray(content)) {
    return content as Descendant[];
  }

  if (typeof content === "string") {
    try {
      return JSON.parse(content) as Descendant[];
    } catch (error) {
      console.warn(
        "Failed to parse note content string as JSON. Falling back to markdown conversion.",
        error
      );
      return markdownToSlate(content);
    }
  }

  if (typeof content === "object") {
    const record = content as Record<string, unknown>;
    if (typeof record.markdown === "string") {
      return markdownToSlate(record.markdown);
    }

    if (Array.isArray(record.content)) {
      return record.content as Descendant[];
    }

    if (Array.isArray(record.nodes)) {
      return record.nodes as Descendant[];
    }

    console.warn("Unrecognized note content object shape.", record);
    return EMPTY_DOCUMENT;
  }

  return EMPTY_DOCUMENT;
};

const NoteContainer = ({ note }: { note: Note }) => {
  const initialContent = useMemo(
    () => parseContent(note.content),
    [note.content]
  );

  const [contentValue, setContentValue] =
    useState<Descendant[]>(initialContent);

  const headings = extractHeadings(contentValue as CustomElement[]);
  console.log(headings);

  const router = useRouter();

  return (
    <div className="flex max-h-full w-full max-w-[1300px] p-10 flex-col">
      <div className="relative mb-8 flex w-full items-center justify-center">
        <div className="absolute left-0">
          <button onClick={() => router.back()}>
            <ChevronLeft size={36} className="dark:text-light text-black" />
          </button>
        </div>
        <h1 className="text-3xl dark:text-light text-black">Study Highlights</h1>
      </div>
      <div className="">
        <div className="flex items-center justify-between border-b border-black dark:border-white/30 py-4">
          <div className="text-2xl font-semibold">
          <h1 className="dark:text-light text-black">{note?.title}</h1>
          </div>
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex min-w-fit items-center justify-center gap-2 rounded-xl bg-[radial-gradient(50%_50%_at_50%_50%,#9B77CB_0%,#591DA9_100%)] px-4 py-2 text-white transition-opacity duration-200 hover:opacity-90">
                <NotebookPen size={18} />
                <span>Notes</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-purple-600 bg-black text-white">
                <CreateTest id={note.id} title={note?.title}>
                  <DropdownMenuItem className="from-[#9B77CB] to-[#591DA9] hover:bg-gradient-to-r hover:text-white focus:bg-gradient-to-r focus:from-[#9B77CB] focus:to-[#591DA9] focus:text-white">
                    Test
                  </DropdownMenuItem>
                </CreateTest>
                <DropdownMenuItem className="from-[#9B77CB] to-[#591DA9] hover:bg-gradient-to-r hover:text-white focus:bg-gradient-to-r focus:from-[#9B77CB] focus:to-[#591DA9] focus:text-white">
                  Flashcards
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <button className="flex items-center justify-center rounded-xl border border-white/20 p-2 transition-colors duration-200 hover:bg-white/10">
              <PenLine size={24} />
            </button> */}
          </div>
        </div>
      </div>

      <div className="max-h-1/2 mt-6 flex w-full max-w-none">
        <EditorProvider
          contentValue={contentValue}
          changeContentValue={setContentValue}
        >
          <RichTextbox />
        </EditorProvider>
        <NoteSidebar headings={headings} />
      </div>
    </div>
  );
};

export default NoteContainer;
