import axiosInstance from './axiosInstance';

// API cho authentication
export const authApi = {
  // Đăng nhập
  login: async (credentials) => {
    try {
      console.log("=== LOGIN API CALL ===");
      console.log("Credentials:", credentials);
      
      const response = await axiosInstance.post('/auth/login', credentials);
      
      console.log("=== LOGIN API RESPONSE ===");
      console.log("Full API Response:", response.data);
      console.log("Token from API:", response.data.token);
      console.log("User from API:", response.data.user);
      
      return response.data;
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      const response = await axiosInstance.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error("Logout API error:", error);
      throw error;
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await axiosInstance.get('/auth/verify');
      return response.data;
    } catch (error) {
      console.error("Verify token API error:", error);
      throw error;
    }
  }
};

// API cho quản lý users/accounts
export const accountApi = {
  // Lấy danh sách tài khoản
  getAll: async () => {
    try {
      console.log("=== GET ACCOUNTS API CALL ===");
      const response = await axiosInstance.get('/admin/users');
      
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get accounts API error:", error);
      throw error;
    }
  },

  // Lấy thông tin 1 tài khoản
  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get account by ID API error:", error);
      throw error;
    }
  },

  // Tạo tài khoản mới
  create: async (userData) => {
    try {
      console.log("=== CREATE ACCOUNT API CALL ===");
      console.log("User data:", userData);
      
      const response = await axiosInstance.post('/admin/users', userData);
      
      console.log("Create account success:", response.data);
      return response.data;
    } catch (error) {
      console.error("Create account API error:", error);
      throw error;
    }
  },

  // Cập nhật tài khoản
  update: async (id, userData) => {
    try {
      console.log("=== UPDATE ACCOUNT API CALL ===");
      console.log("Account ID:", id);
      console.log("User data:", userData);
      
      const response = await axiosInstance.put(`/admin/users/${id}`, userData);
      
      console.log("Update account success:", response.data);
      return response.data;
    } catch (error) {
      console.error("Update account API error:", error);
      throw error;
    }
  },

  // Xóa tài khoản
  delete: async (id) => {
    try {
      console.log("=== DELETE ACCOUNT API CALL ===");
      console.log("Account ID:", id);
      
      const response = await axiosInstance.delete(`/admin/users/${id}`);
      
      console.log("Delete account success:", response.data);
      return response.data;
    } catch (error) {
      console.error("Delete account API error:", error);
      throw error;
    }
  },

  // Tìm kiếm tài khoản
  search: async (searchParams) => {
    try {
      const response = await axiosInstance.get('/admin/users/search', {
        params: searchParams
      });
      return response.data;
    } catch (error) {
      console.error("Search accounts API error:", error);
      throw error;
    }
  }
};

// Export default object chứa tất cả APIs
export default {
  auth: authApi,
  account: accountApi
};
