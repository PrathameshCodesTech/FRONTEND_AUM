// // CPLeadForm.jsx
// // =====================================================
// // CP Lead Form Component
// // Modal form for creating/editing leads
// // =====================================================

// import React, { useState, useEffect } from 'react';
// import { FiX } from 'react-icons/fi';
// import cpLeadService from '../../services/cpLeadService';
// import '../../styles/cp/CPLeadForm.css';

// const CPLeadForm = ({ lead = null, onSubmit, onClose }) => {
//   const [formData, setFormData] = useState({
//     customer_name: '',
//     email: '',
//     phone: '',
//     property_interested: '',
//     status: 'new',
//     notes: '',
//     last_contact_date: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     if (lead) {
//       setFormData({
//         customer_name: lead.customer_name || '',
//         email: lead.email || '',
//         phone: lead.phone || '',
//         property_interested: lead.property_interested || '',
//         status: lead.status || 'new',
//         notes: lead.notes || '',
//         last_contact_date: lead.last_contact_date || ''
//       });
//     }
//   }, [lead]);

//   const handleChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//     // Clear error for this field
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: null
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.customer_name.trim()) {
//       newErrors.customer_name = 'Name is required';
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone is required';
//     } else if (!/^\+91[6-9]\d{9}$/.test(formData.phone)) {
//   newErrors.phone = 'Phone must start with +91 and be 10 digits';
// }


//     if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Invalid email address';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setSubmitting(true);

//     try {
//       await onSubmit(formData);
//     } catch (err) {
//       alert('Failed to save lead');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const statusOptions = cpLeadService.getStatusOptions();

//   return (
//     <div className="modal-overlay-lead" onClick={onClose}>
//       <div className="modal-content-lead" onClick={(e) => e.stopPropagation()}>
//         {/* Header */}
//         <div className="modal-header-lead">
//           <h2>{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
//           <button className="btn-close-modal-lead" onClick={onClose}>
//             <FiX size={24} />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="lead-form">
//           {/* Name */}
//           <div className="form-group-lead">
//             <label className="form-label-lead">Name *</label>
//             <input
//               type="text"
//               className={`form-input-lead ${errors.customer_name ? 'error' : ''}`}
//               value={formData.customer_name}
//               onChange={(e) => handleChange('customer_name', e.target.value)}
//               placeholder="Enter full name"
//             />
//             {errors.customer_name && <span className="error-text">{errors.customer_name}</span>}
//           </div>

//           {/* Phone */}
//           <div className="form-group-lead">
//             <label className="form-label-lead">Phone *</label>
//             <input
//               type="tel"
//               className={`form-input-lead ${errors.phone ? 'error' : ''}`}
//               value={formData.phone}
//               onChange={(e) => handleChange('phone', e.target.value)}
//               placeholder="Enter phone number"
//             />
//             {errors.phone && <span className="error-text">{errors.phone}</span>}
//           </div>

//           {/* Email */}
//           <div className="form-group-lead">
//             <label className="form-label-lead">Email (Optional)</label>
//             <input
//               type="email"
//               className={`form-input-lead ${errors.email ? 'error' : ''}`}
//               value={formData.email}
//               onChange={(e) => handleChange('email', e.target.value)}
//               placeholder="Enter email address"
//             />
//             {errors.email && <span className="error-text">{errors.email}</span>}
//           </div>

//           {/* Property Interested */}
//           <div className="form-group-lead">
//             <label className="form-label-lead">Property Interested In</label>
//             <input
//               type="text"
//               className="form-input-lead"
//               value={formData.property_interested}
//               onChange={(e) => handleChange('property_interested', e.target.value)}
//               placeholder="Enter property name"
//             />
//           </div>

//           {/* Status */}
//           <div className="form-group-lead">
//             <label className="form-label-lead">Status</label>
//             <select
//               className="form-select-lead"
//               value={formData.status}
//               onChange={(e) => handleChange('status', e.target.value)}
//             >
//               {statusOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Last Contact Date */}
//           <div className="form-group-lead">
//             <label className="form-label-lead">Last Contact Date</label>
//             <input
//               type="date"
//               className="form-input-lead"
//               value={formData.last_contact_date}
//               onChange={(e) => handleChange('last_contact_date', e.target.value)}
//             />
//           </div>

//           {/* Notes */}
//           <div className="form-group-lead full-width">
//             <label className="form-label-lead">Notes</label>
//             <textarea
//               className="form-textarea-lead"
//               value={formData.notes}
//               onChange={(e) => handleChange('notes', e.target.value)}
//               placeholder="Add any additional notes about this lead..."
//               rows={4}
//             />
//           </div>

//           {/* Actions */}
//           <div className="form-actions-lead">
//             <button
//               type="button"
//               className="btn-cancel-lead"
//               onClick={onClose}
//               disabled={submitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="btn-submit-lead"
//               disabled={submitting}
//             >
//               {submitting ? 'Saving...' : lead ? 'Update Lead' : 'Add Lead'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CPLeadForm;

// // CPLeadForm.jsx
// import React, { useState, useEffect } from 'react';
// import { FiX } from 'react-icons/fi';
// import cpLeadService from '../../services/cpLeadService';
// import '../../styles/cp/CPLeadForm.css';

// const CPLeadForm = ({ lead = null, onSubmit, onClose }) => {
//   const [formData, setFormData] = useState({
//     customer_name: '',
//     email: '',
//     phone: '',
//     property_interested: '',
//     status: 'new',
//     notes: '',
//     last_contact_date: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [properties, setProperties] = useState([]); // 🆕 Store properties
//   const [loadingProperties, setLoadingProperties] = useState(true); // 🆕 Loading state

//   // 🆕 Fetch properties on mount
//   useEffect(() => {
//     fetchProperties();
//   }, []);

//   useEffect(() => {
//     if (lead) {
//       setFormData({
//         customer_name: lead.customer_name || '',
//         email: lead.email || '',
//         phone: lead.phone || '',
//         property_interested: lead.property_interested || '',
//         status: lead.status || 'new',
//         notes: lead.notes || '',
//         last_contact_date: lead.last_contact_date || ''
//       });
//     }
//   }, [lead]);

//   // 🆕 Fetch authorized properties
//   const fetchProperties = async () => {
//     try {
//       setLoadingProperties(true);
//       const data = await cpLeadService.getAuthorizedProperties();
//       setProperties(data || []);
//     } catch (error) {
//       console.error('Failed to load properties:', error);
//       setProperties([]);
//     } finally {
//       setLoadingProperties(false);
//     }
//   };

//   const handleChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//     // Clear error for this field
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: null
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.customer_name.trim()) {
//       newErrors.customer_name = 'Name is required';
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone is required';
//     } else if (!/^\+91[6-9]\d{9}$/.test(formData.phone)) {
//       newErrors.phone = 'Phone must start with +91 and be 10 digits';
//     }

//     if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Invalid email address';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setSubmitting(true);

//     try {
//       await onSubmit(formData);
//     } catch (err) {
//       alert('Failed to save lead');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const statusOptions = cpLeadService.getStatusOptions();

//   return (
//     <div className="modal-overlay-lead" onClick={onClose}>
//       <div className="modal-content-lead" onClick={(e) => e.stopPropagation()}>
//         {/* Header */}
//         <div className="modal-header-lead">
//           <h2>{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
//           <button className="btn-close-modal-lead" onClick={onClose}>
//             <FiX size={24} />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="lead-form">
//           {/* Name */}
//           <div className="form-group-lead">
//             <label className="form-label-lead">Name *</label>
//             <input
//               type="text"
//               className={`form-input-lead ${errors.customer_name ? 'error' : ''}`}
//               value={formData.customer_name}
//               onChange={(e) => handleChange('customer_name', e.target.value)}
//               placeholder="Enter full name"
//             />
//             {errors.customer_name && <span className="error-text">{errors.customer_name}</span>}
//           </div>

//           {/* Phone */}
//           <div className="form-group-lead">
//             <label className="form-label-lead">Phone *</label>
//             <input
//               type="tel"
//               className={`form-input-lead ${errors.phone ? 'error' : ''}`}
//               value={formData.phone}
//               onChange={(e) => handleChange('phone', e.target.value)}
//               placeholder="+919876543210"
//             />
//             {errors.phone && <span className="error-text">{errors.phone}</span>}
//           </div>

//           {/* Email */}
//           <div className="form-group-lead">
//             <label className="form-label-lead">Email (Optional)</label>
//             <input
//               type="email"
//               className={`form-input-lead ${errors.email ? 'error' : ''}`}
//               value={formData.email}
//               onChange={(e) => handleChange('email', e.target.value)}
//               placeholder="email@example.com"
//             />
//             {errors.email && <span className="error-text">{errors.email}</span>}
//           </div>

//           {/* 🆕 Property Interested Dropdown */}
//          <div className="form-group-lead">
//   <label className="form-label-lead">Property Interested In</label>

//   <select
//     className="form-select-lead"
//     value={formData.property_interested}
//     onChange={(e) => handleChange('property_interested', e.target.value)}
//     disabled={loadingProperties}
//   >
//     <option value="">
//       {loadingProperties ? 'Loading properties...' : 'Select a property'}
//     </option>

//     {properties.map((item) => (
//       <option
//         key={item.property_details.id}
//         value={item.property_details.id}
//       >
//         {item.property_details.name}
//       </option>
//     ))}
//   </select>

//   {!loadingProperties && properties.length === 0 && (
//     <span className="info-text">No authorized properties available</span>
//   )}
// </div>


//           {/* Status */}
//           <div className="form-group-lead">
//             <label className="form-label-lead">Status</label>
//             <select
//               className="form-select-lead"
//               value={formData.status}
//               onChange={(e) => handleChange('status', e.target.value)}
//             >
//               {statusOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Last Contact Date */}
//           <div className="form-group-lead">
//             <label className="form-label-lead">Last Contact Date</label>
//             <input
//               type="date"
//               className="form-input-lead"
//               value={formData.last_contact_date}
//               onChange={(e) => handleChange('last_contact_date', e.target.value)}
//             />
//           </div>

//           {/* Notes */}
//           <div className="form-group-lead full-width">
//             <label className="form-label-lead">Notes</label>
//             <textarea
//               className="form-textarea-lead"
//               value={formData.notes}
//               onChange={(e) => handleChange('notes', e.target.value)}
//               placeholder="Add any additional notes about this lead..."
//               rows={4}
//             />
//           </div>

//           {/* Actions */}
//           <div className="form-actions-lead">
//             <button
//               type="button"
//               className="btn-cancel-lead"
//               onClick={onClose}
//               disabled={submitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="btn-submit-lead"
//               disabled={submitting || loadingProperties}
//             >
//               {submitting ? 'Saving...' : lead ? 'Update Lead' : 'Add Lead'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CPLeadForm;



// CPLeadForm.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import cpLeadService from '../../services/cpLeadService';
import '../../styles/cp/CPLeadForm.css';

const CPLeadForm = ({ lead = null, onSubmit, onClose }) => {
  // ✅ CHANGED: Use interested_property to match backend
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    interested_property: '', // ✅ CHANGED from property_interested
    lead_status: 'new',      // ✅ CHANGED from status
    notes: '',
    next_follow_up_date: '', // ✅ CHANGED from last_contact_date
    lead_source: ''          // ✅ ADDED
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Fetch properties on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // Load lead data if editing
  useEffect(() => {
    if (lead) {
      setFormData({
        customer_name: lead.customer_name || lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        interested_property: lead.interested_property || '',
        lead_status: lead.lead_status || lead.status || 'new',
        notes: lead.notes || '',
        next_follow_up_date: lead.next_follow_up_date || '',
        lead_source: lead.lead_source || ''
      });
    }
  }, [lead]);

  // Fetch authorized properties
  const fetchProperties = async () => {
    try {
      setLoadingProperties(true);
      const data = await cpLeadService.getAuthorizedProperties();
      console.log('📦 Loaded properties:', data);
      setProperties(data || []);
    } catch (error) {
      console.error('❌ Failed to load properties:', error);
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }

    // Debug property selection
    if (field === 'interested_property') {
      console.log('🏢 Selected property ID:', value);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\+91[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must start with +91 and be 10 digits';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // ✅ Prepare payload with correct field names and types
      const payload = {
        customer_name: formData.customer_name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        // ✅ Convert to integer or null
        interested_property: formData.interested_property 
          ? parseInt(formData.interested_property) 
          : null,
        lead_status: formData.lead_status,
        notes: formData.notes.trim(),
        next_follow_up_date: formData.next_follow_up_date || null,
        lead_source: formData.lead_source.trim()
      };

      console.log('📤 Submitting lead:', payload);
      await onSubmit(payload);
    } catch (err) {
      console.error('❌ Failed to save lead:', err);
      alert('Failed to save lead');
    } finally {
      setSubmitting(false);
    }
  };

  const statusOptions = cpLeadService.getStatusOptions();

  return (
    <div className="modal-overlay-lead" onClick={onClose}>
      <div className="modal-content-lead" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-lead">
          <h2>{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button className="btn-close-modal-lead" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="lead-form">
          {/* Name */}
          <div className="form-group-lead">
            <label className="form-label-lead">Name *</label>
            <input
              type="text"
              className={`form-input-lead ${errors.customer_name ? 'error' : ''}`}
              value={formData.customer_name}
              onChange={(e) => handleChange('customer_name', e.target.value)}
              placeholder="Enter full name"
            />
            {errors.customer_name && <span className="error-text">{errors.customer_name}</span>}
          </div>

          {/* Phone */}
          <div className="form-group-lead">
            <label className="form-label-lead">Phone *</label>
            <input
              type="tel"
              className={`form-input-lead ${errors.phone ? 'error' : ''}`}
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+919876543210"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          {/* Email */}
          <div className="form-group-lead">
            <label className="form-label-lead">Email</label>
            <input
              type="email"
              className={`form-input-lead ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="email@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Property Selection - FIXED */}
          <div className="form-group-lead">
            <label className="form-label-lead">Property Interested In</label>
            <select
              className="form-select-lead"
              value={formData.interested_property}
              onChange={(e) => handleChange('interested_property', e.target.value)}
              disabled={loadingProperties}
            >
              <option value="">
                {loadingProperties ? 'Loading properties...' : 'Select a property (optional)'}
              </option>

              {properties.map((item) => (
                <option
                  key={item.property_details.id}
                  value={item.property_details.id}
                >
                  {item.property_details.name} - {item.property_details.location}
                </option>
              ))}
            </select>

            {!loadingProperties && properties.length === 0 && (
              <span className="info-text" style={{ color: '#888', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                ℹ️ No authorized properties available
              </span>
            )}
          </div>

          {/* Lead Status */}
          <div className="form-group-lead">
            <label className="form-label-lead">Lead Status</label>
            <select
              className="form-select-lead"
              value={formData.lead_status}
              onChange={(e) => handleChange('lead_status', e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Next Follow-up Date */}
          <div className="form-group-lead">
            <label className="form-label-lead">Next Follow-up Date</label>
            <input
              type="date"
              className="form-input-lead"
              value={formData.next_follow_up_date}
              onChange={(e) => handleChange('next_follow_up_date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Lead Source */}
          <div className="form-group-lead">
            <label className="form-label-lead">Lead Source</label>
            <input
              type="text"
              className="form-input-lead"
              value={formData.lead_source}
              onChange={(e) => handleChange('lead_source', e.target.value)}
              placeholder="e.g., Website, Referral, Cold Call"
            />
          </div>

          {/* Notes */}
          <div className="form-group-lead full-width">
            <label className="form-label-lead">Notes</label>
            <textarea
              className="form-textarea-lead"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Add any additional notes about this lead..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="form-actions-lead">
            <button
              type="button"
              className="btn-cancel-lead"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit-lead"
              disabled={submitting || loadingProperties}
            >
              {submitting ? 'Saving...' : lead ? 'Update Lead' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CPLeadForm;