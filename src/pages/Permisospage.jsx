// AdminPermisosSystem.jsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, Shield, CheckCircle, XCircle, Clock, Bell, Save, X } from 'lucide-react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

// Configurar la URL base de la API (igual que AuthService)
const API_BASE_URL = 'https://web-production-d9e15.up.railway.app/api';

// Configurar axios para usar la URL base y el token
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const NavbarAdmin = ({ userData, notificacionesCount }) => {
  const user = userData || { name: 'Administrador' };
  const userName = user?.Nombre1 || user?.Email || 'Administrador';

  const handleLogout = () => {
    const confirmLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmLogout) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      window.location.href = '/';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold d-flex align-items-center text-dark" href="/admin">
          <div style={{ width: '40px', height: '40px', backgroundColor: '#3B82F6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>A</span>
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
            <li className="nav-item"><a className="nav-link text-dark" href="/proveedores"><i className="bi bi-truck me-1"></i>Proveedores</a></li>
            <li className="nav-item"><a className="nav-link active text-primary fw-bold" href="/permisos"><i className="bi bi-person-gear me-1"></i>Cuenta y permisos</a></li>
          </ul>
          <div className="d-flex align-items-center">
            {notificacionesCount > 0 && (
              <span className="badge bg-danger me-3">
                <Bell size={14} className="me-1" />
                {notificacionesCount} nueva{notificacionesCount !== 1 ? 's' : ''}
              </span>
            )}
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

const PermisosManager = ({ user, modulos, onPermisosActualizados, onCerrar }) => {
  const [permisos, setPermisos] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      fetchPermisos();
    }
  }, [user]);

  const fetchPermisos = async () => {
    try {
      const response = await api.get(`/permisos/${user.NumeroDocumento}`);
      const permisosMap = {};
      const permisosData = response.data.data || response.data || [];
      permisosData.forEach(p => {
        permisosMap[p.IdModulo] = p.TieneAcceso;
      });
      setPermisos(permisosMap);
    } catch (err) {
      console.error('Error al cargar permisos:', err);
      setError('Error al cargar permisos del usuario');
    }
  };

  const handleToggle = (idModulo) => {
    setPermisos(prev => ({
      ...prev,
      [idModulo]: !prev[idModulo]
    }));
  };

  const handleGuardar = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const permisosArray = modulos.map(m => ({
        IdModulo: m.IdModulo,
        TieneAcceso: !!permisos[m.IdModulo]
      }));

      await api.post('/permisos/asignar', {
        NumeroDocumento: user.NumeroDocumento,
        permisos: permisosArray
      });

      setSuccess('Permisos actualizados correctamente');
      setTimeout(() => {
        if (onPermisosActualizados) onPermisosActualizados();
      }, 1500);
    } catch (err) {
      console.error('Error al actualizar permisos:', err);
      setError(err.response?.data?.message || 'Error al actualizar permisos');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="row align-items-center mb-4">
          <div className="col-auto">
            <div className="bg-success bg-opacity-10 rounded-3 p-3">
              <Shield className="text-success" size={24} />
            </div>
          </div>
          <div className="col">
            <h3 className="card-title h5 mb-1">Gestionar Permisos de {user.Email}</h3>
            <p className="text-muted mb-0">Activa o desactiva el acceso a cada módulo</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <AlertCircle className="me-2" size={20} />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <CheckCircle className="me-2" size={20} />
            <div>{success}</div>
          </div>
        )}

        <div className="row">
          {modulos.map(modulo => (
            <div key={modulo.IdModulo} className="col-md-6 mb-3">
              <div className={`card ${permisos[modulo.IdModulo] ? 'border-success' : 'border-secondary'}`}>
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i className={`${modulo.Icono} fs-4 me-3 ${permisos[modulo.IdModulo] ? 'text-success' : 'text-muted'}`}></i>
                      <div>
                        <h6 className="mb-0 text-capitalize">{modulo.NombreModulo}</h6>
                        <small className="text-muted">{modulo.Descripcion}</small>
                      </div>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        style={{ width: '3rem', height: '1.5rem' }}
                        checked={!!permisos[modulo.IdModulo]}
                        onChange={() => handleToggle(modulo.IdModulo)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr />

        <div className="d-flex gap-2">
          <button
            className="btn btn-success d-flex align-items-center"
            onClick={handleGuardar}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>Guardando...
              </>
            ) : (
              <>
                <Save className="me-2" size={18} />Guardar Permisos
              </>
            )}
          </button>
          <button
            className="btn btn-secondary d-flex align-items-center"
            onClick={onCerrar}
            disabled={loading}
          >
            <X className="me-2" size={18} />Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const SolicitudesTable = ({ solicitudes, onResponder, loading }) => {
  const [respondiendo, setRespondiendo] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [solicitudActual, setSolicitudActual] = useState(null);
  const [comentario, setComentario] = useState('');
  const [accionModal, setAccionModal] = useState('');

  const abrirModal = (solicitud, accion) => {
    setSolicitudActual(solicitud);
    setAccionModal(accion);
    setComentario('');
    setMostrarModal(true);
  };

  const handleResponder = async () => {
    if (!solicitudActual) return;

    setRespondiendo(solicitudActual.IdSolicitud);
    setMostrarModal(false);

    try {
      await onResponder(solicitudActual.IdSolicitud, accionModal, comentario);
      setComentario('');
    } catch (error) {
      console.error(error);
    } finally {
      setRespondiendo(null);
    }
  };

  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <div className="row align-items-center">
            <div className="col">
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 rounded-3 p-2 me-3">
                  <Clock className="text-warning" size={24} />
                </div>
                <div>
                  <h3 className="card-title h5 mb-1">Solicitudes Pendientes</h3>
                  <small className="text-muted">{solicitudes.length} {solicitudes.length === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'}</small>
                </div>
              </div>
            </div>
            <div className="col-auto">
              <span className="badge bg-warning fs-6 px-3 py-2">Pendientes: {solicitudes.length}</span>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {solicitudes.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-4 py-3">Usuario</th>
                    <th className="px-4 py-3">Módulo</th>
                    <th className="px-4 py-3">Justificación</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((solicitud) => (
                    <tr key={solicitud.IdSolicitud}>
                      <td className="px-4 py-3">
                        <div>
                          <div className="fw-bold text-dark">{solicitud.usuario?.Email}</div>
                          <small className="text-muted">Doc: {solicitud.NumeroDocumento}</small>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <i className={`${solicitud.modulo?.Icono} me-2`}></i>
                          <span className="text-capitalize">{solicitud.modulo?.NombreModulo}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <small className="text-muted">{solicitud.Justificacion}</small>
                      </td>
                      <td className="px-4 py-3">
                        <small className="text-muted">
                          {new Date(solicitud.FechaSolicitud).toLocaleDateString('es-CO')}
                        </small>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-success"
                            onClick={() => abrirModal(solicitud, 'aprobada')}
                            title="Aprobar solicitud"
                            disabled={respondiendo === solicitud.IdSolicitud}
                          >
                            {respondiendo === solicitud.IdSolicitud ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                              <CheckCircle size={16} />
                            )}
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => abrirModal(solicitud, 'rechazada')}
                            title="Rechazar solicitud"
                            disabled={respondiendo === solicitud.IdSolicitud}
                          >
                            <XCircle size={16} />
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
                <CheckCircle className="text-success" size={48} />
              </div>
              <h5 className="text-muted">No hay solicitudes pendientes</h5>
              <p className="text-muted mb-0">Todas las solicitudes han sido procesadas</p>
            </div>
          )}
        </div>
      </div>

      {mostrarModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {accionModal === 'aprobada' ? 'Aprobar' : 'Rechazar'} Solicitud
                </h5>
                <button type="button" className="btn-close" onClick={() => setMostrarModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Confirmas {accionModal === 'aprobada' ? 'APROBAR' : 'RECHAZAR'} la solicitud de{' '}
                  <strong>{solicitudActual?.usuario?.Email}</strong> para acceder al módulo{' '}
                  <strong className="text-capitalize">{solicitudActual?.modulo?.NombreModulo}</strong>?
                </p>
                <div className="mb-3">
                  <label className="form-label">Comentario (opcional)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Agrega un comentario para el usuario..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className={`btn ${accionModal === 'aprobada' ? 'btn-success' : 'btn-danger'}`}
                  onClick={handleResponder}
                >
                  {accionModal === 'aprobada' ? 'Aprobar' : 'Rechazar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const UserTable = ({ users, onGestionarPermisos, loading }) => {
  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary">
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
                <i className="bi bi-people text-primary fs-4"></i>
              </div>
              <div>
                <h3 className="card-title h5 mb-1">Usuarios del Sistema</h3>
                <small className="text-muted">{users.length} {users.length === 1 ? 'usuario registrado' : 'usuarios registrados'}</small>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <span className="badge bg-primary fs-6 px-3 py-2">Total: {users.length}</span>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        {users.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">Nombre Completo</th>
                  <th className="px-4 py-3">Teléfono</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.NumeroDocumento}>
                    <td className="px-4 py-3">
                      <div>
                        <div className="fw-bold text-dark">{user.Email}</div>
                        <small className="text-muted">Doc: {user.NumeroDocumento}</small>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center text-muted">
                        <i className="bi bi-person me-2"></i>
                        {user.Nombre1} {user.Nombre2} {user.Apellido1} {user.Apellido2}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center text-muted">
                        <i className="bi bi-telephone me-2"></i>{user.Telefono || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${user.Role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                        {user.Role === 'admin' ? 'Administrador' : 'Usuario'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => onGestionarPermisos(user)}
                        title="Gestionar permisos"
                      >
                        <Shield size={16} className="me-1" />
                        Permisos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="mb-3">
              <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
            </div>
            <h5 className="text-muted">No hay usuarios registrados</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminPermisosSystem() {
  const [users, setUsers] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userSeleccionado, setUserSeleccionado] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, modulosRes, solicitudesRes] = await Promise.all([
        api.get('/users'),
        api.get('/modulos'),
        api.get('/solicitudes/pendientes')
      ]);

      setUsers(usersRes.data.data || usersRes.data || []);
      setModulos(modulosRes.data.data || modulosRes.data || []);
      setSolicitudes(solicitudesRes.data.data || solicitudesRes.data || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.response?.data?.message || 'Error al cargar datos del servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleResponderSolicitud = async (idSolicitud, estado, comentario) => {
    try {
      await api.put(`/solicitudes/${idSolicitud}/responder`, {
        Estado: estado,
        ComentarioAdmin: comentario
      });
      await fetchData();
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Error al responder solicitud');
      throw error;
    }
  };

  const handleGestionarPermisos = (user) => {
    setUserSeleccionado(user);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <NavbarAdmin userData={userData} notificacionesCount={solicitudes.length} />
      <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 76px)' }}>
        <div className="container">
          <div className="mb-4">
            <h1 className="display-6 fw-bold text-dark mb-2">Gestión de Permisos</h1>
            <p className="lead text-muted">Administra los accesos de los usuarios a los módulos del sistema</p>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center" role="alert">
              <AlertCircle className="me-2" size={20} />
              <div>{error}</div>
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}

          {userSeleccionado && (
            <PermisosManager
              user={userSeleccionado}
              modulos={modulos}
              onPermisosActualizados={() => {
                setUserSeleccionado(null);
                fetchData();
              }}
              onCerrar={() => setUserSeleccionado(null)}
            />
          )}

          <SolicitudesTable
            solicitudes={solicitudes}
            onResponder={handleResponderSolicitud}
            loading={loading}
          />

          <div className="mt-4">
            <UserTable
              users={users.filter(u => u.Role !== 'admin')}
              onGestionarPermisos={handleGestionarPermisos}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
}