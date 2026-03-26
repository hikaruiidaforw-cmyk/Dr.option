import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "CONSULTANT" && user?.role !== "ADMIN") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const corporations = await prisma.corporationProfile.findMany({
      select: {
        id: true,
        corporationName: true,
        representativeName: true,
        corporationType: true,
        address: true,
        establishedYear: true,
        employeeCount: true,
        contactEmail: true,
        createdAt: true,
        _count: {
          select: {
            jobPostings: true,
            sentScouts: true,
          },
        },
        jobPostings: {
          where: { status: "PUBLISHED" },
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // マッチング数を個別に取得
    const corpIds = corporations.map((c) => c.id);
    const matchCounts = await prisma.match.groupBy({
      by: ["applicationId"],
      where: {
        application: {
          jobPosting: {
            corporationId: { in: corpIds },
          },
        },
      },
    });

    // 法人ごとのマッチング数を集計
    const matchCountByApp = matchCounts.map((m) => m.applicationId);
    const applicationsWithCorp = matchCountByApp.length > 0
      ? await prisma.application.findMany({
          where: { id: { in: matchCountByApp } },
          select: { id: true, jobPosting: { select: { corporationId: true } } },
        })
      : [];

    const matchCountByCorp: Record<string, number> = {};
    for (const app of applicationsWithCorp) {
      const corpId = app.jobPosting.corporationId;
      matchCountByCorp[corpId] = (matchCountByCorp[corpId] || 0) + 1;
    }

    // 応募数を法人ごとに集計
    const applicationCounts = corpIds.length > 0
      ? await prisma.application.groupBy({
          by: ["jobPostingId"],
          where: {
            jobPosting: {
              corporationId: { in: corpIds },
            },
          },
          _count: true,
        })
      : [];

    const jobPostingCorpMap: Record<string, string> = {};
    if (applicationCounts.length > 0) {
      const jobPostings = await prisma.jobPosting.findMany({
        where: { id: { in: applicationCounts.map((a) => a.jobPostingId) } },
        select: { id: true, corporationId: true },
      });
      for (const jp of jobPostings) {
        jobPostingCorpMap[jp.id] = jp.corporationId;
      }
    }

    const appCountByCorp: Record<string, number> = {};
    for (const ac of applicationCounts) {
      const corpId = jobPostingCorpMap[ac.jobPostingId];
      if (corpId) {
        appCountByCorp[corpId] = (appCountByCorp[corpId] || 0) + ac._count;
      }
    }

    const formatted = corporations.map((c) => ({
      id: c.id,
      corporationName: c.corporationName,
      representativeName: c.representativeName,
      corporationType: c.corporationType,
      address: c.address,
      establishedYear: c.establishedYear,
      employeeCount: c.employeeCount,
      activeJobCount: c.jobPostings.length,
      totalJobCount: c._count.jobPostings,
      applicationCount: appCountByCorp[c.id] || 0,
      matchCount: matchCountByCorp[c.id] || 0,
      createdAt: c.createdAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Consultant corporations error:", error);
    const message = error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json({ error: `法人一覧の取得に失敗しました: ${message}` }, { status: 500 });
  }
}
