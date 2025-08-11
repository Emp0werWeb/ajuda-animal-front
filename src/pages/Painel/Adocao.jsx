import React, { useEffect, useState } from 'react';
import './adocao.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function AnimaisAdocao() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState(null);
  const [status, setStatus] = useState('Aguardando adoção');
  const [animais, setAnimais] = useState([]);

  const token = localStorage.getItem('token');

  const carregarAnimais = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/animais/meus`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dados = await res.json();
      setAnimais(dados);
    } catch (err) {
      console.error('Erro ao carregar animais:', err);
    }
  };

  useEffect(() => {
    carregarAnimais();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foto) {
      alert('Foto é obrigatória');
      return;
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('status', status);
    formData.append('foto', foto);

    try {
      const res = await fetch(`${API_BASE_URL}/api/animais`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const dados = await res.json();
      if (!res.ok) throw new Error(dados.erro || 'Erro ao cadastrar animal');
      alert('Animal cadastrado com sucesso!');
      setNome('');
      setDescricao('');
      setFoto(null);
      setStatus('Aguardando adoção');
      carregarAnimais();
    } catch (err) {
      console.error('Erro:', err);
      alert(err.message);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/animais/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (res.ok) carregarAnimais();
      else console.error('Erro ao atualizar status:', await res.text());
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  return (
    <div className="container">
      <h2>🐾 Cadastrar Animal para Adoção</h2>
      <form onSubmit={handleSubmit} className="form-animal">
        <input
          type="text"
          placeholder="Nome do animal"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setFoto(e.target.files[0])}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Aguardando adoção">Aguardando adoção</option>
          <option value="Adotado">Adotado</option>
        </select>
        <div className="form-button-container">
          <button type="submit" className="btn-submit">Cadastrar</button>
        </div>
      </form>

      <hr />

      <h3>📋 Animais Cadastrados</h3>
      <div className="lista-animais-grid">
        {animais
          .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))
          .map((animal) => (
            <div key={animal.id} className="card-animal">
              <div className="card-info">
                <h4>{animal.nome}</h4>
                <p>{animal.descricao}</p>
                <p>
                  Status:{' '}
                  <strong
                    className={`status-badge ${
                      animal.status === 'Adotado' ? 'adotado' : 'aguardando'
                    }`}
                  >
                    {animal.status}
                  </strong>
                </p>
                <select
                  className="select-status"
                  value={animal.status}
                  onChange={(e) => atualizarStatus(animal.id, e.target.value)}
                >
                  <option value="Aguardando adoção">Aguardando adoção</option>
                  <option value="Adotado">Adotado</option>
                </select>
              </div>
              <div className="card-img-wrapper">
                <img src={animal.foto_url} alt={animal.nome} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default AnimaisAdocao;
