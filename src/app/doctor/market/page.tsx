"use client";

import * as React from "react";
import { PageHeader } from "@/components/layouts/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Users,
  Building2,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  PieChart,
  ArrowRight,
  Info,
  Star,
  Activity,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react";
import {
  MOCK_MARKET_DATA,
  REGION_SUMMARIES,
  getCompetitionColor,
  getDemandColor,
  getTrendIcon,
  getTrendColor,
  formatNumber,
  formatCurrency,
  type AreaMarketData,
} from "@/lib/market-data";
import { cn } from "@/lib/utils";

export default function MarketDataPage() {
  const [selectedRegion, setSelectedRegion] = React.useState<string>("");
  const [selectedPrefecture, setSelectedPrefecture] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"demand" | "competition" | "revenue">("demand");
  const [expandedArea, setExpandedArea] = React.useState<string | null>(null);

  // Get unique prefectures
  const prefectures = React.useMemo(() => {
    const prefs = [...new Set(MOCK_MARKET_DATA.map((d) => d.prefecture))];
    if (selectedRegion) {
      const regionSummary = REGION_SUMMARIES.find((r) => r.region === selectedRegion);
      return prefs.filter((p) => regionSummary?.prefectures.includes(p));
    }
    return prefs;
  }, [selectedRegion]);

  // Filter and sort data
  const filteredData = React.useMemo(() => {
    let data = [...MOCK_MARKET_DATA];

    if (selectedRegion) {
      data = data.filter((d) => d.region === selectedRegion);
    }

    if (selectedPrefecture) {
      data = data.filter((d) => d.prefecture === selectedPrefecture);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (d) =>
          d.city.toLowerCase().includes(query) ||
          d.prefecture.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "demand":
        data.sort((a, b) => {
          const demandOrder = { high: 3, medium: 2, low: 1 };
          return demandOrder[b.demandLevel] - demandOrder[a.demandLevel];
        });
        break;
      case "competition":
        data.sort((a, b) => {
          const compOrder = { low: 3, medium: 2, high: 1 };
          return compOrder[b.competitionLevel] - compOrder[a.competitionLevel];
        });
        break;
      case "revenue":
        data.sort((a, b) => b.averageClinicRevenue - a.averageClinicRevenue);
        break;
    }

    return data;
  }, [selectedRegion, selectedPrefecture, searchQuery, sortBy]);

  // Stats
  const avgRevenue = Math.round(
    filteredData.reduce((sum, d) => sum + d.averageClinicRevenue, 0) / filteredData.length
  );
  const highDemandCount = filteredData.filter((d) => d.demandLevel === "high").length;
  const lowCompetitionCount = filteredData.filter((d) => d.competitionLevel === "low").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="エリア市場データ"
        description="各エリアの医療需要、競争状況、収益性を分析できます"
      />

      {/* Region Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {REGION_SUMMARIES.map((region) => (
          <button
            key={region.region}
            onClick={() => {
              setSelectedRegion(selectedRegion === region.region ? "" : region.region);
              setSelectedPrefecture("");
            }}
            className={cn(
              "p-4 rounded-xl border text-left transition-all",
              selectedRegion === region.region
                ? "border-accent bg-accent/5"
                : "border-border bg-white hover:border-accent/30"
            )}
          >
            <p className="font-bold text-ink mb-1">{region.region}</p>
            <p className="text-xs text-ink-muted">
              人口 {formatNumber(region.totalPopulation)}人
            </p>
            <p className="text-xs text-ink-muted">
              平均売上 {formatCurrency(region.averageClinicRevenue)}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {region.hotAreas.slice(0, 2).map((area) => (
                <span
                  key={area}
                  className="text-xs px-1.5 py-0.5 bg-accent/10 text-accent rounded"
                >
                  {area}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">{highDemandCount}</p>
                <p className="text-xs text-ink-muted">需要が高いエリア</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">{lowCompetitionCount}</p>
                <p className="text-xs text-ink-muted">競争が穏やかなエリア</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">{formatCurrency(avgRevenue)}</p>
                <p className="text-xs text-ink-muted">平均年間売上</p>
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
                placeholder="エリア名で検索..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="h-[44px] px-3 border border-border rounded-lg text-sm"
                value={selectedPrefecture}
                onChange={(e) => setSelectedPrefecture(e.target.value)}
              >
                <option value="">都道府県を選択</option>
                {prefectures.map((pref) => (
                  <option key={pref} value={pref}>
                    {pref}
                  </option>
                ))}
              </select>
              <select
                className="h-[44px] px-3 border border-border rounded-lg text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <option value="demand">需要が高い順</option>
                <option value="competition">競争が穏やか順</option>
                <option value="revenue">売上が高い順</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          {filteredData.length}件のエリアデータ
        </p>
        {selectedRegion && (
          <Button
            variant="ghost"
            size="small"
            onClick={() => {
              setSelectedRegion("");
              setSelectedPrefecture("");
            }}
          >
            フィルターをクリア
          </Button>
        )}
      </div>

      {/* Area Cards */}
      <div className="space-y-4">
        {filteredData.map((area) => (
          <AreaCard
            key={area.id}
            area={area}
            isExpanded={expandedArea === area.id}
            onToggle={() => setExpandedArea(expandedArea === area.id ? null : area.id)}
          />
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="w-12 h-12 text-ink-muted mx-auto mb-4" />
            <p className="text-ink-muted">該当するエリアが見つかりません</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface AreaCardProps {
  area: AreaMarketData;
  isExpanded: boolean;
  onToggle: () => void;
}

function AreaCard({ area, isExpanded, onToggle }: AreaCardProps) {
  const TrendIcon = area.populationTrend === "increasing" ? TrendingUp :
    area.populationTrend === "decreasing" ? TrendingDown : Minus;

  return (
    <Card className="hover:border-accent/30 transition-all">
      <CardContent className="pt-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-ink">
                  {area.prefecture} {area.city}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {area.region}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-ink-muted">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {formatNumber(area.population)}人
                </span>
                <span className={cn("flex items-center gap-1", getTrendColor(area.populationTrend))}>
                  <TrendIcon className="w-4 h-4" />
                  {area.populationGrowthRate > 0 ? "+" : ""}{area.populationGrowthRate}%
                </span>
                <span className="flex items-center gap-1">
                  高齢化率 {area.elderlyRate}%
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="p-2 hover:bg-surface-sunken rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-ink-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-ink-muted" />
            )}
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="p-3 bg-surface-sunken rounded-lg">
            <p className="text-xs text-ink-muted mb-1">需要</p>
            <Badge className={cn("text-sm", getDemandColor(area.demandLevel))}>
              {area.demandLevel === "high" && "高い"}
              {area.demandLevel === "medium" && "普通"}
              {area.demandLevel === "low" && "低い"}
            </Badge>
          </div>
          <div className="p-3 bg-surface-sunken rounded-lg">
            <p className="text-xs text-ink-muted mb-1">競争</p>
            <Badge className={cn("text-sm", getCompetitionColor(area.competitionLevel))}>
              {area.competitionLevel === "high" && "激しい"}
              {area.competitionLevel === "medium" && "普通"}
              {area.competitionLevel === "low" && "穏やか"}
            </Badge>
          </div>
          <div className="p-3 bg-surface-sunken rounded-lg">
            <p className="text-xs text-ink-muted mb-1">平均売上</p>
            <p className="font-bold text-ink">{formatCurrency(area.averageClinicRevenue)}</p>
          </div>
          <div className="p-3 bg-surface-sunken rounded-lg">
            <p className="text-xs text-ink-muted mb-1">平均承継価格</p>
            <p className="font-bold text-ink">{formatCurrency(area.averageTransferPrice)}</p>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="pt-4 border-t border-border space-y-6">
            {/* Medical Facilities */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border border-border rounded-lg">
                <Building2 className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-xl font-bold text-ink">{area.clinicCount}</p>
                <p className="text-xs text-ink-muted">診療所数</p>
              </div>
              <div className="text-center p-3 border border-border rounded-lg">
                <Stethoscope className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-xl font-bold text-ink">{area.doctorCount}</p>
                <p className="text-xs text-ink-muted">医師数</p>
              </div>
              <div className="text-center p-3 border border-border rounded-lg">
                <PieChart className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-xl font-bold text-ink">{area.clinicsPerCapita}</p>
                <p className="text-xs text-ink-muted">1万人あたり診療所</p>
              </div>
              <div className="text-center p-3 border border-border rounded-lg">
                <BarChart3 className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-xl font-bold text-ink">{area.doctorsPerCapita}</p>
                <p className="text-xs text-ink-muted">1万人あたり医師</p>
              </div>
            </div>

            {/* Department Analysis */}
            <div>
              <h4 className="font-medium text-ink mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                診療科別分析
              </h4>
              <div className="space-y-3">
                {area.majorDepartments.map((dept) => (
                  <div key={dept.name} className="flex items-center gap-4">
                    <div className="w-24 flex-shrink-0">
                      <p className="text-sm font-medium text-ink">{dept.name}</p>
                      <p className="text-xs text-ink-muted">{dept.clinicCount}施設</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-muted w-12">需要</span>
                        <div className="flex-1 h-2 bg-surface-sunken rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${dept.demandScore}%` }}
                          />
                        </div>
                        <span className="text-xs text-ink w-8">{dept.demandScore}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-muted w-12">競争</span>
                        <div className="flex-1 h-2 bg-surface-sunken rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${dept.competitionScore}%` }}
                          />
                        </div>
                        <span className="text-xs text-ink w-8">{dept.competitionScore}</span>
                      </div>
                    </div>
                    <div className={cn("text-sm", getTrendColor(dept.growthTrend))}>
                      {getTrendIcon(dept.growthTrend)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div>
              <h4 className="font-medium text-ink mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-warning" />
                市場インサイト
              </h4>
              <div className="space-y-2">
                {area.insights.map((insight, index) => (
                  <p key={index} className="text-sm text-ink-muted flex items-start gap-2">
                    <span className="text-accent">•</span>
                    {insight}
                  </p>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button size="small">
                <Search className="w-4 h-4 mr-2" />
                このエリアの求人を見る
              </Button>
              <Button variant="outline" size="small">
                <Star className="w-4 h-4 mr-2" />
                お気に入りに追加
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
