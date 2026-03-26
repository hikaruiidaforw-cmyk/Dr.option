"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Badge } from "@/components/ui/badge";
import { DEPARTMENTS, PREFECTURES, INDEPENDENCE_TIMELINE_OPTIONS } from "@/lib/constants";
import { Plus, Trash2, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

// キャリアイベントの型
interface CareerEvent {
  id: string;
  year: number;
  title: string;
  description: string;
}

// 専門科の型
interface Specialty {
  name: string;
  yearsOfExp: number | null;
}

const profileSchema = z.object({
  displayName: z.string().min(1, "表示名を入力してください"),
  realName: z.string().optional(),
  medicalLicenseYear: z.number().min(1950).max(new Date().getFullYear()),
  currentHospital: z.string().optional(),
  currentPosition: z.string().optional(),
  desiredSalaryMin: z.union([z.number(), z.nan()]).optional(),
  desiredSalaryMax: z.union([z.number(), z.nan()]).optional(),
  independenceTimeline: z.string().optional(),
  selfIntroduction: z.string().optional(),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function DoctorProfilePage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(true);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = React.useState<string[]>([]);
  const [specialties, setSpecialties] = React.useState<Specialty[]>([]);
  const [careerEvents, setCareerEvents] = React.useState<CareerEvent[]>([]); // 空配列で初期化（APIから読み込む）
  const [isAddingEvent, setIsAddingEvent] = React.useState(false);
  const [newEvent, setNewEvent] = React.useState<Partial<CareerEvent>>({
    year: new Date().getFullYear(),
    title: "",
    description: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      medicalLicenseYear: new Date().getFullYear() - 10,
    },
  });

  // 既存のプロフィールを読み込む
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/doctor/profile");
        const data = await response.json();

        if (data.profile) {
          reset({
            displayName: data.profile.displayName || "",
            realName: data.profile.realName || "",
            medicalLicenseYear: data.profile.medicalLicenseYear || new Date().getFullYear() - 10,
            currentHospital: data.profile.currentHospital || "",
            currentPosition: data.profile.currentPosition || "",
            desiredSalaryMin: data.profile.desiredSalaryMin || undefined,
            desiredSalaryMax: data.profile.desiredSalaryMax || undefined,
            independenceTimeline: data.profile.independenceTimeline || "",
            selfIntroduction: data.profile.selfIntroduction || "",
          });
          setSelectedDepartments(data.profile.desiredDepartments || []);
          setSelectedAreas(data.profile.desiredAreas || []);
          setSpecialties(data.profile.specialties?.map((s: { name: string; yearsOfExp: number | null }) => ({
            name: s.name,
            yearsOfExp: s.yearsOfExp,
          })) || []);
          // キャリアイベントを読み込む
          if (data.profile.careerEvents && data.profile.careerEvents.length > 0) {
            setCareerEvents(data.profile.careerEvents.map((e: { id: string; year: number; title: string; description: string | null }) => ({
              id: e.id,
              year: e.year,
              title: e.title,
              description: e.description || "",
            })));
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [reset]);

  // キャリアイベントを追加
  const addCareerEvent = () => {
    if (!newEvent.year || !newEvent.title) return;

    const event: CareerEvent = {
      id: Date.now().toString(),
      year: newEvent.year,
      title: newEvent.title,
      description: newEvent.description || "",
    };

    // 年順にソートして追加
    const updated = [...careerEvents, event].sort((a, b) => a.year - b.year);
    setCareerEvents(updated);
    setNewEvent({ year: new Date().getFullYear(), title: "", description: "" });
    setIsAddingEvent(false);
  };

  // キャリアイベントを削除
  const removeCareerEvent = (id: string) => {
    setCareerEvents(careerEvents.filter((e) => e.id !== id));
  };

  const onSubmit = async (data: ProfileInput) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/doctor/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          desiredSalaryMin: data.desiredSalaryMin && !isNaN(data.desiredSalaryMin) ? data.desiredSalaryMin : null,
          desiredSalaryMax: data.desiredSalaryMax && !isNaN(data.desiredSalaryMax) ? data.desiredSalaryMax : null,
          desiredDepartments: selectedDepartments,
          desiredAreas: selectedAreas,
          specialties: specialties.length > 0 ? specialties : selectedDepartments.map(name => ({ name, yearsOfExp: null })),
          careerEvents: careerEvents.map(e => ({
            year: e.year,
            title: e.title,
            description: e.description || null,
          })),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "プロフィールを保存しました" });
        // 保存後にキャリアイベントを更新（IDが付与される）
        if (result.profile?.careerEvents) {
          setCareerEvents(result.profile.careerEvents.map((e: { id: string; year: number; title: string; description: string | null }) => ({
            id: e.id,
            year: e.year,
            title: e.title,
            description: e.description || "",
          })));
        }
      } else {
        setMessage({ type: "error", text: result.error || "保存に失敗しました" });
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      setMessage({ type: "error", text: "保存中にエラーが発生しました" });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDepartment = (dept: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="プロフィール"
        description="あなたのプロフィール情報を管理します"
      />

      {/* Success/Error Message */}
      {message && (
        <div
          className={`p-4 rounded border flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>
              医療法人に公開される基本的な情報です
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="表示名"
                htmlFor="displayName"
                error={errors.displayName?.message}
                description="匿名で表示される名前です（例: Dr.A）"
                required
              >
                <Input
                  id="displayName"
                  placeholder="Dr.A"
                  error={errors.displayName?.message}
                  {...register("displayName")}
                />
              </FormField>

              <FormField
                label="実名"
                htmlFor="realName"
                description="コンサルタントのみに公開されます"
              >
                <Input
                  id="realName"
                  placeholder="山田 太郎"
                  {...register("realName")}
                />
              </FormField>
            </div>

            <FormField
              label="医師免許取得年"
              htmlFor="medicalLicenseYear"
              error={errors.medicalLicenseYear?.message}
              required
            >
              <Input
                id="medicalLicenseYear"
                type="number"
                min={1950}
                max={new Date().getFullYear()}
                error={errors.medicalLicenseYear?.message}
                {...register("medicalLicenseYear", { valueAsNumber: true })}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="現在の勤務先"
                htmlFor="currentHospital"
              >
                <Input
                  id="currentHospital"
                  placeholder="○○大学病院"
                  {...register("currentHospital")}
                />
              </FormField>

              <FormField
                label="現職"
                htmlFor="currentPosition"
              >
                <Input
                  id="currentPosition"
                  placeholder="常勤医師"
                  {...register("currentPosition")}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Specialties */}
        <Card>
          <CardHeader>
            <CardTitle>専門診療科</CardTitle>
            <CardDescription>
              経験のある診療科を選択してください（複数選択可）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map((dept) => (
                <Badge
                  key={dept}
                  variant={selectedDepartments.includes(dept) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleDepartment(dept)}
                >
                  {dept}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Career Timeline */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  キャリアタイムライン
                </CardTitle>
                <CardDescription>
                  これまでのキャリアを時系列で登録してください
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={() => setIsAddingEvent(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                追加
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Timeline */}
            <div className="space-y-4">
              {careerEvents.length === 0 ? (
                <p className="text-sm text-ink-muted text-center py-8">
                  キャリアイベントを追加してください
                </p>
              ) : (
                careerEvents.map((event, index) => (
                  <div key={event.id} className="flex gap-4 group">
                    {/* Timeline Dot & Line */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-accent flex-shrink-0" />
                      {index < careerEvents.length - 1 && (
                        <div className="w-0.5 h-full bg-border flex-1 mt-1" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-accent">
                              {event.year}年
                            </span>
                          </div>
                          <p className="font-medium text-ink">{event.title}</p>
                          {event.description && (
                            <p className="text-sm text-ink-muted mt-1">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCareerEvent(event.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-error/10 rounded transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-error" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Add Event Form */}
              {isAddingEvent && (
                <div className="border border-accent/30 rounded-lg p-4 bg-accent/5">
                  <p className="text-sm font-medium text-ink mb-3">新しいキャリアイベント</p>
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs text-ink-muted block mb-1">年</label>
                        <Input
                          type="number"
                          min={1950}
                          max={new Date().getFullYear() + 10}
                          value={newEvent.year}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, year: parseInt(e.target.value) || 2024 })
                          }
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs text-ink-muted block mb-1">タイトル</label>
                        <Input
                          placeholder="例: 専門医取得"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-ink-muted block mb-1">詳細（任意）</label>
                      <Input
                        placeholder="例: ○○大学病院にて循環器内科専門医を取得"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="small"
                        onClick={() => {
                          setIsAddingEvent(false);
                          setNewEvent({ year: new Date().getFullYear(), title: "", description: "" });
                        }}
                      >
                        キャンセル
                      </Button>
                      <Button
                        type="button"
                        size="small"
                        onClick={addCareerEvent}
                        disabled={!newEvent.title}
                      >
                        追加
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Desired Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>希望条件</CardTitle>
            <CardDescription>
              希望する勤務条件を設定してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-small font-medium mb-2 block">
                希望エリア
              </label>
              <div className="flex flex-wrap gap-2">
                {PREFECTURES.map((pref) => (
                  <Badge
                    key={pref}
                    variant={selectedAreas.includes(pref) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleArea(pref)}
                  >
                    {pref}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="希望年収（下限）"
                htmlFor="desiredSalaryMin"
                description="万円"
              >
                <Input
                  id="desiredSalaryMin"
                  type="number"
                  placeholder="1500"
                  {...register("desiredSalaryMin", { valueAsNumber: true })}
                />
              </FormField>

              <FormField
                label="希望年収（上限）"
                htmlFor="desiredSalaryMax"
                description="万円"
              >
                <Input
                  id="desiredSalaryMax"
                  type="number"
                  placeholder="2500"
                  {...register("desiredSalaryMax", { valueAsNumber: true })}
                />
              </FormField>
            </div>

            <FormField
              label="独立希望時期"
              htmlFor="independenceTimeline"
            >
              <select
                id="independenceTimeline"
                className="w-full px-3 py-2 border border-border rounded bg-white text-ink focus:outline-none focus:ring-2 focus:ring-accent/20"
                {...register("independenceTimeline")}
              >
                <option value="">選択してください</option>
                {INDEPENDENCE_TIMELINE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FormField>
          </CardContent>
        </Card>

        {/* Self Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>自己紹介・ビジョン</CardTitle>
            <CardDescription>
              あなたのキャリアビジョンや独立への思いを記載してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="selfIntroduction"
              rows={6}
              placeholder="これまでの経験や、将来の開業・承継に対する考えをお聞かせください..."
              {...register("selfIntroduction")}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                保存中...
              </>
            ) : (
              "保存する"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
