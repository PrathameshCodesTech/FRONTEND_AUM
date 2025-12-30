import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import '../../styles/admin/AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role?.slug !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPath={location.pathname}
      />
      
      {/* ✅ CRITICAL: This className must include sidebar-collapsed when sidebar is collapsed */}
      <div className={`admin-main${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
        <AdminHeader 
          user={user} 
          onLogout={handleLogout}
        />
        
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;