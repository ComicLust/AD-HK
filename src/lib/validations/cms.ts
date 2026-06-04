import { z } from "zod";

export const firmInfoSchema = z.object({
  name: z.string().min(1, "Firma adı zorunludur."),
  address: z.string().min(1, "Adres zorunludur."),
  gsm: z.string().min(1, "GSM zorunludur."),
  phone: z.string().min(1, "Telefon zorunludur."),
  fax: z.string().optional().default(""),
  email: z.string().email("Geçersiz e-posta adresi."),
  whatsapp: z.string().url("Geçersiz WhatsApp URL'si."),
  logo: z.string().optional().nullable(),
  instagram: z.string().url("Geçersiz Instagram URL'si.").or(z.literal("")).optional(),
  twitter: z.string().url("Geçersiz Twitter URL'si.").or(z.literal("")).optional(),
  youtube: z.string().url("Geçersiz YouTube URL'si.").or(z.literal("")).optional(),
  facebook: z.string().url("Geçersiz Facebook URL'si.").or(z.literal("")).optional(),
  linkedin: z.string().url("Geçersiz LinkedIn URL'si.").or(z.literal("")).optional(),
});

export const serviceSchema = z.object({
  slug: z.string().min(1, "Slug zorunludur."),
  name: z.string().min(1, "Hizmet adı zorunludur."),
  icon: z.string().min(1, "İkon zorunludur."),
  description: z.string().min(1, "Kısa açıklama zorunludur."),
  fullDescription: z.string().min(1, "Detaylı açıklama zorunludur."),
  isActive: z.boolean().optional().default(true),
  trustPoints: z.array(z.string()).optional().default([]),
});

export const teamMemberSchema = z.object({
  name: z.string().min(1, "Ad soyad zorunludur."),
  title: z.string().min(1, "Unvan zorunludur."),
  category: z.enum(["lawyer", "intern-lawyer", "intern-student", "staff"]),
  bio: z.string().optional().default(""),
  initials: z.string().min(1, "Baş harfler zorunludur."),
  photo: z.string().min(1, "Fotoğraf zorunludur."),
  specializations: z.array(z.string()).optional().default([]),
  socialLinks: z.object({
    email: z.string().optional().default(""),
    phone: z.string().optional().default(""),
    instagram: z.string().optional().default(""),
    twitter: z.string().optional().default(""),
    linkedin: z.string().optional().default(""),
  }).optional(),
  slug: z.string().min(1, "Slug zorunludur."),
  isActive: z.boolean().optional().default(true),
});

export const blogPostSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur."),
  slug: z.string().min(1, "Slug zorunludur."),
  summary: z.string().min(1, "Özet zorunludur."),
  content: z.string().min(1, "İçerik zorunludur."),
  category: z.string().min(1, "Kategori zorunludur."),
  coverImage: z.string().optional(),
  authorId: z.string().nullable().optional(),
  isPublished: z.boolean().optional().default(true),
  tags: z.array(z.string()).optional().default([]),
});

export const basindaBizSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur."),
  source: z.string().min(1, "Kaynak adı zorunludur."),
  sourceDomain: z.string().min(1, "Domain zorunludur."),
  link: z.string().min(1, "Link veya Görsel Kupür zorunludur."),
  isActive: z.boolean().optional().default(true),
});

export const videoSchema = z.object({
  title: z.string().min(1, "Video başlığı zorunludur."),
  description: z.string().optional(),
  videoUrl: z.string().url("Geçersiz video URL'si."),
  thumbnailUrl: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const dilekceSchema = z.object({
  title: z.string().min(1, "Dilekçe adı zorunludur."),
  category: z.string().min(1, "Kategori zorunludur."),
  downloadUrl: z.string().min(1, "İndirme dosyası veya linki zorunludur."),
  fileFormat: z.enum(["doc", "pdf", "docx"]),
  isActive: z.boolean().optional().default(true),
});

export const navLinkSchema = z.object({
  label: z.string().min(1, "Etiket zorunludur."),
  href: z.string().min(1, "Bağlantı (href) zorunludur."),
  icon: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  parentId: z.string().nullable().optional(),
  tab: z.string().optional().nullable(),
});

export const pageContentSchema = z.object({
  pageType: z.enum(["about", "contact", "kvkk", "cookie", "joinus", "home"]),
  content: z.string().min(1, "JSON İçerik zorunludur."),
});
