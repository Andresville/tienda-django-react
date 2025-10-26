import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const CategoryCard = ({ category }) => {
  const imageURL = `https://placehold.co/400x200/5E96AE/FFFFFF?text=${category.name.toUpperCase()}`;
  
  return (
    // Columna para la cuadrícula responsiva
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="card app-card text-center h-100">
        <img 
          src={imageURL} 
          className="card-img-top app-card-img" 
          alt={category.name} 
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{category.name}</h5>
          <p className="card-text text-muted">
            {category.description || 'Explora los productos de esta sección.'}
          </p>
          <div className="mt-auto">
            <Link 
              to={`/category/${category.slug}`} 
              className="btn btn-primary w-100"
              style={{ backgroundColor: '#F08011', borderColor: '#F08011' }} // Naranja
            >
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryCardsView = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMainCategories();
  }, []);

  const fetchMainCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/categories/'); 
      // Filtrar categorías principales (las que no tienen ancestro)
      const mainCats = response.data.filter(cat => cat.ancestor === null);
      setMainCategories(mainCats);
    } catch (err) {
      setError('Error al cargar categorías.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div><p>Cargando categorías...</p></div>;
  if (error) return <div className="alert alert-danger mx-auto mt-5" style={{ maxWidth: '800px' }}>{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 p-3 bg-light rounded shadow-sm">Explorar Categorías Principales</h2>
      <div className="row">
        {mainCategories.length === 0 ? (
          <div className="alert alert-info text-center mt-5 col-12">No hay categorías principales disponibles.</div>
        ) : (
          mainCategories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryCardsView;