"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, ArrowUp, ArrowDown, ChevronRight, Edit2, Trash2, Eye, EyeOff, Compass } from "lucide-react";

interface NavLink {
  id: string;
  label: string;
  href: string;
  icon: string | null;
  order: number;
  isActive: boolean;
  parentId: string | null;
  tab: string | null;
  children?: NavLink[];
}

const defaultIcons = ["Home", "Info", "Briefcase", "Users", "Newspaper", "Megaphone", "BookOpen", "Video", "FileText", "Phone"];
const tabOptions = [
  { id: "", label: "Yok (Standart Rota)" },
  { id: "basinda", label: "Basında Biz Sekmesi" },
  { id: "makaleler", label: "Makaleler Sekmesi" },
  { id: "videolar", label: "Videolar Sekmesi" },
];

export default function NavigationManagerPage() {
  const [links, setLinks] = useState<NavLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");
  const [icon, setIcon] = useState("");
  const [parentId, setParentId] = useState("");
  const [tab, setTab] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/nav-links");
      const data = await res.json();
      if (Array.isArray(data)) {
        setLinks(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setLabel("");
    setHref("");
    setIcon("Home");
    setParentId("");
    setTab("");
    setIsActive(true);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (link: NavLink) => {
    setEditingId(link.id);
    setLabel(link.label);
    setHref(link.href);
    setIcon(link.icon || "");
    setParentId(link.parentId || "");
    setTab(link.tab || "");
    setIsActive(link.isActive);
    setIsDialogOpen(true);
  };

  const handleDelete = async (link: NavLink) => {
    if (!window.confirm(`"${link.label}" menü elemanını silmek istediğinizden emin misiniz? Alt menüleri de silinecektir.`)) return;

    try {
      const res = await fetch(`/api/nav-links/${link.id}`, { method: "DELETE" });
      if (res.ok) {
        loadLinks(); // Reload to refresh tree
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (link: NavLink) => {
    try {
      const res = await fetch(`/api/nav-links/${link.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...link,
          isActive: !link.isActive,
        }),
      });
      if (res.ok) {
        loadLinks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down", parentLink?: NavLink) => {
    const list = parentLink ? parentLink.children || [] : links;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const reordered = [...list];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const updatedWithOrder = reordered.map((item, idx) => ({
      id: item.id,
      order: idx,
      parentId: item.parentId
    }));

    // Optimistic local update
    if (parentLink) {
      setLinks((prev) =>
        prev.map((p) =>
          p.id === parentLink.id
            ? {
                ...p,
                children: p.children?.map((c) => {
                  const match = updatedWithOrder.find((u) => u.id === c.id);
                  return match ? { ...c, order: match.order } : c;
                }).sort((a, b) => a.order - b.order),
              }
            : p
        )
      );
    } else {
      setLinks((prev) =>
        prev.map((p) => {
          const match = updatedWithOrder.find((u) => u.id === p.id);
          return match ? { ...p, order: match.order } : p;
        }).sort((a, b) => a.order - b.order)
      );
    }

    try {
      await fetch("/api/nav-links/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedWithOrder),
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
      const url = editingId ? `/api/nav-links/${editingId}` : "/api/nav-links";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label,
          href,
          icon: icon || null,
          isActive,
          parentId: parentId || null,
          tab: tab || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsDialogOpen(false);
        loadLinks();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1D1D1F]">Menü & Navigasyon Yönetimi</h2>
          <p className="text-xs text-[#86868B]">Sitenin üst menü, footer ve dropdown navigasyon hiyerarşisi</p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold">
          <Plus className="w-4 h-4 mr-1" /> Menü Elemanı Ekle
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#D1D1D6] overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-[#F2F2F7] px-6 py-3 grid grid-cols-12 text-xs font-bold text-[#1D1D1F] border-b border-[#D1D1D6] select-none">
            <div className="col-span-5">Menü Başlığı</div>
            <div className="col-span-4">Bağlantı Rotaları</div>
            <div className="col-span-1 text-center">İkon</div>
            <div className="col-span-2 text-right">İşlemler</div>
          </div>

          <div className="divide-y divide-[#E5E5EA]">
            {links.map((link, pIdx) => (
              <div key={link.id} className="flex flex-col">
                {/* Parent Row */}
                <div className="px-6 py-3.5 grid grid-cols-12 items-center hover:bg-slate-50 transition-colors">
                  <div className="col-span-5 flex items-center gap-2">
                    {/* Sort */}
                    <div className="flex items-center select-none mr-2">
                      <Button variant="ghost" size="icon" disabled={pIdx === 0} onClick={() => handleMove(pIdx, "up")} className="w-5 h-5 p-0">
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" disabled={pIdx === links.length - 1} onClick={() => handleMove(pIdx, "down")} className="w-5 h-5 p-0">
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>
                    <span className="text-sm font-bold text-[#1D1D1F]">{link.label}</span>
                    {!link.isActive && <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full select-none font-bold">Gizli</span>}
                  </div>
                  <div className="col-span-4">
                    <code className="text-xs bg-[#F2F2F7] px-1.5 py-0.5 rounded">{link.href}</code>
                  </div>
                  <div className="col-span-1 text-center text-xs font-mono font-bold text-[#86868B]">
                    {link.icon || "-"}
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleToggleActive(link)} className="w-7 h-7 hover:text-[#007AFF]">
                      {link.isActive ? <Eye className="w-3.5 h-3.5 text-[#34C759]" /> : <EyeOff className="w-3.5 h-3.5 text-[#FF9500]" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(link)} className="w-7 h-7 hover:text-[#007AFF]">
                      <Edit2 className="w-3.5 h-3.5 text-[#007AFF]" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(link)} className="w-7 h-7 hover:text-[#FF3B30]">
                      <Trash2 className="w-3.5 h-3.5 text-[#FF3B30]" />
                    </Button>
                  </div>
                </div>

                {/* Dropdown Items (Children) */}
                {link.children && link.children.length > 0 && (
                  <div className="bg-[#F8FAFC] border-t border-b border-[#E5E5EA]">
                    {link.children.map((child, cIdx) => (
                      <div key={child.id} className="px-6 py-2.5 pl-14 grid grid-cols-12 items-center hover:bg-slate-100/50 transition-colors border-t first:border-0 border-[#E5E5EA]">
                        <div className="col-span-5 flex items-center gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-[#86868B] shrink-0" />
                          <div className="flex items-center select-none mr-2">
                            <Button variant="ghost" size="icon" disabled={cIdx === 0} onClick={() => handleMove(cIdx, "up", link)} className="w-4 h-4 p-0">
                              <ArrowUp className="w-2.5 h-2.5" />
                            </Button>
                            <Button variant="ghost" size="icon" disabled={cIdx === (link.children || []).length - 1} onClick={() => handleMove(cIdx, "down", link)} className="w-4 h-4 p-0">
                              <ArrowDown className="w-2.5 h-2.5" />
                            </Button>
                          </div>
                          <span className="text-xs font-bold text-slate-700">{child.label}</span>
                          {!child.isActive && <span className="text-[8px] bg-orange-100 text-orange-700 px-1 py-0.2 rounded-full font-bold select-none">Gizli</span>}
                        </div>
                        <div className="col-span-4">
                          <code className="text-xs bg-[#F2F2F7] px-1.5 py-0.5 rounded">{child.href}</code>
                          {child.tab && <span className="text-[10px] text-slate-400 font-semibold ml-2">({child.tab} sekmesi)</span>}
                        </div>
                        <div className="col-span-1 text-center text-xs font-mono font-bold text-slate-400">
                          {child.icon || "-"}
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleToggleActive(child)} className="w-7 h-7 hover:text-[#007AFF]">
                            {child.isActive ? <Eye className="w-3.5 h-3.5 text-[#34C759]" /> : <EyeOff className="w-3.5 h-3.5 text-[#FF9500]" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(child)} className="w-7 h-7 hover:text-[#007AFF]">
                            <Edit2 className="w-3.5 h-3.5 text-[#007AFF]" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(child)} className="w-7 h-7 hover:text-[#FF3B30]">
                            <Trash2 className="w-3.5 h-3.5 text-[#FF3B30]" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90vw] lg:max-w-[900px] w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1D1D1F]">
              {editingId ? "Menü Öğesini Düzenle" : "Yeni Menü Öğesi Ekle"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Menü başlığı, link adresi, ikon eşleşmeleri ve dropdown durumlarını ayarlayın.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Menü Etiketi (Görünen İsim)</label>
                <Input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Örn: Hizmetlerimiz"
                  required
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Bağlantı Adresi (Href)</label>
                <Input
                  value={href}
                  onChange={(e) => setHref(e.target.value)}
                  placeholder="Örn: #/hizmetlerimiz veya /admin"
                  required
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Üst Menü (Dropdown Alt Öğesi Yap)</label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D1D1D6] bg-white text-sm focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                >
                  <option value="">Yok (Ana Menü Elemanı)</option>
                  {links
                    .filter((l) => l.id !== editingId) // exclude self
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.label}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">İkon</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D1D1D6] bg-white text-sm focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                >
                  <option value="">İkonsuz</option>
                  {defaultIcons.map((ico) => (
                    <option key={ico} value={ico}>
                      {ico}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* If parent is specified, we can configure sub-tabs (like Medya dropdown tabs) */}
            {parentId && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Medya Sekmesi Eşleşmesi (Opsiyonel)</label>
                <select
                  value={tab}
                  onChange={(e) => setTab(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D1D1D6] bg-white text-sm focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                >
                  {tabOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-[#D1D1D6] text-[#007AFF] focus:ring-[#007AFF]"
              />
              <label htmlFor="isActive" className="text-xs font-semibold text-[#1D1D1F] select-none cursor-pointer">
                Menüyü aktif et (gösterilsin)
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
