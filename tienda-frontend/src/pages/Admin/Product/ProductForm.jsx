import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../api/api';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceWithoutTaxes, setPriceWithoutTaxes] = useState('');
  const [availableStock, setAvailableStock] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [categoryIds, setCategoryIds] = useState([]);
  
  const [allSellers, setAllSellers] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDependencies();
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchDependencies = async () => {
    try {
      // 1. Obtener vendedores
      const sellersRes = await api.get('/admin/sellers/');
      setAllSellers(sellersRes.data);

      // 2. Obtener categorías
      const categoriesRes = await api.get('/admin/categories/');
      setAllCategories(categoriesRes.data);

      // Pre-seleccionar el primer seller si no hay ID
      if (!id && sellersRes.data.length > 0) {
        setSellerId(sellersRes.data[0].id);
      }
    } catch (err) {
      console.error('Error al cargar dependencias:', err);
      setError('Error al cargar vendedores o categorías. Asegúrate de que los seeders están corriendo.');
    }
  };

  const fetchProduct = async (productId) => {
    try {
        // Nota: La API de listado es la única que tenemos, la usamos para obtener un producto por ID.
        const response = await api.get('/admin/products/');
        const product = response.data.find(p => p.id === parseInt(productId)); 

        if (product) {
            setName(product.name);
            setDescription(product.description);
            // Convertir de BigInt (entero) a float para el input
            setPrice((product.price / 100).toFixed(2)); 
            setPriceWithoutTaxes((product.price_without_taxes / 100).toFixed(2));
            setAvailableStock(product.available_stock);
            setSellerId(product.seller.id);
            // Mapear a una lista simple de IDs
            setCategoryIds(product.categories.map(c => String(c.id))); 
        } else {
            setError('Producto no encontrado.');
        }
    } catch (err) {
        setError('Error al cargar datos del producto.');
    }
  };

  const handleCategoryChange = (e) => {
    const options = e.target.options;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setCategoryIds(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Endpoint requiere todos estos campos para POST
      const payload = { 
        name,
        description,
        price: Math.round(parseFloat(price) * 100), 
        price_without_taxes: Math.round(parseFloat(priceWithoutTaxes) * 100),
        
        // FIX: Aseguramos que si parseInt(availableStock) devuelve NaN (Not a Number),
        // el valor enviado sea 0 en su lugar.
        available_stock: parseInt(availableStock) || 0,
        
        seller_id: parseInt(sellerId),
        category_ids: categoryIds.map(id => parseInt(id))
      };

      if (id) {
        // Edición (PUT/PATCH)
        await api.put(`/admin/products/${id}/`, payload);
        alert('Producto actualizado con éxito.');
      } else {
        // Creación (POST)
        await api.post('/admin/products/create/', payload);
        alert('Producto creado con éxito.');
      }
      
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Error en la operación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <h2 className="mb-4">{id ? 'Editar Producto' : 'Crear Producto'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Campos de texto */}
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={loading}></textarea>
        </div>

        {/* Campos numéricos y de stock */}
        <div className="row">
            <div className="col-md-4 mb-3">
                <label className="form-label">Precio (con impuestos)</label>
                <input type="number" step="0.01" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required disabled={loading} />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Precio (sin impuestos)</label>
                <input type="number" step="0.01" className="form-control" value={priceWithoutTaxes} onChange={(e) => setPriceWithoutTaxes(e.target.value)} required disabled={loading} />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Stock Disponible</label>
                <input type="number" className="form-control" value={availableStock} onChange={(e) => setAvailableStock(e.target.value)} required disabled={loading} />
            </div>
        </div>

        {/* Selector de Vendedor */}
        <div className="mb-3">
          <label className="form-label">Vendedor</label>
          <select
            className="form-select"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            required
            disabled={loading || allSellers.length === 0}
          >
            {allSellers.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {allSellers.length === 0 && <small className="text-danger">Cargando vendedores...</small>}
        </div>

        {/* Selector Múltiple de Categorías */}
        <div className="mb-3">
          <label className="form-label">Categorías</label>
          <select
            className="form-select"
            multiple
            value={categoryIds}
            onChange={handleCategoryChange}
            required={false}
            disabled={loading || allCategories.length === 0}
          >
            {allCategories.map(c => (
              <option key={c.id} value={c.id}>
                {c.path}
              </option>
            ))}
          </select>
          <small className="form-text text-muted">Mantén presionado `Ctrl` (o `Cmd` en Mac) para seleccionar múltiples.</small>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        <Link to="/admin/products" className="btn btn-secondary ms-2">Cancelar</Link>
      </form>
    </div>
  );
};

export default ProductForm;