// CPInviteForm.jsx
// =====================================================
// CP Invite Form Component
// Modal form for sending invites to potential customers
// =====================================================

import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import '../../styles/cp/CPInviteForm.css';

const CPInviteForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    recipient_name: '',
    recipient_email: '',
    recipient_phone: '',
    personal_message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };  

  const validateForm = () => {
    const newErrors = {};

    if (!formData.recipient_name.trim()) {
      newErrors.recipient_name = 'Name is required';
    }

    if (!formData.recipient_email && !formData.recipient_phone) {
      newErrors.recipient_email = 'Email or phone is required';
      newErrors.recipient_phone = 'Email or phone is required';
    }

    if (formData.recipient_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recipient_email)) {
      newErrors.recipient_email = 'Invalid email address';
    }

   if (
  formData.recipient_phone &&
  !/^\+91[6-9]\d{9}$/.test(formData.recipient_phone.replace(/[\s-]/g, ''))
) {
  newErrors.recipient_phone = 'Phone must start with +91 and be valid';
}


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
       await onSubmit({
          name: formData.recipient_name,
          email: formData.recipient_email,
          phone: formData.recipient_phone,
          personal_message: formData.personal_message
        });
    } catch (err) {
      alert('Failed to send invite');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay-invite" onClick={onClose}>
      <div className="modal-content-invite" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-invite">
          <h2>Send Invite</h2>
          <button className="btn-close-modal-invite" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Info Banner */}
        <div className="info-banner-invite">
          <p>
            Send a personalized invite link to potential customers. They'll be able to 
            sign up through your referral and you'll earn commission on their investments.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="invite-form">
          {/* Recipient Name */}
          <div className="form-group-invite">
            <label className="form-label-invite">Recipient Name *</label>
            <input
              type="text"
              className={`form-input-invite ${errors.recipient_name ? 'error' : ''}`}
              value={formData.recipient_name}
              onChange={(e) => handleChange('recipient_name', e.target.value)}
              placeholder="Enter recipient's full name"
            />
            {errors.recipient_name && (
              <span className="error-text-invite">{errors.recipient_name}</span>
            )}
          </div>

          {/* Recipient Email */}
          <div className="form-group-invite">
            <label className="form-label-invite">Email Address</label>
            <input
              type="email"
              className={`form-input-invite ${errors.recipient_email ? 'error' : ''}`}
              value={formData.recipient_email}
              onChange={(e) => handleChange('recipient_email', e.target.value)}
              placeholder="Enter email address"
            />
            {errors.recipient_email && (
              <span className="error-text-invite">{errors.recipient_email}</span>
            )}
          </div>

          {/* Recipient Phone */}
          <div className="form-group-invite">
            <label className="form-label-invite">Phone Number</label>
            <input
              type="tel"
              className={`form-input-invite ${errors.recipient_phone ? 'error' : ''}`}
              value={formData.recipient_phone}
              onChange={(e) => handleChange('recipient_phone', e.target.value)}
              placeholder="Enter phone number"
            />
            {errors.recipient_phone && (
              <span className="error-text-invite">{errors.recipient_phone}</span>
            )}
            <span className="helper-text-invite">
              At least one contact method (email or phone) is required
            </span>
          </div>

          {/* Personal Message */}
          <div className="form-group-invite full-width">
            <label className="form-label-invite">Personal Message (Optional)</label>
            <textarea
              className="form-textarea-invite"
              value={formData.personal_message}
              onChange={(e) => handleChange('personal_message', e.target.value)}
              placeholder="Add a personal message to your invite..."
              rows={4}
            />
            <span className="helper-text-invite">
              This message will be included with your invite
            </span>
          </div>

          {/* Actions */}
          <div className="form-actions-invite">
            <button
              type="button"
              className="btn-cancel-invite"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit-invite"
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CPInviteForm;