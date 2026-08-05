"use client";

import { useMemo, useState, useCallback } from "react";
import { Descendant, Node } from "slate";

import { UploadMode } from "@/components/ai-notes/upload-mode";
import { UploadBox } from "@/components/ai-notes/upload-box";
import { UploadDescriptionMode } from "@/components/ai-notes/upload-description";
import { AIButton } from "@/components/ai-button";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { UsageLimitBanner } from "@/components/dashboard/usage-limit-banner";

const createEmptyDocument = (): Descendant[] => [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const richTextFromString = (value: string): Descendant[] => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return createEmptyDocument();
  }

  return trimmed.split(/\n{2,}/).map((block) => ({
    type: "paragraph",
    children: [{ text: block }],
  }));
};

const richTextToPlainString = (value: Descendant[]): string => {
  if (!Array.isArray(value) || value.length === 0) {
    return "";
  }

  return value
    .map((node) => Node.string(node).trim())
    .filter(Boolean)
    .join("\n\n")
    .trim();
};

export default function AINotesPage() {
  const [mode, setMode] = useState("paste");
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [pasteValue, setPasteValue] = useState<Descendant[]>(
    createEmptyDocument()
  );
  const [editorRevision, setEditorRevision] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [deadline, setDeadline] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const handleRemoveFile = () => {
    setSelectedFile(undefined);
  };

  const handlePrefillFromText = useCallback((incomingText: string) => {
    setPasteValue(richTextFromString(incomingText));
    setEditorRevision((prev) => prev + 1);
  }, []);

  const handlePasteValueChange = useCallback((value: Descendant[]) => {
    setPasteValue(value);
  }, []);

  const resetPasteValue = () => {
    setPasteValue(createEmptyDocument());
    setEditorRevision((prev) => prev + 1);
  };

  const plainTextContent = useMemo(
    () => richTextToPlainString(pasteValue),
    [pasteValue]
  );

  const openGenerateModal = () => {
    if (!plainTextContent.trim()) {
      showErrorToast("Please provide text content before generating notes.");
      return;
    }
    setShowDeadlineModal(true);
  };

  const cancelGenerate = () => {
    setShowDeadlineModal(false);
    setDeadline("");
  };

  const handleGenerateNotes = async () => {
    if (!plainTextContent.trim()) {
      showErrorToast("Please provide text content before generating notes.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai-notes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          text: plainTextContent,
          deadline: deadline || undefined 
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        const errorMessage = payload.error ?? "Failed to generate notes.";
        
        // Check if it's a subscription limit error
        if (response.status === 403) {
          showErrorToast(`${errorMessage} Upgrade to Premium for unlimited access!`);
        } else {
          showErrorToast(errorMessage);
        }
        return;
      }

      showSuccessToast("Notes and flashcards generated successfully!");
      setSelectedFile(undefined);
      resetPasteValue();
      setDeadline("");
      setShowDeadlineModal(false);
    } catch (error) {
      console.error(error);
      showErrorToast(
        error instanceof Error
          ? error.message
          : "Unexpected error generating notes."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8">
      {showDeadlineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col gap-6 rounded-lg bg-primary-7 p-8 w-[400px]">
            <h3 className="text-2xl font-bold text-light">Generate AI Notes</h3>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="ai-deadline" className="text-light text-sm font-medium">
                Set Deadline (Optional)
              </label>
              <input
                type="date"
                id="ai-deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="px-4 py-2 rounded-lg bg-primary-8 text-light border border-primary-3 focus:outline-none focus:border-accent-200"
              />
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={cancelGenerate}
                className="px-6 py-2 rounded-lg bg-gray/20 text-light hover:bg-gray/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateNotes}
                disabled={isGenerating}
                className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-light transition-colors disabled:opacity-50"
              >
                Generate Notes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 px-10">
        <UsageLimitBanner />
        <UploadMode mode={mode} setMode={setMode} />
        <div className="mt-[30px] border-b border-black dark:border-white px-2 pb-[20px] pt-[10px]">
          <UploadDescriptionMode mode={mode} />
        </div>
        <div className="mt-[40px]">
          <UploadBox
            mode={mode}
            selectedFile={selectedFile}
            handleFileChange={handleFileChange}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleRemoveFile={handleRemoveFile}
            pasteValue={pasteValue}
            onPasteValueChange={handlePasteValueChange}
            onPrefillFromText={handlePrefillFromText}
            editorRevision={editorRevision}
            isUploadingFile={isUploadingFile}
            isGenerating={isGenerating}
            setIsUploadingFile={setIsUploadingFile}
          />
          <div className="flex justify-center">
            <AIButton
              className="mt-12 px-[64px] text-xl disabled:opacity-60"
              onClick={openGenerateModal}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Notes"}
            </AIButton>
          </div>
        </div>
      </div>
    </div>
  );
}
