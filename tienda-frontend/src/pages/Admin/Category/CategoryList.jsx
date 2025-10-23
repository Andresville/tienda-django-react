import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { isAdmin } from '../../../utils/Auth'; // ⬅️ Importación necesaria

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determina si el usuario actual es Admin
  const isUserAdmin = isAdmin();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Endpoint: GET /api/admin/categories/ (Permitido para ADMIN y SELLER)
      const response = await api.get('/admin/categories/');
      setCategories(response.data);
    } catch (err) {
      setError('Error al cargar la lista de categorías.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // Evita que un SELLER intente borrar algo (el backend lo bloquearía, pero esto es más rápido)
    if (!isUserAdmin) return;
    
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        // Endpoint: DELETE /api/admin/categories/<id>/delete/
        await api.delete(`/admin/categories/${id}/delete/`);
        fetchCategories();
      } catch (err) {
        alert('Error al eliminar la categoría. ' + (err.response?.data?.error || ''));
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // Calcula el número de columnas a mostrar (4 sin acciones, 5 con acciones)
  const colSpanCount = isUserAdmin ? 5 : 4;

  return (
    <div>
      <h2 className="mb-4">Gestión de Categorías</h2>
      
      {/* Botón Crear solo visible para ADMIN */}
      {isUserAdmin && (
        <Link to="/admin/categories/create" className="btn btn-success mb-3">
          Crear Nueva Categoría
        </Link>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Ruta</th>
            <th>ID Ancestor</th>
            {/* Columna Acciones solo visible para ADMIN */}
            {isUserAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr><td colSpan={colSpanCount} className="text-center">No hay categorías disponibles.</td></tr>
          ) : (
            categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>{cat.path}</td>
                <td>{cat.ancestor || 'N/A'}</td>
                
                {/* Celdas de Acciones solo visibles para ADMIN */}
                {isUserAdmin && (
                  <td>
                    <Link to={`/admin/categories/edit/${cat.id}`} className="btn btn-sm btn-warning me-2">
                      Editar
                    </Link>
                    <button onClick={() => handleDelete(cat.id)} className="btn btn-sm btn-danger">
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {/* Mensaje de restricción para Seller */}
      {!isUserAdmin && (
        <small className="text-muted">Estás visualizando la lista de categorías. Solo los Administradores pueden crear, editar o eliminar.</small>
      )}
    </div>
  );
};

export default CategoryList;