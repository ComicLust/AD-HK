"use client";

import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Scale,
  Home,
  Info,
  Briefcase,
  Users,
  Newspaper,
  Phone,
  ChevronDown,
  Megaphone,
  BookOpen,
  Calendar,
  Video,
  FileText,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSiteData, useTranslation } from "@/hooks/useSiteData";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Info,
  Briefcase,
  Users,
  Newspaper,
  Phone,
  FileText,
};

const dropdownIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Newspaper,
  Megaphone,
  BookOpen,
  Calendar,
  Video,
  FileText,
};

interface NavbarProps {
  currentRoute: string;
  onNavigate: (path: string) => void;
  onNavigateMedia?: (tab: string) => void;
}

export default function Navbar({
  currentRoute,
  onNavigate,
  onNavigateMedia,
}: NavbarProps) {
  const { navLinks, firmInfo } = useSiteData();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mobileMediaOpen, setMobileMediaOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getNavLabel = (href: string, defaultLabel: string) => {
    const clean = href.replace("#", "");
    if (clean === "/" || clean === "") return t("nav.home", defaultLabel);
    if (clean === "/hakkimizda") return t("nav.about", defaultLabel);
    if (clean === "/hizmetlerimiz") return t("nav.services", defaultLabel);
    if (clean === "/ekibimiz") return t("nav.team", defaultLabel);
    if (clean === "/medya") return t("nav.media", defaultLabel);
    if (clean === "/ornek-dilekceler") return t("nav.dilekceler", defaultLabel);
    if (clean === "/iletisim") return t("nav.contact", defaultLabel);
    return t("nav." + defaultLabel.toLowerCase().replace(/[^a-z0-9]/g, ""), defaultLabel);
  };

  const getDropdownLabel = (tab: string, defaultLabel: string) => {
    if (tab === "basinda") return t("media.news", defaultLabel);
    if (tab === "makaleler") return t("media.articles", defaultLabel);
    if (tab === "videolar") return t("media.videos", defaultLabel);
    return t("media." + tab, defaultLabel);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMediaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNav = (href: string) => {
    const path = href.replace("#", "");
    onNavigate(path);
    setOpen(false);
    setMediaOpen(false);
    setMobileMediaOpen(false);
  };

  const handleMediaDropdown = (tab: string) => {
    if (onNavigateMedia) {
      onNavigateMedia(tab);
    } else {
      onNavigate("/medya");
    }
    setMediaOpen(false);
    setOpen(false);
    setMobileMediaOpen(false);
  };

  const isActive = (href: string) => {
    const path = href.replace("#", "");
    return currentRoute === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 frosted-glass bg-card/80 border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav("#/")}
            className="flex items-center gap-2 focus-ring-apple rounded-xl transition-opacity hover:opacity-80 shrink-0"
          >
            <img src={firmInfo?.logo || "/logo.svg"} alt="Adil Hukuk" className="h-9 shrink-0" />
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = iconMap[link.icon] || Scale;
              const active = isActive(link.href);

              // Medya dropdown
              if (link.dropdown) {
                return (
                  <div
                    key={link.href}
                    ref={dropdownRef}
                    className="relative"
                  >
                    <button
                      onClick={() => setMediaOpen(!mediaOpen)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        active || mediaOpen
                          ? "text-[#007AFF] bg-[#007AFF]/8"
                          : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {getNavLabel(link.href, link.label)}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          mediaOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown */}
                    {mediaOpen && (
                      <div className="absolute top-full left-0 mt-1 w-52 bg-card rounded-2xl shadow-apple-lg border border-border py-2 z-50 overflow-hidden">
                        {link.dropdown.map((item) => {
                          const DropIcon = dropdownIconMap[item.icon] || Newspaper;
                          return (
                            <button
                              key={item.tab || item.href}
                              onClick={() => {
                                if (item.href) {
                                  handleNav(item.href);
                                } else if (item.tab) {
                                  handleMediaDropdown(item.tab);
                                }
                              }}
                              className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-foreground/80 hover:text-[#007AFF] hover:bg-[#007AFF]/6 transition-all duration-150"
                            >
                              <DropIcon className="w-4 h-4 text-[#86868B] group-hover:text-[#007AFF]" />
                              {item.tab ? getDropdownLabel(item.tab, item.label) : item.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-[#007AFF] bg-[#007AFF]/8"
                      : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {getNavLabel(link.href, link.label)}
                </button>
              );
            })}

            {/* Language Selector */}
            <div className="mr-1">
              <LanguageSelector />
            </div>

            {/* Hemen Ara Button */}
            <a
              href={`tel:${firmInfo.gsm.replace(/\s/g, "")}`}
              className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white text-sm font-semibold transition-all duration-200 shadow-apple"
            >
              <Phone className="w-3.5 h-3.5" />
              {t("contact.callNow", "Hemen Ara")}
            </a>
          </div>

          {/* Mobile Quick Icons */}
          <div className="flex items-center gap-1 md:hidden">
            <LanguageSelector />
            <a
              href="tel:+905317760283"
              className="flex items-center justify-center w-9 h-9 rounded-xl text-[#007AFF] hover:bg-[#007AFF]/8 transition-all"
              aria-label="Ara"
            >
              <Phone className="w-5 h-5" />
            </a>
            <a
              href={firmInfo.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-xl text-[#34C759] hover:bg-[#34C759]/8 transition-all"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="w-5 h-5" />
                <span className="sr-only">{t("common.menu", "Menü")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetTitle className="sr-only">{t("common.navigationMenu", "Navigasyon Menüsü")}</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <img src={firmInfo?.logo || "/logo.svg"} alt="Adil Hukuk" className="h-8 shrink-0" />
                </div>
                <nav className="flex-1 p-4 overflow-y-auto">
                  <ul className="space-y-1">
                    {navLinks.map((link) => {
                      const Icon = iconMap[link.icon] || Scale;
                      const active = isActive(link.href);

                      // Medya with sub-items in mobile
                      if (link.dropdown) {
                        return (
                          <li key={link.href}>
                            <button
                              onClick={() =>
                                setMobileMediaOpen(!mobileMediaOpen)
                              }
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium transition-all duration-200 ${
                                active
                                  ? "text-[#007AFF] bg-[#007AFF]/8"
                                  : "text-foreground/80 hover:bg-foreground/5"
                              }`}
                            >
                              <span className="flex items-center gap-3">
                                <Icon className="w-4 h-4" />
                                {getNavLabel(link.href, link.label)}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  mobileMediaOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {mobileMediaOpen && (
                              <ul className="mt-1 ml-6 space-y-0.5">
                                {link.dropdown.map((item) => {
                                  const DropIcon = dropdownIconMap[item.icon] || Newspaper;
                                  return (
                                    <li key={item.tab || item.href}>
                                      <button
                                        onClick={() => {
                                          if (item.href) {
                                            handleNav(item.href);
                                          } else if (item.tab) {
                                            handleMediaDropdown(item.tab);
                                          }
                                        }}
                                        className="w-full flex items-center gap-2.5 text-left px-4 py-2 rounded-xl text-sm text-foreground/70 hover:text-[#007AFF] hover:bg-[#007AFF]/6 transition-all duration-150"
                                      >
                                        <DropIcon className="w-4 h-4 text-[#86868B]" />
                                        {item.tab ? getDropdownLabel(item.tab, item.label) : item.label}
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      }

                      return (
                        <li key={link.href}>
                          <button
                            onClick={() => handleNav(link.href)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-medium transition-all duration-200 ${
                              active
                                ? "text-[#007AFF] bg-[#007AFF]/8"
                                : "text-foreground/80 hover:bg-foreground/5"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {getNavLabel(link.href, link.label)}
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Hemen Ara - Mobile */}
                  <div className="mt-4 px-2">
                    <a
                      href={`tel:${firmInfo.gsm.replace(/\s/g, "")}`}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white text-base font-semibold transition-all duration-200 shadow-apple"
                    >
                      <Phone className="w-4 h-4" />
                      {t("contact.callNow", "Hemen Ara")}
                    </a>
                  </div>
                </nav>
                <div className="p-6 border-t border-border">
                  <p className="text-xs text-[#86868B]">{firmInfo.phone}</p>
                  <p className="text-xs text-[#86868B] mt-1">
                    {firmInfo.email}
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
