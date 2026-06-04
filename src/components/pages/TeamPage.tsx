"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

/* ─── Member Photo with fallback ─── */
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
      {!imgError ? (
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover object-center"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={`${textClasses[size]} font-bold text-white`}>
          {initials}
        </span>
      )}
    </div>
  );
}

/* ─── Team Member Card Modal ─── */
function TeamMemberCard({
  member,
  open,
  onOpenChange,
}: {
  member: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { firmInfo } = useSiteData();
  if (!member) return null;

  const socialLinks = [
    { icon: Instagram, href: member.socialLinks?.instagram, label: "Instagram" },
    { icon: Twitter, href: member.socialLinks?.twitter, label: "X (Twitter)" },
    { icon: Youtube, href: member.socialLinks?.youtube, label: "YouTube" },
    { icon: Facebook, href: member.socialLinks?.facebook, label: "Facebook" },
    { icon: Linkedin, href: member.socialLinks?.linkedin, label: "LinkedIn" },
  ].filter(s => s.href);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-0 overflow-hidden border-0 shadow-apple-lg">
        <DialogTitle className="sr-only">{member.name}</DialogTitle>
        <div className="flex flex-col items-center pt-8 pb-6 px-6">
          {/* Photo */}
          <div className="mb-5 ring-4 ring-[#007AFF]/10 rounded-2xl">
            <MemberPhoto
              photo={member.photo}
              name={member.name}
              initials={member.initials}
              size="xl"
            />
          </div>
          {/* Name & Title */}
          <h3 className="text-xl font-bold text-[#1D1D1F] text-center">
            {member.name}
          </h3>
          <p className="text-sm text-[#007AFF] font-medium mt-1">
            {member.title}
          </p>
          {/* Specialization Badges */}
          {member.specializations.length > 0 && (
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

        {/* Contact Info (Email & Phone) */}
        {(member.socialLinks?.email || member.socialLinks?.phone) && (
          <div className="px-6 pb-4 flex flex-col items-center gap-1.5 text-xs text-[#86868B]">
            {member.socialLinks?.email && (
              <a href={`mailto:${member.socialLinks.email}`} className="hover:text-[#007AFF] transition-colors flex items-center gap-1.5 font-semibold">
                <Mail className="w-3.5 h-3.5 text-[#007AFF]" /> {member.socialLinks.email}
              </a>
            )}
            {member.socialLinks?.phone && (
              <a href={`tel:${member.socialLinks.phone}`} className="hover:text-[#007AFF] transition-colors flex items-center gap-1.5 font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#007AFF]" /> {member.socialLinks.phone}
              </a>
            )}
          </div>
        )}
        {/* Bio */}
        {member.bio && (
          <div className="px-6 pb-4">
            <p className="text-sm text-[#86868B] leading-relaxed">
              {member.bio}
            </p>
          </div>
        )}
        {/* Social Links */}
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
      </DialogContent>
    </Dialog>
  );
}

export default function TeamPage() {
  const { teamMembers } = useSiteData();
  const [selectedMember, setSelectedMember] = useState<
    any | null
  >(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const founders = teamMembers.filter((m) => m.category === "lawyer" && m.title.includes("Kurucu"));
  const lawyers = teamMembers.filter((m) => m.category === "lawyer" && !m.title.includes("Kurucu"));
  const interns = teamMembers.filter((m) => m.category !== "lawyer" && m.category !== "staff");
  const staff = teamMembers.filter((m) => m.category === "staff");

  const handleMemberClick = (member: (typeof teamMembers)[0]) => {
    setSelectedMember(member);
    setDetailOpen(true);
  };

  const renderGroup = (title: string, members: typeof teamMembers) => (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-[#1D1D1F] mb-5">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <motion.div
            key={member.name}
            variants={fadeUp}
            className="bg-white rounded-3xl p-6 shadow-apple hover:shadow-apple-lg transition-all duration-300 cursor-pointer group"
            onClick={() => handleMemberClick(member)}
          >
            <div className="flex items-center gap-4">
              <MemberPhoto
                photo={member.photo}
                name={member.name}
                initials={member.initials}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#1D1D1F] text-sm sm:text-base group-hover:text-[#007AFF] transition-colors truncate">
                  {member.name}
                </h3>
                <p className="text-sm text-[#86868B] mt-0.5">{member.title}</p>
              </div>
            </div>
            {member.specializations.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-4">
                {member.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#86868B]/10 text-[#86868B]"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        <motion.h1
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F] text-center"
        >
          Güçlü Kadromuz
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-center text-[#86868B] text-base sm:text-lg max-w-2xl mx-auto"
        >
          Seçkin avukat kadromuz ve alanında deneyimli idari personelimiz ile birlikte çalışıyor;
          her dosyayı aynı ciddiyetle ele alıyor ve müvekkillerimize hızlı, etkili, çözüm odaklı bir
          hizmet sunuyoruz.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        className="mt-10"
      >
        {renderGroup("Kurucular", founders)}
        {renderGroup("Avukatlar", lawyers)}
        {renderGroup("Stajyerler", interns)}
        {staff.length > 0 && renderGroup("İdari Personel", staff)}
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
