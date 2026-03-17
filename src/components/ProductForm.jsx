import React, { useState } from 'react'; // Importar la instancia de Axios
import "../css/AgregarProducto.css";

const ProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'jeans_hombre',
    cantidad: '',
    color: '',
    marca: '',
    talla: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await api.post('/productos', formData); // Ya no usas FormData porque no estás subiendo archivos
      onProductAdded();
      setFormData({
        nombre: '',
        categoria: 'jeans_hombre',
        cantidad: '',
        color: '',
        marca: '',
        talla: '',
      });
    } catch (error) {
      console.error('Error al agregar producto:', error);
      alert('Error al agregar producto');
    }
  };

  return (
    <div className="agregar-producto" style={{ marginBottom: 40 }}>
      <h2>Agregar Producto</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400 }}
      >
        <label>Nombre del Producto</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />

        <label>Categoría</label>
        <select name="categoria" value={formData.categoria} onChange={handleChange}>
          <option value="jeans_hombre">Jeans Hombre</option>
          <option value="blusas">Blusas</option>
          <option value="camisas">Camisas</option>
          <option value="jeans_mujer">Jeans Mujer</option>
          <option value="camisetas">Camisetas</option>
        </select>

        <label>Cantidad</label>
        <input type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} required />

        <label>Color</label>
        <input type="text" name="color" value={formData.color} onChange={handleChange} required />

        <label>Marca</label>
        <input type="text" name="marca" value={formData.marca} onChange={handleChange} required />

        <label>Talla</label>
        <input type="text" name="talla" value={formData.talla} onChange={handleChange} required />

        <button type="submit" style={{ marginTop: 10 }}>
          Agregar Producto
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
