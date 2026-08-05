"use client";

import { useState } from "react";
import { Descendant, Editor, createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";

import { useEditor } from "@/providers/editor-provider";
import { HOTKEYS } from "@/lib/utils";
import type { CustomText } from "@/providers/editor-provider";

interface PasteEditorProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  isDisabled?: boolean;
  placeholder?: string;
  revision?: number;
}

export default function PasteEditor({
  value,
  onChange,
  isDisabled = false,
  placeholder = "Paste your notes here. AI will do the rest",
  revision = 0,
}: PasteEditorProps) {
  const { renderElement, renderLeaf } = useEditor();
  const [editor] = useState(() => withHistory(withReact(createEditor())));

  return (
    <Slate
      key={revision}
      editor={editor}
      initialValue={value}
      onChange={(nextValue) => {
        if (!isDisabled) {
          onChange(nextValue);
        }
      }}
    >
      <Editable
        className="min-h-100 w-full rounded-3xl bg-gray-900/15 dark:bg-[#F8F7FC]/30 p-8 text-base text-black dark:text-white focus:outline-none"
        style={{ minHeight: 400 }}
        readOnly={isDisabled}
        placeholder={placeholder}
        spellCheck
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          if (isDisabled) return;
          if (event.ctrlKey && event.key in HOTKEYS) {
            event.preventDefault();
            const mark = HOTKEYS[event.key];
            if (mark) {
              const slateEditor = editor;
              // Slate operations mutate the editor directly; mimic toggleMark
              const isActive = SlateEditorHelpers.isMarkActive(
                slateEditor,
                mark as keyof Omit<CustomText, "text">
              );
              if (isActive) {
                SlateEditorHelpers.removeMark(
                  slateEditor,
                  mark as keyof Omit<CustomText, "text">
                );
              } else {
                SlateEditorHelpers.addMark(
                  slateEditor,
                  mark as keyof Omit<CustomText, "text">
                );
              }
            }
          }
        }}
      />
    </Slate>
  );
}

const SlateEditorHelpers = {
  isMarkActive(
    editor: ReturnType<typeof createEditor>,
    format: keyof Omit<CustomText, "text">
  ) {
    try {
      const marks = Editor.marks(editor);
      return marks ? marks[format] === true : false;
    } catch {
      return false;
    }
  },
  addMark(
    editor: ReturnType<typeof createEditor>,
    format: keyof Omit<CustomText, "text">
  ) {
    Editor.addMark(editor, format, true);
  },
  removeMark(
    editor: ReturnType<typeof createEditor>,
    format: keyof Omit<CustomText, "text">
  ) {
    Editor.removeMark(editor, format);
  },
};
