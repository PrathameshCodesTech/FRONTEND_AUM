// services/rmService.js
// =====================================================
// RM Service - API calls for Relationship Manager
// =====================================================

import api from './api';

const rmService = {
  /* -------------------- Dashboard -------------------- */
  getDashboard: async () => {
    try {
      const response = await api.get('/rm/dashboard/');
      return response.data;
    } catch (error) {
      console.error('Get dashboard error:', error);
      throw error;
    }
  },

  /* -------------------- Customers -------------------- */
  getCustomers: async (params = {}) => {
    try {
      const response = await api.get('/rm/customers/', { params });
      return response.data;
    } catch (error) {
      console.error('Get customers error:', error);
      throw error;
    }
  },

  getCustomerDetail: async (customerId) => {
    try {
      const response = await api.get(`/rm/customers/${customerId}/`);
      return response.data;
    } catch (error) {
      console.error('Get customer detail error:', error);
      throw error;
    }
  },

  assignCustomer: async (data) => {
    try {
      const response = await api.post('/rm/customers/assign/', data);
      return response.data;
    } catch (error) {
      console.error('Assign customer error:', error);
      throw error;
    }
  },

  transferCustomer: async (data) => {
    try {
      const response = await api.post('/rm/customers/transfer/', data);
      return response.data;
    } catch (error) {
      console.error('Transfer customer error:', error);
      throw error;
    }
  },

  /* -------------------- Activities -------------------- */
  getActivities: async (params = {}) => {
    try {
      const response = await api.get('/rm/activities/', { params });
      return response.data;
    } catch (error) {
      console.error('Get activities error:', error);
      throw error;
    }
  },

  createActivity: async (data) => {
    try {
      const response = await api.post('/rm/activities/', data);
      return response.data;
    } catch (error) {
      console.error('Create activity error:', error);
      throw error;
    }
  },

  /* -------------------- Leads -------------------- */
  getLeads: async (params = {}) => {
    try {
      const response = await api.get('/rm/leads/', { params });
      return response.data;
    } catch (error) {
      console.error('Get leads error:', error);
      throw error;
    }
  },

  getLeadDetail: async (leadId) => {
    try {
      const response = await api.get(`/rm/leads/${leadId}/`);
      return response.data;
    } catch (error) {
      console.error('Get lead detail error:', error);
      throw error;
    }
  },

  createLead: async (data) => {
    try {
      const response = await api.post('/rm/leads/', data);
      return response.data;
    } catch (error) {
      console.error('Create lead error:', error);
      throw error;
    }
  },

  updateLead: async (leadId, data) => {
    try {
      const response = await api.put(`/rm/leads/${leadId}/`, data);
      return response.data;
    } catch (error) {
      console.error('Update lead error:', error);
      throw error;
    }
  },

  deleteLead: async (leadId) => {
    try {
      const response = await api.delete(`/rm/leads/${leadId}/`);
      return response.data;
    } catch (error) {
      console.error('Delete lead error:', error);
      throw error;
    }
  },

  /* -------------------- Targets -------------------- */
  getTargets: async (params = {}) => {
    try {
      const response = await api.get('/rm/targets/', { params });
      return response.data;
    } catch (error) {
      console.error('Get targets error:', error);
      throw error;
    }
  },

  /* -------------------- Reports -------------------- */
  getReports: async (params = {}) => {
    try {
      const response = await api.get('/rm/reports/', { params });
      return response.data;
    } catch (error) {
      console.error('Get reports error:', error);
      throw error;
    }
  },

  /* -------------------- KYC -------------------- */
  getPendingKYC: async () => {
    try {
      const response = await api.get('/rm/kyc/pending/');
      return response.data;
    } catch (error) {
      console.error('Get pending KYC error:', error);
      throw error;
    }
  },

  /* -------------------- RM Profiles (Admin) -------------------- */
  getRMProfiles: async (params = {}) => {
    try {
      const response = await api.get('/rm/profiles/', { params });
      return response.data;
    } catch (error) {
      console.error('Get RM profiles error:', error);
      throw error;
    }
  }
};

export default rmService;