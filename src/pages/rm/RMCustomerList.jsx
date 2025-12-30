// RMCustomerList.jsx
// =====================================================
// RM Customer List View
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiFilter,
  FiUser,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import rmService from '../../services/rmService';
import '../../styles/rm/RMCustomerList.css';

const RMCustomerList = () => {
  const navigate = useNavigate();

  /* -------------------- State -------------------- */
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [kycFilter, setKycFilter] = useState('all');

  /* -------------------- Fetch Customers -------------------- */
  useEffect(() => {
    fetchCustomers();
  }, [kycFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (kycFilter !== 'all') {
        params.kyc_status = kycFilter;
      }

      const response = await rmService.getCustomers(params);

      if (response.success) {
        setCustomers(response.data);
      } else {
        toast.error('Failed to load customers');
      }
    } catch (error) {
      console.error('Fetch customers error:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- Search Filter -------------------- */
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.first_name?.toLowerCase().includes(searchLower) ||
      customer.last_name?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchTerm) ||
      customer.username?.toLowerCase().includes(searchLower)
    );
  });

  /* -------------------- KYC Status Badge -------------------- */
  const getKYCBadge = (status) => {
    const badges = {
      verified: { label: 'Verified', icon: <FiCheckCircle />, className: 'badge-success' },
      pending: { label: 'Pending', icon: <FiClock />, className: 'badge-warning' },
      submitted: { label: 'Submitted', icon: <FiClock />, className: 'badge-info' },
      rejected: { label: 'Rejected', icon: <FiXCircle />, className: 'badge-danger' },
      not_submitted: { label: 'Not Submitted', icon: <FiXCircle />, className: 'badge-secondary' }
    };

    const badge = badges[status] || badges.not_submitted;

    return (
      <span className={`kyc-badge ${badge.className}`}>
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="rm-customer-list-page">
      <div className="rm-customer-list-container">
        {/* Header */}
        <div className="list-header">
          <div>
            <h1>My Customers</h1>
            <p>Manage and track your assigned customers</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate('/rm/leads/new')}
          >
            <FiUser size={16} />
            Add Lead
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <FiSearch size={18} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <FiFilter size={16} />
            <select
              value={kycFilter}
              onChange={(e) => setKycFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All KYC Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="rejected">Rejected</option>
              <option value="not_submitted">Not Submitted</option>
            </select>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">Total Customers</span>
            <span className="stat-value">{customers.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Showing</span>
            <span className="stat-value">{filteredCustomers.length}</span>
          </div>
        </div>

        {/* Customers Table */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="empty-state">
            <FiUser size={48} />
            <p>No customers found</p>
          </div>
        ) : (
          <div className="customers-table-container">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>KYC Status</th>
                  <th>Investments</th>
                  <th>Total Invested</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-info">
                        <div className="customer-avatar">
                          {customer.first_name?.[0]}{customer.last_name?.[0]}
                        </div>
                        <div>
                          <div className="customer-name">
                            {customer.first_name} {customer.last_name}
                          </div>
                          <div className="customer-username">@{customer.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div className="contact-item">
                          <FiMail size={14} />
                          {customer.email}
                        </div>
                        <div className="contact-item">
                          <FiPhone size={14} />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td>
                      {getKYCBadge(customer.kyc_status)}
                    </td>
                    <td className="text-center">
                      {customer.total_investments || 0}
                    </td>
                    <td className="text-right">
                      ₹{(customer.total_invested / 100000).toFixed(2)}L
                    </td>
                    <td>
                      {new Date(customer.date_joined).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => navigate(`/rm/customers/${customer.id}`)}
                      >
                        <FiEye size={16} />
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

export default RMCustomerList;