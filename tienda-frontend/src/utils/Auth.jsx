// Constantes
const TOKEN_KEY = 'jwt_token';
const USER_ROLE = 'user_role';

// Guarda el token y el rol del usuario en el localStorage
export const setAuthToken = (token, role) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ROLE, role);
};

// Obtiene el token del localStorage
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Limpia la sesión
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ROLE);
};

// Verifica si el usuario es Admin
export const isAdmin = () => {
  const role = localStorage.getItem(USER_ROLE);
  return role === 'ADMIN';
};

// Verifica si el usuario es Admin o Seller (ambos tienen acceso a las APIs admin)
export const isAdminOrSeller = () => {
  const role = localStorage.getItem(USER_ROLE);
  return role === 'ADMIN' || role === 'SELLER';
};

// Verifica si hay un token
export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};