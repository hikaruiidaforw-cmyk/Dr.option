import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: 公開中の求人一覧を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // フィルタパラメータ
    const department = searchParams.get("department");
    const area = searchParams.get("area");
    const salaryMin = searchParams.get("salaryMin");
    const salaryMax = searchParams.get("salaryMax");
    const transferPriceMin = searchParams.get("transferPriceMin");
    const transferPriceMax = searchParams.get("transferPriceMax");
    const keyword = searchParams.get("keyword");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // クエリ条件を構築
    const where: Record<string, unknown> = {
      status: "PUBLISHED",
    };

    if (department) {
      where.department = department;
    }

    if (area) {
      where.clinicArea = {
        contains: area,
      };
    }

    if (salaryMin) {
      where.salaryMax = {
        gte: parseInt(salaryMin),
      };
    }

    if (salaryMax) {
      where.salaryMin = {
        lte: parseInt(salaryMax),
      };
    }

    if (transferPriceMin) {
      where.transferPrice = {
        ...(where.transferPrice as object || {}),
        gte: parseInt(transferPriceMin),
      };
    }

    if (transferPriceMax) {
      where.transferPrice = {
        ...(where.transferPrice as object || {}),
        lte: parseInt(transferPriceMax),
      };
    }

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
        { clinicName: { contains: keyword, mode: "insensitive" } },
      ];
    }

    // 求人を取得
    const [jobs, total] = await Promise.all([
      prisma.jobPosting.findMany({
        where,
        include: {
          corporation: {
            select: {
              id: true,
              corporationName: true,
              logoUrl: true,
            },
          },
          images: {
            take: 1,
            orderBy: { sortOrder: "asc" },
          },
          _count: {
            select: {
              applications: true,
              favorites: true,
            },
          },
        },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.jobPosting.count({ where }),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json(
      { error: "求人一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
