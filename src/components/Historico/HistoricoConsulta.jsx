import { useEffect, useState } from 'react';

export default function HistoricoConsulta({ historico, atualizarHistorico }) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const porPagina = 5;

  useEffect(() => {
    atualizarHistorico(); 
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
            <th style={styles.th}>ID</th>
            <th style={styles.th}>CEP</th>
            <th style={styles.th}>Data</th>
            <th style={styles.th}>Crédito Utilizado</th>
          </tr>
        </thead>
        <tbody>
          {dadosVisiveis.map((item, index) => (
            <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
              <td style={styles.td}>{item.id}</td>
              <td style={styles.td}>{item.cep}</td>
              <td style={styles.td}>{new Date(item.data_consulta).toLocaleString()}</td>
              <td style={styles.td}>R$ {Number(item.credito_utilizado || 0).toFixed(2)}</td>
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
          style={paginaAtual === 1 ? styles.btnDisabled : styles.btn}
        >
          Anterior
        </button>

        <span style={{ fontWeight: 500 }}>
          Página {paginaAtual} de {totalPaginas}
        </span>

        <button
          onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaAtual === totalPaginas}
          style={paginaAtual === totalPaginas ? styles.btnDisabled : styles.btn}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

const styles = {
  th: {
    textAlign: 'left',
    padding: '0.75rem',
    border: '1px solid #ddd'
  },
  td: {
    padding: '0.75rem',
    border: '1px solid #ddd'
  },
  btn: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#1e90ff',
    color: 'white',
    cursor: 'pointer'
  },
  btnDisabled: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#ccc',
    color: 'white',
    cursor: 'not-allowed'
  }
};
