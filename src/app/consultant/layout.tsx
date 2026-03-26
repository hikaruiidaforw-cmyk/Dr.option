"use client";

import { Sidebar } from "@/components/layouts/sidebar";
import { Header } from "@/components/layouts/header";
import {
  LayoutDashboard,
  Users,
  Building2,
  Handshake,
  FileText,
} from "lucide-react";

const consultantNavItems = [
  {
    href: "/consultant/dashboard",
    label: "ダッシュボード",
    icon: LayoutDashboard,
  },
  {
    href: "/consultant/matches",
    label: "マッチング管理",
    icon: Handshake,
  },
  {
    href: "/consultant/doctors",
    label: "ドクター一覧",
    icon: Users,
  },
  {
    href: "/consultant/corporations",
    label: "法人一覧",
    icon: Building2,
  },
];

export default function ConsultantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile Header */}
      <Header navItems={consultantNavItems} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar items={consultantNavItems} />

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
