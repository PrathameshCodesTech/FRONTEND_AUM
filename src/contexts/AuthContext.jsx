import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token invalid, clear it
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function with role-based navigation
// Login function with role-based navigation
const login = async (phoneNumber, otp, inviteCode = null) => { // ← ADD PARAMETER
  try {
    // ✅ Pass invite code to verifyOTP
    const response = await authService.verifyOTP(phoneNumber, otp, inviteCode);
    
    // Fetch user data after login
    const userData = await authService.getCurrentUser();
   
  
  // 👇 ADD THESE DEBUG LOGS
  console.log('🔍 USER DATA FROM API:', userData);
  console.log('🔍 is_cp:', userData.is_cp);
  console.log('🔍 cp_status:', userData.cp_status);
  console.log('🔍 is_active_cp:', userData.is_active_cp);
  console.log('🔍 role:', userData.role);
    setUser(userData);
    setIsAuthenticated(true);
    
    // Role-based navigation
    navigateByRole(userData);
    
    return response;
  } catch (error) {
    throw error;
  }
};

  // Navigate based on user role
  // Navigate based on user role
const navigateByRole = (userData) => {
  console.log('🚀 navigateByRole called with:', userData);
  const roleSlug = userData.role?.slug;
  
  if (!userData) {
    console.log('❌ No userData, returning');
    return;
  }

  // Admin role
  if (roleSlug === 'admin' || userData.is_admin) {
  // if (userData.role?.slug === 'admin' || userData.is_admin) {
    console.log('✅ ADMIN DETECTED - Going to /admin');
    navigate('/admin');
    return;
  }

    // 2. Relationship Manager ← NEW!
  if (roleSlug === 'relationship_manager') {
    navigate('/rm/dashboard');
    return;
  }
  
  // 3. Developer ← NEW!
  if (roleSlug === 'developer') {
    navigate('/developer/dashboard');
    return;
  }

  // Channel Partner role
  console.log('🔍 Checking CP role...');
  console.log('  - role.slug:', userData.role?.slug);
  console.log('  - is_cp:', userData.is_cp);
  
  if (roleSlug === 'channel_partner' || userData.is_cp) {
  // if (userData.role?.slug === 'channel_partner' || userData.is_cp) {
    console.log('✅ CP ROLE CONFIRMED');
    
    const cpStatus = userData.cp_status || userData.onboarding_status;
    const isActiveCP = userData.is_active_cp || cpStatus === 'approved' || cpStatus === 'completed';
    
    console.log('  - cpStatus:', cpStatus);
    console.log('  - is_active_cp:', userData.is_active_cp);
    console.log('  - isActiveCP:', isActiveCP);
    
    if (isActiveCP) {
      console.log('✅ ACTIVE CP - Navigating to /cp/dashboard');
      navigate('/cp/dashboard');
    } else if (cpStatus === 'pending' || cpStatus === 'in_progress') {
      console.log('⏳ PENDING CP - Navigating to /cp/application-status');
      navigate('/cp/application-status');
    } else {
      console.log('📝 NO APPLICATION - Navigating to /cp/apply');
      navigate('/cp/apply');
    }
    return;
  }

  // Regular user
  console.log('👤 REGULAR USER - Navigating to /dashboard');
  navigate('/dashboard');
};

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/');
    }
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Role checking utilities
  const isAdmin = () => {
    return user?.role?.slug === 'admin' || user?.is_admin === true;
  };

  const isCP = () => {
    return user?.role?.slug === 'channel_partner' || user?.is_cp === true;
  };

  const isRM = () => {
    return user?.role?.slug === 'relationship_manager';
  };

  const isActiveCP = () => {
    return isCP() && (user?.cp_status === 'approved' || user?.is_active_cp === true);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    navigateByRole,
    // Role checking utilities
    isAdmin,
    isCP,
    isRM,
    isActiveCP,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;