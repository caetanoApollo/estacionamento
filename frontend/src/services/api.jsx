const BASE_URL = 'http://10.1.90.230:3030'; // altere para seu IP se for usar no celular

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password })
  });
  return response.json();
}

export async function cadastrar(usuario) {
  const response = await fetch(`${BASE_URL}/cadastro`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(usuario)
  });
  return response.json();
}

export async function listarVagas() {
  const response = await fetch(`${BASE_URL}/vagas`);
  return response.json();
}

export async function ocuparVaga(vagaId, userId) {
  const response = await fetch(`${BASE_URL}/vagas/${vagaId}/ocupar`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ userId })
  });
  return response.json();
}

export async function desocuparVaga(vagaId) {
  const response = await fetch(`${BASE_URL}/vagas/${vagaId}/desocupar`, {
    method: 'DELETE'
  });
  return response.json();
}

export async function editarUsuario(id, dados) {
  const response = await fetch(`${BASE_URL}/editar/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(dados)
  });
  return response.json();
}
