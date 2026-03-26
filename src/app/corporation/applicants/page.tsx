"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  GraduationCap,
  MapPin,
  Briefcase,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Users,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/utils";

type ApplicationStatus = keyof typeof APPLICATION_STATUS_LABELS;

interface Application {
  id: string;
  status: ApplicationStatus;
  coverLetter: string | null;
  createdAt: string;
  updatedAt: string;
  doctorProfile: {
    id: string;
    userId: string;
    displayName: string;
    medicalLicenseYear: number;
    currentHospital: string | null;
    currentPosition: string | null;
    desiredAreas: string[];
    independenceTimeline: string | null;
    specialties: Array<{ name: string; yearsOfExp: number | null }>;
  };
  jobPosting: {
    id: string;
    title: string;
  };
}

const getStatusBadgeVariant = (status: ApplicationStatus) => {
  switch (status) {
    case "PENDING":
      return "secondary";
    case "REVIEWING":
      return "default";
    case "INTERVIEW":
      return "default";
    case "MATCHED":
      return "default";
    case "REJECTED":
      return "outline";
    case "WITHDRAWN":
      return "outline";
    default:
      return "outline";
  }
};

export default function CorporationApplicantsPage() {
  const router = useRouter();
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [openingChatId, setOpeningChatId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"all" | "pending" | "reviewing" | "interview" | "rejected">(
    "all"
  );

  // 応募者一覧を取得
  React.useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/corporation/applicants");
        const data = await response.json();
        if (response.ok && data.applications) {
          setApplications(data.applications);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter.toUpperCase();
  });

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "PENDING").length,
    reviewing: applications.filter((a) => a.status === "REVIEWING").length,
    interview: applications.filter((a) => a.status === "INTERVIEW").length,
    rejected: applications.filter((a) => a.status === "REJECTED").length,
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
    setUpdatingId(applicationId);
    try {
      const response = await fetch("/api/corporation/applicants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status: newStatus }),
      });

      if (response.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId
              ? { ...app, status: newStatus, updatedAt: new Date().toISOString() }
              : app
          )
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenChat = async (application: Application) => {
    setOpeningChatId(application.id);
    try {
      // チャットルームを作成（既存がある場合はそれを返す）
      const response = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: application.doctorProfile.userId,
          relatedJobId: application.jobPosting.id,
          isAnonymous: true,
        }),
      });

      if (response.ok) {
        router.push("/corporation/chat");
      } else {
        console.error("Failed to create chat room");
      }
    } catch (error) {
      console.error("Failed to open chat:", error);
    } finally {
      setOpeningChatId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="応募者管理"
          description="求人への応募者を確認・管理できます"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="応募者管理"
        description="求人への応募者を確認・管理できます"
      />

      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-ink-muted mx-auto mb-4" />
            <p className="text-ink-muted">まだ応募者はいません</p>
            <p className="text-small text-ink-muted mt-2">
              求人を公開すると、ドクターからの応募が届きます
            </p>
            <Button className="mt-4" asChild>
              <Link href="/corporation/jobs/new">求人を作成</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-caption text-ink-muted">全応募者</p>
                <p className="text-numeric-l">{counts.all}</p>
              </CardContent>
            </Card>
            <Card className={counts.pending > 0 ? "border-accent" : ""}>
              <CardContent className="pt-4">
                <p className="text-caption text-ink-muted">新規応募</p>
                <p className="text-numeric-l text-accent">{counts.pending}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-caption text-ink-muted">審査中</p>
                <p className="text-numeric-l">{counts.reviewing}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-caption text-ink-muted">面談調整中</p>
                <p className="text-numeric-l">{counts.interview}</p>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              <TabsTrigger value="all">すべて ({counts.all})</TabsTrigger>
              <TabsTrigger value="pending">新規 ({counts.pending})</TabsTrigger>
              <TabsTrigger value="reviewing">審査中 ({counts.reviewing})</TabsTrigger>
              <TabsTrigger value="interview">面談 ({counts.interview})</TabsTrigger>
              <TabsTrigger value="rejected">不成立 ({counts.rejected})</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="mt-6">
              {filteredApplications.length > 0 ? (
                <div className="space-y-4">
                  {filteredApplications.map((application) => {
                    const yearsOfExperience =
                      new Date().getFullYear() - application.doctorProfile.medicalLicenseYear;

                    return (
                      <Card
                        key={application.id}
                        className="hover:border-border-strong transition-colors"
                      >
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                              {/* Header */}
                              <div className="flex items-center gap-2 mb-3">
                                <Badge variant={getStatusBadgeVariant(application.status)}>
                                  {APPLICATION_STATUS_LABELS[application.status]}
                                </Badge>
                                <span className="text-caption text-ink-muted">
                                  {formatRelativeTime(application.createdAt)}に応募
                                </span>
                              </div>

                              {/* Doctor Info */}
                              <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center flex-shrink-0">
                                  <span className="text-h3 text-accent">
                                    {application.doctorProfile.displayName.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <Link
                                    href={`/corporation/doctors/${application.doctorProfile.id}`}
                                    className="text-h3 hover:text-accent transition-colors"
                                  >
                                    {application.doctorProfile.displayName}
                                  </Link>
                                  <div className="mt-1 flex flex-wrap items-center gap-3 text-small text-ink-muted">
                                    <span className="flex items-center gap-1">
                                      <GraduationCap className="w-3 h-3" />
                                      医師歴 {yearsOfExperience}年
                                    </span>
                                    {application.doctorProfile.desiredAreas.length > 0 && (
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {application.doctorProfile.desiredAreas.join("、")}
                                      </span>
                                    )}
                                    {application.doctorProfile.independenceTimeline && (
                                      <span className="flex items-center gap-1">
                                        <Briefcase className="w-3 h-3" />
                                        {application.doctorProfile.independenceTimeline}
                                      </span>
                                    )}
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {application.doctorProfile.specialties.map((spec) => (
                                      <Badge key={spec.name} variant="outline" className="text-caption">
                                        {spec.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Job Info */}
                              <div className="mt-4 p-3 bg-surface-sunken rounded">
                                <p className="text-caption text-ink-muted mb-1">応募求人</p>
                                <Link
                                  href={`/corporation/jobs/${application.jobPosting.id}`}
                                  className="text-small hover:text-accent transition-colors"
                                >
                                  {application.jobPosting.title}
                                </Link>
                              </div>

                              {/* Cover Letter */}
                              {application.coverLetter && (
                                <div className="mt-3 p-3 border border-border rounded">
                                  <p className="text-caption text-ink-muted flex items-center gap-1 mb-1">
                                    <FileText className="w-3 h-3" />
                                    応募メッセージ
                                  </p>
                                  <p className="text-small">{application.coverLetter}</p>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                              <Button size="small" asChild>
                                <Link
                                  href={`/corporation/doctors/${application.doctorProfile.id}`}
                                >
                                  プロフィール
                                </Link>
                              </Button>

                              {application.status === "PENDING" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() => handleOpenChat(application)}
                                    disabled={openingChatId === application.id}
                                  >
                                    {openingChatId === application.id ? (
                                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    ) : (
                                      <MessageCircle className="w-4 h-4 mr-1" />
                                    )}
                                    メッセージ
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() =>
                                      handleUpdateStatus(application.id, "REVIEWING")
                                    }
                                    disabled={updatingId === application.id}
                                  >
                                    {updatingId === application.id ? (
                                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    ) : (
                                      <Clock className="w-4 h-4 mr-1" />
                                    )}
                                    審査開始
                                  </Button>
                                </>
                              )}

                              {application.status === "REVIEWING" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() => handleOpenChat(application)}
                                    disabled={openingChatId === application.id}
                                  >
                                    {openingChatId === application.id ? (
                                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    ) : (
                                      <MessageCircle className="w-4 h-4 mr-1" />
                                    )}
                                    メッセージ
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() =>
                                      handleUpdateStatus(application.id, "INTERVIEW")
                                    }
                                    disabled={updatingId === application.id}
                                  >
                                    {updatingId === application.id ? (
                                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    ) : (
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                    )}
                                    面談へ進む
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="small"
                                    className="text-ink-muted"
                                    onClick={() =>
                                      handleUpdateStatus(application.id, "REJECTED")
                                    }
                                    disabled={updatingId === application.id}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    見送り
                                  </Button>
                                </>
                              )}

                              {application.status === "INTERVIEW" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() => handleOpenChat(application)}
                                    disabled={openingChatId === application.id}
                                  >
                                    {openingChatId === application.id ? (
                                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    ) : (
                                      <MessageCircle className="w-4 h-4 mr-1" />
                                    )}
                                    メッセージ
                                  </Button>
                                  <Button variant="outline" size="small" asChild>
                                    <Link
                                      href={`/corporation/contracts/new?doctorName=${encodeURIComponent(application.doctorProfile.displayName)}`}
                                    >
                                      <FileText className="w-4 h-4 mr-1" />
                                      契約書作成
                                    </Link>
                                  </Button>
                                  <Button
                                    size="small"
                                    onClick={() =>
                                      handleUpdateStatus(application.id, "MATCHED")
                                    }
                                    disabled={updatingId === application.id}
                                  >
                                    {updatingId === application.id ? (
                                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    ) : (
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                    )}
                                    マッチング成立
                                  </Button>
                                </>
                              )}

                              {application.status === "REJECTED" && (
                                <Button
                                  variant="outline"
                                  size="small"
                                  onClick={() =>
                                    handleUpdateStatus(application.id, "REVIEWING")
                                  }
                                  disabled={updatingId === application.id}
                                >
                                  {updatingId === application.id ? (
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  ) : (
                                    <RotateCcw className="w-4 h-4 mr-1" />
                                  )}
                                  見送り取消
                                </Button>
                              )}
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
                    <p className="text-ink-muted">該当する応募者はいません</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
