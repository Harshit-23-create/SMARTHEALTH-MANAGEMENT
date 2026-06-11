import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "leaflet/dist/leaflet.css";
import "./utils/leafletFix";
import "./i18n";
import { NotificationProvider } from "./context/NotificationContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </BrowserRouter>
);