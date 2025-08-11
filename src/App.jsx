import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import Login from './pages/Login';
import CadastroOng from './pages/Cadastroong';
import PainelOng from './pages/Painel/PainelOng';
import Publicacoes from './pages/Painel/Publicacoes';
import Adocao from './pages/Painel/Adocao';
import DoacoesSolicitacoes from './pages/Painel/DoacoesSolicitacoes';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastroong" element={<CadastroOng />} />

      {/* Layout do Painel da ONG com rotas filhas */}
      <Route path="/painel" element={<PainelOng />}>
       <Route index element={<Publicacoes />} /> 
        <Route path="publicacoes" element={<Publicacoes />} />
        <Route path="adocao" element={<Adocao />} />
        <Route path="doacoes" element={<DoacoesSolicitacoes />} />
      </Route>
    </Routes>
  );
}

export default App;
