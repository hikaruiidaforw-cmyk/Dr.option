"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  Calendar,
  MessageCircle,
  Mail,
  Phone,
  Banknote,
  Briefcase,
  Loader2,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { JOB_POSTING_STATUS_LABELS } from "@/lib/constants";

type JobStatus = keyof typeof JOB_POSTING_STATUS_LABELS;

interface CorporationDetail {
  id: string;
  corporationName: string;
  representativeName: string;
  corporationType: string | null;
  email: string;
  contactEmail: string;
  contactPhone: string | null;
  contactPerson: string;
  address: string | null;
  establishedYear: number | null;
  employeeCount: number | null;
  websiteUrl: string | null;
  description: string | null;
  createdAt: string;
  jobs: {
    id: string;
    title: string;
    status: JobStatus;
    salaryMin: number | null;
    salaryMax: number | null;
    transferPrice: number | null;
    applicationCount: number;
  }[];
  scoutCount: number;
}

export default function ConsultantCorporationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("profile");
  const [corporation, setCorporation] =
    React.useState<CorporationDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCorporation = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/consultant/corporations/${params.id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "取得に失敗しました");
        }
        const data = await res.json();
        setCorporation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "不明なエラー");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchCorporation();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-ink-muted" />
      </div>
    );
  }

  if (error || !corporation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="small" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            戻る
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-body text-ink-muted">
              {error || "法人が見つかりません"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const yearsInBusiness = corporation.establishedYear
    ? new Date().getFullYear() - corporation.establishedYear
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="small" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          戻る
        </Button>
      </div>

      <PageHeader
        title={corporation.corporationName}
        description={
          [
            corporation.establishedYear
              ? `設立 ${corporation.establishedYear}年`
              : null,
            corporation.employeeCount
              ? `従業員 ${corporation.employeeCount}名`
              : null,
          ]
            .filter(Boolean)
            .join(" ・ ") || undefined
        }
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="small">
              <MessageCircle className="w-4 h-4 mr-1" />
              メモを追加
            </Button>
            <Button size="small">
              <Mail className="w-4 h-4 mr-1" />
              連絡する
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">法人情報</TabsTrigger>
          <TabsTrigger value="jobs">
            求人 ({corporation.jobs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-ink-muted mt-0.5" />
                  <div>
                    <p className="text-caption text-ink-muted">法人名</p>
                    <p className="text-body">
                      {corporation.corporationName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-ink-muted mt-0.5" />
                  <div>
                    <p className="text-caption text-ink-muted">代表者</p>
                    <p className="text-body">
                      {corporation.representativeName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-ink-muted mt-0.5" />
                  <div>
                    <p className="text-caption text-ink-muted">メールアドレス</p>
                    <p className="text-body">{corporation.contactEmail}</p>
                  </div>
                </div>
                {corporation.contactPhone && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-ink-muted mt-0.5" />
                    <div>
                      <p className="text-caption text-ink-muted">電話番号</p>
                      <p className="text-body">{corporation.contactPhone}</p>
                    </div>
                  </div>
                )}
                {corporation.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-ink-muted mt-0.5" />
                    <div>
                      <p className="text-caption text-ink-muted">所在地</p>
                      <p className="text-body">{corporation.address}</p>
                    </div>
                  </div>
                )}
                {corporation.establishedYear && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-ink-muted mt-0.5" />
                    <div>
                      <p className="text-caption text-ink-muted">設立</p>
                      <p className="text-body">
                        {corporation.establishedYear}年
                        {yearsInBusiness !== null && `（${yearsInBusiness}年目）`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {corporation.description && (
                <div>
                  <p className="text-caption text-ink-muted mb-2">法人概要</p>
                  <p className="text-body">{corporation.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="mt-6 space-y-4">
          {corporation.jobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-body text-ink-muted">求人はありません</p>
              </CardContent>
            </Card>
          ) : (
            corporation.jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Badge
                        variant={
                          job.status === "PUBLISHED" ? "default" : "secondary"
                        }
                        className="mb-2"
                      >
                        {JOB_POSTING_STATUS_LABELS[job.status]}
                      </Badge>
                      <p className="text-body font-medium">{job.title}</p>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {job.salaryMin != null && job.salaryMax != null && (
                          <span className="text-small text-ink-muted flex items-center gap-1">
                            <Banknote className="w-3 h-3" />
                            {formatNumber(job.salaryMin)}〜
                            {formatNumber(job.salaryMax)}万円
                          </span>
                        )}
                        {job.transferPrice != null && (
                          <span className="text-small text-accent flex items-center gap-1">
                            譲渡: {formatNumber(job.transferPrice)}万円
                          </span>
                        )}
                        <span className="text-small text-ink-muted flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          応募 {job.applicationCount}件
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="small" asChild>
                      <Link href={`/consultant/jobs/${job.id}`}>詳細</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
