import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../api/api';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [ancestor, setAncestor] = useState(''); // ID de la categoría padre
  const [allCategories, setAllCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllCategories();
    if (id) {
      fetchCategory(id);
    }
  }, [id]);

  const fetchAllCategories = async () => {
    try {
      // Obtener todas las categorías para el select de Ancestor
      const response = await api.get('/admin/categories/');
      setAllCategories(response.data);
    } catch (err) {
      console.error('Error al cargar categorías para el selector:', err);
    }
  };

  const fetchCategory = async (categoryId) => {
    try {
      const response = await api.get('/admin/categories/');
      const cat = response.data.find(c => c.id === parseInt(categoryId));
      
      if (cat) {
        setName(cat.name);
        setAncestor(cat.ancestor || '');
      } else {
        setError('Categoría no encontrada.');
      }
    } catch (err) {
      setError('Error al cargar datos de la categoría.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Endpoint requiere { name, ancestor }
      const payload = { 
        name,
        // Si es vacío, se envía null al backend
        ancestor: ancestor ? parseInt(ancestor) : null 
      };

      if (id) {
        // Edición (PUT/PATCH)
        await api.put(`/admin/categories/${id}/`, payload);
        alert('Categoría actualizada con éxito.');
      } else {
        // Creación (POST)
        await api.post('/admin/categories/create/', payload);
        alert('Categoría creada con éxito.');
      }
      
      navigate('/admin/categories');
    } catch (err) {
      setError(err.response?.data?.error || 'Error en la operación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <h2 className="mb-4">{id ? 'Editar Categoría' : 'Crear Categoría'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría Padre (Ancestor)</label>
          <select
            className="form-select"
            value={ancestor}
            onChange={(e) => setAncestor(e.target.value)}
            disabled={loading}
          >
            <option value="">(Ninguna - Categoría Principal)</option>
            {allCategories.map(cat => (
              <option key={cat.id} value={cat.id} disabled={cat.id === parseInt(id)}>
                {cat.path}
              </option>
            ))}
          </select>
          <small className="form-text text-muted">No puedes seleccionarte a ti mismo como ancestro.</small>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        <Link to="/admin/categories" className="btn btn-secondary ms-2">Cancelar</Link>
      </form>
    </div>
  );
};

export default CategoryForm;