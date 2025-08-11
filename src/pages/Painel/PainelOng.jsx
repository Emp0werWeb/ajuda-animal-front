import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PainelLayout from '../../components/PainelLayout';
import './PainelOng.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function PainelOng() {
  const [ong, setOng] = useState(null);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // 🔍 Verificar token no console
    console.log('Token recuperado:', token);

    // ✅ Se não houver token, redireciona imediatamente
    if (!token) {
      navigate('/login');
      return;
    }

    async function carregarDados() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/ongs/obter-perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOng(res.data.ong);
      } catch (err) {
        console.error('Erro ao obter perfil:', err);
        navigate('/login');
      }
    }

    carregarDados();

    // Redirecionar para /painel/publicacoes se estiver na raiz do painel
    if (window.location.pathname === '/painel') {
      navigate('/painel/publicacoes', { replace: true });
    }
  }, [navigate]);

  if (!ong) return <p>Carregando...</p>;

  return (
    <>
      <PainelLayout ong={ong} onPerfilClick={() => setMostrarPerfil(true)}>
        <Outlet context={{ ong }} />
      </PainelLayout>

      {mostrarPerfil && (
        <div className="modal">
          <div className="modal-conteudo">
            <h2>Perfil da ONG</h2>
            <p><strong>Nome:</strong> {ong.nome}</p>
            <p><strong>CNPJ:</strong> {ong.cnpj}</p>
            <p><strong>Email:</strong> {ong.email}</p>
            <p><strong>Endereço:</strong> {ong.endereco}</p>
            <p><strong>Cidade:</strong> {ong.cidade}</p>
            <p><strong>Estado:</strong> {ong.estado}</p>
            <p><strong>Site:</strong> {ong.site}</p>
            <p><strong>Redes sociais:</strong> {ong.rede_social}</p>
            <button onClick={() => setMostrarPerfil(false)}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
}

export default PainelOng;
