import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  corporationName: z.string().min(1, "法人名を入力してください"),
  representativeName: z.string().min(1, "代表者名を入力してください"),
  corporationType: z.string().optional().nullable(),
  establishedYear: z.number().optional().nullable(),
  employeeCount: z.number().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  contactPerson: z.string().min(1, "担当者名を入力してください"),
  contactEmail: z.string().email("有効なメールアドレスを入力してください"),
  contactPhone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

// GET: 法人プロフィールを取得
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const profile = await prisma.corporationProfile.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Failed to fetch corporation profile:", error);
    return NextResponse.json(
      { error: "プロフィールの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// POST: 法人プロフィールを作成または更新
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    // upsert: 存在すれば更新、なければ作成
    const profile = await prisma.corporationProfile.upsert({
      where: { userId: session.user.id },
      update: {
        corporationName: validatedData.corporationName,
        representativeName: validatedData.representativeName,
        corporationType: validatedData.corporationType || null,
        establishedYear: validatedData.establishedYear || null,
        employeeCount: validatedData.employeeCount || null,
        websiteUrl: validatedData.websiteUrl || null,
        contactPerson: validatedData.contactPerson,
        contactEmail: validatedData.contactEmail,
        contactPhone: validatedData.contactPhone || null,
        address: validatedData.address || null,
        description: validatedData.description || null,
      },
      create: {
        userId: session.user.id,
        corporationName: validatedData.corporationName,
        representativeName: validatedData.representativeName,
        corporationType: validatedData.corporationType || null,
        establishedYear: validatedData.establishedYear || null,
        employeeCount: validatedData.employeeCount || null,
        websiteUrl: validatedData.websiteUrl || null,
        contactPerson: validatedData.contactPerson,
        contactEmail: validatedData.contactEmail,
        contactPhone: validatedData.contactPhone || null,
        address: validatedData.address || null,
        description: validatedData.description || null,
      },
    });

    return NextResponse.json({
      message: "プロフィールを保存しました",
      profile,
    });
  } catch (error) {
    console.error("Failed to save corporation profile:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "入力内容に誤りがあります", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "プロフィールの保存に失敗しました" },
      { status: 500 }
    );
  }
}
