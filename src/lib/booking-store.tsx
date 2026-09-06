import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CabinId = "lux" | "comfort" | "uyut";

export interface Cabin {
  id: CabinId;
  name: string;
  nameRu: string;
  pricePerHour: number;
  capacity: string;
  maxGuests: number;
  minHours: number;
}

export const CABINS: Cabin[] = [
  {
    id: "lux",
    name: "LUX",
    nameRu: "Люкс",
    pricePerHour: 8000,
    capacity: "до 12 человек",
    maxGuests: 12,
    minHours: 2,
  },
  {
    id: "comfort",
    name: "COMFORT",
    nameRu: "Комфорт",
    pricePerHour: 6000,
    capacity: "до 6 человек",
    maxGuests: 6,
    minHours: 2,
  },
  {
    id: "uyut",
    name: "UYUT",
    nameRu: "Уют",
    pricePerHour: 5000,
    capacity: "2–3 человека",
    maxGuests: 3,
    minHours: 2,
  },
];

export function getCabin(id: CabinId): Cabin {
  return CABINS.find((c) => c.id === id) ?? (CABINS[0] as Cabin);
}

export function formatPrice(value: number): string {
  return `${Math.round(value).toLocaleString("ru-KZ").replace(/[,\u00a0\u202f]/g, " ")} ₸`;
}

/** App settings (would come from backend settings table). */
export interface AppSettings {
  serviceFeePercent: number;
  openHour: number;
  closeHour: number; // exclusive, may pass midnight (26 = 02:00)
  slotStepMinutes: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  serviceFeePercent: 10,
  openHour: 10,
  closeHour: 26,
  slotStepMinutes: 60,
};

export type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";

export interface Booking {
  id: string;
  reference: string;
  cabinId: CabinId;
  date: string; // yyyy-mm-dd
  startMinutes: number;
  hours: number;
  guests: number;
  name: string;
  phone: string;
  note: string;
  total: number;
  createdAt: number;
  status?: BookingStatus;
}

export interface Prefill {
  cabinId: CabinId;
  hours: number;
}

interface BookingState {
  selectedCabin: CabinId | null;
  selectCabin: (id: CabinId | null) => void;
  settings: AppSettings;
  settingsLoading: boolean;
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  cancelBooking: (id: string) => void;
  prefill: Prefill | null;
  setPrefill: (p: Prefill | null) => void;
}


const BookingContext = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedCabin, setSelectedCabin] = useState<CabinId | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [prefill, setPrefill] = useState<Prefill | null>(null);

  useEffect(() => {
    // Simulated settings fetch — service fee is a dynamic parameter.
    const t = setTimeout(() => {
      setSettings(DEFAULT_SETTINGS);
      setSettingsLoading(false);
    }, 450);
    return () => clearTimeout(t);
  }, []);

  const selectCabin = useCallback((id: CabinId | null) => {
    setSelectedCabin(id);
  }, []);

  const addBooking = useCallback((b: Booking) => {
    setBookings((prev) => [{ status: "confirmed" as const, ...b }, ...prev]);
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b)),
    );
  }, []);

  const value = useMemo(
    () => ({
      selectedCabin,
      selectCabin,
      settings,
      settingsLoading,
      bookings,
      addBooking,
      cancelBooking,
      prefill,
      setPrefill,
    }),
    [
      selectedCabin,
      selectCabin,
      settings,
      settingsLoading,
      bookings,
      addBooking,
      cancelBooking,
      prefill,
    ],
  );


  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking(): BookingState {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

/* ---------- time helpers ---------- */

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function buildSlots(settings: AppSettings, minHours = 2): number[] {
  const slots: number[] = [];
  const last = settings.closeHour * 60 - minHours * 60;
  for (let m = settings.openHour * 60; m <= last; m += settings.slotStepMinutes) {
    slots.push(m);
  }
  return slots;
}

/** Deterministic pseudo-random "already booked" slots. */
export function isSlotBooked(dateKey: string, cabinId: CabinId, minutes: number): boolean {
  let h = 0;
  const src = `${dateKey}|${cabinId}|${minutes}`;
  for (let i = 0; i < src.length; i++) h = (h * 31 + src.charCodeAt(i)) % 100003;
  return h % 7 === 0;
}

export const RU_MONTHS_SHORT = [
  "янв",
  "фев",
  "мар",
  "апр",
  "мая",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
];

export const RU_WEEKDAYS_SHORT = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

export function makeReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `MM-${out}`;
}

/* ---------- booking status helpers ---------- */

export function bookingStartDate(b: Booking): Date {
  const d = new Date(`${b.date}T00:00:00`);
  d.setMinutes(d.getMinutes() + b.startMinutes);
  return d;
}

export function bookingEndDate(b: Booking): Date {
  return new Date(bookingStartDate(b).getTime() + b.hours * 3600000);
}

export function effectiveStatus(b: Booking, now: Date = new Date()): BookingStatus {
  if (b.status === "cancelled") return "cancelled";
  if (bookingEndDate(b).getTime() < now.getTime()) return "completed";
  return b.status ?? "confirmed";
}

export const STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed: "Подтверждено",
  pending: "В обработке",
  completed: "Завершено",
  cancelled: "Отменено",
};

export function formatDateRu(dateKey: string): string {
  const d = new Date(`${dateKey}T00:00:00`);
  return `${RU_WEEKDAYS_SHORT[d.getDay()]}, ${d.getDate()} ${RU_MONTHS_SHORT[d.getMonth()]}`;
}
