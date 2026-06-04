"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Scale,
  Gavel,
  Building2,
  Wallet,
  Shield,
  Search,
} from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "İcra Hukuku": Scale,
  "Kira Hukuku": Building2,
  "Ceza Hukuku": Shield,
  "Tazminat Hukuku": Wallet,
  "Medeni Hukuk": FileText,
  "Ticaret Hukuku": Gavel,
};

export default function DilekcePage() {
  const { ornekDilekceler } = useSiteData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(ornekDilekceler.map((d) => d.category)));

  const filtered = ornekDilekceler.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.h1
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F] text-center"
        >
          Örnek Dilekçeler
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-center text-[#86868B] text-base sm:text-lg max-w-2xl mx-auto"
        >
          Hukuki süreçlerinize yardımcı olması için hazırladığımız örnek dilekçeleri ücretsiz
          indirerek kullanabilirsiniz
        </motion.p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-8 flex flex-col sm:flex-row items-center gap-3"
      >
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Dilekçe ara..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white text-sm focus:ring-[#007AFF] focus:border-[#007AFF] transition-all outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              !selectedCategory
                ? "bg-[#007AFF] text-white shadow-apple"
                : "bg-[#F2F2F7] text-[#86868B] hover:bg-[#007AFF]/10 hover:text-[#007AFF]"
            }`}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-[#007AFF] text-white shadow-apple"
                  : "bg-[#F2F2F7] text-[#86868B] hover:bg-[#007AFF]/10 hover:text-[#007AFF]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Dilekçe Listesi */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((dilekce, index) => {
            const CatIcon = categoryIconMap[dilekce.category] || FileText;
            return (
              <motion.div
                key={dilekce.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="bg-white rounded-3xl p-6 shadow-apple hover:shadow-apple-lg transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center shrink-0 group-hover:bg-[#007AFF]/20 transition-colors">
                    <CatIcon className="w-6 h-6 text-[#007AFF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-[#1D1D1F] mb-1 leading-snug">
                      {dilekce.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#86868B]/10 text-[#86868B] text-[10px] font-semibold">
                      {dilekce.category}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-[#86868B]">
                    Format: .{dilekce.fileFormat.toUpperCase()}
                  </span>
                  <a
                    href={dilekce.downloadUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      fetch("/api/analytics", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          event: "download",
                          path: `/ornek-dilekceler/${dilekce.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
                          targetId: dilekce.id
                        })
                      }).catch(() => {});
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white text-xs font-semibold transition-colors shadow-apple"
                  >
                    <Download className="w-3.5 h-3.5" />
                    İndir
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-[#86868B]/30 mx-auto mb-3" />
            <p className="text-[#86868B] text-base">Aramanıza uygun dilekçe bulunamadı.</p>
          </div>
        )}
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-12 bg-[#F2F2F7] rounded-3xl p-6 sm:p-8"
      >
        <div className="flex items-start gap-3">
          <Scale className="w-5 h-5 text-[#007AFF] mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-[#1D1D1F] mb-1">Önemli Not</h3>
            <p className="text-sm text-[#86868B] leading-relaxed">
              Bu dilekçeler yalnızca bilgilendirme amaçlı olup, hukuki danışmanlık yerine geçmez.
              Her hukuki süreç kendine özgü koşullar içerdiğinden, dilekçe kullanmadan önce mutlaka
              bir avukata danışmanızı öneririz. Adil Hukuk Danışmanlık Bürosu, bu dilekçelerin
              kullanımından doğabilecek sonuçlardan sorumluluk kabul etmez.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
