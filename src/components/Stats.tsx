const stats = [
  { value: "15+", label: "Yıl Deneyim" },
  { value: "1000+", label: "Başarılı Ameliyat" },
  { value: "%98", label: "Hasta Memnuniyeti" },
  { value: "AEA", label: "Avrupa KBB Akademisi" },
];

export default function Stats() {
  return (
    <section className="bg-amber-50 py-16 border-y border-amber-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <p className="font-serif text-4xl text-slate-900 font-light">
                {s.value}
              </p>
              <p className="text-slate-600 text-xs tracking-wide uppercase">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
