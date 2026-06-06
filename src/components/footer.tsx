import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card text-muted py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-xs">
        <p>© {new Date().getFullYear()} PriceWise. Tüm hakları saklıdır. Version 1.0.0</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-foreground transition-colors duration-200">
            Özellikler
          </a>
          <a href="#" className="hover:text-foreground transition-colors duration-200">
            Fiyatlandırma
          </a>
          <a href="#" className="hover:text-foreground transition-colors duration-200">
            Hakkımızda
          </a>
          <a href="#" className="hover:text-foreground transition-colors duration-200">
            İletişim
          </a>
        </div>
      </div>
    </footer>
  );
}
