// src/pages/public/Home.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeListHistoria from './HomeListHistoria';
import HomeListAnimais from './HomeListAnimais';
import './Home.css';

export default function Home() {
  const [abaSelecionada, setAbaSelecionada] = useState('historias'); // padrão

  return (
    <>
      <header className="custom-header">
  <div className="logo">
    💚 Ajuda Animais
  </div>
  <nav>
    <Link to="/login" className="btn-header white">Entrar</Link>
    <Link to="/cadastroong" className="btn-header green">Cadastrar ONG</Link>
  </nav>
</header>


      <main className="home-container">
        <section className="hero-section">
          <h1 className="hero-title">Juntos podemos mudar vidas</h1>
          <p className="hero-subtitle">Ajude uma ONG, doe amor ou adote um amigo</p>
        </section>

        {/* Menu de Abas */}
        <section className="home-tabs">
          <button
            className={`tab-button ${abaSelecionada === 'historias' ? 'active' : ''}`}
            onClick={() => setAbaSelecionada('historias')}
          >
            💬 Histórias que Inspiram
          </button>
          <button
            className={`tab-button ${abaSelecionada === 'animais' ? 'active' : ''}`}
            onClick={() => setAbaSelecionada('animais')}
          >
            🐾 Animais para Adoção
          </button>
        </section>

        {/* Conteúdo Condicional */}
        <section className="home-content-section">
          {abaSelecionada === 'historias' ? (
            <HomeListHistoria />
          ) : (
            <HomeListAnimais />
          )}
        </section>
      </main>
    </>
  );
}
