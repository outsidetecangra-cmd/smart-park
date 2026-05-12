import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

type ClientRow = {
  name: string;
  phone: string;
  vehicles: number;
  lastVisit: string;
  status: "Ativo" | "Inativo";
};

const MOCK: ClientRow[] = [
  { name: "Rafael Souza", phone: "(11) 99999-1111", vehicles: 2, lastVisit: "Hoje", status: "Ativo" },
  { name: "Mariana Lima", phone: "(11) 98888-2222", vehicles: 1, lastVisit: "Ontem", status: "Ativo" },
  { name: "Carlos Nunes", phone: "(11) 97777-3333", vehicles: 1, lastVisit: "Há 7 dias", status: "Inativo" },
];

function badgeClass(status: ClientRow["status"]) {
  return status === "Ativo"
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
    : "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

export default function Clients() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ClientRow["status"] | "">("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return MOCK.filter((c) => {
      if (query && !c.name.toLowerCase().includes(query)) return false;
      if (status && c.status !== status) return false;
      return true;
    });
  }, [q, status]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Clientes</h1>
          <p className="mt-1 text-sm text-slate-600">
            Base de clientes e relacionamento.
          </p>
        </div>
        <button type="button" className="sp-btn-primary">
          <Plus size={16} /> Novo Cliente
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
              placeholder="Buscar por nome"
            />
          </div>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as ClientRow["status"] | "")
            }
            className="sp-input w-auto"
          >
            <option value="">Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {filtered.map((c) => (
          <div key={c.name} className="sp-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">
                  {c.name}
                </div>
                <div className="mt-1 text-sm text-slate-600">{c.phone}</div>
                <div className="mt-2 text-xs text-slate-500">
                  Veículos: {c.vehicles} • Última visita: {c.lastVisit}
                </div>
              </div>
              <span className={`sp-badge ${badgeClass(c.status)}`}>
                {c.status}
              </span>
            </div>
            <button type="button" className="mt-4 sp-btn-ghost w-full">
              Ver perfil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

