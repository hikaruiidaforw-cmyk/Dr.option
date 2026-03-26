"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  Briefcase,
  Handshake,
  TrendingUp,
  UserPlus,
  ArrowRight,
  Activity,
  Loader2,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface DashboardData {
  stats: {
    totalDoctors: number;
    totalCorporations: number;
    totalJobs: number;
    activeMatches: number;
    newDoctorsThisMonth: number;
    newCorporationsThisMonth: number;
    completedMatchesThisMonth: number;
  };
  recentActivities: {
    id: string;
    type: string;
    message: string;
    createdAt: string;
  }[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "NEW_DOCTOR":
      return <UserPlus className="w-4 h-4" />;
    case "NEW_CORPORATION":
      return <Building2 className="w-4 h-4" />;
    case "NEW_JOB":
      return <Briefcase className="w-4 h-4" />;
    case "MATCH_COMPLETED":
      return <Handshake className="w-4 h-4" />;
    case "NEW_APPLICATION":
      return <Activity className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};

const getActivityBadge = (type: string) => {
  switch (type) {
    case "NEW_DOCTOR":
      return <Badge variant="secondary">ドクター</Badge>;
    case "NEW_CORPORATION":
      return <Badge variant="secondary">法人</Badge>;
    case "NEW_JOB":
      return <Badge variant="default">求人</Badge>;
    case "MATCH_COMPLETED":
      return <Badge variant="default">マッチング</Badge>;
    case "NEW_APPLICATION":
      return <Badge variant="outline">応募</Badge>;
    default:
      return <Badge variant="outline">その他</Badge>;
  }
};

export default function AdminDashboardPage() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          setData(await res.json());
        }
      } catch {
        // エラー時はデフォルト値のまま
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const stats = data?.stats ?? {
    totalDoctors: 0,
    totalCorporations: 0,
    totalJobs: 0,
    activeMatches: 0,
    newDoctorsThisMonth: 0,
    newCorporationsThisMonth: 0,
    completedMatchesThisMonth: 0,
  };

  const activities = data?.recentActivities ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="管理者ダッシュボード"
        description="プラットフォーム全体の状況を確認できます"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-accent-soft flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-caption text-ink-muted">登録ドクター</p>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-ink-muted animate-spin mt-1" />
                ) : (
                  <>
                    <p className="text-numeric-l">{stats.totalDoctors}</p>
                    {stats.newDoctorsThisMonth > 0 && (
                      <p className="text-caption text-accent">
                        +{stats.newDoctorsThisMonth} 今月
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-surface-sunken flex items-center justify-center">
                <Building2 className="w-6 h-6 text-ink-muted" />
              </div>
              <div>
                <p className="text-caption text-ink-muted">登録法人</p>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-ink-muted animate-spin mt-1" />
                ) : (
                  <>
                    <p className="text-numeric-l">{stats.totalCorporations}</p>
                    {stats.newCorporationsThisMonth > 0 && (
                      <p className="text-caption text-accent">
                        +{stats.newCorporationsThisMonth} 今月
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-surface-sunken flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-ink-muted" />
              </div>
              <div>
                <p className="text-caption text-ink-muted">掲載求人</p>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-ink-muted animate-spin mt-1" />
                ) : (
                  <p className="text-numeric-l">{stats.totalJobs}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-accent-soft flex items-center justify-center">
                <Handshake className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-caption text-ink-muted">進行中マッチング</p>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-ink-muted animate-spin mt-1" />
                ) : (
                  <>
                    <p className="text-numeric-l text-accent">
                      {stats.activeMatches}
                    </p>
                    {stats.completedMatchesThisMonth > 0 && (
                      <p className="text-caption text-ink-muted">
                        {stats.completedMatchesThisMonth}件成立 今月
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:border-border-strong transition-colors">
          <CardContent className="pt-6">
            <Link href="/admin/users" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-accent" />
                <span>ユーザー管理</span>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-muted" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-border-strong transition-colors">
          <CardContent className="pt-6">
            <Link href="/admin/jobs" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-accent" />
                <span>求人管理</span>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-muted" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-border-strong transition-colors">
          <CardContent className="pt-6">
            <Link href="/admin/matches" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Handshake className="w-5 h-5 text-accent" />
                <span>マッチング管理</span>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-muted" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-border-strong transition-colors">
          <CardContent className="pt-6">
            <Link href="/admin/reports" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-accent" />
                <span>レポート</span>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-muted" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>最近のアクティビティ</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 text-ink-muted animate-spin mx-auto" />
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded border border-border hover:border-border-strong transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-surface-sunken flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getActivityBadge(activity.type)}
                      <span className="text-caption text-ink-muted">
                        {formatRelativeTime(activity.createdAt)}
                      </span>
                    </div>
                    <p className="text-body">{activity.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-ink-muted">
              <p>まだアクティビティはありません</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
