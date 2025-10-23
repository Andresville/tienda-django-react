import React, { useState } from 'react';
import api from '../api/api';
import { setAuthToken } from '../utils/Auth';
import { useNavigate } from 'react-router-dom';

// Componente para manejar el registro de usuarios
const RegisterForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // POST al endpoint de creación de usuarios (asumiendo que está habilitado para USER)
      // Nota: Usamos el endpoint de admin porque es el único que existe, pero forzamos el rol USER.
      await api.post('/admin/users/create/', {
        name,
        surname,
        email,
        password,
        role: 'USER' // Forzamos el rol estándar para el registro público
      });

      setMessage('Registro exitoso. ¡Ahora puedes iniciar sesión!');
      // Limpiar campos
      setName('');
      setSurname('');
      setEmail('');
      setPassword('');
      onSuccess(); // Opcional: switch back to login form
    } catch (err) {
      setError(err.response?.data?.error || 'Error de registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow p-4 mt-3">
      <h2 className="card-title text-center mb-4">Registro de Usuario</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Apellido" value={surname} onChange={(e) => setSurname(e.target.value)} required />
        </div>
        <div className="mb-3">
          <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" placeholder="Contraseña (mín. 6 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
};

// Componente principal de Login.js
const Login = () => {
  // Inicializamos vacíos
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/users/login/', { email, password });
      
      setAuthToken(response.data.token, response.data.user.role);
      
      // Redirige al inicio
      navigate('/', { replace: true });
      window.location.reload(); 
      
    } catch (err) {
      setError(err.response?.data?.error || 'Error de conexión');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        
        {/* FORMULARIO DE LOGIN */}
        {!isRegistering && (
          <div className="card shadow p-4">
            <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-2">
                Ingresar
              </button>
            </form>

            <button 
              className="btn btn-link mt-3" 
              onClick={() => {
                setIsRegistering(true);
                setError('');
              }}
            >
              ¿No tienes cuenta? Regístrate aquí
            </button>
          </div>
        )}

        {/* FORMULARIO DE REGISTRO */}
        {isRegistering && (
          <>
            <RegisterForm onSuccess={() => setIsRegistering(false)} />
            <button 
              className="btn btn-link mt-3" 
              onClick={() => setIsRegistering(false)}
            >
              Volver al Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;