// AdminUserCreation.jsx
// =====================================================
// Admin Create Customer (End User)
// =====================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import "../../styles/admin/AdminCustomerCreate.css";

const AdminUserCreation = () => {
  const navigate = useNavigate();

  /* -------------------- State -------------------- */
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* -------------------- Validation -------------------- */
  const validateField = (name, value) => {
    switch (name) {
      case 'first_name':
        if (!value.trim()) return 'First name is required';
        if (value.length < 2) return 'Minimum 2 characters';
        break;

      case 'last_name':
        if (!value.trim()) return 'Last name is required';
        if (value.length < 2) return 'Minimum 2 characters';
        break;

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return 'Invalid email address';
        break;

      case 'phone': {
        const digits = value.replace(/\D/g, '');
        if (!digits) return 'Phone number is required';
        if (digits.length !== 10)
          return 'Enter a valid 10-digit phone number';
        break;
      }

      case 'password':
        if (value && value.length < 8)
          return 'Password must be at least 8 characters';
        break;

      default:
        break;
    }
    return '';
  };

  const validateForm = () => {
    const required = ['first_name', 'last_name', 'email', 'phone'];
    const newErrors = {};

    required.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (formData.password) {
      const error = validateField('password', formData.password);
      if (error) newErrors.password = error;
    }

    setErrors(newErrors);
    setTouched({
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      password: true
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

    // Format phone (+91)
    let phone = formData.phone.replace(/\D/g, '');
    if (phone.length === 10) phone = `+91${phone}`;

    try {
      setSubmitting(true);

      const response = await adminService.createUser({
        ...formData,
        phone
      });

      if (response.success) {
        toast.success('Customer created successfully');
        navigate('/admin/users');
      } else {
        toast.error(response.message || 'Failed to create customer');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to create customer');
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="admin-customer-create-page">
      <div className="admin-customer-create-container">
        {/* Header */}
        <div className="create-customer-header">
          <button
            className="btn-back"
            onClick={() => navigate('/admin/users')}
          >
            <FiArrowLeft size={18} />
            Back to Users
          </button>
          <h1>Create New Customer</h1>
          <p>Manually add an end user to the platform</p>
        </div>

        <form onSubmit={handleSubmit} className="customer-form">
          {/* First & Last Name Side by Side */}
          <div className="form-group-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.first_name ? 'error' : ''}
              />
              {errors.first_name && (
                <span className="error-message">{errors.first_name}</span>
              )}
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={errors.last_name ? 'error' : ''}
              />
              {errors.last_name && (
                <span className="error-message">{errors.last_name}</span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone *</label>
            <input
              name="phone"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>

        

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/admin/users')}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Creating Customer...' : (
                <>
                  <FiSave size={16} />
                  Create Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserCreation;