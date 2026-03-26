import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const consultant = await prisma.consultantProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!consultant) {
      return NextResponse.json({ error: "コンサルタントプロフィールが見つかりません" }, { status: 404 });
    }

    const [totalMatches, activeMatches, pendingContracts, completedThisMonth, recentMatches] =
      await Promise.all([
        prisma.match.count({ where: { consultantId: consultant.id } }),
        prisma.match.count({
          where: {
            consultantId: consultant.id,
            status: { in: ["NEGOTIATING", "CONTRACT_DRAFTING", "EMPLOYED", "TRANSFER_READY"] },
          },
        }),
        prisma.match.count({
          where: { consultantId: consultant.id, status: "CONTRACT_DRAFTING" },
        }),
        prisma.match.count({
          where: {
            consultantId: consultant.id,
            status: "COMPLETED",
            updatedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
          },
        }),
        prisma.match.findMany({
          where: { consultantId: consultant.id },
          select: {
            id: true,
            status: true,
            updatedAt: true,
            application: {
              select: {
                doctorProfile: { select: { displayName: true } },
                jobPosting: {
                  select: {
                    title: true,
                    corporation: { select: { corporationName: true } },
                  },
                },
              },
            },
          },
          orderBy: { updatedAt: "desc" },
          take: 5,
        }),
      ]);

    return NextResponse.json({
      stats: { totalMatches, activeMatches, pendingContracts, completedThisMonth },
      recentMatches: recentMatches.map((m) => ({
        id: m.id,
        status: m.status,
        updatedAt: m.updatedAt.toISOString(),
        doctorName: m.application.doctorProfile.displayName,
        corporationName: m.application.jobPosting.corporation.corporationName,
        jobTitle: m.application.jobPosting.title,
      })),
    });
  } catch (error) {
    console.error("Consultant dashboard error:", error);
    const message = error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json({ error: `ダッシュボードの取得に失敗しました: ${message}` }, { status: 500 });
  }
}
