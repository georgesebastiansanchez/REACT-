import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, Package, DollarSign, ShoppingCart, BarChart3, Calendar, RefreshCw } from 'lucide-react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de que Bootstrap esté disponible
import 'bootstrap-icons/font/bootstrap-icons.css'; // Y los iconos de Bootstrap

// Base URL para la API


// Configurar interceptor para Axios (Añade el token a todas las peticiones salientes)
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

// Componente de barra de navegación para el administrador/usuario
const NavbarAdmin = ({ activeSection }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    try {
      const userString = localStorage.getItem('userData');
      const userRole = localStorage.getItem('userRole');
      
      if (userString) {
        const user = JSON.parse(userString);
        setUserData({
          ...user,
          role: userRole || user.role || user.Rol || 'user'
        });
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
    }
  }, []);

  const user = userData || { name: 'Usuario', role: 'user' };
  const userName = user?.Nombre || user?.name || user?.username || user?.email || 'Usuario';
  const userRole = user?.role || user?.Rol || 'user';
  const isAdmin = userRole === 'admin' || userRole === 'administrador';

  const handleLogout = () => {
    const confirmLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmLogout) {
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
            <li className="nav-item">
              <a className={`nav-link text-dark ${activeSection === 'dashboard' ? 'fw-bold' : ''}`} href={isAdmin ? "/admin" : "/dashboard"}>
                <i className="bi bi-speedometer2 me-1"></i>Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link text-dark ${activeSection === 'inventario' ? 'fw-bold' : ''}`} href="/inventario">
                <i className="bi bi-clipboard-check me-1"></i>Inventario
              </a>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <a className={`nav-link text-dark ${activeSection === 'reportes' ? 'fw-bold' : ''}`} href="/reportes">
                  <i className="bi bi-graph-up me-1"></i>Reportes
                </a>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <a className={`nav-link text-dark ${activeSection === 'proveedores' ? 'fw-bold' : ''}`} href="/proveedores">
                  <i className="bi bi-truck me-1"></i>Proveedores
                </a>
              </li>
            )}
            <li className="nav-item">
              <a className={`nav-link text-dark ${activeSection === 'compras' ? 'fw-bold' : ''}`} href="/compras">
                <i className="bi bi-cart me-1"></i>Compras
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link text-dark ${activeSection === 'facturas' ? 'fw-bold' : ''}`} href="/facturas">
                <i className="bi bi-receipt me-1"></i>Facturas
              </a>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <a className={`nav-link text-dark ${activeSection === 'permisos' ? 'fw-bold' : ''}`} href="/permisos">
                  <i className="bi bi-person-gear me-1"></i>Cuenta y permisos
                </a>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3 d-none d-md-inline text-muted">
              <i className={`bi ${isAdmin ? 'bi-shield-check' : 'bi-person-circle'} me-1 text-secondary`}></i>
              {isAdmin ? 'Admin' : 'Usuario'}: <strong className="text-secondary">{userName}</strong>
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


// Componente de tarjeta de estadísticas
const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="card shadow-sm border-0 h-100">
    <div className="card-body">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className={`bg-${color} bg-opacity-10 rounded-3 p-3`}>
          <Icon className={`text-${color}`} size={24} />
        </div>
      </div>
      <h6 className="text-muted mb-2">{title}</h6>
      <h3 className="fw-bold mb-0">{value}</h3>
      {subtitle && <small className="text-muted">{subtitle}</small>}
    </div>
  </div>
);

// Componente para la tabla de productos más vendidos
const ProductosPopulares = ({ productos }) => (
  <div className="card shadow-sm">
    <div className="card-header bg-light">
      <div className="d-flex align-items-center">
        <div className="bg-primary bg-opacity-10 rounded-3 p-2 me-3">
          <TrendingUp className="text-primary" size={20} />
        </div>
        <div>
          <h5 className="card-title mb-0">Productos Más Vendidos</h5>
          <small className="text-muted">Top 5 productos del período</small>
        </div>
      </div>
    </div>
    <div className="card-body p-0">
      {productos && productos.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Detalles</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-center">Cantidad Vendida</th>
                <th className="px-4 py-3 text-end">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-2" 
                          style={{width: '32px', height: '32px'}}>
                        <span className="text-primary fw-bold small">{index + 1}</span>
                      </div>
                      <div>
                        <div className="fw-bold">{item.producto?.Nombre || 'N/A'}</div>
                        <small className="text-muted">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0
                          }).format(item.producto?.PrecioBase || 0)}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex flex-wrap gap-1">
                      {item.producto?.Marca && (
                        <span className="badge bg-secondary">{item.producto.Marca}</span>
                      )}
                      {item.producto?.Talla && (
                        <span className="badge bg-warning text-dark">{item.producto.Talla}</span>
                      )}
                      {item.producto?.Color && (
                        <span className="badge bg-dark">{item.producto.Color}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`badge ${
                      item.producto?.Stock === 0 ? 'bg-danger' : 
                      item.producto?.Stock <= 5 ? 'bg-warning text-dark' : 
                      'bg-success'
                    }`}>
                      {item.producto?.Stock || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="badge bg-primary fs-6">{item.total_vendido}</span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <span className="fw-bold text-success">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0
                      }).format(item.ingresos_totales || 0)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5">
          <Package className="text-muted mb-3" size={48} />
          <p className="text-muted">No hay datos de productos más vendidos disponibles para este período.</p>
        </div>
      )}
    </div>
  </div>
);

// Componente para la tabla de ventas por día
const VentasPorDia = ({ ventas }) => (
  <div className="card shadow-sm">
    <div className="card-header bg-light">
      <div className="d-flex align-items-center">
        <div className="bg-success bg-opacity-10 rounded-3 p-2 me-3">
          <BarChart3 className="text-success" size={20} />
        </div>
        <div>
          <h5 className="card-title mb-0">Ventas Últimos Días</h5>
          <small className="text-muted">Resumen de ventas diarias</small>
        </div>
      </div>
    </div>
    <div className="card-body">
      {ventas && ventas.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Fecha</th>
                <th className="text-center">Cantidad</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta, index) => (
                <tr key={index}>
                  <td>
                    <i className="bi bi-calendar me-2 text-muted"></i>
                    {new Date(venta.fecha).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="text-center">
                    <span className="badge bg-info">{venta.cantidad}</span>
                  </td>
                  <td className="text-end fw-bold text-success">
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0
                    }).format(venta.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4">
          <ShoppingCart className="text-muted mb-2" size={40} />
          <p className="text-muted mb-0">No hay ventas registradas para este período</p>
        </div>
      )}
    </div>
  </div>
);

// Componente Principal: ReportesSystem
const ReportesSystem = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fechaDesde, setFechaDesde] = useState(() => {
    // Establecer la fecha de inicio al primer día del mes actual
    const date = new Date();
    date.setDate(1);
    return date.toISOString().split('T')[0];
  });
  const [fechaHasta, setFechaHasta] = useState(() => {
    // Establecer la fecha de fin al día actual
    return new Date().toISOString().split('T')[0];
  });
  
  // Estados para la información del usuario obtenida de localStorage
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState("user");

  // 1. Efecto para cargar la data del usuario desde localStorage y realizar la primera carga del dashboard
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const storedUserRole = localStorage.getItem('userRole');

    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (e) {
        console.error("Error parsing userData from localStorage", e);
      }
    }
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
    
    // Llamada inicial para cargar el dashboard
    // Se ejecuta después de intentar cargar el token en el interceptor de axios
    fetchDashboard();
  }, []); // Se ejecuta solo una vez al montar

  // Función para obtener los datos del dashboard
  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      // Intentamos 3 veces con backoff
      const maxRetries = 3;
      let response = null;

      for (let i = 0; i < maxRetries; i++) {
        try {
          response = await axiosInstance.get(`${API_BASE_URL}/reportes/dashboard`, {
            params: {
              fecha_desde: fechaDesde,
              fecha_hasta: fechaHasta
            }
          });
          // Si es exitoso, rompemos el ciclo
          break; 
        } catch (err) {
          if (i === maxRetries - 1) {
            throw err; // Lanzar el error en el último intento
          }
          // Implementar backoff exponencial: 1s, 2s, 4s
          const delay = Math.pow(2, i) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          console.log(`Reintento de conexión ${i + 1}/${maxRetries} después de ${delay}ms...`);
        }
      }
      
      console.log('Respuesta del servidor:', response.data);
      
      if (response.data.success) {
        setData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Error al cargar datos del dashboard');
      }
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del error:', error.response?.data);
      
      let errorMessage = 'Error al cargar el dashboard';

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        } else if (status === 403) {
          errorMessage = 'No tienes permisos de administrador para ver los reportes.';
        } else if (status === 500) {
          errorMessage = `Error interno del servidor: ${data?.error || data?.message || 'Error desconocido'}`;
          console.error('Detalles del error 500:', data);
        } else {
          errorMessage = data?.message || error.message;
        }
      } else if (error.request) {
        errorMessage = 'Error de conexión. Verifica que el servidor de la API';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrar = () => {
    fetchDashboard();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value || 0);
  };
  
  // Usar el rol de administrador para la visibilidad (aunque la API debería restringir esto)
  const isAdmin = userRole.toLowerCase() === "admin";

  return (
    <>
      {/* Navbar de la aplicación */}
      <NavbarAdmin userData={userData} userRole={userRole} />

      <div className="container-fluid py-4" style={{backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 76px)'}}>
        <div className="container">
          {/* Header */}
          <div className="mb-4">
            <div className="row align-items-center">
              <div className="col">
                <h1 className="display-6 fw-bold text-dark mb-2">
                  Dashboard de Reportes
                </h1>
                <p className="lead text-muted">
                  Análisis y estadísticas de tu negocio
                </p>
              </div>
            </div>
          </div>

          {/* Filtros de fecha */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row align-items-end">
                <div className="col-md-4 mb-3 mb-md-0">
                  <label className="form-label fw-semibold">
                    <Calendar size={16} className="me-2" />
                    Fecha Desde
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                  />
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <label className="form-label fw-semibold">
                    <Calendar size={16} className="me-2" />
                    Fecha Hasta
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleFiltrar}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Cargando...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} className="me-2" />
                        Actualizar Reporte
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center" role="alert">
              <AlertCircle className="me-2" size={20} />
              <div>{error}</div>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
              ></button>
            </div>
          )}
          
          {/* Alerta si el usuario no es Admin (solo como feedback visual) */}
          {!isAdmin && !loading && (
             <div className="alert alert-warning d-flex align-items-center" role="alert">
                <AlertCircle className="me-2" size={20} />
                Solo los administradores tienen acceso completo a todos los reportes.
             </div>
          )}


          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted mt-2">Obteniendo datos...</p>
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && data && (
            <>
              {/* Stats Cards */}
              <div className="row g-4 mb-4">
                <div className="col-lg-3 col-md-6">
                  <StatCard
                    title="Total Ventas"
                    value={data.ventas?.total_ventas || 0}
                    icon={ShoppingCart}
                    color="primary"
                    subtitle="Ventas completadas"
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <StatCard
                    title="Ingresos Totales"
                    value={formatCurrency(data.ventas?.ingresos_totales)}
                    icon={DollarSign}
                    color="success"
                    subtitle="Período seleccionado"
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <StatCard
                    title="Ticket Promedio"
                    value={formatCurrency(data.ventas?.ticket_promedio)}
                    icon={TrendingUp}
                    color="info"
                    subtitle="Promedio por venta"
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <StatCard
                    title="Productos Activos"
                    value={data.inventario?.total_productos || 0}
                    icon={Package}
                    color="warning"
                    subtitle={`${data.inventario?.sin_stock || 0} sin stock`}
                  />
                </div>
              </div>

              {/* Inventory Stats - Detalle */}
              <div className="row g-4 mb-4">
                <div className="col-md-12">
                  <div className="card shadow-sm">
                    <div className="card-header bg-light">
                      <h5 className="card-title mb-0">
                        <Package className="me-2 text-dark" size={20} />
                        Estadísticas de Inventario
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row text-center">
                        <div className="col-md-4 col-sm-12 py-3 py-md-0">
                          <div className="p-1">
                            <h2 className="fw-bold text-primary">{data.inventario?.total_productos || 0}</h2>
                            <p className="text-muted mb-0">Total Productos</p>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-12 py-3 py-md-0 border-start border-sm-none">
                          <div className="p-1">
                            <h2 className="fw-bold text-danger">{data.inventario?.sin_stock || 0}</h2>
                            <p className="text-muted mb-0">Sin Stock (Urgente)</p>
                          </div>
                        </div>
                        <div className="col-md-4 col-sm-12 py-3 py-md-0 border-start border-sm-none">
                          <div className="p-1">
                            <h2 className="fw-bold text-warning">{data.inventario?.stock_bajo || 0}</h2>
                            <p className="text-muted mb-0">Stock Bajo (≤ 5)</p>
                          </div>
                        </div>
                      </div>
                      <hr className="my-3"/>
                      <div className="text-center">
                        <h4 className="fw-bold text-success">
                          Valor Total de Inventario: {formatCurrency(data.inventario?.valor_inventario)}
                        </h4>
                        <p className="text-muted mb-0">Valor del inventario actual (basado en precio base)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="row g-4">
                <div className="col-lg-7">
                  <ProductosPopulares productos={data.productos_populares} />
                </div>
                <div className="col-lg-5">
                  <VentasPorDia ventas={data.ventas_por_dia} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ReportesSystem;
