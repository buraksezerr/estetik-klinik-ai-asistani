"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Rinoplasti ameliyatı ne kadar sürer?",
    a: "Standart bir estetik rinoplasti genellikle 2-3 saat sürer. Septum düzeltmesi de (septorinoplasti) eklenirse süre 3-4 saate uzayabilir. Kesin süre, planın kapsamına ve tercih edilen tekniğe göre değişir.",
  },
  {
    q: "İyileşme süreci ne kadar?",
    a: "İlk hafta alçı/atel kullanımı ve ev istirahati gerekir. 10-14. günlerde şişlik ve morluk en yoğundur. 3. haftada büyük ölçüde çekilir, sosyal hayata dönüş mümkün olur. 3-6 ay sonra %80-90 sonuç görünür; 1 yılda nihai görünüme ulaşılır.",
  },
  {
    q: "Sonuç ne zaman net görünür?",
    a: "Şişliğin tamamen çekilmesi yaklaşık 12 ay sürer. Ancak çoğu hastada 3-4. ayda nihai görünümün %80-90'ına ulaşılır. Karşılaştırmalı fotoğraflar için 6. ay sonrası önerilir.",
  },
  {
    q: "Ameliyattan sonra ağrı olur mu?",
    a: "Genel anestezi altında ameliyat sırasında hiçbir şey hissedilmez. Sonrasında ağrıdan çok basınç ve dolgunluk hissi yaşanır; bu reçeteli ağrı kesicilerle kolayca kontrol altına alınır. Kapalı teknikte açık tekniğe kıyasla daha az rahatsızlık görülür.",
  },
  {
    q: "Hangi anestezi türü kullanılır?",
    a: "Rinoplasti ve septorinoplasti genellikle genel anestezi altında yapılır. Ameliyat öncesi deneyimli bir anesteziyolog tarafından detaylı değerlendirme yapılır.",
  },
  {
    q: "Nefes alma sorunum geçer mi?",
    a: "Septum deviasyonu veya konka hipertrofisi gibi yapısal sorunlara bağlı nefes problemleri septoplasti veya septorinoplasti ile büyük ölçüde düzeltilebilir. Ameliyat öncesi değerlendirmede sorunun kaynağı tespit edilir ve size özel plan oluşturulur.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="sss" className="bg-stone-50 py-24">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.2em] text-amber-700 font-medium uppercase mb-3">
            Merak Edilenler
          </p>
          <h2 className="font-serif text-4xl text-slate-900 font-light">
            Sık Sorulan Sorular
          </h2>
        </div>

        <div className="divide-y divide-slate-200">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left gap-4 group"
                aria-expanded={openIndex === i}
              >
                <span className="font-serif text-lg text-slate-900 group-hover:text-slate-700 transition-colors">
                  {faq.q}
                </span>
                <span className="shrink-0 text-rose-400 transition-transform">
                  {openIndex === i ? (
                    <Minus size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-slate-600 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
