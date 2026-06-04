"use client";

import { motion } from "framer-motion";
import {
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
  ChevronRight,
  Scale,
  PhoneCall,
  ShieldCheck,
  Award,
  Handshake,
} from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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
  Scale,
};

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function ServicesPage({ onNavigate }: ServicesPageProps) {
  const { services, firmInfo } = useSiteData();

  const handleScrollToContact = () => {
    document.getElementById("iletisim-formu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 select-none">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        <motion.h1
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F] text-center"
        >
          Uzmanlık Alanlarımız ve Hizmetlerimiz
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-center text-[#86868B] text-base sm:text-lg max-w-2xl mx-auto"
        >
          Geniş hukuki bilgi birikimimizle, her alanda müvekkillerimize en üst düzey hizmeti sunuyoruz
        </motion.p>

        {/* Centered CTA Button */}
        <motion.div variants={fadeUp} className="mt-6 flex justify-center">
          <button
            onClick={handleScrollToContact}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white text-sm font-bold shadow-apple hover:shadow-apple-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            Hemen Avukatla Görüşün / Durumunuzu Anlatın
          </button>
        </motion.div>

        {/* Trust Band */}
        <motion.div
          variants={fadeUp}
          className="mt-8 mx-auto max-w-3xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 py-3 px-6 rounded-2xl bg-[#F2F2F7] dark:bg-[#1C1C1E] border border-border/40 text-xs font-semibold text-foreground/70"
        >
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#34C759]" />
            <span>Tam Gizlilik Garantisi</span>
          </div>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#007AFF]" />
            <span>20+ Yıllık Tecrübe</span>
          </div>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <Handshake className="w-4 h-4 text-[#FF9500]" />
            <span>Hızlı Değerlendirme</span>
          </div>
        </motion.div>

        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Scale;
            const isUrgent =
              service.name.toLowerCase().includes("ceza") ||
              service.name.toLowerCase().includes("icra") ||
              service.name.toLowerCase().includes("icra");

            return (
              <motion.button
                key={service.slug}
                variants={fadeUp}
                onClick={() => onNavigate(`/hizmetlerimiz/${service.slug}`)}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-apple text-left transition-all duration-300 hover:shadow-apple-lg hover:scale-[1.01] group relative overflow-hidden"
              >
                {/* Urgent support badge */}
                {isUrgent && (
                  <span className="absolute top-4 right-4 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                    ⚡ Acil Hukuki Yardım
                  </span>
                )}

                <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center mb-4 group-hover:bg-[#007AFF]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#007AFF]" />
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-2 pr-20">{service.name}</h3>
                <p className="text-sm text-[#86868B] leading-relaxed mb-6">
                  {service.description.includes("<") && service.description.includes(">") ? (
                    <span dangerouslySetInnerHTML={{ __html: service.description }} />
                  ) : (
                    service.description
                  )}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="inline-flex items-center text-sm font-semibold text-[#007AFF] group-hover:gap-2 transition-all">
                    Devamını Oku
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </span>

                  {isUrgent && (
                    <a
                      href={`tel:${firmInfo?.gsm?.replace(/\s/g, "") || "+905317760283"}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition-all shadow-sm shrink-0"
                    >
                      <PhoneCall className="w-3 h-3" />
                      Acil Ara
                    </a>
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
