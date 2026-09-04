import { createFileRoute, Link } from "@tanstack/react-router";
import { NotebookText } from "lucide-react";
import {
  RU_MONTHS_SHORT,
  formatMinutes,
  formatPrice,
  getCabin,
  useBooking,
} from "../lib/booking-store";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "Мои бронирования — MariMar Private Sauna" },
      { name: "description", content: "Ваши бронирования в MariMar." },
      { property: "og:title", content: "Мои бронирования — MariMar Private Sauna" },
      { property: "og:description", content: "Ваши бронирования в MariMar." },
    ],
  }),
  component: BookingsPage,
});

function BookingsPage() {
  const { bookings } = useBooking();

  return (
    <div className="mx-auto max-w-md px-5 pt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
        Бронирования
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
        Мои бронирования
      </h1>

      {bookings.length === 0 ? (
        <div className="surface-card mt-8 flex flex-col items-center px-6 py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10">
            <NotebookText className="h-6 w-6 text-gold" />
          </span>
          <p className="mt-4 text-sm font-bold text-foreground">Пока нет бронирований</p>
          <p className="mt-1.5 max-w-[240px] text-xs leading-relaxed text-muted-foreground">
            Ваши предстоящие визиты появятся здесь после первого бронирования.
          </p>
          <Link
            to="/book"
            className="btn-gold mt-6 inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold"
          >
            Забронировать
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {bookings.map((b) => {
            const cabin = getCabin(b.cabinId);
            const d = new Date(`${b.date}T00:00:00`);
            return (
              <div key={b.id} className="surface-card fade-up p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-semibold tracking-[0.12em] text-foreground">
                      {cabin.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {d.getDate()} {RU_MONTHS_SHORT[d.getMonth()]} ·{" "}
                      {formatMinutes(b.startMinutes)} —{" "}
                      {formatMinutes(b.startMinutes + b.hours * 60)} · {b.guests} чел.
                    </p>
                  </div>
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-gold">
                    {b.reference}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-muted-foreground">Итого</span>
                  <span className="text-sm font-bold text-gold">
                    {formatPrice(b.total)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
