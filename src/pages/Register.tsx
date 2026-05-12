import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      isValidEmail(email) &&
      password.length >= 6 &&
      confirmPassword === password &&
      !loading
    );
  }, [name, email, password, confirmPassword, loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) return setError("Informe seu nome.");
    if (!isValidEmail(email)) return setError("Informe um email válido.");
    if (password.length < 6)
      return setError("A senha deve ter pelo menos 6 caracteres.");
    if (confirmPassword !== password) return setError("As senhas não conferem.");

    setLoading(true);
    try {
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      if (!res.ok) {
        setError(res.error ?? "Não foi possível criar a conta.");
        return;
      }
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-md px-4 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-white shadow-soft backdrop-blur">
          <div className="text-sm font-semibold text-white/90">Smart Park</div>
          <h1 className="mt-1 text-2xl font-semibold text-white">Criar conta</h1>
          <p className="mt-2 text-sm text-slate-200">
            Cadastro simples para acesso ao painel.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-sm font-medium text-slate-200">Nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white outline-none placeholder:text-slate-300 focus:border-blue-400"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-200">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white outline-none placeholder:text-slate-300 focus:border-blue-400"
                placeholder="voce@empresa.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-200">
                Telefone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white outline-none placeholder:text-slate-300 focus:border-blue-400"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-200">
                  Senha
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white outline-none placeholder:text-slate-300 focus:border-blue-400"
                  placeholder="••••••"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-200">
                  Confirmar
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-white outline-none placeholder:text-slate-300 focus:border-blue-400"
                  placeholder="••••••"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full sp-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Criando..." : "Criar conta"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-200">
            Já tem conta?{" "}
            <Link className="font-semibold text-white hover:text-white/90" to="/login">
              Entrar
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
