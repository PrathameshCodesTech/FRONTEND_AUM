// RMLeadList.jsx
// =====================================================
// RM Lead Management
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiPhone,
  FiMail,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import rmService from '../../services/rmService';
import '../../styles/rm/RMLeadList.css';

const RMLeadList = () => {
  const navigate = useNavigate();

  /* -------------------- State -------------------- */
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  /* -------------------- Fetch Leads -------------------- */
  useEffect(() => {
    fetchLeads();
  }, [statusFilter, sourceFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = {};

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (sourceFilter !== 'all') {
        params.source = sourceFilter;
      }

      const response = await rmService.getLeads(params);

      if (response.success) {
        setLeads(response.data);
      } else {
        toast.error('Failed to load leads');
      }
    } catch (error) {
      console.error('Fetch leads error:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- Search Filter -------------------- */
  const filteredLeads = leads.filter((lead) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.name?.toLowerCase().includes(searchLower) ||
      lead.phone?.includes(searchTerm) ||
      lead.email?.toLowerCase().includes(searchLower)
    );
  });

  /* -------------------- Status Badge -------------------- */
  const getStatusBadge = (status) => {
    const badges = {
      new: { label: 'New', className: 'badge-new' },
      contacted: { label: 'Contacted', className: 'badge-contacted' },
      interested: { label: 'Interested', className: 'badge-interested' },
      not_interested: { label: 'Not Interested', className: 'badge-not-interested' },
      site_visit_scheduled: { label: 'Site Visit Scheduled', className: 'badge-scheduled' },
      site_visit_done: { label: 'Site Visit Done', className: 'badge-done' },
      negotiation: { label: 'Negotiation', className: 'badge-negotiation' },
      converted: { label: 'Converted', className: 'badge-converted' },
      lost: { label: 'Lost', className: 'badge-lost' }
    };

    const badge = badges[status] || badges.new;

    return <span className={`status-badge ${badge.className}`}>{badge.label}</span>;
  };

  /* -------------------- Delete Lead -------------------- */
  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) {
      return;
    }

    try {
      const response = await rmService.deleteLead(leadId);

      if (response.success) {
        toast.success('Lead deleted successfully');
        fetchLeads();
      } else {
        toast.error('Failed to delete lead');
      }
    } catch (error) {
      console.error('Delete lead error:', error);
      toast.error('Failed to delete lead');
    }
  };

  /* -------------------- Stats -------------------- */
  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    interested: leads.filter((l) =>
      ['interested', 'site_visit_scheduled', 'negotiation'].includes(l.status)
    ).length,
    converted: leads.filter((l) => l.status === 'converted').length
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="rm-lead-list-page">
      <div className="rm-lead-list-container">
        {/* Header */}
        <div className="list-header">
          <div>
            <h1>My Leads</h1>
            <p>Manage and track your sales pipeline</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/rm/leads/new')}>
            <FiPlus size={16} />
            Add Lead
          </button>
        </div>

        {/* Stats Cards */}
        <div className="leads-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Leads</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.new}</div>
            <div className="stat-label">New</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.interested}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card green">
            <div className="stat-value">{stats.converted}</div>
            <div className="stat-label">Converted</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <FiSearch size={18} />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <FiFilter size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="interested">Interested</option>
              <option value="not_interested">Not Interested</option>
              <option value="site_visit_scheduled">Site Visit Scheduled</option>
              <option value="site_visit_done">Site Visit Done</option>
              <option value="negotiation">Negotiation</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Sources</option>
              <option value="website">Website</option>
              <option value="direct">Direct Walk-in</option>
              <option value="referral">Referral</option>
              <option value="marketing">Marketing</option>
              <option value="event">Event</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="empty-state">
            <FiPlus size={48} />
            <p>No leads found</p>
            <button className="btn-primary" onClick={() => navigate('/rm/leads/new')}>
              Add Your First Lead
            </button>
          </div>
        ) : (
          <div className="leads-table-container">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Contact</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Budget Range</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="lead-info">
                        <div className="lead-avatar">{lead.name[0]}</div>
                        <div>
                          <div className="lead-name">{lead.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div className="contact-item">
                          <FiPhone size={14} />
                          {lead.phone}
                        </div>
                        {lead.email && (
                          <div className="contact-item">
                            <FiMail size={14} />
                            {lead.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="source-badge">{lead.source}</span>
                    </td>
                    <td>{getStatusBadge(lead.status)}</td>
                    <td>
                      {lead.budget_min && lead.budget_max ? (
                        <span className="budget-range">
                          ₹{(lead.budget_min / 100000).toFixed(1)}L -
                          ₹{(lead.budget_max / 100000).toFixed(1)}L
                        </span>
                      ) : (
                        <span className="text-muted">Not specified</span>
                      )}
                    </td>
                    <td>
                      {new Date(lead.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => navigate(`/rm/leads/${lead.id}/edit`)}
                          title="Edit"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => handleDeleteLead(lead.id)}
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
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

export default RMLeadList;