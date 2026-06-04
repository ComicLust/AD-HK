import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [services, posts, videos, seoMetas] = await Promise.all([
      db.service.findMany({ select: { id: true, name: true, slug: true } }),
      db.blogPost.findMany({ select: { id: true, title: true, slug: true } }),
      db.video.findMany({ select: { id: true, title: true } }),
      db.seoMeta.findMany(),
    ]);

    const allItems = [];

    const staticPages = [
      { name: "Ana Sayfa", entityType: "Page", entityId: "home" },
      { name: "Hakkımızda", entityType: "Page", entityId: "about" },
      { name: "İletişim", entityType: "Page", entityId: "contact" },
      { name: "KVKK", entityType: "Page", entityId: "kvkk" },
      { name: "Çerez Politikası", entityType: "Page", entityId: "cookie" },
      { name: "Bize Katılın", entityType: "Page", entityId: "joinus" },
      { name: "Hizmetlerimiz", entityType: "Page", entityId: "services" },
      { name: "Ekibimiz", entityType: "Page", entityId: "team" },
      { name: "Blog / Makaleler", entityType: "Page", entityId: "blog" },
      { name: "Medya (Basında Biz / Videolar)", entityType: "Page", entityId: "media" },
      { name: "Örnek Dilekçeler", entityType: "Page", entityId: "dilekceler" },
    ];

    for (const page of staticPages) {
      const meta = seoMetas.find(m => m.entityType === page.entityType && m.entityId === page.entityId);
      allItems.push({
        name: page.name,
        type: "Sayfa",
        entityType: page.entityType,
        entityId: page.entityId,
        meta: meta || null,
      });
    }

    for (const service of services) {
      const meta = seoMetas.find(m => m.entityType === "Service" && m.entityId === service.id);
      allItems.push({
        name: service.name,
        type: "Hizmet",
        entityType: "Service",
        entityId: service.id,
        meta: meta || null,
      });
    }

    for (const post of posts) {
      const meta = seoMetas.find(m => m.entityType === "BlogPost" && m.entityId === post.id);
      allItems.push({
        name: post.title,
        type: "Makale",
        entityType: "BlogPost",
        entityId: post.id,
        meta: meta || null,
      });
    }

    for (const video of videos) {
      const meta = seoMetas.find(m => m.entityType === "Video" && m.entityId === video.id);
      allItems.push({
        name: video.title,
        type: "Video",
        entityType: "Video",
        entityId: video.id,
        meta: meta || null,
      });
    }

    return NextResponse.json(allItems);
  } catch (error) {
    console.error("SEO audit fetch error:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

