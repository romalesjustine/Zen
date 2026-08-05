import { ClipboardPaste, Upload, HardDrive } from "lucide-react";

interface UploadDescriptionModeProps {
  mode: string;
}

export function UploadDescriptionMode({ mode }: UploadDescriptionModeProps) {
  switch (mode) {
    case "paste":
      return (
        <div className="flex items-center gap-4">
          <div className="bg-black dark:bg-white w-fit p-4 aspect-square rounded-full">
            <ClipboardPaste size={23} className="text-white dark:text-black" />
          </div>
          <div>
            <h2 className="dark:text-light text-black">Paste Notes</h2>
            <p className="font-extralight text-gray-900 dark:text-[#A9ACB4]">
              Enter or paste your notes to get started.
            </p>
          </div>
        </div>
      );

    case "upload":
      return (
        <div className="flex items-center gap-4">
          <div className="bg-black dark:bg-white w-fit p-4 aspect-square rounded-full">
            <Upload size={23} className="text-white dark:text-black" />
          </div>
          <div>
            <h2 className="dark:text-light text-black">Upload Files</h2>
            <p className="font-extralight text-gray-900 dark:text-[#A9ACB4]">
              Select and upload the files of your choice
            </p>
          </div>
        </div>
      );

    case "gdrive":
      return (
        <div className="flex items-center gap-4">
          <div className="bg-black dark:bg-white w-fit p-4 aspect-square rounded-full">
            <HardDrive size={23} className="text-white dark:text-black" />
          </div>
          <div>
            <h2 className="dark:text-light text-black">Google Drive</h2>
            <p className="font-extralight text-gray-900 dark:text-[#A9ACB4]">
              Select and import files from your drive
            </p>
          </div>
        </div>
      );
  }
}
