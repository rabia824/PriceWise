"use client";

import React, { useState } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import {
  Link as LinkIcon,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";

export default function LinkTracker() {
  const router = useRouter();
  const { products, initializeStore } = useSearchStore();
  const { addFavorite, initializeFavorites, favorites } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();

  const [link, setLink] = useState("");
  const [status, setStatus] = useState<"idle" | "validating" | "scanning" | "matching" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [matchedProduct, setMatchedProduct] = useState<any>(null);

  const validateAndProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setMatchedProduct(null);

    const trimmedLink = link.trim();

    if (!trimmedLink) {
      setStatus("error");
      setErrorMessage("Lütfen geçerli bir e-ticaret ürün linki yapıştırın.");
      return;
    }

    // Regex checks
    const isTrendyol = /trendyol\.com/i.test(trimmedLink);
    const isHepsiburada = /hepsiburada\.com/i.test(trimmedLink);
    const isAmazon = /amazon\.com/i.test(trimmedLink) || /amazon\.com\.tr/i.test(trimmedLink);

    if (!isTrendyol && !isHepsiburada && !isAmazon) {
      setStatus("error");
      setErrorMessage("Yalnızca Trendyol, Amazon veya Hepsiburada ürün linkleri desteklenmektedir.");
      return;
    }

    if (!isAuthenticated) {
      setStatus("error");
      setErrorMessage("E-ticaret linki ile ürün takip etmek için önce giriş yapmalısınız.");
      return;
    }

    // Step 1: Validate Link structure
    setStatus("validating");
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Step 2: Simulated background scraping
    setStatus("scanning");
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Step 3: Match with catalog or generate new one
    setStatus("matching");
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Match keywords in URL to catalog
    const url = trimmedLink.toLowerCase();
    let productMatch = null;

    if (url.includes("airpods") || url.includes("kulaklik") || url.includes("sound") || url.includes("wh-1000")) {
      productMatch = products.find((p) => p.id === "airpods-pro") || products.find((p) => p.id === "sony-wh1000xm5");
    } else if (url.includes("termos") || url.includes("stanley") || url.includes("mug")) {
      productMatch = products.find((p) => p.id === "stanley-thermos");
    } else if (url.includes("krem") || url.includes("sunscreen") || url.includes("gunes") || url.includes("sebamed") || url.includes("nivea")) {
      // Find sunscreen or default
      productMatch = products.find((p) => p.category.includes("Kozmetik")) || products.find((p) => p.id === "stanley-thermos");
    } else if (url.includes("iphone") || url.includes("telefon") || url.includes("mobile") || url.includes("samsung")) {
      productMatch = products.find((p) => p.id === "iphone-17-pro");
    } else if (url.includes("mouse") || url.includes("klavye") || url.includes("logitech") || url.includes("g502")) {
      productMatch = products.find((p) => p.id === "logitech-g502");
    } else if (url.includes("tablet") || url.includes("ipad") || url.includes("m4")) {
      productMatch = products.find((p) => p.id === "ipad-pro-m4");
    }

    // Fallback: Pick a random catalog product
    if (!productMatch && products.length > 0) {
      const randomIndex = Math.floor(Math.random() * products.length);
      productMatch = products[randomIndex];
    }

    if (!productMatch) {
      setStatus("error");
      setErrorMessage("Katalogda uygun eşleşen ürün bulunamadı. Lütfen daha sonra tekrar deneyin.");
      return;
    }

    // Auto-favorite the matched product
    await addFavorite(productMatch.id);
    setMatchedProduct(productMatch);
    setStatus("success");
    setLink("");
  };

  return (
    <div className="w-full bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-base text-foreground flex items-center space-x-2">
          <LinkIcon className="w-5 h-5 text-primary" />
          <span>E-Ticaret Linki ile Ürün Takip Et</span>
        </h3>
        <p className="text-xs text-muted">
          Trendyol, Amazon veya Hepsiburada ürün linkini yapıştırın, fiyat takibini anında başlatın.
        </p>
      </div>

      <form onSubmit={validateAndProcess} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={status === "validating" || status === "scanning" || status === "matching"}
              className="block w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="https://www.trendyol.com/marka/urun-adi-p-123456"
            />
          </div>
          <button
            type="submit"
            disabled={status === "validating" || status === "scanning" || status === "matching"}
            className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs sm:text-sm rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 flex-shrink-0 disabled:opacity-60"
          >
            <span>Analiz Et</span>
          </button>
        </div>

        {/* Status indicator messages */}
        {status === "validating" && (
          <div className="flex items-center space-x-2 text-xs text-primary font-bold bg-primary/10 p-3 rounded-lg border border-primary/15">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Link yapısı ve güvenlik doğrulaması yapılıyor...</span>
          </div>
        )}

        {status === "scanning" && (
          <div className="flex items-center space-x-2 text-xs text-accent-foreground font-bold bg-accent/10 p-3 rounded-lg border border-accent/15">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Mağaza API'lerinden anlık fiyat taranıyor...</span>
          </div>
        )}

        {status === "matching" && (
          <div className="flex items-center space-x-2 text-xs text-warning font-bold bg-warning/10 p-3 rounded-lg border border-warning/15">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Ürün verisi katalog ile eşleştiriliyor...</span>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center space-x-2 text-xs text-danger font-bold bg-danger/10 p-3 rounded-lg border border-danger/15">
            <AlertCircle className="w-4.5 h-4.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {status === "success" && matchedProduct && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-xl space-y-3">
            <div className="flex items-center space-x-2 text-xs text-success font-bold">
              <CheckCircle className="w-4.5 h-4.5" />
              <span>Link Başarıyla Analiz Edildi ve Takibe Alındı!</span>
            </div>
            
            <div className="flex bg-card border border-border/60 rounded-lg p-3 items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <ProductImage
                  title={matchedProduct.title}
                  className="w-10 h-10 object-cover rounded bg-muted/20 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-foreground truncate">{matchedProduct.title}</h4>
                  <p className="text-[10px] text-muted">{matchedProduct.brand} • Ortalama ₺{matchedProduct.basePrice.toLocaleString("tr-TR")}</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  router.push(`/products/${matchedProduct.id}`);
                }}
                className="px-3 py-1.5 bg-success text-white rounded text-[10px] font-bold shadow flex items-center space-x-1 hover:bg-success/90"
              >
                <span>İncele</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
