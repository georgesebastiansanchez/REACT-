import React, { useState, useEffect } from 'react';
import { AlertCircle, Edit2, Trash2, Plus, Save, X, FileText, DollarSign } from 'lucide-react';
import axios from "axios";


const API_BASE_URL = 'web-production-d9e15.up.railway.app/api';

axios.defaults.baseURL = API_BASE_URL;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
const NavbarAdmin = ({ userData }) => {
  const user = userData || { name: 'Administrador', role: 'admin' };
  const userName = user?.name || user?.username || user?.email || 'Usuario';
  const userRole = user?.role || user?.Rol || 'user';
  const isAdmin = userRole === 'admin' || userRole === 'administrador';

  const handleLogout = () => {
    const confirmLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmLogout) {
      console.log('🚪 Cerrando sesión...');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold d-flex align-items-center text-dark" href={isAdmin ? "/admin" : "/dashboard"}>
          <div style={{ width: '40px', height: '40px', backgroundColor: isAdmin ? '#3B82F6' : '#10B981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>{isAdmin ? 'A' : 'U'}</span>
          </div>
          {isAdmin ? 'Panel Administrador' : 'Panel Usuario'}
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navAdmin">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navAdmin">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><a className="nav-link text-dark" href={isAdmin ? "/admin" : "/dashboard"}><i className="bi bi-speedometer2 me-1"></i>Dashboard</a></li>
            <li className="nav-item"><a className="nav-link text-dark" href="/inventario"><i className="bi bi-clipboard-check me-1"></i>Inventario</a></li>
            {isAdmin && <li className="nav-item"><a className="nav-link text-dark" href="/reportes"><i className="bi bi-graph-up me-1"></i>Reportes</a></li>}
            {isAdmin && <li className="nav-item"><a className="nav-link text-dark" href="/proveedores"><i className="bi bi-truck me-1"></i>Proveedores</a></li>}
            <li className="nav-item"><a className="nav-link text-dark" href="/compras"><i className="bi bi-cart me-1"></i>Compras</a></li>
            <li className="nav-item"><a className="nav-link text-dark" href="/facturas"><i className="bi bi-receipt me-1"></i>Facturas</a></li>
            {isAdmin && <li className="nav-item"><a className="nav-link text-dark" href="/permisos"><i className="bi bi-person-gear me-1"></i>Cuenta y permisos</a></li>}
          </ul>
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3 d-none d-md-inline text-muted">
              <i className={`bi ${isAdmin ? 'bi-shield-check' : 'bi-person-circle'} me-1 text-secondary`}></i>
              {isAdmin ? 'Admin' : 'Usuario'}: <strong className="text-secondary">{userName}</strong>
            </span>
            <button className="btn btn-outline-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-1"></i>Cerrar Sesión</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Servicio real para ventas usando Axios
const ventaService = {
  getAllVentas: async () => {
    try {
      const response = await axios.get('/ventas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      throw error;
    }
  },

  createVenta: async (ventaData) => {
    try {
      console.log('📤 Enviando datos:', ventaData);
      const response = await axios.post('/ventas', ventaData);
      console.log('✅ Respuesta recibida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear venta:', error);
      console.error('❌ Detalles del error:', error.response?.data);
      throw error;
    }
  },

  updateVenta: async (id, ventaData) => {
    try {
      console.log('📤 Actualizando venta:', id, ventaData);
      const response = await axios.put(`/ventas/${id}`, ventaData);
      console.log('✅ Respuesta recibida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar venta:', error);
      console.error('❌ Detalles del error:', error.response?.data);
      throw error;
    }
  },

  deleteVenta: async (id) => {
    try {
      const response = await axios.delete(`/ventas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      throw error;
    }
  },

  getVentaById: async (id) => {
    try {
      const response = await axios.get(`/ventas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener venta:', error);
      throw error;
    }
  }
};

// Hook para manejar ventas con Axios
const useVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarVentas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ventaService.getAllVentas();
      if (response.success) {
        setVentas(response.data || []);
      } else {
        throw new Error(response.message || 'Error al cargar ventas');
      }
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Error al cargar ventas';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para ver las ventas.';
        } else if (status === 500) {
          errorMessage = 'Error interno del servidor.';
        } else {
          errorMessage = data?.message || error.message;
        }
      } else if (error.request) {
        errorMessage = 'Error de conexión. Verifica que el servidor esté funcionando.';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setVentas([]);
    } finally {
      setLoading(false);
    }
  };

  const crearVenta = async (ventaData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Intentando crear venta...', ventaData);
      const response = await ventaService.createVenta(ventaData);
      console.log('📥 Respuesta del servicio:', response);
      if (response.success) {
        await cargarVentas();
        return response;
      } else {
        throw new Error(response.message || 'Error al crear venta');
      }
    } catch (error) {
      console.error('Error al crear venta:', error);
      let errorMessage = 'Error al crear venta';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          if (data?.errors) {
              const validationErrors = Object.values(data.errors).flat().join(', ');
            errorMessage = `Errores de validación: ${validationErrors}`;
          } else {
            errorMessage = data?.message || 'Datos inválidos. Verifica la información ingresada.';
          }
        } else if (status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para crear ventas.';
        } else {
          errorMessage = data?.message || error.message;
        }
      } else if (error.request) {
        errorMessage = 'Error de conexión. Verifica que el servidor esté funcionando.';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const actualizarVenta = async (id, ventaData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ventaService.updateVenta(id, ventaData);
      if (response.success) {
        await cargarVentas();
        return response;
      } else {
        throw new Error(response.message || 'Error al actualizar venta');
      }
    } catch (error) {
      console.error('Error al actualizar venta:', error);
      let errorMessage = 'Error al actualizar venta';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          if (data?.errors) {
            const validationErrors = Object.values(data.errors).flat().join(', ');
            errorMessage = `Errores de validación: ${validationErrors}`;
          } else {
            errorMessage = data?.message || 'Datos inválidos.';
          }
        } else if (status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para actualizar ventas.';
        } else if (status === 404) {
          errorMessage = 'Venta no encontrada.';
        } else {
          errorMessage = data?.message || error.message;
        }
      } else if (error.request) {
        errorMessage = 'Error de conexión. Verifica que el servidor esté funcionando.';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const eliminarVenta = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ventaService.deleteVenta(id);
      if (response.success) {
        setVentas(prev => prev.filter(v => v.IdVenta !== id));
        return response;
      } else {
        throw new Error(response.message || 'Error al eliminar venta');
      }
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      let errorMessage = 'Error al eliminar venta';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          errorMessage = data?.message || 'No se puede eliminar la venta.';
        } else if (status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para eliminar ventas.';
        } else if (status === 404) {
          errorMessage = 'Venta no encontrada.';
        } else {
          errorMessage = data?.message || error.message;
        }
      } else if (error.request) {
        errorMessage = 'Error de conexión. Verifica que el servidor esté funcionando.';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    ventas,
    loading,
    error,
    setError,
    cargarVentas,
    crearVenta,
    actualizarVenta,
    eliminarVenta
  };
};

// Función para formatear fechas al formato YYYY-MM-DD
const formatearFechaParaInput = (fecha) => {
  if (!fecha) return '';
  
  // Si viene como ISO string (2025-09-30T00:00:00.000Z)
  if (fecha.includes('T')) {
    return fecha.split('T')[0];
  }
  
  // Si viene como "30 de sept de 2025" o similar, convertir
  const date = new Date(fecha);
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  return '';
};

// Componente del formulario CORREGIDO
const VentaForm = ({ ventaEditada, onGuardado, onCancelar, loading, crearVenta, actualizarVenta }) => {
  const [formData, setFormData] = useState({
  DocumentoCliente: '',
  FechaVenta: '',
  Total: '',
  MetodoPago: 'Efectivo',
  Estado: 'Pendiente',
  Notas: ''
 });

  const [errors, setErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

useEffect(() => {
  if (ventaEditada) {
    setFormData({
      DocumentoCliente: String(ventaEditada.DocumentoCliente || ''), // ✅ Convertir a string
      FechaVenta: formatearFechaParaInput(ventaEditada.FechaVenta),
      Total: String(ventaEditada.Total || ''), // ✅ También convertir Total
      MetodoPago: ventaEditada.MetodoPago || 'Efectivo',
      Estado: ventaEditada.Estado || 'Pendiente',
      Notas: ventaEditada.Notas || ''
    });
  } else {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      DocumentoCliente: '',
      FechaVenta: today,
      Total: '',
      MetodoPago: 'Efectivo',
      Estado: 'Pendiente',
      Notas: ''
    });
  }
  setErrors({});
}, [ventaEditada]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

const validateForm = () => {
  const newErrors = {};
  
  const docCliente = String(formData.DocumentoCliente || '').trim(); // ✅ Convertir primero
  if (!docCliente) {
    newErrors.DocumentoCliente = 'El documento del cliente es requerido';
  }
  
  if (!formData.FechaVenta) {
    newErrors.FechaVenta = 'La fecha de venta es requerida';
  }
  
  const total = parseFloat(formData.Total);
  if (isNaN(total) || total <= 0) {
    newErrors.Total = 'El total debe ser mayor a 0';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async () => {
    console.log('🎯 handleSubmit ejecutado');
    console.log('📋 Datos del formulario:', formData);
    if (!validateForm()) {
      console.log('❌ Validación fallida');
      return;
    }

    console.log('✅ Validación exitosa');
    setFormLoading(true);
    setErrors({});

    try {
      let result;
      if (ventaEditada) {
        console.log('🔄 Actualizando venta...');
        result = await actualizarVenta(ventaEditada.IdVenta, formData);
      } else {
        console.log('🔄 Creando nueva venta...');
        result = await crearVenta(formData);
      }
      
      console.log('✅ Resultado:', result);
      onGuardado(result);
      
      if (!ventaEditada) {
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          DocumentoCliente: '',
          FechaVenta: today,
          Total: '',
          MetodoPago: 'Efectivo',
          Estado: 'Pendiente',
          Notas: '',
          Usuario: ''
        });
      }
    } catch (error) {
      console.error(error);
      setErrors({ general: error.message });
    } finally {
      setFormLoading(false);
    }
  };

  const isDisabled = loading || formLoading;

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="row align-items-center mb-4">
          <div className="col-auto">
            <div className="bg-success bg-opacity-10 rounded-3 p-3">
              {ventaEditada ? (
                <Edit2 className="text-success" size={24} />
              ) : (
                <Plus className="text-success" size={24} />
              )}
            </div>
          </div>
          <div className="col">
            <h2 className="card-title h4 mb-1">
              {ventaEditada ? 'Editar Venta' : 'Registrar Nueva Venta'}
            </h2>
            <p className="text-muted mb-0">
              {ventaEditada ? 'Modifica los datos de la venta' : 'Completa la información de la venta'}
            </p>
          </div>
        </div>

        {errors.general && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <AlertCircle className="me-2" size={20} />
            <div>{errors.general}</div>
          </div>
        )}

        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Documento Cliente <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person-vcard"></i>
                </span>
                <input
                  type="text"
                  name="DocumentoCliente"
                  className={`form-control ${errors.DocumentoCliente ? 'is-invalid' : ''}`}
                  value={formData.DocumentoCliente}
                  onChange={handleChange}
                  disabled={isDisabled}
                  placeholder="Ej: 1234567890"
                />
              </div>
              {errors.DocumentoCliente && (
                <div className="text-danger small mt-1 d-flex align-items-center">
                  <AlertCircle size={16} className="me-1" />
                  {errors.DocumentoCliente}
                </div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Fecha de Venta <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-calendar"></i>
                </span>
                <input
                  type="date"
                  name="FechaVenta"
                  className={`form-control ${errors.FechaVenta ? 'is-invalid' : ''}`}
                  value={formData.FechaVenta}
                  onChange={handleChange}
                  disabled={isDisabled}
                />
              </div>
              {errors.FechaVenta && (
                <div className="text-danger small mt-1 d-flex align-items-center">
                  <AlertCircle size={16} className="me-1" />
                  {errors.FechaVenta}
                </div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">
                Total <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  name="Total"
                  className={`form-control ${errors.Total ? 'is-invalid' : ''}`}
                  value={formData.Total}
                  onChange={handleChange}
                  disabled={isDisabled}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {errors.Total && (
                <div className="text-danger small mt-1 d-flex align-items-center">
                  <AlertCircle size={16} className="me-1" />
                  {errors.Total}
                </div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">
                Método de Pago <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-credit-card"></i>
                </span>
                <select
                  name="MetodoPago"
                  className="form-select"
                  value={formData.MetodoPago}
                  onChange={handleChange}
                  disabled={isDisabled}
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">
                Estado <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-info-circle"></i>
                </span>
                <select
                  name="Estado"
                  className="form-select"
                  value={formData.Estado}
                  onChange={handleChange}
                  disabled={isDisabled}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="Devuelta">Devuelta</option>
                </select>
              </div>
            </div>

            <div className="col-12 mb-3">
              <label className="form-label fw-semibold">Notas</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-sticky"></i>
                </span>
                <textarea
                  name="Notas"
                  className="form-control"
                  rows="3"
                  value={formData.Notas}
                  onChange={handleChange}
                  disabled={isDisabled}
                  placeholder="Observaciones o notas adicionales"
                />
              </div>
            </div>
          </div>

          <hr />

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-success d-flex align-items-center"
              onClick={handleSubmit}
              disabled={isDisabled}
            >
              {formLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="me-2" size={18} />
                  {ventaEditada ? 'Actualizar Venta' : 'Registrar Venta'}
                </>
              )}
            </button>
            
            {ventaEditada && (
              <button
                type="button"
                className="btn btn-secondary d-flex align-items-center"
                onClick={onCancelar}
                disabled={isDisabled}
              >
                <X className="me-2" size={18} />
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
 
// Componente de tabla
const VentaTable = ({ ventas, onEditar, onEliminar, loading }) => {
  const [deleteLoading, setDeleteLoading] = useState(null);

  const handleEliminar = async (venta) => {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar la venta "${venta.NumeroDocumento}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmar) return;

    setDeleteLoading(venta.IdVenta);
    
    try {
      await onEliminar(venta.IdVenta);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'Pendiente': 'bg-warning text-dark',
      'Completada': 'bg-success',
      'Cancelada': 'bg-secondary',
      'Devuelta': 'bg-danger'
    };
    return badges[estado] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-light">
        <div className="row align-items-center">
          <div className="col">
            <div className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-3 p-2 me-3">
                <i className="bi bi-cart-check text-success fs-4"></i>
              </div>
              <div>
                <h3 className="card-title h5 mb-1">Registro de Ventas</h3>
                <small className="text-muted">
                  {ventas.length} {ventas.length === 1 ? 'venta registrada' : 'ventas registradas'}
                </small>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <span className="badge bg-success fs-6 px-3 py-2">
              Total: {ventas.length}
            </span>
          </div>
        </div>
      </div>
      
      <div className="card-body p-0">
  {ventas.length > 0 ? (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Método Pago</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Usuario</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
      <tbody>
  {ventas.map((venta) => (
    <tr key={venta.IdVenta}>
      <td className="px-4 py-3">
        <div className="d-flex align-items-center">
          <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
            <span className="text-success fw-bold small">
              {venta.IdVenta}
            </span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="fw-bold text-dark d-flex align-items-center">
          <i className="bi bi-person-vcard me-2"></i>
          {venta.DocumentoCliente}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="d-flex align-items-center text-muted">
          <i className="bi bi-calendar me-2"></i>
          {formatDate(venta.FechaVenta)}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="d-flex align-items-center">
          <DollarSign size={16} className="me-1 text-success" />
          <span className="fw-bold text-success">
            {formatCurrency(venta.Total)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="d-flex align-items-center text-muted">
          <i className="bi bi-credit-card me-2"></i>
          {venta.MetodoPago}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`badge ${getEstadoBadge(venta.Estado)} px-3 py-2`}>
          {venta.Estado}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="d-flex align-items-center text-muted">
          <i className="bi bi-person me-2"></i>
          {venta.DocumentoUsuario || 'N/A'}
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="btn-group btn-group-sm">
          <button
            className="btn btn-outline-primary"
            onClick={() => onEditar(venta)}
            title="Editar venta"
            disabled={deleteLoading === venta.IdVenta}
          >
            <Edit2 size={16} />
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => handleEliminar(venta)}
            title="Eliminar venta"
            disabled={deleteLoading === venta.IdVenta}
          >
            {deleteLoading === venta.IdVenta ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  ) : (
    <div className="text-center py-5">
      <div className="mb-3">
        <i className="bi bi-cart-x text-muted" style={{fontSize: '3rem'}}></i>
      </div>
      <h5 className="text-muted">No hay ventas registradas</h5>
      <p className="text-muted mb-0">Registra la primera venta usando el formulario de arriba</p>
    </div>
  )}
</div>
    </div>
  );
};

// Componente principal
const VentasSystem = () => {
  const {
    ventas,
    loading,
    error,
    setError,
    cargarVentas,
    crearVenta,
    actualizarVenta,
    eliminarVenta
  } = useVentas();

  const [ventaEditada, setVentaEditada] = useState(null);

  useEffect(() => {
    cargarVentas();
  }, []);

  const handleGuardado = async (response) => {
     console.log('🎉 handleGuardado ejecutado:', response);
    if (response && response.success) {
      setVentaEditada(null);
      setError(null);
    }
  };

  const handleEditar = (venta) => {
    setVentaEditada(venta);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelar = () => {
    setVentaEditada(null);
    setError(null);
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarVenta(id);
    } catch (error) {
      throw error;
    }
  };

  const totalVentas = Array.isArray(ventas) 
    ? ventas.reduce((sum, venta) => sum + parseFloat(venta.Total || 0), 0) 
    : 0;

  return (
    <>
      <NavbarAdmin activeSection="ventas" />
      
      <div className="container-fluid py-4" style={{backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 76px)'}}>
        <div className="container">
          <div className="mb-4">
            <div className="row align-items-center">
              <div className="col">
                <h1 className="display-6 fw-bold text-dark mb-2">
                  Gestión de Ventas
                </h1>
                <p className="lead text-muted">
                  Administra y registra todas las ventas de tu empresa
                </p>
              </div>
              <div className="col-auto">
                <div className="card shadow-sm border-0 bg-success text-white">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center">
                      <DollarSign size={32} className="me-2" />
                      <div>
                        <small className="d-block opacity-75">Total Ventas</small>
                        <h4 className="mb-0 fw-bold">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(totalVentas)}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center" role="alert">
              <AlertCircle className="me-2" size={20} />
              <div>{error}</div>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
                aria-label="Close"
              ></button>
            </div>
          )}

          <VentaForm
            ventaEditada={ventaEditada}
            onGuardado={handleGuardado}
            onCancelar={handleCancelar}
            loading={loading}
            crearVenta={crearVenta}
            actualizarVenta={actualizarVenta}
          />

          <VentaTable
            ventas={ventas}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            loading={loading}
            
          />
        </div>
      </div>
    </>
  );
};

export default VentasSystem;