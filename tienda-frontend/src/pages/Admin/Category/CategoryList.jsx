import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { isAdmin } from "../../../utils/Auth";

const STYLES = {
  CARD_BG: "#F7F4EF",
  TEXT_COLOR: "#0B3149",
  BUTTON_BG: "#FBBF49",
  BUTTON_HOVER: "#F08011",
  SEPARATOR_BG: "#E0E0E0",
};

const CategoryCard = ({ cat, isUserAdmin, handleDelete }) => (
  <div className="col-md-6 col-lg-4 mb-3">
    <div
      className="card shadow-sm h-100"
      style={{
        backgroundColor: STYLES.CARD_BG,
        color: STYLES.TEXT_COLOR,
        borderRadius: "10px",
        borderLeft: `5px solid ${STYLES.BUTTON_HOVER}`,
      }}
    >
      <div className="card-body d-flex flex-column">
        <h5
          className="card-title fw-bold mb-1"
          style={{ color: STYLES.BUTTON_HOVER }}
        >
          {cat.name}
        </h5>
        <p className="card-text mb-1">Ruta: {cat.path}</p>
        <p className="card-text mb-3 small text-muted">
          ID Ancestor: {cat.ancestor || "Principal"}
        </p>

        {isUserAdmin && (
          <div className="mt-auto d-flex justify-content-end">
            <Link
              to={`/admin/categories/edit/${cat.id}`}
              className="btn btn-sm text-dark me-2"
              style={{ backgroundColor: STYLES.BUTTON_BG, fontWeight: "bold" }}
            >
              Editar
            </Link>
            <button
              onClick={() => handleDelete(cat.id)}
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

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const isUserAdmin = isAdmin();

  useEffect(() => {
    if (!isUserAdmin) {
      navigate("/admin/products", { replace: true });
    } else {
      fetchCategories();
    }
  }, [isUserAdmin, navigate]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/categories/");
      setCategories(response.data);
    } catch (err) {
      setError(
        "Error al cargar la lista de categorías. (Asegúrate de tener el rol adecuado)"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isUserAdmin) return;

    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")
    ) {
      try {
        await api.delete(`/admin/categories/${id}/delete/`);
        fetchCategories();
      } catch (err) {
        alert(
          "Error al eliminar la categoría. " + (err.response?.data?.error || "")
        );
      }
    }
  };

  if (!isUserAdmin) return null;
  if (loading)
    return <div className="text-center mt-5">Cargando categorías...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  let lastAncestorId = null;

  return (
    <div>
      <h2 className="mb-4" style={{ color: STYLES.TEXT_COLOR }}>
        Gestión de Categorías
      </h2>

      {isUserAdmin && (
        <Link
          to="/admin/categories/create"
          className="btn btn-lg mb-3"
          style={{
            backgroundColor: STYLES.BUTTON_BG,
            color: STYLES.TEXT_COLOR,
            fontWeight: "bold",
            borderRadius: "10px",
          }}
        >
          Crear Nueva Categoría
        </Link>
      )}

      <div className="row mt-4">
        {categories.length === 0 ? (
          <div className="alert alert-info text-center">
            No hay categorías disponibles.
          </div>
        ) : (
          categories.map((cat, index) => {
            let parentCategoryName = "Categorías Principales";
            const currentAncestorId = cat.ancestor || cat.id;

            if (cat.path && cat.path.includes("/")) {
              parentCategoryName = cat.path.split("/")[0];
            } else if (cat.ancestor === null) {
              parentCategoryName = cat.name;
            }

            const showSeparator = currentAncestorId !== lastAncestorId;
            lastAncestorId = currentAncestorId;

            return (
              <React.Fragment key={cat.id}>
                {showSeparator && (
                  <div className="col-12 mt-4 mb-2">
                    <div
                      className="p-2 fw-bold text-center text-uppercase rounded shadow-sm"
                      style={{
                        backgroundColor: STYLES.SEPARATOR_BG,
                        color: STYLES.TEXT_COLOR,
                        fontSize: cat.ancestor === null ? "1.25rem" : "1.1rem",
                      }}
                    >
                      {parentCategoryName}
                    </div>
                  </div>
                )}
                <CategoryCard
                  cat={cat}
                  isUserAdmin={isUserAdmin}
                  handleDelete={handleDelete}
                />
              </React.Fragment>
            );
          })
        )}
      </div>

      {!isUserAdmin && (
        <small className="text-muted">
          Estás visualizando la lista de categorías. Solo los Administradores
          pueden crear, editar o eliminar.
        </small>
      )}
    </div>
  );
};

export default CategoryList;
