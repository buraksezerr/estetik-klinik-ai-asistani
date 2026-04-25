"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import trLocale from "@fullcalendar/core/locales/tr";
import type { EventClickArg } from "@fullcalendar/core";
import { useState } from "react";
import Link from "next/link";
import { X, Phone, Calendar } from "lucide-react";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    name: string;
    phone: string;
    preferred_date: string | null;
    request_summary: string | null;
    status: string;
  };
}

interface ModalData {
  id: string;
  name: string;
  phone: string;
  preferred_date: string | null;
  request_summary: string | null;
  status: string;
}

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  new: { label: "Yeni", classes: "bg-rose-100 text-rose-700" },
  contacted: { label: "Arandı", classes: "bg-amber-100 text-amber-700" },
  scheduled: {
    label: "Randevu Verildi",
    classes: "bg-emerald-100 text-emerald-700",
  },
  completed: { label: "Tamamlandı", classes: "bg-sky-100 text-sky-700" },
  cancelled: { label: "İptal", classes: "bg-slate-100 text-slate-500" },
};

const FILTER_TABS = [
  { value: "", label: "Tümü" },
  { value: "new", label: "Yeni" },
  { value: "contacted", label: "Arandı" },
  { value: "scheduled", label: "Onaylanmış" },
  { value: "completed", label: "Tamamlanmış" },
];

interface AdminCalendarProps {
  events: CalendarEvent[];
}

export default function AdminCalendar({ events }: AdminCalendarProps) {
  const [activeFilter, setActiveFilter] = useState("");
  const [modal, setModal] = useState<ModalData | null>(null);

  const filteredEvents = activeFilter
    ? events.filter((e) => e.extendedProps.status === activeFilter)
    : events;

  function handleEventClick(arg: EventClickArg) {
    const p = arg.event.extendedProps as CalendarEvent["extendedProps"];
    setModal({
      id: arg.event.id,
      name: p.name,
      phone: p.phone,
      preferred_date: p.preferred_date,
      request_summary: p.request_summary,
      status: p.status,
    });
  }

  return (
    <>
      {/* Filtre bar */}
      <div className="flex gap-1 flex-wrap bg-white rounded-xl p-1 shadow-sm border border-slate-100 w-fit mb-4">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              activeFilter === tab.value
                ? "bg-rose-400 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Takvim */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={trLocale}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          buttonText={{
            today: "Bugün",
            month: "Aylık",
            week: "Haftalık",
            day: "Günlük",
          }}
          events={filteredEvents}
          eventClick={handleEventClick}
          height="auto"
          eventDisplay="block"
          dayMaxEvents={3}
          eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
        />
      </div>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-serif text-xl text-slate-900">
                  {modal.name}
                </h3>
                <span
                  className={`inline-flex mt-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    STATUS_CONFIG[modal.status]?.classes ??
                    "bg-slate-100 text-slate-500"
                  }`}
                >
                  {STATUS_CONFIG[modal.status]?.label ?? modal.status}
                </span>
              </div>
              <button
                onClick={() => setModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal içerik */}
            <div className="flex flex-col gap-3 mb-5">
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-slate-400 shrink-0" />
                <span className="text-base font-medium text-slate-900">
                  {modal.phone}
                </span>
              </div>
              {modal.preferred_date && (
                <div className="flex items-start gap-2">
                  <Calendar size={15} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Tercih Tarih</p>
                    <p className="text-sm text-slate-700">{modal.preferred_date}</p>
                  </div>
                </div>
              )}
              {modal.request_summary && (
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Talep Özeti</p>
                  <p className="text-sm text-slate-700">{modal.request_summary}</p>
                </div>
              )}
            </div>

            <Link
              href={`/admin/lead/${modal.id}`}
              className="block w-full text-center bg-rose-400 hover:bg-rose-500 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
              onClick={() => setModal(null)}
            >
              Detayları Gör →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
