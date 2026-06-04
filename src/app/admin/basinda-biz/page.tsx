"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

interface PressItem {
  id: string;
  title: string;
  source: string;
  sourceDomain: string;
  link: string;
  order: number;
  isActive: boolean;
}

export default function PressPage() {
  const [items, setItems] = useState<PressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [sourceDomain, setSourceDomain] = useState("");
  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/basinda-biz");
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically parse hostname from URL
  const handleLinkChange = (val: string) => {
    setLink(val);
    try {
      if (val && (val.startsWith("http://") || val.startsWith("https://"))) {
        const url = new URL(val);
        setSourceDomain(url.hostname.replace("www.", ""));
      }
    } catch (e) {
      // Ignore URL parsing errors while user is typing
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setSource("");
    setSourceDomain("");
    setLink("");
    setIsActive(true);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: PressItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSource(item.source);
    setSourceDomain(item.sourceDomain);
    setLink(item.link);
    setIsActive(item.isActive);
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: PressItem) => {
    if (!window.confirm(`"${item.title}" haberini silmek istediğinizden emin misiniz?`)) return;

    try {
      const res = await fetch(`/api/basinda-biz/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== item.id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (item: PressItem) => {
    try {
      const res = await fetch(`/api/basinda-biz/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...item,
          isActive: !item.isActive,
        }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isActive: !i.isActive } : i))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const updatedWithOrder = reordered.map((item, idx) => ({ ...item, order: idx }));
    setItems(updatedWithOrder);

    try {
      await fetch("/api/basinda-biz/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          updatedWithOrder.map((i) => ({ id: i.id, order: i.order }))
        ),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!link) {
      alert("Lütfen bir haber dış bağlantısı girin veya gazete küpürü görseli yükleyin.");
      return;
    }

    setIsSaving(true);
    try {
      const url = editingId ? `/api/basinda-biz/${editingId}` : "/api/basinda-biz";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          source,
          sourceDomain,
          link,
          isActive,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsDialogOpen(false);
        loadItems();
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
    {
      header: "Sıra",
      accessorKey: (row: PressItem) => {
        const idx = items.findIndex((i) => i.id === row.id);
        return (
          <div className="flex items-center gap-1 select-none">
            <Button
              variant="ghost"
              size="icon"
              disabled={idx === 0}
              onClick={() => handleMove(idx, "up")}
              className="w-6 h-6 p-0"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={idx === items.length - 1}
              onClick={() => handleMove(idx, "down")}
              className="w-6 h-6 p-0"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </Button>
            <span className="text-xs font-semibold text-[#86868B]">{idx + 1}</span>
          </div>
        );
      },
    },
    { header: "Haber Başlığı", accessorKey: "title" },
    { header: "Kaynak", accessorKey: "source" },
    { header: "Kaynak Domain", accessorKey: "sourceDomain" },
    {
      header: "Bağlantı",
      accessorKey: (row: PressItem) => (
        <a
          href={row.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#007AFF] hover:underline flex items-center gap-1"
        >
          Haber Git <ExternalLink className="w-3 h-3" />
        </a>
      ),
    },
    {
      header: "Durum",
      accessorKey: (row: PressItem) => (
        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
          row.isActive ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
        }`}>
          {row.isActive ? "Aktif" : "Pasif"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1D1D1F]">Basında Biz</h2>
          <p className="text-xs text-[#86868B]">Hukuk büronuz hakkında basında çıkan haberler ve röportajlar</p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold">
          <Plus className="w-4 h-4 mr-1" /> Haber Ekle
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
        </div>
      ) : (
        <DataTable
          data={items}
          columns={columns}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          searchKey="title"
          searchPlaceholder="Haber başlığı ara..."
        />
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90vw] lg:max-w-[1000px] xl:max-w-[1150px] w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1D1D1F]">
              {editingId ? "Haberi Düzenle" : "Yeni Haber Ekle"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Haber linkini, yayıncı kuruluşunu ve başlığını giriniz.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">Haber Başlığı</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Yargıtay İyi Hal İndirimini Bozdu"
                required
                className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Haber Dış Bağlantısı (Link)</label>
                <Input
                  value={link.startsWith("/uploads/") ? "" : link}
                  onChange={(e) => handleLinkChange(e.target.value)}
                  placeholder="https://..."
                  disabled={link.startsWith("/uploads/")}
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Veya Gazete Küpürü Yükle (Görsel)</label>
                <div className="bg-white rounded-xl border border-dashed border-[#D1D1D6] p-2 flex justify-center items-center min-h-[96px]">
                  <ImageUploader
                    value={link.startsWith("/uploads/") ? link : ""}
                    onChange={(val) => {
                      if (val) {
                        setLink(val);
                        setSource("Gazete Küpürü");
                        setSourceDomain("Görsel Küpür");
                      } else {
                        setLink("");
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Kaynak Yayıncı</label>
                <Input
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Örn: Gazete Duvar"
                  required
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Kaynak Domain (Otomatik Çekilir)</label>
                <Input
                  value={sourceDomain}
                  onChange={(e) => setSourceDomain(e.target.value)}
                  placeholder="gazeteduvar.com.tr"
                  required
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-[#D1D1D6] text-[#007AFF] focus:ring-[#007AFF]"
              />
              <label htmlFor="isActive" className="text-xs font-semibold text-[#1D1D1F] select-none cursor-pointer">
                Web sitesinde aktif olarak gösterilsin
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#D1D1D6] pt-4">
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
