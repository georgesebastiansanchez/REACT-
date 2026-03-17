import React, { useState } from "react";
import "../css/Header.css"
export default function Header() {
  return (
    <header className="bg-light py-5 text-center">
      <div className="container">
        <h1 className="display-5 fw-bold">Mond Jeans</h1>
        <p className="lead">Estilo y calidad en cada prenda</p>
        <img src="img/logo.jpeg" className="img-fluid rounded shadow" alt="Logo" style={{ maxWidth: "180px" }} />
      </div>
    </header>
  );
}