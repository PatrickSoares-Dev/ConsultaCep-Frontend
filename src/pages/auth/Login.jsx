import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { salvarToken } from '../../services/auth';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data?.data) {
        const { access_token, full_name } = data.data.data;
        salvarToken(access_token);
        localStorage.setItem('full_name', full_name);
        navigate('/home');
      }
      else {
        setMensagem('Credenciais inválidas.');
        setTipoMensagem('erro');
      }
    } catch {
      setMensagem('Erro ao conectar com o servidor.');
      setTipoMensagem('erro');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Entrar</h2>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        {mensagem && (
          <p style={{
            color: tipoMensagem === 'sucesso' ? '#1e90ff' : '#e74c3c',
            fontSize: '0.9rem',
            textAlign: 'center',
          }}>
            {mensagem}
          </p>
        )}

        <button type="submit">Acessar</button>

        <p className="signup-text">
          Não tem uma conta? <span className="signup-link" onClick={() => navigate('/cadastro')}>Cadastre-se</span>
        </p>
      </form>
    </div>
  );
}
