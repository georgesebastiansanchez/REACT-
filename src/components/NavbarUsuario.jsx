import React from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/authService";

export default function Navbar({ usuario, admin, userData }) {
  const navigate = useNavigate();
  const user = userData || AuthService.getUserData();
  const userName = user?.name || user?.username || user?.email || 'Usuario';

  const handleLogout = () => {
    const confirmLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmLogout) {
      console.log('🚪 Cerrando sesión...');
      AuthService.logout();
      navigate('/');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        {/* Logo con imagen y texto */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center"
          to={usuario ? "/usuario" : "/admin"}
        >
          <img
            src="/img/logo.jpeg"
            alt="Logo"
            style={{ height: "40px", marginRight: "8px" }}
          />
          {usuario ? "Panel Usuario" : "Panel Admin"}
        </Link>

        {/* Botón toggle para móvil */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-controls="nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            {usuario && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/cuenta">
                    Mi Cuenta
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/permisos">
                    Pedir Permisos
                  </Link>
                </li>
              </>
            )}
            
            {admin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/inventario">
                    Inventario
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/reportes">
                    Reportes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/permisos">
                    Permisos
                  </Link>
                </li>
              </>
            )}
            
            {/* Icono de usuario */}
            <li className="nav-item">
              <span
                className="nav-link"
                title={`Conectado como: ${userName}`}
              >
                <i className="bi bi-person-circle fs-5"></i>
              </span>
            </li>
          </ul>

          {/* Información del usuario y botón de logout */}
          <span className="navbar-text me-3 d-none d-md-inline text-muted">
            Hola, <strong>{userName}</strong>
          </span>

          <button
            className="btn btn-outline-danger ms-lg-2"
            onClick={handleLogout}
            title="Cerrar Sesión"
          >
            <i className="bi bi-box-arrow-right me-1"></i>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}