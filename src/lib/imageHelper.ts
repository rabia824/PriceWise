/**
 * PriceWise - Product Image Helper
 * Generates a deterministic high-fidelity Unsplash CDN URL based on title keywords
 * to ensure 100% presentation safety.
 */

export function getProductImageUrls(title: string) {
  const productName = (title || "").toLowerCase();
  let displayImage = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600"; // default genel alışveriş resmi

  if (productName.includes("termos") || productName.includes("stanley")) {
    displayImage = "https://images.unsplash.com/photo-1619814406859-99a38f3876be?q=80&w=600";
  } else if (productName.includes("krem") || productName.includes("güneş") || productName.includes("sunscreen")) {
    displayImage = "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600";
  } else if (productName.includes("airpods") || productName.includes("kulaklık")) {
    displayImage = "https://images.unsplash.com/photo-1588444837495-c6cfcb53ba91?q=80&w=600";
  } else if (productName.includes("iphone")) {
    displayImage = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600";
  } else if (productName.includes("mouse") || productName.includes("logitech")) {
    displayImage = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600";
  } else if (productName.includes("koltuk") || productName.includes("sofa") || productName.includes("modern")) {
    displayImage = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600";
  }

  return {
    dynamicUrl: displayImage,
    unsplashUrl: displayImage,
    fallbackUrl: displayImage,
  };
}
