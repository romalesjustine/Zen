import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  React.useEffect(() => {
    handleResize();
  }, [props.value]);

  return (
    <textarea
      className={cn(
        "flex w-full rounded-md border-neutral-200 bg-transparent px-3 py-4 shadow-sm placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 overflow-hidden",
        className
      )}
      ref={(element) => {
        // Handle both refs
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
        textareaRef.current = element;
      }}
      onInput={handleResize}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }