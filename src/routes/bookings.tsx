import { createFileRoute, Link } from "@tanstack/react-router";
import { NotebookText } from "lucide-react";

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
  return (
    <div className="mx-auto max-w-md px-5 pt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
        Бронирования
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
        Мои бронирования
      </h1>

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
    </div>
  );
}
