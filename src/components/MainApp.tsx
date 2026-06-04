"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "@/hooks/useRouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAB from "@/components/FAB";
import HomePage from "@/components/pages/HomePage";
import AboutPage from "@/components/pages/AboutPage";
import ServicesPage from "@/components/pages/ServicesPage";
import ServiceDetailPage from "@/components/pages/ServiceDetailPage";
import TeamPage from "@/components/pages/TeamPage";
import MediaPage from "@/components/pages/MediaPage";
import ContactPage from "@/components/pages/ContactPage";
import KVKKPage from "@/components/pages/KVKKPage";
import CookiePage from "@/components/pages/CookiePage";
import JoinUsPage from "@/components/pages/JoinUsPage";
import BlogListPage from "@/components/pages/BlogListPage";
import BlogDetailPage from "@/components/pages/BlogDetailPage";
import DilekcePage from "@/components/pages/DilekcePage";
import PageSeo from "@/components/PageSeo";
import { SiteDataProvider, LanguageProvider } from "@/hooks/useSiteData";

export default function MainApp({ initialData }: { initialData: any }) {
  const { route, navigate } = useRouter();
  const [mediaTab, setMediaTab] = useState<string>("basinda");

  useEffect(() => {
    // 1. Log pageview locally
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "pageview", path: route })
    }).catch((e) => console.warn("Failed local analytic log:", e));

    // 2. Track in GA if loaded
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", (window as any).gaId || "", {
        page_path: route
      });
    }
  }, [route]);

  const handleNavigateMedia = useCallback((tab: string) => {
    setMediaTab(tab);
    navigate("/medya");
  }, [navigate]);

  const renderPage = () => {
    if (route === "/") return <HomePage onNavigate={navigate} />;
    if (route === "/hakkimizda") return <AboutPage />;
    if (route === "/hizmetlerimiz") return <ServicesPage onNavigate={navigate} />;
    if (route.startsWith("/hizmetlerimiz/")) {
      const slug = route.replace("/hizmetlerimiz/", "");
      return <ServiceDetailPage slug={slug} onNavigate={navigate} />;
    }
    if (route === "/ekibimiz") return <TeamPage />;
    if (route === "/blog") return <BlogListPage onNavigate={navigate} />;
    if (route.startsWith("/blog/")) {
      const slug = route.replace("/blog/", "");
      return <BlogDetailPage slug={slug} onNavigate={navigate} />;
    }
    if (route === "/medya") return <MediaPage initialTab={mediaTab} onNavigate={navigate} />;
    if (route === "/iletisim") return <ContactPage />;
    if (route === "/kvkk") return <KVKKPage />;
    if (route === "/cerez-politikasi") return <CookiePage />;
    if (route === "/ornek-dilekceler") return <DilekcePage />;
    if (route === "/bize-katilin") return <JoinUsPage />;

    // 404
    return (
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl font-extrabold text-[#1D1D1F]">404</h1>
        <p className="mt-4 text-[#86868B]">Aradığınız sayfa bulunamadı.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2.5 rounded-full bg-[#007AFF] text-white font-semibold hover:bg-[#0066D6] transition-colors"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    );
  };

  return (
    <SiteDataProvider initialData={initialData}>
      <LanguageProvider>
        <div className="min-h-screen flex flex-col">
          <PageSeo route={route} />
          <Navbar currentRoute={route} onNavigate={navigate} onNavigateMedia={handleNavigateMedia} />
          <main className="flex-1 pt-16">{renderPage()}</main>
          <Footer onNavigate={navigate} />
          <FAB />
        </div>
      </LanguageProvider>
    </SiteDataProvider>
  );
}
