"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSearchStore } from "@/store/useSearchStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import {
  Heart,
  Search,
  ChevronRight,
  TrendingDown,
  Trash2,
  Bell,
  AlertCircle,
} from "lucide-react";

export default function FavoritesPage() {
  const router = useRouter();
  const { user, isAuthenticated, initialize } = useAuthStore();
  const { products, initializeStore } = useSearchStore();
  const { favorites, removeFavorite, initializeFavorites } = useFavoritesStore();

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

  const favoritedProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl flex items-center space-x-2.5">
              <Heart className="w-7 h-7 text-danger fill-danger" />
              <span>Fiyat Takip Listem</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Listenizdeki ürünleri ve güncel fiyat hareketlerini buradan izleyebilirsiniz.
            </p>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-success/10 border border-success/15 rounded-xl text-success text-xs font-bold">
            <Bell className="w-4 h-4 animate-bounce" />
            <span>Fiyat indirim bildirimleri aktif</span>
          </div>
        </div>

        {/* Favorites Grid */}
        {favoritedProducts.length === 0 ? (
          <div className="border border-border border-dashed rounded-xl p-16 text-center space-y-4 max-w-xl mx-auto bg-card">
            <Heart className="w-12 h-12 text-muted mx-auto" />
            <div className="space-y-1.5">
              <p className="font-bold text-base text-foreground">Listeniz Boş</p>
              <p className="text-xs text-muted">
                Henüz takip listesine eklenmiş bir ürün bulunmuyor. Ürün araması yaparak listenizi doldurabilirsiniz.
              </p>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center space-x-1.5 px-4.5 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg shadow-md transition-colors"
            >
              <span>Ürün Ara</span>
              <Search className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favoritedProducts.map((p) => {
              // Mock a realistic discount state
              const isDiscounted = p.title.charCodeAt(0) % 2 === 0;
              const discountRate = (p.title.charCodeAt(1) % 8) + 3; // 3% to 10%
              const oldPrice = Math.round(p.basePrice * (1 + discountRate / 100));

              return (
                <div
                  key={p.id}
                  className="bg-card border border-border rounded-xl p-5 shadow-sm premium-card flex gap-4 relative overflow-hidden"
                >
                  {/* Left: Image */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-muted/20 rounded-xl p-2 flex items-center justify-center border border-border/60">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>

                  {/* Right: Details */}
                  <div className="flex-grow min-w-0 flex flex-col justify-between">
                    <div className="space-y-1 pr-6">
                      <span className="text-[10px] text-muted font-bold uppercase tracking-wider">
                        {p.brand}
                      </span>
                      <Link
                        href={`/products/${p.id}`}
                        className="block font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors leading-snug truncate"
                      >
                        {p.title}
                      </Link>
                      <p className="text-[10px] text-muted">{p.category}</p>
                    </div>

                    <div className="pt-3 border-t border-border/50 flex items-end justify-between">
                      <div>
                        {isDiscounted ? (
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-muted line-through">
                              ₺{oldPrice.toLocaleString("tr-TR")}
                            </span>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-extrabold text-base sm:text-lg text-success">
                                ₺{p.basePrice.toLocaleString("tr-TR")}
                              </span>
                              <span className="inline-flex items-center space-x-0.5 text-[10px] font-black text-success bg-success/15 px-1.5 py-0.5 rounded">
                                <TrendingDown className="w-3 h-3" />
                                <span>%{discountRate} indirim</span>
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[10px] text-muted font-semibold uppercase tracking-wider">
                              Anlık Fiyatı
                            </span>
                            <p className="font-extrabold text-base sm:text-lg text-foreground mt-0.5">
                              ₺{p.basePrice.toLocaleString("tr-TR")}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/products/${p.id}`}
                          className="px-3 py-2 bg-muted/15 hover:bg-muted/20 text-foreground rounded-lg text-xs font-bold transition-all"
                        >
                          İncele
                        </Link>
                        <button
                          onClick={() => removeFavorite(p.id)}
                          className="p-2 border border-border text-muted hover:text-danger hover:bg-danger/10 hover:border-danger/25 rounded-lg transition-all cursor-pointer"
                          title="Listeden Çıkar"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
