/**
 * PriceWise - Product Image Helper
 * Generates dynamic Unsplash/LoremFlickr URLs based on keywords, 
 * with robust smart fallback options.
 */

export function getProductImageUrls(title: string) {
  const cleanTitle = title.toLowerCase();

  // 1. Primary Dynamic URL (Using LoremFlickr which serves search query keywords from Unsplash and CC sources)
  // Split title to extract the main keywords (e.g. "iPhone 17 Pro" -> "iphone")
  const words = title.trim().split(/\s+/);
  const keyword = encodeURIComponent(words[0] || "product");
  const dynamicUrl = `https://loremflickr.com/600/400/${keyword}`;

  // 2. Secondary Dynamic Unsplash Query URL
  const unsplashUrl = `https://source.unsplash.com/featured/600x400/?${keyword}`;

  // 3. Smart Fallback URLs (Real high-fidelity direct Unsplash photos hosted on CDN)
  let fallbackUrl = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=60"; // shopping / box fallback

  if (
    cleanTitle.includes("termos") || 
    cleanTitle.includes("stanley") || 
    cleanTitle.includes("mug") || 
    cleanTitle.includes("flask")
  ) {
    fallbackUrl = "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=60"; // termos
  } else if (
    cleanTitle.includes("krem") || 
    cleanTitle.includes("sunscreen") || 
    cleanTitle.includes("gunes") || 
    cleanTitle.includes("sebamed") || 
    cleanTitle.includes("kozmetik") || 
    cleanTitle.includes("cream")
  ) {
    fallbackUrl = "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=60"; // krem
  } else if (
    cleanTitle.includes("iphone") || 
    cleanTitle.includes("telefon") || 
    cleanTitle.includes("mobile") || 
    cleanTitle.includes("samsung") || 
    cleanTitle.includes("phone")
  ) {
    fallbackUrl = "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&auto=format&fit=crop&q=60"; // telefon
  } else if (
    cleanTitle.includes("kulaklik") || 
    cleanTitle.includes("airpods") || 
    cleanTitle.includes("sound") || 
    cleanTitle.includes("sony") || 
    cleanTitle.includes("headphones")
  ) {
    fallbackUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60"; // kulaklık
  } else if (
    cleanTitle.includes("mouse") || 
    cleanTitle.includes("klavye") || 
    cleanTitle.includes("logitech") || 
    cleanTitle.includes("gaming")
  ) {
    fallbackUrl = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60"; // mouse
  } else if (
    cleanTitle.includes("tablet") || 
    cleanTitle.includes("ipad") || 
    cleanTitle.includes("screen")
  ) {
    fallbackUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=60"; // tablet
  }

  return {
    dynamicUrl,
    unsplashUrl,
    fallbackUrl,
  };
}
