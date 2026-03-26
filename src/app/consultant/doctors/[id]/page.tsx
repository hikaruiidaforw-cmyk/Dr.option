"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Users,
  MapPin,
  Briefcase,
  Calendar,
  MessageCircle,
  FileText,
  Mail,
  Banknote,
  Loader2,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface DoctorDetail {
  id: string;
  displayName: string;
  realName: string | null;
  email: string;
  medicalLicenseYear: number;
  specialties: string[];
  boardCertifications: string[];
  currentHospital: string | null;
  currentPosition: string | null;
  desiredDepartments: string[];
  desiredAreas: string[];
  desiredSalaryMin: number | null;
  desiredSalaryMax: number | null;
  independenceTimeline: string | null;
  selfIntroduction: string | null;
  isPublic: boolean;
  lastActiveAt: string;
  createdAt: string;
  applications: {
    id: string;
    jobTitle: string;
    corporationName: string;
    status: string;
    appliedAt: string;
  }[];
  scoutResponses: {
    id: string;
    corporationName: string;
    response: string;
    respondedAt: string;
  }[];
  careerEvents: {
    id: string;
    year: number;
    title: string;
    description: string | null;
  }[];
}

const APPLICATION_STATUS_MAP: Record<string, string> = {
  PENDING: "応募済み",
  REVIEWING: "審査中",
  INTERVIEW: "面談調整中",
  MATCHED: "マッチング成立",
  REJECTED: "不成立",
  WITHDRAWN: "応募取消",
};

const SCOUT_STATUS_MAP: Record<string, string> = {
  SENT: "送信済み",
  READ: "既読",
  INTERESTED: "興味あり",
  DECLINED: "辞退",
};

export default function ConsultantDoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("profile");
  const [doctor, setDoctor] = React.useState<DoctorDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/consultant/doctors/${params.id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "取得に失敗しました");
        }
        const data = await res.json();
        setDoctor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "不明なエラー");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchDoctor();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-ink-muted" />
      </div>
    );
  }

  if (error || !doctor) {
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
              {error || "ドクターが見つかりません"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const yearsOfExperience =
    new Date().getFullYear() - doctor.medicalLicenseYear;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="small" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          戻る
        </Button>
      </div>

      <PageHeader
        title={doctor.displayName}
        description={`医師歴 ${yearsOfExperience}年 ・ ${doctor.specialties.join("、")}`}
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
          <TabsTrigger value="profile">プロフィール</TabsTrigger>
          <TabsTrigger value="applications">
            応募状況 ({doctor.applications.length})
          </TabsTrigger>
          <TabsTrigger value="scouts">
            スカウト ({doctor.scoutResponses.length})
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
                  <Users className="w-4 h-4 text-ink-muted mt-0.5" />
                  <div>
                    <p className="text-caption text-ink-muted">氏名</p>
                    <p className="text-body">{doctor.displayName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-ink-muted mt-0.5" />
                  <div>
                    <p className="text-caption text-ink-muted">メールアドレス</p>
                    <p className="text-body">{doctor.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-ink-muted mt-0.5" />
                  <div>
                    <p className="text-caption text-ink-muted">医師免許取得年</p>
                    <p className="text-body">
                      {doctor.medicalLicenseYear}年（{yearsOfExperience}年目）
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-ink-muted mt-0.5" />
                  <div>
                    <p className="text-caption text-ink-muted">現在の勤務先</p>
                    <p className="text-body">
                      {doctor.currentHospital || "未設定"}
                    </p>
                    {doctor.currentPosition && (
                      <p className="text-small text-ink-muted">
                        {doctor.currentPosition}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-caption text-ink-muted mb-2">診療科</p>
                <div className="flex flex-wrap gap-2">
                  {doctor.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {doctor.boardCertifications.length > 0 && (
                <div>
                  <p className="text-caption text-ink-muted mb-2">専門医資格</p>
                  <div className="flex flex-wrap gap-2">
                    {doctor.boardCertifications.map((cert) => (
                      <Badge key={cert} variant="outline">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {doctor.selfIntroduction && (
                <div>
                  <p className="text-caption text-ink-muted mb-2">自己紹介</p>
                  <p className="text-body">{doctor.selfIntroduction}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Desired Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>希望条件</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-ink-muted mt-0.5" />
                  <div>
                    <p className="text-caption text-ink-muted">希望エリア</p>
                    <p className="text-body">
                      {doctor.desiredAreas.length > 0
                        ? doctor.desiredAreas.join("、")
                        : "未設定"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Banknote className="w-4 h-4 text-ink-muted mt-0.5" />
                  <div>
                    <p className="text-caption text-ink-muted">希望年収</p>
                    <p className="text-numeric-m">
                      {doctor.desiredSalaryMin && doctor.desiredSalaryMax
                        ? `${formatNumber(doctor.desiredSalaryMin)}〜${formatNumber(doctor.desiredSalaryMax)}万円`
                        : "未設定"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-ink-muted mt-0.5" />
                  <div>
                    <p className="text-caption text-ink-muted">独立希望時期</p>
                    <p className="text-body">
                      {doctor.independenceTimeline || "未設定"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Events */}
          {doctor.careerEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>経歴</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {doctor.careerEvents.map((event) => (
                    <div key={event.id} className="flex gap-4">
                      <span className="text-numeric-s text-ink-muted w-12 shrink-0">
                        {event.year}
                      </span>
                      <div>
                        <p className="text-body font-medium">{event.title}</p>
                        {event.description && (
                          <p className="text-small text-ink-muted">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="applications" className="mt-6 space-y-4">
          {doctor.applications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-body text-ink-muted">応募はありません</p>
              </CardContent>
            </Card>
          ) : (
            doctor.applications.map((app) => (
              <Card key={app.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {APPLICATION_STATUS_MAP[app.status] || app.status}
                      </Badge>
                      <p className="text-body font-medium">{app.jobTitle}</p>
                      <p className="text-small text-ink-muted mt-1">
                        {app.corporationName}
                      </p>
                      <p className="text-caption text-ink-muted mt-1">
                        {new Date(app.appliedAt).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                    <Button variant="outline" size="small">
                      詳細
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="scouts" className="mt-6 space-y-4">
          {doctor.scoutResponses.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-body text-ink-muted">
                  スカウトはありません
                </p>
              </CardContent>
            </Card>
          ) : (
            doctor.scoutResponses.map((scout) => (
              <Card key={scout.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {SCOUT_STATUS_MAP[scout.response] || scout.response}
                      </Badge>
                      <p className="text-body font-medium">
                        {scout.corporationName}
                      </p>
                      <p className="text-caption text-ink-muted mt-1">
                        {new Date(scout.respondedAt).toLocaleDateString("ja-JP")}
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
