// AdminCPApplications.jsx - HYBRID SOLUTION
import React, { useState, useEffect } from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi';
import CPApplicationCard from '../../../components/admin/cp/CPApplicationCard';
import CPApprovalModal from '../../../components/admin/cp/CPApprovalModal';
import adminService from '../../../services/adminService';
import '../../../styles/admin/cp/AdminCPPages.css';

const AdminCPApplications = () => {
  const [allApplications, setAllApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // ✅ FIXED: Fetch ALL applications by fetching each status separately
  useEffect(() => {
    fetchAllApplications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allApplications, statusFilter, searchQuery]);

  // ✅ HYBRID FIX: Fetch all statuses separately and combine them
  const fetchAllApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching ALL applications from all statuses');
      
      // ✅ Fetch each status separately
      const [pendingRes, inProgressRes, completedRes, rejectedRes] = await Promise.all([
        adminService.getCPApplications({ status: 'pending' }),
        adminService.getCPApplications({ status: 'in_progress' }),
        adminService.getCPApplications({ status: 'completed' }),
        adminService.getCPApplications({ status: 'rejected' })
      ]);
      
      // ✅ Combine all results
      const combined = [
        ...(pendingRes.success ? pendingRes.results : []),
        ...(inProgressRes.success ? inProgressRes.results : []),
        ...(completedRes.success ? completedRes.results : []),
        ...(rejectedRes.success ? rejectedRes.results : [])
      ];
      
      console.log('📦 Combined applications:', combined.length, 'items');
      console.log('   - Pending:', pendingRes.results?.length || 0);
      console.log('   - In Progress:', inProgressRes.results?.length || 0);
      console.log('   - Completed:', completedRes.results?.length || 0);
      console.log('   - Rejected:', rejectedRes.results?.length || 0);
      
      setAllApplications(combined);
      
    } catch (err) {
      setError('Failed to load applications');
      console.error('❌ Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allApplications];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.onboarding_status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.user_name?.toLowerCase().includes(query) ||
        app.cp_code?.toLowerCase().includes(query) ||
        app.company_name?.toLowerCase().includes(query) ||
        app.pan_number?.toLowerCase().includes(query) ||
        app.user_email?.toLowerCase().includes(query)
      );
    }

    setFilteredApplications(filtered);
  };

  const handleReview = (application) => {
    setSelectedApplication(application);
    setShowApprovalModal(true);
  };

  const handleApprovalSubmit = async (decision) => {
    await fetchAllApplications();
    setShowApprovalModal(false);
    setSelectedApplication(null);
  };

  // Calculate counts
  const pendingCount = allApplications.filter(a => a.onboarding_status === 'pending').length;
  const inProgressCount = allApplications.filter(a => a.onboarding_status === 'in_progress').length;
  const completedCount = allApplications.filter(a => a.onboarding_status === 'completed').length;
  const rejectedCount = allApplications.filter(a => a.onboarding_status === 'rejected').length;

  return (
    <div className="admin-cp-applications-page">
      <div className="admin-cp-applications-container">
        {/* Header */}
        <div className="admin-applications-header">
          <div>
            <h1>CP Applications</h1>
            <p>Review and approve channel partner applications</p>
          </div>
        </div>

        {/* Stats */}
        <div className="applications-stats">
          <div className="stat-card-admin pending">
            <div className="stat-value-admin">{pendingCount}</div>
            <div className="stat-label-admin">Pending Review</div>
          </div>
          <div className="stat-card-admin progress">
            <div className="stat-value-admin">{inProgressCount}</div>
            <div className="stat-label-admin">In Progress</div>
          </div>
          <div className="stat-card-admin completed">
            <div className="stat-value-admin">{completedCount}</div>
            <div className="stat-label-admin">Approved</div>
          </div>
          <div className="stat-card-admin rejected">
            <div className="stat-value-admin">{rejectedCount}</div>
            <div className="stat-label-admin">Rejected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="applications-controls">
          {/* Status Tabs */}
          <div className="status-tabs-admin">
            <button
              className={`status-tab-admin ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({allApplications.length})
            </button>
            <button
              className={`status-tab-admin ${statusFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('pending')}
            >
              Pending ({pendingCount})
            </button>
            <button
              className={`status-tab-admin ${statusFilter === 'in_progress' ? 'active' : ''}`}
              onClick={() => setStatusFilter('in_progress')}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              className={`status-tab-admin ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('completed')}
            >
              Approved ({completedCount})
            </button>
            <button
              className={`status-tab-admin ${statusFilter === 'rejected' ? 'active' : ''}`}
              onClick={() => setStatusFilter('rejected')}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Search */}
          <div className="search-bar-admin">
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="Search by name, CP code, company, or PAN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="error-banner-admin">
            <span>{error}</span>
            <button onClick={fetchAllApplications}>Retry</button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state-admin">
            <div className="spinner-admin"></div>
            <p>Loading applications...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredApplications.length === 0 && !error && (
          <div className="empty-state-admin">
            {searchQuery || statusFilter !== 'all' ? (
              <>
                <FiSearch size={60} color="#cccccc" />
                <h3>No Applications Found</h3>
                <p>Try adjusting your filters or search query</p>
                <button 
                  className="btn-clear-filters-admin"
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
                <div className="empty-icon-admin">📋</div>
                <h3>No Applications Yet</h3>
                <p>New CP applications will appear here for review</p>
              </>
            )}
          </div>
        )}

        {/* Applications Grid */}
        {!loading && filteredApplications.length > 0 && (
          <div className="applications-grid">
            {filteredApplications.map((application) => (
              <CPApplicationCard
                key={application.id}
                application={application}
                onReview={handleReview}
              />
            ))}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && selectedApplication && (
        <CPApprovalModal
          application={selectedApplication}
          onSubmit={handleApprovalSubmit}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedApplication(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminCPApplications;