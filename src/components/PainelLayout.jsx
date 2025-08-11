// src/components/PainelLayout.jsx
import React from 'react';
import HeaderPainel from './HeaderPainel';
import SidebarPainel from './SidebarPainel';
import './PainelLayout.css';

export default function PainelLayout({ ong, onPerfilClick, children }) {
  return (
    <div className="painel-ong">
      <HeaderPainel nome={ong.nome} onPerfilClick={onPerfilClick} />
      <div className="painel-conteudo">
        <SidebarPainel />
        <main className="main">
          {children}
        </main>
      </div>
    </div>
  );
}
