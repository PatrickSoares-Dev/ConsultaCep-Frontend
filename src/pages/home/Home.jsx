import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obterToken } from '@/services/auth';
import { FaSearch } from 'react-icons/fa';

import ApiDoc from '../../components/ApiDoc/ApiDoc';
import BillingInfo from '../../components/Billing/BillingInfo';
import HistoricoConsulta from '../../components/Historico/HistoricoConsulta';

import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [localidade, setLocalidade] = useState('');
  const [uf, setUf] = useState('');
  const [erro, setErro] = useState('');
  const [respostaApi, setRespostaApi] = useState(null);
  const [tokenValido, setTokenValido] = useState(false);

  const [historico, setHistorico] = useState([]);

  const token = obterToken();
  const nomeCompleto = localStorage.getItem('full_name') || 'Usuário';
  const primeiroNome = nomeCompleto.split(' ')[0];

  // Atualiza o histórico chamando a API
  const atualizarHistorico = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/cep/historico', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setHistorico(data.data);
      } else {
        console.warn('Não foi possível carregar o histórico.');
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      setTokenValido(true);
      atualizarHistorico();
    }
  }, [navigate, token]);

  const buscarCEP = async () => {
    if (!cep || !token) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/cep/${cep}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.data) {
        const { logradouro, bairro, localidade, uf } = data.data;
        setLogradouro(logradouro);
        setBairro(bairro);
        setLocalidade(localidade);
        setUf(uf);
        setErro('');
        setRespostaApi(data);

        await atualizarHistorico(); // Atualiza histórico após consulta bem-sucedida
      } else {
        setErro(data.message || 'CEP não encontrado');
        limparCampos();
        setRespostaApi({
          success: false,
          status_code: 404,
          message: data.message || 'CEP não encontrado',
        });
      }
    } catch {
      setErro('Erro ao consultar o CEP');
      limparCampos();
      setRespostaApi({
        success: false,
        status_code: 500,
        message: 'Erro ao consultar o CEP',
      });
    }
  };

  const limparCampos = () => {
    setCep('');
    setLogradouro('');
    setBairro('');
    setLocalidade('');
    setUf('');
    setErro('');
    setRespostaApi(null);
  };

  if (!tokenValido) return null;

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <BillingInfo />

        <form
          className="cep-form"
          onSubmit={(e) => {
            e.preventDefault();
            buscarCEP();
          }}
        >
          <h2>Teste a nossa API de consulta CEP</h2>
          <p className="subtitle">
            Digite um CEP para testar o retorno da nossa API
          </p>

          <div className="input-cep-row">
            <div className="input-floating">
              <input
                type="text"
                id="cep"
                placeholder=" "
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                required
              />
              <label htmlFor="cep">Digite o seu CEP</label>
            </div>
            <button
              type="button"
              className="search-button"
              onClick={buscarCEP}
            >
              <FaSearch />
            </button>
          </div>

          <div className="grid">
            <div className="input-floating">
              <input
                type="text"
                id="logradouro"
                value={logradouro}
                disabled
                placeholder=" "
              />
              <label htmlFor="logradouro">Rua</label>
            </div>

            <div className="input-floating">
              <input
                type="text"
                id="bairro"
                value={bairro}
                disabled
                placeholder=" "
              />
              <label htmlFor="bairro">Bairro</label>
            </div>

            <div className="input-floating">
              <input
                type="text"
                id="localidade"
                value={localidade}
                disabled
                placeholder=" "
              />
              <label htmlFor="localidade">Cidade</label>
            </div>

            <div className="input-floating">
              <input
                type="text"
                id="uf"
                value={uf}
                disabled
                placeholder=" "
              />
              <label htmlFor="uf">Estado</label>
            </div>
          </div>

          {erro && <p className="error-message">{erro}</p>}
        </form>

        <HistoricoConsulta
          historico={historico}
          atualizarHistorico={atualizarHistorico}
        />
      </div>

      <div style={{ flex: 1, maxWidth: '600px', minWidth: '360px' }}>
        <div
          style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '18px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
            marginBottom: '1.5rem',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1e90ff' }}>
            👋 Bem-vindo, {primeiroNome}
          </h2>
          <p style={{ marginTop: '0.5rem', color: '#555' }}>
            Use o formulário ao lado para consultar um CEP e veja abaixo como a
            requisição é formada.
          </p>
        </div>

        <ApiDoc cep={cep} token={token} responseData={respostaApi} />
      </div>
    </div>
  );
}
