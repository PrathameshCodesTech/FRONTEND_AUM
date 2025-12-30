// CPProfile.jsx
// =====================================================
// CP Profile Page
// Edit profile, bank details, view stats
// =====================================================

import React, { useState, useEffect } from 'react';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import CPHeader from '../../components/cp/CPHeader';
import cpApplicationService from '../../services/cpApplicationService';


const CPProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    company_name: '',
    business_address: '',
    bank_name: '',
    account_number: '',
    pan_number: '', 
    ifsc_code: '',
    account_holder_name: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const result = await cpApplicationService.getProfile();
      
      if (result.success) {
        setProfile(result.data);
        setFormData({
          company_name: result.data.company_name || '',
          business_address: result.data.business_address || '',
          bank_name: result.data.bank_name || '',
          account_number: result.data.account_number || '',
          pan_number: result.data.pan_number || '',   // ✅ add this
          ifsc_code: result.data.ifsc_code || '',
          account_holder_name: result.data.account_holder_name || ''
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const result = await cpApplicationService.updateProfile(formData);
      
      if (result.success) {
        setProfile(result.data);
        setEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert(result.error || 'Failed to update profile');
      }
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      company_name: profile.company_name || '',
      business_address: profile.business_address || '',
      bank_name: profile.bank_name || '',
      account_number: profile.account_number || '',
       pan_number: profile.pan_number || '',   // ✅ add this
      ifsc_code: profile.ifsc_code || '',
      account_holder_name: profile.account_holder_name || ''
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="cp-profile-page">
        <CPHeader />
        <div className="loading-state-dash">
          <div className="loading-spinner">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="cp-profile-page">
        <CPHeader />
        <div className="error-state-profile">
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-profile-page">
      <CPHeader />

      <div className="cp-profile-container">
        {/* Header */}
        <div className="profile-header">
          <div>
            <h1>My Profile</h1>
            <p>Manage your channel partner information</p>
          </div>
          {!editing ? (
            <button className="btn-edit-profile" onClick={() => setEditing(true)}>
              <FiEdit2 size={20} />
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn-cancel-edit" onClick={handleCancel}>
                <FiX size={20} />
                Cancel
              </button>
              <button 
                className="btn-save-profile" 
                onClick={handleSave}
                disabled={saving}
              >
                <FiSave size={20} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* CP Info Card */}
        <div className="profile-card">
          <h2>Channel Partner Information</h2>
          <div className="profile-grid">
            <div className="profile-field">
              <label>CP Code</label>
              <div className="field-value readonly">{profile.cp_code}</div>
            </div>

            <div className="profile-field">
              <label>Partner Tier</label>
              <span className={`tier-badge-profile ${profile.partner_tier}`}>
                {profile.partner_tier?.toUpperCase()}
              </span>
            </div>

            <div className="profile-field">
              <label>Agent Type</label>
              <div className="field-value readonly">
                {profile.agent_type?.charAt(0).toUpperCase() + profile.agent_type?.slice(1)}
              </div>
            </div>

            <div className="profile-field">
              <label>Status</label>
              <span className={`status-badge-profile ${profile.is_active ? 'active' : 'inactive'}`}>
                {profile.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="profile-card">
          <h2>Business Details</h2>
          <div className="profile-grid">
            {profile.agent_type === 'company' && (
              <div className="profile-field full-width">
                <label>Company Name</label>
                {editing ? (
                  <input
                    type="text"
                    className="field-input-profile"
                    value={formData.company_name}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                  />
                ) : (
                  <div className="field-value">{profile.company_name || '-'}</div>
                )}
              </div>
            )}
               

            <div className="profile-field">
  <label>PAN Number</label>
  {editing ? (
    <input
      type="text"
      className="field-input-profile"
      value={formData.pan_number}
      onChange={(e) =>
        handleChange('pan_number', e.target.value.toUpperCase())
      }
      maxLength={10}
    />
  ) : (
    <div className="field-value">
      {profile.pan_number || '-'}
    </div>
  )}
</div>


            {profile.gst_number && (
              <div className="profile-field">
                <label>GST Number</label>
                <div className="field-value readonly">{profile.gst_number}</div>
              </div>
            )}

            {profile.rera_number && (
              <div className="profile-field">
                <label>RERA Number</label>
                <div className="field-value readonly">{profile.rera_number}</div>
              </div>
            )}

            <div className="profile-field full-width">
              <label>Business Address</label>
              {editing ? (
                <textarea
                  className="field-textarea-profile"
                  value={formData.business_address}
                  onChange={(e) => handleChange('business_address', e.target.value)}
                  rows={3}
                />
              ) : (
                <div className="field-value">{profile.business_address || '-'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="profile-card">
          <h2>Bank Details</h2>
          <div className="profile-grid">
            <div className="profile-field">
              <label>Bank Name</label>
              {editing ? (
                <input
                  type="text"
                  className="field-input-profile"
                  value={formData.bank_name}
                  onChange={(e) => handleChange('bank_name', e.target.value)}
                />
              ) : (
                <div className="field-value">{profile.bank_name || '-'}</div>
              )}
            </div>

            <div className="profile-field">
              <label>Account Number</label>
              {editing ? (
                <input
                  type="text"
                  className="field-input-profile"
                  value={formData.account_number}
                  onChange={(e) => handleChange('account_number', e.target.value)}
                />
              ) : (
                <div className="field-value">{profile.account_number || '-'}</div>
              )}
            </div>

            <div className="profile-field">
              <label>IFSC Code</label>
              {editing ? (
                <input
                  type="text"
                  className="field-input-profile"
                  value={formData.ifsc_code}
                  onChange={(e) => handleChange('ifsc_code', e.target.value.toUpperCase())}
                  maxLength={11}
                />
              ) : (
                <div className="field-value">{profile.ifsc_code || '-'}</div>
              )}
            </div>

            <div className="profile-field">
              <label>Account Holder Name</label>
              {editing ? (
                <input
                  type="text"
                  className="field-input-profile"
                  value={formData.account_holder_name}
                  onChange={(e) => handleChange('account_holder_name', e.target.value)}
                />
              ) : (
                <div className="field-value">{profile.account_holder_name || '-'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="profile-card">
          <h2>Performance Summary</h2>
          <div className="stats-grid-profile">
            <div className="stat-box-profile">
              <div className="stat-label-prof">Total Customers</div>
              <div className="stat-value-prof">{profile.total_customers || 0}</div>
            </div>
            <div className="stat-box-profile">
              <div className="stat-label-prof">Active Customers</div>
              <div className="stat-value-prof success">{profile.active_customers || 0}</div>
            </div>
            <div className="stat-box-profile">
              <div className="stat-label-prof">Total Commission Earned</div>
              <div className="stat-value-prof success">
                ₹{(profile.total_commission || 0).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="stat-box-profile">
              <div className="stat-label-prof">Pending Commission</div>
              <div className="stat-value-prof warning">
                ₹{(profile.pending_commission || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPProfile;