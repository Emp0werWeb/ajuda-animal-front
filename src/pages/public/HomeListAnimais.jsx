import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomeListAnimais.css';

export default function HomeListAnimais() {
  const [animais, setAnimais] = useState([]);
  const [cidade, setCidade] = useState('');
  const [nome, setNome] = useState('');
  const [pagina, setPagina] = useState(1);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [animalSelecionado, setAnimalSelecionado] = useState(null);
  const [formData, setFormData] = useState({
    nome_doador: '',
    cidade: '',
    whatsapp: '',
    email: '',
    descricao: ''
  });

  const cidadesDisponiveis = [
    '',
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre',
    'Curitiba', 'Brasília', 'Xanxerê', 'Salvador', 'Campinas'
  ];

  // URL base da API via variável de ambiente, fallback localhost
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  const buscarAnimais = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/animais?status=Aguardando%20adoção`);
      const filtrados = res.data.filter(
        (a) =>
          (!cidade || a.cidade === cidade) &&
          (!nome || a.nome_ong.toLowerCase().includes(nome.toLowerCase()))
      );
      const ordenado = filtrados.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
      setAnimais(ordenado);
    } catch (err) {
      console.error('Erro ao buscar animais:', err);
    }
  };

  useEffect(() => {
    buscarAnimais();
  }, [cidade, nome]);

  const animaisPaginados = animais.slice(0, pagina * 12);

  const abrirModal = (animal) => {
    setAnimalSelecionado(animal);
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setFormData({
      nome_doador: '',
      cidade: '',
      whatsapp: '',
      email: '',
      descricao: ''
    });
  };

  const enviarSolicitacao = async () => {
    const { nome_doador, cidade, whatsapp } = formData;
    if (!nome_doador || !cidade || !whatsapp) {
      alert('Preencha nome, cidade e WhatsApp.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/solicitacoes`, {
        ...formData,
        animal_id: animalSelecionado.id
      });
      alert('Solicitação enviada com sucesso! A ONG será notificada.');
      fecharModal();
    } catch (err) {
      console.error('Erro ao enviar solicitação:', err);
      alert('Erro ao enviar solicitação.');
    }
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="animais-container">
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nome da ONG"
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
            <option key={i} value={c}>{c || 'Todas as cidades'}</option>
          ))}
        </select>
      </div>

      <div className="animais-list">
        {animaisPaginados.map((animal) => (
          <div key={animal.id} className="animal-card">
            <div className="animal-top">
              <span className="nome-ong">{animal.nome_ong}</span>
              <span className="cidade-ong">{animal.cidade}</span>
            </div>
            <h3 className="animal-nome">{animal.nome}</h3>
            {animal.foto_url ? (
              <img src={animal.foto_url} alt={animal.nome} className="animal-imagem" />
            ) : (
              <div className="imagem-placeholder">Sem imagem disponível</div>
            )}
            <p className="descricao">{animal.descricao}</p>
            <div className="info-footer">
              <span>{formatarData(animal.criado_em)}</span>
              <span className="status">{animal.status}</span>
            </div>
            <button onClick={() => abrirModal(animal)} className="btn-adotar">
              Adotar - Avisar ONG
            </button>
          </div>
        ))}
      </div>

      {pagina * 12 < animais.length && (
        <button onClick={() => setPagina(p => p + 1)} className="btn-vermais">
          Ver mais animais
        </button>
      )}

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Solicitar adoção de: {animalSelecionado.nome}</h2>
            <input
              placeholder="Seu nome"
              value={formData.nome_doador}
              onChange={e => setFormData({ ...formData, nome_doador: e.target.value })}
            />
            <input
              placeholder="Cidade"
              value={formData.cidade}
              onChange={e => setFormData({ ...formData, cidade: e.target.value })}
            />
            <input
              placeholder="WhatsApp"
              value={formData.whatsapp}
              onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
            />
            <input
              placeholder="Email (opcional)"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <textarea
              placeholder="Mensagem para ONG"
              value={formData.descricao}
              onChange={e => setFormData({ ...formData, descricao: e.target.value })}
            ></textarea>
            <div className="modal-buttons">
              <button onClick={enviarSolicitacao} className="btn-confirmar">Enviar</button>
              <button onClick={fecharModal} className="btn-cancelar">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
