import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const seoMetaSchema = z.object({
  entityType: z.enum(["Service", "BlogPost", "Video", "Page"]),
  entityId: z.string().min(1, "Entity ID zorunludur."),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  canonicalUrl: z.string().url("Geçersiz Canonical URL.").or(z.literal("")).optional().nullable(),
  ogTitle: z.string().optional().nullable(),
  ogDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  keywords: z.array(z.string()).optional().default([]),
  robots: z.string().optional().nullable(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");

    if (entityType && entityId) {
      const meta = await db.seoMeta.findUnique({
        where: {
          entityType_entityId: {
            entityType,
            entityId,
          },
        },
      });
      return NextResponse.json(meta || null);
    }

    const allMeta = await db.seoMeta.findMany();
    return NextResponse.json(allMeta);
  } catch (error) {
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = seoMetaSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 });
    }

    const {
      entityType,
      entityId,
      title,
      description,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      keywords,
      robots,
    } = result.data;

    const keywordsStr = JSON.stringify(keywords);

    const updated = await db.seoMeta.upsert({
      where: {
        entityType_entityId: {
          entityType,
          entityId,
        },
      },
      update: {
        title,
        description,
        canonicalUrl,
        ogTitle,
        ogDescription,
        ogImage,
        keywords: keywordsStr,
        robots,
      },
      create: {
        entityType,
        entityId,
        title,
        description,
        canonicalUrl,
        ogTitle,
        ogDescription,
        ogImage,
        keywords: keywordsStr,
        robots,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("SeoMeta upsert error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
