// AdminCPList.jsx
// =====================================================
// Admin CP List Page
// View and manage all channel partners
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiUsers } from 'react-icons/fi';
import adminService from '../../../services/adminService';
import '../../../styles/admin/cp/AdminCPPages.css';

const AdminCPList = () => {
  const navigate = useNavigate();
  const [cps, setCps] = useState([]);
  const [filteredCps, setFilteredCps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCPs();
  }, [statusFilter]); // Refetch when filter changes

  useEffect(() => {
    applyFilters();
  }, [cps, searchQuery]);

  const fetchCPs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build filters based on current status
      const filters = {};
      
      if (statusFilter === 'active') {
        filters.is_verified = 'true';
        filters.is_active = 'true';
      } else if (statusFilter === 'inactive') {
        filters.is_active = 'false';
      } else if (statusFilter === 'pending_verification') {
        filters.is_verified = 'false';
      }
      // 'all' = no filters
      
      const response = await adminService.getCPList(filters);
      
      if (response.success) {
        setCps(response.results);
      } else {
        setError(response.error || 'Failed to load CPs');
      }
    } catch (err) {
      setError('Failed to load CPs');
      console.error('Error fetching CPs:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cps];

    // Search filter (local filter on already fetched data)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cp => 
        cp.user_name?.toLowerCase().includes(query) ||
        cp.cp_code?.toLowerCase().includes(query) ||
        cp.company_name?.toLowerCase().includes(query) ||
        cp.user_email?.toLowerCase().includes(query)
      );
    }

    setFilteredCps(filtered);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate counts from current data
  const activeCount = cps.filter(cp => cp.is_active && cp.is_verified).length;
  const inactiveCount = cps.filter(cp => !cp.is_active).length;
  const pendingCount = cps.filter(cp => !cp.is_verified).length;

  return (
    <div className="admin-cp-list-page">
      <div className="admin-cp-list-container">
        {/* Header */}
        <div className="admin-cp-list-header">
          <div>
            <h1>Channel Partners</h1>
            <p>Manage all channel partners</p>
          </div>
          <button 
            className="btn-create-cp"
            onClick={() => navigate('/admin/cp/create')}
          >
            <FiPlus size={20} />
            Create New CP
          </button>
        </div>

        {/* Stats */}
        <div className="cp-stats-admin">
          <div className="cp-stat-card-admin">
            <FiUsers size={32} />
            <div>
              <div className="cp-stat-value-admin">{cps.length}</div>
              <div className="cp-stat-label-admin">Total CPs</div>
            </div>
          </div>
          <div className="cp-stat-card-admin active">
            <div className="stat-icon-check">✓</div>
            <div>
              <div className="cp-stat-value-admin">{activeCount}</div>
              <div className="cp-stat-label-admin">Active</div>
            </div>
          </div>
          <div className="cp-stat-card-admin inactive">
            <div className="stat-icon-x">✕</div>
            <div>
              <div className="cp-stat-value-admin">{inactiveCount}</div>
              <div className="cp-stat-label-admin">Inactive</div>
            </div>
          </div>
          <div className="cp-stat-card-admin pending">
            <div className="stat-icon-clock">⏱</div>
            <div>
              <div className="cp-stat-value-admin">{pendingCount}</div>
              <div className="cp-stat-label-admin">Pending</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="cp-list-controls">
          <div className="filter-tabs-cp-list">
            <button
              className={`filter-tab-cp-list ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({cps.length})
            </button>
            <button
              className={`filter-tab-cp-list ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              Active ({activeCount})
            </button>
            <button
              className={`filter-tab-cp-list ${statusFilter === 'inactive' ? 'active' : ''}`}
              onClick={() => setStatusFilter('inactive')}
            >
              Inactive ({inactiveCount})
            </button>
            <button
              className={`filter-tab-cp-list ${statusFilter === 'pending_verification' ? 'active' : ''}`}
              onClick={() => setStatusFilter('pending_verification')}
            >
              Pending ({pendingCount})
            </button>
          </div>

          <div className="search-bar-cp-list">
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Search by name, CP code, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="error-banner-admin">
            <span>{error}</span>
            <button onClick={fetchCPs}>Retry</button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state-admin">
            <div className="spinner-admin"></div>
            <p>Loading channel partners...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCps.length === 0 && !error && (
          <div className="empty-state-cp-list">
            {searchQuery || statusFilter !== 'all' ? (
              <>
                <FiSearch size={60} color="#cccccc" />
                <h3>No Channel Partners Found</h3>
                <p>Try adjusting your filters or search query</p>
                <button 
                  className="btn-clear-filters"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <FiUsers size={60} color="#cccccc" />
                <h3>No Channel Partners Found</h3>
                <p>Create your first CP to get started</p>
                <button 
                  className="btn-create-first"
                  onClick={() => navigate('/admin/cp/create')}
                >
                  Create Channel Partner
                </button>
              </>
            )}
          </div>
        )}

        {/* CP Table */}
        {!loading && filteredCps.length > 0 && (
          <div className="cp-table-container">
            <table className="cp-table">
              <thead>
                <tr>
                  <th>CP Code</th>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Tier</th>
                  <th>Customers</th>
                  <th>Total Invested</th>
                  <th>Commission</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCps.map((cp) => (
                  <tr key={cp.id}>
                    <td className="cp-code-cell">{cp.cp_code}</td>
                    <td className="name-cell">{cp.user_name}</td>
                    <td>{cp.company_name || '-'}</td>
                    <td>
                      <span className={`tier-badge-admin ${cp.partner_tier}`}>
                        {cp.partner_tier.toUpperCase()}
                      </span>
                    </td>
                    <td className="number-cell">{cp.total_customers || 0}</td>
                    <td className="amount-cell">
                      {formatCurrency(parseFloat(cp.total_invested) || 0)}
                    </td>
                    <td className="amount-cell success">
                      {formatCurrency(parseFloat(cp.total_commission) || 0)}
                    </td>
                    <td>
                      <span className={`status-badge-admin ${cp.is_active && cp.is_verified ? 'active' : 'inactive'}`}>
                        {cp.is_active && cp.is_verified ? 'Active' : cp.is_verified ? 'Inactive' : 'Pending'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn-view-cp"
                        // onClick={() => navigate(`/admin/cp/${cp.id}/detail`)}
                       onClick={() => navigate(`/admin/cp/${cp.id}`)}  // Correct
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCPList;