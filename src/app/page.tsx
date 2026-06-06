"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  Sparkles,
  TrendingUp,
  Heart,
  LayoutDashboard,
  Search,
  CheckCircle,
  ArrowRight,
  TrendingDown,
  ShoppingBag,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Global Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Soft background light blooms */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-accent/5 dark:bg-accent/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Akıllı Alışveriş Asistanınız Hizmetinizde</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] sm:leading-[1.15]">
                Fiyatları Daha{" "}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
                  Akıllıca
                </span>{" "}
                Karşılaştırın
              </h1>

              <p className="text-base sm:text-lg text-muted max-w-xl mx-auto lg:mx-0">
                Farklı online pazaryerlerindeki en iyi fırsatları saniyeler içinde bulun.
                Fiyat geçmişini takip edin, tasarruf edin ve bütçenizi koruyun.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/search"
                  className="px-6 py-3.5 rounded-xl text-base font-bold bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-[2px] active:translate-y-0 flex items-center space-x-2 transition-all duration-200"
                >
                  <span>Hemen Karşılaştır</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#features"
                  className="px-6 py-3.5 rounded-xl text-base font-bold bg-card border border-border text-foreground hover:bg-muted/10 hover:-translate-y-[2px] transition-all duration-200"
                >
                  Daha Fazla Bilgi
                </Link>
              </div>
            </div>

            {/* Hero Interactive UI Card Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="glass-panel border border-border/80 rounded-2xl p-6 shadow-2xl relative">
                {/* Simulated product details inside card */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs text-primary font-bold uppercase tracking-wider">
                      Popüler Karşılaştırma
                    </span>
                    <h3 className="text-xl font-bold text-foreground mt-0.5">
                      AirPods Pro (2. Nesil)
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                </div>

                {/* Marketplace Comparison Rows */}
                <div className="space-y-3">
                  {[
                    { store: "Trendyol", price: "₺8.299", badge: "En Ucuz", color: "bg-orange-500", text: "text-orange-500", active: true },
                    { store: "Amazon Türkiye", price: "₺8.499", badge: "+₺200", color: "bg-yellow-500", text: "text-yellow-600 dark:text-yellow-500" },
                    { store: "Hepsiburada", price: "₺8.649", badge: "+₺350", color: "bg-red-500", text: "text-red-500" },
                    { store: "N11", price: "₺8.899", badge: "+₺600", color: "bg-blue-500", text: "text-blue-500" },
                  ].map((m) => (
                    <div
                      key={m.store}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                        m.active
                          ? "bg-success/5 border-success/30 shadow-sm"
                          : "bg-background/40 border-border"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${m.color}`} />
                        <span className="font-bold text-sm text-foreground">{m.store}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold text-sm text-foreground">{m.price}</span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            m.active
                              ? "bg-success/15 text-success"
                              : "bg-muted/10 text-muted"
                          }`}
                        >
                          {m.badge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Saving recommendation preview */}
                <div className="mt-5 p-4 rounded-xl bg-primary/10 border border-primary/15 text-xs text-primary font-bold flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse" />
                  <span>Trendyol'dan satın alarak ₺600 tasarruf edebilirsiniz!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/10 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Neden PriceWise?
            </h2>
            <p className="text-muted text-base sm:text-lg">
              PriceWise, alışveriş bütçenizi kontrol etmeniz ve bilinçli kararlar almanız için gelişmiş araçlar sunar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border border-border rounded-xl p-6 premium-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Akıllı Karşılaştırma</h3>
              <p className="text-sm text-muted">
                Trendyol, Amazon, Hepsiburada ve N11 fiyatlarını anında tek ekranda karşılaştırın.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border border-border rounded-xl p-6 premium-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent-foreground flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Geçmiş Takibi</h3>
              <p className="text-sm text-muted">
                Ürünlerin günlük, haftalık ve aylık fiyat hareketlerini izleyerek doğru zamanda satın alın.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border border-border rounded-xl p-6 premium-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Favoriler Sistemi</h3>
              <p className="text-sm text-muted">
                İlgilendiğiniz ürünleri listenize ekleyin, fiyat değişimlerini ve indirimleri anlık takip edin.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card border border-border rounded-xl p-6 premium-card space-y-4">
              <div className="w-12 h-12 rounded-xl bg-success/15 text-success flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Kişisel Dashboard</h3>
              <p className="text-sm text-muted">
                Yaptığınız aramaları, tahmini tasarruf tutarınızı ve son aktivitelerinizi tek panelden yönetin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8 relative">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Tasarruf Etmeye Bugün Başlayın
          </h2>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
            Ücretsiz üye olun, aramalarınızı kişiselleştirin ve akıllı alışveriş dünyasına hemen adım atın.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="px-6 py-3.5 rounded-xl text-base font-bold bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-[2px] transition-all duration-200"
            >
              Hemen Kayıt Ol
            </Link>
            <Link
              href="/search"
              className="px-6 py-3.5 rounded-xl text-base font-bold bg-card border border-border text-foreground hover:bg-muted/10 hover:-translate-y-[2px] transition-all duration-200"
            >
              Ürünleri İncele
            </Link>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
