import React, { useState, useEffect } from "react";
import api from "../api/api";
import { isAdminOrSeller } from "../utils/Auth";
import { useNavigate } from "react-router-dom";

const ProductView = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/products/");
      setProducts(response.data);
    } catch (err) {
      setError("Error al cargar la lista de productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminOrSeller()) {
      navigate("/admin/products", { replace: true });
    } else {
      fetchProducts();
    }
  }, [navigate]);

  if (loading) return <div className="text-center mt-5">Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

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
            <th>Descuento</th>
            <th>Stock</th>
            <th>Categorías</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                No hay productos disponibles.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.seller.name}</td>
                <td>${(p.price / 100).toFixed(2)}
                {p.discount > 0 && (
                  <span className="badge bg-success ms-2">-{p.discount}%</span>
                )}
                </td>
                <td>{p.available_stock}</td>
                <td>{p.categories.map((c) => c.name).join(", ")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductView;
