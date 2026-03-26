import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: 全求人一覧を取得（管理者専用）
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

    const jobs = await prisma.jobPosting.findMany({
      select: {
        id: true,
        title: true,
        department: true,
        clinicName: true,
        clinicArea: true,
        employmentType: true,
        salaryMin: true,
        salaryMax: true,
        transferPrice: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        corporation: {
          select: {
            id: true,
            corporationName: true,
          },
        },
        _count: {
          select: {
            applications: true,
            favorites: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formatted = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      department: job.department,
      clinicArea: job.clinicArea,
      employmentType: job.employmentType,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      transferPrice: job.transferPrice,
      status: job.status,
      corporation: {
        id: job.corporation.id,
        name: job.corporation.corporationName,
      },
      applicationCount: job._count.applications,
      favoriteCount: job._count.favorites,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Admin jobs fetch error:", error);
    return NextResponse.json(
      { error: "求人一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
