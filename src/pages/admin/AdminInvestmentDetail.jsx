import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import StatusBadge from '../../components/admin/StatusBadge';
import ActionModal from '../../components/admin/ActionModal';
import InvestmentWorkflowProgress from '../../components/admin/InvestmentWorkflowProgress';
import PaymentProofViewer from '../../components/admin/PaymentProofViewer';
import '../../styles/admin/AdminInvestments.css';

const AdminInvestmentDetail = () => {
  const { investmentId } = useParams();
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Action modal (approve / reject investment)
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    action: null,
    title: '',
    message: '',
    requireReason: false
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Instalment payments
  const [instalmentPayments, setInstalmentPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Add instalment payment modal
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [addPaymentForm, setAddPaymentForm] = useState({
    amount: '',
    payment_method: '',
    payment_date: '',
    payment_notes: '',
    payment_mode: '',
    transaction_no: '',
    pos_slip_image: null,
    cheque_number: '',
    cheque_date: '',
    bank_name: '',
    ifsc_code: '',
    branch_name: '',
    cheque_image: null,
    neft_rtgs_ref_no: '',
  });
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Reject instalment modal
  const [rejectModal, setRejectModal] = useState({ open: false, paymentId: null });
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingPayment, setRejectingPayment] = useState(false);

  useEffect(() => {
    fetchInvestmentDetail();
  }, [investmentId]);

  const fetchInstalmentPayments = async (id) => {
    setLoadingPayments(true);
    try {
      const response = await adminService.getAdminInvestmentPayments(id);
      if (response.success) {
        setInstalmentPayments(response.data);
      }
    } catch (err) {
      console.error('Failed to load instalment payments:', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const fetchInvestmentDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminService.getInvestmentDetail(investmentId);
      
      console.log('📦 Investment Detail Response:', response);
      
      if (response.success) {
        setInvestment(response.data);
        // Auto-load instalment payments if partial payment investment
        if (response.data.is_partial_payment) {
          fetchInstalmentPayments(investmentId);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch investment');
      }
    } catch (error) {
      console.error('❌ Error fetching investment detail:', error);
      setError(error.message || 'Failed to load investment details');
      toast.error('Failed to load investment details');
    } finally {
      setLoading(false);
    }
  };

  const openActionModal = (action) => {
    const modalConfig = {
      approve_payment: {
        title: 'Approve Payment',
        message: `Approve payment proof for investment #${investment.investment_id}?`,
        requireReason: false
      },
      reject_payment: {
        title: 'Reject Payment',
        message: `Reject payment for investment #${investment.investment_id}? User will be notified.`,
        requireReason: true
      },
      approve: {
        title: 'Approve Investment',
        message: `Are you sure you want to approve investment #${investment.investment_id}? Units will be allocated and commission calculated.`,
        requireReason: false
      },
      reject: {
        title: 'Reject Investment',
        message: `Are you sure you want to reject investment #${investment.investment_id}? Please provide a reason.`,
        requireReason: true
      },
      complete: {
        title: 'Mark as Completed',
        message: `Mark investment #${investment.investment_id} as payment completed?`,
        requireReason: false
      },
      cancel: {
        title: 'Cancel Investment',
        message: `Are you sure you want to cancel investment #${investment.investment_id}? Units will be returned to property.`,
        requireReason: true
      },
      soft_delete: {
        title: 'Soft Delete',
        message: `Soft delete investment #${investment.investment_id}? It will be hidden from the user but kept in the system. You can restore it later.`,
        requireReason: false
      }
    };

    setActionModal({
      isOpen: true,
      action,
      ...modalConfig[action]
    });
  };

  const handleInvestmentAction = async (reason) => {
    setActionLoading(true);

    try {
      if (actionModal.action === 'soft_delete') {
        const response = await adminService.softDeleteInvestment(investmentId);
        if (response.success) {
          toast.success(response.message);
          setActionModal({ ...actionModal, isOpen: false });
          fetchInvestmentDetail();
        }
        return;
      }

      const response = await adminService.investmentAction(
        investmentId,
        actionModal.action,
        reason
      );

      if (response.success) {
        toast.success(response.message);
        setInvestment(response.data || investment);
        setActionModal({ ...actionModal, isOpen: false });
        fetchInvestmentDetail();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      const response = await adminService.restoreInvestment(investmentId);
      if (response.success) {
        toast.success(response.message);
        fetchInvestmentDetail();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Restore failed');
    }
  };

  // ── Add Payment form handlers ──────────────────────────
  const handleAddPaymentFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setAddPaymentForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setAddPaymentForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetAddPaymentForm = () => {
    setAddPaymentForm({
      amount: '', payment_method: '', payment_date: '', payment_notes: '',
      payment_mode: '', transaction_no: '', pos_slip_image: null,
      cheque_number: '', cheque_date: '', bank_name: '', ifsc_code: '',
      branch_name: '', cheque_image: null, neft_rtgs_ref_no: '',
    });
  };

  const handleSubmitAddPayment = async () => {
    if (!addPaymentForm.amount || parseFloat(addPaymentForm.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!addPaymentForm.payment_method) {
      toast.error('Please select a payment method');
      return;
    }
    if (!addPaymentForm.payment_date) {
      toast.error('Please enter the payment date');
      return;
    }
    setSubmittingPayment(true);
    try {
      const formData = new FormData();
      Object.entries(addPaymentForm).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== '') {
          formData.append(key, val);
        }
      });
      const response = await adminService.adminAddInstalmentPayment(investmentId, formData);
      if (response.success) {
        toast.success('Instalment payment added successfully');
        setShowAddPaymentModal(false);
        resetAddPaymentForm();
        fetchInstalmentPayments(investmentId);
      }
    } catch (err) {
      const msg = err?.errors ? Object.values(err.errors).flat().join(', ') : err?.message || 'Failed to add payment';
      toast.error(msg);
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleApproveInstalment = async (paymentId) => {
    try {
      const response = await adminService.adminApprovePayment(investmentId, paymentId);
      if (response.success) {
        toast.success('Payment approved successfully');
        fetchInstalmentPayments(investmentId);
        fetchInvestmentDetail(); // refresh due_amount on the investment
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to approve payment');
    }
  };

  const handleOpenRejectModal = (paymentId) => {
    setRejectReason('');
    setRejectModal({ open: true, paymentId });
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setRejectingPayment(true);
    try {
      const response = await adminService.adminRejectPayment(investmentId, rejectModal.paymentId, rejectReason);
      if (response.success) {
        toast.success('Payment rejected');
        setRejectModal({ open: false, paymentId: null });
        fetchInstalmentPayments(investmentId);
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to reject payment');
    } finally {
      setRejectingPayment(false);
    }
  };

  const handleDownloadInstalmentReceipt = async (paymentId, paymentIdStr) => {
    try {
      toast.loading('Generating receipt...', { id: 'admin-dl-receipt' });
      const response = await adminService.adminDownloadPaymentReceipt(investmentId, paymentId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${paymentIdStr || paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Receipt downloaded', { id: 'admin-dl-receipt' });
    } catch (err) {
      toast.error('Failed to download receipt', { id: 'admin-dl-receipt' });
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const renderIcon = (iconName) => {
    const icons = {
      back: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      user: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      home: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      money: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      receipt: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 2V22L6 20L8 22L10 20L12 22L14 20L16 22L18 20L20 22V2L18 4L16 2L14 4L12 2L10 4L8 2L6 4L4 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 8H8M16 12H8M10 16H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      creditCard: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      info: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      // approve: (
      //   <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      //     <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      //     <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      //   </svg>
      // ),
      // reject: (
      //   <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      //     <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      //     <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      //   </svg>
      // ),
      check: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      cancel: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner">Loading investment details...</div>
      </div>
    );
  }

  if (error || !investment) {
    return (
      <div className="admin-error">
        <h3>Failed to Load Investment</h3>
        <p>{error}</p>
        <button className="btn-retry" onClick={fetchInvestmentDetail}>
          Retry
        </button>
      </div>
    );
  }

  const canApprovePayment = investment.status === 'pending_payment';
  const canApprove = investment.status === 'payment_approved';
  const canComplete = investment.status === 'approved' && !investment.payment_completed;
  const canCancel = investment.status !== 'cancelled' && investment.status !== 'completed';

  return (
    <div className="admin-investment-detail-page">
      {/* Header */}
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/admin/investments')}>
          {renderIcon('back')}
          Back to Investments
        </button>
        
        <div className="detail-actions">
          {canApprovePayment && (
            <>
              <button 
                className="btn-action-detail btn-approve-large" 
                onClick={() => openActionModal('approve_payment')}
              >
                {renderIcon('approve')}
                Approve Payment
              </button>
              <button 
                className="btn-action-detail btn-reject-large" 
                onClick={() => openActionModal('reject_payment')}
              >
                {renderIcon('reject')}
                Reject Payment
              </button>
            </>
          )}
          
          {canApprove && (
            <>
              <button 
                className="btn-action-detail btn-approve-large" 
                onClick={() => openActionModal('approve')}
              >
                {renderIcon('approve')}
                Approve Investment
              </button>
              <button 
                className="btn-action-detail btn-reject-large" 
                onClick={() => openActionModal('reject')}
              >
                {renderIcon('reject')}
                Reject Investment
              </button>
            </>
          )}

          {canComplete && (
            <button 
              className="btn-action-detail btn-complete" 
              onClick={() => openActionModal('complete')}
            >
              {renderIcon('check')}
              Mark as Completed
            </button>
          )}

          {/* Add Instalment Payment button */}
          {investment && investment.is_partial_payment && parseFloat(investment.due_amount) > 0 && (
            <button
              className="btn-action-detail btn-add-payment"
              onClick={() => setShowAddPaymentModal(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 14V16M12 14V12M12 14H10M12 14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Instalment Payment
            </button>
          )}

          {canCancel && (
            <button
              className="btn-action-detail btn-cancel"
              onClick={() => openActionModal('cancel')}
            >
              {renderIcon('cancel')}
              Cancel Investment
            </button>
          )}

          {!investment.is_deleted && (
            <button
              className="btn-action-detail btn-soft-delete"
              onClick={() => openActionModal('soft_delete')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18.1017 19.1493C18.0442 19.9019 17.4 20.5 16.6457 20.5H7.35432C6.59999 20.5 5.95579 19.9019 5.89833 19.1493L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Soft Delete
            </button>
          )}

          {investment.is_deleted && (
            <button
              className="btn-action-detail btn-restore"
              onClick={handleRestore}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M21 3V8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Restore
            </button>
          )}
        </div>
      </div>

      {investment.is_deleted && (
        <div className="detail-deleted-banner">
          <span className="detail-deleted-badge">Soft deleted</span>
          <span>This investment is hidden from the user. Use Restore to make it visible again.</span>
        </div>
      )}

      {/* Workflow Progress */}
      <InvestmentWorkflowProgress investment={investment} />

      {/* Investment Info Card */}
      <div className="detail-card">
        <div className="card-header">
          <div className="card-header-left">
            <div>
              <h2>Investment #{investment.investment_id}</h2>
              <p className="investment-date">
                Created on {new Date(investment.created_at).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          {/* <div className="card-header-right">
            <StatusBadge status={investment.status} />
            {investment.payment_status && (
              <StatusBadge 
                status={investment.payment_status.toLowerCase()} 
                label={investment.payment_status}
              />
            )}
          </div> */}
        </div>

        <div className="card-content">
          {/* PAYMENT DETAILS SECTION - PROMINENT */}
          {investment.payment_method && (
            <div className="info-section payment-section-highlight">
              <h3>
                <span className="section-icon">{renderIcon('creditCard')}</span>
                Payment Information
              </h3>
              <div className="info-grid-detail">
                <div className="info-item-detail">
                  <span className="info-label-detail">Payment Method</span>
                  <span className="info-value-detail">
                    {investment.payment_method_display || investment.payment_method}
                  </span>
                </div>
                <div className="info-item-detail">
                  <span className="info-label-detail">Payment Status</span>
                  <span className="info-value-detail">
                    {/* <StatusBadge 
                      status={investment.payment_status?.toLowerCase()} 
                      label={investment.payment_status || 'PENDING'}
                    /> */}
                  </span>
                </div>
                {investment.payment_date && (
                  <div className="info-item-detail">
                    <span className="info-label-detail">Payment Date</span>
                    <span className="info-value-detail">
                      {new Date(investment.payment_date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                )}
                
                {/* ONLINE / POS Details */}
                {(investment.payment_method === 'ONLINE' || investment.payment_method === 'POS') && (
                  <>
                    {investment.payment_mode && (
                      <div className="info-item-detail">
                        <span className="info-label-detail">Payment Mode</span>
                        <span className="info-value-detail">{investment.payment_mode}</span>
                      </div>
                    )}
                    {investment.transaction_no && (
                      <div className="info-item-detail">
                        <span className="info-label-detail">Transaction No</span>
                        <span className="info-value-detail transaction-code">
                          {investment.transaction_no}
                        </span>
                      </div>
                    )}
                  </>
                )}
                
                {/* CHEQUE Details */}
                {investment.payment_method === 'DRAFT_CHEQUE' && (
                  <>
                    {investment.cheque_number && (
                      <div className="info-item-detail">
                        <span className="info-label-detail">Cheque Number</span>
                        <span className="info-value-detail transaction-code">
                          {investment.cheque_number}
                        </span>
                      </div>
                    )}
                    {investment.cheque_date && (
                      <div className="info-item-detail">
                        <span className="info-label-detail">Cheque Date</span>
                        <span className="info-value-detail">
                          {new Date(investment.cheque_date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    )}
                    {investment.bank_name && (
                      <div className="info-item-detail">
                        <span className="info-label-detail">Bank Name</span>
                        <span className="info-value-detail">{investment.bank_name}</span>
                      </div>
                    )}
                    {investment.ifsc_code && (
                      <div className="info-item-detail">
                        <span className="info-label-detail">IFSC Code</span>
                        <span className="info-value-detail transaction-code">
                          {investment.ifsc_code}
                        </span>
                      </div>
                    )}
                    {investment.branch_name && (
                      <div className="info-item-detail">
                        <span className="info-label-detail">Branch</span>
                        <span className="info-value-detail">{investment.branch_name}</span>
                      </div>
                    )}
                  </>
                )}
                
                {/* NEFT / RTGS Details */}
                {investment.payment_method === 'NEFT_RTGS' && investment.neft_rtgs_ref_no && (
                  <div className="info-item-detail">
                    <span className="info-label-detail">Reference Number</span>
                    <span className="info-value-detail transaction-code">
                      {investment.neft_rtgs_ref_no}
                    </span>
                  </div>
                )}
                
                {investment.payment_notes && (
                  <div className="info-item-detail full-width">
                    <span className="info-label-detail">Payment Notes</span>
                    <span className="info-value-detail">{investment.payment_notes}</span>
                  </div>
                )}
                
                {investment.payment_approved_by_name && (
                  <>
                    <div className="info-item-detail">
                      <span className="info-label-detail">Approved By</span>
                      <span className="info-value-detail">{investment.payment_approved_by_name}</span>
                    </div>
                    {investment.payment_approved_at && (
                      <div className="info-item-detail">
                        <span className="info-label-detail">Approved At</span>
                        <span className="info-value-detail">
                          {new Date(investment.payment_approved_at).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* PAYMENT PROOF VIEWER */}
              {(investment.pos_slip_image || investment.cheque_image) && (
                <div className="payment-proof-section">
                  <h4 className="payment-proof-title">Payment Proof</h4>
                  <PaymentProofViewer 
                    imageUrl={investment.pos_slip_image || investment.cheque_image}
                    altText={investment.payment_method === 'DRAFT_CHEQUE' ? 'Cheque Image' : 'Payment Slip'}
                  />
                </div>
              )}
              
              {investment.payment_rejection_reason && (
                <div className="warning-section rejected">
                  <strong>Rejection Reason:</strong> {investment.payment_rejection_reason}
                </div>
              )}
            </div>
          )}

          {/* Investment Details */}
          <div className="info-section">
            <h3>
              <span className="section-icon">{renderIcon('money')}</span>
              Investment Details
            </h3>
            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">Investment Amount</span>
                <span className="info-value-detail highlight">
                  {formatCurrency(investment.amount)}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Shares Purchased</span>
                <span className="info-value-detail">{investment.units_purchased || 0}</span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Price Per Share</span>
                <span className="info-value-detail">
                  {formatCurrency(investment.price_per_unit_at_investment)}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Investment Date</span>
                <span className="info-value-detail">
                  {investment.investment_date 
                    ? new Date(investment.investment_date).toLocaleDateString('en-IN')
                    : 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Maturity Date</span>
                <span className="info-value-detail">
                  {investment.maturity_date 
                    ? new Date(investment.maturity_date).toLocaleDateString('en-IN')
                    : 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Lock-in End Date</span>
                <span className="info-value-detail">
                  {investment.lock_in_end_date 
                    ? new Date(investment.lock_in_end_date).toLocaleDateString('en-IN')
                    : 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Expected Return</span>
                <span className="info-value-detail">
                  {investment.expected_return_amount 
                    ? formatCurrency(investment.expected_return_amount)
                    : 'N/A'}
                </span>
              </div>
              {investment.actual_return_amount > 0 && (
                <div className="info-item-detail">
                  <span className="info-label-detail">Actual Return</span>
                  <span className="info-value-detail highlight">
                    {formatCurrency(investment.actual_return_amount)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="info-section">
            <h3>
              <span className="section-icon">{renderIcon('user')}</span>
              Customer Information
            </h3>
            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">Name</span>
                <span className="info-value-detail">
                  {investment.customer_details?.username || 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Email</span>
                <span className="info-value-detail">
                  {investment.customer_details?.email || 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Phone</span>
                <span className="info-value-detail">
                  {investment.customer_details?.phone || 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Customer ID</span>
                <span className="info-value-detail">
                  #{investment.customer_details?.id || 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">KYC Status</span>
                <span className="info-value-detail">
                  {/* <StatusBadge status={investment.customer_details?.kyc_status || 'pending'} /> */}
                </span>
              </div>
            </div>
          </div>

          {/* Property Info */}
          <div className="info-section">
            <h3>
              <span className="section-icon">{renderIcon('home')}</span>
              Property Information
            </h3>
            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">Property Name</span>
                <span className="info-value-detail">
                  {investment.property_details?.name || 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Location</span>
                <span className="info-value-detail">
                  {investment.property_details?.address || 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Property Type</span>
                <span className="info-value-detail">
                  {investment.property_details?.property_type?.toUpperCase() || 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Property ID</span>
                <span className="info-value-detail">
                  #{investment.property_details?.id || 'N/A'}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Property Status</span>
                <span className="info-value-detail">
                  {/* <StatusBadge status={investment.property_details?.status || 'draft'} /> */}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Property Value</span>
                <span className="info-value-detail">
                  {investment.property_details?.total_value 
                    ? formatCurrency(investment.property_details.total_value)
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Info */}
          {investment.transaction_details && (
            <div className="info-section">
              <h3>
                <span className="section-icon">{renderIcon('receipt')}</span>
                Transaction Information
              </h3>
              <div className="info-grid-detail">
                <div className="info-item-detail">
                  <span className="info-label-detail">Transaction ID</span>
                  <span className="info-value-detail">
                    {investment.transaction_details.transaction_id || 'N/A'}
                  </span>
                </div>
                <div className="info-item-detail">
                  <span className="info-label-detail">Amount</span>
                  <span className="info-value-detail">
                    {formatCurrency(investment.transaction_details.amount)}
                  </span>
                </div>
                <div className="info-item-detail">
                  <span className="info-label-detail">Payment Method</span>
                  <span className="info-value-detail">
                    {investment.transaction_details.payment_method || 'N/A'}
                  </span>
                </div>
                <div className="info-item-detail">
                  <span className="info-label-detail">Transaction Status</span>
                  <span className="info-value-detail">
                    <StatusBadge status={investment.transaction_details.status || 'pending'} />
                  </span>
                </div>
                <div className="info-item-detail">
                  <span className="info-label-detail">Transaction Date</span>
                  <span className="info-value-detail">
                    {investment.transaction_details.created_at 
                      ? new Date(investment.transaction_details.created_at).toLocaleString('en-IN')
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Commission Info */}
          {investment.commission_details && investment.commission_details.length > 0 && (
            <div className="info-section">
              <h3>
                <span className="section-icon">{renderIcon('money')}</span>
                Commission Details
              </h3>
              <div className="commissions-list">
                {investment.commission_details.map((comm) => (
                  <div key={comm.id} className="commission-item">
                    <div className="info-grid-detail">
                      <div className="info-item-detail">
                        <span className="info-label-detail">Channel Partner</span>
                        <span className="info-value-detail">{comm.channel_partner || 'N/A'}</span>
                      </div>
                      <div className="info-item-detail">
                        <span className="info-label-detail">Commission Amount</span>
                        <span className="info-value-detail">{formatCurrency(comm.amount)}</span>
                      </div>
                      <div className="info-item-detail">
                        <span className="info-label-detail">Status</span>
                        <span className="info-value-detail">
                          <StatusBadge status={comm.status} />
                        </span>
                      </div>
                      <div className="info-item-detail">
                        <span className="info-label-detail">Created At</span>
                        <span className="info-value-detail">
                          {new Date(comm.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approval/Rejection Info */}
          <div className="info-section">
            <h3>
              <span className="section-icon">{renderIcon('info')}</span>
              Status Information
            </h3>
            <div className="info-grid-detail">
              <div className="info-item-detail">
                <span className="info-label-detail">Current Status</span>
                <span className="info-value-detail">
                  {/* <StatusBadge status={investment.status} /> */}
                </span>
              </div>
              <div className="info-item-detail">
                <span className="info-label-detail">Payment Completed</span>
                <span className="info-value-detail">
                  {investment.payment_completed ? (
                    <span className="status-yes">{renderIcon('check')} Yes</span>
                  ) : (
                    <span className="status-no">{renderIcon('cancel')} No</span>
                  )}
                </span>
              </div>
              {investment.approved_at && (
                <>
                  <div className="info-item-detail">
                    <span className="info-label-detail">Approved At</span>
                    <span className="info-value-detail">
                      {new Date(investment.approved_at).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="info-item-detail">
                    <span className="info-label-detail">Approved By</span>
                    <span className="info-value-detail">
                      {investment.approved_by?.username || 'N/A'}
                    </span>
                  </div>
                </>
              )}
              {investment.payment_completed_at && (
                <div className="info-item-detail">
                  <span className="info-label-detail">Payment Completed At</span>
                  <span className="info-value-detail">
                    {new Date(investment.payment_completed_at).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              {investment.notes && (
                <div className="info-item-detail full-width">
                  <span className="info-label-detail">Notes</span>
                  <span className="info-value-detail">{investment.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Reason */}
          {investment.status === 'rejected' && investment.rejection_reason && (
            <div className="warning-section rejected">
              <h4>
                {renderIcon('reject')}
                Investment Rejected
              </h4>
              <p><strong>Reason:</strong> {investment.rejection_reason}</p>
            </div>
          )}

          {investment.status === 'cancelled' && investment.rejection_reason && (
            <div className="warning-section cancelled">
              <h4>
                {renderIcon('cancel')}
                Investment Cancelled
              </h4>
              <p><strong>Reason:</strong> {investment.rejection_reason}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Partial Payment Summary + Instalment History ── */}
      {investment.is_partial_payment && (
        <div className="detail-card instalment-card">
          <div className="card-header">
            <div className="card-header-left">
              <div>
                <h2>Partial Payment Details</h2>
                <p className="investment-date">Multiple instalments tracking</p>
              </div>
            </div>
            {parseFloat(investment.due_amount) > 0 && (
              <button
                className="btn-action-detail btn-add-payment"
                style={{ marginLeft: 'auto' }}
                onClick={() => setShowAddPaymentModal(true)}
              >
                + Add Instalment Payment
              </button>
            )}
          </div>

          <div className="card-content">
            {/* Summary row */}
            <div className="instalment-summary">
              <div className="instalment-summary-item">
                <span className="instalment-summary-label">Total Commitment</span>
                <span className="instalment-summary-value">{formatCurrency(investment.minimum_required_amount)}</span>
              </div>
              <div className="instalment-summary-item">
                <span className="instalment-summary-label">Total Paid</span>
                <span className="instalment-summary-value success">{formatCurrency(investment.amount)}</span>
              </div>
              <div className="instalment-summary-item">
                <span className="instalment-summary-label">Outstanding Due</span>
                <span className={`instalment-summary-value ${parseFloat(investment.due_amount) > 0 ? 'warning' : 'success'}`}>
                  {formatCurrency(investment.due_amount)}
                </span>
              </div>
              {investment.payment_due_date && (
                <div className="instalment-summary-item">
                  <span className="instalment-summary-label">Due Date</span>
                  <span className="instalment-summary-value">
                    {new Date(investment.payment_due_date).toLocaleDateString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Instalment #1 — the initial payment */}
            <h4 className="instalment-list-title">Payment History</h4>
            <div className="instalment-list">
              <div className="instalment-item">
                <div className="instalment-item-header">
                  <span className="instalment-num">Instalment #1 (Initial)</span>
                  <span className={`instalment-status-badge ${(investment.payment_status || 'PENDING').toLowerCase()}`}>
                    {investment.payment_status || 'PENDING'}
                  </span>
                </div>
                <div className="instalment-item-body">
                  <div className="instalment-row"><span>Amount</span><strong>{formatCurrency(investment.amount)}</strong></div>
                  <div className="instalment-row"><span>Method</span><span>{investment.payment_method_display || investment.payment_method || 'N/A'}</span></div>
                  <div className="instalment-row"><span>Date</span><span>{investment.payment_date ? new Date(investment.payment_date).toLocaleDateString('en-IN') : 'N/A'}</span></div>
                </div>
              </div>

              {/* Additional instalments */}
              {loadingPayments ? (
                <div className="instalment-loading">Loading instalment payments...</div>
              ) : instalmentPayments.length === 0 ? (
                <p className="instalment-empty">No additional instalment payments yet.</p>
              ) : (
                instalmentPayments.map((payment) => (
                  <div key={payment.id} className="instalment-item">
                    <div className="instalment-item-header">
                      <span className="instalment-num">Instalment #{payment.payment_number}</span>
                      <span className={`instalment-status-badge ${payment.payment_status.toLowerCase()}`}>
                        {payment.payment_status_display || payment.payment_status}
                      </span>
                    </div>

                    <div className="instalment-item-body">
                      <div className="instalment-row"><span>Amount</span><strong>{formatCurrency(payment.amount)}</strong></div>
                      <div className="instalment-row"><span>Method</span><span>{payment.payment_method_display || payment.payment_method || 'N/A'}</span></div>
                      <div className="instalment-row"><span>Payment Date</span><span>{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('en-IN') : 'N/A'}</span></div>
                      <div className="instalment-row"><span>Due Before</span><span>{formatCurrency(payment.due_amount_before)}</span></div>
                      <div className="instalment-row">
                        <span>Due After</span>
                        <strong style={{ color: parseFloat(payment.due_amount_after) === 0 ? '#10B981' : '#f59e0b' }}>
                          {formatCurrency(payment.due_amount_after)}
                        </strong>
                      </div>
                      {payment.payment_status === 'FAILED' && payment.payment_rejection_reason && (
                        <div className="instalment-rejection">Rejected: {payment.payment_rejection_reason}</div>
                      )}
                      {payment.payment_approved_at && (
                        <div className="instalment-row"><span>Processed At</span><span>{new Date(payment.payment_approved_at).toLocaleString('en-IN')}</span></div>
                      )}
                      {payment.approved_by_name && (
                        <div className="instalment-row"><span>Processed By</span><span>{payment.approved_by_name}</span></div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="instalment-item-actions">
                      {payment.payment_status === 'PENDING' && (
                        <>
                          <button
                            className="btn-instalment-approve"
                            onClick={() => handleApproveInstalment(payment.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn-instalment-reject"
                            onClick={() => handleOpenRejectModal(payment.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {payment.payment_status === 'VERIFIED' && (
                        <button
                          className="btn-instalment-receipt"
                          onClick={() => handleDownloadInstalmentReceipt(payment.id, payment.payment_id)}
                        >
                          Download Receipt
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ADD INSTALMENT PAYMENT MODAL ── */}
      {showAddPaymentModal && investment && (
        <div className="admin-modal-overlay" onClick={() => !submittingPayment && setShowAddPaymentModal(false)}>
          <div className="admin-modal-box add-payment-modal" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setShowAddPaymentModal(false)} disabled={submittingPayment}>×</button>

            <h2 className="admin-modal-title">Add Instalment Payment</h2>
            <p className="admin-modal-subtitle">
              {investment.property_details?.name || 'Investment'} &mdash; Outstanding: {formatCurrency(investment.due_amount)}
            </p>

            <div className="add-payment-form">
              <div className="apm-group">
                <label>Amount <span className="req">*</span></label>
                <input type="number" name="amount" value={addPaymentForm.amount}
                  onChange={handleAddPaymentFormChange}
                  placeholder={`Max ₹${parseFloat(investment.due_amount).toLocaleString('en-IN')}`}
                  max={parseFloat(investment.due_amount)} min="1" step="0.01" />
              </div>

              <div className="apm-group">
                <label>Payment Method <span className="req">*</span></label>
                <select name="payment_method" value={addPaymentForm.payment_method} onChange={handleAddPaymentFormChange}>
                  <option value="">Select method</option>
                  <option value="ONLINE">Online</option>
                  <option value="POS">POS</option>
                  <option value="DRAFT_CHEQUE">Draft / Cheque</option>
                  <option value="NEFT_RTGS">NEFT / RTGS</option>
                </select>
              </div>

              <div className="apm-group">
                <label>Payment Date <span className="req">*</span></label>
                <input type="datetime-local" name="payment_date" value={addPaymentForm.payment_date} onChange={handleAddPaymentFormChange} />
              </div>

              {/* ONLINE / POS */}
              {(addPaymentForm.payment_method === 'ONLINE' || addPaymentForm.payment_method === 'POS') && (
                <>
                  <div className="apm-group">
                    <label>Payment Mode (UPI / Card / NetBanking)</label>
                    <input type="text" name="payment_mode" value={addPaymentForm.payment_mode} onChange={handleAddPaymentFormChange} placeholder="e.g. UPI" />
                  </div>
                  <div className="apm-group">
                    <label>Transaction Number <span className="req">*</span></label>
                    <input type="text" name="transaction_no" value={addPaymentForm.transaction_no} onChange={handleAddPaymentFormChange} />
                  </div>
                  {addPaymentForm.payment_method === 'POS' && (
                    <div className="apm-group">
                      <label>POS Slip Image</label>
                      <input type="file" name="pos_slip_image" accept="image/*" onChange={handleAddPaymentFormChange} />
                    </div>
                  )}
                </>
              )}

              {/* DRAFT_CHEQUE */}
              {addPaymentForm.payment_method === 'DRAFT_CHEQUE' && (
                <>
                  <div className="apm-group">
                    <label>Cheque Number <span className="req">*</span></label>
                    <input type="text" name="cheque_number" value={addPaymentForm.cheque_number} onChange={handleAddPaymentFormChange} />
                  </div>
                  <div className="apm-group">
                    <label>Cheque Date <span className="req">*</span></label>
                    <input type="date" name="cheque_date" value={addPaymentForm.cheque_date} onChange={handleAddPaymentFormChange} />
                  </div>
                  <div className="apm-group">
                    <label>Bank Name <span className="req">*</span></label>
                    <input type="text" name="bank_name" value={addPaymentForm.bank_name} onChange={handleAddPaymentFormChange} />
                  </div>
                  <div className="apm-group">
                    <label>IFSC Code <span className="req">*</span></label>
                    <input type="text" name="ifsc_code" value={addPaymentForm.ifsc_code} onChange={handleAddPaymentFormChange} />
                  </div>
                  <div className="apm-group">
                    <label>Branch Name <span className="req">*</span></label>
                    <input type="text" name="branch_name" value={addPaymentForm.branch_name} onChange={handleAddPaymentFormChange} />
                  </div>
                  <div className="apm-group">
                    <label>Cheque Image</label>
                    <input type="file" name="cheque_image" accept="image/*" onChange={handleAddPaymentFormChange} />
                  </div>
                </>
              )}

              {/* NEFT_RTGS */}
              {addPaymentForm.payment_method === 'NEFT_RTGS' && (
                <>
                  <div className="apm-group">
                    <label>NEFT / RTGS Reference No. <span className="req">*</span></label>
                    <input type="text" name="neft_rtgs_ref_no" value={addPaymentForm.neft_rtgs_ref_no} onChange={handleAddPaymentFormChange} />
                  </div>
                  <div className="apm-group">
                    <label>Bank Name</label>
                    <input type="text" name="bank_name" value={addPaymentForm.bank_name} onChange={handleAddPaymentFormChange} />
                  </div>
                </>
              )}

              <div className="apm-group">
                <label>Notes</label>
                <textarea name="payment_notes" value={addPaymentForm.payment_notes} onChange={handleAddPaymentFormChange} rows="2" placeholder="Optional notes" />
              </div>
            </div>

            <div className="admin-modal-actions">
              <button className="admin-modal-cancel" onClick={() => setShowAddPaymentModal(false)} disabled={submittingPayment}>
                Cancel
              </button>
              <button className="admin-modal-confirm" onClick={handleSubmitAddPayment} disabled={submittingPayment}>
                {submittingPayment ? 'Adding...' : 'Add Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REJECT INSTALMENT MODAL ── */}
      {rejectModal.open && (
        <div className="admin-modal-overlay" onClick={() => !rejectingPayment && setRejectModal({ open: false, paymentId: null })}>
          <div className="admin-modal-box reject-payment-modal" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setRejectModal({ open: false, paymentId: null })} disabled={rejectingPayment}>×</button>
            <h2 className="admin-modal-title">Reject Payment</h2>
            <p className="admin-modal-subtitle">Please provide a reason for rejection.</p>
            <div className="apm-group" style={{ padding: '0 0 1rem' }}>
              <label>Rejection Reason <span className="req">*</span></label>
              <textarea
                rows="3"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                style={{ width: '100%', padding: '0.6rem 0.875rem', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>
            <div className="admin-modal-actions">
              <button className="admin-modal-cancel" onClick={() => setRejectModal({ open: false, paymentId: null })} disabled={rejectingPayment}>
                Cancel
              </button>
              <button className="admin-modal-confirm reject-confirm" onClick={handleConfirmReject} disabled={rejectingPayment}>
                {rejectingPayment ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ ...actionModal, isOpen: false })}
        onConfirm={handleInvestmentAction}
        title={actionModal.title}
        message={actionModal.message}
        requireReason={actionModal.requireReason}
        loading={actionLoading}
        confirmText={
          actionModal.action === 'soft_delete' ? 'Soft Delete' :
          actionModal.action === 'approve_payment' ? 'Approve Payment' :
          actionModal.action === 'reject_payment' ? 'Reject Payment' :
          actionModal.action === 'approve' ? 'Approve Investment' :
          actionModal.action === 'reject' ? 'Reject' :
          actionModal.action === 'complete' ? 'Mark Complete' :
          'Cancel Investment'
        }
        confirmColor={
          actionModal.action === 'soft_delete' ? '#dc3545' :
          actionModal.action === 'approve_payment' ? '#28a745' :
          actionModal.action === 'approve' ? '#28a745' :
          actionModal.action === 'reject_payment' ? '#dc3545' :
          actionModal.action === 'reject' ? '#dc3545' :
          actionModal.action === 'complete' ? '#28a745' :
          '#ff9800'
        }
      />
    </div>
  );
};

export default AdminInvestmentDetail;