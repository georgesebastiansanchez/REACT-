// src/pages/ComprasPage.jsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, Edit2, Trash2, Plus, Save, X, Package, ShoppingCart, Calendar, DollarSign } from 'lucide-react';
import axiosInstance from '../services/axios';

const NavbarAdmin = ({ userData }) => {
  const user = userData || { name: 'Administrador' };
  const userName = user?.name || user?.username || user?.email || 'Administrador';

  const handleLogout = () => {
    const confirmLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmLogout) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold d-flex align-items-center text-dark" href="/admin">
          <div style={{width: '40px', height: '40px', backgroundColor: '#10B981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px'}}>
            <ShoppingCart style={{ color: 'white' }} size={20} />
          </div>
          Panel Administrador
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navAdmin">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navAdmin">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><a className="nav-link text-dark" href="/admin"><i className="bi bi-speedometer2 me-1"></i>Dashboard</a></li>
            <li className="nav-item"><a className="nav-link text-dark" href="/inventario"><i className="bi bi-boxes me-1"></i>Inventario</a></li>
            <li className="nav-item"><a className="nav-link text-dark" href="/reportes"><i className="bi bi-graph-up me-1"></i>Reportes</a></li>
            <li className="nav-item"><a className="nav-link active text-success fw-bold" href="/compras"><i className="bi bi-cart-check me-1"></i>Compras</a></li>
            <li className="nav-item"><a className="nav-link text-dark" href="/proveedores"><i className="bi bi-truck me-1"></i>Proveedores</a></li>
            <li className="nav-item"><a className="nav-link text-dark" href="/permisos"><i className="bi bi-person-gear me-1"></i>Cuenta y permisos</a></li>
          </ul>
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3 d-none d-md-inline text-muted">
              <i className="bi bi-shield-check me-1 text-secondary"></i>Admin: <strong className="text-secondary">{userName}</strong>
            </span>
            <button className="btn btn-outline-danger" onClick={handleLogout} title="Cerrar Sesión">
              <i className="bi bi-box-arrow-right me-1"></i>Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const useCompras = () => {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarCompras = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/compras');
      if (response.data.success) {
        setCompras(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Error al cargar compras');
      }
    } catch (error) {
      let errorMessage = 'Error al cargar compras';
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 401) errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        else if (status === 403) errorMessage = 'No tienes permisos para ver las compras.';
        else if (status === 500) errorMessage = 'Error interno del servidor.';
        else errorMessage = data?.message || error.message;
      } else if (error.request) {
        errorMessage = 'Error de conexión.';
      } else {
        errorMessage = error.message;
      }
      setError(errorMessage);
      setCompras([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarProveedores = async () => {
    try {
      const response = await axiosInstance.get('/proveedores');
      if (response.data.success) {
        setProveedores(response.data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    }
  };

  const crearCompra = async (compraData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/compras', compraData);
      if (response.data.success) {
        await cargarCompras();
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al crear compra');
      }
    } catch (error) {
      let errorMessage = 'Error al crear compra';
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 400) {
          errorMessage = data?.errors
            ? `Errores de validación: ${Object.values(data.errors).flat().join(', ')}`
            : data?.message || 'Datos inválidos.';
        } else if (status === 401) errorMessage = 'No autorizado.';
        else if (status === 403) errorMessage = 'No tienes permisos para crear compras.';
        else errorMessage = data?.message || error.message;
      } else if (error.request) {
        errorMessage = 'Error de conexión.';
      } else {
        errorMessage = error.message;
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const actualizarCompra = async (id, compraData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put(`/compras/${id}`, compraData);
      if (response.data.success) {
        await cargarCompras();
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al actualizar compra');
      }
    } catch (error) {
      let errorMessage = 'Error al actualizar compra';
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 400) {
          errorMessage = data?.errors
            ? `Errores de validación: ${Object.values(data.errors).flat().join(', ')}`
            : data?.message || 'Datos inválidos.';
        } else if (status === 401) errorMessage = 'No autorizado.';
        else if (status === 403) errorMessage = 'No tienes permisos para actualizar compras.';
        else if (status === 404) errorMessage = 'Compra no encontrada.';
        else errorMessage = data?.message || error.message;
      } else if (error.request) {
        errorMessage = 'Error de conexión.';
      } else {
        errorMessage = error.message;
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const eliminarCompra = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(`/compras/${id}`);
      if (response.data.success) {
        setCompras(prev => prev.filter(c => c.IdCompras !== id));
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al eliminar compra');
      }
    } catch (error) {
      let errorMessage = 'Error al eliminar compra';
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 400) errorMessage = data?.message || 'No se puede eliminar la compra.';
        else if (status === 401) errorMessage = 'No autorizado.';
        else if (status === 403) errorMessage = 'No tienes permisos para eliminar compras.';
        else if (status === 404) errorMessage = 'Compra no encontrada.';
        else errorMessage = data?.message || error.message;
      } else if (error.request) {
        errorMessage = 'Error de conexión.';
      } else {
        errorMessage = error.message;
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { compras, proveedores, loading, error, setError, cargarCompras, cargarProveedores, crearCompra, actualizarCompra, eliminarCompra };
};

const CompraForm = ({ compraEditada, onGuardado, onCancelar, loading, proveedores }) => {
  // FIX: Estado inicial con 'pendiente' en minúscula para coincidir con el enum de la BD
  const [formData, setFormData] = useState({
    FechaCompra: '',
    Total: '',
    Estado: 'pendiente', // ← FIX: minúscula
    IdProveedor: '',
    NumeroDocumentoUsuario: ''
  });
  const [errors, setErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (compraEditada) {
      setFormData({
        FechaCompra: compraEditada.FechaCompra || '',
        Total: compraEditada.Total || '',
        Estado: compraEditada.Estado || 'pendiente', // ← FIX: minúscula
        IdProveedor: compraEditada.IdProveedor || '',
        NumeroDocumentoUsuario: String(compraEditada.NumeroDocumentoUsuario || '') // ← FIX: convertir a string
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        FechaCompra: today,
        Total: '',
        Estado: 'pendiente', // ← FIX: minúscula
        IdProveedor: '',
        NumeroDocumentoUsuario: ''
      });
    }
    setErrors({});
  }, [compraEditada]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    if (errors[name]) setErrors(prev => ({...prev, [name]: null}));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.FechaCompra) newErrors.FechaCompra = 'La fecha de compra es requerida';
    if (!formData.Total || parseFloat(formData.Total) <= 0) newErrors.Total = 'El total debe ser mayor a 0';
    if (!formData.IdProveedor) newErrors.IdProveedor = 'Debes seleccionar un proveedor';
    // FIX: String() garantiza que .trim() nunca falle aunque llegue un número
    if (!String(formData.NumeroDocumentoUsuario || '').trim()) newErrors.NumeroDocumentoUsuario = 'El documento del usuario es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setFormLoading(true);
    setErrors({});
    try {
      let result;
      if (compraEditada) {
        result = await axiosInstance.put(`/compras/${compraEditada.IdCompras}`, formData);
      } else {
        result = await axiosInstance.post('/compras', formData);
      }
      onGuardado(result.data);
      if (!compraEditada) {
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          FechaCompra: today,
          Total: '',
          Estado: 'pendiente', // ← FIX: minúscula
          IdProveedor: '',
          NumeroDocumentoUsuario: ''
        });
      }
    } catch (error) {
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
              {compraEditada ? <Edit2 className="text-success" size={24} /> : <Plus className="text-success" size={24} />}
            </div>
          </div>
          <div className="col">
            <h2 className="card-title h4 mb-1">{compraEditada ? 'Editar Compra' : 'Registrar Nueva Compra'}</h2>
            <p className="text-muted mb-0">{compraEditada ? 'Modifica los datos de la compra' : 'Completa los datos de la nueva compra'}</p>
          </div>
        </div>
        {errors.general && (
          <div className="alert alert-danger d-flex align-items-center">
            <AlertCircle className="me-2" size={20} />
            <div>{errors.general}</div>
          </div>
        )}
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Fecha de Compra <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text"><Calendar size={18} /></span>
                <input type="date" name="FechaCompra" className={`form-control ${errors.FechaCompra ? 'is-invalid' : ''}`} value={formData.FechaCompra} onChange={handleChange} disabled={isDisabled} />
              </div>
              {errors.FechaCompra && <div className="text-danger small mt-1">{errors.FechaCompra}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Total <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text"><DollarSign size={18} /></span>
                <input type="number" name="Total" className={`form-control ${errors.Total ? 'is-invalid' : ''}`} value={formData.Total} onChange={handleChange} disabled={isDisabled} placeholder="0.00" step="0.01" min="0" />
              </div>
              {errors.Total && <div className="text-danger small mt-1">{errors.Total}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Proveedor <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-truck"></i></span>
                <select name="IdProveedor" className={`form-select ${errors.IdProveedor ? 'is-invalid' : ''}`} value={formData.IdProveedor} onChange={handleChange} disabled={isDisabled}>
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map(prov => <option key={prov.IdProveedor} value={prov.IdProveedor}>{prov.NombreProveedor}</option>)}
                </select>
              </div>
              {errors.IdProveedor && <div className="text-danger small mt-1">{errors.IdProveedor}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Estado <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-info-circle"></i></span>
                <select name="Estado" className="form-select" value={formData.Estado} onChange={handleChange} disabled={isDisabled}>
                  <option value="pendiente">Pendiente</option>
                  <option value="recibida">Recibida</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>
            <div className="col-12 mb-3">
              <label className="form-label fw-semibold">Documento del Usuario <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-person-badge"></i></span>
                <input type="text" name="NumeroDocumentoUsuario" className={`form-control ${errors.NumeroDocumentoUsuario ? 'is-invalid' : ''}`} value={formData.NumeroDocumentoUsuario} onChange={handleChange} disabled={isDisabled} placeholder="Ej: 1234567890" />
              </div>
              {errors.NumeroDocumentoUsuario && <div className="text-danger small mt-1">{errors.NumeroDocumentoUsuario}</div>}
            </div>
          </div>
          <hr />
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-success d-flex align-items-center" onClick={handleSubmit} disabled={isDisabled}>
              {formLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Guardando...</> : <><Save className="me-2" size={18} />{compraEditada ? 'Actualizar Compra' : 'Registrar Compra'}</>}
            </button>
            {compraEditada && <button type="button" className="btn btn-secondary d-flex align-items-center" onClick={onCancelar} disabled={isDisabled}><X className="me-2" size={18} />Cancelar</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

const CompraTable = ({ compras, onEditar, onEliminar, loading }) => {
  const [deleteLoading, setDeleteLoading] = useState(null);

  const handleEliminar = async (compra) => {
    const confirmar = window.confirm(`¿Estás seguro de eliminar la compra #${compra.IdCompras}?\n\nEsta acción no se puede deshacer.`);
    if (!confirmar) return;
    setDeleteLoading(compra.IdCompras);
    try {
      await onEliminar(compra.IdCompras);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatCurrency = (value) => new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP', minimumFractionDigits: 0}).format(value);

  const getEstadoBadge = (estado) => {
    const badges = {'pendiente': 'bg-warning text-dark', 'recibida': 'bg-success', 'cancelada': 'bg-danger'};
    return badges[estado] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-success"><span className="visually-hidden">Cargando...</span></div>
          </div>
        </div>
      </div>
    );
  }

  const totalCompras = compras.reduce((sum, c) => sum + parseFloat(c.Total || 0), 0);

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-light">
        <div className="row align-items-center">
          <div className="col">
            <div className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-3 p-2 me-3"><Package className="text-success" size={24} /></div>
              <div>
                <h3 className="card-title h5 mb-1">Historial de Compras</h3>
                <small className="text-muted">{compras.length} {compras.length === 1 ? 'compra registrada' : 'compras registradas'}</small>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <div className="text-end">
              <small className="text-muted d-block">Total General</small>
              <span className="badge bg-success fs-6 px-3 py-2">{formatCurrency(totalCompras)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        {compras.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Proveedor</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((compra) => (
                  <tr key={compra.IdCompras}>
                    <td className="px-4 py-3">
                      <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                        <span className="text-success fw-bold small">#{compra.IdCompras}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center"><Calendar size={16} className="me-2 text-muted" /><span>{new Date(compra.FechaCompra).toLocaleDateString('es-CO')}</span></div>
                    </td>
                    <td className="px-4 py-3"><div className="fw-semibold text-dark">{compra.NombreProveedor || `Proveedor #${compra.IdProveedor}`}</div></td>
                    <td className="px-4 py-3"><span className="fw-bold text-success">{formatCurrency(compra.Total)}</span></td>
                    <td className="px-4 py-3"><span className={`badge ${getEstadoBadge(compra.Estado)}`}>{compra.Estado}</span></td>
                    <td className="px-4 py-3"><div className="text-muted small"><i className="bi bi-person-badge me-1"></i>{compra.NombreUsuario || compra.NumeroDocumentoUsuario}</div></td>
                    <td className="px-4 py-3 text-center">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-success" onClick={() => onEditar(compra)} disabled={deleteLoading === compra.IdCompras}><Edit2 size={16} /></button>
                        <button className="btn btn-outline-danger" onClick={() => handleEliminar(compra)} disabled={deleteLoading === compra.IdCompras}>
                          {deleteLoading === compra.IdCompras ? <span className="spinner-border spinner-border-sm"></span> : <Trash2 size={16} />}
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
            <ShoppingCart className="text-muted mb-3" size={48} />
            <h5 className="text-muted">No hay compras registradas</h5>
            <p className="text-muted mb-0">Registra la primera compra usando el formulario de arriba</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ComprasPage = () => {
  const { compras, proveedores, loading, error, setError, cargarCompras, cargarProveedores } = useCompras();
  const [compraEditada, setCompraEditada] = useState(null);

  useEffect(() => {
    cargarCompras();
    cargarProveedores();
  }, []);

  const handleGuardado = async (response) => {
    if (response && response.success) {
      setCompraEditada(null);
      setError(null);
      await cargarCompras();
    }
  };

  const handleEditar = (compra) => {
    setCompraEditada(compra);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelar = () => {
    setCompraEditada(null);
    setError(null);
  };

  const handleEliminar = async (id) => {
    try {
      await axiosInstance.delete(`/compras/${id}`);
      await cargarCompras();
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className="container-fluid py-4" style={{backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 76px)'}}>
        <div className="container">
          <div className="mb-4">
            <h1 className="display-6 fw-bold text-dark mb-2">
              <ShoppingCart className="me-2" size={40} style={{verticalAlign: 'middle'}} />
              Gestión de Compras
            </h1>
            <p className="lead text-muted">Administra y registra todas las compras de tu empresa</p>
          </div>
          {error && (
            <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center">
              <AlertCircle className="me-2" size={20} />
              <div>{error}</div>
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}
          <CompraForm compraEditada={compraEditada} onGuardado={handleGuardado} onCancelar={handleCancelar} loading={loading} proveedores={proveedores} />
          <CompraTable compras={compras} onEditar={handleEditar} onEliminar={handleEliminar} loading={loading} />
        </div>
      </div>
    </>
  );
};

export default ComprasPage;