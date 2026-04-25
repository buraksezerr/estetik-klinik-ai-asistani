import HeroButtons from "./HeroButtons";

export default function Hero() {
  return (
    <section className="min-h-screen pt-20 flex items-center bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16 w-full grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {/* Sol — metin */}
        <div className="flex flex-col gap-7 animate-fade-in-up">
          <span className="text-xs tracking-[0.25em] text-amber-700 font-medium uppercase">
            Rinoplasti Uzmanı &bull; Bursa
          </span>

          <h1 className="font-serif text-5xl md:text-6xl font-normal text-slate-900 leading-tight">
            Doğal Güzellik.
            <br />
            <em className="italic font-light">Kişisel Detay.</em>
          </h1>

          <p className="text-slate-600 text-lg font-light leading-relaxed max-w-md">
            Op. Dr. Sıla Köşker ile yüzünüze ait kalan rinoplasti deneyimi.
          </p>

          <HeroButtons />

          {/* Mini istatistikler */}
          <div className="flex gap-8 pt-2">
            {[
              { value: "15+", label: "Yıl Deneyim" },
              { value: "1000+", label: "Hasta" },
              { value: "Bursa", label: "Nilüfer" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-serif text-2xl text-slate-900 font-light">
                  {s.value}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 tracking-wide uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ — avatar */}
        <div className="flex justify-center md:justify-end">
          <div className="relative w-72 h-[420px] md:w-80 md:h-[480px] rounded-[50%] bg-gradient-to-br from-rose-50 via-amber-50 to-stone-100 flex flex-col items-center justify-center shadow-xl">
            {/* Hafif iç halka */}
            <div className="absolute inset-6 rounded-[50%] border border-rose-100/60" />

            <span className="font-serif text-8xl text-amber-700 font-light select-none">
              SK
            </span>
            <p className="font-serif text-base text-slate-700 mt-4 italic">
              Op. Dr. Sıla Köşker
            </p>
            <p className="text-xs text-slate-400 mt-1 tracking-widest uppercase">
              KBB Uzmanı
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
