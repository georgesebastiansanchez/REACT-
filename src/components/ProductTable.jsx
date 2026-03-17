import React, { useEffect, useState } from 'react';
import "../css/TablaInventario.css";

const ProductTable = ({ refresh }) => {
  const [productos, setProductos] = useState([]);

  const cargarProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const eliminarProducto = async id => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await api.delete(`/productos/${id}`);
      cargarProductos();
    } catch (error) {
      console.error('Error eliminando producto:', error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [refresh]);

  return (
    <>
      <h2>Productos en Inventario</h2>
      <table className="tabla-inventario" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {/* Quitamos imagen */}
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Color</th>
            <th>Marca</th>
            <th>Talla</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              {/* Quitamos columna de imagen */}
              <td>{p.nombre}</td>
              <td>{p.categoria}</td>
              <td>{p.cantidad}</td>
              <td>{p.color}</td>
              <td>{p.marca}</td>
              <td>{p.talla}</td>
              <td>
                <button className="editar" style={{ marginRight: 10 }}>Editar</button>
                <button className="eliminar" onClick={() => eliminarProducto(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {productos.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No hay productos en inventario</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default ProductTable;

