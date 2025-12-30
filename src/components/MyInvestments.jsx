// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import investmentService from '../services/investmentService';
// import PropertyCard from '../components/PropertyCard';
// import '../styles/MyInvestments.css';

// const MyInvestments = () => {
//   const navigate = useNavigate();
//   const [investments, setInvestments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');

//   const tabs = [
//     { id: 'all', label: 'All Investments' },
//     { id: 'approved', label: 'Approved' },
//     { id: 'pending', label: 'Pending' },
//     { id: 'rejected', label: 'Rejected' }
//   ];

//   useEffect(() => {
//     fetchInvestments();
//   }, []);

// const fetchInvestments = async () => {
//   setLoading(true);
//   try {
//     const response = await investmentService.getMyInvestments(); // ← Changed from getUserInvestments
//     if (response.success) {
//       setInvestments(response.data);
//     }
//   } catch (error) {
//     toast.error('Failed to load investments');
//     console.error('Error:', error);
//   } finally {
//     setLoading(false);
//   }
// };

//   const filteredInvestments = investments.filter((investment) => {
//     const matchesTab = activeTab === 'all' || investment.status === activeTab;
//     const matchesSearch = searchQuery === '' || 
//       investment.property?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       investment.property?.builder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       investment.property?.city.toLowerCase().includes(searchQuery.toLowerCase());
    
//     return matchesTab && matchesSearch;
//   });

//   const handleExploreProperties = () => {
//     navigate('/properties');
//   };

//   return (
//     <div className="my-investments-page">
//       <div className="investments-container">
        
//         {/* Back Button */}
//         <button className="back-button" onClick={() => navigate(-1)}>
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//             <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//           Back
//         </button>

//         {/* Page Header */}
//         <div className="page-header">
//           <div>
//             <h1 className="page-title">My Investments</h1>
//             <p className="page-subtitle">Track and manage all your property investments</p>
//           </div>
//           <button className="btn-explore" onClick={handleExploreProperties}>
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//               <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//             Explore Properties
//           </button>
//         </div>

//         {/* Tabs */} 
//         <div className="investment-tabs">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               className={`investment-tab ${activeTab === tab.id ? 'active' : ''}`}
//               onClick={() => setActiveTab(tab.id)}
//             >
//               {tab.label}
//               <span className="tab-count">
//                 {tab.id === 'all' 
//                   ? investments.length 
//                   : investments.filter(inv => inv.status === tab.id).length}
//               </span>
//             </button>
//           ))}
//         </div>

//         {/* Search Bar */}
//         <div className="search-section">
//           <div className="search-input-wrapper">
//             <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
//               <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
//               <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//             </svg>
//             <input
//               type="text"
//               placeholder="Search by Properties, Builder's Name, Location"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input"
//             />
//           </div>
//           <button className="filter-btn">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//               <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//           </button>
//         </div>

//         {/* Investments List */}
//         <div className="investments-content">
//           {loading ? (
//             <div className="loading-state">
//               <div className="loading-spinner">Loading your investments...</div>
//             </div>
//           ) : filteredInvestments.length === 0 ? (
//             <div className="empty-state">
//               <svg className="empty-icon" width="80" height="80" viewBox="0 0 24 24" fill="none">
//                 <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                 <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                 <path d="M9 21V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//               <h3>{searchQuery ? 'No Investments Found' : 'No Investments Yet'}</h3>
//               <p>{searchQuery ? 'Try adjusting your search' : 'Start investing in properties to see them here'}</p>
//               {!searchQuery && (
//                 <button className="btn-explore-properties" onClick={handleExploreProperties}>
//                   Explore Properties
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="investments-grid">
//               {filteredInvestments.map((investment) => (
//                 <div key={investment.id} className="investment-card">
//                   <div className="investment-badge">
//                     <span className={`status-badge ${investment.status}`}>
//                       {investment.status}
//                     </span>
//                   </div>
//                   {investment.property && (
//                     <PropertyCard property={investment.property} />
//                   )}
//                   <div className="investment-details">
//                     <div className="detail-row">
//                       <span className="detail-label">Investment Amount:</span>
//                       <span className="detail-value">₹{parseFloat(investment.amount).toLocaleString('en-IN')}</span>
//                     </div>
//                     <div className="detail-row">
//                       <span className="detail-label">Shares Purchased:</span>
//                       <span className="detail-value">{investment.units_purchased}</span>
//                     </div>
//                     <div className="detail-row">
//                       <span className="detail-label">Investment Date:</span>
//                       <span className="detail-value">
//                         {new Date(investment.investment_date).toLocaleDateString('en-IN')}
//                       </span>
//                     </div>
//                     {/* {investment.expected_return_amount && (
//                       <div className="detail-row">
//                         <span className="detail-label">Expected Returns:</span>
//                         <span className="detail-value positive">
//                           ₹{parseFloat(investment.expected_return_amount).toLocaleString('en-IN')}
//                         </span>
//                       </div>
//                     )} */}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default MyInvestments;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import investmentService from '../services/investmentService';
// import PropertyCard from '../components/PropertyCard';
// import '../styles/MyInvestments.css';

// const MyInvestments = () => {
//   const navigate = useNavigate();
//   const [investments, setInvestments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // 🆕 Due Payment Modal State
//   const [showDuePaymentModal, setShowDuePaymentModal] = useState(false);
//   const [selectedInvestment, setSelectedInvestment] = useState(null);
//   const [processingPayment, setProcessingPayment] = useState(false);

//   const tabs = [
//     { id: 'all', label: 'All Investments' },
//     { id: 'approved', label: 'Approved' },
//     { id: 'pending', label: 'Pending' },
//     { id: 'rejected', label: 'Rejected' }
//   ];

//   useEffect(() => {
//     fetchInvestments();
//   }, []);

//   const fetchInvestments = async () => {
//     setLoading(true);
//     try {
//       const response = await investmentService.getMyInvestments();
//       if (response.success) {
//         setInvestments(response.data);
        
//         // 🆕 Check for overdue payments
//         const overdue = response.data.filter(inv => 
//           inv.is_partial_payment && 
//           inv.due_amount > 0 && 
//           getDaysRemaining(inv.payment_due_date) < 0
//         );
        
//         if (overdue.length > 0) {
//           toast.error(`⚠️ You have ${overdue.length} overdue payment(s)!`, {
//             duration: 5000,
//             icon: '🚨'
//           });
//         }
        
//         // 🆕 Check for payments due within 3 days
//         const dueSoon = response.data.filter(inv => {
//           const days = getDaysRemaining(inv.payment_due_date);
//           return inv.is_partial_payment && inv.due_amount > 0 && days >= 0 && days <= 3;
//         });
        
//         if (dueSoon.length > 0) {
//           toast.warning(`⏰ ${dueSoon.length} payment(s) due within 3 days!`, {
//             duration: 4000
//           });
//         }
//       }
//     } catch (error) {
//       toast.error('Failed to load investments');
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredInvestments = investments.filter((investment) => {
//     const matchesTab = activeTab === 'all' || investment.status === activeTab;
//     const matchesSearch = searchQuery === '' || 
//       investment.property?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       investment.property?.builder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       investment.property?.city.toLowerCase().includes(searchQuery.toLowerCase());
    
//     return matchesTab && matchesSearch;
//   });

//   const handleExploreProperties = () => {
//     navigate('/properties');
//   };

//   // 🆕 Calculate days remaining for due payment
//   const getDaysRemaining = (dueDate) => {
//     if (!dueDate) return null;
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diffTime = due - today;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   // 🆕 Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   // 🆕 Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // 🆕 Handle pay due button click
//   const handlePayDue = (investment) => {
//     setSelectedInvestment(investment);
//     setShowDuePaymentModal(true);
//   };

//   // 🆕 Handle payment submission
//   const handleSubmitDuePayment = async () => {
//     setProcessingPayment(true);
//     try {
//       // TODO: Implement actual payment flow
//       // This would redirect to payment gateway or open payment form
      
//       toast.success('Redirecting to payment...', {
//         duration: 2000
//       });
      
//       // For now, just log the action
//       console.log('Processing payment for:', selectedInvestment);
      
//       // In production, this would call:
//       // await investmentService.completePartialPayment(selectedInvestment.id, {...paymentData});
      
//       setTimeout(() => {
//         setShowDuePaymentModal(false);
//         setProcessingPayment(false);
//         // Refresh investments after payment
//         fetchInvestments();
//       }, 2000);
      
//     } catch (error) {
//       toast.error(error.message || 'Payment failed');
//       console.error('Payment error:', error);
//       setProcessingPayment(false);
//     }
//   };

//   return (
//     <div className="my-investments-page">
//       <div className="investments-container">
        
//         {/* Back Button */}
//         <button className="back-button" onClick={() => navigate(-1)}>
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//             <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//           Back
//         </button>

//         {/* Page Header */}
//         <div className="page-header">
//           <div>
//             <h1 className="page-title">My Investments</h1>
//             <p className="page-subtitle">Track and manage all your property investments</p>
//           </div>
//           <button className="btn-explore" onClick={handleExploreProperties}>
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//               <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//             Explore Properties
//           </button>
//         </div>

//         {/* Tabs */} 
//         <div className="investment-tabs">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               className={`investment-tab ${activeTab === tab.id ? 'active' : ''}`}
//               onClick={() => setActiveTab(tab.id)}
//             >
//               {tab.label}
//               <span className="tab-count">
//                 {tab.id === 'all' 
//                   ? investments.length 
//                   : investments.filter(inv => inv.status === tab.id).length}
//               </span>
//             </button>
//           ))}
//         </div>

//         {/* Search Bar */}
//         <div className="search-section">
//           <div className="search-input-wrapper">
//             <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
//               <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
//               <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//             </svg>
//             <input
//               type="text"
//               placeholder="Search by Properties, Builder's Name, Location"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input"
//             />
//           </div>
//           <button className="filter-btn">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//               <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//           </button>
//         </div>

//         {/* Investments List */}
//         <div className="investments-content">
//           {loading ? (
//             <div className="loading-state">
//               <div className="loading-spinner">Loading your investments...</div>
//             </div>
//           ) : filteredInvestments.length === 0 ? (
//             <div className="empty-state">
//               <svg className="empty-icon" width="80" height="80" viewBox="0 0 24 24" fill="none">
//                 <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                 <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                 <path d="M9 21V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//               <h3>{searchQuery ? 'No Investments Found' : 'No Investments Yet'}</h3>
//               <p>{searchQuery ? 'Try adjusting your search' : 'Start investing in properties to see them here'}</p>
//               {!searchQuery && (
//                 <button className="btn-explore-properties" onClick={handleExploreProperties}>
//                   Explore Properties
//                 </button>
//               )}
//             </div>
//           ) : (
//             <div className="investments-grid">
//               {filteredInvestments.map((investment) => {
//                 // 🆕 Calculate due payment status
//                 const daysRemaining = getDaysRemaining(investment.payment_due_date);
//                 const isOverdue = daysRemaining !== null && daysRemaining < 0;
//                 const isDueSoon = daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 7;
                
//                 return (
//                   <div key={investment.id} className="investment-card">
//                     <div className="investment-badge">
//                       <span className={`status-badge ${investment.status}`}>
//                         {investment.status}
//                       </span>
//                     </div>

//                     {/* 🆕 DUE PAYMENT ALERT */}
//                     {investment.is_partial_payment && investment.due_amount > 0 && (
//                       <div className={`due-payment-alert ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}`}>
//                         <div className="due-payment-header">
//                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                             <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
//                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                           </svg>
//                           <strong>
//                             {isOverdue ? '🚨 Payment Overdue!' : 
//                              isDueSoon ? '⏰ Payment Due Soon' : 
//                              '💳 Partial Payment'}
//                           </strong>
//                         </div>
                        
//                         <div className="due-payment-content">
//                           <div className="due-payment-row">
//                             <span>Amount Paid:</span>
//                             <strong>{formatCurrency(investment.amount)}</strong>
//                           </div>
//                           <div className="due-payment-row">
//                             <span>Due Amount:</span>
//                             <strong className={isOverdue ? 'overdue-amount' : 'due-amount'}>
//                               {formatCurrency(investment.due_amount)}
//                             </strong>
//                           </div>
//                           <div className="due-payment-row">
//                             <span>Due Date:</span>
//                             <strong>{formatDate(investment.payment_due_date)}</strong>
//                           </div>
//                           {daysRemaining !== null && (
//                             <div className="due-payment-row">
//                               <span>Status:</span>
//                               <strong className={
//                                 isOverdue ? 'status-overdue' : 
//                                 daysRemaining <= 3 ? 'status-urgent' : 
//                                 'status-pending'
//                               }>
//                                 {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : 
//                                  daysRemaining === 0 ? 'Due today!' :
//                                  `${daysRemaining} days left`}
//                               </strong>
//                             </div>
//                           )}
//                         </div>
                        
//                         <button 
//                           className="pay-due-button"
//                           onClick={() => handlePayDue(investment)}
//                         >
//                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                             <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                             <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                             <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                           </svg>
//                           Pay Now - {formatCurrency(investment.due_amount)}
//                         </button>
//                       </div>
//                     )}

//                     {investment.property && (
//                       <PropertyCard property={investment.property} />
//                     )}
                    
//                     <div className="investment-details">
//                       <div className="detail-row">
//                         <span className="detail-label">Investment Amount:</span>
//                         <span className="detail-value">
//                           ₹{parseFloat(investment.amount).toLocaleString('en-IN')}
//                         </span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">Shares Purchased:</span>
//                         <span className="detail-value">{investment.units_purchased}</span>
//                       </div>
//                       <div className="detail-row">
//                         <span className="detail-label">Investment Date:</span>
//                         <span className="detail-value">
//                           {formatDate(investment.investment_date)}
//                         </span>
//                       </div>
//                       {investment.is_partial_payment && (
//                         <div className="detail-row">
//                           <span className="detail-label">Total Investment:</span>
//                           <span className="detail-value">
//                             {formatCurrency(investment.minimum_required_amount)}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//       </div>

//       {/* 🆕 DUE PAYMENT MODAL */}
//       {showDuePaymentModal && selectedInvestment && (
//         <div className="modal-overlay" onClick={() => !processingPayment && setShowDuePaymentModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <button 
//               className="modal-close" 
//               onClick={() => !processingPayment && setShowDuePaymentModal(false)}
//               disabled={processingPayment}
//             >
//               ×
//             </button>
            
//             <div className="modal-header">
//               <h2 className="modal-title">Complete Payment</h2>
//               <p className="modal-subtitle">
//                 Pay the remaining amount to complete your investment
//               </p>
//             </div>

//             <div className="payment-summary">
//               <div className="summary-header">
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                   <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
//                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//                 <h3>{selectedInvestment.property?.name}</h3>
//               </div>
              
//               <div className="summary-details">
//                 <div className="summary-row">
//                   <span>Amount Already Paid:</span>
//                   <strong>{formatCurrency(selectedInvestment.amount)}</strong>
//                 </div>
//                 <div className="summary-row highlight">
//                   <span>Due Amount:</span>
//                   <strong className="due-amount-large">
//                     {formatCurrency(selectedInvestment.due_amount)}
//                   </strong>
//                 </div>
//                 <div className="summary-row">
//                   <span>Due Date:</span>
//                   <strong>{formatDate(selectedInvestment.payment_due_date)}</strong>
//                 </div>
//                 <div className="summary-divider"></div>
//                 <div className="summary-row total">
//                   <span>Total Investment:</span>
//                   <strong>{formatCurrency(selectedInvestment.minimum_required_amount)}</strong>
//                 </div>
//               </div>

//               {getDaysRemaining(selectedInvestment.payment_due_date) < 0 && (
//                 <div className="overdue-notice">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                     <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
//                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                   <span>
//                     This payment is overdue by {Math.abs(getDaysRemaining(selectedInvestment.payment_due_date))} days
//                   </span>
//                 </div>
//               )}
//             </div>

//             <div className="modal-actions">
//               <button 
//                 className="btn-cancel" 
//                 onClick={() => setShowDuePaymentModal(false)}
//                 disabled={processingPayment}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="btn-confirm"
//                 onClick={handleSubmitDuePayment}
//                 disabled={processingPayment}
//               >
//                 {processingPayment ? (
//                   <>
//                     <span className="spinner"></span>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                       <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
//                       <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
//                     </svg>
//                     Proceed to Payment
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyInvestments;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import investmentService from '../services/investmentService';
import PropertyCard from '../components/PropertyCard';
import '../styles/MyInvestments.css';

const MyInvestments = () => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Due Payment Modal State
  const [showDuePaymentModal, setShowDuePaymentModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Receipt Modal State
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const tabs = [
    { id: 'all', label: 'All Investments' },
    { id: 'approved', label: 'Approved' },
    { id: 'pending', label: 'Pending' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'receipts', label: 'Transactions' },
  ];

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const response = await investmentService.getMyInvestments();
      if (response.success) {
        setInvestments(response.data);
        
        // Check for overdue payments
        const overdue = response.data.filter(inv => 
          inv.is_partial_payment && 
          inv.due_amount > 0 && 
          getDaysRemaining(inv.payment_due_date) < 0
        );
        
        if (overdue.length > 0) {
          toast.error(`⚠️ You have ${overdue.length} overdue payment(s)!`, {
            duration: 5000,
            icon: '🚨'
          });
        }
        
        // Check for payments due within 3 days
        const dueSoon = response.data.filter(inv => {
          const days = getDaysRemaining(inv.payment_due_date);
          return inv.is_partial_payment && inv.due_amount > 0 && days >= 0 && days <= 3;
        });
        
        if (dueSoon.length > 0) {
          toast.warning(`⏰ ${dueSoon.length} payment(s) due within 3 days!`, {
            duration: 4000
          });
        }
      }

      // Fetch receipts
      try {
        const receiptsResponse = await investmentService.getInvestmentReceipts();
        if (receiptsResponse.success) {
          setReceipts(receiptsResponse.data);
        }
      } catch (receiptError) {
        console.error('Failed to fetch receipts:', receiptError);
      }

    } catch (error) {
      toast.error('Failed to load investments');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvestments = activeTab === 'receipts' 
    ? receipts.filter((receipt) => {
        if (searchQuery === '') return true;
        return (
          receipt.property?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          receipt.property?.builder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          receipt.property?.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          receipt.receipt_number?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : investments.filter((investment) => {
        const matchesTab = activeTab === 'all' || investment.status === activeTab;
        const matchesSearch = searchQuery === '' || 
          investment.property?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          investment.property?.builder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          investment.property?.city.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesTab && matchesSearch;
      });

  const handleExploreProperties = () => {
    navigate('/properties');
  };

  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePayDue = (investment) => {
    setSelectedInvestment(investment);
    setShowDuePaymentModal(true);
  };

  const handleSubmitDuePayment = async () => {
    setProcessingPayment(true);
    try {
      toast.success('Redirecting to payment...', {
        duration: 2000
      });
      
      console.log('Processing payment for:', selectedInvestment);
      
      setTimeout(() => {
        setShowDuePaymentModal(false);
        setProcessingPayment(false);
        fetchInvestments();
      }, 2000);
      
    } catch (error) {
      toast.error(error.message || 'Payment failed');
      console.error('Payment error:', error);
      setProcessingPayment(false);
    }
  };

  const handleDownloadReceipt = async (receipt) => {
    try {
      toast.loading('Generating receipt...', { id: 'download-receipt' });
      
      const response = await investmentService.downloadReceipt(receipt.id);
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${receipt.receipt_number || receipt.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Receipt downloaded successfully', { id: 'download-receipt' });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download receipt', { id: 'download-receipt' });
    }
  };

  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
  };

  return (
    <div className="my-investments-page">
      <div className="investments-container">
        
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">My Investments</h1>
            <p className="page-subtitle">Track and manage all your property investments</p>
          </div>
          <button className="btn-explore" onClick={handleExploreProperties}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Explore Properties
          </button>
        </div>

        {/* Tabs */} 
        <div className="investment-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`investment-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span className="tab-count">
                {tab.id === 'all' 
                  ? investments.length 
                  : tab.id === 'receipts'
                  ? receipts.length
                  : investments.filter(inv => inv.status === tab.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder={activeTab === 'receipts' ? "Search receipts..." : "Search by Properties, Builder's Name, Location"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="filter-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="investments-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner">Loading your {activeTab === 'receipts' ? 'receipts' : 'investments'}...</div>
            </div>
          ) : filteredInvestments.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" width="80" height="80" viewBox="0 0 24 24" fill="none">
                <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 21V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3>{searchQuery ? `No ${activeTab === 'receipts' ? 'Receipts' : 'Investments'} Found` : activeTab === 'receipts' ? 'No Receipts Yet' : 'No Investments Yet'}</h3>
              <p>{searchQuery ? 'Try adjusting your search' : activeTab === 'receipts' ? 'Receipts will appear here after investments are approved' : 'Start investing in properties to see them here'}</p>
              {!searchQuery && activeTab !== 'receipts' && (
                <button className="btn-explore-properties" onClick={handleExploreProperties}>
                  Explore Properties
                </button>
              )}
            </div>
          ) : (
            <div className="investments-grid">
              {activeTab === 'receipts' ? (
                // RECEIPTS VIEW
                filteredInvestments.map((receipt) => (
                  <div key={receipt.id} className="receipt-card">
                    <div className="receipt-header">
                      <div className="receipt-number">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Receipt #{receipt.receipt_number || receipt.id}
                      </div>
                      <span className="receipt-date">{formatDate(receipt.created_at || receipt.investment_date)}</span>
                    </div>

                    {receipt.property && (
                      <div className="receipt-property">
                        <h4>{receipt.property.name}</h4>
                        <p>{receipt.property.city}, {receipt.property.state}</p>
                      </div>
                    )}

                    <div className="receipt-details">
                      {/* Total Investment (if partial) */}
                      {receipt.is_partial_payment && (
                        <div className="detail-row">
                          <span className="detail-label">Total Investment:</span>
                          <span className="detail-value detail-value-bold">
                            {formatCurrency(receipt.minimum_required_amount || receipt.amount)}
                          </span>
                        </div>
                      )}
                      
                      {/* Amount Paid */}
                      <div className="detail-row">
                        <span className="detail-label">Amount Paid:</span>
                        <span className="detail-value detail-value-success">
                          {formatCurrency(receipt.amount)}
                        </span>
                      </div>
                      
                      {/* Partial Payment Info */}
                      {receipt.is_partial_payment && (
                        <>
                          <div className="detail-row">
                            <span className="detail-label">Due Amount:</span>
                            <span className={`detail-value ${receipt.due_amount > 0 ? 'detail-value-warning' : 'detail-value-success'}`}>
                              {formatCurrency(receipt.due_amount || 0)}
                            </span>
                          </div>
                          
                          {receipt.payment_due_date && (
                            <div className="detail-row">
                              <span className="detail-label">Due Date:</span>
                              <span className={`detail-value ${getDaysRemaining(receipt.payment_due_date) < 0 ? 'detail-value-danger' : ''}`}>
                                {formatDate(receipt.payment_due_date)}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Other Details */}
                      <div className="detail-row">
                        <span className="detail-label">Shares Purchased:</span>
                        <span className="detail-value">{receipt.units_purchased}</span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">Payment Method:</span>
                        <span className="detail-value">{receipt.payment_method_display || receipt.payment_method || 'Online'}</span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">Transaction ID:</span>
                        <span className="detail-value">{receipt.transaction_id || 'N/A'}</span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <span className={`status-badge ${receipt.status}`}>
                          {receipt.status}
                        </span>
                      </div>
                    </div>

                    <div className="receipt-actions">
                      <button 
                        className="btn-download-receipt"
                        onClick={() => handleDownloadReceipt(receipt)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M21 15V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V16" 
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Download PDF
                      </button>
                      <button 
                        className="btn-view-receipt"
                        onClick={() => handleViewReceipt(receipt)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                // INVESTMENTS VIEW
                filteredInvestments.map((investment) => {
                  const daysRemaining = getDaysRemaining(investment.payment_due_date);
                  const isOverdue = daysRemaining !== null && daysRemaining < 0;
                  const isDueSoon = daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 7;
                  
                  return (
                    <div key={investment.id} className="investment-card">
                      <div className="investment-badge">
                        <span className={`status-badge ${investment.status}`}>
                          {investment.status}
                        </span>
                      </div>

                      {/* DUE PAYMENT ALERT */}
                      {investment.is_partial_payment && investment.due_amount > 0 && (
                        <div className={`due-payment-alert ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}`}>
                          <div className="due-payment-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <strong>
                              {isOverdue ? '🚨 Payment Overdue!' : 
                               isDueSoon ? '⏰ Payment Due Soon' : 
                               '💳 Partial Payment'}
                            </strong>
                          </div>
                          
                          <div className="due-payment-content">
                            <div className="due-payment-row">
                              <span>Amount Paid:</span>
                              <strong>{formatCurrency(investment.amount)}</strong>
                            </div>
                            <div className="due-payment-row">
                              <span>Due Amount:</span>
                              <strong className={isOverdue ? 'overdue-amount' : 'due-amount'}>
                                {formatCurrency(investment.due_amount)}
                              </strong>
                            </div>
                            <div className="due-payment-row">
                              <span>Due Date:</span>
                              <strong>{formatDate(investment.payment_due_date)}</strong>
                            </div>
                            {daysRemaining !== null && (
                              <div className="due-payment-row">
                                <span>Status:</span>
                                <strong className={
                                  isOverdue ? 'status-overdue' : 
                                  daysRemaining <= 3 ? 'status-urgent' : 
                                  'status-pending'
                                }>
                                  {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : 
                                   daysRemaining === 0 ? 'Due today!' :
                                   `${daysRemaining} days left`}
                                </strong>
                              </div>
                            )}
                          </div>
                          
                          <button 
                            className="pay-due-button"
                            onClick={() => handlePayDue(investment)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Pay Now - {formatCurrency(investment.due_amount)}
                          </button>
                        </div>
                      )}

                      {investment.property && (
                        <PropertyCard property={investment.property} />
                      )}
                      
                      <div className="investment-details">
  {/* 🔥 ALWAYS SHOW TOTAL INVESTMENT if it exists and differs from paid amount */}
  {investment.is_partial_payment && investment.minimum_required_amount && (
    <div className="detail-row">
      <span className="detail-label">Total Investment:</span>
      <span className="detail-value detail-value-bold">
        ₹{parseFloat(investment.minimum_required_amount).toLocaleString('en-IN')}
      </span>
    </div>
  )}
  
  {/* PAID AMOUNT - Always show */}
  <div className="detail-row">
    <span className="detail-label">
      {investment.is_partial_payment ? 'Paid Amount:' : 'Investment Amount:'}
    </span>
    <span className="detail-value detail-value-success">
      ₹{parseFloat(investment.amount).toLocaleString('en-IN')}
    </span>
  </div>
  
  {/* DUE AMOUNT - Only show if partial payment */}
  {investment.is_partial_payment && investment.due_amount > 0 && (
    <div className="detail-row">
      <span className="detail-label">Due Amount:</span>
      <span className="detail-value detail-value-warning">
        ₹{parseFloat(investment.due_amount).toLocaleString('en-IN')}
      </span>
    </div>
  )}
  
  {/* SHARES PURCHASED */}
  <div className="detail-row">
    <span className="detail-label">Shares Purchased:</span>
    <span className="detail-value">{investment.units_purchased}</span>
  </div>
  
  {/* INVESTMENT DATE */}
  <div className="detail-row">
    <span className="detail-label">Investment Date:</span>
    <span className="detail-value">
      {formatDate(investment.investment_date)}
    </span>
  </div>
  
  {/* DUE DATE - Only show if partial payment */}
  {investment.is_partial_payment && investment.payment_due_date && (
    <div className="detail-row">
      <span className="detail-label">Payment Due Date:</span>
      <span className={`detail-value ${getDaysRemaining(investment.payment_due_date) < 0 ? 'detail-value-danger' : ''}`}>
        {formatDate(investment.payment_due_date)}
      </span>
    </div>
  )}
</div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

      </div>

      {/* DUE PAYMENT MODAL */}
      {showDuePaymentModal && selectedInvestment && (
        <div className="modal-overlay" onClick={() => !processingPayment && setShowDuePaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => !processingPayment && setShowDuePaymentModal(false)}
              disabled={processingPayment}
            >
              ×
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">Complete Payment</h2>
              <p className="modal-subtitle">
                Pay the remaining amount to complete your investment
              </p>
            </div>

            <div className="payment-summary">
              <div className="summary-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>{selectedInvestment.property?.name}</h3>
              </div>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Amount Already Paid:</span>
                  <strong>{formatCurrency(selectedInvestment.amount)}</strong>
                </div>
                <div className="summary-row highlight">
                  <span>Due Amount:</span>
                  <strong className="due-amount-large">
                    {formatCurrency(selectedInvestment.due_amount)}
                  </strong>
                </div>
                <div className="summary-row">
                  <span>Due Date:</span>
                  <strong>{formatDate(selectedInvestment.payment_due_date)}</strong>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total Investment:</span>
                  <strong>{formatCurrency(selectedInvestment.minimum_required_amount)}</strong>
                </div>
              </div>

              {getDaysRemaining(selectedInvestment.payment_due_date) < 0 && (
                <div className="overdue-notice">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>
                    This payment is overdue by {Math.abs(getDaysRemaining(selectedInvestment.payment_due_date))} days
                  </span>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setShowDuePaymentModal(false)}
                disabled={processingPayment}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm"
                onClick={handleSubmitDuePayment}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Proceed to Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 RECEIPT DETAILS MODAL */}
      {showReceiptModal && selectedReceipt && (
        <div className="modal-overlay" onClick={() => setShowReceiptModal(false)}>
          <div className="modal-content receipt-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => setShowReceiptModal(false)}
            >
              ×
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">Receipt Details</h2>
              <p className="modal-subtitle">
                Receipt #{selectedReceipt.receipt_number || selectedReceipt.id}
              </p>
            </div>

            <div className="receipt-detail-content">
              {selectedReceipt.property && (
                <div className="receipt-property-info">
                  <h3>{selectedReceipt.property.name}</h3>
                  <p>{selectedReceipt.property.city}, {selectedReceipt.property.state}</p>
                </div>
              )}

          <div className="receipt-info-grid">
  {/* 🆕 Total Investment (if partial) */}
  {selectedReceipt.is_partial_payment && (
    <div className="receipt-info-item">
      <span className="info-label">Total Investment</span>
      <span className="info-value">
        {formatCurrency(selectedReceipt.minimum_required_amount || selectedReceipt.amount)}
      </span>
    </div>
  )}
  
  <div className="receipt-info-item">
    <span className="info-label">Amount Paid</span>
    <span className="info-value" style={{ color: '#10B981', fontWeight: 'bold' }}>
      {formatCurrency(selectedReceipt.amount)}
    </span>
  </div>

  {/* 🆕 Due Amount (if partial) */}
  {selectedReceipt.is_partial_payment && (
    <>
      <div className="receipt-info-item">
        <span className="info-label">Due Amount</span>
        <span className="info-value" style={{ 
          color: selectedReceipt.due_amount > 0 ? '#f59e0b' : '#10B981',
          fontWeight: 'bold'
        }}>
          {formatCurrency(selectedReceipt.due_amount || 0)}
        </span>
      </div>
      
      {selectedReceipt.payment_due_date && (
        <div className="receipt-info-item">
          <span className="info-label">Payment Due Date</span>
          <span className="info-value" style={{
            color: getDaysRemaining(selectedReceipt.payment_due_date) < 0 ? '#ef4444' : '#6b7280'
          }}>
            {formatDate(selectedReceipt.payment_due_date)}
          </span>
        </div>
      )}
    </>
  )}


                <div className="receipt-info-item">
                  <span className="info-label">Shares Purchased</span>
                  <span className="info-value">{selectedReceipt.units_purchased}</span>
                </div>
                <div className="receipt-info-item">
                  <span className="info-label">Investment Date</span>
                  <span className="info-value">{formatDate(selectedReceipt.investment_date || selectedReceipt.created_at)}</span>
                </div>
                <div className="receipt-info-item">
                  <span className="info-label">Payment Method</span>
                  <span className="info-value">{selectedReceipt.payment_method || 'Online'}</span>
                </div>
                <div className="receipt-info-item">
                  <span className="info-label">Transaction ID</span>
                  <span className="info-value">{selectedReceipt.transaction_id || 'N/A'}</span>
                </div>
                <div className="receipt-info-item">
                  <span className="info-label">Status</span>
                  <span className={`status-badge ${selectedReceipt.status}`}>
                    {selectedReceipt.status}
                  </span>
                </div> 
              </div>

              <div className="receipt-modal-actions">
                <button 
                  className="btn-download-receipt"
                  onClick={() => handleDownloadReceipt(selectedReceipt)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V16" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download PDF
                </button>
                <button 
                  className="btn-view-receipt"
                  onClick={() => setShowReceiptModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInvestments;