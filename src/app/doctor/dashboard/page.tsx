"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Heart, Mail, ArrowRight, Loader2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants";

type ApplicationStatus = keyof typeof APPLICATION_STATUS_LABELS;

interface DashboardData {
  stats: {
    applicationCount: number;
    favoriteCount: number;
    unreadScoutCount: number;
  };
  recentApplications: {
    id: string;
    status: ApplicationStatus;
    createdAt: string;
    jobPosting: {
      title: string;
      clinicName: string;
      clinicArea: string;
      department: string;
    };
  }[];
  recentScouts: {
    id: string;
    status: string;
    message: string;
    createdAt: string;
    corporationName: string;
    jobPosting: {
      title: string;
      clinicName: string;
      clinicArea: string;
    };
  }[];
}

export default function DoctorDashboardPage() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/doctor/dashboard");
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

  const stats = data?.stats ?? { applicationCount: 0, favoriteCount: 0, unreadScoutCount: 0 };

  return (
    <div className="space-y-8">
      <PageHeader
        title="ダッシュボード"
        description="求人への応募状況やスカウトを確認できます"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-accent-soft flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-ink-muted animate-spin" />
                ) : (
                  <p className="text-numeric-m text-ink">{stats.applicationCount}</p>
                )}
                <p className="text-small text-ink-muted">応募中</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-accent-soft flex items-center justify-center">
                <Heart className="w-6 h-6 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-ink-muted animate-spin" />
                ) : (
                  <p className="text-numeric-m text-ink">{stats.favoriteCount}</p>
                )}
                <p className="text-small text-ink-muted">お気に入り</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-accent-soft flex items-center justify-center">
                <Mail className="w-6 h-6 text-accent" strokeWidth={1.5} />
              </div>
              <div>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-ink-muted animate-spin" />
                ) : (
                  <p className="text-numeric-m text-ink">{stats.unreadScoutCount}</p>
                )}
                <p className="text-small text-ink-muted">未読スカウト</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>はじめに</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div>
              <p className="font-medium">プロフィールを完成させる</p>
              <p className="text-small text-ink-muted">
                プロフィールを充実させると、スカウトを受け取りやすくなります
              </p>
            </div>
            <Link href="/doctor/profile">
              <Button variant="secondary" size="small">
                編集する
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div>
              <p className="font-medium">求人を検索する</p>
              <p className="text-small text-ink-muted">
                希望条件に合った承継候補の求人を探しましょう
              </p>
            </div>
            <Link href="/doctor/jobs">
              <Button variant="secondary" size="small">
                検索する
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>最近の応募</CardTitle>
          <Link href="/doctor/applications">
            <Button variant="ghost" size="small">
              すべて見る
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 text-ink-muted animate-spin mx-auto" />
            </div>
          ) : data && data.recentApplications.length > 0 ? (
            <div className="space-y-3">
              {data.recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-surface-sunken transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">{app.jobPosting.title}</p>
                    <p className="text-xs text-ink-muted">
                      {app.jobPosting.clinicName} · {app.jobPosting.clinicArea} · {formatRelativeTime(app.createdAt)}
                    </p>
                  </div>
                  <Badge variant={app.status === "MATCHED" ? "success" : app.status === "REJECTED" ? "error" : "secondary"}>
                    {APPLICATION_STATUS_LABELS[app.status]}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-ink-muted">
              <p>まだ応募はありません</p>
              <p className="text-small mt-2">
                <Link href="/doctor/jobs" className="text-accent hover:underline">
                  求人を検索
                </Link>
                して、気になる求人に応募してみましょう
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Scouts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>最近のスカウト</CardTitle>
          <Link href="/doctor/scouts">
            <Button variant="ghost" size="small">
              すべて見る
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 text-ink-muted animate-spin mx-auto" />
            </div>
          ) : data && data.recentScouts.length > 0 ? (
            <div className="space-y-3">
              {data.recentScouts.map((scout) => (
                <div
                  key={scout.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-surface-sunken transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">{scout.corporationName}</p>
                    <p className="text-xs text-ink-muted">
                      {scout.jobPosting.title} · {formatRelativeTime(scout.createdAt)}
                    </p>
                  </div>
                  <Badge variant={scout.status === "SENT" ? "warning" : "secondary"}>
                    {scout.status === "SENT" ? "未読" : "既読"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-ink-muted">
              <p>まだスカウトはありません</p>
              <p className="text-small mt-2">
                プロフィールを充実させると、スカウトが届きやすくなります
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
