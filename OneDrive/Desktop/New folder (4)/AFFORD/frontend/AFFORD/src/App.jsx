import { BrowserRouter, Routes, Route } from "react-router-dom";

import PriorityInbox from "./pages/PriorityInbox";
import AllNotifications from "./pages/AllNotifications";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PriorityInbox />} />
        <Route
          path="/notifications"
          element={<AllNotifications />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;