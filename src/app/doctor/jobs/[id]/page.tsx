"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Clock,
  Heart,
  Send,
  Briefcase,
  Banknote,
  Calendar,
  Users,
  Home,
  Stethoscope,
  TrendingUp,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface JobDetail {
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
  corporation: {
    id: string;
    corporationName: string;
    corporationType: string | null;
    establishedYear: number | null;
    employeeCount: number | null;
    websiteUrl: string | null;
    logoUrl: string | null;
    description: string | null;
  };
}

export default function DoctorJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = React.useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [hasApplied, setHasApplied] = React.useState(false);
  const [isApplying, setIsApplying] = React.useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = React.useState(false);
  const [applyError, setApplyError] = React.useState<string | null>(null);

  // 求人詳細を取得
  React.useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`);
        const data = await response.json();

        if (response.ok && data.job) {
          setJob(data.job);
          setIsFavorite(data.isFavorite || false);
          setHasApplied(data.hasApplied || false);
        } else {
          setError(data.error || "求人の取得に失敗しました");
        }
      } catch (err) {
        console.error("Failed to fetch job:", err);
        setError("求人の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const handleApply = async () => {
    if (!job) return;

    setIsApplying(true);
    setApplyError(null);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobPostingId: job.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setHasApplied(true);
        router.push("/doctor/applications");
      } else {
        setApplyError(data.error || "応募に失敗しました");
      }
    } catch (err) {
      console.error("Failed to apply:", err);
      setApplyError("応募に失敗しました");
    } finally {
      setIsApplying(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!job) return;

    setIsTogglingFavorite(true);

    try {
      const response = await fetch("/api/doctor/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobPostingId: job.id }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <div className="space-y-6">
        <Link
          href="/doctor/jobs"
          className="inline-flex items-center gap-2 text-small text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          求人一覧に戻る
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-ink-muted mx-auto mb-4" />
            <p className="text-ink-muted">{error || "求人が見つかりません"}</p>
            <Button className="mt-4" asChild>
              <Link href="/doctor/jobs">求人一覧に戻る</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link
        href="/doctor/jobs"
        className="inline-flex items-center gap-2 text-small text-ink-muted hover:text-ink transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        求人一覧に戻る
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{job.department}</Badge>
            <Badge variant="secondary">{job.employmentType}</Badge>
          </div>
          <h1 className="text-h1">{job.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-small text-ink-muted">
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {job.corporation.corporationName}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.clinicArea}
            </span>
            {job.transferTimingMin && job.transferTimingMax && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {job.transferTimingMin}〜{job.transferTimingMax}年後承継
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleToggleFavorite}
            disabled={isTogglingFavorite}
            className={isFavorite ? "text-accent border-accent" : ""}
          >
            {isTogglingFavorite ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-accent" : ""}`} />
            )}
            {isFavorite ? "お気に入り済み" : "お気に入り"}
          </Button>
          {hasApplied ? (
            <Button variant="outline" disabled>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              応募済み
            </Button>
          ) : (
            <Button onClick={handleApply} isLoading={isApplying}>
              <Send className="w-4 h-4 mr-2" />
              応募する
            </Button>
          )}
        </div>
      </div>

      {/* Apply Error */}
      {applyError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-small">{applyError}</p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-caption text-ink-muted mb-1">年収</p>
            <p className="text-numeric-l">
              {job.salaryMin && formatNumber(job.salaryMin)}
              {job.salaryMin && job.salaryMax && "〜"}
              {job.salaryMax && formatNumber(job.salaryMax)}
              <span className="text-body text-ink-muted ml-1">万円</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-caption text-ink-muted mb-1">想定譲渡価格</p>
            <p className="text-numeric-l text-accent">
              {job.transferPrice ? formatNumber(job.transferPrice) : "応相談"}
              {job.transferPrice && <span className="text-body text-ink-muted ml-1">万円</span>}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-caption text-ink-muted mb-1">承継時期</p>
            <p className="text-numeric-l">
              {job.transferTimingMin && job.transferTimingMax ? (
                <>
                  {job.transferTimingMin}〜{job.transferTimingMax}
                  <span className="text-body text-ink-muted ml-1">年後</span>
                </>
              ) : (
                <span className="text-body text-ink-muted">応相談</span>
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-caption text-ink-muted mb-1">1日平均患者数</p>
            <p className="text-numeric-l">
              {job.patientCount ? (
                <>
                  {job.patientCount}
                  <span className="text-body text-ink-muted ml-1">名</span>
                </>
              ) : (
                <span className="text-body text-ink-muted">非公開</span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">募集概要</TabsTrigger>
          <TabsTrigger value="conditions">雇用条件</TabsTrigger>
          <TabsTrigger value="transfer">承継条件</TabsTrigger>
          <TabsTrigger value="corporation">法人情報</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                募集内容
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {job.description.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) {
                    return (
                      <h3 key={i} className="text-h3 mt-6 mb-3 first:mt-0">
                        {line.replace("## ", "")}
                      </h3>
                    );
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <li key={i} className="text-body ml-4">
                        {line.replace("- ", "")}
                      </li>
                    );
                  }
                  if (line.trim() === "") {
                    return <br key={i} />;
                  }
                  return (
                    <p key={i} className="text-body mb-2">
                      {line}
                    </p>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                クリニック情報
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-caption text-ink-muted">クリニック名</dt>
                  <dd className="text-body mt-1">{job.clinicName}</dd>
                </div>
                <div>
                  <dt className="text-caption text-ink-muted">診療科</dt>
                  <dd className="text-body mt-1">{job.department}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-caption text-ink-muted">所在地</dt>
                  <dd className="text-body mt-1">{job.clinicAddress}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                雇用条件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-caption text-ink-muted flex items-center gap-2">
                    <Banknote className="w-4 h-4" />
                    年収
                  </dt>
                  <dd className="text-body mt-1">
                    {job.salaryMin && formatNumber(job.salaryMin)}万円
                    {job.salaryMin && job.salaryMax && " 〜 "}
                    {job.salaryMax && formatNumber(job.salaryMax)}万円
                  </dd>
                </div>
                <div>
                  <dt className="text-caption text-ink-muted flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    雇用形態
                  </dt>
                  <dd className="text-body mt-1">{job.employmentType}</dd>
                </div>
                <div>
                  <dt className="text-caption text-ink-muted flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    勤務時間
                  </dt>
                  <dd className="text-body mt-1">{job.workingHours || "要相談"}</dd>
                </div>
                <div>
                  <dt className="text-caption text-ink-muted flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    休日
                  </dt>
                  <dd className="text-body mt-1">{job.holidays || "要相談"}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-caption text-ink-muted">福利厚生</dt>
                  <dd className="text-body mt-1">{job.benefits || "お問い合わせください"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                承継条件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-caption text-ink-muted">想定譲渡価格</dt>
                  <dd className="mt-1">
                    <span className="text-numeric-l text-accent">
                      {job.transferPrice ? `${formatNumber(job.transferPrice)}万円` : "応相談"}
                    </span>
                    {job.transferPriceNote && (
                      <p className="text-small text-ink-muted mt-1">
                        ※ {job.transferPriceNote}
                      </p>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption text-ink-muted">承継時期</dt>
                  <dd className="text-body mt-1">
                    {job.transferTimingMin && job.transferTimingMax
                      ? `${job.transferTimingMin}〜${job.transferTimingMax}年後`
                      : "応相談"}
                  </dd>
                </div>
                {job.transferConditions && (
                  <div className="md:col-span-2">
                    <dt className="text-caption text-ink-muted">譲渡条件詳細</dt>
                    <dd className="text-body mt-1">{job.transferConditions}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-caption text-ink-muted mb-3">譲渡に含まれるもの</p>
                <div className="flex flex-wrap gap-3">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded border ${
                      job.includesRealEstate
                        ? "border-accent bg-accent/5 text-accent"
                        : "border-border text-ink-muted"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-small">不動産</span>
                    {job.includesRealEstate && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded border ${
                      job.includesEquipment
                        ? "border-accent bg-accent/5 text-accent"
                        : "border-border text-ink-muted"
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span className="text-small">医療機器</span>
                    {job.includesEquipment && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded border ${
                      job.includesStaff
                        ? "border-accent bg-accent/5 text-accent"
                        : "border-border text-ink-muted"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-small">スタッフ引継ぎ</span>
                    {job.includesStaff && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="w-5 h-5" />
                経営情報
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <dt className="text-caption text-ink-muted">年間売上</dt>
                  <dd className="text-numeric-m mt-1">
                    {job.annualRevenue ? `${formatNumber(job.annualRevenue)}万円` : "非公開"}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption text-ink-muted">年間利益</dt>
                  <dd className="text-numeric-m mt-1">
                    {job.annualProfit ? `${formatNumber(job.annualProfit)}万円` : "非公開"}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption text-ink-muted">1日平均患者数</dt>
                  <dd className="text-numeric-m mt-1">
                    {job.patientCount ? `${job.patientCount}名` : "非公開"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corporation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                法人情報
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-caption text-ink-muted">法人名</dt>
                  <dd className="text-body mt-1">{job.corporation.corporationName}</dd>
                </div>
                <div>
                  <dt className="text-caption text-ink-muted">法人種別</dt>
                  <dd className="text-body mt-1">{job.corporation.corporationType || "未登録"}</dd>
                </div>
                <div>
                  <dt className="text-caption text-ink-muted">設立年</dt>
                  <dd className="text-body mt-1">
                    {job.corporation.establishedYear ? `${job.corporation.establishedYear}年` : "未登録"}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption text-ink-muted">従業員数</dt>
                  <dd className="text-body mt-1">
                    {job.corporation.employeeCount ? `${job.corporation.employeeCount}名` : "未登録"}
                  </dd>
                </div>
                {job.corporation.websiteUrl && (
                  <div className="md:col-span-2">
                    <dt className="text-caption text-ink-muted">Webサイト</dt>
                    <dd className="text-body mt-1">
                      <a
                        href={job.corporation.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        {job.corporation.websiteUrl}
                      </a>
                    </dd>
                  </div>
                )}
                {job.corporation.description && (
                  <div className="md:col-span-2">
                    <dt className="text-caption text-ink-muted">法人紹介</dt>
                    <dd className="text-body mt-1">{job.corporation.description}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom CTA */}
      <Card className="bg-surface-sunken">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-h3">この求人に興味がありますか？</p>
              <p className="text-small text-ink-muted mt-1">
                応募後、法人担当者からご連絡いたします
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className={isFavorite ? "text-accent border-accent" : ""}
              >
                {isTogglingFavorite ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-accent" : ""}`} />
                )}
                お気に入り
              </Button>
              {hasApplied ? (
                <Button variant="outline" disabled>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  応募済み
                </Button>
              ) : (
                <Button onClick={handleApply} isLoading={isApplying}>
                  <Send className="w-4 h-4 mr-2" />
                  応募する
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
