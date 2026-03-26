"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Send,
  GraduationCap,
  Target,
  Banknote,
  Clock,
  User,
  Award,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface Doctor {
  id: string;
  displayName: string;
  medicalLicenseYear: number;
  currentHospital: string | null;
  currentPosition: string | null;
  specialties: Array<{ name: string; yearsOfExp: number | null }>;
  boardCertifications: string[];
  desiredDepartments: string[];
  desiredAreas: string[];
  desiredSalaryMin: number | null;
  desiredSalaryMax: number | null;
  independenceTimeline: string | null;
  selfIntroduction: string | null;
  isPublic: boolean;
  lastActiveAt: string;
}

interface JobPosting {
  id: string;
  title: string;
}

export default function CorporationDoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = React.useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showScoutModal, setShowScoutModal] = React.useState(false);
  const [scoutMessage, setScoutMessage] = React.useState("");
  const [selectedJob, setSelectedJob] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [myJobs, setMyJobs] = React.useState<JobPosting[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  // ドクター情報を取得
  React.useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/doctors/${params.id}`);
        const data = await response.json();
        if (response.ok) {
          setDoctor(data.doctor);
        } else {
          setError(data.error || "ドクター情報の取得に失敗しました");
        }
      } catch (err) {
        console.error("Failed to fetch doctor:", err);
        setError("ドクター情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [params.id]);

  // 法人の求人一覧を取得
  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/corporation/jobs");
        const data = await response.json();
        if (response.ok && data.jobs) {
          setMyJobs(data.jobs.map((job: { id: string; title: string }) => ({
            id: job.id,
            title: job.title,
          })));
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  const yearsOfExperience = doctor
    ? new Date().getFullYear() - doctor.medicalLicenseYear
    : 0;

  const handleSendScout = async () => {
    if (!selectedJob || !scoutMessage.trim() || !doctor) {
      return;
    }
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch("/api/scouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorProfileId: doctor.id,
          jobPostingId: selectedJob,
          message: scoutMessage.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 成功したらチャット画面に遷移
        router.push("/corporation/chat");
      } else {
        setError(data.error || "スカウトの送信に失敗しました");
      }
    } catch (err) {
      console.error("Failed to send scout:", err);
      setError("スカウトの送信に失敗しました");
    } finally {
      setIsSending(false);
    }
  };

  // メッセージを直接送る（チャットルーム作成）
  const handleStartChat = async () => {
    if (!doctor) return;

    try {
      // 最初の求人を使用してチャットルームを作成
      const jobId = myJobs[0]?.id;

      const response = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId: null, // ドクタープロフィールのuserIdが必要
          doctorProfileId: doctor.id,
          relatedJobId: jobId || null,
        }),
      });

      if (response.ok) {
        router.push("/corporation/chat");
      }
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="space-y-6">
        <Link
          href="/corporation/doctors"
          className="inline-flex items-center gap-2 text-small text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          ドクター一覧に戻る
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-ink-muted">{error || "ドクターが見つかりません"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link
        href="/corporation/doctors"
        className="inline-flex items-center gap-2 text-small text-ink-muted hover:text-ink transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        ドクター一覧に戻る
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center flex-shrink-0">
            <span className="text-display text-accent">
              {doctor.displayName.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-h1">{doctor.displayName}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-small text-ink-muted">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4" />
                医師歴 {yearsOfExperience}年
              </span>
              {doctor.currentHospital && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {doctor.currentHospital}
                </span>
              )}
            </div>
          </div>
        </div>

        <Button onClick={() => setShowScoutModal(true)}>
          <Send className="w-4 h-4 mr-2" />
          スカウトを送る
        </Button>
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-2">
        {doctor.specialties.map((specialty) => (
          <Badge key={specialty.name} variant="outline">
            {specialty.name}
            {specialty.yearsOfExp && (
              <span className="ml-1 text-ink-muted">({specialty.yearsOfExp}年)</span>
            )}
          </Badge>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded border bg-red-50 border-red-200 text-red-800">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {doctor.selfIntroduction && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  自己紹介
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body whitespace-pre-wrap">{doctor.selfIntroduction}</p>
              </CardContent>
            </Card>
          )}

          {doctor.boardCertifications && doctor.boardCertifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  専門医資格
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {doctor.boardCertifications.map((cert, index) => (
                    <li key={index} className="flex items-center gap-2 text-body">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Conditions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                希望条件
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {doctor.desiredDepartments.length > 0 && (
                <div>
                  <p className="text-caption text-ink-muted flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    希望診療科
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {doctor.desiredDepartments.map((dept) => (
                      <Badge key={dept} variant="secondary" className="text-caption">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {doctor.desiredAreas.length > 0 && (
                <div>
                  <p className="text-caption text-ink-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    希望エリア
                  </p>
                  <p className="text-body mt-1">{doctor.desiredAreas.join("、")}</p>
                </div>
              )}

              {(doctor.desiredSalaryMin || doctor.desiredSalaryMax) && (
                <div>
                  <p className="text-caption text-ink-muted flex items-center gap-1">
                    <Banknote className="w-3 h-3" />
                    希望年収
                  </p>
                  <p className="text-numeric-m mt-1">
                    {doctor.desiredSalaryMin && formatNumber(doctor.desiredSalaryMin)}
                    {doctor.desiredSalaryMin && doctor.desiredSalaryMax && "〜"}
                    {doctor.desiredSalaryMax && formatNumber(doctor.desiredSalaryMax)}万円
                  </p>
                </div>
              )}

              {doctor.independenceTimeline && (
                <div>
                  <p className="text-caption text-ink-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    独立希望時期
                  </p>
                  <p className="text-body mt-1">{doctor.independenceTimeline}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-accent/5 border-accent">
            <CardContent className="py-4">
              <p className="text-small text-center mb-3">
                この方にスカウトを送信しますか？
              </p>
              <Button className="w-full" onClick={() => setShowScoutModal(true)}>
                <Send className="w-4 h-4 mr-2" />
                スカウトを送る
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scout Modal */}
      {showScoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-ink/50"
            onClick={() => setShowScoutModal(false)}
          />
          <Card className="relative z-10 w-full max-w-lg mx-4">
            <CardHeader>
              <CardTitle>スカウトを送信</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-surface-sunken rounded">
                <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center">
                  <span className="text-h3 text-accent">
                    {doctor.displayName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-body font-medium">{doctor.displayName}</p>
                  <p className="text-small text-ink-muted">
                    {doctor.specialties.map((s) => s.name).join("、")}
                  </p>
                </div>
              </div>

              {myJobs.length === 0 ? (
                <div className="p-4 bg-surface-sunken rounded text-center">
                  <p className="text-ink-muted">求人がありません</p>
                  <p className="text-small text-ink-muted mt-1">
                    スカウトを送るには、まず求人を作成してください
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-3"
                    onClick={() => router.push("/corporation/jobs/new")}
                  >
                    求人を作成する
                  </Button>
                </div>
              ) : (
                <>
                  <FormField label="スカウト対象の求人" htmlFor="job" required>
                    <select
                      id="job"
                      className="w-full px-3 py-2 border border-border rounded bg-white"
                      value={selectedJob}
                      onChange={(e) => setSelectedJob(e.target.value)}
                    >
                      <option value="">求人を選択してください</option>
                      {myJobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="スカウトメッセージ" htmlFor="message" required>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="スカウトメッセージを入力してください..."
                      value={scoutMessage}
                      onChange={(e) => setScoutMessage(e.target.value)}
                    />
                  </FormField>

                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="secondary"
                      onClick={() => setShowScoutModal(false)}
                    >
                      キャンセル
                    </Button>
                    <Button
                      onClick={handleSendScout}
                      isLoading={isSending}
                      disabled={!selectedJob || !scoutMessage.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      送信
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
