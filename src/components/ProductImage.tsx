"use client";

import React, { useState, useEffect } from "react";

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  title: string;
  className?: string;
}

export default function ProductImage({ title, className, ...props }: ProductImageProps) {
  const productName = (title || "").toLowerCase();

  // 1. High-fidelity specific fallback images for presentation safety
  let fallbackImage = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600"; // default genel alışveriş resmi

  if (productName.includes("sinoz") || productName.includes("gunes") || productName.includes("güneş") || productName.includes("krem")) {
    fallbackImage = "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600";
  } else if (productName.includes("termos") || productName.includes("stanley")) {
    fallbackImage = "https://images.unsplash.com/photo-1619814406859-99a38f3876be?q=80&w=600";
  } else if (productName.includes("krem") || productName.includes("güneş") || productName.includes("sunscreen")) {
    fallbackImage = "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600";
  } else if (productName.includes("airpods") || productName.includes("kulaklık")) {
    fallbackImage = "https://images.unsplash.com/photo-1588444837495-c6cfcb53ba91?q=80&w=600";
  } else if (productName.includes("iphone")) {
    fallbackImage = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600";
  } else if (productName.includes("mouse") || productName.includes("logitech")) {
    fallbackImage = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600";
  } else if (productName.includes("televizyon") || productName.includes("tv") || productName.includes("television")) {
    fallbackImage = "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600";
  } else if (productName.includes("koltuk") || productName.includes("sofa") || productName.includes("couch") || productName.includes("modern")) {
    fallbackImage = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600";
  }

  // 2. Primary: Dynamic Unsplash Source URL based on query keyword
  // Strip " (AI Karşılaştırma)" if it was appended by the generator to improve match results
  const searchKeyword = productName.replace(/\s*\(ai karşılaştırma\)/i, "").trim();
  const dynamicUrl = `https://source.unsplash.com/featured/600x400/?${encodeURIComponent(searchKeyword)}`;

  const [src, setSrc] = useState(dynamicUrl);

  // Sync state if title changes
  useEffect(() => {
    setSrc(dynamicUrl);
  }, [title, dynamicUrl]);

  // Fallback to our mapped Unsplash CDN photos if dynamic loader fails or times out
  const handleError = () => {
    if (src !== fallbackImage) {
      setSrc(fallbackImage);
    }
  };

  const { src: _, alt: __, ...restProps } = props;

  return (
    <img
      src={src}
      alt={title || "Product"}
      className={className}
      onError={handleError}
      {...restProps}
    />
  );
}
