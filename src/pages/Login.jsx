// src/pages/Login.jsx
import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  // Pega a URL base da API da variável ambiente ou usa localhost no dev
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/ongs/login`, {
        email,
        senha
      });

      localStorage.setItem('token', res.data.token);
      alert(`Bem-vindo(a), ${res.data.ong.nome}!`);
      navigate('/painel');
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Erro no login');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login da ONG</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}
