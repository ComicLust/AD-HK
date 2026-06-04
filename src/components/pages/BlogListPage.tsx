"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag, ChevronRight, ArrowRight, Search, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSiteData } from "@/hooks/useSiteData";

interface BlogListPageProps {
  onNavigate: (path: string) => void;
}

const ITEMS_PER_PAGE = 6;

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

export default function BlogListPage({ onNavigate }: BlogListPageProps) {
  const { homeData } = useSiteData();
  const allPosts = homeData?.blogPosts || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [currentPage, setCurrentPage] = useState(1);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="text-center mb-10"
      >
        <motion.h1
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F]"
        >
          Hukuk Gündemi
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-[#86868B] text-base sm:text-lg max-w-2xl mx-auto"
        >
          Son hukuki gelişmeler, makaleler ve büromuzdan yayınlar
        </motion.p>
      </motion.div>

      {/* Search Bar - full width on desktop */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="mb-4"
      >
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
          <Input
            className="h-12 pl-11 rounded-2xl border-[rgba(0,0,0,0.08)] bg-white text-sm focus:ring-[#007AFF] focus:border-[#007AFF] transition-all shadow-apple"
            placeholder="Makale ara..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Category Filters - horizontally scrollable on mobile */}
      <div
        className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1"
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
      <p className="text-xs text-[#86868B] mb-6">
        {filteredPosts.length} makale bulundu
      </p>

      {/* Blog Grid */}
      {paginatedPosts.length > 0 ? (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {paginatedPosts.map((post) => (
            <motion.article
              key={post.slug}
              variants={fadeUp}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-apple hover:shadow-apple-lg transition-all duration-300 cursor-pointer group"
              onClick={() => onNavigate(`/blog/${post.slug}`)}
            >
              {/* Category & Date */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#007AFF]/10 text-[#007AFF] text-xs font-semibold">
                  <Tag className="w-3 h-3" />
                  {post.category}
                </span>
                <span className="text-xs text-[#86868B] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] mb-3 line-clamp-2 group-hover:text-[#007AFF] transition-colors">
                {post.title}
              </h3>

              {/* Summary */}
              <p className="text-sm text-[#86868B] leading-relaxed line-clamp-4 mb-5">
                {post.summary}
              </p>

              {/* Read More Link */}
              <span className="inline-flex items-center text-sm font-semibold text-[#007AFF] group-hover:gap-2 transition-all duration-200">
                Devamını Oku
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.article>
          ))}
        </motion.div>
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
