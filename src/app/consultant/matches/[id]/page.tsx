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
  Users,
  Building2,
  MessageCircle,
  FileText,
  Banknote,
  Loader2,
} from "lucide-react";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import { MATCH_STATUS_LABELS } from "@/lib/constants";

type MatchStatus = keyof typeof MATCH_STATUS_LABELS;

interface MatchDetail {
  id: string;
  status: MatchStatus;
  agreedSalary: number | null;
  agreedTransferPrice: number | null;
  agreedTransferDate: string | null;
  employmentStartDate: string | null;
  createdAt: string;
  updatedAt: string;
  doctorProfile: {
    id: string;
    displayName: string;
    medicalLicenseYear: number;
    specialties: string[];
    currentWorkplace: string | null;
    desiredSalaryMin: number | null;
    desiredSalaryMax: number | null;
  };
  corporation: {
    id: string;
    corporationName: string;
    representativeName: string;
    email: string;
    address: string | null;
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
    displayName: string;
  } | null;
  notes: {
    id: string;
    content: string;
    authorId: string;
    createdAt: string;
  }[];
  contracts: {
    id: string;
    type: string;
    status: string;
    title: string;
    signedAt: string | null;
    createdAt: string;
  }[];
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
      return "default";
    case "CANCELLED":
      return "outline";
    default:
      return "outline";
  }
};

export default function ConsultantMatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("overview");
  const [match, setMatch] = React.useState<MatchDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/consultant/matches/${params.id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "取得に失敗しました");
        }
        const data = await res.json();
        setMatch(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "不明なエラー");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchMatch();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-ink-muted" />
      </div>
    );
  }

  if (error || !match) {
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
              {error || "マッチングが見つかりません"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const yearsOfExperience =
    new Date().getFullYear() - match.doctorProfile.medicalLicenseYear;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="small" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          戻る
        </Button>
      </div>

      <PageHeader
        title={match.jobPosting.title}
        description={`${match.doctorProfile.displayName} × ${match.corporation.corporationName}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="small">
              <MessageCircle className="w-4 h-4 mr-1" />
              メモを追加
            </Button>
            <Button size="small">
              <FileText className="w-4 h-4 mr-1" />
              ステータス更新
            </Button>
          </div>
        }
      />

      {/* Status Badge */}
      <div className="flex items-center gap-3">
        <Badge variant={getStatusBadgeVariant(match.status)}>
          {MATCH_STATUS_LABELS[match.status]}
        </Badge>
        <span className="text-caption text-ink-muted">
          最終更新: {formatRelativeTime(match.updatedAt)}
        </span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="notes">メモ ({match.notes.length})</TabsTrigger>
          <TabsTrigger value="contracts">
            契約 ({match.contracts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doctor */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    ドクター
                  </CardTitle>
                  <Button variant="ghost" size="small" asChild>
                    <Link
                      href={`/consultant/doctors/${match.doctorProfile.id}`}
                    >
                      詳細
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-h3">
                    {match.doctorProfile.displayName}
                  </p>
                  <p className="text-small text-ink-muted">
                    医師歴 {yearsOfExperience}年 ・{" "}
                    {match.doctorProfile.specialties.join("、")}
                  </p>
                </div>
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex justify-between">
                    <span className="text-small text-ink-muted">希望年収</span>
                    <span className="text-numeric-s">
                      {match.doctorProfile.desiredSalaryMin != null &&
                      match.doctorProfile.desiredSalaryMax != null
                        ? `${formatNumber(match.doctorProfile.desiredSalaryMin)}〜${formatNumber(match.doctorProfile.desiredSalaryMax)}万円`
                        : "未設定"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Corporation */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    法人
                  </CardTitle>
                  <Button variant="ghost" size="small" asChild>
                    <Link
                      href={`/consultant/corporations/${match.corporation.id}`}
                    >
                      詳細
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-h3">
                    {match.corporation.corporationName}
                  </p>
                  <p className="text-small text-ink-muted">
                    代表: {match.corporation.representativeName}
                  </p>
                </div>
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex justify-between">
                    <span className="text-small text-ink-muted">提示年収</span>
                    <span className="text-numeric-s">
                      {match.jobPosting.salaryMin != null &&
                      match.jobPosting.salaryMax != null
                        ? `${formatNumber(match.jobPosting.salaryMin)}〜${formatNumber(match.jobPosting.salaryMax)}万円`
                        : "未設定"}
                    </span>
                  </div>
                  {match.jobPosting.transferPrice != null && (
                    <div className="flex justify-between">
                      <span className="text-small text-ink-muted">
                        譲渡価格
                      </span>
                      <span className="text-numeric-s text-accent">
                        {formatNumber(match.jobPosting.transferPrice)}万円
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Agreement Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="w-5 h-5" />
                合意条件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-caption text-ink-muted">合意年収</p>
                  <p className="text-numeric-m mt-1">
                    {match.agreedSalary
                      ? `${formatNumber(match.agreedSalary)}万円`
                      : "未定"}
                  </p>
                </div>
                <div>
                  <p className="text-caption text-ink-muted">合意譲渡価格</p>
                  <p className="text-numeric-m text-accent mt-1">
                    {match.agreedTransferPrice
                      ? `${formatNumber(match.agreedTransferPrice)}万円`
                      : "未定"}
                  </p>
                </div>
                <div>
                  <p className="text-caption text-ink-muted">雇用開始日</p>
                  <p className="text-body mt-1">
                    {match.employmentStartDate
                      ? new Date(match.employmentStartDate).toLocaleDateString(
                          "ja-JP"
                        )
                      : "未定"}
                  </p>
                </div>
                <div>
                  <p className="text-caption text-ink-muted">譲渡予定日</p>
                  <p className="text-body mt-1">
                    {match.agreedTransferDate
                      ? new Date(match.agreedTransferDate).toLocaleDateString(
                          "ja-JP"
                        )
                      : "未定"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6 space-y-4">
          {match.notes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-body text-ink-muted">メモはありません</p>
              </CardContent>
            </Card>
          ) : (
            match.notes.map((note) => (
              <Card key={note.id}>
                <CardContent className="pt-6">
                  <p className="text-body">{note.content}</p>
                  <p className="text-caption text-ink-muted mt-2">
                    {new Date(note.createdAt).toLocaleDateString("ja-JP")}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="contracts" className="mt-6 space-y-4">
          {match.contracts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-body text-ink-muted">契約はありません</p>
              </CardContent>
            </Card>
          ) : (
            match.contracts.map((contract) => (
              <Card key={contract.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {contract.status}
                      </Badge>
                      <p className="text-body font-medium">{contract.title}</p>
                      <p className="text-caption text-ink-muted mt-1">
                        {new Date(contract.createdAt).toLocaleDateString(
                          "ja-JP"
                        )}
                        {contract.signedAt &&
                          ` ・ 署名済: ${new Date(contract.signedAt).toLocaleDateString("ja-JP")}`}
                      </p>
                    </div>
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
