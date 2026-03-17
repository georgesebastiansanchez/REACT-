import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Shield } from 'lucide-react';

// Mapeo de rutas de módulos
const MODULO_RUTAS = {
  'inventario': '/inventario',
  'ventas': '/ventas',
  'compras': '/compras',
  'reportes': '/reportes',
  'proveedores': '/proveedores',
  'facturas': '/facturas'
};

// Navbar corregida
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
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Componente principal
export default function MiCuentaPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedData = localStorage.getItem('userData');
        
        if (storedData) {
          const data = JSON.parse(storedData);
          setUserData(data);
        } else {
          setError('No se pudo cargar la información del usuario');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar la información del usuario');
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <>
        <NavbarUser userData={userData} />
        <div className="container mt-5">
          <div className="text-center" style={{ paddingTop: '100px' }}>
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando información...</p>
          </div>
        </div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <NavbarUser userData={null} />
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> No se pudo cargar la información del usuario
          </div>
        </div>
      </>
    );
  }

  const tipoDocumento = userData.IdTipoDocumento === 1 ? 'Cédula de Ciudadanía' : 'Documento';
  const nombreCompleto = `${userData.Nombre1} ${userData.Nombre2 || ''} ${userData.Apellido1} ${userData.Apellido2 || ''}`.trim();
  const fechaRegistro = userData.FechaRegistro ? new Date(userData.FechaRegistro).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'No especificado';
  const fechaNacimiento = userData.FechaNacimiento ? new Date(userData.FechaNacimiento).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'No especificado';

  return (
    <>
      <NavbarUser userData={userData} />
      
      <div className="container py-5" style={{ marginTop: '80px' }}>
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        <div className="row mb-4">
          <div className="col">
            <h1 className="display-5 fw-bold text-primary d-flex align-items-center">
              <User className="me-2" size={40} />
              Mi Perfil
            </h1>
            <p className="text-muted">Información de tu cuenta</p>
          </div>
        </div>

        <div className="card shadow-lg border-0 mb-4">
          <div className="card-body p-4">
            <div className="text-center mb-4 pb-4 border-bottom">
              <div 
                className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '120px', height: '120px' }}
              >
                <span className="text-white display-3 fw-bold">
                  {userData.Nombre1?.charAt(0)}{userData.Apellido1?.charAt(0)}
                </span>
              </div>
              <h2 className="mb-2">{nombreCompleto}</h2>
              <p className="text-muted mb-2 d-flex align-items-center justify-content-center">
                <Mail size={16} className="me-2" />
                {userData.Email}
              </p>
              <span className={`badge ${userData.Activo ? 'bg-success' : 'bg-danger'} fs-6`}>
                {userData.Activo ? 'Cuenta Activa' : 'Cuenta Inactiva'}
              </span>
            </div>

            <div className="mb-4">
              <h5 className="text-primary mb-3 pb-2 border-bottom d-flex align-items-center">
                <CreditCard size={20} className="me-2" />
                Datos de Identificación
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">Tipo de Documento</small>
                    <strong>{tipoDocumento}</strong>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">Número de Documento</small>
                    <strong>{userData.NumeroDocumento}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-primary mb-3 pb-2 border-bottom d-flex align-items-center">
                <User size={20} className="me-2" />
                Información Personal
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">Primer Nombre</small>
                    <strong>{userData.Nombre1}</strong>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">Segundo Nombre</small>
                    <strong>{userData.Nombre2 || 'N/A'}</strong>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">Primer Apellido</small>
                    <strong>{userData.Apellido1}</strong>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">Segundo Apellido</small>
                    <strong>{userData.Apellido2 || 'N/A'}</strong>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded d-flex align-items-center">
                    <Calendar size={14} className="me-2 text-muted" />
                    <div>
                      <small className="text-muted d-block mb-1">Fecha de Nacimiento</small>
                      <strong>{fechaNacimiento}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded">
                    <small className="text-muted d-block mb-1">Edad</small>
                    <strong>{userData.Edad || 'N/A'} años</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-primary mb-3 pb-2 border-bottom d-flex align-items-center">
                <Phone size={20} className="me-2" />
                Información de Contacto
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded d-flex align-items-center">
                    <Phone size={14} className="me-2 text-muted" />
                    <div>
                      <small className="text-muted d-block mb-1">Teléfono</small>
                      <strong>{userData.Telefono || 'No especificado'}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 bg-light rounded d-flex align-items-center">
                    <Mail size={14} className="me-2 text-muted" />
                    <div>
                      <small className="text-muted d-block mb-1">Correo Electrónico</small>
                      <strong>{userData.Email}</strong>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="p-3 bg-light rounded d-flex align-items-start">
                    <MapPin size={14} className="me-2 text-muted mt-1" />
                    <div>
                      <small className="text-muted d-block mb-1">Dirección</small>
                      <strong>{userData.Direccion || 'No especificado'}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-primary mb-3 d-flex align-items-center">
                  <Calendar size={20} className="me-2" />
                  Información de Registro
                </h5>
                <div className="p-3 bg-light rounded">
                  <small className="text-muted d-block mb-1">Fecha de registro en el sistema</small>
                  <strong className="d-block">{fechaRegistro}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title text-primary mb-3 d-flex align-items-center">
                  <Shield size={20} className="me-2" />
                  Rol y Permisos
                </h5>
                <div className="p-3 bg-light rounded">
                  <small className="text-muted d-block mb-2">Tipo de cuenta</small>
                  <span className={`badge ${userData.Role === 'admin' ? 'bg-danger' : 'bg-info'} fs-6`}>
                    {userData.Role === 'user' ? 'Usuario Regular' : 
                     userData.Role === 'admin' ? 'Administrador' : 
                     userData.Role || 'Usuario'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="alert alert-info mt-4" role="alert">
          <strong>Nota:</strong> Si necesitas actualizar tu información personal, por favor contacta al administrador del sistema.
        </div>
      </div>

      <style>{`
        .card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .bg-light {
          transition: background-color 0.2s ease;
        }
        .bg-light:hover {
          background-color: #e9ecef !important;
        }
      `}</style>
    </>
  );
}