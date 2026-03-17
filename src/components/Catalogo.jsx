import { useState, useEffect } from "react";
import "../css/Catalogo.css";

const productos = [
  { id: 1, nombre: "Camisa Negra", img: "/img/camisa_negra.jpeg", precio: "$90.000" },
  { id: 2, nombre: "Camisa Bardros", img: "/img/camisabardros.jpg", precio: "$95.000" },
  { id: 3, nombre: "Jean Cargo", img: "/img/cargo.jpg", precio: "$130.000" },
  { id: 4, nombre: "Chaqueta", img: "/img/chaqueta.jpg", precio: "$180.000" },
  { id: 5, nombre: "Crop Top", img: "/img/crop top.jpg", precio: "$70.000" },
  { id: 6, nombre: "Jean Hombre HipHop", img: "/img/jean hombre hiop.jpg", precio: "$120.000" },
  { id: 7, nombre: "Pantalón Baguie", img: "/img/pantalon baguie.jpeg", precio: "$140.000" }
];

function Catalogo() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleItems = 3; // cuántos se muestran al tiempo

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % productos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getVisibleProductos = () => {
    return productos
      .slice(startIndex, startIndex + visibleItems)
      .concat(
        productos.slice(0, Math.max(0, startIndex + visibleItems - productos.length))
      );
  };

  return (
    <section className="catalogo">
      <h2 className="titulo">Catálogo</h2>
      <div className="carrusel">
        {getVisibleProductos().map((p) => (
          <div key={p.id} className="card">
            <img src={p.img} alt={p.nombre} />
            <h3>{p.nombre}</h3>
            <p>{p.precio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Catalogo;
