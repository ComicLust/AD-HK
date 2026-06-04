"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Globe, CheckCircle, Info } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface SeoFormProps {
  entityType: "Service" | "BlogPost" | "Video" | "Page";
  entityId: string;
}

export default function SeoForm({ entityType, entityId }: SeoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [keywords, setKeywords] = useState("");
  const [robots, setRobots] = useState("index, follow");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadSeo() {
      if (!entityId) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/seo-meta?entityType=${entityType}&entityId=${entityId}`);
        const data = await res.json();
        if (data) {
          setTitle(data.title || "");
          setDescription(data.description || "");
          setCanonicalUrl(data.canonicalUrl || "");
          setOgTitle(data.ogTitle || "");
          setOgDescription(data.ogDescription || "");
          setOgImage(data.ogImage || "");
          setRobots(data.robots || "index, follow");
          
          if (data.keywords) {
            try {
              const kwArray = JSON.parse(data.keywords);
              setKeywords(Array.isArray(kwArray) ? kwArray.join(", ") : "");
            } catch (e) {
              setKeywords(data.keywords || "");
            }
          }
        } else {
          setTitle("");
          setDescription("");
          setCanonicalUrl("");
          setOgTitle("");
          setOgDescription("");
          setOgImage("");
          setKeywords("");
          setRobots("index, follow");
        }
      } catch (error) {
        console.error("Failed to load SEO meta:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSeo();
  }, [entityType, entityId]);

  const generateCanonical = () => {
    const domain = "https://adilhukukdanismanlik.com";
    if (entityType === "Page") {
      setCanonicalUrl(`${domain}/${entityId === "home" ? "" : entityId}`);
    } else if (entityType === "Service") {
      setCanonicalUrl(`${domain}/hizmetlerimiz/${entityId}`);
    } else if (entityType === "BlogPost") {
      setCanonicalUrl(`${domain}/blog/${entityId}`);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const kwArray = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k !== "");

      const res = await fetch("/api/seo-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType,
          entityId,
          title: title || null,
          description: description || null,
          canonicalUrl: canonicalUrl || null,
          ogTitle: ogTitle || null,
          ogDescription: ogDescription || null,
          ogImage: ogImage || null,
          keywords: kwArray,
          robots: robots || "index, follow",
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("SEO kaydedilemedi.");
      }
    } catch (error) {
      console.error("SEO save error:", error);
      alert("SEO kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const getSeoScore = () => {
    let score = 0;
    if (title && title.length >= 30 && title.length <= 60) score += 30;
    else if (title && title.length > 0) score += 15;

    if (description && description.length >= 120 && description.length <= 160) score += 30;
    else if (description && description.length > 0) score += 15;

    if (canonicalUrl) score += 15;
    if (ogImage) score += 15;
    if (keywords && keywords.length > 0) score += 10;

    return score;
  };

  const score = getSeoScore();
  const scoreColor = score >= 80 ? "text-[#34C759]" : score >= 50 ? "text-[#FF9500]" : "text-[#FF3B30]";
  const scoreBg = score >= 80 ? "bg-[#34C759]/10 border-[#34C759]/20" : score >= 50 ? "bg-[#FF9500]/10 border-[#FF9500]/20" : "bg-[#FF3B30]/10 border-[#FF3B30]/20";

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-2xl border ${scoreBg} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-slate-500" />
          <div>
            <h4 className="text-sm font-bold text-[#1D1D1F]">SEO Kalite Puanı</h4>
            <p className="text-xs text-[#86868B]">İçeriğin arama motoru optimizasyonu seviyesi</p>
          </div>
        </div>
        <div className={`text-2xl font-extrabold ${scoreColor}`}>
          %{score}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#1D1D1F] block mb-1.5">Meta Başlığı (Title)</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Arama sonuçlarında görünecek başlık"
              className="rounded-xl border-[#D1D1D6] text-sm focus:ring-[#007AFF] focus:border-[#007AFF]"
            />
            <div className="flex justify-between mt-1 px-1">
              <span className="text-[10px] text-[#86868B]">Önerilen: 50-60 karakter</span>
              <span className={`text-[10px] font-bold ${title.length >= 30 && title.length <= 60 ? "text-[#34C759]" : "text-[#FF9500]"}`}>
                {title.length} karakter
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#1D1D1F] block mb-1.5">Meta Açıklaması (Description)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Arama sonuçlarında görünecek kısa özet açıklama"
              rows={3}
              className="rounded-xl border-[#D1D1D6] text-sm focus:ring-[#007AFF] focus:border-[#007AFF] resize-none"
            />
            <div className="flex justify-between mt-1 px-1">
              <span className="text-[10px] text-[#86868B]">Önerilen: 120-160 karakter</span>
              <span className={`text-[10px] font-bold ${description.length >= 120 && description.length <= 160 ? "text-[#34C759]" : "text-[#FF9500]"}`}>
                {description.length} karakter
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#1D1D1F] block mb-1.5">Canonical URL (Özgün URL)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                <Input
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://..."
                  className="pl-10 rounded-xl border-[#D1D1D6] text-sm focus:ring-[#007AFF] focus:border-[#007AFF]"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generateCanonical}
                className="rounded-xl border-[#D1D1D6] text-xs h-11"
              >
                Otomatik Üret
              </Button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#1D1D1F] block mb-1.5">Anahtar Kelimeler (Keywords)</label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="avukat, ceza davası, boşanma dilekçesi"
              className="rounded-xl border-[#D1D1D6] text-sm focus:ring-[#007AFF] focus:border-[#007AFF]"
            />
            <span className="text-[10px] text-[#86868B] block mt-1 px-1">Virgülle ayırarak giriniz.</span>
          </div>

          <div>
            <label className="text-xs font-bold text-[#1D1D1F] block mb-1.5">Robots Ayarları</label>
            <select
              value={robots}
              onChange={(e) => setRobots(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#D1D1D6] bg-white text-sm focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
            >
              <option value="index, follow">Index, Follow (Varsayılan)</option>
              <option value="noindex, follow">Noindex, Follow (Aramadan Gizle)</option>
              <option value="index, nofollow">Index, Nofollow (Bağlantıları Takip Etme)</option>
              <option value="noindex, nofollow">Noindex, Nofollow (Tamamen Kapat)</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 bg-[#F2F2F7]/40 p-4 rounded-2xl border border-[#D1D1D6]/40">
          <h4 className="text-sm font-bold text-[#1D1D1F] mb-2">Sosyal Medya (Open Graph)</h4>
          
          <div>
            <label className="text-xs font-bold text-[#1D1D1F] block mb-1.5">OG Başlığı (OG Title)</label>
            <Input
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              placeholder="Boş bırakılırsa Meta Başlığı kullanılır"
              className="rounded-xl border-[#D1D1D6] text-sm bg-white focus:ring-[#007AFF]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#1D1D1F] block mb-1.5">OG Açıklaması (OG Description)</label>
            <Textarea
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              placeholder="Boş bırakılırsa Meta Açıklaması kullanılır"
              rows={2}
              className="rounded-xl border-[#D1D1D6] text-sm bg-white focus:ring-[#007AFF] resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#1D1D1F] block mb-1.5">Sosyal Paylaşım Görseli (OG Image)</label>
            <ImageUploader value={ogImage} onChange={setOgImage} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-[#D1D1D6] pt-4">
        <Button
          onClick={handleSave}
          disabled={isSaving || !entityId}
          className="rounded-full px-6 py-2.5 bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold"
        >
          {isSaving ? "Kaydediliyor..." : "SEO Ayarlarını Kaydet"}
        </Button>
        {saveSuccess && (
          <div className="flex items-center gap-1.5 text-[#34C759] text-sm font-semibold select-none">
            <CheckCircle className="w-4 h-4" />
            Başarıyla kaydedildi
          </div>
        )}
      </div>
    </div>
  );
}
