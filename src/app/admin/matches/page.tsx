"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Users,
  Building2,
  Search,
  Eye,
  Banknote,
  Calendar,
  UserCog,
  Loader2,
} from "lucide-react";
import { MATCH_STATUS_LABELS } from "@/lib/constants";
import { formatRelativeTime, formatNumber, formatDate } from "@/lib/utils";

type MatchStatus = keyof typeof MATCH_STATUS_LABELS;

interface MatchData {
  id: string;
  status: MatchStatus;
  agreedSalary: number | null;
  agreedTransferPrice: number | null;
  employmentStartDate: string | null;
  createdAt: string;
  updatedAt: string;
  doctorProfile: {
    id: string;
    displayName: string;
    medicalLicenseYear: number;
    specialties: string[];
  };
  corporation: {
    id: string;
    corporationName: string;
  };
  jobPosting: {
    id: string;
    title: string;
    salaryMin: number | null;
    salaryMax: number | null;
    transferPrice: number | null;
  };
  consultant: {
    id: string;
    name: string;
  } | null;
}

const getStatusBadgeVariant = (status: MatchStatus) => {
  switch (status) {
    case "NEGOTIATING":
      return "secondary";
    case "CONTRACT_DRAFTING":
      return "default";
    case "EMPLOYED":
      return "default";
    case "TRANSFER_READY":
      return "default";
    case "COMPLETED":
      return "success";
    case "CANCELLED":
      return "outline";
    default:
      return "outline";
  }
};

export default function AdminMatchesPage() {
  const [filter, setFilter] = React.useState<
    "all" | "negotiating" | "contract" | "employed" | "completed"
  >("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [matches, setMatches] = React.useState<MatchData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchMatches() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/matches");
        if (!res.ok) throw new Error("マッチング一覧の取得に失敗しました");
        setMatches(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMatches();
  }, []);

  const filteredMatches = matches.filter((match) => {
    if (filter === "negotiating" && match.status !== "NEGOTIATING") return false;
    if (filter === "contract" && match.status !== "CONTRACT_DRAFTING") return false;
    if (filter === "employed" && !["EMPLOYED", "TRANSFER_READY"].includes(match.status)) return false;
    if (filter === "completed" && match.status !== "COMPLETED") return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        match.doctorProfile.displayName.toLowerCase().includes(query) ||
        match.corporation.corporationName.toLowerCase().includes(query) ||
        match.jobPosting.title.toLowerCase().includes(query) ||
        (match.consultant?.name.toLowerCase().includes(query) ?? false)
      );
    }

    return true;
  });

  const counts = {
    all: matches.length,
    negotiating: matches.filter((m) => m.status === "NEGOTIATING").length,
    contract: matches.filter((m) => m.status === "CONTRACT_DRAFTING").length,
    employed: matches.filter((m) =>
      ["EMPLOYED", "TRANSFER_READY"].includes(m.status)
    ).length,
    completed: matches.filter((m) => m.status === "COMPLETED").length,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="マッチング管理" description="全マッチング案件を確認・管理します" />
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 text-ink-muted mx-auto mb-3 animate-spin" />
            <p className="text-ink-muted">マッチングデータを読み込んでいます...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="マッチング管理" description="全マッチング案件を確認・管理します" />
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-error">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="マッチング管理"
        description="全マッチング案件を確認・管理します"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption text-ink-muted">総マッチング数</p>
            <p className="text-numeric-l">{counts.all}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption text-ink-muted">交渉中</p>
            <p className="text-numeric-l">{counts.negotiating}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption text-ink-muted">契約中</p>
            <p className="text-numeric-l">{counts.contract}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption text-ink-muted">雇用中</p>
            <p className="text-numeric-l text-accent">{counts.employed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption text-ink-muted">成約</p>
            <p className="text-numeric-l">{counts.completed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <Input
              placeholder="ドクター名、法人名、求人名、担当者名で検索..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="all">すべて ({counts.all})</TabsTrigger>
          <TabsTrigger value="negotiating">
            交渉中 ({counts.negotiating})
          </TabsTrigger>
          <TabsTrigger value="contract">契約中 ({counts.contract})</TabsTrigger>
          <TabsTrigger value="employed">雇用中 ({counts.employed})</TabsTrigger>
          <TabsTrigger value="completed">成約 ({counts.completed})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {filteredMatches.length > 0 ? (
            <div className="space-y-4">
              {filteredMatches.map((match) => {
                const yearsOfExperience =
                  new Date().getFullYear() -
                  match.doctorProfile.medicalLicenseYear;

                return (
                  <Card
                    key={match.id}
                    className="hover:border-border-strong transition-colors"
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          {/* Header */}
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant={getStatusBadgeVariant(match.status)}>
                              {MATCH_STATUS_LABELS[match.status]}
                            </Badge>
                            <span className="text-caption text-ink-muted">
                              {formatRelativeTime(match.updatedAt)}更新
                            </span>
                          </div>

                          {/* Job Title */}
                          <p className="text-h3 mb-4">{match.jobPosting.title}</p>

                          {/* Doctor & Corporation */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-3 bg-surface-sunken rounded">
                              <p className="text-caption text-ink-muted flex items-center gap-1 mb-2">
                                <Users className="w-3 h-3" />
                                ドクター
                              </p>
                              <p className="text-body font-medium">
                                {match.doctorProfile.displayName}
                              </p>
                              <p className="text-small text-ink-muted mt-1">
                                医師歴 {yearsOfExperience}年
                              </p>
                            </div>

                            <div className="p-3 bg-surface-sunken rounded">
                              <p className="text-caption text-ink-muted flex items-center gap-1 mb-2">
                                <Building2 className="w-3 h-3" />
                                法人
                              </p>
                              <p className="text-body font-medium">
                                {match.corporation.corporationName}
                              </p>
                            </div>

                            <div className="p-3 bg-surface-sunken rounded">
                              <p className="text-caption text-ink-muted flex items-center gap-1 mb-2">
                                <UserCog className="w-3 h-3" />
                                担当コンサルタント
                              </p>
                              <p className="text-body font-medium">
                                {match.consultant?.name ?? "未割当"}
                              </p>
                            </div>
                          </div>

                          {/* Agreement Details */}
                          <div className="mt-4 flex flex-wrap gap-6">
                            <div>
                              <p className="text-caption text-ink-muted flex items-center gap-1">
                                <Banknote className="w-3 h-3" />
                                合意年収
                              </p>
                              <p className="text-numeric-m mt-1">
                                {match.agreedSalary
                                  ? `${formatNumber(match.agreedSalary)}万円`
                                  : "未定"}
                              </p>
                            </div>
                            <div>
                              <p className="text-caption text-ink-muted">
                                合意譲渡価格
                              </p>
                              <p className="text-numeric-m text-accent mt-1">
                                {match.agreedTransferPrice
                                  ? `${formatNumber(match.agreedTransferPrice)}万円`
                                  : "未定"}
                              </p>
                            </div>
                            {match.employmentStartDate && (
                              <div>
                                <p className="text-caption text-ink-muted flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  雇用開始日
                                </p>
                                <p className="text-body mt-1">
                                  {formatDate(match.employmentStartDate)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <Button size="small" asChild>
                            <Link href={`/admin/matches/${match.id}`}>
                              <Eye className="w-4 h-4 mr-1" />
                              詳細を見る
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-ink-muted">該当するマッチングはありません</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
