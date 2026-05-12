import { useMemo, useState } from "react";
import { useParking } from "../context/ParkingContext";
import { formatDateTime } from "../utils/date";

function formatMoneyBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function dateKey(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export default function History() {
  const { history } = useParking();
  const [q, setQ] = useState("");
  const [date, setDate] = useState<string>("");

  const filtered = useMemo(() => {
    const query = q.trim().toUpperCase();
    return history.filter((h) => {
      if (query && !h.plate.includes(query)) return false;
      if (date) {
        const key = dateKey(h.exitAt);
        const selected = new Date(date).toLocaleDateString("pt-BR");
        if (key !== selected) return false;
      }
      return true;
    });
  }, [history, q, date]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Histórico</h1>
          <p className="mt-1 text-sm text-slate-600">
            Entradas e saídas finalizadas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-44 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
            placeholder="Buscar placa"
          />
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
        </div>
      </div>

      <div className="mt-5">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600">
            Nenhum registro encontrado.
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Placa</th>
                    <th className="px-4 py-3">Modelo</th>
                    <th className="px-4 py-3">Vaga</th>
                    <th className="px-4 py-3">Entrada</th>
                    <th className="px-4 py-3">Saída</th>
                    <th className="px-4 py-3">Tempo</th>
                    <th className="px-4 py-3">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((h) => (
                    <tr key={h.id}>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {h.plate}
                      </td>
                      <td className="px-4 py-3">{h.model}</td>
                      <td className="px-4 py-3">#{h.spotNumber}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDateTime(h.entryAt)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDateTime(h.exitAt)}
                      </td>
                      <td className="px-4 py-3">
                        {Math.floor(h.totalMinutes / 60)}h {h.totalMinutes % 60}m
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {formatMoneyBRL(h.paidCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 md:hidden">
              {filtered.map((h) => (
                <div
                  key={h.id}
                  className="rounded-2xl border border-slate-100 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-900">{h.plate}</div>
                    <div className="text-sm font-semibold text-slate-900">
                      {formatMoneyBRL(h.paidCents)}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {h.model} • Vaga #{h.spotNumber}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    Entrada: {formatDateTime(h.entryAt)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Saída: {formatDateTime(h.exitAt)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Tempo: {Math.floor(h.totalMinutes / 60)}h {h.totalMinutes % 60}m
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
