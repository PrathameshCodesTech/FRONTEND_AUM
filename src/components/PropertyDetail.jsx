import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import propertyService from '../services/propertyService';
import investmentService from '../services/investmentService';
import PropertyMap from '../components/PropertyMap'

import '../styles/PropertyDetail.css';

const PropertyDetail = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [unitsCount, setUnitsCount] = useState(1);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investing, setInvesting] = useState(false);
  const [expectedEarnings, setExpectedEarnings] = useState(null);
  const [earningsAmount, setEarningsAmount] = useState(500000);
  const [loadingEarnings, setLoadingEarnings] = useState(false);

  const [referralCode, setReferralCode] = useState('');
  const [validatingCode, setValidatingCode] = useState(false);
  const [codeValidation, setCodeValidation] = useState(null);
  const [userCPRelation, setUserCPRelation] = useState(null);
  const [checkingCPRelation, setCheckingCPRelation] = useState(true);

  // 🆕 PAYMENT STATE VARIABLES
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [transactionNo, setTransactionNo] = useState('');
  const [posSlipImage, setPosSlipImage] = useState(null);
  const [posSlipPreview, setPosSlipPreview] = useState(null);
  
  const [chequeNumber, setChequeNumber] = useState('');
  const [chequeDate, setChequeDate] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [branchName, setBranchName] = useState('');
  const [chequeImage, setChequeImage] = useState(null);
  const [chequeImagePreview, setChequeImagePreview] = useState(null);
  
  const [neftRtgsRefNo, setNeftRtgsRefNo] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  const [paidAmount, setPaidAmount] = useState('');
  const [paymentDueDate, setPaymentDueDate] = useState(''); // 🆕 ADD THIS
  const [isPartialPayment, setIsPartialPayment] = useState(false); // 🆕 ADD THIS


  // Check if user has CP relation
  useEffect(() => {
    if (isAuthenticated) {
      checkUserCPRelation();
    }
  }, [isAuthenticated]);

  const checkUserCPRelation = async () => {
    try {
      const response = await investmentService.checkCPRelation();
      if (response.success && response.has_cp_relation) {
        setUserCPRelation(response.cp_details);
        toast.info(`You're linked to ${response.cp_details.cp_name} (${response.cp_details.cp_code})`);
      }
    } catch (error) {
      console.error('Error checking CP relation:', error);
    } finally {
      setCheckingCPRelation(false);
    }
  };

  useEffect(() => {
    fetchPropertyDetail();
  }, [propertyId]);

  useEffect(() => {
    if (activeTab === 'earnings' && !expectedEarnings) {
      fetchExpectedEarnings(earningsAmount);
    }
  }, [activeTab]);

  // ============================================
// 🆕 ADD THIS useEffect TO AUTO-SYNC PAID AMOUNT
// ============================================

useEffect(() => {
  // Auto-set paid amount to match investment amount (full payment by default)
  if (investmentAmount && !paidAmount) {
    setPaidAmount(investmentAmount);
  }
}, [investmentAmount]);

// ============================================
// 🆕 ADD THIS useEffect TO DETECT PARTIAL PAYMENT
// ============================================

useEffect(() => {
  if (investmentAmount && paidAmount) {
    const investment = parseFloat(investmentAmount);
    const paid = parseFloat(paidAmount);
    const isPartial = paid < investment && paid > 0;
    setIsPartialPayment(isPartial);
    
    // Auto-set due date to 30 days from now if partial
    if (isPartial && !paymentDueDate) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      setPaymentDueDate(dueDate.toISOString().split('T')[0]);
    }
  }
}, [investmentAmount, paidAmount]);

  const fetchPropertyDetail = async () => {
    setLoading(true);
    try {
      const response = await propertyService.getPropertyDetail(propertyId);
      if (response.success) {
        setProperty(response.data);
        const pricePerUnit = parseFloat(response.data.price_per_unit);
        setInvestmentAmount(pricePerUnit * 1);
        setUnitsCount(1);
      }
    } catch (error) {
      toast.error('Failed to load property details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpressInterest = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to express interest');
      navigate('/login');
      return;
    }

    try {
      const response = await propertyService.expressInterest(propertyId, 1);
      if (response.success) {
        toast.success(response.message);
        setShowInterestModal(false);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to express interest');
    }
  };

  const handleInvestNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to invest');
      navigate('/login');
      return;
    }
    setShowInvestModal(true);
  };

  // 🆕 HANDLE FILE UPLOADS
  const handlePosSlipChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosSlipImage(file);
      setPosSlipPreview(URL.createObjectURL(file));
    }
  };

  const handleChequeImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChequeImage(file);
      setChequeImagePreview(URL.createObjectURL(file));
    }
  };

  // 🆕 UPDATED INVESTMENT SUBMIT WITH PAYMENT
  // const handleInvestmentSubmit = async () => {

  //    // ✅ FIX: Parse and validate amount properly
  //  const currentAmount = parseFloat(investmentAmount);
  //    // 🆕 UPDATED: Only validate positive amount (no minimum check)
  // // if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
  // //   toast.error('Please enter a valid investment amount');
  // //   return;
  // // }
  //   if (!investmentAmount || isNaN(currentAmount) || currentAmount <= 0) {
  //   toast.error('Please enter a valid investment amount');
  //   return;
  // }

  //   // ✅ FIX: Parse property limits
  // const minInvestment = parseFloat(property.minimum_investment);
  // const maxInvestment = property.maximum_investment ? parseFloat(property.maximum_investment) : null;
  
  // // Check maximum limit first
  // if (maxInvestment && currentAmount > maxInvestment) {
  //   toast.error(`Maximum investment is ₹${maxInvestment.toLocaleString('en-IN')}`);
  //   return;
  // }

  //   // 🆕 SHOW WARNING if below minimum (but still allow)
  // // const minInvestment = parseFloat(property.minimum_investment);
  // // const currentAmount = parseFloat(investmentAmount);
  // const isPartialPayment = currentAmount < minInvestment;
  
  // if (isPartialPayment) {
  //   const dueAmount = minInvestment - currentAmount;
  //   const confirmPartial = window.confirm(
  //     `⚠️ Partial Payment Notice\n\n` +
  //     `Minimum investment: ₹${minInvestment.toLocaleString('en-IN')}\n` +
  //     `Your amount: ₹${currentAmount.toLocaleString('en-IN')}\n` +
  //     `Due amount: ₹${dueAmount.toLocaleString('en-IN')}\n\n` +
  //     `You'll need to pay the remaining amount within 30 days.\n\n` +
  //     `Do you want to continue?`
  //   );
    
  //   if (!confirmPartial) {
  //     return;
  //   }
  // }

  //   // 🆕 VALIDATE PAYMENT METHOD FIELDS
  //   if (paymentMethod === 'ONLINE' || paymentMethod === 'POS') {
  //     if (!transactionNo.trim()) {
  //       toast.error('Transaction number is required');
  //       return;
  //     }
  //   }

  //   if (paymentMethod === 'DRAFT_CHEQUE') {
  //     if (!chequeNumber.trim() || !chequeDate || !bankName.trim() || !ifscCode.trim() || !branchName.trim()) {
  //       toast.error('Please fill all cheque details');
  //       return;
  //     }
  //   }

  //   if (paymentMethod === 'NEFT_RTGS') {
  //     if (!neftRtgsRefNo.trim()) {
  //       toast.error('NEFT/RTGS reference number is required');
  //       return;
  //     }
  //   }

  //   setInvesting(true);
  //   try {
  //     // 🆕 CREATE FORMDATA FOR FILE UPLOADS
  //     const formData = new FormData();
  //     formData.append('property_id', property.id);
  //     // formData.append('amount', investmentAmount);
  //     formData.append('amount', currentAmount.toFixed(2)); // ✅ Format to 2 decimals
  //     formData.append('units_count', unitsCount);
      
  //     // Payment details
  //     formData.append('payment_method', paymentMethod);
  //     formData.append('payment_date', new Date().toISOString());
  //     formData.append('payment_notes', paymentNotes);

  //     // Add method-specific fields
  //     if (paymentMethod === 'ONLINE' || paymentMethod === 'POS') {
  //       formData.append('payment_mode', paymentMode);
  //       formData.append('transaction_no', transactionNo);
  //       if (posSlipImage) {
  //         formData.append('pos_slip_image', posSlipImage);
  //       }
  //     }

  //     if (paymentMethod === 'DRAFT_CHEQUE') {
  //       formData.append('cheque_number', chequeNumber);
  //       formData.append('cheque_date', chequeDate);
  //       formData.append('bank_name', bankName);
  //       formData.append('ifsc_code', ifscCode);
  //       formData.append('branch_name', branchName);
  //       if (chequeImage) {
  //         formData.append('cheque_image', chequeImage);
  //       }
  //     }

  //     if (paymentMethod === 'NEFT_RTGS') {
  //       formData.append('neft_rtgs_ref_no', neftRtgsRefNo);
  //     }

  //     // ✅ KEEP: Referral code logic (unchanged)
  //     const referralCodeToSend = referralCode.trim() || undefined;
  //     if (referralCodeToSend) {
  //       formData.append('referral_code', referralCodeToSend);
  //     }

  //     console.log('🔍 Submitting investment with payment...');

  //         const response = await investmentService.createInvestmentWithPayment(formData);
    
  //   if (response.success) {
  //     // 🆕 SHOW DIFFERENT MESSAGE for partial payment
  //     if (isPartialPayment) {
  //       toast.success('Partial payment submitted! Complete remaining payment within 30 days.', {
  //         duration: 5000
  //       });
  //     } else {
  //       toast.success(response.message || 'Investment submitted successfully!');
  //     }
      
  //     setShowInvestModal(false);
      
  //     setTimeout(() => {
  //       navigate('/dashboard');
  //     }, 1500);
  //   }
  // } catch (error) {
  //   console.error('Investment error:', error);
  //   toast.error(error.message || 'Failed to create investment');
  // } finally {
  //   setInvesting(false);
  //   }
  // };

  const handleInvestmentSubmit = async () => {

  // ================================
  // 1️⃣ PARSE & BASIC VALIDATIONS
  // ================================
  const currentAmount = parseFloat(investmentAmount);
  const paid = parseFloat(paidAmount);

  if (!investmentAmount || isNaN(currentAmount) || currentAmount <= 0) {
    toast.error('Please enter a valid investment amount');
    return;
  }

  if (!paidAmount || isNaN(paid) || paid <= 0) {
    toast.error('Please enter a valid paid amount');
    return;
  }

  if (paid > currentAmount) {
    toast.error('Paid amount cannot be greater than investment amount');
    return;
  }

  // ================================
  // 2️⃣ PROPERTY LIMIT VALIDATIONS
  // ================================
  const minInvestment = parseFloat(property.minimum_investment);
  const maxInvestment = property.maximum_investment
    ? parseFloat(property.maximum_investment)
    : null;

  if (maxInvestment && currentAmount > maxInvestment) {
    toast.error(`Maximum investment is ₹${maxInvestment.toLocaleString('en-IN')}`);
    return;
  }

  // ================================
  // 3️⃣ PARTIAL PAYMENT CHECK
  // ================================
   const isPartial = paid < currentAmount;
  const dueAmount = currentAmount - paid;

    // 🆕 VALIDATE DUE DATE FOR PARTIAL PAYMENTS
  if (isPartial && !paymentDueDate) {
    toast.error('Payment due date is required for partial payments');
    return;
  }

  // 🆕 VALIDATE DUE DATE IS IN THE FUTURE
  if (isPartial && paymentDueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(paymentDueDate);
    
    if (dueDate <= today) {
      toast.error('Payment due date must be in the future');
      return;
    }
  }


  if (isPartial) {
    const confirmPartial = window.confirm(
        `⚠️ Partial Payment Notice\n\n` +
      `Investment amount: ₹${currentAmount.toLocaleString('en-IN')}\n` +
      `Paid amount: ₹${paid.toLocaleString('en-IN')}\n` +
      `Due amount: ₹${dueAmount.toLocaleString('en-IN')}\n` +
      `Due date: ${new Date(paymentDueDate).toLocaleDateString('en-IN')}\n\n` +
      `You'll need to pay the remaining amount by the due date.\n\n` +
      `Do you want to continue?`
    );

    if (!confirmPartial) {
      return;
    }
  }

  // ================================
  // 4️⃣ PAYMENT METHOD VALIDATION
  // ================================
  if (paymentMethod === 'ONLINE' || paymentMethod === 'POS') {
    if (!transactionNo.trim()) {
      toast.error('Transaction number is required');
      return;
    }
  }

  if (paymentMethod === 'DRAFT_CHEQUE') {
    if (
      !chequeNumber.trim() ||
      !chequeDate ||
      !bankName.trim() ||
      !ifscCode.trim() ||
      !branchName.trim()
    ) {
      toast.error('Please fill all cheque details');
      return;
    }
  }

  if (paymentMethod === 'NEFT_RTGS') {
    if (!neftRtgsRefNo.trim()) {
      toast.error('NEFT/RTGS reference number is required');
      return;
    }
  }

  // ================================
  // 5️⃣ SUBMIT INVESTMENT
  // ================================
  setInvesting(true);

  try {
    const formData = new FormData();

    // Core investment data
    formData.append('property_id', property.id);
    formData.append('amount', currentAmount.toFixed(2));
    formData.append('paid_amount', paid.toFixed(2)); // 🆕 PAID AMOUNT
    formData.append('units_count', unitsCount);

      // 🆕 PARTIAL PAYMENT FIELDS
    if (isPartial) {
      formData.append('commitment_amount', currentAmount.toFixed(2)); // ✅ Total commitment
      formData.append('payment_due_date', paymentDueDate); // ✅ Due date
    }

    // Payment common fields
    formData.append('payment_method', paymentMethod);
    formData.append('payment_date', new Date().toISOString());
    formData.append('payment_notes', paymentNotes);

    // ONLINE / POS
    if (paymentMethod === 'ONLINE' || paymentMethod === 'POS') {
      formData.append('payment_mode', paymentMode);
      formData.append('transaction_no', transactionNo);
      if (posSlipImage) {
        formData.append('pos_slip_image', posSlipImage);
      }
    }

    // CHEQUE
    if (paymentMethod === 'DRAFT_CHEQUE') {
      formData.append('cheque_number', chequeNumber);
      formData.append('cheque_date', chequeDate);
      formData.append('bank_name', bankName);
      formData.append('ifsc_code', ifscCode);
      formData.append('branch_name', branchName);
      if (chequeImage) {
        formData.append('cheque_image', chequeImage);
      }
    }

    // NEFT / RTGS
    if (paymentMethod === 'NEFT_RTGS') {
      formData.append('neft_rtgs_ref_no', neftRtgsRefNo);
    }

    // Referral code (unchanged)
    const referralCodeToSend = referralCode.trim() || undefined;
    if (referralCodeToSend) {
      formData.append('referral_code', referralCodeToSend);
    }

    console.log('🔍 Submitting investment with payment...');

    const response = await investmentService.createInvestmentWithPayment(formData);

//     if (response.success) {
//       if (isPartialPayment) {
//         toast.success(
//           'Partial payment submitted! Complete remaining payment within 30 days.',
//           { duration: 5000 }
//         );
//       } else {
//         toast.success(response.message || 'Investment submitted successfully!');
//       }

//       setShowInvestModal(false);

//       setTimeout(() => {
//         navigate('/dashboard');
//       }, 1500);
//     }
//   } catch (error) {
//     console.error('Investment error:', error);
//     toast.error(error.message || 'Failed to create investment');
//   } finally {
//     setInvesting(false);
//   }
// };
    if (response.success) {
      if (isPartialPayment) {
        toast.success(
          `Partial payment submitted! ₹${dueAmount.toLocaleString('en-IN')} due by ${new Date(paymentDueDate).toLocaleDateString('en-IN')}`,
          { duration: 5000 }
        );
      } else {
        toast.success(response.message || 'Investment submitted successfully!');
      }

      setShowInvestModal(false);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  } catch (error) {
    console.error('Investment error:', error);
    toast.error(error.message || 'Failed to create investment');
  } finally {
    setInvesting(false);
  }
};


  // const handleUnitsChange = (newUnits) => {
  //   if (newUnits < 1) return;
  //   if (newUnits > property.available_units) {
  //     toast.error(`Only ${property.available_units} units available`);
  //     return;
  //   }
  //   setUnitsCount(newUnits);
  //   setInvestmentAmount(newUnits * parseFloat(property.price_per_unit));
  // };

  const handleUnitsChange = (newUnits) => {
  if (newUnits < 1) return;
  if (newUnits > property.available_units) {
    toast.error(`Only ${property.available_units} units available`);
    return;
  }
  setUnitsCount(newUnits);
  // ✅ FIX: Calculate exact amount with proper decimal formatting
  const pricePerUnit = parseFloat(property.price_per_unit);
  setInvestmentAmount((newUnits * pricePerUnit).toFixed(2));
};

  // const handleAmountChange = (newAmount) => {
  //   const amount = parseFloat(newAmount);
  //   if (isNaN(amount) || amount < parseFloat(property.minimum_investment)) return;

  //   const calculatedUnits = Math.floor(amount / parseFloat(property.price_per_unit));
  //   if (calculatedUnits < 1) return;

  //   setUnitsCount(calculatedUnits);
  //   setInvestmentAmount(calculatedUnits * parseFloat(property.price_per_unit));
  // };

  const handleAmountChange = (newAmount) => {
  // ✅ FIX: Better amount parsing and validation
  const amount = parseFloat(newAmount);
  
  // Invalid amount
  if (isNaN(amount) || amount <= 0) {
    setInvestmentAmount('');
    setUnitsCount(1);
    return;
  }
  
  const pricePerUnit = parseFloat(property.price_per_unit);
  const minInvestment = parseFloat(property.minimum_investment);
  
    // ✅ WARN if below minimum
  if (amount < minInvestment) {
    toast.warn(`Minimum investment is ₹${minInvestment.toLocaleString('en-IN')}`);
  }
  
  const calculatedUnits = Math.floor(amount / pricePerUnit);
  

  
  // At least 1 unit required
  if (calculatedUnits < 1) {
    toast.error(`Minimum amount is ₹${pricePerUnit.toLocaleString('en-IN')} (1 unit)`);
    return;
  }
  
  // Check available units
  if (calculatedUnits > property.available_units) {
    toast.error(`Only ${property.available_units} units available`);
    return;
  }

  setUnitsCount(calculatedUnits);
  // ✅ FIX: Set exact amount based on units (no rounding errors)
  setInvestmentAmount((calculatedUnits * pricePerUnit).toFixed(2));
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

  if (loading) {
    return (
      <div className="property-detail-loading">
        <div className="loading-spinner">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-detail-error">
        <h2>Property not found</h2>
        <button onClick={() => navigate('/properties')}>Back to Properties</button>
      </div>
    );
  }

  const allImages = property.all_images?.map(img => img.url) || [
    property.primary_image || property.featured_image,
    ...(property.images?.map(img => img.image_url) || [])
  ].filter(Boolean);

  const fetchExpectedEarnings = async (amount) => {
    if (!property?.slug) return;

    setLoadingEarnings(true);
    try {
      const response = await propertyService.getPropertyAnalytics(property.slug, amount);
      if (response.success) {
        setExpectedEarnings(response.data.analytics.expected_earnings);
      }
    } catch (error) {
      console.error('Error fetching expected earnings:', error);
      toast.error('Failed to load expected earnings');
    } finally {
      setLoadingEarnings(false);
    }
  };

  const validateReferralCode = async (code) => {
    if (!code.trim()) {
      setCodeValidation(null);
      return;
    }

    setValidatingCode(true);
    try {
      const response = await investmentService.validateCPCode(code);
      if (response.success) {
        setCodeValidation({
          valid: true,
          message: response.message,
          cp_name: response.data.cp_name,
          cp_id: response.data.cp_id
        });
      }
    } catch (error) {
      setCodeValidation({
        valid: false,
        message: error.message || 'Invalid referral code'
      });
    } finally {
      setValidatingCode(false);
    }
  };

  return (
    <div className="property-detail-page">
      <div className="property-detail-container">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate('/properties')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Properties
        </button>

        {/* Main Content Grid */}
        <div className="property-detail-grid">
          {/* Left Column - Images & Info */}
          <div className="property-left">
            {/* Image Gallery */}
            <div className="image-gallery">
              <div className="main-image">
                <img
                  src={allImages[selectedImageIndex] || 'https://via.placeholder.com/800x600?text=No+Image'}
                  alt={property.name}
                />
                {property.is_featured && <span className="featured-badge">Featured</span>}

                <div className="property-badges">
                  <span className={`badge-property-type ${property.property_type}`}>
                    {property.property_type === 'equity' ? 'Equity' :
                      property.property_type === 'debt_income' ? 'Debt Income' :
                        property.property_type === 'hybrid' ? 'Hybrid' :
                          property.property_type}
                  </span>
                  <span className={`badge-status status-${property.status}`}>
                    {property.status === 'live' ? 'Live' :
                      property.status === 'funding' ? 'Funding' :
                        property.status === 'funded' ? 'Fully Funded' :
                          property.status === 'under_construction' ? 'Under Construction' :
                            property.status === 'completed' ? 'Completed' :
                              property.status}
                  </span>
                </div>
              </div>

              {allImages.length > 1 && (
                <div className="image-thumbnails">
                  {allImages.map((img, index) => (
                    <div
                      key={index}
                      className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img src={img} alt={`View ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Property Header */}
            <div className="property-header">
              <div className="property-title-section">
                <h1>{property.name}</h1>
                <p className="property-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  {property.locality && `${property.locality}, `}{property.city}, {property.state}
                </p>
                <div className="property-meta">
                  <span className="meta-item">
                    <strong>Builder:</strong> {property.builder_name}
                  </span>
                  <span className="meta-item">
                    <strong>Type:</strong> {property.property_type}
                  </span>
                  <span className="meta-item">
                    <strong>Status:</strong> {property.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="property-tabs">
              <button
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`tab ${activeTab === 'financials' ? 'active' : ''}`}
                onClick={() => setActiveTab('financials')}
              >
                Financials
              </button>
              <button
                className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                Documents
              </button>
              <button
                className={`tab ${activeTab === 'location' ? 'active' : ''}`}
                onClick={() => setActiveTab('location')}
              >
                Location
              </button>
              {/* <button
                className={`tab ${activeTab === 'earnings' ? 'active' : ''}`}
                onClick={() => setActiveTab('earnings')}
              >
                Expected Earnings
              </button> */}
            </div>

            {/* Tab Content - KEEPING EXISTING TABS */}
            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-section">
                  <h3>About This Property</h3>
                  <p>{property.description}</p>

                  {property.highlights?.length > 0 && (
                    <div className="highlights">
                      <h4>Highlights</h4>
                      <ul>
                        {property.highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {property.amenities?.length > 0 && (
                    <div className="amenities">
                      <h4>Amenities</h4>
                      <div className="amenities-grid">
                        {property.amenities.map((amenity, index) => (
                          <div key={index} className="amenity-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {amenity}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="specifications">
                    <h4>Specifications</h4>
                    <div className="spec-grid">
                      <div className="spec-item">
                        <span className="spec-label">Total Area</span>
                        <span className="spec-value">{property.total_area} sq ft</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Total Shares</span>
                        <span className="spec-value">{property.total_units}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Available Shares</span>
                        <span className="spec-value">{property.available_units}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Tenure</span>
                        <span className="spec-value">{property.project_duration} months</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'financials' && (
                <div className="financials-section">
                  <h3>Financial Details</h3>

                  <div className="financial-grid">
                    <div className="financial-card">
                      <h4>Investment Range</h4>
                      <p className="financial-value">
                        {formatCurrency(property.minimum_investment)} - {' '}
                        {property.maximum_investment ? formatCurrency(property.maximum_investment) : 'No Limit'}
                      </p>
                    </div>

                    <div className="financial-card">
                      <h4>Target Amount</h4>
                      <p className="financial-value">{formatCurrency(property.target_amount)}</p>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${property.stats?.funding_percentage || 0}%` }}
                        />
                      </div>
                      <p className="progress-text">
                        {formatCurrency(property.funded_amount)} funded ({property.stats?.funding_percentage || 0}%)
                      </p>
                    </div>

                    <div className="financial-card">
                      <h4>Expected Returns</h4>
                      <div className="returns-grid">
                        <div>
                          <span className="return-label">Target IRR</span>
                          <span className="return-value">{property.expected_return_percentage}%</span>
                        </div>
                        <div>
                          <span className="return-label">Gross Yield</span>
                          <span className="return-value">{property.gross_yield}%</span>
                        </div>
                        <div>
                          <span className="return-label">Potential Gain</span>
                          <span className="return-value positive">
                            +{property.potential_gain}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="financial-card">
                      <h4>Important Dates</h4>
                      <div className="dates-list">
                        <div className="date-item">
                          <span>Launch Date:</span>
                          <strong>{formatDate(property.launch_date)}</strong>
                        </div>
                        <div className="date-item">
                          <span>Funding End:</span>
                          <strong>{formatDate(property.funding_end_date)}</strong>
                        </div>
                        <div className="date-item">
                          <span>Possession:</span>
                          <strong>{formatDate(property.possession_date)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="documents-section">
                  <h3>Documents</h3>
                  {(property.all_documents || property.documents)?.length > 0 ? (
                    <div className="documents-list">
                      {(property.all_documents || property.documents).map((doc) => (
                        <div key={doc.id} className="document-item">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="document-info">
                            <h4>{doc.title}</h4>
                            <span className="document-type">{doc.document_type}</span>
                          </div>
                          {doc.is_public && (
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="download-btn">
                              Download
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No documents available</p>
                  )}
                </div>
              )}

              {activeTab === 'location' && (
                <div className="location-section">
                  <h3>Location</h3>
                  <div className="address-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <div>
                      <p><strong>{property.name}</strong></p>
                      <p>{property.address}</p>
                      <p>{property.city}, {property.state} - {property.pincode}</p>
                      <p>{property.country}</p>
                    </div>
                  </div>

                  {property.latitude && property.longitude && (
                    <div className="map-placeholder">
                      <p>Map integration coming soon</p>
                      <p className="coordinates">
                        Coordinates: {property.latitude}, {property.longitude}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'earnings' && (
                <div className="earnings-section">
                  <h3>Expected Earnings</h3>
                  <p className="earnings-subtitle">Estimate your return on investment</p>

                  <div className="earnings-calculator">
                    <label>Investment Amount</label>
                    <div className="amount-input-wrapper">
                      <span className="currency-symbol">₹</span>
                      <input
                        type="number"
                        value={earningsAmount}
                        onChange={(e) => setEarningsAmount(e.target.value)}
                        min={property.minimum_investment}
                        step="50000"
                        placeholder="Enter amount"
                      />
                      <button
                        className="calculate-btn"
                        onClick={() => fetchExpectedEarnings(earningsAmount)}
                        disabled={loadingEarnings}
                      >
                        {loadingEarnings ? 'Calculating...' : 'Calculate'}
                      </button>
                    </div>
                    <p className="input-hint">
                      Minimum: {formatCurrency(property.minimum_investment)}
                    </p>
                  </div>

                  <div className="quick-amounts">
                    {[500000, 1000000, 2000000, 5000000].map(amount => (
                      <button
                        key={amount}
                        className={`quick-amount-btn ${earningsAmount == amount ? 'active' : ''}`}
                        onClick={() => {
                          setEarningsAmount(amount);
                          fetchExpectedEarnings(amount);
                        }}
                      >
                        ₹{(amount / 100000).toFixed(1)}L
                      </button>
                    ))}
                  </div>

                  {loadingEarnings ? (
                    <div className="loading-earnings">
                      <div className="spinner"></div>
                      <p>Calculating returns...</p>
                    </div>
                  ) : expectedEarnings ? (
                    <>
                      <div className="earnings-summary">
                        <div className="summary-card">
                          <span className="summary-label">Investment Amount</span>
                          <span className="summary-value">{expectedEarnings.investment_amount_display}</span>
                        </div>
                        <div className="summary-card">
                          <span className="summary-label">Total Tenure</span>
                          <span className="summary-value">{expectedEarnings.total_tenure_years} Years</span>
                        </div>
                        <div className="summary-card">
                          <span className="summary-label">Annual Return Rate</span>
                          <span className="summary-value">{expectedEarnings.annual_return_rate}%</span>
                        </div>
                        <div className="summary-card highlight">
                          <span className="summary-label">Total Net Returns</span>
                          <span className="summary-value">
                            ₹{(expectedEarnings.total_net / 100000).toFixed(2)}L
                          </span>
                        </div>
                      </div>

                      <div className="earnings-note">
                        <p>Below are sample investment results calculated using the values entered in the Returns Calculator</p>
                        <button className="download-report-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Download Report
                        </button>
                      </div>

                      <div className="earnings-table-wrapper">
                        <table className="earnings-table">
                          <thead>
                            <tr>
                              <th>Date Period</th>
                              <th>PayOut Date</th>
                              <th>Gross Amount</th>
                              <th>Tax Amount</th>
                              <th>Net Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {expectedEarnings.breakdown.map((row, index) => (
                              <tr key={index}>
                                <td>{row.date_period}</td>
                                <td>{row.payout_date}</td>
                                <td>{row.gross_amount_display}</td>
                                <td>{row.tax_amount_display}</td>
                                <td className="net-amount">{row.net_amount_display}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <p className="disclaimer">
                        * Returns are indicative and subject to market conditions. Tax calculations are based on current rates.
                      </p>
                    </>
                  ) : (
                    <div className="no-earnings-data">
                      <p>Enter an amount and click Calculate to see expected earnings</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Investment Card */}
          <div className="property-right">
            <div className="investment-card">
              <div className="investment-header">
                <h3>Investment Type</h3>
                <span className="investor-count">
                  Fractional
                </span>
              </div>

              <div className="price-section">
                <div className="price-item">
                  <span className="price-label">Min Investment</span>
                  <span className="price-value">{formatCurrency(property.minimum_investment)}</span>
                </div>
                <div className="price-item">
                  <span className="price-label">Assest Value</span>
                  <span className="price-value">{formatCurrency(property.target_amount)}</span>
                </div>
              </div>

              <div className="metrics-section">
                <div className="metric-row">
                  <span className="metric-label">Total Shares</span>
                  <span className="metric-value">{property.total_units}</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Available Shares</span>
                  <span className="metric-value">{property.available_units}</span>
                </div>
                <div className="metric-row">
                     <span className="metric-label">Potential Growth</span>
    <span className="metric-value highlight">
      {property.potential_gain ? `${property.potential_gain}` : '2x'}
    </span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Tenure</span>
                  <span className="metric-value highlight">{property.project_duration} months</span>
                </div>
                <div className="metric-row">
                  <span className="metric-label">Subscriptions</span>
                  <span className="metric-value">{property.expected_return_percentage}</span>
                </div>
              </div>

              <button
                className="express-interest-btn secondary"
                onClick={() => setShowInterestModal(true)}
              >
                Express Interest
              </button>

              <button
                className="express-interest-btn primary"
                onClick={handleInvestNow}
              >
                Invest Now
              </button>

              <button
                className="view-analytics-btn"
                onClick={() => navigate(`/analytics/${property.slug}`)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 9L13 14L9 10L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                View Property Analytics
              </button>

              <p className="disclaimer">
                * Returns are indicative and subject to market conditions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interest Modal */}
      {showInterestModal && (
        <div className="modal-overlay" onClick={() => setShowInterestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInterestModal(false)}>
              ×
            </button>
            <h2>Express Interest</h2>
            <p>Our team will contact you shortly to discuss investment opportunities in <strong>{property.name}</strong>.</p>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowInterestModal(false)}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleExpressInterest}>
                Confirm Interest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 INVESTMENT MODAL WITH PAYMENT FIELDS */}
      {showInvestModal && (
        <div className="modal-overlay" onClick={() => setShowInvestModal(false)}>
          <div className="modal-content invest-modal payment-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowInvestModal(false)}>
              ×
            </button>

            <h2>Invest in {property.name}</h2>
            <p className="modal-subtitle">Review your investment details and payment information</p>

            <div className="invest-inputs">
              {/* SHARES INPUT */}
              <div className="input-group">
                <label>Number of Shares</label>
                <div className="unit-selector">
                  <button
                    onClick={() => handleUnitsChange(unitsCount - 1)}
                    disabled={unitsCount <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={unitsCount}
                    onChange={(e) => handleUnitsChange(parseInt(e.target.value) || 1)}
                    min="1"
                    max={property.available_units}
                  />
                  <button
                    onClick={() => handleUnitsChange(unitsCount + 1)}
                    disabled={unitsCount >= property.available_units}
                  >
                    +
                  </button>
                </div>
                <span className="input-hint">{property.available_units} Shares available</span>
              </div>

              {/* AMOUNT INPUT */}
             <div className="input-group">
  <label>Investment Amount (₹)</label>
  <input
    type="number"
    value={investmentAmount}
    onChange={(e) => handleAmountChange(e.target.value)}
    min={property.minimum_investment}
    max={property.maximum_investment || undefined}
    step="1000"
    className={parseFloat(investmentAmount) < parseFloat(property.minimum_investment) ? 'input-error' : ''}
  />
  <span className="input-hint">
    Min: {formatCurrency(property.minimum_investment)}
    {property.maximum_investment && ` | Max: ${formatCurrency(property.maximum_investment)}`}
  </span>
  {parseFloat(investmentAmount) < parseFloat(property.minimum_investment) && (
    <span className="input-error-message">
      ⚠️ Amount is below minimum investment
    </span>
  )}
</div>

{/* 🆕 PAID AMOUNT INPUT */}
<div className="input-group">
  <label>
    Paid Amount (₹) <span className="required">*</span>
    {isPartialPayment && (
      <span style={{ color: "#f59e0b", fontSize: "0.9em", marginLeft: "8px" }}>
        (Partial Payment)
      </span>
    )}
  </label>
  <input
    type="number"
    value={paidAmount}
    onChange={(e) => setPaidAmount(e.target.value)}
    min="0"
    max={investmentAmount || undefined}
    step="1000"
    placeholder="Enter amount you're paying now"
  />
  <span className="input-hint">
    You can pay less than the total investment amount
  </span>
  {paidAmount && Number(paidAmount) > Number(investmentAmount) && (
    <span className="input-error-message">
      ❌ Paid amount cannot exceed investment amount
    </span>
  )}
</div>
{/* 🆕 DUE AMOUNT DISPLAY (only show if partial) */}
{isPartialPayment && investmentAmount && paidAmount && (
  <div className="partial-payment-alert">
    <div className="alert-content">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div>
        <strong>Due Amount: ₹{(parseFloat(investmentAmount) - parseFloat(paidAmount)).toLocaleString('en-IN')}</strong>
        <p>You'll need to pay the remaining amount by the due date</p>
      </div>
    </div>
  </div>
)}

{/* 🆕 PAYMENT DUE DATE (only show if partial) */}
{isPartialPayment && (
  <div className="input-group">
    <label>Payment Due Date <span className="required">*</span></label>
    <input
      type="date"
      value={paymentDueDate}
      onChange={(e) => setPaymentDueDate(e.target.value)}
      min={new Date().toISOString().split('T')[0]} // Can't be in the past
      required
    />
    <span className="input-hint">
      Select the date by which you'll pay the remaining amount
    </span>
  </div>
)}


              {/* 🆕 PAYMENT METHOD SELECTION */}
              <div className="input-group">
                <label>Payment Method <span className="required">*</span></label>
                <div className="payment-methods">
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'ONLINE' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('ONLINE')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>Online</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'POS' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('POS')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M9 9H15M9 13H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>POS</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'DRAFT_CHEQUE' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('DRAFT_CHEQUE')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" />
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>Cheque</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-method-btn ${paymentMethod === 'NEFT_RTGS' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('NEFT_RTGS')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>NEFT/RTGS</span>
                  </button>
                </div>
              </div>

              {/* 🆕 CONDITIONAL FIELDS BASED ON PAYMENT METHOD */}
              {(paymentMethod === 'ONLINE' || paymentMethod === 'POS') && (
                <div className="payment-details-section">
                  <div className="section-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" />
                      <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <h4>{paymentMethod === 'ONLINE' ? 'Online Payment Details' : 'POS Transaction Details'}</h4>
                  </div>

                  <div className="input-group">
                    <label>Payment Mode <span className="required">*</span></label>
                    <select 
                      value={paymentMode} 
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="payment-select"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Card">Debit/Credit Card</option>
                      <option value="NetBanking">Net Banking</option>
                      <option value="Wallet">Digital Wallet</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Transaction Number <span className="required">*</span></label>
                    <input
                      type="text"
                      value={transactionNo}
                      onChange={(e) => setTransactionNo(e.target.value)}
                      placeholder="Enter transaction/reference number"
                      maxLength={50}
                    />
                  </div>

                  <div className="input-group">
                    <label>Upload {paymentMethod === 'POS' ? 'POS' : 'Payment'} Slip (Optional)</label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        id="pos-slip"
                        accept="image/*"
                        onChange={handlePosSlipChange}
                        className="file-input"
                      />
                      <label htmlFor="pos-slip" className="file-upload-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{posSlipImage ? posSlipImage.name : 'Choose File'}</span>
                      </label>
                    </div>
                    {posSlipPreview && (
                      <div className="image-preview">
                        <img src={posSlipPreview} alt="POS Slip" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {paymentMethod === 'DRAFT_CHEQUE' && (
                <div className="payment-details-section">
                  <div className="section-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <h4>Cheque/Draft Details</h4>
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label>Cheque Number <span className="required">*</span></label>
                      <input
                        type="text"
                        value={chequeNumber}
                        onChange={(e) => setChequeNumber(e.target.value)}
                        placeholder="Enter cheque number"
                        maxLength={20}
                      />
                    </div>

                    <div className="input-group">
                      <label>Cheque Date <span className="required">*</span></label>
                      <input
                        type="date"
                        value={chequeDate}
                        onChange={(e) => setChequeDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Bank Name <span className="required">*</span></label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Enter bank name"
                      maxLength={100}
                    />
                  </div>

                  <div className="input-row">
                    <div className="input-group">
                      <label>IFSC Code <span className="required">*</span></label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        placeholder="e.g., HDFC0001234"
                        maxLength={11}
                      />
                    </div>

                    <div className="input-group">
                      <label>Branch Name <span className="required">*</span></label>
                      <input
                        type="text"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        placeholder="Enter branch name"
                        maxLength={100}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Upload Cheque Image (Optional)</label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        id="cheque-image"
                        accept="image/*"
                        onChange={handleChequeImageChange}
                        className="file-input"
                      />
                      <label htmlFor="cheque-image" className="file-upload-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{chequeImage ? chequeImage.name : 'Choose File'}</span>
                      </label>
                    </div>
                    {chequeImagePreview && (
                      <div className="image-preview">
                        <img src={chequeImagePreview} alt="Cheque" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {paymentMethod === 'NEFT_RTGS' && (
                <div className="payment-details-section">
                  <div className="section-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" />
                      <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <h4>NEFT/RTGS Details</h4>
                  </div>

                  <div className="input-group">
                    <label>NEFT/RTGS Reference Number <span className="required">*</span></label>
                    <input
                      type="text"
                      value={neftRtgsRefNo}
                      onChange={(e) => setNeftRtgsRefNo(e.target.value)}
                      placeholder="Enter transaction reference number"
                      maxLength={50}
                    />
                  </div>
                </div>
              )}

              {/* PAYMENT NOTES */}
              <div className="input-group">
                <label>Payment Notes (Optional)</label>
                <textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Add any additional notes about this payment..."
                  rows="3"
                  maxLength={500}
                />
              </div>

              {/* ✅ REFERRAL CODE SECTION - UNCHANGED */}
              {!checkingCPRelation && (
                userCPRelation ? (
                  <div className="input-group">
                    <label>Referred by</label>
                    <div className="cp-linked-message">
                      <div className="cp-linked-icon">✓</div>
                      <div className="cp-linked-content">
                        <strong>{userCPRelation.cp_name}</strong>
                        <span className="cp-code-badge">{userCPRelation.cp_code}</span>
                        <p className="cp-linked-note">You're already linked to this Channel Partner</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="input-group">
                    <label>Referred by (Optional)</label>
                    <div className="referral-input-wrapper">
                      <input
                        type="text"
                        value={referralCode}
                        onChange={(e) => {
                          let value = e.target.value.toUpperCase().trim();
                          if (value && !value.startsWith('CP')) {
                            value = 'CP' + value;
                          }
                          setReferralCode(value);
                        }}
                        onBlur={() => validateReferralCode(referralCode)}
                        placeholder="Enter CP referral code"
                        maxLength={10}
                      />
                      {validatingCode && <span className="validating">Checking...</span>}
                    </div>

                    {codeValidation && (
                      <span className={`validation-message ${codeValidation.valid ? 'valid' : 'invalid'}`}>
                        {codeValidation.valid && '✓ '}
                        {codeValidation.message}
                        {codeValidation.cp_name && ` - ${codeValidation.cp_name}`}
                      </span>
                    )}

                    <span className="input-hint">Have a Channel Partner code? Enter it here</span>
                  </div>
                )
              )}
            </div>

            {/* INVESTMENT SUMMARY */}
            <div className="invest-summary">
              <div className="summary-row">
                <span>Price per unit</span>
                <strong>{formatCurrency(property.price_per_unit)}</strong>
              </div>
              <div className="summary-row">
                <span>Shares</span>
                <strong>{unitsCount}</strong>
              </div>
              <div className="summary-row">
                <span>Payment Method</span>
                <strong>{paymentMethod === 'DRAFT_CHEQUE' ? 'Cheque/Draft' : paymentMethod}</strong>
              </div>
              <div className="summary-row total">
                <span>Total Investment</span>
                <strong>{formatCurrency(investmentAmount)}</strong>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowInvestModal(false)}
                disabled={investing}
              >
                Cancel
              </button>
              <button
                className="btn-confirm"
                onClick={handleInvestmentSubmit}
                disabled={investing}
              >
                {investing ? 'Processing...' : 'Submit Investment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;