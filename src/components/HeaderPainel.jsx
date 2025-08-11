// src/components/HeaderPainel.jsx
import React, { useState } from 'react';
import './HeaderPainel.css';

export default function HeaderPainel({ nome, onPerfilClick }) {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header className="header-painel">
      <h1>{nome}</h1>
      <div className="menu">
        <button className="menu-btn" onClick={() => setMostrarMenu(!mostrarMenu)}>☰</button>
        {mostrarMenu && (
          <div className="dropdown-menu">
            <button onClick={onPerfilClick}>Meu Perfil</button>
            <button onClick={handleLogout}>Sair</button>
          </div>
        )}
      </div>
    </header>
  );
}
