// CPApprovalModal.jsx
// =====================================================
// Admin Component: CP Approval Modal
// Approve or reject CP applications - SHOWS ALL DETAILS
// =====================================================

import React, { useState } from 'react';
import { FiX, FiCheck, FiXCircle, FiUser, FiPhone, FiMail, FiFileText, FiMapPin, FiDollarSign, FiBriefcase } from 'react-icons/fi';
import adminService from '../../../services/adminService';
import '../../../styles/admin/cp/AdminCPComponents.css';

const CPApprovalModal = ({ application, onSubmit, onClose }) => {
  const [decision, setDecision] = useState(null); // 'approve' or 'reject'
  const [notes, setNotes] = useState('');
  const [partnerTier, setPartnerTier] = useState('bronze');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!decision) return;
    
    if (decision === 'reject' && !notes.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await adminService.cpApplicationAction(application.id, decision, {
        notes: notes,
        partner_tier: decision === 'approve' ? partnerTier : undefined
      });
      
      if (response.success) {
        onSubmit(decision);
      } else {
        setError(response.error || 'Failed to process application');
      }
    } catch (err) {
      setError('Failed to process application');
      console.error('Error processing application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay-approval" onClick={onClose}>
      <div className="modal-content-approval" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-approval">
          <h2>Review Application</h2>
          <button className="btn-close-modal-approval" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {error && (
          <div className="error-banner" style={{ margin: '1rem', padding: '1rem', background: '#f8d7da', color: '#721c24', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        <div style={{ padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {/* ============================================ */}
          {/* SECTION 1: PERSONAL INFORMATION */}
          {/* ============================================ */}
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '700' }}>
              <FiUser /> Personal Information
            </h3>
            <div className="summary-details">
              <div><strong>Full Name:</strong> {application.user_name || 'N/A'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiPhone size={14} />
                <strong>Phone:</strong> {application.phone || 'N/A'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiMail size={14} />
                <strong>Email:</strong> {application.user_email || 'N/A'}
              </div>
              <div><strong>CP Code:</strong> <span style={{ fontFamily: 'monospace', color: '#667eea' }}>{application.cp_code}</span></div>
            </div>
          </div>

          {/* ============================================ */}
          {/* SECTION 2: BUSINESS INFORMATION */}
          {/* ============================================ */}
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '700' }}>
              <FiBriefcase /> Business Information
            </h3>
            <div className="summary-details">
              <div><strong>Agent Type:</strong> <span style={{ textTransform: 'capitalize' }}>{application.agent_type || 'N/A'}</span></div>
              
              {application.company_name && (
                <div><strong>Company Name:</strong> {application.company_name}</div>
              )}
              
              <div><strong>Source:</strong> <span style={{ textTransform: 'capitalize' }}>{application.source || 'Direct'}</span></div>
            </div>
          </div>

          {/* ============================================ */}
          {/* SECTION 3: LEGAL DOCUMENTS */}
          {/* ============================================ */}
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '700' }}>
              <FiFileText /> Legal Documents
            </h3>
            <div className="summary-details">
              <div><strong>PAN Number:</strong> {application.pan_number || 'Not Provided'}</div>
              
              {application.gst_number && (
                <div><strong>GST Number:</strong> {application.gst_number}</div>
              )}
              
              {application.rera_number && (
                <div><strong>RERA Number:</strong> {application.rera_number}</div>
              )}
            </div>
          </div>

          {/* ============================================ */}
          {/* SECTION 4: ADDRESS */}
          {/* ============================================ */}
          {application.business_address && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '700' }}>
                <FiMapPin /> Business Address
              </h3>
              <p style={{ margin: 0, color: '#1a1a1a' }}>{application.business_address}</p>
            </div>
          )}

          {/* ============================================ */}
          {/* SECTION 5: BANK DETAILS */}
          {/* ============================================ */}
          {(application.bank_name || application.account_number) && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '700' }}>
                <FiDollarSign /> Bank Details
              </h3>
              <div className="summary-details">
                <div><strong>Bank Name:</strong> {application.bank_name || 'N/A'}</div>
                <div><strong>Account Holder:</strong> {application.account_holder_name || 'N/A'}</div>
                <div><strong>Account Number:</strong> {application.account_number || 'N/A'}</div>
                <div><strong>IFSC Code:</strong> {application.ifsc_code || 'N/A'}</div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* SECTION 6: COMMISSION NOTES (if any) */}
          {/* ============================================ */}
          {application.commission_notes && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: '700' }}>Commission Notes</h3>
              <p style={{ margin: 0, color: '#856404' }}>{application.commission_notes}</p>
            </div>
          )}
        </div>

        {/* Decision Buttons */}
        <div className="decision-section">
          <h4>Decision</h4>
          <div className="decision-buttons">
            <button
              className={`decision-btn approve ${decision === 'approve' ? 'active' : ''}`}
              onClick={() => setDecision('approve')}
            >
              <FiCheck size={24} />
              Approve
            </button>
            <button
              className={`decision-btn reject ${decision === 'reject' ? 'active' : ''}`}
              onClick={() => setDecision('reject')}
            >
              <FiXCircle size={24} />
              Reject
            </button>
          </div>
        </div>

        {/* Partner Tier (if approving) */}
        {decision === 'approve' && (
          <div className="tier-selection">
            <h4>Partner Tier</h4>
            <div className="tier-buttons">
              <button
                className={`tier-btn bronze ${partnerTier === 'bronze' ? 'active' : ''}`}
                onClick={() => setPartnerTier('bronze')}
              >
                Bronze
              </button>
              <button
                className={`tier-btn silver ${partnerTier === 'silver' ? 'active' : ''}`}
                onClick={() => setPartnerTier('silver')}
              >
                Silver
              </button>
              <button
                className={`tier-btn gold ${partnerTier === 'gold' ? 'active' : ''}`}
                onClick={() => setPartnerTier('gold')}
              >
                Gold
              </button>
              <button
                className={`tier-btn platinum ${partnerTier === 'platinum' ? 'active' : ''}`}
                onClick={() => setPartnerTier('platinum')}
              >
                Platinum
              </button>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="notes-section">
          <h4>Notes {decision === 'reject' && <span className="required">*</span>}</h4>
          <textarea
            className="notes-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={decision === 'reject' ? 'Provide reason for rejection...' : 'Add any notes (optional)...'}
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="modal-actions-approval">
          <button
            className="btn-cancel-approval"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            className="btn-submit-approval"
            onClick={handleSubmit}
            disabled={submitting || !decision || (decision === 'reject' && !notes.trim())}
          >
            {submitting ? 'Submitting...' : 'Submit Decision'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CPApprovalModal;