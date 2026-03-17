import React, { useState } from "react";
import "../css/Ubicacion.css"
export default function Ubicacion() {
  return (
    <section id="ubicacion" className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Encuéntranos aquí</h2>
        <div className="ratio ratio-16x9">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3976.871074443789!2d-74.10445982413333!3d4.617078742374976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1ssan%20andresito%20de%20la%2038!5e0!3m2!1ses-419!2sco!4v1751843498209!5m2!1ses-419!2sco"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
