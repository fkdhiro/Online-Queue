const API_URL = 'http://localhost:3000/fila';

// Função para obter os dados
export async function getData() {
  const response = await fetch(`${API_URL}/list`, { method: 'GET' });
  return response.json();
}

// Função para inserir um novo documento
export async function insertDocument() {
  const lastOrdemCriacao = await getLastOrdemCriacao();
  const lastPosicao = await getLastPosicao();
  const newItem = lastPosicao + 1;
  const response = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: '', codigo: newItem * 100, posicao: lastPosicao + 1, status: 3, ordem_criacao: lastOrdemCriacao + 1 })
  });
  return response.json();
}

export async function insertPrint(item) {
  const ordemCriacao = await getLastOrdemCriacao() + 1;
  const posItem = await getLastPosicao();
  const newPosItem = posItem + 1;

  // 2. Realizar o POST com o novo item incluindo ordem_criacao
  const response = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      text: "", 
      codigo: item.codigo, 
      posicao: newPosItem,
      status: 3, 
      ordem_criacao: ordemCriacao 
    })
  });

  return response.json();
}
export async function getLastOrdemCriacao() {
  const response = await fetch(`${API_URL}/list`);
  const data = await response.json();
  
  const ordemCriacaoItem = data.reduce((max, item) => (item.ordem_criacao > max ? item.ordem_criacao : max), 0);
  
  return ordemCriacaoItem;
}
export async function getLastPosicao() {
  const response = await fetch(`${API_URL}/list`);
  const data = await response.json();

  const posicaoItem = data.reduce((max, item) => (item.posicao > max ? item.posicao : max), 1);
  return posicaoItem;
}


// Função para atualizar um documento
export async function updateDocument(item) {
  const response = await fetch(`${API_URL}/update`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  return response.json();
}

// Função para atualizar a fila
export async function updateFila(item) {
  const response = await fetch(`${API_URL}/updatefila`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  return response.json();
}

// Função para atualizar o "voltar"
export async function updateVoltar(item) {
  const response = await fetch(`${API_URL}/voltar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  return response.json();
}

export async function deleteDocument(item) {
  const response = await fetch(`${API_URL}/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  return response.json();
}

export async function chamarFila(item) {
  const response = await fetch(`${API_URL}/chamar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  return response.json();
}
