// src/components/ModalPerfil.jsx
import React, { useState, useEffect } from 'react';
import './ModalPerfil.css';

export default function ModalPerfil({ isOpen, onClose }) {
  const [perfil, setPerfil] = useState(null);
  const [senha, setSenha] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch('/api/ongs/obter-perfil', {
        headers: {
          'Content-Type': 'application/json',
          // Se usa token no header, insira aqui também
          // 'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      })
        .then(res => res.json())
        .then(data => {
          setPerfil(data);
          setSenha(''); // Senha em branco por padrão
        })
        .catch(() => {
          alert('Erro ao buscar perfil.');
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Meu Perfil</h2>
        {perfil ? (
          <form>
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
            {/* Aqui você pode incluir botão de salvar caso queira */}
          </form>
        ) : (
          <p>Carregando...</p>
        )}
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}
