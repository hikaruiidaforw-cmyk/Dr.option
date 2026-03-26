"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, Send, Banknote, Loader2 } from "lucide-react";
import { DEPARTMENTS, PREFECTURES } from "@/lib/constants";
import { formatNumber, formatRelativeTime } from "@/lib/utils";

interface Doctor {
  id: string;
  displayName: string;
  medicalLicenseYear: number;
  currentPosition: string | null;
  specialties: string[];
  boardCertifications: string[];
  desiredAreas: string[];
  desiredSalaryMin: number | null;
  desiredSalaryMax: number | null;
  independenceTimeline: string | null;
  lastActiveAt: string;
}

export default function CorporationDoctorsPage() {
  const [doctors, setDoctors] = React.useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState("");
  const [selectedArea, setSelectedArea] = React.useState("");

  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/corporation/doctors");
        const data = await response.json();
        if (response.ok) {
          setDoctors(data);
        } else {
          setError(data.error || "ドクター情報の取得に失敗しました");
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("ドクター情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Sort by lastActiveAt (most recent first) and apply filters
  const filteredDoctors = React.useMemo(() => {
    return doctors
      .filter((doctor) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          !query ||
          doctor.displayName.toLowerCase().includes(query) ||
          doctor.specialties.some((s) => s.toLowerCase().includes(query)) ||
          doctor.desiredAreas.some((a) => a.toLowerCase().includes(query));

        const matchesDepartment =
          !selectedDepartment ||
          doctor.specialties.includes(selectedDepartment);

        const matchesArea =
          !selectedArea ||
          doctor.desiredAreas.some((a) => a.includes(selectedArea));

        return matchesSearch && matchesDepartment && matchesArea;
      })
      .sort(
        (a, b) =>
          new Date(b.lastActiveAt).getTime() -
          new Date(a.lastActiveAt).getTime()
      );
  }, [doctors, searchQuery, selectedDepartment, selectedArea]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="ドクター検索"
          description="登録ドクターを検索してスカウトを送信できます"
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="ドクター検索"
          description="登録ドクターを検索してスカウトを送信できます"
        />
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-ink-muted">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="ドクター検索"
        description="登録ドクターを検索してスカウトを送信できます"
      />

      {/* Search Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <Input
                  placeholder="キーワードで検索..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="w-full h-[44px]"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">診療科を選択</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full h-[44px]"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="">希望エリアを選択</option>
                {PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>
                    {pref}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-small text-ink-muted">
          {filteredDoctors.length}名のドクターが見つかりました
        </p>
      </div>

      {/* Doctor Listings */}
      <div className="space-y-4">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:border-accent/30 transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <Link
                      href={`/corporation/doctors/${doctor.id}`}
                      className="flex items-center gap-3 mb-3 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center flex-shrink-0">
                        <span className="text-h3 text-accent">
                          {doctor.displayName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-h3 group-hover:text-accent transition-colors">
                          {doctor.displayName}
                        </p>
                        <p className="text-small text-ink-muted">
                          医師歴{" "}
                          {new Date().getFullYear() - doctor.medicalLicenseYear}年
                          {doctor.currentPosition && (
                            <span className="ml-2">
                              ・{doctor.currentPosition}
                            </span>
                          )}
                        </p>
                      </div>
                    </Link>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {doctor.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                      {doctor.boardCertifications.map((cert) => (
                        <Badge key={cert} variant="secondary">
                          {cert}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-small text-ink-muted mb-3">
                      {doctor.desiredAreas.length > 0 && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {doctor.desiredAreas.join("、")}
                        </span>
                      )}
                      {doctor.independenceTimeline && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          独立希望: {doctor.independenceTimeline}
                        </span>
                      )}
                      {(doctor.desiredSalaryMin || doctor.desiredSalaryMax) && (
                        <span className="flex items-center gap-1">
                          <Banknote className="w-4 h-4" />
                          {doctor.desiredSalaryMin &&
                            formatNumber(doctor.desiredSalaryMin)}
                          {doctor.desiredSalaryMin &&
                            doctor.desiredSalaryMax &&
                            "〜"}
                          {doctor.desiredSalaryMax &&
                            formatNumber(doctor.desiredSalaryMax)}
                          万円
                        </span>
                      )}
                    </div>

                    <p className="text-caption text-ink-muted">
                      最終アクティブ: {formatRelativeTime(doctor.lastActiveAt)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="small" asChild>
                      <Link href={`/corporation/doctors/${doctor.id}`}>
                        <Send className="w-4 h-4 mr-1" />
                        スカウトを送る
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-ink-muted">条件に一致するドクターが見つかりません</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
