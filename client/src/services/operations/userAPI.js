import { apiConnector } from '../apiConnector';
import { userEndpoints } from '../api';

const { UPDATEUSER_API, DELETEUSER_API } = userEndpoints;

// Update User (Change role, etc.)
export const updateUser = async (userId, updates) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiConnector(
      'PUT',
      UPDATEUSER_API(userId),
      updates,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log('UPDATE USER API RESPONSE............', response);

    if (!response.data) {
      throw new Error('User update failed');
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('UPDATE USER API ERROR............', error);
    const errorMsg = error?.response?.data?.msg || error?.message || 'User update failed';
    return {
      success: false,
      message: errorMsg,
    };
  }
};

// Delete User
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiConnector(
      'DELETE',
      DELETEUSER_API(userId),
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log('DELETE USER API RESPONSE............', response);

    if (!response.data) {
      throw new Error('User deletion failed');
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('DELETE USER API ERROR............', error);
    const errorMsg = error?.response?.data?.msg || error?.message || 'User deletion failed';
    return {
      success: false,
      message: errorMsg,
    };
  }
};
