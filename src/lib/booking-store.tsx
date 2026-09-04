import {
  createContext,
  useCallback,
  useContext,
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
  minHours: number;
}

export const CABINS: Cabin[] = [
  {
    id: "lux",
    name: "LUX",
    nameRu: "Люкс",
    pricePerHour: 8000,
    capacity: "до 12 человек",
    minHours: 2,
  },
  {
    id: "comfort",
    name: "COMFORT",
    nameRu: "Комфорт",
    pricePerHour: 6000,
    capacity: "до 6 человек",
    minHours: 2,
  },
  {
    id: "uyut",
    name: "UYUT",
    nameRu: "Уют",
    pricePerHour: 5000,
    capacity: "2–3 человека",
    minHours: 2,
  },
];

export function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-KZ").replace(/,/g, " ")} ₸`;
}

interface BookingState {
  selectedCabin: CabinId | null;
  selectCabin: (id: CabinId | null) => void;
}

const BookingContext = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [selectedCabin, setSelectedCabin] = useState<CabinId | null>(null);

  const selectCabin = useCallback((id: CabinId | null) => {
    setSelectedCabin(id);
  }, []);

  const value = useMemo(
    () => ({ selectedCabin, selectCabin }),
    [selectedCabin, selectCabin],
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
