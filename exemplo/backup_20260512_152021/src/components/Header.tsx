import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user } = useAuth();
  return (
    <header className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-soft">
      <div>
        <div className="text-sm font-semibold text-slate-900">Painel</div>
        <div className="text-xs text-slate-500">Bem-vindo, {user?.name}</div>
      </div>
      <div className="text-xs text-slate-500">Gusman Park</div>
    </header>
  );
}
