import type { ParkingSpot } from "../types";
import { Bike, Car, Truck } from "lucide-react";
import { formatSpotLabel } from "../utils/spot";

const statusStyles: Record<ParkingSpot["status"], string> = {
  available: "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20",
  occupied: "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20",
  reserved: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
};

function VehicleIcon(props: { type?: ParkingSpot["vehicleType"] }) {
  const { type } = props;
  if (type === "motorcycle") return <Bike size={16} />;
  if (type === "van") return <Truck size={16} />;
  return <Car size={16} />;
}

export default function ParkingSpotCard(props: { spot: ParkingSpot }) {
  const { spot } = props;
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500">Vaga</div>
          <div className="text-lg font-semibold text-slate-900">
            {formatSpotLabel(spot.number, "A")}
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold ${statusStyles[spot.status]}`}
        >
          {spot.status === "available"
            ? "Disponível"
            : spot.status === "occupied"
              ? "Ocupada"
              : "Reservada"}
        </span>
      </div>
      {spot.status === "occupied" ? (
        <div className="mt-3 space-y-1 text-sm text-slate-700">
          <div>
            <span className="text-slate-500">Placa:</span> {spot.vehiclePlate}
          </div>
          <div>
            <span className="text-slate-500">Tipo:</span>{" "}
            <span className="inline-flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-50 text-slate-700">
                <VehicleIcon type={spot.vehicleType} />
              </span>
              {spot.vehicleType === "car"
                ? "Carro"
                : spot.vehicleType === "motorcycle"
                  ? "Moto"
                  : "Utilitário"}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-3 text-sm text-slate-500">Sem veículo</div>
      )}
    </div>
  );
}
