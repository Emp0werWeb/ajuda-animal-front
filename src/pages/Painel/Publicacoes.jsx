import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import './Publicacoes.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function Publicacoes() {
  const { ong } = useOutletContext() || {};
  const [historias, setHistorias] = useState([]);
  const [novaHistoria, setNovaHistoria] = useState({
    titulo: '',
    conteudo: '',
    foto: null,
  });
  const [carregando, setCarregando] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (ong?.id) {
      buscarHistorias();
    }
  }, [ong?.id]);

  const buscarHistorias = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/historias/ong/${ong.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistorias(res.data || []);
    } catch (error) {
      console.error('Erro ao buscar histórias:', error);
      alert('Erro ao buscar histórias. Tente novamente.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovaHistoria((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNovaHistoria((prev) => ({ ...prev, foto: file }));
    }
  };

  const handlePublicarHistoria = async () => {
    if (!novaHistoria.titulo.trim() || !novaHistoria.conteudo.trim()) {
      alert('Título e conteúdo são obrigatórios.');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', novaHistoria.titulo);
    formData.append('conteudo', novaHistoria.conteudo);
    if (novaHistoria.foto) {
      formData.append('foto', novaHistoria.foto);
    }

    try {
      setCarregando(true);

      await axios.post(`${API_BASE_URL}/historias`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type será definido automaticamente pelo axios para multipart/form-data
        },
      });

      alert('História publicada com sucesso!');
      setNovaHistoria({ titulo: '', conteudo: '', foto: null });
      await buscarHistorias();
    } catch (error) {
      console.error('Erro ao publicar história:', error.response?.data || error.message);
      alert('Erro ao publicar história. Verifique os campos e tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="conteudo-publicacoes">
      <div className="formulario-historia">
        <h2>Criar nova publicação</h2>
        <input
          type="text"
          name="titulo"
          placeholder="Título da história"
          value={novaHistoria.titulo}
          onChange={handleInputChange}
        />
        <textarea
          name="conteudo"
          placeholder="Escreva aqui a história..."
          value={novaHistoria.conteudo}
          onChange={handleInputChange}
          rows={5}
        />
        <input
          type="file"
          name="foto"
          accept="image/*"
          onChange={handleFotoChange}
        />
        <button onClick={handlePublicarHistoria} disabled={carregando}>
          {carregando ? 'Publicando...' : 'Publicar'}
        </button>
      </div>

      <h2>Minhas Publicações</h2>
      {historias.length === 0 ? (
        <p>Nenhuma história cadastrada ainda.</p>
      ) : (
        <div className="historias-lista">
          {historias.map((historia) => (
            <div key={historia.id} className="card-historia">
              {historia.foto_url && (
                <img
                  src={historia.foto_url}
                  alt={historia.titulo}
                  style={{ maxWidth: '100%', borderRadius: '8px' }}
                />
              )}
              <h3>{historia.titulo}</h3>
              <p>{historia.conteudo}</p>
              <small>{new Date(historia.criado_em).toLocaleString('pt-BR')}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Publicacoes;
