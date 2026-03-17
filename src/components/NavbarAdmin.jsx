import React from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/authService";


export default function NavbarAdmin({ userData }) {
  
  const navigate = useNavigate();
  const user = userData || AuthService.getUserData();
  const userName = user?.name || user?.username || user?.email || 'Administrador';

  const handleLogout = () => {
    const confirmLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmLogout) {
      console.log('🚪 Cerrando sesión del administrador...');
      AuthService.logout();
      navigate('/');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow">
      <div className="container">
        {/* Logo con imagen y texto */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center text-dark"
          to="/admin"
        >
          <img
            src="/img/logo.jpeg"
            alt="Logo Admin"
            style={{ height: "40px", marginRight: "8px" }}
          />
          Panel Administrador
        </Link>

        {/* Botón toggle para móvil */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navAdmin"
          aria-controls="navAdmin"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div className="collapse navbar-collapse" id="navAdmin">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
         
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/inventario">
                <i className="bi bi-boxes me-1"></i>
                Inventario
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/reportes">
                <i className="bi bi-graph-up me-1"></i>
                Reportes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/proveedores">
                <i className="bi bi-truck me-1"></i>
                Proveedores
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/permisos">
                <i className="bi bi-person-gear me-1"></i>
             Cuenta y permisos
              </Link>
            </li>
            
            {/* Icono de admin */}
            <li className="nav-item">
              <span
                className="nav-link text-secondary"
                title={`Administrador: ${userName}`}
              >
                <i className="bi bi-person-badge fs-5"></i>
              </span>
            </li>
          </ul>

          {/* Información del admin y botón de logout */}
          <span className="navbar-text me-3 d-none d-md-inline text-muted">
            <i className="bi bi-shield-check me-1 text-secondary"></i>
            Admin: <strong className="text-secondary">{userName}</strong>
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