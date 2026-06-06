import React from "react";
import { Sparkles, ArrowUpRight, TrendingDown } from "lucide-react";

interface SavingRecommendationProps {
  savingsMessage: string;
  lowestPrice: number;
  avgPrice: number;
}

export default function SavingRecommendation({
  savingsMessage,
  lowestPrice,
  avgPrice,
}: SavingRecommendationProps) {
  const diffPercent = Math.round(((avgPrice - lowestPrice) / avgPrice) * 100);

  return (
    <div className="w-full bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-primary/20 rounded-xl p-5 shadow-sm relative overflow-hidden">
      {/* Background soft light */}
      <div className="absolute -right-12 -bottom-12 w-36 h-36 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
      
      <div className="flex items-start space-x-4">
        {/* Animated Badge Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 dark:bg-primary/30 flex items-center justify-center text-primary">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        {/* Content */}
        <div className="flex-grow space-y-1.5">
          <h4 className="font-extrabold text-sm tracking-wide text-primary uppercase">
            Akıllı Öneri ve İpucu
          </h4>
          <p className="text-sm font-semibold text-foreground/90 leading-relaxed">
            {savingsMessage}
          </p>

          <div className="flex flex-wrap gap-4 mt-3 pt-2 border-t border-primary/10 text-xs">
            <span className="flex items-center text-success font-bold space-x-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Piyasa ortalamasından %{diffPercent} daha ucuz!</span>
            </span>
            <span className="flex items-center text-muted font-medium space-x-1">
              <span>Ortalama Fiyat:</span>
              <span className="text-foreground font-semibold">₺{avgPrice.toLocaleString("tr-TR")}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
