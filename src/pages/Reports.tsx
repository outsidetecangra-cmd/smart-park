import { useMemo } from "react";
import { BarChart3, Clock, PieChart, TrendingUp } from "lucide-react";

function formatMoneyBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const revenueByDay = [
  { day: "Seg", cents: 98000 },
  { day: "Ter", cents: 112000 },
  { day: "Qua", cents: 105000 },
  { day: "Qui", cents: 128000 },
  { day: "Sex", cents: 146000 },
  { day: "Sáb", cents: 132000 },
  { day: "Dom", cents: 89000 },
];

export default function Reports() {
  const max = useMemo(
    () => Math.max(...revenueByDay.map((d) => d.cents)),
    [],
  );

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Relatórios</h1>
      <p className="mt-1 text-sm text-slate-600">
        Visão gerencial com indicadores e gráficos (mock).
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Receita semanal",
            value: formatMoneyBRL(revenueByDay.reduce((a, d) => a + d.cents, 0)),
            Icon: TrendingUp,
          },
          { label: "Veículos atendidos", value: "812", Icon: BarChart3 },
          { label: "Ticket médio", value: "R$ 15,80", Icon: PieChart },
          { label: "Pico de movimento", value: "17:30", Icon: Clock },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="sp-card p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-500">{label}</div>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600/10 text-brand-600">
                <Icon size={18} />
              </div>
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="sp-card p-5 lg:col-span-2">
          <div className="text-sm font-semibold text-slate-900">
            Receita por dia
          </div>
          <div className="mt-4 grid grid-cols-7 items-end gap-3">
            {revenueByDay.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-xl bg-brand-600/20"
                  style={{
                    height: `${Math.max(18, Math.round((d.cents / max) * 140))}px`,
                  }}
                >
                  <div
                    className="h-full w-full rounded-xl bg-brand-600"
                    style={{
                      height: "100%",
                      opacity: 0.75,
                    }}
                  />
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {d.day}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Gráfico ilustrativo (CSS).
          </div>
        </div>

        <div className="sp-card p-5">
          <div className="text-sm font-semibold text-slate-900">
            Tipos de veículos
          </div>
          <div className="mt-4 space-y-3">
            {[
              { label: "Carros", pct: 68, cls: "bg-brand-600" },
              { label: "Motos", pct: 22, cls: "bg-emerald-500" },
              { label: "Caminhonetes", pct: 10, cls: "bg-amber-400" },
            ].map((i) => (
              <div key={i.label}>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>{i.label}</span>
                  <span>{i.pct}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full ${i.cls}`}
                    style={{ width: `${i.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Visual de pizza simulado via barras.
          </div>
        </div>
      </div>
    </div>
  );
}

