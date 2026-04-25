"use client";

export default function Contact() {
  function openChat() {
    const btn = document.querySelector<HTMLButtonElement>(
      '[aria-label="Chat\'i aç"]'
    );
    btn?.click();
  }

  return (
    <section id="iletisim" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
        {/* Sol — Klinik bilgileri */}
        <div>
          <p className="text-xs tracking-[0.2em] text-amber-700 font-medium uppercase mb-4">
            İletişim
          </p>
          <h2 className="font-serif text-4xl text-slate-900 font-light mb-10">
            Kliniğimiz
          </h2>
          <div className="flex flex-col gap-5 text-slate-600">
            <p className="text-lg font-medium text-slate-900">
              Köşker KBB ve Estetik Cerrahi Kliniği
            </p>
            <p>Nilüfer / Bursa</p>
            <div>
              <p className="font-medium text-slate-700 mb-1.5">
                Çalışma Saatleri
              </p>
              <p className="text-sm">Pazartesi — Cuma: 09:00 – 18:00</p>
              <p className="text-sm">Cumartesi: 10:00 – 14:00</p>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Randevu talebi için dijital asistanımızı kullanabilir veya
              kliniğimizi arayabilirsiniz.
            </p>
          </div>
        </div>

        {/* Sağ — CTA kutusu */}
        <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-3xl p-10 flex flex-col items-center text-center gap-6">
          <p className="text-xs tracking-[0.2em] text-amber-700 font-medium uppercase">
            7/24 Asistan
          </p>
          <h3 className="font-serif text-3xl text-slate-900 font-light leading-snug">
            Sorularınızı
            <br />
            Şimdi Sorun
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Dr. Sıla&rsquo;nın dijital asistanı 7/24 buradır. Rinoplasti,
            septoplasti veya fiyat dışı her konuda bilgi alabilirsiniz.
          </p>
          <button
            onClick={openChat}
            className="bg-rose-400 hover:bg-rose-500 text-white font-medium px-8 py-3.5 rounded-full transition-colors shadow-sm hover:shadow-md w-full"
          >
            Sohbete Başla
          </button>
        </div>
      </div>
    </section>
  );
}
