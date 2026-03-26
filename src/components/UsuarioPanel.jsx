import React, { useState, useEffect } from "react";
import Navbar from "./NavbarUsuario";
import Modulo from "./Modulo";
import AuthService from "../services/authService";
import "../css/UsuarioPanel.css";
import axiosInstance from '../services/axios';

const imagenesModulos = {
  inventario: "img/inventarios.png",
  reportes: "img/resportes.jpeg",
  proveedores: "img/proveedores.jpeg",
  compras: "img/compras.png",
  factura: "img/factura.png",
  permisos: "img/permisos.jpeg",
  usuarios: "img/usuario.png",
  productos: "img/inventarios.png",
  categorias: "img/inventarios.png",
};




// Mapeo de nombres de módulos a rutas de React
const rutasModulos = {
  'inventario': '/inventario',
  'reportes': '/reportes',
  'proveedores': '/proveedores',
  'compras': '/compras',
  'factura': '/factura',
  'ventas': '/facturas',
  'permisos': '/permisos',
  'usuarios': '/admin',
  'productos': '/inventario',
  'categorias': '/inventario'
};

export default function UsuarioPanel({ userData }) {
  // Estados
  const [modulos, setModulos] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener información del usuario
  const user = userData || AuthService.getUserData();
  const userName = user?.Nombre1 || user?.name || user?.username || user?.email || 'Usuario';

  // Función para obtener el token
  const getToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };

  // Función para obtener la ruta correcta del módulo
  const getRutaModulo = (modulo) => {
    const nombreLower = modulo.NombreModulo?.toLowerCase();
    
    // 1. Buscar en el mapeo
    if (nombreLower && rutasModulos[nombreLower]) {
      return rutasModulos[nombreLower];
    }
    
    // 2. Usar la ruta de la BD si existe
    if (modulo.Ruta) {
      return modulo.Ruta;
    }
    
    // 3. Fallback
    return `/modulo/${modulo.IdModulo}`;
  };

  // Fetch de módulos y permisos
  useEffect(() => {
    const fetchModulosYPermisos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [modulosResponse, permisosResponse] = await Promise.all([
          axiosInstance.get('/modulos'),
          axiosInstance.get('/permisos/mis-permisos')
        ]);

        const modulosData = modulosResponse.data;
        const permisosData = permisosResponse.data;

        // Extraer los arrays de datos (múltiples formatos posibles)
        const modulosArray = Array.isArray(modulosData) 
          ? modulosData 
          : (modulosData.data || modulosData.modulos || []);
        
        const permisosArray = Array.isArray(permisosData)
          ? permisosData
          : (permisosData.permisos || permisosData.data || []);

        console.log('Módulos cargados:', modulosArray);
        console.log('Permisos cargados:', permisosArray);

        setModulos(modulosArray);
        setPermisos(permisosArray);
      } catch (err) {
        console.error('Error al cargar módulos y permisos:', err);
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchModulosYPermisos();
  }, []);

  // Filtrar módulos permitidos
  const modulosPermitidos = modulos.filter(modulo => 
    permisos.some(p => p.IdModulo === modulo.IdModulo && p.TieneAcceso)
  );

  // Módulos predeterminados (siempre visibles)
  const modulosPredeterminados = [
    {
      id: 'cuenta',
      imgSrc: "img/usuario.png",
      alt: "Cuenta",
      title: "Mi Cuenta",
      description: "Edita tu información personal.",
      link: "/mi-cuenta",
      imgWidth: "100"
    },
    {
      id: 'permisos',
      imgSrc: "img/permisos.jpeg",
      alt: "Permisos",
      title: "Pedir Permiso",
      description: "Solicita acceso a nuevos módulos o funciones del sistema.",
      link: "/mis-permisos",
      imgWidth: "105"
    }
  ];

  return (
    <>
      <Navbar usuario userData={user} />
      <main className="bienvenida">
        <h1>Bienvenido al Panel de Usuario</h1>
        <p>
          Hola <strong>{userName}</strong>, has iniciado sesión como <strong>Usuario</strong>. 
          {" "}Si necesitas más acceso, puedes solicitar permisos al administrador.
        </p>

        {/* Mensaje de error si hay problemas */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#c33'
          }}>
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        {/* Indicador de carga */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#666'
          }}>
            <div style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p>Cargando tus módulos...</p>
          </div>
        )}

        {/* Módulos */}
        {!loading && (
          <>
            {/* Módulos predeterminados */}
            <div className="modulos">
              {modulosPredeterminados.map(modulo => (
                <Modulo
                  key={modulo.id}
                  imgSrc={modulo.imgSrc}
                  alt={modulo.alt}
                  title={modulo.title}
                  description={modulo.description}
                  link={modulo.link}
                  imgWidth={modulo.imgWidth}
                />
              ))}
            </div>


            {/* Módulos permitidos por permisos */}
            {modulosPermitidos.length > 0 && (
              <>
                <h2 style={{ 
                  marginTop: '40px', 
                  marginBottom: '20px',
                  color: '#333',
                  borderBottom: '2px solid #1045b9ff',
                  paddingBottom: '10px'
                }}>
                   Módulos Disponibles ({modulosPermitidos.length})
                </h2>
                <div className="modulos">
                  {modulosPermitidos.map(modulo => {
                    const rutaFinal = getRutaModulo(modulo);
                    console.log(`Módulo: ${modulo.NombreModulo} → Ruta: ${rutaFinal}`);
                    
                    return (
                      <Modulo
                      key={modulo.IdModulo}
                      imgSrc={imagenesModulos[modulo.NombreModulo?.toLowerCase()] || "img/modulo-default.png"}
                      alt={modulo.NombreModulo}
                      title={modulo.NombreModulo}
                      description={modulo.Descripcion}
                      link={rutaFinal}
                      imgWidth="100"
/>

                    );
                  })}
                </div>
              </>
            )}

            {/* Mensaje cuando no hay módulos permitidos */}
            {!loading && modulosPermitidos.length === 0 && (
              <div style={{
                backgroundColor: '#f8f9fa',
                border: '2px dashed #dee2e6',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                marginTop: '40px',
                color: '#6c757d'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
                <h3 style={{ color: '#495057', marginBottom: '12px' }}>
                  No tienes módulos adicionales disponibles
                </h3>
                <p style={{ marginBottom: '20px' }}>
                  Solicita permisos al administrador para acceder a más funcionalidades
                </p>
                <a 
                  href="/mis-permisos" 
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#10B981',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#10B981'}
                >
                  Solicitar Permisos
                </a>
              </div>
            )}
          </>
        )}
      </main>

      {/* CSS para la animación de carga */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}