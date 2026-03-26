"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  Handshake,
  FileText,
  TrendingUp,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { MATCH_STATUS_LABELS } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/utils";

type MatchStatus = keyof typeof MATCH_STATUS_LABELS;

interface DashboardData {
  stats: {
    totalMatches: number;
    activeMatches: number;
    pendingContracts: number;
    completedThisMonth: number;
  };
  recentMatches: {
    id: string;
    status: MatchStatus;
    updatedAt: string;
    doctorName: string;
    corporationName: string;
    jobTitle: string;
  }[];
}

const getStatusBadgeVariant = (status: MatchStatus) => {
  switch (status) {
    case "NEGOTIATING":
      return "secondary";
    case "CONTRACT_DRAFTING":
    case "EMPLOYED":
    case "TRANSFER_READY":
    case "COMPLETED":
      return "default";
    case "CANCELLED":
      return "outline";
    default:
      return "outline";
  }
};

export default function ConsultantDashboardPage() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/consultant/dashboard");
        if (res.ok) setData(await res.json());
      } catch {
        // fallback to defaults
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const stats = data?.stats ?? { totalMatches: 0, activeMatches: 0, pendingContracts: 0, completedThisMonth: 0 };
  const recentMatches = data?.recentMatches ?? [];

  const StatValue = ({ value }: { value: number }) =>
    isLoading ? <Loader2 className="w-5 h-5 text-ink-muted animate-spin mt-1" /> : <p className="text-numeric-l">{value}</p>;

  return (
    <div className="space-y-8">
      <PageHeader
        title="コンサルタントダッシュボード"
        description="マッチング状況を確認・管理できます"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-accent-soft flex items-center justify-center">
                <Handshake className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-caption text-ink-muted">担当マッチング数</p>
                <StatValue value={stats.totalMatches} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-accent-soft flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-caption text-ink-muted">進行中</p>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-ink-muted animate-spin mt-1" />
                ) : (
                  <p className="text-numeric-l text-accent">{stats.activeMatches}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-surface-sunken flex items-center justify-center">
                <FileText className="w-6 h-6 text-ink-muted" />
              </div>
              <div>
                <p className="text-caption text-ink-muted">契約書待ち</p>
                <StatValue value={stats.pendingContracts} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-surface-sunken flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-ink-muted" />
              </div>
              <div>
                <p className="text-caption text-ink-muted">今月成約</p>
                <StatValue value={stats.completedThisMonth} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:border-border-strong transition-colors">
          <CardContent className="pt-6">
            <Link href="/consultant/matches" className="flex items-center justify-between">
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
            <Link href="/consultant/doctors" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-accent" />
                <span>ドクター一覧</span>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-muted" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-border-strong transition-colors">
          <CardContent className="pt-6">
            <Link href="/consultant/corporations" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-accent" />
                <span>法人一覧</span>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-muted" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Matches */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>最近のマッチング</CardTitle>
            <Button variant="ghost" size="small" asChild>
              <Link href="/consultant/matches">すべて見る</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 text-ink-muted animate-spin mx-auto" />
            </div>
          ) : recentMatches.length > 0 ? (
            <div className="space-y-4">
              {recentMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-start justify-between p-4 rounded border border-border hover:border-border-strong transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getStatusBadgeVariant(match.status)}>
                        {MATCH_STATUS_LABELS[match.status]}
                      </Badge>
                      <span className="text-caption text-ink-muted">
                        {formatRelativeTime(match.updatedAt)}
                      </span>
                    </div>
                    <p className="text-body font-medium">{match.jobTitle}</p>
                    <div className="mt-2 flex items-center gap-4 text-small text-ink-muted">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {match.doctorName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {match.corporationName}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="small" asChild>
                    <Link href={`/consultant/matches/${match.id}`}>詳細</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-ink-muted">担当マッチングはありません</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
