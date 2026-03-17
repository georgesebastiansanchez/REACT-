import React, { useState, useEffect } from "react";

const ProveedorForm = ({ proveedorEditado, onGuardado, onCancelar }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    tipoProveedor: "",
  });

  // Si se está editando, precargar datos
  useEffect(() => {
    if (proveedorEditado) {
      setFormData(proveedorEditado);
    } else {
      setFormData({ nombre: "", direccion: "", tipoProveedor: "" });
    }
  }, [proveedorEditado]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = proveedorEditado
        ? `http://localhost:8000/api/proveedores/${proveedorEditado.id}`
        : "http://localhost:8000/api/proveedores";

      const method = proveedorEditado ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al guardar el proveedor");

      const data = await res.json();
      onGuardado(data); // Actualiza lista en la página principal
      setFormData({ nombre: "", direccion: "", tipoProveedor: "" });
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar el proveedor.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h2>{proveedorEditado ? "Editar" : "Agregar"} Proveedor</h2>

      <label>Nombre:</label>
      <input
        type="text"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />

      <label>Dirección:</label>
      <input
        type="text"
        name="direccion"
        value={formData.direccion}
        onChange={handleChange}
        required
      />

      <label>Tipo de Proveedor:</label>
      <select
        name="tipoProveedor"
        value={formData.tipoProveedor}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione un tipo</option>
        <option value="Camisas">Camisas</option>
        <option value="Blusas">Blusas</option>
        <option value="Jeans">Jeans</option>
        <option value="Nacional">Nacional</option>
        <option value="Internacional">Internacional</option>
        <option value="Materia Prima">Materia Prima</option>
        <option value="Distribuidor">Distribuidor</option>
        <option value="Servicio">Servicio</option>
      </select>

      <button type="submit">
        {proveedorEditado ? "Guardar Cambios" : "Agregar Proveedor"}
      </button>

      {proveedorEditado && (
        <button type="button" onClick={onCancelar} className="cancelar">
          Cancelar
        </button>
      )}
    </form>
  );
};

export default ProveedorForm;
