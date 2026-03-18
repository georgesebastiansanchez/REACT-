import React, { useState, useEffect } from 'react';
import { AlertCircle, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import axios from "axios";

const API_BASE_URL = 'web-production-d9e15.up.railway.app/api';

// --------------------------------------------------------------
// Navbar Admin - CORREGIDO PARA DETECTAR ROLES
// --------------------------------------------------------------
// --- COMPONENTE NAVBAR CON ROLES (reemplaza todo el NavbarAdmin) ---
const NavbarAdmin = ({ userData }) => {
  const user = userData || { name: 'Administrador', role: 'admin' };
  const userName = user?.name || user?.username || user?.email || 'Usuario';
  const userRole = user?.role || user?.Rol || 'user';
  const isAdmin = userRole === 'admin' || userRole === 'administrador';

  const handleLogout = () => {
    const confirmLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmLogout) {
      console.log('🚪 Cerrando sesión...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
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
// -----------------------------------------------------------------------------

// Servicio real para proveedores usando Axios
const proveedorService = {
  getAllProveedores: async () => {
    try {
      const response = await axios.get('/proveedores');
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw error;
    }
  },

  createProveedor: async (proveedorData) => {
    try {
      const response = await axios.post('/proveedores', proveedorData);
      return response.data;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw error;
    }
  },

  updateProveedor: async (id, proveedorData) => {
    try {
      const response = await axios.put(`/proveedores/${id}`, proveedorData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      throw error;
    }
  },

  deleteProveedor: async (id) => {
    try {
      const response = await axios.delete(`/proveedores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      throw error;
    }
  },

  getProveedorById: async (id) => {
    try {
      const response = await axios.get(`/proveedores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
      throw error;
    }
  }
};

// Hook para manejar proveedores con Axios
const useProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarProveedores = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await proveedorService.getAllProveedores();
      if (response.success) {
        setProveedores(response.data || []);
      } else {
        throw new Error(response.message || 'Error al cargar proveedores');
      }
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Error al cargar proveedores';
      
      if (error.response) {
        // El servidor respondió con un código de error
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para ver los proveedores.';
        } else if (status === 500) {
          errorMessage = 'Error interno del servidor.';
        } else {
          errorMessage = data?.message || error.message;
        }
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        errorMessage = 'Error de conexión. Verifica que el servidor esté funcionando.';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setProveedores([]);
    } finally {
      setLoading(false);
    }
  };

  const crearProveedor = async (proveedorData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await proveedorService.createProveedor(proveedorData);
      if (response.success) {
        await cargarProveedores(); // Recargar lista
        return response;
      } else {
        throw new Error(response.message || 'Error al crear proveedor');
      }
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      let errorMessage = 'Error al crear proveedor';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          if (data?.errors) {
            // Errores de validación de Laravel
            const validationErrors = Object.values(data.errors).flat().join(', ');
            errorMessage = `Errores de validación: ${validationErrors}`;
          } else {
            errorMessage = data?.message || 'Datos inválidos. Verifica que el nombre del proveedor no esté duplicado.';
          }
        } else if (status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para crear proveedores.';
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

  const actualizarProveedor = async (id, proveedorData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await proveedorService.updateProveedor(id, proveedorData);
      if (response.success) {
        await cargarProveedores(); // Recargar lista
        return response;
      } else {
        throw new Error(response.message || 'Error al actualizar proveedor');
      }
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      let errorMessage = 'Error al actualizar proveedor';
      
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
          errorMessage = 'No tienes permisos para actualizar proveedores.';
        } else if (status === 404) {
          errorMessage = 'Proveedor no encontrado.';
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

  const eliminarProveedor = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await proveedorService.deleteProveedor(id);
      if (response.success) {
        setProveedores(prev => prev.filter(p => p.IdProveedor !== id));
        return response;
      } else {
        throw new Error(response.message || 'Error al eliminar proveedor');
      }
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      let errorMessage = 'Error al eliminar proveedor';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          errorMessage = data?.message || 'No se puede eliminar el proveedor porque tiene compras asociadas.';
        } else if (status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para eliminar proveedores.';
        } else if (status === 404) {
          errorMessage = 'Proveedor no encontrado.';
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
    proveedores,
    loading,
    error,
    setError,
    cargarProveedores,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
  };
};

// Componente del formulario
const ProveedorForm = ({ proveedorEditado, onGuardado, onCancelar, loading }) => {
  const [formData, setFormData] = useState({
    NombreProveedor: '',
    Contacto: '',
    Telefono: '',
    Email: '',
    Direccion: ''
  });

  const [errors, setErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (proveedorEditado) {
      setFormData({
        NombreProveedor: proveedorEditado.NombreProveedor || '',
        Contacto: proveedorEditado.Contacto || '',
        Telefono: proveedorEditado.Telefono || '',
        Email: proveedorEditado.Email || '',
        Direccion: proveedorEditado.Direccion || ''
      });
    } else {
      setFormData({
        NombreProveedor: '',
        Contacto: '',
        Telefono: '',
        Email: '',
        Direccion: ''
      });
    }
    setErrors({});
  }, [proveedorEditado]);

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
    
    if (!formData.NombreProveedor.trim()) {
      newErrors.NombreProveedor = 'El nombre del proveedor es requerido';
    }
    
    if (formData.Email && !/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = 'El email no tiene un formato válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setFormLoading(true);
    setErrors({});

    try {
      let result;
      if (proveedorEditado) {
        result = await proveedorService.updateProveedor(proveedorEditado.IdProveedor, formData);
      } else {
        result = await proveedorService.createProveedor(formData);
      }
      
      onGuardado(result);
      
      if (!proveedorEditado) {
        setFormData({
          NombreProveedor: '',
          Contacto: '',
          Telefono: '',
          Email: '',
          Direccion: ''
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
            <div className="bg-primary bg-opacity-10 rounded-3 p-3">
              {proveedorEditado ? (
                <Edit2 className="text-primary" size={24} />
              ) : (
                <Plus className="text-primary" size={24} />
              )}
            </div>
          </div>
          <div className="col">
            <h2 className="card-title h4 mb-1">
              {proveedorEditado ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}
            </h2>
            <p className="text-muted mb-0">
              {proveedorEditado ? 'Modifica los datos del proveedor' : 'Completa los datos del nuevo proveedor'}
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
            <div className="col-12 mb-3">
              <label className="form-label fw-semibold">
                Nombre del Proveedor <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="NombreProveedor"
                className={`form-control ${errors.NombreProveedor ? 'is-invalid' : ''}`}
                value={formData.NombreProveedor}
                onChange={handleChange}
                disabled={isDisabled}
                placeholder="Ej: Distribuciones ABC S.A."
              />
              {errors.NombreProveedor && (
                <div className="invalid-feedback d-flex align-items-center">
                  <AlertCircle size={16} className="me-1" />
                  {errors.NombreProveedor}
                </div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Contacto Principal</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  name="Contacto"
                  className="form-control"
                  value={formData.Contacto}
                  onChange={handleChange}
                  disabled={isDisabled}
                  placeholder="Nombre del contacto"
                />
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Teléfono</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-telephone"></i>
                </span>
                <input
                  type="text"
                  name="Telefono"
                  className="form-control"
                  value={formData.Telefono}
                  onChange={handleChange}
                  disabled={isDisabled}
                  placeholder="Ej: 3101234567"
                />
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Email</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  name="Email"
                  className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
                  value={formData.Email}
                  onChange={handleChange}
                  disabled={isDisabled}
                  placeholder="contacto@empresa.com"
                />
              </div>
              {errors.Email && (
                <div className="invalid-feedback d-flex align-items-center">
                  <AlertCircle size={16} className="me-1" />
                  {errors.Email}
                </div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Dirección</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-geo-alt"></i>
                </span>
                <textarea
                  name="Direccion"
                  className="form-control"
                  rows="3"
                  value={formData.Direccion}
                  onChange={handleChange}
                  disabled={isDisabled}
                  placeholder="Dirección completa del proveedor"
                />
              </div>
            </div>
          </div>

          <hr />

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center"
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
                  {proveedorEditado ? 'Actualizar' : 'Crear Proveedor'}
                </>
              )}
            </button>
            
            {proveedorEditado && (
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
const ProveedorTable = ({ proveedores, onEditar, onEliminar, loading }) => {
  const [deleteLoading, setDeleteLoading] = useState(null);

  const handleEliminar = async (proveedor) => {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar el proveedor "${proveedor.NombreProveedor}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmar) return;

    setDeleteLoading(proveedor.IdProveedor);
    
    try {
      await onEliminar(proveedor.IdProveedor);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
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
              <div className="bg-primary bg-opacity-10 rounded-3 p-2 me-3">
                <i className="bi bi-truck text-primary fs-4"></i>
              </div>
              <div>
                <h3 className="card-title h5 mb-1">Lista de Proveedores</h3>
                <small className="text-muted">
                  {proveedores.length} {proveedores.length === 1 ? 'proveedor registrado' : 'proveedores registrados'}
                </small>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <span className="badge bg-primary fs-6 px-3 py-2">
              Total: {proveedores.length}
            </span>
          </div>
        </div>
      </div>
      
      <div className="card-body p-0">
        {proveedores.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Proveedor</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3">Teléfono</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.map((proveedor) => (
                  <tr key={proveedor.IdProveedor}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                          <span className="text-primary fw-bold small">
                            {proveedor.IdProveedor}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="fw-bold text-dark">
                          {proveedor.NombreProveedor}
                        </div>
                        {proveedor.Direccion && (
                          <small className="text-muted d-flex align-items-center">
                            <i className="bi bi-geo-alt me-1"></i>
                            {proveedor.Direccion}
                          </small>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center text-muted">
                        <i className="bi bi-person me-2"></i>
                        {proveedor.Contacto || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center text-muted">
                        <i className="bi bi-telephone me-2"></i>
                        {proveedor.Telefono || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {proveedor.Email ? (
                        <a 
                          href={`mailto:${proveedor.Email}`}
                          className="text-decoration-none d-flex align-items-center"
                        >
                          <i className="bi bi-envelope me-2"></i>
                          {proveedor.Email}
                        </a>
                      ) : (
                        <div className="d-flex align-items-center text-muted">
                          <i className="bi bi-envelope me-2"></i>
                          -
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => onEditar(proveedor)}
                          title="Editar proveedor"
                          disabled={deleteLoading === proveedor.IdProveedor}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleEliminar(proveedor)}
                          title="Eliminar proveedor"
                          disabled={deleteLoading === proveedor.IdProveedor}
                        >
                          {deleteLoading === proveedor.IdProveedor ? (
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
              <i className="bi bi-truck text-muted" style={{fontSize: '3rem'}}></i>
            </div>
            <h5 className="text-muted">No hay proveedores registrados</h5>
            <p className="text-muted mb-0">Agrega el primer proveedor usando el formulario de arriba</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal
const ProveedorSystem = () => {
   const getUserData = () => {
    try {
      const userString = localStorage.getItem('userData');
      if (userString) {
        const user = JSON.parse(userString);
        const role = localStorage.getItem('userRole');
        return {
          ...user,
          role: role || user.role || user.Rol
        };
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
    }
    return null;
  };

  const userData = getUserData(); 
  
  
  const {
    proveedores,
    loading,
    error,
    setError,
    cargarProveedores,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
  } = useProveedores();

  const [proveedorEditado, setProveedorEditado] = useState(null);

  useEffect(() => {
    cargarProveedores();
  }, []);

  const handleGuardado = async (response) => {
    if (response && response.success) {
      setProveedorEditado(null);
      setError(null);
    }
  };

  const handleEditar = (proveedor) => {
    setProveedorEditado(proveedor);
    setError(null);
  };

  const handleCancelar = () => {
    setProveedorEditado(null);
    setError(null);
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarProveedor(id);
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <NavbarAdmin userData={userData} />
      
      <div className="container-fluid py-4" style={{backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 76px)'}}>
        <div className="container">
          <div className="mb-4">
            <h1 className="display-6 fw-bold text-dark mb-2">
              Gestión de Proveedores
            </h1>
            <p className="lead text-muted">
              Administra los proveedores de tu empresa de forma eficiente
            </p>
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

          <ProveedorForm
            proveedorEditado={proveedorEditado}
            onGuardado={handleGuardado}
            onCancelar={handleCancelar}
            loading={loading}
          />

          <ProveedorTable
            proveedores={proveedores}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default ProveedorSystem;