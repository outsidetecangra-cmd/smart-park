import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { NavLink } from "react-router-dom";
import {
  Gauge,
  SquareParking,
  LogIn,
  LogOut,
  History,
  MapPinned,
  Settings,
  CreditCard,
  Cctv,
} from "lucide-react";

export default function Layout() {
  return (
    <div className="min-h-full pb-20 md:pb-0">
      <div className="mx-auto flex min-h-full w-full max-w-7xl gap-6 px-4 py-6">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Header />
          <main className="min-w-0 flex-1 rounded-2xl bg-white p-4 shadow-soft sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white/90 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-2xl grid-cols-5 gap-1 px-2 py-2">
          {[
            { to: "/dashboard", label: "Painel", Icon: Gauge },
            { to: "/vagas", label: "Vagas", Icon: SquareParking },
            { to: "/entrada", label: "Entrada", Icon: LogIn },
            { to: "/saida", label: "Saída", Icon: LogOut },
            { to: "/historico", label: "Hist.", Icon: History },
          ].map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium ${
                  isActive ? "bg-slate-100 text-slate-900" : "text-slate-600"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 pb-2">
          <NavLink to="/mapa" className="text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-1">
              <MapPinned size={14} /> Mapa
            </span>
          </NavLink>
          <NavLink
            to="/pagamentos"
            className="text-xs font-medium text-slate-600"
          >
            <span className="inline-flex items-center gap-1">
              <CreditCard size={14} /> Pag.
            </span>
          </NavLink>
          <NavLink
            to="/equipamentos"
            className="text-xs font-medium text-slate-600"
          >
            <span className="inline-flex items-center gap-1">
              <Cctv size={14} /> Equip.
            </span>
          </NavLink>
          <NavLink
            to="/configuracoes"
            className="text-xs font-medium text-slate-600"
          >
            <span className="inline-flex items-center gap-1">
              <Settings size={14} /> Config.
            </span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
