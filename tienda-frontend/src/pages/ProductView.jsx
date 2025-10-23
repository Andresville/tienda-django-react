import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { isAdminOrSeller } from '../utils/Auth'; // Necesitas esta función para la lógica
import { useNavigate } from 'react-router-dom';

const ProductView = () => {
  // 1. HOOKS SIEMPRE LLAMADOS AL PRINCIPIO
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/products/');
      setProducts(response.data);
    } catch (err) {
      setError('Error al cargar la lista de productos.');
    } finally {
      setLoading(false);
    }
  };
  
  // 2. useEffect maneja la lógica de redirección e inicialización de datos
  useEffect(() => {
    if (isAdminOrSeller()) {
      // Si es ADMIN/SELLER, redirigir al panel de CRUD
      navigate('/admin/products', { replace: true });
    } else {
      // Si es USER estándar, cargar los productos
      fetchProducts();
    }
  }, [navigate]); // navigate como dependencia es correcto

  // 3. Renderizado Condicional
  if (loading) return <div className="text-center mt-5">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // Si la redirección ocurre, navigate() detiene el renderizado
  // Si no ocurre, se renderiza la tabla:
  return (
    <div>
      <h2 className="mb-4">Catálogo de Productos</h2>
      <p>Bienvenido. Solo tienes permisos de visualización.</p>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Vendedor</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categorías</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan="5" className="text-center">No hay productos disponibles.</td></tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.seller.name}</td>
                <td>${(p.price / 100).toFixed(2)}</td>
                <td>{p.available_stock}</td>
                <td>{p.categories.map(c => c.name).join(', ')}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductView;