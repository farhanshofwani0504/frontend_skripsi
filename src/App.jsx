import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import DashboardSkorKaryawan from "./pages/DashboardSkorKaryawan";
import DashboardKesimpulanGlobal from "./pages/DashboardKesimpulanGlobal";
import Penilaian from "./pages/Penilaian";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import DetailKaryawan from "./pages/DetailKaryawan";
import UserManagement from "./pages/UserManagement";
import ProposalList from "./pages/ProposalList";
import ProposalDetail from "./pages/ProposalDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
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
          path="/dashboard/karyawan/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <DetailKaryawan />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/users"
          element={
            <ProtectedRoute>
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/proposal"
          element={
            <ProtectedRoute>
              <Layout>
                <ProposalList />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/proposal/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ProposalDetail />
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
