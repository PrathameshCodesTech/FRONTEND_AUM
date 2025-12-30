import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import '../../styles/admin/RMManagement.css';

const RMManagement = () => {
  const navigate = useNavigate();
  const [rms, setRMs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRMs();
  }, []);

  const fetchRMs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔵 Fetching RMs...');
      const response = await api.get('/admin/rms/');
      console.log('✅ RM Response:', response.data);
      
      if (response.data.success) {
        setRMs(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch RMs');
      }
    } catch (error) {
      console.error('❌ Error fetching RMs:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load RMs');
      toast.error('Failed to load Relationship Managers');
    } finally {
      setLoading(false);
    }
  };

  const viewRMCustomers = (rmId) => {
    navigate(`/admin/rms/${rmId}/customers`);
  };

  const createNewRM = () => {
    navigate('/admin/users/create', { state: { role: 'relationship_manager' } });
  };

  if (loading) {
    return (
      <div className="rm-management">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading Relationship Managers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rm-management">
        <div className="error-container">
          <h3>Error Loading RMs</h3>
          <p>{error}</p>
          <button className="btn-retry" onClick={fetchRMs}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rm-management">
      <div className="page-header">
        <div>
          <h1>Relationship Managers</h1>
          <p className="page-subtitle">Manage RMs and their customer assignments</p>
        </div>
        <button className="btn-primary" onClick={createNewRM}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Create New RM
        </button>
      </div>

      {rms.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="empty-icon">
            <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2"/>
            <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M20 8V14M17 11H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3>No Relationship Managers Found</h3>
          <p>Create your first RM to start managing customer relationships</p>
          <button className="btn-primary" onClick={createNewRM}>
            Create First RM
          </button>
        </div>
      ) : (
        <div className="rm-grid">
          {rms.map((rm) => (
            <div key={rm.id} className="rm-card">
              <div className="rm-header">
                <div className="rm-avatar">
                  {rm.first_name?.[0]}{rm.last_name?.[0]}
                </div>
                <div className="rm-info">
                  <h3>{rm.first_name} {rm.last_name}</h3>
                  <p className="rm-username">@{rm.username}</p>
                </div>
              </div>
              
              <div className="rm-details">
                <div className="detail-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{rm.email}</span>
                </div>
                <div className="detail-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92V19.92C22 20.49 21.54 20.95 20.97 20.92C9.43 20.14 2 12.71 2 1.03C2 0.46 2.46 0 3.03 0H6.03C6.6 0 7.06 0.46 7.06 1.03C7.06 2.41 7.27 3.74 7.67 4.99C7.79 5.39 7.68 5.82 7.39 6.11L5.63 7.87C7.57 11.76 11.24 15.43 15.13 17.37L16.89 15.61C17.18 15.32 17.61 15.21 18.01 15.33C19.26 15.73 20.59 15.94 21.97 15.94C22.54 15.94 23 16.4 23 16.97V19.97C23 20.54 22.54 21 21.97 21Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>{rm.phone}</span>
                </div>
              </div>

              <div className="rm-stats">
                <div className="stat-item">
                  <span className="stat-value">{rm.customer_count || 0}</span>
                  <span className="stat-label">Assigned Customers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-badge active">Active</span>
                </div>
              </div>

              <div className="rm-actions">
                <button 
                  className="btn-view"
                  onClick={() => viewRMCustomers(rm.id)}
                >
                  View Customers
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => navigate(`/admin/users/${rm.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RMManagement;