import React, { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    numeroDocumento: "",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    direccion: "",
    telefono: "",
    email: "",
    password: "",
    fechaNacimiento: "",
    edad: "",
    idTipoDocumento: "",
    role: "usuario",
    adminSecret: "", 
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let roleToSend = "user";
    if (formData.role === "admin") {
      if (formData.adminSecret === "Alirio120120$") {
        roleToSend = "admin";
      } else {
        alert("❌ Clave de administrador incorrecta");
        setLoading(false);
        return;
      }
    }

    const payload = {
      NumeroDocumento: formData.numeroDocumento,
      Nombre1: formData.primerNombre,
      Nombre2: formData.segundoNombre,
      Apellido1: formData.primerApellido,
      Apellido2: formData.segundoApellido,
      Email: formData.email,
      Contrasena: formData.password,
      password_confirmation: formData.password,
      FechaNacimiento: formData.fechaNacimiento,
      Direccion: formData.direccion,
      Telefono: formData.telefono,
      Edad: formData.edad,
      Role: roleToSend,
      IdTipoDocumento: formData.idTipoDocumento,
    };

    try {
      const res = await fetch("https://web-production-d9e15.up.railway.app/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Usuario creado con éxito, redirigiendo al login en 3 segundos...");
        setFormData({
          numeroDocumento: "",
          primerNombre: "",
          segundoNombre: "",
          primerApellido: "",
          segundoApellido: "",
          direccion: "",
          telefono: "",
          email: "",
          password: "",
          fechaNacimiento: "",
          edad: "",
          idTipoDocumento: "",
          role: "usuario",
          adminSecret: "",
        });
        
        // Redirección automática después del registro exitoso
        setTimeout(() => {
          window.location.href = "/login"; // Cambia por tu ruta de login
        }, 3000);
        
      } else {
        if (data.errors) {
          let errorMessages = "";
          for (const field in data.errors) {
            errorMessages += `${field}: ${data.errors[field].join(", ")}\n`;
          }
          alert("❌ Errores de validación:\n\n" + errorMessages);
        } else {
          alert("❌ Error al registrar usuario: " + (data.message || "Verifica los campos"));
        }
      }
    } catch (error) {
      alert("❌ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!forgotEmail) {
      alert("❌ Por favor ingresa tu correo electrónico");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://web-production-d9e15.up.railway.app/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Se ha enviado un correo con instrucciones para restablecer tu contraseña");
        setShowForgotPassword(false);
        setForgotEmail("");
      } else {
        alert("❌ " + (data.message || "Error al enviar el correo"));
      }
    } catch (error) {
      alert("❌ Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    },
    title: {
      textAlign: "center",
      color: "#333",
      marginBottom: "30px"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    },
    input: {
      padding: "12px",
      fontSize: "16px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      outline: "none",
      transition: "border-color 0.3s"
    },
    inputFocus: {
      borderColor: "#007bff"
    },
    select: {
      padding: "12px",
      fontSize: "16px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      outline: "none",
      backgroundColor: "white"
    },
    button: {
      padding: "15px",
      fontSize: "16px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.3s"
    },
    buttonHover: {
      backgroundColor: "#0056b3"
    },
    buttonDisabled: {
      backgroundColor: "#ccc",
      cursor: "not-allowed"
    },
    forgotLink: {
      color: "#007bff",
      textDecoration: "underline",
      cursor: "pointer",
      textAlign: "center",
      marginTop: "20px",
      padding: "10px",
      fontSize: "16px"
    },
    modal: {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "15px",
      maxWidth: "400px",
      width: "90%",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
    },
    modalTitle: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#333"
    },
    closeButton: {
      backgroundColor: "#dc3545",
      marginTop: "10px"
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔐 Registro de Usuario</h2>
      
      <div style={styles.form}>
        <input 
          type="text" 
          name="numeroDocumento" 
          placeholder="Número Documento" 
          value={formData.numeroDocumento} 
          onChange={handleChange} 
          required 
          style={styles.input}
        />

        <input 
          type="text" 
          name="primerNombre" 
          placeholder="Primer Nombre" 
          value={formData.primerNombre} 
          onChange={handleChange} 
          required 
          style={styles.input}
        />

        <input 
          type="text" 
          name="segundoNombre" 
          placeholder="Segundo Nombre (Opcional)" 
          value={formData.segundoNombre} 
          onChange={handleChange} 
          style={styles.input}
        />

        <input 
          type="text" 
          name="primerApellido" 
          placeholder="Primer Apellido" 
          value={formData.primerApellido} 
          onChange={handleChange} 
          required 
          style={styles.input}
        />

        <input 
          type="text" 
          name="segundoApellido" 
          placeholder="Segundo Apellido (Opcional)" 
          value={formData.segundoApellido} 
          onChange={handleChange} 
          style={styles.input}
        />

        <input 
          type="text" 
          name="direccion" 
          placeholder="Dirección" 
          value={formData.direccion} 
          onChange={handleChange} 
          required 
          style={styles.input}
        />

        <input 
          type="tel" 
          name="telefono" 
          placeholder="Teléfono" 
          value={formData.telefono} 
          onChange={handleChange} 
          required 
          style={styles.input}
        />

        <input 
          type="email" 
          name="email" 
          placeholder="Correo electrónico" 
          value={formData.email} 
          onChange={handleChange} 
          required 
          style={styles.input}
        />

        <input 
          type="password" 
          name="password" 
          placeholder="Contraseña (mínimo 6 caracteres)" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          style={styles.input}
          minLength={6}
        />

        <input 
          type="date" 
          name="fechaNacimiento" 
          value={formData.fechaNacimiento} 
          onChange={handleChange} 
          required 
          style={styles.input}
        />

        <input 
          type="number" 
          name="edad" 
          placeholder="Edad" 
          value={formData.edad} 
          onChange={handleChange} 
          required 
          style={styles.input}
          min="0"
          max="120"
        />

        <input 
          type="text" 
          name="idTipoDocumento" 
          placeholder="ID Tipo Documento" 
          value={formData.idTipoDocumento} 
          onChange={handleChange} 
          required 
          style={styles.input}
        />

        <select 
          name="role" 
          value={formData.role} 
          onChange={handleChange}
          style={styles.select}
        >
          <option value="usuario">👤 Usuario</option>
          <option value="admin">👨‍💼 Administrador</option>
        </select>

        {formData.role === "admin" && (
          <input 
            type="password" 
            name="adminSecret" 
            placeholder="🔑 Clave secreta de administrador" 
            value={formData.adminSecret} 
            onChange={handleChange} 
            style={styles.input}
          />
        )}

        <button 
          onClick={handleSubmit}
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? "⏳ Registrando..." : "✅ Registrar Usuario"}
        </button>
      </div>

      <div 
        style={styles.forgotLink}
        onClick={() => setShowForgotPassword(true)}
      >
        🔑 ¿Olvidaste tu contraseña?
      </div>

      {/* Modal para recuperar contraseña */}
      {showForgotPassword && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>🔐 Recuperar Contraseña</h3>
            <div style={styles.form}>
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                style={styles.input}
              />
              <button 
                onClick={handleForgotPassword}
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : {})
                }}
              >
                {loading ? "📧 Enviando..." : "📧 Enviar correo"}
              </button>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotEmail("");
                }}
                style={{
                  ...styles.button,
                  ...styles.closeButton
                }}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}