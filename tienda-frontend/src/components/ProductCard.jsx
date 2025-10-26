import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const imageUrl = product.image_url || 'https://placehold.co/400x200/5E96AE/FFFFFF?text=Sin+Imagen'; 

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="card app-card">
        <img 
          src={imageUrl} 
          className="card-img-top app-card-img" 
          alt={product.name} 
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate">{product.name}</h5>
          <p className="card-text">
            <strong>$ {product.price.toFixed(2)}</strong>
          </p>
          <div className="mt-auto">
            <Link 
              to={`/product/${product.id}`} 
              className="btn btn-primary w-100" 
              style={{ backgroundColor: '#F08011', borderColor: '#F08011' }} 
            >
              Ver Detalle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;