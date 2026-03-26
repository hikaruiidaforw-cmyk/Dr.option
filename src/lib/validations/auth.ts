import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(1, "パスワードを入力してください")
    .min(8, "パスワードは8文字以上で入力してください"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerDoctorSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(1, "パスワードを入力してください")
    .min(8, "パスワードは8文字以上で入力してください"),
  confirmPassword: z.string().min(1, "パスワードを再入力してください"),
  displayName: z.string().min(1, "表示名を入力してください"),
  medicalLicenseYear: z
    .number()
    .int()
    .min(1950, "有効な年を入力してください")
    .max(new Date().getFullYear(), "未来の年は入力できません"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

export type RegisterDoctorInput = z.infer<typeof registerDoctorSchema>;

export const registerCorporationSchema = z.object({
  email: z
    .string()
    .min(1, "メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(1, "パスワードを入力してください")
    .min(8, "パスワードは8文字以上で入力してください"),
  confirmPassword: z.string().min(1, "パスワードを再入力してください"),
  corporationName: z.string().min(1, "法人名を入力してください"),
  representativeName: z.string().min(1, "代表者名を入力してください"),
  contactPerson: z.string().min(1, "担当者名を入力してください"),
  contactEmail: z
    .string()
    .min(1, "連絡先メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

export type RegisterCorporationInput = z.infer<typeof registerCorporationSchema>;
