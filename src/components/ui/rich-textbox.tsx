"use client";
import { useRef, useState } from "react";
import {
  MdCode,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight /* ...other imports */,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatUnderlined,
  MdLooksOne,
  MdLooksTwo,
} from "react-icons/md";
import {
  BaseEditor,
  Descendant,
  Editor,
  Element,
  Transforms,
  createEditor,
} from "slate";
import { withHistory } from "slate-history";
import { Editable, ReactEditor, Slate, useSlate, withReact } from "slate-react";
import { useEditor } from "@/providers/editor-provider";
import { CustomElement, CustomText } from "@/providers/editor-provider";
import {
  AlignType,
  cn,
  CustomElementType,
  HOTKEYS,
  ICON_SIZE,
  LIST_TYPES,
  ListType,
  TEXT_ALIGN_TYPES,
} from "@/lib/utils";

import "./styles/RichTextbox.css";
import { PenLine, PenLineIcon, Save, X } from "lucide-react";
import { Button } from "./button";
import { useParams } from "next/navigation";
import { runWithToast } from "@/lib/toast";
import LoadingSpinner from "@/components/feedback/loading-spinner";

interface CustomEditorType {
  isMarkActive: (
    editor: BaseEditor & ReactEditor,
    format: keyof Omit<CustomText, "text">
  ) => boolean;
  isBlockActive: (
    editor: BaseEditor & ReactEditor,
    format: string,
    blockType?: "type" | "align"
  ) => boolean;
  toggleMark: (
    editor: BaseEditor & ReactEditor,
    format: keyof Omit<CustomText, "text">
  ) => void;
  toggleBlock: (
    editor: BaseEditor & ReactEditor,
    format: CustomElementType
  ) => void;
}

const CustomEditor: CustomEditorType = {
  isMarkActive(editor, format) {
    try {
      const marks = Editor.marks(editor);
      return marks ? marks[format] === true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  isBlockActive(editor, format, blockType = "type") {
    const { selection } = editor;
    if (!selection) return false;

    try {
      const [match] = Array.from(
        Editor.nodes(editor, {
          at: Editor.unhangRange(editor, selection),
          match: (n) =>
            !Editor.isEditor(n) &&
            Element.isElement(n) &&
            n[blockType] === format,
        })
      );

      return !!match;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  toggleMark(editor, format) {
    const isActive = CustomEditor.isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  },

  toggleBlock(editor, format) {
    const isActive = CustomEditor.isBlockActive(
      editor,
      format,
      TEXT_ALIGN_TYPES.includes(format as AlignType) ? "align" : "type"
    );
    const isList = LIST_TYPES.includes(format as ListType);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        LIST_TYPES.includes(n.type as ListType) &&
        !TEXT_ALIGN_TYPES.includes(format as AlignType),
      split: true,
    });

    let newProperties: Partial<CustomElement>;
    if (TEXT_ALIGN_TYPES.includes(format as AlignType)) {
      newProperties = { align: isActive ? undefined : (format as AlignType) };
    } else {
      newProperties = {
        type: isActive
          ? "paragraph"
          : isList
          ? "list-item"
          : (format as CustomElement["type"]),
      };
    }

    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
      const block: CustomElement = {
        type: format as CustomElementType,
        children: [],
      };
      Transforms.wrapNodes(editor, block);
    }
  },
};

interface ButtonProps {
  format: string;
  icon: React.ReactNode;
}

const MarkButton: React.FC<ButtonProps> = ({ format, icon }) => {
  const editor = useSlate();

  return (
    <button
      type="button"
      data-active={CustomEditor.isMarkActive(
        editor,
        format as keyof Omit<CustomText, "text">
      )}
      onClick={(e) => {
        e.preventDefault();
        CustomEditor.toggleMark(
          editor,
          format as keyof Omit<CustomText, "text">
        );
      }}
    >
      {icon}
    </button>
  );
};

const BlockButton: React.FC<ButtonProps> = ({ format, icon }) => {
  const editor = useSlate();

  return (
    <button
      type="button"
      data-active={CustomEditor.isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format as AlignType) ? "align" : "type"
      )}
      onClick={(e) => {
        e.preventDefault();
        CustomEditor.toggleBlock(editor, format as CustomElementType);
      }}
    >
      {icon}
    </button>
  );
};

const RichTextbox = ({
  readOnly = false,
  className,
}: {
  readOnly?: boolean;
  className?: string;
}) => {
  const { renderElement, renderLeaf, contentValue, changeContentValue } =
    useEditor();

  const initialValueRef = useRef<Descendant[]>(contentValue);

  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();

  const handleChange = (value: Descendant[]) => {
    const isAstChange = editor.operations.some(
      (op) => op.type !== "set_selection"
    );

    if (isAstChange) changeContentValue(value);
  };

  const handleCancel = () => {
    setIsEditable(false);
    Transforms.deselect(editor);

    const resetValue = JSON.parse(JSON.stringify(initialValueRef.current));
    editor.children = resetValue;
    editor.onChange();

    // const point = { path: [0, 0], offset: 0 };
    Transforms.deselect(editor);
  };

  const handleSave = async () => {
    setIsEditable(false);
    // Reset content to initial value if needed
    Transforms.deselect(editor);

    try {
      setIsLoading(true);

      await runWithToast(
        async () => {
          const response = await fetch(`/api/notes/${params.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: JSON.stringify(contentValue),
              lastModified: new Date(),
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update note");
          }
        },
        {
          loading: "Updating note...",
          success: "Note updated successfully!",
          error: "Failed to update note. Please try again.",
        },
        { toastId: "updateNote" }
      );
    } catch (error) {
      console.log(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Alert */}
      {isEditable && (
        <div
          className="fixed left-1/2 top-4 z-50 -translate-x-1/2 transform"
          role="alert"
        >
          <div className="flex items-center justify-between gap-4 rounded-lg bg-purple-500/90 px-4 py-2 text-sm text-white shadow-lg backdrop-blur-sm transition-all duration-200">
            <div className="flex items-center gap-2">
              <PenLineIcon size={16} />
              <span>You are currently editing this note</span>
            </div>

            <Button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-md px-2 py-1 hover:text-white"
            >
              <Save size={16} />
              <span className="text-sm">Save</span>
            </Button>
          </div>
        </div>
      )}
      <Slate
        editor={editor}
        initialValue={contentValue}
        onChange={handleChange}
      >
        <div className="editor relative w-full rounded-xl">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-black/60">
              <LoadingSpinner
                label="Saving changes..."
                variant="light"
                className="text-white"
              />
            </div>
          )}
          {!readOnly && (
            <div className="editor__toolbar">
              <div
                className={cn(
                  "flex items-center opacity-100 transition-all duration-200",
                  (!isEditable || isLoading) && "opacity-10"
                )}
              >
                <MarkButton
                  format="bold"
                  icon={<MdFormatBold size={ICON_SIZE} />}
                />
                <MarkButton
                  format="italic"
                  icon={<MdFormatItalic size={ICON_SIZE} />}
                />
                <MarkButton
                  format="underline"
                  icon={<MdFormatUnderlined size={ICON_SIZE} />}
                />
                <MarkButton format="code" icon={<MdCode size={ICON_SIZE} />} />
                <BlockButton
                  format="heading_one"
                  icon={<MdLooksOne size={ICON_SIZE} />}
                />
                <BlockButton
                  format="heading_two"
                  icon={<MdLooksTwo size={ICON_SIZE} />}
                />
                <BlockButton
                  format="block-quote"
                  icon={<MdFormatQuote size={ICON_SIZE} />}
                />
                <BlockButton
                  format="numbered-list"
                  icon={<MdFormatListNumbered size={ICON_SIZE} />}
                />
                <BlockButton
                  format="bulleted-list"
                  icon={<MdFormatListBulleted size={ICON_SIZE} />}
                />
                <BlockButton
                  format="left"
                  icon={<MdFormatAlignLeft size={ICON_SIZE} />}
                />
                <BlockButton
                  format="center"
                  icon={<MdFormatAlignCenter size={ICON_SIZE} />}
                />
                <BlockButton
                  format="right"
                  icon={<MdFormatAlignRight size={ICON_SIZE} />}
                />
                <BlockButton
                  format="justify"
                  icon={<MdFormatAlignJustify size={ICON_SIZE} />}
                />
              </div>
              {/* Add edit toggle button at the end of toolbar */}
              {isEditable ? (
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant={"ghost"}
                    onClick={handleCancel}
                    className={"ml-auto hover:text-white"}
                  >
                    <X size={16} /> Cancel
                  </Button>

                  <Button
                    variant={"ghost"}
                    onClick={handleSave}
                    className={"ml-auto hover:text-white"}
                  >
                    <Save size={16} /> Save
                  </Button>
                </div>
              ) : (
                <Button
                  variant={"ghost"}
                  onClick={() => setIsEditable(true)}
                  className={"ml-auto"}
                >
                  <PenLine size={16} /> Edit
                </Button>
              )}
            </div>
          )}
          <Editable
            className={cn(
              "editor__content",
              (!isEditable || isLoading) && "cursor-default",
              className
            )}
            readOnly={!isEditable || isLoading}
            id="content"
            name="content"
            spellCheck
            placeholder="Add your content here..."
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event: React.KeyboardEvent) => {
              if (!isEditable || isLoading) return;
              if (event.ctrlKey && event.key in HOTKEYS) {
                event.preventDefault();
                const mark = HOTKEYS[event.key];
                CustomEditor.toggleMark(
                  editor,
                  mark as keyof Omit<CustomText, "text">
                );
              }
            }}
          />
        </div>
      </Slate>
    </>
  );
};

export default RichTextbox;
