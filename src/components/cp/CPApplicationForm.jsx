// // CPApplicationForm.jsx
// // =====================================================
// // Channel Partner Application Form - SIMPLIFIED
// // Public access - no login required
// // =====================================================

// import React, { useState, useEffect } from 'react';
// import { FiChevronDown, FiChevronUp, FiCheck, FiUser, FiFileText, FiSettings } from 'react-icons/fi';
// import '../../styles/cp/CPApplicationForm.css';
// import cpApplicationService from '../../services/cpApplicationService';

// const CPApplicationForm = ({ mode = 'self-apply', onSuccess }) => {
//   console.log('🟢 CPApplicationForm RENDERED');

//   // Form state
//   const [formData, setFormData] = useState({
//     // Personal Info (NEW)
//     name: '',
//     email: '',
//     phone: '',
    
//     // Identity
//     agent_type: 'individual',
//     company_name: '',
//     pan_number: '',
//     gst_number: '',
//     rera_number: '',
//     business_address: '',
    
//     // Bank Details
//     bank_name: '',
//     account_number: '',
//     ifsc_code: '',
//     account_holder_name: '',
//   });

//   // UI state
//   const [expandedSections, setExpandedSections] = useState(['identity']);
//   const [completedSections, setCompletedSections] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Sections configuration (simplified)
//   const sections = [
//     {
//       id: 'identity',
//       title: 'Personal & Business Information',
//       icon: <FiUser size={20} />,
//       fields: ['name', 'email', 'phone', 'agent_type', 'company_name', 'pan_number', 'gst_number', 'rera_number', 'business_address']
//     },
//     {
//       id: 'operational',
//       title: 'Bank Account Details',
//       icon: <FiSettings size={20} />,
//       fields: ['bank_name', 'account_number', 'ifsc_code', 'account_holder_name']
//     }
//   ];

//   const toggleSection = (sectionId) => {
//     setExpandedSections(prev => 
//       prev.includes(sectionId)
//         ? prev.filter(id => id !== sectionId)
//         : [...prev, sectionId]
//     );
//   };

//   const isSectionCompleted = (section) => {
//     return section.fields.every(field => {
//       if (field === 'company_name' && formData.agent_type !== 'company') return true;
//       if (field === 'gst_number' && formData.agent_type !== 'company') return true;
//       if (field === 'rera_number') return true; // ← Add this line to make RERA optional
//       return formData[field] && formData[field].trim() !== '';
//     });
//   };

//   useEffect(() => {
//     const completed = sections
//       .filter(s => isSectionCompleted(s))
//       .map(s => s.id);
//     setCompletedSections(completed);
//   }, [formData]);

//   const handleChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//     setError(null);
//   };

//   const validateForm = () => {
//     // Personal info
//     if (!formData.name) return 'Full name is required';
//     if (!formData.email) return 'Email is required';
//     if (!formData.phone) return 'Phone number is required';
    
//     // Phone validation
//     if (!/^\d{10}$/.test(formData.phone)) {
//       return 'Phone must be 10 digits';
//     }
    
//     // Email validation
//     if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       return 'Invalid email format';
//     }
    
//     // Business info
//     if (!formData.agent_type) return 'Agent type is required';
//     if (!formData.pan_number) return 'PAN number is required';
//     if (!formData.business_address) return 'Business address is required';
    
//     if (formData.agent_type === 'company') {
//       if (!formData.company_name) return 'Company name is required';
//       if (!formData.gst_number) return 'GST number is required';
//     }

//     // Bank details
//     if (!formData.bank_name) return 'Bank name is required';
//     if (!formData.account_number) return 'Account number is required';
//     if (!formData.ifsc_code) return 'IFSC code is required';
//     if (!formData.account_holder_name) return 'Account holder name is required';

//     // PAN format
//     const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     if (!panRegex.test(formData.pan_number)) {
//       return 'Invalid PAN format (e.g., ABCDE1234F)';
//     }

//     // GST format (if company)
//     if (formData.agent_type === 'company' && formData.gst_number) {
//       const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
//       if (!gstRegex.test(formData.gst_number)) {
//         return 'Invalid GST format';
//       }
//     }

//     // IFSC format
//     const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
//     if (!ifscRegex.test(formData.ifsc_code)) {
//       return 'Invalid IFSC code format';
//     }

//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const result = await cpApplicationService.apply(formData);

//       if (result.success) {
//         if (onSuccess) {
//           onSuccess(result.data);
//         }
//       } else {
//         setError(result.error);
//       }
//     } catch (err) {
//       setError('Failed to submit application. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="cp-application-form">
//       {/* Header */}
//       <div className="form-header">
//         <h2>Channel Partner Application</h2>
//         <p>Fill in your details to apply as a Channel Partner</p>
//       </div>

//       {error && (
//         <div className="error-banner">
//           <span>{error}</span>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="accordion-form">
//         {sections.map((section) => (
//           <div key={section.id} className="accordion-section">
//             {/* Section Header */}
//             <div
//               className={`section-header ${expandedSections.includes(section.id) ? 'expanded' : ''} ${completedSections.includes(section.id) ? 'completed' : ''}`}
//               onClick={() => toggleSection(section.id)}
//             >
//               <div className="section-header-left">
//                 <div className="section-icon">{section.icon}</div>
//                 <h3 className="section-title">{section.title}</h3>
//               </div>
//               <div className="section-header-right">
//                 {completedSections.includes(section.id) && (
//                   <FiCheck className="check-icon" size={20} />
//                 )}
//                 {expandedSections.includes(section.id) ? (
//                   <FiChevronUp size={20} />
//                 ) : (
//                   <FiChevronDown size={20} />
//                 )}
//               </div>
//             </div>

//             {/* Section Content */}
//             {expandedSections.includes(section.id) && (
//               <div className="section-content">
//                 {section.id === 'identity' && (
//                   <div className="form-grid">
//                     {/* NEW: Personal Info Fields */}
//                     <div className="form-group">
//                       <label className="form-label">Full Name *</label>
//                       <input
//                         type="text"
//                         className="form-input-cp"
//                         value={formData.name}
//                         onChange={(e) => handleChange('name', e.target.value)}
//                         placeholder="Enter your full name"
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label">Email Address *</label>
//                       <input
//                         type="email"
//                         className="form-input-cp"
//                         value={formData.email}
//                         onChange={(e) => handleChange('email', e.target.value)}
//                         placeholder="your.email@example.com"
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label">Phone Number *</label>
//                       <input
//                         type="tel"
//                         className="form-input-cp"
//                         value={formData.phone}
//                         onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))}
//                         placeholder="10-digit mobile number"
//                         maxLength={10}
//                       />
//                     </div>

//                     {/* Agent Type */}
//                     <div className="form-group full-width">
//                       <label className="form-label">Agent Type *</label>
//                       <div className="radio-group-cp">
//                         <button
//                           type="button"
//                           className={`radio-btn-cp ${formData.agent_type === 'individual' ? 'active' : ''}`}
//                           onClick={() => handleChange('agent_type', 'individual')}
//                         >
//                           Individual
//                         </button>
//                         <button
//                           type="button"
//                           className={`radio-btn-cp ${formData.agent_type === 'company' ? 'active' : ''}`}
//                           onClick={() => handleChange('agent_type', 'company')}
//                         >
//                           Company
//                         </button>
//                         <button
//                           type="button"
//                           className={`radio-btn-cp ${formData.agent_type === 'franchise' ? 'active' : ''}`}
//                           onClick={() => handleChange('agent_type', 'franchise')}
//                         >
//                           Franchise
//                         </button>
//                       </div>
//                     </div>

//                     {/* Company Name (conditional) */}
//                     {formData.agent_type === 'company' && (
//                       <div className="form-group full-width">
//                         <label className="form-label">Company Name *</label>
//                         <input
//                           type="text"
//                           className="form-input-cp"
//                           value={formData.company_name}
//                           onChange={(e) => handleChange('company_name', e.target.value)}
//                           placeholder="Enter company name"
//                         />
//                       </div>
//                     )}

//                     {/* PAN Number */}
//                     <div className="form-group">
//                       <label className="form-label">PAN Number *</label>
//                       <input
//                         type="text"
//                         className="form-input-cp"
//                         value={formData.pan_number}
//                         onChange={(e) => handleChange('pan_number', e.target.value.toUpperCase())}
//                         placeholder="ABCDE1234F"
//                         maxLength={10}
//                       />
//                     </div>

//                     {/* GST Number (conditional) */}
//                     {formData.agent_type === 'company' && (
//                       <div className="form-group">
//                         <label className="form-label">GST Number *</label>
//                         <input
//                           type="text"
//                           className="form-input-cp"
//                           value={formData.gst_number}
//                           onChange={(e) => handleChange('gst_number', e.target.value.toUpperCase())}
//                           placeholder="29ABCDE1234F1Z5"
//                           maxLength={15}
//                         />
//                       </div>
//                     )}

//                     {/* RERA Number */}
//                     <div className="form-group">
//                       <label className="form-label">RERA Number (Optional)</label>
//                       <input
//                         type="text"
//                         className="form-input-cp"
//                         value={formData.rera_number}
//                         onChange={(e) => handleChange('rera_number', e.target.value)}
//                         placeholder="Enter RERA number"
//                       />
//                     </div>

//                     {/* Business Address */}
//                     <div className="form-group full-width">
//                       <label className="form-label">Business Address *</label>
//                       <textarea
//                         className="form-textarea-cp"
//                         value={formData.business_address}
//                         onChange={(e) => handleChange('business_address', e.target.value)}
//                         placeholder="Enter complete business address"
//                         rows={3}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {section.id === 'operational' && (
//                   <div className="form-grid">
//                     <div className="form-group">
//                       <label className="form-label">Bank Name *</label>
//                       <input
//                         type="text"
//                         className="form-input-cp"
//                         value={formData.bank_name}
//                         onChange={(e) => handleChange('bank_name', e.target.value)}
//                         placeholder="Enter bank name"
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label">Account Number *</label>
//                       <input
//                         type="text"
//                         className="form-input-cp"
//                         value={formData.account_number}
//                         onChange={(e) => handleChange('account_number', e.target.value)}
//                         placeholder="Enter account number"
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label">IFSC Code *</label>
//                       <input
//                         type="text"
//                         className="form-input-cp"
//                         value={formData.ifsc_code}
//                         onChange={(e) => handleChange('ifsc_code', e.target.value.toUpperCase())}
//                         placeholder="ABCD0123456"
//                         maxLength={11}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label">Account Holder Name *</label>
//                       <input
//                         type="text"
//                         className="form-input-cp"
//                         value={formData.account_holder_name}
//                         onChange={(e) => handleChange('account_holder_name', e.target.value)}
//                         placeholder="Enter account holder name"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Submit Button */}
//         <div className="form-actions-cp">
//           <button
//             type="submit"
//             className="btn-submit-cp"
//             disabled={loading || completedSections.length < sections.length}
//           >
//             {loading ? 'Submitting...' : 'Submit Application'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CPApplicationForm;

// CPApplicationForm.jsx
// =====================================================
// Channel Partner Application Form - SIMPLIFIED
// Public access - no login required
// Only name, email, phone are required - all else optional
// =====================================================


import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiCheck, FiUser, FiFileText, FiSettings } from 'react-icons/fi';
import '../../styles/cp/CPApplicationForm.css';
import cpApplicationService from '../../services/cpApplicationService';

const CPApplicationForm = ({ mode = 'self-apply', onSuccess }) => {
  console.log('🟢 CPApplicationForm RENDERED');

  // Form state
  const [formData, setFormData] = useState({
    // Personal Info (REQUIRED)
    name: '',
    email: '',
    phone: '',
    
    // Identity (OPTIONAL)
    agent_type: 'individual',
    company_name: '',
    pan_number: '',
    gst_number: '',
    rera_number: '',
    business_address: '',
    
    // Bank Details (OPTIONAL)
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    account_holder_name: '',
  });

  // UI state
  const [expandedSections, setExpandedSections] = useState(['identity']);
  const [completedSections, setCompletedSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sections configuration
  const sections = [
    {
      id: 'identity',
      title: 'Personal & Business Information',
      icon: <FiUser size={20} />,
      fields: ['name', 'email', 'phone', 'agent_type', 'company_name', 'pan_number', 'gst_number', 'rera_number', 'business_address']
    },
    {
      id: 'operational',
      title: 'Bank Account Details',
      icon: <FiSettings size={20} />,
      fields: ['bank_name', 'account_number', 'ifsc_code', 'account_holder_name']
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isSectionCompleted = (section) => {
    // Only require name, email, phone for completion
    const requiredFields = ['name', 'email', 'phone'];
    const sectionRequiredFields = section.fields.filter(field => requiredFields.includes(field));
    
    if (sectionRequiredFields.length === 0) return true; // Section has no required fields
    
    return sectionRequiredFields.every(field => {
      return formData[field] && formData[field].trim() !== '';
    });
  };

  useEffect(() => {
    const completed = sections
      .filter(s => isSectionCompleted(s))
      .map(s => s.id);
    setCompletedSections(completed);
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    // Only validate required fields: name, email, phone
    if (!formData.name) return 'Full name is required';
    if (!formData.email) return 'Email is required';
    if (!formData.phone) return 'Phone number is required';
    
    // Phone validation
    if (!/^\d{10}$/.test(formData.phone)) {
      return 'Phone must be 10 digits';
    }
    
    // Email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Invalid email format';
    }
    
    // Optional field format validations (only if filled)
    if (formData.pan_number) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(formData.pan_number)) {
        return 'Invalid PAN format (e.g., ABCDE1234F)';
      }
    }

    if (formData.gst_number) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(formData.gst_number)) {
        return 'Invalid GST format';
      }
    }

    if (formData.ifsc_code) {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(formData.ifsc_code)) {
        return 'Invalid IFSC code format';
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await cpApplicationService.apply(formData);

      if (result.success) {
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-application-form">
      {/* Header */}
      <div className="form-header">
        <h2>Channel Partner Application</h2>
        <p>Fill in your details to apply as a Channel Partner</p>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="accordion-form">
        {sections.map((section) => (
          <div key={section.id} className="accordion-section">
            {/* Section Header */}
            <div
              className={`section-header ${expandedSections.includes(section.id) ? 'expanded' : ''} ${completedSections.includes(section.id) ? 'completed' : ''}`}
              onClick={() => toggleSection(section.id)}
            >
              <div className="section-header-left">
                <div className="section-icon">{section.icon}</div>
                <h3 className="section-title">{section.title}</h3>
              </div>
              <div className="section-header-right">
                {completedSections.includes(section.id) && (
                  <FiCheck className="check-icon" size={20} />
                )}
                {expandedSections.includes(section.id) ? (
                  <FiChevronUp size={20} />
                ) : (
                  <FiChevronDown size={20} />
                )}
              </div>
            </div>

            {/* Section Content */}
            {expandedSections.includes(section.id) && (
              <div className="section-content">
                {section.id === 'identity' && (
                  <div className="form-grid">
                    {/* REQUIRED: Personal Info Fields */}
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-input-cp"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-input-cp"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-input-cp"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        required
                      />
                    </div>

                    {/* OPTIONAL: Agent Type */}
                    <div className="form-group full-width">
                      <label className="form-label">Agent Type (Optional)</label>
                      <div className="radio-group-cp">
                        <button
                          type="button"
                          className={`radio-btn-cp ${formData.agent_type === 'individual' ? 'active' : ''}`}
                          onClick={() => handleChange('agent_type', 'individual')}
                        >
                          Individual
                        </button>
                        <button
                          type="button"
                          className={`radio-btn-cp ${formData.agent_type === 'company' ? 'active' : ''}`}
                          onClick={() => handleChange('agent_type', 'company')}
                        >
                          Company
                        </button>
                        <button
                          type="button"
                          className={`radio-btn-cp ${formData.agent_type === 'franchise' ? 'active' : ''}`}
                          onClick={() => handleChange('agent_type', 'franchise')}
                        >
                          Franchise
                        </button>
                      </div>
                    </div>

                    {/* OPTIONAL: Company Name (conditional) */}
                    {formData.agent_type === 'company' && (
                      <div className="form-group full-width">
                        <label className="form-label">Company Name (Optional)</label>
                        <input
                          type="text"
                          className="form-input-cp"
                          value={formData.company_name}
                          onChange={(e) => handleChange('company_name', e.target.value)}
                          placeholder="Enter company name"
                        />
                      </div>
                    )}

                    {/* OPTIONAL: PAN Number */}
                    <div className="form-group">
                      <label className="form-label">PAN Number (Optional)</label>
                      <input
                        type="text"
                        className="form-input-cp"
                        value={formData.pan_number}
                        onChange={(e) => handleChange('pan_number', e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                      />
                    </div>

                    {/* OPTIONAL: GST Number (conditional) */}
                    {formData.agent_type === 'company' && (
                      <div className="form-group">
                        <label className="form-label">GST Number (Optional)</label>
                        <input
                          type="text"
                          className="form-input-cp"
                          value={formData.gst_number}
                          onChange={(e) => handleChange('gst_number', e.target.value.toUpperCase())}
                          placeholder="29ABCDE1234F1Z5"
                          maxLength={15}
                        />
                      </div>
                    )}

                    {/* OPTIONAL: RERA Number */}
                    <div className="form-group">
                      <label className="form-label">RERA Number (Optional)</label>
                      <input
                        type="text"
                        className="form-input-cp"
                        value={formData.rera_number}
                        onChange={(e) => handleChange('rera_number', e.target.value)}
                        placeholder="Enter RERA number"
                      />
                    </div>

                    {/* OPTIONAL: Business Address */}
                    <div className="form-group full-width">
                      <label className="form-label">Business Address (Optional)</label>
                      <textarea
                        className="form-textarea-cp"
                        value={formData.business_address}
                        onChange={(e) => handleChange('business_address', e.target.value)}
                        placeholder="Enter complete business address"
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {section.id === 'operational' && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Bank Name (Optional)</label>
                      <input
                        type="text"
                        className="form-input-cp"
                        value={formData.bank_name}
                        onChange={(e) => handleChange('bank_name', e.target.value)}
                        placeholder="Enter bank name"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Account Number (Optional)</label>
                      <input
                        type="text"
                        className="form-input-cp"
                        value={formData.account_number}
                        onChange={(e) => handleChange('account_number', e.target.value)}
                        placeholder="Enter account number"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">IFSC Code (Optional)</label>
                      <input
                        type="text"
                        className="form-input-cp"
                        value={formData.ifsc_code}
                        onChange={(e) => handleChange('ifsc_code', e.target.value.toUpperCase())}
                        placeholder="ABCD0123456"
                        maxLength={11}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Account Holder Name (Optional)</label>
                      <input
                        type="text"
                        className="form-input-cp"
                        value={formData.account_holder_name}
                        onChange={(e) => handleChange('account_holder_name', e.target.value)}
                        placeholder="Enter account holder name"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Submit Button */}
        <div className="form-actions-cp">
          <button
            type="submit"
            className="btn-submit-cp"
            disabled={loading || completedSections.length < 1}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );  
};

export default CPApplicationForm;
