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

    const doctors = await prisma.doctorProfile.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        displayName: true,
        medicalLicenseYear: true,
        currentPosition: true,
        desiredAreas: true,
        desiredSalaryMin: true,
        desiredSalaryMax: true,
        independenceTimeline: true,
        specialties: { select: { name: true } },
        boardCertifications: true,
        lastActiveAt: true,
      },
      orderBy: { lastActiveAt: "desc" },
    });

    const formatted = doctors.map((d) => ({
      id: d.id,
      displayName: d.displayName,
      medicalLicenseYear: d.medicalLicenseYear,
      currentPosition: d.currentPosition,
      specialties: d.specialties.map((s) => s.name),
      boardCertifications: d.boardCertifications,
      desiredAreas: d.desiredAreas,
      desiredSalaryMin: d.desiredSalaryMin,
      desiredSalaryMax: d.desiredSalaryMax,
      independenceTimeline: d.independenceTimeline,
      lastActiveAt: d.lastActiveAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Corporation doctors error:", error);
    return NextResponse.json({ error: "ドクター一覧の取得に失敗しました" }, { status: 500 });
  }
}
