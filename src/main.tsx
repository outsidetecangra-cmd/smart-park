import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { ParkingProvider } from "./context/ParkingContext";
import { HardwareProvider } from "./context/HardwareContext";

// GitHub Pages SPA support: restore path from ?p=...
try {
  const url = new URL(window.location.href);
  const p = url.searchParams.get("p");
  if (p) {
    url.searchParams.delete("p");
    const restored = decodeURIComponent(p);
    window.history.replaceState({}, "", restored);
  }
} catch {
  // ignore
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ParkingProvider>
        <HardwareProvider>
          <App />
        </HardwareProvider>
      </ParkingProvider>
    </AuthProvider>
  </StrictMode>,
);
