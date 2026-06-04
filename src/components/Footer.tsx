"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Linkedin,
  Home,
  Info,
  Briefcase,
  Users,
  Newspaper,
  ShieldCheck,
  FileText,
  UserPlus,
  Send,
  User,
  AtSign,
  MessageSquare,
  ListChecks,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSiteData, useTranslation } from "@/hooks/useSiteData";

interface FooterProps {
  onNavigate: (path: string) => void;
}

/* ─── Footer menu icon map ─── */
const menuIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Info,
  Briefcase,
  Users,
  Newspaper,
  Phone,
  FileText,
};

const kurumsalLinks = [
  { label: "Hakkımızda", href: "/hakkimizda", icon: Info },
  { label: "Ekibimiz", href: "/ekibimiz", icon: Users },
  { label: "Hizmetlerimiz", href: "/hizmetlerimiz", icon: Briefcase },
  { label: "Örnek Dilekçeler", href: "/ornek-dilekceler", icon: FileText },
  { label: "Bize Katılın", href: "/bize-katilin", icon: UserPlus },
];

const policyLinks = [
  { label: "KVKK", href: "/kvkk", icon: ShieldCheck },
  { label: "Çerez Politikası", href: "/cerez-politikasi", icon: FileText },
];

export default function Footer({ onNavigate }: FooterProps) {
  const { firmInfo, navLinks, contactData } = useSiteData();
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const getNavLabel = (href: string, defaultLabel: string) => {
    const clean = href.replace("#", "");
    if (clean === "/" || clean === "") return t("nav.home", defaultLabel);
    if (clean === "/hakkimizda") return t("nav.about", defaultLabel);
    if (clean === "/hizmetlerimiz") return t("nav.services", defaultLabel);
    if (clean === "/ekibimiz") return t("nav.team", defaultLabel);
    if (clean === "/medya") return t("nav.media", defaultLabel);
    if (clean === "/ornek-dilekceler") return t("nav.dilekceler", defaultLabel);
    if (clean === "/iletisim") return t("nav.contact", defaultLabel);
    if (clean === "/bize-katilin") return t("nav.joinus", defaultLabel);
    if (clean === "/kvkk") return t("nav.kvkk", defaultLabel);
    if (clean === "/cerez-politikasi") return t("nav.cookie", defaultLabel);
    return t("nav." + defaultLabel.toLowerCase().replace(/[^a-z0-9]/g, ""), defaultLabel);
  };

  const handleNav = (href: string) => {
    const path = href.replace("#", "");
    onNavigate(path);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const socialLinks = [
    { icon: Instagram, href: firmInfo.social.instagram, label: "Instagram" },
    { icon: Twitter, href: firmInfo.social.twitter, label: "X (Twitter)" },
    { icon: Youtube, href: firmInfo.social.youtube, label: "YouTube" },
    { icon: Facebook, href: firmInfo.social.facebook, label: "Facebook" },
    { icon: Linkedin, href: firmInfo.social.linkedin, label: "LinkedIn" },
  ];

  return (
    <footer>
      {/* ─── Google Map + Contact Form Section ─── */}
      <section id="iletisim-formu" className="relative w-full h-[520px] sm:h-[480px] lg:h-[440px]">
        {/* Map iframe */}
        <iframe
          src={contactData?.mapEmbedUrl || "https://maps.google.com/maps?q=Florya+Senlik+Koy+Mah+Saci+Sokak+No+4+F+Bakirkoy+Istanbul&t=&z=15&ie=UTF8&iwloc=&output=embed"}
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Adil Hukuk Danışmanlık Ofis Konumu"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none" />

        {/* Contact Form overlay - positioned right */}
        <div className="absolute top-0 right-0 h-full flex items-center pr-4 sm:pr-8 lg:pr-12 pointer-events-none">
          <div className="pointer-events-auto w-[340px] sm:w-[380px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-apple-lg p-6 sm:p-7">
            <h3 className="text-lg font-bold text-[#1D1D1F] mb-1">
              {t("contact.title", "Bize Ulaşın")}
            </h3>
            <p className="text-xs text-[#86868B] mb-5">
              {t("contact.subtitle", "Hukuki danışmanlık talebinizi iletin")}
            </p>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-[#34C759]/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#34C759]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#1D1D1F]">{t("contact.successTitle", "Mesajınız Alındı")}</p>
                <p className="text-xs text-[#86868B] mt-1">{t("contact.successSub", "En kısa sürede dönüş yapacağız.")}</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                  <Input
                    required
                    className="h-10 pl-9 rounded-xl border-[rgba(0,0,0,0.08)] bg-[#F2F2F7] text-sm focus:bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                    placeholder={t("contact.formName", "Ad Soyad")}
                  />
                </div>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                  <Input
                    type="email"
                    required
                    className="h-10 pl-9 rounded-xl border-[rgba(0,0,0,0.08)] bg-[#F2F2F7] text-sm focus:bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                    placeholder={t("contact.formEmail", "E-posta")}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                  <span className="absolute left-9 top-1/2 -translate-y-1/2 text-xs text-[#86868B] pointer-events-none">+90</span>
                  <Input
                    type="tel"
                    className="h-10 pl-[3.5rem] rounded-xl border-[rgba(0,0,0,0.08)] bg-[#F2F2F7] text-sm focus:bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                    placeholder="5XX XXX XX XX"
                    onInput={(e) => {
                      const input = e.currentTarget;
                      input.value = input.value.replace(/[^0-9]/g, '');
                    }}
                  />
                </div>
                <div className="relative">
                  <ListChecks className="absolute left-3 top-3 w-4 h-4 text-[#86868B]" />
                  <select
                    className="h-10 pl-9 pr-3 rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#F2F2F7] text-sm text-[#86868B] w-full focus:bg-white focus:ring-[#007AFF] focus:border-[#007AFF] focus:text-[#1D1D1F] transition-all appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled>{t("contact.formSubjectDefault", "Bilgi Talebi")}</option>
                    <option>{t("contact.service1", "Hukuki Danışmanlık")}</option>
                    <option>{t("contact.service2", "Dava Takibi")}</option>
                    <option>{t("contact.service3", "Sözleşme Hazırlama")}</option>
                    <option>{t("contact.serviceOther", "Diğer")}</option>
                  </select>
                </div>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#86868B]" />
                  <Textarea
                    required
                    rows={2}
                    className="pl-9 rounded-xl border-[rgba(0,0,0,0.08)] bg-[#F2F2F7] text-sm focus:bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all resize-none"
                    placeholder={t("contact.formMessage", "Açıklama")}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-xl py-2.5 bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold text-sm h-auto"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {t("contact.formSubmit", "Gönder")}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── Footer Content ─── */}
      <div className="bg-[#F2F2F7] border-t border-[rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src={firmInfo?.logo || "/logo.svg"} alt="Adil Hukuk" className="h-9 shrink-0" />
              </div>
              <p className="text-sm text-[#86868B] leading-relaxed mb-5">
                {t("footer.text", "Adil Hukuk Danışmanlık Bürosu olarak, müvekkillerimize hak ettikleri nitelikli ve güvenilir hukuki hizmeti sunmayı temel ilkemiz kabul ediyoruz.")}
              </p>
              {/* Social Media */}
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const SocialIcon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-9 h-9 rounded-full bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF] hover:bg-[#007AFF] hover:text-white transition-all duration-200"
                    >
                      <SocialIcon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Menu */}
            <div>
              <h3 className="font-bold text-sm text-[#1D1D1F] mb-4">{t("footer.menuHeader", "Menu")}</h3>
              <ul className="space-y-2.5">
                {navLinks.map((link) => {
                  const MenuIcon = menuIconMap[link.icon] || Home;
                  return (
                    <li key={link.href}>
                      <button
                        onClick={() => handleNav(link.href)}
                        className="flex items-center gap-2 text-sm text-[#86868B] hover:text-[#1D1D1F] transition-colors group"
                      >
                        <MenuIcon className="w-4 h-4 text-[#86868B]/50 group-hover:text-[#007AFF] transition-colors" />
                        {getNavLabel(link.href, link.label)}
                      </button>
                    </li>
                  );
                })}
                {policyLinks.map((link) => {
                  const PolicyIcon = link.icon;
                  return (
                    <li key={link.href}>
                      <button
                        onClick={() => onNavigate(link.href)}
                        className="flex items-center gap-2 text-sm text-[#86868B] hover:text-[#1D1D1F] transition-colors group"
                      >
                        <PolicyIcon className="w-4 h-4 text-[#86868B]/50 group-hover:text-[#007AFF] transition-colors" />
                        {getNavLabel(link.href, link.label)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Kurumsal */}
            <div>
              <h3 className="font-bold text-sm text-[#1D1D1F] mb-4">{t("footer.corporateHeader", "Kurumsal")}</h3>
              <ul className="space-y-2.5">
                {kurumsalLinks.map((link) => {
                  const LinkIcon = link.icon;
                  return (
                    <li key={link.href}>
                      <button
                        onClick={() => onNavigate(link.href)}
                        className="flex items-center gap-2 text-sm text-[#86868B] hover:text-[#1D1D1F] transition-colors group"
                      >
                        <LinkIcon className="w-4 h-4 text-[#86868B]/50 group-hover:text-[#007AFF] transition-colors" />
                        {getNavLabel(link.href, link.label)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* İletişim */}
            <div>
              <h3 className="font-bold text-sm text-[#1D1D1F] mb-4">{t("footer.contactHeader", "İletişim")}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#007AFF] mt-0.5 shrink-0" />
                  <span className="text-sm text-[#86868B] leading-relaxed">
                    {firmInfo.address}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#007AFF] shrink-0" />
                  <a href={`tel:${firmInfo.phone.replace(/\s/g, "")}`} className="text-sm text-[#86868B] hover:text-[#007AFF] transition-colors">{firmInfo.phone}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#007AFF] shrink-0" />
                  <a href={`tel:${firmInfo.gsm.replace(/\s/g, "")}`} className="text-sm text-[#86868B] hover:text-[#007AFF] transition-colors">GSM: {firmInfo.gsm}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#007AFF] shrink-0" />
                  <a href={`mailto:${firmInfo.email}`} className="text-sm text-[#86868B] hover:text-[#007AFF] transition-colors">{firmInfo.email}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[rgba(0,0,0,0.08)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-[#86868B]">
              &copy; 2025 | {t("footer.firmTitle", "Adil Hukuk Danışmanlık")}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate("/kvkk")}
                className="text-xs text-[#86868B] hover:text-[#1D1D1F] transition-colors"
              >
                {t("nav.kvkk", "KVKK")}
              </button>
              <button
                onClick={() => onNavigate("/cerez-politikasi")}
                className="text-xs text-[#86868B] hover:text-[#1D1D1F] transition-colors"
              >
                {t("nav.cookie", "Çerez Politikası")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
