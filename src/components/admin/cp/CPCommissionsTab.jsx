// CPCommissionsTab.jsx
import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiCheck, FiX } from 'react-icons/fi';
import adminService from '../../../services/adminService';
import '../../../styles/admin/cp/CPCommissionsTab.css';

const CPCommissionsTab = ({ cpId, cpCode }) => {
  const [commissions, setCommissions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, paid

  useEffect(() => {
    fetchCPCommissions();
  }, [cpId, filter]);

  const fetchCPCommissions = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCPCommissions(cpId, filter !== 'all' ? filter : null);
      
      if (response.success) {
        setCommissions(response.commissions || []);
        setSummary(response.summary || {});
      }
    } catch (error) {
      console.error('Error fetching commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numAmount || 0);  
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'warning', icon: '⏳', text: 'Pending' },
      approved: { class: 'success', icon: '✓', text: 'Approved' },
      paid: { class: 'paid', icon: '💰', text: 'Paid' },
      cancelled: { class: 'danger', icon: '✗', text: 'Cancelled' }
    };
    
    const badge = badges[status] || badges.pending;
    return (
      <span className={`status-badge ${badge.class}`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  if (loading) {
    return <div className="loading-state">Loading commissions...</div>;
  }

  return (
    <div className="cp-commissions-tab">
      {/* Summary Cards */}
      {summary && (
        <div className="commission-summary-grid">
          <div className="summary-card pending">
            <div className="summary-icon">⏳</div>
            <div className="summary-content">
              <div className="summary-label">Pending</div>
              <div className="summary-value">{formatCurrency(summary.total_pending)}</div>
            </div>
          </div>

          <div className="summary-card approved">
            <div className="summary-icon">✓</div>
            <div className="summary-content">
              <div className="summary-label">Approved</div>
              <div className="summary-value">{formatCurrency(summary.total_approved)}</div>
            </div>
          </div>

          <div className="summary-card paid">
            <div className="summary-icon">💰</div>
            <div className="summary-content">
              <div className="summary-label">Paid</div>
              <div className="summary-value">{formatCurrency(summary.total_paid)}</div>
            </div>
          </div>

          <div className="summary-card total">
            <div className="summary-icon">📊</div>
            <div className="summary-content">
              <div className="summary-label">Total Earned</div>
              <div className="summary-value">{formatCurrency(summary.total_earned)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="commission-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
        <button 
          className={`filter-btn ${filter === 'paid' ? 'active' : ''}`}
          onClick={() => setFilter('paid')}
        >
          Paid
        </button>
      </div>

      {/* Commissions Table */}
      {commissions.length === 0 ? (
        <div className="empty-state">
          <FiDollarSign size={48} color="#ccc" />
          <h4>No Commissions</h4>
          <p>No {filter !== 'all' ? filter : ''} commissions found for this CP.</p>
        </div>
      ) : (
        <div className="commissions-table-container">
          <table className="commissions-table">
            <thead>
              <tr>
                <th>Commission ID</th>
                <th>Investment</th>
                <th>Customer</th>
                <th>Property</th>
                <th>Base Amount</th>
                <th>Rate</th>
                <th>Commission</th>
                <th>TDS (10%)</th>
                <th>Net Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((comm) => (
                <tr key={comm.id}>
                  <td>
                    <code className="commission-id">{comm.commission_id}</code>
                  </td>
                  <td>
                    <code className="investment-id">{comm.investment_id}</code>
                  </td>
                  <td>{comm.customer_name}</td>
                  <td className="property-name">{comm.property_name}</td>
                  <td>{formatCurrency(comm.base_amount)}</td>
                  <td className="rate">{comm.commission_rate}%</td>
                  <td className="commission-amount">{formatCurrency(comm.commission_amount)}</td>
                  <td className="tds-amount">-{formatCurrency(comm.tds_amount)}</td>
                  <td className="net-amount">
                    <strong>{formatCurrency(comm.net_amount)}</strong>
                  </td>
                  <td>{getStatusBadge(comm.status)}</td>
                  <td>{formatDate(comm.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CPCommissionsTab;