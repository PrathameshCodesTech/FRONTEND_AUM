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
  
  // Action modal
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    action: null,
    title: '',
    message: '',
    requireReason: false
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchInvestmentDetail();
  }, [investmentId]);

  const fetchInvestmentDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await adminService.getInvestmentDetail(investmentId);
      
      console.log('📦 Investment Detail Response:', response);
      
      if (response.success) {
        setInvestment(response.data);
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
      const response = await adminService.investmentAction(
        investmentId,
        actionModal.action,
        reason
      );

      if (response.success) {
        toast.success(response.message);
        setInvestment(response.data);
        setActionModal({ ...actionModal, isOpen: false });
      }
    } catch (error) {
      toast.error(error.message || 'Action failed');
    } finally {
      setActionLoading(false);
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

          {canCancel && (
            <button 
              className="btn-action-detail btn-cancel" 
              onClick={() => openActionModal('cancel')}
            >
              {renderIcon('cancel')}
              Cancel Investment
            </button>
          )}
        </div>
      </div>

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
          actionModal.action === 'approve_payment' ? 'Approve Payment' :
          actionModal.action === 'reject_payment' ? 'Reject Payment' :
          actionModal.action === 'approve' ? 'Approve Investment' :
          actionModal.action === 'reject' ? 'Reject' :
          actionModal.action === 'complete' ? 'Mark Complete' :
          'Cancel Investment'
        }
        confirmColor={
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