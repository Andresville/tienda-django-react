import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import ProductCard from '../components/ProductCard'; 

const ProductCatalogView = () => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchProducts();
  }, [categorySlug]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Llama al endpoint existente de Django (que lista todos los productos)
      const response = await api.get('/admin/products/'); 
      let filteredProducts = response.data;

      if (categorySlug) {
        // Lógica de filtrado en el Frontend
        filteredProducts = response.data.filter(p => 
          // Verifica si alguna de las categorías del producto coincide con el slug
          p.categories.some(c => c.slug === categorySlug)
        );
      }
      
      setProducts(filteredProducts);
    } catch (err) {
      setError('Error al cargar productos. Por favor, asegúrate que el backend Django esté corriendo y que la sesión sea válida.');
    } finally {
      setLoading(false);
    }
  };

  const title = categorySlug 
    ? `Productos en ${categorySlug.replace(/-/g, ' ').toUpperCase()}` 
    : "Catálogo Completo de Productos";

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div><p>Cargando productos...</p></div>;
  if (error) return <div className="alert alert-danger mx-auto mt-5" style={{ maxWidth: '800px' }}>{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 p-3 bg-light rounded shadow-sm">{title}</h2>
      
      {products.length === 0 ? (
        <div className="alert alert-info text-center mt-5">No hay productos disponibles en esta sección.</div>
      ) : (
        <div className="row">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCatalogView;