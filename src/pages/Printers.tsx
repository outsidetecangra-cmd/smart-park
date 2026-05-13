import { useEffect, useMemo, useState } from "react";
import { Printer, RefreshCw, Send } from "lucide-react";
import { storageGet, storageSet } from "../utils/storage";

type PrinterInfo = {
  Name: string;
  DriverName?: string;
  PortName?: string;
  Shared?: boolean;
  Default?: boolean;
};

const LS_PRINTER = "sp_printer_selected_v1";
const AGENT_URL = "http://localhost:3199";

export default function Printers() {
  const [loading, setLoading] = useState(false);
  const [printers, setPrinters] = useState<PrinterInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(() => {
    return storageGet<string>(LS_PRINTER) ?? "";
  });
  const [testText, setTestText] = useState(
    "SMART PARK\nCupom de teste\n-------------------------\nSe saiu, imprimiu.\n",
  );

  const defaultPrinter = useMemo(
    () => printers.find((p) => p.Default)?.Name ?? "",
    [printers],
  );

  async function loadPrinters() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${AGENT_URL}/printers`);
      const data = (await res.json()) as
        | { ok: true; printers: PrinterInfo[] }
        | { ok: false; error: string };
      if (!data.ok) throw new Error(data.error);
      setPrinters(data.printers || []);
    } catch (e) {
      setError(
        "Não foi possível conectar no Printer Agent. Inicie em `printer-agent` com `npm install` e `npm run dev`.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrinters();
  }, []);

  useEffect(() => {
    storageSet(LS_PRINTER, selected);
  }, [selected]);

  async function testPrint() {
    setLoading(true);
    setError(null);
    try {
      const payload: { content: string; printerName?: string } = {
        content: testText,
      };
      if (selected) payload.printerName = selected;
      const res = await fetch(`${AGENT_URL}/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as
        | { ok: true }
        | { ok: false; error: string };
      if (!data.ok) throw new Error(data.error);
    } catch (e) {
      setError((e instanceof Error ? e.message : "") || "Falha ao imprimir.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Impressoras</h1>
          <p className="mt-1 text-sm text-slate-600">
            Plug and play via Printer Agent (Windows) usando a impressora padrão
            do sistema.
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="sp-card p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-semibold text-slate-900">
              Detectadas
            </div>
            <button
              type="button"
              className="sp-btn-ghost"
              onClick={loadPrinters}
              disabled={loading}
            >
              <RefreshCw size={16} /> Atualizar
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Impressora selecionada (opcional)
            </label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="sp-input"
            >
              <option value="">
                Usar a padrão do Windows
                {defaultPrinter ? ` (${defaultPrinter})` : ""}
              </option>
              {printers.map((p) => (
                <option key={p.Name} value={p.Name}>
                  {p.Name}
                </option>
              ))}
            </select>
            <div className="mt-2 text-xs text-slate-500">
              Dica: para cupom 58/80mm, configure o tamanho no driver do Windows.
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            {printers.length ? (
              printers.map((p) => (
                <div
                  key={p.Name}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white px-3 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Printer size={16} className="text-slate-500" />
                      <div className="truncate font-semibold text-slate-900">
                        {p.Name}
                      </div>
                      {p.Default ? (
                        <span className="sp-badge bg-blue-50 text-blue-700 ring-1 ring-blue-200">
                          Padrão
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {p.DriverName ? `Driver: ${p.DriverName}` : "Driver: —"} •{" "}
                      {p.PortName ? `Porta: ${p.PortName}` : "Porta: —"}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="sp-btn-ghost px-3 py-2"
                    onClick={() => setSelected(p.Name)}
                  >
                    Usar
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Nenhuma impressora encontrada pelo Agent.
              </div>
            )}
          </div>
        </section>

        <section className="sp-card p-4">
          <div className="text-sm font-semibold text-slate-900">Teste</div>
          <p className="mt-1 text-sm text-slate-600">
            Envia um cupom simples para a impressora selecionada.
          </p>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
            rows={10}
          />
          <button
            type="button"
            className="mt-3 w-full sp-btn-primary"
            disabled={loading}
            onClick={testPrint}
          >
            <Send size={16} /> Imprimir teste
          </button>
        </section>
      </div>
    </div>
  );
}

