import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useParking } from "../context/ParkingContext";

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapPage() {
  const { settings, spots } = useParking();
  const available = spots.filter((s) => s.status === "available").length;

  const position: [number, number] = [-22.9035, -43.2096];
  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Mapa</h1>
      <p className="mt-1 text-sm text-slate-600">
        Localização e informações do estacionamento.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white lg:col-span-2">
          <div className="h-[360px]">
            <MapContainer center={position} zoom={15} className="h-full w-full">
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position} icon={markerIcon}>
                <Popup>
                  <div className="text-sm font-semibold">{settings.parkingName}</div>
                  <div className="text-xs">{settings.address}</div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">
              {settings.parkingName}
            </div>
            <div className="mt-1 text-sm text-slate-600">{settings.address}</div>
            <div className="mt-2 text-sm text-slate-600">{settings.phone}</div>
            <div className="mt-1 text-sm text-slate-600">
              Horário: {settings.openingHours}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="text-xs font-semibold text-slate-500">Vagas</div>
            <div className="mt-2 text-sm text-slate-700">
              Total: <span className="font-semibold">{spots.length}</span>
            </div>
            <div className="mt-1 text-sm text-slate-700">
              Disponíveis:{" "}
              <span className="font-semibold text-green-700">{available}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
