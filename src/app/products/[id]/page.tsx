"use client";

export const dynamic = "force-dynamic";

import React, { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/store/useSearchStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PriceTrendChart from "@/components/PriceTrendChart";
import ComparisonMatrix from "@/components/ComparisonMatrix";
import SavingRecommendation from "@/components/SavingRecommendation";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import {
  Heart,
  ChevronLeft,
  Tag,
  Layers,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { activeProduct, getProductDetails, initializeStore } = useSearchStore();
  const { favorites, addFavorite, removeFavorite, initializeFavorites, isFavorite } = useFavoritesStore();
  const { isAuthenticated, user, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
    initializeStore();
    initializeFavorites();
    getProductDetails(id);
  }, [id]);

  if (!activeProduct) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="w-12 h-12 text-muted" />
          <p className="text-sm text-muted">Ürün yükleniyor veya bulunamadı...</p>
          <Link href="/search" className="text-sm font-bold text-primary hover:underline">
            Geri Dön
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const favorited = isFavorite(activeProduct.id);

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (favorited) {
      removeFavorite(activeProduct.id);
    } else {
      addFavorite(activeProduct.id);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/search"
            className="inline-flex items-center space-x-1 text-xs font-bold text-muted hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Ürün Aramaya Dön</span>
          </Link>
        </div>

        {/* Product Brief Details & Image */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image */}
          <div className="md:col-span-4 bg-card border border-border rounded-xl p-5 shadow-sm flex items-center justify-center aspect-square md:aspect-auto md:h-[280px]">
            <ProductImage
              title={activeProduct.title}
              className="w-full h-full object-contain rounded-lg max-h-[240px]"
            />
          </div>

          {/* Right Column: Title & Specs */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/15">
                <Tag className="w-3.5 h-3.5" />
                <span>{activeProduct.brand}</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-muted/10 text-muted text-xs font-bold border border-border">
                <Layers className="w-3.5 h-3.5" />
                <span>{activeProduct.category}</span>
              </span>
            </div>

            <div className="flex justify-between items-start gap-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
                {activeProduct.title}
              </h2>

              {/* Favorites Button */}
              <button
                onClick={handleFavoriteClick}
                className={`flex items-center justify-center p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  favorited
                    ? "bg-danger/10 border-danger/30 text-danger"
                    : "bg-card border-border text-muted hover:text-foreground hover:bg-muted/10"
                }`}
                title={favorited ? "Takibi Bırak" : "Takibe Al"}
              >
                <Heart className={`w-5.5 h-5.5 ${favorited ? "fill-danger" : ""}`} />
              </button>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              {activeProduct.description}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/60">
              <div className="bg-card border border-border p-4 rounded-xl text-center space-y-1">
                <p className="text-[10px] text-muted font-semibold uppercase tracking-wider">
                  En Düşük Fiyatı
                </p>
                <p className="font-extrabold text-base sm:text-lg text-success">
                  ₺{activeProduct.lowestPrice.toLocaleString("tr-TR")}
                </p>
              </div>
              <div className="bg-card border border-border p-4 rounded-xl text-center space-y-1">
                <p className="text-[10px] text-muted font-semibold uppercase tracking-wider">
                  Ortalama Fiyatı
                </p>
                <p className="font-extrabold text-base sm:text-lg text-foreground">
                  ₺{activeProduct.avgPrice.toLocaleString("tr-TR")}
                </p>
              </div>
              <div className="bg-card border border-border p-4 rounded-xl text-center space-y-1">
                <p className="text-[10px] text-muted font-semibold uppercase tracking-wider">
                  En Yüksek Fiyatı
                </p>
                <p className="font-extrabold text-base sm:text-lg text-danger">
                  ₺{activeProduct.highestPrice.toLocaleString("tr-TR")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Smart saving recommendation */}
        <SavingRecommendation
          savingsMessage={activeProduct.savingsMessage}
          lowestPrice={activeProduct.lowestPrice}
          avgPrice={activeProduct.avgPrice}
        />

        {/* Dynamic Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Price Matrix */}
          <div className="lg:col-span-6">
            <ComparisonMatrix marketplaces={activeProduct.marketplaces} />
          </div>

          {/* Right Column: Historical Graph */}
          <div className="lg:col-span-6">
            <PriceTrendChart data={activeProduct.history} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
