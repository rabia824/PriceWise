/**
 * PriceWise - Product Image Helper
 * Generates a deterministic high-fidelity Unsplash CDN URL based on title keywords
 * to ensure 100% presentation safety.
 */

export function getProductImageUrls(title: string) {
  const cleanTitle = title.toLowerCase();

  // Default: Genel alışveriş görseli
  let targetUrl = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop";

  if (
    cleanTitle.includes("termos") || 
    cleanTitle.includes("stanley")
  ) {
    // Termos görseli
    targetUrl = "https://images.unsplash.com/photo-1619814406859-99a38f3876be?q=80&w=600&auto=format&fit=crop";
  } else if (
    cleanTitle.includes("krem") || 
    cleanTitle.includes("güneş") || 
    cleanTitle.includes("gunes")
  ) {
    // Krem/Güneş kremi görseli
    targetUrl = "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop";
  } else if (
    cleanTitle.includes("kulaklık") || 
    cleanTitle.includes("kulaklik") || 
    cleanTitle.includes("airpods")
  ) {
    // Kulaklık/Airpods görseli
    targetUrl = "https://images.unsplash.com/photo-1588444837495-c6cfcb53ba91?q=80&w=600&auto=format&fit=crop";
  }

  return {
    dynamicUrl: targetUrl,
    unsplashUrl: targetUrl,
    fallbackUrl: targetUrl,
  };
}
