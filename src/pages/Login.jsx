// src/pages/Login.jsx
import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/ongs/login', {
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
