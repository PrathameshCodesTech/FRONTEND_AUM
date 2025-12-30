import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import StatCard from '../../components/admin/StatCard';
import '../../styles/admin/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminService.getDashboardStats();
      
      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      setError(error.message || 'Failed to load dashboard');
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = (iconName) => {
    const icons = {
      users: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      verified: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      kyc: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M6 16C6 14.5 7.5 13 9 13C10.5 13 12 14.5 12 16" stroke="currentColor" strokeWidth="2"/>
          <path d="M15 10H18M15 13H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      properties: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      investments: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 6H23V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      money: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <h3>Failed to Load Dashboard</h3>
        <p>{error}</p>
        <button className="btn-retry" onClick={fetchDashboardStats}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p className="dashboard-subtitle">Overview of platform statistics and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          icon={renderIcon('users')}
          label="Total Users"
          value={stats?.total_users || 0}
          color="#667eea"
        />
        <StatCard
          icon={renderIcon('verified')}
          label="Verified Users"
          value={stats?.verified_users || 0}
          color="#28a745"
        />
        <StatCard
          icon={renderIcon('kyc')}
          label="Pending KYC"
          value={stats?.pending_kyc || 0}
          color="#ff9800"
        />
      </div>

      <div className="stats-grid">
        <StatCard
          icon={renderIcon('properties')}
          label="Total Properties"
          value={stats?.total_properties || 0}
          color="#667eea"
        />
        <StatCard
          icon={renderIcon('properties')}
          label="Published Properties"
          value={stats?.published_properties || 0}
          color="#28a745"
        />
        <StatCard
          icon={renderIcon('investments')}
          label="Total Investments"
          value={stats?.total_investments || 0}
          color="#764ba2"
        />
      </div>

      <div className="stats-grid single-stat">
        <StatCard
          icon={renderIcon('money')}
          label="Total Investment Amount"
          value={formatCurrency(stats?.total_investment_amount)}
          color="#667eea"
        />
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => navigate('/admin/users')}>
            <span className="action-icon">{renderIcon('users')}</span>
            <span className="action-label">Manage Users</span>
          </button>
          <button className="action-card" onClick={() => navigate('/admin/kyc')}>
            <span className="action-icon">{renderIcon('kyc')}</span>
            <span className="action-label">Review KYC</span>
          </button>
          <button className="action-card" onClick={() => navigate('/admin/properties')}>
            <span className="action-icon">{renderIcon('properties')}</span>
            <span className="action-label">Manage Investments</span>
          </button>
          <button className="action-card" onClick={() => navigate('/admin/investments')}>
            <span className="action-icon">{renderIcon('investments')}</span>
            <span className="action-label">View Investments</span>
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;