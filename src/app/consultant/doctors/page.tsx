"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  MapPin,
  Briefcase,
  MessageCircle,
  Eye,
  Loader2,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface DoctorData {
  id: string;
  displayName: string;
  medicalLicenseYear: number;
  currentHospital: string | null;
  currentPosition: string | null;
  specialties: string[];
  desiredAreas: string[];
  desiredSalaryMin: number | null;
  desiredSalaryMax: number | null;
  independenceTimeline: string | null;
  applicationCount: number;
  scoutCount: number;
}

export default function ConsultantDoctorsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [doctors, setDoctors] = React.useState<DoctorData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch("/api/consultant/doctors");
        if (res.ok) setDoctors(await res.json());
      } catch {
        // fallback
      } finally {
        setIsLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  const filtered = doctors.filter((doctor) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      doctor.displayName.toLowerCase().includes(q) ||
      doctor.specialties.some((s) => s.includes(q)) ||
      doctor.desiredAreas.some((a) => a.includes(q))
    );
  });

  const withApps = doctors.filter((d) => d.applicationCount > 0).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="ドクター一覧" description="登録ドクターを確認・管理します" />
        <Card><CardContent className="py-12 text-center"><Loader2 className="w-8 h-8 text-ink-muted mx-auto mb-3 animate-spin" /><p className="text-ink-muted">読み込み中...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="ドクター一覧" description="登録ドクターを確認・管理します" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption text-ink-muted">登録ドクター数</p>
            <p className="text-numeric-l">{doctors.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption text-ink-muted">応募中</p>
            <p className="text-numeric-l text-accent">{withApps}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-caption text-ink-muted">スカウト受信あり</p>
            <p className="text-numeric-l">{doctors.filter((d) => d.scoutCount > 0).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <Input placeholder="ドクター名、診療科、希望エリアで検索..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Doctor List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((doctor) => {
            const yearsOfExperience = new Date().getFullYear() - doctor.medicalLicenseYear;
            return (
              <Card key={doctor.id} className="hover:border-border-strong transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center">
                          <Users className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <p className="text-h3">{doctor.displayName}</p>
                          <p className="text-small text-ink-muted">医師歴 {yearsOfExperience}年</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {doctor.specialties.map((s) => (
                          <Badge key={s} variant="secondary">{s}</Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {doctor.currentHospital && (
                          <div className="flex items-start gap-2">
                            <Briefcase className="w-4 h-4 text-ink-muted mt-0.5" />
                            <div>
                              <p className="text-caption text-ink-muted">現在の勤務先</p>
                              <p className="text-body">{doctor.currentHospital}</p>
                            </div>
                          </div>
                        )}
                        {doctor.desiredAreas.length > 0 && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-ink-muted mt-0.5" />
                            <div>
                              <p className="text-caption text-ink-muted">希望エリア</p>
                              <p className="text-body">{doctor.desiredAreas.join("、")}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-6">
                        {(doctor.desiredSalaryMin != null || doctor.desiredSalaryMax != null) && (
                          <div>
                            <p className="text-caption text-ink-muted">希望年収</p>
                            <p className="text-numeric-m mt-1">
                              {doctor.desiredSalaryMin != null && doctor.desiredSalaryMax != null
                                ? `${formatNumber(doctor.desiredSalaryMin)}〜${formatNumber(doctor.desiredSalaryMax)}万円`
                                : doctor.desiredSalaryMin != null
                                ? `${formatNumber(doctor.desiredSalaryMin)}万円〜`
                                : `〜${formatNumber(doctor.desiredSalaryMax)}万円`}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-caption text-ink-muted">応募数</p>
                          <p className="text-numeric-m mt-1">{doctor.applicationCount}件</p>
                        </div>
                        <div>
                          <p className="text-caption text-ink-muted">スカウト受信</p>
                          <p className="text-numeric-m mt-1">{doctor.scoutCount}件</p>
                        </div>
                        {doctor.independenceTimeline && (
                          <div>
                            <p className="text-caption text-ink-muted">独立希望時期</p>
                            <p className="text-body mt-1">{doctor.independenceTimeline}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="small" asChild>
                        <Link href={`/consultant/doctors/${doctor.id}`}>
                          <Eye className="w-4 h-4 mr-1" />詳細を見る
                        </Link>
                      </Button>
                      <Button variant="outline" size="small">
                        <MessageCircle className="w-4 h-4 mr-1" />メモを追加
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card><CardContent className="py-12 text-center"><p className="text-ink-muted">該当するドクターはいません</p></CardContent></Card>
      )}
    </div>
  );
}
