"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Edit2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const COVER_OPTIONS = [
  "/cover/cover_1.png",
  "/cover/cover_2.png",
  "/cover/cover_3.png",
  "/cover/cover_4.png",
  "/cover/cover_5.png",
  "/cover/cover_6.png",
];

interface EditCourseModalProps {
  title: string;
  deadline?: string | null;
  icon?: string | null;
  onSave: (next: {
    title: string;
    deadline: string | null;
    icon: string;
  }) => Promise<boolean>;
}

export default function EditCourseModal({
  title,
  deadline,
  icon,
  onSave,
}: EditCourseModalProps) {
  const [open, setOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftDeadline, setDraftDeadline] = useState(deadline ?? "");
  const [draftIcon, setDraftIcon] = useState(icon ?? COVER_OPTIONS[0]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDraftTitle(title);
    setDraftDeadline(deadline ?? "");
    setDraftIcon(icon ?? COVER_OPTIONS[0]);
  }, [open, title, deadline, icon]);

  const handleSave = async () => {
    if (!draftTitle.trim()) return;
    setIsSaving(true);
    try {
      const didSave = await onSave({
        title: draftTitle.trim(),
        deadline: draftDeadline ? draftDeadline : null,
        icon: draftIcon,
      });
      if (didSave) {
        setOpen(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2 text-light bg-[#591DA9] dark:[background:var(--background-image-flashcard-gradient)]">
          <Edit2 size={16} />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] lg:min-w-[720px]">
        <DialogTitle className="hidden">Edit Course</DialogTitle>
        <div
          className="space-y-6 rounded-3xl bg-secondary-8 px-8 pb-8 pt-10"
          style={{ boxShadow: "0px 0px 20px 2px rgba(89, 29, 169, 0.50)" }}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Edit Course</h2>
            <p className="text-sm text-[#C0B4D0]">
              Update the course details. Changes are preview-only for now.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-[#C0B4D0]">Course name</label>
              <input
                type="text"
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                className="w-full rounded-2xl border border-white bg-transparent px-5 py-3 text-lg text-white outline-none placeholder:text-[#C0B4D0]"
                placeholder="Enter course name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#C0B4D0]">Deadline</label>
              <input
                type="date"
                value={draftDeadline}
                onChange={(event) => setDraftDeadline(event.target.value)}
                className="w-full rounded-2xl border border-white bg-transparent px-5 py-3 text-lg text-white outline-none"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[#C0B4D0]">Course icon</label>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {COVER_OPTIONS.map((cover) => {
                  const isSelected = draftIcon === cover;
                  return (
                    <button
                      key={cover}
                      type="button"
                      onClick={() => setDraftIcon(cover)}
                      className={`group relative aspect-[4/3] overflow-hidden rounded-2xl border bg-[#0C1017]/70 transition-all ${
                        isSelected
                          ? "border-accent-200 ring-2 ring-accent-200"
                          : "border-white/40 hover:border-white"
                      }`}
                    >
                      <Image
                        src={cover}
                        alt="Course cover"
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button className="cursor-pointer hover:">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleSave}
              disabled={!draftTitle.trim() || isSaving}
              className="bg-[radial-gradient(50%_50%_at_50%_50%,#9B77CB_0%,#591DA9_100%)] cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
