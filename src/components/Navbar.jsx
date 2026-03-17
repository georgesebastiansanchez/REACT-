import React from "react";
import { Link } from "react-router-dom"; // 👈 Import Link
import "../css/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        {/* Logo con imagen y texto */}
        <a
          className="navbar-brand fw-bold d-flex align-items-center"
          href="/"
        >
          <img
            src="/img/logo.jpeg"
            alt="Mond Jeans Logo"
            style={{ height: "40px", marginRight: "8px" }}
          />
          Mond Jeans
        </a>

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
            <li className="nav-item">
              <a className="nav-link" href="#catalogo">
                Productos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#quienes">
                Quiénes somos
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#ubicacion">
                Ubicación
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                id="toggleCarrito"
                title="Ver carrito"
              >
                <i className="bi bi-bag-fill fs-5"></i>
              </a>
            </li>
          </ul>

          {/* Botones de navegación */}
          <button
            className="btn btn-primary ms-lg-3"
            data-bs-toggle="modal"
            data-bs-target="#loginModal"
          >
            Iniciar sesión
          </button>

          <Link to="/registrar" className="btn btn-outline-secondary ms-lg-2">
            Crear cuenta
          </Link>
        </div>
      </div>
    </nav>
  );
}
