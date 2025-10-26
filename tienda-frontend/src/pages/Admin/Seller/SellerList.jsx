import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { isAdmin } from "../../../utils/Auth";

const STYLES = {
  CARD_BG: "#F7F4EF",
  TEXT_COLOR: "#0B3149",
  BUTTON_BG: "#FBBF49",
  BUTTON_HOVER: "#F08011",
};

const SellerCard = ({ seller, isUserAdmin, handleDelete }) => (
  <div className="col-md-6 col-lg-4 mb-3">
    <div
      className="card shadow-sm h-100"
      style={{
        backgroundColor: STYLES.CARD_BG,
        color: STYLES.TEXT_COLOR,
        borderRadius: "10px",
        borderLeft: `5px solid ${STYLES.BUTTON_BG}`,
      }}
    >
      <div className="card-body d-flex flex-column">
        <h5
          className="card-title fw-bold"
          style={{ color: STYLES.BUTTON_HOVER }}
        >
          {seller.name}
        </h5>
        <p className="card-text mb-3 small text-muted">ID: {seller.id}</p>

        {isUserAdmin && (
          <div className="mt-auto d-flex justify-content-end">
            <Link
              to={`/admin/sellers/edit/${seller.id}`}
              className="btn btn-sm text-dark me-2"
              style={{ backgroundColor: STYLES.BUTTON_BG, fontWeight: "bold" }}
            >
              Editar
            </Link>
            <button
              onClick={() => handleDelete(seller.id)}
              className="btn btn-sm btn-danger"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
      {!isUserAdmin && (
        <div
          className="card-footer text-center"
          style={{ backgroundColor: STYLES.CARD_BG }}
        >
          <small className="text-muted">Solo visualización.</small>
        </div>
      )}
    </div>
  </div>
);

const SellerList = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isUserAdmin = isAdmin();

  useEffect(() => {
    if (!isUserAdmin) {
      navigate("/admin/products", { replace: true });
    } else {
      fetchSellers();
    }
  }, [isUserAdmin, navigate]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/sellers/");
      setSellers(response.data);
    } catch (err) {
      setError(
        "Error al cargar la lista de vendedores. (Asegúrate de tener el rol adecuado)"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isUserAdmin) return;

    if (
      window.confirm("¿Estás seguro de que quieres eliminar este vendedor?")
    ) {
      try {
        await api.delete(`/admin/sellers/${id}/delete/`);
        fetchSellers();
      } catch (err) {
        alert(
          "Error al eliminar el vendedor. " + (err.response?.data?.error || "")
        );
      }
    }
  };

  if (!isUserAdmin) return null;
  if (loading)
    return <div className="text-center mt-5">Cargando vendedores...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-4" style={{ color: STYLES.TEXT_COLOR }}>
        Gestión de Vendedores
      </h2>
      {isUserAdmin && (
        <Link
          to="/admin/sellers/create"
          className="btn btn-lg mb-3"
          style={{
            backgroundColor: STYLES.BUTTON_BG,
            color: STYLES.TEXT_COLOR,
            fontWeight: "bold",
            borderRadius: "10px",
          }}
        >
          Crear Nuevo Vendedor
        </Link>
      )}

      <div className="row mt-4">
        {sellers.length === 0 ? (
          <div className="alert alert-info text-center">
            No hay vendedores disponibles.
          </div>
        ) : (
          sellers.map((seller) => (
            <SellerCard
              key={seller.id}
              seller={seller}
              isUserAdmin={isUserAdmin}
              handleDelete={handleDelete}
            />
          ))
        )}
      </div>

      {!isUserAdmin && (
        <small className="text-muted">
          Estás visualizando la lista de vendedores. Solo los Administradores
          pueden crear, editar o eliminar.
        </small>
      )}
    </div>
  );
};

export default SellerList;
