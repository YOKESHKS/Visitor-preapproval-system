import api from '../api/api';

export const securityService = {
  getTodayVisitors: async () => {
    return await api.get('/security/today');
  },

  getVisitorsInside: async () => {
    return await api.get('/security/inside');
  },

  approveVisitor: async (visitId) => {
    return await api.put(`/security/approve/${visitId}`);
  },

  checkInVisitor: async (visitId) => {
    return await api.put(`/security/checkin/${visitId}`);
  },

  checkOutVisitor: async (visitId) => {
    return await api.put(`/security/checkout/${visitId}`);
  },

  // Freeze Endpoints matching RegistrationFreezeController
  freezeDate: async (freezeData) => {
    return await api.post('/freeze', freezeData);
  },

  getAllFreezeDates: async () => {
    return await api.get('/freeze');
  }
};