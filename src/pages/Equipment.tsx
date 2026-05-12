import { useEffect, useMemo, useRef, useState } from "react";
import { useHardware } from "../context/HardwareContext";
import { formatDateTime } from "../utils/date";

type CamOption = { deviceId: string; label: string };

async function safeEnumerateVideoDevices(): Promise<CamOption[]> {
  if (!navigator.mediaDevices?.enumerateDevices) return [];
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices
    .filter((d) => d.kind === "videoinput")
    .map((d, idx) => ({
      deviceId: d.deviceId,
      label: d.label || `Câmera ${idx + 1}`,
    }));
}

export default function Equipment() {
  const { gate, setGate, camera, setCamera, logs, addLog, clearLogs } =
    useHardware();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cams, setCams] = useState<CamOption[]>([]);
  const [camError, setCamError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"entry" | "exit" | null>(null);

  const selectedDeviceId = camera.preferredDeviceId ?? "";
  const selectedLabel = useMemo(() => {
    return cams.find((c) => c.deviceId === selectedDeviceId)?.label ?? "";
  }, [cams, selectedDeviceId]);

  useEffect(() => {
    let mounted = true;
    safeEnumerateVideoDevices()
      .then((opts) => {
        if (!mounted) return;
        setCams(opts);
      })
      .catch(() => {
        if (!mounted) return;
        setCams([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function start() {
      setCamError(null);
      if (!videoRef.current) return;
      if (!navigator.mediaDevices?.getUserMedia) {
        setCamError("Navegador sem suporte a câmera (getUserMedia).");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
          audio: false,
        });
        if (cancelled) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        addLog({
          kind: "camera",
          ok: true,
          message: selectedLabel
            ? `Câmera ativa: ${selectedLabel}`
            : "Câmera ativa",
        });
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Falha ao acessar a câmera.";
        setCamError(msg);
        addLog({ kind: "camera", ok: false, message: msg });
      }
    }

    start();

    return () => {
      cancelled = true;
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [selectedDeviceId, selectedLabel, addLog]);

  async function triggerGate(kind: "entry" | "exit") {
    setBusy(kind);
    const url = kind === "entry" ? gate.entryUrl.trim() : gate.exitUrl.trim();
    if (!url) {
      addLog({
        kind: kind === "entry" ? "gate_entry" : "gate_exit",
        ok: false,
        message: "URL da cancela não configurada.",
      });
      setBusy(null);
      return;
    }
    try {
      const res = await fetch(url, { method: "POST" });
      const ok = res.ok;
      addLog({
        kind: kind === "entry" ? "gate_entry" : "gate_exit",
        ok,
        message: ok ? "Comando enviado com sucesso." : `HTTP ${res.status}`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Falha ao chamar a cancela.";
      addLog({
        kind: kind === "entry" ? "gate_entry" : "gate_exit",
        ok: false,
        message: msg,
      });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">
        Equipamentos (câmeras e cancelas)
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Configuração e testes locais (sem backend).
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Câmera</div>
          <p className="mt-1 text-xs text-slate-500">
            Dica: alguns navegadores só mostram os nomes das câmeras após permitir
            acesso.
          </p>

          <div className="mt-3">
            <label className="text-sm font-medium text-slate-700">
              Dispositivo
            </label>
            <select
              value={selectedDeviceId}
              onChange={(e) =>
                setCamera({
                  ...camera,
                  preferredDeviceId: e.target.value || undefined,
                })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
            >
              <option value="">Automático</option>
              {cams.map((c) => (
                <option key={c.deviceId} value={c.deviceId}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {camError ? (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {camError}
            </div>
          ) : null}

          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-100 bg-slate-950">
            <video
              ref={videoRef}
              playsInline
              muted
              className="aspect-video w-full object-cover"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Cancelas</div>
          <p className="mt-1 text-xs text-slate-500">
            Configure uma URL que aceite `POST` (ex.: controlador local, ESP32,
            servidor da cancela).
          </p>

          <div className="mt-3 space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                URL cancela de entrada
              </label>
              <input
                value={gate.entryUrl}
                onChange={(e) => setGate({ ...gate, entryUrl: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
                placeholder="http://192.168.0.10:8080/entry/open"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                URL cancela de saída
              </label>
              <input
                value={gate.exitUrl}
                onChange={(e) => setGate({ ...gate, exitUrl: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-600"
                placeholder="http://192.168.0.10:8080/exit/open"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                disabled={busy === "entry"}
                onClick={() => triggerGate("entry")}
                className="sp-btn-primary disabled:opacity-60"
              >
                Testar entrada
              </button>
              <button
                type="button"
                disabled={busy === "exit"}
                onClick={() => triggerGate("exit")}
                className="sp-btn-primary disabled:opacity-60"
              >
                Testar saída
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Logs</div>
            <button
              type="button"
              onClick={clearLogs}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Limpar
            </button>
          </div>
          <div className="mt-2 max-h-56 overflow-auto rounded-2xl border border-slate-100 bg-white">
            {logs.length === 0 ? (
              <div className="p-3 text-sm text-slate-600">
                Sem logs de equipamentos.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 text-sm">
                {logs.map((l) => (
                  <li key={l.id} className="px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-slate-900">
                        {l.kind === "gate_entry"
                          ? "Cancela entrada"
                          : l.kind === "gate_exit"
                            ? "Cancela saída"
                            : "Câmera"}
                      </div>
                      <div
                        className={`text-xs font-semibold ${l.ok ? "text-green-700" : "text-red-700"}`}
                      >
                        {l.ok ? "OK" : "ERRO"}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {formatDateTime(l.at)}
                    </div>
                    <div className="mt-1 text-xs text-slate-600">
                      {l.message}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
