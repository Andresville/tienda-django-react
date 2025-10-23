import React from 'react';
import { isAuthenticated, isAdmin } from '../utils/Auth';

const Home = () => {
  return (
    <div className="p-5 mb-4 bg-light rounded-3">
      <div className="container-fluid py-5">
        <h1 className="display-5 fw-bold">Bienvenido al Panel de Gestión de la Tienda</h1>
        <p className="col-md-8 fs-4">
          Utiliza la barra de navegación para gestionar los diferentes recursos del sistema.
        </p>
        <p className="fs-5">
          Tu rol actual: <strong>{isAdmin() ? 'ADMIN' : 'SELLER'}</strong>
        </p>
        <hr/>
        <p>
          Recuerda que para que el sistema funcione, tu backend (Django) debe estar corriendo en `http://localhost:3000`.
        </p>
      </div>
    </div>
  );
};

export default Home;