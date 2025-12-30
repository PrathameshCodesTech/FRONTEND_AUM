import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ActionModal from '../../components/admin/ActionModal';
import '../../styles/admin/AdminUsers.css';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    is_verified: '',
    is_suspended: '',
    role: ''
  });
  
  // Modal states
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    userId: null,
    action: null,
    title: '',
    message: '',
    requireReason: false
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

const fetchUsers = async () => {
  setLoading(true);
  try {
    const response = await adminService.getUsers(filters);
    
    console.log('📦 Users Response:', response); // 👈 For debugging
    
    if (response.success && response.results) {
      setUsers(response.results);
    } else {
      console.warn('⚠️ Unexpected response format:', response);
      setUsers([]);
    }
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    toast.error(error.response?.data?.message || 'Failed to load users');
  } finally {
    setLoading(false);
  }
};

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const openActionModal = (userId, action) => {
    const modalConfig = {
      verify: {
        title: 'Verify User',
        message: 'Are you sure you want to verify this user?',
        requireReason: false
      },
      suspend: {
        title: 'Suspend User',
        message: 'Are you sure you want to suspend this user? They will not be able to access their account.',
        requireReason: true
      },
      unsuspend: {
        title: 'Unsuspend User',
        message: 'Are you sure you want to unsuspend this user?',
        requireReason: false
      },
      block: {
        title: 'Block User',
        message: 'Are you sure you want to block this user? This is a permanent action.',
        requireReason: true
      },
      unblock: {
        title: 'Unblock User',
        message: 'Are you sure you want to unblock this user?',
        requireReason: false
      }
    };

    setActionModal({
      isOpen: true,
      userId,
      action,
      ...modalConfig[action]
    });
  };

  const handleUserAction = async (reason) => {
    setActionLoading(true);
    
    try {
      const response = await adminService.userAction(
        actionModal.userId,
        actionModal.action,
        reason
      );

      if (response.success) {
        toast.success(response.message);
        fetchUsers(); // Refresh list
        setActionModal({ ...actionModal, isOpen: false });
      }
    } catch (error) {
      toast.error(error.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (value) => `#${value}`
    },
    {
      key: 'username',
      label: 'Username',
      sortable: true,
      render: (value) => <strong>{value}</strong>
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: false
    },
    {
      key: 'role_name',
      label: 'Role',
      sortable: false,
      render: (value) => value || 'N/A'

    },
    // {
    //   key: 'is_verified',
    //   label: 'Verified',
    //   sortable: true,
    //   // render: (value) => (
    //   //   <StatusBadge 
    //   //     status={value ? 'verified' : 'pending'} 
    //   //     label={value ? 'Verified' : 'Not Verified'}
    //   //   />
    //   // )
    // },
    // {
    //   key: 'is_suspended',
    //   label: 'Status',
    //   sortable: true,
    //   // render: (value) => (
    //   //   <StatusBadge 
    //   //     status={value ? 'suspended' : 'active'} 
    //   //     label={value ? 'Suspended' : 'Active'}
    //   //   />
    //   // )
    // },
    {
      key: 'date_joined',
      label: 'Joined',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('en-IN')
    }
  ];

  const renderActions = (user) => (
    <div className="table-actions">
      <button
        className="btn-action btn-view"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/admin/users/${user.id}`);
        }}
        title="View Details"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </button>

      {!user.is_verified && (
        <button
          className="btn-action btn-approve"
          onClick={(e) => {
            e.stopPropagation();
            openActionModal(user.id, 'verify');
          }}
          title="Verify User"
        >
          ✓
        </button>
      )}

      {!user.is_suspended ? (
        <button
          className="btn-action btn-suspend"
          onClick={(e) => {
            e.stopPropagation();
            openActionModal(user.id, 'suspend');
          }}
          title="Suspend User"
        >
          ⏸
        </button>
      ) : (
        <button
          className="btn-action btn-approve"
          onClick={(e) => {
            e.stopPropagation();
            openActionModal(user.id, 'unsuspend');
          }}
          title="Unsuspend User"
        >
          ▶
        </button>
      )}
    </div>
  );

  return (
    <div className="admin-users-page">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p className="page-subtitle">Manage and monitor all platform users</p>
        </div>
         {/* Add User Button */}
          <button
            className="btn-primary"
            onClick={() => navigate('/admin/users/create')}
          >
            + Add User
          </button>
      </div>

      {/* Filters */}
      <div className="page-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-search"
          />
        </div>

        <div className="filter-group">
          <select
            value={filters.is_verified}
            onChange={(e) => handleFilterChange('is_verified', e.target.value)}
            className="filter-select"
          >
            <option value="">All Verification Status</option>
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.is_suspended}
            onChange={(e) => handleFilterChange('is_suspended', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="false">Active</option>
            <option value="true">Suspended</option>
          </select>
        </div>

        <button className="btn-filter-reset" onClick={() => setFilters({ search: '', is_verified: '', is_suspended: '', role: '' })}>
          Reset Filters
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
        actions={renderActions}
        emptyMessage="No users found"
      />

      {/* Action Modal */}
      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handleUserAction}
        title={actionModal.title}
        message={actionModal.message}
        requireReason={actionModal.requireReason}
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminUsers;
