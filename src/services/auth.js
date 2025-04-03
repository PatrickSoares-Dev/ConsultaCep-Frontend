export function salvarToken(token) {
    localStorage.setItem('token', token);
  }
  
  export function obterToken() {
    return localStorage.getItem('token');
  }
  
  export function removerToken() {
    localStorage.removeItem('token');
  }
  