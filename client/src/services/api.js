const BASE_URL = import.meta.env.VITE_API_BASE_URL 

// Auth Endpoints
export const authEndpoints = {
  SIGNUP_API: `${BASE_URL}/auth/register`,
  LOGIN_API: `${BASE_URL}/auth/login`,
  ME_API: `${BASE_URL}/auth/me`,
};

// Task Endpoints
export const taskEndpoints = {
  CREATETASK_API: `${BASE_URL}/tasks`,
  GETALLTASKS_API: `${BASE_URL}/tasks`,
  GETTASKBYID_API: (id) => `${BASE_URL}/tasks/${id}`,
  UPDATETASK_API: (id) => `${BASE_URL}/tasks/${id}`,
  DELETETASK_API: (id) => `${BASE_URL}/tasks/${id}`,
};

// User Endpoints
export const userEndpoints = {
  GETALLUSERS_API: `${BASE_URL}/users`,
  UPDATEUSER_API: (id) => `${BASE_URL}/users/${id}`,
  DELETEUSER_API: (id) => `${BASE_URL}/users/${id}`,
};
