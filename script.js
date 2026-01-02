let dados = [];
let copiaOriginal = [];

// Carrega JSON
fetch('dados.json')
  .then(res => res.json())
  .then(json => {
    dados = json;
    copiaOriginal = [...json];
    log(`Base carregada: ${dados.length} registros`);
  });

function simular() {
  const inicio = dataInicio.value;
  const fim = dataFim.value;

  if (!inicio || !fim) {
    alert('Informe o período completo');
    return;
  }

  const removidos = dados.filter(d =>
    d.data >= inicio && d.data <= fim
  );

  log(`SIMULAÇÃO`);
  log(`Registros que seriam excluídos: ${removidos.length}`);
}

function excluirPorData() {
  const inicio = dataInicio.value;
  const fim = dataFim.value;

  if (!inicio || !fim) {
    alert('Informe o período completo');
    return;
  }

  const antes = dados.length;

  dados = dados.filter(d =>
    d.data < inicio || d.data > fim
  );

  log(`EXCLUSÃO EXECUTADA`);
  log(`Removidos: ${antes - dados.length}`);
  log(`Restantes: ${dados.length}`);
}

function excluirTudo() {
  if (!confirm('CONFIRMA EXCLUSÃO TOTAL?')) return;

  const total = dados.length;
  dados = [];

  log(`🔥 EXCLUSÃO EM MASSA`);
  log(`Total removido: ${total}`);
}

function baixarJSON() {
  const blob = new Blob(
    [JSON.stringify(dados, null, 2)],
    { type: 'application/json' }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = 'dados_limpos.json';
  a.click();

  URL.revokeObjectURL(url);

  log(`JSON limpo gerado para download`);
}

function log(msg) {
  const logEl = document.getElementById('log');
  logEl.textContent += msg + '\n';
}
