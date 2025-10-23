import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { isAdmin } from '../../../utils/Auth';

const STYLES = {
  CARD_BG: '#F7F4EF',
  TEXT_COLOR: '#0B3149',
  BUTTON_BG: '#FBBF49',
  BUTTON_HOVER: '#F08011',
};

// Componente para una sola tarjeta de Producto
const ProductCard = ({ product, isUserAdmin, handleDelete }) => (
  <div className="col-md-4 col-lg-3 mb-4">
    <div className="card shadow-sm h-100" style={{ backgroundColor: STYLES.CARD_BG, color: STYLES.TEXT_COLOR, borderRadius: '15px' }}>
      {/* Usamos un placeholder ya que no tenemos URLs de imágenes válidas en el JSON del backend */}
      <img 
        src={`https://placehold.co/400x200/${STYLES.CARD_BG.substring(1)}/${STYLES.TEXT_COLOR.substring(1)}?text=Producto+${product.id}`} 
        className="card-img-top" 
        alt={product.name}
        style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold">{product.name}</h5>
        <p className="card-text text-muted small mb-1">{product.description.substring(0, 50)}...</p>
        <p className="mb-1"><strong>Vendedor:</strong> {product.seller.name}</p>
        <p className="mb-1"><strong>Precio:</strong> <span className="fw-bold" style={{ color: STYLES.BUTTON_HOVER }}>${(product.price / 100).toFixed(2)}</span></p>
        <p className="mb-3"><strong>Stock:</strong> {product.available_stock}</p>
        
        {/* Botones de acción solo visibles para ADMIN */}
        {isUserAdmin && (
          <div className="mt-auto d-flex justify-content-between">
            <Link 
              to={`/admin/products/edit/${product.id}`} 
              className="btn btn-sm text-dark me-2 flex-grow-1"
              style={{ backgroundColor: STYLES.BUTTON_BG, borderColor: STYLES.BUTTON_BG, color: STYLES.TEXT_COLOR, fontWeight: 'bold' }}
            >
              Editar
            </Link>
            <button 
              onClick={() => handleDelete(product.id)} 
              className="btn btn-sm btn-danger flex-grow-1"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
      {/* Mensaje para Sellers */}
      {!isUserAdmin && (
        <div className="card-footer text-center" style={{ backgroundColor: STYLES.CARD_BG }}>
          <small className="text-muted">Solo vista.</small>
        </div>
      )}
    </div>
  </div>
);


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isUserAdmin = isAdmin();

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleDelete = async (id) => {
    if (!isUserAdmin) return; 
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await api.delete(`/admin/products/${id}/delete/`);
        fetchProducts();
      } catch (err) {
        alert('Error al eliminar el producto. ' + (err.response?.data?.error || ''));
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando productos...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  
  // Redirige al Home (vista protegida) si el SELLER accede a la ruta de CRUD
  // Esta lógica ya no es necesaria aquí si usamos AdminSellerRoute en App.js
  // Pero la mantenemos si es necesario para el caso de USER

  return (
    <div>
      <h2 className="mb-4" style={{ color: STYLES.TEXT_COLOR }}>Gestión de Productos</h2>
      
      {isUserAdmin && (
        <Link 
          to="/admin/products/create" 
          className="btn btn-lg mb-3"
          style={{ backgroundColor: STYLES.BUTTON_BG, color: STYLES.TEXT_COLOR, fontWeight: 'bold', borderRadius: '10px' }}
        >
          Crear Nuevo Producto
        </Link>
      )}

      <div className="row mt-4">
        {products.length === 0 ? (
          <div className="alert alert-info text-center">No hay productos disponibles.</div>
        ) : (
          products.map((p) => (
            <ProductCard 
              key={p.id} 
              product={p} 
              isUserAdmin={isUserAdmin} 
              handleDelete={handleDelete} 
            />
          ))
        )}
      </div>
      
      {!isUserAdmin && (
        <small className="text-muted">Estás visualizando el catálogo. Solo los Administradores pueden crear, editar o eliminar.</small>
      )}
    </div>
  );
};

export default ProductList;
