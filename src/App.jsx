import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardSkorKaryawan from "./pages/DashboardSkorKaryawan";
import DashboardKesimpulanGlobal from "./pages/DashboardKesimpulanGlobal";
import Penilaian from "./pages/Penilaian";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Notifikasi from "./pages/Notifikasi";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Semua dashboard dimasukkan dalam Layout */}
        <Route
          path="/dashboard/skor-karyawan"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardSkorKaryawan />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/kesimpulan"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardKesimpulanGlobal />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/penilaian/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <Penilaian />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/notifikasi/"
          element={
            <ProtectedRoute>
              <Layout>
                <Notifikasi />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
        {/* Default */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
