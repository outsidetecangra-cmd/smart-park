import { useMemo, useState } from "react";
import { useParking } from "../context/ParkingContext";
import type { VehicleType } from "../types";

const PRINTER_AGENT_URL = "http://localhost:3199";
const LS_PRINTER = "sp_printer_selected_v1";

const VEHICLE_TYPES: { key: VehicleType; label: string }[] = [
  { key: "car", label: "Carro" },
  { key: "motorcycle", label: "Moto" },
  { key: "van", label: "Van" },
];

export default function VehicleEntry() {
  const { spots, registerEntry, settings } = useParking();
  const availableSpots = useMemo(
    () => spots.filter((s) => s.status === "available"),
    [spots],
  );

  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [type, setType] = useState<VehicleType>("car");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [spotId, setSpotId] = useState(availableSpots[0]?.id ?? "");
  const [message, setMessage] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  const canSubmit = plate.trim() && model.trim() && color.trim() && spotId;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const normalizedPlate = plate.trim().toUpperCase();
    const chosenSpotNumber = spots.find((s) => s.id === spotId)?.number ?? null;

    const res = registerEntry({
      plate,
      model,
      color,
      type,
      driverName,
      driverPhone,
      spotId,
    });
    if (!res.ok) {
      setMessage({
        kind: "err",
        text: res.error ?? "Erro ao registrar entrada.",
      });
      return;
    }

    setMessage({ kind: "ok", text: "Entrada registrada com sucesso!" });
    setPlate("");
    setModel("");
    setColor("");
    setDriverName("");
    setDriverPhone("");

    // Impressão automática (plug and play via Printer Agent no Windows)
    try {
      const now = new Date();
      const content = [
        settings.parkingName || "SMART PARK",
        "CUPOM DE ENTRADA",
        "------------------------------",
        `Placa: ${normalizedPlate}`,
        `Modelo: ${model.trim()}`,
        `Cor: ${color.trim()}`,
        chosenSpotNumber ? `Vaga: #${chosenSpotNumber}` : "Vaga: —",
        `Entrada: ${now.toLocaleString("pt-BR")}`,
        "------------------------------",
        "Guarde este cupom.",
        "",
      ].join("\n");

      let selectedPrinter = "";
      try {
        selectedPrinter = localStorage.getItem(LS_PRINTER) || "";
      } catch {
        selectedPrinter = "";
      }

      const payload: { content: string; printerName?: string } = { content };
      if (selectedPrinter) payload.printerName = selectedPrinter;

      await fetch(`${PRINTER_AGENT_URL}/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Se falhar, o registro segue normalmente; a impressão pode ser feita manualmente.
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">
        Entrada de veículos
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Registre a entrada e selecione uma vaga disponível.
      </p>

      <form onSubmit={submit} className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Placa</label>
              <input
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
                placeholder="ABC1D23"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">
                Modelo
              </label>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
                placeholder="Onix, Civic, etc."
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Cor</label>
              <input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
                placeholder="Prata"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as VehicleType)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
              >
                {VEHICLE_TYPES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Vaga</label>
            <select
              value={spotId}
              onChange={(e) => setSpotId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
            >
              {availableSpots.map((s) => (
                <option key={s.id} value={s.id}>
                  Vaga #{s.number}
                </option>
              ))}
            </select>
            {availableSpots.length === 0 ? (
              <p className="mt-2 text-sm text-amber-700">
                Não há vagas disponíveis no momento.
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Motorista (opcional)
              </label>
              <input
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
                placeholder="Nome"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Telefone (opcional)
              </label>
              <input
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          {message ? (
            <div
              className={`rounded-xl border px-3 py-2 text-sm ${
                message.kind === "ok"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit || availableSpots.length === 0}
            className="w-full sp-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Registrar entrada (imprime cupom)
          </button>
          <div className="text-xs text-slate-500">
            Para impressão automática, inicie o serviço local em `printer-agent`.
          </div>
        </div>
      </form>
    </div>
  );
}

