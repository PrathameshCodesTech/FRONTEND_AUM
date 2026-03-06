import api from './api';

const documentService = {
  // Get all documents visible to the current user (COMMON + PROJECT shared with them)
  getMyDocuments: async () => {
    try {
      const response = await api.get('/documents/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch documents' };
    }
  },

  // Download a document by ID
  downloadDocument: async (docId) => {
    try {
      const response = await api.get(`/documents/${docId}/download/`, {
        responseType: 'blob',
      });
      return response;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to download document' };
    }
  },
};

export default documentService;
