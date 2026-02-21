import api from "./api";

const adminService = {
  // ========================================
  // DASHBOARD STATS
  // ========================================
  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard/stats/");
    return response.data;
  },

  // ========================================
  // USER MANAGEMENT
  // ========================================

    createUser: async(userData) =>{
    const response = await api.post("/admin/users/create/", userData);
    return response.data;
  },

  getUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/users/?${params}`);

    return {
      success: true,
      results: response.data.results,
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
    };
  },

  getUserDetail: async (userId) => {
    const response = await api.get(`/admin/users/${userId}/`);
    return response.data;
  },

   updateUser: async (userId, userData) => {
  const response = await api.patch(
    `/admin/users/${userId}/update/`,
    userData
  );
  return response.data;
  },
  
  userAction: async (userId, action, reason = "") => {
    const response = await api.post(`/admin/users/${userId}/action/`, {
      action,
      reason,
    });
    return response.data;
  },

  // ========================================
  // KYC MANAGEMENT
  // ========================================
  getPendingKYC: async () => {
    const response = await api.get("/admin/kyc/pending/");
    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
    };
  },

  getAllKYC: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/kyc/all/?${params}`);
    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
    };
  },

  getKYCDetail: async (kycId) => {
    const response = await api.get(`/admin/kyc/${kycId}/`);
    return response.data;
  },

  kycAction: async (kycId, action, reason = "") => {
    const response = await api.post(`/admin/kyc/${kycId}/action/`, {
      action,
      rejection_reason: reason,
    });
    return response.data;
  },

  // ========================================
  // PROPERTY MANAGEMENT
  // ========================================
  getProperties: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/properties/?${params}`);

    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
      next: response.data.next,
      previous: response.data.previous,
    };
  },

  getPropertyDetail: async (propertyId) => {
    const response = await api.get(`/admin/properties/${propertyId}/`);
    return response.data;
  },

  createProperty: async (formData) => {
    const response = await api.post("/admin/properties/create/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateProperty: async (propertyId, formData) => {
    const response = await api.put(
      `/admin/properties/${propertyId}/update/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  deleteProperty: async (propertyId) => {
    const response = await api.delete(
      `/admin/properties/${propertyId}/delete/`
    );
    return response.data;
  },

  propertyAction: async (propertyId, action) => {
    const response = await api.post(`/admin/properties/${propertyId}/action/`, {
      action,
    });
    return response.data;
  },

  // ========================================
  // IMAGE MANAGEMENT
  // ========================================
  getPropertyImages: async (propertyId) => {
    const response = await api.get(`/admin/properties/${propertyId}/images/`);
    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
    };
  },

  uploadPropertyImage: async (propertyId, formData) => {
    const response = await api.post(
      `/admin/properties/${propertyId}/images/upload/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  deletePropertyImage: async (propertyId, imageId) => {
    const response = await api.delete(
      `/admin/properties/${propertyId}/images/${imageId}/`
    );
    return response.data;
  },

  // ========================================
  // DOCUMENT MANAGEMENT
  // ========================================
  getPropertyDocuments: async (propertyId) => {
    const response = await api.get(
      `/admin/properties/${propertyId}/documents/`
    );
    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
    };
  },

  uploadPropertyDocument: async (propertyId, formData) => {
    const response = await api.post(
      `/admin/properties/${propertyId}/documents/upload/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  deletePropertyDocument: async (propertyId, documentId) => {
    const response = await api.delete(
      `/admin/properties/${propertyId}/documents/${documentId}/`
    );
    return response.data;
  },

  // ========================================
  // UNIT MANAGEMENT
  // ========================================
  getPropertyUnits: async (propertyId) => {
    const response = await api.get(`/admin/properties/${propertyId}/units/`);
    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
    };
  },

  createPropertyUnit: async (propertyId, data) => {
    const response = await api.post(
      `/admin/properties/${propertyId}/units/create/`,
      data
    );
    return response.data;
  },

  updatePropertyUnit: async (propertyId, unitId, data) => {
    const response = await api.put(
      `/admin/properties/${propertyId}/units/${unitId}/update/`,
      data
    );
    return response.data;
  },

  deletePropertyUnit: async (propertyId, unitId) => {
    const response = await api.delete(
      `/admin/properties/${propertyId}/units/${unitId}/`
    );
    return response.data;
  },

  getPropertyTypes: async () => {
    const response = await api.get("/admin/properties/types/");
    return response.data;
  },

  // ========================================
  // INVESTMENT MANAGEMENT
  // ========================================
  getInvestmentStats: async () => {
    const response = await api.get("/admin/investments/stats/");
    return response.data;
  },

  getInvestments: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/investments/?${params}`);

    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
      next: response.data.next,
      previous: response.data.previous,
    };
  },

  getInvestmentDetail: async (investmentId) => {
    const response = await api.get(`/admin/investments/${investmentId}/`);
    return response.data;
  },

  investmentAction: async (investmentId, action, reason = "") => {
    const response = await api.post(
      `/admin/investments/${investmentId}/action/`,
      {
        action,
        rejection_reason: reason,
      }
    );
    return response.data;
  },

  getInvestmentsByProperty: async (propertyId) => {
    const response = await api.get(
      `/admin/investments/by-property/${propertyId}/`
    );
    return response.data;
  },

getInvestmentsByCustomer: async (customerId) => {
  const response = await api.get(
    `/admin/investments/by-customer/${customerId}/`
  );
  
  // Backend returns: { success, customer, total_investments, data: [...] }
  // Normalize to: { success: true, data: [...] }
  return {
    success: true,
    data: response.data.data || response.data.results || [],
    total_investments: response.data.total_investments || 0,
    total_amount: response.data.total_amount || 0,
    total_paid_amount: response.data.total_paid_amount || 0,  // ✅ Add this
    total_due_amount: response.data.total_due_amount || 0      // ✅ Add this
  };
},

// ---- Instalment Payment Management ----

  getAdminInvestmentPayments: async (investmentId) => {
    const response = await api.get(`/admin/investments/${investmentId}/payments/`);
    return response.data;
  },

  adminAddInstalmentPayment: async (investmentId, formData) => {
    const response = await api.post(
      `/admin/investments/${investmentId}/add-payment/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  adminApprovePayment: async (investmentId, paymentId) => {
    const response = await api.post(
      `/admin/investments/${investmentId}/payments/${paymentId}/approve/`
    );
    return response.data;
  },

  adminRejectPayment: async (investmentId, paymentId, reason = '') => {
    const response = await api.post(
      `/admin/investments/${investmentId}/payments/${paymentId}/reject/`,
      { reason }
    );
    return response.data;
  },

  adminDownloadPaymentReceipt: async (investmentId, paymentId) => {
    const response = await api.get(
      `/admin/investments/${investmentId}/payments/${paymentId}/receipt/download/`,
      { responseType: 'blob' }
    );
    return response;
  },

createInvestmentByAdmin: async (formDataPayload) => {
      try {
        const response = await api.post(
          '/admin/investments/create/',
          formDataPayload, // now this is FormData
          {
            headers: {
              // Let Axios handle multipart boundary automatically
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || { error: 'Failed to create investment' };
      }
  },

  // ========================================
  // CP APPLICATION MANAGEMENT
  // ========================================
  getCPApplications: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/admin/cp/applications/?${params}`);
    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
    };
  },

  getCPApplicationDetail: async (applicationId) => {
    const response = await api.get(`/admin/cp/applications/${applicationId}/`);
    return response.data;
  },

  cpApplicationAction: async (applicationId, action, data = {}) => {
    try {
      let endpoint, payload;

      if (action === "approve") {
        endpoint = `/admin/cp/${applicationId}/approve/`;
        payload = {
          partner_tier: data.partner_tier || "bronze",
          program_start_date: new Date().toISOString().split("T")[0],
          notes: data.notes || "Approved after document verification",
        };
      } else if (action === "reject") {
        endpoint = `/admin/cp/${applicationId}/reject/`;
        payload = {
          rejection_reason:
            data.rejection_reason || data.notes || "Application rejected",
        };
      } else {
        throw new Error("Invalid action");
      }

      const response = await api.post(endpoint, payload);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Action completed successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to process application",
        details: error.response?.data,
      };
    }
  },


// adminService.js - FIXED updateCP method

updateCP: async (cpId, cpData) => {
  try {
    // ✅ FIXED: Remove /update/ - backend uses PUT /admin/cp/{cpId}/
    const response = await api.put(`/admin/cp/${cpId}/`, cpData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'CP updated successfully'
    };
  } catch (error) {
    console.error('❌ Update CP Error:', error.response?.data);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to update CP',
      errors: error.response?.data?.errors
    };
  }
},

  // ========================================
  // CP LIST MANAGEMENT (NEW)
  // ========================================
  getCPList: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      // Add filters to params
      if (filters.is_verified !== undefined) {
        params.append("is_verified", filters.is_verified);
      }
      if (filters.is_active !== undefined) {
        params.append("is_active", filters.is_active);
      }
      if (filters.partner_tier) {
        params.append("tier", filters.partner_tier);
      }
      if (filters.search) {
        params.append("search", filters.search);
      }

      const response = await api.get(`/admin/cp/?${params}`);

      return {
        success: true,
        results: response.data.results || response.data,
        count: response.data.count || 0,
      };
    } catch (error) {
      console.error("Error fetching CP list:", error);
      return {
        success: false,
        results: [],
        count: 0,
        error: error.response?.data?.error || "Failed to fetch CP list",
      };
    }
  },

  getCPDetail: async (cpId) => {
    try {
      const response = await api.get(`/admin/cp/${cpId}/`);
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch CP details",
      };
    }
  },

  // ========================================
  // CP ACTIVATION/DEACTIVATION (NEW)
  // ========================================
  activateCP: async (cpId) => {
    try {
      const response = await api.post(`/admin/cp/${cpId}/activate/`);
      return {
        success: true,
        message: response.data.message || "CP activated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to activate CP",
      };
    }
  },

  deactivateCP: async (cpId) => {
    try {
      const response = await api.post(`/admin/cp/${cpId}/deactivate/`);
      return {
        success: true,
        message: response.data.message || "CP deactivated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to deactivate CP",
      };
    }
  },

  // ========================================
  // CP PROPERTY AUTHORIZATION (NEW)
  // ========================================
  authorizePropertiesToCP: async (cpId, propertyIds) => {
    try {
      const response = await api.post(
        `/admin/cp/${cpId}/authorize-properties/`,
        {
          property_ids: propertyIds,
        }
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Properties authorized successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to authorize properties",
      };
    }
  },

  revokePropertyFromCP: async (cpId, propertyId) => {
    try {
      const response = await api.delete(
        `/admin/cp/${cpId}/properties/${propertyId}/`
      );
      return {
        success: true,
        message: response.data.message || "Property authorization revoked",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to revoke authorization",
      };
    }
  },

  getAuthorizedProperties: async (cpId) => {
    try {
      const response = await api.get(`/admin/cp/${cpId}/properties/`);
      return {
        success: true,
        results: response.data.results || response.data,
        count: response.data.count || 0,
      };
    } catch (error) {
      return {
        success: false,
        results: [],
        error:
          error.response?.data?.error ||
          "Failed to fetch authorized properties",
      };
    }
  },

  // Helper: Get all properties for authorization modal
  getAllPropertiesForAuthorization: async () => {
    try {
      const response = await api.get("/admin/properties/");
      return {
        success: true,
        results: response.data.results || response.data,
        count: response.data.count || 0,
      };
    } catch (error) {
      return {
        success: false,
        results: [],
        error: error.response?.data?.error || "Failed to fetch properties",
      };
    }
  },

  createCP: async (cpData) => {
  try {
    const response = await api.post('/admin/cp/create/', cpData);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
      credentials: response.data.credentials
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to create CP',
      errors: error.response?.data?.errors
    };
  }
},


// ========================================
// CP APPLICATION NOTIFICATIONS
// ========================================
getCPApplicationsPendingCount: async () => {
  try {
    const response = await api.get('/admin/cp/applications/', {
      params: { status: 'pending' }
    });
    return {
      success: true,
      count: response.data.count || 0,
    };
  } catch (error) {
    console.error('Error fetching CP applications count:', error);
    return {
      success: false,
      count: 0,
    };
  }
},

// Add these methods to adminService.js

// ========================================
// COMMISSION MANAGEMENT
// ========================================

// Get all commissions
getAllCommissions: async (status = null) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get('/admin/commissions/', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
},

// Get commission stats
getCommissionStats: async () => {
  try {
    const response = await api.get('/admin/commissions/stats/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
},

// Get CP commissions
getCPCommissions: async (cpId, status = null) => {
  try {
    const response = await api.get(`/admin/commissions/by-cp/${cpId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
},

// Approve commission
approveCommission: async (commissionId) => {
  try {
    const response = await api.post(`/admin/commissions/${commissionId}/approve/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
},

// ✅ RENAMED: Payout commission (was payoutCommission)
processCommissionPayout: async (commissionId, paymentReference) => {
  try {
    const response = await api.post(`/admin/commissions/${commissionId}/payout/`, {
      payment_reference: paymentReference
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
},

// Payout commission
payoutCommission: async (commissionId, paymentReference) => {
  try {
    const response = await api.post(`/admin/commissions/${commissionId}/payout/`, {
      payment_reference: paymentReference
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
},

// In adminService.js, add this method in the appropriate section

// ========================================
// INVESTMENT NOTIFICATIONS
// ========================================
// getInvestmentsPendingCount: async () => {
//   try {
//     const response = await api.get('/admin/investments/', {
//       params: { status: 'pending' }
//     });
//     return {
//       success: true,
//       count: response.data.count || 0,
//     };
//   } catch (error) {
//     console.error('Error fetching pending investments count:', error);
//     return {
//       success: false,
//       count: 0,
//     };
//   }
// },
// REPLACE THIS METHOD IN adminService.js:

getInvestmentsPendingCount: async () => {
  try {
    // Fetch investments with pending_payment and payment_approved statuses
    const [pendingPayment, paymentApproved] = await Promise.all([
      api.get('/admin/investments/', { params: { status: 'pending_payment' } }),
      api.get('/admin/investments/', { params: { status: 'payment_approved' } })
    ]);

    const totalCount = 
      (pendingPayment.data.count || 0) + 
      (paymentApproved.data.count || 0);

    console.log('📊 Pending investments breakdown:', {
      pending_payment: pendingPayment.data.count || 0,
      payment_approved: paymentApproved.data.count || 0,
      total: totalCount
    });

    return {
      success: true,
      count: totalCount,
    };
  } catch (error) {
    console.error('❌ Error fetching pending investments count:', error);
    return {
      success: false,
      count: 0,
    };
  }
},

// You can also add a method to get all notification counts at once
getAllNotificationCounts: async () => {
  try {
    const [cpApplications, investments, kyc] = await Promise.all([
      api.get('/admin/cp/applications/', { params: { status: 'pending' } }),
      api.get('/admin/investments/', { params: { status: 'pending' } }),
      api.get('/admin/kyc/pending/')
    ]);

    return {
      success: true,
      cpApplications: cpApplications.data.count || 0,
      investments: investments.data.count || 0,
      kyc: kyc.data.count || 0,
      total: (cpApplications.data.count || 0) + 
             (investments.data.count || 0) + 
             (kyc.data.count || 0)
    };
  } catch (error) {
    console.error('Error fetching notification counts:', error);
    return {
      success: false,
      cpApplications: 0,
      investments: 0,
      kyc: 0,
      total: 0
    };
  }
},

// Bulk payout
bulkPayoutCommissions: async (commissionIds, paymentReference) => {
  try {
    const response = await api.post('/admin/commissions/bulk-payout/', {
      commission_ids: commissionIds,
      payment_reference: paymentReference
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
},


  createPermanentInvite: async (cpId) => {
    try {
      const response = await api.post(`/admin/cp/${cpId}/create-permanent-invite/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create permanent invite' };
    }
  },


// adminService.js
// Make sure this method exists and returns proper format

getCPLeads: async (cpId) => {
  try {
    const response = await api.get(`/admin/cp/${cpId}/leads/`);
    return {
      success: true,
      results: response.data.results || response.data,
      count: response.data.count || 0,
    };
  } catch (error) {
    console.error('Error fetching CP leads:', error);
    return {
      success: false,
      results: [],
      count: 0,
      error: error.response?.data?.error || 'Failed to fetch CP leads',
    };
  }
},

  // Update property status and visibility
  updatePropertyStatus: async (propertyId, statusData) => {
    try {
      const response = await api.put(
        `/admin/properties/${propertyId}/update/`,
        statusData
      );
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Status updated successfully'
      };
    } catch (error) {
      console.error('❌ Error updating property status:', error);
      throw error.response?.data || { message: 'Failed to update property status' };
    }
  },
};

export default adminService;
