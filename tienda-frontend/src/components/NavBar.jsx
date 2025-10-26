import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import {
  isAuthenticated,
  isAdminOrSeller,
  isAdmin,
  logout,
} from "../utils/Auth";

const NavBar = () => {
  const navigate = useNavigate();
  const isUserAuthenticated = isAuthenticated;
  const isUserAdminOrSeller = isAdminOrSeller;
  const isUserAdmin = isAdmin;
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#1E6091" }}
    >
      <div className="container-fluid">
        <Link
          className="navbar-brand"
          to="/"
          style={{ color: "#F7F4EF", fontWeight: "bold" }}
        >
          SuperCheck
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isUserAuthenticated() ? (
              <>
                {!isUserAdminOrSeller() && (
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/catalog"
                      style={{ color: "#F7F4EF" }}
                    >
                      Categorías
                    </Link>
                  </li>
                )}
                {isUserAdminOrSeller() && (
                  <li className="nav-item dropdown">
                    <button
                      className="nav-link dropdown-toggle"
                      id="navbarDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ color: "#F7F4EF", backgroundColor: "transparent", border: "none" }} 
                    >
                      Administración
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <Link className="dropdown-item" to="/">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/products">
                          Productos
                        </Link>
                      </li>
                      {isUserAdmin() && (
                        <>
                          <li>
                            <Link className="dropdown-item" to="/admin/sellers">
                              Vendedores
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item"
                              to="/admin/categories"
                            >
                              Categorías
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className="btn btn-danger nav-link ms-3"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/login"
                  style={{ color: "#F7F4EF" }}
                >
                  Iniciar Sesión
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
