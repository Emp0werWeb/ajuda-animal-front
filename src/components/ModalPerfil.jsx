import React, { useState, useEffect } from 'react';
import './ModalPerfil.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function ModalPerfil({ isOpen, onClose }) {
  const [perfil, setPerfil] = useState(null);
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchPerfil = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Usuário não autenticado');
          onClose();
          return;
        }
        setCarregando(true);
        try {
          const res = await fetch(`${API_BASE_URL}/api/ongs/obter-perfil`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) throw new Error('Erro ao buscar perfil');
          const data = await res.json();
          setPerfil(data.ong || data); // dependendo da estrutura do seu backend
          setSenha('');
          setMensagem(null);
        } catch (error) {
          alert(error.message || 'Erro ao buscar perfil.');
          onClose();
        } finally {
          setCarregando(false);
        }
      };
      fetchPerfil();
    }
  }, [isOpen, onClose]);

  const handleSalvar = async () => {
    if (!perfil) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Usuário não autenticado');
      onClose();
      return;
    }

    // Dados para atualizar - inclui senha somente se preenchida
    const dadosAtualizacao = { ...perfil };
    if (senha.trim()) {
      dadosAtualizacao.senha = senha.trim();
    }

    setCarregando(true);
    setMensagem(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ongs/atualizar-perfil`, {
        method: 'PUT', // ou PATCH dependendo do backend
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosAtualizacao),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.mensagem || 'Erro ao atualizar perfil');
      }

      setMensagem('Perfil atualizado com sucesso!');
      setSenha('');
    } catch (error) {
      setMensagem(error.message || 'Erro ao atualizar perfil.');
    } finally {
      setCarregando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Meu Perfil</h2>
        {carregando ? (
          <p>Carregando...</p>
        ) : perfil ? (
          <>
            <form onSubmit={e => e.preventDefault()}>
              <label>
                Nome:
                <input
                  type="text"
                  value={perfil.nome || ''}
                  onChange={e => setPerfil({ ...perfil, nome: e.target.value })}
                />
              </label>
              <label>
                CNPJ:
                <input type="text" value={perfil.cnpj || ''} disabled />
              </label>
              <label>
                Descrição:
                <textarea
                  value={perfil.descricao || ''}
                  onChange={e => setPerfil({ ...perfil, descricao: e.target.value })}
                />
              </label>
              <label>
                Endereço:
                <input
                  type="text"
                  value={perfil.endereco || ''}
                  onChange={e => setPerfil({ ...perfil, endereco: e.target.value })}
                />
              </label>
              <label>
                Cidade:
                <input
                  type="text"
                  value={perfil.cidade || ''}
                  onChange={e => setPerfil({ ...perfil, cidade: e.target.value })}
                />
              </label>
              <label>
                Estado:
                <input
                  type="text"
                  value={perfil.estado || ''}
                  onChange={e => setPerfil({ ...perfil, estado: e.target.value })}
                />
              </label>
              <label>
                Email:
                <input type="email" value={perfil.email || ''} disabled />
              </label>
              <label>
                Senha:
                <input
                  type="password"
                  value={senha}
                  placeholder="Digite nova senha"
                  onChange={e => setSenha(e.target.value)}
                />
              </label>
            </form>
            {mensagem && <p className="mensagem">{mensagem}</p>}
            <button onClick={handleSalvar} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar'}
            </button>
            <button onClick={onClose} disabled={carregando}>
              Fechar
            </button>
          </>
        ) : (
          <p>Carregando perfil...</p>
        )}
      </div>
    </div>
  );
}
