import { NavLink } from "react-router-dom";
import { ArrowRight, DoorClosed, DoorOpen } from "lucide-react";

export default function Movements() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Entradas e Saídas</h1>
      <p className="mt-1 text-sm text-slate-600">
        Registre movimentações rapidamente.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="sp-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <DoorOpen size={18} className="text-brand-600" /> Nova Entrada
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Registrar veículo e selecionar vaga.
              </div>
            </div>
            <NavLink to="/movimentacoes/entrada" className="sp-btn-primary">
              Iniciar <ArrowRight size={16} />
            </NavLink>
          </div>
        </div>

        <div className="sp-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <DoorClosed size={18} className="text-brand-600" /> Registrar
                Saída
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Confirmar pagamento e liberar vaga.
              </div>
            </div>
            <NavLink to="/movimentacoes/saida" className="sp-btn-primary">
              Iniciar <ArrowRight size={16} />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

