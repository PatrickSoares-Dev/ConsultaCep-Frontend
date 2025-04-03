import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');

  const navigate = useNavigate();

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validarEmail(email)) {
      setMensagem('E-mail inválido.');
      setTipoMensagem('erro');
      return;
    }

    if (nome.trim().length < 3) {
      setMensagem('Informe um nome válido.');
      setTipoMensagem('erro');
      return;
    }

    if (senha.length < 6) {
      setMensagem('Senha mínima de 6 caracteres.');
      setTipoMensagem('erro');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha, full_name: nome }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMensagem('Registro realizado com sucesso!');
        setTipoMensagem('sucesso');
        setTimeout(() => navigate('/'), 2000); 
      } else {
        setMensagem(data.message || 'Erro ao registrar.');
        setTipoMensagem('erro');
      }
    } catch {
      setMensagem('Erro ao conectar com o servidor.');
      setTipoMensagem('erro');
    }
  };

  return (
    <div className="login-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Criar Conta</h2>

        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

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
            marginTop: '-1rem',
          }}>
            {mensagem}
          </p>
        )}

        <button type="submit">Registrar</button>

        <p className="signup-text">
          Já tem uma conta?{' '}
          <span className="signup-link" onClick={() => navigate('/')}>
            Faça login
          </span>
        </p>
      </form>
    </div>
  );
}
