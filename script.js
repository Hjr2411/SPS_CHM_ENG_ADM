// ===============================
// FIREBASE CONFIG
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyAeCrURSs0TBXlYF3TKLi4q98VwrGaKe_Q",
  authDomain: "spsch-849e5.firebaseapp.com",
  databaseURL: "https://spsch-849e5-default-rtdb.firebaseio.com",
  projectId: "spsch-849e5",
  storageBucket: "spsch-849e5.firebasestorage.app",
  messagingSenderId: "698967090558",
  appId: "1:698967090558:web:978781fd27b86c36203f2f",
  measurementId: "G-C5D3774P2G"
};

// ===============================
// INIT FIREBASE
// ===============================
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.database();

// ⚠️ AJUSTE IMPORTANTE:
// NÃO use "/" para excluir – isso inclui backup e config
const baseRef = db.ref("registros");

// ===============================
// VARIÁVEIS
// ===============================
let dados = {};

// ===============================
// CARREGAR BASE
// ===============================
baseRef.once("value").then(snapshot => {
  const raw = snapshot.val();

  if (!raw) {
    log("❌ Nenhum dado retornado do Firebase");
    return;
  }

  dados = raw;

  log(`✅ Registros carregados: ${Object.keys(dados).length}`);

  // DEBUG REAL
  Object.values(dados).slice(0, 5).forEach(item => {
    log(`DATA ENCONTRADA: ${item.data}`);
  });
});

// ===============================
// SIMULAR EXCLUSÃO POR DATA
// ===============================
function simular() {
  const inicio = dataInicio.value;
  const fim = dataFim.value;

  if (!inicio || !fim) {
    alert("Informe o período completo");
    return;
  }

  if (fim < inicio) {
    alert("Data final menor que a inicial");
    return;
  }

  let count = 0;

  Object.values(dados).forEach(item => {
    if (!item.data) return;
    if (item.data >= inicio && item.data <= fim) {
      count++;
    }
  });

  log(`🧪 SIMULAÇÃO`);
  log(`Registros que seriam excluídos: ${count}`);
}

// ===============================
// EXCLUIR POR PERÍODO
// ===============================
function excluirPorData() {
  const inicio = dataInicio.value;
  const fim = dataFim.value;

  if (!inicio || !fim) {
    alert("Informe o período completo");
    return;
  }

  if (fim < inicio) {
    alert("Data final menor que a inicial");
    return;
  }

  if (!confirm(`Confirma exclusão de ${inicio} até ${fim}?`)) return;

  const updates = {};
  let removidos = 0;

  Object.entries(dados).forEach(([key, item]) => {
    if (!item.data) return;

    if (item.data >= inicio && item.data <= fim) {
      updates[key] = null;
      removidos++;
    }
  });

  if (removidos === 0) {
    log("⚠️ Nenhum registro encontrado para exclusão");
    return;
  }

  // BACKUP ANTES DE EXCLUIR
  db.ref("backup_exclusoes/" + Date.now()).set(dados);

  baseRef.update(updates).then(() => {
    log(`🔥 EXCLUSÃO CONCLUÍDA`);
    log(`Registros removidos: ${removidos}`);
    location.reload();
  });
}

// ===============================
// EXCLUSÃO TOTAL
// ===============================
function excluirTudo() {
  if (!confirm("⚠️ CONFIRMA EXCLUSÃO TOTAL DA BASE?")) return;

  db.ref("backup_exclusoes/" + Date.now()).set(dados);

  baseRef.remove().then(() => {
    log("🔥 BASE COMPLETAMENTE EXCLUÍDA");
    location.reload();
  });
}

// ===============================
// DOWNLOAD JSON
// ===============================
function baixarJSON() {
  const blob = new Blob(
    [JSON.stringify(dados, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "backup_sps_ch.json";
  a.click();

  log("📦 Backup baixado");
}

// ===============================
// LOG
// ===============================
function log(msg) {
  const logEl = document.getElementById("log");
  logEl.textContent += msg + "\n";
}
