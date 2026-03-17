import axios from 'axios';

const API_URL = 'https://web-production-d9e15.up.railway.app/api';
axios.defaults.baseURL = API_URL;

// Interceptor para añadir token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo de errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AuthService.logout();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

class AuthService {
  // 🔐 Iniciar sesión
  static async login(email, password) {
    const response = await axios.post('/login', { email, password });
    const { token, user } = response.data;

    // Normalizar rol
    let normalizedRole = (user.Role || user.role || 'user').toLowerCase().trim();
    const roleMapping = { 'administrador': 'admin', 'administrator': 'admin', 'admin': 'admin', 'usuario': 'user', 'user': 'user', 'cliente': 'user' };
    normalizedRole = roleMapping[normalizedRole] || 'user';

    // Guardar en localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', normalizedRole);
    localStorage.setItem('userData', JSON.stringify(user));

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // 🔄 Obtener permisos del usuario después del login
    await this.fetchPermisos();

    return { token, user, role: normalizedRole };
  }

  // 🔓 Logout
  static logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    localStorage.removeItem('userPermisos');
    delete axios.defaults.headers.common['Authorization'];
  }

  // ✅ Métodos de autenticación
  static isAuthenticated() { return !!localStorage.getItem('authToken'); }
  static getToken() { return localStorage.getItem('authToken'); }
  static getUserRole() { return localStorage.getItem('userRole'); }
  static getUserData() { 
    const data = localStorage.getItem('userData'); 
    return data ? JSON.parse(data) : null; 
  }
  static isAdmin() { return this.getUserRole() === 'admin'; }
  static isUser() { return this.getUserRole() === 'user'; }

  // 🟢 === NUEVO: Manejo de permisos ===
  static setPermisos(permisos) {
    localStorage.setItem('userPermisos', JSON.stringify(permisos));
  }

  static getPermisos() {
    const permisos = localStorage.getItem('userPermisos');
    return permisos ? JSON.parse(permisos) : [];
  }

  static async fetchPermisos() {
    try {
      const response = await axios.get('/mis-permisos');
      const permisos = response.data.permisos || [];
      this.setPermisos(permisos);
      return permisos;
    } catch (error) {
      console.error("❌ Error obteniendo permisos:", error);
      return [];
    }
  }

  // 📝 Registro
  static async register(userData) {
    return (await axios.post('/register', userData)).data;
  }

  // 🔍 Verificar token
  static async verifyToken() {
    try {
      return (await axios.get('/verify-token')).data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  // 🛠 Debug
  static debugAuth() {
    console.log('=== AUTH DEBUG ===');
    console.log('Authenticated:', this.isAuthenticated());
    console.log('Token:', this.getToken());
    console.log('Role:', this.getUserRole());
    console.log('User Data:', this.getUserData());
    console.log('Permisos:', this.getPermisos());
    console.log('==================');
  }
}

export default AuthService;
