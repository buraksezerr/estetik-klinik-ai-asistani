"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#", label: "Ana Sayfa" },
  { href: "#felsefem", label: "Hakkında" },
  { href: "#hizmetler", label: "Hizmetler" },
  { href: "#sss", label: "SSS" },
  { href: "#iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function openChat() {
    const btn = document.querySelector<HTMLButtonElement>(
      '[aria-label="Chat\'i aç"]'
    );
    btn?.click();
    setIsMenuOpen(false);
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="font-serif text-xl font-medium text-slate-900 tracking-tight"
        >
          Köşker Kliniği
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Ana menü">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA + Mobile hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={openChat}
            className="hidden md:inline-flex items-center gap-2 bg-rose-400 hover:bg-rose-500 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
          >
            Randevu Al
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-700"
            aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-5 flex flex-col gap-4 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-sm text-slate-700 py-1 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={openChat}
            className="mt-2 bg-rose-400 hover:bg-rose-500 text-white text-sm font-medium px-4 py-3 rounded-full w-full transition-colors"
          >
            Randevu Al
          </button>
        </div>
      )}
    </header>
  );
}
