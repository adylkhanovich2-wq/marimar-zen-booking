import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  Download,
  Info,
  MapPin,
  NotebookText,
  Phone,
  ScrollText,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import {
  CABINS,
  effectiveStatus,
  getCabin,
  useBooking,
  type CabinId,
} from "../lib/booking-store";
import { notificationService } from "../lib/notification-service";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Профиль — MariMar Private Sauna" },
      {
        name: "description",
        content:
          "Профиль клиента MariMar: визиты, любимая кабинка, контакты сауны и установка приложения.",
      },
      { property: "og:title", content: "Профиль — MariMar Private Sauna" },
      {
        property: "og:description",
        content: "Ваш профиль клиента приватной сауны MariMar в Алматы.",
      },
    ],
  }),
  component: ProfilePage,
});

const VENUE = {
  address: "Алматы, ул. Сатпаева 90/1",
  phone: "+7 707 000 00 00",
  hours: "Ежедневно 10:00 — 02:00",
};

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

function ProfilePage() {
  const { bookings } = useBooking();
  const [sheet, setSheet] = useState<null | "about" | "rules">(null);
  const [installEvent, setInstallEvent] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    const onInstalled = () => setInstalled(true);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const profile = useMemo(() => {
    const last = bookings[0];
    const visits = bookings.filter((b) => effectiveStatus(b) !== "cancelled").length;
    const counts = new Map<CabinId, number>();
    for (const b of bookings) counts.set(b.cabinId, (counts.get(b.cabinId) ?? 0) + 1);
    let favorite: CabinId | null = null;
    let best = 0;
    for (const [id, n] of counts) if (n > best) ((best = n), (favorite = id));
    return {
      name: last?.name?.trim() || "Гость MariMar",
      phone: last?.phone || "Телефон не указан",
      visits,
      favorite: favorite ? getCabin(favorite).name : "—",
    };
  }, [bookings]);

  async function handleInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") {
      setInstalled(true);
      void notificationService.notify({
        type: "custom",
        title: "MariMar установлен",
        body: "Приложение добавлено на главный экран.",
      });
    }
    setInstallEvent(null);
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">Аккаунт</p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
        Профиль
      </h1>

      <div className="surface-card fade-up mt-6 flex items-center gap-4 p-5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/10">
          <UserRound className="h-6 w-6 text-gold" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-foreground">{profile.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{profile.phone}</p>
          <p className="mt-1.5 inline-flex rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-gold">
            Клиент MariMar
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="surface-card fade-up p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Визитов</p>
          <p className="mt-1 font-display text-2xl font-semibold text-foreground">
            {profile.visits}
          </p>
        </div>
        <div className="surface-card fade-up p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Любимая кабинка
          </p>
          <p className="mt-1 font-display text-2xl font-semibold tracking-[0.08em] text-gold">
            {profile.favorite}
          </p>
        </div>
      </div>

      <div className="surface-card mt-5 divide-y divide-border overflow-hidden">
        <Link
          to="/bookings"
          className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors active:bg-accent"
        >
          <NotebookText className="h-4.5 w-4.5 shrink-0 text-gold" />
          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
            Мои бронирования
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Link>

        <button
          onClick={() => setSheet("about")}
          className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors active:bg-accent"
        >
          <Info className="h-4.5 w-4.5 shrink-0 text-gold" />
          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
            О сауне MariMar
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>

        <button
          onClick={() => setSheet("rules")}
          className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors active:bg-accent"
        >
          <ScrollText className="h-4.5 w-4.5 shrink-0 text-gold" />
          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
            Правила и условия
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>

        <button
          onClick={handleInstall}
          disabled={!installEvent || installed}
          className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors active:bg-accent disabled:opacity-55"
        >
          <Download className="h-4.5 w-4.5 shrink-0 text-gold" />
          <span className="min-w-0 flex-1 text-sm font-semibold text-foreground">
            Установить приложение
            {!installEvent && !installed ? (
              <span className="mt-0.5 block text-[11px] font-medium text-muted-foreground">
                Добавьте MariMar на главный экран через меню браузера
              </span>
            ) : null}
            {installed ? (
              <span className="mt-0.5 block text-[11px] font-medium text-gold">
                Установлено
              </span>
            ) : null}
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </div>

      <div className="surface-card mt-5 flex items-start gap-3 p-5">
        <Sparkles className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Мы уважаем вашу приватность: данные бронирования видны только вам и
          администратору MariMar.
        </p>
      </div>

      {sheet ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setSheet(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={sheet === "about" ? "О сауне MariMar" : "Правила и условия"}
            onClick={(e) => e.stopPropagation()}
            className="fade-up w-full max-w-md rounded-t-3xl border border-border bg-card p-6 pb-[calc(2rem+env(safe-area-inset-bottom))]"
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border" />
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-foreground">
                {sheet === "about" ? "О сауне MariMar" : "Правила и условия"}
              </h2>
              <button
                onClick={() => setSheet(null)}
                aria-label="Закрыть"
                className="rounded-full border border-border p-1.5 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {sheet === "about" ? (
              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-gold" />
                  {VENUE.address}
                </p>
                <a href={`tel:${VENUE.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  {VENUE.phone}
                </a>
                <p className="flex items-center gap-2.5">
                  <Info className="h-4 w-4 shrink-0 text-gold" />
                  {VENUE.hours}
                </p>
                <p className="pt-2 text-xs leading-relaxed">
                  Приватная сауна с тремя кабинками: {CABINS.map((c) => c.name).join(", ")}.
                  Полная конфиденциальность и премиальный сервис.
                </p>
              </div>
            ) : (
              <ul className="mt-5 space-y-2.5 text-xs leading-relaxed text-muted-foreground">
                <li>· Минимальное бронирование — 2 часа.</li>
                <li>· Бесплатная отмена не позднее чем за 3 часа до визита.</li>
                <li>· Количество гостей не должно превышать вместимость кабинки.</li>
                <li>· Администрация вправе отказать в обслуживании при нарушении порядка.</li>
                <li>· Полный текст правил предоставляется на стойке администратора.</li>
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
