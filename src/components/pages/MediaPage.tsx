"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Megaphone, BookOpen, Video, ExternalLink, Search, ChevronLeft, ChevronRight, Calendar, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSiteData } from "@/hooks/useSiteData";

const tabIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  basinda: Megaphone,
  makaleler: BookOpen,
  videolar: Video,
};

const placeholderVideoItems = [
  { title: "Miras Hukuku - Bilmeniz Gerekenler", date: "12 Ocak 2025", summary: "Miras hukuku hakkında sıkça sorulan sorular ve bilmeniz gereken hukuki detaylar." },
  { title: "Boşanma Sürecinde Dikkat Edilmesi Gerekenler", date: "5 Ocak 2025", summary: "Boşanma davalarında haklarınız ve süreç hakkında bilgilendirme." },
];

const ITEMS_PER_PAGE = 6;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

/* ─── Pagination Component ─── */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-[#86868B] hover:text-[#007AFF] hover:bg-[#007AFF]/6 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((page, idx) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-sm text-[#86868B]">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
              currentPage === page
                ? "bg-[#007AFF] text-white shadow-sm"
                : "text-[#86868B] hover:text-[#007AFF] hover:bg-[#007AFF]/6"
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-[#86868B] hover:text-[#007AFF] hover:bg-[#007AFF]/6 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─── Article List with Search, Category & Pagination ─── */
function ArticleList({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { homeData } = useSiteData();
  const allPosts = homeData?.blogPosts || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [currentPage, setCurrentPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(allPosts.map((p) => p.category));
    return ["Tümü", ...Array.from(cats)];
  }, [allPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Tümü" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allPosts, searchQuery, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Search Bar - full width on desktop */}
      <div className="mb-4">
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
          <Input
            className="h-12 pl-11 rounded-2xl border-[rgba(0,0,0,0.08)] bg-white text-sm focus:ring-[#007AFF] focus:border-[#007AFF] transition-all shadow-apple"
            placeholder="Makale ara..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filters - horizontally scrollable on mobile */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide -mx-1 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === cat
                ? "bg-[#007AFF] text-white shadow-sm"
                : "bg-white text-[#86868B] hover:text-[#007AFF] hover:bg-[#007AFF]/6 border border-[rgba(0,0,0,0.08)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-[#86868B] mb-4">
        {filteredPosts.length} makale bulundu
      </p>

      {/* Posts Grid */}
      {paginatedPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paginatedPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="bg-white rounded-3xl p-6 shadow-apple hover:shadow-apple-lg transition-all duration-300 group cursor-pointer"
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
              <h3 className="text-base font-bold text-[#1D1D1F] leading-snug mb-3 group-hover:text-[#007AFF] transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-[#86868B] leading-relaxed line-clamp-3">
                {post.summary}
              </p>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[#86868B]">Aramanızla eşleşen makale bulunamadı.</p>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

interface MediaPageProps {
  initialTab?: string;
  onNavigate?: (path: string) => void;
}

export default function MediaPage({ initialTab, onNavigate }: MediaPageProps) {
  const { mediaTabs, basindaBizItems, videos } = useSiteData();
  const activeTab = initialTab || "basinda";

  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, "", path);
      window.dispatchEvent(new Event("pushstate"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
        <motion.h1
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F] text-center"
        >
          Medya & Yayınlar
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-center text-[#86868B] text-base sm:text-lg max-w-2xl mx-auto"
        >
          Basında biz, hukuki makaleler ve yayınlarımız
        </motion.p>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-10">
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center bg-white rounded-2xl p-1.5 shadow-apple mb-8 h-auto gap-1">
            {mediaTabs.map((tab) => {
              const Icon = tabIcons[tab.id];
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-xl px-4 py-2.5 text-sm data-[state=active]:bg-[#007AFF] data-[state=active]:text-white data-[state=active]:shadow-sm flex items-center gap-1.5"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {mediaTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              {tab.id === "basinda" ? (
                /* ─── Basında Biz: Real Data ─── */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {basindaBizItems.map((item, index) => (
                    <motion.a
                      key={item.id}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.06 }}
                      className="bg-white rounded-3xl p-6 shadow-apple hover:shadow-apple-lg transition-all duration-300 group block"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-[#007AFF]/10 flex items-center justify-center shrink-0">
                          <Megaphone className="w-3 h-3 text-[#007AFF]" />
                        </div>
                        <span className="text-xs font-semibold text-[#007AFF]">{item.source}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#1D1D1F] leading-snug mb-3 group-hover:text-[#007AFF] transition-colors line-clamp-3">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-[#86868B]">
                        <ExternalLink className="w-3 h-3" />
                        <span>{item.sourceDomain}</span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              ) : tab.id === "makaleler" ? (
                /* ─── Makaleler: Blog Content with Search, Category & Pagination ─── */
                <ArticleList onNavigate={handleNav} />
              ) : tab.id === "videolar" ? (
                /* ─── Videolar: Real Video Content ─── */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {(videos && videos.length > 0 ? videos : placeholderVideoItems).map((item: any, index: number) => {
                    const videoId = item.videoUrl ? (item.videoUrl.includes("embed/") ? item.videoUrl.split("embed/")[1]?.split("?")[0] : item.videoUrl.split("v=")[1]?.split("&")[0]) : null;
                    const embedUrl = item.videoUrl?.includes("embed") ? item.videoUrl : videoId ? `https://www.youtube.com/embed/${videoId}` : null;
                    const displayThumbnail = item.thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null);

                    return (
                      <motion.div
                        key={item.id || index}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="bg-white rounded-3xl overflow-hidden shadow-apple hover:shadow-apple-lg transition-all duration-300 group"
                      >
                        {embedUrl ? (
                          <div className="relative aspect-video w-full bg-black overflow-hidden">
                            <iframe
                              src={embedUrl}
                              title={item.title}
                              className="absolute inset-0 w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : displayThumbnail ? (
                          <div className="relative aspect-video w-full overflow-hidden bg-black">
                            <img
                              src={displayThumbnail}
                              alt={item.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : null}
                        <div className="p-6">
                          <span className="text-xs text-[#86868B] font-medium">
                            {item.date || (item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "")}
                          </span>
                          <h3 className="mt-2 text-base font-bold text-[#1D1D1F] line-clamp-1">{item.title}</h3>
                          <p className="mt-2 text-sm text-[#86868B] leading-relaxed line-clamp-2">{item.description || item.summary || ""}</p>
                          {item.videoUrl && !embedUrl && (
                            <a
                              href={item.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#007AFF] hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              YouTube'da İzle
                            </a>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : null}
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  );
}
