import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Spots from "./pages/Spots";
import VehicleEntry from "./pages/VehicleEntry";
import VehicleExit from "./pages/VehicleExit";
import Equipment from "./pages/Equipment";
import Vehicles from "./pages/Vehicles";
import Clients from "./pages/Clients";
import Reports from "./pages/Reports";
import Movements from "./pages/Movements";
import Incidents from "./pages/Incidents";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/veiculos" element={<Vehicles />} />
          <Route path="/vagas" element={<Spots />} />
          <Route path="/movimentacoes" element={<Movements />} />
          <Route path="/movimentacoes/entrada" element={<VehicleEntry />} />
          <Route path="/movimentacoes/saida" element={<VehicleExit />} />
          <Route path="/sinistro" element={<Incidents />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/relatorios" element={<Reports />} />
          <Route path="/equipamentos" element={<Equipment />} />
          <Route path="/configuracoes" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
