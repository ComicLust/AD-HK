"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Globe2, Save, Loader2 } from "lucide-react";

interface TranslationItem {
  id: string;
  key: string;
  tr: string;
  en: string;
}

export default function TranslationsPage() {
  const [translations, setTranslations] = useState<TranslationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadTranslations();
  }, []);

  const loadTranslations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/translations");
      const data = await res.json();
      if (Array.isArray(data)) {
        setTranslations(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (id: string, field: "tr" | "en", value: string) => {
    setTranslations((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // Save each translation item sequentially or in parallel
      await Promise.all(
        translations.map((item) =>
          fetch("/api/translations", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          })
        )
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadTranslations();
    } catch (err) {
      console.error(err);
      alert("Çeviriler kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  // Group translations logically for easy editing
  const menuTranslations = translations.filter((t) => t.key.startsWith("nav."));
  const contactTranslations = translations.filter((t) => t.key.startsWith("contact."));
  const footerTranslations = translations.filter((t) => t.key.startsWith("footer."));
  const otherTranslations = translations.filter(
    (t) => !t.key.startsWith("nav.") && !t.key.startsWith("contact.") && !t.key.startsWith("footer.")
  );

  const renderSection = (title: string, description: string, items: TranslationItem[]) => {
    if (items.length === 0) return null;

    return (
      <Card className="rounded-3xl border-[#D1D1D6] shadow-sm bg-white dark:bg-card overflow-hidden mb-6">
        <CardHeader className="border-b border-[#E5E5EA] dark:border-border bg-slate-50/50 dark:bg-slate-900/50 py-4 px-6">
          <CardTitle className="text-sm font-bold text-[#1D1D1F] dark:text-foreground">{title}</CardTitle>
          <CardDescription className="text-[11px]">{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pb-4 border-b border-slate-100 last:border-b-0 last:pb-0">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block">{item.key}</span>
                <label className="text-xs font-bold text-[#1D1D1F] dark:text-foreground">Türkçe (TR)</label>
                <Input
                  value={item.tr}
                  onChange={(e) => handleInputChange(item.id, "tr", e.target.value)}
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] bg-white dark:bg-[#1C1C1E] text-xs h-9"
                />
              </div>
              <div className="space-y-1 md:pt-4">
                <label className="text-xs font-bold text-[#1D1D1F] dark:text-foreground">İngilizce (EN)</label>
                <Input
                  value={item.en}
                  onChange={(e) => handleInputChange(item.id, "en", e.target.value)}
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] bg-white dark:bg-[#1C1C1E] text-xs h-9"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1D1D1F] dark:text-foreground flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-[#007AFF]" />
            Kolay Çoklu Dil Çevirileri
          </h2>
          <p className="text-xs text-[#86868B]">
            Sitenin butonlarını, formlarını ve menülerini tek bir ekrandan kolayca Türkçe ve İngilizce dillerine çevirin.
          </p>
        </div>
        <Button
          onClick={handleSaveAll}
          disabled={isSaving || isLoading}
          className="rounded-full px-6 bg-[#007AFF] hover:bg-[#0066D6] text-white text-xs font-semibold h-10 self-start sm:self-center shadow-apple flex items-center gap-1.5"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Tüm Çevirileri Kaydet
            </>
          )}
        </Button>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-1.5 text-[#34C759] text-xs font-bold bg-[#34C759]/10 p-3.5 rounded-2xl border border-[#34C759]/20">
          <CheckCircle className="w-4.5 h-4.5" /> Tüm çeviriler başarıyla güncellendi! Sitede anında aktif olacaktır.
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
        </div>
      ) : (
        <div className="pb-10">
          {renderSection(
            "Navigasyon Menüsü Çevirileri",
            "Menüde ve sayfa başlıklarında yer alan bağlantı isimleri",
            menuTranslations
          )}
          {renderSection(
            "İletişim Formu & Buton Çevirileri",
            "Bize Ulaşın formu etiketleri, placeholders ve buton metinleri",
            contactTranslations
          )}
          {renderSection(
            "Footer & Genel Metin Çevirileri",
            "Sitenin en altındaki telif hakları, firma açıklaması ve diğer kelimeler",
            footerTranslations
          )}
          {renderSection(
            "Diğer Site Metinleri",
            "Yukarıdaki gruplara dahil olmayan çeviri anahtarları",
            otherTranslations
          )}
        </div>
      )}
    </div>
  );
}
