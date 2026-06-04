"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import SlugInput from "@/components/admin/SlugInput";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import SeoForm from "@/components/admin/SeoForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, ArrowUpRight, BookOpen, Calendar, Tag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  coverImage: string | null;
  authorId: string | null;
  publishedAt: string;
  isPublished: boolean;
  tags: string; // JSON array
  author?: {
    id: string;
    name: string;
  } | null;
}

interface TeamMember {
  id: string;
  name: string;
  category: string;
}

const defaultCategories = [
  "Ticaret Hukuku", "Aile Hukuku", "Miras Hukuku", "Ceza Hukuku", 
  "İş Hukuku", "Gayrimenkul Hukuku", "Bilişim Hukuku", "Fintek Hukuku", "Vatandaşlık Hukuku"
];

export default function ArticlesPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [authors, setAuthors] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Ticaret Hukuku");
  const [coverImage, setCoverImage] = useState("");
  const [authorId, setAuthorId] = useState<string>("");
  const [isPublished, setIsPublished] = useState(true);
  const [tagsStr, setTagsStr] = useState("");
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [newCategory, setNewCategory] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPosts();
    loadAuthors();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const uniqueCats = new Set([...defaultCategories, ...posts.map((p) => p.category)]);
      setCategories(Array.from(uniqueCats));
    }
  }, [posts]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAuthors = async () => {
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      if (Array.isArray(data)) {
        // filter for lawyers
        setAuthors(data.filter((m) => m.category === "lawyer"));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setContent("");
    setCategory("Ticaret Hukuku");
    setCoverImage("");
    setAuthorId(authors[0]?.id || "");
    setIsPublished(true);
    setTagsStr("");
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setSummary(post.summary);
    setContent(post.content);
    setCategory(post.category);
    setCoverImage(post.coverImage || "");
    setAuthorId(post.authorId || "");
    setIsPublished(post.isPublished);
    
    try {
      const parsedTags = post.tags ? JSON.parse(post.tags) : [];
      setTagsStr(Array.isArray(parsedTags) ? parsedTags.join(", ") : "");
    } catch (e) {
      setTagsStr("");
    }
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  const handleDelete = async (post: BlogPost) => {
    if (!window.confirm(`"${post.title}" makalesini silmek istediğinizden emin misiniz?`)) return;

    try {
      const res = await fetch(`/api/blog/${post.id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (post: BlogPost) => {
    try {
      const res = await fetch(`/api/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...post,
          tags: post.tags ? JSON.parse(post.tags) : [],
          isPublished: !post.isPublished,
        }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, isPublished: !p.isPublished } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    try {
      const url = editingId ? `/api/blog/${editingId}` : "/api/blog";
      const method = editingId ? "PUT" : "POST";

      const tagsArray = tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          summary,
          content,
          category,
          coverImage: coverImage || undefined,
          authorId: authorId || undefined,
          isPublished,
          tags: tagsArray,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsDialogOpen(false);
        loadPosts();
      } else {
        alert(data.error || "Hata oluştu.");
      }
    } catch (error) {
      console.error(error);
      alert("İşlem başarısız.");
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    { header: "Başlık", accessorKey: "title" },
    {
      header: "Kategori",
      accessorKey: (row: BlogPost) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#007AFF] bg-[#007AFF]/10 rounded-full px-2.5 py-0.5">
          <Tag className="w-3 h-3" />
          {row.category}
        </span>
      ),
    },
    {
      header: "Yazar",
      accessorKey: (row: BlogPost) => (row.author ? row.author.name : <span className="text-xs text-[#86868B] italic">Belirtilmemiş</span>),
    },
    {
      header: "Tarih",
      accessorKey: (row: BlogPost) => {
        const date = new Date(row.publishedAt);
        return (
          <span className="text-xs text-[#86868B] flex items-center gap-1 select-none">
            <Calendar className="w-3.5 h-3.5" />
            {date.toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        );
      },
    },
    {
      header: "Durum",
      accessorKey: (row: BlogPost) => (
        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
          row.isPublished ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
        }`}>
          {row.isPublished ? "Yayında" : "Taslak"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1D1D1F]">Makaleler ve Blog</h2>
          <p className="text-xs text-[#86868B]">Web sitenizde yer alan makaleler ve hukuki bilgilendirme yazıları</p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold">
          <Plus className="w-4 h-4 mr-1" /> Yeni Makale Ekle
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
        </div>
      ) : (
        <DataTable
          data={posts}
          columns={columns}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          searchKey="title"
          searchPlaceholder="Başlığa göre ara..."
        />
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] lg:max-w-[1250px] xl:max-w-[1400px] w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1D1D1F]">
              {editingId ? "Makaleyi Düzenle" : "Yeni Makale Ekle"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Blog içeriği yazın, yazar atayın ve arama motoru optimizasyonu (SEO) başlıklarını tanımlayın.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
            <TabsList className="w-full bg-[#F2F2F7] rounded-xl p-1 mb-6 flex justify-start gap-1">
              <TabsTrigger value="general" className="rounded-lg text-xs font-semibold px-4 py-2">
                Makale İçeriği
              </TabsTrigger>
              <TabsTrigger value="seo" disabled={!editingId} className="rounded-lg text-xs font-semibold px-4 py-2">
                SEO Ayarları {!editingId && <span className="text-[10px] text-orange-500 font-normal ml-1">(Önce Kaydedin)</span>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="outline-none">
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1D1D1F]">Başlık</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Makale başlığını giriniz"
                      required
                      className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1D1D1F]">Slug (URL Bağlantısı)</label>
                    <SlugInput sourceValue={title} value={slug} onChange={setSlug} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1D1D1F]">Kategori</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#D1D1D6] bg-white text-sm focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1D1D1F]">Yeni Kategori Ekle</label>
                    <div className="flex gap-2">
                      <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Örn: Bilişim"
                        className="rounded-xl border-[#D1D1D6] bg-white focus:ring-[#007AFF] h-11"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newCategory.trim()) {
                            const cat = newCategory.trim();
                            if (!categories.includes(cat)) {
                              setCategories((prev) => [...prev, cat]);
                            }
                            setCategory(cat);
                            setNewCategory("");
                          }
                        }}
                        className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs h-11 px-3 font-semibold shrink-0"
                      >
                        Ekle
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1D1D1F]">Yazar (Avukat Seçin)</label>
                    <select
                      value={authorId}
                      onChange={(e) => setAuthorId(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#D1D1D6] bg-white text-sm focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                    >
                      <option value="">Seçilmedi</option>
                      {authors.map((auth) => (
                        <option key={auth.id} value={auth.id}>
                          {auth.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4.5 h-4.5 rounded border-[#D1D1D6] text-[#007AFF] focus:ring-[#007AFF]"
                    />
                    <label htmlFor="isPublished" className="text-xs font-semibold text-[#1D1D1F] select-none cursor-pointer">
                      Makaleyi anında yayınla
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 space-y-1.5">
                    <label className="text-xs font-bold text-[#1D1D1F]">Kapak Görseli</label>
                    <ImageUploader value={coverImage} onChange={setCoverImage} />
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#1D1D1F]">Kısa Özet (Liste görünümlerinde ve meta açıklamasında kullanılır)</label>
                      <Textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Makalenin kısa özeti..."
                        rows={3}
                        required
                        className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] text-sm resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#1D1D1F]">Etiketler (Keywords)</label>
                      <Input
                        value={tagsStr}
                        onChange={(e) => setTagsStr(e.target.value)}
                        placeholder="Örn: ticaret, kanun, 2025, ceza"
                        className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                      />
                      <span className="text-[10px] text-[#86868B] block">Virgülle ayırarak birden fazla etiket girin.</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1D1D1F]">Makale Detaylı İçeriği</label>
                  <RichTextEditor content={content} onChange={setContent} />
                </div>

                <div className="flex justify-end gap-2 border-t border-[#D1D1D6] pt-4">
                  {slug && (
                    <button
                      type="button"
                      onClick={() => {
                        const previewData = {
                          title,
                          slug,
                          summary,
                          content,
                          category,
                          coverImage: coverImage || null,
                          publishedAt: new Date().toISOString(),
                          isPublished: true,
                          tags: JSON.stringify(tagsStr.split(",").map(t => t.trim()).filter(Boolean)),
                          author: authors.find(a => a.id === authorId) || null
                        };
                        localStorage.setItem(`blog_preview_${slug}`, JSON.stringify(previewData));
                        window.open(`/blog/${slug}?preview=true`, "_blank");
                      }}
                      className="rounded-full px-6 py-2.5 border border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF]/5 text-xs font-semibold flex items-center gap-1.5 mr-auto cursor-pointer"
                    >
                      Önizleme <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-full px-6 py-2 border-[#D1D1D6]"
                  >
                    Kapat
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-full px-6 py-2 bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold"
                  >
                    {isSaving ? "Kaydediliyor..." : "Kaydet"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="seo" className="outline-none">
              {editingId && <SeoForm entityType="BlogPost" entityId={editingId} />}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
