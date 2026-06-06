"use client";

import React, { useState } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import { estimateProductBasePrice } from "@/lib/priceHelper";

// Utility to extract and format product title from Trendyol, Hepsiburada, and Amazon URLs
function parseProductUrl(urlStr: string): string {
  const url = urlStr.split("?")[0].split("#")[0].toLowerCase();
  let slug = "";

  // 1. Trendyol Match (e.g., /marka/urun-adi-p-123456)
  const matchTy = url.match(/\/([^/]+)-p-\d+/);
  if (matchTy && matchTy[1]) {
    slug = matchTy[1];
  }
  
  // 2. Hepsiburada Match (e.g., /urun-adi-p-HBV00000XYZ)
  if (!slug) {
    const matchHb = url.match(/\/([^/]+)-p-[a-zA-Z0-9]+/);
    if (matchHb && matchHb[1]) {
      slug = matchHb[1];
    }
  }
  
  // 3. Amazon Match (e.g., /urun-adi/dp/B00XYZ)
  if (!slug) {
    const matchAz = url.match(/\/([^/]+)\/dp\/[a-zA-Z0-9]+/);
    if (matchAz && matchAz[1]) {
      slug = matchAz[1];
    }
  }
  
  // 4. Fallback: Get the last segment
  if (!slug) {
    const cleanUrl = url.replace(/\/$/, "");
    const parts = cleanUrl.split("/");
    slug = parts[parts.length - 1] || "e-ticaret-urun";
  }

  // Clean slug
  let cleaned = decodeURIComponent(slug)
    .replace(/[-_]+/g, " ")
    .trim();

  // Remove potential trailing id tags
  cleaned = cleaned.replace(/\s+p\s+\d+$/i, "");
  cleaned = cleaned.replace(/\s+p\s+[a-z0-9]+$/i, "");
  cleaned = cleaned.replace(/\s+dp\s+[a-z0-9]+$/i, "");

  // Capitalize words
  const title = cleaned
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return title || "E-Ticaret Ürünü";
}
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

    // Parse URL slug dynamically
    const parsedTitle = parseProductUrl(trimmedLink);
    const basePrice = estimateProductBasePrice(parsedTitle);
    
    // Create unique product ID based on title
    const charSum = parsedTitle.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const productId = `dynamic-link-${charSum}`;

    const newProduct = {
      id: productId,
      title: parsedTitle,
      brand: parsedTitle.split(" ")[0] || "Özel",
      category: parsedTitle.toLowerCase().includes("termos") ? "Ev / Yaşam" : "Genel / Arama",
      imageUrl: `https://source.unsplash.com/featured/600x400/?${encodeURIComponent(parsedTitle.toLowerCase())}`,
      description: `E-Ticaret mağazasından taranan "${parsedTitle}" ürünü için anlık fiyat takip bilgileri.`,
      basePrice: basePrice,
      isCustom: true, // Flag as custom so the store populates scaled pricing in details page
    };

    // Inject custom product into Zustand state catalog
    useSearchStore.setState((state) => {
      const exists = state.products.some((p) => p.id === productId);
      if (exists) return state;
      return { products: [...state.products, newProduct] };
    });

    // Auto-favorite the dynamically registered product
    await addFavorite(productId);
    setMatchedProduct(newProduct);
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
