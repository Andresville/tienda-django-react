import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { isAdmin } from '../../../utils/Auth'; // ⬅️ Importación necesaria para el control de roles

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Determina si el usuario actual es Admin
  const isUserAdmin = isAdmin();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Endpoint: GET /api/admin/products/
      const response = await api.get('/admin/products/');
      setProducts(response.data);
    } catch (err) {
      setError('Error al cargar la lista de productos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // Evita que un SELLER intente borrar algo (aunque el backend lo bloquearía)
    if (!isUserAdmin) return; 
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        // Endpoint: DELETE /api/admin/products/<id>/delete/
        await api.delete(`/admin/products/${id}/delete/`);
        fetchProducts();
      } catch (err) {
        alert('Error al eliminar el producto. ' + (err.response?.data?.error || ''));
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // Calcula el número de columnas a mostrar (6 sin acciones, 7 con acciones)
  const colSpanCount = isUserAdmin ? 7 : 6;
  
  return (
    <div>
      <h2 className="mb-4">Gestión de Productos</h2>
      
      {/* Botón Crear solo visible para ADMIN */}
      {isUserAdmin && (
        <Link to="/admin/products/create" className="btn btn-success mb-3">
          Crear Nuevo Producto
        </Link>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Vendedor</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categorías</th>
            {/* Columna Acciones solo visible para ADMIN */}
            {isUserAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan={colSpanCount} className="text-center">No hay productos disponibles.</td></tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.seller.name}</td>
                {/* Los precios se devuelven como enteros, los mostramos con formato monetario */}
                <td>${(p.price / 100).toFixed(2)}</td> 
                <td>{p.available_stock}</td>
                <td>{p.categories.map(c => c.name).join(', ')}</td>
                
                {/* Celdas de Acciones solo visibles para ADMIN */}
                {isUserAdmin && (
                  <td>
                    <Link to={`/admin/products/edit/${p.id}`} className="btn btn-sm btn-warning me-2">
                      Editar
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-danger">
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
        <small className="text-muted">Estás visualizando la lista de productos. Solo los Administradores pueden crear, editar o eliminar.</small>
      )}
    </div>
  );
};

export default ProductList;