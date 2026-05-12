import { useMemo, useState } from "react";
import ParkingSpotCard from "../components/ParkingSpotCard";
import { useParking } from "../context/ParkingContext";
import type { SpotStatus } from "../types";
import { Info } from "lucide-react";

const filters: { key: SpotStatus | "all"; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "available", label: "Disponíveis" },
  { key: "occupied", label: "Ocupadas" },
  { key: "reserved", label: "Reservadas" },
];

export default function Spots() {
  const { spots, setSpots } = useParking();
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return spots;
    return spots.filter((s) => s.status === filter);
  }, [spots, filter]);

  function release(spotId: string) {
    setSpots(
      spots.map((s) =>
        s.id === spotId
          ? {
              ...s,
              status: "available",
              vehiclePlate: undefined,
              vehicleType: undefined,
              entryAt: undefined,
            }
          : s,
      ),
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Vagas</h1>
          <p className="mt-1 text-sm text-slate-600">
            Visualização em grade. Clique em “Liberar” para desocupar rapidamente.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`px-3 py-2 ${
                filter === f.key ? "sp-btn-primary" : "sp-btn-ghost"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-3 text-sm text-slate-600">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 font-semibold text-slate-900">
            <Info size={16} /> Legenda
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-600" /> Disponível
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-red-700">
            <span className="h-2 w-2 rounded-full bg-red-600" /> Ocupada
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Reservada
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((spot) => (
          <div key={spot.id} className="relative">
            <ParkingSpotCard spot={spot} />
            {spot.status !== "available" ? (
              <button
                type="button"
                onClick={() => release(spot.id)}
                className="absolute right-3 top-3 rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold text-slate-700 shadow-soft hover:bg-white"
              >
                Liberar
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
