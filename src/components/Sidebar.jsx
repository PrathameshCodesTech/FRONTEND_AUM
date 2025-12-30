// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import '../styles/Sidebar.css';

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [expandedMenu, setExpandedMenu] = useState(null);

// const menuItems = [
//     {
//       id: 'dashboard',
//       icon: 'dashboard',
//       label: 'Dashboard',
//       path: '/portfolio'
//     },
//     {
//     id: 'investments',
//     icon: 'investments',
//     label: 'My Investments',
//     path: '/my-investments'
//   },
//     {
//       id: 'properties',
//       icon: 'properties',
//       label: 'Live Opportunities',
//       path: '/properties'
//     },
//     {
//       id: 'wallet',
//       icon: 'wallet',
//       label: 'My Wallet',
//       path: '/wallet'
//     },
//     {
//       id: 'wishlist',
//       icon: 'wishlist',
//       label: 'Wishlist',
//       path: '/wishlist'
//     },
//     {
//       id: 'profile',
//       icon: 'profile',
//       label: 'My Profile',
//       path: '/dashboard'
//     },
//     {
//       id: 'overview',
//       icon: 'overview',
//       label: 'Overview',
//       path: '/overview',
//       badge: 'Coming Soon',
//       badgeColor: 'pink'
//     },
//     {
//       id: 'ai-navigator',
//       icon: 'ai',
//       label: 'AI Navigator',
//       path: '/ai-navigator',
//       expandable: true,
//       submenu: []
//     },
//     {
//       id: 'transactions',
//       icon: 'transactions',
//       label: 'Transactions',
//       path: '/transactions'
//     },
//     {
//       id: 'manager',
//       icon: 'manager',
//       label: 'My Manager',
//       path: '/manager',
//       badge: 'Coming Soon',
//       badgeColor: 'pink'
//     },
//     {
//       id: 'settings',
//       icon: 'settings',
//       label: 'Settings',
//       path: '/settings',
//       badge: 'Coming Soon',
//       badgeColor: 'pink'
//     }
//   ];

//   const handleMenuClick = (item) => {
//     if (item.badge === 'Coming Soon') {
//       return;
//     }
    
//     if (item.expandable) {
//       setExpandedMenu(expandedMenu === item.id ? null : item.id);
//     } else {
//       navigate(item.path);
//     }
//   };

//   const handleLogout = () => {
//     navigate('/');
//   };

//   const renderIcon = (iconName) => {
//     const icons = {
//       dashboard: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//           <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
//           <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
//           <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
//           <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
//         </svg>
//       ),
//        investments: (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//       <path d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69752 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69752 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>
//   ),
//       properties: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//           <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       ),
//       wallet: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//           <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
//           <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
//           <circle cx="18" cy="15" r="1.5" fill="currentColor"/>
//         </svg>
//       ),
//       profile: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//           <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       ),
//       wishlist: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//           <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61V4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       ),
//       overview: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//           <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           <path d="M9 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           <path d="M3 15H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       ),
//       ai: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//           <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
//           <path d="M12 1V4M12 20V23M23 12H20M4 12H1M19.07 4.93L16.95 7.05M7.05 16.95L4.93 19.07M19.07 19.07L16.95 16.95M7.05 7.05L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//         </svg>
//       ),
//       transactions: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//           <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
//           <path d="M1 10H23" stroke="currentColor" strokeWidth="2"/>
//         </svg>
//       ),
//       manager: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//           <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
//           <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       ),
//       settings: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//           <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
//           <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//         </svg>
//       ),
//       logout: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//           <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       )
//     };
//     return icons[iconName] || null;
//   };

//   return (
//     <aside className="sidebar">
//       <div className="sidebar-header">
//         <div className="logo-text">
//           <span className="logo-asset">ASSET</span>
//           <span className="logo-kart">KART</span>
//         </div>
//         <div className="logo-tagline">VALUE & VOLUME</div>
//       </div>

//       <nav className="sidebar-nav">
//         {menuItems.map((item) => (
//           <div key={item.id} className="menu-item-wrapper">
//             <button
//               className={`sidebar-menu-item ${location.pathname === item.path ? 'active' : ''} ${
//                 item.badge === 'Coming Soon' ? 'disabled' : ''
//               }`}
//               onClick={() => handleMenuClick(item)}
//             >
//               <span className="menu-icon">{renderIcon(item.icon)}</span>
//               <span className="menu-label">{item.label}</span>
//               {item.badge && (
//                 <span className={`menu-badge ${item.badgeColor}`}>{item.badge}</span>
//               )}
//               {item.expandable && (
//                 <span className={`expand-arrow ${expandedMenu === item.id ? 'open' : ''}`}>
//                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
//                     <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                 </span>
//               )}
//             </button>
            
//             {item.expandable && expandedMenu === item.id && item.submenu && item.submenu.length > 0 && (
//               <div className="submenu">
//                 {item.submenu.map((subItem) => (
//                   <button
//                     key={subItem.id}
//                     className="submenu-item"
//                     onClick={() => navigate(subItem.path)}
//                   >
//                     {subItem.label}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </nav>

//       <div className="sidebar-footer">
//         <button className="logout-btn" onClick={handleLogout}>
//           <span className="logout-icon">{renderIcon('logout')}</span>
//           <span>Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;


import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    {
      id: 'dashboard',
      icon: 'dashboard',
      label: 'Dashboard',
      path: '/portfolio'
    },
    {
      id: 'investments',
      icon: 'investments',
      label: 'My Investments',
      path: '/my-investments'
    },
    {
      id: 'properties',
      icon: 'properties',
      label: 'Live Opportunities',
      path: '/properties'
    },
    {
      id: 'wallet',
      icon: 'wallet',
      label: 'My Wallet',
      path: '/wallet'
    },
    {
      id: 'wishlist',
      icon: 'wishlist',
      label: 'Wishlist',
      path: '/wishlist'
    },
    {
      id: 'profile',
      icon: 'profile',
      label: 'My Profile',
      path: '/dashboard'
    },
    {
      id: 'overview',
      icon: 'overview',
      label: 'Overview',
      path: '/overview',
      badge: 'Coming Soon',
      badgeColor: 'pink'
    },
    {
      id: 'ai-navigator',
      icon: 'ai',
      label: 'AI Navigator',
      path: '/ai-navigator',
      expandable: true,
      submenu: []
    },
    {
      id: 'transactions',
      icon: 'transactions',
      label: 'Transactions',
      path: '/my-investments',  // 🆕 Navigate to My Investments
      receiptsTab: true          // 🆕 Flag to activate receipts tab
    },
    {
      id: 'manager',
      icon: 'manager',
      label: 'My Manager',
      path: '/manager',
      badge: 'Coming Soon',
      badgeColor: 'pink'
    },
    {
      id: 'settings',
      icon: 'settings',
      label: 'Settings',
      path: '/settings',
      badge: 'Coming Soon',
      badgeColor: 'pink'
    }
  ];

  const handleMenuClick = (item) => {
    if (item.badge === 'Coming Soon') {
      return;
    }
    
    if (item.expandable) {
      setExpandedMenu(expandedMenu === item.id ? null : item.id);
    } else {
      // 🆕 Navigate to receipts tab if it's the transactions menu
      if (item.receiptsTab) {
        navigate(item.path, { state: { activeTab: 'receipts' } });
      } else {
        navigate(item.path);
      }
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const renderIcon = (iconName) => {
    const icons = {
      dashboard: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      investments: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69752 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69752 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.27 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      properties: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      wallet: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
          <circle cx="18" cy="15" r="1.5" fill="currentColor"/>
        </svg>
      ),
      profile: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      wishlist: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39464C21.7564 5.72718 21.351 5.12075 20.84 4.61V4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      overview: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 15H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      ai: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 1V4M12 20V23M23 12H20M4 12H1M19.07 4.93L16.95 7.05M7.05 16.95L4.93 19.07M19.07 19.07L16.95 16.95M7.05 7.05L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      transactions: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M1 10H23" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      manager: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      settings: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      logout: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-text">
          <span className="logo-asset">ASSET</span>
          <span className="logo-kart">KART</span>
        </div>
        <div className="logo-tagline">VALUE & VOLUME</div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item-wrapper">
            <button
              className={`sidebar-menu-item ${
                location.pathname === item.path ? 'active' : ''
              } ${item.badge === 'Coming Soon' ? 'disabled' : ''}`}
              onClick={() => handleMenuClick(item)}
            >
              <span className="menu-icon">{renderIcon(item.icon)}</span>
              <span className="menu-label">{item.label}</span>
              {item.badge && (
                <span className={`menu-badge ${item.badgeColor}`}>{item.badge}</span>
              )}
              {item.expandable && (
                <span className={`expand-arrow ${expandedMenu === item.id ? 'open' : ''}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </button>
            
            {item.expandable && expandedMenu === item.id && item.submenu && item.submenu.length > 0 && (
              <div className="submenu">
                {item.submenu.map((subItem) => (
                  <button
                    key={subItem.id}
                    className="submenu-item"
                    onClick={() => navigate(subItem.path)}
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon">{renderIcon('logout')}</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;