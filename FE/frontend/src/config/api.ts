// Cấu hình API
export const API_BASE_URL = 'http://103.6.234.20:3000';

// Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  
  // Posts
  GET_POSTS: `${API_BASE_URL}/posts`,
  GET_POST_BY_ID: (id: string) => `${API_BASE_URL}/posts/${id}`,  
  // Ingredients
  GET_INGREDIENTS: `${API_BASE_URL}/ingredients`,
  GET_INGREDIENT_BY_ID: (id: string) => `${API_BASE_URL}/ingredients/${id}`,  
  // Users
  GET_USERS: `${API_BASE_URL}/users`,
  GET_USER_BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,
};