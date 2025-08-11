import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DoacoesSolicitacoes.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function DoacoesSolicitacoes() {
  const [doacoes, setDoacoes] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    async function carregarDados() {
      try {
        const [resDoacoes, resSolicitacoes] = await Promise.all([
          axios.get(`${API_BASE_URL}/doacoes/minhas`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/solicitacoes/minhas`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDoacoes(resDoacoes.data.doacoes || []);
        setSolicitacoes(resSolicitacoes.data.solicitacoes || []);
        setCarregando(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  if (carregando) return <p>Carregando informações...</p>;

  return (
    <div className="container-doacoes">
      <h2>📦 Doações Recebidas</h2>
      {doacoes.length === 0 ? (
        <p>Nenhuma doação recebida ainda.</p>
      ) : (
        <ul>
          {doacoes.map((d) => (
            <li key={d.id}>
              <strong>{d.nome || 'Anônimo'}</strong> doou <strong>R$ {Number(d.valor).toFixed(2)}</strong>
              <br />
              {d.email && <span>Email: {d.email}</span>}
              {d.mensagem && <p>Mensagem: {d.mensagem}</p>}
              <small>{new Date(d.criado_em).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h2>📄 Solicitações de Adoção</h2>
      {solicitacoes.length === 0 ? (
        <p>Nenhuma solicitação de adoção recebida ainda.</p>
      ) : (
        <ul>
          {solicitacoes.map((s) => (
            <li key={s.id}>
              <strong>{s.nome_doador}</strong> deseja adotar um animal
              <br />
              <span>WhatsApp: {s.whatsapp}</span><br />
              {s.email && <span>Email: {s.email}</span>}<br />
              <span>Cidade: {s.cidade}</span><br />
              {s.descricao && <p>Descrição: {s.descricao}</p>}
              <small>{new Date(s.criado_em).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
