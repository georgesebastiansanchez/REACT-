import React, { useState, useEffect } from "react";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Obtener token y email de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    const emailParam = urlParams.get('email');
    
    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
    } else {
      alert("❌ Enlace inválido");
      window.location.href = "/login";
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.password_confirmation) {
      alert("❌ Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://web-production-d9e15.up.railway.app/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: token,
          email: email,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Contraseña actualizada correctamente. Redirigiendo al login...");
        setTimeout(() => {
          window.location.href = "/registrar";
        }, 2000);
      } else {
        alert("❌ " + (data.message || "Error al actualizar la contraseña"));
      }
    } catch (error) {
      alert("❌ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "50px auto",
      padding: "30px",
      fontFamily: "Arial, sans-serif",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      borderRadius: "10px"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    input: {
      padding: "15px",
      fontSize: "16px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      outline: "none"
    },
    button: {
      padding: "15px",
      fontSize: "16px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s"
    },
    buttonDisabled: {
      backgroundColor: "#ccc",
      cursor: "not-allowed"
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#333"
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Restablecer Contraseña</h2>
      
      <div style={styles.form}>
        <input 
          type="password" 
          name="password" 
          placeholder="Nueva contraseña" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          style={styles.input}
          minLength={6}
        />

        <input 
          type="password" 
          name="password_confirmation" 
          placeholder="Confirmar nueva contraseña" 
          value={formData.password_confirmation} 
          onChange={handleChange} 
          required 
          style={styles.input}
          minLength={6}
        />

        <button 
          onClick={handleSubmit}
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? "Actualizando..." : "Actualizar Contraseña"}
        </button>
      </div>
    </div>
  );
}