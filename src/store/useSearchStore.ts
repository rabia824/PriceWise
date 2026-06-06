"use client";

import { create } from "zustand";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { useAuthStore } from "./useAuthStore";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  addDoc,
  query,
  orderBy,
  limit,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

export interface MarketplacePrice {
  marketplace: string;
  price: number;
  difference: string;
  isCheapest: boolean;
  link: string;
}

export interface HistoricalPrice {
  date: string;
  avgPrice: number;
  lowestPrice: number;
  highestPrice: number;
}

export interface ProductDetails {
  id: string;
  title: string;
  brand: string;
  category: string;
  imageUrl: string;
  description: string;
  avgPrice: number;
  lowestPrice: number;
  highestPrice: number;
  marketplaces: MarketplacePrice[];
  history: HistoricalPrice[];
  savingsMessage: string;
}

export interface SearchHistoryItem {
  id: string;
  productId: string;
  title: string;
  searchedAt: string;
}

interface SearchState {
  products: any[];
  searchQuery: string;
  searchResults: any[];
  activeProduct: ProductDetails | null;
  searchHistory: SearchHistoryItem[];
  totalSearches: number;
  totalSavings: number;
  setSearchQuery: (query: string) => void;
  searchProducts: (query: string) => void;
  getProductDetails: (id: string, userId?: string | null) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  addMockSearchCount: (savingsAmount: number) => void;
  addCustomProduct: (
    title: string,
    brand: string,
    category: string,
    description: string,
    imageUrl: string,
    prices: { Trendyol: number; Amazon: number; Hepsiburada: number; N11: number }
  ) => Promise<string>;
  initializeStore: () => void;
}

const MOCK_PRODUCTS = [
  {
    id: "iphone-17-pro",
    title: "iPhone 17 Pro 256 GB",
    brand: "Apple",
    category: "Elektronik / Telefon",
    imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600",
    description: "Apple'ın en yeni amiral gemisi iPhone 17 Pro, A19 Bionic çip, gelişmiş üçlü kamera sistemi ve devrim niteliğindeki 120Hz ProMotion ekranıyla üstün mobil performansı sunar.",
    basePrice: 72999,
  },
  {
    id: "airpods-pro",
    title: "AirPods Pro (2. Nesil) USB-C",
    brand: "Apple",
    category: "Elektronik / Kulaklık",
    imageUrl: "https://images.unsplash.com/photo-1588444837495-c6cfcb53ba91?q=80&w=600",
    description: "Aktif Gürültü Engelleme teknolojisi, Adaptif Şeffaf Mod ve Kişiselleştirilmiş Uzamsal Ses özellikleriyle donatılmış birinci sınıf kablosuz kulaklık.",
    basePrice: 8499,
  },
  {
    id: "logitech-g502",
    title: "Logitech G502 Lightspeed Kablosuz Oyuncu Mouse",
    brand: "Logitech",
    category: "Elektronik / Aksesuar",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600",
    description: "Hero 25K sensör, Lightspeed kablosuz bağlantı teknolojisi ve kişiselleştirilebilir ağırlıklarıyla profesyonel oyuncuların tercihi efsanevi mouse.",
    basePrice: 3899,
  },
  {
    id: "stanley-thermos",
    title: "Stanley Classic Trigger-Action Termos 0.47L",
    brand: "Stanley",
    category: "Ev / Yaşam / Outdoor",
    imageUrl: "https://images.unsplash.com/photo-1619814406859-99a38f3876be?q=80&w=600",
    description: "Çift duvar vakum yalıtımı sayesinde içecekleri saatlerce sıcak veya soğuk tutan, paslanmaz çelikten üretilmiş dayanıklı Stanley termosu.",
    basePrice: 1699,
  },
  {
    id: "sony-wh1000xm5",
    title: "Sony WH-1000XM5 Kablosuz Kulak Üstü Kulaklık",
    brand: "Sony",
    category: "Elektronik / Kulaklık",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
    description: "Eşsiz gürültü engelleme, 30 saat pil ömrü, akıllı sensörler ve yüksek çözünürlüğün ses kalitesi ile endüstri lideri kulaklık.",
    basePrice: 12499,
  },
  {
    id: "ipad-pro-m4",
    title: "iPad Pro M4 11 inç Wi-Fi 256 GB",
    brand: "Apple",
    category: "Elektronik / Tablet",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=60",
    description: "Ultra ince tasarım, çığır açan Tandem OLED Ultra Retina XDR ekran ve inanılmaz hızlı Apple M4 çip ile sınırları zorlayan tablet deneyimi.",
    basePrice: 42999,
  }
];

const HISTORY_KEY = "pricewise_search_history";
const TOTALS_KEY = "pricewise_search_totals";
const CUSTOM_PRODUCTS_KEY = "pricewise_custom_products";

export const useSearchStore = create<SearchState>((set, get) => ({
  products: MOCK_PRODUCTS,
  searchQuery: "",
  searchResults: MOCK_PRODUCTS,
  activeProduct: null,
  searchHistory: [],
  totalSearches: 0,
  totalSavings: 0,

  initializeStore: async () => {
    if (typeof window === "undefined") return;

    // Load cached figures for responsive first load
    try {
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) set({ searchHistory: JSON.parse(savedHistory) });
      const savedTotals = localStorage.getItem(TOTALS_KEY);
      if (savedTotals) {
        const { totalSearches, totalSavings } = JSON.parse(savedTotals);
        set({ totalSearches, totalSavings });
      } else {
        const defaultTotals = { totalSearches: 24, totalSavings: 1850 };
        localStorage.setItem(TOTALS_KEY, JSON.stringify(defaultTotals));
        set(defaultTotals);
      }
    } catch (e) {}

    if (isFirebaseConfigured() && db) {
      try {
        const productsCol = collection(db, "products");
        const snapshot = await getDocs(productsCol);
        let fbProducts = snapshot.docs.map((docVal) => ({ id: docVal.id, ...docVal.data() }));

        // Seed products collection if empty
        if (fbProducts.length === 0) {
          console.log("PriceWise: Firestore product collection is empty. Seeding base catalog...");
          for (const p of MOCK_PRODUCTS) {
            await setDoc(doc(db, "products", p.id), p);
          }
          fbProducts = [...MOCK_PRODUCTS];
        }

        set({
          products: fbProducts,
          searchResults: fbProducts,
        });

        // Load Firestore history if user is logged in
        const user = useAuthStore.getState().user;
        if (user) {
          const historyCol = collection(db, "users", user.id, "search_history");
          const historySnapshot = await getDocs(historyCol);
          const fbHistory: SearchHistoryItem[] = historySnapshot.docs.map((docVal) => {
            const data = docVal.data();
            return {
              id: docVal.id,
              productId: data.productId,
              title: data.title,
              searchedAt: data.searchedAt,
            };
          });
          
          fbHistory.sort((a, b) => new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime());
          set({ searchHistory: fbHistory.slice(0, 10) });
        }
      } catch (err) {
        console.error("PriceWise: Failed to sync database with Firestore:", err);
      }
    } else {
      // Local fallback
      try {
        const customProductsRaw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
        const customProducts = customProductsRaw ? JSON.parse(customProductsRaw) : [];
        const combinedProducts = [...MOCK_PRODUCTS, ...customProducts];
        set({
          products: combinedProducts,
          searchResults: combinedProducts,
        });
      } catch (err) {
        console.error("PriceWise: Failed to load local custom products:", err);
      }
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  searchProducts: (queryVal) => {
    const allProducts = get().products;
    if (!queryVal.trim()) {
      // Filter out dynamic generated products on reset/empty query
      const originalProducts = allProducts.filter((p) => !p.id.startsWith("dynamic-"));
      set({ searchResults: originalProducts });
      return;
    }

    const filtered = allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(queryVal.toLowerCase()) ||
        p.brand.toLowerCase().includes(queryVal.toLowerCase()) ||
        p.category.toLowerCase().includes(queryVal.toLowerCase())
    );

    // If search is empty, generate dynamic product on the fly
    if (filtered.length === 0 && queryVal.trim().length >= 2) {
      const queryTitle = queryVal.trim().charAt(0).toUpperCase() + queryVal.trim().slice(1);
      const charSum = queryVal.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const generatedPrice = 500 + (charSum % 3501); // 500 to 4000 TL

      const dynamicProduct = {
        id: `dynamic-${charSum}`,
        title: "Modern Kumaş Koltuk",
        brand: "PriceWise AI",
        category: "Genel / Arama",
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600",
        description: "Yüksek konforlu, leke tutmaz özel kumaş kaplama modern tasarım salon koltuğu.",
        basePrice: generatedPrice,
      };

      // Append to store products catalog so it exists for detailed page routing
      set({
        products: [...allProducts, dynamicProduct],
        searchResults: [dynamicProduct],
      });
      return;
    }

    set({ searchResults: filtered });
  },

  getProductDetails: async (id, userId) => {
    let product = get().products.find((p) => p.id === id);

    // Catch / fallback for dynamic search cards
    if (!product && id.includes("dynamic")) {
      product = {
        id,
        title: "Modern Kumaş Koltuk",
        brand: "PriceWise AI",
        category: "Genel / Arama",
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600",
        description: "Yüksek konforlu, leke tutmaz özel kumaş kaplama modern tasarım salon koltuğu.",
        basePrice: 1240,
      };
    }

    if (!product) {
      set({ activeProduct: null });
      return;
    }

    let formattedMarketplaces: MarketplacePrice[] = [];
    let avgPrice = 0;
    let lowestPrice = 0;
    let highestPrice = 0;
    let savings = 0;

    if (product.id.includes("dynamic")) {
      formattedMarketplaces = [
        { marketplace: "Amazon", price: 1190, difference: "En Ucuz", isCheapest: true, link: "https://www.amazon.com.tr" },
        { marketplace: "Trendyol", price: 1250, difference: "+₺60", isCheapest: false, link: "https://www.trendyol.com" },
        { marketplace: "Hepsiburada", price: 1280, difference: "+₺90", isCheapest: false, link: "https://www.hepsiburada.com" },
        { marketplace: "N11", price: 1320, difference: "+₺130", isCheapest: false, link: "https://www.n11.com" },
      ];
      lowestPrice = 1190;
      highestPrice = 1320;
      avgPrice = 1260;
      savings = 130;
    } else if (product.marketplaces && product.isCustom) {
      const marketplaces = [...product.marketplaces];
      marketplaces.sort((a, b) => a.price - b.price);
      
      lowestPrice = marketplaces[0].price;
      highestPrice = marketplaces[marketplaces.length - 1].price;
      savings = highestPrice - lowestPrice;

      formattedMarketplaces = marketplaces.map((item, idx) => {
        if (idx === 0) {
          return { ...item, isCheapest: true, difference: "En Ucuz" };
        } else {
          const diffVal = item.price - lowestPrice;
          return { ...item, isCheapest: false, difference: `+₺${diffVal.toLocaleString("tr-TR")}` };
        }
      });

      avgPrice = Math.round(formattedMarketplaces.reduce((acc, curr) => acc + curr.price, 0) / formattedMarketplaces.length);
    } else {
      const marketplaces = [
        { name: "Trendyol", factor: 0.98, suffix: "/trendyol" },
        { name: "Amazon", factor: 1.0, suffix: "/amazon" },
        { name: "Hepsiburada", factor: 1.03, suffix: "/hepsiburada" },
        { name: "N11", factor: 1.06, suffix: "/n11" },
      ];

      const randomizedPrices = marketplaces.map((m, idx) => {
        const charOffset = (product.title.charCodeAt(idx % product.title.length) % 10) / 100 - 0.05;
        const price = Math.round(product.basePrice * (m.factor + charOffset));
        return {
          marketplace: m.name,
          price,
          difference: "",
          isCheapest: false,
          link: `https://www.${m.name.toLowerCase()}.com.tr` + m.suffix,
        };
      });

      randomizedPrices.sort((a, b) => a.price - b.price);
      lowestPrice = randomizedPrices[0].price;
      highestPrice = randomizedPrices[randomizedPrices.length - 1].price;
      savings = highestPrice - lowestPrice;

      formattedMarketplaces = randomizedPrices.map((item, idx) => {
        if (idx === 0) {
          return { ...item, isCheapest: true, difference: "En Ucuz" };
        } else {
          const diffVal = item.price - lowestPrice;
          return { ...item, isCheapest: false, difference: `+₺${diffVal.toLocaleString("tr-TR")}` };
        }
      });

      avgPrice = Math.round(formattedMarketplaces.reduce((acc, curr) => acc + curr.price, 0) / formattedMarketplaces.length);
    }

    const history: HistoricalPrice[] = [];
    const now = new Date();
    for (let i = 30; i >= 0; i -= 2) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const formattedDate = date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
      
      const wave = Math.sin(i / 5) * 0.04;
      const trendFactor = (i / 30) * 0.06;
      const avg = Math.round(avgPrice * (1 + wave + trendFactor));
      const lowest = Math.round(lowestPrice * (1 + wave + trendFactor - 0.02));
      const highest = Math.round(highestPrice * (1 + wave + trendFactor + 0.02));

      history.push({
        date: formattedDate,
        avgPrice: avg,
        lowestPrice: lowest,
        highestPrice: highest,
      });
    }

    const savingsMessage = `${formattedMarketplaces[0].marketplace} mağazasından satın almak, en pahalı satıcıya kıyasla ₺${savings.toLocaleString("tr-TR")} tasarruf etmenizi sağlar.`;

    const details: ProductDetails = {
      id: product.id,
      title: product.title,
      brand: product.brand,
      category: product.category,
      imageUrl: product.imageUrl,
      description: product.description,
      avgPrice,
      lowestPrice,
      highestPrice,
      marketplaces: formattedMarketplaces,
      history,
      savingsMessage,
    };

    set({ activeProduct: details });

    // Track search history in cloud or local
    const currentUser = useAuthStore.getState().user;
    
    if (isFirebaseConfigured() && db && currentUser) {
      try {
        const historyItem = {
          productId: product.id,
          title: product.title,
          searchedAt: new Date().toISOString(),
        };

        // Add history doc to Firestore
        await addDoc(collection(db, "users", currentUser.id, "search_history"), historyItem);

        // Update local count
        const newTotalSearches = get().totalSearches + 1;
        const newTotalSavings = get().totalSavings + savings;
        set({ totalSearches: newTotalSearches, totalSavings: newTotalSavings });
        localStorage.setItem(TOTALS_KEY, JSON.stringify({ totalSearches: newTotalSearches, totalSavings: newTotalSavings }));

        // Refresh history list
        const historyCol = collection(db, "users", currentUser.id, "search_history");
        const historySnapshot = await getDocs(historyCol);
        const fbHistory: SearchHistoryItem[] = historySnapshot.docs.map((docVal) => {
          const data = docVal.data();
          return {
            id: docVal.id,
            productId: data.productId,
            title: data.title,
            searchedAt: data.searchedAt,
          };
        });
        fbHistory.sort((a, b) => new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime());
        set({ searchHistory: fbHistory.slice(0, 10) });
      } catch (err) {
        console.error("PriceWise: Failed to write search history to Firestore:", err);
      }
    } else {
      // Local fallback
      if (typeof window !== "undefined") {
        const historyItem: SearchHistoryItem = {
          id: Math.random().toString(36).substring(2, 11),
          productId: product.id,
          title: product.title,
          searchedAt: new Date().toISOString(),
        };

        const updatedHistory = [historyItem, ...get().searchHistory.filter((h) => h.productId !== product.id)].slice(0, 10);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

        const newTotalSearches = get().totalSearches + 1;
        const newTotalSavings = get().totalSavings + savings;
        const totalsObj = { totalSearches: newTotalSearches, totalSavings: newTotalSavings };
        localStorage.setItem(TOTALS_KEY, JSON.stringify(totalsObj));

        set({
          searchHistory: updatedHistory,
          totalSearches: newTotalSearches,
          totalSavings: newTotalSavings,
        });
      }
    }
  },

  deleteHistoryItem: async (id) => {
    const currentUser = useAuthStore.getState().user;
    if (isFirebaseConfigured() && db && currentUser) {
      try {
        await deleteDoc(doc(db, "users", currentUser.id, "search_history", id));
        const updated = get().searchHistory.filter((item) => item.id !== id);
        set({ searchHistory: updated });
      } catch (err) {
        console.error("Failed to delete history item from Firestore:", err);
      }
    } else {
      const updated = get().searchHistory.filter((item) => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      set({ searchHistory: updated });
    }
  },

  clearHistory: async () => {
    const currentUser = useAuthStore.getState().user;
    if (isFirebaseConfigured() && db && currentUser) {
      try {
        const historyCol = collection(db, "users", currentUser.id, "search_history");
        const snapshot = await getDocs(historyCol);
        for (const docVal of snapshot.docs) {
          await deleteDoc(doc(db, "users", currentUser.id, "search_history", docVal.id));
        }
        set({ searchHistory: [] });
      } catch (err) {
        console.error("Failed to clear history from Firestore:", err);
      }
    } else {
      localStorage.removeItem(HISTORY_KEY);
      set({ searchHistory: [] });
    }
  },

  addMockSearchCount: (savingsAmount) => {
    const newTotalSearches = get().totalSearches + 1;
    const newTotalSavings = get().totalSavings + savingsAmount;
    const totalsObj = { totalSearches: newTotalSearches, totalSavings: newTotalSavings };
    localStorage.setItem(TOTALS_KEY, JSON.stringify(totalsObj));
    set({ totalSearches: newTotalSearches, totalSavings: newTotalSavings });
  },

  addCustomProduct: async (title, brand, category, description, imageUrl, prices) => {
    const id = "custom-" + Math.random().toString(36).substring(2, 11);
    
    const marketplaces = Object.entries(prices).map(([marketplace, price]) => ({
      marketplace,
      price: Number(price),
      difference: "",
      isCheapest: false,
      link: `https://www.${marketplace.toLowerCase()}.com.tr`,
    }));

    const newProduct = {
      id,
      title,
      brand: brand || "Özel",
      category: category || "Kişisel Karşılaştırma",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60",
      description: description || `${title} için otomatik taranan fiyat karşılaştırma bilgisi.`,
      basePrice: Math.round(Object.values(prices).reduce((acc: number, curr: any) => acc + Number(curr), 0) / Object.values(prices).length),
      marketplaces,
      isCustom: true,
    };

    if (isFirebaseConfigured() && db) {
      try {
        // Add doc to global products collection
        await setDoc(doc(db, "products", id), newProduct);
        
        // Refresh products list
        const productsCol = collection(db, "products");
        const snapshot = await getDocs(productsCol);
        const fbProducts = snapshot.docs.map((docVal) => ({ id: docVal.id, ...docVal.data() }));
        
        set({
          products: fbProducts,
          searchResults: fbProducts,
        });
      } catch (err) {
        console.error("PriceWise: Failed to write custom product to Firestore:", err);
      }
    } else {
      // Local fallback
      const customProductsRaw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
      const customProducts = customProductsRaw ? JSON.parse(customProductsRaw) : [];
      customProducts.push(newProduct);
      localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(customProducts));

      const combinedProducts = [...MOCK_PRODUCTS, ...customProducts];
      set({
        products: combinedProducts,
        searchResults: combinedProducts,
      });
    }

    return id;
  },
}));
