import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Clock3,
} from "lucide-react";

import heroImage from "../assets/hero-sauna.jpg";
import cabinLux from "../assets/cabin-lux.jpg";
import cabinComfort from "../assets/cabin-comfort.jpg";
import cabinUyut from "../assets/cabin-uyut.jpg";
import { CABINS, formatPrice, useBooking, type CabinId } from "../lib/booking-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MariMar — Private Sauna Almaty" },
      {
        name: "description",
        content:
          "MariMar — частная премиальная сауна в Алматы. Онлайн-бронирование кабинок Люкс, Комфорт и Уют. Полная приватность и конфиденциальность.",
      },
      { property: "og:title", content: "MariMar — Private Sauna Almaty" },
      {
        property: "og:description",
        content:
          "Частная премиальная сауна в Алматы. Приватно. Конфиденциально. Премиально.",
      },
    ],
  }),
  component: Index,
});

const CABIN_IMAGES: Record<CabinId, string> = {
  lux: cabinLux,
  comfort: cabinComfort,
  uyut: cabinUyut,
};

function CabinCard({ cabinId, index }: { cabinId: CabinId; index: number }) {
  const cabin = CABINS.find((c) => c.id === cabinId)!;
  const { selectCabin } = useBooking();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  return (
    <article
      className="surface-card shadow-luxe fade-up overflow-hidden"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="relative h-48 overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden />
        )}
        <img
          src={CABIN_IMAGES[cabinId]}
          alt={`Кабинка ${cabin.name} — ${cabin.nameRu}`}
          loading="lazy"
          width={1024}
          height={768}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-700 ${
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent"
          aria-hidden
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur-md">
            <Users className="h-3 w-3 text-gold" />
            {cabin.capacity}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur-md">
            <Clock3 className="h-3 w-3 text-gold" />
            мин. {cabin.minHours} ч
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold tracking-[0.14em] text-foreground">
              {cabin.name}
            </h3>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {cabin.nameRu}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-xl font-bold text-gold">
              {formatPrice(cabin.pricePerHour)}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">за час</p>
          </div>
        </div>

        <button
          onClick={() => {
            selectCabin(cabinId);
            void navigate({ to: "/book" });
          }}
          className="btn-gold mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold tracking-wide"
        >
          Выбрать
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function Index() {
  const [heroLoaded, setHeroLoaded] = useState(false);

  return (
    <div className="mx-auto max-w-md">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {!heroLoaded && (
          <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden />
        )}
        <img
          src={heroImage}
          alt="Атмосферный интерьер премиальной частной сауны MariMar"
          width={1600}
          height={1024}
          onLoad={() => setHeroLoaded(true)}
          className={`h-[460px] w-full object-cover transition-opacity duration-1000 ${
            heroLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/10"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-8">
          <p className="fade-up text-[11px] font-bold uppercase tracking-[0.32em] text-gold">
            Private · Confidential · Premium
          </p>
          <h1
            className="fade-up mt-3 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-shimmer-silver"
            style={{ animationDelay: "100ms" }}
          >
            Ваша личная
            <br />
            сауна в Алматы
          </h1>
          <p
            className="fade-up mt-3 max-w-[280px] text-sm leading-relaxed text-muted-foreground"
            style={{ animationDelay: "200ms" }}
          >
            Отдельные кабинки, без посторонних. Только вы, пар и тишина.
          </p>
          <div className="fade-up mt-6" style={{ animationDelay: "300ms" }}>
            <Link
              to="/book"
              className="btn-gold inline-flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-bold tracking-wide"
            >
              Забронировать
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div
            className="fade-up mt-4 grid grid-cols-3 gap-2"
            style={{ animationDelay: "400ms" }}
          >
            {[
              { label: "Кабинки", href: "#cabins" },
              { label: "Мои брони", href: "/bookings" },
              { label: "Контакты", href: "#contacts" },
            ].map((item) =>
              item.href.startsWith("#") ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-center gap-1 rounded-xl border border-border bg-card/80 py-2.5 text-xs font-semibold text-foreground backdrop-blur-md transition-colors hover:border-gold/40 active:bg-accent"
                >
                  {item.label}
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center justify-center gap-1 rounded-xl border border-border bg-card/80 py-2.5 text-xs font-semibold text-foreground backdrop-blur-md transition-colors hover:border-gold/40 active:bg-accent"
                >
                  {item.label}
                  <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Cabins */}
      <section id="cabins" className="scroll-mt-20 px-5 pt-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
              Наши кабинки
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
              Выберите пространство
            </h2>
          </div>
        </div>
        <div className="mt-6 space-y-5">
          {CABINS.map((cabin, i) => (
            <CabinCard key={cabin.id} cabinId={cabin.id} index={i} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-5 pt-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
          Почему MariMar
        </p>
        <div className="mt-5 space-y-3">
          {[
            {
              icon: ShieldCheck,
              title: "100% приватность",
              text: "Отдельный вход и кабинка только для вашей компании.",
            },
            {
              icon: CalendarCheck2,
              title: "Онлайн-бронирование",
              text: "Выберите дату и время за минуту — без звонков.",
            },
            {
              icon: Sparkles,
              title: "Премиальный сервис",
              text: "Чистота, ароматы и внимание к каждой детали.",
            },
          ].map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className="surface-card fade-up flex items-start gap-4 p-5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold/10">
                <Icon className="h-5 w-5 text-gold" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-foreground">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="scroll-mt-20 px-5 py-12">
        <div className="surface-card flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold/10">
            <MapPin className="h-5 w-5 text-gold" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-foreground">Алматы</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Точный адрес сообщаем после подтверждения брони.
            </p>
          </div>
        </div>
        <p className="mt-8 text-center text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
          MariMar · Private Sauna · Almaty
        </p>
      </section>
    </div>
  );
}
