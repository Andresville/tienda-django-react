import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated, isAdmin, isAdminOrSeller, logout } from "../utils/Auth";

const NavBar = () => {
  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // Redirigir después de cerrar sesión
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Tienda
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isAuthenticated() && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>

                {isAdminOrSeller() && ( // ⬅️ CAMBIO AQUÍ: Solo ADMIN/SELLER ven los enlaces de CRUD
                  <>
                    {isAdmin() && (
                      <li className="nav-item">
                        {/* Si creaste UserList, solo ADMIN la ve */}
                        {/* <Link className="nav-link" to="/admin/users">Usuarios (Admin)</Link> */}
                      </li>
                    )}
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/products">
                        Productos
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/categories">
                        Categorías
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/sellers">
                        Vendedores
                      </Link>
                    </li>
                  </>
                )}

                {/* Añade un enlace simple para que los USERs también puedan ver los productos */}
                {!isAdminOrSeller() && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/products">
                      Ver Productos
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {isAuthenticated() ? (
              <li className="nav-item">
                <button
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
