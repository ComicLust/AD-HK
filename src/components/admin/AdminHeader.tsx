"use client";

import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pathTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/hizmetler": "Hizmetler Yönetimi",
  "/admin/ekip": "Ekip Yönetimi",
  "/admin/makaleler": "Makaleler / Blog Yönetimi",
  "/admin/basinda-biz": "Basında Biz Yönetimi",
  "/admin/videolar": "Video Yayınları Yönetimi",
  "/admin/dilekceler": "Örnek Dilekçe Yönetimi",
  "/admin/sayfalar": "Sayfa İçerikleri Yönetimi",
  "/admin/seo": "SEO Yönetimi",
  "/admin/navigasyon": "Navigasyon & Menü Yönetimi",
  "/admin/firma": "Firma Bilgileri Yönetimi",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const title = pathTitles[pathname] || "Yönetim Paneli";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="h-16 border-b border-[#D1D1D6] bg-white flex items-center justify-between px-6 lg:px-8 select-none sticky top-0 z-30 shadow-sm">
      <div className="pl-12 lg:pl-0">
        <h1 className="text-lg font-bold text-[#1D1D1F] tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[#F2F2F7] transition-all border border-[#D1D1D6] focus:outline-none">
            <div className="w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center text-white text-xs font-semibold">
              AD
            </div>
            <span className="text-xs font-medium text-[#1D1D1F] hidden sm:inline-block">Yönetici (admin)</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#86868B]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-apple border border-[#D1D1D6]">
            <DropdownMenuLabel className="text-xs font-bold text-[#86868B] px-3.5 py-2">
              Hesabım
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#E5E5EA]" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-[#FF3B30] focus:text-[#FF3B30] focus:bg-red-500/5 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 mr-2 shrink-0" />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
