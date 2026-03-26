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

    const scouts = await prisma.scout.findMany({
      where: { corporationId: corp.id },
      include: {
        doctorProfile: {
          select: {
            id: true,
            displayName: true,
            specialties: { select: { name: true } },
            desiredAreas: true,
          },
        },
        jobPosting: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = scouts.map((s) => ({
      id: s.id,
      status: s.status,
      message: s.message,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      doctor: {
        id: s.doctorProfile.id,
        displayName: s.doctorProfile.displayName,
        specialties: s.doctorProfile.specialties.map((sp) => sp.name),
        desiredAreas: s.doctorProfile.desiredAreas,
      },
      jobPosting: {
        id: s.jobPosting.id,
        title: s.jobPosting.title,
      },
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Corporation scouts error:", error);
    return NextResponse.json({ error: "スカウト一覧の取得に失敗しました" }, { status: 500 });
  }
}
