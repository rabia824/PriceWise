"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AlertCircle, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    clearError();
    // Redirect if already logged in
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password.trim()) {
      setFormError("Lütfen tüm alanları doldurun.");
      return;
    }

    const success = await login(email, password);
    if (success) {
      router.push("/dashboard");
    }
  };

  const handleDemoLogin = async () => {
    const success = await login("demo@pricewise.com", "demo123");
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-md w-full space-y-8 bg-card border border-border rounded-2xl p-8 shadow-xl relative z-10 glass-panel">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Tekrar Hoş Geldiniz
            </h2>
            <p className="text-sm text-muted">
              Hesabınıza giriş yapın veya{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                yeni hesap oluşturun
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {(error || formError) && (
              <div className="p-4 bg-danger/10 border border-danger/25 text-danger rounded-xl flex items-start space-x-2.5 text-sm font-semibold">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{formError || error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    placeholder="ornek@e-posta.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">
                    Şifre
                  </label>
                  <a href="#" className="text-xs font-semibold text-primary hover:underline">
                    Şifremi Unuttum
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-75 disabled:cursor-not-allowed shadow-md shadow-primary/10 transition-all duration-200 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center space-x-1.5">
                    <span>Giriş Yap</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Demo Login Button */}
          <div className="relative flex items-center justify-center mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <span className="relative px-3 bg-card text-xs text-muted font-semibold uppercase tracking-wider">
              veya hızlı deneme
            </span>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full mt-4 flex items-center justify-center py-2.5 px-4 bg-success/15 border border-success/20 hover:bg-success/20 text-success rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer"
          >
            Demo Hesap ile Giriş Yap
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
