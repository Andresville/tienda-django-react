import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../../api/api";

const SellerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSeller(id);
    }
  }, [id]);

  const fetchSeller = async (sellerId) => {
    try {
      const response = await api.get("/admin/sellers/");
      const seller = response.data.find((s) => s.id === parseInt(sellerId));
      if (seller) {
        setName(seller.name);
      } else {
        setError("Vendedor no encontrado.");
      }
    } catch (err) {
      setError("Error al cargar datos del vendedor.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = { name };

      if (id) {
        await api.put(`/admin/sellers/${id}/`, payload);
        alert("Vendedor actualizado con éxito.");
      } else {
        await api.post("/admin/sellers/create/", payload);
        alert("Vendedor creado con éxito.");
      }

      navigate("/admin/sellers");
    } catch (err) {
      setError(err.response?.data?.error || "Error en la operación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <h2 className="mb-4">{id ? "Editar Vendedor" : "Crear Vendedor"}</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre del Vendedor</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <Link to="/admin/sellers" className="btn btn-secondary ms-2">
          Cancelar
        </Link>
      </form>
    </div>
  );
};

export default SellerForm;
