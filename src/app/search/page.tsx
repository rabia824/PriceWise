"use client";

import React, { useEffect, useState } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Search, ChevronRight, SlidersHorizontal, Tag, Layers } from "lucide-react";
import LinkTracker from "@/components/LinkTracker";
import ProductImage from "@/components/ProductImage";


export default function SearchPage() {
  const { searchResults, searchQuery, setSearchQuery, searchProducts, initializeStore } = useSearchStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    initializeStore();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchProducts(query);
  };

  // Unique categories list
  const categories = ["All", "Elektronik", "Ev / Yaşam"];

  const filteredResults = searchResults.filter((p) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Elektronik") return p.category.startsWith("Elektronik");
    if (selectedCategory === "Ev / Yaşam") return p.category.startsWith("Ev / Yaşam");
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
            Ürün Karşılaştırın
          </h2>
          <p className="text-sm text-muted">
            Binlerce popüler ürünü arayın ve en ekonomik alışveriş seçeneğini anında bulun.
          </p>
        </div>

        {/* Search Bar & Filters */}
        <div className="max-w-3xl mx-auto space-y-6">
          <LinkTracker />
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm transition-all duration-200"
              placeholder="Ürün adı, marka veya kategori arayın... (Örn: iPhone, AirPods, Stanley)"
            />
          </div>

          {/* Category Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider flex items-center space-x-1 mr-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtrele:</span>
            </span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  selectedCategory === c
                    ? "bg-primary text-white shadow-md shadow-primary/10"
                    : "bg-card border border-border text-muted hover:text-foreground"
                }`}
              >
                {c === "All" ? "Tüm Kategoriler" : c}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div>
          {filteredResults.length === 0 ? (
            <div className="border border-border border-dashed rounded-xl p-16 text-center space-y-4 max-w-xl mx-auto">
              <Search className="w-12 h-12 text-muted mx-auto" />
              <div className="space-y-1.5">
                <p className="font-bold text-base text-foreground">Ürün Bulunamadı</p>
                <p className="text-xs text-muted">
                  Aramanızla eşleşen bir sonuç bulamadık. Lütfen farklı anahtar kelimeler deneyin veya kategorileri sıfırlayın.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  searchProducts("");
                  setSelectedCategory("All");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Aramayı Sıfırla
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((p) => (
                <div
                  key={p.id}
                  className="bg-card border border-border rounded-xl shadow-sm overflow-hidden premium-card flex flex-col h-full group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-muted/20 border-b border-border">
                    <ProductImage
                      title={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider flex items-center space-x-1 border border-white/10">
                      <Tag className="w-3 h-3" />
                      <span>{p.brand}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] text-primary font-bold uppercase tracking-wider flex items-center space-x-1">
                        <Layers className="w-3 h-3" />
                        <span>{p.category.split(" / ")[1] || p.category}</span>
                      </span>
                      <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-xs text-muted line-clamp-3 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-muted font-semibold uppercase tracking-wider">
                          Piyasa Ortalaması
                        </p>
                        <p className="font-extrabold text-lg text-foreground mt-0.5">
                          ₺{p.basePrice.toLocaleString("tr-TR")}
                        </p>
                      </div>

                      <Link
                        href={`/products/${p.id}`}
                        className="inline-flex items-center space-x-1 px-4 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-lg text-xs font-bold shadow-md shadow-primary/10 hover:shadow-lg hover:-translate-y-[1px] transition-all duration-200"
                      >
                        <span>İncele</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
