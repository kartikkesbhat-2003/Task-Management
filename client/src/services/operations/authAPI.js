import { apiConnector } from '../apiConnector';
import { authEndpoints, userEndpoints } from '../api';

const { SIGNUP_API, LOGIN_API, ME_API } = authEndpoints;
const { GETALLUSERS_API } = userEndpoints;

// Sign Up
export const signUp = async (name, email, password, role = 'user') => {
  try {
    const response = await apiConnector('POST', SIGNUP_API, {
      name,
      email,
      password,
      role,
    });

    console.log('SIGNUP API RESPONSE............', response);

    if (!response.data) {
      throw new Error('Signup Failed');
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('SIGNUP API ERROR............', error);
    const errorMsg = error?.response?.data?.msg || error?.message || 'Signup Failed';
    return {
      success: false,
      message: errorMsg,
    };
  }
};

// Login
export const login = async (email, password) => {
  try {
    const response = await apiConnector('POST', LOGIN_API, {
      email,
      password,
    });

    console.log('LOGIN API RESPONSE............', response);

    if (!response.data) {
      throw new Error('Login Failed');
    }

    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('LOGIN API ERROR............', error);
    const errorMsg = error?.response?.data?.msg || error?.message || 'Login Failed';
    return {
      success: false,
      message: errorMsg,
    };
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiConnector('GET', ME_API, null, {
      Authorization: `Bearer ${token}`,
    });

    console.log('GET CURRENT USER API RESPONSE............', response);

    if (!response.data) {
      throw new Error('Failed to fetch user');
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('GET CURRENT USER API ERROR............', error);
    const errorMsg = error?.response?.data?.msg || error?.message || 'Failed to fetch user';
    return {
      success: false,
      message: errorMsg,
    };
  }
};

// Logout
export const logout = () => {
  try {
    localStorage.removeItem('token');
    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    console.error('LOGOUT ERROR............', error);
    return {
      success: false,
      message: 'Logout Failed',
    };
  }
};

// Get All Users (Admin Only)
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiConnector('GET', GETALLUSERS_API, null, {
      Authorization: `Bearer ${token}`,
    });

    console.log('GET ALL USERS API RESPONSE............', response);

    if (!response.data) {
      throw new Error('Failed to fetch users');
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('GET ALL USERS API ERROR............', error);
    const errorMsg = error?.response?.data?.msg || error?.message || 'Failed to fetch users';
    return {
      success: false,
      message: errorMsg,
    };
  }
};
