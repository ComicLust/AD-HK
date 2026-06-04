"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ArrowRight,
  Scale,
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
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  User,
  AtSign,
  MessageSquare,
  ListChecks,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReaderView from "@/components/ReaderView";
import { useSiteData } from "@/hooks/useSiteData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase, Heart, Home, Gavel, Shield, Landmark, Users, Building2, Wallet, Monitor, Globe, Scale,
};

interface ServiceDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── Service-specific reviews (SEO: user-generated content) ─── */
const serviceReviews = [
  {
    name: "Ahmet Y.",
    role: "Şirket Yöneticisi",
    text: "Ticari uyuşmazlığımızda gösterdikleri profesyonel yaklaşım ve hızlı çözüm odaklılıkları sayesinde olumlu sonuç aldık.",
    rating: 5,
    initials: "AY",
  },
  {
    name: "Elif K.",
    role: "Müvekkil",
    text: "En zor dönemde yanımdaydılar. Şefkatli ama aynı zamanda kararlı savunmalarıyla haklarımı korudular.",
    rating: 5,
    initials: "EK",
  },
  {
    name: "Mehmet S.",
    role: "Girişimci",
    text: "Uzmanlıkları sayesinde şirketimizi hukuki güvence altına alabildik. Kesinlikle tavsiye ediyorum.",
    rating: 5,
    initials: "MS",
  },
];

export default function ServiceDetailPage({ slug, onNavigate }: ServiceDetailPageProps) {
  const { services, firmInfo } = useSiteData();
  const service = services?.find((s) => s.slug === slug);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  if (!service) {
    return (
      <ReaderView>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-[#1D1D1F]">Hizmet bulunamadı</h1>
          <p className="mt-2 text-[#86868B]">Aradığınız hizmet sayfası mevcut değil.</p>
          <Button
            onClick={() => onNavigate("/hizmetlerimiz")}
            className="mt-6 rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white"
          >
            Hizmetlerimize Dön
          </Button>
        </div>
      </ReaderView>
    );
  }

  const Icon = iconMap[service.icon] || Scale;

  /* Get related services (exclude current) */
  const relatedServices = (services || []).filter((s) => s.slug !== slug).slice(0, 3);

  /* Service-specific trust points */
  const trustPointsIcons = [CheckCircle2, Clock, ShieldCheck, Headphones];
  const trustPoints = (service.trustPoints || []).map((text: string, idx: number) => ({
    icon: trustPointsIcons[idx % trustPointsIcons.length],
    text
  }));

  return (
    <div className="overflow-hidden">
      {/* ─── Hero Section ─── */}
      <section className="pt-8 pb-10 sm:pt-12 sm:pb-14 bg-gradient-to-b from-white to-[#F2F2F7]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {/* Breadcrumb */}
            <motion.nav variants={fadeUp} className="flex items-center gap-1 text-sm text-[#86868B] mb-8">
              <button onClick={() => onNavigate("/")} className="hover:text-[#1D1D1F] transition-colors">
                Ana Sayfa
              </button>
              <ChevronRight className="w-3 h-3" />
              <button onClick={() => onNavigate("/hizmetlerimiz")} className="hover:text-[#1D1D1F] transition-colors">
                Hizmetlerimiz
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#1D1D1F] font-medium">{service.name}</span>
            </motion.nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left: Service Info */}
              <motion.div variants={fadeUp} className="lg:col-span-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-8 h-8 text-[#007AFF]" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F]">
                      {service.name}
                    </h1>
                    <p className="text-sm text-[#007AFF] font-medium mt-1">Uzman Hukuki Danışmanlık</p>
                  </div>
                </div>

                {/* Trust points bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {trustPoints.map((point) => {
                    const PointIcon = point.icon;
                    return (
                      <div key={point.text} className="flex items-center gap-2 bg-white rounded-2xl px-3 py-2.5 shadow-apple">
                        <PointIcon className="w-4 h-4 text-[#34C759] shrink-0" />
                        <span className="text-xs font-medium text-[#1D1D1F]">{point.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Short Description */}
                <p className="text-lg text-[#86868B] leading-relaxed mb-6 font-medium">
                  {service.description}
                </p>

                <div className="hairline mb-6" />

                {/* Full Description */}
                <div className="prose prose-slate max-w-none text-base text-[#1D1D1F]/80 leading-[1.8] space-y-4">
                  {service.fullDescription.includes("<") && service.fullDescription.includes(">") ? (
                    <div dangerouslySetInnerHTML={{ __html: service.fullDescription }} />
                  ) : (
                    service.fullDescription.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="mb-4">
                        {paragraph.trim()}
                      </p>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Right: Sticky CTA Card */}
              <motion.div variants={fadeUp} className="lg:col-span-1">
                <div className="lg:sticky lg:top-24 space-y-4">
                  {/* Quick Contact Card */}
                  <div className="bg-white rounded-3xl p-6 shadow-apple-lg">
                    <h3 className="text-lg font-bold text-[#1D1D1F] mb-1">
                      Hemen Danışın
                    </h3>
                    <p className="text-xs text-[#86868B] mb-5">
                      {service.name} konusunda uzman ekibimize ulaşın
                    </p>

                    <div className="space-y-2.5 mb-5">
                      <a
                        href={`tel:${firmInfo.gsm.replace(/\s/g, "")}`}
                        className="flex items-center gap-3 w-full rounded-2xl px-4 py-3 bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold text-sm transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Hemen Ara
                      </a>
                      <a
                        href={firmInfo.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full rounded-2xl px-4 py-3 bg-[#34C759] hover:bg-[#2DB84D] text-white font-semibold text-sm transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        WhatsApp İletişim
                      </a>
                      <Button
                        onClick={() => onNavigate("/iletisim")}
                        variant="outline"
                        className="w-full rounded-2xl py-3 border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF]/8 font-semibold text-sm h-auto"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        İletişim Formu
                      </Button>
                    </div>

                    <div className="hairline mb-4" />

                    {/* Office Info */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#007AFF] mt-0.5 shrink-0" />
                        <span className="text-xs text-[#86868B] leading-relaxed">{firmInfo.address}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-[#007AFF] shrink-0" />
                        <span className="text-xs text-[#86868B]">{firmInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-[#007AFF] shrink-0" />
                        <span className="text-xs text-[#86868B]">Pzt - Cum: 09:00 - 18:00</span>
                      </div>
                    </div>
                  </div>

                  {/* Mini Map */}
                  <div className="bg-white rounded-3xl overflow-hidden shadow-apple">
                    <iframe
                      src="https://maps.google.com/maps?q=Florya+Senlik+Koy+Mah+Saci+Sokak+No+4+F+Bakirkoy+Istanbul&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      className="w-full h-40"
                      style={{ border: 0 }}
                      loading="lazy"
                      title="Ofis Konumu"
                    />
                    <div className="p-3">
                      <a
                        href="https://www.google.com/maps/dir/?api=1&destination=Florya+Senlik+Koy+Mah+Saci+Sokak+No+4+F+Bakirkoy+Istanbul"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-xs font-semibold text-[#007AFF] hover:text-[#0066D6] transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Yol Tarifi Al
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Contact Form Section (SEO Conversion) ─── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F] text-center mb-4">
              {service.name} Danışmanlık Talebi
            </motion.h2>
            <motion.p variants={fadeUp} className="text-center text-[#86868B] text-base sm:text-lg mb-10 max-w-2xl mx-auto">
              Formu doldurun, uzman ekibimiz en kısa sürede sizinle iletişime geçsin
            </motion.p>

            <motion.div variants={fadeUp} className="max-w-2xl mx-auto">
              <div className="bg-[#F2F2F7] rounded-3xl p-6 sm:p-8">
                {formSubmitted ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 rounded-full bg-[#34C759]/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-7 h-7 text-[#34C759]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1D1D1F]">Talebiniz Alındı</h3>
                    <p className="mt-2 text-sm text-[#86868B]">En kısa sürede size dönüş yapacağız.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                        <Input
                          required
                          className="h-12 pl-10 rounded-2xl border-[rgba(0,0,0,0.08)] bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                          placeholder="Ad Soyad"
                        />
                      </div>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                        <Input
                          type="email"
                          required
                          className="h-12 pl-10 rounded-2xl border-[rgba(0,0,0,0.08)] bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                          placeholder="E-posta"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-[#86868B] pointer-events-none">+90</span>
                        <Input
                          type="tel"
                          className="h-12 pl-[4.5rem] rounded-2xl border-[rgba(0,0,0,0.08)] bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                          placeholder="5XX XXX XX XX"
                          onInput={(e) => {
                            const input = e.currentTarget;
                            input.value = input.value.replace(/[^0-9]/g, '');
                          }}
                        />
                      </div>
                      <div className="relative">
                        <ListChecks className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                        <select
                          className="h-12 pl-10 pr-3 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white text-sm text-[#86868B] w-full focus:ring-[#007AFF] focus:border-[#007AFF] focus:text-[#1D1D1F] transition-all appearance-none"
                          defaultValue=""
                        >
                          <option value="" disabled>Bilgi Talebi</option>
                          <option>Hukuki Danışmanlık</option>
                          <option>Dava Takibi</option>
                          <option>Sözleşme Hazırlama</option>
                          <option>Diğer</option>
                        </select>
                      </div>
                    </div>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-[#86868B]" />
                      <Textarea
                        required
                        rows={4}
                        className="pl-10 rounded-2xl border-[rgba(0,0,0,0.08)] bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all resize-none"
                        placeholder={`${service.name} konusunda yaşamış olduğunuz durumu kısaca açıklayınız...`}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto rounded-full px-8 py-3 bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold text-base h-auto"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Danışmanlık Talebi Gönder
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Other Services Section ─── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F] text-center mb-4">
              Diğer Hizmetlerimiz
            </motion.h2>
            <motion.p variants={fadeUp} className="text-center text-[#86868B] text-base sm:text-lg mb-10 max-w-2xl mx-auto">
              Geniş uzmanlık alanlarımızla hukuki süreçlerinizde yanınızdayız
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {relatedServices.map((relatedService) => {
                const RelatedIcon = iconMap[relatedService.icon] || Scale;
                return (
                  <motion.div
                    key={relatedService.slug}
                    variants={fadeUp}
                    className="bg-white rounded-3xl p-6 shadow-apple text-left transition-all duration-300 hover:shadow-apple-lg hover:scale-[1.02] group cursor-pointer"
                    onClick={() => {
                      onNavigate(`/hizmetlerimiz/${relatedService.slug}`);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center mb-4 group-hover:bg-[#007AFF]/20 transition-colors">
                      <RelatedIcon className="w-6 h-6 text-[#007AFF]" />
                    </div>
                    <h3 className="text-base font-bold text-[#1D1D1F] mb-2">
                      {relatedService.name}
                    </h3>
                    <p className="text-sm text-[#86868B] leading-relaxed mb-3 line-clamp-2">
                      {relatedService.description.includes("<") && relatedService.description.includes(">") ? (
                        <span dangerouslySetInnerHTML={{ __html: relatedService.description }} />
                      ) : (
                        relatedService.description
                      )}
                    </p>
                    <span className="inline-flex items-center text-sm font-semibold text-[#007AFF] group-hover:gap-2 transition-all duration-200">
                      Detaylı Bilgi
                      <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <motion.div variants={fadeUp} className="mt-8 text-center">
              <Button
                onClick={() => onNavigate("/hizmetlerimiz")}
                variant="outline"
                className="rounded-full px-6 border-[rgba(0,0,0,0.12)] text-[#1D1D1F] font-semibold h-auto py-3"
              >
                Tüm Hizmetler
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Bottom CTA Banner ─── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="bg-[#0A2540] rounded-[28px] p-8 sm:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#007AFF]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#007AFF]/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <motion.h2
              variants={fadeUp}
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight relative"
            >
              {service.name} Konusunda Yardıma mı İhtiyacınız Var?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-3 text-base text-white/60 max-w-xl mx-auto relative"
            >
              Uzman ekibimiz hukuki süreçlerinizde size yardımcı olmaya hazır. İlk danışmanlık ücretsizdir.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 relative"
            >
              <a
                href={`tel:${firmInfo.gsm.replace(/\s/g, "")}`}
                className="rounded-full px-8 py-3 bg-white/15 backdrop-blur-md border border-white/25 text-white hover:bg-white/25 hover:border-white/40 font-semibold text-base h-auto inline-flex items-center gap-2 transition-all duration-200"
              >
                <Phone className="w-4 h-4" />
                Hemen Ara
              </a>
              <a
                href={firmInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-8 py-3 bg-white/15 backdrop-blur-md border border-white/25 text-white hover:bg-white/25 hover:border-white/40 font-semibold text-base h-auto inline-flex items-center gap-2 transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </a>
              <Button
                onClick={() => onNavigate("/iletisim")}
                variant="outline"
                className="rounded-full px-8 py-3 bg-white/15 backdrop-blur-md border border-white/25 text-white hover:bg-white/25 hover:border-white/40 font-semibold text-base h-auto transition-all duration-200"
              >
                İletişim Formu
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
