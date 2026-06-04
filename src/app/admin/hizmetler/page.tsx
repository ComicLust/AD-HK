"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import SlugInput from "@/components/admin/SlugInput";
import RichTextEditor from "@/components/admin/RichTextEditor";
import SeoForm from "@/components/admin/SeoForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Info,
  CheckCircle2,
  Trash2,
  Briefcase,
  Heart,
  Home,
  Gavel,
  Shield,
  Landmark,
  Users,
  Building2,
  Wallet,
  Monitor,
  Globe,
  Scale
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Service {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  fullDescription: string;
  order: number;
  isActive: boolean;
  trustPoints: string; // JSON string
}

const legalIcons = [
  "Briefcase", "Heart", "Home", "Gavel", "Shield", "Landmark", "Users", "Building2", "Wallet", "Monitor", "Globe", "Scale"
];

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  Heart,
  Home,
  Gavel,
  Shield,
  Landmark,
  Users,
  Building2,
  Wallet,
  Monitor,
  Globe,
  Scale
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("Scale");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [trustPoints, setTrustPoints] = useState<string[]>([]);
  const [newTrustPoint, setNewTrustPoint] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (Array.isArray(data)) {
        setServices(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setIcon("Scale");
    setDescription("");
    setFullDescription("");
    setIsActive(true);
    setTrustPoints([
      "Ücretsiz ilk danışmanlık",
      "7/24 ulaşılabilirlik",
      "Gizlilik garantisi",
      "Dosya takip desteği"
    ]);
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingId(service.id);
    setName(service.name);
    setSlug(service.slug);
    setIcon(service.icon);
    setDescription(service.description);
    setFullDescription(service.fullDescription);
    setIsActive(service.isActive);
    
    try {
      setTrustPoints(service.trustPoints ? JSON.parse(service.trustPoints) : []);
    } catch (e) {
      setTrustPoints([]);
    }
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  const handleDelete = async (service: Service) => {
    if (!window.confirm(`"${service.name}" hizmetini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) return;

    try {
      const res = await fetch(`/api/services/${service.id}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== service.id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...service,
          trustPoints: service.trustPoints ? JSON.parse(service.trustPoints) : [],
          isActive: !service.isActive,
        }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, isActive: !s.isActive } : s))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const reordered = [...services];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Update locally first
    const updatedWithOrder = reordered.map((item, idx) => ({ ...item, order: idx }));
    setServices(updatedWithOrder);

    // Save to DB
    try {
      await fetch("/api/services/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          updatedWithOrder.map((s) => ({ id: s.id, order: s.order }))
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
      const url = editingId ? `/api/services/${editingId}` : "/api/services";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          icon,
          description,
          fullDescription,
          isActive,
          trustPoints,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsDialogOpen(false);
        loadServices();
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

  const addTrustPoint = () => {
    if (newTrustPoint.trim() !== "") {
      setTrustPoints((prev) => [...prev, newTrustPoint.trim()]);
      setNewTrustPoint("");
    }
  };

  const removeTrustPoint = (idx: number) => {
    setTrustPoints((prev) => prev.filter((_, i) => i !== idx));
  };

  const columns = [
    {
      header: "Sıra",
      accessorKey: (row: Service) => {
        const idx = services.findIndex((s) => s.id === row.id);
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
              disabled={idx === services.length - 1}
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
    { header: "İkon", accessorKey: (row: Service) => <span className="text-xs font-bold font-mono">{row.icon}</span> },
    { header: "Hizmet Adı", accessorKey: "name" },
    { header: "Slug", accessorKey: (row: Service) => <code className="text-xs bg-[#F2F2F7] px-1.5 py-0.5 rounded">{row.slug}</code> },
    {
      header: "Durum",
      accessorKey: (row: Service) => (
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
          <h2 className="text-lg font-bold text-[#1D1D1F]">Hizmetler listesi</h2>
          <p className="text-xs text-[#86868B]">Müvekkillerinize sunduğunuz dava ve danışmanlık uzmanlıkları</p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold">
          <Plus className="w-4 h-4 mr-1" /> Yeni Hizmet Ekle
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
        </div>
      ) : (
        <DataTable
          data={services}
          columns={columns}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          searchKey="name"
          searchPlaceholder="Hizmet ara..."
        />
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] lg:max-w-[1200px] xl:max-w-[1350px] w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1D1D1F]">
              {editingId ? "Hizmeti Düzenle" : "Yeni Hizmet Ekle"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Hizmet bilgilerini ve arama motoru optimizasyonu meta verilerini yapılandırın.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
            <TabsList className="w-full bg-[#F2F2F7] rounded-xl p-1 mb-6 flex justify-start gap-1">
              <TabsTrigger value="general" className="rounded-lg text-xs font-semibold px-4 py-2">
                Temel Bilgiler
              </TabsTrigger>
              <TabsTrigger value="seo" disabled={!editingId} className="rounded-lg text-xs font-semibold px-4 py-2">
                SEO Ayarları {!editingId && <span className="text-[10px] text-orange-500 font-normal ml-1">(Önce Kaydedin)</span>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="outline-none">
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1D1D1F]">Hizmet Adı</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Örn: Ticaret Hukuku"
                      required
                      className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1D1D1F]">Slug (URL Bağlantısı)</label>
                    <SlugInput sourceValue={name} value={slug} onChange={setSlug} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-bold text-[#1D1D1F] block mb-1">Görsel İkon Seçimi</label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 p-2 bg-[#F2F2F7]/50 border border-[#D1D1D6] rounded-2xl max-h-[150px] overflow-y-auto">
                      {legalIcons.map((ico) => {
                        const IconComponent = iconComponents[ico] || Scale;
                        const isSelected = icon === ico;
                        return (
                          <button
                            key={ico}
                            type="button"
                            onClick={() => setIcon(ico)}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                              isSelected
                                ? "bg-[#007AFF]/10 border-[#007AFF] text-[#007AFF] shadow-sm font-semibold"
                                : "bg-white border-[#D1D1D6]/80 text-[#86868B] hover:text-[#1D1D1F] hover:bg-slate-50"
                            }`}
                            title={ico}
                          >
                            <IconComponent className="w-5 h-5 mb-1" />
                            <span className="text-[9px] truncate max-w-full font-medium">{ico}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
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
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1D1D1F]">Kısa Açıklama (Liste kartlarında görünür)</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Hizmete dair kısa özet..."
                    rows={2}
                    required
                    className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] resize-none"
                  />
                </div>

                {/* Trust Points Manager */}
                <div className="space-y-1.5 bg-[#F2F2F7]/50 p-4 rounded-2xl border border-[#D1D1D6]/40">
                  <label className="text-xs font-bold text-[#1D1D1F] block mb-1">Güven Noktaları (Servis detay badge'leri)</label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newTrustPoint}
                      onChange={(e) => setNewTrustPoint(e.target.value)}
                      placeholder="Yeni güven noktası yazın (Örn: Hızlı Dosya Takibi)"
                      className="rounded-xl border-[#D1D1D6] bg-white focus:ring-[#007AFF]"
                    />
                    <Button type="button" onClick={addTrustPoint} className="rounded-xl bg-slate-800 text-white text-xs h-11 px-4">
                      Ekle
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trustPoints.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-white border border-[#D1D1D6] rounded-full px-3 py-1 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
                        <span className="text-xs text-[#1D1D1F] font-medium">{point}</span>
                        <button type="button" onClick={() => removeTrustPoint(idx)} className="text-[#FF3B30] hover:bg-red-50 p-0.5 rounded-full ml-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1D1D1F]">Detaylı Açıklama (Hizmet Detay Sayfası İçeriği)</label>
                  <RichTextEditor content={fullDescription} onChange={setFullDescription} />
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
            </TabsContent>

            <TabsContent value="seo" className="outline-none">
              {editingId && <SeoForm entityType="Service" entityId={editingId} />}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
