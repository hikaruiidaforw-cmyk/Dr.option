"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface SidebarProps {
  items: NavItem[];
  title?: string;
  className?: string;
}

export function Sidebar({ items, title, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 h-screen w-64",
        "bg-surface-raised border-r border-border",
        "hidden md:flex flex-col",
        className
      )}
    >
      {/* Logo / Title */}
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link href="/" className="flex items-baseline gap-0.5">
          <span className="text-[22px] font-semibold text-ink tracking-tight">Dr</span>
          <span className="text-accent text-[22px] font-bold">.</span>
          <span className="text-[22px] font-light text-ink tracking-tight">option</span>
        </Link>
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
      <div className="border-t border-border p-4 space-y-3">
        <button
          onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm text-ink-muted hover:text-error hover:bg-error-soft transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>ログアウト</span>
        </button>
        <p className="text-caption text-ink-muted px-4">
          G.C FACTORY
        </p>
      </div>
    </aside>
  );
}
