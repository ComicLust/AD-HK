"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BookOpen,
  Megaphone,
  Video,
  FileText,
  Layers,
  Search,
  Menu,
  MenuSquare,
  Building2,
  LogOut,
  X,
  Compass,
  Mail,
  Settings,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Hizmetler", href: "/admin/hizmetler", icon: Briefcase },
  { label: "Ekip Yönetimi", href: "/admin/ekip", icon: Users },
  { label: "Makaleler", href: "/admin/makaleler", icon: BookOpen },
  { label: "Basında Biz", href: "/admin/basinda-biz", icon: Megaphone },
  { label: "Videolar", href: "/admin/videolar", icon: Video },
  { label: "Dilekçeler", href: "/admin/dilekceler", icon: FileText },
  { label: "Sayfa İçerikleri", href: "/admin/sayfalar", icon: Layers },
  { label: "SEO Yönetimi", href: "/admin/seo", icon: Search },
  { label: "Menü Yönetimi", href: "/admin/navigasyon", icon: Compass },
  { label: "Firma Bilgileri", href: "/admin/firma", icon: Building2 },
  { label: "Dil & Çeviri", href: "/admin/ceviriler", icon: Globe },
  { label: "SMTP Ayarları", href: "/admin/smtp", icon: Mail },
  { label: "Entegrasyonlar", href: "/admin/entegrasyonlar", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const NavLinks = () => (
    <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group ${
              isActive
                ? "bg-[#007AFF]/15 text-white"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#007AFF] rounded-r-full" />
            )}
            <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-[#007AFF]" : "text-white/50"}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#0A2540] border-r border-white/10 shrink-0 text-white select-none">
        <div className="h-16 flex items-center px-6 gap-3.5 border-b border-white/10 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#007AFF] flex items-center justify-center font-bold text-white text-base">
            A
          </div>
          <span className="font-bold text-sm tracking-wide text-white uppercase">
            Adil Hukuk CMS
          </span>
        </div>

        <NavLinks />

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-[#FF3B30] hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Toggle Button */}
      <div className="lg:hidden fixed top-3 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl border-[rgba(0,0,0,0.1)] bg-white text-slate-700 shadow-sm"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-[#0A2540] border-r border-white/10 text-white flex flex-col transform transition-transform duration-300 ease-out select-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#007AFF] flex items-center justify-center font-bold text-white text-base">
              A
            </div>
            <span className="font-bold text-sm tracking-wide text-white uppercase">
              Adil Hukuk CMS
            </span>
          </div>
        </div>

        <NavLinks />

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-[#FF3B30] hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>
    </>
  );
}
