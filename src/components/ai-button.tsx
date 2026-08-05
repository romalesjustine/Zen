import { cn } from "@/lib/utils";
import { JSX } from "react";
import { Sparkles } from "lucide-react";

export function AIButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element {
  return (
    <button
      className={cn(
        "radial-gradient-button inline-flex items-center justify-center gap-2 [--rbtn-px:1.5rem] [--rbtn-py:0.9rem]",
        className
      )}
      {...props}
    >
      {props.children}
      <Sparkles size={20} />
    </button>
  );
}

AIButton.displayName = "AIButton";

export default AIButton;
