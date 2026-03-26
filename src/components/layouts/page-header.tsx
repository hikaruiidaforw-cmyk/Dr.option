import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, actions, className }: PageHeaderProps) {
  const actionContent = actions || children;

  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-h1">{title}</h1>
          {description && (
            <p className="text-ink-muted mt-1">{description}</p>
          )}
        </div>
        {actionContent && <div className="flex items-center gap-3">{actionContent}</div>}
      </div>
    </div>
  );
}
