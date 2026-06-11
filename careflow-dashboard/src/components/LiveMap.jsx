import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import API_BASE_URL from "@/utils/api";

/* ── Fixed positions ─────────────────────────────────────── */
const HOSPITAL_POS  = [28.6139, 77.2090];
const PATIENT_POS   = [28.6200, 77.2300];
const INITIAL_AMB   = [28.6150, 77.2100];

/* ── Custom SVG icons ────────────────────────────────────── */
const makeIcon = (svg, size = 44) =>
  L.divIcon({
    className: "",
    html: svg,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });

const hospitalIcon = makeIcon(`
  <div style="
    width:44px;height:44px;background:linear-gradient(135deg,#1e40af,#3b82f6);
    border-radius:50%;display:flex;align-items:center;justify-content:center;
    border:3px solid #fff;box-shadow:0 4px 14px rgba(30,64,175,0.6);
    position:relative;
  ">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="white">
      <path d="M12 2L2 7l1 14h18l1-14zm0 4v4H8v2h4v4h2v-4h4v-2h-4V6z"/>
    </svg>
    <div style="
      position:absolute;inset:-4px;border-radius:50%;
      border:2px solid rgba(59,130,246,0.4);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;
    "></div>
  </div>
`, 44);

const patientIcon = makeIcon(`
  <div style="
    width:40px;height:40px;background:linear-gradient(135deg,#dc2626,#f87171);
    border-radius:50%;display:flex;align-items:center;justify-content:center;
    border:3px solid #fff;box-shadow:0 4px 14px rgba(220,38,38,0.6);
  ">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  </div>
`, 40);

const makeAmbulanceIcon = (eta) => makeIcon(`
  <div style="
    width:52px;height:52px;background:linear-gradient(135deg,#d97706,#f59e0b);
    border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;
    border:3px solid #fff;box-shadow:0 4px 18px rgba(217,119,6,0.7);
    position:relative;
  ">
    <span style="font-size:20px;line-height:1;">🚑</span>
    <span style="font-size:8px;font-weight:700;color:white;margin-top:2px;background:rgba(0,0,0,0.3);
      padding:1px 4px;border-radius:4px;">${eta}m</span>
    <div style="
      position:absolute;inset:-5px;border-radius:15px;
      border:2px solid rgba(245,158,11,0.5);animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
    "></div>
  </div>
`, 52);

/* ── Inject CSS for ping animation ──────────────────────── */
const style = document.createElement("style");
style.textContent = `
  @keyframes ping {
    0%   { transform: scale(1); opacity: 0.8; }
    75%, 100% { transform: scale(1.6); opacity: 0; }
  }
  .leaflet-container { font-family: 'Inter', sans-serif !important; }
  .leaflet-popup-content-wrapper {
    border-radius: 14px !important;
    box-shadow: 0 8px 30px rgba(0,0,0,0.18) !important;
    border: 1px solid rgba(255,255,255,0.8) !important;
    backdrop-filter: blur(8px) !important;
  }
  .leaflet-popup-tip { background: white !important; }
`;
if (!document.head.querySelector("#livemap-style")) {
  style.id = "livemap-style";
  document.head.appendChild(style);
}

/* ── Smooth mover for ambulance ─────────────────────────── */
const lerp = (a, b, t) => a + (b - a) * t;

/* ── Route polyline path ────────────────────────────────── */
const ROUTE_PATH = [
  HOSPITAL_POS,
  [28.615, 77.212],
  [28.617, 77.218],
  [28.619, 77.224],
  PATIENT_POS,
];

/* ── Auto-fit bounds ────────────────────────────────────── */
const FitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, []);
  return null;
};

/* ── Main component ─────────────────────────────────────── */
const LiveMap = () => {
  const [ambPos, setAmbPos] = useState(INITIAL_AMB);
  const [etaSeconds, setEtaSeconds] = useState(480); // 8 min
  const [ambIcon, setAmbIcon] = useState(() => makeAmbulanceIcon(8));
  const [progress, setProgress] = useState(0); // 0–1 along ROUTE_PATH
  const [connected, setConnected] = useState(true);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const TOTAL_DURATION = 60000; // 60 sec for demo

  /* Animate ambulance along route */
  useEffect(() => {
    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setProgress((prev) => {
        const next = Math.min(prev + elapsed / TOTAL_DURATION, 1);

        // Interpolate along route segments
        const segCount = ROUTE_PATH.length - 1;
        const segProgress = next * segCount;
        const segIndex = Math.min(Math.floor(segProgress), segCount - 1);
        const segT = segProgress - segIndex;
        const from = ROUTE_PATH[segIndex];
        const to   = ROUTE_PATH[segIndex + 1];
        const newPos = [
          lerp(from[0], to[0], segT),
          lerp(from[1], to[1], segT),
        ];
        setAmbPos(newPos);

        const remaining = Math.round((1 - next) * 480);
        const mins = Math.ceil(remaining / 60);
        setAmbIcon(makeAmbulanceIcon(mins));
        setEtaSeconds(remaining);

        return next;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* Poll backend for real location (if available) */
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/ambulance-location`);
        if (res.ok) setConnected(true);
      } catch {
        setConnected(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const etaMin = Math.floor(etaSeconds / 60);
  const etaSec = etaSeconds % 60;
  const progressPct = Math.round(progress * 100);

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ height: 480 }}>
      {/* Status bar overlay */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none">
        {/* ETA card */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-3 border border-white/60">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Ambulance ETA</p>
            <p className="text-lg font-bold text-gray-900 leading-none">
              {etaMin}:{String(etaSec).padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Live indicator */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg text-xs font-bold backdrop-blur-md border
          ${connected
            ? "bg-green-500/90 text-white border-green-400/60"
            : "bg-red-500/90 text-white border-red-400/60"
          }`}
        >
          <span className={`w-2 h-2 rounded-full bg-white ${connected ? "animate-pulse" : ""}`} />
          {connected ? "LIVE" : "OFFLINE"}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] pointer-events-none">
        <div className="mx-3 mb-3 bg-white/90 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-white/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Route Progress</span>
            <span className="text-[10px] font-bold text-blue-600">{progressPct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, #3b82f6, #f59e0b)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] text-blue-600 font-semibold flex items-center gap-1">
              🏥 City Hospital
            </span>
            <span className="text-[9px] text-red-500 font-semibold flex items-center gap-1">
              📍 Patient Location
            </span>
          </div>
        </div>
      </div>

      <MapContainer
        center={[28.617, 77.22]}
        zoom={14}
        zoomControl={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Premium dark map tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        <FitBounds positions={[HOSPITAL_POS, PATIENT_POS, INITIAL_AMB]} />

        {/* Route polyline — dashed trail */}
        <Polyline
          positions={ROUTE_PATH}
          pathOptions={{
            color: "#94a3b8",
            weight: 2,
            opacity: 0.4,
            dashArray: "6 6",
          }}
        />

        {/* Completed route segment */}
        <Polyline
          positions={ROUTE_PATH.slice(0, Math.floor(progress * (ROUTE_PATH.length - 1)) + 2)}
          pathOptions={{
            color: "#f59e0b",
            weight: 4,
            opacity: 0.9,
            lineCap: "round",
            lineJoin: "round",
          }}
        />

        {/* Hospital marker */}
        <Marker position={HOSPITAL_POS} icon={hospitalIcon}>
          <Popup>
            <div className="text-center p-1">
              <p className="font-bold text-blue-700 text-sm">🏥 City General Hospital</p>
              <p className="text-xs text-gray-500 mt-1">Emergency Dispatch Center</p>
              <div className="mt-2 flex gap-2 justify-center">
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                  ✓ ICU Available
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                  24/7 Open
                </span>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Hospital pulse ring */}
        <CircleMarker
          center={HOSPITAL_POS}
          radius={18}
          pathOptions={{ color: "#3b82f6", weight: 2, opacity: 0.3, fillOpacity: 0 }}
        />

        {/* Patient marker */}
        <Marker position={PATIENT_POS} icon={patientIcon}>
          <Popup>
            <div className="text-center p-1">
              <p className="font-bold text-red-600 text-sm">📍 Patient Location</p>
              <p className="text-xs text-gray-500 mt-1">Emergency pickup point</p>
              <div className="mt-2">
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                  ⚠ Awaiting Ambulance
                </span>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Patient pulse ring */}
        <CircleMarker
          center={PATIENT_POS}
          radius={14}
          pathOptions={{ color: "#dc2626", weight: 2, opacity: 0.4, fillOpacity: 0.05 }}
        />

        {/* Ambulance marker — live moving */}
        <Marker position={ambPos} icon={ambIcon}>
          <Popup>
            <div className="text-center p-1">
              <p className="font-bold text-amber-600 text-sm">🚑 Ambulance AMB-003</p>
              <p className="text-xs text-gray-500 mt-1">En route to patient</p>
              <p className="text-xs font-bold text-amber-700 mt-1">
                ETA: {etaMin}m {String(etaSec).padStart(2, "0")}s
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LiveMap;