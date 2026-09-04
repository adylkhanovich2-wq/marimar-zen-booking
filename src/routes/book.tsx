import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { CABINS, formatPrice, useBooking, type CabinId } from "../lib/booking-store";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Забронировать — MariMar Private Sauna" },
      {
        name: "description",
        content: "Выберите кабинку и время для вашего визита в MariMar.",
      },
      { property: "og:title", content: "Забронировать — MariMar Private Sauna" },
      {
        property: "og:description",
        content: "Выберите кабинку и время для вашего визита в MariMar.",
      },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  const { selectedCabin, selectCabin } = useBooking();

  return (
    <div className="mx-auto max-w-md px-5 pt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
        Бронирование
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
        Выберите кабинку
      </h1>

      <div className="mt-6 space-y-3">
        {CABINS.map((cabin) => {
          const active = selectedCabin === cabin.id;
          return (
            <button
              key={cabin.id}
              onClick={() => selectCabin(cabin.id as CabinId)}
              className={`surface-card flex w-full items-center justify-between gap-3 p-5 text-left transition-all ${
                active ? "border-gold/60 shadow-luxe" : "active:bg-accent"
              }`}
            >
              <div className="min-w-0">
                <p className="font-display text-base font-semibold tracking-[0.12em] text-foreground">
                  {cabin.name}
                  <span className="ml-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {cabin.nameRu}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {cabin.capacity} · мин. {cabin.minHours} ч
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <p className="text-sm font-bold text-gold">
                  {formatPrice(cabin.pricePerHour)}
                  <span className="text-[11px] font-medium text-muted-foreground">/ч</span>
                </p>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                    active ? "border-gold bg-gold" : "border-border"
                  }`}
                >
                  {active && <Check className="h-3.5 w-3.5 text-gold-foreground" />}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="surface-card mt-6 p-5">
        <p className="text-sm font-semibold text-foreground">Дата и время</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Выбор слота и подтверждение появятся на следующем шаге — бронирование
          скоро будет доступно онлайн.
        </p>
      </div>
    </div>
  );
}
