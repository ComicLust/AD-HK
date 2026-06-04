"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSiteData } from "@/hooks/useSiteData";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function ContactPage() {
  const { firmInfo, contactData } = useSiteData();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const phone = (document.getElementById("phone") as HTMLInputElement).value;
    const subject = (document.getElementById("subject") as HTMLInputElement).value;
    const message = (document.getElementById("message") as HTMLTextAreaElement).value;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message })
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Mesaj gönderilemedi, lütfen tekrar deneyin.");
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    }
  };

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
          Bize Ulaşın
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-center text-[#86868B] text-base sm:text-lg max-w-xl mx-auto"
        >
          Hukuki sorularınız ve danışmanlık talepleriniz için bizimle iletişime geçin
        </motion.p>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Contact Form */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-apple-lg">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#34C759]/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#34C759]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F]">Mesajınız Alındı</h3>
                <p className="mt-2 text-[#86868B]">En kısa sürede size dönüş yapacağız.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-[#1D1D1F]">
                      Ad Soyad
                    </Label>
                    <Input
                      id="name"
                      required
                      className="h-12 rounded-2xl border-[rgba(0,0,0,0.08)] bg-[#F2F2F7] focus:bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                      placeholder="Adınız Soyadınız"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-[#1D1D1F]">
                      E-posta
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      className="h-12 rounded-2xl border-[rgba(0,0,0,0.08)] bg-[#F2F2F7] focus:bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-[#1D1D1F]">
                      Telefon
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#86868B] pointer-events-none">+90</span>
                      <Input
                        id="phone"
                        type="tel"
                        className="h-12 pl-14 rounded-2xl border-[rgba(0,0,0,0.08)] bg-[#F2F2F7] focus:bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                        placeholder="5XX XXX XX XX"
                        onInput={(e) => {
                          const input = e.currentTarget;
                          input.value = input.value.replace(/[^0-9]/g, '');
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium text-[#1D1D1F]">
                      Konu
                    </Label>
                    <Input
                      id="subject"
                      required
                      className="h-12 rounded-2xl border-[rgba(0,0,0,0.08)] bg-[#F2F2F7] focus:bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                      placeholder="Danışmanlık konusu"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-[#1D1D1F]">
                    Mesaj
                  </Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    className="rounded-2xl border-[rgba(0,0,0,0.08)] bg-[#F2F2F7] focus:bg-white focus:ring-[#007AFF] focus:border-[#007AFF] transition-all resize-none"
                    placeholder="Mesajınızı yazın..."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto rounded-full px-8 py-3 bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold text-base h-auto"
                >
                  Mesaj Gönder
                </Button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="lg:col-span-2 space-y-4"
        >
          <motion.div variants={fadeUp} className="bg-white rounded-3xl p-6 shadow-apple">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#007AFF]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1D1D1F] text-sm">Adres</h3>
                <p className="text-sm text-[#86868B] leading-relaxed mt-1">{firmInfo.address}</p>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Florya+Senlik+Koy+Mah+Saci+Sokak+No+4+F+Bakirkoy+Istanbul"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#007AFF] hover:text-[#0066D6] mt-2 transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  Yol Tarifi
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white rounded-3xl p-6 shadow-apple">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#007AFF]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1D1D1F] text-sm">Telefon</h3>
                <a href={`tel:${firmInfo.phone.replace(/\s/g, "")}`} className="block text-sm text-[#86868B] hover:text-[#007AFF] transition-colors mt-1">
                  {firmInfo.phone}
                </a>
                <a href={`tel:${firmInfo.gsm.replace(/\s/g, "")}`} className="block text-sm text-[#86868B] hover:text-[#007AFF] transition-colors">
                  GSM: {firmInfo.gsm}
                </a>
                <p className="text-sm text-[#86868B] mt-0.5">Faks: {firmInfo.fax}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white rounded-3xl p-6 shadow-apple">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#007AFF]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1D1D1F] text-sm">E-posta</h3>
                <a href={`mailto:${firmInfo.email}`} className="text-sm text-[#86868B] hover:text-[#007AFF] transition-colors mt-1">
                  {firmInfo.email}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Google Map */}
          <motion.div variants={fadeUp} className="bg-white rounded-3xl overflow-hidden shadow-apple">
            <iframe
              src={contactData?.mapEmbedUrl || "https://maps.google.com/maps?q=Florya+Senlik+Koy+Mah+Saci+Sokak+No+4+F+Bakirkoy+Istanbul&t=&z=15&ie=UTF8&iwloc=&output=embed"}
              className="w-full h-48"
              style={{ border: 0 }}
              loading="lazy"
              title="Ofis Konumu"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
