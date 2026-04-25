export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 text-center">
        <p className="font-serif text-2xl text-slate-900 font-light">
          Köşker Kliniği
        </p>

        {/* Sosyal medya — sembolik linkler */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          {["Instagram", "Facebook", "YouTube"].map((platform) => (
            <a
              key={platform}
              href="#"
              aria-label={platform}
              className="hover:text-slate-600 transition-colors tracking-wide"
            >
              {platform}
            </a>
          ))}
        </div>

        <p className="text-sm text-slate-400">
          Köşker KBB ve Estetik Cerrahi Kliniği © 2026 · Nilüfer, Bursa
        </p>

        <p className="text-xs text-slate-300 max-w-sm">
          Bu sayfa demo amaçlıdır. Dr. Sıla Köşker kurgusal bir karakterdir.
          Tıbbi tavsiye yerine geçmez.
        </p>
      </div>
    </footer>
  );
}
