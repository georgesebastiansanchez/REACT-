import React from 'react';
import  "../css/InventarioNavbar.css"
const Navbar = () => {
  return (
    <header className="navbar" style={styles.navbar}>
      <div className="logo">Inventario mond | Administrador</div>
      <nav>
        <ul className="menu" style={styles.menu}>
          <li><a href="/admin">Inicio</a></li>
          <li><a href="/inventario">Inventario</a></li>
          <li><a href="/reportes">Reportes</a></li> 
          <li><a href="/proveedores">Proveedores</a></li>
          <li><a href="/cuentaypermisos">Cuenta/Permisos</a></li>
          <li><a href="/roles">Cerrar Sesión</a></li>
        </ul>
      </nav>
    </header>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#333',
    color: 'white',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menu: {
    listStyle: 'none',
    display: 'flex',
    gap: '15px',
    margin: 0,
    padding: 0,
  },
};

export default Navbar;