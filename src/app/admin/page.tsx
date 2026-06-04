"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  BookOpen,
  FileText,
  Plus,
  ArrowRight,
  Eye,
  Download,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DashboardStats {
  totalServices: number;
  totalBlogPosts: number;
  totalTeamMembers: number;
  totalDilekceler: number;
  recentPosts: any[];
  recentServices: any[];
}

interface AnalyticsData {
  chartData: any[];
  popularPages: any[];
  downloadedDilekceler: any[];
  stats: {
    totalViews: number;
    totalDownloads: number;
    totalClicks: number;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/analytics")
        ]);
        
        const statsData = await statsRes.json();
        const analyticsData = await analyticsRes.json();
        
        setStats(statsData);
        setAnalytics(analyticsData);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007AFF]"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Hizmetler",
      value: stats?.totalServices || 0,
      description: "Aktif uzmanlık alanları",
      color: "text-[#007AFF]",
      bg: "bg-[#007AFF]/10",
      link: "/admin/hizmetler",
      icon: Briefcase,
    },
    {
      title: "Ekip Üyeleri",
      value: stats?.totalTeamMembers || 0,
      description: "Büro çalışanları ve avukatlar",
      color: "text-[#34C759]",
      bg: "bg-[#34C759]/10",
      link: "/admin/ekip",
      icon: Users,
    },
    {
      title: "Makaleler",
      value: stats?.totalBlogPosts || 0,
      description: "Yayınlanan hukuki yazılar",
      color: "text-[#FF9500]",
      bg: "bg-[#FF9500]/10",
      link: "/admin/makaleler",
      icon: BookOpen,
    },
    {
      title: "Dilekçe Örnekleri",
      value: stats?.totalDilekceler || 0,
      description: "İndirilebilir dosya sayısı",
      color: "text-[#AF52DE]",
      bg: "bg-[#AF52DE]/10",
      link: "/admin/dilekceler",
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Welcome Banner */}
      <div className="bg-[#0A2540] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Hoş Geldiniz, Yönetici</h2>
          <p className="text-sm text-white/70 max-w-xl">
            Adil Hukuk Danışmanlık CMS yönetim paneli ile web sitenizin içeriğini kolayca güncelleyebilir, yeni makale veya hizmet ekleyebilirsiniz.
          </p>
          <div className="pt-2 flex flex-wrap gap-2">
            <Link href="/admin/makaleler">
              <Button size="sm" className="rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold flex items-center gap-1">
                <Plus className="w-4 h-4" /> Yeni Makale Ekle
              </Button>
            </Link>
            <Link href="/admin/hizmetler">
              <Button size="sm" variant="secondary" className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 font-semibold flex items-center gap-1">
                <Plus className="w-4 h-4" /> Yeni Hizmet Ekle
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link key={idx} href={card.link}>
              <Card className="rounded-2xl border-[#D1D1D6] hover:border-[#007AFF]/40 transition-all shadow-sm hover:shadow-apple bg-white dark:bg-card cursor-pointer group">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#86868B] uppercase tracking-wider">{card.title}</p>
                    <h3 className="text-3xl font-extrabold text-[#1D1D1F] dark:text-foreground tracking-tight">{card.value}</h3>
                    <p className="text-[11px] text-[#86868B]">{card.description}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Local Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analytics Line/Area Chart */}
        <Card className="lg:col-span-2 rounded-3xl border-[#D1D1D6] shadow-sm bg-white dark:bg-card overflow-hidden">
          <CardHeader className="border-b border-[#E5E5EA] dark:border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-extrabold text-[#1D1D1F] dark:text-foreground">Sistem Ziyaretçi & İndirme Trendleri</CardTitle>
                <CardDescription className="text-[11px]">Son 7 güne ait sayfa gösterimleri ve dilekçe indirme istatistikleri</CardDescription>
              </div>
              <div className="flex items-center gap-1 bg-[#F2F2F7] dark:bg-[#1C1C1E] px-2.5 py-1 rounded-full border border-[#D1D1D6]/30">
                <TrendingUp className="w-3.5 h-3.5 text-[#34C759]" />
                <span className="text-[10px] font-bold text-[#34C759]">Canlı</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[280px] w-full">
              {analytics?.chartData && analytics.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#AF52DE" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#AF52DE" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#86868B" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#86868B" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "16px", border: "0", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                    <Area name="Sayfa Gösterimi" type="monotone" dataKey="pageviews" stroke="#007AFF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorViews)" />
                    <Area name="Dilekçe İndirme" type="monotone" dataKey="downloads" stroke="#AF52DE" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDownloads)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-[#86868B]">Veri bulunamadı.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Local Analytics Stats Sidebar */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-[#D1D1D6] shadow-sm bg-white dark:bg-card">
            <CardHeader className="pb-3 border-b border-[#E5E5EA] dark:border-border">
              <CardTitle className="text-sm font-extrabold text-[#1D1D1F] dark:text-foreground">Genel Trafik Özetleri</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#007AFF]/6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1D1D1F] dark:text-foreground">Toplam Görüntülenme</h5>
                    <p className="text-[10px] text-[#86868B]">Tüm sayfa ziyaretleri</p>
                  </div>
                </div>
                <span className="text-sm font-black text-[#007AFF]">{analytics?.stats.totalViews || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#AF52DE]/6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#AF52DE]/10 flex items-center justify-center text-[#AF52DE]">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1D1D1F] dark:text-foreground">Toplam İndirme</h5>
                    <p className="text-[10px] text-[#86868B]">İndirilen dilekçeler</p>
                  </div>
                </div>
                <span className="text-sm font-black text-[#AF52DE]">{analytics?.stats.totalDownloads || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#34C759]/6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#34C759]/10 flex items-center justify-center text-[#34C759]">
                    <MousePointerClick className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#1D1D1F] dark:text-foreground">Toplam Tıklama</h5>
                    <p className="text-[10px] text-[#86868B]">Navigasyon ve etkileşim</p>
                  </div>
                </div>
                <span className="text-sm font-black text-[#34C759]">{analytics?.stats.totalClicks || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popular Pages & Dilekçeler Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Pages */}
        <Card className="rounded-3xl border-[#D1D1D6] shadow-sm bg-white dark:bg-card overflow-hidden">
          <CardHeader className="border-b border-[#E5E5EA] dark:border-border px-6 py-4">
            <CardTitle className="text-sm font-extrabold text-[#1D1D1F] dark:text-foreground">En Çok Ziyaret Edilen Sayfalar</CardTitle>
            <CardDescription className="text-[11px]">En yüksek sayfa gösterimine sahip sayfalar</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#E5E5EA] dark:divide-border">
              {analytics?.popularPages && analytics.popularPages.length > 0 ? (
                analytics.popularPages.map((item, idx) => (
                  <div key={idx} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#F2F2F7]/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#86868B] w-4">{idx + 1}.</span>
                      <span className="text-xs font-semibold text-[#1D1D1F] dark:text-foreground truncate max-w-xs">{item.path || "/"}</span>
                    </div>
                    <span className="text-xs font-bold text-[#007AFF] bg-[#007AFF]/8 px-2.5 py-0.5 rounded-full">
                      {item.count} ziyaret
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-xs text-[#86868B]">Veri bulunamadı.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Popular Petitions */}
        <Card className="rounded-3xl border-[#D1D1D6] shadow-sm bg-white dark:bg-card overflow-hidden">
          <CardHeader className="border-b border-[#E5E5EA] dark:border-border px-6 py-4">
            <CardTitle className="text-sm font-extrabold text-[#1D1D1F] dark:text-foreground">En Çok İndirilen Dilekçeler</CardTitle>
            <CardDescription className="text-[11px]">Müvekkiller tarafından en çok indirilen dilekçe dosyaları</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#E5E5EA] dark:divide-border">
              {analytics?.downloadedDilekceler && analytics.downloadedDilekceler.length > 0 ? (
                analytics.downloadedDilekceler.map((item, idx) => (
                  <div key={idx} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#F2F2F7]/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#86868B] w-4">{idx + 1}.</span>
                      <span className="text-xs font-semibold text-[#1D1D1F] dark:text-foreground truncate max-w-xs">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-[#AF52DE] bg-[#AF52DE]/8 px-2.5 py-0.5 rounded-full">
                      {item.count} indirme
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-xs text-[#86868B]">İndirme verisi bulunamadı.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Services and Blog Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-[#D1D1D6] shadow-sm bg-white dark:bg-card overflow-hidden">
          <CardHeader className="border-b border-[#E5E5EA] dark:border-border px-6 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-extrabold text-[#1D1D1F] dark:text-foreground">Son Eklenen Hizmetler</CardTitle>
              <CardDescription className="text-[11px]">En son eklenen veya güncellenen uzmanlık alanları</CardDescription>
            </div>
            <Link href="/admin/hizmetler" className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-0.5">
              Tümü <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#E5E5EA] dark:divide-border">
              {stats?.recentServices && stats.recentServices.length > 0 ? (
                stats.recentServices.map((service) => (
                  <div key={service.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#F2F2F7]/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1D1D1F] dark:text-foreground">{service.name}</h4>
                        <p className="text-[10px] text-[#86868B] truncate max-w-xs">{service.description}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${service.isActive ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {service.isActive ? "Aktif" : "Taslak"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-xs text-[#86868B]">Kayıtlı hizmet bulunamadı.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-[#D1D1D6] shadow-sm bg-white dark:bg-card overflow-hidden">
          <CardHeader className="border-b border-[#E5E5EA] dark:border-border px-6 py-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-extrabold text-[#1D1D1F] dark:text-foreground">Son Makaleler</CardTitle>
              <CardDescription className="text-[11px]">En son yazılan blog yazıları</CardDescription>
            </div>
            <Link href="/admin/makaleler" className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-0.5">
              Tümü <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#E5E5EA] dark:divide-border">
              {stats?.recentPosts && stats.recentPosts.length > 0 ? (
                stats.recentPosts.map((post) => (
                  <div key={post.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#F2F2F7]/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1D1D1F] dark:text-foreground line-clamp-1">{post.title}</h4>
                        <p className="text-[10px] text-[#86868B]">{post.category}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${post.isPublished ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {post.isPublished ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-xs text-[#86868B]">Kayıtlı makale bulunamadı.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
