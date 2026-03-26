"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MessageCircle,
  Eye,
  ThumbsUp,
  CheckCircle,
  Clock,
  User,
  Award,
  Send,
  Flag,
  Share2,
  Bookmark,
} from "lucide-react";
import {
  getQuestionById,
  getAnswersByQuestionId,
  getRelatedQuestions,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  formatRelativeTime,
  type Answer,
} from "@/lib/qa";
import { cn } from "@/lib/utils";

export default function QuestionDetailPage() {
  const params = useParams();
  const questionId = params.id as string;

  const question = getQuestionById(questionId);
  const answers = getAnswersByQuestionId(questionId);
  const relatedQuestions = getRelatedQuestions(questionId);

  const [newAnswer, setNewAnswer] = React.useState("");
  const [helpfulAnswers, setHelpfulAnswers] = React.useState<Set<string>>(new Set());
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  if (!question) {
    return (
      <div className="space-y-6">
        <Link
          href="/doctor/qa"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-accent"
        >
          <ArrowLeft className="w-4 h-4" />
          Q&A一覧に戻る
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-ink-muted">質問が見つかりません</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleHelpful = (answerId: string) => {
    setHelpfulAnswers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(answerId)) {
        newSet.delete(answerId);
      } else {
        newSet.add(answerId);
      }
      return newSet;
    });
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    alert("回答が投稿されました（デモ）");
    setNewAnswer("");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URLをコピーしました");
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/doctor/qa"
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-accent"
      >
        <ArrowLeft className="w-4 h-4" />
        Q&A一覧に戻る
      </Link>

      {/* Question */}
      <Card>
        <CardContent className="pt-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {question.isResolved && (
                <Badge variant="default" className="bg-success text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  解決済み
                </Badge>
              )}
              <Badge className={cn(CATEGORY_COLORS[question.category])}>
                {CATEGORY_LABELS[question.category]}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="small"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "text-warning" : ""}
              >
                <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
              </Button>
              <Button variant="ghost" size="small" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-ink mb-4">{question.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-ink-muted mb-6">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {question.authorType === "doctor" ? "ドクター" : "法人"}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatRelativeTime(question.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {question.viewCount} 閲覧
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {question.helpfulCount} 役に立った
            </span>
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none mb-6">
            <p className="text-ink whitespace-pre-wrap">{question.content}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-surface-sunken rounded-full text-sm text-ink-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Answers */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-ink flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-accent" />
          回答 ({answers.length}件)
        </h2>

        {answers.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <MessageCircle className="w-10 h-10 text-ink-muted mx-auto mb-3" />
              <p className="text-ink-muted">まだ回答がありません</p>
              <p className="text-sm text-ink-muted mt-1">最初の回答者になりましょう</p>
            </CardContent>
          </Card>
        ) : (
          answers.map((answer) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              isHelpful={helpfulAnswers.has(answer.id)}
              onHelpful={() => handleHelpful(answer.id)}
            />
          ))
        )}
      </div>

      {/* Answer Form */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-bold text-ink mb-4">回答を投稿する</h3>
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              className="w-full h-32 px-4 py-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent mb-4"
              placeholder="あなたの知識や経験を共有してください。具体的なアドバイスは質問者の助けになります。"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-ink-muted">
                回答は匿名で投稿されます
              </p>
              <Button type="submit" disabled={!newAnswer.trim()}>
                <Send className="w-4 h-4 mr-2" />
                回答を投稿
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Related Questions */}
      {relatedQuestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-ink">関連する質問</h2>
          <div className="grid gap-4">
            {relatedQuestions.map((q) => (
              <Link key={q.id} href={`/doctor/qa/${q.id}`}>
                <Card className="hover:border-accent/30 transition-all">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-ink line-clamp-1 mb-1">
                          {q.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-ink-muted">
                          <span>{q.answerCount} 回答</span>
                          <span>{q.viewCount} 閲覧</span>
                          <span>{formatRelativeTime(q.createdAt)}</span>
                        </div>
                      </div>
                      {q.isResolved && (
                        <Badge variant="default" className="bg-success text-white flex-shrink-0">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          解決済み
                        </Badge>
                      )}
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

interface AnswerCardProps {
  answer: Answer;
  isHelpful: boolean;
  onHelpful: () => void;
}

function AnswerCard({ answer, isHelpful, onHelpful }: AnswerCardProps) {
  return (
    <Card
      className={cn(
        answer.isBestAnswer && "border-success/50 bg-success/5"
      )}
    >
      <CardContent className="pt-6">
        {/* Best Answer Badge */}
        {answer.isBestAnswer && (
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="default" className="bg-success text-white">
              <Award className="w-3 h-3 mr-1" />
              ベストアンサー
            </Badge>
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <User className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-medium text-ink">{answer.authorLabel}</p>
            <p className="text-xs text-ink-muted">
              {answer.authorType === "doctor" && "ドクター"}
              {answer.authorType === "corporation" && "法人"}
              {answer.authorType === "consultant" && "コンサルタント"}
              {" · "}
              {formatRelativeTime(answer.createdAt)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none mb-4">
          <p className="text-ink whitespace-pre-wrap">{answer.content}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant={isHelpful ? "primary" : "outline"}
            size="small"
            onClick={onHelpful}
            className={isHelpful ? "bg-accent" : ""}
          >
            <ThumbsUp className={cn("w-4 h-4 mr-1", isHelpful && "fill-current")} />
            役に立った ({answer.helpfulCount + (isHelpful ? 1 : 0)})
          </Button>
          <Button variant="ghost" size="small" className="text-ink-muted">
            <Flag className="w-4 h-4 mr-1" />
            報告
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
