import { db } from "@/lib/db";
import * as staticData from "@/data/siteData";

export async function getSiteData() {
  try {
    // 1. Fetch from DB
    const [
      firmDb,
      servicesDb,
      teamDb,
      postsDb,
      newsDb,
      dilekceDb,
      videoDb,
      pagesDb,
      navLinksDb,
      translationsDb
    ] = await Promise.all([
      db.firmInfo.findFirst(),
      db.service.findMany({ orderBy: { order: "asc" } }),
      db.teamMember.findMany({ orderBy: { order: "asc" } }),
      db.blogPost.findMany({ orderBy: { publishedAt: "desc" } }),
      db.basindaBiz.findMany({ orderBy: { order: "asc" } }),
      db.dilekce.findMany({ orderBy: { order: "asc" } }),
      db.video.findMany({ orderBy: { order: "asc" } }),
      db.pageContent.findMany(),
      db.navLink.findMany({
        where: { parentId: null },
        include: { children: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" }
      }),
      db.translation.findMany()
    ]);

    // 2. Format Firm Info
    const firmInfo = firmDb ? {
      name: firmDb.name,
      address: firmDb.address,
      gsm: firmDb.gsm,
      phone: firmDb.phone,
      fax: firmDb.fax,
      email: firmDb.email,
      whatsapp: firmDb.whatsapp,
      logo: firmDb.logo || "",
      social: {
        instagram: firmDb.instagram || "",
        twitter: firmDb.twitter || "",
        youtube: firmDb.youtube || "",
        facebook: firmDb.facebook || "",
        linkedin: firmDb.linkedin || ""
      }
    } : staticData.firmInfo;

    // 3. Format Navigation Links
    const navLinks = navLinksDb.length > 0 ? navLinksDb.map(link => ({
      label: link.label,
      href: link.href,
      icon: link.icon || undefined,
      dropdown: link.children.length > 0 ? link.children.map(child => ({
        label: child.label,
        href: child.href,
        tab: child.tab || undefined,
        icon: child.icon || undefined
      })) : undefined
    })) : staticData.navLinks;

    // 4. Format Services
    const services = servicesDb.length > 0 ? servicesDb.map(s => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      icon: s.icon,
      description: s.description,
      fullDescription: s.fullDescription,
      isActive: s.isActive,
      trustPoints: s.trustPoints ? JSON.parse(s.trustPoints) : [
        "Ücretsiz ilk danışmanlık",
        "7/24 ulaşılabilirlik",
        "Gizlilik garantisi",
        "Dosya takip desteği"
      ]
    })) : staticData.services;

    // 5. Format Team Members
    const teamMembers = teamDb.length > 0 ? teamDb.map(tm => ({
      name: tm.name,
      title: tm.title,
      category: tm.category,
      bio: tm.bio,
      initials: tm.initials,
      photo: tm.photo,
      slug: tm.slug,
      isActive: tm.isActive,
      specializations: tm.specializations ? JSON.parse(tm.specializations) : [],
      socialLinks: tm.socialLinks ? JSON.parse(tm.socialLinks) : { email: "", phone: "", instagram: "", twitter: "", linkedin: "" }
    })) : staticData.teamMembers;

    // 6. Format Blog Posts
    const blogPosts = postsDb.length > 0 ? postsDb.map(bp => {
      const dateStr = bp.publishedAt.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });

      return {
        id: bp.id,
        title: bp.title,
        summary: bp.summary,
        content: bp.content,
        date: dateStr,
        category: bp.category,
        slug: bp.slug,
        isPublished: bp.isPublished,
        coverImage: bp.coverImage || undefined,
        tags: bp.tags ? JSON.parse(bp.tags) : []
      };
    }) : staticData.homeData.blogPosts;

    // 7. Format Basında Biz Items
    const basindaBizItems = newsDb.length > 0 ? newsDb.map(item => ({
      id: item.id,
      title: item.title,
      source: item.source,
      sourceDomain: item.sourceDomain,
      link: item.link,
      isActive: item.isActive
    })) : [];

    // 8. Format Dilekçeler
    const ornekDilekceler = dilekceDb.length > 0 ? dilekceDb.map(d => ({
      id: d.id,
      title: d.title,
      category: d.category,
      downloadUrl: d.downloadUrl,
      fileFormat: d.fileFormat,
      isActive: d.isActive
    })) : staticData.ornekDilekceler;

    // 9. Format Videos
    const videos = videoDb.length > 0 ? videoDb.map(v => ({
      id: v.id,
      title: v.title,
      description: v.description || "",
      videoUrl: v.videoUrl,
      thumbnailUrl: v.thumbnailUrl || "",
      isActive: v.isActive
    })) : [
      { title: "Miras Hukuku - Bilmeniz Gerekenler", date: "12 Ocak 2025", summary: "Miras hukuku hakkında sıkça sorulan sorular ve bilmeniz gereken hukuki detaylar." },
      { title: "Boşanma Sürecinde Dikkat Edilmesi Gerekenler", date: "5 Ocak 2025", summary: "Boşanma davalarında haklarınız ve süreç hakkında bilgilendirme." },
    ];

    // 10. Format Page Contents
    const pageMap: Record<string, any> = {};
    pagesDb.forEach(p => {
      try {
        pageMap[p.pageType] = JSON.parse(p.content);
      } catch (e) {
        pageMap[p.pageType] = {};
      }
    });

    const aboutData = pageMap["about"] || staticData.aboutData;
    const kvkkData = pageMap["kvkk"] || staticData.kvkkData;
    const cookieData = pageMap["cookie"] || staticData.cookieData;
    const joinUsData = pageMap["joinus"] || staticData.joinUsData;
    const contactData = pageMap["contact"] || {
      mapEmbedUrl: "https://maps.google.com/maps?q=Florya+Senlik+Koy+Mah+Saci+Sokak+No+4+F+Bakirkoy+Istanbul&t=&z=15&ie=UTF8&iwloc=&output=embed",
      officeHours: "Pzt - Cum: 09:00 - 18:00",
    };
    
    const homeData = {
      ...(pageMap["home"] || staticData.homeData),
      blogPosts: blogPosts.filter((bp: any) => bp.isPublished)
    };

    const translations: Record<string, { tr: string; en: string }> = {};
    translationsDb.forEach(t => {
      translations[t.key] = { tr: t.tr, en: t.en };
    });

    return {
      useFallback: false,
      firmInfo,
      navLinks,
      services,
      teamMembers,
      blogPosts,
      basindaBizItems,
      ornekDilekceler,
      videos,
      aboutData,
      kvkkData,
      cookieData,
      joinUsData,
      contactData,
      homeData,
      translations,
      mediaTabs: staticData.mediaTabs
    };
  } catch (error) {
    console.error("Failed to load site-data from DB (Server Helper):", error);
    // Return static data as fallback if DB fails
    return {
      useFallback: true,
      firmInfo: staticData.firmInfo,
      navLinks: staticData.navLinks,
      services: staticData.services,
      teamMembers: staticData.teamMembers,
      aboutData: staticData.aboutData,
      kvkkData: staticData.kvkkData,
      cookieData: staticData.cookieData,
      joinUsData: staticData.joinUsData,
      mediaTabs: staticData.mediaTabs,
      basindaBizItems: [],
      ornekDilekceler: [],
      videos: [],
      contactData: {
        mapEmbedUrl: "https://maps.google.com/maps?q=Florya+Senlik+Koy+Mah+Saci+Sokak+No+4+F+Bakirkoy+Istanbul&t=&z=15&ie=UTF8&iwloc=&output=embed",
        officeHours: "Pzt - Cum: 09:00 - 18:00",
      },
      homeData: staticData.homeData
    };
  }
}
