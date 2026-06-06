"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSearchStore } from "@/store/useSearchStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import LinkTracker from "@/components/LinkTracker";
import {
  Search,
  TrendingDown,
  Heart,
  History,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, initialize } = useAuthStore();
  const { totalSearches, totalSavings, searchHistory, products, initializeStore } = useSearchStore();
  const { favorites, initializeFavorites } = useFavoritesStore();

  useEffect(() => {
    initialize();
    initializeStore();
    initializeFavorites();
  }, []);

  // Protect route
  useEffect(() => {
    const checkAuth = setTimeout(() => {
      const savedSession = localStorage.getItem("pricewise_auth_session");
      if (!savedSession && !isAuthenticated) {
        router.push("/login");
      }
    }, 100);
    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, router]);

  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted">
        <span>Yükleniyor...</span>
      </div>
    );
  }

  // Get favorite products data
  const favoritedProducts = products.filter((p) => favorites.includes(p.id));

  // Get custom user-added products
  const customProducts = products.filter((p) => p.isCustom);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/15 rounded-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-primary/10 blur-3xl rounded-full" />
          <div className="space-y-1 relative z-10">
            <h2 className="text-2xl font-bold text-foreground">
              Merhaba, {user?.fullName}!
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Alışveriş asistanınız bugün de tasarruf etmeniz için hazır.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0 relative z-10">
            <Link
              href="/dashboard/add-custom"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-success text-white hover:bg-success/90 shadow-md shadow-success/15 flex items-center space-x-1.5 transition-all duration-200 hover:-translate-y-[1px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Manuel Fiyat Ekle</span>
            </Link>
            <Link
              href="/search"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-primary hover:bg-primary/95 text-white shadow-md shadow-primary/15 flex items-center space-x-1.5 transition-all duration-200 hover:-translate-y-[1px]"
            >
              <span>Yeni Ürün Ara</span>
              <Search className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* E-Commerce Link Tracker */}
        <div className="max-w-3xl mx-auto w-full">
          <LinkTracker />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Total Searches */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted font-bold uppercase tracking-wider">Aramalarım</p>
              <h3 className="text-2xl font-extrabold text-foreground mt-0.5">{totalSearches}</h3>
              <p className="text-[10px] text-muted mt-0.5">Toplam karşılaştırılan ürün adedi</p>
            </div>
          </div>

          {/* Card 2: Total Savings */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-success/15 text-success flex items-center justify-center">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted font-bold uppercase tracking-wider">Tahmini Tasarruf</p>
              <h3 className="text-2xl font-extrabold text-success mt-0.5">
                ₺{totalSavings.toLocaleString("tr-TR")}
              </h3>
              <p className="text-[10px] text-muted mt-0.5">En ucuz seçeneği tercih ederek kazanılan tutar</p>
            </div>
          </div>

          {/* Card 3: Favorited Count */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center space-x-4 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted font-bold uppercase tracking-wider">Takiptekiler</p>
              <h3 className="text-2xl font-extrabold text-foreground mt-0.5">{favorites.length}</h3>
              <p className="text-[10px] text-muted mt-0.5">Fiyat takibi yapılan favori ürün adedi</p>
            </div>
          </div>
        </div>

        {/* Details Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Favorites List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-foreground flex items-center space-x-2">
                <Heart className="w-5 h-5 text-danger fill-danger" />
                <span>Takip Ettiğim Ürünler</span>
              </h3>
              {favoritedProducts.length > 3 && (
                <Link
                  href="/favorites"
                  className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
                >
                  <span>Tümünü Gör</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {favoritedProducts.length === 0 ? (
              <div className="border border-border/80 border-dashed rounded-xl p-10 text-center space-y-4 bg-muted/5">
                <Heart className="w-10 h-10 text-muted mx-auto" />
                <div className="space-y-1">
                  <p className="font-bold text-sm text-foreground">Takip edilen ürün bulunmuyor</p>
                  <p className="text-xs text-muted">
                    İncelediğiniz ürünleri favorilerinize ekleyerek takip etmeye başlayın.
                  </p>
                </div>
                <Link
                  href="/search"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-card border border-border rounded-lg text-xs font-bold text-foreground hover:bg-muted/10 transition-colors"
                >
                  <span>Ürün Bul</span>
                  <Search className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favoritedProducts.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="flex bg-card border border-border hover:border-primary/20 rounded-xl p-4 premium-card space-x-3 items-center group"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-12 h-12 object-cover rounded-lg bg-muted/20"
                    />
                    <div className="flex-grow min-w-0 space-y-0.5">
                      <h4 className="font-bold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-[10px] text-muted">{p.brand}</p>
                      <p className="text-xs font-extrabold text-foreground">
                        Ort. ₺{p.basePrice.toLocaleString("tr-TR")}
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Search History */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center space-x-2">
              <History className="w-5 h-5 text-primary" />
              <span>Son Aramalarım</span>
            </h3>

            {searchHistory.length === 0 ? (
              <div className="border border-border/80 border-dashed rounded-xl p-10 text-center bg-muted/5">
                <History className="w-8 h-8 text-muted mx-auto mb-2" />
                <p className="text-xs text-muted">Arama geçmişiniz henüz boş.</p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl shadow-sm divide-y divide-border/60 overflow-hidden">
                {searchHistory.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-4 hover:bg-muted/5 transition-colors"
                  >
                    <Link
                      href={`/products/${item.productId}`}
                      className="flex-grow min-w-0 font-semibold text-xs text-foreground hover:text-primary transition-colors truncate"
                    >
                      {item.title}
                    </Link>
                    <span className="text-[10px] text-muted flex-shrink-0 ml-4">
                      {new Date(item.searchedAt).toLocaleDateString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Custom / Manually Added Products Section */}
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-foreground flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-success" />
              <span>Manuel Eklediğim Karşılaştırmalar</span>
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-success/15 text-success">
              {customProducts.length} Ürün Eklendi
            </span>
          </div>

          {customProducts.length === 0 ? (
            <div className="border border-border/80 border-dashed rounded-xl p-8 text-center bg-card space-y-3">
              <p className="text-xs text-muted">
                Henüz el ile fiyat karşılaştırması eklemediniz.
              </p>
              <Link
                href="/dashboard/add-custom"
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-success/15 hover:bg-success/20 text-success rounded-lg text-xs font-bold transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>İlk Ürünü Ekle</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {customProducts.map((p) => {
                // Find cheapest option and lowest price
                const sortedMarketplaces = [...p.marketplaces].sort((a, b) => a.price - b.price);
                const cheapestMarket = sortedMarketplaces[0].marketplace;
                const lowestPrice = sortedMarketplaces[0].price;

                return (
                  <div
                    key={p.id}
                    className="bg-card border border-border rounded-xl p-5 shadow-sm premium-card flex flex-col justify-between h-full group"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                          {p.category.split(" / ")[0]}
                        </span>
                        <span className="text-[10px] text-muted font-bold uppercase">
                          {p.brand}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    {/* Lowest Price and Cheapest Market badges */}
                    <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-muted font-semibold uppercase tracking-wider">
                          En Ucuz Seçenek
                        </p>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span className="font-extrabold text-base text-success">
                            ₺{lowestPrice.toLocaleString("tr-TR")}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-success/10 text-success font-extrabold">
                            {cheapestMarket}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/products/${p.id}`}
                        className="inline-flex items-center space-x-0.5 px-3 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        <span>İncele</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
