"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import SeoForm from "@/components/admin/SeoForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle, Search, Settings, ArrowUpRight } from "lucide-react";

interface MissingSeoItem {
  name: string;
  type: string; // Sayfa | Hizmet | Makale | Video
  entityType: "Service" | "BlogPost" | "Video" | "Page";
  entityId: string;
  meta: {
    id: string;
    title: string | null;
    description: string | null;
    canonicalUrl: string | null;
  } | null;
}

export default function SeoManagerPage() {
  const [items, setItems] = useState<MissingSeoItem[]>([]);
  const [allPages, setAllPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<{
    entityType: "Service" | "BlogPost" | "Video" | "Page";
    entityId: string;
    name: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadSeoAudit();
  }, []);

  const loadSeoAudit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/seo/missing");
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (e) {
      console.error("Failed to fetch SEO audit data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSeo = (row: MissingSeoItem) => {
    setSelectedEntity({
      entityType: row.entityType,
      entityId: row.entityId,
      name: row.name,
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedEntity(null);
    loadSeoAudit(); // Reload stats after update
  };

  const columns = [
    { header: "İçerik / Sayfa Adı", accessorKey: "name" },
    {
      header: "İçerik Türü",
      accessorKey: (row: MissingSeoItem) => (
        <span className="text-xs font-semibold text-[#86868B]">{row.type}</span>
      ),
    },
    {
      header: "Meta Title",
      accessorKey: (row: MissingSeoItem) => (
        <span className={`text-xs ${row.meta?.title ? "text-[#34C759] font-medium" : "text-[#FF3B30] font-semibold flex items-center gap-1"}`}>
          {row.meta?.title ? row.meta.title : <><AlertTriangle className="w-3.5 h-3.5" /> Eksik</>}
        </span>
      ),
    },
    {
      header: "Meta Description",
      accessorKey: (row: MissingSeoItem) => (
        <span className={`text-xs ${row.meta?.description ? "text-[#34C759] font-medium" : "text-[#FF3B30] font-semibold flex items-center gap-1"}`}>
          {row.meta?.description ? "Tanımlı" : <><AlertTriangle className="w-3.5 h-3.5" /> Eksik</>}
        </span>
      ),
    },
    {
      header: "Canonical URL",
      accessorKey: (row: MissingSeoItem) => (
        <span className={`text-xs ${row.meta?.canonicalUrl ? "text-[#34C759] font-medium" : "text-[#FF9500] font-semibold"}`}>
          {row.meta?.canonicalUrl ? "Tanımlı" : "Eksik"}
        </span>
      ),
    },
  ];

  const missingCount = items.filter(
    (item) => !item.meta || !item.meta.title || !item.meta.description
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1D1D1F]">SEO Denetimi & Yönetimi</h2>
          <p className="text-xs text-[#86868B]">Arama motorları optimizasyon durumlarını inceleyin ve eksik olanları giderin</p>
        </div>
      </div>

      {/* Summary Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
        <div className="bg-white p-5 rounded-2xl border border-[#D1D1D6] flex items-center justify-between shadow-sm">
          <div>
            <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider">Eksik SEO Raporu</h4>
            <h3 className="text-3xl font-extrabold text-[#1D1D1F] tracking-tight mt-1">{missingCount} içerik</h3>
            <p className="text-[10px] text-[#86868B] mt-1">SEO başlığı veya açıklaması eksik ögeler</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-[#FF9500]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D1D1D6] flex items-center justify-between shadow-sm col-span-2">
          <div>
            <h4 className="text-xs font-bold text-[#86868B] uppercase tracking-wider">Denetim Açıklaması</h4>
            <p className="text-xs text-[#1D1D1F]/80 leading-relaxed mt-2">
              Arama motorlarında (Google vb.) daha üst sıralarda yer alabilmeniz için her hizmet, makale ve statik sayfanın kendine has özgün meta title ve meta description değerlerinin olması gerekir. Aşağıdaki listeden eksik ögeleri tıklayarak hızlıca tamamlayabilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
        </div>
      ) : (
        <div className="space-y-3">
          <DataTable
            data={items}
            columns={columns}
            onEdit={handleOpenSeo}
            searchKey="name"
            searchPlaceholder="Sayfa veya içerik ara..."
          />
        </div>
      )}

      {/* SEO Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90vw] lg:max-w-[1000px] xl:max-w-[1150px] w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1D1D1F] flex items-center gap-1.5">
              <Settings className="w-5 h-5 text-[#007AFF]" />
              SEO Ayarları: {selectedEntity?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Bu içerik için arama motoru başlığı, açıklaması, indekslenme (robots) ve sosyal paylaşım meta verilerini düzenleyin.
            </DialogDescription>
          </DialogHeader>

          {selectedEntity && (
            <div className="mt-4">
              <SeoForm
                entityType={selectedEntity.entityType}
                entityId={selectedEntity.entityId}
              />
            </div>
          )}
          
          <div className="flex justify-end gap-2 border-t border-[#D1D1D6] pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleDialogClose}
              className="rounded-full px-6 py-2 border-[#D1D1D6]"
            >
              Kapat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
