import { useMemo, useState } from "react";
import { useParking } from "../context/ParkingContext";
import { formatDateTime } from "../utils/date";
import type { PaymentMethod } from "../types";

function formatMoneyBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function VehicleExit() {
  const { findActiveByPlate, estimateExit, confirmExitWithPayment, spots } =
    useParking();
  const [plate, setPlate] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [status, setStatus] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  const vehicle = useMemo(() => {
    return findActiveByPlate(plate);
  }, [plate, findActiveByPlate]);

  const estimate = vehicle ? estimateExit(vehicle) : null;
  const spotNumber = vehicle
    ? spots.find((s) => s.id === vehicle.spotId)?.number
    : undefined;

  function onConfirm() {
    setStatus(null);
    const res = confirmExitWithPayment({ plate, method });
    if (!res.ok) {
      setStatus({ kind: "err", text: res.error ?? "Erro ao confirmar saída." });
      return;
    }
    setStatus({ kind: "ok", text: "Pagamento confirmado e vaga liberada." });
    setPlate("");
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Saída de veículos</h1>
      <p className="mt-1 text-sm text-slate-600">
        Consulte um veículo pela placa e confirme o pagamento para liberar a
        saída.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <label className="text-sm font-medium text-slate-700">Placa</label>
          <input
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
            placeholder="ABC1D23"
          />

          {status ? (
            <div
              className={`mt-3 rounded-xl border px-3 py-2 text-sm ${
                status.kind === "ok"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {status.text}
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Detalhes</div>
          {!vehicle ? (
            <div className="mt-2 text-sm text-slate-600">
              Digite uma placa para consultar um veículo ativo.
            </div>
          ) : (
            <div className="mt-3 space-y-2 text-sm">
              <div>
                <span className="text-slate-500">Placa:</span>{" "}
                <span className="font-semibold text-slate-900">
                  {vehicle.plate}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Modelo:</span> {vehicle.model}
              </div>
              <div>
                <span className="text-slate-500">Vaga:</span> #{spotNumber}
              </div>
              <div>
                <span className="text-slate-500">Entrada:</span>{" "}
                {formatDateTime(vehicle.entryAt)}
              </div>

              {estimate ? (
                <>
                  <div>
                    <span className="text-slate-500">Tempo:</span>{" "}
                    {Math.floor(estimate.totalMinutes / 60)}h{" "}
                    {estimate.totalMinutes % 60}m (cobrança:{" "}
                    {estimate.totalHoursRoundedUp}h)
                  </div>
                  <div>
                    <span className="text-slate-500">Valor estimado:</span>{" "}
                    <span className="font-semibold text-slate-900">
                      {formatMoneyBRL(estimate.totalCents)}
                    </span>
                  </div>
                </>
              ) : null}

              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-600">
                  Forma de pagamento
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
                >
                  <option value="pix">PIX</option>
                  <option value="card">Cartão</option>
                  <option value="cash">Dinheiro</option>
                  <option value="courtesy">Cortesia</option>
                </select>
              </div>

              <button
                type="button"
                onClick={onConfirm}
                className="mt-2 w-full sp-btn-primary"
              >
                Confirmar pagamento e saída
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
