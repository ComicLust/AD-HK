"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import ReaderView from "@/components/ReaderView";
import { useSiteData } from "@/hooks/useSiteData";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function JoinUsPage() {
  const { joinUsData } = useSiteData();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <ReaderView>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div variants={fadeUp} className="text-center mb-8">
          <p className="text-sm font-semibold text-[#007AFF] uppercase tracking-widest mb-2">
            İnsan Kaynakları
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F]">
            Bize Katılın
          </h1>
        </motion.div>

        <motion.p variants={fadeUp} className="text-base text-[#1D1D1F]/80 leading-[1.75] text-center">
          {joinUsData.intro}
        </motion.p>

        <div className="hairline mt-8 mb-8" />

        <motion.div variants={fadeUp}>
          <h2 className="text-lg font-bold text-[#1D1D1F] mb-4">Adaylarda aradığımız özellikler:</h2>
          <ul className="space-y-3">
            {joinUsData.requirements.map((req) => (
              <li key={req} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#007AFF] mt-0.5 shrink-0" />
                <span className="text-base text-[#1D1D1F]/80 leading-relaxed">{req}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-4 text-sm text-[#86868B] italic">
          {joinUsData.toeftNote}
        </motion.p>

        <motion.p variants={fadeUp} className="mt-4 text-base text-[#1D1D1F]/80 leading-[1.75]">
          {joinUsData.note}
        </motion.p>

        <div className="hairline mt-8 mb-8" />

        {/* Application Form */}
        <motion.div variants={fadeUp}>
          <h2 className="text-lg font-bold text-[#1D1D1F] mb-4">Başvuru Formu</h2>
          {submitted ? (
            <div className="text-center py-12 bg-white rounded-3xl shadow-apple">
              <div className="w-16 h-16 rounded-full bg-[#34C759]/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#34C759]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1F]">Başvurunuz Alındı</h3>
              <p className="mt-2 text-[#86868B]">En kısa sürede size dönüş yapacağız.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-apple space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="j-name" className="text-sm font-medium text-[#1D1D1F]">
                    Ad Soyad
                  </Label>
                  <Input
                    id="j-name"
                    required
                    className="h-12 rounded-2xl border-[rgba(0,0,0,0.08)] bg-[#F2F2F7] focus:bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="j-email" className="text-sm font-medium text-[#1D1D1F]">
                    E-posta
                  </Label>
                  <Input
                    id="j-email"
                    type="email"
                    required
                    className="h-12 rounded-2xl border-[rgba(0,0,0,0.08)] bg-[#F2F2F7] focus:bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="j-phone" className="text-sm font-medium text-[#1D1D1F]">
                    Telefon
                  </Label>
                  <Input
                    id="j-phone"
                    type="tel"
                    className="h-12 rounded-2xl border-[rgba(0,0,0,0.08)] bg-[#F2F2F7] focus:bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="j-position" className="text-sm font-medium text-[#1D1D1F]">
                    Pozisyon
                  </Label>
                  <Input
                    id="j-position"
                    required
                    className="h-12 rounded-2xl border-[rgba(0,0,0,0.08)] bg-[#F2F2F7] focus:bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                    placeholder="Avukat / Stajyer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="j-message" className="text-sm font-medium text-[#1D1D1F]">
                  Mesaj
                </Label>
                <Textarea
                  id="j-message"
                  rows={5}
                  className="rounded-2xl border-[rgba(0,0,0,0.08)] bg-[#F2F2F7] focus:bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all resize-none"
                  placeholder="Kendinizi kısaca tanıtın ve neden bizimle çalışmak istediğinizi belirtin..."
                />
              </div>
              <Button
                type="submit"
                className="rounded-full px-8 py-3 bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold text-base h-auto"
              >
                Başvuruyu Gönder
              </Button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </ReaderView>
  );
}
