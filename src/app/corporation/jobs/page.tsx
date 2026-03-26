"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Users, Pencil, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface JobData {
  id: string;
  title: string;
  department: string;
  clinicName: string;
  clinicArea: string;
  status: string;
  salaryMin: number | null;
  salaryMax: number | null;
  transferPrice: number | null;
  _count: {
    applications: number;
    favorites: number;
  };
  publishedAt: string | null;
  createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  DRAFT: { label: "下書き", variant: "outline" },
  PUBLISHED: { label: "公開中", variant: "default" },
  CLOSED: { label: "終了", variant: "secondary" },
  ARCHIVED: { label: "アーカイブ", variant: "secondary" },
};

export default function CorporationJobsPage() {
  const [jobs, setJobs] = React.useState<JobData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/corporation/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs ?? []);
        }
      } catch {
        // fallback
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const totalApplications = jobs.reduce((sum, j) => sum + j._count.applications, 0);
  const totalFavorites = jobs.reduce((sum, j) => sum + j._count.favorites, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="求人管理"
          description="求人の作成・管理ができます"
          actions={
            <Link href="/corporation/jobs/new">
              <Button><Plus className="w-4 h-4 mr-2" />新規求人を作成</Button>
            </Link>
          }
        />
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 text-ink-muted mx-auto mb-3 animate-spin" />
            <p className="text-ink-muted">読み込み中...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="求人管理"
        description="求人の作成・管理ができます"
        actions={
          <Link href="/corporation/jobs/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              新規求人を作成
            </Button>
          </Link>
        }
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-numeric-m text-ink">{jobs.length}</p>
            <p className="text-small text-ink-muted">求人数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-numeric-m text-ink">{totalApplications}</p>
            <p className="text-small text-ink-muted">総応募数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-numeric-m text-ink">{totalFavorites}</p>
            <p className="text-small text-ink-muted">お気に入り数</p>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => {
            const statusInfo = STATUS_LABELS[job.status] ?? STATUS_LABELS.DRAFT;
            return (
              <Card key={job.id} className="hover:border-border-strong transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                        <Badge variant="outline">{job.department}</Badge>
                      </div>

                      <Link
                        href={`/corporation/jobs/${job.id}`}
                        className="text-h3 hover:text-accent transition-colors"
                      >
                        {job.title}
                      </Link>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-small text-ink-muted">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.clinicArea}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          応募 {job._count.applications}件
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-6">
                        {(job.salaryMin != null || job.salaryMax != null) && (
                          <div>
                            <p className="text-caption text-ink-muted">年収</p>
                            <p className="text-numeric-m">
                              {job.salaryMin != null && job.salaryMax != null
                                ? `${formatPrice(job.salaryMin)}〜${formatPrice(job.salaryMax)}`
                                : job.salaryMin != null
                                ? `${formatPrice(job.salaryMin)}〜`
                                : `〜${formatPrice(job.salaryMax)}`}
                            </p>
                          </div>
                        )}
                        {job.transferPrice != null && (
                          <div>
                            <p className="text-caption text-ink-muted">想定譲渡価格</p>
                            <p className="text-numeric-m text-accent">
                              {formatPrice(job.transferPrice)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link href={`/corporation/jobs/${job.id}/edit`}>
                        <Button variant="secondary" size="small">
                          <Pencil className="w-4 h-4 mr-1" />
                          編集
                        </Button>
                      </Link>
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
            <p className="text-ink-muted">まだ求人がありません</p>
            <p className="text-small text-ink-muted mt-2 mb-4">
              新しい求人を作成して、ドクターを募集しましょう
            </p>
            <Link href="/corporation/jobs/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                新規求人を作成
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
