import React, { useState } from 'react';
import axios from 'axios';
import './Cadastroong.css'; // crie esse arquivo para estilização

export default function CadastroOng() {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    senha: '',
    descricao: '',
    endereco: '',
    cidade: '',
    estado: '',
    site: '',
    rede_social: '',
    observacoes: '',
  });

  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      await axios.post('http://localhost:3000/api/ongs/cadastrar', formData);
      setSucesso(true);
    } catch (err) {
      console.error(err);
      setErro('Erro ao cadastrar. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h2>Cadastro de ONG</h2>
        {sucesso ? (
          <div className="mensagem-sucesso">
            Perfil enviado para análise. Em breve estará disponível!
            <a href="/login" className="link-login">Ir para tela de login</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {erro && <p className="erro">{erro}</p>}

            <input type="text" name="nome" placeholder="Nome da ONG" onChange={handleChange} required />
            <input type="text" name="cnpj" placeholder="CNPJ" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="senha" placeholder="Senha" onChange={handleChange} required />
            <textarea name="descricao" placeholder="Descrição da ONG" onChange={handleChange} required />
            <input type="text" name="endereco" placeholder="Endereço" onChange={handleChange} required />
            <input type="text" name="cidade" placeholder="Cidade" onChange={handleChange} required />
            <input type="text" name="estado" placeholder="Estado" onChange={handleChange} required />
            <input type="url" name="site" placeholder="Site (opcional)" onChange={handleChange} />
            <input type="url" name="rede_social" placeholder="Rede Social" onChange={handleChange} />
            <textarea name="observacoes" placeholder="Observações (ex: aceita voluntários...)" onChange={handleChange} />

            <button type="submit">Salvar</button>
          </form>
        )}
      </div>
    </div>
  );
}

