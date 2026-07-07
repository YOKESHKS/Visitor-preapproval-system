import api from '../api/api';
import { authService } from './authService';

export const visitorService = {

  registerVisitor: async (visitorData) => {
    return await api.post('/visitors', visitorData);
  },

  updateVisitor: async (id, visitorData) => {
    return await api.put(`/visitors/${id}`, visitorData);
  },

  cancelVisitor: async (id) => {
    return await api.put(`/visitors/cancel/${id}`);
  },

  getMyVisitors: async (fallbackId = null) => {

    const currentUser = authService.getCurrentUser();

    const employeeId =
      fallbackId ||
      currentUser?.employeeId ||
      currentUser?.id ||
      currentUser?.username ||
      '';

    return await api.get(`/visitors/employee/${employeeId}`);
  },

  // Search by Visit ID
  searchVisitors: async (searchParams) => {

    const visitId = searchParams.visitId?.trim();

    if (!visitId) {
      return {
        data: {
          data: []
        }
      };
    }

    const response = await api.get(`/search/${visitId}`);

    return {
      data: {
        data: response.data.data ? [response.data.data] : []
      }
    };
  },
  getQrCodeBlob: async (visitId) => {
  return await api.get(`/qrcode/download/${visitId}`, { responseType: 'blob' });
},

  // Load all visitors
  getAllVisitors: async () => {
    return await api.get('/visitors');
  },

  getVisitorByVisitId: async (visitId) => {
    return await api.get(`/visitors/visit/${visitId}`);
  }

};