import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import API_BASE_URL from "@/utils/api";

const hospital = [28.6139, 77.2090];
const patient = [28.6200, 77.2300];

// 🚑 Custom Ambulance Icon
const ambulanceIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2967/2967350.png",
  iconSize: [40, 40],
});

const LiveAmbulance = () => {
  const [position, setPosition] = useState([28.6150, 77.2100]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`${API_BASE_URL}/ambulance-location`);
      const data = await res.json();
      setPosition([data.lat, data.lng]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return <Marker position={position} icon={ambulanceIcon} />;
};

const Routing = () => {
  const map = useMap();

  useEffect(() => {
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(hospital[0], hospital[1]),
        L.latLng(patient[0], patient[1]),
      ],
      lineOptions: {
        styles: [{ color: "blue", weight: 5 }],
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map]);

  return null;
};

const LiveMap = () => {
  return (
    <MapContainer
      center={hospital}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={hospital} />
      <Marker position={patient} />

      <LiveAmbulance />
      <Routing />
    </MapContainer>
  );
};

export default LiveMap;