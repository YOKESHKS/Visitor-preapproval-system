const getApiBaseUrl = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE_URL) {
      return process.env.REACT_APP_API_BASE_URL;
    }
  } catch (e) { }
  return 'http://localhost:8080/api';
};

export const API_BASE_URL = getApiBaseUrl();
export const USER_STORAGE_KEY = 'vms_user_session';

export const ROLES = {
  EMPLOYEE: 'ROLE_EMPLOYEE',
  SECURITY: 'ROLE_SECURITY',
  ADMIN: 'ROLE_ADMIN'
};

export const VISITOR_STATUS = {
  REGISTERED: 'REGISTERED',
  APPROVED: 'APPROVED',
  CHECKED_IN: 'CHECKED_IN',
  CHECKED_OUT: 'CHECKED_OUT',
  CANCELLED: 'CANCELLED'
};

export const VISIT_PURPOSES = [
  { value: 'CLIENT_MEETING', label: 'Business / Client Meeting' },
  { value: 'INTERVIEW', label: 'Job Interview' },
  { value: 'VENDOR', label: 'Vendor / Maintenance' },
  { value: 'DELIVERY', label: 'Delivery Personnel' },
  { value: 'OTHER', label: 'Other' }
];