import type { ParkingSpot, Settings, User } from "../types";
import { nowIso } from "../utils/date";

export const DEMO_USER: User = {
  id: "user_demo_admin",
  name: "Admin",
  email: "admin@estacionamento.com",
  phone: "",
  password: "123456",
  createdAt: nowIso(),
};

export const DEFAULT_SETTINGS: Settings = {
  parkingName: "Gusman Park",
  address: "Rua Principal, 100 - Centro",
  phone: "(24) 99999-9999",
  openingHours: "08h às 22h",
  totalSpots: 30,
  firstHourCents: 1000,
  additionalHourCents: 500,
};

export function createInitialSpots(total: number): ParkingSpot[] {
  return Array.from({ length: total }).map((_, idx) => {
    const number = idx + 1;
    const preset =
      number % 11 === 0
        ? { status: "reserved" as const }
        : number % 7 === 0
          ? {
              status: "occupied" as const,
              vehiclePlate: `ABC${String(number).padStart(4, "0")}`,
              vehicleType: number % 2 === 0 ? ("car" as const) : ("motorcycle" as const),
              entryAt: nowIso(),
            }
          : { status: "available" as const };

    return {
      id: `spot_${number}`,
      number,
      status: preset.status,
      vehiclePlate: preset.status === "occupied" ? preset.vehiclePlate : undefined,
      vehicleType: preset.status === "occupied" ? preset.vehicleType : undefined,
      entryAt: preset.status === "occupied" ? preset.entryAt : undefined,
    };
  });
}
