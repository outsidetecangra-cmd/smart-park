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

const METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: "Dinheiro",
  pix: "PIX",
  card: "Cartão",
  courtesy: "Cortesia",
};

export default function Payments() {
  const { payments } = useParking();
  const [q, setQ] = useState("");
  const [method, setMethod] = useState<PaymentMethod | "">("");

  const filtered = useMemo(() => {
    const query = q.trim().toUpperCase();
    return payments.filter((p) => {
      if (query && !p.plate.includes(query)) return false;
      if (method && p.method !== method) return false;
      return true;
    });
  }, [payments, q, method]);

  const totals = useMemo(() => {
    const total = filtered.reduce((acc, p) => acc + p.amountCents, 0);
    const byMethod = filtered.reduce<Record<string, number>>((acc, p) => {
      acc[p.method] = (acc[p.method] ?? 0) + p.amountCents;
      return acc;
    }, {});
    return { total, byMethod };
  }, [filtered]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Pagamentos</h1>
          <p className="mt-1 text-sm text-slate-600">
            Registros gerados na confirmação de saída.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-44 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
            placeholder="Buscar placa"
          />
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as PaymentMethod | "")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
          >
            <option value="">Todos</option>
            <option value="cash">Dinheiro</option>
            <option value="pix">PIX</option>
            <option value="card">Cartão</option>
            <option value="courtesy">Cortesia</option>
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">Total</div>
          <div className="mt-1 text-lg font-semibold text-slate-900">
            {formatMoneyBRL(totals.total)}
          </div>
        </div>
        {(["cash", "pix", "card", "courtesy"] as PaymentMethod[]).map((m) => (
          <div
            key={m}
            className="rounded-2xl border border-slate-100 bg-white p-4"
          >
            <div className="text-xs font-semibold text-slate-500">
              {METHOD_LABEL[m]}
            </div>
            <div className="mt-1 text-lg font-semibold text-slate-900">
              {formatMoneyBRL(totals.byMethod[m] ?? 0)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600">
            Nenhum pagamento encontrado.
          </div>
        ) : (
          <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                <tr>
                  <th className="px-4 py-3">Placa</th>
                  <th className="px-4 py-3">Método</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Pago em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {p.plate}
                    </td>
                    <td className="px-4 py-3">{METHOD_LABEL[p.method]}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {formatMoneyBRL(p.amountCents)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDateTime(p.paidAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-3 grid gap-3 md:hidden">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-slate-100 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">{p.plate}</div>
                <div className="text-sm font-semibold text-slate-900">
                  {formatMoneyBRL(p.amountCents)}
                </div>
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {METHOD_LABEL[p.method]}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {formatDateTime(p.paidAt)}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

