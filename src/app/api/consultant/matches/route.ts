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

    const matches = await prisma.match.findMany({
      where: { consultantId: consultant.id },
      select: {
        id: true,
        status: true,
        agreedSalary: true,
        agreedTransferPrice: true,
        employmentStartDate: true,
        createdAt: true,
        updatedAt: true,
        application: {
          select: {
            doctorProfile: {
              select: {
                id: true,
                displayName: true,
                medicalLicenseYear: true,
                specialties: { select: { name: true } },
              },
            },
            jobPosting: {
              select: {
                id: true,
                title: true,
                salaryMin: true,
                salaryMax: true,
                transferPrice: true,
                corporation: {
                  select: { id: true, corporationName: true },
                },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formatted = matches.map((m) => ({
      id: m.id,
      status: m.status,
      agreedSalary: m.agreedSalary,
      agreedTransferPrice: m.agreedTransferPrice,
      employmentStartDate: m.employmentStartDate?.toISOString() ?? null,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
      doctorProfile: {
        id: m.application.doctorProfile.id,
        displayName: m.application.doctorProfile.displayName,
        medicalLicenseYear: m.application.doctorProfile.medicalLicenseYear,
        specialties: m.application.doctorProfile.specialties.map((s) => s.name),
      },
      corporation: {
        id: m.application.jobPosting.corporation.id,
        corporationName: m.application.jobPosting.corporation.corporationName,
      },
      jobPosting: {
        id: m.application.jobPosting.id,
        title: m.application.jobPosting.title,
        salaryMin: m.application.jobPosting.salaryMin,
        salaryMax: m.application.jobPosting.salaryMax,
        transferPrice: m.application.jobPosting.transferPrice,
      },
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Consultant matches error:", error);
    const message = error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json({ error: `マッチング一覧の取得に失敗しました: ${message}` }, { status: 500 });
  }
}
