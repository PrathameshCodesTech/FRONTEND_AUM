import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import DataTable from '../../components/admin/DataTable';
import ActionModal from '../../components/admin/ActionModal';
import '../../styles/admin/AdminKYC.css';

const AdminKYC = () => {
  const navigate = useNavigate();
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'all'
  const [filters, setFilters] = useState({
    status: ''
  });
  
  // Quick action modal
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    kycId: null,
    action: null,
    title: '',
    message: '',
    requireReason: false,
    userName: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  const formatKycStatus = (status) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'under_review':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  useEffect(() => {
    fetchKYC();
  }, [activeTab, filters]);

const fetchKYC = async () => {
  setLoading(true);
  try {
    let response;
    
    if (activeTab === 'pending') {
      response = await adminService.getPendingKYC();
    } else {
      response = await adminService.getAllKYC(filters);
    }
    
    console.log('📦 KYC Response:', response); // 👈 For debugging
    
    if (response.success && response.results) {
      setKycList(response.results);
    } else {
      console.warn('⚠️ Unexpected KYC response format:', response);
      setKycList([]);
    }
  } catch (error) {
    console.error('❌ Error fetching KYC:', error);
    toast.error('Failed to load KYC submissions');
  } finally {
    setLoading(false);
  }
};

  const openQuickActionModal = (kyc, action) => {
    const modalConfig = {
      approve: {
        title: 'Approve KYC',
        message: `Are you sure you want to approve KYC for ${kyc.user?.username || 'this user'}? This will grant them full access to the platform.`,
        requireReason: false
      },
      reject: {
        title: 'Reject KYC',
        message: `Are you sure you want to reject KYC for ${kyc.user?.username || 'this user'}? Please provide a reason.`,
        requireReason: true
      }
    };

    setActionModal({
      isOpen: true,
      kycId: kyc.id,
      action,
      userName: kyc.user?.username || 'User',
      ...modalConfig[action]
    });
  };

  const handleQuickAction = async (reason) => {
    setActionLoading(true);
    
    try {
      const response = await adminService.kycAction(
        actionModal.kycId,
        actionModal.action,
        reason
      );

      if (response.success) {
        toast.success(response.message);
        fetchKYC(); // Refresh list
        setActionModal({ ...actionModal, isOpen: false });
      }
    } catch (error) {
      toast.error(error.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const renderIcon = (iconName) => {
    const icons = {
      filter: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      view: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  const columns = [
    {
      key: 'id',
      label: 'KYC ID',
      sortable: true,
      render: (value) => `#${value}`
    },
    {
      key: 'user',
      label: 'User',
      sortable: false,
      render: (value) => (
        <div className="user-cell">
          <div className="user-avatar-small">
            {value?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <strong>{value?.username || 'N/A'}</strong>
            <span className="user-email">{value?.email || ''}</span>
          </div>
        </div>
      )
    },
    {
      key: 'aadhaar_verified',
      label: 'Aadhaar',
      sortable: true,
      render: (value) => (
        <span className="status-text">
          {value ? 'Verified' : 'Pending'}
        </span>
      )
    },
    {
      key: 'pan_verified',
      label: 'PAN',
      sortable: true,
      render: (value) => (
        <span className="status-text">
          {value ? 'Verified' : 'Pending'}
        </span>
      )
    },
    {
      key: 'bank_verified',
      label: 'Bank',
      sortable: true,
      render: (value) => (
        <span className="status-text">
          {value ? 'Verified' : 'Optional'}
        </span>
      )
    },
    {
      key: 'pan_aadhaar_linked',
      label: 'PAN-Aadhaar Link',
      sortable: true,
      render: (value) => (
        <span className="status-text">
          {value ? 'Linked' : 'Not Linked'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span className="status-text">
          {formatKycStatus(value)}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Submitted',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
  ];

  const renderActions = (kyc) => (
    <div className="table-actions">
      <button
        className="btn-action btn-view"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/admin/kyc/${kyc.id}`);
        }}
        title="View Details"
      >
        {renderIcon('view')}
      </button>

      {kyc.status === 'pending' || kyc.status === 'under_review' ? (
        <>
          <button
            className="btn-action btn-approve"
            onClick={(e) => {
              e.stopPropagation();
              openQuickActionModal(kyc, 'approve');
            }}
            title="Approve KYC"
          >
            ✓
          </button>
          <button
            className="btn-action btn-reject"
            onClick={(e) => {
              e.stopPropagation();
              openQuickActionModal(kyc, 'reject');
            }}
            title="Reject KYC"
          >
            ✗
          </button>
        </>
      ) : null}
    </div>
  );

  return (
    <div className="admin-kyc-page">
      <div className="page-header">
        <div>
          <h1>KYC Management</h1>
          <p className="page-subtitle">Review and approve user KYC submissions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="kyc-tabs">
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('pending');
            setFilters({ status: '' });
          }}
        >
          Pending KYC
          {kycList.length > 0 && activeTab === 'pending' && (
            <span className="tab-badge">{kycList.length}</span>
          )}
        </button>
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All KYC
        </button>
      </div>

      {/* Filters (Only for "All" tab) */}
      {activeTab === 'all' && (
        <div className="page-filters">
          <div className="filter-group">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <button 
            className="btn-filter-reset" 
            onClick={() => setFilters({ status: '' })}
          >
            {renderIcon('filter')} Reset Filters
          </button>
        </div>
      )}

      {/* Stats Cards */}
      {activeTab === 'pending' && (
        <div className="kyc-stats">
          <div className="stat-card-kyc">
            <span className="stat-label-kyc">Pending Review</span>
            <span className="stat-value-kyc">{kycList.length}</span>
          </div>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={kycList}
        loading={loading}
        onRowClick={(kyc) => navigate(`/admin/kyc/${kyc.id}`)}
        actions={renderActions}
        emptyMessage={
          activeTab === 'pending' 
            ? 'No pending KYC submissions' 
            : 'No KYC submissions found'
        }
      />

      {/* Quick Action Modal */}
      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handleQuickAction}
        title={actionModal.title}
        message={actionModal.message}
        requireReason={actionModal.requireReason}
        loading={actionLoading}
        confirmText={actionModal.action === 'approve' ? 'Approve' : 'Reject'}
        confirmColor={actionModal.action === 'approve' ? '#28a745' : '#dc3545'}
      />
    </div>
  );
};

export default AdminKYC;