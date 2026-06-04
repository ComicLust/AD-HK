"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSiteData } from "@/hooks/useSiteData";
import { Shield, Zap, Eye, Trophy, Mail, Phone, Instagram, Twitter, Youtube, Facebook, Linkedin } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const iconMap: Record<string, any> = {
  Shield,
  Zap,
  Eye,
  Trophy,
};

/* ─── Member Photo Component ─── */
function MemberPhoto({
  photo,
  name,
  initials,
  size = "md",
}: {
  photo: string;
  name: string;
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
  };
  const textClasses = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl overflow-hidden bg-[#0A2540] flex items-center justify-center shrink-0`}
    >
      {!imgError && photo ? (
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover object-center"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={`${textClasses[size]} font-bold text-white`}>
          {initials || name.substring(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}

/* ─── Team Member Detail Modal Component ─── */
function TeamMemberCard({
  member,
  open,
  onOpenChange,
}: {
  member: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!member) return null;

  const socialLinks = [
    { icon: Instagram, href: member.socialLinks?.instagram, label: "Instagram" },
    { icon: Twitter, href: member.socialLinks?.twitter, label: "X (Twitter)" },
    { icon: Youtube, href: member.socialLinks?.youtube, label: "YouTube" },
    { icon: Facebook, href: member.socialLinks?.facebook, label: "Facebook" },
    { icon: Linkedin, href: member.socialLinks?.linkedin, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-0 overflow-hidden border-0 shadow-apple-lg">
        <DialogTitle className="sr-only">{member.name}</DialogTitle>
        <div className="flex flex-col items-center pt-8 pb-6 px-6">
          <div className="mb-5 ring-4 ring-[#007AFF]/10 rounded-2xl">
            <MemberPhoto
              photo={member.photo}
              name={member.name}
              initials={member.initials}
              size="xl"
            />
          </div>
          <h3 className="text-xl font-bold text-[#1D1D1F] text-center">
            {member.name}
          </h3>
          <p className="text-sm text-[#007AFF] font-medium mt-1">
            {member.title}
          </p>
          {member.specializations?.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              {member.specializations.map((spec: string) => (
                <span
                  key={spec}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-[#007AFF]/10 text-[#007AFF] text-xs font-semibold"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}
        </div>

        {(member.socialLinks?.email || member.socialLinks?.phone) && (
          <div className="px-6 pb-4 flex flex-col items-center gap-1.5 text-xs text-[#86868B]">
            {member.socialLinks?.email && (
              <a
                href={`mailto:${member.socialLinks.email}`}
                className="hover:text-[#007AFF] transition-colors flex items-center gap-1.5 font-semibold"
              >
                <Mail className="w-3.5 h-3.5 text-[#007AFF]" /> {member.socialLinks.email}
              </a>
            )}
            {member.socialLinks?.phone && (
              <a
                href={`tel:${member.socialLinks.phone}`}
                className="hover:text-[#007AFF] transition-colors flex items-center gap-1.5 font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-[#007AFF]" /> {member.socialLinks.phone}
              </a>
            )}
          </div>
        )}

        {member.bio && (
          <div className="px-6 pb-4">
            <p className="text-sm text-[#86868B] leading-relaxed text-center">
              {member.bio}
            </p>
          </div>
        )}

        {socialLinks.length > 0 && (
          <div className="px-6 pb-6 pt-2">
            <div className="flex items-center justify-center gap-3">
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
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function AboutPage() {
  const { aboutData, teamMembers } = useSiteData();
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const activeMembers = teamMembers?.filter((tm: any) => tm.isActive) || [];

  // Default fallbacks for newly editable layout items
  const title = aboutData.title || "Sadece Hukuk Değil, Güven İnşa Ediyoruz.";
  const visionTitle = aboutData.visionTitle || "Geleceğin Güvenilir Hukuk Kılavuzu";
  const bentoSectionTitle = aboutData.bentoSectionTitle || "Çözüm Odaklı İlkelerimiz";
  const bentoSectionDesc = aboutData.bentoSectionDesc || "Müvekkillerimize sunduğumuz hizmet kalitesinin temel taşları.";
  
  const bentoTitles = aboutData.bentoTitles || [
    "Stratejik Dava Takibi",
    "Hızlı & Net İletişim",
    "Şeffaf Raporlama",
    "Sonuç Odaklı Süreç",
  ];

  const stats = aboutData.stats || [
    { value: "15+ Yıl", label: "Tecrübe & Deneyim" },
    { value: "Yüzlerce", label: "Başarılı Sonuçlanan Dosya" },
    { value: "7/24", label: "Şeffaf İletişim Desteği" },
  ];

  const bullets = aboutData.bullets || [
    "Stratejik ve etkin dava takibi",
    "Uyuşmazlıkların önleyici danışmanlık ile çözümü",
    "Hızlı iletişim ve şeffaf bilgilendirme",
    "Tam zamanlı destek ve titiz dosya yönetimi",
  ];

  const defaultIcons = ["Shield", "Zap", "Eye", "Trophy"];

  const handleMemberClick = (member: any) => {
    setSelectedMember(member);
    setDetailOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 select-none">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-24 sm:space-y-32"
      >
        {/* 1. Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div variants={fadeUp} className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#007AFF]/10 text-[#007AFF] text-xs font-bold uppercase tracking-widest">
              <span>Hakkımızda</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1D1D1F] leading-[1.1] sm:leading-none">
              {title}
            </h1>
            <div className="space-y-6 text-base sm:text-lg text-[#86868B] leading-relaxed font-normal">
              <p className="font-semibold text-slate-800 text-lg sm:text-xl">
                {aboutData.intro}
              </p>
              <p>{aboutData.body}</p>
              <p>{aboutData.closing}</p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="lg:col-span-5 relative rounded-[32px] overflow-hidden aspect-[4/3] lg:aspect-[5/6] shadow-2xl border border-black/5 group"
          >
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"
              alt="Prestijli Ofis Ortamı"
              className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xs font-bold uppercase tracking-widest opacity-85">Adil Hukuk Bürosu</p>
              <h3 className="text-lg font-bold mt-1">İstanbul Merkez Ofisimiz</h3>
            </div>
          </motion.div>
        </section>

        {/* 2. Stats Section (Social Proof) */}
        <section className="py-12 border-y border-[#D1D1D6]/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4">
            {stats.map((stat: any, idx: number) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="text-center space-y-2 relative"
              >
                <h3 className="text-5xl sm:text-6xl font-extralight text-[#007AFF] tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-sm font-semibold tracking-wide text-[#1D1D1F]">
                  {stat.label}
                </p>
                {idx < 2 && (
                  <div className="hidden md:block absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-[#D1D1D6]/40" />
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. Bento Box Grid */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#007AFF] text-xs font-bold uppercase tracking-widest">Nasıl Çalışıyoruz?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight">
              {bentoSectionTitle}
            </h2>
            <p className="text-sm text-[#86868B]">
              {bentoSectionDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bullets.map((bullet: string, idx: number) => {
              const iconName = defaultIcons[idx % defaultIcons.length];
              const Icon = iconMap[iconName] || Shield;
              const cardTitle = bentoTitles[idx] || "Güvenli Çözüm";

              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="bg-[#F8F9FA]/60 backdrop-blur-md border border-black/5 rounded-[24px] p-8 hover:bg-white hover:shadow-apple-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-[230px] group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF] group-hover:bg-[#007AFF] group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-[#1D1D1F] dark:text-foreground">
                      {cardTitle}
                    </h4>
                    <p className="text-xs text-[#86868B] leading-relaxed">
                      {bullet}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 4. Vision Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#F2F2F7]/50 backdrop-blur-sm rounded-[32px] p-8 sm:p-16 border border-black/5">
          <motion.div variants={fadeUp} className="lg:col-span-4">
            <span className="text-[#007AFF] text-xs font-bold uppercase tracking-widest block mb-2">Vizyonumuz</span>
            <h2 className="text-3xl font-extrabold text-[#1D1D1F] tracking-tight leading-tight">
              {visionTitle}
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} className="lg:col-span-8 text-base sm:text-lg text-[#86868B] leading-relaxed font-normal">
            <p>{aboutData.vision}</p>
          </motion.div>
        </section>

        {/* 5. Team Section (Home page template match style) */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#007AFF] text-xs font-bold uppercase tracking-widest">Ekibimiz</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight">Uzman Kadromuz</h2>
            <p className="text-sm text-[#86868B]">
              Alanında uzman avukat kadromuzla tanışın
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMembers.map((member: any) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                className="bg-[#F2F2F7] rounded-3xl p-6 sm:p-7 text-center group hover:bg-white hover:shadow-apple-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleMemberClick(member)}
              >
                <div className="flex justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <MemberPhoto
                    photo={member.photo}
                    name={member.name}
                    initials={member.initials}
                    size="lg"
                  />
                </div>
                <h3 className="text-base font-bold text-[#1D1D1F] mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-[#007AFF] font-medium mb-2">
                  {member.title}
                </p>
                {member.specializations?.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                    {member.specializations.slice(0, 3).map((spec: string) => (
                      <span
                        key={spec}
                        className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#007AFF]/10 text-[#007AFF] text-[10px] font-semibold"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
                {member.bio && (
                  <p className="text-sm text-[#86868B] leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>

      {/* Team Member Detail Modal */}
      <TeamMemberCard
        member={selectedMember}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
