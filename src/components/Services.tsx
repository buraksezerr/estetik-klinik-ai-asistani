import { Heart, Wind, RotateCcw, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

const services: Service[] = [
  {
    icon: Heart,
    title: "Estetik Rinoplasti",
    description:
      "Yüz oranlarınıza uygun, doğal ve abartısız burun şekillendirme. Her yüze özel planlama, Instagram şablonu yok.",
  },
  {
    icon: Wind,
    title: "Septorinoplasti",
    description:
      "Nefes alma sorunu ile estetik kaygıyı aynı anda ele alan kapsamlı burun cerrahisi. Fonksiyon kaybetmeden estetik.",
  },
  {
    icon: RotateCcw,
    title: "Revizyon Rinoplasti",
    description:
      "Önceki ameliyat sonucundan memnun kalmayanlar için dikkatli, deneyimli ikincil burun cerrahisi.",
  },
  {
    icon: Shield,
    title: "Septoplasti",
    description:
      "Sadece nefes almayı etkileyen burun eğriliği (septum deviasyonu) için odaklı fonksiyonel düzeltme.",
  },
];

export default function Services() {
  return (
    <section id="hizmetler" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.2em] text-amber-700 font-medium uppercase mb-3">
            Uzmanlık Alanları
          </p>
          <h2 className="font-serif text-4xl text-slate-900 font-light">
            Hizmetlerimiz
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <Icon
                  className="text-rose-400 mb-5"
                  size={28}
                  strokeWidth={1.5}
                />
                <h3 className="font-serif text-xl text-slate-900 mb-3">
                  {s.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">
                  {s.description}
                </p>
                <span className="text-rose-400 text-sm font-medium group-hover:text-rose-500 transition-colors">
                  Detaylı Bilgi →
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
