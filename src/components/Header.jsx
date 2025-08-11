import './Header.css';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const irParaLogin = () => {
    navigate('/login');
  };

  const irParaCadastro = () => {
    navigate('/cadastroong');
  };

  const irParaHome = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo" onClick={irParaHome} style={{ cursor: 'pointer' }}>
          💚 Ajuda Animais
        </h1>
        <div className="header-buttons">
          <button className="btn-entrar" onClick={irParaLogin}>Entrar</button>
          <button className="btn-cadastrar" onClick={irParaCadastro}>Cadastrar-se como ONG</button>
        </div>
      </div>
    </header>
  );
}
