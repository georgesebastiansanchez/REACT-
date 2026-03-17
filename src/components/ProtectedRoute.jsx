import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthService from "../services/authService";
import axios from 'axios';

const API_URL = "https://web-production-d9e15.up.railway.app/api";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    const currentPath = window.location.pathname;

    if (userRole === 'admin' && currentPath !== '/admin') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'user' && currentPath !== '/usuario') {
      return <Navigate to="/usuario" replace />;
    } else if (!['admin', 'user'].includes(userRole)) {
      AuthService.logout();
      return <Navigate to="/" replace />;
    }

    return (
      <div className="container mt-5 text-center">
        <h4>Acceso Denegado</h4>
        <p>No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  return children;
};

export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
);

export const UserRoute = ({ children }) => (
  <ProtectedRoute requiredRole="user">{children}</ProtectedRoute>
);

export const ModuleRoute = ({ children, moduleName }) => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getUserRole();

  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (userRole === 'admin') {
          setHasPermission(true);
          setLoading(false);
          return;
        }

        if (userRole === 'user') {
          const token = AuthService.getToken(); // 👈 asegúrate que tu AuthService tenga este método

          const [permisosResponse, modulosResponse] = await Promise.all([
            axios.get(`${API_URL}/permisos/mis-permisos`, {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${API_URL}/modulos`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          ]);

          const permisos = permisosResponse.data.data || permisosResponse.data || [];
          const modulos = modulosResponse.data.data || modulosResponse.data || [];

          const modulo = modulos.find(m =>
            (m.NombreModulo || m.nombre_modulo)?.toLowerCase() === moduleName.toLowerCase()
          );

          if (modulo) {
            const tienePermiso = permisos.some(p =>
              (p.IdModulo || p.id_modulo) === (modulo.IdModulo || modulo.id_modulo) &&
              (p.TieneAcceso === true || p.tiene_acceso === 1)
            );
            setHasPermission(tienePermiso);
          } else {
            setHasPermission(false);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error verificando permisos:", error);
        if (error.response?.status === 401) {
          AuthService.logout();
          window.location.href = "/";
          return;
        }
        setHasPermission(false);
        setLoading(false);
      }
    };

    if (isAuthenticated) checkPermission();
    else setLoading(false);
  }, [isAuthenticated, userRole, moduleName]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <div className="text-center mt-5">Verificando permisos...</div>;
  }

  if (!hasPermission) {
    return (
      <div className="container mt-5 text-center">
        <h4>🚫 No tienes acceso a {moduleName}</h4>
        <button
          className="btn btn-primary mt-3"
          onClick={() => (window.location.href = "/mis-permisos")}
        >
          Solicitar Acceso
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
