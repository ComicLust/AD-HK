import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  firmInfo,
  services,
  teamMembers,
  aboutData,
  homeData,
  joinUsData,
  kvkkData,
  cookieData,
  basindaBizItems,
  ornekDilekceler,
  navLinks,
} from "../src/data/siteData";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Clean existing records
  await prisma.navLink.deleteMany();
  await prisma.seoMeta.deleteMany();
  await prisma.pageContent.deleteMany();
  await prisma.dilekce.deleteMany();
  await prisma.video.deleteMany();
  await prisma.basindaBiz.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.service.deleteMany();
  await prisma.firmInfo.deleteMany();
  await prisma.adminUser.deleteMany();

  console.log("Cleaned existing records.");

  // 2. Create Admin User
  const hashedPassword = bcrypt.hashSync("admin", 10);
  await prisma.adminUser.create({
    data: {
      username: "admin",
      password: hashedPassword,
    },
  });
  console.log("Created admin user (username: admin, password: admin)");

  // 3. Create Firm Info
  await prisma.firmInfo.create({
    data: {
      name: firmInfo.name,
      address: firmInfo.address,
      gsm: firmInfo.gsm,
      phone: firmInfo.phone,
      fax: firmInfo.fax,
      email: firmInfo.email,
      whatsapp: firmInfo.whatsapp,
      instagram: firmInfo.social.instagram,
      twitter: firmInfo.social.twitter,
      youtube: firmInfo.social.youtube,
      facebook: firmInfo.social.facebook,
      linkedin: firmInfo.social.linkedin,
    },
  });
  console.log("Created firm info.");

  // 4. Create Services
  const defaultTrustPoints = JSON.stringify([
    "Ücretsiz ilk danışmanlık",
    "7/24 ulaşılabilirlik",
    "Gizlilik garantisi",
    "Dosya takip desteği",
  ]);

  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    await prisma.service.create({
      data: {
        slug: s.slug,
        name: s.name,
        icon: s.icon,
        description: s.description,
        fullDescription: s.fullDescription,
        order: i,
        isActive: true,
        trustPoints: defaultTrustPoints,
      },
    });
  }
  console.log(`Created ${services.length} services.`);

  // 5. Create Team Members
  const dbTeamMembers = [];
  for (let i = 0; i < teamMembers.length; i++) {
    const tm = teamMembers[i];
    const member = await prisma.teamMember.create({
      data: {
        name: tm.name,
        title: tm.title,
        category: tm.category,
        bio: tm.bio,
        initials: tm.initials,
        photo: tm.photo,
        specializations: JSON.stringify(tm.specializations),
        slug: tm.slug,
        order: i,
        isActive: true,
      },
    });
    dbTeamMembers.push(member);
  }
  console.log(`Created ${teamMembers.length} team members.`);

  // 6. Create Blog Posts
  // Let's connect some posts to an author if we can find them
  const burakAvukat = dbTeamMembers.find((m) => m.name.includes("Burak"));
  for (let i = 0; i < homeData.blogPosts.length; i++) {
    const bp = homeData.blogPosts[i];
    
    // Parse date text (e.g. "15 Ocak 2025") to a valid ISO Date for database
    // We can just set a default publishedAt or try parsing the year.
    let publishedAt = new Date();
    try {
      const parts = bp.date.split(" ");
      if (parts.length === 3) {
        const year = parseInt(parts[2]);
        const day = parseInt(parts[0]);
        // Simple month parsing
        const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
        const monthIndex = monthNames.indexOf(parts[1]);
        if (monthIndex !== -1 && !isNaN(year) && !isNaN(day)) {
          publishedAt = new Date(year, monthIndex, day);
        }
      }
    } catch (e) {
      // Use now
    }

    await prisma.blogPost.create({
      data: {
        title: bp.title,
        slug: bp.slug,
        summary: bp.summary,
        content: bp.summary + "\n\n" + bp.title + " hakkında detaylı yazımız yakında eklenecektir.", // content placeholder
        category: bp.category,
        publishedAt: publishedAt,
        isPublished: true,
        authorId: burakAvukat ? burakAvukat.id : null,
        tags: JSON.stringify([bp.category]),
      },
    });
  }
  console.log(`Created ${homeData.blogPosts.length} blog posts.`);

  // 7. Create Basında Biz
  for (let i = 0; i < basindaBizItems.length; i++) {
    const item = basindaBizItems[i];
    await prisma.basindaBiz.create({
      data: {
        title: item.title,
        source: item.source,
        sourceDomain: item.sourceDomain,
        link: item.link,
        order: i,
        isActive: true,
      },
    });
  }
  console.log(`Created ${basindaBizItems.length} news items.`);

  // 8. Create Videos (From placeholder videos)
  const placeholderVideos = [
    {
      title: "Miras Hukuku - Bilmeniz Gerekenler",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Miras hukuku hakkında sıkça sorulan sorular ve bilmeniz gereken hukuki detaylar.",
      isActive: true,
      order: 0,
    },
    {
      title: "Boşanma Sürecinde Dikkat Edilmesi Gerekenler",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Boşanma davalarında haklarınız ve süreç hakkında bilgilendirme.",
      isActive: true,
      order: 1,
    },
  ];
  for (let i = 0; i < placeholderVideos.length; i++) {
    const v = placeholderVideos[i];
    await prisma.video.create({
      data: {
        title: v.title,
        videoUrl: v.videoUrl,
        description: v.description,
        order: i,
        isActive: true,
      },
    });
  }
  console.log("Created videos.");

  // 9. Create Dilekçeler
  for (let i = 0; i < ornekDilekceler.length; i++) {
    const d = ornekDilekceler[i];
    await prisma.dilekce.create({
      data: {
        title: d.title,
        category: d.category,
        downloadUrl: d.downloadUrl,
        fileFormat: d.fileFormat,
        order: i,
        isActive: true,
      },
    });
  }
  console.log(`Created ${ornekDilekceler.length} dilekçeler.`);

  // 10. Create Page Contents
  // Home Content
  const homeContent = {
    hero: homeData.hero,
    heroSlides: homeData.heroSlides,
    features: homeData.features,
    whyUs: homeData.whyUs,
    testimonials: homeData.testimonials,
    faqItems: homeData.faqItems,
    ctaSection: homeData.ctaSection,
  };
  await prisma.pageContent.create({
    data: {
      pageType: "home",
      content: JSON.stringify(homeContent),
    },
  });

  // About Content
  await prisma.pageContent.create({
    data: {
      pageType: "about",
      content: JSON.stringify(aboutData),
    },
  });

  // Contact Content
  const contactContent = {
    mapEmbedUrl: "https://maps.google.com/maps?q=Florya+Senlik+Koy+Mah+Saci+Sokak+No+4+F+Bakirkoy+Istanbul&t=&z=15&ie=UTF8&iwloc=&output=embed",
    officeHours: "Pzt - Cum: 09:00 - 18:00",
  };
  await prisma.pageContent.create({
    data: {
      pageType: "contact",
      content: JSON.stringify(contactContent),
    },
  });

  // KVKK Content
  await prisma.pageContent.create({
    data: {
      pageType: "kvkk",
      content: JSON.stringify(kvkkData),
    },
  });

  // Cookie Content
  await prisma.pageContent.create({
    data: {
      pageType: "cookie",
      content: JSON.stringify(cookieData),
    },
  });

  // Join Us Content
  await prisma.pageContent.create({
    data: {
      pageType: "joinus",
      content: JSON.stringify(joinUsData),
    },
  });
  console.log("Created page contents.");

  // 11. Create Nav Links
  for (let i = 0; i < navLinks.length; i++) {
    const nl = navLinks[i];
    const parent = await prisma.navLink.create({
      data: {
        label: nl.label,
        href: nl.href,
        icon: nl.icon,
        order: i,
        isActive: true,
      },
    });

    if (nl.dropdown) {
      for (let j = 0; j < nl.dropdown.length; j++) {
        const sub = nl.dropdown[j];
        await prisma.navLink.create({
          data: {
            label: sub.label,
            href: sub.href,
            icon: sub.icon,
            tab: sub.tab,
            parentId: parent.id,
            order: j,
            isActive: true,
          },
        });
      }
    }
  }
  console.log("Created nav links.");

  console.log("Database seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
