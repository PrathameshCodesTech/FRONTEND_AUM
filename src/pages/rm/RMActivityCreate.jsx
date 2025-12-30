// RMActivityCreate.jsx
// =====================================================
// RM Create Activity Log
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiActivity } from 'react-icons/fi';
import toast from 'react-hot-toast';
import rmService from '../../services/rmService';
import '../../styles/rm/RMActivityCreate.css';

const RMActivityCreate = () => {
  const navigate = useNavigate();

  /* -------------------- State -------------------- */
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer: '',
    activity_type: 'call',
    title: '',
    description: '',
    outcome: 'successful',
    requires_followup: false,
    followup_date: '',
    followup_notes: '',
    duration_minutes: '',
    related_investment_id: '',
    related_property_id: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* -------------------- Fetch Customers -------------------- */
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await rmService.getCustomers();
      if (response.success) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error('Fetch customers error:', error);
    }
  };

  /* -------------------- Validation -------------------- */
  const validateField = (name, value) => {
    switch (name) {
      case 'customer':
        if (!value) return 'Customer is required';
        break;

      case 'activity_type':
        if (!value) return 'Activity type is required';
        break;

      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.length < 5) return 'Minimum 5 characters';
        break;

      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.length < 10) return 'Minimum 10 characters';
        break;

      case 'duration_minutes':
        if (value && (isNaN(value) || value < 0))
          return 'Must be a positive number';
        break;

      case 'followup_date':
        if (formData.requires_followup && !value)
          return 'Follow-up date is required';
        break;

      default:
        break;
    }
    return '';
  };

  const validateForm = () => {
    const required = ['customer', 'activity_type', 'title', 'description'];
    const newErrors = {};

    required.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (formData.requires_followup && !formData.followup_date) {
      newErrors.followup_date = 'Follow-up date is required';
    }

    setErrors(newErrors);
    setTouched(
      Object.fromEntries(required.map((field) => [field, true]))
    );

    return Object.keys(newErrors).length === 0;
  };

  /* -------------------- Handlers -------------------- */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newValue)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  /* -------------------- Submit -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      setSubmitting(true);

      // Prepare data
      const submitData = { ...formData };

      // Convert to integers
      submitData.customer = parseInt(submitData.customer);

      if (submitData.duration_minutes) {
        submitData.duration_minutes = parseInt(submitData.duration_minutes);
      } else {
        delete submitData.duration_minutes;
      }

      if (submitData.related_investment_id) {
        submitData.related_investment_id = parseInt(submitData.related_investment_id);
      } else {
        delete submitData.related_investment_id;
      }

      if (submitData.related_property_id) {
        submitData.related_property_id = parseInt(submitData.related_property_id);
      } else {
        delete submitData.related_property_id;
      }

      // Remove followup fields if not required
      if (!submitData.requires_followup) {
        delete submitData.followup_date;
        delete submitData.followup_notes;
      }

      const response = await rmService.createActivity(submitData);

      if (response.success) {
        toast.success('Activity logged successfully');
        navigate('/rm/activities');
      } else {
        toast.error(response.message || 'Failed to log activity');
      }
    } catch (err) {
      console.error('Create activity error:', err);
      toast.error('Failed to log activity');
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="rm-activity-create-page">
      <div className="rm-activity-create-container">
        {/* Header */}
        <div className="create-activity-header">
          <button className="btn-back" onClick={() => navigate('/rm/activities')}>
            <FiArrowLeft size={18} />
            Back to Activities
          </button>
          <h1>Log Activity</h1>
          <p>Record customer interaction or task</p>
        </div>

        <form onSubmit={handleSubmit} className="activity-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3>
              <FiActivity size={18} /> Activity Details
            </h3>

            <div className="form-group">
              <label>Customer *</label>
              <select
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.customer ? 'error' : ''}
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.first_name} {customer.last_name} ({customer.email})
                  </option>
                ))}
              </select>
              {errors.customer && (
                <span className="error-message">{errors.customer}</span>
              )}
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>Activity Type *</label>
                <select
                  name="activity_type"
                  value={formData.activity_type}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={errors.activity_type ? 'error' : ''}
                >
                  <option value="call">Phone Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                  <option value="site_visit">Site Visit</option>
                  <option value="kyc_verification">KYC Verification</option>
                  <option value="payment_followup">Payment Follow-up</option>
                  <option value="document_verification">Document Verification</option>
                  <option value="support">Support/Query Resolution</option>
                  <option value="onboarding">Customer Onboarding</option>
                  <option value="other">Other</option>
                </select>
                {errors.activity_type && (
                  <span className="error-message">{errors.activity_type}</span>
                )}
              </div>

              <div className="form-group">
                <label>Outcome *</label>
                <select
                  name="outcome"
                  value={formData.outcome}
                  onChange={handleInputChange}
                >
                  <option value="successful">Successful</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="followup_required">Follow-up Required</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Title *</label>
              <input
                name="title"
                placeholder="Brief summary of the activity"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.title ? 'error' : ''}
              />
              {errors.title && (
                <span className="error-message">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Detailed description of what happened..."
                value={formData.description}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.description ? 'error' : ''}
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>

            <div className="form-group">
              <label>Duration (minutes)</label>
              <input
                type="number"
                name="duration_minutes"
                placeholder="e.g., 30"
                value={formData.duration_minutes}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.duration_minutes ? 'error' : ''}
              />
              {errors.duration_minutes && (
                <span className="error-message">{errors.duration_minutes}</span>
              )}
            </div>
          </div>

          {/* Follow-up */}
          <div className="form-section">
            <h3>Follow-up</h3>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="requires_followup"
                  checked={formData.requires_followup}
                  onChange={handleInputChange}
                />
                <span>Requires Follow-up</span>
              </label>
            </div>

            {formData.requires_followup && (
              <>
                <div className="form-group">
                  <label>Follow-up Date *</label>
                  <input
                    type="datetime-local"
                    name="followup_date"
                    value={formData.followup_date}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={errors.followup_date ? 'error' : ''}
                  />
                  {errors.followup_date && (
                    <span className="error-message">{errors.followup_date}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Follow-up Notes</label>
                  <textarea
                    name="followup_notes"
                    rows="3"
                    placeholder="What needs to be done in the follow-up..."
                    value={formData.followup_notes}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
          </div>

          {/* Related Records */}
          <div className="form-section">
            <h3>Related Records (Optional)</h3>

            <div className="form-group-row">
              <div className="form-group">
                <label>Related Investment ID</label>
                <input
                  type="number"
                  name="related_investment_id"
                  placeholder="Investment ID"
                  value={formData.related_investment_id}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Related Property ID</label>
                <input
                  type="number"
                  name="related_property_id"
                  placeholder="Property ID"
                  value={formData.related_property_id}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/rm/activities')}
              disabled={submitting}
            >
              Cancel
            </button>

            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Logging Activity...' : (
                <>
                  <FiSave size={16} />
                  Log Activity
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RMActivityCreate;