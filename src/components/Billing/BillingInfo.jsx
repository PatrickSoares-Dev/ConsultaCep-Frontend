import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obterToken } from '@/services/auth';
import './BillingInfo.css';

export default function BillingInfo() {
  const [info, setInfo] = useState(null);
  const [erro, setErro] = useState('');
  const [novoSaldo, setNovoSaldo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [exibirInput, setExibirInput] = useState(false);
  const [exibirRemocao, setExibirRemocao] = useState(false);

  const navigate = useNavigate();
  const token = obterToken();

  const fetchBilling = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/billing', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setInfo(data.data);
        setErro('');
      } else {
        setErro('Não foi possível carregar os dados de cobrança.');
      }
    } catch {
      setErro('Erro ao consultar o billing.');
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const atualizarSaldo = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/billing/alterar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ saldo: parseFloat(novoSaldo) })
      });

      const data = await response.json();
      if (data.success) {
        setMensagem('Saldo atualizado com sucesso!');
        setNovoSaldo('');
        setExibirInput(false);
        fetchBilling();
      } else {
        setMensagem('Erro ao atualizar saldo.');
      }
    } catch {
      setMensagem('Erro na requisição ao atualizar saldo.');
    }
  };

  const removerSaldo = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/billing/remover', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ saldo: parseFloat(novoSaldo) })
      });

      const data = await response.json();
      if (data.success) {
        setMensagem('Saldo removido com sucesso!');
        setNovoSaldo('');
        setExibirRemocao(false);
        fetchBilling();
      } else {
        setMensagem(data.message || 'Erro ao remover saldo.');
      }
    } catch {
      setMensagem('Erro na requisição ao remover saldo.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="billing-card">
      <h3>💳 Informações de Cobrança</h3>

      {erro && <p className="error">{erro}</p>}
      {mensagem && <p className="success">{mensagem}</p>}

      {info && (
        <>
          <p><strong>Saldo:</strong> R$ {info.saldo.toFixed(2)}</p>
          <p><strong>Total utilizado:</strong> R$ {info.total_usado.toFixed(2)}</p>
          <p><strong>Total de consultas:</strong> {info.total_consultas}</p>

          {(exibirInput || exibirRemocao) && (
            <div className="billing-update">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Valor"
                value={novoSaldo}
                onChange={(e) => setNovoSaldo(e.target.value)}
              />
              {exibirInput ? (
                <button onClick={atualizarSaldo}>Atualizar Saldo</button>
              ) : (
                <button onClick={removerSaldo} style={{ backgroundColor: '#e74c3c' }}>Remover Saldo</button>
              )}
            </div>
          )}

          <div className="billing-actions">
            <button onClick={handleLogout} className="logout-button">Sair</button>
            <button
              onClick={() => {
                setExibirInput(!exibirInput);
                setExibirRemocao(false);
                setNovoSaldo('');
              }}
            >
              {exibirInput ? 'Cancelar' : 'Adicionar Créditos'}
            </button>
            <button
              onClick={() => {
                setExibirRemocao(!exibirRemocao);
                setExibirInput(false);
                setNovoSaldo('');
              }}
              style={{ backgroundColor: '#e74c3c' }}
            >
              {exibirRemocao ? 'Cancelar' : 'Remover Créditos'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
