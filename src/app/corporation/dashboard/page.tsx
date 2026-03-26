"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Send, ArrowRight, Plus, Loader2, Handshake } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants";

type ApplicationStatus = keyof typeof APPLICATION_STATUS_LABELS;

interface DashboardData {
  stats: { jobCount: number; applicationCount: number; scoutCount: number; matchCount: number };
  recentApplications: {
    id: string;
    status: ApplicationStatus;
    createdAt: string;
    doctorName: string;
    jobTitle: string;
  }[];
}

export default function CorporationDashboardPage() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/corporation/dashboard");
        if (res.ok) setData(await res.json());
      } catch { /* fallback */ } finally { setIsLoading(false); }
    }
    fetchDashboard();
  }, []);

  const stats = data?.stats ?? { jobCount: 0, applicationCount: 0, scoutCount: 0, matchCount: 0 };

  const StatValue = ({ value }: { value: number }) =>
    isLoading ? <Loader2 className="w-5 h-5 text-ink-muted animate-spin" /> : <p className="text-numeric-m text-ink">{value}</p>;

  return (
    <div className="space-y-8">
      <PageHeader title="ダッシュボード" description="求人の管理や応募者の確認ができます" />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded bg-accent-soft flex items-center justify-center"><Briefcase className="w-6 h-6 text-accent" strokeWidth={1.5} /></div><div><StatValue value={stats.jobCount} /><p className="text-small text-ink-muted">公開中の求人</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded bg-accent-soft flex items-center justify-center"><Users className="w-6 h-6 text-accent" strokeWidth={1.5} /></div><div><StatValue value={stats.applicationCount} /><p className="text-small text-ink-muted">応募数</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded bg-accent-soft flex items-center justify-center"><Send className="w-6 h-6 text-accent" strokeWidth={1.5} /></div><div><StatValue value={stats.scoutCount} /><p className="text-small text-ink-muted">送信済スカウト</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded bg-accent-soft flex items-center justify-center"><Handshake className="w-6 h-6 text-accent" strokeWidth={1.5} /></div><div><StatValue value={stats.matchCount} /><p className="text-small text-ink-muted">進行中マッチング</p></div></div></CardContent></Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader><CardTitle>クイックアクション</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div><p className="font-medium">法人プロフィールを完成させる</p><p className="text-small text-ink-muted">法人情報を充実させると、ドクターからの信頼度が上がります</p></div>
            <Link href="/corporation/profile"><Button variant="secondary" size="small">編集する<ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div><p className="font-medium">求人を作成する</p><p className="text-small text-ink-muted">承継候補の求人を掲載して、ドクターを募集しましょう</p></div>
            <Link href="/corporation/jobs/new"><Button size="small"><Plus className="w-4 h-4 mr-1" />求人を作成</Button></Link>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded">
            <div><p className="font-medium">ドクターを検索する</p><p className="text-small text-ink-muted">登録ドクターを検索してスカウトを送信できます</p></div>
            <Link href="/corporation/doctors"><Button variant="secondary" size="small">検索する<ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>最近の応募</CardTitle>
          <Link href="/corporation/applicants"><Button variant="ghost" size="small">すべて見る<ArrowRight className="w-4 h-4 ml-1" /></Button></Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8"><Loader2 className="w-6 h-6 text-ink-muted animate-spin mx-auto" /></div>
          ) : data && data.recentApplications.length > 0 ? (
            <div className="space-y-3">
              {data.recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-surface-sunken transition-colors">
                  <div>
                    <p className="text-sm font-medium text-ink">{app.doctorName}</p>
                    <p className="text-xs text-ink-muted">{app.jobTitle} · {formatRelativeTime(app.createdAt)}</p>
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
              <p className="text-small mt-2">求人を公開すると、ドクターからの応募が届きます</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
