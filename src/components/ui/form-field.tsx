"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function FormField({ label, htmlFor, error, required, description, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-[13px] font-medium text-ink"
      >
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {description && (
        <p className="text-small text-ink-muted">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-[13px] text-error">{error}</p>
      )}
    </div>
  );
}

export { FormField };
