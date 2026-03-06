import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import '../../styles/admin/AdminSidebar.css';

const AdminSidebar = ({ collapsed, onToggle, currentPath }) => {
  const [cpApplicationCount, setCpApplicationCount] = useState(0);
  const [investmentCount, setInvestmentCount] = useState(0);

  // Fetch pending CP applications count
  useEffect(() => {
    const fetchCpCount = async () => {
      const result = await adminService.getCPApplicationsPendingCount();
      if (result.success) {
        setCpApplicationCount(result.count);
      }
    };
    fetchCpCount();
    
    const interval = setInterval(fetchCpCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch pending investments count
  useEffect(() => {
    const fetchInvestmentCount = async () => {
      const result = await adminService.getInvestmentsPendingCount();
      if (result.success) {
        setInvestmentCount(result.count);
      }
    };
    fetchInvestmentCount();
    
    const interval = setInterval(fetchInvestmentCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
          <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      path: '/admin/users',
      label: 'Users',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      path: '/admin/cp/applications',
      label: 'CP Applications',
      badge: cpApplicationCount,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    { 
      path: '/admin/cp/list',
      label: 'Channel Partners',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      path: '/admin/kyc',
      label: 'KYC',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      path: '/admin/properties',
      label: 'Live opportunities',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      path: '/admin/investments',
      label: 'Investments',
      badge: investmentCount,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 6H23V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      path: '/admin/documents',
      label: 'Documents',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
  ];

  return (
    // ✅ CRITICAL: This template literal must include the collapsed class
    <div className={`admin-sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {!collapsed && <span className="logo-text">Assetkart Admin</span>}
        </div>
        <button 
          className="sidebar-toggle" 
          onClick={onToggle}
          type="button"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item${currentPath === item.path ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
            {item.badge > 0 && (
              <span className="notification-badge">{item.badge}</span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;