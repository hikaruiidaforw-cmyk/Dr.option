"use client";

import { Sidebar } from "@/components/layouts/sidebar";
import { Header } from "@/components/layouts/header";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Handshake,
  Settings,
} from "lucide-react";

const adminNavItems = [
  {
    href: "/admin/dashboard",
    label: "ダッシュボード",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/users",
    label: "ユーザー管理",
    icon: Users,
  },
  {
    href: "/admin/jobs",
    label: "求人管理",
    icon: Briefcase,
  },
  {
    href: "/admin/matches",
    label: "マッチング管理",
    icon: Handshake,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile Header */}
      <Header navItems={adminNavItems} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar items={adminNavItems} />

        {/* Main Content */}
        <main className="flex-1 md:ml-64">
          <div className="max-w-[1152px] mx-auto px-6 py-8 pt-20 md:pt-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
