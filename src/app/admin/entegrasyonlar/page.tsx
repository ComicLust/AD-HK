"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, Settings, Eye, HelpCircle } from "lucide-react";

export default function IntegrationPage() {
  const [googleAnalytics, setGoogleAnalytics] = useState("");
  const [searchConsole, setSearchConsole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/integration-settings");
      if (res.ok) {
        const data = await res.json();
        setGoogleAnalytics(data.googleAnalytics || "");
        setSearchConsole(data.searchConsole || "");
      }
    } catch (e) {
      console.error("Failed to load integrations:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/integration-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleAnalytics, searchConsole })
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Entegrasyon ayarları kaydedilemedi.");
      }
    } catch (e) {
      console.error(e);
      alert("Hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl select-none">
      <Card className="rounded-3xl border-[#D1D1D6] shadow-sm bg-white dark:bg-card overflow-hidden">
        <CardHeader className="border-b border-[#E5E5EA] dark:border-border">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#007AFF]" />
            <CardTitle className="text-base font-bold text-[#1D1D1F] dark:text-foreground">Analitik & Entegrasyon Ayarları</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Google Analytics 4 takip kimliğini ve Google Search Console doğrulama meta etiketlerini yönetin.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Google Analytics */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1D1D1F] dark:text-foreground flex items-center gap-1.5">
                    Google Analytics 4 (GA4) Ölçüm Kimliği
                  </label>
                  <span className="text-[10px] text-[#86868B]">Örn: G-XXXXXXXXXX</span>
                </div>
                <Input
                  value={googleAnalytics}
                  onChange={(e) => setGoogleAnalytics(e.target.value)}
                  placeholder="G-BileşenKimliği"
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] bg-white dark:bg-[#1C1C1E] text-xs h-10"
                />
                <p className="text-[10px] text-[#86868B] flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Sitedeki sayfa ziyaretlerini ve tıklamaları Google Analytics platformuna göndermek için GA4 Ölçüm Kimliğini girin.
                </p>
              </div>

              {/* Google Search Console */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1D1D1F] dark:text-foreground">
                    Google Search Console Doğrulama Kodu / Meta Etiketi
                  </label>
                  <span className="text-[10px] text-[#86868B]">Örn: google-site-verification değeri</span>
                </div>
                <Input
                  value={searchConsole}
                  onChange={(e) => setSearchConsole(e.target.value)}
                  placeholder="google-site-verification=..."
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] bg-white dark:bg-[#1C1C1E] text-xs h-10"
                />
                <p className="text-[10px] text-[#86868B] flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Site mülkiyetini doğrulamak için Google Search Console tarafından verilen meta etiketi içeriğini veya doğrulama kodunu girin.
                </p>
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-[#34C759] text-xs font-semibold">
                  <CheckCircle className="w-4.5 h-4.5" /> Entegrasyon ayarları başarıyla güncellendi!
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-[#E5E5EA] dark:border-border">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-full px-6 bg-[#007AFF] hover:bg-[#0066D6] text-white text-xs font-semibold h-10"
                >
                  {isSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
