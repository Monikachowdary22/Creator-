import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import ContentAnalytics from "./pages/ContentAnalytics";
import AudienceAnalytics from "./pages/AudienceAnalytics";
import GrowthTrends from "./pages/GrowthTrends";
import Revenue from "./pages/Revenue";
import Sponsorships from "./pages/Sponsorships";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";


function App() {
  return (
    <BrowserRouter>

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
        }}
      >

        <Sidebar />

        <main
          style={{
            flex: 1,
            padding: "0 30px 30px",
          }}
        >

          <Header />

          <Routes>

            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/content"
              element={<ContentAnalytics />}
            />

            <Route
              path="/audience"
              element={<AudienceAnalytics />}
            />

            <Route
              path="/growth"
              element={<GrowthTrends />}
            />

            <Route
              path="/revenue"
              element={<Revenue />}
            />

            <Route
              path="/sponsorships"
              element={<Sponsorships />}
            />

            <Route
              path="/notifications"
              element={<Notifications />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;