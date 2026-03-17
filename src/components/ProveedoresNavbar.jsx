import React from "react";
import { Link } from "react-router-dom";
import "../css/ProveedoresNavbar.css";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="logo">Inventario Mond | Administrador</div>
      <nav>
        <ul className="menu">
          <li><Link to="/admin">Inicio</Link></li>
          <li><Link to="/inventario">Inventario</Link></li>
          <li><Link to="/reportes">Reportes</Link></li>
          <li><Link to="/proveedores">Proveedores</Link></li>
          <li><Link to="/cuentaypermisos">Cuenta/Permisos</Link></li>
          <li><Link to="/">Cerrar Sesión</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
