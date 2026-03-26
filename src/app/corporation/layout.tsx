"use client";

import { Sidebar } from "@/components/layouts/sidebar";
import { Header } from "@/components/layouts/header";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  Search,
  Send,
  MessageSquare,
  Bell,
  FileText,
  BarChart3,
  ClipboardList,
} from "lucide-react";

const corporationNavItems = [
  {
    href: "/corporation/dashboard",
    label: "ダッシュボード",
    icon: LayoutDashboard,
  },
  {
    href: "/corporation/profile",
    label: "法人プロフィール",
    icon: Building2,
  },
  {
    href: "/corporation/jobs",
    label: "求人管理",
    icon: Briefcase,
  },
  {
    href: "/corporation/competitive-analysis",
    label: "採用競合分析",
    icon: BarChart3,
  },
  {
    href: "/corporation/applicants",
    label: "応募者管理",
    icon: Users,
  },
  {
    href: "/corporation/doctors",
    label: "ドクター検索",
    icon: Search,
  },
  {
    href: "/corporation/scouts",
    label: "スカウト管理",
    icon: Send,
  },
  {
    href: "/corporation/contracts/new",
    label: "契約書作成",
    icon: FileText,
  },
  {
    href: "/corporation/transition-planner",
    label: "引き継ぎプランナー",
    icon: ClipboardList,
  },
  {
    href: "/corporation/chat",
    label: "メッセージ",
    icon: MessageSquare,
  },
  {
    href: "/corporation/notifications",
    label: "通知",
    icon: Bell,
  },
];

export default function CorporationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile Header */}
      <Header navItems={corporationNavItems} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar items={corporationNavItems} />

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
