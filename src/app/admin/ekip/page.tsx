"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import SlugInput from "@/components/admin/SlugInput";
import ImageUploader from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, ArrowUp, ArrowDown, User, Check, X, Shield } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  category: "lawyer" | "intern-lawyer" | "intern-student" | "staff";
  bio: string;
  initials: string;
  photo: string;
  specializations: string; // JSON array
  socialLinks?: string; // JSON string
  slug: string;
  order: number;
  isActive: boolean;
}

interface Service {
  id: string;
  name: string;
}

const categories = [
  { id: "lawyer", label: "Avukat", color: "bg-blue-100 text-blue-800" },
  { id: "intern-lawyer", label: "Stajyer Avukat", color: "bg-orange-100 text-orange-800" },
  { id: "intern-student", label: "Stajyer Öğrenci", color: "bg-slate-100 text-slate-800" },
  { id: "staff", label: "Ofis Personeli", color: "bg-green-100 text-green-800" },
];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"lawyer" | "intern-lawyer" | "intern-student" | "staff">("lawyer");
  const [bio, setBio] = useState("");
  const [initials, setInitials] = useState("");
  const [photo, setPhoto] = useState("");
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadMembers();
    loadServices();
  }, []);

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMembers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (Array.isArray(data)) {
        setServices(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setTitle("");
    setCategory("lawyer");
    setBio("");
    setInitials("");
    setPhoto("");
    setSelectedSpecs([]);
    setEmail("");
    setPhone("");
    setInstagram("");
    setTwitter("");
    setLinkedin("");
    setSlug("");
    setIsActive(true);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setName(member.name);
    setTitle(member.title);
    setCategory(member.category);
    setBio(member.bio || "");
    setInitials(member.initials || "");
    setPhoto(member.photo || "");
    setSlug(member.slug);
    setIsActive(member.isActive);
    
    try {
      setSelectedSpecs(member.specializations ? JSON.parse(member.specializations) : []);
    } catch (e) {
      setSelectedSpecs([]);
    }

    let social = { email: "", phone: "", instagram: "", twitter: "", linkedin: "" };
    try {
      if (member.socialLinks) {
        social = JSON.parse(member.socialLinks);
      }
    } catch (e) {
      console.error(e);
    }
    setEmail(social.email || "");
    setPhone(social.phone || "");
    setInstagram(social.instagram || "");
    setTwitter(social.twitter || "");
    setLinkedin(social.linkedin || "");

    setIsDialogOpen(true);
  };

  const handleDelete = async (member: TeamMember) => {
    if (!window.confirm(`"${member.name}" ekip üyesini silmek istediğinizden emin misiniz?`)) return;

    try {
      const res = await fetch(`/api/team/${member.id}`, { method: "DELETE" });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== member.id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    try {
      const res = await fetch(`/api/team/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...member,
          specializations: member.specializations ? JSON.parse(member.specializations) : [],
          isActive: !member.isActive,
        }),
      });
      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? { ...m, isActive: !m.isActive } : m))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredMembers.length) return;

    // Find original indexes in complete members list
    const originalIndex = members.findIndex((m) => m.id === filteredMembers[index].id);
    const originalTargetIndex = members.findIndex((m) => m.id === filteredMembers[targetIndex].id);

    const reordered = [...members];
    const temp = reordered[originalIndex];
    reordered[originalIndex] = reordered[originalTargetIndex];
    reordered[originalTargetIndex] = temp;

    const updatedWithOrder = reordered.map((item, idx) => ({ ...item, order: idx }));
    setMembers(updatedWithOrder);

    try {
      await fetch("/api/team/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          updatedWithOrder.map((m) => ({ id: m.id, order: m.order }))
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
      const url = editingId ? `/api/team/${editingId}` : "/api/team";
      const method = editingId ? "PUT" : "POST";

      // Auto-extract initials if empty
      let finalInitials = initials;
      if (!finalInitials && name) {
        finalInitials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          title,
          category,
          bio,
          initials: finalInitials,
          photo,
          specializations: selectedSpecs,
          socialLinks: {
            email,
            phone,
            instagram,
            twitter,
            linkedin,
          },
          slug,
          isActive,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsDialogOpen(false);
        loadMembers();
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

  const toggleSpec = (specName: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(specName) ? prev.filter((s) => s !== specName) : [...prev, specName]
    );
  };

  const filteredMembers = members.filter(
    (m) => filterCategory === "all" || m.category === filterCategory
  );

  const columns = [
    {
      header: "Sıra",
      accessorKey: (row: TeamMember) => {
        const idx = filteredMembers.findIndex((m) => m.id === row.id);
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
              disabled={idx === filteredMembers.length - 1}
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
      header: "Fotoğraf",
      accessorKey: (row: TeamMember) => (
        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F2F2F7] flex items-center justify-center border border-[#D1D1D6]">
          {row.photo ? (
            <img src={row.photo} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-[#86868B]" />
          )}
        </div>
      ),
    },
    { header: "Ad Soyad", accessorKey: "name" },
    { header: "Unvan", accessorKey: "title" },
    {
      header: "Kategori",
      accessorKey: (row: TeamMember) => {
        const cat = categories.find((c) => c.id === row.category);
        return (
          <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full ${cat?.color}`}>
            {cat?.label}
          </span>
        );
      },
    },
    {
      header: "Durum",
      accessorKey: (row: TeamMember) => (
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
          <h2 className="text-lg font-bold text-[#1D1D1F]">Ekip Yönetimi</h2>
          <p className="text-xs text-[#86868B]">Büronuz bünyesinde görev alan avukat ve destek personeli listesi</p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold">
          <Plus className="w-4 h-4 mr-1" /> Ekip Üyesi Ekle
        </Button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 select-none">
        <button
          onClick={() => setFilterCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            filterCategory === "all"
              ? "bg-[#0A2540] text-white border-[#0A2540]"
              : "bg-white text-slate-600 hover:text-slate-900 border-[#D1D1D6]"
          }`}
        >
          Tümü ({members.length})
        </button>
        {categories.map((cat) => {
          const count = members.filter((m) => m.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filterCategory === cat.id
                  ? "bg-[#0A2540] text-white border-[#0A2540]"
                  : "bg-white text-slate-600 hover:text-slate-900 border-[#D1D1D6]"
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
        </div>
      ) : (
        <DataTable
          data={filteredMembers}
          columns={columns}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          searchKey="name"
          searchPlaceholder="Ekip üyesi ara..."
        />
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90vw] lg:max-w-[1000px] xl:max-w-[1150px] w-full max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1D1D1F]">
              {editingId ? "Ekip Üyesini Düzenle" : "Yeni Ekip Üyesi Ekle"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Profil bilgilerini, kategori ve uzmanlık alanlarını güncelleyin.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-5 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Ad Soyad</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Av. Burak GÖNCÜ"
                  required
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Slug (URL Bağlantısı)</label>
                <SlugInput sourceValue={name} value={slug} onChange={setSlug} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Unvan</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: Kurucu Avukat"
                  required
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D1D1D6] bg-white text-sm focus:ring-[#007AFF] focus:border-[#007AFF] transition-all"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Baş Harfler (Görsel olmadığında baş harfler görünür)</label>
                <Input
                  value={initials}
                  onChange={(e) => setInitials(e.target.value.toUpperCase())}
                  placeholder="Örn: BG"
                  maxLength={2}
                  className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-[#1D1D1F]">Profil Fotoğrafı</label>
                <ImageUploader value={photo} onChange={setPhoto} />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1D1D1F]">Hakkında / Biyografi</label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Eğitim, kariyer ve hukuki geçmiş..."
                    rows={4}
                    className="rounded-xl border-[#D1D1D6] focus:ring-[#007AFF] resize-none text-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
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
            </div>

            {/* İletişim & Sosyal Medya */}
            <div className="bg-[#F2F2F7]/50 p-4 rounded-2xl border border-[#D1D1D6]/40 space-y-4">
              <span className="text-xs font-bold text-[#1D1D1F] block mb-1">İletişim & Sosyal Medya Bilgileri</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#1D1D1F]">E-Posta</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@adilhukuk.com"
                    className="rounded-xl border-[#D1D1D6] bg-white text-xs h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#1D1D1F]">Telefon</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className="rounded-xl border-[#D1D1D6] bg-white text-xs h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#1D1D1F]">Instagram URL</label>
                  <Input
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="rounded-xl border-[#D1D1D6] bg-white text-xs h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#1D1D1F]">Twitter/X URL</label>
                  <Input
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://x.com/..."
                    className="rounded-xl border-[#D1D1D6] bg-white text-xs h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#1D1D1F]">LinkedIn URL</label>
                  <Input
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="rounded-xl border-[#D1D1D6] bg-white text-xs h-9"
                  />
                </div>
              </div>
            </div>

            {/* Specializations selection mapped from database services */}
            <div className="space-y-2 bg-[#F2F2F7]/50 p-4 rounded-2xl border border-[#D1D1D6]/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1D1D1F] mb-1">
                <Shield className="w-4 h-4 text-[#007AFF]" />
                <span>Uzmanlık Alanları (Hizmet Listesinden Seçin)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {services.map((service) => {
                  const isChecked = selectedSpecs.includes(service.name);
                  return (
                    <button
                      type="button"
                      key={service.id}
                      onClick={() => toggleSpec(service.name)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold text-left select-none transition-all ${
                        isChecked
                          ? "bg-[#007AFF]/10 border-[#007AFF] text-[#007AFF]"
                          : "bg-white border-[#D1D1D6] text-[#1D1D1F] hover:bg-slate-50"
                      }`}
                    >
                      <span>{service.name}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#007AFF] shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
                {services.length === 0 && (
                  <span className="col-span-3 text-xs text-[#86868B] italic">Hizmet bulunamadı. Lütfen önce hizmet ekleyin.</span>
                )}
              </div>
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
