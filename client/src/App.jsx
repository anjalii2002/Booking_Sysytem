import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Spaces from './pages/Spaces';
import SpaceDetail from './pages/SpaceDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSpaces from './pages/admin/AdminSpaces';
import AdminSpaceForm from './pages/admin/AdminSpaceForm';
import AdminBookings from './pages/admin/AdminBookings';
import AdminApprovals from './pages/admin/AdminApprovals';
import AdminMaintenance from './pages/admin/AdminMaintenance';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spaces" element={<Spaces />} />
        <Route path="/spaces/:id" element={<SpaceDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/spaces" element={<ProtectedRoute adminOnly><AdminSpaces /></ProtectedRoute>} />
        <Route path="/admin/spaces/new" element={<ProtectedRoute adminOnly><AdminSpaceForm /></ProtectedRoute>} />
        <Route path="/admin/spaces/:id/edit" element={<ProtectedRoute adminOnly><AdminSpaceForm /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><AdminBookings /></ProtectedRoute>} />
        <Route path="/admin/approvals" element={<ProtectedRoute adminOnly><AdminApprovals /></ProtectedRoute>} />
        <Route path="/admin/maintenance" element={<ProtectedRoute adminOnly><AdminMaintenance /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}
