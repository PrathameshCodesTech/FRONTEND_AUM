// RMLeadCreate.jsx
// =====================================================
// RM Create New Lead
// =====================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUser, FiPhone, FiMail, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';
import rmService from '../../services/rmService';
import '../../styles/rm/RMLeadCreate.css';

const RMLeadCreate = () => {
  const navigate = useNavigate();

  /* -------------------- State -------------------- */
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'direct',
    interested_property_id: '',
    budget_min: '',
    budget_max: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* -------------------- Validation -------------------- */
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 3) return 'Minimum 3 characters';
        break;

      case 'phone': {
        const digits = value.replace(/\D/g, '');
        if (!digits) return 'Phone number is required';
        if (digits.length !== 10) return 'Enter a valid 10-digit phone number';
        break;
      }

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return 'Invalid email address';
        break;

      case 'budget_min':
        if (value && isNaN(value)) return 'Must be a number';
        if (value && parseFloat(value) < 0) return 'Must be positive';
        break;

      case 'budget_max':
        if (value && isNaN(value)) return 'Must be a number';
        if (value && formData.budget_min && parseFloat(value) < parseFloat(formData.budget_min))
          return 'Max must be greater than min';
        break;

      default:
        break;
    }
    return '';
  };

  const validateForm = () => {
    const required = ['name', 'phone', 'source'];
    const newErrors = {};

    required.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    // Validate optional fields
    if (formData.email) {
      const error = validateField('email', formData.email);
      if (error) newErrors.email = error;
    }

    if (formData.budget_min) {
      const error = validateField('budget_min', formData.budget_min);
      if (error) newErrors.budget_min = error;
    }

    if (formData.budget_max) {
      const error = validateField('budget_max', formData.budget_max);
      if (error) newErrors.budget_max = error;
    }

    setErrors(newErrors);
    setTouched({
      name: true,
      phone: true,
      source: true
    });

    return Object.keys(newErrors).length === 0;
  };

  /* -------------------- Handlers -------------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value)
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

    // Format phone
    let phone = formData.phone.replace(/\D/g, '');
    if (phone.length === 10) phone = `+91${phone}`;

    try {
      setSubmitting(true);

      // Prepare data
      const submitData = {
        ...formData,
        phone
      };

      // Convert budget to numbers if present
      if (submitData.budget_min) {
        submitData.budget_min = parseFloat(submitData.budget_min);
      }
      if (submitData.budget_max) {
        submitData.budget_max = parseFloat(submitData.budget_max);
      }

      // Convert property ID to number if present
      if (submitData.interested_property_id) {
        submitData.interested_property_id = parseInt(submitData.interested_property_id);
      } else {
        delete submitData.interested_property_id;
      }

      const response = await rmService.createLead(submitData);

      if (response.success) {
        toast.success('Lead created successfully');
        navigate('/rm/leads');
      } else {
        toast.error(response.message || 'Failed to create lead');
      }
    } catch (err) {
      console.error('Create lead error:', err);
      toast.error('Failed to create lead');
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="rm-lead-create-page">
      <div className="rm-lead-create-container">
        {/* Header */}
        <div className="create-lead-header">
          <button
            className="btn-back"
            onClick={() => navigate('/rm/leads')}
          >
            <FiArrowLeft size={18} />
            Back to Leads
          </button>
          <h1>Create New Lead</h1>
          <p>Add a potential customer to your pipeline</p>
        </div>

        <form onSubmit={handleSubmit} className="lead-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3><FiUser size={18} /> Basic Information</h3>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <div className="input-with-icon">
                  <FiPhone size={16} />
                  <input
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={errors.phone ? 'error' : ''}
                  />
                </div>
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label>Email (Optional)</label>
                <div className="input-with-icon">
                  <FiMail size={16} />
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={errors.email ? 'error' : ''}
                  />
                </div>
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Lead Source *</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                className={errors.source ? 'error' : ''}
              >
                <option value="website">Website</option>
                <option value="direct">Direct Walk-in</option>
                <option value="referral">Referral</option>
                <option value="marketing">Marketing Campaign</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>
              {errors.source && (
                <span className="error-message">{errors.source}</span>
              )}
            </div>
          {/* </div> */}

          {/* Investment Interest */}
          {/* <div className="form-section"> */}
            <h3><FiDollarSign size={18} /> Investment Interest</h3>

            <div className="form-group">
              <label>Interested Property ID (Optional)</label>
              <input
                type="number"
                name="interested_property_id"
                placeholder="Enter property ID"
                value={formData.interested_property_id}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label>Budget Min (Optional)</label>
                <input
                  type="number"
                  name="budget_min"
                  placeholder="Minimum budget"
                  value={formData.budget_min}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={errors.budget_min ? 'error' : ''}
                />
                {errors.budget_min && (
                  <span className="error-message">{errors.budget_min}</span>
                )}
              </div>

              <div className="form-group">
                <label>Budget Max (Optional)</label>
                <input
                  type="number"
                  name="budget_max"
                  placeholder="Maximum budget"
                  value={formData.budget_max}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={errors.budget_max ? 'error' : ''}
                />
                {errors.budget_max && (
                  <span className="error-message">{errors.budget_max}</span>
                )}
              </div>
            </div>
          {/* </div> */}

          {/* Notes */}
          {/* <div className="form-section"> */}
            <h3>Additional Notes</h3>
            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea
                name="notes"
                rows="4"
                placeholder="Any additional information about this lead..."
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          {/* </div> */}

          {/* Actions */}
          {/* <div className="form-actions"> */}
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/rm/leads')}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Creating Lead...' : (
                <>
                  <FiSave size={16} />
                  Create Lead
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RMLeadCreate;