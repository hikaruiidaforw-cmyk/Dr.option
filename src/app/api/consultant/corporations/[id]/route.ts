import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "CONSULTANT" && user?.role !== "ADMIN") {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const corporation = await prisma.corporationProfile.findUnique({
      where: { id },
      include: {
        user: { select: { email: true } },
        jobPostings: {
          select: {
            id: true,
            title: true,
            status: true,
            salaryMin: true,
            salaryMax: true,
            transferPrice: true,
            _count: {
              select: { applications: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        sentScouts: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!corporation) {
      return NextResponse.json({ error: "法人が見つかりません" }, { status: 404 });
    }

    const formatted = {
      id: corporation.id,
      corporationName: corporation.corporationName,
      representativeName: corporation.representativeName,
      corporationType: corporation.corporationType,
      email: corporation.user.email,
      contactEmail: corporation.contactEmail,
      contactPhone: corporation.contactPhone,
      contactPerson: corporation.contactPerson,
      address: corporation.address,
      establishedYear: corporation.establishedYear,
      employeeCount: corporation.employeeCount,
      websiteUrl: corporation.websiteUrl,
      description: corporation.description,
      createdAt: corporation.createdAt.toISOString(),
      jobs: corporation.jobPostings.map((j) => ({
        id: j.id,
        title: j.title,
        status: j.status,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
        transferPrice: j.transferPrice,
        applicationCount: j._count.applications,
      })),
      scoutCount: corporation.sentScouts.length,
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Consultant corporation detail error:", error);
    const message = error instanceof Error ? error.message : "不明なエラー";
    return NextResponse.json(
      { error: `法人詳細の取得に失敗しました: ${message}` },
      { status: 500 }
    );
  }
}
