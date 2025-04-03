import { useEffect, useState } from 'react';
import { obterToken } from '@/services/auth';

export default function HistoricoConsulta() {
  const [historico, setHistorico] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const porPagina = 5;

  useEffect(() => {
    const fetchHistorico = async () => {
      const token = obterToken();
      try {
        const response = await fetch('http://127.0.0.1:8000/cep/historico', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) setHistorico(data.data);
      } catch (error) {
        console.error('Erro ao buscar histórico', error);
      }
    };

    fetchHistorico();
  }, []);

  const totalPaginas = Math.ceil(historico.length / porPagina);
  const dadosVisiveis = historico.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);

  return (
    <div style={{
      marginTop: '2rem',
      background: 'white',
      padding: '2rem',
      borderRadius: '18px',
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)'
    }}>
      <h3 style={{ marginBottom: '1rem', color: '#1e90ff' }}>📚 Histórico de Consultas</h3>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9rem',
        border: '1px solid #ddd'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ textAlign: 'left', padding: '0.75rem', border: '1px solid #ddd' }}>ID</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', border: '1px solid #ddd' }}>CEP</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', border: '1px solid #ddd' }}>Data</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', border: '1px solid #ddd' }}>Crédito Utilizado</th>
          </tr>
        </thead>
        <tbody>
          {dadosVisiveis.map((item, index) => (
            <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{item.id}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{item.cep}</td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                {new Date(item.data_consulta).toLocaleString()}
              </td>
              <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                R$ {Number(item.credito_utilizado || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{
        marginTop: '1.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <button
          onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaAtual === 1}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: paginaAtual === 1 ? '#ccc' : '#1e90ff',
            color: 'white',
            cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Anterior
        </button>

        <span style={{ fontWeight: 500 }}>
          Página {paginaAtual} de {totalPaginas}
        </span>

        <button
          onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaAtual === totalPaginas}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: paginaAtual === totalPaginas ? '#ccc' : '#1e90ff',
            color: 'white',
            cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer'
          }}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
