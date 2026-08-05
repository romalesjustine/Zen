"use client";
import React from "react";
import { ClipboardPaste, Upload, HardDrive } from "lucide-react";

interface UploadModeProps {
  mode: string;
  setMode: (mode: string) => void;
}

export function UploadMode({ mode, setMode }: UploadModeProps) {
  return (
    <div className="flex items-center gap-[50px] text-black dark:text-white">
      <button
        className={`flex items-center space-x-2 cursor-pointer hover:opacity-50 p-2 ${
          mode === "paste" ? "border-b  border-black dark:border-white" : ""
        }`}
        onClick={() => setMode("paste")}
      >
        <ClipboardPaste size={20} />
        <h3>Paste Text</h3>
      </button>
      <button
        className={`flex items-center space-x-2 cursor-pointer hover:opacity-50 p-2 ${
          mode === "upload" ? "border-b border-black dark:border-white" : ""
        }`}
        onClick={() => setMode("upload")}
      >
        <Upload size={20} />
        <h3>Upload File</h3>
      </button>
      <button
        className={`flex items-center space-x-2 cursor-pointer hover:opacity-50 p-2 ${
          mode === "gdrive" ? "border-b  border-black dark:border-white" : ""
        }`}
        onClick={() => setMode("gdrive")}
      >
        <HardDrive size={20} className="dark:text-light text-black" />
        <h3>Google Drive</h3>
      </button>
    </div>
  );
}
