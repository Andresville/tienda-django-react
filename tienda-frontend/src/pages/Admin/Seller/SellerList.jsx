import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { isAdmin } from '../../../utils/Auth'; // ⬅️ Importación necesaria

const SellerList = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Determina si el usuario actual es Admin
  const isUserAdmin = isAdmin();

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/sellers/');
      setSellers(response.data);
    } catch (err) {
      // Si el error es 403, significa que la API fue bloqueada (no debería pasar con un GET y SELLER)
      // Pero si pasa, mostramos el error:
      setError('Error al cargar la lista de vendedores. (Asegúrate de tener el rol adecuado)');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isUserAdmin) return; // Doble chequeo de seguridad
    if (window.confirm('¿Estás seguro de que quieres eliminar este vendedor?')) {
      try {
        // La API de borrado usa DELETE en /api/admin/sellers/<id>/delete/
        await api.delete(`/admin/sellers/${id}/delete/`);
        
        // Refrescar la lista
        fetchSellers();
      } catch (err) {
        alert('Error al eliminar el vendedor. ' + (err.response?.data?.error || ''));
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-4">Gestión de Vendedores</h2>
      
      {/* Botón Crear solo visible para ADMIN */}
      {isUserAdmin && (
        <Link to="/admin/sellers/create" className="btn btn-success mb-3">
          Crear Nuevo Vendedor
        </Link>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            {/* Columna Acciones solo visible para ADMIN */}
            {isUserAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {sellers.length === 0 ? (
            <tr><td colSpan={isUserAdmin ? "3" : "2"} className="text-center">No hay vendedores disponibles.</td></tr>
          ) : (
            sellers.map((seller) => (
              <tr key={seller.id}>
                <td>{seller.id}</td>
                <td>{seller.name}</td>
                
                {/* Celdas de Acciones solo visibles para ADMIN */}
                {isUserAdmin && (
                  <td>
                    <Link to={`/admin/sellers/edit/${seller.id}`} className="btn btn-sm btn-warning me-2">
                      Editar
                    </Link>
                    <button onClick={() => handleDelete(seller.id)} className="btn btn-sm btn-danger">
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {/* Mensaje para Sellers */}
      {!isUserAdmin && (
        <small className="text-muted">Estás visualizando la lista de vendedores. Solo los Administradores pueden crear, editar o eliminar.</small>
      )}
    </div>
  );
};

export default SellerList;
