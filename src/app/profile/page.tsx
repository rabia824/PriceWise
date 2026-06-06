"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSearchStore } from "@/store/useSearchStore";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  User,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
  Trash2,
  ShieldAlert,
} from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, error, updateProfile, clearError, initialize } = useAuthStore();
  const { clearHistory } = useSearchStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
    }
  }, [user]);

  // Protect route
  useEffect(() => {
    const checkAuth = setTimeout(() => {
      const savedSession = localStorage.getItem("pricewise_auth_session");
      if (!savedSession && !isAuthenticated) {
        window.location.href = "/login";
      }
    }, 100);
    return () => clearTimeout(checkAuth);
  }, [isAuthenticated]);

  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted">
        <span>Yükleniyor...</span>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    clearError();

    if (!fullName.trim() || !email.trim()) {
      setFormError("Ad Soyad ve E-posta alanları zorunludur.");
      return;
    }

    const success = await updateProfile(fullName, email);
    if (success) {
      setFormSuccess("Profil bilgileriniz başarıyla güncellendi.");
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Arama geçmişinizi silmek istediğinize emin misiniz?")) {
      clearHistory();
      alert("Arama geçmişiniz başarıyla temizlendi.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-grow max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl flex items-center space-x-2.5">
            <User className="w-7 h-7 text-primary" />
            <span>Hesap Ayarlarım</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Profil bilgilerinizi güncelleyebilir ve hesap geçmişinizi yönetebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: General Info Card */}
          <div className="md:col-span-4 bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-extrabold mx-auto border border-primary/20">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-foreground truncate">{user?.fullName}</h3>
              <p className="text-xs text-muted truncate">{user?.email}</p>
            </div>
            <div className="pt-3 border-t border-border/60 text-[10px] text-muted flex items-center justify-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Katılım:{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("tr-TR")
                  : "Bilinmiyor"}
              </span>
            </div>
          </div>

          {/* Right: Forms and Actions */}
          <div className="md:col-span-8 space-y-6">
            {/* Form Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-base text-foreground border-b border-border/60 pb-3">
                Kişisel Bilgiler
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Alert Messages */}
                {formError || error ? (
                  <div className="p-4 bg-danger/10 border border-danger/25 text-danger rounded-xl flex items-start space-x-2.5 text-sm font-semibold">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{formError || error}</span>
                  </div>
                ) : null}

                {formSuccess ? (
                  <div className="p-4 bg-success/10 border border-success/25 text-success rounded-xl flex items-start space-x-2.5 text-sm font-semibold">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                ) : null}

                {/* Full Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">
                    Ad Soyad
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted">
                    E-posta Adresi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-lg shadow-md hover:shadow-lg hover:-translate-y-[1px] disabled:opacity-75 disabled:cursor-not-allowed flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Değişiklikleri Kaydet</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Account Management Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-danger border-b border-border/60 pb-3 flex items-center space-x-1.5">
                <ShieldAlert className="w-5 h-5 text-danger" />
                <span>Hesap Yönetimi</span>
              </h3>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2">
                <div>
                  <h4 className="font-bold text-sm text-foreground">Arama Geçmişini Temizle</h4>
                  <p className="text-xs text-muted">
                    Tüm ürün karşılaştırma ve arama kayıtlarınızı kalıcı olarak sıfırlayın.
                  </p>
                </div>
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-2 border border-border hover:bg-danger/10 hover:border-danger/20 hover:text-danger rounded-lg text-xs font-bold text-muted flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Geçmişi Sil</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
