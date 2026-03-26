"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import type { NavItem } from "@/types";

interface HeaderProps {
  navItems?: NavItem[];
  userName?: string;
  unreadCount?: number;
  className?: string;
}

export function Header({ navItems = [], userName, unreadCount = 0, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-16",
        "bg-surface-raised/80 backdrop-blur-md border-b border-border",
        "md:hidden", // Show only on mobile
        className
      )}
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* Mobile Nav Trigger */}
        <MobileNav items={navItems} />

        {/* Logo (mobile) */}
        <Link href="/" className="flex items-baseline gap-0.5">
          <span className="text-xl font-semibold text-ink tracking-tight">Dr</span>
          <span className="text-accent text-xl font-bold">.</span>
          <span className="text-xl font-light text-ink tracking-tight">option</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative flex items-center justify-center h-10 w-10 rounded-lg hover:bg-surface-sunken transition-colors">
            <Bell className="h-5 w-5 text-ink-muted" strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* User Menu (placeholder) */}
          <button className="flex items-center justify-center h-10 w-10 rounded-full bg-accent-soft">
            <User className="h-5 w-5 text-accent" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
