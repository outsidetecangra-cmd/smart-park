import { useMemo, useState } from "react";
import { AlertTriangle, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

type VehicleRow = {
  plate: string;
  model: string;
  client: string;
  type: "Carro" | "Moto" | "Caminhonete";
  entryAt: string;
  status: "Estacionado" | "Finalizado" | "Pendente";
};

const MOCK: VehicleRow[] = [
  {
    plate: "ABC1D23",
    model: "Honda Civic",
    client: "Rafael Souza",
    type: "Carro",
    entryAt: "09:32",
    status: "Estacionado",
  },
  {
    plate: "DEF4G56",
    model: "Fiat Argo",
    client: "Mariana Lima",
    type: "Carro",
    entryAt: "10:10",
    status: "Finalizado",
  },
  {
    plate: "GHI7J89",
    model: "Honda CG 160",
    client: "Carlos Nunes",
    type: "Moto",
    entryAt: "11:05",
    status: "Pendente",
  },
];

function badgeClass(status: VehicleRow["status"]) {
  if (status === "Estacionado")
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (status === "Finalizado")
    return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  return "bg-amber-50 text-amber-800 ring-1 ring-amber-200";
}

export default function Vehicles() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<VehicleRow["status"] | "">("");

  const filtered = useMemo(() => {
    const query = q.trim().toUpperCase();
    return MOCK.filter((v) => {
      if (query && !v.plate.includes(query)) return false;
      if (status && v.status !== status) return false;
      return true;
    });
  }, [q, status]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Veículos</h1>
          <p className="mt-1 text-sm text-slate-600">
            Cadastro e acompanhamento de status.
          </p>
        </div>
        <button type="button" className="sp-btn-primary">
          <Plus size={16} /> Cadastrar Veículo
        </button>
      </div>

      <div className="mt-4 sp-card p-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="sp-input pl-9"
              placeholder="Buscar por placa"
            />
          </div>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as VehicleRow["status"] | "")
            }
            className="sp-input w-auto"
          >
            <option value="">Todos status</option>
            <option value="Estacionado">Estacionado</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Pendente">Pendente</option>
          </select>
        </div>
      </div>

      <div className="mt-4 hidden overflow-hidden rounded-2xl border border-border bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
            <tr>
              <th className="px-4 py-3">Placa</th>
              <th className="px-4 py-3">Modelo</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Entrada</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sinistro</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((v) => (
              <tr key={v.plate}>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {v.plate}
                </td>
                <td className="px-4 py-3">{v.model}</td>
                <td className="px-4 py-3">{v.client}</td>
                <td className="px-4 py-3">{v.type}</td>
                <td className="px-4 py-3 text-slate-600">{v.entryAt}</td>
                <td className="px-4 py-3">
                  <span className={`sp-badge ${badgeClass(v.status)}`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/sinistro?placa=${encodeURIComponent(v.plate)}`}
                    className="sp-btn-ghost inline-flex items-center gap-2 px-3 py-1.5"
                    title="Registrar sinistro"
                  >
                    <AlertTriangle size={16} className="text-amber-600" />{" "}
                    Sinistro
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <button type="button" className="sp-btn-ghost px-3 py-1.5">
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-3 md:hidden">
        {filtered.map((v) => (
          <div key={v.plate} className="sp-card p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold text-slate-900">{v.plate}</div>
              <span className={`sp-badge ${badgeClass(v.status)}`}>
                {v.status}
              </span>
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {v.model} • {v.client}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {v.type} • Entrada {v.entryAt}
            </div>
            <button type="button" className="mt-3 sp-btn-ghost w-full">
              Ver detalhes
            </button>
            <Link
              to={`/sinistro?placa=${encodeURIComponent(v.plate)}`}
              className="mt-2 sp-btn-ghost inline-flex w-full items-center justify-center gap-2"
            >
              <AlertTriangle size={16} className="text-amber-600" /> Sinistro
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

