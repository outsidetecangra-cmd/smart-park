/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { storageGet, storageSet } from "../utils/storage";
import { nowIso } from "../utils/date";

export type HardwareGateConfig = {
  entryUrl: string;
  exitUrl: string;
};

export type HardwareCameraConfig = {
  preferredDeviceId?: string;
};

export type HardwareLog = {
  id: string;
  at: string;
  kind: "gate_entry" | "gate_exit" | "camera";
  ok: boolean;
  message: string;
};

type HardwareState = {
  gate: HardwareGateConfig;
  camera: HardwareCameraConfig;
  logs: HardwareLog[];
  setGate: (next: HardwareGateConfig) => void;
  setCamera: (next: HardwareCameraConfig) => void;
  addLog: (log: Omit<HardwareLog, "id" | "at">) => void;
  clearLogs: () => void;
};

const LS_GATE = "gp_gate_v1";
const LS_CAMERA = "gp_camera_v1";
const LS_HW_LOGS = "gp_hw_logs_v1";

const DEFAULT_GATE: HardwareGateConfig = { entryUrl: "", exitUrl: "" };
const DEFAULT_CAMERA: HardwareCameraConfig = {};

const HardwareContext = createContext<HardwareState | null>(null);

export function HardwareProvider(props: { children: ReactNode }) {
  const { children } = props;

  const [gate, setGateState] = useState<HardwareGateConfig>(() => {
    return storageGet<HardwareGateConfig>(LS_GATE) ?? DEFAULT_GATE;
  });
  const [camera, setCameraState] = useState<HardwareCameraConfig>(() => {
    return storageGet<HardwareCameraConfig>(LS_CAMERA) ?? DEFAULT_CAMERA;
  });
  const [logs, setLogs] = useState<HardwareLog[]>(() => {
    return storageGet<HardwareLog[]>(LS_HW_LOGS) ?? [];
  });

  useEffect(() => storageSet(LS_GATE, gate), [gate]);
  useEffect(() => storageSet(LS_CAMERA, camera), [camera]);
  useEffect(() => storageSet(LS_HW_LOGS, logs), [logs]);

  const addLog: HardwareState["addLog"] = (log) => {
    const item: HardwareLog = {
      id: `hw_${crypto.randomUUID()}`,
      at: nowIso(),
      ...log,
    };
    setLogs((prev) => [item, ...prev].slice(0, 200));
  };

  const clearLogs = () => setLogs([]);

  const value = useMemo<HardwareState>(
    () => ({
      gate,
      camera,
      logs,
      setGate: setGateState,
      setCamera: setCameraState,
      addLog,
      clearLogs,
    }),
    [gate, camera, logs],
  );

  return (
    <HardwareContext.Provider value={value}>
      {children}
    </HardwareContext.Provider>
  );
}

export function useHardware(): HardwareState {
  const ctx = useContext(HardwareContext);
  if (!ctx) throw new Error("useHardware must be used within HardwareProvider");
  return ctx;
}
