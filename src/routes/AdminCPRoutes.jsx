// // AdminCPRoutes.jsx
// // =====================================================
// // Protected Routes for Admin CP Management
// // Only accessible to admins
// // =====================================================

// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// // Admin CP Pages
// import AdminCPApplications from '../pages/admin/cp/AdminCPApplications';
// // import AdminCPDetail from '../pages/admin/cp/AdminCPDetail';
// import AdminCPList from '../pages/admin/cp/AdminCPList';
// // import AdminCPCreate from '../pages/admin/cp/AdminCPCreate';
// // import AdminCPPropertyAuth from '../pages/admin/cp/AdminCPPropertyAuth';
// // import AdminCPRelationships from '../pages/admin/cp/AdminCPRelationships';

// // Admin Protected Route Wrapper
// const AdminCPProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="loading-state-dash">
//         <div className="loading-spinner">Loading...</div>
//       </div>
//     );
//   }

//   // Not logged in
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Check if user is admin
//   const isAdmin = user?.role?.slug === 'admin';

//   if (!isAdmin) {
//     // Not admin - redirect to home
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// const AdminCPRoutes = () => {
//   return (
//     <Routes>
//       {/* CP Applications */}
//       <Route
//         path="/applications"
//         element={
//           <AdminCPProtectedRoute>
//             <AdminCPApplications />
//           </AdminCPProtectedRoute>
//         }
//       />

//       {/* CP List */}
//       <Route
//         path="/list"
//         element={
//           <AdminCPProtectedRoute>
//             <AdminCPList />
//           </AdminCPProtectedRoute>
//         }
//       />

//       {/* CP Detail
//       <Route
//         path="/:cpId/detail"
//         element={
//           <AdminCPProtectedRoute>
//             <AdminCPDetail />
//           </AdminCPProtectedRoute>
//         }
//       /> */}

//       {/* Create CP */}
//       {/* <Route
//         path="/create"
//         element={
//           <AdminCPProtectedRoute>
//             <AdminCPCreate />
//           </AdminCPProtectedRoute>
//         }
//       /> */}

//       {/* Property Authorization Management */}
//       {/* <Route
//         path="/property-auth"
//         element={
//           <AdminCPProtectedRoute>
//             <AdminCPPropertyAuth />
//           </AdminCPProtectedRoute>
//         }
//       /> */}

//       {/* CP-Customer Relationships */}
//       <Route
//         path="/relationships"
//         element={
//           <AdminCPProtectedRoute>
//             <AdminCPRelationships />
//           </AdminCPProtectedRoute>
//         }
//       />

//       {/* Default redirect */}
//       <Route path="/" element={<Navigate to="/admin/cp/applications" replace />} />
//       <Route path="*" element={<Navigate to="/admin/cp/applications" replace />} />
//     </Routes>
//   );
// };

// export default AdminCPRoutes;


// AdminCPRoutes.jsx
// =====================================================
// Protected Routes for Admin CP Management
// Only accessible to admins
// =====================================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Admin CP Pages
import AdminCPApplications from '../pages/admin/cp/AdminCPApplications';
import AdminCPList from '../pages/admin/cp/AdminCPList';
import AdminCPDetail from '../pages/admin/cp/AdminCPDetail'; // ADD THIS
import AdminCPCreate from '../pages/admin/cp/AdminCPCreate'; // 👈 ADD T

import AdminCPEdit from '../pages/admin/cp/AdminCPEdit'; // 🆕 ADD THIS

// Admin Protected Route Wrapper
const AdminCPProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-state-dash">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin
  const isAdmin = user?.role?.slug === 'admin';

  if (!isAdmin) {
    // Not admin - redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

const AdminCPRoutes = () => {
  return (
    <Routes>
      {/* CP Applications */}
      <Route
        path="/applications"
        element={
          <AdminCPProtectedRoute>
            <AdminCPApplications />
          </AdminCPProtectedRoute>
        }
      />

    

      <Route path=":cpId/detail" element={<AdminCPDetail />} /> {/* ADD THIS */}
       <Route path="create" element={<AdminCPCreate />} /> {/* 👈 ADD THIS */}

      {/* CP List */}
      <Route
        path="/list"
        element={
          <AdminCPProtectedRoute>
            <AdminCPList />
          </AdminCPProtectedRoute>
        }
      />

            {/* Edit CP - MUST come before :cpId detail route */}
      <Route
        path="/:cpId/edit"
        element={
          <AdminCPProtectedRoute>
            <AdminCPEdit />
          </AdminCPProtectedRoute>
        }
      />

      {/* CP Detail - MUST come last among :cpId routes */}
      <Route
        path="/:cpId"
        element={
          <AdminCPProtectedRoute>
            <AdminCPDetail />
          </AdminCPProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/admin/cp/applications" replace />} />
      <Route path="*" element={<Navigate to="/admin/cp/applications" replace />} />
    </Routes>
  );
};

export default AdminCPRoutes;
