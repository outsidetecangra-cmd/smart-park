/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  ParkingSpot,
  Payment,
  PaymentMethod,
  Settings,
  Vehicle,
  VehicleHistory,
} from "../types";
import { storageGet, storageSet } from "../utils/storage";
import { createInitialSpots, DEFAULT_SETTINGS } from "../data/mockData";
import { diffMinutes, nowIso } from "../utils/date";
import { calcPriceCents } from "../utils/pricing";

type ParkingState = {
  settings: Settings;
  spots: ParkingSpot[];
  activeVehicles: Vehicle[];
  history: VehicleHistory[];
  payments: Payment[];
  setSettings: (next: Settings) => void;
  setSpots: (next: ParkingSpot[]) => void;
  setActiveVehicles: (next: Vehicle[]) => void;
  setHistory: (next: VehicleHistory[]) => void;
  setPayments: (next: Payment[]) => void;
  registerEntry: (params: {
    plate: string;
    model: string;
    color: string;
    type: Vehicle["type"];
    driverName?: string;
    driverPhone?: string;
    spotId: string;
  }) => { ok: boolean; error?: string };
  findActiveByPlate: (plate: string) => Vehicle | null;
  estimateExit: (vehicle: Vehicle) => {
    totalMinutes: number;
    totalHoursRoundedUp: number;
    totalCents: number;
  };
  confirmExit: (plate: string) => { ok: boolean; error?: string };
  confirmExitWithPayment: (params: {
    plate: string;
    method: PaymentMethod;
  }) => { ok: boolean; error?: string };
};

const LS_SETTINGS = "gp_settings_v1";
const LS_SPOTS = "gp_spots_v1";
const LS_ACTIVE = "gp_active_v1";
const LS_HISTORY = "gp_history_v1";
const LS_PAYMENTS = "gp_payments_v1";

const ParkingContext = createContext<ParkingState | null>(null);

export function ParkingProvider(props: { children: ReactNode }) {
  const { children } = props;

  const [settings, setSettingsState] = useState<Settings>(() => {
    return storageGet<Settings>(LS_SETTINGS) ?? DEFAULT_SETTINGS;
  });
  const [spots, setSpots] = useState<ParkingSpot[]>(() => {
    return (
      storageGet<ParkingSpot[]>(LS_SPOTS) ??
      createInitialSpots(DEFAULT_SETTINGS.totalSpots)
    );
  });
  const [activeVehicles, setActiveVehicles] = useState<Vehicle[]>(() => {
    return storageGet<Vehicle[]>(LS_ACTIVE) ?? [];
  });
  const [history, setHistory] = useState<VehicleHistory[]>(() => {
    return storageGet<VehicleHistory[]>(LS_HISTORY) ?? [];
  });
  const [payments, setPayments] = useState<Payment[]>(() => {
    return storageGet<Payment[]>(LS_PAYMENTS) ?? [];
  });

  useEffect(() => storageSet(LS_SETTINGS, settings), [settings]);
  useEffect(() => storageSet(LS_SPOTS, spots), [spots]);
  useEffect(() => storageSet(LS_ACTIVE, activeVehicles), [activeVehicles]);
  useEffect(() => storageSet(LS_HISTORY, history), [history]);
  useEffect(() => storageSet(LS_PAYMENTS, payments), [payments]);

  const setSettings = (next: Settings) => setSettingsState(next);
  const setSpotsState = (next: ParkingSpot[]) => setSpots(next);
  const setActiveVehiclesState = (next: Vehicle[]) => setActiveVehicles(next);
  const setHistoryState = (next: VehicleHistory[]) => setHistory(next);
  const setPaymentsState = (next: Payment[]) => setPayments(next);

  const findActiveByPlate = (plate: string) => {
    const normalized = plate.trim().toUpperCase();
    return activeVehicles.find((v) => v.plate === normalized) ?? null;
  };

  const estimateExit = (vehicle: Vehicle) => {
    const totalMinutes = diffMinutes(vehicle.entryAt, nowIso());
    const pricing = calcPriceCents({
      totalMinutes,
      firstHourCents: settings.firstHourCents,
      additionalHourCents: settings.additionalHourCents,
    });
    return { totalMinutes, ...pricing };
  };

  const registerEntry: ParkingState["registerEntry"] = (params) => {
    const plate = params.plate.trim().toUpperCase();
    if (!plate) return { ok: false, error: "Informe a placa." };
    if (findActiveByPlate(plate)) {
      return { ok: false, error: "Já existe um veículo ativo com esta placa." };
    }
    const spot = spots.find((s) => s.id === params.spotId);
    if (!spot) return { ok: false, error: "Selecione uma vaga válida." };
    if (spot.status !== "available") {
      return { ok: false, error: "Esta vaga não está disponível." };
    }

    const entryAt = nowIso();
    const vehicle: Vehicle = {
      id: `veh_${crypto.randomUUID()}`,
      plate,
      model: params.model.trim(),
      color: params.color.trim(),
      type: params.type,
      driverName: params.driverName?.trim() || undefined,
      driverPhone: params.driverPhone?.trim() || undefined,
      spotId: params.spotId,
      entryAt,
    };

    setActiveVehicles((prev) => [vehicle, ...prev]);
    setSpots((prev) =>
      prev.map((s) =>
        s.id === params.spotId
          ? {
              ...s,
              status: "occupied",
              vehiclePlate: plate,
              vehicleType: params.type,
              entryAt,
            }
          : s,
      ),
    );
    return { ok: true };
  };

  const confirmExit: ParkingState["confirmExit"] = (plateRaw) => {
    const plate = plateRaw.trim().toUpperCase();
    const vehicle = findActiveByPlate(plate);
    if (!vehicle) return { ok: false, error: "Veículo não encontrado." };

    const exitAt = nowIso();
    const totalMinutes = diffMinutes(vehicle.entryAt, exitAt);
    const { totalCents } = calcPriceCents({
      totalMinutes,
      firstHourCents: settings.firstHourCents,
      additionalHourCents: settings.additionalHourCents,
    });

    const spotNumber =
      spots.find((s) => s.id === vehicle.spotId)?.number ?? -1;

    const historyItem: VehicleHistory = {
      id: `hist_${crypto.randomUUID()}`,
      plate: vehicle.plate,
      model: vehicle.model,
      spotNumber,
      entryAt: vehicle.entryAt,
      exitAt,
      totalMinutes,
      paidCents: totalCents,
    };

    setActiveVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
    setHistory((prev) => [historyItem, ...prev]);
    setSpots((prev) =>
      prev.map((s) =>
        s.id === vehicle.spotId
          ? {
              ...s,
              status: "available",
              vehiclePlate: undefined,
              vehicleType: undefined,
              entryAt: undefined,
            }
          : s,
      ),
    );

    return { ok: true };
  };

  const confirmExitWithPayment: ParkingState["confirmExitWithPayment"] = ({
    plate: plateRaw,
    method,
  }) => {
    const plate = plateRaw.trim().toUpperCase();
    if (!plate) return { ok: false, error: "Informe a placa." };
    const vehicle = findActiveByPlate(plate);
    if (!vehicle) return { ok: false, error: "Veículo não encontrado." };

    const exitAt = nowIso();
    const totalMinutes = diffMinutes(vehicle.entryAt, exitAt);
    const { totalCents } = calcPriceCents({
      totalMinutes,
      firstHourCents: settings.firstHourCents,
      additionalHourCents: settings.additionalHourCents,
    });

    const spotNumber =
      spots.find((s) => s.id === vehicle.spotId)?.number ?? -1;

    const historyId = `hist_${crypto.randomUUID()}`;
    const historyItem: VehicleHistory = {
      id: historyId,
      plate: vehicle.plate,
      model: vehicle.model,
      spotNumber,
      entryAt: vehicle.entryAt,
      exitAt,
      totalMinutes,
      paidCents: totalCents,
      paymentMethod: method,
    };

    const payment: Payment = {
      id: `pay_${crypto.randomUUID()}`,
      plate: vehicle.plate,
      amountCents: totalCents,
      method,
      paidAt: exitAt,
      historyId,
    };

    setActiveVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
    setHistory((prev) => [historyItem, ...prev]);
    setPayments((prev) => [payment, ...prev]);
    setSpots((prev) =>
      prev.map((s) =>
        s.id === vehicle.spotId
          ? {
              ...s,
              status: "available",
              vehiclePlate: undefined,
              vehicleType: undefined,
              entryAt: undefined,
            }
          : s,
      ),
    );

    return { ok: true };
  };

  const value = useMemo<ParkingState>(
    () => ({
      settings,
      spots,
      activeVehicles,
      history,
      payments,
      setSettings,
      setSpots: setSpotsState,
      setActiveVehicles: setActiveVehiclesState,
      setHistory: setHistoryState,
      setPayments: setPaymentsState,
      registerEntry,
      findActiveByPlate,
      estimateExit,
      confirmExit,
      confirmExitWithPayment,
    }),
    [settings, spots, activeVehicles, history, payments],
  );

  return (
    <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>
  );
}

export function useParking(): ParkingState {
  const ctx = useContext(ParkingContext);
  if (!ctx) throw new Error("useParking must be used within ParkingProvider");
  return ctx;
}
