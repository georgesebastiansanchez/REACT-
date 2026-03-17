import React from "react";
import Navbar from "./NavbarAdmin";
import Modulo from "./Modulo";
import "../css/Adminpanel.css";

export default function AdminPanel() {
  return (
    <>
      <Navbar />
      <main className="bienvenida">
        <h1>Bienvenido al Panel de Administración</h1>
        <p>
          Has iniciado sesión como <strong>Administrador</strong>. Gestiona todos los módulos del sistema desde aquí.
        </p>

        <div className="modulos">
          <Modulo
            imgSrc="img/inventarios.png"
            alt="Inventario"
            title="Inventario"
            description="Gestiona entradas, salidas y el control de stock."
            link="/inventario"
            imgWidth="80"
          />

          <Modulo
            imgSrc="img/resportes.jpeg"
            alt="Reportes"
            title="Reportes"
            description="Genera reportes detallados del sistema."
            link="/reportes"
            imgWidth="105"
          />

          <Modulo
            imgSrc="img/proveedores.jpeg"
            alt="Proveedores"
            title="Proveedores"
            description="Administra proveedores y sus compras."
            link="/proveedores"
            imgWidth="120"
          />

          {}
          <Modulo
            imgSrc="img/compras.png"   
            alt="Compras"
            title="Compras"
            description="Registra, consulta y gestiona las compras realizadas."
            link="/compras"        
          />

          {}
          <Modulo
            imgSrc="img/factura.png"   
            alt="Factura"
            title="Factura"
            description="Genera, consulta y administra las facturas del sistema."
            link="/factura"
            imgWidth="110"
          />

          <Modulo
            imgSrc="img/permisos.jpeg"
            alt="Usuarios"
            title="Cuenta y permisos"
            description="Edita tu información personal y agrega permisos."
            link="/permisos"
            imgWidth="115"
          />
        </div>
      </main>
    </>
  );
}