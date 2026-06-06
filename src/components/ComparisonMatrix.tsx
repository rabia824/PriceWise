import React from "react";
import { MarketplacePrice } from "@/store/useSearchStore";
import { ExternalLink, ShoppingCart } from "lucide-react";

interface ComparisonMatrixProps {
  marketplaces: MarketplacePrice[];
}

export default function ComparisonMatrix({ marketplaces }: ComparisonMatrixProps) {
  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-bold text-lg text-foreground">Fiyat Karşılaştırma Matrisi</h3>
        <p className="text-xs text-muted">Aynı ürünün farklı online pazaryerlerindeki anlık satış fiyatları</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-muted/10 text-muted font-semibold border-b border-border">
              <th className="p-4 pl-6">Pazaryeri</th>
              <th className="p-4">Fiyat</th>
              <th className="p-4">Fark</th>
              <th className="p-4 pr-6 text-right">Mağazaya Git</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {marketplaces.map((m, idx) => (
              <tr
                key={m.marketplace}
                className={`group hover:bg-muted/10 transition-colors duration-150 ${
                  m.isCheapest ? "bg-success/5 dark:bg-success/10" : ""
                }`}
              >
                {/* Marketplace Name */}
                <td className="p-4 pl-6 font-bold text-foreground flex items-center space-x-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                    m.marketplace === "Trendyol" ? "bg-orange-500/10 text-orange-500" :
                    m.marketplace === "Amazon" ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500" :
                    m.marketplace === "Hepsiburada" ? "bg-red-500/10 text-red-500" :
                    "bg-blue-500/10 text-blue-500"
                  }`}>
                    {m.marketplace.charAt(0)}
                  </div>
                  <span>{m.marketplace}</span>
                </td>

                {/* Price */}
                <td className={`p-4 font-bold ${
                  m.isCheapest ? "text-success text-base" : "text-foreground"
                }`}>
                  ₺{m.price.toLocaleString("tr-TR")}
                </td>

                {/* Difference Badge */}
                <td className="p-4">
                  {m.isCheapest ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success">
                      En Ucuz
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted/10 text-muted">
                      {m.difference}
                    </span>
                  )}
                </td>

                {/* Store Action Button */}
                <td className="p-4 pr-6 text-right">
                  <a
                    href={m.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                      m.isCheapest
                        ? "bg-success text-white shadow-md shadow-success/10 hover:shadow-lg hover:-translate-y-[1px]"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-border"
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Satın Al</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
