import { useAuth } from "../context/AuthContext";
import { PanelLeft, Plus, Search, Wifi } from "lucide-react";

export default function Header(props: {
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}) {
  const { user } = useAuth();
  return (
    <header className="sp-card sticky top-4 z-10 flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={props.onToggleSidebar}
            className="hidden rounded-xl border border-border bg-white px-2 py-2 text-slate-700 hover:bg-slate-50 md:inline-flex"
            aria-label="Alternar menu"
            title={props.sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            <PanelLeft size={18} />
          </button>
          <div className="text-sm font-semibold text-slate-900">
            Olá, {user?.name ?? "Administrador"}
          </div>
        </div>
        <div className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
          <Wifi size={14} /> Sistema Online
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <div className="relative min-w-[220px] flex-1 sm:flex-none">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="sp-input pl-9"
            placeholder="Buscar placa, cliente..."
          />
        </div>
        <button type="button" className="sp-btn-primary">
          <Plus size={16} /> Nova Entrada
        </button>
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
            {(user?.name?.trim()?.[0] ?? "A").toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
