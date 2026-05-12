import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  Car,
  DoorOpen,
  Gauge,
  Settings,
  SquareParking,
  Users,
} from "lucide-react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sp_sidebar_collapsed") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("sp_sidebar_collapsed", collapsed ? "1" : "0");
    } catch {
      // ignore
    }
  }, [collapsed]);

  return (
    <div className="min-h-full bg-transparent pb-20 md:pb-0">
      <div className="mx-auto flex min-h-full w-full max-w-7xl gap-6 px-4 py-6">
        <Sidebar collapsed={collapsed} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Header
            sidebarCollapsed={collapsed}
            onToggleSidebar={() => setCollapsed((v) => !v)}
          />
          <main className="min-w-0 flex-1 rounded-2xl bg-white/70 p-4 shadow-soft backdrop-blur sm:p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-white/90 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-2xl grid-cols-5 gap-1 px-2 py-2">
          {[
            { to: "/dashboard", label: "Painel", Icon: Gauge },
            { to: "/veiculos", label: "Veículos", Icon: Car },
            { to: "/vagas", label: "Vagas", Icon: SquareParking },
            { to: "/movimentacoes", label: "Mov.", Icon: DoorOpen },
            { to: "/clientes", label: "Clientes", Icon: Users },
          ].map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition ${
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 pb-2">
          <NavLink to="/relatorios" className="text-xs font-medium text-slate-600">
            <span className="inline-flex items-center gap-1">
              <BarChart3 size={14} /> Rel.
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
