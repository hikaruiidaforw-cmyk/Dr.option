"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Building2,
  MapPin,
  MessageCircle,
  ExternalLink,
  FileText,
  Loader2,
  Search,
} from "lucide-react";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants";
import { formatNumber, formatRelativeTime } from "@/lib/utils";

type ApplicationStatus = keyof typeof APPLICATION_STATUS_LABELS;

interface Application {
  id: string;
  status: ApplicationStatus;
  coverLetter: string | null;
  createdAt: string;
  updatedAt: string;
  jobPosting: {
    id: string;
    title: string;
    department: string;
    clinicName: string;
    clinicArea: string;
    salaryMin: number | null;
    salaryMax: number | null;
    transferPrice: number | null;
    corporation: {
      id: string;
      corporationName: string;
      logoUrl: string | null;
    };
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

export default function DoctorApplicationsPage() {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"all" | "active" | "closed">("all");

  // 応募一覧を取得
  React.useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("/api/applications");
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
    if (filter === "active") {
      return ["PENDING", "REVIEWING", "INTERVIEW"].includes(app.status);
    }
    if (filter === "closed") {
      return ["MATCHED", "REJECTED", "WITHDRAWN"].includes(app.status);
    }
    return true;
  });

  const activeCount = applications.filter((app) =>
    ["PENDING", "REVIEWING", "INTERVIEW"].includes(app.status)
  ).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="応募管理"
          description="応募した求人の状況を確認できます"
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
        title="応募管理"
        description="応募した求人の状況を確認できます"
      />

      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 text-ink-muted mx-auto mb-4" />
            <p className="text-ink-muted">まだ応募はありません</p>
            <p className="text-small text-ink-muted mt-2">
              気になる求人に応募してみましょう
            </p>
            <Button className="mt-4" asChild>
              <Link href="/doctor/jobs">求人を探す</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-caption text-ink-muted">全応募数</p>
                <p className="text-numeric-l">{applications.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-caption text-ink-muted">進行中</p>
                <p className="text-numeric-l text-accent">{activeCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-caption text-ink-muted">審査中</p>
                <p className="text-numeric-l">
                  {applications.filter((a) => a.status === "REVIEWING").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-caption text-ink-muted">面談調整中</p>
                <p className="text-numeric-l">
                  {applications.filter((a) => a.status === "INTERVIEW").length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              <TabsTrigger value="all">すべて ({applications.length})</TabsTrigger>
              <TabsTrigger value="active">進行中 ({activeCount})</TabsTrigger>
              <TabsTrigger value="closed">
                終了 ({applications.length - activeCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="mt-6">
              {filteredApplications.length > 0 ? (
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <Card
                      key={application.id}
                      className="hover:border-border-strong transition-colors"
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={getStatusBadgeVariant(application.status)}>
                                {APPLICATION_STATUS_LABELS[application.status]}
                              </Badge>
                              <Badge variant="outline">
                                {application.jobPosting.department}
                              </Badge>
                              <span className="text-caption text-ink-muted">
                                {formatRelativeTime(application.updatedAt)}更新
                              </span>
                            </div>

                            <Link
                              href={`/doctor/jobs/${application.jobPosting.id}`}
                              className="text-h3 hover:text-accent transition-colors"
                            >
                              {application.jobPosting.title}
                            </Link>

                            <div className="mt-3 flex flex-wrap items-center gap-4 text-small text-ink-muted">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {application.jobPosting.corporation.corporationName}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {application.jobPosting.clinicArea}
                              </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-6">
                              {(application.jobPosting.salaryMin || application.jobPosting.salaryMax) && (
                                <div>
                                  <p className="text-caption text-ink-muted">年収</p>
                                  <p className="text-numeric-m">
                                    {application.jobPosting.salaryMin && formatNumber(application.jobPosting.salaryMin)}
                                    {application.jobPosting.salaryMin && application.jobPosting.salaryMax && "〜"}
                                    {application.jobPosting.salaryMax && formatNumber(application.jobPosting.salaryMax)}万
                                  </p>
                                </div>
                              )}
                              {application.jobPosting.transferPrice && (
                                <div>
                                  <p className="text-caption text-ink-muted">譲渡価格</p>
                                  <p className="text-numeric-m text-accent">
                                    {formatNumber(application.jobPosting.transferPrice)}万
                                  </p>
                                </div>
                              )}
                            </div>

                            {application.coverLetter && (
                              <div className="mt-4 p-3 bg-surface-sunken rounded">
                                <p className="text-caption text-ink-muted flex items-center gap-1 mb-1">
                                  <FileText className="w-3 h-3" />
                                  応募メッセージ
                                </p>
                                <p className="text-small">{application.coverLetter}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button variant="outline" size="small" asChild>
                              <Link href={`/doctor/jobs/${application.jobPosting.id}`}>
                                <ExternalLink className="w-4 h-4 mr-1" />
                                求人詳細
                              </Link>
                            </Button>
                            {["REVIEWING", "INTERVIEW", "MATCHED"].includes(
                              application.status
                            ) && (
                              <Button size="small" asChild>
                                <Link href="/doctor/chat">
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  メッセージ
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-ink-muted">該当する応募はありません</p>
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
