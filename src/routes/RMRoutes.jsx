// // routes/RMRoutes.jsx
// // =====================================================
// // Relationship Manager Routes Configuration
// // =====================================================

// import React from 'react';
// import { Route, Routes, Navigate } from 'react-router-dom';

// // Import RM Components
// import RMDashboard from '../pages/rm/RMDashboard';
// import RMCustomerList from '../pages/rm/RMCustomerList';
// // import RMCustomerDetail from '../pages/rm/RMCustomerDetail';
// import RMLeadList from '../pages/rm/RMLeadList';
// import RMLeadCreate from '../pages/rm/RMLeadCreate';
// // import RMLeadEdit from '../pages/rm/RMLeadEdit';
// import RMActivityCreate from '../pages/rm/RMActivityCreate';
// // import RMActivityList from '../pages/rm/RMActivityList';
// // import RMReports from '../pages/rm/RMReports';
// // import RMTargets from '../pages/rm/RMTargets';
// // import RMKYCPending from '../pages/rm/RMKYCPending';

// // RM Layout (if you have one)
// // import RMLayout from '../layouts/RMLayout';

// const RMRoutes = () => {
//   return (
//     <Routes>
//       {/* Wrap all RM routes in RMLayout if you have a layout component */}
//       <Route >
//         {/* Dashboard */}
//         <Route index element={<Navigate to="/rm/dashboard" replace />} />
//         <Route path="dashboard" element={<RMDashboard />} />

//         {/* Customers */}
//         <Route path="customers" element={<RMCustomerList />} />
//         <Route path="customers/:customerId" element={<RMCustomerDetail />} />

//         {/* Leads */}
//         <Route path="leads" element={<RMLeadList />} />
//         <Route path="leads/new" element={<RMLeadCreate />} />
//         <Route path="leads/:leadId/edit" element={<RMLeadEdit />} />

//         {/* Activities */}
//         <Route path="activities" element={<RMActivityList />} />
//         <Route path="activities/new" element={<RMActivityCreate />} />

//         {/* Reports & Targets */}
//         <Route path="reports" element={<RMReports />} />
//         <Route path="targets" element={<RMTargets />} />

//         {/* KYC */}
//         <Route path="kyc-pending" element={<RMKYCPending />} />

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/rm/dashboard" replace />} />
//       </Route>
//     </Routes>
//   );
// };

// export default RMRoutes;

// routes/RMRoutes.jsx
// =====================================================
// Protected Routes for Relationship Managers
// Follows same pattern as AdminRoutes and CPRoutes
// =====================================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// RM Layout
import RMLayout from '../layouts/RMLayout';

// RM Pages
import RMDashboard from '../pages/rm/RMDashboard';
import RMCustomerList from '../pages/rm/RMCustomerList';
// import RMCustomerDetail from '../pages/rm/RMCustomerDetail';
import RMLeadList from '../pages/rm/RMLeadList';
import RMLeadCreate from '../pages/rm/RMLeadCreate';
// import RMLeadEdit from '../pages/rm/RMLeadEdit';
import RMActivityCreate from '../pages/rm/RMActivityCreate';
// import RMActivityList from '../pages/rm/RMActivityList';
// import RMReports from '../pages/rm/RMReports';
// import RMTargets from '../pages/rm/RMTargets';
// import RMKYCPending from '../pages/rm/RMKYCPending';

// Loading Component
const LoadingState = () => (
  <div className="loading-state-dash">
    <div className="loading-spinner">Loading...</div>
  </div>
);

// Protected Route Component for RM
const ProtectedRMRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is RM or Admin
  const isRM = user?.role?.slug === 'relationship_manager';
  const isAdmin = user?.role?.slug === 'admin';

  // Not RM or Admin - redirect to dashboard
  if (!isRM && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // RM or Admin - allow access
  return children;
};

const RMRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRMRoute>
            <RMLayout />
          </ProtectedRMRoute>
        }
      >
        {/* Dashboard - Default Route */}
        <Route index element={<RMDashboard />} />
        <Route path="dashboard" element={<RMDashboard />} />

        {/* Customer Management */}
        <Route path="customers" element={<RMCustomerList />} />
        {/* Uncomment when you create these components */}
        {/* <Route path="customers/:customerId" element={<RMCustomerDetail />} /> */}

        {/* Lead Management */}
        <Route path="leads" element={<RMLeadList />} />
        <Route path="leads/new" element={<RMLeadCreate />} />
        {/* Uncomment when you create this component */}
        {/* <Route path="leads/:leadId/edit" element={<RMLeadEdit />} /> */}

        {/* Activity Management */}
        {/* Uncomment when you create this component */}
        {/* <Route path="activities" element={<RMActivityList />} /> */}
        <Route path="activities/new" element={<RMActivityCreate />} />

        {/* Reports & Targets */}
        {/* Uncomment when you create these components */}
        {/* <Route path="reports" element={<RMReports />} /> */}
        {/* <Route path="targets" element={<RMTargets />} /> */}

        {/* KYC Management */}
        {/* Uncomment when you create this component */}
        {/* <Route path="kyc-pending" element={<RMKYCPending />} /> */}

        {/* Fallback - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/rm/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default RMRoutes;
