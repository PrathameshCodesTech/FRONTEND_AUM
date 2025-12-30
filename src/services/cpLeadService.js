// cpLeadService.js
// =====================================================
// Service for CP Lead Management
// Handles: Create, Read, Update, Delete Leads
// =====================================================

import api from './api';

const cpLeadService = {
  /**
   * Get all leads
   * GET /api/cp/leads/
   */
  getLeads: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const response = await api.get(`/cp/leads/?${params.toString()}`);
      return {
        success: true,
        count: response.data.count,
        data: response.data.results
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch leads'
      };
    }
  },

  /**
   * Get single lead
   * GET /api/cp/leads/{id}/
   */
  getLead: async (leadId) => {
    try {
      const response = await api.get(`/cp/leads/${leadId}/`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch lead'
      };
    }
  },

  /**
   * Create new lead
   * POST /api/cp/leads/
   */
  createLead: async (leadData) => {
    try {
      const response = await api.post('/cp/leads/', leadData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Lead created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create lead',
        details: error.response?.data
      };
    }
  },

  /**
   * Update lead
   * PUT /api/cp/leads/{id}/
   */
  updateLead: async (leadId, leadData) => {
    try {
      const response = await api.put(`/cp/leads/${leadId}/`, leadData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Lead updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update lead',
        details: error.response?.data
      };
    }
  },

  /**
   * Delete lead
   * DELETE /api/cp/leads/{id}/
   */
  deleteLead: async (leadId) => {
    try {
      const response = await api.delete(`/cp/leads/${leadId}/`);
      return {
        success: true,
        message: response.data.message || 'Lead deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete lead'
      };
    }
  },

  /**
   * Convert lead to customer
   * POST /api/cp/leads/{id}/convert/
   */
  convertLead: async (leadId, customerId) => {
    try {
      const response = await api.post(`/cp/leads/${leadId}/convert/`, {
        customer_id: customerId
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Lead converted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to convert lead'
      };
    }
  },
  
    getAuthorizedProperties: async () => {
    try {
      const response = await api.get('/cp/properties/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      return [];
    }
  },

  /**
   * Get lead status options
   */
  getStatusOptions: () => {
    return [
      { value: 'new', label: 'New', color: '#6c757d' },
      { value: 'contacted', label: 'Contacted', color: '#007bff' },
      { value: 'interested', label: 'Interested', color: '#90ee90' },
      { value: 'site_visit_scheduled', label: 'Site Visit Scheduled', color: '#ff9800' },
      { value: 'site_visit_done', label: 'Site Visit Done', color: '#9c27b0' },
      { value: 'negotiation', label: 'Negotiation', color: '#ffc107' },
      { value: 'converted', label: 'Converted', color: '#28a745' },
      { value: 'lost', label: 'Lost', color: '#dc3545' },
      { value: 'not_interested', label: 'Not Interested', color: '#6c757d' }
    ];
  },

  

  /**
   * Get status color
   */
  getStatusColor: (status) => {
    const statusMap = {
      'new': '#6c757d',
      'contacted': '#007bff',
      'interested': '#90ee90',
      'site_visit_scheduled': '#ff9800',
      'site_visit_done': '#9c27b0',
      'negotiation': '#ffc107',
      'converted': '#28a745',
      'lost': '#dc3545',
      'not_interested': '#6c757d'
    };
    return statusMap[status] || '#6c757d';
  }
};

export default cpLeadService;