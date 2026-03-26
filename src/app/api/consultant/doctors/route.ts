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

    const doctors = await prisma.doctorProfile.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        displayName: true,
        medicalLicenseYear: true,
        currentHospital: true,
        currentPosition: true,
        desiredAreas: true,
        desiredSalaryMin: true,
        desiredSalaryMax: true,
        independenceTimeline: true,
        lastActiveAt: true,
        specialties: { select: { name: true, yearsOfExp: true } },
        boardCertifications: true,
        _count: {
          select: {
            applications: true,
            scoutReceived: true,
          },
        },
      },
      orderBy: { lastActiveAt: "desc" },
    });

    const formatted = doctors.map((d) => ({
      id: d.id,
      displayName: d.displayName,
      medicalLicenseYear: d.medicalLicenseYear,
      currentHospital: d.currentHospital,
      currentPosition: d.currentPosition,
      specialties: d.specialties.map((s) => s.name),
      boardCertifications: d.boardCertifications,
      desiredAreas: d.desiredAreas,
      desiredSalaryMin: d.desiredSalaryMin,
      desiredSalaryMax: d.desiredSalaryMax,
      independenceTimeline: d.independenceTimeline,
      lastActiveAt: d.lastActiveAt.toISOString(),
      applicationCount: d._count.applications,
      scoutCount: d._count.scoutReceived,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Consultant doctors error:", error);
    const message = error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json({ error: `ドクター一覧の取得に失敗しました: ${message}` }, { status: 500 });
  }
}
