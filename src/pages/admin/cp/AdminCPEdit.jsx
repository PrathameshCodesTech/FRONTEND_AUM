// AdminCPEdit.jsx
// =====================================================
// Admin Edit CP Page - Accordion Style Form
// =====================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiSave, FiUser, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../../../services/adminService';
import '../../../styles/admin/cp/AdminCPCreate.css';

const AdminCPEdit = () => {
  const { cpId } = useParams();
  const navigate = useNavigate();
  
  // Accordion state
  const [expandedSections, setExpandedSections] = useState({
    identity: true,
    program: false,
    operational: false,
    targets: false,
    bank: false,
  });
  
  // Form state
  const [formData, setFormData] = useState({
    // CP Identity
    agent_type: 'individual',
    source: 'direct',
    company_name: '',
    pan_number: '',
    gst_number: '',
    rera_number: '',
    business_address: '',
    
    // Program Enrolment
    partner_tier: 'bronze',
    program_start_date: '',
    program_end_date: '',
    
    // Operational Setup
    dedicated_support_contact: '',
    technical_setup_notes: '',
    
    // Targets
    monthly_target: 0,
    quarterly_target: 0,
    yearly_target: 0,
    
    // Bank Details
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    account_holder_name: '',
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cpName, setCpName] = useState('');
  const [cpEmail, setCpEmail] = useState('');
  const [phone, setCpPhone] = useState('');

  useEffect(() => {
    fetchCPDetail();
  }, [cpId]);

  const fetchCPDetail = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCPDetail(cpId);

      if (response.success) {
        const cp = response.data;
        setCpName(cp.user_details?.full_name || cp.user_name);
        setCpEmail(cp.user_details?.email || cp.email || '');
        setCpPhone(cp.user_details?.phone || cp.phone || '');
        
        // Pre-fill form with existing data
        setFormData({
          agent_type: cp.agent_type || 'individual',
          source: cp.source || 'direct',
          company_name: cp.company_name || '',
          pan_number: cp.pan_number || '',
          gst_number: cp.gst_number || '',
          rera_number: cp.rera_number || '',
          business_address: cp.business_address || '',
          
          partner_tier: cp.partner_tier || 'bronze',
          program_start_date: cp.program_start_date || '',
          program_end_date: cp.program_end_date || '',
          
          dedicated_support_contact: cp.dedicated_support_contact || '',
          technical_setup_notes: cp.technical_setup_notes || '',
          
          monthly_target: cp.monthly_target || 0,
          quarterly_target: cp.quarterly_target || 0,
          yearly_target: cp.yearly_target || 0,
          
          bank_name: cp.bank_name || '',
          account_number: cp.account_number || '',
          ifsc_code: cp.ifsc_code || '',
          account_holder_name: cp.account_holder_name || '',
        });
      } else {
        toast.error(response.error || 'Failed to load CP details');
        navigate('/admin/cp');
      }
    } catch (err) {
      toast.error('Failed to load CP details');
      console.error('Error fetching CP:', err);
      navigate('/admin/cp');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setSubmitting(true);
    
    const submitData = {
      ...formData,
      program_start_date: formData.program_start_date || null,
      program_end_date: formData.program_end_date || null,
      monthly_target: parseFloat(formData.monthly_target) || 0,
      quarterly_target: parseFloat(formData.quarterly_target) || 0,
      yearly_target: parseFloat(formData.yearly_target) || 0,
    };
    
    console.log('🔄 Updating CP:', cpId);
    console.log('📤 Sending data:', submitData);
    
    const response = await adminService.updateCP(cpId, submitData);
    
    console.log('📥 Response:', response);
    
    if (response.success) {
      toast.success('CP updated successfully!');
      navigate(`/admin/cp/${cpId}`);
    } else {
      toast.error(response.error || 'Failed to update CP');
      if (response.errors) {
        console.error('Validation errors:', response.errors);
      }
    }
  } catch (err) {
    console.error('❌ Error updating CP:', err);
    toast.error('Failed to update CP');
  } finally {
    setSubmitting(false);
  }
};

  const renderAccordionSection = (sectionKey, title, icon, content) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div className={`accordion-section ${isExpanded ? 'expanded' : ''}`}>
        <div 
          className="accordion-header"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="accordion-title">
            {icon}
            <h3>{title}</h3>
          </div>
          {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </div>
        
        {isExpanded && (
          <div className="accordion-content">
            {content}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="admin-cp-create-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading CP details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-cp-create-page">
      <div className="admin-cp-create-container">
        {/* Header */}
        <div className="create-cp-header">
          <button className="btn-back" onClick={() => navigate(`/admin/cp/${cpId}`)}>
            <FiArrowLeft size={20} />
            Back to CP Detail
          </button>
          <h1>Edit Channel Partner: {cpName}</h1>
          <p>Update CP information and settings</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Channel Partner Identity */}
          {renderAccordionSection(
            'identity',
            'Channel Partner Identity',
            <FiUser size={20} />,
            <div className="form-grid">
              <div className="form-group full-width">
                <h4>Contact Information</h4>
              </div>
              
              {/* Read-only Email */}
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={cpEmail}
                  readOnly
                  disabled
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                />
                <small>Email cannot be modified</small>
              </div>
              
              {/* Read-only Phone */}
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  readOnly
                  disabled
                  style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                />
                <small>Phone number cannot be modified</small>
              </div>
              
              <div className="form-group full-width">
                <h4>Business Details</h4>
              </div>
              
              <div className="form-group">
                <label>Agent Type</label>
                <select
                  name="agent_type"
                  value={formData.agent_type}
                  onChange={handleInputChange}
                >
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                  <option value="franchise">Franchise</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                >
                  <option value="direct">Direct</option>
                  <option value="referral">Referral</option>
                  <option value="website">Website</option>
                  <option value="advertisement">Advertisement</option>
                  <option value="event">Event</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {formData.agent_type === 'company' && (
                <div className="form-group full-width">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label>PAN Number</label>
                <input
                  type="text"
                  name="pan_number"
                  value={formData.pan_number}
                  onChange={handleInputChange}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </div>
              
              <div className="form-group">
                <label>GST Number</label>
                <input
                  type="text"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleInputChange}
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                />
              </div>
              
              <div className="form-group">
                <label>RERA Number</label>
                <input
                  type="text"
                  name="rera_number"
                  value={formData.rera_number}
                  onChange={handleInputChange}
                  placeholder="RERA registration number"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Business Address</label>
                <textarea
                  name="business_address"
                  value={formData.business_address}
                  onChange={handleInputChange}
                  placeholder="Enter business/office address"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Program Enrolment */}
          {renderAccordionSection(
            'program',
            'Program Enrolment',
            <FiPackage size={20} />,
            <div className="form-grid">
              <div className="form-group">
                <label>Partner Tier</label>
                <select
                  name="partner_tier"
                  value={formData.partner_tier}
                  onChange={handleInputChange}
                >
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Program Start Date</label>
                <input
                  type="date"
                  name="program_start_date"
                  value={formData.program_start_date}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Program End Date (Optional)</label>
                <input
                  type="date"
                  name="program_end_date"
                  value={formData.program_end_date}
                  onChange={handleInputChange}
                />
                <small>Leave blank for ongoing program</small>
              </div>
            </div>
          )}

          {/* Operational Setup */}
          {renderAccordionSection(
            'operational',
            'Operational Setup',
            <FiPackage size={20} />,
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Dedicated Support Contact</label>
                <input
                  type="text"
                  name="dedicated_support_contact"
                  value={formData.dedicated_support_contact}
                  onChange={handleInputChange}
                  placeholder="Support person name/phone"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Technical Setup Notes</label>
                <textarea
                  name="technical_setup_notes"
                  value={formData.technical_setup_notes}
                  onChange={handleInputChange}
                  placeholder="Any technical setup instructions or notes"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Target & Scorecard */}
          {renderAccordionSection(
            'targets',
            'Target & Scorecard',
            <FiPackage size={20} />,
            <div className="form-grid">
              <div className="form-group">
                <label>Monthly Target (₹)</label>
                <input
                  type="number"
                  name="monthly_target"
                  value={formData.monthly_target}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="1000"
                />
              </div>
              
              <div className="form-group">
                <label>Quarterly Target (₹)</label>
                <input
                  type="number"
                  name="quarterly_target"
                  value={formData.quarterly_target}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="1000"
                />
              </div>
              
              <div className="form-group">
                <label>Yearly Target (₹)</label>
                <input
                  type="number"
                  name="yearly_target"
                  value={formData.yearly_target}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          )}

          {/* Bank Details */}
          {renderAccordionSection(
            'bank',
            'Bank Details',
            <FiPackage size={20} />,
            <div className="form-grid">
              <div className="form-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleInputChange}
                  placeholder="e.g., HDFC Bank"
                />
              </div>
              
              <div className="form-group">
                <label>Account Holder Name</label>
                <input
                  type="text"
                  name="account_holder_name"
                  value={formData.account_holder_name}
                  onChange={handleInputChange}
                  placeholder="As per bank account"
                />
              </div>
              
              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleInputChange}
                  placeholder="Enter account number"
                />
              </div>
              
              <div className="form-group">
                <label>IFSC Code</label>
                <input
                  type="text"
                  name="ifsc_code"
                  value={formData.ifsc_code}
                  onChange={handleInputChange}
                  placeholder="HDFC0001234"
                  maxLength={11}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(`/admin/cp/${cpId}`)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner-button"></div>
                  Saving Changes...
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCPEdit;