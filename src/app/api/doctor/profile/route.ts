import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const careerEventSchema = z.object({
  id: z.string().optional(),
  year: z.number().min(1950).max(new Date().getFullYear() + 10),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
});

const profileSchema = z.object({
  displayName: z.string().min(1, "表示名を入力してください"),
  realName: z.string().optional().nullable(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
  birthYear: z.number().optional().nullable(),
  medicalLicenseYear: z.number().min(1950).max(new Date().getFullYear()),
  currentHospital: z.string().optional().nullable(),
  currentPosition: z.string().optional().nullable(),
  desiredDepartments: z.array(z.string()).optional(),
  desiredAreas: z.array(z.string()).optional(),
  desiredSalaryMin: z.number().optional().nullable(),
  desiredSalaryMax: z.number().optional().nullable(),
  independenceTimeline: z.string().optional().nullable(),
  selfIntroduction: z.string().optional().nullable(),
  boardCertifications: z.array(z.string()).optional(),
  specialties: z.array(z.object({
    name: z.string(),
    yearsOfExp: z.number().optional().nullable(),
  })).optional(),
  careerEvents: z.array(careerEventSchema).optional(),
  isPublic: z.boolean().optional(),
});

// GET: ドクタープロフィールを取得
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const profile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        specialties: true,
        careerEvents: {
          orderBy: { year: "asc" },
        },
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Failed to fetch doctor profile:", error);
    return NextResponse.json(
      { error: "プロフィールの取得に失敗しました" },
      { status: 500 }
    );
  }
}

// POST: ドクタープロフィールを作成または更新
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

    // 既存のプロフィールを確認
    const existingProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
      include: { specialties: true, careerEvents: true },
    });

    if (existingProfile) {
      // 更新の場合
      // 既存の専門科とキャリアイベントを削除
      await prisma.$transaction([
        prisma.doctorSpecialty.deleteMany({
          where: { doctorProfileId: existingProfile.id },
        }),
        prisma.careerEvent.deleteMany({
          where: { doctorProfileId: existingProfile.id },
        }),
      ]);

      // プロフィールを更新
      const profile = await prisma.doctorProfile.update({
        where: { userId: session.user.id },
        data: {
          displayName: validatedData.displayName,
          realName: validatedData.realName || null,
          gender: validatedData.gender || null,
          birthYear: validatedData.birthYear || null,
          medicalLicenseYear: validatedData.medicalLicenseYear,
          currentHospital: validatedData.currentHospital || null,
          currentPosition: validatedData.currentPosition || null,
          desiredDepartments: validatedData.desiredDepartments || [],
          desiredAreas: validatedData.desiredAreas || [],
          desiredSalaryMin: validatedData.desiredSalaryMin || null,
          desiredSalaryMax: validatedData.desiredSalaryMax || null,
          independenceTimeline: validatedData.independenceTimeline || null,
          selfIntroduction: validatedData.selfIntroduction || null,
          boardCertifications: validatedData.boardCertifications || [],
          isPublic: validatedData.isPublic ?? true,
          lastActiveAt: new Date(),
          specialties: {
            create: validatedData.specialties?.map((s) => ({
              name: s.name,
              yearsOfExp: s.yearsOfExp || null,
            })) || [],
          },
          careerEvents: {
            create: validatedData.careerEvents?.map((e, index) => ({
              year: e.year,
              title: e.title,
              description: e.description || null,
              sortOrder: index,
            })) || [],
          },
        },
        include: {
          specialties: true,
          careerEvents: {
            orderBy: { year: "asc" },
          },
        },
      });

      return NextResponse.json({
        message: "プロフィールを更新しました",
        profile,
      });
    } else {
      // 新規作成の場合
      const profile = await prisma.doctorProfile.create({
        data: {
          userId: session.user.id,
          displayName: validatedData.displayName,
          realName: validatedData.realName || null,
          gender: validatedData.gender || null,
          birthYear: validatedData.birthYear || null,
          medicalLicenseYear: validatedData.medicalLicenseYear,
          currentHospital: validatedData.currentHospital || null,
          currentPosition: validatedData.currentPosition || null,
          desiredDepartments: validatedData.desiredDepartments || [],
          desiredAreas: validatedData.desiredAreas || [],
          desiredSalaryMin: validatedData.desiredSalaryMin || null,
          desiredSalaryMax: validatedData.desiredSalaryMax || null,
          independenceTimeline: validatedData.independenceTimeline || null,
          selfIntroduction: validatedData.selfIntroduction || null,
          boardCertifications: validatedData.boardCertifications || [],
          isPublic: validatedData.isPublic ?? true,
          specialties: {
            create: validatedData.specialties?.map((s) => ({
              name: s.name,
              yearsOfExp: s.yearsOfExp || null,
            })) || [],
          },
          careerEvents: {
            create: validatedData.careerEvents?.map((e, index) => ({
              year: e.year,
              title: e.title,
              description: e.description || null,
              sortOrder: index,
            })) || [],
          },
        },
        include: {
          specialties: true,
          careerEvents: {
            orderBy: { year: "asc" },
          },
        },
      });

      return NextResponse.json({
        message: "プロフィールを作成しました",
        profile,
      }, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to save doctor profile:", error);

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
