import { Car, DollarSign, ParkingCircle, Timer } from "lucide-react";
import { ArrowRight, LogIn, LogOut, SquareParking } from "lucide-react";
import StatCard from "../components/StatCard";
import { useParking } from "../context/ParkingContext";
import { formatDateTime } from "../utils/date";
import { Link } from "react-router-dom";

function formatMoneyBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function Dashboard() {
  const { spots, activeVehicles, history, settings } = useParking();

  const total = spots.length;
  const occupied = spots.filter((s) => s.status === "occupied").length;
  const available = spots.filter((s) => s.status === "available").length;
  const reserved = spots.filter((s) => s.status === "reserved").length;

  const todayKey = new Date().toLocaleDateString("pt-BR");
  const revenueTodayCents = history
    .filter((h) => new Date(h.exitAt).toLocaleDateString("pt-BR") === todayKey)
    .reduce((sum, h) => sum + h.paidCents, 0);

  const latest = [
    ...activeVehicles.slice(0, 3).map((v) => ({
      key: v.id,
      kind: "Entrada",
      plate: v.plate,
      at: v.entryAt,
    })),
    ...history.slice(0, 3).map((h) => ({
      key: h.id,
      kind: "Saída",
      plate: h.plate,
      at: h.exitAt,
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 6);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            {settings.parkingName} • {settings.address}
          </p>
        </div>
        <div className="hidden text-sm text-slate-500 sm:block">
          Hoje: {todayKey}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/entrada"
          className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-soft hover:bg-slate-50"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">
              Registrar entrada
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
              <LogIn size={18} />
            </div>
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Adicione um veículo e selecione uma vaga.
          </div>
          <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
            Abrir <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </div>
        </Link>

        <Link
          to="/saida"
          className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-soft hover:bg-slate-50"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">
              Confirmar saída
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-800">
              <LogOut size={18} />
            </div>
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Busque por placa e finalize o atendimento.
          </div>
          <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
            Abrir <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </div>
        </Link>

        <Link
          to="/vagas"
          className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-soft hover:bg-slate-50"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">
              Ver vagas
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-700">
              <SquareParking size={18} />
            </div>
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Acompanhe status e libere com 1 clique.
          </div>
          <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
            Abrir <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </div>
        </Link>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <div className="text-sm font-semibold text-slate-900">Atalhos</div>
          <div className="mt-3 grid gap-2 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
              <span className="text-slate-600">Veículos ativos</span>
              <span className="font-semibold text-slate-900">
                {activeVehicles.length}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
              <span className="text-slate-600">Vagas livres</span>
              <span className="font-semibold text-slate-900">{available}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total de vagas"
          value={String(total)}
          icon={<ParkingCircle size={18} />}
        />
        <StatCard
          title="Vagas ocupadas"
          value={String(occupied)}
          icon={<Car size={18} />}
          accentClassName="text-red-600"
        />
        <StatCard
          title="Vagas disponíveis"
          value={String(available)}
          icon={<ParkingCircle size={18} />}
          accentClassName="text-green-600"
        />
        <StatCard
          title="Vagas reservadas"
          value={String(reserved)}
          icon={<Timer size={18} />}
          accentClassName="text-amber-600"
        />
        <StatCard
          title="Veículos ativos"
          value={String(activeVehicles.length)}
          icon={<Car size={18} />}
        />
        <StatCard
          title="Receita estimada do dia"
          value={formatMoneyBRL(revenueTodayCents)}
          icon={<DollarSign size={18} />}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4">
        <div className="text-sm font-semibold text-slate-900">
          Últimas entradas e saídas
        </div>
        {latest.length === 0 ? (
          <div className="mt-3 text-sm text-slate-600">
            Nenhum movimento ainda.
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100">
            {latest.map((item) => (
              <li key={item.key} className="flex items-center justify-between py-2">
                <div className="text-sm">
                  <span
                    className={`mr-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      item.kind === "Entrada"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.kind}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {item.plate}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {formatDateTime(item.at)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
