import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ActionModal from '../../components/admin/ActionModal';
import '../../styles/admin/AdminProperties.css';

const AdminProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    property_type: ''
  });

  // Action modal
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    propertyId: null,
    action: null,
    title: '',
    message: '',
    propertyName: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await adminService.getProperties(filters);

      console.log('📦 Properties Response:', response); // 👈 For debugging

      if (response.success && response.results) {
        setProperties(response.results);
      } else {
        console.warn('⚠️ Unexpected response format:', response);
        setProperties([]);
      }
    } catch (error) {
      console.error('❌ Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const openActionModal = (property, action) => {
    const modalConfig = {
      publish: {
        title: 'Publish Property',
        message: `Are you sure you want to publish "${property.name}"? It will be visible to all users.`
      },
      unpublish: {
        title: 'Unpublish Property',
        message: `Are you sure you want to unpublish "${property.name}"? It will no longer be visible to users.`
      },
      archive: {
        title: 'Archive Property',
        message: `Are you sure you want to archive "${property.name}"?`
      },
      feature: {
        title: 'Feature Property',
        message: `Mark "${property.name}" as featured? It will be highlighted on the platform.`
      },
      unfeature: {
        title: 'Remove Featured',
        message: `Remove featured status from "${property.name}"?`
      },
      delete: {
        title: 'Delete Property',
        message: `Are you sure you want to delete "${property.name}"? This action cannot be undone.`
      }
    };

    setActionModal({
      isOpen: true,
      propertyId: property.id,
      action,
      propertyName: property.name,
      ...modalConfig[action]
    });
  };

  const handlePropertyAction = async () => {
    setActionLoading(true);

    try {
      let response;

      if (actionModal.action === 'delete') {
        response = await adminService.deleteProperty(actionModal.propertyId);
      } else {
        response = await adminService.propertyAction(
          actionModal.propertyId,
          actionModal.action
        );
      }

      if (response.success) {
        toast.success(response.message);
        fetchProperties(); // Refresh list
        setActionModal({ ...actionModal, isOpen: false });
      }
    } catch (error) {
      toast.error(error.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderIcon = (iconName) => {
    const icons = {
      add: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      view: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      edit: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (value) => `#${value}`
    },
    {
      key: 'name',
      label: 'Property Name',
      sortable: true,
      render: (value, row) => (
        <div className="property-cell">
          <strong>{value}</strong>
          {row.is_featured && <span className="featured-badge">⭐ Featured</span>}
        </div>
      )
    },
    {
      key: 'city',
      label: 'Location',
      sortable: true,
      render: (value, row) => `${row.locality || ''} ${value}, ${row.state || ''}`.trim()
    },
    {
      key: 'total_value',
      label: 'Total Value',
      sortable: true,
      render: (value) => formatCurrency(value)
    },
    {
      key: 'units_available',
      label: 'Available',
      sortable: true,
      render: (value, row) => `${value} / ${row.total_units}`
    },
    {
      key: 'funding_percentage',
      label: 'Funding',
      sortable: true,
      render: (value) => `${value.toFixed(1)}%`
    },
    {
  key: 'status',
  label: 'Status',
  sortable: true,
  render: (value) => (
    <span className={`status-badge-${value}`}>
      {value === 'live' ? 'Live' :
       value === 'draft' ? 'Draft' :
       value === 'completed' ? 'Completed' :
       value === 'funded' ? 'Fully Funded' : value}
    </span>
  )
},
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
  ];

  const renderActions = (property) => (
    <div className="table-actions">
      <button
        className="btn-action btn-view"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/admin/properties/${property.id}`);
        }}
        title="View Details"
      >
        {renderIcon('view')}
      </button>

      <button
        className="btn-action btn-edit"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/admin/properties/${property.id}/edit`);
        }}
        title="Edit Property"
      >
        {renderIcon('edit')}
      </button>

      {property.status === 'draft' ? (
        <button
          className="btn-action btn-approve"
          onClick={(e) => {
            e.stopPropagation();
            openActionModal(property, 'publish');
          }}
          title="Publish"
        >
          ✓
        </button>
      ) : property.status === 'published' ? (
        <button
          className="btn-action btn-suspend"
          onClick={(e) => {
            e.stopPropagation();
            openActionModal(property, 'unpublish');
          }}
          title="Unpublish"
        >
          ⏸
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="admin-properties-page">
      <div className="page-header">
        <div>
          <h1>Property Management</h1>
          <p className="page-subtitle">Manage all properties on the platform</p>
        </div>
        <button
          className="btn-primary-admin"
          onClick={() => navigate('/admin/properties/create')}
        >
          {renderIcon('add')}
          Add New Property
        </button>
      </div>

      {/* Filters */}
      <div className="page-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by name, location, city..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-search"
          />
        </div>

        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="live">Live</option>
            <option value="funding">Funding</option>
            <option value="funded">Fully Funded</option>
            <option value="under_construction">Under Construction</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>



        <button
          className="btn-filter-reset"
          onClick={() => setFilters({ search: '', status: '', property_type: '' })}
        >
          Reset Filters
        </button>
      </div>

      {/* Stats */}
      <div className="property-stats">
        <div className="stat-card-property">
          <span className="stat-label-property">Total Properties</span>
          <span className="stat-value-property">{properties.length}</span>
        </div>
        <div className="stat-card-property">
          <span className="stat-label-property">Published</span>
          <span className="stat-value-property">
            {properties.filter(p => p.status === 'published').length}
          </span>
        </div>
        <div className="stat-card-property">
          <span className="stat-label-property">Draft</span>
          <span className="stat-value-property">
            {properties.filter(p => p.status === 'draft').length}
          </span>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={properties}
        loading={loading}
        onRowClick={(property) => navigate(`/admin/properties/${property.id}`)}
        actions={renderActions}
        emptyMessage="No properties found"
      />

      {/* Action Modal */}
      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handlePropertyAction}
        title={actionModal.title}
        message={actionModal.message}
        loading={actionLoading}
        confirmColor={actionModal.action === 'delete' ? '#dc3545' : '#000000'}
      />
    </div>
  );
};

export default AdminProperties;