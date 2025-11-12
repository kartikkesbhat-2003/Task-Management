import { apiConnector } from '../apiConnector';
import { taskEndpoints } from '../api';

const {
  CREATETASK_API,
  GETALLTASKS_API,
  GETTASKBYID_API,
  UPDATETASK_API,
  DELETETASK_API,
} = taskEndpoints;

// Create Task (Admin Only)
export const createTask = async (taskData) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiConnector('POST', CREATETASK_API, taskData, {
      Authorization: `Bearer ${token}`,
    });

    console.log('CREATE TASK API RESPONSE............', response);

    if (!response.data) {
      throw new Error('Task creation failed');
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('CREATE TASK API ERROR............', error);
    const errorMsg = error?.response?.data?.msg || error?.message || 'Task creation failed';
    return {
      success: false,
      message: errorMsg,
    };
  }
};

// Get All Tasks with optional filters
export const getAllTasks = async (filters = {}) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiConnector(
      'GET',
      GETALLTASKS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      filters // { page, limit, priority }
    );

    console.log('GET ALL TASKS API RESPONSE............', response);

    if (!response.data) {
      throw new Error('Failed to fetch tasks');
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('GET ALL TASKS API ERROR............', error);
    const errorMsg = error?.response?.data?.msg || error?.message || 'Failed to fetch tasks';
    return {
      success: false,
      message: errorMsg,
    };
  }
};

// Get Task by ID
export const getTaskById = async (taskId) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiConnector('GET', GETTASKBYID_API(taskId), null, {
      Authorization: `Bearer ${token}`,
    });

    console.log('GET TASK BY ID API RESPONSE............', response);

    if (!response.data) {
      throw new Error('Failed to fetch task');
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('GET TASK BY ID API ERROR............', error);
    const errorMsg = error?.response?.data?.msg || error?.message || 'Failed to fetch task';
    return {
      success: false,
      message: errorMsg,
    };
  }
};

// Update Task
export const updateTask = async (taskId, updates) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiConnector('PUT', UPDATETASK_API(taskId), updates, {
      Authorization: `Bearer ${token}`,
    });

    console.log('UPDATE TASK API RESPONSE............', response);

    if (!response.data) {
      throw new Error('Task update failed');
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('UPDATE TASK API ERROR............', error);
    const errorMsg = error?.response?.data?.msg || error?.message || 'Task update failed';
    return {
      success: false,
      message: errorMsg,
    };
  }
};

// Delete Task (Admin Only)
export const deleteTask = async (taskId) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiConnector('DELETE', DELETETASK_API(taskId), null, {
      Authorization: `Bearer ${token}`,
    });

    console.log('DELETE TASK API RESPONSE............', response);

    if (!response.data) {
      throw new Error('Task deletion failed');
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('DELETE TASK API ERROR............', error);
    const errorMsg = error?.response?.data?.msg || error?.message || 'Task deletion failed';
    return {
      success: false,
      message: errorMsg,
    };
  }
};

// Update Task Status (User can update status only)
export const updateTaskStatus = async (taskId, status) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await apiConnector(
      'PUT',
      UPDATETASK_API(taskId),
      { status },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log('UPDATE TASK STATUS API RESPONSE............', response);

    if (!response.data) {
      throw new Error('Status update failed');
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('UPDATE TASK STATUS API ERROR............', error);
    const errorMsg = error?.response?.data?.msg || error?.message || 'Status update failed';
    return {
      success: false,
      message: errorMsg,
    };
  }
};
