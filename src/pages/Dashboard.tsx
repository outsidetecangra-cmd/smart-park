import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Car,
  DollarSign,
  MapPinned,
  ParkingCircle,
  Timer,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useParking } from "../context/ParkingContext";
import { formatSpotLabel } from "../utils/spot";

function formatMoneyBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

type MockVehicle = {
  plate: string;
  model: string;
  color: string;
  type: "car" | "motorcycle" | "van";
  driverName: string;
  driverPhone: string;
  entryAt: string;
};

type MockSpot = {
  id: string;
  number: number;
  label: string;
  status: "available" | "occupied" | "reserved";
  vehicle?: MockVehicle;
};

function vehicleTypeLabel(t: MockVehicle["type"]): string {
  if (t === "car") return "Carro";
  if (t === "van") return "Caminhonete";
  return "Moto";
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]!;
}

function genPlate(rand: () => number): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const L = () => letters[Math.floor(rand() * letters.length)]!;
  const D = () => String(Math.floor(rand() * 10));
  return `${L()}${L()}${L()}${D()}${L()}${D()}${D()}`;
}

export default function Dashboard() {
  const { spots, activeVehicles, history } = useParking();
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [autoHideKey, setAutoHideKey] = useState(0);
  const [mockBaseNow] = useState(() => Date.now());

  const totalSpots = 80;
  const occupiedCount = 47;
  const availableCount = 33;
  const revenueTodayCents = 128000;
  const vehiclesToday = 126;

  const latest = useMemo(() => {
    const rows = [
      ...activeVehicles.slice(0, 4).map((v) => ({
        id: v.id,
        title: v.model || "Veículo",
        subtitle: `${v.plate} • Entrada`,
        at: new Date(v.entryAt).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
      ...history.slice(0, 4).map((h) => ({
        id: h.id,
        title: h.model || "Veículo",
        subtitle: `${h.plate} • Saída`,
        at: new Date(h.exitAt).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    ];
    return rows.slice(0, 6);
  }, [activeVehicles, history]);

  const grid = useMemo<MockSpot[]>(() => {
    const rand = mulberry32(1337);
    const models = [
      "Honda Civic",
      "Fiat Argo",
      "Toyota Corolla",
      "VW Polo",
      "Jeep Renegade",
      "Onix",
      "HB20",
      "Moto Honda CG",
      "Yamaha Fazer",
      "Ford Ranger",
      "Hilux",
      "Tracker",
    ];
    const colors = ["Prata", "Preto", "Branco", "Cinza", "Vermelho", "Azul"];
    const names = [
      "Rafael Souza",
      "Mariana Lima",
      "Carlos Nunes",
      "Ana Beatriz",
      "Diego Martins",
      "Paula Azevedo",
      "Fernanda Reis",
      "Bruno Silva",
      "Juliana Costa",
      "Guilherme Alves",
    ];
    const phones = [
      "(11) 99999-1111",
      "(11) 98888-2222",
      "(11) 97777-3333",
      "(11) 96666-4444",
    ];

    const occupiedIndexes = new Set<number>();
    while (occupiedIndexes.size < 14) occupiedIndexes.add(Math.floor(rand() * totalSpots));

    const reservedIndexes = new Set<number>();
    while (reservedIndexes.size < 6) {
      const idx = Math.floor(rand() * totalSpots);
      if (!occupiedIndexes.has(idx)) reservedIndexes.add(idx);
    }

    return Array.from({ length: totalSpots }).map((_, i) => {
      const real = spots[i];
      const number = real?.number ?? i + 1;
      const status: MockSpot["status"] = occupiedIndexes.has(i)
        ? "occupied"
        : reservedIndexes.has(i)
          ? "reserved"
          : "available";

      const vehicle =
        status === "occupied"
          ? ({
              plate: genPlate(rand),
              model: pick(rand, models),
              color: pick(rand, colors),
              type: pick(rand, ["car", "van"]),
              driverName: pick(rand, names),
              driverPhone: pick(rand, phones),
              entryAt: new Date(
                mockBaseNow - Math.floor(rand() * 6 * 60) * 60_000,
              ).toISOString(),
            } satisfies MockVehicle)
          : undefined;

      return {
        id: real?.id ?? `mock_${i}`,
        number,
        label: formatSpotLabel(number, "A"),
        status,
        vehicle,
      };
    });
  }, [spots, mockBaseNow]);

  const selectedMock = useMemo(() => {
    if (!selectedSpotId) return null;
    return grid.find((g) => g.id === selectedSpotId) ?? null;
  }, [selectedSpotId, grid]);

  useEffect(() => {
    if (!selectedSpotId) return;
    const t = window.setTimeout(() => setSelectedSpotId(null), 30_000);
    return () => window.clearTimeout(t);
  }, [selectedSpotId, autoHideKey]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Painel de Controle
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Visão geral do estacionamento hoje.
          </p>
        </div>
        <Link to="/movimentacoes" className="sp-btn-primary">
          Nova Entrada <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Vagas Totais",
            value: String(totalSpots),
            Icon: ParkingCircle,
            tone: "text-slate-900",
            chip: "Mapa atualizado",
          },
          {
            label: "Vagas Ocupadas",
            value: String(occupiedCount),
            Icon: Car,
            tone: "text-red-600",
            chip: "Alta demanda",
          },
          {
            label: "Vagas Livres",
            value: String(availableCount),
            Icon: ParkingCircle,
            tone: "text-emerald-600",
            chip: "Disponível",
          },
          {
            label: "Receita do Dia",
            value: formatMoneyBRL(revenueTodayCents),
            Icon: DollarSign,
            tone: "text-brand-600",
            chip: "+12% vs ontem",
          },
          {
            label: "Veículos Hoje",
            value: String(vehiclesToday),
            Icon: Timer,
            tone: "text-slate-900",
            chip: "Fluxo contínuo",
          },
        ].map(({ label, value, Icon, tone, chip }) => (
          <div key={label} className="sp-card p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-500">{label}</div>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600/10 text-brand-600">
                <Icon size={18} />
              </div>
            </div>
            <div className={`mt-2 text-2xl font-semibold ${tone}`}>{value}</div>
            <div className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
              {chip}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="sp-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-slate-900">
              Mapa de Vagas
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <MapPinned size={14} /> Setor A
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                {grid.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (s.status !== "occupied") return;
                      setSelectedSpotId(s.id);
                      setAutoHideKey((k) => k + 1);
                    }}
                    className={`group rounded-xl border px-2 py-2 text-left text-xs font-semibold transition ${
                      s.status === "available"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        : s.status === "occupied"
                          ? "border-red-200 bg-red-50 text-red-800 hover:bg-red-100"
                          : "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{s.label}</span>
                      <span className="opacity-60 group-hover:opacity-100">
                        {s.status === "occupied" ? "🚗" : "P"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Vaga
                  Livre
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-red-800 ring-1 ring-red-200">
                  <span className="h-2 w-2 rounded-full bg-red-500" /> Vaga
                  Ocupada
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-amber-900 ring-1 ring-amber-200">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Reservada
                </span>
              </div>
            </div>

            <div className="sp-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Detalhes da vaga
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Clique em uma vaga ocupada.
                  </div>
                </div>
                {selectedMock ? (
                  <button
                    type="button"
                    onClick={() => setSelectedSpotId(null)}
                    className="rounded-xl border border-border bg-white p-2 text-slate-600 hover:bg-slate-50"
                    aria-label="Fechar"
                  >
                    <X size={16} />
                  </button>
                ) : null}
              </div>

              {!selectedMock ? (
                <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                  Nenhuma vaga selecionada.
                </div>
              ) : (
                <div className="mt-3 grid gap-3">
                  <div className="flex items-center justify-between rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-800 ring-1 ring-red-200">
                    <span>Vaga #{selectedMock.number}</span>
                    <span>Ocupada</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="text-xs font-semibold text-slate-500">
                        Placa
                      </div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">
                        {selectedMock.vehicle?.plate ?? "—"}
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="text-xs font-semibold text-slate-500">
                        Modelo
                      </div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">
                        {selectedMock.vehicle?.model ?? "—"}
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="text-xs font-semibold text-slate-500">
                        Cor / Tipo
                      </div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">
                        {selectedMock.vehicle
                          ? `${selectedMock.vehicle.color} • ${vehicleTypeLabel(selectedMock.vehicle.type)}`
                          : "—"}
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="text-xs font-semibold text-slate-500">
                        Entrada
                      </div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">
                        {selectedMock.vehicle?.entryAt
                          ? new Date(selectedMock.vehicle.entryAt).toLocaleString(
                              "pt-BR",
                            )
                          : "—"}
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="text-xs font-semibold text-slate-500">
                        Cliente
                      </div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">
                        {selectedMock.vehicle?.driverName ?? "—"}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-slate-500">
                        {selectedMock.vehicle?.driverPhone ?? ""}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    O card fecha automaticamente em 30s.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* legenda foi movida para dentro do grid acima */}
        </div>

        <div className="sp-card p-5">
          <div className="text-sm font-semibold text-slate-900">
            Última entrada
          </div>
          {latest.length === 0 ? (
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              Nenhum movimento ainda. Use “Nova Entrada”.
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {latest.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {m.title}
                    </div>
                    <div className="text-xs text-slate-500">{m.subtitle}</div>
                  </div>
                  <div className="text-xs font-semibold text-slate-600">
                    {m.at}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
