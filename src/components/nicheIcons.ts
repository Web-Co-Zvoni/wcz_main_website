import { AppWindow, BedDouble, Car, Fan, Hammer, HardHat, House, Sun, Wrench, Zap, type LucideIcon } from "lucide-react";
import type { NICHES } from "../content";

type Niche = (typeof NICHES.items)[number];

/** one icon per trade — the carousel captions and the niche pages share them */
export const NICHE_ICONS: Record<Niche["icon"], LucideIcon> = {
  zap: Zap,
  wrench: Wrench,
  hammer: Hammer,
  hardhat: HardHat,
  car: Car,
  sun: Sun,
  fan: Fan,
  window: AppWindow,
  house: House,
  bed: BedDouble,
};
