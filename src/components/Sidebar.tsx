import { NavLink } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  Car,
  Cctv,
  DoorOpen,
  Gauge,
  Printer,
  Settings as SettingsIcon,
  SquareParking,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SmartParkLogo from "./SmartParkLogo";

const linkBase =
  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition";

export default function Sidebar(props: { collapsed?: boolean }) {
  const { logout } = useAuth();
  const collapsed = props.collapsed ?? false;

  return (
    <aside
      className={`hidden shrink-0 overflow-hidden rounded-2xl bg-brand-950 text-white shadow-card md:block ${
        collapsed ? "w-[76px]" : "w-64"
      }`}
    >
      <div className={`border-b border-white/10 ${collapsed ? "p-3" : "p-4"}`}>
        <SmartParkLogo variant="light" />
      </div>

      <nav className={`mt-3 flex flex-col gap-1 ${collapsed ? "px-2" : "px-3"}`}>
        {[
          { to: "/dashboard", label: "Painel de Controle", Icon: Gauge },
          { to: "/veiculos", label: "Veículos", Icon: Car },
          { to: "/vagas", label: "Vagas", Icon: SquareParking },
          { to: "/movimentacoes", label: "Entradas/Saídas", Icon: DoorOpen },
          { to: "/sinistro", label: "Sinistro", Icon: AlertTriangle },
          { to: "/clientes", label: "Clientes", Icon: Users },
          { to: "/relatorios", label: "Relatórios", Icon: BarChart3 },
          { to: "/equipamentos", label: "Equipamentos", Icon: Cctv },
          { to: "/impressoras", label: "Impressoras", Icon: Printer },
          { to: "/configuracoes", label: "Configurações", Icon: SettingsIcon },
        ].map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${linkBase} ${collapsed ? "justify-center px-2" : ""} ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-200 hover:bg-white/5 hover:text-white"
              }`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} />
            {collapsed ? null : <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 border-t border-white/10 p-4">
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-white/10 transition hover:bg-white/15 active:translate-y-[1px]"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
