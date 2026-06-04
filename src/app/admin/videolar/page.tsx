"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, ArrowUp, ArrowDown, Play } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  order: number;
  isActive: boolean;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/videos");
      const data = await res.json();
      if (Array.isArray(data)) {
        setVideos(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytId = getYoutubeId(videoUrl);

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setIsActive(true);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (video: VideoItem) => {
    setEditingId(video.id);
    setTitle(video.title);
    setDescription(video.description || "");
    setVideoUrl(video.videoUrl);
    setIsActive(video.isActive);
    setIsDialogOpen(true);
  };

  const handleDelete = async (video: VideoItem) => {
    if (!window.confirm(`"${video.title}" videosunu silmek istediğinizden emin misiniz?`)) return;

    try {
      const res = await fetch(`/api/videos/${video.id}`, { method: "DELETE" });
      if (res.ok) {
        setVideos((prev) => prev.filter((v) => v.id !== video.id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (video: VideoItem) => {
    try {
      const res = await fetch(`/api/videos/${video.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...video,
          isActive: !video.isActive,
        }),
      });
      if (res.ok) {
        setVideos((prev) =>
          prev.map((v) => (v.id === video.id ? { ...v, isActive: !v.isActive } : v))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= videos.length) return;

    const reordered = [...videos];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const updatedWithOrder = reordered.map((item, idx) => ({ ...item, order: idx }));
    setVideos(updatedWithOrder);

    try {
      await fetch("/api/videos/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          updatedWithOrder.map((v) => ({ id: v.id, order: v.order }))
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
      const url = editingId ? `/api/videos/${editingId}` : "/api/videos";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || undefined,
          videoUrl,
          isActive,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsDialogOpen(false);
        loadVideos();
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
      accessorKey: (row: VideoItem) => {
        const idx = videos.findIndex((v) => v.id === row.id);
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
              disabled={idx === videos.length - 1}
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
      header: "Küçük Resim",
      accessorKey: (row: VideoItem) => (
        <div className="w-16 h-10 rounded-lg overflow-hidden bg-[#F2F2F7] flex items-center justify-center border border-[#D1D1D6] relative">
          {row.thumbnailUrl ? (
            <img src={row.thumbnailUrl} alt={row.title} className="w-full h-full object-cover" />
          ) : (
            <Play className="w-4 h-4 text-[#86868B]" />
          )}
        </div>
      ),
    },
    { header: "Video Başlığı", accessorKey: "title" },
    { header: "Video URL", accessorKey: (row: VideoItem) => <code className="text-xs bg-[#F2F2F7] px-1.5 py-0.5 rounded truncate block max-w-xs">{row.videoUrl}</code> },
    {
      header: "Durum",
      accessorKey: (row: VideoItem) => (
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
          <h2 className="text-lg font-bold text-[#1D1D1F]">Video Yayınları</h2>
          <p className="text-xs text-[#86868B]">Web sitenizde yer alan YouTube / Vimeo bilgilendirme videoları</p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold">
          <Plus className="w-4 h-4 mr-1" /> Video Ekle
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
        </div>
      ) : (
        <DataTable
          data={videos}
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
        <DialogContent className="max-w-[90vw] lg:max-w-[1000px] xl:max-w-[1150px] w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1D1D1F]">
              {editingId ? "Videoyu Düzenle" : "Yeni Video Ekle"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              YouTube linkini ve başlığını giriniz. Sistem kapak resmini ve embed bağlantısını otomatik üretecektir.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">Video Başlığı</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Miras Hukukunda Saklı Pay Oranları"
                required
                className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">YouTube Video Bağlantısı (URL)</label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                required
                className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
              />
            </div>

            {/* Real-time Youtube Embed Preview */}
            {ytId && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#86868B] block">Embed Video Önizleme</span>
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}`}
                  className="w-full aspect-video rounded-2xl border border-[#D1D1D6] bg-black shadow-inner"
                  allowFullScreen
                  title="YouTube Preview"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1D1D1F]">Kısa Açıklama (Opsiyonel)</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Video içeriğine dair kısa bilgi..."
                rows={2}
                className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] resize-none text-sm"
              />
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
