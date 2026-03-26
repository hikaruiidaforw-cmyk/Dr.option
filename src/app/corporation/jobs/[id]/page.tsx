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
  Clock,
  Edit,
  Eye,
  EyeOff,
  Trash2,
  Briefcase,
  Banknote,
  Calendar,
  Users,
  Home,
  Stethoscope,
  TrendingUp,
  FileText,
  CheckCircle2,
  UserPlus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { formatNumber, formatDate } from "@/lib/utils";
import { JOB_POSTING_STATUS_LABELS } from "@/lib/constants";

interface JobData {
  id: string;
  title: string;
  description: string;
  department: string;
  clinicName: string;
  clinicAddress: string;
  clinicArea: string;
  employmentType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  workingHours: string | null;
  holidays: string | null;
  benefits: string | null;
  transferPrice: number | null;
  transferPriceNote: string | null;
  transferTimingMin: number | null;
  transferTimingMax: number | null;
  transferConditions: string | null;
  includesRealEstate: boolean;
  includesEquipment: boolean;
  includesStaff: boolean;
  annualRevenue: number | null;
  annualProfit: number | null;
  patientCount: number | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    applications: number;
    favorites: number;
  };
}

export default function CorporationJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = React.useState<JobData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isChangingStatus, setIsChangingStatus] = React.useState(false);

  React.useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/corporation/jobs/${params.id}`);
        if (!res.ok) {
          setError("求人が見つかりません");
          return;
        }
        const data = await res.json();
        setJob(data.job);
      } catch {
        setError("求人の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    }
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("この求人を削除しますか？この操作は取り消せません。")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/corporation/jobs/${params.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/corporation/jobs");
      }
    } catch {
      // fallback
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!job) return;
    setIsChangingStatus(true);
    const newStatus = job.status === "PUBLISHED" ? "CLOSED" : "PUBLISHED";
    try {
      const res = await fetch(`/api/corporation/jobs/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setJob(data.job);
      }
    } catch {
      // fallback
    } finally {
      setIsChangingStatus(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "default";
      case "DRAFT": return "secondary";
      case "CLOSED": return "outline";
      default: return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link href="/corporation/jobs" className="inline-flex items-center gap-2 text-small text-ink-muted hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4" />求人一覧に戻る
        </Link>
        <Card><CardContent className="py-12 text-center"><Loader2 className="w-8 h-8 text-ink-muted mx-auto mb-3 animate-spin" /><p className="text-ink-muted">読み込み中...</p></CardContent></Card>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="space-y-6">
        <Link href="/corporation/jobs" className="inline-flex items-center gap-2 text-small text-ink-muted hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4" />求人一覧に戻る
        </Link>
        <Card><CardContent className="py-12 text-center"><AlertCircle className="w-8 h-8 text-error mx-auto mb-3" /><p className="text-error">{error || "求人が見つかりません"}</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/corporation/jobs" className="inline-flex items-center gap-2 text-small text-ink-muted hover:text-ink transition-colors">
        <ArrowLeft className="w-4 h-4" />求人一覧に戻る
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={getStatusBadgeVariant(job.status)}>
              {JOB_POSTING_STATUS_LABELS[job.status as keyof typeof JOB_POSTING_STATUS_LABELS] ?? job.status}
            </Badge>
            <Badge variant="outline">{job.department}</Badge>
          </div>
          <h1 className="text-h1">{job.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-small text-ink-muted">
            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{job.clinicName}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.clinicArea}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.publishedAt ? `${formatDate(job.publishedAt)} 公開` : "未公開"}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={`/corporation/jobs/${job.id}/edit`}><Edit className="w-4 h-4 mr-2" />編集</Link>
          </Button>
          <Button variant="outline" onClick={handleToggleStatus} isLoading={isChangingStatus}>
            {job.status === "PUBLISHED" ? (<><EyeOff className="w-4 h-4 mr-2" />非公開にする</>) : (<><Eye className="w-4 h-4 mr-2" />公開する</>)}
          </Button>
          <Button variant="ghost" className="text-error hover:text-error hover:bg-error-soft" onClick={handleDelete} isLoading={isDeleting}>
            <Trash2 className="w-4 h-4 mr-2" />削除
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><p className="text-caption text-ink-muted mb-1">応募数</p><p className="text-numeric-l">{job._count.applications}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-caption text-ink-muted mb-1">お気に入り数</p><p className="text-numeric-l">{job._count.favorites}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-caption text-ink-muted mb-1">年収</p><p className="text-numeric-m">{job.salaryMin != null && job.salaryMax != null ? `${formatNumber(job.salaryMin)}〜${formatNumber(job.salaryMax)}万` : "応相談"}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-caption text-ink-muted mb-1">譲渡価格</p><p className="text-numeric-m text-accent">{job.transferPrice != null ? `${formatNumber(job.transferPrice)}万` : "応相談"}</p></CardContent></Card>
      </div>

      {/* Quick Actions */}
      {job._count.applications > 0 && (
        <Card className="bg-accent/5 border-accent">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><UserPlus className="w-5 h-5 text-accent" /><span className="text-body"><strong>{job._count.applications}件</strong>の応募があります</span></div>
              <Button asChild size="small"><Link href="/corporation/applicants">応募者を確認</Link></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">募集概要</TabsTrigger>
          <TabsTrigger value="conditions">雇用条件</TabsTrigger>
          <TabsTrigger value="transfer">承継条件</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />募集内容</CardTitle></CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {job.description.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) return <h3 key={i} className="text-h3 mt-6 mb-3 first:mt-0">{line.replace("## ", "")}</h3>;
                  if (line.startsWith("- ")) return <li key={i} className="text-body ml-4">{line.replace("- ", "")}</li>;
                  if (line.trim() === "") return <br key={i} />;
                  return <p key={i} className="text-body mb-2">{line}</p>;
                })}
              </div>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader><CardTitle className="flex items-center gap-2"><Stethoscope className="w-5 h-5" />クリニック情報</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><dt className="text-caption text-ink-muted">クリニック名</dt><dd className="text-body mt-1">{job.clinicName}</dd></div>
                <div><dt className="text-caption text-ink-muted">診療科</dt><dd className="text-body mt-1">{job.department}</dd></div>
                <div className="md:col-span-2"><dt className="text-caption text-ink-muted">所在地</dt><dd className="text-body mt-1">{job.clinicAddress}</dd></div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="mt-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5" />雇用条件</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><dt className="text-caption text-ink-muted flex items-center gap-2"><Banknote className="w-4 h-4" />年収</dt><dd className="text-body mt-1">{job.salaryMin != null && job.salaryMax != null ? `${formatNumber(job.salaryMin)}万円 〜 ${formatNumber(job.salaryMax)}万円` : "応相談"}</dd></div>
                <div><dt className="text-caption text-ink-muted flex items-center gap-2"><Briefcase className="w-4 h-4" />雇用形態</dt><dd className="text-body mt-1">{job.employmentType}</dd></div>
                {job.workingHours && <div><dt className="text-caption text-ink-muted flex items-center gap-2"><Clock className="w-4 h-4" />勤務時間</dt><dd className="text-body mt-1">{job.workingHours}</dd></div>}
                {job.holidays && <div><dt className="text-caption text-ink-muted flex items-center gap-2"><Calendar className="w-4 h-4" />休日</dt><dd className="text-body mt-1">{job.holidays}</dd></div>}
                {job.benefits && <div className="md:col-span-2"><dt className="text-caption text-ink-muted">福利厚生</dt><dd className="text-body mt-1">{job.benefits}</dd></div>}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer" className="mt-6 space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" />承継条件</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-caption text-ink-muted">想定譲渡価格</dt>
                  <dd className="mt-1">
                    <span className="text-numeric-l text-accent">{job.transferPrice != null ? `${formatNumber(job.transferPrice)}万円` : "応相談"}</span>
                    {job.transferPriceNote && <p className="text-small text-ink-muted mt-1">※ {job.transferPriceNote}</p>}
                  </dd>
                </div>
                {(job.transferTimingMin != null || job.transferTimingMax != null) && (
                  <div><dt className="text-caption text-ink-muted">承継時期</dt><dd className="text-body mt-1">{job.transferTimingMin}〜{job.transferTimingMax}年後</dd></div>
                )}
                {job.transferConditions && <div className="md:col-span-2"><dt className="text-caption text-ink-muted">譲渡条件詳細</dt><dd className="text-body mt-1">{job.transferConditions}</dd></div>}
              </dl>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-caption text-ink-muted mb-3">譲渡に含まれるもの</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { flag: job.includesRealEstate, icon: <Home className="w-4 h-4" />, label: "不動産" },
                    { flag: job.includesEquipment, icon: <Stethoscope className="w-4 h-4" />, label: "医療機器" },
                    { flag: job.includesStaff, icon: <Users className="w-4 h-4" />, label: "スタッフ引継ぎ" },
                  ].map(({ flag, icon, label }) => (
                    <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded border ${flag ? "border-accent bg-accent/5 text-accent" : "border-border text-ink-muted"}`}>
                      {icon}<span className="text-small">{label}</span>{flag && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {(job.annualRevenue != null || job.annualProfit != null || job.patientCount != null) && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Banknote className="w-5 h-5" />経営情報</CardTitle></CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {job.annualRevenue != null && <div><dt className="text-caption text-ink-muted">年間売上</dt><dd className="text-numeric-m mt-1">{formatNumber(job.annualRevenue)}万円</dd></div>}
                  {job.annualProfit != null && <div><dt className="text-caption text-ink-muted">年間利益</dt><dd className="text-numeric-m mt-1">{formatNumber(job.annualProfit)}万円</dd></div>}
                  {job.patientCount != null && <div><dt className="text-caption text-ink-muted">1日平均患者数</dt><dd className="text-numeric-m mt-1">{job.patientCount}名</dd></div>}
                </dl>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Meta Info */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-6 text-small text-ink-muted">
            <span>作成日: {formatDate(job.createdAt)}</span>
            <span>最終更新: {formatDate(job.updatedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
