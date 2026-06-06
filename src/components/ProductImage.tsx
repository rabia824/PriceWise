"use client";

import React, { useState, useEffect } from "react";
import { getProductImageUrls } from "@/lib/imageHelper";

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  title: string;
  className?: string;
}

export default function ProductImage({ title, className, ...props }: ProductImageProps) {
  const { dynamicUrl, unsplashUrl, fallbackUrl } = getProductImageUrls(title);
  const [src, setSrc] = useState<string>(dynamicUrl);
  const [attempt, setAttempt] = useState<number>(1); // 1 = dynamicUrl, 2 = unsplashUrl, 3 = fallbackUrl

  // Reset when title changes
  useEffect(() => {
    setSrc(dynamicUrl);
    setAttempt(1);
  }, [title, dynamicUrl]);

  const handleError = () => {
    if (attempt === 1) {
      // Try secondary dynamic source
      setSrc(unsplashUrl);
      setAttempt(2);
    } else if (attempt === 2) {
      // Fallback to static CDN photo
      setSrc(fallbackUrl);
      setAttempt(3);
    }
  };

  return (
    <img
      src={src}
      alt={title}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}
