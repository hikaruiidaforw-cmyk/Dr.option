"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Eye,
  Heart,
  Calendar,
  MapPin,
  Briefcase,
  Clock,
  GraduationCap,
  Stethoscope,
  Quote,
  ChevronRight,
  Share2,
  Bookmark,
  MessageCircle,
  Lightbulb,
  TrendingUp,
  User,
  Building2,
} from "lucide-react";
import {
  getInterviewById,
  getRelatedInterviews,
  formatPublishedDate,
} from "@/lib/interviews";
import { cn } from "@/lib/utils";

export default function InterviewDetailPage() {
  const params = useParams();
  const interviewId = params.id as string;

  const interview = getInterviewById(interviewId);
  const relatedInterviews = getRelatedInterviews(interviewId);

  const [isLiked, setIsLiked] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  if (!interview) {
    return (
      <div className="space-y-6">
        <Link
          href="/doctor/interviews"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-accent"
        >
          <ArrowLeft className="w-4 h-4" />
          インタビュー一覧に戻る
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-ink-muted">インタビューが見つかりません</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URLをコピーしました");
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/doctor/interviews"
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-accent"
      >
        <ArrowLeft className="w-4 h-4" />
        インタビュー一覧に戻る
      </Link>

      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto md:mx-0">
                <span className="text-4xl font-bold text-accent">
                  {interview.thumbnailInitial}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
                <Badge variant="outline" className="text-accent border-accent">
                  {interview.specialty}
                </Badge>
                {interview.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-ink mb-4">{interview.title}</h1>

              {/* Doctor Info */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-ink-muted">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {interview.doctorName}（{interview.age}歳）
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {interview.clinicName}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {interview.clinicArea}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  承継{interview.yearsAfterTransfer}年目
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-center md:justify-start">
              <Button
                variant={isLiked ? "primary" : "outline"}
                size="small"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={cn("w-4 h-4 mr-1", isLiked && "fill-current")} />
                {interview.likeCount + (isLiked ? 1 : 0)}
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current text-warning")} />
              </Button>
              <Button variant="ghost" size="small" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-center md:justify-start gap-4 mt-4 pt-4 border-t border-border text-xs text-ink-muted">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatPublishedDate(interview.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {interview.viewCount.toLocaleString()} 閲覧
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Key Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {interview.numbers.map((num, index) => (
          <Card key={index}>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-2xl font-bold text-accent mb-1">{num.value}</p>
              <p className="text-sm font-medium text-ink">{num.label}</p>
              <p className="text-xs text-ink-muted">{num.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-ink leading-relaxed">{interview.summary}</p>
        </CardContent>
      </Card>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-accent" />
            プロフィール
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-ink-muted mb-1">出身大学</p>
              <p className="text-ink font-medium">{interview.profile.medicalSchool}（{interview.profile.graduationYear}年卒）</p>
            </div>
            <div>
              <p className="text-sm text-ink-muted mb-1">専門</p>
              <p className="text-ink font-medium">{interview.profile.specializations.join("、")}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-ink-muted mb-1">キャリア</p>
              <p className="text-ink">{interview.profile.careerPath}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-ink-muted mb-1">承継の動機</p>
              <p className="text-ink">{interview.profile.motivation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            キャリアタイムライン
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interview.timeline.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  {index < interview.timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-border flex-1 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-accent">{event.year}年</span>
                    <span className="text-xs text-ink-muted">（{event.age}歳）</span>
                  </div>
                  <p className="font-medium text-ink">{event.event}</p>
                  <p className="text-sm text-ink-muted">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Q&A */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-accent" />
            インタビュー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {interview.qanda.map((qa, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">Q</span>
                  </div>
                  <p className="font-medium text-ink pt-1">{qa.question}</p>
                </div>
                <div className="flex items-start gap-3 ml-11">
                  <Quote className="w-5 h-5 text-ink-muted flex-shrink-0 mt-1" />
                  <p className="text-ink-muted leading-relaxed">{qa.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advice */}
      <Card className="bg-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-warning" />
            {interview.doctorName}からのアドバイス
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {interview.advice.map((advice, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-warning text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-ink">{advice}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-ink mb-4">
              {interview.doctorName}のように、あなたも承継という選択肢を検討してみませんか？
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/doctor/jobs">
                <Button>
                  <Stethoscope className="w-4 h-4 mr-2" />
                  承継案件を探す
                </Button>
              </Link>
              <Link href="/doctor/simulator">
                <Button variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  シミュレーションする
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Interviews */}
      {relatedInterviews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-ink">関連するインタビュー</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedInterviews.map((related) => (
              <Link key={related.id} href={`/doctor/interviews/${related.id}`}>
                <Card className="hover:border-accent/30 transition-all h-full">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-accent">
                          {related.thumbnailInitial}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {related.specialty}
                          </Badge>
                        </div>
                        <p className="font-medium text-ink text-sm line-clamp-2 mb-1">
                          {related.title}
                        </p>
                        <p className="text-xs text-ink-muted">
                          {related.doctorName}・{related.clinicArea}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-ink-muted flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
