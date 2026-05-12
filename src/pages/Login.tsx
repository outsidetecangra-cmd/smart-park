import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SmartParkLogo from "../components/SmartParkLogo";
import { useAuth } from "../context/AuthContext";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  const [email, setEmail] = useState("admin@estacionamento.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return isValidEmail(email) && password.trim().length >= 6 && !loading;
  }, [email, password, loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Informe um email válido.");
      return;
    }
    if (password.trim().length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const ok = await login(email.trim(), password);
      if (!ok) {
        setError("Email ou senha inválidos.");
        return;
      }
      navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full bg-transparent">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="max-w-md">
            <SmartParkLogo />
            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-900">
              Acesse sua conta
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Gerencie seu estacionamento com inteligência, dados e automação.
            </p>
            <div className="mt-8 grid gap-3">
              {[
                "Painel premium e responsivo",
                "Mapa de vagas em tempo real",
                "Movimentações com pagamento",
              ].map((t) => (
                <div
                  key={t}
                  className="rounded-2xl border border-border bg-white/60 px-4 py-3 text-sm font-semibold text-slate-700 backdrop-blur"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="sp-card p-6">
            <div className="lg:hidden">
              <SmartParkLogo />
            </div>
            <div className="mt-3 text-sm font-semibold text-slate-900">
              Acesse sua conta
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Gerencie seu estacionamento com inteligência
            </div>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="sp-input mt-1"
                  placeholder="voce@empresa.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Senha
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="sp-input mt-1"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  to="#"
                  className="text-sm font-semibold text-brand-600 hover:underline"
                >
                  Esqueci minha senha
                </Link>
                <span className="text-xs font-semibold text-slate-500">
                  Demo: admin@estacionamento.com
                </span>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full sp-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-600">
              Não tem conta?{" "}
              <Link className="font-semibold text-brand-600" to="/cadastro">
                Criar conta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
