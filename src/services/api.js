// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL;

export const loginOng = async (email, senha) => {
  const resposta = await fetch(`${API_URL}/ongs/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, senha })
  });

  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.mensagem || 'Erro ao fazer login');
  return dados;
};

export const buscarAnimais = async () => {
  const resposta = await fetch(`${API_URL}/animais`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.mensagem || 'Erro ao buscar animais');
  return dados;
};
