"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface ConfirmationModalProps {
  title: string;
  description: string;
  onConfirm: () => void;
  trigger: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal = ({
  title,
  description,
  onConfirm,
  trigger,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmationModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-[450px]">
        <DialogTitle className="hidden">{title}</DialogTitle>

        <div
          className="min-w-4/5 space-y-8 rounded-3xl bg-secondary-900 px-14 py-12 pb-8"
          style={{
            boxShadow: "0px 0px 20px 2px rgba(89, 29, 169, 0.50)",
          }}
        >
          <div className="space-y-4">
            <h3 className="text-left text-2xl font-semibold">{title}</h3>
            <p className="text-gray-800 text-left text-base">{description}</p>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <DialogClose asChild>
              <button className="flex h-fit rounded-xl border border-white px-6 py-3 transition-opacity hover:bg-[#591DA9]/30">
                <p>{cancelText}</p>
              </button>
            </DialogClose>

            <DialogClose asChild>
              <button
                className="flex h-fit rounded-xl bg-[radial-gradient(50%_50%_at_50%_50%,#9B77CB_0%,#591DA9_100%)] px-6 py-3 transition-opacity hover:opacity-90"
                style={{
                  boxShadow:
                    "0px 2px 1px 0px rgba(255, 255, 255, 0.25) inset, 0px -4px 2px 0px rgba(0, 0, 0, 0.25) inset, 0px 0px 1px 4px rgba(255, 255, 255, 0.10)",
                }}
                onClick={() => onConfirm()}
              >
                {confirmText}
              </button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
