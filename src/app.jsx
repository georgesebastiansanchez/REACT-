import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axiosInstance from './services/axios';
// Importar servicios y componentes de autenticación
import AuthService from './services/authService';
import ProtectedRoute, { AdminRoute, UserRoute } from './components/ProtectedRoute';
import LoginModal from './components/LoginModal';

// Importar las páginas
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import UsuarioPage from "./pages/UsuarioPage";
import ReportesPage from "./pages/ReportesPage";
import InventarioPage from "./pages/InventarioPage";
import Permisospage from "./pages/Permisospage";
import RegisterPage from "./pages/RegisterPage";
import ProveedoresPage from "./pages/ProveedoresPage";
import ResetPassword from "./pages/ResetPassword";
import ComprasPage from "./pages/ComprasPage";
import VentasPage from "./pages/VentasPage";
import CuentaPage from "./pages/CuentaPage";
import MicuentaPage from "./pages/MicuentaPage";
function App() {
  useEffect(() => {
  const token = AuthService.getToken();
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}, []);
  return (
    <div className="App">
      <Routes>
        {/* Página principal - PÚBLICA */}
        <Route path="/" element={<HomePage />} />
        
        {/* Página de registro - PÚBLICA */}
        <Route path="/registrar" element={<RegisterPage />} />

        {/* Página de restablecer contraseña - PÚBLICA */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ========== RUTAS PARA ADMIN ========== */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } 
        />
        
        {/* ========== RUTAS COMPARTIDAS (Admin + Usuarios con permiso) ========== */}
        
        {/* Inventario - Accesible para admin y usuarios con permiso */}
        <Route 
          path="/inventario" 
          element={
            <ProtectedRoute>
              <InventarioPage />
            </ProtectedRoute>
          } 
        />

        {/* Reportes - Accesible para admin y usuarios con permiso */}
        <Route 
          path="/reportes" 
          element={
            <ProtectedRoute>
              <ReportesPage />
            </ProtectedRoute>
          } 
        /> 

        {/* Proveedores - Accesible para admin y usuarios con permiso */}
        <Route 
          path="/proveedores"
          element={
            <ProtectedRoute>
              <ProveedoresPage />   
            </ProtectedRoute>
          } 
        />
        
        {/* Compras - Accesible para admin y usuarios con permiso */}
        <Route 
          path="/compras"
          element={
            <ProtectedRoute>
              <ComprasPage />
            </ProtectedRoute>
          } 
        />

        {/* Ventas/Facturas - Accesible para admin y usuarios con permiso */}
        <Route 
          path="/factura" 
          element={
            <ProtectedRoute>
              <VentasPage />
            </ProtectedRoute>
          } 
        />

        {/* ========== RUTAS SOLO ADMIN ========== */}
        
        {/* Permisos - SOLO para admin */}
        <Route 
          path="/permisos" 
          element={
            <AdminRoute>
              <Permisospage />
            </AdminRoute>
          } 
        />

        {/* ========== RUTAS PARA USUARIO ========== */}
        
        {/* Dashboard/Inicio del usuario */}
        <Route 
          path="/usuario" 
          element={
            <UserRoute>
              <UsuarioPage />
            </UserRoute>
          } 
        />

        {/* Alias para dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <UserRoute>
              <UsuarioPage />
            </UserRoute>
          } 
        />

        {/* Mis módulos */}
        <Route 
          path="/mis-modulos" 
          element={
            <UserRoute>
              <UsuarioPage />
            </UserRoute>
          } 
        />

        {/* Mis permisos y solicitudes */}
        <Route 
          path="/mi-cuenta" 
          element={
            <UserRoute>
              <MicuentaPage/>
            </UserRoute>
          } 
        />

        {/* Alias para mis permisos */}
        <Route 
          path="/mis-permisos" 
          element={
            <UserRoute>
              <CuentaPage />
            </UserRoute>
          } 
        />

        {/* Ruta comodín para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Modal de login - siempre disponible */}
      <LoginModal />
    </div>
  );
}

export default App;