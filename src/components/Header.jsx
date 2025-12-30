import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import KnowMoreDropdown from './KnowMoreDropdown';
import logoImage from '../assets/AssetKart-1.png';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  
  const [showKnowMore, setShowKnowMore] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowKnowMore(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    navigate('/portfolio');
  };

  const handleDashboardClick = () => {
    setShowUserMenu(false);
    navigate('/dashboard');
  };

  const handleWalletClick = () => {
    setShowUserMenu(false);
    navigate('/wallet');
  };

  // ✅ NEW: Handle Admin Panel Click
  const handleAdminClick = () => {
    setShowUserMenu(false);
    navigate('/admin/');
  };

  // ✅ Check if user is admin
  const isAdmin = () => {
    if (!user) return false;
    
    // Check role slug
    if (user.role?.slug === 'admin') return true;
    
    // Check permissions array (fallback)
    if (user.permissions?.includes('admin_access')) return true;
    
    return false;
  };

  // Don't show header on login page
  if (location.pathname === '/login' || location.pathname === '/login/') {
    return null;
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-container">
          <img src={logoImage} alt="AssetKart" className="logo-image" />
        </Link>
        
       <nav className="nav-menu">
  <Link to="/properties" className={`nav-link ${location.pathname === '/properties' ? 'active' : ''}`}>
    Live opportunities
  </Link>

  {isAuthenticated && (
    <Link to="/portfolio" className={`nav-link ${location.pathname === '/portfolio' ? 'active' : ''}`}>
      Portfolio
    </Link>
  )}
  
            
          <div className="header-buttons">
            {isAuthenticated ? (
              <div className="user-menu-wrapper" ref={userMenuRef}>
                <div 
                  className="user-menu" 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="user-avatar">
                    <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                  <span className="user-name-header">{user?.username?.split(' ')[0] || 'User'}</span>
                  <span className={`user-arrow ${showUserMenu ? 'open' : ''}`}>▼</span>
                </div>

                {showUserMenu && (
                  <div className="user-dropdown">
                    {/* ✅ ADMIN PANEL LINK - Only for Admin Users */}
                    {isAdmin() && (
                      <>
                        <button 
                          className="user-dropdown-item admin-item" 
                          onClick={handleAdminClick}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                          </svg>
                          Admin Panel
                        </button>
                        <div className="dropdown-divider"></div>
                      </>
                    )}

                    <button className="user-dropdown-item" onClick={handleDashboardClick}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
                        <rect x="3" y="13" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
                        <rect x="13" y="3" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
                        <rect x="13" y="13" width="8" height="8" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Dashboard
                    </button>
                    <button className="user-dropdown-item" onClick={handleProfileClick}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                        <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                        <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                        <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      My Portfolio
                    </button>
                    <button className="user-dropdown-item" onClick={handleWalletClick}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="18" cy="15" r="1.5" fill="currentColor"/>
                      </svg>
                      My Wallet
                    </button>
                    <div className="dropdown-divider"></div>
                    <button className="user-dropdown-item logout" onClick={handleLogout}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-btn" onClick={handleLoginClick}>
                Login
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;