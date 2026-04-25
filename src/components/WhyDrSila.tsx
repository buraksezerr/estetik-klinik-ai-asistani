const reasons = [
  {
    number: "01",
    title: "Doğal Yaklaşım",
    description:
      "Abartılı ve homojen \"Instagram burnu\" yerine yüzünüze özel planlama. Sonuç kendinize ait kalsın.",
  },
  {
    number: "02",
    title: "Fonksiyon + Estetik",
    description:
      "KBB uzmanlığı sayesinde sadece görünüm değil, nefes kalitesi de önceliklidir.",
  },
  {
    number: "03",
    title: "Kişisel Planlama",
    description:
      "Hazır şablonlar yerine her hastaya özel ameliyat planı. İlk görüşmede dinlemek, sonra planlamak.",
  },
];

export default function WhyDrSila() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.2em] text-amber-700 font-medium uppercase mb-3">
            Fark
          </p>
          <h2 className="font-serif text-4xl text-slate-900 font-light">
            Neden Dr. Sıla?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {reasons.map((r) => (
            <div key={r.number} className="flex flex-col gap-5">
              <span className="font-serif text-6xl text-amber-700 font-light leading-none">
                {r.number}
              </span>
              <h3 className="font-serif text-xl text-slate-900">{r.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
