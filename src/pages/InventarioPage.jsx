import React, { useState, useEffect } from 'react';
import { AlertCircle, Edit2, Trash2, Plus, Save, X, Package, DollarSign, Layers, CheckCircle, XCircle } from 'lucide-react';
import axiosInstance from '../services/axios';



// NAVBAR CON ROLES
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

// Servicio real para productos usando Axios (igual patrón que proveedores)
const productoService = {
  getAllProductos: async () => {
    try {
      const response = await axiosInstance.get('/productos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  createProducto: async (productoData) => {
    try {
      const response =await axiosInstance.post('/productos', productoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  updateProducto: async (id, productoData) => {
    try {
      const response = await axiosInstance.put(`/productos/${id}`, productoData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  deleteProducto: async (id) => {
    try {
      const response = await axiosInstance.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },

  getProductoById: async (id) => {
    try {
      const response = await axiosInstance.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  }
};

// Categorías (esto podría venir de la API también)
const categorias = [
  { id: 1, nombre: "Jeans Hombre" },
  { id: 2, nombre: "Blusas" },
  { id: 3, nombre: "Camisas" },
  { id: 4, nombre: "Jeans Mujer" },
  { id: 5, nombre: "Camisetas" }
];

// Hook para manejar productos con Axios (mismo patrón que proveedores)
const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarProductos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productoService.getAllProductos();
      if (response.success) {
        setProductos(response.data || []);
      } else {
        throw new Error(response.message || 'Error al cargar productos');
      }
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Error al cargar productos';
      
      if (error.response) {
        // El servidor respondió con un código de error
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para ver los productos.';
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
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const crearProducto = async (productoData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productoService.createProducto(productoData);
      if (response.success) {
        await cargarProductos(); // Recargar lista
        return response;
      } else {
        throw new Error(response.message || 'Error al crear producto');
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      let errorMessage = 'Error al crear producto';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          if (data?.errors) {
            // Errores de validación de Laravel
            const validationErrors = Object.values(data.errors).flat().join(', ');
            errorMessage = `Errores de validación: ${validationErrors}`;
          } else {
            errorMessage = data?.message || 'Datos inválidos. Verifica que el nombre del producto no esté duplicado.';
          }
        } else if (status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para crear productos.';
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

  const actualizarProducto = async (id, productoData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productoService.updateProducto(id, productoData);
      if (response.success) {
        await cargarProductos(); // Recargar lista
        return response;
      } else {
        throw new Error(response.message || 'Error al actualizar producto');
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      let errorMessage = 'Error al actualizar producto';
      
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
          errorMessage = 'No tienes permisos para actualizar productos.';
        } else if (status === 404) {
          errorMessage = 'Producto no encontrado.';
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

  const eliminarProducto = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productoService.deleteProducto(id);
      if (response.success) {
        setProductos(prev => prev.filter(p => p.IdProducto !== id));
        return response;
      } else {
        throw new Error(response.message || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      let errorMessage = 'Error al eliminar producto';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          errorMessage = data?.message || 'No se puede eliminar el producto porque tiene ventas asociadas.';
        } else if (status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para eliminar productos.';
        } else if (status === 404) {
          errorMessage = 'Producto no encontrado.';
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
    productos,
    loading,
    error,
    setError,
    cargarProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
  };
};

// Componente del formulario
const ProductoForm = ({ productoEditado, onGuardado, onCancelar, loading }) => {
  const [formData, setFormData] = useState({
    Nombre: '',
    Descripcion: '',
    Marca: '',
    Color: '',
    Talla: '',
    PrecioBase: '',
    IdCategoria: '1',
    Stock: '',
    Activo: true
  });

  const [errors, setErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (productoEditado) {
      setFormData({
        Nombre: productoEditado.Nombre || '',
        Descripcion: productoEditado.Descripcion || '',
        Marca: productoEditado.Marca || '',
        Color: productoEditado.Color || '',
        Talla: productoEditado.Talla || '',
        PrecioBase: productoEditado.PrecioBase || '',
        IdCategoria: productoEditado.IdCategoria || '1',
        Stock: productoEditado.Stock || '',
        Activo: productoEditado.Activo !== undefined ? productoEditado.Activo : true
      });
    } else {
      setFormData({
        Nombre: '',
        Descripcion: '',
        Marca: '',
        Color: '',
        Talla: '',
        PrecioBase: '',
        IdCategoria: '1',
        Stock: '',
        Activo: true
      });
    }
    setErrors({});
  }, [productoEditado]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.Nombre.trim()) {
      newErrors.Nombre = 'El nombre del producto es requerido';
    }
    
    if (!formData.PrecioBase || parseFloat(formData.PrecioBase) <= 0) {
      newErrors.PrecioBase = 'El precio base debe ser mayor a 0';
    }
    
    if (!formData.Stock || parseInt(formData.Stock) < 0) {
      newErrors.Stock = 'El stock no puede ser negativo';
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
      const dataToSend = {
        ...formData,
        PrecioBase: parseFloat(formData.PrecioBase),
        Stock: parseInt(formData.Stock),
        IdCategoria: parseInt(formData.IdCategoria)
      };

      let result;
      if (productoEditado) {
        result = await productoService.updateProducto(productoEditado.IdProducto, dataToSend);
      } else {
        result = await productoService.createProducto(dataToSend);
      }
      
      onGuardado(result);
      
      if (!productoEditado) {
        setFormData({
          Nombre: '',
          Descripcion: '',
          Marca: '',
          Color: '',
          Talla: '',
          PrecioBase: '',
          IdCategoria: '1',
          Stock: '',
          Activo: true
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
              {productoEditado ? (
                <Edit2 className="text-primary" size={24} />
              ) : (
                <Plus className="text-primary" size={24} />
              )}
            </div>
          </div>
          <div className="col">
            <h2 className="card-title h4 mb-1">
              {productoEditado ? 'Editar Producto' : 'Agregar Nuevo Producto'}
            </h2>
            <p className="text-muted mb-0">
              {productoEditado ? 'Modifica los datos del producto' : 'Completa los datos del nuevo producto'}
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
                Nombre del Producto <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="Nombre"
                className={`form-control ${errors.Nombre ? 'is-invalid' : ''}`}
                value={formData.Nombre}
                onChange={handleChange}
                disabled={isDisabled}
                placeholder="Ej: Jean Clásico Azul"
              />
              {errors.Nombre && (
                <div className="invalid-feedback d-flex align-items-center">
                  <AlertCircle size={16} className="me-1" />
                  {errors.Nombre}
                </div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Categoría</label>
              <div className="input-group">
                <span className="input-group-text">
                  <Layers size={16} />
                </span>
                <select
                  name="IdCategoria"
                  className="form-control"
                  value={formData.IdCategoria}
                  onChange={handleChange}
                  disabled={isDisabled}
                >
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-12 mb-3">
              <label className="form-label fw-semibold">Descripción</label>
              <textarea
                name="Descripcion"
                className="form-control"
                rows="3"
                value={formData.Descripcion}
                onChange={handleChange}
                disabled={isDisabled}
                placeholder="Descripción detallada del producto"
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Marca</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-tag"></i>
                </span>
                <input
                  type="text"
                  name="Marca"
                  className="form-control"
                  value={formData.Marca}
                  onChange={handleChange}
                  disabled={isDisabled}
                  placeholder="Ej: Nike, Adidas"
                />
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Color</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-palette"></i>
                </span>
                <input
                  type="text"
                  name="Color"
                  className="form-control"
                  value={formData.Color}
                  onChange={handleChange}
                  disabled={isDisabled}
                  placeholder="Ej: Azul, Rojo"
                />
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Talla</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-rulers"></i>
                </span>
                <input
                  type="text"
                  name="Talla"
                  className="form-control"
                  value={formData.Talla}
                  onChange={handleChange}
                  disabled={isDisabled}
                  placeholder="Ej: S, M, L, 32"
                />
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">
                Precio Base <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <DollarSign size={16} />
                </span>
                <input
                  type="number"
                  name="PrecioBase"
                  className={`form-control ${errors.PrecioBase ? 'is-invalid' : ''}`}
                  value={formData.PrecioBase}
                  onChange={handleChange}
                  disabled={isDisabled}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.PrecioBase && (
                <div className="invalid-feedback d-flex align-items-center">
                  <AlertCircle size={16} className="me-1" />
                  {errors.PrecioBase}
                </div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">
                Stock <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <Package size={16} />
                </span>
                <input
                  type="number"
                  name="Stock"
                  className={`form-control ${errors.Stock ? 'is-invalid' : ''}`}
                  value={formData.Stock}
                  onChange={handleChange}
                  disabled={isDisabled}
                  placeholder="0"
                  min="0"
                />
              </div>
              {errors.Stock && (
                <div className="invalid-feedback d-flex align-items-center">
                  <AlertCircle size={16} className="me-1" />
                  {errors.Stock}
                </div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label fw-semibold">Estado</label>
              <div className="form-check form-switch mt-2">
                <input
                  type="checkbox"
                  name="Activo"
                  className="form-check-input"
                  checked={formData.Activo}
                  onChange={handleChange}
                  disabled={isDisabled}
                />
                <label className="form-check-label">
                  {formData.Activo ? 'Activo' : 'Inactivo'}
                </label>
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
                  {productoEditado ? 'Actualizar' : 'Crear Producto'}
                </>
              )}
            </button>
            
            {productoEditado && (
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
const ProductoTable = ({ productos, onEditar, onEliminar, loading }) => {
  const [deleteLoading, setDeleteLoading] = useState(null);

  const handleEliminar = async (producto) => {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar el producto "${producto.Nombre}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!confirmar) return;

    setDeleteLoading(producto.IdProducto);
    
    try {
      await onEliminar(producto.IdProducto);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getNombreCategoria = (idCategoria) => {
    const categoria = categorias.find(cat => cat.id === idCategoria);
    return categoria ? categoria.nombre : 'Sin categoría';
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'text-danger', text: 'Sin stock' };
    if (stock <= 10) return { color: 'text-warning', text: 'Stock bajo' };
    return { color: 'text-success', text: 'En stock' };
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
                <Package className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="card-title h5 mb-1">Lista de Productos</h3>
                <small className="text-muted">
                  {productos.length} {productos.length === 1 ? 'producto registrado' : 'productos registrados'}
                </small>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <span className="badge bg-primary fs-6 px-3 py-2">
              Total: {productos.length}
            </span>
          </div>
        </div>
      </div>
      
      <div className="card-body p-0">
        {productos.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => {
                  const stockStatus = getStockStatus(producto.Stock);
                  return (
                    <tr key={producto.IdProducto}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                            <span className="text-primary fw-bold small">
                              {producto.IdProducto}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="fw-bold text-dark">
                            {producto.Nombre}
                          </div>
                          <div className="d-flex align-items-center gap-2 mt-1">
                            <small className="text-muted">
                              <i className="bi bi-tag me-1"></i>
                              {producto.Marca}
                            </small>
                            <small className="text-muted">
                              <i className="bi bi-palette me-1"></i>
                              {producto.Color}
                            </small>
                            <small className="text-muted">
                              <i className="bi bi-rulers me-1"></i>
                              {producto.Talla}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge bg-light text-dark">
                          {getNombreCategoria(producto.IdCategoria)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="fw-bold text-success">
                          {formatPrice(producto.PrecioBase)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`fw-bold ${stockStatus.color}`}>
                          {producto.Stock}
                        </div>
                        <small className={stockStatus.color}>
                          {stockStatus.text}
                        </small>
                      </td>
                      <td className="px-4 py-3">
                        {producto.Activo ? (
                          <span className="badge bg-success d-flex align-items-center" style={{width: 'fit-content'}}>
                            <CheckCircle size={14} className="me-1" />
                            Activo
                          </span>
                        ) : (
                          <span className="badge bg-danger d-flex align-items-center" style={{width: 'fit-content'}}>
                            <XCircle size={14} className="me-1" />
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => onEditar(producto)}
                            title="Editar producto"
                            disabled={deleteLoading === producto.IdProducto}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleEliminar(producto)}
                            title="Eliminar producto"
                            disabled={deleteLoading === producto.IdProducto}
                          >
                            {deleteLoading === producto.IdProducto ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="mb-3">
              <Package className="text-muted" size={48} />
            </div>
            <h5 className="text-muted">No hay productos registrados</h5>
            <p className="text-muted mb-0">Agrega el primer producto usando el formulario de arriba</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductoSystem = () => {
  const {
    productos,
    loading,
    error,
    setError,
    cargarProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
  } = useProductos();

  const [productoEditado, setProductoEditado] = useState(null);

  // Obtener datos del usuario desde localStorage
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

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleGuardado = async (response) => {
    if (response && response.success) {
      setProductoEditado(null);
      setError(null);
    }
  };

  const handleEditar = (producto) => {
    setProductoEditado(producto);
    setError(null);
  };

  const handleCancelar = () => {
    setProductoEditado(null);
    setError(null);
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarProducto(id);
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
              Gestión de Productos
            </h1>
            <p className="lead text-muted">
              Administra el inventario de productos de tu empresa de forma eficiente
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

          <ProductoForm
            productoEditado={productoEditado}
            onGuardado={handleGuardado}
            onCancelar={handleCancelar}
            loading={loading}
          />

          <ProductoTable
            productos={productos}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default ProductoSystem;