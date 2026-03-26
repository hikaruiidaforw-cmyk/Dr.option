"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "h-11 w-full rounded-lg border bg-surface-raised px-4 text-[15px]",
          "placeholder:text-ink-muted",
          "transition-all duration-200",
          "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20",
          error ? "border-error focus:border-error focus:ring-error/20" : "border-border",
          "disabled:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
