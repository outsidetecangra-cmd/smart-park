import { NavLink } from "react-router-dom";
import {
  Gauge,
  History,
  MapPinned,
  Settings as SettingsIcon,
  SquareParking,
  LogIn,
  LogOut,
  CreditCard,
  Cctv,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const linkBase =
  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition";

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="hidden w-60 shrink-0 rounded-2xl bg-white p-3 shadow-soft md:block">
      <div className="px-2 py-2">
        <div className="text-sm font-semibold text-slate-900">Gusman Park</div>
        <div className="text-xs text-slate-500">Controle de estacionamento</div>
      </div>

      <nav className="mt-3 flex flex-col gap-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`
          }
        >
          <Gauge size={18} /> Dashboard
        </NavLink>
        <NavLink
          to="/vagas"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`
          }
        >
          <SquareParking size={18} /> Vagas
        </NavLink>
        <NavLink
          to="/entrada"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`
          }
        >
          <LogIn size={18} /> Entrada
        </NavLink>
        <NavLink
          to="/saida"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`
          }
        >
          <LogOut size={18} /> Saída
        </NavLink>
        <NavLink
          to="/historico"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`
          }
        >
          <History size={18} /> Histórico
        </NavLink>
        <NavLink
          to="/pagamentos"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`
          }
        >
          <CreditCard size={18} /> Pagamentos
        </NavLink>
        <NavLink
          to="/mapa"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`
          }
        >
          <MapPinned size={18} /> Mapa
        </NavLink>
        <NavLink
          to="/equipamentos"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`
          }
        >
          <Cctv size={18} /> Equipamentos
        </NavLink>
        <NavLink
          to="/configuracoes"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`
          }
        >
          <SettingsIcon size={18} /> Configurações
        </NavLink>
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-4 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Sair
      </button>
    </aside>
  );
}
