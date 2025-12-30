// AdminCPDetail.jsx
// =====================================================
// Admin CP Detail Page
// View CP details, manage properties, customers, etc.
// =====================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiEdit, FiCheckCircle, FiXCircle,
  FiPackage, FiUsers, FiDollarSign, FiPlus, FiTrash2
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../../../services/adminService';
import AdminCPAuthorizeModal from '../../../pages/admin/cp/AdminCPAuthorizeModal';
import CPCommissionsTab from '../../../components/admin/cp/CPCommissionsTab';
import '../../../styles/admin/cp/AdminCPDetail.css';

const AdminCPDetail = () => {
  const { cpId } = useParams();
  const navigate = useNavigate();

  const [cp, setCp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  // Properties
  const [authorizedProperties, setAuthorizedProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [showAuthorizeModal, setShowAuthorizeModal] = useState(false);


  const [creatingInvite, setCreatingInvite] = useState(false);
  const [hasPermanentInvite, setHasPermanentInvite] = useState(false);
  const [inviteData, setInviteData] = useState(null);

  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);


  useEffect(() => {
    fetchCPDetail();
    fetchAuthorizedProperties();
  }, [cpId]);

  useEffect(() => {
  if (activeTab === 'lead') {
    fetchCPLeads();
  }
}, [activeTab]);

  const fetchCPDetail = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCPDetail(cpId);

      if (response.success) {
        setCp(response.data);
      } else {
        setError(response.error || 'Failed to load CP details');
      }
    } catch (err) {
      setError('Failed to load CP details');
      console.error('Error fetching CP:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorizedProperties = async () => {
    try {
      setLoadingProperties(true);
      const response = await adminService.getAuthorizedProperties(cpId);

      if (response.success) {
        setAuthorizedProperties(response.results);
      }
    } catch (err) {
      console.error('Error fetching authorized properties:', err);
    } finally {
      setLoadingProperties(false);
    }
  };

  const handleActivateDeactivate = async () => {
    const action = cp.is_active ? 'deactivate' : 'activate';

    if (!window.confirm(`Are you sure you want to ${action} this CP?`)) {
      return;
    }

    try {
      const response = cp.is_active
        ? await adminService.deactivateCP(cpId)
        : await adminService.activateCP(cpId);

      if (response.success) {
        toast.success(response.message);
        fetchCPDetail();
      } else {
        toast.error(response.error);
      }
    } catch (err) {
      toast.error(`Failed to ${action} CP`);
    }
  };

  const handleCreatePermanentInvite = async () => {
    if (!window.confirm('Create a permanent referral link for this CP?')) {
      return;
    }

    try {
      setCreatingInvite(true);
      const response = await adminService.createPermanentInvite(cpId);

      if (response.success) {
        toast.success('✅ Permanent invite created successfully!');
        setHasPermanentInvite(true);
        setInviteData(response.data);
      }
    } catch (error) {
      if (error.error) {
        toast.error(error.error);
        // If already exists, show the existing invite
        if (error.data) {
          setHasPermanentInvite(true);
          setInviteData(error.data);
        }
      } else {
        toast.error('Failed to create permanent invite');
      }
    } finally {
      setCreatingInvite(false);
    }
  };

 const fetchCPLeads = async () => {
  try {
    setLoadingLeads(true);
    const response = await adminService.getCPLeads(cpId);

    console.log('📋 CP Leads Response:', response); // Debug log

    if (response.success) {
      setLeads(response.results || []);
    } else {
      console.error('Failed to fetch leads:', response.error);
      toast.error(response.error || 'Failed to load leads');
      setLeads([]);
    }
  } catch (error) {
    console.error('❌ Error fetching leads:', error);
    toast.error('Failed to load leads');
    setLeads([]);
  } finally {
    setLoadingLeads(false);
  }
};



  const handleRevokeProperty = async (propertyId, propertyName) => {
    if (!window.confirm(`Revoke authorization for "${propertyName}"?`)) {
      return;
    }

    try {
      const response = await adminService.revokePropertyFromCP(cpId, propertyId);

      if (response.success) {
        toast.success(response.message);
        fetchAuthorizedProperties();
      } else {
        toast.error(response.error);
      }
    } catch (err) {
      toast.error('Failed to revoke authorization');
    }
  };

  const handleAuthorizeSuccess = () => {
    setShowAuthorizeModal(false);
    fetchAuthorizedProperties();
    toast.success('Properties authorized successfully');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="admin-cp-detail-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading CP details...</p>
        </div>
      </div>
    );
  }

  if (error || !cp) {
    return (
      <div className="admin-cp-detail-page">
        <div className="error-state">
          <h3>Failed to load CP details</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/admin/cp')}>Back to CP List</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-cp-detail-page">
      <div className="admin-cp-detail-container">
        {/* Header */}
        <div className="cp-detail-header">
          <button className="btn-back" onClick={() => navigate('/admin/cp')}>
            <FiArrowLeft size={20} />
            Back to CPs
          </button>

          <div className="cp-detail-title">
            <div>
              <h1>{cp.user_details?.full_name || cp.user_name}</h1>
              <div className="cp-meta">
                <span className="cp-code-badge">{cp.cp_code}</span>
                <span className={`tier-badge ${cp.partner_tier}`}>
                  {cp.partner_tier?.toUpperCase()}
                </span>
                <span className={`status-badge ${cp.is_active ? 'active' : 'inactive'}`}>
                  {cp.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="cp-actions">
              <button className="btn-edit" onClick={() => navigate(`/admin/cp/${cpId}/edit`)}>
                <FiEdit size={18} />
                Edit
              </button>
              <button
                className={`btn-toggle ${cp.is_active ? 'deactivate' : 'activate'}`}
                onClick={handleActivateDeactivate}
              >
                {cp.is_active ? <FiXCircle size={18} /> : <FiCheckCircle size={18} />}
                {cp.is_active ? 'Deactivate' : 'Activate'}
              </button>


              {/* 🆕 ADD THIS BUTTON */}
              <button
                className="btn-create-invite"
                onClick={handleCreatePermanentInvite}
                disabled={creatingInvite || hasPermanentInvite}
              >
                <FiPlus size={18} />
                {creatingInvite ? 'Creating...' : hasPermanentInvite ? 'Invite Exists' : 'Create Permanent Invite'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="cp-stats-grid">
          <div className="stat-card">
            <div className="stat-icon customers">
              <FiUsers size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{cp.total_customers || 0}</div>
              <div className="stat-label">Total Customers</div>
              <div className="stat-sub">{cp.total_active_customers || 0} Active</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon properties">
              <FiPackage size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{authorizedProperties.length}</div>
              <div className="stat-label">Authorized Properties</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">
              <FiDollarSign size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                {formatCurrency(parseFloat(cp.total_invested || 0))}
              </div>
              <div className="stat-label">Total Invested</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon commission">
              <FiDollarSign size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value success">
                {formatCurrency(parseFloat(cp.total_commission || 0))}
              </div>
              <div className="stat-label">Total Commission</div>
            </div>
          </div>
        </div>

        {/* Permanent Invite Info */}
        {inviteData && (
          <div className="permanent-invite-info-card">
            <div className="invite-header">
              <h3>🔗 Permanent Referral Link</h3>
              <span className="invite-badge">Active</span>
            </div>
            <div className="invite-details">
              <div className="invite-field">
                <label>Invite Code:</label>
                <code className="invite-code">{inviteData.invite_code}</code>
              </div>
              <div className="invite-field">
                <label>Referral Link:</label>
                <div className="invite-link-container">
                  <input
                    type="text"
                    value={inviteData.invite_link}
                    readOnly
                    className="invite-link-input"
                  />
                  <button
                    className="btn-copy-link"
                    onClick={() => {
                      navigator.clipboard.writeText(inviteData.invite_link);
                      toast.success('Link copied to clipboard!');
                    }}
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
            <p className="invite-note">
              💡 This link can be used by unlimited users and never expires.
              CP can share this link to refer customers.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="cp-detail-tabs">
          <button
            className={`tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Basic Info
          </button>
          <button
            className={`tab ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            Authorized Properties ({authorizedProperties.length})
          </button>
          <button
            className={`tab ${activeTab === 'bank' ? 'active' : ''}`}
            onClick={() => setActiveTab('bank')}
          >
            Bank Details
          </button>
          <button
            className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
          <button
            className={`tab ${activeTab === 'commissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('commissions')}
          >
            Commissions
          </button>

           <button
            className={`tab ${activeTab === 'lead' ? 'active' : ''}`}
            onClick={() => setActiveTab('lead')}
          >
            Lead
          </button>

        </div>

        {/* Tab Content */}
        <div className="cp-detail-content">
          {/* Basic Info Tab */}
          {activeTab === 'info' && (
            <div className="info-tab">
              <div className="info-section">
                <h3>Contact Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Email</label>
                    <p>{cp.user_details?.email || '-'}</p>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <p>{cp.user_details?.phone || '-'}</p>
                  </div>
                  <div className="info-item">
                    <label>Agent Type</label>
                    <p className="capitalize">{cp.agent_type || '-'}</p>
                  </div>
                  <div className="info-item">
                    <label>Source</label>
                    <p className="capitalize">{cp.source || '-'}</p>
                  </div>
                </div>
              </div>

              {cp.company_name && (
                <div className="info-section">
                  <h3>Company Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Company Name</label>
                      <p>{cp.company_name}</p>
                    </div>
                    <div className="info-item">
                      <label>Business Address</label>
                      <p>{cp.business_address || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="info-section">
                <h3>Legal Documents</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>PAN Number</label>
                    <p>{cp.pan_number || '-'}</p>
                  </div>
                  <div className="info-item">
                    <label>GST Number</label>
                    <p>{cp.gst_number || '-'}</p>
                  </div>
                  <div className="info-item">
                    <label>RERA Number</label>
                    <p>{cp.rera_number || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Program Details</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Partner Tier</label>
                    <p className="capitalize">{cp.partner_tier}</p>
                  </div>
                  <div className="info-item">
                    <label>Program Start Date</label>
                    <p>{formatDate(cp.program_start_date)}</p>
                  </div>
                  <div className="info-item">
                    <label>Onboarding Status</label>
                    <p className="capitalize">{cp.onboarding_status}</p>
                  </div>
                  <div className="info-item">
                    <label>Verified</label>
                    <p>{cp.is_verified ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Properties Tab */}
          {activeTab === 'properties' && (
            <div className="properties-tab">
              <div className="properties-header">
                <h3>Authorized Properties</h3>
                <button
                  className="btn-authorize-properties"
                  onClick={() => setShowAuthorizeModal(true)}
                >
                  <FiPlus size={18} />
                  Authorize Properties
                </button>
              </div>

              {loadingProperties ? (
                <div className="loading-state-small">
                  <div className="spinner-small"></div>
                  <p>Loading properties...</p>
                </div>
              ) : authorizedProperties.length === 0 ? (
                <div className="empty-state-properties">
                  <FiPackage size={48} color="#ccc" />
                  <h4>No Properties Authorized</h4>
                  <p>This CP doesn't have access to any properties yet.</p>
                  <button
                    className="btn-primary"
                    onClick={() => setShowAuthorizeModal(true)}
                  >
                    Authorize Properties
                  </button>
                </div>
              ) : (
                <div className="properties-table-container">
                  <table className="properties-table">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Referral Link</th>
                        <th>Authorized On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {authorizedProperties.map((auth) => (
                        <tr key={auth.id}>
                          <td>
                            <div className="property-cell">
                              <strong>{auth.property_details?.name}</strong>
                              <span className="property-code">
                                {auth.property_details?.slug}
                              </span>
                            </div>
                          </td>
                          <td>{auth.property_details?.location || '-'}</td>
                          <td>
                            <span className={`status-badge-sm ${auth.approval_status}`}>
                              {auth.approval_status}
                            </span>
                          </td>
                          <td>
                            <code className="referral-link-code">
                              {auth.referral_link || 'Generating...'}
                            </code>
                          </td>
                          <td>{formatDate(auth.authorized_at)}</td>
                          <td>
                            <button
                              className="btn-revoke"
                              onClick={() => handleRevokeProperty(
                                auth.property_details?.id,
                                auth.property_details?.name
                              )}
                              title="Revoke Authorization"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Bank Details Tab */}
          {activeTab === 'bank' && (
            <div className="bank-tab">
              <div className="info-section">
                <h3>Bank Account Details</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Bank Name</label>
                    <p>{cp.bank_name || '-'}</p>
                  </div>
                  <div className="info-item">
                    <label>Account Holder Name</label>
                    <p>{cp.account_holder_name || '-'}</p>
                  </div>
                  <div className="info-item">
                    <label>Account Number</label>
                    <p>{cp.account_number || '-'}</p>
                  </div>
                  <div className="info-item">
                    <label>IFSC Code</label>
                    <p>{cp.ifsc_code || '-'}</p>
                  </div>
                </div>
              </div>

              {cp.commission_notes && (
                <div className="info-section">
                  <h3>Commission Notes</h3>
                  <p className="commission-notes">{cp.commission_notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="documents-tab">
              <div className="info-section">
                <h3>Uploaded Documents</h3>
                <p>Document verification coming soon...</p>
              </div>
            </div>
          )}
          {/* Commissions Tab */}
          {activeTab === 'commissions' && (
            <CPCommissionsTab cpId={cpId} cpCode={cp.cp_code} />
          )}


          {/* Leads Tab */}
{activeTab === 'lead' && (
  <div className="leads-tab">
    <h3>Leads Added by CP</h3>

    {loadingLeads ? (
      <div className="loading-state-small">
        <div className="spinner-small"></div>
        <p>Loading leads...</p>
      </div>
    ) : leads.length === 0 ? (
      <div className="empty-state-properties">
        <FiUsers size={48} color="#ccc" />
        <h4>No Leads Found</h4>
        <p>This CP has not added any leads yet.</p>
      </div>
    ) : (
      <div className="properties-table-container">
        <table className="properties-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Property</th>
              <th>Status</th>
              <th>Created On</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>{lead.phone}</td>
                <td>{lead.email || '-'}</td>
                <td>{lead.property?.name || '-'}</td>
                <td>
                  <span className={`status-badge-sm ${lead.status}`}>
                    {lead.status}
                  </span>
                </td>
                <td>{formatDate(lead.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

        </div>
      </div>

      {/* Authorize Properties Modal */}
      {showAuthorizeModal && (
        <AdminCPAuthorizeModal
          cpId={cpId}
          cpCode={cp.cp_code}
          currentlyAuthorizedPropertyIds={authorizedProperties.map(a => a.property_details?.id)}
          onClose={() => setShowAuthorizeModal(false)}
          onSuccess={handleAuthorizeSuccess}
        />
      )}

    </div>
  );
};

export default AdminCPDetail;