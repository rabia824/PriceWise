"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSearchStore } from "@/store/useSearchStore";
import { estimateProductBasePrice } from "@/lib/priceHelper";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import {
  ChevronLeft,
  PlusCircle,
  AlertCircle,
  Sparkles,
  Loader2,
  CheckCircle,
} from "lucide-react";

export default function AddCustomProductPage() {
  const router = useRouter();
  const { isAuthenticated, initialize } = useAuthStore();
  const { addCustomProduct } = useSearchStore();

  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Gıda / Market");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Marketplace prices
  const [trendyolPrice, setTrendyolPrice] = useState("");
  const [amazonPrice, setAmazonPrice] = useState("");
  const [hepsiburadaPrice, setHepsiburadaPrice] = useState("");
  const [n11Price, setN11Price] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  
  // Presentation mock scanning states
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  useEffect(() => {
    initialize();
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

  // Pricing estimator based on product name keywords
  const estimateBasePrice = (productName: string): number => {
    return estimateProductBasePrice(productName);
  };

  // Perform background scanning simulation and prefill
  const handleAutoFill = (productTitle: string) => {
    if (!productTitle.trim() || productTitle.length < 3) return;
    if (isScanning || scanSuccess) return;

    setIsScanning(true);
    setTimeout(() => {
      const base = estimateBasePrice(productTitle);
      
      // Generate market prices with random small variations
      const tp = Math.round(base * (0.97 + Math.random() * 0.05));
      const ap = Math.round(base * (0.95 + Math.random() * 0.05));
      const hp = Math.round(base * (1.00 + Math.random() * 0.05));
      const np = Math.round(base * (1.02 + Math.random() * 0.06));

      setTrendyolPrice(tp.toString());
      setAmazonPrice(ap.toString());
      setHepsiburadaPrice(hp.toString());
      setN11Price(np.toString());
      
      setIsScanning(false);
      setScanSuccess(true);
    }, 950);
  };

  // Reset scan if product name becomes too short
  useEffect(() => {
    if (title.length < 3) {
      setScanSuccess(false);
      setTrendyolPrice("");
      setAmazonPrice("");
      setHepsiburadaPrice("");
      setN11Price("");
    } else {
      // Auto-trigger scan when user stops typing (or brand changes)
      const delayDebounceFn = setTimeout(() => {
        handleAutoFill(title);
      }, 1200);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validations
    if (!title.trim()) {
      setFormError("Lütfen ürün adını girin.");
      return;
    }

    const tp = parseFloat(trendyolPrice);
    const ap = parseFloat(amazonPrice);
    const hp = parseFloat(hepsiburadaPrice);
    const np = parseFloat(n11Price);

    if (isNaN(tp) || tp <= 0 || isNaN(ap) || ap <= 0 || isNaN(hp) || hp <= 0 || isNaN(np) || np <= 0) {
      setFormError("Lütfen fiyatlar otomatik doldurulurken bekleyin veya fiyat değerlerini kontrol edin.");
      return;
    }

    // Call store action
    const prices = {
      Trendyol: tp,
      Amazon: ap,
      Hepsiburada: hp,
      N11: np,
    };

    const newProductId = addCustomProduct(
      title,
      brand || "Özel",
      category || "Kişisel Karşılaştırma",
      description || `${title} için otomatik taranan fiyat karşılaştırma bilgisi.`,
      imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60",
      prices
    );

    // Redirect to the newly created product details page
    router.push(`/products/${newProductId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-1 text-xs font-bold text-muted hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Panele Geri Dön</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl flex items-center space-x-2.5">
            <PlusCircle className="w-7 h-7 text-primary" />
            <span>Akıllı Karşılaştırma Ekle</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Ürün adını girdiğinizde, sistem arka planda popüler pazaryeri fiyatlarını otomatik olarak toplayacaktır.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Error Alert */}
            {formError && (
              <div className="p-4 bg-danger/10 border border-danger/25 text-danger rounded-xl flex items-start space-x-2.5 text-sm font-semibold">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Section 1: Product Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-foreground border-b border-border/60 pb-2">
                1. Ürün Bilgileri
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">
                    Ürün Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Örn: Güneş Kremi SPF 50, Süt 1L, Stanley Termos"
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">
                    Marka
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    onBlur={() => title.length >= 3 && handleAutoFill(title)}
                    className="block w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Örn: Sebamed, Nivea, Sütaş"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  >
                    <option value="Gıda / Market">Gıda / Market</option>
                    <option value="Kozmetik / Bakım">Kozmetik / Bakım</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Kişisel Karşılaştırma">Kişisel Karşılaştırma</option>
                    <option value="Ev / Yaşam">Ev / Yaşam</option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">
                    Açıklama (İsteğe Bağlı)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="block w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Ürünle ilgili notlarınızı yazabilirsiniz."
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Marketplace Prices (Automatically Filled) */}
            <div className="space-y-4 pt-2 relative">
              <div className="flex justify-between items-center border-b border-border/60 pb-2">
                <h3 className="font-bold text-sm text-foreground">
                  2. Otomatik Karşılaştırma Fiyatları
                </h3>

                {/* Scan status indicator */}
                {isScanning && (
                  <span className="flex items-center space-x-1.5 text-xs text-primary font-bold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Fiyatlar taranıyor...</span>
                  </span>
                )}
                {scanSuccess && !isScanning && (
                  <span className="flex items-center space-x-1.5 text-xs text-success font-bold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Fiyatlar çekildi!</span>
                  </span>
                )}
              </div>

              {/* Info Tips for Presenter */}
              {title.length < 3 && (
                <div className="p-3 bg-muted/20 border border-border rounded-lg flex items-center space-x-2 text-xs text-muted">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span>Ürün adını girdiğinizde fiyatlar arka planda otomatik taranacaktır.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Trendyol Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span>Trendyol Fiyatı</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted font-bold text-sm">
                      ₺
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={trendyolPrice}
                      onChange={(e) => setTrendyolPrice(e.target.value)}
                      onFocus={() => handleAutoFill(title)}
                      className={`block w-full pl-7 pr-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                        scanSuccess ? "border-success/30 bg-success/5" : ""
                      }`}
                      placeholder="Otomatik Doldurulacak"
                    />
                  </div>
                </div>

                {/* Amazon Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>Amazon Fiyatı</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted font-bold text-sm">
                      ₺
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={amazonPrice}
                      onChange={(e) => setAmazonPrice(e.target.value)}
                      onFocus={() => handleAutoFill(title)}
                      className={`block w-full pl-7 pr-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                        scanSuccess ? "border-success/30 bg-success/5" : ""
                      }`}
                      placeholder="Otomatik Doldurulacak"
                    />
                  </div>
                </div>

                {/* Hepsiburada Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Hepsiburada Fiyatı</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted font-bold text-sm">
                      ₺
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={hepsiburadaPrice}
                      onChange={(e) => setHepsiburadaPrice(e.target.value)}
                      onFocus={() => handleAutoFill(title)}
                      className={`block w-full pl-7 pr-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                        scanSuccess ? "border-success/30 bg-success/5" : ""
                      }`}
                      placeholder="Otomatik Doldurulacak"
                    />
                  </div>
                </div>

                {/* N11 Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>N11 Fiyatı</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted font-bold text-sm">
                      ₺
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={n11Price}
                      onChange={(e) => setN11Price(e.target.value)}
                      onFocus={() => handleAutoFill(title)}
                      className={`block w-full pl-7 pr-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                        scanSuccess ? "border-success/30 bg-success/5" : ""
                      }`}
                      placeholder="Otomatik Doldurulacak"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-border flex items-center justify-end space-x-3">
              <Link
                href="/dashboard"
                className="px-4 py-2.5 border border-border rounded-lg text-xs font-bold text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
              >
                İptal Et
              </Link>
              <button
                type="submit"
                disabled={isScanning || !scanSuccess}
                className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-lg shadow-md hover:shadow-lg hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Karşılaştırma Ekle</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
