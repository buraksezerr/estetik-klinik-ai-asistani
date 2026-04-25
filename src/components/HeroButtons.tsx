"use client";

export default function HeroButtons() {
  function openChat() {
    const btn = document.querySelector<HTMLButtonElement>(
      '[aria-label="Chat\'i aç"]'
    );
    btn?.click();
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        onClick={openChat}
        className="bg-rose-400 hover:bg-rose-500 text-white font-medium px-6 py-3 rounded-full transition-colors shadow-sm hover:shadow-md"
      >
        Sorularınızı Sorun
      </button>
      <a
        href="#hizmetler"
        className="border border-slate-300 text-slate-700 hover:border-slate-500 hover:text-slate-900 font-medium px-6 py-3 rounded-full transition-colors"
      >
        Hizmetlerimiz
      </a>
    </div>
  );
}
