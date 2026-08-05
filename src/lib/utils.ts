import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Descendant } from "slate";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const glaresPositions = [
  {
    left: "0%",
    top: "0%",
    delay: "0s",
    duration: "5s",
  },
  {
    left: "25%",
    top: "15%",
    delay: "0.5s",
    duration: "7s",
  },
  {
    left: "75%",
    top: "20%",
    delay: "1.2s",
    duration: "6s",
  },
  {
    left: "90%",
    top: "45%",
    delay: "0.8s",
    duration: "8s",
  },
  {
    left: "60%",
    top: "75%",
    delay: "1.5s",
    duration: "5.5s",
  },
  {
    left: "10%",
    top: "85%",
    delay: "2s",
    duration: "7.5s",
  },
  {
    left: "45%",
    top: "35%",
    delay: "0.3s",
    duration: "6.5s",
  },
  {
    left: "80%",
    top: "5%",
    delay: "1.8s",
    duration: "4.5s",
  },
  {
    left: "35%",
    top: "95%",
    delay: "1s",
    duration: "6.8s",
  },
];
interface HotKeyMap {
  [key: string]: string;
}

export type CustomElementType =
  | "paragraph"
  | "code"
  | "block_quote"
  | "list_item"
  | "heading_one"
  | "heading_two"
  | "heading_three"
  | "heading_four"
  | "heading_five"
  | "heading_six"
  | "block-quote"
  | "ul_list"
  | "ol_list"
  | "bulleted_list"
  | "numbered_list"
  | "list-item"
  | "heading-one"
  | "heading-two"
  | "bulleted-list"
  | "numbered-list"
  | "link";

export const ICON_SIZE = 18;
export const HOTKEYS: HotKeyMap = {
  b: "bold",
  i: "italic",
  u: "underline",
  "`": "code",
};
export const LIST_TYPES = ["numbered-list", "bulleted-list"];
export const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

export type ListType = (typeof LIST_TYPES)[number];
export type AlignType = (typeof TEXT_ALIGN_TYPES)[number];

import markdown from "remark-parse";
import slate from "remark-slate";
import { unified } from "unified";
import { CustomElement, CustomText } from "@/providers/editor-provider";
import { prisma } from "./prisma";

export const parseMarkdown = async (md: string): Promise<Descendant[]> => {
  try {
    const result = await unified().use(markdown).use(slate).process(md);
    return result.result as Descendant[];
  } catch (error) {
    console.error("Failed to parse markdown:", error);
    return [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ];
  }
};

interface Heading {
  id: string;
  text: string;
  level: number;
  type:
    | "heading-one"
    | "heading-two"
    | "paragraph"
    | "heading_one"
    | "heading_two";
}

export const extractHeadings = (nodes: CustomElement[]): Heading[] => {
  if (!Array.isArray(nodes)) {
    return [];
  }

  const headings: Heading[] = [];

  nodes.forEach((node: CustomElement) => {
    if (
      node.type === "heading-one" ||
      node.type === "heading_one" ||
      node.type === "heading_two" ||
      node.type === "heading-two"
    ) {
      const text = node.children
        .map((child: CustomText) => child.text)
        .join("");
      headings.push({
        id: text.toLowerCase().replace(/\s+/g, "-"),
        text,
        level: node.type.includes("one") ? 1 : 2,
        type: node.type,
      });
    }
    // Check for paragraphs with bold text
    else if (node.type === "paragraph") {
      const hasBoldText = node.children.some((child: CustomText) => child.bold);
      if (hasBoldText) {
        const text = node.children
          .map((child: CustomText) => child.text)
          .join("");
        headings.push({
          id: `paragraph-${text.toLowerCase().replace(/\s+/g, "-")}`,
          text,
          level: 3, // Give paragraphs a lower level than headings
          type: "paragraph",
        });
      }
    }
  });

  // Sort by appearance in document (maintain reading order)
  return headings;
};

export const getCurrentWeekProgress = async (id: string) => {
  const weeklyProgress = await prisma.progress.findMany({
    where: {
      userId: id,
    },
    orderBy: {
      date: "asc",
    },
  });

  return weeklyProgress;
};
