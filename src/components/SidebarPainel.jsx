import React from 'react';
import './SidebarPainel.css';
import { useNavigate, useLocation } from 'react-router-dom';

function SidebarPainel() {
  const navigate = useNavigate();
  const location = useLocation();

  // Função para aplicar classe de botão ativo
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar-painel">
      <button
        className={isActive('/painel/publicacoes') ? 'active' : ''}
        onClick={() => navigate('/painel/publicacoes')}
      >
        Publicações
      </button>

      <button
        className={isActive('/painel/adocao') ? 'active' : ''}
        onClick={() => navigate('/painel/adocao')}
      >
        Adoção
      </button>

      <button
        className={isActive('/painel/doacoes') ? 'active' : ''}
        onClick={() => navigate('/painel/doacoes')}
      >
        Doações e Adoções
      </button>
    </aside>
  );
}

export default SidebarPainel;
