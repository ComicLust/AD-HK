"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ArrowRight,
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
  Calendar,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReaderView from "@/components/ReaderView";
import { useSiteData } from "@/hooks/useSiteData";

interface BlogDetailPageProps {
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

/* ─── Trust points for blog pages ─── */
const trustPoints = [
  { icon: CheckCircle2, text: "Ücretsiz ilk danışmanlık" },
  { icon: Clock, text: "7/24 ulaşılabilirlik" },
  { icon: ShieldCheck, text: "Gizlilik garantisi" },
  { icon: Headphones, text: "Dosya takip desteği" },
];

export default function BlogDetailPage({ slug, onNavigate }: BlogDetailPageProps) {
  const { homeData, firmInfo, services } = useSiteData();
  const [previewPost, setPreviewPost] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const isPreview = searchParams.get("preview") === "true";
      if (isPreview) {
        const previewRaw = localStorage.getItem(`blog_preview_${slug}`);
        if (previewRaw) {
          try {
            setPreviewPost(JSON.parse(previewRaw));
          } catch (e) {
            console.error("Failed to parse preview blog post data", e);
          }
        }
      }
    }
  }, [slug]);

  const post = previewPost || homeData?.blogPosts?.find((p) => p.slug === slug);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  if (!post) {
    return (
      <ReaderView>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-[#1D1D1F]">Yazı bulunamadı</h1>
          <p className="mt-2 text-[#86868B]">Aradığınız blog yazısı mevcut değil.</p>
          <Button
            onClick={() => onNavigate("/blog")}
            className="mt-6 rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white"
          >
            Blog Sayfasına Dön
          </Button>
        </div>
      </ReaderView>
    );
  }

  // Related posts (same category, exclude current)
  const relatedPosts = (homeData?.blogPosts || [])
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  // Related service based on category
  const relatedService = (services || []).find((s) =>
    post.category.toLowerCase().includes(s.name.toLowerCase().replace(" hukuku", "").replace(" ve infaz", ""))
  );

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
              <button onClick={() => onNavigate("/blog")} className="hover:text-[#1D1D1F] transition-colors">
                Blog
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#1D1D1F] font-medium line-clamp-1">{post.title}</span>
            </motion.nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left: Blog Content */}
              <motion.div variants={fadeUp} className="lg:col-span-2">
                {/* Category & Date */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#007AFF]/10 text-[#007AFF] text-sm font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    {post.category}
                  </span>
                  <span className="text-sm text-[#86868B] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1D1D1F] leading-[1.2] mb-6">
                  {post.title}
                </h1>

                {/* Cover Image */}
                {post.coverImage && (
                  <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-8 shadow-apple">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}

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

                {/* Summary highlight */}
                <div className="bg-[#007AFF]/5 border-l-4 border-[#007AFF] rounded-r-2xl p-5 mb-8">
                  <p className="text-base text-[#1D1D1F]/80 leading-relaxed font-medium">
                    {post.summary}
                  </p>
                </div>

                <div className="hairline mb-8" />

                {/* Full article content */}
                <div className="prose-custom space-y-5">
                  {post.content ? (
                    <div 
                      className="text-base text-[#1D1D1F]/80 leading-[1.8] space-y-4 prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={{ __html: post.content }} 
                    />
                  ) : (
                    <>
                      <p className="text-base text-[#1D1D1F]/80 leading-[1.8]">
                        {post.title}, günümüz hukuk dünyasında en çok merak edilen ve tartışılan konulardan biri olarak öne çıkmaktadır. Bu makalemizde konuya ilişkin detaylı bilgilendirme yaparak, haklarınızı ve yükümlülüklerinizi en doğru şekilde anlamanızı sağlamayı hedefliyoruz.
                      </p>
                      <p className="text-base text-[#1D1D1F]/80 leading-[1.8]">
                        Hukuki süreçler, genellikle karmaşık ve zaman alıcı yapısıyla bilinir. Ancak doğru danışmanlık ve stratejik yaklaşımla, bu süreçler çok daha yönetilebilir hale gelmektedir. Adil Hukuk Danışmanlık olarak, müvekkillerimize süreç boyunca şeffaf bilgilendirme ve etkin hukuki temsil sunuyoruz.
                      </p>
                      <p className="text-base text-[#1D1D1F]/80 leading-[1.8]">
                        {post.category} alanında yaşanan son yasal değişiklikler ve uygulamadaki güncel gelişmeler, hak arama özgürlüğü kapsamında önemli sonuçlar doğurabilmektedir. Bu nedenle, hukuki sorunlarınızda uzman bir avukata danışmak, hak kaybına uğramamanız açısından büyük önem taşımaktadır.
                      </p>
                      <p className="text-base text-[#1D1D1F]/80 leading-[1.8]">
                        Uzman kadromuz, {post.category} konusunda yıllara dayanan deneyimiyle müvekkillerine en güçlü hukuki desteği sunmaktadır. İlk danışmanlık ücretsiz olup, davanızın değerlendirmesi yapılarak en uygun hukuki strateji belirlenmektedir.
                      </p>
                    </>
                  )}
                </div>

                {/* Related Service Link */}
                {relatedService && (
                  <div className="mt-10 bg-[#F2F2F7] rounded-3xl p-6">
                    <p className="text-xs text-[#86868B] font-medium mb-2">İLGİLİ HİZMETİMİZ</p>
                    <h3 className="text-lg font-bold text-[#1D1D1F] mb-2">{relatedService.name}</h3>
                    <p className="text-sm text-[#86868B] leading-relaxed mb-4">
                      {relatedService.description.includes("<") && relatedService.description.includes(">") ? (
                        <span dangerouslySetInnerHTML={{ __html: relatedService.description }} />
                      ) : (
                        relatedService.description
                      )}
                    </p>
                    <button
                      onClick={() => {
                        onNavigate(`/hizmetlerimiz/${relatedService.slug}`);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="inline-flex items-center text-sm font-semibold text-[#007AFF] hover:gap-2 transition-all duration-200"
                    >
                      Detaylı Bilgi
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                )}
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
                      {post.category} konusunda uzman ekibimize ulaşın
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
                        <a href={`tel:${firmInfo.phone.replace(/\s/g, "")}`} className="text-xs text-[#86868B] hover:text-[#007AFF] transition-colors">{firmInfo.phone}</a>
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

      {/* ─── Contact Form Section (Conversion) ─── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F] text-center mb-4">
              {post.category} Danışmanlık Talebi
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
                        placeholder={`${post.category} konusunda yaşamış olduğunuz durumu kısaca açıklayınız...`}
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

      {/* ─── Other Articles Section ─── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F] text-center mb-4">
              Diğer Yazılarımız
            </motion.h2>
            <motion.p variants={fadeUp} className="text-center text-[#86868B] text-base sm:text-lg mb-10 max-w-2xl mx-auto">
              Hukuki gelişmeler ve güncel makaleler
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {relatedPosts.map((relatedPost) => (
                <motion.div
                  key={relatedPost.slug}
                  variants={fadeUp}
                  className="bg-white rounded-3xl p-6 shadow-apple text-left transition-all duration-300 hover:shadow-apple-lg hover:scale-[1.02] group cursor-pointer"
                  onClick={() => {
                    onNavigate(`/blog/${relatedPost.slug}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#007AFF]/10 text-[#007AFF] text-xs font-semibold">
                      <Tag className="w-3 h-3" />
                      {relatedPost.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#1D1D1F] mb-2 line-clamp-2 group-hover:text-[#007AFF] transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-[#86868B] leading-relaxed mb-3 line-clamp-2">
                    {relatedPost.summary}
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-[#007AFF] group-hover:gap-2 transition-all duration-200">
                    Devamını Oku
                    <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="mt-8 text-center">
              <Button
                onClick={() => onNavigate("/blog")}
                variant="outline"
                className="rounded-full px-6 border-[rgba(0,0,0,0.12)] text-[#1D1D1F] font-semibold h-auto py-3"
              >
                Tüm Yazılar
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
              {post.category} Konusunda Yardıma mı İhtiyacınız Var?
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
