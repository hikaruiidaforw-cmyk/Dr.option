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
  Search,
  MapPin,
  Building2,
  Eye,
  MoreVertical,
  Banknote,
  Loader2,
  Heart,
} from "lucide-react";
import { JOB_POSTING_STATUS_LABELS } from "@/lib/constants";
import { formatRelativeTime, formatNumber } from "@/lib/utils";

type JobStatus = keyof typeof JOB_POSTING_STATUS_LABELS;

interface JobData {
  id: string;
  title: string;
  department: string;
  clinicArea: string;
  employmentType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  transferPrice: number | null;
  status: JobStatus;
  corporation: {
    id: string;
    name: string;
  };
  applicationCount: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
}

const getStatusBadgeVariant = (status: JobStatus) => {
  switch (status) {
    case "PUBLISHED":
      return "default";
    case "DRAFT":
      return "secondary";
    case "CLOSED":
      return "outline";
    default:
      return "outline";
  }
};

export default function AdminJobsPage() {
  const [filter, setFilter] = React.useState<
    "all" | "published" | "draft" | "closed"
  >("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [jobs, setJobs] = React.useState<JobData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchJobs() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/admin/jobs");
        if (!res.ok) throw new Error("求人一覧の取得に失敗しました");
        setJobs(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (filter === "published" && job.status !== "PUBLISHED") return false;
    if (filter === "draft" && job.status !== "DRAFT") return false;
    if (filter === "closed" && job.status !== "CLOSED") return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        job.corporation.name.toLowerCase().includes(query) ||
        job.clinicArea.includes(query)
      );
    }

    return true;
  });

  const counts = {
    all: jobs.length,
    published: jobs.filter((j) => j.status === "PUBLISHED").length,
    draft: jobs.filter((j) => j.status === "DRAFT").length,
    closed: jobs.filter((j) => j.status === "CLOSED" || j.status === "ARCHIVED").length,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="求人管理" description="掲載求人を確認・管理します" />
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 text-ink-muted mx-auto mb-3 animate-spin" />
            <p className="text-ink-muted">求人データを読み込んでいます...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="求人管理" description="掲載求人を確認・管理します" />
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
        title="求人管理"
        description="掲載求人を確認・管理します"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption text-ink-muted">総求人数</p>
            <p className="text-numeric-l">{counts.all}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption text-ink-muted">公開中</p>
            <p className="text-numeric-l text-accent">{counts.published}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption text-ink-muted">下書き</p>
            <p className="text-numeric-l">{counts.draft}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption text-ink-muted">募集終了</p>
            <p className="text-numeric-l">{counts.closed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <Input
              placeholder="求人タイトル、法人名、エリアで検索..."
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
          <TabsTrigger value="published">公開中 ({counts.published})</TabsTrigger>
          <TabsTrigger value="draft">下書き ({counts.draft})</TabsTrigger>
          <TabsTrigger value="closed">募集終了 ({counts.closed})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:border-border-strong transition-colors"
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getStatusBadgeVariant(job.status)}>
                            {JOB_POSTING_STATUS_LABELS[job.status]}
                          </Badge>
                          <span className="text-caption text-ink-muted">
                            {formatRelativeTime(job.updatedAt)}更新
                          </span>
                        </div>

                        {/* Title */}
                        <p className="text-h3 mb-3">{job.title}</p>

                        {/* Corporation & Location */}
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <span className="text-small text-ink-muted flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {job.corporation.name}
                          </span>
                          <span className="text-small text-ink-muted flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.clinicArea}
                          </span>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6">
                          <div>
                            <p className="text-caption text-ink-muted flex items-center gap-1">
                              <Banknote className="w-3 h-3" />
                              年収
                            </p>
                            <p className="text-numeric-m mt-1">
                              {job.salaryMin != null && job.salaryMax != null
                                ? `${formatNumber(job.salaryMin)}〜${formatNumber(job.salaryMax)}万円`
                                : "応相談"}
                            </p>
                          </div>
                          <div>
                            <p className="text-caption text-ink-muted">譲渡価格</p>
                            <p className="text-numeric-m text-accent mt-1">
                              {job.transferPrice != null
                                ? `${formatNumber(job.transferPrice)}万円`
                                : "応相談"}
                            </p>
                          </div>
                          <div>
                            <p className="text-caption text-ink-muted">応募数</p>
                            <p className="text-numeric-m mt-1">
                              {job.applicationCount}件
                            </p>
                          </div>
                          <div>
                            <p className="text-caption text-ink-muted flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              お気に入り
                            </p>
                            <p className="text-numeric-m mt-1">
                              {job.favoriteCount}件
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button size="small" asChild>
                          <Link href={`/admin/jobs/${job.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            詳細を見る
                          </Link>
                        </Button>
                        <Button variant="ghost" size="small">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-ink-muted">該当する求人はありません</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
