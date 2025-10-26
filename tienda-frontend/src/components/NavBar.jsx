import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated, isAdmin, isAdminOrSeller, logout } from "../utils/Auth";

// Definición de estilos de color para usar en el NavBar
const STYLES = {
  NAV_BG: '#0B3149',     // fourthColor (Azul Oscuro)
  TEXT_COLOR: '#F7F4EF', // firstColor (Casi Blanco)
  BUTTON_COLOR: '#FBBF49', // secondColor (Naranja Suave)
};

const NavBar = () => {
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // Función para generar botones con el estilo deseado
  const getButtonStyle = (isLogout = false) => ({
    backgroundColor: isLogout ? 'transparent' : STYLES.BUTTON_COLOR,
    color: isLogout ? STYLES.BUTTON_COLOR : STYLES.NAV_BG,
    border: isLogout ? `1px solid ${STYLES.BUTTON_COLOR}` : 'none',
    fontWeight: 'bold',
    borderRadius: '10px',
    padding: '8px 15px',
    transition: 'background-color 0.2s',
  });

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: STYLES.NAV_BG }}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-4" to="/" style={{ color: STYLES.TEXT_COLOR }}>
          SuperCheck
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isAuthenticated() && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/" style={{ color: STYLES.TEXT_COLOR }}>
                    Home
                  </Link>
                </li>
                
                {/* PRODUCTOS: Visible para ADMIN y SELLER */}
                {isAdminOrSeller() && ( 
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/products" style={{ color: STYLES.TEXT_COLOR }}>
                      Productos
                    </Link>
                  </li>
                )}

                {/* CATEGORÍAS Y VENDEDORES: Visible solo para ADMIN */}
                {isAdmin() && ( 
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/categories" style={{ color: STYLES.TEXT_COLOR }}>
                        Categorías
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/sellers" style={{ color: STYLES.TEXT_COLOR }}>
                        Vendedores
                      </Link>
                    </li>
                  </>
                )}

                {/* ENLACE DE VISTA (Para rol USER) */}
                {!isAdminOrSeller() && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/products" style={{ color: STYLES.TEXT_COLOR }}>
                      Catálogo (Vista)
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
                  className="btn"
                  style={getButtonStyle(true)}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="btn" to="/login" style={getButtonStyle()}>
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


