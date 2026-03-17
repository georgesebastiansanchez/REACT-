import React, { useState, useEffect } from 'react';
import { AlertCircle, Shield, CheckCircle, XCircle, Clock, Send, Eye, Lock } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://web-production-d9e15.up.railway.app/api';

// Mapeo de módulos a rutas
const MODULO_RUTAS = {
  'inventario': '/inventario',
  'ventas': '/facturas',
  'compras': '/compras',
  'proveedores': '/proveedores',
  'reportes': '/reportes',
  'usuarios': '/admin'
};

const NavbarUser = ({ userData, modulosConPermiso = [], todosLosModulos = [] }) => {
  const userName = userData?.Nombre1 || userData?.Email || 'Usuario';

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      window.location.href = '/';
    }
  };

  const modulosAccesibles = todosLosModulos.filter(modulo => 
    modulosConPermiso.includes(modulo.IdModulo)
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold d-flex align-items-center text-dark" href="/usuario">
          <div style={{ width: '40px', height: '40px', backgroundColor: '#10B981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>U</span>
          </div>
          Mi Panel
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navUser">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navUser">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link text-dark" href="/usuario">
                <i className="bi bi-house-door me-1"></i>Inicio
              </a>
            </li>
            
            {modulosAccesibles.map(modulo => {
              const nombreModulo = modulo.NombreModulo.toLowerCase();
              const ruta = MODULO_RUTAS[nombreModulo] || '#';
              
              return (
                <li key={modulo.IdModulo} className="nav-item">
                  <a className="nav-link text-dark" href={ruta}>
                    <i className={`${modulo.Icono} me-1`}></i>
                    {modulo.NombreModulo}
                  </a>
                </li>
              );
            })}
            
            <li className="nav-item">
              <a className="nav-link active text-success fw-bold" href="/mis-permisos">
                <i className="bi bi-shield-check me-1"></i>Mis Permisos
              </a>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3 d-none d-md-inline text-muted">
              <i className="bi bi-person-circle me-1 text-success"></i>
              <strong className="text-success">{userName}</strong>
            </span>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const SolicitudForm = ({ modulos, onSolicitudEnviada, modulosConPermiso, solicitudesPendientes = [] }) => {
  const [moduloSeleccionado, setModuloSeleccionado] = useState('');
  const [justificacion, setJustificacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const modulosYaSolicitados = solicitudesPendientes
    .filter(s => s.Estado === 'pendiente')
    .map(s => s.IdModulo);
  
  const modulosDisponibles = modulos.filter(m => 
    !modulosConPermiso.includes(m.IdModulo) && 
    !modulosYaSolicitados.includes(m.IdModulo)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!moduloSeleccionado || !justificacion.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post(`${API_BASE_URL}/solicitudes`, {
        IdModulo: parseInt(moduloSeleccionado),
        Justificacion: justificacion
      });

      setSuccess('¡Solicitud enviada correctamente! El administrador la revisará pronto.');
      setModuloSeleccionado('');
      setJustificacion('');
      
      setTimeout(() => {
        setSuccess(null);
        if (onSolicitudEnviada) onSolicitudEnviada();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-light">
        <div className="d-flex align-items-center">
          <div className="bg-success bg-opacity-10 rounded-3 p-2 me-3">
            <Send className="text-success" size={24} />
          </div>
          <div>
            <h3 className="card-title h5 mb-1">Solicitar Nuevo Permiso</h3>
            <small className="text-muted">Solicita acceso a módulos adicionales</small>
          </div>
        </div>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger d-flex align-items-center">
            <AlertCircle className="me-2" size={20} />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="alert alert-success d-flex align-items-center">
            <CheckCircle className="me-2" size={20} />
            <div>{success}</div>
          </div>
        )}

        {modulosDisponibles.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle className="text-success mb-3" size={48} />
            <h5 className="text-muted">Ya tienes acceso a todos los módulos</h5>
            <p className="text-muted mb-0">O ya tienes solicitudes pendientes para todos</p>
          </div>
        ) : (
          <div>
            <div className="mb-3">
              <label className="form-label fw-bold">Módulo a solicitar</label>
              <select 
                className="form-select" 
                value={moduloSeleccionado} 
                onChange={(e) => setModuloSeleccionado(e.target.value)} 
                disabled={loading} 
                required
              >
                <option value="">Selecciona un módulo...</option>
                {modulosDisponibles.map(m => (
                  <option key={m.IdModulo} value={m.IdModulo}>
                    {m.NombreModulo} - {m.Descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Justificación</label>
              <textarea 
                className="form-control" 
                rows="4" 
                value={justificacion} 
                onChange={(e) => setJustificacion(e.target.value)} 
                placeholder="Explica por qué necesitas acceso..." 
                disabled={loading} 
                required
              />
            </div>

            <button 
              type="button" 
              className="btn btn-success d-flex align-items-center" 
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="me-2" size={18} />
                  Enviar Solicitud
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MisSolicitudes = ({ solicitudes, loading }) => {
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'aprobada': return { class: 'bg-success', icon: <CheckCircle size={14} />, text: 'Aprobada' };
      case 'rechazada': return { class: 'bg-danger', icon: <XCircle size={14} />, text: 'Rechazada' };
      default: return { class: 'bg-warning', icon: <Clock size={14} />, text: 'Pendiente' };
    }
  };

  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-light">
        <div className="row align-items-center">
          <div className="col">
            <div className="d-flex align-items-center">
              <div className="bg-info bg-opacity-10 rounded-3 p-2 me-3">
                <Eye className="text-info" size={24} />
              </div>
              <div>
                <h3 className="card-title h5 mb-1">Mis Solicitudes</h3>
                <small className="text-muted">Historial de solicitudes</small>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <span className="badge bg-info fs-6 px-3 py-2">Total: {solicitudes.length}</span>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        {solicitudes.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Módulo</th>
                  <th className="px-4 py-3">Justificación</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Comentario Admin</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((sol) => {
                  const badge = getEstadoBadge(sol.Estado);
                  return (
                    <tr key={sol.IdSolicitud}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <i className={`${sol.modulo?.Icono} me-2 text-primary`}></i>
                          <span className="fw-bold text-capitalize">{sol.modulo?.NombreModulo}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <small className="text-muted">{sol.Justificacion}</small>
                      </td>
                      <td className="px-4 py-3">
                        <small className="text-muted">
                          {new Date(sol.FechaSolicitud).toLocaleDateString('es-CO')}
                        </small>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${badge.class} d-inline-flex align-items-center`}>
                          {badge.icon}
                          <span className="ms-1">{badge.text}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {sol.ComentarioAdmin ? (
                          <small className="text-muted fst-italic">"{sol.ComentarioAdmin}"</small>
                        ) : (
                          <small className="text-muted">-</small>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <Eye className="text-muted mb-3" size={48} />
            <h5 className="text-muted">No tienes solicitudes registradas</h5>
          </div>
        )}
      </div>
    </div>
  );
};

const MisPermisos = ({ permisos, modulos, loading }) => {
  // Normalizamos: si 'permisos' ya es array, úsalo. Si no, usa la propiedad 'permisos'
  const listaPermisos = Array.isArray(permisos) ? permisos : permisos?.permisos ?? [];

  const permisosActivos = listaPermisos.filter(p => p.TieneAcceso);


  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-light">
        <div className="row align-items-center">
          <div className="col">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-3 p-2 me-3">
                <Shield className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="card-title h5 mb-1">Permisos Activos</h3>
                <small className="text-muted">Módulos a los que tienes acceso</small>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <span className="badge bg-primary fs-6 px-3 py-2">Activos: {permisosActivos.length}</span>
          </div>
        </div>
      </div>
      <div className="card-body">
        {permisosActivos.length > 0 ? (
          <div className="row">
            {permisosActivos.map(permiso => {
              const modulo = modulos.find(m => m.IdModulo === permiso.IdModulo);
              if (!modulo) return null;
              
              const nombreModulo = modulo.NombreModulo.toLowerCase();
              const ruta = MODULO_RUTAS[nombreModulo] || '#';
              
              return (
                <div key={permiso.IdModulo} className="col-md-6 col-lg-4 mb-3">
                  <a href={ruta} className="text-decoration-none">
                    <div className="card border-success h-100 hover-shadow" style={{ transition: 'all 0.3s', cursor: 'pointer' }}>
                      <div className="card-body">
                        <div className="d-flex align-items-start">
                          <div className="bg-success bg-opacity-10 rounded-3 p-3 me-3">
                            <i className={`${modulo.Icono} text-success fs-3`}></i>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="card-title text-capitalize mb-1 text-dark">{modulo.NombreModulo}</h6>
                            <small className="text-muted d-block mb-2">{modulo.Descripcion}</small>
                            <span className="badge bg-success">
                              <CheckCircle size={12} className="me-1" />
                              Acceso concedido
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5">
            <Lock className="text-muted mb-3" size={48} />
            <h5 className="text-muted">No tienes permisos activos</h5>
            <p className="text-muted mb-0">Solicita acceso a los módulos que necesites</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function UserPermisosSystem() {
  const [modulos, setModulos] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        setUserData(JSON.parse(userDataStr));
      } catch (e) {
        console.error('Error al parsear userData:', e);
      }
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [modulosRes, permisosRes, solicitudesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/modulos`),
        axios.get(`${API_BASE_URL}/permisos/mis-permisos`),
        axios.get(`${API_BASE_URL}/solicitudes/mis-solicitudes`)
      ]);

      setModulos(modulosRes.data.data || modulosRes.data || []);
      setPermisos(permisosRes.data.data || permisosRes.data || []);
      setSolicitudes(solicitudesRes.data.data || solicitudesRes.data || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.response?.data?.message || 'Error al cargar datos');
      
      if (err.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

const listaPermisos = Array.isArray(permisos)
  ? permisos
  : permisos?.permisos ?? [];

const modulosConPermiso = listaPermisos
  .filter(p => p.TieneAcceso)
  .map(p => p.IdModulo);


  return (
    <>
      <NavbarUser 
        userData={userData} 
        modulosConPermiso={modulosConPermiso}
        todosLosModulos={modulos}
      />
      <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 76px)' }}>
        <div className="container">
          <div className="mb-4">
            <h1 className="display-6 fw-bold text-dark mb-2">Mis Permisos y Accesos</h1>
            <p className="lead text-muted">Gestiona tus permisos y solicita acceso a nuevos módulos</p>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center">
              <AlertCircle className="me-2" size={20} />
              <div>{error}</div>
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}

          <div className="row">
            <div className="col-lg-8">
              <MisPermisos permisos={permisos} modulos={modulos} loading={loading} />
              <MisSolicitudes solicitudes={solicitudes} loading={loading} />
            </div>
            <div className="col-lg-4">
              <SolicitudForm 
                modulos={modulos} 
                onSolicitudEnviada={fetchData} 
                modulosConPermiso={modulosConPermiso}
                solicitudesPendientes={solicitudes}
              />
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .hover-shadow:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </>
  );
}