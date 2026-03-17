// src/services/proveedorService.js
import axiosInstance from '../api/axiosInstance';

const proveedorService = {
  getAllProveedores: async () => {
    return (await axiosInstance.get('/proveedores')).data;
  },

  createProveedor: async (data) => {
    return (await axiosInstance.post('/proveedores', data)).data;
  },

  updateProveedor: async (id, data) => {
    return (await axiosInstance.put(`/proveedores/${id}`, data)).data;
  },

  deleteProveedor: async (id) => {
    return (await axiosInstance.delete(`/proveedores/${id}`)).data;
  },
};

export default proveedorService;
