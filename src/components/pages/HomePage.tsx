"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  FileText,
  ShieldCheck,
  Briefcase,
  Heart,
  Home,
  Gavel,
  Shield,
  Landmark,
  Users,
  Building2,
  Wallet,
  Monitor,
  Globe,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Phone,
  Award,
  Target,
  Eye,
  Calendar,
  Tag,
  Quote,
  Star,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Linkedin,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSiteData } from "@/hooks/useSiteData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Scale,
  FileText,
  ShieldCheck,
  Briefcase,
  Heart,
  Home,
  Gavel,
  Shield,
  Landmark,
  Users,
  Building2,
  Wallet,
  Monitor,
  Globe,
  Award,
  Target,
  Eye,
};

// Custom icon for HeartHandshake (not in lucide)
function HeartHandshake({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M12 5 9.5 7.5 12 10" />
      <path d="m12 5 2.5 2.5L12 10" />
    </svg>
  );
}

const whyUsIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Target,
  Eye,
  HeartHandshake,
};

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
    { icon: Instagram, href: member.socialLinks?.instagram || "", label: "Instagram" },
    { icon: Twitter, href: member.socialLinks?.twitter || "", label: "X (Twitter)" },
    { icon: Youtube, href: member.socialLinks?.youtube || "", label: "YouTube" },
    { icon: Facebook, href: member.socialLinks?.facebook || "", label: "Facebook" },
    { icon: Linkedin, href: member.socialLinks?.linkedin || "", label: "LinkedIn" },
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

interface HomePageProps {
  onNavigate: (path: string) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Hero Slider ─── */
function HeroSlider({ onNavigate }: HomePageProps) {
  const { homeData } = useSiteData();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slides = homeData?.heroSlides || [];
  const touchStartX = useRef<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  // Keyboard support
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  const slide = slides[current] || { title: "", subtitle: "", cta: "", ctaLink: "" };

  const handleCta = () => {
    if (slide.ctaLink.startsWith("tel:")) {
      window.location.href = slide.ctaLink;
    } else {
      onNavigate(slide.ctaLink);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      ref={sliderRef}
      className="pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-32 lg:pb-24 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #1D1D1F 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Prev/Next Buttons - positioned outside text content */}
        <button
          onClick={prev}
          className="flex absolute left-1 sm:left-4 lg:left-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow-apple items-center justify-center text-[#1D1D1F]/60 hover:text-[#007AFF] transition-all duration-200 z-10"
          aria-label="Önceki slayt"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={next}
          className="flex absolute right-1 sm:right-4 lg:right-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white shadow-apple items-center justify-center text-[#1D1D1F]/60 hover:text-[#007AFF] transition-all duration-200 z-10"
          aria-label="Sonraki slayt"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="text-center max-w-3xl mx-auto min-h-[280px] sm:min-h-[320px] lg:min-h-[360px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col items-center px-8 sm:px-12"
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1D1D1F] leading-[1.1]">
                {slide.title}
              </h1>
              <p className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl text-[#86868B] leading-relaxed max-w-2xl">
                {slide.subtitle}
              </p>
              <div className="mt-6 sm:mt-8 flex flex-row items-center justify-center gap-2 sm:gap-4 flex-nowrap">
                <Button
                  onClick={handleCta}
                  className="rounded-full px-4 py-2 sm:px-8 sm:py-3 bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold text-xs sm:text-base shadow-apple h-auto whitespace-nowrap"
                >
                  {slide.cta}
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </Button>
                <Button
                  onClick={() => onNavigate("/iletisim")}
                  variant="outline"
                  className="rounded-full px-4 py-2 sm:px-8 sm:py-3 border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF]/8 font-semibold text-xs sm:text-base h-auto whitespace-nowrap"
                >
                  Bize Ulaşın
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-8 bg-[#007AFF]"
                  : "w-1.5 bg-[#86868B]/30 hover:bg-[#86868B]/50"
              }`}
              aria-label={`Slayt ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Why Choose Us ─── */
function WhyUsSection() {
  const { homeData } = useSiteData();
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F] text-center mb-4"
          >
            Neden Biz?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-center text-[#86868B] text-base sm:text-lg mb-10 max-w-2xl mx-auto"
          >
            Hukuki süreçlerinizde fark yaratan yaklaşımımız
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {(homeData?.whyUs || []).map((item) => {
              const Icon = whyUsIconMap[item.icon] || Award;
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="bg-[#F2F2F7] rounded-3xl p-6 sm:p-8 text-center group hover:bg-[#007AFF]/5 transition-colors duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-[#007AFF]/20 transition-colors">
                    <Icon className="w-8 h-8 text-[#007AFF]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1D1D1F] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#86868B] leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Enhanced Service Cards ─── */
function ServicesSection({ onNavigate }: HomePageProps) {
  const { services } = useSiteData();
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F] text-center mb-4"
          >
            Uzmanlık Alanlarımız
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-center text-[#86868B] text-base sm:text-lg mb-10 max-w-2xl mx-auto"
          >
            Geniş hizmet yelpazemizle hukuki süreçlerinizde yanınızdayız
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {(services || []).map((service) => {
              const Icon = iconMap[service.icon] || Scale;
              return (
                <motion.div
                  key={service.slug}
                  variants={fadeUp}
                  className="bg-white rounded-3xl p-6 sm:p-7 shadow-apple text-left transition-all duration-300 hover:shadow-apple-lg hover:scale-[1.02] group cursor-pointer"
                  onClick={() =>
                    onNavigate(`/hizmetlerimiz/${service.slug}`)
                  }
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center mb-4 group-hover:bg-[#007AFF]/20 transition-colors">
                    <Icon className="w-7 h-7 text-[#007AFF]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1D1D1F] mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-[#86868B] leading-relaxed mb-4 line-clamp-2">
                    {service.description.includes("<") && service.description.includes(">") ? (
                      <span dangerouslySetInnerHTML={{ __html: service.description }} />
                    ) : (
                      service.description
                    )}
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-[#007AFF] group-hover:gap-2 transition-all duration-200">
                    Detaylı Bilgi
                    <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Blog / Hukuk Gündemi ─── */
function BlogSection({ onNavigate }: HomePageProps) {
  const { homeData } = useSiteData();
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F] text-center mb-4"
          >
            Hukuk Gündemi
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-center text-[#86868B] text-base sm:text-lg mb-10 max-w-2xl mx-auto"
          >
            Son hukuki gelişmeler ve büromuzdan yayınlar
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {(homeData?.blogPosts || []).slice(0, 4).map((post) => (
              <motion.article
                key={post.slug}
                variants={fadeUp}
                className="bg-[#F2F2F7] rounded-3xl p-6 group hover:bg-white hover:shadow-apple-lg transition-all duration-300 cursor-pointer"
                onClick={() => onNavigate(`/blog/${post.slug}`)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#007AFF]/10 text-[#007AFF] text-xs font-semibold">
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>
                  <span className="text-xs text-[#86868B] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1D1D1F] mb-2 line-clamp-2 group-hover:text-[#007AFF] transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-[#86868B] leading-relaxed line-clamp-3">
                  {post.summary}
                </p>
              </motion.article>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-8 text-center">
            <Button
              onClick={() => onNavigate("/blog")}
              variant="outline"
              className="rounded-full px-6 border-[rgba(0,0,0,0.12)] text-[#1D1D1F] font-semibold h-auto py-3"
            >
              Tüm Yayınlar
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Müvekkil Yorumları ─── */
function TestimonialsSection() {
  const { homeData } = useSiteData();
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F] text-center mb-4"
          >
            Müvekkil Yorumları
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-center text-[#86868B] text-base sm:text-lg mb-10 max-w-2xl mx-auto"
          >
            Müvekkillerimizin güvenini hak eden hizmet anlayışımız
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {(homeData?.testimonials || []).map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-apple relative"
              >
                <div className="absolute top-6 right-6 text-[#007AFF]/15">
                  <Quote className="w-10 h-10" />
                </div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#FF9500] text-[#FF9500]"
                    />
                  ))}
                </div>
                <p className="text-sm text-[#1D1D1F]/80 leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#007AFF]">
                      {t.initials}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1D1D1F]">
                      {t.name}
                    </p>
                    <p className="text-xs text-[#86868B]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Member Photo with fallback ─── */
function MemberPhoto({
  photo,
  name,
  initials,
  size = "lg",
}: {
  photo: string;
  name: string;
  initials: string;
  size?: "sm" | "lg" | "xl";
}) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
  };
  const textClasses = {
    sm: "text-sm",
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

/* ─── Team Preview ─── */
function TeamPreview({ onNavigate }: HomePageProps) {
  const { teamMembers } = useSiteData();
  const [selectedMember, setSelectedMember] = useState<
    any | null
  >(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const keyTeam = (teamMembers || []).filter(
    (m: any) => m.category === "lawyer" && m.bio
  );

  const handleMemberClick = (member: (typeof teamMembers)[0]) => {
    setSelectedMember(member);
    setDetailOpen(true);
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F] text-center mb-4"
          >
            Ekibimiz
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-center text-[#86868B] text-base sm:text-lg mb-10 max-w-2xl mx-auto"
          >
            Alanında uzman avukat kadromuzla tanışın
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {keyTeam.slice(0, 6).map((member) => (
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
                {member.specializations.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
                    {member.specializations.slice(0, 3).map((spec) => (
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

          <motion.div variants={fadeUp} className="mt-8 text-center">
            <Button
              onClick={() => onNavigate("/ekibimiz")}
              variant="outline"
              className="rounded-full px-6 border-[rgba(0,0,0,0.12)] text-[#1D1D1F] font-semibold h-auto py-3"
            >
              Tüm Ekip
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Team Member Detail Modal */}
      <TeamMemberCard
        member={selectedMember}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </section>
  );
}

/* ─── FAQ ─── */
function FAQSection() {
  const { homeData } = useSiteData();
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F] text-center mb-4"
          >
            Sıkça Sorulan Sorular
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-center text-[#86868B] text-base sm:text-lg mb-10 max-w-2xl mx-auto"
          >
            En çok merak edilenlere hızlı cevaplar
          </motion.p>

          <motion.div variants={fadeUp}>
            <Accordion type="single" collapsible className="space-y-3">
              {(homeData?.faqItems || []).map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="bg-white rounded-2xl px-6 shadow-apple border-none data-[state=open]:shadow-apple-lg transition-shadow"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-semibold text-[#1D1D1F] hover:no-underline hover:text-[#007AFF] transition-colors [&[data-state=open]>svg]:rotate-180 [&>svg]:text-[#007AFF]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[#86868B] leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTASection({ onNavigate }: HomePageProps) {
  const { homeData } = useSiteData();
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="bg-[#0A2540] rounded-[28px] p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#007AFF]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#007AFF]/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight relative"
          >
            {homeData?.ctaSection?.title || ""}
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-base sm:text-lg text-white/60 max-w-xl mx-auto relative"
          >
            {homeData?.ctaSection?.subtitle || ""}
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 relative"
          >
            <Button
              onClick={() => onNavigate("/iletisim")}
              className="rounded-full px-8 py-3 bg-white/15 backdrop-blur-md border border-white/25 text-white hover:bg-white/25 hover:border-white/40 font-semibold text-base h-auto transition-all duration-200"
            >
              Bize Ulaşın
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <a
              href={`tel:+905317760283`}
              className="rounded-full px-8 py-3 bg-white/15 backdrop-blur-md border border-white/25 text-white hover:bg-white/25 hover:border-white/40 font-semibold text-base h-auto inline-flex items-center gap-2 transition-all duration-200"
            >
              <Phone className="w-4 h-4" />
              Hemen Ara
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Main HomePage ─── */
export default function HomePage({ onNavigate }: HomePageProps) {
  const { homeData } = useSiteData();
  return (
    <div className="overflow-hidden">
      <HeroSlider onNavigate={onNavigate} />

      {/* Feature Cards (compact) */}
      <section className="pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
          >
            {(homeData?.features || []).map((feature) => {
              const Icon = iconMap[feature.icon] || Scale;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-apple"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#007AFF]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1D1D1F] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#86868B] leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <WhyUsSection />
      <ServicesSection onNavigate={onNavigate} />
      <BlogSection onNavigate={onNavigate} />
      <TestimonialsSection />
      <TeamPreview onNavigate={onNavigate} />
      <FAQSection />
      <CTASection onNavigate={onNavigate} />
    </div>
  );
}
