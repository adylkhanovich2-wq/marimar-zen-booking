import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarPlus,
  Check,
  Loader2,
  Minus,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import {
  CABINS,
  buildSlots,
  formatMinutes,
  formatPrice,
  getCabin,
  isSlotBooked,
  makeReference,
  RU_MONTHS_SHORT,
  RU_WEEKDAYS_SHORT,
  toDateKey,
  useBooking,
  type Booking,
  type CabinId,
} from "../lib/booking-store";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Забронировать — MariMar Private Sauna" },
      {
        name: "description",
        content:
          "Выберите кабинку, дату, время и количество гостей — онлайн-бронирование приватной сауны MariMar в Алматы.",
      },
      { property: "og:title", content: "Забронировать — MariMar Private Sauna" },
      {
        property: "og:description",
        content:
          "Выберите кабинку, дату, время и количество гостей — онлайн-бронирование приватной сауны MariMar в Алматы.",
      },
    ],
  }),
  component: BookPage,
});

const DURATIONS = [2, 3, 4, 5, 6];

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").replace(/^8/, "7").replace(/^([^7])/, "7$1");
  const d = digits.slice(0, 11).slice(1);
  let out = "+7";
  if (d.length) out += ` (${d.slice(0, 3)}`;
  if (d.length >= 3) out += ")";
  if (d.length > 3) out += ` ${d.slice(3, 6)}`;
  if (d.length > 6) out += `-${d.slice(6, 8)}`;
  if (d.length > 8) out += `-${d.slice(8, 10)}`;
  return out;
}

function SectionLabel({ step, title }: { step: number; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-[11px] font-bold text-gold">
        {step}
      </span>
      <h2 className="text-sm font-bold tracking-wide text-foreground">{title}</h2>
    </div>
  );
}

function SlotsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}

function BookPage() {
  const navigate = useNavigate();
  const { selectedCabin, selectCabin, settings, settingsLoading, addBooking } =
    useBooking();

  const cabinId: CabinId = selectedCabin ?? "lux";
  const cabin = getCabin(cabinId);

  const dates = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, []);

  const [dateKey, setDateKey] = useState(() => toDateKey(dates[0] as Date));
  const [start, setStart] = useState<number | null>(null);
  const [hours, setHours] = useState(2);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Booking | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(true);

  useEffect(() => {
    if (!selectedCabin) selectCabin("lux");
  }, [selectedCabin, selectCabin]);

  useEffect(() => {
    setSlotsLoading(true);
    setStart(null);
    const t = setTimeout(() => setSlotsLoading(false), 420);
    return () => clearTimeout(t);
  }, [dateKey, cabinId]);

  useEffect(() => {
    setGuests((g) => Math.min(g, cabin.maxGuests));
  }, [cabin.maxGuests]);

  const slots = useMemo(() => buildSlots(settings, 2), [settings]);

  const subtotal = cabin.pricePerHour * hours;
  const serviceFee = Math.round((subtotal * settings.serviceFeePercent) / 100);
  const total = subtotal + serviceFee;

  const phoneDigits = phone.replace(/\D/g, "");
  const canSubmit =
    start !== null && name.trim().length >= 2 && phoneDigits.length === 11;

  function slotFits(m: number): boolean {
    if (m + hours * 60 > settings.closeHour * 60) return false;
    for (let t = m; t < m + hours * 60; t += settings.slotStepMinutes) {
      if (isSlotBooked(dateKey, cabinId, t)) return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!canSubmit || start === null) return;
    setSubmitting(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 1400));
    if (!slotFits(start)) {
      setSubmitting(false);
      setError("Это время только что забронировали. Выберите другой слот.");
      setStart(null);
      return;
    }
    const booking: Booking = {
      id: crypto.randomUUID(),
      reference: makeReference(),
      cabinId,
      date: dateKey,
      startMinutes: start,
      hours,
      guests,
      name: name.trim(),
      phone,
      note: note.trim(),
      total,
      createdAt: Date.now(),
    };
    addBooking(booking);
    setSubmitting(false);
    setSuccess(booking);
  }

  if (success) {
    return (
      <SuccessScreen
        booking={success}
        onGoToBookings={() => navigate({ to: "/bookings" })}
      />
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-8 pb-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
        Бронирование
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
        Забронировать визит
      </h1>

      {/* 1. Cabin */}
      <section className="mt-7">
        <SectionLabel step={1} title="Кабинка" />
        <div className="space-y-2.5">
          {CABINS.map((c) => {
            const active = cabinId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => selectCabin(c.id)}
                className={`surface-card flex w-full items-center justify-between gap-3 p-4 text-left transition-all ${
                  active ? "border-gold/60 shadow-luxe" : "active:bg-accent"
                }`}
              >
                <div className="min-w-0">
                  <p className="font-display text-base font-semibold tracking-[0.12em] text-foreground">
                    {c.name}
                    <span className="ml-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {c.nameRu}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {c.capacity} · мин. {c.minHours} ч
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <p className="text-sm font-bold text-gold">
                    {formatPrice(c.pricePerHour)}
                    <span className="text-[11px] font-medium text-muted-foreground">
                      /ч
                    </span>
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
      </section>

      {/* 2. Date & time */}
      <section className="mt-8">
        <SectionLabel step={2} title="Дата и время" />
        <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
          {dates.map((d) => {
            const key = toDateKey(d);
            const active = key === dateKey;
            return (
              <button
                key={key}
                onClick={() => setDateKey(key)}
                className={`flex h-[68px] w-[58px] shrink-0 flex-col items-center justify-center rounded-2xl border transition-all ${
                  active
                    ? "border-gold bg-gold/12 text-foreground shadow-luxe"
                    : "border-border bg-card text-muted-foreground active:bg-accent"
                }`}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wide">
                  {RU_WEEKDAYS_SHORT[d.getDay()]}
                </span>
                <span
                  className={`mt-0.5 font-display text-lg font-bold ${active ? "text-gold" : "text-foreground"}`}
                >
                  {d.getDate()}
                </span>
                <span className="text-[10px] font-medium">
                  {RU_MONTHS_SHORT[d.getMonth()]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          {slotsLoading ? (
            <SlotsSkeleton />
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((m) => {
                const disabled = !slotFits(m);
                const active = start === m;
                return (
                  <button
                    key={m}
                    disabled={disabled}
                    onClick={() => setStart(m)}
                    className={`h-10 rounded-xl border text-xs font-semibold transition-all ${
                      active
                        ? "border-gold bg-gold text-gold-foreground"
                        : disabled
                          ? "cursor-not-allowed border-border/50 bg-muted/40 text-muted-foreground/40 line-through"
                          : "border-border bg-card text-foreground active:scale-95 active:bg-accent"
                    }`}
                  >
                    {formatMinutes(m)}
                  </button>
                );
              })}
            </div>
          )}
          <p className="mt-2.5 text-[11px] text-muted-foreground">
            Часы работы: {formatMinutes(settings.openHour * 60)} —{" "}
            {formatMinutes(settings.closeHour * 60)}. Занятые слоты отмечены.
          </p>
        </div>
      </section>

      {/* 3. Duration & guests */}
      <section className="mt-8">
        <SectionLabel step={3} title="Длительность и гости" />
        <div className="grid grid-cols-5 gap-2">
          {DURATIONS.map((h) => {
            const active = hours === h;
            return (
              <button
                key={h}
                onClick={() => setHours(h)}
                className={`h-11 rounded-xl border text-sm font-bold transition-all ${
                  active
                    ? "border-gold bg-gold text-gold-foreground"
                    : "border-border bg-card text-foreground active:scale-95 active:bg-accent"
                }`}
              >
                {h} ч
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Минимальное бронирование — 2 часа.
        </p>

        <div className="surface-card mt-4 flex items-center justify-between p-4">
          <div className="flex items-center gap-2.5">
            <Users className="h-4 w-4 text-gold" />
            <div>
              <p className="text-sm font-semibold text-foreground">Гости</p>
              <p className="text-[11px] text-muted-foreground">
                Максимум {cabin.maxGuests} чел.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Меньше гостей"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              disabled={guests <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors disabled:opacity-35 active:bg-accent"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center font-display text-lg font-bold text-foreground">
              {guests}
            </span>
            <button
              aria-label="Больше гостей"
              onClick={() => setGuests((g) => Math.min(cabin.maxGuests, g + 1))}
              disabled={guests >= cabin.maxGuests}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors disabled:opacity-35 active:bg-accent"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Price */}
      <section className="mt-8">
        <SectionLabel step={4} title="Стоимость" />
        <div className="surface-card shadow-luxe p-5">
          {settingsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : (
            <>
              <Row
                label={`${formatPrice(cabin.pricePerHour)} × ${hours} ч`}
                value={formatPrice(subtotal)}
              />
              <Row
                label={`Сервисный сбор (${settings.serviceFeePercent}%)`}
                value={formatPrice(serviceFee)}
              />
              <div className="my-3 h-px bg-border" />
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-foreground">Итого</p>
                <p className="font-display text-xl font-bold text-gold">
                  {formatPrice(total)}
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 5. Guest details */}
      <section className="mt-8">
        <SectionLabel step={5} title="Ваши данные" />
        <div className="space-y-3">
          <Field
            label="Имя"
            value={name}
            onChange={setName}
            placeholder="Как к вам обращаться"
          />
          <Field
            label="Телефон"
            value={phone}
            onChange={(v) => setPhone(formatPhone(v))}
            placeholder="+7 (___) ___-__-__"
            inputMode="tel"
            onFocus={() => {
              if (!phone) setPhone("+7");
            }}
          />
          <Field
            label="Telegram / комментарий (опционально)"
            value={note}
            onChange={setNote}
            placeholder="@username или пожелания"
          />
        </div>
      </section>

      {error && (
        <p className="mt-5 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs font-semibold text-destructive">
          {error}
        </p>
      )}

      {/* Sticky CTA */}
      <div className="sticky bottom-[86px] z-30 mt-6 -mx-5 border-t border-border bg-background/90 px-5 py-4 backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {start !== null
              ? `${formatMinutes(start)} — ${formatMinutes(start + hours * 60)}`
              : "Выберите время"}
          </span>
          <span className="font-bold text-gold">{formatPrice(total)}</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="btn-gold flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold disabled:opacity-40"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Проверяем доступность…" : "Подтвердить бронирование"}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  onFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "text" | "tel";
  onFocus?: () => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold/60"
      />
    </label>
  );
}

function SuccessScreen({
  booking,
  onGoToBookings,
}: {
  booking: Booking;
  onGoToBookings: () => void;
}) {
  const cabin = getCabin(booking.cabinId);
  const d = new Date(`${booking.date}T00:00:00`);
  const dateLabel = `${d.getDate()} ${RU_MONTHS_SHORT[d.getMonth()]}`;
  const range = `${formatMinutes(booking.startMinutes)} — ${formatMinutes(
    booking.startMinutes + booking.hours * 60,
  )}`;

  function addToCalendar() {
    const pad = (n: number) => String(n).padStart(2, "0");
    const startDate = new Date(`${booking.date}T00:00:00`);
    startDate.setMinutes(booking.startMinutes);
    const endDate = new Date(startDate.getTime() + booking.hours * 3600000);
    const fmt = (x: Date) =>
      `${x.getUTCFullYear()}${pad(x.getUTCMonth() + 1)}${pad(x.getUTCDate())}T${pad(
        x.getUTCHours(),
      )}${pad(x.getUTCMinutes())}00Z`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `UID:${booking.id}`,
      `DTSTART:${fmt(startDate)}`,
      `DTEND:${fmt(endDate)}`,
      `SUMMARY:MariMar — ${cabin.name} (${booking.reference})`,
      "LOCATION:MariMar Private Sauna, Almaty",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `marimar-${booking.reference}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-10">
      <div className="fade-up flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl border border-gold/30 bg-gold/10">
          <Sparkles className="h-7 w-7 text-gold" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground">
          Бронирование подтверждено
        </h1>
        <p className="mt-2 max-w-[260px] text-xs leading-relaxed text-muted-foreground">
          Мы свяжемся с вами по указанному номеру для подтверждения деталей.
        </p>
      </div>

      <div className="surface-card shadow-luxe fade-up mt-7 p-6">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Код брони
          </p>
          <p className="mt-1 font-display text-2xl font-bold tracking-[0.16em] text-gold">
            {booking.reference}
          </p>
        </div>
        <div className="my-5 h-px bg-border" />
        <Row label="Кабинка" value={`${cabin.name} · ${cabin.nameRu}`} />
        <Row label="Дата" value={dateLabel} />
        <Row label="Время" value={range} />
        <Row label="Гости" value={`${booking.guests} чел.`} />
        <div className="my-4 h-px bg-border" />
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-foreground">Итого</p>
          <p className="font-display text-xl font-bold text-gold">
            {formatPrice(booking.total)}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button
          onClick={addToCalendar}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold text-foreground transition-colors active:bg-accent"
        >
          <CalendarPlus className="h-4 w-4 text-gold" />
          Добавить в календарь
        </button>
        <button
          onClick={onGoToBookings}
          className="btn-gold w-full rounded-2xl py-3.5 text-sm font-bold"
        >
          Перейти в Мои бронирования
        </button>
        <Link
          to="/"
          className="block py-2 text-center text-xs font-semibold text-muted-foreground"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
