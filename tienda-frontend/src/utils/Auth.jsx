const TOKEN_KEY = "jwt_token";
const USER_ROLE = "user_role";

export const setAuthToken = (token, role) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ROLE, role);
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ROLE);
};

export const isAdmin = () => {
  const role = localStorage.getItem(USER_ROLE);
  return role === "ADMIN";
};

export const isAdminOrSeller = () => {
  const role = localStorage.getItem(USER_ROLE);
  return role === "ADMIN" || role === "SELLER";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};
