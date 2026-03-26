"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "min-h-[100px] w-full rounded border bg-surface-raised p-3 text-[15px]",
          "placeholder:text-ink-muted",
          "transition-colors duration-150",
          "focus:outline-none focus:border-2 focus:border-ink",
          error ? "border-error" : "border-border",
          "disabled:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-50",
          "resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
