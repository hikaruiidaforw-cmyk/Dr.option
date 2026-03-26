import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const corp = await prisma.corporationProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!corp) {
      return NextResponse.json({ error: "法人プロフィールが見つかりません" }, { status: 404 });
    }

    const [jobCount, applicationCount, scoutCount, matchCount, recentApplications] =
      await Promise.all([
        prisma.jobPosting.count({ where: { corporationId: corp.id, status: "PUBLISHED" } }),
        prisma.application.count({
          where: { jobPosting: { corporationId: corp.id } },
        }),
        prisma.scout.count({ where: { corporationId: corp.id } }),
        prisma.match.count({
          where: {
            application: { jobPosting: { corporationId: corp.id } },
            status: { in: ["NEGOTIATING", "CONTRACT_DRAFTING", "EMPLOYED", "TRANSFER_READY"] },
          },
        }),
        prisma.application.findMany({
          where: { jobPosting: { corporationId: corp.id } },
          include: {
            doctorProfile: { select: { displayName: true } },
            jobPosting: { select: { title: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    return NextResponse.json({
      stats: { jobCount, applicationCount, scoutCount, matchCount },
      recentApplications: recentApplications.map((a) => ({
        id: a.id,
        status: a.status,
        createdAt: a.createdAt.toISOString(),
        doctorName: a.doctorProfile.displayName,
        jobTitle: a.jobPosting.title,
      })),
    });
  } catch (error) {
    console.error("Corporation dashboard error:", error);
    return NextResponse.json({ error: "ダッシュボードの取得に失敗しました" }, { status: 500 });
  }
}
