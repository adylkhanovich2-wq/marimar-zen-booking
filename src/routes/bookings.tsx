import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, NotebookText, RotateCcw, Users, X } from "lucide-react";
import {
  STATUS_LABELS,
  effectiveStatus,
  formatDateRu,
  formatMinutes,
  formatPrice,
  getCabin,
  useBooking,
  type Booking,
  type BookingStatus,
} from "../lib/booking-store";
import { CABIN_IMAGES } from "../lib/cabin-images";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "Мои бронирования — MariMar Private Sauna" },
      {
        name: "description",
        content:
          "Предстоящие, прошедшие и отменённые бронирования кабинок MariMar в Алматы.",
      },
      { property: "og:title", content: "Мои бронирования — MariMar Private Sauna" },
      {
        property: "og:description",
        content: "Управляйте своими визитами в приватную сауну MariMar.",
      },
    ],
  }),
  component: BookingsPage,
});

type TabId = "upcoming" | "past" | "cancelled";

const TABS: { id: TabId; label: string }[] = [
  { id: "upcoming", label: "Предстоящие" },
  { id: "past", label: "Прошедшие" },
  { id: "cancelled", label: "Отменённые" },
];

const STATUS_STYLES: Record<BookingStatus, string> = {
  confirmed: "border-gold/35 bg-gold/12 text-gold",
  pending: "border-amber-500/35 bg-amber-500/10 text-amber-400",
  completed: "border-border bg-muted/40 text-muted-foreground",
  cancelled: "border-red-500/25 bg-red-500/10 text-red-400/90",
};

const EMPTY_TEXT: Record<TabId, string> = {
  upcoming: "У вас пока нет будущих бронирований",
  past: "Здесь появятся ваши прошедшие визиты",
  cancelled: "Отменённых бронирований нет",
};

function BookingsPage() {
  const { bookings, cancelBooking, selectCabin, setPrefill } = useBooking();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 320);
    return () => clearTimeout(t);
  }, [tab]);

  const grouped = useMemo(() => {
    const now = new Date();
    const res: Record<TabId, Booking[]> = { upcoming: [], past: [], cancelled: [] };
    console.log("[BookingsPage] bookings count:", bookings.length);
    for (const b of bookings) {
      const st = effectiveStatus(b, now);
      console.log("[BookingsPage] booking", b.reference, "status", st, "end", bookingEndDate(b).toISOString());
      if (st === "cancelled") res.cancelled.push(b);
      else if (st === "completed") res.past.push(b);
      else res.upcoming.push(b);
    }
    return res;
  }, [bookings]);

  const list = grouped[tab];

  function rebook(b: Booking) {
    selectCabin(b.cabinId);
    setPrefill({ cabinId: b.cabinId, hours: b.hours });
    navigate({ to: "/book" });
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
        Бронирования
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
        Мои бронирования
      </h1>

      <div
        role="tablist"
        aria-label="Фильтр бронирований"
        className="mt-6 grid grid-cols-3 gap-1 rounded-2xl border border-border bg-card p-1"
      >
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`rounded-xl px-2 py-2.5 text-[12px] font-bold transition-all duration-200 ${
                active
                  ? "bg-gold/15 text-gold shadow-sm"
                  : "text-muted-foreground active:bg-accent"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          [0, 1].map((i) => (
            <div key={i} className="surface-card overflow-hidden p-4">
              <div className="flex gap-4">
                <div className="animate-pulse bg-muted h-20 w-20 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="animate-pulse bg-muted h-4 w-24 rounded" />
                  <div className="animate-pulse bg-muted h-3 w-36 rounded" />
                  <div className="animate-pulse bg-muted h-3 w-20 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : list.length === 0 ? (
          <div className="surface-card fade-up flex flex-col items-center px-6 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10">
              <NotebookText className="h-6 w-6 text-gold" />
            </span>
            <p className="mt-4 text-sm font-bold text-foreground">{EMPTY_TEXT[tab]}</p>
            <p className="mt-1.5 max-w-[250px] text-xs leading-relaxed text-muted-foreground">
              Забронируйте кабинку — и она появится в этом списке.
            </p>
            <Link
              to="/book"
              className="btn-gold mt-6 inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold"
            >
              Забронировать
            </Link>
          </div>
        ) : (
          list.map((b) => {
            const cabin = getCabin(b.cabinId);
            const status = effectiveStatus(b);
            return (
              <article key={b.id} className="surface-card fade-up overflow-hidden p-4">
                <div className="flex gap-4">
                  <img
                    src={CABIN_IMAGES[b.cabinId]}
                    alt={`Кабинка ${cabin.name}`}
                    loading="lazy"
                    width={160}
                    height={160}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-base font-semibold tracking-[0.12em] text-foreground">
                        {cabin.name}
                      </p>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${STATUS_STYLES[status]}`}
                      >
                        {STATUS_LABELS[status]}
                      </span>
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5 text-gold/80" />
                      {formatDateRu(b.date)}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-gold/80" />
                      {formatMinutes(b.startMinutes)} —{" "}
                      {formatMinutes(b.startMinutes + b.hours * 60)} · {b.hours} часа
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5 text-gold/80" />
                      {b.guests} гостей · {b.reference}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div>
                    <p className="text-[11px] text-muted-foreground">Итого</p>
                    <p className="text-sm font-bold text-gold">{formatPrice(b.total)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {status === "confirmed" || status === "pending" ? (
                      <button
                        onClick={() => cancelBooking(b.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-[12px] font-semibold text-muted-foreground transition-colors active:bg-accent"
                      >
                        <X className="h-3.5 w-3.5" />
                        Отменить
                      </button>
                    ) : null}
                    <button
                      onClick={() => rebook(b)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gold/30 bg-gold/10 px-3 py-2 text-[12px] font-bold text-gold transition-transform active:scale-[0.97]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Повторить
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
