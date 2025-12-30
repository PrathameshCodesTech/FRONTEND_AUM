// AdminCPCreate.jsx
// =====================================================
// Admin Create CP Page - Accordion Style Form with Validation
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiSave, FiUser, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../../../services/adminService';
import '../../../styles/admin/cp/AdminCPCreate.css';

const AdminCPCreate = () => {
  const navigate = useNavigate();
  
  // Accordion state
  const [expandedSections, setExpandedSections] = useState({
    identity: true,
    program: false,
    authorization: false,
    operational: false,
    targets: false,
    bank: false,
  });
  
  // Form state
  const [formData, setFormData] = useState({
    // User Details
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    
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
    
    // Authorization
    property_ids: [],
    
    // Auto-approve
    auto_approve: true,
  });
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllPropertiesForAuthorization();
      if (response.success) {
        setProperties(response.results);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
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

  // Validation function
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'first_name':
        if (!value.trim()) error = 'First name is required';
        else if (value.trim().length < 2) error = 'First name must be at least 2 characters';
        break;
      
      case 'last_name':
        if (!value.trim()) error = 'Last name is required';
        else if (value.trim().length < 2) error = 'Last name must be at least 2 characters';
        break;
      
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
        break;
      
      case 'phone':{
        const phoneDigits = value.replace(/\D/g, '');
        if (!value.trim()) error = 'Phone number is required';
        else if (phoneDigits.length !== 10 && phoneDigits.length !== 12) {
          error = 'Please enter a valid 10-digit phone number';
        }
        break;

        }
      
      case 'company_name':
        if (formData.agent_type === 'company' && !value.trim()) {
          error = 'Company name is required for company type';
        }
        break;
      
      case 'pan_number':
        if (value && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase())) {
          error = 'Invalid PAN format (e.g., ABCDE1234F)';
        }
        break;
      
      case 'gst_number':
        if (value && value.length !== 15) {
          error = 'GST number must be 15 characters';
        }
        break;
      
      case 'ifsc_code':
        if (value && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.toUpperCase())) {
          error = 'Invalid IFSC code format (e.g., HDFC0001234)';
        }
        break;
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handlePropertyToggle = (propertyId) => {
    setFormData(prev => ({
      ...prev,
      property_ids: prev.property_ids.includes(propertyId)
        ? prev.property_ids.filter(id => id !== propertyId)
        : [...prev.property_ids, propertyId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['first_name', 'last_name', 'email', 'phone'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    // Check company name if agent type is company
    if (formData.agent_type === 'company') {
      const companyError = validateField('company_name', formData.company_name);
      if (companyError) newErrors.company_name = companyError;
    }

    // Validate other filled fields
    ['pan_number', 'gst_number', 'ifsc_code'].forEach(field => {
      if (formData[field]) {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    
    // Mark all required fields as touched
    const newTouched = {};
    requiredFields.forEach(field => {
      newTouched[field] = true;
    });
    if (formData.agent_type === 'company') {
      newTouched.company_name = true;
    }
    setTouched(newTouched);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      // Show error messages
      const errorFields = Object.keys(errors).filter(key => errors[key]);
      if (errorFields.length > 0) {
        toast.error(`Please fix the following errors: ${errorFields.join(', ')}`);
        
        // Auto-open accordion sections with errors
        const openSections = { ...expandedSections };
        errorFields.forEach((field) => {
          if (["first_name", "last_name", "email", "phone", "agent_type", "company_name", "pan_number", "gst_number", "rera_number"].includes(field)) {
            openSections.identity = true;
          }
          if (["partner_tier", "program_start_date", "program_end_date"].includes(field)) {
            openSections.program = true;
          }
          if (["property_ids"].includes(field)) {
            openSections.authorization = true;
          }
          if (["bank_name", "account_number", "ifsc_code", "account_holder_name"].includes(field)) {
            openSections.bank = true;
          }
        });
        setExpandedSections(openSections);
      }
      return;
    }
    
    // Format phone number
    let phone = formData.phone.replace(/\D/g, '');
    if (phone.length === 10) {
      phone = `+91${phone}`;
    } else if (phone.startsWith('91') && phone.length === 12) {
      phone = `+${phone}`;
    } else if (!phone.startsWith('+91')) {
      phone = `+91${phone}`;
    }
    
    try {
      setSubmitting(true);
      
      const submitData = {
        ...formData,
        phone: phone,
        program_start_date: formData.program_start_date || null,
        program_end_date: formData.program_end_date || null,
        // Convert string numbers to actual numbers
        monthly_target: parseFloat(formData.monthly_target) || 0,
        quarterly_target: parseFloat(formData.quarterly_target) || 0,
        yearly_target: parseFloat(formData.yearly_target) || 0,
      };
      
      const response = await adminService.createCP(submitData);
      
      if (response.success) {
        toast.success(response.message);
        
        // Show credentials modal
        setCreatedCredentials(response.credentials);
        setShowCredentials(true);
        
        // Redirect after 10 seconds or when modal is closed
        setTimeout(() => {
          navigate(`/admin/cp/${response.data.id}/detail`);
        }, 10000);
      } else {
        toast.error(response.error || 'Failed to create CP');
        if (response.errors) {
          setErrors(response.errors);
          console.error('Validation errors:', response.errors);

          // Auto-open any accordion section that has an error
          const openSections = { ...expandedSections };
          Object.keys(response.errors).forEach((field) => {
            if (["first_name", "last_name", "email", "phone", "agent_type", "company_name", "pan_number", "gst_number", "rera_number"].includes(field)) {
              openSections.identity = true;
            }
            if (["partner_tier", "program_start_date", "program_end_date"].includes(field)) {
              openSections.program = true;
            }
            if (["property_ids"].includes(field)) {
              openSections.authorization = true;
            }
            if (["dedicated_support_contact", "technical_setup_notes"].includes(field)) {
              openSections.operational = true;
            }
            if (["monthly_target", "quarterly_target", "yearly_target"].includes(field)) {
              openSections.targets = true;
            }
            if (["bank_name", "account_number", "ifsc_code", "account_holder_name"].includes(field)) {
              openSections.bank = true;
            }
          });
          setExpandedSections(openSections);
        }
      }
    } catch (err) {
      toast.error('Failed to create CP');
      console.error('Error creating CP:', err);
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

  return (
    <div className="admin-cp-create-page">
      <div className="admin-cp-create-container">
        {/* Header */}
        <div className="create-cp-header">
          <button className="btn-back" onClick={() => navigate('/admin/cp')}>
            <FiArrowLeft size={20} />
            Back to CPs
          </button>
          <h1>Create New Channel Partner</h1>
          <p>Fill in the details to manually create a CP account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Channel Partner Identity */}
          {renderAccordionSection(
            'identity',
            'Channel Partner Identity',
            <FiUser size={20} />,
            <div className="form-grid">
              <div className="form-group full-width">
                <h4>Personal Details</h4>
              </div>
              
              <div className="form-group">
                <label>First Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter first name"
                  className={errors.first_name && touched.first_name ? 'error' : ''}
                  required
                />
                {errors.first_name && touched.first_name && (
                  <span className="error-message">{errors.first_name}</span>
                )}
              </div>
              
              <div className="form-group">
                <label>Last Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter last name"
                  className={errors.last_name && touched.last_name ? 'error' : ''}
                  required
                />
                {errors.last_name && touched.last_name && (
                  <span className="error-message">{errors.last_name}</span>
                )}
              </div>
              
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="email@example.com"
                  className={errors.email && touched.email ? 'error' : ''}
                  required
                />
                {errors.email && touched.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
              
              <div className="form-group">
                <label>Phone <span className="required">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="9876543210"
                  className={errors.phone && touched.phone ? 'error' : ''}
                  required
                />
                <small>10-digit Indian mobile number</small>
                {errors.phone && touched.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>
              
              <div className="form-group">
                <label>Password (Optional)</label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Auto-generated if left blank"
                />
                <small>Min 8 characters. Leave blank for auto-generation.</small>
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
                  <label>Company Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter company name"
                    className={errors.company_name && touched.company_name ? 'error' : ''}
                    required={formData.agent_type === 'company'}
                  />
                  {errors.company_name && touched.company_name && (
                    <span className="error-message">{errors.company_name}</span>
                  )}
                </div>
              )}
              
              <div className="form-group">
                <label>PAN Number</label>
                <input
                  type="text"
                  name="pan_number"
                  value={formData.pan_number}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className={errors.pan_number && touched.pan_number ? 'error' : ''}
                />
                {errors.pan_number && touched.pan_number && (
                  <span className="error-message">{errors.pan_number}</span>
                )}
              </div>
              
              <div className="form-group">
                <label>GST Number</label>
                <input
                  type="text"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                  className={errors.gst_number && touched.gst_number ? 'error' : ''}
                />
                {errors.gst_number && touched.gst_number && (
                  <span className="error-message">{errors.gst_number}</span>
                )}
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
                <label>Auto-Approve & Activate</label>
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    name="auto_approve"
                    checked={formData.auto_approve}
                    onChange={handleInputChange}
                  />
                  <span>Immediately activate CP account</span>
                </div>
              </div>
              
              <div className="form-group">
                <label>Program Start Date</label>
                <input
                  type="date"
                  name="program_start_date"
                  value={formData.program_start_date}
                  onChange={handleInputChange}
                />
                <small>Leave blank to use today's date</small>
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

          {/* Product Authorization */}
          {renderAccordionSection(
            'authorization',
            'Product Authorization',
            <FiPackage size={20} />,
            <div className="form-section">
              <p className="section-description">
                Select properties this CP is authorized to sell. This can also be done later from the CP detail page.
              </p>
              
              {loading ? (
                <div className="loading-state-small">
                  <div className="spinner-small"></div>
                  <p>Loading properties...</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="empty-state-small">
                  <p>No properties available</p>
                </div>
              ) : (
                <div className="properties-checkbox-grid">
                  {properties.map((property) => (
                    <div key={property.id} className="property-checkbox-item">
                      <input
                        type="checkbox"
                        id={`property-${property.id}`}
                        checked={formData.property_ids.includes(property.id)}
                        onChange={() => handlePropertyToggle(property.id)}
                      />
                      <label htmlFor={`property-${property.id}`}>
                        <strong>{property.name}</strong>
                        <span className="property-location">{property.city}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="selected-count">
                {formData.property_ids.length} {formData.property_ids.length === 1 ? 'property' : 'properties'} selected
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
            'Bank Details (Optional)',
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
                  onBlur={handleBlur}
                  placeholder="HDFC0001234"
                  maxLength={11}
                  className={errors.ifsc_code && touched.ifsc_code ? 'error' : ''}
                />
                {errors.ifsc_code && touched.ifsc_code && (
                  <span className="error-message">{errors.ifsc_code}</span>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/admin/cp')}
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
                  Creating CP...
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  Create Channel Partner
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Credentials Modal */}
      {showCredentials && createdCredentials && (
        <div className="modal-overlay" onClick={() => setShowCredentials(false)}>
          <div className="credentials-modal" onClick={(e) => e.stopPropagation()}>
            <h2>✅ CP Created Successfully!</h2>
            <p className="modal-subtitle">Login credentials have been generated. Please save these details:</p>
            
            <div className="credentials-box">
              <div className="credential-item">
  <label>Name:</label>
  <code>{createdCredentials.name || `${formData.first_name} ${formData.last_name}`}</code>
</div>
<div className="credential-item">
  <label>Phone (Login Username):</label>
  <code>{createdCredentials.username}</code>
</div>
              <div className="credential-item">
                <label>Password:</label>
                <code className="password">{createdCredentials.password}</code>
              </div>
              <div className="credential-item">
                <label>Email:</label>
                <code>{createdCredentials.email}</code>
              </div>
            </div>
            
            <div className="modal-warning">
              ⚠️ <strong>Important:</strong> Save these credentials now. The password will not be shown again.
            </div>
            
            <div className="modal-actions">
              <button
                className="btn-copy"
//                 onClick={() => {
//                   navigator.clipboard.writeText(
//   `Name: ${createdCredentials.name || `${formData.first_name} ${formData.last_name}`}\nPhone (Login): ${createdCredentials.username}\nPassword: ${createdCredentials.password}\nEmail: ${createdCredentials.email}`
// );
//                   toast.success('Credentials copied to clipboard!');
//                 }}
                  onClick={() => {
  const credentialsText = `Name: ${createdCredentials.name || `${formData.first_name} ${formData.last_name}`}
Phone (Login): ${createdCredentials.username}
Password: ${createdCredentials.password}
Email: ${createdCredentials.email}`;
  
  navigator.clipboard.writeText(credentialsText);
  toast.success('Credentials copied to clipboard!');
}}
              >
                Copy Credentials
              </button>
              <button
                className="btn-close-modal"
                onClick={() => {
                  setShowCredentials(false);
                  navigate(`/admin/cp`);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCPCreate;