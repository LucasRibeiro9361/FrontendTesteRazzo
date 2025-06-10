import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configurar o token de autenticação para todas as requisições
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Serviços de autenticação
export const authService = {
  // Registrar um novo usuário
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setAuthToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Login de usuário
  login: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setAuthToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Carregar usuário autenticado
  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }

    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      setAuthToken(null);
      throw error.response.data;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    setAuthToken(null);
  },

  // Verificar se o usuário está autenticado
  isAuthenticated: () => {
    return localStorage.getItem('token') ? true : false;
  }
};

// Serviços para posts do blog
export const postService = {
  // Obter todos os posts
  getPosts: async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Obter um post específico
  getPost: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Criar um novo post
  createPost: async (postData) => {
    try {
      const response = await axios.post(`${API_URL}/posts`, postData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Atualizar um post existente
  updatePost: async (id, postData) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
      }
      const response = await axios.patch(`${API_URL}/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error('Erro na API updatePost:', error);
      throw error.response?.data || { message: 'Erro ao atualizar post' };
    }
  },

  // Excluir um post
  deletePost: async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
      }
      const response = await axios.delete(`${API_URL}/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro na API deletePost:', error);
      throw error.response?.data || { message: 'Erro ao excluir post' };
    }
  },

  // Upload de imagem
  uploadImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await axios.post(`${API_URL}/posts/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};

