import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthService from '../services/authService';

export default function LoginModal() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // 👈 Añadido para mensaje de éxito

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(""); // 👈 Limpiar mensaje de éxito

    try {
      const { role, user } = await AuthService.login(email, password);

      // Mostrar mensaje de éxito
      setSuccess(`¡Bienvenido ${user.name || user.email}!`);

      // Cerrar el modal después de 1.5 segundos
      setTimeout(() => {
        const modal = document.getElementById('loginModal');
        const modalInstance = window.bootstrap?.Modal.getInstance(modal);
        modalInstance?.hide();

        // Limpiar formulario
        setEmail("");
        setPassword("");
        setSuccess("");

        // Redireccionar según el rol (CORREGIDO)
        if (role === "admin" || role === "administrador") {
          navigate("/admin");
        } else if (role === "user" || role === "usuario") {
          navigate("/usuario"); // 👈 CORREGIDO: ruta correcta
        } else {
          setError("Rol no válido");
          AuthService.logout();
        }
      }, 1500);

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("Credenciales incorrectas. Verifica tu email y contraseña.");
            break;
          case 422:
            setError("Datos inválidos. Verifica el formato de tu email.");
            break;
          case 429:
            setError("Demasiados intentos. Espera unos minutos antes de intentar nuevamente.");
            break;
          default:
            setError(error.response.data?.message || "Error del servidor. Intenta nuevamente más tarde.");
        }
      } else if (error.request) {
        setError("No se pudo conectar con el servidor. Verifica tu conexión.");
      } else {
        setError("Error inesperado. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return (
    <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title" id="loginModalLabel">Iniciar sesión</h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              data-bs-dismiss="modal" 
              aria-label="Cerrar" 
              onClick={clearMessages}
            ></button>
          </div>
          <div className="modal-body">
            {/* Mensaje de error */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button type="button" className="btn-close" onClick={clearMessages}></button>
              </div>
            )}
            
            {/* Mensaje de éxito */}
            {success && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="bi bi-check-circle me-2"></i>
                {success}
                <div className="spinner-border spinner-border-sm ms-2" role="status">
                  <span className="visually-hidden">Redirigiendo...</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={loading || success} 
                  autoComplete="email" 
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  disabled={loading || success} 
                  autoComplete="current-password" 
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100" 
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Ingresando...
                  </>
                ) : success ? (
                  <>
                    <i className="bi bi-check-lg me-2"></i>
                    Redirigiendo...
                  </>
                ) : (
                  "Ingresar"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}