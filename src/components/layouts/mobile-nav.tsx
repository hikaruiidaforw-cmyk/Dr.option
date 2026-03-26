"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface MobileNavProps {
  items: NavItem[];
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  // クライアントサイドでのみレンダリング（hydration mismatch回避）
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close on route change
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // SSR時はプレースホルダーを表示
  if (!mounted) {
    return (
      <button
        className="md:hidden flex items-center justify-center h-10 w-10 rounded border border-border hover:bg-surface"
        aria-label="メニューを開く"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </button>
    );
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          className="md:hidden flex items-center justify-center h-10 w-10 rounded border border-border hover:bg-surface"
          aria-label="メニューを開く"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px] md:hidden" />
        <DialogPrimitive.Content className="fixed left-0 top-0 z-50 h-full w-[280px] bg-surface-raised border-r border-border md:hidden">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link href="/" className="flex items-baseline gap-0.5">
              <span className="text-xl font-semibold text-ink tracking-tight">Dr</span>
              <span className="text-accent text-xl font-bold">.</span>
              <span className="text-xl font-light text-ink tracking-tight">option</span>
            </Link>
            <DialogPrimitive.Close className="flex items-center justify-center h-10 w-10 rounded-lg hover:bg-surface-sunken transition-colors">
              <X className="h-5 w-5" strokeWidth={1.5} />
              <span className="sr-only">閉じる</span>
            </DialogPrimitive.Close>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-1 px-3">
              {items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 h-11 px-4 rounded-lg text-[14px]",
                        "transition-all duration-200",
                        isActive
                          ? "bg-accent text-white shadow-sm"
                          : "text-ink-muted hover:text-ink hover:bg-surface-sunken"
                      )}
                    >
                      {item.icon && (
                        <item.icon
                          className={cn(
                            "h-[18px] w-[18px]",
                            isActive ? "text-white" : "text-ink-muted"
                          )}
                        />
                      )}
                      <span className={isActive ? "font-medium" : ""}>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={cn(
                          "ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                          isActive ? "bg-white/20 text-white" : "bg-accent text-white"
                        )}>
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4 space-y-3">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm text-ink-muted hover:text-error hover:bg-error-soft transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>ログアウト</span>
            </button>
            <p className="text-caption text-ink-muted px-4">
              G.C FACTORY
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
