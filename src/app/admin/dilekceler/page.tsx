"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import ImageUploader from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, ArrowUp, ArrowDown, Download, FileText } from "lucide-react";

interface Dilekce {
  id: string;
  title: string;
  category: string;
  downloadUrl: string;
  fileFormat: "doc" | "pdf" | "docx";
  order: number;
  isActive: boolean;
}

const formatOptions = ["doc", "docx", "pdf"];
const defaultCategories = ["İcra Hukuku", "Kira Hukuku", "Ceza Hukuku", "Tazminat Hukuku", "Medeni Hukuk", "Ticaret Hukuku", "İdare Hukuku"];

export default function DilekcelerPage() {
  const [dilekceler, setDilekceler] = useState<Dilekce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("İcra Hukuku");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [fileFormat, setFileFormat] = useState<"doc" | "pdf" | "docx">("docx");
  const [isActive, setIsActive] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadDilekceler();
  }, []);

  const loadDilekceler = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dilekceler");
      const data = await res.json();
      if (Array.isArray(data)) {
        setDilekceler(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setCategory("İcra Hukuku");
    setDownloadUrl("");
    setFileFormat("docx");
    setIsActive(true);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (dilekce: Dilekce) => {
    setEditingId(dilekce.id);
    setTitle(dilekce.title);
    setCategory(dilekce.category);
    setDownloadUrl(dilekce.downloadUrl);
    setFileFormat(dilekce.fileFormat);
    setIsActive(dilekce.isActive);
    setIsDialogOpen(true);
  };

  const handleDelete = async (dilekce: Dilekce) => {
    if (!window.confirm(`"${dilekce.title}" dilekçesini silmek istediğinizden emin misiniz?`)) return;

    try {
      const res = await fetch(`/api/dilekceler/${dilekce.id}`, { method: "DELETE" });
      if (res.ok) {
        setDilekceler((prev) => prev.filter((d) => d.id !== dilekce.id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (dilekce: Dilekce) => {
    try {
      const res = await fetch(`/api/dilekceler/${dilekce.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dilekce,
          isActive: !dilekce.isActive,
        }),
      });
      if (res.ok) {
        setDilekceler((prev) =>
          prev.map((d) => (d.id === dilekce.id ? { ...d, isActive: !d.isActive } : d))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Detect file format from download URL
  const handleUrlChange = (url: string) => {
    setDownloadUrl(url);
    if (url) {
      const extension = url.split(".").pop()?.toLowerCase();
      if (extension && ["doc", "docx", "pdf"].includes(extension)) {
        setFileFormat(extension as any);
      }
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= dilekceler.length) return;

    const reordered = [...dilekceler];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const updatedWithOrder = reordered.map((item, idx) => ({ ...item, order: idx }));
    setDilekceler(updatedWithOrder);

    try {
      await fetch("/api/dilekceler/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          updatedWithOrder.map((d) => ({ id: d.id, order: d.order }))
        ),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    try {
      const url = editingId ? `/api/dilekceler/${editingId}` : "/api/dilekceler";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          downloadUrl,
          fileFormat,
          isActive,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsDialogOpen(false);
        loadDilekceler();
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
      accessorKey: (row: Dilekce) => {
        const idx = dilekceler.findIndex((d) => d.id === row.id);
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
              disabled={idx === dilekceler.length - 1}
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
    {
      header: "Format",
      accessorKey: (row: Dilekce) => (
        <span className={`inline-flex items-center text-[10px] font-extrabold font-mono uppercase px-2 py-0.5 rounded ${
          row.fileFormat === "pdf" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
        }`}>
          {row.fileFormat}
        </span>
      ),
    },
    { header: "Dilekçe Adı", accessorKey: "title" },
    { header: "Kategori", accessorKey: "category" },
    {
      header: "Dosya",
      accessorKey: (row: Dilekce) => (
        <a
          href={row.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#007AFF] hover:underline flex items-center gap-1 font-semibold"
        >
          <Download className="w-3.5 h-3.5" /> İndir
        </a>
      ),
    },
    {
      header: "Durum",
      accessorKey: (row: Dilekce) => (
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
          <h2 className="text-lg font-bold text-[#1D1D1F]">Örnek Dilekçeler</h2>
          <p className="text-xs text-[#86868B]">Müvekkillerin indirebileceği hukuki dilekçe ve döküman şablonları</p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold">
          <Plus className="w-4 h-4 mr-1" /> Dilekçe Ekle
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
        </div>
      ) : (
        <DataTable
          data={dilekceler}
          columns={columns}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          searchKey="title"
          searchPlaceholder="Dilekçe adı ara..."
        />
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90vw] lg:max-w-[1000px] xl:max-w-[1150px] w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1D1D1F]">
              {editingId ? "Dilekçeyi Düzenle" : "Yeni Dilekçe Ekle"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Dilekçe dosyası yükleyin ve kategori eşleşmesini yapın.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">Dilekçe Başlığı</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Kat Karşılığı İnşaat Sözleşmesi İtirazı"
                required
                className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D1D1D6] bg-white text-sm focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                >
                  {defaultCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Dosya Formatı</label>
                <select
                  value={fileFormat}
                  onChange={(e) => setFileFormat(e.target.value as any)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D1D1D6] bg-white text-sm focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                >
                  {formatOptions.map((f) => (
                    <option key={f} value={f}>
                      {f.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Document Uploader */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">Dilekçe Şablon Dosyası (.doc, .docx, .pdf)</label>
              <ImageUploader value={downloadUrl} onChange={handleUrlChange} type="document" />
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
