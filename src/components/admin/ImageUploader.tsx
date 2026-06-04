import { useState, useRef } from "react";
import { UploadCloud, FileText, Loader2, X, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import MediaSelector from "./MediaSelector";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  type?: "image" | "document";
}

export default function ImageUploader({ value, onChange, type = "image" }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        alert(data.error || "Yükleme başarısız.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Dosya yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative inline-block rounded-2xl overflow-hidden border border-[#D1D1D6] group">
          {type === "image" ? (
            <img
              src={value}
              alt="Preview"
              className="max-h-48 max-w-full object-contain bg-[#F2F2F7] rounded-2xl"
            />
          ) : (
            <div className="flex items-center gap-3 p-4 bg-[#F2F2F7] rounded-2xl">
              <FileText className="w-8 h-8 text-[#007AFF]" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#1D1D1F] truncate max-w-xs">
                  {value.split("/").pop()}
                </span>
                <span className="text-[10px] text-[#86868B]">Dosya yüklendi</span>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#D1D1D6] hover:border-[#007AFF] transition-colors rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#1C1C1E]"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={type === "image" ? "image/*" : ".pdf,.doc,.docx"}
              className="hidden"
            />
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="w-8 h-8 text-[#007AFF] animate-spin mb-2" />
                <span className="text-xs font-semibold text-[#1D1D1F] dark:text-foreground">Dosya yükleniyor...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 select-none">
                <UploadCloud className="w-8 h-8 text-[#86868B] mb-2" />
                <span className="text-xs font-semibold text-[#1D1D1F] dark:text-foreground mb-1">
                  Dosyayı buraya sürükleyin veya tıklayın
                </span>
                <span className="text-[10px] text-[#86868B]">
                  {type === "image" ? "Görsel formatları (PNG, JPG, WEBP) - Maks 10MB" : "Döküman formatları (PDF, DOC, DOCX) - Maks 10MB"}
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-start">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsLibraryOpen(true)}
              className="rounded-xl px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 border-[#D1D1D6] text-slate-700 bg-white dark:bg-card dark:text-foreground hover:bg-[#F2F2F7] transition-all"
            >
              <FolderOpen className="w-4 h-4 text-[#86868B]" />
              Medya Kütüphanesinden Seç
            </Button>
          </div>
        </div>
      )}

      <MediaSelector
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelect={onChange}
        type={type}
      />
    </div>
  );
}
