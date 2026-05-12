import { useState } from "react";
import { useParking } from "../context/ParkingContext";

function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatCentsToBRLInput(cents: number): string {
  return (cents / 100).toFixed(2);
}

function parseBRLInputToCents(value: string): number {
  const normalized = value.replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

export default function Settings() {
  const { settings, setSettings, spots, setSpots } = useParking();
  const [parkingName, setParkingName] = useState(settings.parkingName);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [totalSpots, setTotalSpots] = useState(String(settings.totalSpots));
  const [firstHour, setFirstHour] = useState(formatCentsToBRLInput(settings.firstHourCents));
  const [additionalHour, setAdditionalHour] = useState(
    formatCentsToBRLInput(settings.additionalHourCents),
  );
  const [msg, setMsg] = useState<string | null>(null);

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const nextTotal = Math.max(1, toNumber(totalSpots));
    const next = {
      ...settings,
      parkingName: parkingName.trim() || settings.parkingName,
      phone: phone.trim(),
      address: address.trim(),
      totalSpots: nextTotal,
      firstHourCents: Math.max(0, parseBRLInputToCents(firstHour)),
      additionalHourCents: Math.max(0, parseBRLInputToCents(additionalHour)),
    };
    setSettings(next);

    if (nextTotal !== spots.length) {
      if (nextTotal > spots.length) {
        const extra = Array.from({ length: nextTotal - spots.length }).map((_, i) => {
          const number = spots.length + i + 1;
          return { id: `spot_${number}`, number, status: "available" as const };
        });
        setSpots([...spots, ...extra]);
      } else {
        setSpots(spots.slice(0, nextTotal));
      }
    }

    setMsg("Configurações salvas.");
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Configurações</h1>
      <p className="mt-1 text-sm text-slate-600">
        Edite dados do estacionamento e valores de cobrança.
      </p>

      <form onSubmit={onSave} className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Nome do estacionamento
              </label>
              <input
                value={parkingName}
                onChange={(e) => setParkingName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Telefone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Endereço
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Total de vagas
              </label>
              <input
                value={totalSpots}
                onChange={(e) => setTotalSpots(e.target.value)}
                inputMode="numeric"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                1ª hora (R$)
              </label>
              <input
                value={firstHour}
                onChange={(e) => setFirstHour(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Hora adicional (R$)
              </label>
              <input
                value={additionalHour}
                onChange={(e) => setAdditionalHour(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {msg ? (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
              {msg}
            </div>
          ) : null}

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
