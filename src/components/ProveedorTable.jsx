import React from "react";

const ProveedorTable = ({ proveedores, onEditar, onEliminar }) => {
  const handleEliminar = async (id) => {
    const confirmar = confirm("¿Estás seguro de eliminar este proveedor?");
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:8000/api/proveedores/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Error al eliminar proveedor");

      onEliminar(id); // Notificar al padre que se eliminó
    } catch (error) {
      console.error(error);
      alert("Error al eliminar proveedor");
    }
  };

  return (
    <div className="tabla-container">
      <h2>Listado de Proveedores</h2>
      <table className="tabla-proveedores">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.length > 0 ? (
            proveedores.map((prov) => (
              <tr key={prov.id}>
                <td>{prov.id}</td>
                <td>{prov.nombre}</td>
                <td>{prov.direccion}</td>
                <td>{prov.tipoProveedor}</td>
                <td>
                  <button onClick={() => onEditar(prov)}>✏️</button>
                  <button onClick={() => handleEliminar(prov.id)}>🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay proveedores registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProveedorTable;
