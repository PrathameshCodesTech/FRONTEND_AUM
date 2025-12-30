// cpCommissionService.js
// =====================================================
// Service for CP Commission Tracking
// Handles: Commission History, Calculations
// =====================================================

import api from './api';

const cpCommissionService = {
  /**
   * Get all commissions
   * GET /api/cp/commissions/
   */
  getCommissions: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) {
        params.append('status', filters.status);
      }

      const response = await api.get(`/cp/commissions/?${params.toString()}`);
      return {
        success: true,
        count: response.data.count,
        data: response.data.results
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch commissions'
      };
    }
  },

    /**
   * Get commission statistics
   * GET /api/cp/commissions/stats/
   */
  getStats: async () => {
    try {
      const response = await api.get('/cp/commissions/stats/');
      
      return {
        success: true,
        data: response.data.data || {}
      };
    } catch (error) {
      console.error('❌ Error fetching commission stats:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch stats',
        data: {}
      };
    }
  },

  /**
   * Get commission detail
   * GET /api/cp/commissions/{commission_id}/
   */
  getCommissionDetail: async (commissionId) => {
    try {
      const response = await api.get(`/cp/commissions/${commissionId}/`);
      
      return {
        success: true,
        data: response.data.data || {}
      };
    } catch (error) {
      console.error('❌ Error fetching commission detail:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch commission details',
        data: {}
      };
    }
  },


  /**
   * Get commission summary
   */
  getCommissionSummary: (commissions) => {
    const summary = {
      total: 0,
      pending: 0,
      approved: 0,
      paid: 0,
      count: {
        total: commissions.length,
        pending: 0,
        approved: 0,
        paid: 0
      }
    };

    commissions.forEach(commission => {
      const amount = parseFloat(commission.commission_amount || 0);
      summary.total += amount;

      switch (commission.status) {
        case 'pending':
          summary.pending += amount;
          summary.count.pending++;
          break;
        case 'approved':
          summary.approved += amount;
          summary.count.approved++;
          break;
        case 'paid':
          summary.paid += amount;
          summary.count.paid++;
          break;
        default:
          break;
      }
    });

    return summary;
  },

  /**
   * Format currency
   */
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  },

  /**
   * Get status color
   */
  getStatusColor: (status) => {
    const statusMap = {
      'pending': '#ffc107',
      'approved': '#007bff',
      'paid': '#28a745',
      'rejected': '#dc3545'
    };
    return statusMap[status] || '#6c757d';
  },

  /**
   * Get status label
   */
  getStatusLabel: (status) => {
    const labelMap = {
      'pending': 'Pending',
      'approved': 'Approved',
      'paid': 'Paid',
      'rejected': 'Rejected'
    };
    return labelMap[status] || status;
  },

  /**
   * Calculate commission percentage
   */
  calculatePercentage: (commissionAmount, investmentAmount) => {
    if (investmentAmount === 0) return 0;
    return ((commissionAmount / investmentAmount) * 100).toFixed(2);
  },

  /**
   * Format date
   */
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Get commission chart data
   */
  getChartData: (commissions) => {
    // Group by month
    const monthlyData = {};
    
    commissions.forEach(commission => {
      const date = new Date(commission.calculated_at);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          month: monthYear,
          pending: 0,
          approved: 0,
          paid: 0
        };
      }
      
      const amount = parseFloat(commission.commission_amount || 0);
      monthlyData[monthYear][commission.status] += amount;
    });

    return Object.values(monthlyData);
  },

  /**
   * Filter commissions by date range
   */
  filterByDateRange: (commissions, startDate, endDate) => {
    return commissions.filter(commission => {
      const date = new Date(commission.calculated_at);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return date >= start && date <= end;
    });
  },

  /**
   * Get top earning properties
   */
  getTopProperties: (commissions, limit = 5) => {
    const propertyMap = {};
    
    commissions.forEach(commission => {
      const propertyName = commission.investment?.property?.name || 'Unknown';
      const amount = parseFloat(commission.commission_amount || 0);
      
      if (!propertyMap[propertyName]) {
        propertyMap[propertyName] = {
          name: propertyName,
          total: 0,
          count: 0
        };
      }
      
      propertyMap[propertyName].total += amount;
      propertyMap[propertyName].count++;
    });

    return Object.values(propertyMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
  }
};

export default cpCommissionService;