import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { ParkingProvider } from "./context/ParkingContext";
import { HardwareProvider } from "./context/HardwareContext";

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
