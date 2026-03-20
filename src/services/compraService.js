import axios from '../api/axios'; // O donde tengas tu configuración de axios
const API_URL = 'https://web-production-d9e15.up.railway.app/api';
const compraService = {
  getAllCompras: async () => {
    try {
      const response = await axiosInstance.get('/compras');
      return response.data;
    } catch (error) {
      console.error('Error al obtener compras:', error);
      throw error;
    }
  },

  createCompra: async (compraData) => {
    try {
      const response = await axiosInstance.post('/compras', compraData);
      return response.data;
    } catch (error) {
      console.error('Error al crear compra:', error);
      throw error;
    }
  },

  updateCompra: async (id, compraData) => {
    try {
      const response = await axiosInstance.put(`/compras/${id}`, compraData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar compra:', error);
      throw error;
    }
  },

  deleteCompra: async (id) => {
    try {
      const response = await axiosInstance.delete(`/compras/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar compra:', error);
      throw error;
    }
  },

  getCompraById: async (id) => {
    try {
      const response = await axiosInstance.get(`/compras/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener compra:', error);
      throw error;
    }
  }
};

export default compraService;