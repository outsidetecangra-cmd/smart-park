import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import SmartParkLogo from "../components/SmartParkLogo";

export default function Landing() {
  return (
    <div className="min-h-full bg-transparent">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <header className="flex items-center justify-between">
          <div />
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="sp-btn-primary px-5 py-2.5"
            >
              <LogIn size={18} /> Entrar
            </Link>
          </div>
        </header>

        <section className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-6">
              <SmartParkLogo variant="light" size="hero" showText={false} />
            </div>
            <h1 className="sp-hero-3d text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Controle seu estacionamento de forma simples e inteligente.
            </h1>
            <p className="mt-4 text-lg text-slate-100/90">
              Um MVP profissional para cadastrar vagas, registrar entradas e
              saídas e acompanhar tudo em um painel moderno.
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="sp-card p-8">
              <div className="text-sm font-semibold text-slate-900">
                Smart Park
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Gestão inteligente para estacionamentos
              </div>
              <div className="mt-6 grid gap-3">
                {[
                  "Mapa de vagas em tempo real",
                  "Entrada e saída com pagamento",
                  "Relatórios gerenciais (mock)",
                ].map((t) => (
                  <div
                    key={t}
                    className="rounded-2xl border border-border bg-white/60 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    {t}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link to="/login" className="sp-btn-primary w-full">
                  <LogIn size={18} /> Entrar agora
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
