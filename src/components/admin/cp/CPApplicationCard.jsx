// CPApplicationCard.jsx
// =====================================================
// Admin Component: CP Application Review Card
// Used in: AdminCPApplications page
// =====================================================

import React from 'react';
import { FiUser, FiPhone, FiMail, FiCalendar, FiFileText } from 'react-icons/fi';
// import '../../../styles/admin/cp/CPApplicationCard.css';

const CPApplicationCard = ({ application, onReview }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { label: 'Pending Review', color: '#ffc107', icon: '⏱' },
      'in_progress': { label: 'In Progress', color: '#007bff', icon: '🔄' },
      'completed': { label: 'Approved', color: '#28a745', icon: '✓' },
      'rejected': { label: 'Rejected', color: '#dc3545', icon: '✕' }
    };
    return statusMap[status] || statusMap['pending'];
  };

  const statusInfo = getStatusInfo(application.onboarding_status);

  return (
    <div className="cp-application-card-admin">
      {/* Header */}
      <div className="application-card-header">
        <div className="applicant-info">
          <h3>{application.user_name}</h3>
          <span className="cp-code-badge">{application.cp_code}</span>
        </div>
        <span 
          className="application-status-badge"
          style={{ background: statusInfo.color }}
        >
          {statusInfo.icon} {statusInfo.label}
        </span>
      </div>

      {/* Details */}
      <div className="application-details">
        <div className="detail-row-app">
          <FiUser size={16} />
          <span className="detail-label-app">Type:</span>
          <span className="detail-value-app">
            {application.agent_type?.charAt(0).toUpperCase() + application.agent_type?.slice(1)}
          </span>
        </div>

        {application.company_name && (
          <div className="detail-row-app">
            <FiFileText size={16} />
            <span className="detail-label-app">Company:</span>
            <span className="detail-value-app">{application.company_name}</span>
          </div>
        )}

        <div className="detail-row-app">
          <FiPhone size={16} />
          <span className="detail-label-app">Phone:</span>
          <span className="detail-value-app">{application.phone}</span>
        </div>

        <div className="detail-row-app">
          <FiMail size={16} />
          <span className="detail-label-app">Email:</span>
          <span className="detail-value-app">{application.user_email}</span>
        </div>

        <div className="detail-row-app">
          <FiCalendar size={16} />
          <span className="detail-label-app">Applied:</span>
          <span className="detail-value-app">{formatDate(application.created_at)}</span>
        </div>
      </div>

      {/* Documents */}
      {application.documents_count > 0 && (
        <div className="documents-info">
          <FiFileText size={16} />
          <span>{application.documents_count} documents uploaded</span>
        </div>
      )}

      {/* Actions */}
      <div className="application-actions">
        <button 
          className="btn-review-application"
          onClick={() => onReview(application)}
        >
          Review Application
        </button>
      </div>
    </div>
  );
};

export default CPApplicationCard;