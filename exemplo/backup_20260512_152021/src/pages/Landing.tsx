import { Link } from "react-router-dom";
import { ArrowRight, Gauge, LogIn, MapPinned, SquareParking } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-full">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <header className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Gusman Park</div>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white/60"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Criar conta
            </Link>
          </div>
        </header>

        <section className="mt-14 grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Controle seu estacionamento de forma simples e inteligente
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Um MVP profissional para cadastrar vagas, registrar entradas e
              saídas e acompanhar tudo em um painel moderno.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <LogIn size={18} /> Entrar
              </Link>
              <Link
                to="/cadastro"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-soft hover:bg-slate-50"
              >
                Criar conta
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-white/60"
              >
                Ver demonstração <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <div className="text-xs font-semibold text-slate-500">
              Visualização
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                { t: "Controle de vagas", Icon: SquareParking },
                { t: "Entrada e saída", Icon: LogIn },
                { t: "Mapa de localização", Icon: MapPinned },
                { t: "Painel administrativo", Icon: Gauge },
              ].map(({ t, Icon }) => (
                <div
                  key={t}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-slate-700 shadow-soft">
                      <Icon size={16} />
                    </span>
                    <span>{t}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
