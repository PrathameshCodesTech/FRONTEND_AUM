import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import ActionModal from '../../components/admin/ActionModal';
import '../../styles/admin/AdminInvestments.css';

const AdminInvestments = () => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    property: '',
    date_from: '',
    date_to: ''
  });
  
  // Action modal
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    investmentId: null,
    action: null,
    title: '',
    message: '',
    requireReason: false,
    userName: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchInvestments();
    fetchStats();
  }, [filters]);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const response = await adminService.getInvestments(filters);
      
      console.log('📦 Investments Response:', response);
      
      if (response.success && response.results) {
        setInvestments(response.results);
      } else {
        console.warn('⚠️ Unexpected response format:', response);
        setInvestments([]);
      }
    } catch (error) {
      console.error('❌ Error fetching investments:', error);
      toast.error('Failed to load investments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await adminService.getInvestmentStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('❌ Error fetching investment stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const openActionModal = (investment, action) => {
    const modalConfig = {
      approve_payment: {
        title: 'Approve Payment',
        message: `Approve payment for investment #${investment.investment_id}? This will verify the payment proof.`,
        requireReason: false
      },
      reject_payment: {
        title: 'Reject Payment',
        message: `Reject payment for investment #${investment.investment_id}? User will be notified.`,
        requireReason: true
      },
      approve: {
        title: 'Approve Investment',
        message: `Approve investment #${investment.investment_id}? Units will be deducted and commission calculated.`,
        requireReason: false
      },
      reject: {
        title: 'Reject Investment',
        message: `Are you sure you want to reject investment #${investment.investment_id}? Please provide a reason.`,
        requireReason: true
      },
      complete: {
        title: 'Mark as Completed',
        message: `Mark investment #${investment.investment_id} as payment completed?`,
        requireReason: false
      },
      cancel: {
        title: 'Cancel Investment',
        message: `Are you sure you want to cancel investment #${investment.investment_id}? Units will be returned to property.`,
        requireReason: true
      }
    };

    setActionModal({
      isOpen: true,
      investmentId: investment.id,
      action,
      userName: investment.customer_name || 'User',
      ...modalConfig[action]
    });
  };

  const handleInvestmentAction = async (reason) => {
    setActionLoading(true);
    
    try {
      const response = await adminService.investmentAction(
        actionModal.investmentId,
        actionModal.action,
        reason
      );

      if (response.success) {
        toast.success(response.message);
        fetchInvestments();
        fetchStats();
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
      filter: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      view: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      trending: (
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
      check: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      clock: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      creditCard: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      phone: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      document: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      bank: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      approve: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      reject: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'ONLINE':
        return renderIcon('creditCard');
      case 'POS':
        return renderIcon('phone');
      case 'DRAFT_CHEQUE':
        return renderIcon('document');
      case 'NEFT_RTGS':
        return renderIcon('bank');
      default:
        return null;
    }
  };

  const columns = [
    {
      key: 'investment_id',
      label: 'Investment ID',
      sortable: true,
      render: (value) => <strong>#{value}</strong>
    },
    {
      key: 'customer_name',
      label: 'Customer',
      sortable: false,
      render: (value, row) => (
        <div className="user-cell">
          <div className="user-avatar-small">
            {value?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <strong>{value || 'N/A'}</strong>
            <span className="user-email">{row.customer_email || ''}</span>
          </div>
        </div>
      )
    },
    {
      key: 'property_name',
      label: 'Property',
      sortable: false,
      render: (value) => value || 'N/A'
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value) => <strong>{formatCurrency(value)}</strong>
    },
    {
      key: 'units_purchased',
      label: 'Units',
      sortable: true
    },
    {
      key: 'payment_method',
      label: 'Payment',
      sortable: false,
      render: (value, row) => {
        if (!value) return <span className="text-muted">-</span>;
        return (
          <div className="payment-method-cell">
            <span className="payment-method-icon">
              {getPaymentMethodIcon(value)}
            </span>
            <span className="payment-method-text">
              {row.payment_method_display || value}
            </span>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      // render: (value, row) => (
      //   <div className="status-cell">
      //     <StatusBadge status={value} />
      //     {row.payment_status && (
      //       <StatusBadge 
      //         status={row.payment_status.toLowerCase()} 
      //         label={row.payment_status} 
      //       />
      //     )}
      //   </div>
      // )
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
  ];

  const renderActions = (investment) => (
    <div className="table-actions">
      <button
        className="btn-action btn-view"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/admin/investments/${investment.id}`);
        }}
        title="View Details"
      >
        {renderIcon('view')}
      </button>

      {/* PAYMENT APPROVAL (pending_payment status) */}
      {investment.status === 'pending_payment' && (
        <>
          <button
            className="btn-action btn-approve"
            onClick={(e) => {
              e.stopPropagation();
              openActionModal(investment, 'approve_payment');
            }}
            title="Approve Payment"
          >
            {renderIcon('approve')}
          </button>
          <button
            className="btn-action btn-reject"
            onClick={(e) => {
              e.stopPropagation();
              openActionModal(investment, 'reject_payment');
            }}
            title="Reject Payment"
          >
            {renderIcon('reject')}
          </button>
        </>
      )}

      {/* INVESTMENT APPROVAL (payment_approved status) */}
      {investment.status === 'payment_approved' && (
        <>
          <button
            className="btn-action btn-approve"
            onClick={(e) => {
              e.stopPropagation();
              openActionModal(investment, 'approve');
            }}
            title="Approve Investment"
          >
            {renderIcon('approve')}
          </button>
          <button
            className="btn-action btn-reject"
            onClick={(e) => {
              e.stopPropagation();
              openActionModal(investment, 'reject');
            }}
            title="Reject Investment"
          >
            {renderIcon('reject')}
          </button>
        </>
      )}

      {investment.status === 'approved' && !investment.payment_completed && (
        <button
          className="btn-action btn-approve"
          onClick={(e) => {
            e.stopPropagation();
            openActionModal(investment, 'complete');
          }}
          title="Mark as Completed"
        >
          {renderIcon('check')}
        </button>
      )}
    </div>
  );

  return (
    <div className="admin-investments-page">
      <div className="page-header">
        <div>
          <h1>Investment Management</h1>
          <p className="page-subtitle">Monitor and manage all platform investments</p>
        </div>
      </div>

      {/* Stats */}
      {!statsLoading && stats && (
        <div className="investment-stats">
          <div className="stat-card-investment">
            <span className="stat-icon-invest">{renderIcon('trending')}</span>
            <div className="stat-content-invest">
              <span className="stat-label-invest">Total Investments</span>
              <span className="stat-value-invest">{stats.total_investments || 0}</span>
            </div>
          </div>
          <div className="stat-card-investment">
            <span className="stat-icon-invest">{renderIcon('money')}</span>
            <div className="stat-content-invest">
              <span className="stat-label-invest">Total Amount</span>
              <span className="stat-value-invest">{formatCurrency(stats.total_investment_amount)}</span>
            </div>
          </div>
          <div className="stat-card-investment">
            <span className="stat-icon-invest stat-icon-warning">{renderIcon('clock')}</span>
            <div className="stat-content-invest">
              <span className="stat-label-invest">Pending</span>
              <span className="stat-value-invest">{stats.pending_investments || 0}</span>
            </div>
          </div>
          <div className="stat-card-investment">
            <span className="stat-icon-invest stat-icon-success">{renderIcon('check')}</span>
            <div className="stat-content-invest">
              <span className="stat-label-invest">Approved</span>
              <span className="stat-value-invest">{stats.approved_investments || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="page-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by customer, phone, investment ID..."
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
            <option value="pending_payment">Pending Payment</option>
            <option value="payment_approved">Payment Approved</option>
            <option value="payment_rejected">Payment Rejected</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="filter-group">
          <input
            type="date"
            placeholder="From Date"
            value={filters.date_from}
            onChange={(e) => handleFilterChange('date_from', e.target.value)}
            className="filter-select"
          />
        </div>

        <div className="filter-group">
          <input
            type="date"
            placeholder="To Date"
            value={filters.date_to}
            onChange={(e) => handleFilterChange('date_to', e.target.value)}
            className="filter-select"
          />
        </div>

        <button 
          className="btn-filter-reset" 
          onClick={() => setFilters({ search: '', status: '', property: '', date_from: '', date_to: '' })}
        >
          {renderIcon('filter')} Reset Filters
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={investments}
        loading={loading}
        onRowClick={(investment) => navigate(`/admin/investments/${investment.id}`)}
        actions={renderActions}
        emptyMessage="No investments found"
      />

      {/* Action Modal */}
      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handleInvestmentAction}
        title={actionModal.title}
        message={actionModal.message}
        requireReason={actionModal.requireReason}
        loading={actionLoading}
        confirmText={
          actionModal.action === 'approve_payment' ? 'Approve Payment' :
          actionModal.action === 'reject_payment' ? 'Reject Payment' :
          actionModal.action === 'approve' ? 'Approve Investment' :
          actionModal.action === 'reject' ? 'Reject' :
          actionModal.action === 'complete' ? 'Mark Complete' :
          'Cancel Investment'
        }
        confirmColor={
          actionModal.action === 'approve_payment' ? '#28a745' :
          actionModal.action === 'approve' ? '#28a745' :
          actionModal.action === 'reject_payment' ? '#dc3545' :
          actionModal.action === 'reject' ? '#dc3545' :
          actionModal.action === 'complete' ? '#28a745' :
          '#ff9800'
        }
      />
    </div>
  );
};

export default AdminInvestments;