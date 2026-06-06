"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSearchStore } from "@/store/useSearchStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import {
  Heart,
  LayoutDashboard,
  Search,
  User,
  Sun,
  Moon,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, initialize } = useAuthStore();
  const { favorites, initializeFavorites } = useFavoritesStore();
  const searchStore = useSearchStore();

  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Initialize stores
    initialize();
    searchStore.initializeStore();
    initializeFavorites();

    // Check system theme
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        setTheme("dark");
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        setTheme("light");
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "light");
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = [
    { name: "Karşılaştır", path: "/search", icon: Search },
    { name: "Panelim", path: "/dashboard", icon: LayoutDashboard, requiresAuth: true },
    { name: "Favoriler", path: "/favorites", icon: Heart, count: favorites?.length || 0, requiresAuth: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-navbar border-b transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
            PW
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            PriceWise
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            if (item.requiresAuth && !isAuthenticated) return null;
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted hover:text-foreground hover:bg-muted/15"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
                {item.count !== undefined && item.count > 0 ? (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-[10px] text-white font-bold leading-none scale-95">
                    {item.count}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-muted/15 transition-all duration-200 cursor-pointer"
            aria-label="Temayı Değiştir"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-2 border-l pl-3 border-border">
              {/* Profile Shortcut */}
              <Link
                href="/profile"
                className={`p-2 rounded-lg text-muted hover:text-foreground hover:bg-muted/15 transition-all duration-200 flex items-center space-x-1.5 ${
                  pathname === "/profile" ? "text-primary" : ""
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                  {user?.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">
                  {user?.fullName}
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-danger hover:bg-danger/10 transition-all duration-200 cursor-pointer"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 pl-2 border-l border-border">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-foreground hover:bg-muted/15 transition-all duration-200"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary hover:bg-primary/95 text-white shadow-md shadow-primary/10 hover:shadow-lg hover:-translate-y-[1px] transition-all duration-200"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
