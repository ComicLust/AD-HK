"use client";

import { useEffect } from "react";
import { useSiteData } from "@/hooks/useSiteData";

interface PageSeoProps {
  route: string;
}

export default function PageSeo({ route }: PageSeoProps) {
  const siteData = useSiteData();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let entityType: "Page" | "Service" | "BlogPost" | "Video" = "Page";
    let entityId = "home";
    let defaultTitle = "Adil Hukuk Danışmanlık | Güven, Uzmanlık ve Çözüm Odaklı Hukuki Hizmet";
    let defaultDescription = "Adil Hukuk Danışmanlık Bürosu olarak, müvekkillerimize hak ettikleri nitelikli ve güvenilir hukuki hizmeti sunuyoruz. Ceza, Aile, Ticaret, Miras Hukuku ve daha fazlası.";
    let defaultKeywords = "Adil Hukuk, Hukuk Bürosu, Avukat, Danışmanlık, Ceza Hukuku, Aile Hukuku, Ticaret Hukuku, İstanbul Avukat, Bakırköy Avukat";

    // 1. Map route to entityType & entityId
    if (route === "/") {
      entityType = "Page";
      entityId = "home";
    } else if (route === "/hakkimizda") {
      entityType = "Page";
      entityId = "about";
      defaultTitle = "Hakkımızda | Adil Hukuk Danışmanlık";
      if (siteData.aboutData?.intro) {
        defaultDescription = siteData.aboutData.intro;
      }
    } else if (route === "/iletisim") {
      entityType = "Page";
      entityId = "contact";
      defaultTitle = "İletişim | Adil Hukuk Danışmanlık";
      defaultDescription = "Adil Hukuk Danışmanlık iletişim bilgileri, adres, telefon ve çalışma saatleri.";
    } else if (route === "/kvkk") {
      entityType = "Page";
      entityId = "kvkk";
      defaultTitle = "KVKK Aydınlatma Metni | Adil Hukuk Danışmanlık";
      defaultDescription = "Adil Hukuk Danışmanlık Kişisel Verilerin Korunması Kanunu aydınlatma ve bilgilendirme metni.";
    } else if (route === "/cerez-politikasi") {
      entityType = "Page";
      entityId = "cookie";
      defaultTitle = "Çerez Politikası | Adil Hukuk Danışmanlık";
      defaultDescription = "Adil Hukuk Danışmanlık web sitesi çerez politikası ve kullanım şartları.";
    } else if (route === "/bize-katilin") {
      entityType = "Page";
      entityId = "joinus";
      defaultTitle = "Bize Katılın | Adil Hukuk Danışmanlık";
      if (siteData.joinUsData?.intro) {
        defaultDescription = siteData.joinUsData.intro;
      }
    } else if (route === "/ekibimiz") {
      entityType = "Page";
      entityId = "team";
      defaultTitle = "Ekibimiz | Adil Hukuk Danışmanlık";
      defaultDescription = "Adil Hukuk Danışmanlık uzman avukat ve idari kadrosu.";
    } else if (route === "/hizmetlerimiz") {
      entityType = "Page";
      entityId = "services";
      defaultTitle = "Hizmetlerimiz | Adil Hukuk Danışmanlık";
      defaultDescription = "Ceza, Aile, Ticaret, Miras, İcra ve İflas Hukuku başta olmak üzere sunduğumuz tüm hukuki hizmetler.";
    } else if (route === "/blog") {
      entityType = "Page";
      entityId = "blog";
      defaultTitle = "Blog ve Makaleler | Adil Hukuk Danışmanlık";
      defaultDescription = "Hukuki konularda güncel makaleler, yasal düzenlemeler ve bilgilendirici içerikler.";
    } else if (route === "/medya") {
      entityType = "Page";
      entityId = "media";
      defaultTitle = "Basında Biz & Videolar | Adil Hukuk Danışmanlık";
      defaultDescription = "Adil Hukuk Danışmanlık basında çıkan haberleri ve bilgilendirici videoları.";
    } else if (route === "/ornek-dilekceler") {
      entityType = "Page";
      entityId = "dilekceler";
      defaultTitle = "Örnek Dilekçeler | Adil Hukuk Danışmanlık";
      defaultDescription = "Hukuki başvurularınız için taslak örnek dilekçeler.";
    } else if (route.startsWith("/hizmetlerimiz/")) {
      const slug = route.replace("/hizmetlerimiz/", "");
      // @ts-ignore
      const service = siteData.services?.find((s) => s.slug === slug);
      if (service) {
        entityType = "Service";
        // @ts-ignore
        entityId = service.id || slug;
        defaultTitle = `${service.name} | Adil Hukuk Danışmanlık`;
        defaultDescription = service.description || defaultDescription;
      }
    } else if (route.startsWith("/blog/")) {
      const slug = route.replace("/blog/", "");
      // @ts-ignore
      const post = siteData.blogPosts?.find((bp) => bp.slug === slug);
      if (post) {
        entityType = "BlogPost";
        // @ts-ignore
        entityId = post.id || slug;
        defaultTitle = `${post.title} | Adil Hukuk Danışmanlık`;
        defaultDescription = post.summary || defaultDescription;
      }
    }

    async function applySeo() {
      try {
        let title = defaultTitle;
        let description = defaultDescription;
        let canonicalUrl = `https://adilhukukdanismanlik.com${route === "/" ? "" : route}`;
        let keywords = defaultKeywords;
        let robots = "index, follow";
        let ogTitle = defaultTitle;
        let ogDescription = defaultDescription;
        let ogImage = "";

        // Query custom SEO from DB
        const res = await fetch(`/api/seo-meta?entityType=${entityType}&entityId=${entityId}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            if (data.title) title = data.title;
            if (data.description) description = data.description;
            if (data.canonicalUrl) canonicalUrl = data.canonicalUrl;
            if (data.robots) robots = data.robots;
            
            if (data.keywords) {
              try {
                const kwArray = JSON.parse(data.keywords);
                if (Array.isArray(kwArray)) {
                  keywords = kwArray.join(", ");
                }
              } catch (e) {
                keywords = data.keywords;
              }
            }

            ogTitle = data.ogTitle || title;
            ogDescription = data.ogDescription || description;
            ogImage = data.ogImage || "";
          }
        }

        // Apply to DOM
        document.title = title;

        const updateMeta = (name: string, content: string | null | undefined, isProperty = false) => {
          const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
          let element = document.querySelector(selector);
          if (content) {
            if (!element) {
              element = document.createElement("meta");
              element.setAttribute(isProperty ? "property" : "name", name);
              document.head.appendChild(element);
            }
            element.setAttribute("content", content);
          } else if (element) {
            element.remove();
          }
        };

        updateMeta("description", description);
        updateMeta("keywords", keywords);
        updateMeta("robots", robots);
        updateMeta("og:title", ogTitle, true);
        updateMeta("og:description", ogDescription, true);
        updateMeta("og:type", "website", true);
        if (ogImage) {
          updateMeta("og:image", ogImage, true);
        }

        // Canonical
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalUrl) {
          if (!canonicalLink) {
            canonicalLink = document.createElement("link");
            canonicalLink.setAttribute("rel", "canonical");
            document.head.appendChild(canonicalLink);
          }
          canonicalLink.setAttribute("href", canonicalUrl);
        } else if (canonicalLink) {
          canonicalLink.remove();
        }
      } catch (error) {
        console.error("Error applying dynamic SEO:", error);
      }
    }

    applySeo();
  }, [route, siteData]);

  return null;
}
