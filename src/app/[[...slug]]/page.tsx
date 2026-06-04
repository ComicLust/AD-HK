import { getSiteData } from "@/lib/getSiteData";
import { db } from "@/lib/db";
import { Metadata } from "next";
import MainApp from "@/components/MainApp";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let entityType = "Page";
  let entityId = "home";

  if (!slug || slug.length === 0) {
    entityType = "Page";
    entityId = "home";
  } else if (slug[0] === "hakkimizda") {
    entityType = "Page";
    entityId = "about";
  } else if (slug[0] === "iletisim") {
    entityType = "Page";
    entityId = "contact";
  } else if (slug[0] === "kvkk") {
    entityType = "Page";
    entityId = "kvkk";
  } else if (slug[0] === "cerez-politikasi") {
    entityType = "Page";
    entityId = "cookie";
  } else if (slug[0] === "bize-katilin") {
    entityType = "Page";
    entityId = "joinus";
  } else if (slug[0] === "ornek-dilekceler") {
    entityType = "Page";
    entityId = "dilekceler";
  } else if (slug[0] === "blog" && slug[1]) {
    entityType = "BlogPost";
    const post = await db.blogPost.findUnique({
      where: { slug: slug[1] },
      select: { id: true }
    });
    entityId = post ? post.id : slug[1];
  } else if (slug[0] === "hizmetlerimiz" && slug[1]) {
    entityType = "Service";
    const service = await db.service.findUnique({
      where: { slug: slug[1] },
      select: { id: true }
    });
    entityId = service ? service.id : slug[1];
  } else {
    entityType = "Page";
    entityId = slug[0];
  }

  try {
    const seo = await db.seoMeta.findUnique({
      where: {
        entityType_entityId: {
          entityType,
          entityId
        }
      }
    });

    if (seo) {
      let kwArray: string[] = [];
      if (seo.keywords) {
        try {
          kwArray = JSON.parse(seo.keywords);
          if (!Array.isArray(kwArray)) kwArray = [seo.keywords];
        } catch (e) {
          kwArray = seo.keywords.split(",").map(k => k.trim());
        }
      }

      return {
        title: seo.title || undefined,
        description: seo.description || undefined,
        keywords: kwArray.length > 0 ? kwArray : undefined,
        alternates: {
          canonical: seo.canonicalUrl || undefined,
        },
        robots: seo.robots || undefined,
        openGraph: {
          title: seo.ogTitle || seo.title || undefined,
          description: seo.ogDescription || seo.description || undefined,
          images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
        }
      };
    }
  } catch (error) {
    console.error("Failed to generate metadata from DB:", error);
  }

  // Fallback defaults
  return {
    title: "Adil Hukuk Danışmanlık | Güven, Uzmanlık ve Çözüm Odaklı Hukuki Hizmet",
    description: "Adil Hukuk Danışmanlık Bürosu olarak, müvekkillerimize hak ettikleri nitelikli ve güvenilir hukuki hizmeti sunuyoruz.",
  };
}

export default async function Page({ params }: PageProps) {
  // Suppress warnings or wait if needed, but in Next.js 15+ we can just let layout/page fetch initialData
  const initialData = await getSiteData();
  return <MainApp initialData={initialData} />;
}
