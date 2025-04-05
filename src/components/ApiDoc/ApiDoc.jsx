import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ApiDoc({ cep = '00000000', token = 'SEU_TOKEN', responseData }) {
  const baseUrl = 'http://127.0.0.1:8000';

  const curl = `curl --request GET \\
--url ${baseUrl}/cep/${cep} \\
--header 'Authorization: Bearer ${token}'`;

const successResponse = responseData
  ? JSON.stringify(responseData, null, 2)
  : `{
  "success": true,
  "status_code": 200,
  "data": {
    "cep": "22640-102",
    "logradouro": "Avenida das Américas",
    "bairro": "Barra da Tijuca",
    "localidade": "Rio de Janeiro",
    "uf": "RJ"
  }
}`;


  return (
    <div className="api-preview">
      <h3>📘Documentação /GET CEP</h3>
      <h5>Documentação completa em: http://127.0.0.1:8000/docs</h5>

      <div>
        <h4>Base URL</h4>
        <SyntaxHighlighter language="bash" style={materialDark}>
          {baseUrl}
        </SyntaxHighlighter>
      </div>

      <div>
        <h4>Header</h4>
        <SyntaxHighlighter language="http" style={materialDark}>
          Authorization: Bearer {token}
        </SyntaxHighlighter>
      </div>

      <div>
        <h4>Requisição cURL</h4>
        <SyntaxHighlighter language="bash" style={materialDark}>
          {curl}
        </SyntaxHighlighter>
      </div>

      <div>
        <h4>Resposta</h4>
        <SyntaxHighlighter language="json" style={materialDark}>
          {successResponse}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
