import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 共通パスワード
  const password = await bcrypt.hash("password123", 12);

  // 1. ドクターユーザー
  const doctorUser = await prisma.user.upsert({
    where: { email: "doctor@example.com" },
    update: {},
    create: {
      email: "doctor@example.com",
      hashedPassword: password,
      role: "DOCTOR",
      isActive: true,
      emailVerified: new Date(),
      doctorProfile: {
        create: {
          displayName: "Dr.A",
          realName: "山田 太郎",
          medicalLicenseYear: 2010,
          currentHospital: "東京大学医学部附属病院",
          currentPosition: "常勤医師",
          desiredDepartments: ["内科", "循環器内科"],
          desiredAreas: ["東京都", "神奈川県"],
          desiredSalaryMin: 1800,
          desiredSalaryMax: 2500,
          independenceTimeline: "3〜5年後",
          selfIntroduction: "大学病院で10年以上循環器内科医として勤務してきました。将来的には地域に根ざしたクリニックを開業し、患者さんに寄り添った医療を提供したいと考えています。",
          isPublic: true,
        },
      },
    },
  });
  console.log("✅ Created doctor user:", doctorUser.email);

  // 2. 医療法人ユーザー
  const corpUser = await prisma.user.upsert({
    where: { email: "corp@example.com" },
    update: {},
    create: {
      email: "corp@example.com",
      hashedPassword: password,
      role: "CORPORATION",
      isActive: true,
      emailVerified: new Date(),
      corporationProfile: {
        create: {
          corporationName: "医療法人社団健康会",
          representativeName: "佐藤 健一",
          corporationType: "医療法人社団",
          establishedYear: 2005,
          employeeCount: 50,
          websiteUrl: "https://example-kenkokai.jp",
          contactPerson: "鈴木 一郎",
          contactEmail: "contact@example-kenkokai.jp",
          contactPhone: "03-1234-5678",
          address: "東京都渋谷区渋谷1-1-1",
        },
      },
    },
  });
  console.log("✅ Created corporation user:", corpUser.email);

  // 3. コンサルタントユーザー
  const consultantUser = await prisma.user.upsert({
    where: { email: "consultant@example.com" },
    update: {},
    create: {
      email: "consultant@example.com",
      hashedPassword: password,
      role: "CONSULTANT",
      isActive: true,
      emailVerified: new Date(),
      consultantProfile: {
        create: {
          displayName: "田中 花子",
          department: "M&Aコンサルティング部",
          specialization: "医療機関M&A",
        },
      },
    },
  });
  console.log("✅ Created consultant user:", consultantUser.email);

  // 4. 管理者ユーザー
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      hashedPassword: password,
      role: "ADMIN",
      isActive: true,
      emailVerified: new Date(),
    },
  });
  console.log("✅ Created admin user:", adminUser.email);

  // 5. サンプル求人（法人ユーザーに紐づけ）
  const corpProfile = await prisma.corporationProfile.findUnique({
    where: { userId: corpUser.id },
  });

  if (corpProfile) {
    const job1 = await prisma.jobPosting.upsert({
      where: { id: "sample-job-1" },
      update: {},
      create: {
        id: "sample-job-1",
        corporationId: corpProfile.id,
        title: "内科クリニック 管理医師募集（承継前提）",
        description: `
## 募集概要
当院は渋谷駅から徒歩5分の好立地にある内科クリニックです。
開院から15年、地域の皆様に支えられながら診療を続けてまいりました。

## 求める人材
- 内科または循環器内科の経験がある方
- 将来的な独立・開業に興味がある方
- 患者さんとのコミュニケーションを大切にできる方

## 承継について
現院長は5年後を目途に引退を考えており、後継者として一緒に働いていただける方を募集しています。
まずは管理医師として勤務いただき、クリニックの運営を学んでいただきます。
        `.trim(),
        department: "内科",
        clinicName: "渋谷内科クリニック",
        clinicAddress: "東京都渋谷区渋谷2-2-2",
        clinicArea: "東京都",
        employmentType: "常勤",
        salaryMin: 1800,
        salaryMax: 2200,
        workingHours: "9:00〜18:00（休憩1時間）",
        holidays: "土曜午後、日曜、祝日、年末年始",
        benefits: "社会保険完備、学会参加費補助、引越し手当",
        transferPrice: 8000,
        transferPriceNote: "分割払い応相談",
        transferTimingMin: 3,
        transferTimingMax: 5,
        transferConditions: "3年以上の勤務後、双方合意の上で譲渡手続きを開始します。",
        includesRealEstate: false,
        includesEquipment: true,
        includesStaff: true,
        annualRevenue: 15000,
        annualProfit: 3000,
        patientCount: 50,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log("✅ Created sample job posting:", job1.title);

    const job2 = await prisma.jobPosting.upsert({
      where: { id: "sample-job-2" },
      update: {},
      create: {
        id: "sample-job-2",
        corporationId: corpProfile.id,
        title: "皮膚科・美容皮膚科 院長候補募集",
        description: `
## 募集概要
美容皮膚科を併設した皮膚科クリニックです。
最新の医療機器を導入し、一般皮膚科から美容医療まで幅広く対応しています。

## 特徴
- 最新レーザー機器完備
- 美容施術の研修制度あり
- 集患は法人がサポート

## 承継プラン
2〜4年後を目途に、現院長からの事業承継を予定しています。
        `.trim(),
        department: "皮膚科",
        clinicName: "目黒スキンクリニック",
        clinicAddress: "東京都目黒区目黒1-1-1",
        clinicArea: "東京都",
        employmentType: "常勤",
        salaryMin: 2000,
        salaryMax: 2800,
        workingHours: "10:00〜19:00（休憩1時間）",
        holidays: "水曜、日曜、祝日",
        benefits: "社会保険完備、美容施術社員割引、学会参加費補助",
        transferPrice: 12000,
        transferPriceNote: "応相談",
        transferTimingMin: 2,
        transferTimingMax: 4,
        transferConditions: "美容皮膚科の経験がある方優遇。未経験でも研修制度あり。",
        includesRealEstate: true,
        includesEquipment: true,
        includesStaff: true,
        annualRevenue: 25000,
        annualProfit: 6000,
        patientCount: 40,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    console.log("✅ Created sample job posting:", job2.title);
  }

  console.log("\n🎉 Seeding completed!");
  console.log("\n📋 Test Accounts:");
  console.log("─".repeat(50));
  console.log("| Role        | Email                    | Password    |");
  console.log("─".repeat(50));
  console.log("| ドクター    | doctor@example.com       | password123 |");
  console.log("| 医療法人    | corp@example.com         | password123 |");
  console.log("| コンサル    | consultant@example.com   | password123 |");
  console.log("| 管理者      | admin@example.com        | password123 |");
  console.log("─".repeat(50));
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
