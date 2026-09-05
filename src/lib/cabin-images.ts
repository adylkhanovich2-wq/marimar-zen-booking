import cabinLux from "../assets/cabin-lux.jpg";
import cabinComfort from "../assets/cabin-comfort.jpg";
import cabinUyut from "../assets/cabin-uyut.jpg";
import type { CabinId } from "./booking-store";

export const CABIN_IMAGES: Record<CabinId, string> = {
  lux: cabinLux,
  comfort: cabinComfort,
  uyut: cabinUyut,
};
