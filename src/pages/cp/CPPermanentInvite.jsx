import React, { useState, useEffect } from 'react';
import { FiCopy, FiCheck, FiAlertCircle, FiMail, FiSend } from 'react-icons/fi';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import CPHeader from '../../components/cp/CPHeader';
import cpInviteService from '../../services/cpInviteService';
import '../../styles/admin/cp/CPPermanentInvite.css';

const CPPermanentInvite = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hasInvite, setHasInvite] = useState(false);
  
  // 🆕 Email invite states
  const [emailRecipient, setEmailRecipient] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchPermanentInvite();
  }, []);

  const fetchPermanentInvite = async () => {
    try {
      setLoading(true);
      const result = await cpInviteService.getPermanentInvite();
      
      if (result.success && result.has_invite) {
        setData(result.data);
        setHasInvite(true);
      } else {
        setHasInvite(false);
      }
    } catch (error) {
      setHasInvite(false);
      if (error.error) {
        toast.error(error.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await cpInviteService.copyLink(data.invite_link);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleWhatsAppShare = () => {
    cpInviteService.shareViaWhatsApp(data.invite_link, data.cp_name);
  };

  const handleEmailShare = () => {
    cpInviteService.shareViaEmail(data.invite_link, data.cp_name);
  };

 const handleSendEmail = async () => {
  if (!emailRecipient.trim()) {
    toast.error('Please enter an email address');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailRecipient)) {
    toast.error('Please enter a valid email address');
    return;
  }

  setSendingEmail(true);
  try {
    const response = await cpInviteService.sendInviteEmail({
      email: emailRecipient
    });

    if (response.success) {
      toast.success(`✅ Invite sent to ${emailRecipient}!`);
      setEmailRecipient('');
    } else {
      toast.error(response.error || 'Failed to send email');
    }
  } catch (error) {
    toast.error(error.error || 'Failed to send email');
    console.error('Email send error:', error);
  } finally {
    setSendingEmail(false);
  }
};


  // Handle Enter key press in email input
  const handleEmailKeyPress = (e) => {
    if (e.key === 'Enter' && !sendingEmail) {
      handleSendEmail();
    }
  };

  if (loading) {
    return (
      <div className="cp-permanent-invite-page">
        <CPHeader />
        <div className="loading-state-dash">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (!hasInvite) {
    return (
      <div className="cp-permanent-invite-page">
        <CPHeader />
        <div className="no-invite-state">
          <FiAlertCircle size={64} color="#f59e0b" />
          <h2>No Referral Link Yet</h2>
          <p>Your permanent referral link hasn't been created yet.</p>
          <p className="contact-admin">Please contact admin to set up your referral link.</p>
        </div>
      </div>
    );
  }

  const stats = data.stats;

  return (
    <div className="cp-permanent-invite-page">
      <CPHeader />

      <div className="cp-permanent-invite-container">
        {/* Header */}
        <div className="permanent-invite-header">
          <div>
            <h1>Your Referral Link</h1>
            <p>Share this link to earn commissions on every investment</p>
          </div>
          <button 
            className="btn-view-signups"
            onClick={() => navigate('/cp/invite-signups')}
          >
            View All Signups
          </button>
        </div>

        {/* Invite Link Card */}
        <div className="permanent-invite-card">
          <div className="invite-section">
            <label>Your Invite Code</label>
            <div className="invite-code-display">{data.invite_code}</div>
          </div>

          <div className="invite-section">
            <label>Permanent Referral Link</label>
            <div className="invite-link-wrapper">
              <input
                type="text"
                value={data.invite_link}
                readOnly
                className="permanent-invite-input"
              />
              <button
                className={`btn-copy-permanent ${copied ? 'copied' : ''}`}
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <FiCheck size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <FiCopy size={18} />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="share-buttons-permanent">
            <button className="btn-share-permanent whatsapp" onClick={handleWhatsAppShare}>
              <FaWhatsapp size={20} />
              Share on WhatsApp
            </button>
            <button className="btn-share-permanent email" onClick={handleEmailShare}>
              <FaEnvelope size={20} />
              Share via Email
            </button>
          </div>

          {/* 🆕 NEW: EMAIL INVITE SECTION */}
          <div className="email-invite-section">
            <div className="email-invite-header">
              <FiMail size={20} />
              <h3>Send Direct Email Invite</h3>
            </div>
            <p className="email-invite-description">
              Enter recipient's email to send them a personalized invitation
            </p>
            <div className="email-invite-input-wrapper">
              <input
                type="email"
                placeholder="recipient@example.com"
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
                onKeyPress={handleEmailKeyPress}
                disabled={sendingEmail}
                className="email-invite-input"
              />
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail || !emailRecipient.trim()}
                className="btn-send-email"
              >
                {sendingEmail ? (
                  <>
                    <div className="spinner-small"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend size={18} />
                    Send Invite
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="invite-instructions-permanent">
            <h4>How it works:</h4>
            <ol>
              <li>Share your referral link with potential investors</li>
              <li>When they sign up using your link, they'll be automatically linked to you</li>
              <li>Earn commission when they make investments</li>
              <li>Track all signups in the "View All Signups" page</li>
              <li>This link never expires and can be used by unlimited users!</li>
            </ol>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="permanent-invite-stats-grid">
          <div className="permanent-stat-card">
            <div className="permanent-stat-icon signups">👥</div>
            <div className="permanent-stat-content">
              <div className="permanent-stat-value">{stats.total_signups}</div>
              <div className="permanent-stat-label">Total Signups</div>
            </div>
          </div>

          <div className="permanent-stat-card">
            <div className="permanent-stat-icon invested">💰</div>
            <div className="permanent-stat-content">
              <div className="permanent-stat-value">{stats.invested_customers}</div>
              <div className="permanent-stat-label">Invested</div>
              <div className="permanent-stat-sublabel">
                {stats.conversion_rate}% conversion
              </div>
            </div>
          </div>

          <div className="permanent-stat-card">
            <div className="permanent-stat-icon amount">📊</div>
            <div className="permanent-stat-content">
              <div className="permanent-stat-value">
                {cpInviteService.formatCurrency(stats.total_investment)}
              </div>
              <div className="permanent-stat-label">Total Investment</div>
            </div>
          </div>

          <div className="permanent-stat-card">
            <div className="permanent-stat-icon commission">💸</div>
            <div className="permanent-stat-content">
              <div className="permanent-stat-value success">
                {cpInviteService.formatCurrency(stats.total_commission)}
              </div>
              <div className="permanent-stat-label">Total Commission</div>
              <div className="permanent-stat-breakdown">
                <span>Paid: {cpInviteService.formatCurrency(stats.commission_paid)}</span>
                <span>Pending: {cpInviteService.formatCurrency(stats.commission_pending)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="permanent-invite-tip">
          <div className="tip-icon-permanent">💡</div>
          <div className="tip-content-permanent">
            <h4>Pro Tip</h4>
            <p>Share your link in WhatsApp groups, social media, email signatures, or directly with interested investors. The more you share, the more you earn! This permanent link works for unlimited users.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CPPermanentInvite;