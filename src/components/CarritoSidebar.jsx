import React, { useState } from "react";
import "../css/CarritoSidebar.css"
export default function CarritoSidebar() {
  return (
    <div id="carritoSidebar" className="carrito-sidebar">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">🛒 Carrito</h5>
        <button id="cerrarCarrito" className="btn btn-sm btn-close"></button>
      </div>
      <ul id="carritoLista" className="list-group mb-3"></ul>
      <h5>Total: <span id="totalCarrito">$0</span></h5>
    </div>
  );
}
