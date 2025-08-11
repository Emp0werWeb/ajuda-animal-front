import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomeListHistoria.css';
import LinkedinDevImg from "../../assets/LinkedinDev.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function HomeListHistoria() {
  const [historias, setHistorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cidade, setCidade] = useState('');
  const [nome, setNome] = useState('');

  const [mostrarModal, setMostrarModal] = useState(false);
  const [historiaSelecionada, setHistoriaSelecionada] = useState(null);
  const [formDoacao, setFormDoacao] = useState({
    nome_doador: '',
    email: '',
    valor: '',
    mensagem: '',
  });

  const cidadesDisponiveis = [
    '',
    'São Paulo',
    'Rio de Janeiro',
    'Belo Horizonte',
    'Porto Alegre',
    'Curitiba',
    'Brasília',
    'Xanxerê',
    'Salvador',
    'Campinas',
  ];

  const fetchHistorias = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (nome.trim()) params.nome = nome.trim();
      if (cidade) params.cidade = cidade;

      const response = await axios.get(`${API_BASE_URL}/historias/busca`, { params });
      setHistorias(response.data);
    } catch (err) {
      setError('Erro ao carregar histórias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorias();
  }, [nome, cidade]);

  const formatarData = (dataISO) => {
    if (!dataISO) return '';
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const abrirModalDoacao = (historia) => {
    setHistoriaSelecionada(historia);
    setFormDoacao({ nome_doador: '', email: '', valor: '', mensagem: '' });
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setHistoriaSelecionada(null);
  };

  const handleChange = (e) => {
    setFormDoacao({ ...formDoacao, [e.target.name]: e.target.value });
  };

  const enviarDoacao = async () => {
    if (!formDoacao.valor || isNaN(formDoacao.valor) || Number(formDoacao.valor) <= 0) {
      alert('Informe um valor válido para a doação.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/doacoes`, {
        historia_id: historiaSelecionada.id,
        ong_id: historiaSelecionada.ong_id,
        ...formDoacao,
      });

      alert('Doação cadastrada com sucesso!');
      fecharModal();
    } catch (error) {
      console.error(error);
      alert('Erro ao enviar doação.');
    }
  };

  return (
    <div className="historias-container">
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="input-busca"
        />

        <select
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          className="select-cidade"
        >
          {cidadesDisponiveis.map((c, i) => (
            <option key={i} value={c}>
              {c || 'Todas as cidades'}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Carregando histórias...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && historias.length === 0 && <p>Nenhuma história encontrada.</p>}

      <div className="historias-list">
        {historias.map((historia) => (
          <div key={historia.id} className="historia-card">
            <div className="historia-header">
              <span className="nome-ong">{historia.nome_ong || 'ONG sem nome'}</span> -{' '}
              <span className="cidade-ong">{historia.cidade || 'Cidade não informada'}</span>
            </div>

            <h3 className="historia-titulo">{historia.titulo}</h3>

            {historia.foto_url ? (
              <img
                src={historia.foto_url}
                alt={`Imagem da história: ${historia.titulo}`}
                className="historia-imagem"
              />
            ) : (
              <div className="imagem-placeholder">Sem imagem disponível</div>
            )}

            <div className="historia-conteudo">{historia.conteudo}</div>

            <div className="historia-footer">
              <span className="data-criacao">{formatarData(historia.criado_em)}</span>
              <button className="btn-doar" onClick={() => abrirModalDoacao(historia)}>
                Doar - Ajudar ONG
              </button>
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <img
              src={LinkedinDevImg}
              alt="Imagem do modal"
              className="modal-imagem"
              style={{ width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px' }}
            />

            <h2>Doar para {historiaSelecionada?.nome_ong}</h2>

            <input
              type="text"
              name="nome_doador"
              placeholder="Seu nome (opcional)"
              value={formDoacao.nome_doador}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Seu e-mail (opcional)"
              value={formDoacao.email}
              onChange={handleChange}
            />
            <input
              type="number"
              name="valor"
              placeholder="Valor da doação (R$)"
              value={formDoacao.valor}
              onChange={handleChange}
              required
            />
            <textarea
              name="mensagem"
              placeholder="Mensagem (opcional)"
              value={formDoacao.mensagem}
              onChange={handleChange}
            ></textarea>

            <div className="modal-buttons">
              <button className="btn-confirmar" onClick={enviarDoacao}>
                Confirmar Doação
              </button>
              <button className="btn-cancelar" onClick={fecharModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
