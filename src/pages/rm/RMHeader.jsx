// page/rm/RMHeader.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import logoImage from '../../assets/AssetKart-1.png';
import '../../styles/rm/RMHeader.css';

/**
 * RMHeader
 * - Header navigation for Relationship Manager
 * - Shows user menu with profile and logout
 * - Active link highlighting
 *
 * Usage:
 * <RMHeader />
 */
const RMHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };
  
  const isActive = (path) => location.pathname === path;

  // Get display name - prioritize full name over username
  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.first_name) {
      return user.first_name;
    }
    if (user?.name) {
      return user.name;
    }
    return user?.username || 'RM';
  };

  // Get avatar initial - use first letter of first name or username
  const getAvatarInitial = () => {
    if (user?.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return user?.username?.charAt(0).toUpperCase() || 'R';
  };

  return (
    <header className="rm-header">
      <div className="rm-header-container">
        {/* LEFT : LOGO */}
        <div className="rm-header-left">
          <Link to="/rm/dashboard" className="rm-logo-container">
            <img src={logoImage} alt="AssetKart" className="rm-logo-image" />
            <span className="rm-badge">RM Portal</span>
          </Link>
        </div>

        {/* CENTER : NAVIGATION */}
        <nav className="rm-nav-menu">
          <Link 
            to="/rm/dashboard" 
            className={`rm-nav-link ${isActive('/rm/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/rm/customers" 
            className={`rm-nav-link ${isActive('/rm/customers') ? 'active' : ''}`}
          >
            Customers
          </Link>
          <Link 
            to="/rm/leads" 
            className={`rm-nav-link ${isActive('/rm/leads') ? 'active' : ''}`}
          >
            Leads
          </Link>
          <Link 
            to="/rm/activities" 
            className={`rm-nav-link ${isActive('/rm/activities') ? 'active' : ''}`}
          >
            Activities
          </Link>
          <Link 
            to="/rm/reports" 
            className={`rm-nav-link ${isActive('/rm/reports') ? 'active' : ''}`}
          >
            Reports
          </Link>
          <Link 
            to="/rm/targets" 
            className={`rm-nav-link ${isActive('/rm/targets') ? 'active' : ''}`}
          >
            Targets
          </Link>
          <Link 
            to="/rm/kyc-pending" 
            className={`rm-nav-link ${isActive('/rm/kyc-pending') ? 'active' : ''}`}
          >
            KYC Pending
          </Link>
        </nav>

        {/* RIGHT : USER MENU */}
        {user && (
          <div className="rm-header-right">
            <div className="rm-user-menu-wrapper" ref={userMenuRef}>
              <div
                className="rm-user-menu"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="rm-user-avatar">
                  {getAvatarInitial()}
                </div>
                <div className="rm-user-info">
                  <span className="rm-user-name">{getDisplayName()}</span>
                  {/* <span className="rm-user-role">RM</span> */}
                </div>
                <span className={`rm-user-arrow ${showUserMenu ? 'open' : ''}`}>▼</span>
              </div>

              {showUserMenu && (
                <div className="rm-user-dropdown">
                  <Link to="/rm/profile" className="rm-dropdown-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                      <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    My Profile
                  </Link>
                  
                  <Link to="/rm/settings" className="rm-dropdown-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 1v6m0 6v6M23 12h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Settings
                  </Link>

                  <div className="rm-dropdown-divider"></div>
                  
                  <button className="rm-dropdown-item logout" onClick={handleLogout}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H9" stroke="currentColor" strokeWidth="2"/>
                      <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2"/>
                      <path d="M21 12H9" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default RMHeader;