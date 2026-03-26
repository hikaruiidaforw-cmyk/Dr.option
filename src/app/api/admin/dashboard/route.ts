import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: 管理者ダッシュボード用の統計・アクティビティを取得
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (currentUser?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }

    // 今月の開始日
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalDoctors,
      totalCorporations,
      totalJobs,
      activeMatches,
      newDoctorsThisMonth,
      newCorporationsThisMonth,
      completedMatchesThisMonth,
      recentDoctors,
      recentCorporations,
      recentJobs,
      recentApplications,
      recentMatches,
    ] = await Promise.all([
      // 登録ドクター数
      prisma.doctorProfile.count(),
      // 登録法人数
      prisma.corporationProfile.count(),
      // 掲載求人数（PUBLISHED）
      prisma.jobPosting.count({
        where: { status: "PUBLISHED" },
      }),
      // 進行中マッチング数（NEGOTIATING, CONTRACT_DRAFTING, EMPLOYED, TRANSFER_READY）
      prisma.match.count({
        where: {
          status: { in: ["NEGOTIATING", "CONTRACT_DRAFTING", "EMPLOYED", "TRANSFER_READY"] },
        },
      }),
      // 今月の新規ドクター
      prisma.doctorProfile.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      // 今月の新規法人
      prisma.corporationProfile.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      // 今月のマッチング成立
      prisma.match.count({
        where: {
          status: "COMPLETED",
          updatedAt: { gte: startOfMonth },
        },
      }),
      // 最近登録のドクター（5件）
      prisma.doctorProfile.findMany({
        select: {
          id: true,
          displayName: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      // 最近登録の法人（5件）
      prisma.corporationProfile.findMany({
        select: {
          id: true,
          corporationName: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      // 最近公開の求人（5件）
      prisma.jobPosting.findMany({
        where: { status: "PUBLISHED" },
        select: {
          id: true,
          title: true,
          publishedAt: true,
          createdAt: true,
          corporation: {
            select: { corporationName: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      // 最近の応募（5件）
      prisma.application.findMany({
        select: {
          id: true,
          status: true,
          createdAt: true,
          doctorProfile: {
            select: { displayName: true },
          },
          jobPosting: {
            select: {
              title: true,
              corporation: {
                select: { corporationName: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      // 最近のマッチング成立（5件）
      prisma.match.findMany({
        where: { status: "COMPLETED" },
        select: {
          id: true,
          createdAt: true,
          application: {
            select: {
              doctorProfile: {
                select: { displayName: true },
              },
              jobPosting: {
                select: {
                  corporation: {
                    select: { corporationName: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
    ]);

    // アクティビティを時系列でまとめる
    type ActivityItem = {
      id: string;
      type: string;
      message: string;
      createdAt: string;
    };

    const activities: ActivityItem[] = [];

    for (const d of recentDoctors) {
      activities.push({
        id: `doctor-${d.id}`,
        type: "NEW_DOCTOR",
        message: `${d.displayName}が新規登録しました`,
        createdAt: d.createdAt.toISOString(),
      });
    }

    for (const c of recentCorporations) {
      activities.push({
        id: `corp-${c.id}`,
        type: "NEW_CORPORATION",
        message: `${c.corporationName}が新規登録しました`,
        createdAt: c.createdAt.toISOString(),
      });
    }

    for (const j of recentJobs) {
      activities.push({
        id: `job-${j.id}`,
        type: "NEW_JOB",
        message: `${j.corporation.corporationName}が「${j.title}」を公開しました`,
        createdAt: (j.publishedAt ?? j.createdAt).toISOString(),
      });
    }

    for (const a of recentApplications) {
      activities.push({
        id: `app-${a.id}`,
        type: "NEW_APPLICATION",
        message: `${a.doctorProfile.displayName}が${a.jobPosting.corporation.corporationName}の求人に応募しました`,
        createdAt: a.createdAt.toISOString(),
      });
    }

    for (const m of recentMatches) {
      activities.push({
        id: `match-${m.id}`,
        type: "MATCH_COMPLETED",
        message: `${m.application.doctorProfile.displayName}と${m.application.jobPosting.corporation.corporationName}のマッチングが成立しました`,
        createdAt: m.createdAt.toISOString(),
      });
    }

    // 時系列降順でソートし、上位10件
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const topActivities = activities.slice(0, 10);

    return NextResponse.json({
      stats: {
        totalDoctors,
        totalCorporations,
        totalJobs,
        activeMatches,
        newDoctorsThisMonth,
        newCorporationsThisMonth,
        completedMatchesThisMonth,
      },
      recentActivities: topActivities,
    });
  } catch (error) {
    console.error("Admin dashboard fetch error:", error);
    const message = error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      { error: `ダッシュボードデータの取得に失敗しました: ${message}` },
      { status: 500 }
    );
  }
}
