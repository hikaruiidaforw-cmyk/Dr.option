"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MessageCircle,
  Eye,
  ThumbsUp,
  CheckCircle,
  Clock,
  Filter,
  Plus,
  TrendingUp,
  HelpCircle,
} from "lucide-react";
import {
  MOCK_QUESTIONS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  formatRelativeTime,
  type Question,
  type QuestionCategory,
} from "@/lib/qa";
import { cn } from "@/lib/utils";

export default function QAPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [sortBy, setSortBy] = React.useState<"recent" | "popular" | "unanswered">("recent");
  const [showNewQuestionModal, setShowNewQuestionModal] = React.useState(false);

  // Filter and sort questions
  const filteredQuestions = React.useMemo(() => {
    let questions = [...MOCK_QUESTIONS];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      questions = questions.filter(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.content.toLowerCase().includes(query) ||
          q.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory) {
      questions = questions.filter((q) => q.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "popular":
        questions.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      case "unanswered":
        questions = questions.filter((q) => !q.isResolved);
        questions.sort((a, b) => a.answerCount - b.answerCount);
        break;
      case "recent":
      default:
        questions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return questions;
  }, [searchQuery, selectedCategory, sortBy]);

  // Stats
  const totalQuestions = MOCK_QUESTIONS.length;
  const resolvedQuestions = MOCK_QUESTIONS.filter((q) => q.isResolved).length;
  const totalAnswers = MOCK_QUESTIONS.reduce((sum, q) => sum + q.answerCount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="匿名Q&A"
        description="承継・開業に関する疑問を匿名で質問・回答できます"
      />

      {/* Stats Banner */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">{totalQuestions}</p>
                <p className="text-xs text-ink-muted">質問数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">{resolvedQuestions}</p>
                <p className="text-xs text-ink-muted">解決済み</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">{totalAnswers}</p>
                <p className="text-xs text-ink-muted">回答数</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <Input
                placeholder="キーワードで検索..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="h-[44px] px-3 border border-border rounded-lg text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">すべてのカテゴリ</option>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                className="h-[44px] px-3 border border-border rounded-lg text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="recent">新着順</option>
                <option value="popular">人気順</option>
                <option value="unanswered">未解決</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Question Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowNewQuestionModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          質問を投稿する
        </Button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <HelpCircle className="w-12 h-12 text-ink-muted mx-auto mb-4" />
              <p className="text-ink-muted">該当する質問が見つかりません</p>
            </CardContent>
          </Card>
        ) : (
          filteredQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        )}
      </div>

      {/* New Question Modal */}
      {showNewQuestionModal && (
        <NewQuestionModal onClose={() => setShowNewQuestionModal(false)} />
      )}
    </div>
  );
}

function QuestionCard({ question }: { question: Question }) {
  return (
    <Link href={`/doctor/qa/${question.id}`}>
      <Card className="hover:border-accent/30 transition-all cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            {/* Stats Column */}
            <div className="hidden md:flex flex-col items-center gap-2 w-16 flex-shrink-0">
              <div className="text-center">
                <p className="text-lg font-bold text-ink">{question.answerCount}</p>
                <p className="text-xs text-ink-muted">回答</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-ink-muted">{question.viewCount}</p>
                <p className="text-xs text-ink-muted">閲覧</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                {question.isResolved && (
                  <Badge variant="default" className="bg-success text-white flex-shrink-0">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    解決済み
                  </Badge>
                )}
                <Badge className={cn("flex-shrink-0", CATEGORY_COLORS[question.category])}>
                  {CATEGORY_LABELS[question.category]}
                </Badge>
              </div>

              <h3 className="text-lg font-medium text-ink mb-2 line-clamp-2 group-hover:text-accent">
                {question.title}
              </h3>

              <p className="text-sm text-ink-muted line-clamp-2 mb-3">
                {question.content}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatRelativeTime(question.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {question.helpfulCount} 役に立った
                </span>
                <span className="flex items-center gap-1 md:hidden">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {question.answerCount} 回答
                </span>
                <span className="flex items-center gap-1 md:hidden">
                  <Eye className="w-3.5 h-3.5" />
                  {question.viewCount}
                </span>
                <div className="flex gap-1">
                  {question.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-surface-sunken rounded text-ink-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function NewQuestionModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState<QuestionCategory>("other");
  const [tags, setTags] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would call API
    alert("質問が投稿されました（デモ）");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold text-ink mb-6">新しい質問を投稿</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink block mb-1">
                カテゴリ <span className="text-error">*</span>
              </label>
              <select
                className="w-full h-[44px] px-3 border border-border rounded-lg"
                value={category}
                onChange={(e) => setCategory(e.target.value as QuestionCategory)}
                required
              >
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-ink block mb-1">
                タイトル <span className="text-error">*</span>
              </label>
              <Input
                placeholder="質問のタイトルを入力"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <p className="text-xs text-ink-muted mt-1">
                具体的で分かりやすいタイトルをつけましょう
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-ink block mb-1">
                質問内容 <span className="text-error">*</span>
              </label>
              <textarea
                className="w-full h-40 px-3 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                placeholder="質問の詳細を記入してください。背景情報や具体的な状況を書くと、より適切な回答が得られます。"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-ink block mb-1">
                タグ（任意）
              </label>
              <Input
                placeholder="タグをカンマ区切りで入力（例: 融資, 銀行, 審査）"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className="bg-surface-sunken rounded-lg p-4">
              <p className="text-sm text-ink-muted">
                <strong className="text-ink">匿名投稿について:</strong><br />
                あなたの質問は匿名で投稿されます。個人を特定できる情報（氏名、勤務先名など）は含めないようご注意ください。
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                質問を投稿する
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                キャンセル
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
