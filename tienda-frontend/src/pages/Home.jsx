import React, { useState, useEffect } from "react";
import api from "../api/api";
import { isAdminOrSeller } from "../utils/Auth";
import { Link } from "react-router-dom";

const STYLES = {
  CARD_BG: "#F7F4EF",
  TEXT_COLOR: "#0B3149",
  BUTTON_HOVER: "#F08011",
};

const ProductCard = ({ product }) => {
  const discountValue = product.discount && !isNaN(product.discount) ? product.discount : 0;
  const finalPrice = product.price * (1 - discountValue / 100);

  return (
    <div className="col-md-4 col-lg-3 mb-4">
      <div
        className="card shadow-sm h-100"
        style={{
          backgroundColor: STYLES.CARD_BG,
          color: STYLES.TEXT_COLOR,
          borderRadius: "15px",
        }}
      >
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold">{product.name}</h5>
          <p className="card-text text-muted small mb-1">
            {product.description.substring(0, 50)}...
          </p>
          <p className="mb-1">
            <strong>Vendedor:</strong> {product.seller.name}
          </p>

          <p className="mb-3">
            <span
              className="fw-bold"
              style={{ color: "green", fontSize: "1.2rem" }}
            >
              ${(finalPrice / 100).toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="badge bg-danger ms-2">-{product.discount}%</span>
            )}
            {product.discount > 0 && (
              <small className="text-decoration-line-through text-muted ms-2">
                ${(product.price / 100).toFixed(2)}
              </small>
            )}
          </p>

          <div className="mt-auto d-flex justify-content-center">
            <span className="text-muted">Stock: {product.available_stock}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/products/");
      const offers = response.data.filter((p) => p.discount > 0);

      setProducts(offers);
    } catch (err) {
      setError("Error al cargar las ofertas disponibles. Asegúrate de haber iniciado sesión.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="text-center mt-5">Cargando ofertas...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-4" style={{ color: STYLES.TEXT_COLOR }}>
        🔥 Ofertas Destacadas
      </h2>
      <p className="lead">
        ¡Mira los productos con descuento que tenemos para ti!
      </p>

      <div className="row mt-4">
        {products.length === 0 ? (
          <div className="alert alert-info text-center">
            No hay ofertas disponibles en este momento.
          </div>
        ) : (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </div>

      <p className="mt-5 text-muted text-center">
        {!isAdminOrSeller() && (
          <>
            Para ver el catálogo completo, visita la sección{" "}
            <Link to="/products">Catálogo (Vista)</Link>.
          </>
        )}
      </p>
    </div>
  );
};

export default Home;
