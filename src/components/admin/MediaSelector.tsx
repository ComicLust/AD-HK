"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Trash2, FileText, CheckCircle2, Image as ImageIcon, Loader2 } from "lucide-react";

interface MediaItem {
  id: string;
  fileName: string;
  url: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

interface MediaSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  type?: "image" | "document";
}

export default function MediaSelector({ isOpen, onClose, onSelect, type = "image" }: MediaSelectorProps) {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        setMediaList(data);
      }
    } catch (e) {
      console.error("Failed to load media:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Bu dosyayı kütüphaneden ve sunucudan kalıcı olarak silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMediaList(prev => prev.filter(item => item.id !== id));
        if (selectedItem?.id === id) {
          setSelectedItem(null);
        }
      } else {
        alert("Dosya silinemedi.");
      }
    } catch (err) {
      console.error(err);
      alert("Hata oluştu.");
    }
  };

  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = item.fileName.toLowerCase().includes(search.toLowerCase());
    const isImage = item.mimeType.startsWith("image/");
    if (type === "image") {
      return matchesSearch && isImage;
    } else {
      return matchesSearch && !isImage;
    }
  });

  const handleConfirmSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem.url);
      onClose();
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col rounded-3xl p-6 bg-white dark:bg-card border-0 shadow-apple-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-[#1D1D1F] dark:text-foreground">
            Medya Kütüphanesi
          </DialogTitle>
          <DialogDescription className="text-xs">
            Daha önce yüklenmiş olan dosyalar arasından seçim yapın veya yeni dosya yükleyin.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="flex items-center gap-2 bg-[#F2F2F7] dark:bg-[#1C1C1E] px-4 py-2.5 rounded-2xl border border-[#D1D1D6]/40 my-3 shrink-0">
          <Search className="w-4 h-4 text-[#86868B] shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Dosya adı ara..."
            className="bg-transparent border-0 outline-none text-sm w-full text-[#1D1D1F] dark:text-foreground placeholder-[#86868B]"
          />
        </div>

        {/* Grid / List */}
        <div className="flex-1 overflow-y-auto min-h-0 py-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <Loader2 className="w-8 h-8 text-[#007AFF] animate-spin mb-2" />
              <span className="text-xs text-[#86868B]">Kütüphane yükleniyor...</span>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <ImageIcon className="w-12 h-12 text-[#86868B]/40 mb-3" />
              <span className="text-sm font-semibold text-[#1D1D1F] dark:text-foreground">Dosya Bulunmadı</span>
              <span className="text-xs text-[#86868B] mt-1">Bu kategoride henüz yüklenmiş bir dosya bulunmuyor.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {filteredMedia.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    onDoubleClick={() => {
                      onSelect(item.url);
                      onClose();
                    }}
                    className={`relative rounded-2xl border overflow-hidden cursor-pointer group transition-all p-2 flex flex-col justify-between ${
                      isSelected
                        ? "border-[#007AFF] bg-[#007AFF]/5 ring-2 ring-[#007AFF]/20"
                        : "border-[#D1D1D6]/60 bg-slate-50 dark:bg-slate-900 hover:border-[#86868B]"
                    }`}
                  >
                    {/* Visual container */}
                    <div className="aspect-square w-full rounded-xl bg-white dark:bg-[#1C1C1E] overflow-hidden flex items-center justify-center relative mb-2">
                      {type === "image" ? (
                        <img
                          src={item.url}
                          alt={item.fileName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText className="w-10 h-10 text-[#007AFF]" />
                      )}

                      {/* Selected badge */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-[#007AFF] text-white rounded-full p-0.5 shadow-sm">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={(e) => handleDelete(item.id, e)}
                        className="absolute bottom-1.5 right-1.5 bg-[#FF3B30] text-white p-1.5 rounded-full transition-opacity opacity-0 group-hover:opacity-100 hover:bg-[#E03B30] shadow-sm"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* File name & size */}
                    <div className="flex flex-col select-none">
                      <span className="text-[11px] font-bold text-[#1D1D1F] dark:text-foreground truncate" title={item.fileName}>
                        {item.fileName}
                      </span>
                      <span className="text-[9px] text-[#86868B]">
                        {formatBytes(item.fileSize)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border shrink-0">
          <Button variant="ghost" onClick={onClose} className="rounded-full px-5 text-xs">
            İptal
          </Button>
          <Button
            onClick={handleConfirmSelect}
            disabled={!selectedItem}
            className="rounded-full px-6 bg-[#007AFF] hover:bg-[#0066D6] text-white text-xs font-semibold"
          >
            Seçilen Dosyayı Kullan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
