// CPInvites.jsx
// =====================================================
// CP Invites Management Page
// Send invites, track usage, manage invite codes
// =====================================================

import React, { useState, useEffect } from 'react';
import { FiPlus, FiCopy, FiCheck } from 'react-icons/fi';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import CPHeader from '../../components/cp/CPHeader';
import CPInviteForm from '../../components/cp/CPInviteForm';
import cpInviteService from '../../services/cpInviteService';
import '../../styles/cp/CPInvites.css';

const CPInvites = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchInvites();
  }, []);

  // const fetchInvites = async () => {
  //   try {
  //     setLoading(true);
  //     const result = await cpInviteService.getInviteSignups();
      
  //     if (result.success) {
  //       setInvites(result.data);
  //     } else {
  //       setError(result.error);
  //     }
  //   } catch (err) {
  //     setError('Failed to load invites');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchInvites = async () => {
  try {
    setLoading(true);
    setError(null); // Clear previous errors
    
    const result = await cpInviteService.getInviteSignups();
    
    console.log('API Response:', result); // Debug log
    
    if (result.success) {
      console.log('Invites data:', result.data); // Debug log
      setInvites(result.data || []); // Ensure it's an array
    } else {
      setError(result.error || 'Failed to load invites');
    }
  } catch (err) {
    console.error('Fetch invites error:', err); // Debug log
    setError(err.message || 'Failed to load invites');
  } finally {
    setLoading(false);
  }
};

  // const handleSendInvite = async (inviteData) => {
  //   try {
  //     const result = await cpInviteService.sendInvite(inviteData);
      
  //     if (result.success) {
  //       fetchInvites(); // Refresh list
  //       setShowForm(false);
  //     } else {
  //       alert(result.error || 'Failed to send invite');
  //     }
  //   } catch (err) {
  //     alert('Failed to send invite');
  //   }
  // };
  const handleSendInvite = async (inviteData) => {
  try {
    const result = await cpInviteService.sendInviteEmail(inviteData);
    
    if (result.success) {
      // Close form first
      setShowForm(false);
      
      // Refresh the invites list to update counts
      await fetchInvites();
      
      // Optional: Show success message
      alert('Invite sent successfully!');
    } else {
      alert(result.error || 'Failed to send invite');
    }
  } catch (err) {
    console.error('Error sending invite:', err);
    alert(err.error || 'Failed to send invite');
  }
};

  const handleCopyLink = async (inviteLink, inviteCode) => {
    try {
      await cpInviteService.copyInviteLink(inviteLink);
      setCopiedCode(inviteCode);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  const handleWhatsAppShare = (inviteLink, name, cpName) => {
    cpInviteService.shareViaWhatsApp(inviteLink, name, cpName);
  };

  const handleEmailShare = (inviteLink, email, name, cpName) => {
    cpInviteService.shareViaEmail(inviteLink, email, name, cpName);
  };

  // Calculate stats
  const totalInvites = invites.length;
  const usedInvites = invites.filter(i => i.is_used).length;
  const activeInvites = invites.filter(i => cpInviteService.isInviteValid(i)).length;
  const expiredInvites = invites.filter(i => !cpInviteService.isInviteValid(i) && !i.is_used).length;

  if (loading) {
    return (
      <div className="cp-invites-page">
        <CPHeader />
        <div className="loading-state-dash">
          <div className="loading-spinner">Loading invites...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-invites-page"> 
      <CPHeader />

      <div className="cp-invites-container">
        {/* Header */}
        <div className="invites-header">
          <div>
            <h1>Invite Management</h1>
            <p>Send personalized invites to potential customers</p>
          </div>
          <button className="btn-send-invite" onClick={() => setShowForm(true)}>
            <FiPlus size={20} />
            Send New Invite
          </button>
        </div>

        {/* Stats */}
        <div className="invites-stats">
          <div className="invite-stat-card">
            <div className="stat-value-invite">{totalInvites}</div>
            <div className="stat-label-invite">Total Invites</div>
          </div>
          <div className="invite-stat-card">
            <div className="stat-value-invite success">{usedInvites}</div>
            <div className="stat-label-invite">Used</div>
          </div>
          <div className="invite-stat-card">
            <div className="stat-value-invite info">{activeInvites}</div>
            <div className="stat-label-invite">Active</div>
          </div>
          <div className="invite-stat-card">
            <div className="stat-value-invite warning">{expiredInvites}</div>
            <div className="stat-label-invite">Expired</div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="error-banner-invites">
            <span>{error}</span>
            <button onClick={fetchInvites}>Retry</button>
          </div>
        )}

        {/* Empty State */}
        {invites.length === 0 && !loading && !error && (
          <div className="empty-state-invites">
            <FiPlus size={60} color="#cccccc" />
            <h3>No Invites Sent Yet</h3>
            <p>Start inviting potential customers to join through your referral</p>
            <button className="btn-send-first" onClick={() => setShowForm(true)}>
              Send Your First Invite
            </button>
          </div>
        )}

        {/* Invites List */}
        {invites.length > 0 && (
          <div className="invites-list">
            {invites.map((invite) => {
              const isValid = cpInviteService.isInviteValid(invite);
              const daysRemaining = cpInviteService.getDaysUntilExpiry(invite.expires_at);
              const statusBadge = cpInviteService.getStatusBadge(invite);

              return (
                <div key={invite.id} className="invite-card">
                  {/* Header */}
                  <div className="invite-card-header">
                    <div className="invite-recipient">
                      <h3>{invite.recipient_name}</h3>
                      <div className="recipient-contact">
                        {invite.recipient_email && <span>{invite.recipient_email}</span>}
                        {invite.recipient_phone && <span>{cpInviteService.formatPhone(invite.recipient_phone)}</span>}
                      </div>
                    </div>
                    <span className={`invite-status-badge ${statusBadge.className}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Invite Details */}
                  {/* Invite Details */}
<div className="invite-details">
  <div className="detail-item-invite">
    <span className="detail-label-invite">Invite Code:</span>
    <span className="detail-value-invite code">
      {invite.invite_code ||invite.code || 'N/A'}
    </span>
  </div>
  <div className="detail-item-invite">
    <span className="detail-label-invite">Sent:</span>
    <span className="detail-value-invite">
      {invite.created_at 
        ? new Date(invite.created_at).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        : '-' 
      }
    </span>
  </div>
  {!invite.is_used && isValid && invite.expires_at && (
    <div className="detail-item-invite">
      <span className="detail-label-invite">Expires in:</span>
      <span className="detail-value-invite expiry">
        {daysRemaining} days
      </span>
    </div>
  )}
  {invite.is_used && invite.used_at && (
    <div className="detail-item-invite">
      <span className="detail-label-invite">Used on:</span>
      <span className="detail-value-invite success">
        {new Date(invite.used_at).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </span>
    </div>
  )}
</div>

                  {/* Invite Link */}
                  {!invite.is_used && isValid && (
                    <div className="invite-link-section">
                      <input
                        type="text"
                        value={invite.invite_link}
                        readOnly
                        className="invite-link-input"
                      />
                      <button
                        className={`btn-copy-invite ${copiedCode === invite.invite_code ? 'copied' : ''}`}
                        onClick={() => handleCopyLink(invite.invite_link, invite.invite_code)}
                      >
                        {copiedCode === invite.invite_code ? (
                          <>
                            <FiCheck size={16} />
                            Copied
                          </>
                        ) : (
                          <>
                            <FiCopy size={16} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  {!invite.is_used && isValid && (
                    <div className="invite-actions">
                      <button
                        className="btn-share-whatsapp"
                        onClick={() => handleWhatsAppShare(
                          invite.invite_link,
                          invite.recipient_name,
                          'AssetKart'
                        )}
                      >
                        <FaWhatsapp size={18} />
                        WhatsApp
                      </button>
                      <button
                        className="btn-share-email"
                        onClick={() => handleEmailShare(
                          invite.invite_link,
                          invite.recipient_email,
                          invite.recipient_name,
                          'AssetKart'
                        )}
                      >
                        <FaEnvelope size={18} />
                        Email
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite Form Modal */}
      {showForm && (
        <CPInviteForm
          onSubmit={handleSendInvite}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default CPInvites;