import React, { useState } from "react";
import "../css/Navbar.css"
export default function About() {
  return (
    <section id="quienes" className="bg-light py-5">
      <div className="container text-center">
        <h2>Quiénes somos</h2>
        <p className="mb-4">Somos Mond Jeans, una marca colombiana comprometida con estilo, calidad y sostenibilidad.</p>
        <div className="row">
          <div className="col-md-4"><div className="card p-3"><h5>Misión</h5><p>Diseñar prendas con autenticidad.</p></div></div>
          <div className="col-md-4"><div className="card p-3"><h5>Visión</h5><p>Ser líderes en la moda urbana colombiana.</p></div></div>
          <div className="col-md-4"><div className="card p-3"><h5>Valores</h5><p>Sostenibilidad, comunidad, calidad.</p></div></div>
        </div>
      </div>
    </section>
  );
}
