"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { HistoricalPrice } from "@/store/useSearchStore";

interface PriceTrendChartProps {
  data: HistoricalPrice[];
}

export default function PriceTrendChart({ data }: PriceTrendChartProps) {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("monthly");

  // Filter data based on timeframe
  const getFilteredData = () => {
    switch (timeframe) {
      case "daily":
        // Show last 5 points
        return data.slice(-5);
      case "weekly":
        // Show last 9 points
        return data.slice(-9);
      case "monthly":
      default:
        // Show all 16 points (representing 30 days)
        return data;
    }
  };

  const filteredData = getFilteredData();

  const formatPrice = (value: number) => {
    return `₺${value.toLocaleString("tr-TR")}`;
  };

  return (
    <div className="w-full bg-card border border-border rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-lg text-foreground">Fiyat Analiz Grafiği</h3>
          <p className="text-xs text-muted">Seçilen döneme ait piyasa ortalaması ve en ucuz fiyat eğilimleri</p>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex bg-muted/20 p-1 rounded-lg border border-border/50">
          {(["daily", "weekly", "monthly"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                timeframe === t
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {t === "daily" ? "Günlük" : t === "weekly" ? "Haftalık" : "Aylık"}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLowest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--success)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.1)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatPrice}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
              width={65}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card border border-border p-3.5 rounded-lg shadow-xl glass-panel text-xs space-y-1.5 min-w-[150px]">
                      <p className="font-bold text-foreground mb-1">
                        {payload[0].payload.date}
                      </p>
                      {payload.map((entry: any, index) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                          <span className="flex items-center space-x-1.5 text-muted">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span>{entry.name}</span>
                          </span>
                          <span className="font-bold text-foreground">
                            {formatPrice(entry.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              name="Ortalama Fiyat"
              type="monotone"
              dataKey="avgPrice"
              stroke="var(--primary)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorAvg)"
            />
            <Area
              name="En Ucuz Fiyat"
              type="monotone"
              dataKey="lowestPrice"
              stroke="var(--success)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLowest)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
        <span className="flex items-center space-x-2">
          <span className="w-3 h-0.5 bg-primary inline-block rounded-full border border-primary" />
          <span className="text-muted">Piyasa Ortalama Fiyatı</span>
        </span>
        <span className="flex items-center space-x-2">
          <span className="w-3 h-0.5 bg-success inline-block rounded-full border border-success" />
          <span className="text-muted">En Düşük Piyasa Fiyatı</span>
        </span>
      </div>
    </div>
  );
}
