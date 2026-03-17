import { useEffect, useState } from 'react';
import AuthService from '../services/authService';
import UsuarioPanel from '../components/UsuarioPanel'; // 👈 Importar tu componente

export default function UsuarioPage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    console.log('✅ UsuarioPage cargada correctamente');
    
    // Cargar datos del usuario
    const user = AuthService.getUserData();
    console.log('👤 Datos del usuario:', user);
    
    setUserData(user);
    setLoading(false);
  }, []);

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Cargando panel de usuario...</p>
        </div>
      </div>
    );
  }

  // Renderizar tu componente UsuarioPanel
  return <UsuarioPanel userData={userData} />;
}