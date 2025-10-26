import React, { useState } from "react";
import api from "../api/api";
import { setAuthToken } from "../utils/Auth";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/admin/users/create/", {
        name,
        surname,
        email,
        password,
        role: "SELLER",
      });

      setMessage("Registro exitoso. ¡Ahora puedes iniciar sesión!");
      setName("");
      setSurname("");
      setEmail("");
      setPassword("");
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Error de registro.");
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
          <input
            type="text"
            className="form-control"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Apellido"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
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
            placeholder="Contraseña (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/users/login/", { email, password });
      setAuthToken(response.data.token, response.data.user.role);
      navigate("/", { replace: true });
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || "Error de conexión");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
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
                setError("");
              }}
            >
              ¿No tienes cuenta? Regístrate aquí
            </button>
          </div>
        )}
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
