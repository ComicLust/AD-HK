"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Layers, CheckCircle, HelpCircle, FileText, HeartHandshake, Compass } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SeoForm from "@/components/admin/SeoForm";

interface PageDb {
  id: string;
  pageType: string;
  content: string;
}

export default function PagesContentPage() {
  const [selectedPage, setSelectedPage] = useState<"about" | "contact" | "home" | "kvkk" | "cookie" | "joinus">("about");
  const [pagesData, setPagesData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/pages");
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped: Record<string, any> = {};
        data.forEach((p: PageDb) => {
          try {
            mapped[p.pageType] = JSON.parse(p.content);
          } catch (e) {
            mapped[p.pageType] = {};
          }
        });
        setPagesData(mapped);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getPageData = (type: string) => {
    return pagesData[type] || {};
  };

  const updatePageData = (type: string, field: string, value: any) => {
    setPagesData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const content = pagesData[selectedPage];
      const res = await fetch("/api/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageType: selectedPage,
          content: JSON.stringify(content),
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Sayfa kaydedilemedi.");
      }
    } catch (e) {
      console.error(e);
      alert("Hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
      </div>
    );
  }

  // --- 1. Hakkımızda Form ---
  const RenderAboutForm = () => {
    const data = getPageData("about");
    
    // Ensure lists and structures are defaulted if empty
    const bullets = data.bullets || [
      "Stratejik ve etkin dava takibi",
      "Uyuşmazlıkların önleyici danışmanlık ile çözümü",
      "Hızlı iletişim ve şeffaf bilgilendirme",
      "Tam zamanlı destek ve titiz dosya yönetimi"
    ];

    const bentoTitles = data.bentoTitles || [
      "Stratejik Dava Takibi",
      "Hızlı & Net İletişim",
      "Şeffaf Raporlama",
      "Sonuç Odaklı Süreç"
    ];

    const stats = data.stats || [
      { value: "15+ Yıl", label: "Tecrübe & Deneyim" },
      { value: "Yüzlerce", label: "Başarılı Sonuçlanan Dosya" },
      { value: "7/24", label: "Şeffaf İletişim Desteği" }
    ];

    const handleAddBullet = () => {
      updatePageData("about", "bullets", [...bullets, ""]);
      updatePageData("about", "bentoTitles", [...bentoTitles, "Yeni İlke"]);
    };

    const handleRemoveBullet = (idx: number) => {
      updatePageData("about", "bullets", bullets.filter((_: any, i: number) => i !== idx));
      updatePageData("about", "bentoTitles", bentoTitles.filter((_: any, i: number) => i !== idx));
    };

    const handleBulletChange = (idx: number, val: string) => {
      const updated = [...bullets];
      updated[idx] = val;
      updatePageData("about", "bullets", updated);
    };

    const handleBentoTitleChange = (idx: number, val: string) => {
      const updated = [...bentoTitles];
      updated[idx] = val;
      updatePageData("about", "bentoTitles", updated);
    };

    const handleStatChange = (idx: number, field: "value" | "label", val: string) => {
      const updated = [...stats];
      updated[idx] = {
        ...updated[idx],
        [field]: val
      };
      updatePageData("about", "stats", updated);
    };

    return (
      <div className="space-y-6">
        <div className="space-y-4 p-4 bg-[#F2F2F7]/40 rounded-2xl border border-[#D1D1D6]/40">
          <span className="text-xs font-bold text-[#007AFF] uppercase tracking-wider block">Giriş & Başlık Ayarları</span>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1D1F]">Ana Başlık (H1)</label>
            <Input
              value={data.title !== undefined ? data.title : "Sadece Hukuk Değil, Güven İnşa Ediyoruz."}
              onChange={(e) => updatePageData("about", "title", e.target.value)}
              className="rounded-xl border-[#D1D1D6] bg-white focus:ring-[#007AFF]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1D1F]">Giriş Metni (Intro)</label>
            <Textarea
              value={data.intro !== undefined ? data.intro : "Adil Hukuk Danışmanlık Bürosu olarak..."}
              onChange={(e) => updatePageData("about", "intro", e.target.value)}
              rows={3}
              className="rounded-xl border-[#D1D1D6] bg-white focus:ring-[#007AFF] resize-none text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1D1F]">Gövde Metni (Body)</label>
            <Textarea
              value={data.body !== undefined ? data.body : ""}
              onChange={(e) => updatePageData("about", "body", e.target.value)}
              rows={4}
              className="rounded-xl border-[#D1D1D6] bg-white focus:ring-[#007AFF] resize-none text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1D1F]">Kapanış Metni (Closing)</label>
            <Textarea
              value={data.closing !== undefined ? data.closing : ""}
              onChange={(e) => updatePageData("about", "closing", e.target.value)}
              rows={3}
              className="rounded-xl border-[#D1D1D6] bg-white focus:ring-[#007AFF] resize-none text-sm"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-4 p-4 bg-[#F2F2F7]/40 rounded-2xl border border-[#D1D1D6]/40">
          <span className="text-xs font-bold text-[#007AFF] uppercase tracking-wider block">Rakamlarla Güven Sinyalleri (İstatistikler)</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat: any, idx: number) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-[#D1D1D6]/60 space-y-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#1D1D1F]">İstatistik Değeri {idx + 1}</label>
                  <Input
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                    placeholder="Örn: 15+ Yıl"
                    className="rounded-lg h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#1D1D1F]">İstatistik Açıklaması {idx + 1}</label>
                  <Input
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                    placeholder="Örn: Tecrübe & Deneyim"
                    className="rounded-lg h-9 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Box Section */}
        <div className="space-y-4 p-4 bg-[#F2F2F7]/40 rounded-2xl border border-[#D1D1D6]/40">
          <span className="text-xs font-bold text-[#007AFF] uppercase tracking-wider block">Çözüm Odaklı İlkeler (Bento Box Grid)</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">Bölüm Başlığı</label>
              <Input
                value={data.bentoSectionTitle !== undefined ? data.bentoSectionTitle : "Çözüm Odaklı İlkelerimiz"}
                onChange={(e) => updatePageData("about", "bentoSectionTitle", e.target.value)}
                className="rounded-xl border-[#D1D1D6] bg-white focus:ring-[#007AFF]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">Bölüm Açıklaması</label>
              <Input
                value={data.bentoSectionDesc !== undefined ? data.bentoSectionDesc : "Müvekkillerimize sunduğumuz hizmet kalitesinin temel taşları."}
                onChange={(e) => updatePageData("about", "bentoSectionDesc", e.target.value)}
                className="rounded-xl border-[#D1D1D6] bg-white focus:ring-[#007AFF]"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1D1D1F]">Bento Kutuları İçeriği</label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddBullet} className="rounded-lg text-xs py-1 h-8 bg-white">
                <Plus className="w-3.5 h-3.5 mr-1" /> İlke Kartı Ekle
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {bullets.map((bullet: string, idx: number) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-[#D1D1D6]/60 relative group space-y-2">
                  {bullets.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBullet(idx)}
                      className="absolute top-2 right-2 text-[#FF3B30] hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1 space-y-1">
                      <label className="text-[10px] font-bold text-[#1D1D1F]">Kutu Başlığı {idx + 1}</label>
                      <Input
                        value={bentoTitles[idx] || ""}
                        onChange={(e) => handleBentoTitleChange(idx, e.target.value)}
                        placeholder={`Kutu ${idx + 1} Başlığı`}
                        className="rounded-lg h-9 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-[#1D1D1F]">Kutu Kısa Açıklaması {idx + 1}</label>
                      <Input
                        value={bullet}
                        onChange={(e) => handleBulletChange(idx, e.target.value)}
                        placeholder={`Kutu ${idx + 1} Açıklaması`}
                        className="rounded-lg h-9 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="space-y-4 p-4 bg-[#F2F2F7]/40 rounded-2xl border border-[#D1D1D6]/40">
          <span className="text-xs font-bold text-[#007AFF] uppercase tracking-wider block">Vizyon Bölümü Ayarları</span>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1D1F]">Vizyon Bölüm Başlığı</label>
            <Input
              value={data.visionTitle !== undefined ? data.visionTitle : "Geleceğin Güvenilir Hukuk Kılavuzu"}
              onChange={(e) => updatePageData("about", "visionTitle", e.target.value)}
              className="rounded-xl border-[#D1D1D6] bg-white focus:ring-[#007AFF]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1D1F]">Vizyon Metni</label>
            <Textarea
              value={data.vision !== undefined ? data.vision : ""}
              onChange={(e) => updatePageData("about", "vision", e.target.value)}
              rows={3}
              className="rounded-xl border-[#D1D1D6] bg-white focus:ring-[#007AFF] resize-none text-sm"
            />
          </div>
        </div>
      </div>
    );
  };

  // --- 2. İletişim Form ---
  const RenderContactForm = () => {
    const data = getPageData("contact");

    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1D1D1F]">Google Maps Harita Embed URL</label>
          <Input
            value={data.mapEmbedUrl || ""}
            onChange={(e) => updatePageData("contact", "mapEmbedUrl", e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1D1D1F]">Çalışma Saatleri</label>
          <Input
            value={data.officeHours || ""}
            onChange={(e) => updatePageData("contact", "officeHours", e.target.value)}
            placeholder="Pzt - Cum: 09:00 - 18:00"
            className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
          />
        </div>
      </div>
    );
  };

  // --- 3. Bize Katılın Form ---
  const RenderJoinUsForm = () => {
    const data = getPageData("joinus");
    const requirements = data.requirements || [];

    const handleAddReq = () => {
      updatePageData("joinus", "requirements", [...requirements, ""]);
    };

    const handleRemoveReq = (idx: number) => {
      updatePageData("joinus", "requirements", requirements.filter((_: any, i: number) => i !== idx));
    };

    const handleReqChange = (idx: number, val: string) => {
      const updated = [...requirements];
      updated[idx] = val;
      updatePageData("joinus", "requirements", updated);
    };

    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1D1D1F]">Sayfa Başlığı</label>
          <Input
            value={data.title || ""}
            onChange={(e) => updatePageData("joinus", "title", e.target.value)}
            className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1D1D1F]">Giriş Metni (Intro)</label>
          <Textarea
            value={data.intro || ""}
            onChange={(e) => updatePageData("joinus", "intro", e.target.value)}
            rows={3}
            className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] resize-none text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1D1D1F]">Başvuru Notu</label>
          <Textarea
            value={data.note || ""}
            onChange={(e) => updatePageData("joinus", "note", e.target.value)}
            rows={3}
            className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] resize-none text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1D1D1F]">TOEFL / IELTS Sınav Notu Hatırlatması</label>
          <Input
            value={data.toeftNote || ""}
            onChange={(e) => updatePageData("joinus", "toeftNote", e.target.value)}
            className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
          />
        </div>

        {/* Requirements */}
        <div className="space-y-3 bg-[#F2F2F7]/50 p-4 rounded-2xl border border-[#D1D1D6]/40">
          <div className="flex items-center justify-between mb-1 select-none">
            <label className="text-xs font-bold text-[#1D1D1F]">Adaylarda Aranan Şartlar</label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddReq} className="rounded-lg text-xs py-1 h-8">
              <Plus className="w-3.5 h-3.5 mr-1" /> Şart Ekle
            </Button>
          </div>
          {requirements.map((req: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={req}
                onChange={(e) => handleReqChange(idx, e.target.value)}
                placeholder={`Gereksinim ${idx + 1}`}
                className="rounded-xl border-[#D1D1D6] bg-white focus:ring-[#007AFF]"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveReq(idx)} className="text-[#FF3B30] hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {requirements.length === 0 && <span className="text-xs text-[#86868B] italic">Kayıtlı şart bulunmamaktadır.</span>}
        </div>
      </div>
    );
  };

  // --- 4. KVKK & Çerez Politikası Form ---
  const RenderPolicyForm = (type: "kvkk" | "cookie") => {
    const data = getPageData(type);
    const sections = data.sections || [];

    const handleAddSection = () => {
      updatePageData(type, "sections", [...sections, { title: "", content: "" }]);
    };

    const handleRemoveSection = (idx: number) => {
      updatePageData(type, "sections", sections.filter((_: any, i: number) => i !== idx));
    };

    const handleSectionChange = (idx: number, field: "title" | "content", val: string) => {
      const updated = [...sections];
      updated[idx] = {
        ...updated[idx],
        [field]: val,
      };
      updatePageData(type, "sections", updated);
    };

    return (
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1D1D1F]">Sayfa Başlığı</label>
          <Input
            value={data.title || ""}
            onChange={(e) => updatePageData(type, "title", e.target.value)}
            className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
          />
        </div>

        {/* Sections list */}
        <div className="space-y-5">
          <div className="flex items-center justify-between select-none">
            <h4 className="text-sm font-bold text-[#1D1D1F]">Politika Paragraf ve Bölümleri</h4>
            <Button type="button" variant="outline" size="sm" onClick={handleAddSection} className="rounded-lg text-xs py-1 h-8">
              <Plus className="w-3.5 h-3.5 mr-1" /> Yeni Bölüm Ekle
            </Button>
          </div>

          <div className="space-y-4">
            {sections.map((section: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#F2F2F7]/50 border border-[#D1D1D6]/40 space-y-3 relative group">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveSection(idx)}
                  className="absolute top-2 right-2 text-[#FF3B30] hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#1D1D1F]">Bölüm Başlığı {idx + 1}</label>
                  <Input
                    value={section.title || ""}
                    onChange={(e) => handleSectionChange(idx, "title", e.target.value)}
                    placeholder="Bölüm başlığını yazın"
                    className="rounded-xl border-[#D1D1D6] bg-white focus:ring-[#007AFF] pr-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#1D1D1F]">Bölüm İçeriği {idx + 1}</label>
                  <Textarea
                    value={section.content || ""}
                    onChange={(e) => handleSectionChange(idx, "content", e.target.value)}
                    placeholder="Bölümün detaylı açıklama metnini yazın..."
                    rows={4}
                    className="rounded-xl border-[#D1D1D6] bg-white focus:ring-[#007AFF] resize-none text-xs"
                  />
                </div>
              </div>
            ))}
            {sections.length === 0 && <span className="text-xs text-[#86868B] italic block text-center py-4">Kayıtlı bölüm bulunamadı.</span>}
          </div>
        </div>
      </div>
    );
  };

  // --- 5. Ana Sayfa (Home) Form ---
  const RenderHomeForm = () => {
    const data = getPageData("home");
    
    // Testimonials
    const testimonials = data.testimonials || [];
    const handleAddTestimonial = () => {
      updatePageData("home", "testimonials", [...testimonials, { name: "", role: "", text: "", initials: "" }]);
    };
    const handleRemoveTestimonial = (idx: number) => {
      updatePageData("home", "testimonials", testimonials.filter((_: any, i: number) => i !== idx));
    };
    const handleTestimonialChange = (idx: number, field: string, val: string) => {
      const updated = [...testimonials];
      updated[idx] = { ...updated[idx], [field]: val };
      // auto initials
      if (field === "name" && val) {
        updated[idx].initials = val.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
      }
      updatePageData("home", "testimonials", updated);
    };

    // SSS (FAQs)
    const faqItems = data.faqItems || [];
    const handleAddFaq = () => {
      updatePageData("home", "faqItems", [...faqItems, { question: "", answer: "" }]);
    };
    const handleRemoveFaq = (idx: number) => {
      updatePageData("home", "faqItems", faqItems.filter((_: any, i: number) => i !== idx));
    };
    const handleFaqChange = (idx: number, field: "question" | "answer", val: string) => {
      const updated = [...faqItems];
      updated[idx] = { ...updated[idx], [field]: val };
      updatePageData("home", "faqItems", updated);
    };

    // Hero Slides (Sliders)
    const heroSlides = data.heroSlides || [];
    const handleAddSlide = () => {
      updatePageData("home", "heroSlides", [...heroSlides, { title: "", subtitle: "", cta: "", ctaLink: "" }]);
    };
    const handleRemoveSlide = (idx: number) => {
      updatePageData("home", "heroSlides", heroSlides.filter((_: any, i: number) => i !== idx));
    };
    const handleSlideChange = (idx: number, field: string, val: string) => {
      const updated = [...heroSlides];
      updated[idx] = { ...updated[idx], [field]: val };
      updatePageData("home", "heroSlides", updated);
    };

    // Features (Cards below hero)
    const features = data.features || [];
    const handleAddFeature = () => {
      updatePageData("home", "features", [...features, { title: "", description: "", icon: "Scale" }]);
    };
    const handleRemoveFeature = (idx: number) => {
      updatePageData("home", "features", features.filter((_: any, i: number) => i !== idx));
    };
    const handleFeatureChange = (idx: number, field: string, val: string) => {
      const updated = [...features];
      updated[idx] = { ...updated[idx], [field]: val };
      updatePageData("home", "features", updated);
    };

    // Why Us (Neden Biz)
    const whyUs = data.whyUs || [];
    const handleAddWhyUs = () => {
      updatePageData("home", "whyUs", [...whyUs, { title: "", description: "", icon: "Award" }]);
    };
    const handleRemoveWhyUs = (idx: number) => {
      updatePageData("home", "whyUs", whyUs.filter((_: any, i: number) => i !== idx));
    };
    const handleWhyUsChange = (idx: number, field: string, val: string) => {
      const updated = [...whyUs];
      updated[idx] = { ...updated[idx], [field]: val };
      updatePageData("home", "whyUs", updated);
    };

    return (
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="p-4 rounded-2xl bg-[#F2F2F7]/40 border border-[#D1D1D6]/40 space-y-4">
          <h4 className="text-xs font-extrabold text-[#007AFF] uppercase tracking-wider mb-2">Giriş Bölümü (Hero Section)</h4>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1D1F]">Giriş Başlığı</label>
            <Input
              value={data.hero?.title || ""}
              onChange={(e) => updatePageData("home", "hero", { ...data.hero, title: e.target.value })}
              className="rounded-xl border-[#D1D1D6] bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1D1F]">Giriş Alt Başlığı</label>
            <Input
              value={data.hero?.subtitle || ""}
              onChange={(e) => updatePageData("home", "hero", { ...data.hero, subtitle: e.target.value })}
              className="rounded-xl border-[#D1D1D6] bg-white"
            />
          </div>
        </div>

        {/* Hero Slides (Sliders) */}
        <div className="space-y-3 bg-[#F2F2F7]/20 p-4 rounded-2xl border border-[#D1D1D6]/40">
          <div className="flex items-center justify-between mb-1 select-none">
            <label className="text-xs font-bold text-[#1D1D1F]">Giriş Slaytları (Sliders)</label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddSlide} className="rounded-lg text-xs py-1 h-8 bg-white">
              <Plus className="w-3.5 h-3.5 mr-1" /> Slayt Ekle
            </Button>
          </div>
          <div className="space-y-3">
            {heroSlides.map((slide: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-[#D1D1D6]/60 relative group space-y-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveSlide(idx)}
                  className="absolute top-2 right-2 text-[#FF3B30] hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#1D1D1F]">Slayt Başlığı</label>
                    <Input
                      value={slide.title || ""}
                      onChange={(e) => handleSlideChange(idx, "title", e.target.value)}
                      className="rounded-xl border-[#D1D1D6] h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#1D1D1F]">Slayt Alt Başlığı / Açıklaması</label>
                    <Textarea
                      value={slide.subtitle || ""}
                      onChange={(e) => handleSlideChange(idx, "subtitle", e.target.value)}
                      rows={2}
                      className="rounded-xl border-[#D1D1D6] resize-none text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#1D1D1F]">Buton Yazısı (CTA)</label>
                      <Input
                        value={slide.cta || ""}
                        onChange={(e) => handleSlideChange(idx, "cta", e.target.value)}
                        className="rounded-xl border-[#D1D1D6] h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#1D1D1F]">Buton Linki (CTA Link)</label>
                      <Input
                        value={slide.ctaLink || ""}
                        onChange={(e) => handleSlideChange(idx, "ctaLink", e.target.value)}
                        className="rounded-xl border-[#D1D1D6] h-9"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {heroSlides.length === 0 && <span className="text-xs text-[#86868B] italic block text-center">Slayt bulunamadı.</span>}
          </div>
        </div>

        {/* Features / Cards */}
        <div className="space-y-3 bg-[#F2F2F7]/20 p-4 rounded-2xl border border-[#D1D1D6]/40">
          <div className="flex items-center justify-between mb-1 select-none">
            <label className="text-xs font-bold text-[#1D1D1F]">Giriş Altı Kartları (Özellikler)</label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddFeature} className="rounded-lg text-xs py-1 h-8 bg-white">
              <Plus className="w-3.5 h-3.5 mr-1" /> Kart Ekle
            </Button>
          </div>
          <div className="space-y-3">
            {features.map((feat: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-[#D1D1D6]/60 relative group space-y-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFeature(idx)}
                  className="absolute top-2 right-2 text-[#FF3B30] hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-[#1D1D1F]">Kart Başlığı</label>
                    <Input
                      value={feat.title || ""}
                      onChange={(e) => handleFeatureChange(idx, "title", e.target.value)}
                      className="rounded-xl border-[#D1D1D6] h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#1D1D1F]">İkon</label>
                    <select
                      value={feat.icon || "Scale"}
                      onChange={(e) => handleFeatureChange(idx, "icon", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-[#D1D1D6] bg-white text-xs"
                    >
                      <option value="Scale">Terazi (Scale)</option>
                      <option value="FileText">Dilekçe (FileText)</option>
                      <option value="ShieldCheck">Kalkan (ShieldCheck)</option>
                      <option value="Briefcase">Evrak Çantası (Briefcase)</option>
                      <option value="Heart">Kalp (Heart)</option>
                      <option value="Home">Ev (Home)</option>
                      <option value="Gavel">Çekiç (Gavel)</option>
                      <option value="Shield">Güvenlik (Shield)</option>
                      <option value="Landmark">Adliye (Landmark)</option>
                      <option value="Users">Ekip (Users)</option>
                      <option value="Building2">Bina (Building2)</option>
                      <option value="Wallet">Cüzdan (Wallet)</option>
                      <option value="Monitor">Ekran (Monitor)</option>
                      <option value="Globe">Dünya (Globe)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#1D1D1F]">Kart Açıklaması</label>
                  <Textarea
                    value={feat.description || ""}
                    onChange={(e) => handleFeatureChange(idx, "description", e.target.value)}
                    rows={2}
                    className="rounded-xl border-[#D1D1D6] resize-none text-xs"
                  />
                </div>
              </div>
            ))}
            {features.length === 0 && <span className="text-xs text-[#86868B] italic block text-center">Kart bulunamadı.</span>}
          </div>
        </div>

        {/* Neden Biz Section */}
        <div className="p-4 rounded-2xl bg-[#F2F2F7]/40 border border-[#D1D1D6]/40 space-y-4">
          <h4 className="text-xs font-extrabold text-[#007AFF] uppercase tracking-wider mb-2">Neden Biz? Bölümü</h4>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1D1D1F]">Bölüm Açıklaması</label>
            <Textarea
              value={data.aboutSection?.text || ""}
              onChange={(e) => updatePageData("home", "aboutSection", { ...data.aboutSection, text: e.target.value })}
              rows={3}
              className="rounded-xl border-[#D1D1D6] bg-white resize-none text-xs"
            />
          </div>
        </div>

        {/* Why Us / Neden Biz */}
        <div className="space-y-3 bg-[#F2F2F7]/20 p-4 rounded-2xl border border-[#D1D1D6]/40">
          <div className="flex items-center justify-between mb-1 select-none">
            <label className="text-xs font-bold text-[#1D1D1F]">Neden Biz? Bölümü Kartları</label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddWhyUs} className="rounded-lg text-xs py-1 h-8 bg-white">
              <Plus className="w-3.5 h-3.5 mr-1" /> Neden Biz Kartı Ekle
            </Button>
          </div>
          <div className="space-y-3">
            {whyUs.map((wu: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-[#D1D1D6]/60 relative group space-y-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveWhyUs(idx)}
                  className="absolute top-2 right-2 text-[#FF3B30] hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-[#1D1D1F]">Başlık</label>
                    <Input
                      value={wu.title || ""}
                      onChange={(e) => handleWhyUsChange(idx, "title", e.target.value)}
                      className="rounded-xl border-[#D1D1D6] h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#1D1D1F]">İkon</label>
                    <select
                      value={wu.icon || "Award"}
                      onChange={(e) => handleWhyUsChange(idx, "icon", e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-[#D1D1D6] bg-white text-xs"
                    >
                      <option value="Award">Ödül (Award)</option>
                      <option value="Target">Hedef (Target)</option>
                      <option value="Eye">Vizyon (Eye)</option>
                      <option value="HeartHandshake">Güven (HeartHandshake)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#1D1D1F]">Açıklama</label>
                  <Textarea
                    value={wu.description || ""}
                    onChange={(e) => handleWhyUsChange(idx, "description", e.target.value)}
                    rows={2}
                    className="rounded-xl border-[#D1D1D6] resize-none text-xs"
                  />
                </div>
              </div>
            ))}
            {whyUs.length === 0 && <span className="text-xs text-[#86868B] italic block text-center">Neden Biz kartı bulunamadı.</span>}
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-3 bg-[#F2F2F7]/20 p-4 rounded-2xl border border-[#D1D1D6]/40">
          <div className="flex items-center justify-between mb-1 select-none">
            <label className="text-xs font-bold text-[#1D1D1F]">Müvekkil Değerlendirmeleri (Referanslar)</label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddTestimonial} className="rounded-lg text-xs py-1 h-8 bg-white">
              <Plus className="w-3.5 h-3.5 mr-1" /> Değerlendirme Ekle
            </Button>
          </div>
          <div className="space-y-3">
            {testimonials.map((test: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-[#D1D1D6]/60 relative group space-y-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveTestimonial(idx)}
                  className="absolute top-2 right-2 text-[#FF3B30] hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#1D1D1F]">Ad Soyad</label>
                    <Input
                      value={test.name || ""}
                      onChange={(e) => handleTestimonialChange(idx, "name", e.target.value)}
                      className="rounded-xl border-[#D1D1D6] h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#1D1D1F]">Görev/Unvan</label>
                    <Input
                      value={test.role || ""}
                      onChange={(e) => handleTestimonialChange(idx, "role", e.target.value)}
                      className="rounded-xl border-[#D1D1D6] h-9"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#1D1D1F]">Görüş Metni</label>
                  <Textarea
                    value={test.text || ""}
                    onChange={(e) => handleTestimonialChange(idx, "text", e.target.value)}
                    rows={2}
                    className="rounded-xl border-[#D1D1D6] resize-none text-xs"
                  />
                </div>
              </div>
            ))}
            {testimonials.length === 0 && <span className="text-xs text-[#86868B] italic block text-center">Değerlendirme bulunamadı.</span>}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-3 bg-[#F2F2F7]/20 p-4 rounded-2xl border border-[#D1D1D6]/40">
          <div className="flex items-center justify-between mb-1 select-none">
            <label className="text-xs font-bold text-[#1D1D1F]">Sıkça Sorulan Sorular (SSS)</label>
            <Button type="button" variant="outline" size="sm" onClick={handleAddFaq} className="rounded-lg text-xs py-1 h-8 bg-white">
              <Plus className="w-3.5 h-3.5 mr-1" /> Soru Ekle
            </Button>
          </div>
          <div className="space-y-3">
            {faqItems.map((faq: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-[#D1D1D6]/60 relative group space-y-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFaq(idx)}
                  className="absolute top-2 right-2 text-[#FF3B30] hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#1D1D1F]">Soru {idx + 1}</label>
                  <Input
                    value={faq.question || ""}
                    onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                    className="rounded-xl border-[#D1D1D6] h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#1D1D1F]">Cevap {idx + 1}</label>
                  <Textarea
                    value={faq.answer || ""}
                    onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                    rows={2}
                    className="rounded-xl border-[#D1D1D6] resize-none text-xs"
                  />
                </div>
              </div>
            ))}
            {faqItems.length === 0 && <span className="text-xs text-[#86868B] italic block text-center">Kayıtlı soru bulunamadı.</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Selector */}
      <div className="lg:col-span-1 select-none space-y-1.5">
        <label className="text-xs font-bold text-[#1D1D1F] block mb-1">Düzenlenecek Sayfa</label>
        <button
          onClick={() => setSelectedPage("about")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-semibold border text-left transition-all ${
            selectedPage === "about"
              ? "bg-[#0A2540] text-white border-[#0A2540] shadow-sm"
              : "bg-white text-slate-700 border-[#D1D1D6] hover:bg-slate-50"
          }`}
        >
          <Layers className="w-4 h-4 text-[#007AFF]" />
          <span>Hakkımızda</span>
        </button>
        <button
          onClick={() => setSelectedPage("contact")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-semibold border text-left transition-all ${
            selectedPage === "contact"
              ? "bg-[#0A2540] text-white border-[#0A2540] shadow-sm"
              : "bg-white text-slate-700 border-[#D1D1D6] hover:bg-slate-50"
          }`}
        >
          <Layers className="w-4 h-4 text-[#007AFF]" />
          <span>İletişim Bilgileri</span>
        </button>
        <button
          onClick={() => setSelectedPage("home")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-semibold border text-left transition-all ${
            selectedPage === "home"
              ? "bg-[#0A2540] text-white border-[#0A2540] shadow-sm"
              : "bg-white text-slate-700 border-[#D1D1D6] hover:bg-slate-50"
          }`}
        >
          <Layers className="w-4 h-4 text-[#007AFF]" />
          <span>Ana Sayfa İçerikleri</span>
        </button>
        <button
          onClick={() => setSelectedPage("kvkk")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-semibold border text-left transition-all ${
            selectedPage === "kvkk"
              ? "bg-[#0A2540] text-white border-[#0A2540] shadow-sm"
              : "bg-white text-slate-700 border-[#D1D1D6] hover:bg-slate-50"
          }`}
        >
          <Layers className="w-4 h-4 text-[#007AFF]" />
          <span>KVKK Aydınlatma Metni</span>
        </button>
        <button
          onClick={() => setSelectedPage("cookie")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-semibold border text-left transition-all ${
            selectedPage === "cookie"
              ? "bg-[#0A2540] text-white border-[#0A2540] shadow-sm"
              : "bg-white text-slate-700 border-[#D1D1D6] hover:bg-slate-50"
          }`}
        >
          <Layers className="w-4 h-4 text-[#007AFF]" />
          <span>Çerez Politikası</span>
        </button>
        <button
          onClick={() => setSelectedPage("joinus")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-semibold border text-left transition-all ${
            selectedPage === "joinus"
              ? "bg-[#0A2540] text-white border-[#0A2540] shadow-sm"
              : "bg-white text-slate-700 border-[#D1D1D6] hover:bg-slate-50"
          }`}
        >
          <Layers className="w-4 h-4 text-[#007AFF]" />
          <span>Bize Katılın (İK)</span>
        </button>
      </div>

      {/* Page Form Area */}
      <div className="lg:col-span-3 space-y-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="bg-[#F2F2F7] rounded-xl p-1 mb-6 flex justify-start gap-1">
            <TabsTrigger value="content" className="rounded-lg text-xs font-semibold px-4 py-2">
              Sayfa İçerik Editörü
            </TabsTrigger>
            <TabsTrigger value="seo" className="rounded-lg text-xs font-semibold px-4 py-2">
              Sayfa SEO Ayarları
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="outline-none space-y-6">
            <Card className="rounded-3xl border-[#D1D1D6] shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-[#E5E5EA]">
                <CardTitle className="text-base font-bold text-[#1D1D1F]">
                  {selectedPage === "about" && "Hakkımızda Sayfa İçeriği"}
                  {selectedPage === "contact" && "İletişim Sayfa İçeriği"}
                  {selectedPage === "home" && "Ana Sayfa Bölümleri ve İçeriği"}
                  {selectedPage === "kvkk" && "KVKK Aydınlatma Metni İçeriği"}
                  {selectedPage === "cookie" && "Çerez Politikası Metni İçeriği"}
                  {selectedPage === "joinus" && "Bize Katılın (İnsan Kaynakları) İçeriği"}
                </CardTitle>
                <CardDescription className="text-xs">
                  Aşağıdaki alanları düzenleyerek sayfadaki metin ve bölümleri güncelleyin.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {selectedPage === "about" && <RenderAboutForm />}
                {selectedPage === "contact" && <RenderContactForm />}
                {selectedPage === "home" && <RenderHomeForm />}
                {selectedPage === "kvkk" && RenderPolicyForm("kvkk")}
                {selectedPage === "cookie" && RenderPolicyForm("cookie")}
                {selectedPage === "joinus" && <RenderJoinUsForm />}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-full px-8 py-2.5 bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold flex items-center justify-center text-sm shadow-sm"
              >
                {isSaving ? "Kaydediliyor..." : "Sayfa İçeriğini Kaydet"}
              </Button>
              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-[#34C759] text-xs font-semibold select-none">
                  <CheckCircle className="w-4.5 h-4.5" />
                  Sayfa başarıyla kaydedildi
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="seo" className="outline-none">
            <Card className="rounded-3xl border-[#D1D1D6] shadow-sm bg-white overflow-hidden p-6">
              <SeoForm entityType="Page" entityId={selectedPage} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
