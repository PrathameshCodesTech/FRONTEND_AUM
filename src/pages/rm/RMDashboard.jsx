// RMDashboard.jsx
// =====================================================
// Relationship Manager Dashboard
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiTrendingUp,
  FiDollarSign,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiTarget,
  FiActivity
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import rmService from '../../services/rmService';
import '../../styles/rm/RMDashboard.css';

const RMDashboard = () => {
  const navigate = useNavigate();

  /* -------------------- State -------------------- */
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* -------------------- Fetch Dashboard Data -------------------- */
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await rmService.getDashboard();

      if (response.success) {
        setDashboardData(response.data);
      } else {
        toast.error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- Stats Cards -------------------- */
  const statsCards = dashboardData ? [
    {
      title: 'Total Customers',
      value: dashboardData.total_customers,
      subtitle: `${dashboardData.active_customers} active`,
      icon: <FiUsers />,
      color: 'blue',
      onClick: () => navigate('/rm/customers')
    },
    {
      title: 'Total Investments',
      value: dashboardData.total_investments,
      subtitle: `${dashboardData.active_investments} active`,
      icon: <FiTrendingUp />,
      color: 'green',
      onClick: () => navigate('/rm/investments')
    },
    {
      title: 'Investment Value',
      value: `₹${(dashboardData.total_investment_value / 100000).toFixed(1)}L`,
      subtitle: 'Total portfolio',
      icon: <FiDollarSign />,
      color: 'purple'
    },
    {
      title: 'Active Leads',
      value: dashboardData.active_leads,
      subtitle: `${dashboardData.total_leads} total leads`,
      icon: <FiFileText />,
      color: 'orange',
      onClick: () => navigate('/rm/leads')
    },
    {
      title: 'KYC Pending',
      value: dashboardData.pending_kyc,
      subtitle: `${dashboardData.verified_kyc} verified`,
      icon: <FiCheckCircle />,
      color: 'yellow',
      onClick: () => navigate('/rm/kyc-pending')
    },
    {
      title: 'Pending Payments',
      value: dashboardData.pending_payments,
      subtitle: 'Requires follow-up',
      icon: <FiClock />,
      color: 'red'
    },
    {
      title: 'Pending Activities',
      value: dashboardData.pending_activities,
      subtitle: 'Follow-ups required',
      icon: <FiActivity />,
      color: 'cyan',
      onClick: () => navigate('/rm/activities')
    },
    {
      title: 'Monthly Target',
      value: `${dashboardData.achievement_percentage.toFixed(1)}%`,
      subtitle: `₹${(dashboardData.monthly_achieved / 100000).toFixed(1)}L / ₹${(dashboardData.monthly_target / 100000).toFixed(1)}L`,
      icon: <FiTarget />,
      color: 'indigo'
    }
  ] : [];

  /* -------------------- UI -------------------- */
  if (loading) {
    return (
      <div className="rm-dashboard-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rm-dashboard-page">
      <div className="rm-dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>RM Dashboard</h1>
            <p>Welcome back! Here's your performance overview</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate('/rm/customers/new')}
          >
            <FiUsers size={16} />
            Add Customer
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className={`stat-card ${stat.color} ${stat.onClick ? 'clickable' : ''}`}
              onClick={stat.onClick}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-title">{stat.title}</div>
                <div className="stat-subtitle">{stat.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Target Progress */}
        {dashboardData && (
          <div className="target-section">
            <h2>Monthly Target Progress</h2>
            <div className="progress-card">
              <div className="progress-header">
                <div>
                  <span className="progress-label">Achievement</span>
                  <span className="progress-percentage">
                    {dashboardData.achievement_percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="progress-amount">
                  ₹{(dashboardData.monthly_achieved / 100000).toFixed(2)}L of 
                  ₹{(dashboardData.monthly_target / 100000).toFixed(2)}L
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(dashboardData.achievement_percentage, 100)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button
              className="action-card"
              onClick={() => navigate('/rm/customers')}
            >
              <FiUsers size={24} />
              <span>View Customers</span>
            </button>
            <button
              className="action-card"
              onClick={() => navigate('/rm/leads')}
            >
              <FiFileText size={24} />
              <span>Manage Leads</span>
            </button>
            <button
              className="action-card"
              onClick={() => navigate('/rm/activities/new')}
            >
              <FiActivity size={24} />
              <span>Log Activity</span>
            </button>
            <button
              className="action-card"
              onClick={() => navigate('/rm/reports')}
            >
              <FiTrendingUp size={24} />
              <span>View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RMDashboard;