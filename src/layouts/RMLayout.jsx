// import React from 'react';
// import { Outlet, NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import {
//   FiHome,
//   FiUsers,
//   FiFileText,
//   FiActivity,
//   FiTarget,
//   FiBarChart2,
//   FiCheckCircle,
//   FiLogOut
// } from 'react-icons/fi';
// import '../styles/rm/RMLayout.css';
// import RMHeader from '../pages/rm/RMHeader';

// const RMLayout = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const menuItems = [
//     { path: '/rm/dashboard', icon: <FiHome />, label: 'Dashboard' },
//     { path: '/rm/customers', icon: <FiUsers />, label: 'Customers' },
//     { path: '/rm/leads', icon: <FiFileText />, label: 'Leads' },
//     { path: '/rm/activities', icon: <FiActivity />, label: 'Activities' },
//     { path: '/rm/targets', icon: <FiTarget />, label: 'Targets' },
//     { path: '/rm/reports', icon: <FiBarChart2 />, label: 'Reports' },
//     { path: '/rm/kyc-pending', icon: <FiCheckCircle />, label: 'KYC Pending' }
//   ];

//   return (
//     <div className="rm-layout">
//       {/* Sidebar */}
//        <RMHeader />
//       <aside className="rm-sidebar">
//         {/* <div className="sidebar-header">
//           <h2>AssetKart RM</h2>
//           <div className="user-info">
//             <div className="user-avatar">
//               {user?.first_name?.[0]}{user?.last_name?.[0]}
//             </div>
//             <div className="user-details">
//               <div className="user-name">
//                 {user?.first_name} {user?.last_name}
//               </div>
//               <div className="user-role">Relationship Manager</div>
//             </div>
//           </div>
//         </div> */}
        

//         <nav className="sidebar-nav">
//           {menuItems.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               className={({ isActive }) =>
//                 `nav-item ${isActive ? 'active' : ''}`
//               }
//             >
//               <span className="nav-icon">{item.icon}</span>
//               <span className="nav-label">{item.label}</span>
//             </NavLink>
//           ))}
//         </nav>

//         <div className="sidebar-footer">
//           <button className="logout-btn" onClick={logout}>
//             <FiLogOut />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="rm-main">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default RMLayout;
// layouts/RMLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import RMHeader from '../pages/rm/RMHeader';
import '../styles/rm/RMLayout.css';

const RMLayout = () => {
  return (
    <div className="rm-layout">
      {/* Header */}
      <RMHeader />
      
      {/* Main Content */}
      <main className="rm-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default RMLayout;