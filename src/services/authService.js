import axiosInstance from './axios';

class AuthService {
  // 🔐 Iniciar sesión
  static async login(email, password) {
    const response = await axiosInstance.post('/login', { email, password });
    const { token, user } = response.data;

    let normalizedRole = (user.Role || user.role || 'user').toLowerCase().trim();
    const roleMapping = { 'administrador': 'admin', 'administrator': 'admin', 'admin': 'admin', 'usuario': 'user', 'user': 'user', 'cliente': 'user' };
    normalizedRole = roleMapping[normalizedRole] || 'user';

    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', normalizedRole);
    localStorage.setItem('userData', JSON.stringify(user));
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    await this.fetchPermisos();
    return { token, user, role: normalizedRole };
  }

  // 🔓 Logout
  static logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    localStorage.removeItem('userPermisos');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }

  static isAuthenticated() { return !!localStorage.getItem('authToken'); }
  static getToken() { return localStorage.getItem('authToken'); }
  static getUserRole() { return localStorage.getItem('userRole'); }
  static getUserData() {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }
  static isAdmin() { return this.getUserRole() === 'admin'; }
  static isUser() { return this.getUserRole() === 'user'; }

  static setPermisos(permisos) {
    localStorage.setItem('userPermisos', JSON.stringify(permisos));
  }
  static getPermisos() {
    const permisos = localStorage.getItem('userPermisos');
    return permisos ? JSON.parse(permisos) : [];
  }
  static async fetchPermisos() {
    try {
      const response = await axiosInstance.get('/permisos/mis-permisos');
      const permisos = response.data.permisos || [];
      this.setPermisos(permisos);
      return permisos;
    } catch (error) {
      console.error("❌ Error obteniendo permisos:", error);
      return [];
    }
  }

  static async register(userData) {
    return (await axiosInstance.post('/register', userData)).data;
  }

  static async verifyToken() {
    try {
      return (await axiosInstance.get('/me')).data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

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
