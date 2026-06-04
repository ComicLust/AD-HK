"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, CheckCircle, Eye, HelpCircle, Instagram, Twitter, Youtube, Facebook, Linkedin } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

interface FirmInfo {
  id: string;
  name: string;
  address: string;
  gsm: string;
  phone: string;
  fax: string;
  email: string;
  whatsapp: string;
  logo: string | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  facebook: string | null;
  linkedin: string | null;
}

export default function FirmInfoPage() {
  const [info, setInfo] = useState<FirmInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadFirmInfo();
  }, []);

  const loadFirmInfo = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/firm-info");
      const data = await res.json();
      if (data) {
        setInfo(data);
      }
    } catch (e) {
      console.error("Failed to load firm info:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: keyof FirmInfo, val: string) => {
    if (!info) return;
    setInfo({
      ...info,
      [field]: val,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!info || isSaving) return;

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/firm-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Firma bilgileri kaydedilemedi.");
      }
    } catch (err) {
      console.error(err);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 select-none">
      {/* Form Area */}
      <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
        <Card className="rounded-3xl border-[#D1D1D6] shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-[#E5E5EA]">
            <CardTitle className="text-base font-bold text-[#1D1D1F]">Kurumsal İletişim Bilgileri</CardTitle>
            <CardDescription className="text-xs">
              Sitenin en üst barı, iletişim sayfası ve footer kısmındaki kurumsal iletişim bilgilerini güncelleyin.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">Büro / Firma Logosu</label>
              <div className="bg-white rounded-xl border border-dashed border-[#D1D1D6] p-2 flex justify-center items-center min-h-[96px]">
                <ImageUploader
                  value={info?.logo || ""}
                  onChange={(val) => handleFieldChange("logo", val)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">Büro / Firma Resmi Adı</label>
              <Input
                value={info?.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                required
                className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">Fiziksel Adres</label>
              <Textarea
                value={info?.address || ""}
                onChange={(e) => handleFieldChange("address", e.target.value)}
                required
                rows={2}
                className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] resize-none text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">GSM Telefon (Acil Arama)</label>
                <Input
                  value={info?.gsm || ""}
                  onChange={(e) => handleFieldChange("gsm", e.target.value)}
                  placeholder="+90 5XX XXX XX XX"
                  required
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Sabit Telefon</label>
                <Input
                  value={info?.phone || ""}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  placeholder="+90 212 XXX XX XX"
                  required
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Fax</label>
                <Input
                  value={info?.fax || ""}
                  onChange={(e) => handleFieldChange("fax", e.target.value)}
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">E-Posta Adresi</label>
                <Input
                  type="email"
                  value={info?.email || ""}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  required
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">WhatsApp İletişim Linki</label>
              <Input
                value={info?.whatsapp || ""}
                onChange={(e) => handleFieldChange("whatsapp", e.target.value)}
                placeholder="https://wa.me/905317760283"
                required
                className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="rounded-3xl border-[#D1D1D6] shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-[#E5E5EA]">
            <CardTitle className="text-sm font-extrabold text-[#1D1D1F]">Sosyal Medya Hesapları</CardTitle>
            <CardDescription className="text-[11px]">
              Büronuza ait resmi sosyal medya profil linkleri.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                  <Instagram className="w-4 h-4 text-pink-600" /> Instagram
                </label>
                <Input
                  value={info?.instagram || ""}
                  onChange={(e) => handleFieldChange("instagram", e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                  <Twitter className="w-4 h-4 text-sky-500" /> Twitter / X
                </label>
                <Input
                  value={info?.twitter || ""}
                  onChange={(e) => handleFieldChange("twitter", e.target.value)}
                  placeholder="https://x.com/..."
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-red-600" /> YouTube
                </label>
                <Input
                  value={info?.youtube || ""}
                  onChange={(e) => handleFieldChange("youtube", e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                  <Facebook className="w-4 h-4 text-blue-700" /> Facebook
                </label>
                <Input
                  value={info?.facebook || ""}
                  onChange={(e) => handleFieldChange("facebook", e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <Linkedin className="w-4 h-4 text-blue-600" /> LinkedIn
              </label>
              <Input
                value={info?.linkedin || ""}
                onChange={(e) => handleFieldChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={isSaving}
            className="rounded-full px-8 py-2.5 bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold flex items-center justify-center text-sm shadow-sm"
          >
            {isSaving ? "Kaydediliyor..." : "Firma Bilgilerini Kaydet"}
          </Button>
          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-[#34C759] text-xs font-semibold select-none">
              <CheckCircle className="w-4.5 h-4.5" />
              Başarıyla kaydedildi
            </div>
          )}
        </div>
      </form>

      {/* Live Preview Card */}
      <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
        <span className="text-xs font-bold text-[#86868B] flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-[#007AFF]" /> Canlı Kart Görünüm Simülasyonu
        </span>
        <Card className="rounded-3xl border border-[#D1D1D6] bg-slate-900 text-white p-6 shadow-apple-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-2">
            {info?.logo ? (
              <img src={info.logo} alt="Logo" className="h-7 max-w-[100px] object-contain invert brightness-200" />
            ) : (
              <span className="text-base">⚖️</span>
            )}
            <h4 className="text-sm font-extrabold text-white tracking-tight">
              {info?.name || "Büro İsmi Tanımsız"}
            </h4>
          </div>
          <div className="space-y-4 py-4 text-xs">
            <div className="flex items-start gap-3 text-white/80">
              <MapPin className="w-4.5 h-4.5 text-[#007AFF] mt-0.5 shrink-0" />
              <span className="leading-relaxed">{info?.address || "Adres tanımlanmamış."}</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Phone className="w-4.5 h-4.5 text-[#007AFF] shrink-0" />
              <span>GSM: {info?.gsm || "GSM girilmemiş"} | Sabit: {info?.phone || "Telefon girilmemiş"}</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Mail className="w-4.5 h-4.5 text-[#007AFF] shrink-0" />
              <span>{info?.email || "eposta@adilhukuk.com"}</span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 flex justify-between items-center">
            <span className="text-[10px] text-white/40">Sosyal Kanallar</span>
            <div className="flex items-center gap-2.5">
              {info?.instagram && <Instagram className="w-4 h-4 text-white/50 hover:text-white transition-colors" />}
              {info?.twitter && <Twitter className="w-4 h-4 text-white/50 hover:text-white transition-colors" />}
              {info?.youtube && <Youtube className="w-4 h-4 text-white/50 hover:text-white transition-colors" />}
              {info?.facebook && <Facebook className="w-4 h-4 text-white/50 hover:text-white transition-colors" />}
              {info?.linkedin && <Linkedin className="w-4 h-4 text-white/50 hover:text-white transition-colors" />}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
