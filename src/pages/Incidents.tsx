import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ImagePlus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useParking } from "../context/ParkingContext";
import type { IncidentDamage, IncidentDamageType, IncidentPhoto } from "../types";

type AnalysisPreset = {
  type: IncidentDamageType;
  severity: "leve" | "moderado" | "grave";
  location: string;
};

const PRESETS: AnalysisPreset[] = [
  { type: "arranhao", severity: "leve", location: "Para-choque dianteiro" },
  { type: "amassado", severity: "moderado", location: "Porta dianteira direita" },
  { type: "arranhao", severity: "moderado", location: "Lateral esquerda" },
  { type: "vidro", severity: "grave", location: "Para-brisa" },
  { type: "quebra", severity: "moderado", location: "Lanterna traseira" },
  { type: "pneu", severity: "leve", location: "Pneu dianteiro esquerdo" },
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function toDataUrlFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(file);
  });
}

export default function Incidents() {
  const { findActiveByPlate, addIncidentReport } = useParking();
  const [searchParams] = useSearchParams();

  const [plate, setPlate] = useState("");
  const [summary, setSummary] = useState("");
  const [damages, setDamages] = useState<IncidentDamage[]>([]);
  const [photos, setPhotos] = useState<IncidentPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const normalizedPlate = useMemo(() => plate.trim().toUpperCase(), [plate]);
  const vehicle = useMemo(() => {
    if (!normalizedPlate) return null;
    return findActiveByPlate(normalizedPlate);
  }, [findActiveByPlate, normalizedPlate]);

  useEffect(() => {
    const p = searchParams.get("placa");
    if (p) setPlate(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startCamera() {
    setError(null);
    setSuccess(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Câmera não suportada neste navegador.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch {
      setError("Não foi possível acessar a câmera. Verifique as permissões.");
    }
  }

  function stopCamera() {
    const stream = streamRef.current;
    if (stream) {
      for (const track of stream.getTracks()) track.stop();
    }
    streamRef.current = null;
    setCameraOn(false);
  }

  function capturePhoto() {
    setError(null);
    setSuccess(null);
    const video = videoRef.current;
    if (!video) return;
    if (!video.videoWidth || !video.videoHeight) return;
    const canvas = document.createElement("canvas");
    canvas.width = Math.min(video.videoWidth, 1280);
    canvas.height = Math.round((canvas.width * video.videoHeight) / video.videoWidth);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const photo: IncidentPhoto = {
      id: `ph_${crypto.randomUUID()}`,
      dataUrl,
      capturedAt: new Date().toISOString(),
    };
    setPhotos((prev) => [photo, ...prev].slice(0, 6));
    setSuccess("Foto capturada.");
  }

  async function onPickFiles(files: FileList | null) {
    setError(null);
    setSuccess(null);
    if (!files?.length) return;
    try {
      const picked = await Promise.all(
        Array.from(files)
          .slice(0, 6)
          .map(async (f) => {
            const dataUrl = await toDataUrlFromFile(f);
            const photo: IncidentPhoto = {
              id: `ph_${crypto.randomUUID()}`,
              dataUrl,
              capturedAt: new Date().toISOString(),
            };
            return photo;
          }),
      );
      setPhotos((prev) => [...picked, ...prev].slice(0, 6));
      setSuccess("Imagens adicionadas.");
    } catch {
      setError("Não foi possível adicionar as imagens.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  function addDamage(damage: Omit<IncidentDamage, "id">) {
    setDamages((prev) => [
      { id: `dmg_${crypto.randomUUID()}`, ...damage },
      ...prev,
    ]);
  }

  function removeDamage(id: string) {
    setDamages((prev) => prev.filter((d) => d.id !== id));
  }

  async function runAnalysisMock() {
    setError(null);
    setSuccess(null);
    if (!vehicle) {
      setError("Informe uma placa ativa para analisar.");
      return;
    }
    setAnalyzing(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      const amount = photos.length ? Math.min(3, Math.max(1, Math.ceil(photos.length / 2))) : 1;
      const next: IncidentDamage[] = Array.from({ length: amount }).map(() => {
        const preset = randomFrom(PRESETS);
        return {
          id: `dmg_${crypto.randomUUID()}`,
          type: preset.type,
          severity: preset.severity,
          location: preset.location,
        };
      });
      setDamages((prev) => [...next, ...prev].slice(0, 8));
      setSuccess("Análise concluída (mock).");
    } finally {
      setAnalyzing(false);
    }
  }

  function saveIncident() {
    setError(null);
    setSuccess(null);
    if (!vehicle) {
      setError("Placa não encontrada entre os veículos estacionados.");
      return;
    }
    const res = addIncidentReport({
      plate: vehicle.plate,
      report: {
        summary: summary.trim() || undefined,
        damages,
        photos,
      },
    });
    if (!res.ok) {
      setError(res.error ?? "Não foi possível salvar o sinistro.");
      return;
    }
    setSuccess("Sinistro registrado no veículo.");
    setSummary("");
    setDamages([]);
    setPhotos([]);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Sinistro</h1>
          <p className="mt-1 text-sm text-slate-600">
            Registro de avarias com fotos (câmera) e análise simulada.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="sp-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold text-slate-900">Veículo</div>
            <span className="text-xs text-slate-500">
              Dica: use uma placa ativa (ex.: a que está ocupando uma vaga)
            </span>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label className="text-sm font-medium text-slate-700">Placa</label>
              <input
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="sp-input mt-1"
                placeholder="ABC1D23"
              />
            </div>
            <button
              type="button"
              className="sp-btn-primary sm:mb-[2px]"
              onClick={runAnalysisMock}
              disabled={analyzing}
            >
              <Sparkles size={16} />
              {analyzing ? "Analisando..." : "Analisar (mock)"}
            </button>
          </div>

          {vehicle ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/60 p-4 shadow-soft">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-slate-900">{vehicle.plate}</div>
                <span className="sp-badge bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                  Estacionado
                </span>
              </div>
              <div className="mt-1 text-sm text-slate-700">{vehicle.model}</div>
              <div className="mt-2 text-xs text-slate-500">
                Cor: {vehicle.color || "—"} • Entrada: {new Date(vehicle.entryAt).toLocaleString("pt-BR")}
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Relatórios já existentes: {vehicle.incidentReports?.length ?? 0}
              </div>
            </div>
          ) : normalizedPlate ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              Placa não encontrada como veículo ativo.
            </div>
          ) : null}

          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700">Resumo</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
              rows={3}
              placeholder="Ex.: pequeno arranhão na lateral esquerda, registrado na entrada."
            />
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              <CheckCircle2 size={16} /> {success}
            </div>
          ) : null}
        </section>

        <section className="sp-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold text-slate-900">
              Câmeras / Fotos
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="sp-btn-ghost"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus size={16} /> Adicionar imagens
              </button>
              {!cameraOn ? (
                <button type="button" className="sp-btn-primary" onClick={startCamera}>
                  <Camera size={16} /> Ligar câmera
                </button>
              ) : (
                <button type="button" className="sp-btn-ghost" onClick={stopCamera}>
                  Desligar
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => onPickFiles(e.target.files)}
            />
          </div>

          {cameraOn ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-black/80">
              <video ref={videoRef} className="h-64 w-full object-cover" playsInline muted />
              <div className="flex items-center justify-between gap-2 bg-white/80 px-3 py-2 backdrop-blur">
                <div className="text-xs text-slate-700">
                  Dica: em alguns celulares o navegador pede permissão.
                </div>
                <button type="button" className="sp-btn-primary" onClick={capturePhoto}>
                  <Camera size={16} /> Capturar
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Conecte uma câmera (no navegador) ou envie fotos do veículo para registrar
              o sinistro.
            </div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {photos.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-white">
                <div className="relative">
                  <img src={p.dataUrl} alt="Foto do veículo" className="h-36 w-full object-cover" />
                  <button
                    type="button"
                    className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-xl bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur hover:bg-black/70"
                    onClick={() => removePhoto(p.id)}
                    title="Remover foto"
                  >
                    <Trash2 size={14} /> Remover
                  </button>
                </div>
                <div className="px-3 py-2 text-xs text-slate-600">
                  {new Date(p.capturedAt).toLocaleString("pt-BR")}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-4 sp-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold text-slate-900">
            Avarias detectadas
          </div>
          <button
            type="button"
            className="sp-btn-primary"
            onClick={() =>
              addDamage({
                type: "outro",
                severity: "leve",
                location: "Não informado",
                note: "Ajuste este item conforme necessário.",
              })
            }
          >
            <AlertTriangle size={16} /> Adicionar manual
          </button>
        </div>

        {damages.length ? (
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {damages.map((d) => (
              <div
                key={d.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-white px-3 py-3"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900">
                    {d.type.replace("arranhao", "arranhão")}
                    <span className="ml-2 text-xs font-semibold text-slate-500">
                      ({d.severity})
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-slate-700">{d.location}</div>
                  {d.note ? (
                    <div className="mt-1 text-xs text-slate-500">{d.note}</div>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="sp-btn-ghost px-3 py-2"
                  onClick={() => removeDamage(d.id)}
                  title="Remover"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Nenhuma avaria registrada ainda. Use “Analisar (mock)” ou adicione manualmente.
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            className="sp-btn-ghost"
            onClick={() => {
              setDamages([]);
              setPhotos([]);
              setSummary("");
              setError(null);
              setSuccess(null);
            }}
          >
            Limpar
          </button>
          <button type="button" className="sp-btn-primary" onClick={saveIncident}>
            Salvar sinistro no veículo
          </button>
        </div>
      </section>
    </div>
  );
}
