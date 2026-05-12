import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="min-h-full bg-slate-50">
      <div className="mx-auto w-full max-w-md px-4 py-12">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="text-sm font-semibold text-slate-900">Gusman Park</div>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Criar conta
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Cadastro simples para acesso ao painel.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-sm font-medium text-slate-700">Nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
                placeholder="voce@empresa.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Telefone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Senha
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
                  placeholder="••••••"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Confirmar
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
                  placeholder="••••••"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Criando..." : "Criar conta"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-600">
            Já tem conta?{" "}
            <Link className="font-semibold text-blue-700" to="/login">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
