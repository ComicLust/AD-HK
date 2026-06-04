"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as staticData from "@/data/siteData";

type SiteData = typeof staticData & {
  videos: any[];
  contactData: { mapEmbedUrl: string; officeHours: string };
  basindaBizItems?: any[];
  ornekDilekceler?: any[];
  translations?: Record<string, { tr: string; en: string }>;
  useFallback?: boolean;
};

const SiteDataContext = createContext<SiteData | null>(null);
const LanguageContext = createContext<{
  language: "tr" | "en";
  setLanguage: (lang: "tr" | "en") => void;
} | null>(null);

interface ProviderProps {
  children: React.ReactNode;
  initialData: SiteData;
}

let refreshTrigger: (() => void) | null = null;

export function SiteDataProvider({ children, initialData }: ProviderProps) {
  const [data, setData] = useState<SiteData>(initialData);

  const fetchUpdatedData = useCallback(async () => {
    try {
      const res = await fetch("/api/public/site-data");
      const json = await res.json();
      if (json && !json.useFallback) {
        setData(json);
      }
    } catch (e) {
      console.error("Failed to refresh site data:", e);
    }
  }, []);

  useEffect(() => {
    refreshTrigger = fetchUpdatedData;
    return () => {
      refreshTrigger = null;
    };
  }, [fetchUpdatedData]);

  return (
    <SiteDataContext.Provider value={data}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<"tr" | "en">("tr");

  useEffect(() => {
    const saved = localStorage.getItem("language") as "tr" | "en" | null;
    if (saved && (saved === "tr" || saved === "en")) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang: "tr" | "en") => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return { language: "tr" as const, setLanguage: () => {} };
  }
  return context;
}

export function useTranslation() {
  const { language } = useLanguage();
  const siteData = useSiteData();

  const t = useCallback((key: string, fallback?: string): string => {
    if (siteData.translations && siteData.translations[key]) {
      return siteData.translations[key][language] || fallback || key;
    }
    return fallback || key;
  }, [siteData.translations, language]);

  return { t, language };
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) {
    return {
      ...staticData,
      videos: [],
      basindaBizItems: [],
      ornekDilekceler: [],
      translations: {},
      contactData: {
        mapEmbedUrl: "https://maps.google.com/maps?q=Florya+Senlik+Koy+Mah+Saci+Sokak+No+4+F+Bakirkoy+Istanbul&t=&z=15&ie=UTF8&iwloc=&output=embed",
        officeHours: "Pzt - Cum: 09:00 - 18:00",
      }
    } as any;
  }
  return context;
}

export function refreshSiteData() {
  if (refreshTrigger) {
    refreshTrigger();
  }
}
