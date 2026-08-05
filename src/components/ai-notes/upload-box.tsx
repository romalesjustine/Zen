"use client";

import { useEffect, useMemo, useState } from "react";
import { Upload, X, FileText, HardDrive } from "lucide-react";
import { Descendant } from "slate";

import EditorProvider from "@/providers/editor-provider";
import PasteEditor from "./paste-editor";
import { showErrorToast } from "@/lib/toast";

const ACCEPTED_FILE_EXTENSIONS = [".pdf", ".docx"];
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPT_ATTRIBUTE = ACCEPTED_FILE_EXTENSIONS.join(",");
const GOOGLE_API_SRC = "https://apis.google.com/js/api.js";
const GOOGLE_GIS_SRC = "https://accounts.google.com/gsi/client";
const GOOGLE_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.readonly";
const DRIVE_PICKER_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.google-apps.document",
  "application/vnd.google-apps.presentation",
];
const GOOGLE_NATIVE_EXPORT_TARGETS: Record<
  string,
  { mimeType: string; extension: string }
> = {
  "application/vnd.google-apps.document": {
    mimeType: "application/pdf",
    extension: ".pdf",
  },
  "application/vnd.google-apps.presentation": {
    mimeType: "application/pdf",
    extension: ".pdf",
  },
};

type GooglePickerDocument = {
  id: string;
  name: string;
  mimeType?: string;
};

type GoogleDriveSelectionState = {
  name: string;
  mimeType?: string;
} | null;

type GooglePickerResponse = {
  action?: string;
  docs?: GooglePickerDocument[];
};

type GoogleTokenClient = {
  requestAccessToken: (options?: { prompt?: string }) => void;
  callback: (response: { access_token: string }) => void;
} | null;

type DriveDownloadConfig = {
  url: string;
  fileName: string;
  mimeType?: string;
};

type UploadSource = "upload" | "google_drive";

type GooglePickerDocsView = {
  setIncludeFolders: (include: boolean) => GooglePickerDocsView;
  setSelectFolderEnabled: (enabled: boolean) => GooglePickerDocsView;
  setMimeTypes: (mimeTypes: string) => GooglePickerDocsView;
};

type GooglePickerBuilder = {
  setOAuthToken: (token: string) => GooglePickerBuilder;
  setDeveloperKey: (key: string) => GooglePickerBuilder;
  setCallback: (
    callback: (data: GooglePickerResponse) => void
  ) => GooglePickerBuilder;
  setAppId: (appId: string) => GooglePickerBuilder;
  addView: (view: GooglePickerDocsView) => GooglePickerBuilder;
  build: () => {
    setVisible: (visible: boolean) => void;
  };
};

type GooglePickerNamespace = {
  ViewId: { DOCS: string };
  Action: { PICKED: string; CANCEL: string };
  DocsView: new (viewId: string) => GooglePickerDocsView;
  PickerBuilder: new () => GooglePickerBuilder;
};

const scriptCache: Record<string, Promise<void> | undefined> = {};

const loadScript = (src: string) => {
  if (scriptCache[src]) {
    return scriptCache[src];
  }

  scriptCache[src] = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`
    );
    if (existing) {
      if (existing.getAttribute("data-loaded") === "true") {
        resolve();
        return;
      }

      existing.addEventListener("load", () => {
        existing.setAttribute("data-loaded", "true");
        resolve();
      });
      existing.addEventListener("error", () =>
        reject(new Error(`Failed to load remote script: ${src}`))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.setAttribute("data-loaded", "true");
      resolve();
    };
    script.onerror = () =>
      reject(new Error(`Failed to load remote script: ${src}`));
    document.body.appendChild(script);
  });

  return scriptCache[src];
};

declare global {
  interface Window {
    gapi?: {
      load: (module: string, cb: () => void) => void;
    };
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string }) => void;
          }) => GoogleTokenClient;
        };
      };
      picker?: GooglePickerNamespace;
    };
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

interface UploadBoxProps {
  mode: string;
  selectedFile: File | undefined;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleRemoveFile: () => void;
  pasteValue: Descendant[];
  onPasteValueChange: (value: Descendant[]) => void;
  onPrefillFromText: (text: string) => void;
  editorRevision: number;
  isUploadingFile: boolean;
  isGenerating: boolean;
  setIsUploadingFile: (value: boolean) => void;
}

export function UploadBox({
  mode,
  selectedFile,
  handleFileChange,
  handleDrop,
  handleDragOver,
  handleRemoveFile,
  pasteValue,
  onPasteValueChange,
  onPrefillFromText,
  editorRevision,
  isUploadingFile,
  isGenerating,
  setIsUploadingFile,
}: UploadBoxProps) {
  const googleDriveApiKey = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY ?? "";
  const googleDriveClientId =
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID ?? "";
  const googleDriveAppId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_APP_ID ?? "";

  const [tokenClient, setTokenClient] = useState<GoogleTokenClient>(null);
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(null);
  const [isDrivePickerReady, setIsDrivePickerReady] = useState(false);
  const [isDriveInitializing, setIsDriveInitializing] = useState(false);
  const [isDriveDownloading, setIsDriveDownloading] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [driveSelection, setDriveSelection] =
    useState<GoogleDriveSelectionState>(null);
  const isDriveConfigured = Boolean(
    googleDriveApiKey && googleDriveClientId
  );

  useEffect(() => {
    if (!isDriveConfigured) {
      setDriveError(
        "Set NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID and NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY to enable Google Drive uploads."
      );
      return;
    }

    let isCancelled = false;
    setIsDriveInitializing(true);
    setDriveError(null);

    const initializePicker = async () => {
      try {
        await Promise.all([
          loadScript(GOOGLE_API_SRC),
          loadScript(GOOGLE_GIS_SRC),
        ]);
        if (isCancelled) return;

        if (!window.google?.accounts?.oauth2) {
          throw new Error("Google OAuth client is unavailable.");
        }

        const token = window.google.accounts.oauth2.initTokenClient({
          client_id: googleDriveClientId,
          scope: GOOGLE_DRIVE_SCOPE,
          callback: (response: { access_token: string }) => {
            if (!isCancelled) {
              setDriveAccessToken(response.access_token);
            }
          },
        });

        if (!token) {
          throw new Error("Unable to initialize Google OAuth client.");
        }

        if (!isCancelled) {
          setTokenClient(token);
        }

        if (!window.gapi) {
          throw new Error("Google API client is unavailable.");
        }

        window.gapi.load("picker", () => {
          if (isCancelled) return;
          setIsDrivePickerReady(true);
          setIsDriveInitializing(false);
        });
      } catch (error) {
        if (!isCancelled) {
          console.error("Google Drive picker initialization failed:", error);
          setDriveError(
            error instanceof Error
              ? error.message
              : "Unable to initialize Google Drive picker."
          );
          setIsDriveInitializing(false);
        }
      }
    };

    initializePicker();

    return () => {
      isCancelled = true;
    };
  }, [googleDriveClientId, isDriveConfigured]);

  const reportValidationIssue = (message: string) => {
    console.error(message);
    showErrorToast(message);
  };

  const isAllowedFileType = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension && ACCEPTED_FILE_EXTENSIONS.includes(`.${extension}`)) {
      return true;
    }

    return ACCEPTED_MIME_TYPES.includes(file.type);
  };

  const validateFile = (file: File) => {
    if (!isAllowedFileType(file)) {
      reportValidationIssue("Please upload a PDF or DOCX file.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      reportValidationIssue("File must be 5MB or smaller.");
      return false;
    }

    return true;
  };

  const sendForExtraction = async (
    file: File,
    source: UploadSource = "upload"
  ) => {
    const formData = new FormData();
    formData.append("file", file);
     formData.append("source", source);

    try {
      setIsUploadingFile(true);
      const response = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to extract text from file." }));
        
        // Check if it's a subscription limit error
        if (response.status === 403) {
          showErrorToast(`${errorData.error || "Daily upload limit reached."} Upgrade to Premium for unlimited uploads!`);
        } else {
          showErrorToast(errorData.error || "Failed to extract text from file.");
        }
        return;
      }

      const { text: extractedText } = (await response.json()) as {
        text?: string;
      };

      if (extractedText) {
        onPrefillFromText(extractedText);
      }
    } catch (error) {
      console.error(error);
      showErrorToast("An unexpected error occurred while processing the file.");
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleValidatedInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      event.target.value = "";
      return;
    }

    await sendForExtraction(file);
    handleFileChange(event);
  };

  const handleValidatedDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      return;
    }

    await sendForExtraction(file);
    handleDrop(event);
  };

  const overlayLabel = useMemo(() => {
    if (isDriveDownloading) {
      return "Downloading from Google Drive...";
    }

    if (isUploadingFile) {
      return "Extracting text...";
    }

    return "Generating notes...";
  }, [isDriveDownloading, isUploadingFile]);

  const driveButtonDisabled =
    !isDriveConfigured ||
    !isDrivePickerReady ||
    !tokenClient ||
    isDriveInitializing ||
    isDriveDownloading ||
    isUploadingFile ||
    isGenerating;

  const driveButtonLabel = (() => {
    if (!isDriveConfigured) {
      return "Configure Google Drive";
    }

    if (isDriveInitializing || !isDrivePickerReady || !tokenClient) {
      return "Loading Google Picker...";
    }

    if (isDriveDownloading || isUploadingFile) {
      return "Importing...";
    }

    return "Select File";
  })();

  const buildDriveDownloadConfig = (
    doc: GooglePickerDocument
  ): DriveDownloadConfig => {
    const baseName = doc.name || "drive-file";
    const nativeTarget = doc.mimeType
      ? GOOGLE_NATIVE_EXPORT_TARGETS[doc.mimeType]
      : null;

    if (nativeTarget) {
      const fileName = baseName.endsWith(nativeTarget.extension)
        ? baseName
        : `${baseName}${nativeTarget.extension}`;

      return {
        url: `https://www.googleapis.com/drive/v3/files/${doc.id}/export?mimeType=${encodeURIComponent(
          nativeTarget.mimeType
        )}`,
        fileName,
        mimeType: nativeTarget.mimeType,
      };
    }

    return {
      url: `https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`,
      fileName: baseName,
      mimeType: doc.mimeType,
    };
  };

  const downloadDriveFile = async (
    doc: GooglePickerDocument,
    oauthToken: string
  ) => {
    setDriveError(null);
    setIsDriveDownloading(true);

    try {
      const config = buildDriveDownloadConfig(doc);
      const response = await fetch(config.url, {
        headers: { Authorization: `Bearer ${oauthToken}` },
      });

      if (response.status === 401) {
        setDriveAccessToken(null);
        throw new Error("Google Drive session expired. Please try again.");
      }

      if (!response.ok) {
        throw new Error("Failed to download file from Google Drive.");
      }

      const blob = await response.blob();
      const file = new File([blob], config.fileName, {
        type: config.mimeType ?? blob.type ?? "application/octet-stream",
      });

      if (!validateFile(file)) {
        return;
      }

      await sendForExtraction(file, "google_drive");
      setDriveSelection({
        name: config.fileName,
        mimeType: config.mimeType ?? blob.type,
      });
    } catch (error) {
      console.error(error);
      setDriveError(
        error instanceof Error
          ? error.message
          : "Unable to download the selected Drive file."
      );
    } finally {
      setIsDriveDownloading(false);
    }
  };

  const handlePickerSelection = (
    data: GooglePickerResponse,
    oauthToken: string
  ) => {
    if (!data || !window.google?.picker) {
      return;
    }

    if (data.action === window.google.picker.Action.PICKED) {
      const doc = data.docs?.[0];
      if (doc) {
        void downloadDriveFile(doc, oauthToken);
      }
      return;
    }

    if (data.action === window.google.picker.Action.CANCEL) {
      setDriveError(null);
    }
  };

  const openDrivePicker = (oauthToken: string) => {
    const pickerNamespace = window.google?.picker;
    if (!pickerNamespace) {
      setDriveError(
        "Google Picker is unavailable. Refresh the page and try again."
      );
      return;
    }

    const view = new pickerNamespace.DocsView(
      pickerNamespace.ViewId.DOCS
    )
      .setIncludeFolders(false)
      .setSelectFolderEnabled(false)
      .setMimeTypes(DRIVE_PICKER_MIME_TYPES.join(","));

    const builder = new pickerNamespace.PickerBuilder()
      .setOAuthToken(oauthToken)
      .setDeveloperKey(googleDriveApiKey)
      .addView(view)
      .setCallback((data: GooglePickerResponse) =>
        handlePickerSelection(data, oauthToken)
      );

    if (googleDriveAppId) {
      builder.setAppId(googleDriveAppId);
    }

    builder.build().setVisible(true);
  };

  const handleOpenDrivePicker = () => {
    if (!isDriveConfigured) {
      setDriveError(
        "Google Drive credentials are missing. Update your .env to continue."
      );
      return;
    }

    if (!tokenClient) {
      setDriveError("Google Drive picker is still loading. Please try again.");
      return;
    }

    if (driveAccessToken) {
      openDrivePicker(driveAccessToken);
      return;
    }

    tokenClient.callback = (response: { access_token: string }) => {
      setDriveAccessToken(response.access_token);
      openDrivePicker(response.access_token);
    };

    tokenClient.requestAccessToken({ prompt: "consent" });
  };

  switch (mode) {
    case "paste":
      return (
        <div className="relative">
          <EditorProvider
            contentValue={pasteValue}
            changeContentValue={onPasteValueChange}
          >
            <PasteEditor
              value={pasteValue}
              onChange={onPasteValueChange}
              isDisabled={isUploadingFile || isGenerating}
              revision={editorRevision}
            />
          </EditorProvider>
          <LoadingOverlay
            isVisible={isUploadingFile || isGenerating}
            label={overlayLabel}
          />
        </div>
      );

    case "upload":
      return (
        <div className="relative">
          <div
            className="custom-dashed flex h-[400px] items-center justify-center rounded-lg border-white text-white"
            onDrop={handleValidatedDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex w-full flex-col items-center gap-4 px-6">
              {selectedFile ? (
                <div className="w-full max-w-2xl rounded-xl bg-white/10 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-white/20 p-3">
                        <FileText size={24} />
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-white">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-[#C0B4D0]">
                          {formatFileSize(selectedFile.size)}{" "}
                          {selectedFile.type || "Unknown type"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="rounded-full p-2 transition-colors hover:bg-white/10"
                    >
                      <X size={20} className="text-[#C0B4D0]" />
                    </button>
                  </div>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleValidatedInputChange}
                    accept={ACCEPT_ATTRIBUTE}
                  />
                  <button
                    onClick={() => document.getElementById("fileInput")?.click()}
                    className="mt-4 text-sm text-[#C0B4D0] transition-colors hover:text-white"
                  >
                    Choose a different file
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={80} strokeWidth={8} absoluteStrokeWidth={true} />
                  <div className="mt-2">
                    <h1 className="text-center text-3xl font-semibold">
                      Choose a file or drag & drop it here
                    </h1>
                    <h2 className="flex text-xl justify-center text-[#C0B4D0]">
                      PDF or DOCX formats, up to 5 MB
                    </h2>
                  </div>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleValidatedInputChange}
                    accept={ACCEPT_ATTRIBUTE}
                  />
                  <button
                    className="mt-5 rounded-2xl border-2 border-[#C0B4D0] px-8 py-4 hover:opacity-55"
                    onClick={() => document.getElementById("fileInput")?.click()}
                  >
                    Browse File
                  </button>
                </>
              )}
            </div>
          </div>
          <LoadingOverlay
            isVisible={isUploadingFile || isGenerating}
            label={overlayLabel}
          />
        </div>
      );

    case "gdrive":
      return (
        <div className="relative">
          <div className="custom-dashed flex h-[400px] items-center justify-center rounded-lg border-white text-white">
            <div className="flex max-w-2xl flex-col items-center gap-4 px-6 text-center">
              <HardDrive size={80} color="white" />
              <div className=" mt-2">
                <h1 className="text-3xl font-semibold">
                  Connect a Google Drive file
                </h1>
                {driveSelection ? (
                  <p className="text-lg text-[#C0B4D0]">
                    Last import: {driveSelection.name}
                    {driveSelection.mimeType ? ` (${driveSelection.mimeType})` : ""}
                  </p>
                ) : (
                  <p className="text-xl text-[#C0B4D0]">
                    PDF, DOCX, Docs, or Slides up to 5 MB
                  </p>
                )}
              </div>
              <button
                className="mt-5 rounded-2xl border-2 border-[#C0B4D0] px-8 py-4 transition-opacity hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={handleOpenDrivePicker}
                disabled={driveButtonDisabled}
              >
                {driveButtonLabel}
              </button>
              {driveError && (
                <p className="text-sm text-red-300">{driveError}</p>
              )}
              {!isDriveConfigured && (
                <p className="text-xs text-[#C0B4D0]">
                  Add NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID and
                  NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY to your environment.
                </p>
              )}
            </div>
          </div>
          <LoadingOverlay
            isVisible={isDriveDownloading || isUploadingFile || isGenerating}
            label={overlayLabel}
          />
        </div>
      );
  }
}

interface LoadingOverlayProps {
  isVisible: boolean;
  label: string;
}

const LoadingOverlay = ({ isVisible, label }: LoadingOverlayProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl bg-black/70 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
      <p className="text-white">{label}</p>
    </div>
  );
};
