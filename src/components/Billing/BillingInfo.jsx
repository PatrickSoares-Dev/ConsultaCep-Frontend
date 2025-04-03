import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obterToken } from '@/services/auth';
import './BillingInfo.css';

export default function BillingInfo() {
  const [info, setInfo] = useState(null);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBilling = async () => {
      const token = obterToken();
      try {
        const response = await fetch('http://127.0.0.1:8000/billing', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setInfo(data.data);
        } else {
          setErro('Não foi possível carregar os dados de cobrança.');
        }
      } catch {
        setErro('Erro ao consultar o billing.');
      }
    };

    fetchBilling();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token
    navigate('/'); // Redireciona para o login
  };

  return (
    <div className="billing-card">
      <h3>💳 Informações de Cobrança</h3>

      {erro && <p className="error">{erro}</p>}

      {info && (
        <>
          <p><strong>Saldo:</strong> R$ {info.saldo.toFixed(2)}</p>
          <p><strong>Total utilizado:</strong> R$ {info.total_usado.toFixed(2)}</p>
          <p><strong>Total de consultas:</strong> {info.total_consultas}</p>

          <div className="billing-actions">
            <button onClick={handleLogout} className="logout-button">Sair</button>
          </div>
        </>
      )}
    </div>
  );
}
