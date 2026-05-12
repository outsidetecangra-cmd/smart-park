import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import MapPage from "./pages/MapPage";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Spots from "./pages/Spots";
import VehicleEntry from "./pages/VehicleEntry";
import VehicleExit from "./pages/VehicleExit";
import Equipment from "./pages/Equipment";
import Payments from "./pages/Payments";

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
          <Route path="/vagas" element={<Spots />} />
          <Route path="/entrada" element={<VehicleEntry />} />
          <Route path="/saida" element={<VehicleExit />} />
          <Route path="/historico" element={<History />} />
          <Route path="/pagamentos" element={<Payments />} />
          <Route path="/mapa" element={<MapPage />} />
          <Route path="/equipamentos" element={<Equipment />} />
          <Route path="/configuracoes" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
