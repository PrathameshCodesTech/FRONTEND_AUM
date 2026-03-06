import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminUserDetail from '../pages/admin/AdminUserDetail';
import AdminKYC from '../pages/admin/AdminKYC';
import AdminKYCDetail from '../pages/admin/AdminKYCDetail';
import AdminProperties from '../pages/admin/AdminProperties';
import AdminPropertyForm from '../pages/admin/AdminPropertyForm';
import AdminPropertyDetail from '../pages/admin/AdminPropertyDetail';
import AdminInvestments from '../pages/admin/AdminInvestments';
import AdminInvestmentDetail from '../pages/admin/AdminInvestmentDetail';
import AdminCommissions from '../pages/admin/AdminCommissions';
import AdminCPRoutes from './AdminCPRoutes'; // Add this import
import AdminUserCreation from '../pages/admin/AdminUserCreation';
import AdminUserInvestment from "../pages/admin/AdminUserInvestment";
import AdminDocuments from '../pages/admin/AdminDocuments';
// Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (!user || user.role?.slug !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<AdminDashboard />} />

        {/* User Management */}
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:userId" element={<AdminUserDetail />} />
        <Route path="users/create" element={<AdminUserCreation />} />
        <Route
          path="users/:userId/investment"
          element={<AdminUserInvestment />}
        />

        {/* KYC Management */}
        <Route path="kyc" element={<AdminKYC />} />
        <Route path="kyc/:kycId" element={<AdminKYCDetail />} />

        {/* Property Management */}
        <Route path="properties" element={<AdminProperties />} />
        <Route path="properties/create" element={<AdminPropertyForm />} />
        <Route
          path="properties/:propertyId"
          element={<AdminPropertyDetail />}
        />
        <Route
          path="properties/:propertyId/edit"
          element={<AdminPropertyForm />}
        />

        {/* Investment Management */}
        <Route path="investments" element={<AdminInvestments />} />
        <Route
          path="investments/:investmentId"
          element={<AdminInvestmentDetail />}
        />
        <Route path="/admin/commissions" element={<AdminCommissions />} />

        {/* Document Storage */}
        <Route path="documents" element={<AdminDocuments />} />

        {/* CP Routes */}
        <Route path="cp/*" element={<AdminCPRoutes />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;