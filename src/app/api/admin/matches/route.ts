import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: 全マッチング一覧を取得（管理者専用）
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

    const matches = await prisma.match.findMany({
      select: {
        id: true,
        status: true,
        agreedSalary: true,
        agreedTransferPrice: true,
        agreedTransferDate: true,
        employmentStartDate: true,
        createdAt: true,
        updatedAt: true,
        consultant: {
          select: {
            id: true,
            displayName: true,
          },
        },
        application: {
          select: {
            doctorProfile: {
              select: {
                id: true,
                displayName: true,
                medicalLicenseYear: true,
                specialties: {
                  select: { name: true },
                },
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
                  select: {
                    id: true,
                    corporationName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const formatted = matches.map((match) => ({
      id: match.id,
      status: match.status,
      agreedSalary: match.agreedSalary,
      agreedTransferPrice: match.agreedTransferPrice,
      employmentStartDate: match.employmentStartDate?.toISOString() ?? null,
      createdAt: match.createdAt.toISOString(),
      updatedAt: match.updatedAt.toISOString(),
      doctorProfile: {
        id: match.application.doctorProfile.id,
        displayName: match.application.doctorProfile.displayName,
        medicalLicenseYear: match.application.doctorProfile.medicalLicenseYear,
        specialties: match.application.doctorProfile.specialties.map((s) => s.name),
      },
      corporation: {
        id: match.application.jobPosting.corporation.id,
        corporationName: match.application.jobPosting.corporation.corporationName,
      },
      jobPosting: {
        id: match.application.jobPosting.id,
        title: match.application.jobPosting.title,
        salaryMin: match.application.jobPosting.salaryMin,
        salaryMax: match.application.jobPosting.salaryMax,
        transferPrice: match.application.jobPosting.transferPrice,
      },
      consultant: match.consultant
        ? { id: match.consultant.id, name: match.consultant.displayName }
        : null,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Admin matches fetch error:", error);
    return NextResponse.json(
      { error: "マッチング一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
