"use client";

import { Sidebar } from "@/components/layouts/sidebar";
import { Header } from "@/components/layouts/header";
import {
  LayoutDashboard,
  User,
  Search,
  FileText,
  Heart,
  Mail,
  MessageSquare,
  Bell,
  Calculator,
  HelpCircle,
  Map,
  BarChart3,
  Mic,
  FileSpreadsheet,
  Award,
} from "lucide-react";

const doctorNavItems = [
  {
    href: "/doctor/dashboard",
    label: "ダッシュボード",
    icon: LayoutDashboard,
  },
  {
    href: "/doctor/profile",
    label: "プロフィール",
    icon: User,
  },
  {
    href: "/doctor/jobs",
    label: "求人検索",
    icon: Search,
  },
  {
    href: "/doctor/simulator",
    label: "承継シミュレーター",
    icon: Calculator,
  },
  {
    href: "/doctor/qa",
    label: "匿名Q&A",
    icon: HelpCircle,
  },
  {
    href: "/doctor/roadmap",
    label: "承継ロードマップ",
    icon: Map,
  },
  {
    href: "/doctor/market-value",
    label: "市場価値診断",
    icon: Award,
  },
  {
    href: "/doctor/market",
    label: "エリア市場データ",
    icon: BarChart3,
  },
  {
    href: "/doctor/interviews",
    label: "先輩インタビュー",
    icon: Mic,
  },
  {
    href: "/doctor/business-plan",
    label: "簡易事業計画",
    icon: FileSpreadsheet,
  },
  {
    href: "/doctor/applications",
    label: "応募管理",
    icon: FileText,
  },
  {
    href: "/doctor/favorites",
    label: "お気に入り",
    icon: Heart,
  },
  {
    href: "/doctor/scouts",
    label: "スカウト",
    icon: Mail,
  },
  {
    href: "/doctor/chat",
    label: "メッセージ",
    icon: MessageSquare,
  },
  {
    href: "/doctor/notifications",
    label: "通知",
    icon: Bell,
  },
];

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      {/* Mobile Header */}
      <Header navItems={doctorNavItems} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar items={doctorNavItems} />

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
