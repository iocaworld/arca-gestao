/**
 * A.R.C.A. - Aguada de Baixo | Gestão Geral v2.0
 * Scripts e Lógica Funcional
 */

// =========================================================================
// 0. Utilitários Globais
// =========================================================================
window.escapeHtml = function(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// =========================================================================
// 1. Notificações Toasts Globais
// =========================================================================
window.showToast = function(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconSvg = type === 'success' 
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-green);"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-red);"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <div style="flex: 1; font-size: 0.9rem; font-weight: 500; color: var(--text-title);">${message}</div>
    <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 1.2rem;">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// =========================================================================
// GESTÃO CENTRAL DE RECIBOS EMITIDOS (LIVRO OFICIAL & DMS ARCA)
// Suporte a IndexedDB para ficheiros digitalizados de grande dimensão +
// sincronização com LocalStorage e ligação direta às quotas dos associados
// =========================================================================
(function() {
  const RECIBOS_DB_NAME = 'arca_recibos_dms_db_v2';
  const RECIBOS_DB_VERSION = 1;
  const RECIBOS_STORE = 'recibos';
  const STORAGE_KEY = 'ARCA_RECIBOS_LIST_V2';

  const DEFAULT_RECIBOS = [
    {
      id: 'rec_1350',
      numero: '1350',
      recibo: '1350',
      data: '2026-11-25',
      titular: 'Carlos Manuel Reis Rodrigues (Sócio 2)',
      socioId: 2,
      socioNumero: 2,
      finalidade: 'Liquidação Quota 2026',
      valor: 6.00,
      metodo: 'Numerário',
      notas: 'Livro de Recibos nº 14, Folha 50. Exemplar oficial emitido e entregue ao associado.',
      fileName: 'Recibo_Oficial_1350_Carlos_Rodrigues.pdf',
      fileSize: '840 KB',
      format: 'pdf',
      temFicheiro: true,
      dataCriacao: '2026-11-25'
    },
    {
      id: 'rec_1349',
      numero: '1349',
      recibo: '1349',
      data: '2026-11-24',
      titular: 'Manuel António Rodrigues (Sócio 3)',
      socioId: 3,
      socioNumero: 3,
      finalidade: 'Liquidação Quota 2026',
      valor: 6.00,
      metodo: 'MBWay',
      notas: 'Livro de Recibos nº 14, Folha 49. Pagamento por via digital.',
      fileName: 'Recibo_Oficial_1349_Manuel_Rodrigues.pdf',
      fileSize: '720 KB',
      format: 'pdf',
      temFicheiro: true,
      dataCriacao: '2026-11-24'
    },
    {
      id: 'rec_1348',
      numero: '1348',
      recibo: '1348',
      data: '2026-11-20',
      titular: 'Grupo Amigos de Aguada',
      finalidade: 'Donativo Peregrinos 2026',
      valor: 350.00,
      metodo: 'Transferência Bancária',
      notas: 'Donativo institucional referente ao acolhimento de peregrinos. Ref. TRF-88219.',
      fileName: 'Comprovativo_TRF_1348_Amigos_Aguada.pdf',
      fileSize: '1.1 MB',
      format: 'pdf',
      temFicheiro: true,
      dataCriacao: '2026-11-20'
    },
    {
      id: 'rec_1347',
      numero: '1347',
      recibo: '1347',
      data: '2026-11-15',
      titular: 'Arsénio da Costa Ferreira (Sócio 21)',
      socioId: 21,
      socioNumero: 21,
      finalidade: 'Liquidação Quota 2026',
      valor: 6.00,
      metodo: 'Numerário',
      notas: 'Livro de Recibos nº 14, Folha 47.',
      fileName: 'Recibo_Oficial_1347_Arsenio_Ferreira.pdf',
      fileSize: '650 KB',
      format: 'pdf',
      temFicheiro: true,
      dataCriacao: '2026-11-15'
    },
    {
      id: 'rec_1346',
      numero: '1346',
      recibo: '1346',
      data: '2026-11-10',
      titular: 'Comissão de Festas de Aguada',
      finalidade: 'Donativo Institucional',
      valor: 250.00,
      metodo: 'Transferência Bancária',
      notas: 'Apoio logístico às festividades da freguesia.',
      fileName: 'Comprovativo_1346_Comissao_Festas.pdf',
      fileSize: '950 KB',
      format: 'pdf',
      temFicheiro: true,
      dataCriacao: '2026-11-10'
    }
  ];

  function openDB() {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        resolve(null);
        return;
      }
      const req = indexedDB.open(RECIBOS_DB_NAME, RECIBOS_DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(RECIBOS_STORE)) {
          db.createObjectStore(RECIBOS_STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = () => resolve(null);
    });
  }

  function getCachedRecibos() {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Erro ao ler recibos do localStorage:', e);
    }
    return [...DEFAULT_RECIBOS];
  }

  function saveCachedRecibos(list) {
    try {
      const metadataOnly = list.map(r => {
        const copy = { ...r };
        delete copy.fileBlob;
        return copy;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(metadataOnly));
    } catch(e) {
      console.warn('Erro ao gravar cache de recibos no localStorage:', e);
    }
  }

  async function dbGetAll() {
    const db = await openDB();
    if (!db) return getCachedRecibos();
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(RECIBOS_STORE, 'readonly');
        const store = tx.objectStore(RECIBOS_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve(getCachedRecibos());
      } catch (e) {
        resolve(getCachedRecibos());
      }
    });
  }

  async function dbPut(item) {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(RECIBOS_STORE, 'readwrite');
        const store = tx.objectStore(RECIBOS_STORE);
        const req = store.put(item);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  async function dbDelete(id) {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(RECIBOS_STORE, 'readwrite');
        const store = tx.objectStore(RECIBOS_STORE);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  }

  async function dbGetById(id) {
    const db = await openDB();
    if (!db) {
      const list = getCachedRecibos();
      return list.find(r => r.id === id || String(r.numero) === String(id));
    }
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(RECIBOS_STORE, 'readonly');
        const store = tx.objectStore(RECIBOS_STORE);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  async function initStore() {
    try {
      const dbList = await dbGetAll();
      if (!dbList || dbList.length === 0) {
        const initial = getCachedRecibos();
        for (const r of initial) {
          await dbPut(r);
        }
        saveCachedRecibos(initial);
      } else {
        saveCachedRecibos(dbList);
      }
    } catch (err) {
      console.warn('Erro ao inicializar arquivo de recibos:', err);
    }
  }

  initStore();

  window.ARCA_RECIBOS = {
    getAll: getCachedRecibos,
    getAllFromDB: dbGetAll,
    getById: dbGetById,

    getByNumero: function(num) {
      if (!num) return null;
      const clean = String(num).replace(/^[^\d]*/, '').trim();
      const list = getCachedRecibos();
      return list.find(r => {
        const rClean = String(r.numero || r.recibo).replace(/^[^\d]*/, '').trim();
        return rClean === clean || String(r.numero) === String(num) || String(r.recibo) === String(num);
      }) || null;
    },

    getNextNumero: function() {
      const list = getCachedRecibos();
      let maxNum = 1350;
      list.forEach(r => {
        const n = parseInt(String(r.numero || r.recibo).replace(/[^\d]/g, ''));
        if (!isNaN(n) && n > maxNum) maxNum = n;
      });
      return String(maxNum + 1);
    },

    salvar: async function(reciboData, fileBlob = null) {
      const list = getCachedRecibos();
      const id = reciboData.id || `rec_${Date.now()}`;
      const numero = String(reciboData.numero || reciboData.recibo || this.getNextNumero()).trim();

      const existingIdx = list.findIndex(r => r.id === id || String(r.numero) === numero);

      const novoRecibo = {
        id: id,
        numero: numero,
        recibo: numero,
        data: reciboData.data || new Date().toISOString().slice(0, 10),
        titular: reciboData.titular || 'Associado ARCA',
        socioId: reciboData.socioId || null,
        socioNumero: reciboData.socioNumero || null,
        finalidade: reciboData.finalidade || 'Liquidação Quotas',
        valor: parseFloat(reciboData.valor) || 6.00,
        metodo: reciboData.metodo || 'Numerário',
        notas: reciboData.notas || '',
        fileName: reciboData.fileName || (fileBlob ? fileBlob.name : (existingIdx >= 0 ? list[existingIdx].fileName : `Recibo_${numero}_ARCA.pdf`)),
        fileSize: reciboData.fileSize || (fileBlob ? `${(fileBlob.size / 1024).toFixed(0)} KB` : (existingIdx >= 0 ? list[existingIdx].fileSize : '—')),
        format: reciboData.format || (fileBlob ? (fileBlob.type.includes('image') ? 'image' : 'pdf') : (existingIdx >= 0 ? list[existingIdx].format : 'pdf')),
        temFicheiro: Boolean(fileBlob || (existingIdx >= 0 && list[existingIdx].temFicheiro)),
        fileBlob: fileBlob || (existingIdx >= 0 ? list[existingIdx].fileBlob : null),
        dataCriacao: (existingIdx >= 0 && list[existingIdx].dataCriacao) ? list[existingIdx].dataCriacao : new Date().toISOString().slice(0, 10)
      };

      if (existingIdx >= 0) {
        list[existingIdx] = novoRecibo;
      } else {
        list.unshift(novoRecibo);
      }

      await dbPut(novoRecibo);
      saveCachedRecibos(list);
      return novoRecibo;
    },

    remover: async function(id) {
      let list = getCachedRecibos();
      list = list.filter(r => r.id !== id && String(r.numero) !== String(id));
      await dbDelete(id);
      saveCachedRecibos(list);
      return true;
    },

    registarReciboDePagamento: async function(dados) {
      return await this.salvar({
        id: `rec_${dados.numero || Date.now()}`,
        numero: dados.numero,
        recibo: dados.numero,
        data: dados.data || new Date().toISOString().slice(0, 10),
        titular: dados.titular,
        socioId: dados.socioId,
        socioNumero: dados.socioNumero,
        finalidade: dados.finalidade || 'Liquidação Quotas',
        valor: dados.valor,
        metodo: dados.metodo,
        notas: dados.notas || 'Registo gerado no pagamento de quotas na ficha do associado.',
        fileName: `Recibo_${dados.numero}_Oficial.pdf`,
        fileSize: '750 KB',
        format: 'pdf',
        temFicheiro: false
      });
    },

    download: async function(reciboOrId) {
      let r = typeof reciboOrId === 'object' ? reciboOrId : await dbGetById(reciboOrId);
      if (!r) {
        const list = getCachedRecibos();
        r = list.find(item => item.id === reciboOrId || String(item.numero) === String(reciboOrId));
      }
      if (!r) {
        showToast('Recibo não encontrado para download.', 'error');
        return;
      }

      if (r.fileBlob) {
        const url = URL.createObjectURL(r.fileBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = r.fileName || `Recibo_${r.numero}_ARCA.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        showToast(`A descarregar recibo oficial "${r.fileName || r.numero}"...`, 'success');
      } else {
        const dataFmt = r.data ? new Date(r.data).toLocaleDateString('pt-PT') : new Date().toLocaleDateString('pt-PT');
        const content = 
`======================================================================
ASSOCIAÇÃO DE RECREIO, CULTURA E ASSISTÊNCIA DE AGUADA DE BAIXO (ARCA)
LIVRO OFICIAL DE RECIBOS & TESOURARIA
NIF: 501 234 567 | Aguada de Baixo, Águeda
======================================================================

RECIBO OFICIAL Nº: ${r.numero || r.recibo}
DATA DE EMISSÃO: ${dataFmt}

RECEBEMOS DE: ${r.titular}
${r.socioNumero ? `Nº DE ASSOCIADO: ${r.socioNumero}` : ''}
VALOR RECEBIDO: ${parseFloat(r.valor).toFixed(2).replace('.', ',')} € (${extenso(r.valor)})
FORMA DE LIQUIDAÇÃO: ${r.metodo}

CONCEITO / FINALIDADE:
${r.finalidade}

OBSERVAÇÕES / REGISTO:
${r.notas || 'Recibo legal devidamente registado nos livros oficiais de tesouraria da ARCA.'}

----------------------------------------------------------------------
A Direção da ARCA / Tesouraria Geral
Emitido e autenticado digitalmente pelo Portal de Gestão ARCA.
======================================================================`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Recibo_Oficial_${r.numero || r.recibo}_ARCA.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        showToast(`A descarregar comprovativo oficial do Recibo ${r.numero}...`, 'success');
      }
    }
  };

  function extenso(valor) {
    const v = parseFloat(valor) || 0;
    if (v === 6) return 'Seis Euros';
    if (v === 12) return 'Doze Euros';
    if (v === 18) return 'Dezoito Euros';
    if (v === 24) return 'Vinte e Quatro Euros';
    if (v === 350) return 'Trezentos e Cinquenta Euros';
    if (v === 250) return 'Duzentos e Cinquenta Euros';
    return `${v.toFixed(2).replace('.', ',')} Euros`;
  }
})();

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 2. Controlo da Barra Lateral Mobile (Sidebar & Backdrop Toggle)
  // =========================================================================
  const mobileToggle = document.getElementById('mobileSidebarToggle');
  const appSidebar = document.querySelector('.app-sidebar');

  // Criar elemento de Backdrop se não existir
  let sidebarBackdrop = document.querySelector('.sidebar-backdrop');
  if (!sidebarBackdrop) {
    sidebarBackdrop = document.createElement('div');
    sidebarBackdrop.className = 'sidebar-backdrop';
    document.body.appendChild(sidebarBackdrop);
  }

  function openSidebar() {
    if (appSidebar) appSidebar.classList.add('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    document.body.style.overflow = window.innerWidth <= 1024 ? 'hidden' : '';
  }

  function closeSidebar() {
    if (appSidebar) appSidebar.classList.remove('open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle && appSidebar) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (appSidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', closeSidebar);
    }

    // Botões de fechar dentro da sidebar
    const closeBtns = document.querySelectorAll('.sidebar-close-btn');
    closeBtns.forEach(btn => btn.addEventListener('click', closeSidebar));

    // Fechar ao navegar num link no mobile
    const navLinks = appSidebar.querySelectorAll('a.nav-item-link, a.nav-sublink');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          closeSidebar();
        }
      });
    });
  }

  // =========================================================================
  // 2.1. Alternância de Submenus Expansíveis na Sidebar
  // =========================================================================
  const submenuParents = document.querySelectorAll('.nav-item-parent');
  submenuParents.forEach(parent => {
    parent.addEventListener('click', (e) => {
      e.preventDefault();
      const sublist = parent.nextElementSibling;
      const isOpen = parent.classList.contains('open');

      if (isOpen) {
        parent.classList.remove('open');
        if (sublist) sublist.classList.remove('open');
      } else {
        parent.classList.add('open');
        if (sublist) sublist.classList.add('open');
      }
    });
  });

  // Garantir que os menus pais com submenus ativos permanecem abertos
  const activeSublink = document.querySelector('.nav-sublink.active');
  if (activeSublink) {
    const parentSublist = activeSublink.closest('.nav-sublist');
    if (parentSublist) {
      parentSublist.classList.add('open');
      const parentBtn = parentSublist.previousElementSibling;
      if (parentBtn && parentBtn.classList.contains('nav-item-parent')) {
        parentBtn.classList.add('open');
      }
    }
  }

  // =========================================================================
  // 2.2. Alternância de Submenus Aninhados (ex: Torneios, Época Futsal)
  // =========================================================================
  const nestedParents = document.querySelectorAll('.nav-nested-parent');
  nestedParents.forEach(nParent => {
    nParent.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const nList = nParent.nextElementSibling;
      const isOpen = nParent.classList.contains('open');

      if (isOpen) {
        nParent.classList.remove('open');
        if (nList) nList.classList.remove('open');
      } else {
        nParent.classList.add('open');
        if (nList) nList.classList.add('open');
      }
    });
  });

  // Garantir que sub-submenus ativos abrem todo o caminho hierárquico
  const activeNestedLink = document.querySelector('.nav-nested-link.active');
  if (activeNestedLink) {
    const parentNestedList = activeNestedLink.closest('.nav-nested-list');
    if (parentNestedList) {
      parentNestedList.classList.add('open');
      const parentNestedBtn = parentNestedList.previousElementSibling;
      if (parentNestedBtn && parentNestedBtn.classList.contains('nav-nested-parent')) {
        parentNestedBtn.classList.add('open');
      }
    }
    const parentSublist = activeNestedLink.closest('.nav-sublist');
    if (parentSublist) {
      parentSublist.classList.add('open');
      const parentBtn = parentSublist.previousElementSibling;
      if (parentBtn && parentBtn.classList.contains('nav-item-parent')) {
        parentBtn.classList.add('open');
      }
    }
  }

  // =========================================================================
  // 3. Sistema Central de Utilizadores, Credenciais e Autenticação ARCA
  // =========================================================================
  const ARCA_SESSION_KEY = 'arca_logged_user_v2';
  const ARCA_UTILIZADORES_KEY = 'arca_utilizadores_v2';

  const JORGE_AVATAR_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%231c6d42'/><stop offset='100%' stop-color='%230f3f26'/></linearGradient><linearGradient id='skin' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='%23fed7aa'/><stop offset='100%' stop-color='%23fdba74'/></linearGradient></defs><circle cx='50' cy='50' r='50' fill='url(%23bg)'/><circle cx='50' cy='40' r='20' fill='url(%23skin)'/><path d='M30 35c0-12 9-20 20-20s20 8 20 20c0 3-1 6-2 6s-4-4-9-4-7 4-11 4-6-3-8-6z' fill='%23334155'/><path d='M20 90c0-16.5 13.5-30 30-30s30 13.5 30 30' fill='%231e293b'/><path d='M42 60l8 12 8-12' fill='%23ffffff'/><polygon points='48,66 52,66 50,78' fill='%23dc2626'/></svg>";

  const SEED_UTILIZADORES = [
    {
      id: 1,
      nome: "Jorge Manuel da Silva Cunha",
      login: "jorge",
      username: "@jorge",
      email: "scunhajorge@gmail.com",
      telefone: "966 100 115",
      morada: "Rua Nova do Alto da Póvoa, 10 - Aguada de Baixo",
      numeroSocio: 314,
      perfil: "Administrador Total",
      estado: "Ativo",
      password: "jorge",
      data_registo: "2024-01-10",
      data_rgpd: "2024-01-10",
      ultimo_acesso: "Hoje",
      foto: JORGE_AVATAR_SVG,
      permissoes_modulos: {
        painel: { enabled: true, mode: "full", submenus: ["indicadores", "avisos"] },
        socios: { enabled: true, mode: "full", submenus: ["consultar", "editar", "pagamentos", "exportar"] },
        tesouraria: { enabled: true, mode: "full", submenus: ["caixa", "recibos", "fornecedores", "pos"] },
        direcao: { enabled: true, mode: "full", submenus: ["membros", "membros_gestao", "atas", "exercicio"] },
        desporto: { enabled: true, mode: "full", submenus: ["diretor", "delegado", "fisio", "seguros"] },
        documentos: { enabled: true, mode: "full", submenus: ["consultar", "upload", "eliminar"] },
        administracao: { enabled: true, mode: "full", submenus: ["utilizadores_ver", "utilizadores_gerir"] }
      }
    },
    {
      id: 2,
      nome: "Artur Jorge Ferreira Cardoso",
      login: "artur.cardoso",
      username: "@artur.cardoso",
      email: "alfamobile@gmail.com",
      telefone: "911 970 345",
      morada: "Rua Vale do Lobo, 11 - Landiosa, Aguada de Baixo",
      numeroSocio: 332,
      perfil: "Tesoureiro / Finanças",
      estado: "Ativo",
      password: "artur",
      data_registo: "2024-01-15",
      data_rgpd: "2024-01-15",
      ultimo_acesso: "Ontem, 18:22",
      foto: "",
      permissoes_modulos: {
        painel: { enabled: true, mode: "full", submenus: ["indicadores", "avisos"] },
        socios: { enabled: true, mode: "full", submenus: ["consultar", "editar", "pagamentos"] },
        tesouraria: { enabled: true, mode: "full", submenus: ["caixa", "recibos", "fornecedores", "pos"] },
        direcao: { enabled: true, mode: "view", submenus: ["membros", "atas"] },
        documentos: { enabled: true, mode: "full", submenus: ["consultar", "upload"] }
      }
    },
    {
      id: 3,
      nome: "José Manuel Carreira dos Reis",
      login: "jose.reis",
      username: "@jose.reis",
      email: "zreis93@gmail.com",
      telefone: "919 443 210",
      morada: "Aguada de Baixo",
      numeroSocio: 125,
      perfil: "Membro da Direção",
      estado: "Ativo",
      password: "jose",
      data_registo: "2024-01-20",
      data_rgpd: "2024-01-20",
      ultimo_acesso: "24/11/2026",
      foto: "",
      permissoes_modulos: {
        painel: { enabled: true, mode: "full", submenus: ["indicadores"] },
        socios: { enabled: true, mode: "view", submenus: ["consultar"] },
        direcao: { enabled: true, mode: "full", submenus: ["membros", "atas"] },
        documentos: { enabled: true, mode: "view", submenus: ["consultar"] }
      }
    },
    {
      id: 4,
      nome: "Luis Carlos Antunes dos Santos",
      login: "luis.santos",
      username: "@luis.santos",
      email: "luis.santos43@gmail.com",
      telefone: "914 882 190",
      morada: "Aguada de Baixo",
      numeroSocio: 210,
      perfil: "Membro da Direção",
      estado: "Ativo",
      password: "luis",
      data_registo: "2024-01-20",
      data_rgpd: "2024-01-20",
      ultimo_acesso: "23/11/2026",
      foto: "",
      permissoes_modulos: {
        painel: { enabled: true, mode: "full", submenus: ["indicadores"] },
        socios: { enabled: true, mode: "view", submenus: ["consultar"] },
        direcao: { enabled: true, mode: "full", submenus: ["membros", "atas"] }
      }
    },
    {
      id: 5,
      nome: "Raquel Alexandra Marques da Cunha",
      login: "raquel.cunha",
      username: "@raquel.cunha",
      email: "raquelamc22@gmail.com",
      telefone: "963 112 405",
      morada: "Aguada de Baixo",
      numeroSocio: 414,
      perfil: "Própria Ficha (Sócio)",
      estado: "Ativo",
      password: "raquel",
      data_registo: "2024-01-25",
      data_rgpd: "2024-01-25",
      ultimo_acesso: "25/11/2026",
      foto: "",
      permissoes_modulos: {
        socios: { enabled: true, mode: "own", submenus: ["consultar"] }
      }
    },
    {
      id: 6,
      nome: "Danilo Alexandre Estima Saraiva",
      login: "danilo.saraiva",
      username: "@danilo.saraiva",
      email: "d.alex.saraiva@gmail.com",
      telefone: "917 220 541",
      morada: "Landiosa, Aguada de Baixo",
      numeroSocio: 189,
      perfil: "Gestão Desportiva",
      estado: "Ativo",
      password: "danilo",
      data_registo: "2024-02-01",
      data_rgpd: "2024-02-01",
      ultimo_acesso: "21/11/2026",
      foto: "",
      permissoes_modulos: {
        painel: { enabled: true, mode: "full", submenus: ["indicadores"] },
        desporto: { enabled: true, mode: "full", submenus: ["diretor", "delegado", "fisio"] }
      }
    },
    {
      id: 7,
      nome: "Mário Rui Ferreira",
      login: "mario.ferreira",
      username: "@mario.ferreira",
      email: "mario.rui.f@sapo.pt",
      telefone: "916 443 890",
      morada: "Aguadela, Aguada de Baixo",
      numeroSocio: 389,
      perfil: "Gestão Desportiva",
      estado: "Pendente",
      password: "mario",
      data_registo: "2026-11-25",
      data_rgpd: "2026-11-25",
      ultimo_acesso: "Nunca",
      foto: "",
      permissoes_modulos: {
        painel: { enabled: true, mode: "view", submenus: ["indicadores"] },
        desporto: { enabled: true, mode: "full", submenus: ["delegado", "seguros"] }
      }
    },
    {
      id: 8,
      nome: "Carla Sofia Santos",
      login: "carla.santos",
      username: "@carla.santos",
      email: "carla.santos.arca@gmail.com",
      telefone: "934 551 229",
      morada: "Póvoa, Aguada de Baixo",
      numeroSocio: null,
      perfil: "Utilizador Geral",
      estado: "Pendente",
      password: "carla",
      data_registo: "2026-11-26",
      data_rgpd: "2026-11-26",
      ultimo_acesso: "Nunca",
      foto: "",
      permissoes_modulos: {
        painel: { enabled: true, mode: "view", submenus: ["indicadores"] },
        documentos: { enabled: true, mode: "view", submenus: ["consultar"] }
      }
    },
    {
      id: 9,
      nome: "Pedro Miguel Tavares",
      login: "pedro.tavares",
      username: "@pedro.tavares",
      email: "ptavares_88@hotmail.com",
      telefone: "965 210 987",
      morada: "Cruzeiro, Aguada de Baixo",
      numeroSocio: 115,
      perfil: "Sócio Associado",
      estado: "Suspenso",
      motivo_suspensao: "Averiguação de acessos irregulares e incumprimento do regulamento interno.",
      password: "pedro",
      data_registo: "2024-03-12",
      data_rgpd: "2024-03-12",
      ultimo_acesso: "15/10/2026",
      foto: "",
      permissoes_modulos: {
        painel: { enabled: true, mode: "view", submenus: ["indicadores"] }
      }
    },
    {
      id: 10,
      nome: "Rui Manuel Pinho",
      login: "rui.pinho",
      username: "@rui.pinho",
      email: "rui_pinho_arca@gmail.com",
      telefone: "918 332 109",
      morada: "Aguada de Baixo",
      numeroSocio: 67,
      perfil: "Utilizador Geral",
      estado: "Anulado",
      motivo_suspensao: "Conta anulada a pedido do próprio associado.",
      password: "rui",
      data_registo: "2024-02-14",
      data_rgpd: "2024-02-14",
      ultimo_acesso: "01/08/2026",
      foto: "",
      permissoes_modulos: {}
    },
    {
      id: 11,
      nome: "Raqueli",
      login: "raqueli",
      username: "@raqueli",
      email: "raqueli@arca.pt",
      telefone: "912 000 000",
      morada: "Aguada de Baixo",
      numeroSocio: 2,
      perfil: "Sócio Consulta",
      estado: "Ativo",
      password: "raqueli",
      data_registo: "2026-11-26",
      data_rgpd: "2026-11-26",
      ultimo_acesso: "Hoje",
      foto: "",
      permissoes_modulos: {
        socios: { enabled: true, mode: "own", submenus: ["consultar"] }
      }
    }
  ];

  window.getArcaUtilizadores = function() {
    try {
      const saved = localStorage.getItem(ARCA_UTILIZADORES_KEY);
      if (saved) {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filtrar utilizadores eliminados permanentemente
          let deletedIds = [];
          try {
            deletedIds = JSON.parse(localStorage.getItem('arca_deleted_user_ids') || '[]');
          } catch (e) {}
          if (deletedIds.length > 0) {
            parsed = parsed.filter(p => !deletedIds.includes(Number(p.id)));
          }

          // Garantir SEMPRE a presença do Administrador Total Jorge (ID: 1) para proteção contra lockout
          const adminIdx = parsed.findIndex(p => (p.login && p.login.toLowerCase() === 'jorge') || Number(p.id) === 1);
          if (adminIdx === -1) {
            const adminSeed = SEED_UTILIZADORES.find(u => u.login === 'jorge');
            if (adminSeed) parsed.unshift(adminSeed);
          }

          // Garantir número de sócio correto para Raquel Alexandra Marques da Cunha (Sócia nº 414)
          const raquelIdx = parsed.findIndex(p => p.login === 'raquel.cunha');
          if (raquelIdx !== -1 && (!parsed[raquelIdx].numeroSocio || parsed[raquelIdx].numeroSocio === 305)) {
            parsed[raquelIdx].numeroSocio = 414;
          }

          localStorage.setItem(ARCA_UTILIZADORES_KEY, JSON.stringify(parsed));
          return parsed;
        }
      }
    } catch (e) {}

    // Fallback inicial se não houver dados em localStorage
    let deletedIds = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem('arca_deleted_user_ids') || '[]');
    } catch (e) {}
    const initialList = SEED_UTILIZADORES.filter(u => !deletedIds.includes(Number(u.id)));
    localStorage.setItem(ARCA_UTILIZADORES_KEY, JSON.stringify(initialList));
    return initialList;
  };

  // Função Central de Validação Estrita de Login
  window.validarCredenciaisArca = function(identificador, senha) {
    let list = window.getArcaUtilizadores();
    const cleanId = (identificador || '').trim().toLowerCase();
    const cleanPass = (senha || '').trim();

    if (!cleanId || !cleanPass) {
      return { ok: false, msg: 'Por favor, indique o utilizador e a palavra-passe.' };
    }

    let found = list.find(u => 
      (u.login && u.login.toLowerCase() === cleanId) ||
      (u.username && u.username.replace('@','').toLowerCase() === cleanId) ||
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.nome && u.nome.toLowerCase() === cleanId)
    );

    // Salvaguarda imediata para Administrador Total Jorge:
    if (!found && (cleanId === 'jorge' || cleanId === 'scunhajorge@gmail.com' || cleanId === '@jorge')) {
      found = SEED_UTILIZADORES.find(u => u.login === 'jorge');
      if (found) {
        list.unshift(found);
        localStorage.setItem(ARCA_UTILIZADORES_KEY, JSON.stringify(list));
        if (typeof window.saveArcaUtilizadorToCloud === 'function') {
          window.saveArcaUtilizadorToCloud(found);
        }
      }
    }

    if (!found) {
      return { 
        ok: false, 
        msg: '<strong>Acesso Não Autorizado:</strong> Utilizador não encontrado. Verifique as suas credenciais ou solicite a criação de conta no botão abaixo.' 
      };
    }

    // 1. Verificação do Estado da Conta (Pendente, Suspenso, Anulado)
    if (found.estado === 'Pendente') {
      return { 
        ok: false, 
        msg: '<strong>Conta Pendente de Validação:</strong> O seu pedido de registo aguarda validação e aprovação pela Direção da A.R.C.A. Assim que for validado, poderá entrar.' 
      };
    }

    if (found.estado === 'Suspenso') {
      const motivo = found.motivo_suspensao ? `<br><small style="margin-top:4px;display:block;"><strong>Motivo:</strong> ${found.motivo_suspensao}</small>` : '';
      return { 
        ok: false, 
        msg: `<strong>Acesso Suspenso:</strong> A sua conta encontra-se temporariamente suspensa pela Direção.${motivo}<br><small style="margin-top:2px;display:block;">Contacto: arca.aguadadebaixo@sapo.pt</small>` 
      };
    }

    if (found.estado === 'Anulado') {
      return { 
        ok: false, 
        msg: '<strong>Conta Anulada:</strong> Esta conta de acesso foi revogada pela Direção. Caso pretenda reativar o acesso, submeta um novo pedido de registo.' 
      };
    }

    // 2. Validação da Palavra-Passe
    // Aceita a password configurada na conta, ou como salvaguarda inicial 'arca2026', '123456', ou o próprio login
    const matchPassword = found.password 
      ? (found.password === cleanPass || cleanPass === 'arca2026' || cleanPass === '123456' || cleanPass === found.login)
      : (cleanPass === 'arca2026' || cleanPass === '123456' || cleanPass === found.login);

    if (!matchPassword) {
      return { 
        ok: false, 
        msg: '<strong>Palavra-passe incorreta:</strong> A palavra-passe indicada não está certa. Tente novamente.' 
      };
    }

    // Conta Ativa e Autorizada
    return { ok: true, user: found };
  };

  // Formulário de Login Principal (index.html)
  const loginForm = document.getElementById('arcaLoginForm');
  const loginAlert = document.getElementById('loginAlert');
  const loginBtn = document.getElementById('loginBtn');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');

      const user = usernameInput ? usernameInput.value : '';
      const pass = passwordInput ? passwordInput.value : '';

      const res = window.validarCredenciaisArca(user, pass);

      if (!res.ok) {
        if (loginAlert) {
          loginAlert.innerHTML = res.msg;
          loginAlert.className = 'alert-message alert-error';
          loginAlert.style.display = 'block';
        }
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.innerHTML = '<span>Entrar &rarr;</span>';
        }
        return;
      }

      // Sucesso! Gravar sessão
      window.setArcaCurrentUser(res.user);

      if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span>A validar acesso...</span>';
      }

      // Redirecionamento inteligente conforme permissões
      const perms = res.user.permissoes_modulos || {};
      const isAdmin = (res.user.perfil === 'Administrador Total' || res.user.login === 'jorge');
      let targetUrl = 'painel.html?v=20261126_v9';

      if (!isAdmin) {
        if (!perms.painel?.enabled) {
          if (perms.socios?.enabled) targetUrl = 'socios.html?v=20261126_v9';
          else if (perms.tesouraria?.enabled) targetUrl = 'tesouraria.html?v=20261126_v9';
          else if (perms.desporto?.enabled) targetUrl = 'desporto.html?v=20261126_v9';
          else if (perms.documentos?.enabled) targetUrl = 'documentos.html?v=20261126_v9';
          else if (perms.direcao?.enabled) targetUrl = 'atas.html?v=20261126_v9';
          else if (perms.administracao?.enabled) targetUrl = 'utilizadores.html?v=20261126_v9';
        }
      }

      if (loginAlert) {
        loginAlert.textContent = `Acesso autorizado! Bem-vindo(a), ${res.user.nome.split(' ')[0]}. A entrar...`;
        loginAlert.className = 'alert-message alert-success';
        loginAlert.style.display = 'block';
      }

      setTimeout(() => {
        window.location.href = targetUrl;
      }, 700);
    });
  }

  // Hook para login.html alternativo
  const standardLoginForm = document.getElementById('loginForm');
  if (standardLoginForm) {
    standardLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('email');
      const passInput = document.getElementById('password');
      const alertBox = document.getElementById('alertBox');

      const user = emailInput ? emailInput.value : '';
      const pass = passInput ? passInput.value : '';

      const res = window.validarCredenciaisArca(user, pass);

      if (!res.ok) {
        if (alertBox) {
          alertBox.innerHTML = res.msg;
          alertBox.className = 'alert alert-danger';
          alertBox.style.display = 'block';
        }
        return;
      }

      window.setArcaCurrentUser(res.user);

      const perms = res.user.permissoes_modulos || {};
      const isAdmin = (res.user.perfil === 'Administrador Total' || res.user.login === 'jorge');
      let targetUrl = 'painel.html?v=20261126_v9';

      if (!isAdmin && !perms.painel?.enabled) {
        if (perms.socios?.enabled) targetUrl = 'socios.html?v=20261126_v9';
        else if (perms.tesouraria?.enabled) targetUrl = 'tesouraria.html?v=20261126_v9';
        else if (perms.desporto?.enabled) targetUrl = 'desporto.html?v=20261126_v9';
        else if (perms.documentos?.enabled) targetUrl = 'documentos.html?v=20261126_v9';
        else if (perms.direcao?.enabled) targetUrl = 'atas.html?v=20261126_v9';
        else if (perms.administracao?.enabled) targetUrl = 'utilizadores.html?v=20261126_v9';
      }

      if (alertBox) {
        alertBox.textContent = `Acesso autorizado! Bem-vindo(a), ${res.user.nome.split(' ')[0]}.`;
        alertBox.className = 'alert alert-success';
        alertBox.style.display = 'block';
      }
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 600);
    });
  }

  // =========================================================================
  // 3.1. Gestão Central de Sessão do Utilizador & Perfil
  // =========================================================================
  window.getArcaCurrentUser = function() {
    try {
      const saved = localStorage.getItem(ARCA_SESSION_KEY);
      if (saved) {
        const u = JSON.parse(saved);
        // Sincronizar com os dados mais recentes do utilizador na lista
        const allUsers = (typeof window.getArcaUtilizadores === 'function') ? window.getArcaUtilizadores() : [];
        const fresh = allUsers.find(x => x.id === u.id || (x.login && x.login.toLowerCase() === (u.login || '').toLowerCase()));
        if (fresh) {
          if (fresh.numeroSocio !== undefined) u.numeroSocio = fresh.numeroSocio;
          if (fresh.permissoes_modulos) u.permissoes_modulos = fresh.permissoes_modulos;
          if (fresh.perfil) u.perfil = fresh.perfil;
          if (fresh.estado) u.estado = fresh.estado;
          localStorage.setItem(ARCA_SESSION_KEY, JSON.stringify(u));
        }
        if ((u.login === 'raquel.cunha' || (u.nome && u.nome.toLowerCase().includes('raquel alexandra'))) && (!u.numeroSocio || u.numeroSocio === 305)) {
          u.numeroSocio = 414;
          localStorage.setItem(ARCA_SESSION_KEY, JSON.stringify(u));
        }
        if (u.foto && (u.foto.includes('gestao.arca-aguadadebaixo.pt/api/users') || u.foto.includes('xmlns="http://www.w3.org/2000/svg"') || (u.id === 1 && !u.foto.startsWith('data:image/')))) {
          u.foto = JORGE_AVATAR_SVG;
          localStorage.setItem(ARCA_SESSION_KEY, JSON.stringify(u));
        }
        return u;
      }
    } catch (e) {}
    return null;
  };

  window.setArcaCurrentUser = function(user) {
    if (user) {
      localStorage.setItem(ARCA_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ARCA_SESSION_KEY);
    }
    window.updateSidebarUserProfile();
    window.applyArcaPermissions(user);
    window.dispatchEvent(new CustomEvent('arca-user-updated', { detail: user }));
  };

  // Auth Guard Global: Protege páginas restritas e valida permissões de módulo
  (function initArcaAuthGuard() {
    const rawPath = window.location.pathname.toLowerCase().replace(/\/$/, '');
    const segments = rawPath.split('/').filter(Boolean);
    const pageName = segments.length ? segments[segments.length - 1] : '';

    const publicPages = ['', 'index', 'index.html', 'login', 'login.html', 'registo', 'registo.html'];
    const isPublic = publicPages.includes(pageName);

    if (!isPublic) {
      const currentUser = window.getArcaCurrentUser();
      if (!currentUser || currentUser.estado !== 'Ativo') {
        window.location.replace('/');
        return;
      }

      // Validação Estrita de Permissões de Módulo
      const isAdmin = (currentUser.perfil === 'Administrador Total' || currentUser.login === 'jorge');
      if (!isAdmin) {
        const perms = currentUser.permissoes_modulos || {};
        let isAllowed = true;
        let blockedModule = '';

        if (pageName.includes('tesouraria') && !perms.tesouraria?.enabled) {
          isAllowed = false;
          blockedModule = 'Tesouraria';
        } else if ((pageName.includes('membros') || pageName.includes('atas')) && !perms.direcao?.enabled) {
          isAllowed = false;
          blockedModule = 'Direção';
        } else if (pageName.includes('utilizadores') && !perms.administracao?.enabled) {
          isAllowed = false;
          blockedModule = 'Utilizadores';
        } else if (pageName.includes('desporto') && !perms.desporto?.enabled) {
          isAllowed = false;
          blockedModule = 'Gestão Desportiva';
        } else if (pageName.includes('documentos') && !perms.documentos?.enabled) {
          isAllowed = false;
          blockedModule = 'Documentos';
        } else if (pageName.includes('socios') && !perms.socios?.enabled) {
          isAllowed = false;
          blockedModule = 'Sócios & Cotas';
        } else if (pageName.includes('painel') && !perms.painel?.enabled) {
          isAllowed = false;
          blockedModule = 'Visão Geral';
        }

        if (!isAllowed) {
          let dest = null;
          if (perms.socios?.enabled) dest = 'socios.html';
          else if (perms.painel?.enabled) dest = 'painel.html';
          else if (perms.tesouraria?.enabled) dest = 'tesouraria.html';
          else if (perms.desporto?.enabled) dest = 'desporto.html';
          else if (perms.documentos?.enabled) dest = 'documentos.html';
          else if (perms.direcao?.enabled) dest = 'atas.html';
          else if (perms.administracao?.enabled) dest = 'utilizadores.html';

          if (!dest) {
            // Conta sem qualquer módulo permitido ativo
            alert('A sua conta não tem permissões ativas para aceder aos módulos da plataforma. Contacte a Direção da A.R.C.A.');
            window.location.replace('/');
            return;
          }

          const cleanDest = dest.replace(/\.html$/, '').toLowerCase();
          const cleanCurrent = pageName.replace(/\.html$/, '').toLowerCase();
          if (cleanDest === cleanCurrent) {
            // Já se encontra na página de destino, não re-redirecionar para evitar loop infinito
            return;
          }

          window.location.replace(dest);
          return;
        }
      }
    }
  })();

  // Aplicar Filtros de Permissão na Barra Lateral e Interface
  window.applyArcaPermissions = function(user) {
    if (!user) user = window.getArcaCurrentUser();
    if (!user) return;

    const isAdmin = (user.perfil === 'Administrador Total' || user.login === 'jorge');
    if (isAdmin) return; // Administrador Total vê tudo

    const perms = user.permissoes_modulos || {};

    const hideSidebarSection = (selector) => {
      document.querySelectorAll(selector).forEach(link => {
        const item = link.closest('.sidebar-nav > div') || link.closest('ul.nav-list > li') || link.closest('li') || link.closest('div');
        if (item) item.style.display = 'none';
      });
    };

    // 1. Visão Geral (painel.html)
    if (!perms.painel?.enabled) {
      hideSidebarSection('.app-sidebar a[href*="painel"], .sidebar-nav a[href*="painel"]');
    }

    // 2. Sócios & Cotas (socios.html)
    if (!perms.socios?.enabled) {
      hideSidebarSection('.app-sidebar a[href*="socios"], .sidebar-nav a[href*="socios"]');
    }

    // 3. Tesouraria (tesouraria.html)
    if (!perms.tesouraria?.enabled) {
      hideSidebarSection('.app-sidebar a[href*="tesouraria"], .sidebar-nav a[href*="tesouraria"]');
    }

    // 4. Direção (atas.html, membros.html)
    if (!perms.direcao?.enabled) {
      hideSidebarSection('.app-sidebar a[href*="atas"], .app-sidebar a[href*="membros"], .sidebar-nav a[href*="atas"], .sidebar-nav a[href*="membros"]');
    }

    // 5. Gestão Desportiva (desporto.html)
    if (!perms.desporto?.enabled) {
      hideSidebarSection('.app-sidebar a[href*="desporto"], .sidebar-nav a[href*="desporto"]');
    }

    // 6. Documentação ARCA (documentos.html)
    if (!perms.documentos?.enabled) {
      hideSidebarSection('.app-sidebar a[href*="documentos"], .sidebar-nav a[href*="documentos"]');
    }

    // 7. Gestão / Calendário / Eventos (calendario.html, eventos.html)
    if (!perms.painel?.enabled && !perms.desporto?.enabled) {
      hideSidebarSection('.app-sidebar a[href*="calendario"], .app-sidebar a[href*="eventos"], .sidebar-nav a[href*="calendario"], .sidebar-nav a[href*="eventos"]');
    }

    // 8. Secções & Grupos (seccoes.html)
    if (!perms.desporto?.enabled && !perms.painel?.enabled) {
      hideSidebarSection('.app-sidebar a[href*="seccoes"], .sidebar-nav a[href*="seccoes"]');
    }

    // 9. Painel de Controlo / Utilizadores (utilizadores.html)
    if (!perms.administracao?.enabled) {
      hideSidebarSection('.app-sidebar a[href*="utilizadores"], .sidebar-nav a[href*="utilizadores"]');
    }

    // 10. Bloqueio de Edição em Sócios se o modo for apenas Consulta (view)
    const rawPath = window.location.pathname.toLowerCase();
    if (rawPath.includes('socios')) {
      const sociosPerm = perms.socios || {};
      const isViewOnly = sociosPerm.mode === 'view' || !(sociosPerm.submenus || []).includes('editar');

      if (isViewOnly) {
        const btnCriarSocio = document.getElementById('btnOpenNewSocioModal');
        if (btnCriarSocio) btnCriarSocio.style.display = 'none';

        const styleBlock = document.createElement('style');
        styleBlock.textContent = `
          .btn-action-edit, .btn-action-delete, .btn-action-pay, [data-action="edit"], [data-action="delete"] {
            display: none !important;
          }
        `;
        document.head.appendChild(styleBlock);
      }
    }
  };

  // Terminar Sessão (Logout) global
  document.addEventListener('click', (e) => {
    const logoutBtn = e.target.closest('.btn-sidebar-logout');
    if (logoutBtn) {
      e.preventDefault();
      localStorage.removeItem(ARCA_SESSION_KEY);
      window.location.href = 'index.html';
    }
  });

  window.updateSidebarUserProfile = function() {
    const user = window.getArcaCurrentUser();
    if (!user) return;

    window.applyArcaPermissions(user);

    const headerName = document.getElementById('painelHeaderUserName');
    if (headerName && user.nome) {
      headerName.textContent = user.nome;
    }
    document.querySelectorAll('.sidebar-footer').forEach(footer => {
      const avatarEl = footer.querySelector('.user-avatar');
      const nameEl = footer.querySelector('.user-name');
      const roleEl = footer.querySelector('.user-role');

      if (avatarEl) {
        avatarEl.title = `Sessão iniciada como ${user.nome} • Clique para alterar o seu perfil e fotografia`;
        avatarEl.style.cursor = 'pointer';
        avatarEl.onclick = () => window.openMeuPerfilModal();
        avatarEl.innerHTML = '';
        if (user.foto) {
          const img = document.createElement('img');
          img.className = 'user-avatar-img';
          img.alt = user.nome || '';
          img.src = user.foto;
          const fallback = document.createElement('div');
          fallback.className = 'user-avatar-img';
          fallback.style.cssText = 'display:none;align-items:center;justify-content:center;background:var(--primary);color:#fff;font-size:1.15rem;';
          fallback.textContent = '👤';
          img.onerror = function() {
            img.style.display = 'none';
            fallback.style.display = 'flex';
          };
          avatarEl.appendChild(img);
          avatarEl.appendChild(fallback);
        } else {
          avatarEl.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:1.15rem;background:var(--primary);color:#fff;">👤</div>`;
        }
      }

      if (nameEl) {
        nameEl.textContent = user.nome;
        nameEl.style.cursor = 'pointer';
        nameEl.onclick = () => window.openMeuPerfilModal();
      }

      if (roleEl) {
        roleEl.textContent = user.cargo || user.orgao || 'Membro Oficial';
      }

      // Adicionar botão de editar perfil se não existir
      if (!footer.querySelector('.btn-sidebar-profile')) {
        const logoutBtn = footer.querySelector('.btn-sidebar-logout');
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'btn-sidebar-profile';
        editBtn.title = 'Editar o meu perfil e fotografia';
        editBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        `;
        editBtn.onclick = () => window.openMeuPerfilModal();
        if (logoutBtn) {
          footer.insertBefore(editBtn, logoutBtn);
        } else {
          footer.appendChild(editBtn);
        }
      }
    });
  };

  // Injeção Dinâmica do Modal de Perfil Global (disponível em todas as páginas)
  function ensurePerfilModalInjected() {
    if (document.getElementById('modalMeuPerfilGlobal')) return;

    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal-overlay';
    modalDiv.id = 'modalMeuPerfilGlobal';
    modalDiv.onclick = function(e) { if (e.target === this) window.closeMeuPerfilModal(); };
    modalDiv.innerHTML = `
      <div class="modal-content" style="max-width: 580px; max-height: 92vh; display: flex; flex-direction: column;">
        <div class="modal-header">
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--text-title); margin: 0;">👤 Os Meus Dados & Fotografia de Perfil</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.2rem 0 0 0;">
              Altere as suas informações pessoais e a fotografia de conta (suporte a arrastar foto).
            </p>
          </div>
          <button class="modal-close" onclick="closeMeuPerfilModal()">&times;</button>
        </div>

        <form id="formMeuPerfilGlobal" onsubmit="window.salvarMeuPerfil(event)" style="display: flex; flex-direction: column; overflow: hidden; flex: 1;">
          <div class="modal-body" style="padding: 1.25rem 1.5rem; overflow-y: auto;">

            <!-- Zona de Upload Drag-and-Drop de Avatar -->
            <div class="avatar-upload-zone" id="globalPerfilAvatarDropZone">
              <div class="avatar-preview-wrapper" onclick="document.getElementById('inputGlobalPerfilFoto').click()" title="Clique para escolher ficheiro ou arraste uma foto para aqui">
                <img id="globalPerfilFotoPreview" src="" class="avatar-preview-img" style="display: none;" alt="" onerror="this.style.display='none'; document.getElementById('globalPerfilFotoPlaceholder').style.display='flex';">
                <div id="globalPerfilFotoPlaceholder" class="avatar-placeholder-large">👤</div>
                <div class="avatar-edit-badge" title="Alterar fotografia">📷</div>
              </div>
              <div class="avatar-upload-info" style="flex: 1;">
                <strong style="color: var(--text-title); font-size: 0.95rem;">Fotografia de Conta</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.2rem 0 0.5rem 0;">
                  <strong>Arraste uma foto para aqui</strong> ou clique para carregar do seu dispositivo (PNG, JPG, WebP).
                </p>
                <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                  <button type="button" class="btn btn-outline btn-xs" onclick="document.getElementById('inputGlobalPerfilFoto').click()">
                    📁 Escolher Ficheiro
                  </button>
                  <button type="button" class="btn btn-outline btn-xs" id="btnRemoverFotoGlobalPerfil" onclick="window.removerFotoGlobalPerfil()" style="color: #dc2626; display: none;">
                    🗑️ Remover Foto
                  </button>
                </div>
                <input type="file" id="inputGlobalPerfilFoto" accept="image/*" style="display: none;" onchange="window.handleGlobalPerfilFotoSelect(event)">
                <input type="hidden" id="inputGlobalPerfilFotoData">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 0.75rem;">
              <div class="form-group" style="grid-column: 1 / -1;">
                <label class="form-label" for="globalPerfilNome">Nome Completo *</label>
                <input type="text" id="globalPerfilNome" class="form-control" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="globalPerfilLogin">Utilizador / Login</label>
                <input type="text" id="globalPerfilLogin" class="form-control" readonly style="background: #f8fafc; cursor: not-allowed; color: var(--text-muted);">
              </div>
              <div class="form-group">
                <label class="form-label" for="globalPerfilCargo">Cargo Institucional</label>
                <input type="text" id="globalPerfilCargo" class="form-control" readonly style="background: #f8fafc; cursor: not-allowed; color: var(--text-muted);">
              </div>
              <div class="form-group">
                <label class="form-label" for="globalPerfilEmail">Correio Eletrónico</label>
                <input type="email" id="globalPerfilEmail" class="form-control" placeholder="exemplo@arca.pt">
              </div>
              <div class="form-group">
                <label class="form-label" for="globalPerfilTelefone">Contacto Telefónico</label>
                <input type="tel" id="globalPerfilTelefone" class="form-control" placeholder="9xx xxx xxx">
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label class="form-label" for="globalPerfilMorada">Morada Oficial / Residência</label>
                <input type="text" id="globalPerfilMorada" class="form-control" placeholder="Aguada de Baixo">
              </div>
              <div class="form-group" style="grid-column: 1 / -1;">
                <label class="form-label" for="globalPerfilPassword">Nova Palavra-passe (opcional)</label>
                <input type="password" id="globalPerfilPassword" class="form-control" placeholder="Deixe em branco para manter a atual">
              </div>
            </div>

            <!-- Troca rápida de utilizador para testes -->
            <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 0.75rem 1rem; margin-top: 0.5rem;">
              <label class="form-label" for="selectTrocarUtilizadorSessao" style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 0.35rem; margin-bottom: 0.35rem;">
                <span>🔄</span> Mudar Utilizador em Sessão (Para Testar Outros Membros):
              </label>
              <select id="selectTrocarUtilizadorSessao" class="form-control" style="font-size: 0.85rem; padding: 0.35rem 0.6rem;" onchange="window.trocarUtilizadorSessao(this.value)">
                <!-- Preenchido dinamicamente -->
              </select>
            </div>

          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-top: 1px solid var(--border-light); background: #ffffff;">
            <button type="button" class="btn btn-outline" onclick="window.closeMeuPerfilModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary" style="font-weight: 700;">
              💾 Gravar os Meus Dados
            </button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modalDiv);

    // Inicializar listeners Drag-and-Drop na zona de upload
    const dropZone = document.getElementById('globalPerfilAvatarDropZone');
    if (dropZone) {
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });
      dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
      });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          const file = e.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (re) => {
              window.setGlobalPerfilFoto(re.target.result);
            };
            reader.readAsDataURL(file);
          } else {
            window.showToast('Por favor, arraste um ficheiro de imagem válido (PNG, JPG, WebP).', 'error');
          }
        }
      });
    }
  }

  window.openMeuPerfilModal = function() {
    ensurePerfilModalInjected();
    const user = window.getArcaCurrentUser();
    const modal = document.getElementById('modalMeuPerfilGlobal');
    if (!modal) return;

    document.getElementById('globalPerfilNome').value = user.nome || '';
    document.getElementById('globalPerfilLogin').value = user.username || `@${user.login}`;
    document.getElementById('globalPerfilCargo').value = `${user.cargo || ''} (${user.orgao || 'ARCA'})`;
    document.getElementById('globalPerfilEmail').value = user.email || '';
    document.getElementById('globalPerfilTelefone').value = user.telefone || '';
    document.getElementById('globalPerfilMorada').value = user.morada || '';
    document.getElementById('globalPerfilPassword').value = '';

    window.setGlobalPerfilFoto(user.foto || '');

    // Preencher o seletor de troca de utilizador
    const select = document.getElementById('selectTrocarUtilizadorSessao');
    if (select) {
      let membrosLista = [];
      try {
        membrosLista = JSON.parse(localStorage.getItem('arca_membros_orgaos_v4')) || [];
      } catch (e) {}

      if (membrosLista.length === 0 && window.OFFICIAL_MEMBROS) {
        membrosLista = window.OFFICIAL_MEMBROS;
      }

      select.innerHTML = membrosLista.map(m => {
        const isSelected = (m.id === user.id || m.login === user.login || m.nome === user.nome);
        return `<option value="${m.id}" ${isSelected ? 'selected' : ''}>${m.nome} — ${m.cargo} (${m.orgao})</option>`;
      }).join('');
    }

    modal.classList.add('active');
  };

  window.closeMeuPerfilModal = function() {
    const modal = document.getElementById('modalMeuPerfilGlobal');
    if (modal) modal.classList.remove('active');
  };

  window.setGlobalPerfilFoto = function(dataUrl) {
    const preview = document.getElementById('globalPerfilFotoPreview');
    const placeholder = document.getElementById('globalPerfilFotoPlaceholder');
    const hiddenData = document.getElementById('inputGlobalPerfilFotoData');
    const btnRemover = document.getElementById('btnRemoverFotoGlobalPerfil');

    if (hiddenData) hiddenData.value = dataUrl || '';

    if (dataUrl) {
      if (preview) {
        preview.src = dataUrl;
        preview.style.display = 'block';
      }
      if (placeholder) placeholder.style.display = 'none';
      if (btnRemover) btnRemover.style.display = 'inline-flex';
    } else {
      if (preview) {
        preview.src = '';
        preview.style.display = 'none';
      }
      if (placeholder) placeholder.style.display = 'flex';
      if (btnRemover) btnRemover.style.display = 'none';
    }
  };

  window.removerFotoGlobalPerfil = function() {
    window.setGlobalPerfilFoto('');
    const fileInput = document.getElementById('inputGlobalPerfilFoto');
    if (fileInput) fileInput.value = '';
  };

  window.handleGlobalPerfilFotoSelect = function(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (re) => {
        window.setGlobalPerfilFoto(re.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  window.salvarMeuPerfil = function(e) {
    e.preventDefault();
    const user = window.getArcaCurrentUser();

    const novoNome = document.getElementById('globalPerfilNome').value.trim();
    const novoEmail = document.getElementById('globalPerfilEmail').value.trim();
    const novoTelefone = document.getElementById('globalPerfilTelefone').value.trim();
    const novaMorada = document.getElementById('globalPerfilMorada').value.trim();
    const novaFoto = document.getElementById('inputGlobalPerfilFotoData').value;

    user.nome = novoNome;
    user.email = novoEmail;
    user.telefone = novoTelefone;
    user.morada = novaMorada;
    user.foto = novaFoto;

    // Atualizar no storage da sessão
    window.setArcaCurrentUser(user);

    // Sincronizar também na base de dados de membros se este utilizador existir lá
    try {
      const membrosKey = 'arca_membros_orgaos_v4';
      let membros = JSON.parse(localStorage.getItem(membrosKey)) || [];
      const mIdx = membros.findIndex(m => m.id === user.id || m.login === user.login || m.nome === user.nome);
      if (mIdx >= 0) {
        membros[mIdx].nome = novoNome;
        membros[mIdx].email = novoEmail;
        membros[mIdx].telefone = novoTelefone;
        membros[mIdx].morada = novaMorada;
        membros[mIdx].foto = novaFoto;
        localStorage.setItem(membrosKey, JSON.stringify(membros));
        if (typeof window.renderMembros === 'function') {
          window.renderMembros();
        }
      }
    } catch (err) {}

    window.closeMeuPerfilModal();
    window.showToast('Os seus dados e fotografia de perfil foram atualizados com sucesso!', 'success');
  };

  window.trocarUtilizadorSessao = function(membroId) {
    membroId = parseInt(membroId);
    let membros = [];
    try {
      membros = JSON.parse(localStorage.getItem('arca_membros_orgaos_v4')) || [];
    } catch (e) {}

    const m = membros.find(item => item.id === membroId);
    if (!m) return;

    const newUser = {
      id: m.id,
      login: m.username ? m.username.replace('@', '') : m.nome.toLowerCase().replace(/[^a-z0-9]/g, ''),
      username: m.username || `@${m.nome.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      nome: m.nome,
      cargo: m.cargo,
      orgao: m.orgao,
      email: m.email || '',
      telefone: m.telefone || '',
      morada: m.morada || '',
      perfil: m.perfil || 'Utilizador',
      numeroSocio: m.numeroSocio || null,
      foto: m.foto || '',
      estado: m.estado || 'Ativo'
    };

    window.setArcaCurrentUser(newUser);
    window.openMeuPerfilModal(); // Reabre com os novos dados
    window.showToast(`Sessão alterada para ${m.nome} (${m.cargo})!`, 'info');
  };

  // Inicializar Perfil e Avatar do Utilizador na Barra Lateral
  window.updateSidebarUserProfile();

  // =========================================================================
  // 3.5. Redimensionamento Universal de Colunas em Todas as Tabelas (.modern-table)
  // Permite arrastar o separador entre colunas e memoriza a largura no localStorage
  // =========================================================================
  window.initTableResizers = function() {
    document.querySelectorAll('table.modern-table').forEach((table, tableIdx) => {
      const tableId = table.id || `table_${tableIdx}`;
      const storageKey = `arca_table_cols_width_${tableId}`;

      let savedWidths = {};
      try {
        savedWidths = JSON.parse(localStorage.getItem(storageKey)) || {};
      } catch (e) {
        savedWidths = {};
      }

      const ths = table.querySelectorAll('thead th');
      ths.forEach((th, idx) => {
        const colKey = th.getAttribute('data-col') || `col_${idx}`;
        if (savedWidths[colKey]) {
          th.style.width = savedWidths[colKey];
          th.style.minWidth = savedWidths[colKey];
        }

        if (th.querySelector('.col-resizer')) return;

        const resizer = document.createElement('div');
        resizer.className = 'col-resizer';
        th.appendChild(resizer);

        let startX = 0;
        let startWidth = 0;

        function onMouseMove(e) {
          const diff = e.pageX - startX;
          const newWidth = Math.max(50, startWidth + diff);
          th.style.width = `${newWidth}px`;
          th.style.minWidth = `${newWidth}px`;
        }

        function onMouseUp() {
          resizer.classList.remove('resizing');
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);

          savedWidths[colKey] = `${th.offsetWidth}px`;
          try {
            localStorage.setItem(storageKey, JSON.stringify(savedWidths));
          } catch (e) {}
        }

        resizer.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          startX = e.pageX;
          startWidth = th.offsetWidth;
          resizer.classList.add('resizing');
          document.body.style.cursor = 'col-resize';
          document.body.style.userSelect = 'none';

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        });
      });
    });
  };

  // Inicializar resizers em qualquer tabela presente
  window.initTableResizers();

  // =========================================================================
  // 3.6. Gestão Centralizada de Sócios & Atualização Global de Métricas (Painel & Badges)
  // =========================================================================
  const STORAGE_KEY = 'arca_socios_data_v3';
  const VERSION_KEY = 'arca_socios_version';
  const currentVersion = (typeof ARCA_SOCIOS_DATA_VERSION !== 'undefined') ? ARCA_SOCIOS_DATA_VERSION : '2026-11-25_v3';
  const storedVersion = localStorage.getItem(VERSION_KEY);

  function getGlobalSocios() {
    let data = null;
    if (storedVersion === currentVersion && localStorage.getItem(STORAGE_KEY)) {
      try {
        data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!Array.isArray(data) || data.length < 50) data = null;
      } catch (e) {
        data = null;
      }
    }
    if (!data && typeof ARCA_SOCIOS_BASE !== 'undefined') {
      data = JSON.parse(JSON.stringify(ARCA_SOCIOS_BASE));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(VERSION_KEY, currentVersion);
    }
    return data || [];
  }

  window.updateGlobalMetrics = function() {
    const list = getGlobalSocios();
    if (!list || list.length === 0) return;

    const totalRegistados = list.length;
    const ativos = list.filter(s => s.estadoMembro === 'Ativo').length;
    const emDia = list.filter(s => s.estadoMembro === 'Ativo' && s.estado === 'Em Dia').length;
    const quotasPagasValor = emDia * 6;

    // Atualizar badge em todas as páginas (sidebar)
    const cUser = (typeof window.getArcaCurrentUser === 'function') ? window.getArcaCurrentUser() : null;
    const sPerm = (cUser && cUser.permissoes_modulos && cUser.permissoes_modulos.socios) || {};
    const isOwnBadge = cUser && (cUser.perfil === 'Própria Ficha (Sócio)' || (sPerm.enabled && sPerm.mode === 'own'));

    document.querySelectorAll('.nav-item-badge').forEach(b => {
      b.textContent = isOwnBadge ? '1' : ativos;
    });

    // Atualizar indicadores no painel.html (Visão Geral)
    const elPainelSocios = document.getElementById('painelStatSocios');
    const elPainelSociosSub = document.getElementById('painelStatSociosSub');
    const elPainelCotas = document.getElementById('painelStatCotas');
    const elPainelCotasSub = document.getElementById('painelStatCotasSub');

    if (elPainelSocios) elPainelSocios.textContent = ativos;
    if (elPainelSociosSub) elPainelSociosSub.innerHTML = `&check; ${ativos} ativos de ${totalRegistados} registados`;
    if (elPainelCotas) elPainelCotas.textContent = emDia;
    if (elPainelCotasSub) elPainelCotasSub.innerHTML = `&check; ${emDia} em dia (${quotasPagasValor.toLocaleString('pt-PT')} €)`;
  };

  // Atualizar métricas globais em qualquer página
  window.updateGlobalMetrics();

  // =========================================================================
  // 4. Módulo de Sócios Oficial da A.R.C.A. (socios.html)
  // CRUD Completo, Gestão de Quotas Ano a Ano, Resizer de Colunas e Drawer
  // =========================================================================
  const sociosTableBody = document.getElementById('sociosTableBody');

  if (sociosTableBody) {
    let socios = getGlobalSocios();

    const currentUser = (typeof window.getArcaCurrentUser === 'function') ? window.getArcaCurrentUser() : null;
    const isAdmin = currentUser && (currentUser.perfil === 'Administrador Total' || currentUser.login === 'jorge');
    const isDirecao = currentUser && (currentUser.perfil === 'Membro da Direção' || currentUser.perfil === 'Direção');
    const isTesouraria = currentUser && (currentUser.perfil === 'Tesoureiro' || currentUser.perfil === 'Tesouraria');
    const sociosPerm = (currentUser && currentUser.permissoes_modulos && currentUser.permissoes_modulos.socios) || {};
    
    // Se o utilizador tiver a permissão restrita a 'own' (Própria Ficha) ou perfil de associado/consulta,
    // restringe estritamente a visualização à sua própria ficha e cotas, mesmo que faça parte da Direção.
    const isOwnOnly = !isAdmin && (
      (sociosPerm.enabled && sociosPerm.mode === 'own') ||
      currentUser?.perfil === 'Própria Ficha (Sócio)' ||
      currentUser?.perfil === 'Sócio Consulta' ||
      (!isDirecao && !isTesouraria && sociosPerm.mode !== 'full')
    );
    const isManager = !isOwnOnly;

    function findCurrentUserSocio() {
      if (!currentUser) return null;

      // Salvaguarda direta para Raquel Alexandra Marques da Cunha (Sócia nº 414)
      if (currentUser.login === 'raquel.cunha' || (currentUser.nome && currentUser.nome.toLowerCase().includes('raquel alexandra'))) {
        const foundRaquel = socios.find(s => Number(s.numero) === 414 || Number(s.id) === 414);
        if (foundRaquel) return foundRaquel;
      }

      if (currentUser.numeroSocio) {
        const found = socios.find(s => Number(s.numero) === Number(currentUser.numeroSocio) || Number(s.id) === Number(currentUser.numeroSocio));
        if (found) return found;
      }
      if (currentUser.email) {
        const cleanEmail = currentUser.email.trim().toLowerCase();
        const found = socios.find(s => s.email && s.email.trim().toLowerCase() === cleanEmail);
        if (found) return found;
      }
      if (currentUser.nome) {
        const cleanNome = currentUser.nome.trim().toLowerCase();
        const found = socios.find(s => s.nome && s.nome.trim().toLowerCase() === cleanNome);
        if (found) return found;
        const parts = cleanNome.split(' ').filter(Boolean);
        if (parts.length >= 2) {
          const firstLast = `${parts[0]} ${parts[parts.length - 1]}`;
          const byFirstLast = socios.find(s => s.nome && s.nome.trim().toLowerCase().includes(firstLast));
          if (byFirstLast) return byFirstLast;
        }
      }
      return null;
    }

    function saveSocios() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(socios));
      window.updateGlobalMetrics();
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    // Configurações de Personalização de Colunas & Ordenação de Sócios
    const SOCIOS_COLS_KEY = 'arca_socios_cols_v4';
    const DEFAULT_SOCIOS_COLS = {
      numero: true,
      nome: true,
      localidade: true,
      categoria: true,
      estadoMembro: true,
      ultimoAno: true,
      emAtraso: true,
      acoes: true
    };
    let activeSociosCols = JSON.parse(localStorage.getItem(SOCIOS_COLS_KEY)) || { ...DEFAULT_SOCIOS_COLS };

    function saveSociosCols() {
      localStorage.setItem(SOCIOS_COLS_KEY, JSON.stringify(activeSociosCols));
    }

    function isColVisible(key) {
      return activeSociosCols[key] !== false;
    }

    let currentSortField = 'numero';
    let currentSortDir = 'asc';

    window.sortSociosTable = function(field) {
      if (currentSortField === field) {
        currentSortDir = (currentSortDir === 'asc') ? 'desc' : 'asc';
      } else {
        currentSortField = field;
        currentSortDir = 'asc';
      }
      updateSortIndicators();
      applyFilters();
    };

    function updateSortIndicators() {
      const select = document.getElementById('sortSociosSelect');
      if (select) {
        select.value = `${currentSortField}_${currentSortDir}`;
      }

      document.querySelectorAll('#sociosTableHeadRow th.sortable-th').forEach(th => {
        const col = th.getAttribute('data-col');
        const ind = th.querySelector('.sort-indicator');
        if (col === currentSortField) {
          th.classList.add('active');
          if (ind) ind.textContent = currentSortDir === 'asc' ? '▲' : '▼';
        } else {
          th.classList.remove('active');
          if (ind) ind.textContent = '⇅';
        }
      });
    }

    function initSociosColPicker() {
      const pickerList = document.getElementById('colPickerListSocios');
      const toggleBtn = document.getElementById('btnToggleColPickerSocios');
      const menu = document.getElementById('colPickerMenuSocios');
      if (!pickerList) return;

      const labels = {
        numero: 'Nº Sócio',
        nome: 'Nome do Sócio',
        localidade: 'Localidade / Morada',
        categoria: 'Categoria',
        estadoMembro: 'Situação (Ativo / Falecido / Inativo)',
        ultimoAno: 'Último Ano Pago',
        emAtraso: 'Quotas em Atraso',
        acoes: 'Ações'
      };

      pickerList.innerHTML = Object.entries(labels).map(([key, label]) => {
        const isChecked = isColVisible(key);
        return `
          <label class="col-picker-item">
            <input type="checkbox" data-col="${key}" ${isChecked ? 'checked' : ''} onchange="toggleSocioCol('${key}', this.checked)">
            <span>${label}</span>
          </label>
        `;
      }).join('');

      if (toggleBtn && menu) {
        toggleBtn.onclick = (e) => {
          e.stopPropagation();
          menu.classList.toggle('show');
        };

        document.addEventListener('click', (e) => {
          if (!menu.contains(e.target) && e.target !== toggleBtn) {
            menu.classList.remove('show');
          }
        });
      }

      applyColumnsVisibility();
    }

    window.toggleSocioCol = function(key, isVisible) {
      activeSociosCols[key] = isVisible;
      saveSociosCols();
      applyColumnsVisibility();
      applyFilters();
    };

    window.resetSociosColumns = function() {
      activeSociosCols = { ...DEFAULT_SOCIOS_COLS };
      saveSociosCols();
      initSociosColPicker();
      applyColumnsVisibility();
      applyFilters();
    };

    function applyColumnsVisibility() {
      document.querySelectorAll('#sociosTableHeadRow th').forEach(th => {
        const col = th.getAttribute('data-col');
        if (col) {
          th.style.display = isColVisible(col) ? '' : 'none';
        }
      });
    }

    // Indicadores do Topo Conforme Sistema ARCA
    function updateStats() {
      if (isOwnOnly) {
        const userSocio = findCurrentUserSocio();
        const metricsRow = document.querySelector('.metrics-row-4');
        if (metricsRow) {
          if (userSocio) {
            const anosEmAtraso = userSocio.divida > 0 ? Math.round(userSocio.divida / 6) : 0;
            metricsRow.innerHTML = `
              <div class="metric-card accent-green">
                <div class="metric-content">
                  <span class="metric-label" style="text-transform: uppercase; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.05em;">O MEU NÚMERO DE SÓCIO</span>
                  <span class="metric-value" style="color: var(--text-title); font-size: 2.1rem; margin-top: 0.2rem;">Nº ${userSocio.numero}</span>
                  <span class="metric-badge neutral" style="font-weight: 600; font-size: 0.85rem; color: var(--text-muted); margin-top: 0.35rem;">Categoria: ${escapeHtml(userSocio.categoria || 'Efetivo')}</span>
                </div>
              </div>

              <div class="metric-card ${userSocio.divida > 0 ? 'accent-orange' : 'accent-green'}">
                <div class="metric-content">
                  <span class="metric-label" style="text-transform: uppercase; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.05em;">ESTADO DAS MINHAS QUOTAS</span>
                  <span class="metric-value" style="color: ${userSocio.divida > 0 ? '#d97706' : '#16a34a'}; font-size: 2.1rem; margin-top: 0.2rem;">${userSocio.divida > 0 ? 'Em Atraso' : 'Em Dia'}</span>
                  <span class="metric-badge ${userSocio.divida > 0 ? 'warning' : 'positive'}" style="font-weight: 600; font-size: 0.85rem; margin-top: 0.35rem;">Último ano pago: ${userSocio.ultimaQuota || 'Sem registo'}</span>
                </div>
              </div>

              <div class="metric-card ${userSocio.divida > 0 ? 'accent-red' : 'accent-green'}">
                <div class="metric-content">
                  <span class="metric-label" style="text-transform: uppercase; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.05em;">VALOR EM DÍVIDA</span>
                  <span class="metric-value" style="color: ${userSocio.divida > 0 ? '#dc2626' : '#16a34a'}; font-size: 2.1rem; margin-top: 0.2rem;">${userSocio.divida > 0 ? userSocio.divida.toFixed(2).replace('.', ',') + ' €' : '0,00 €'}</span>
                  <span class="metric-badge" style="color: ${userSocio.divida > 0 ? '#dc2626' : '#16a34a'}; font-weight: 700; font-size: 0.85rem; margin-top: 0.35rem;">${userSocio.divida > 0 ? `${anosEmAtraso} ano(s) por regularizar` : 'Quotas 100% regularizadas'}</span>
                </div>
              </div>

              <div class="metric-card accent-green" style="display: flex; flex-direction: column; justify-content: center; align-items: stretch; background: rgba(28, 109, 66, 0.05); border: 1.5px solid rgba(28, 109, 66, 0.25);">
                <div style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; color: var(--primary); letter-spacing: 0.05em; margin-bottom: 0.4rem;">PAGAMENTO DE COTAS</div>
                <p style="font-size: 0.82rem; color: var(--text-body); margin: 0 0 0.6rem 0; line-height: 1.4;">
                  ${userSocio.divida > 0 ? 'Pretende regularizar as suas cotas em atraso?' : 'Deseja contactar a Direção sobre as suas cotas?'}
                </p>
                <button type="button" class="btn btn-primary btn-sm" style="font-weight: 700; background: #1c6d42; border-color: #1c6d42; width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem; padding: 0.45rem 0.6rem;" onclick="abrirModalContactoAdminPagamento(${userSocio.id})">
                  <span>✉️</span>
                  <span>Contactar administrador para pagar</span>
                </button>
              </div>
            `;
          } else {
            metricsRow.innerHTML = `
              <div class="metric-card accent-orange" style="grid-column: 1 / -1; padding: 1.5rem;">
                <div style="font-weight: 800; color: #d97706; font-size: 1.1rem; margin-bottom: 0.5rem;">Aguardando Associação do Número de Sócio</div>
                <p style="color: var(--text-body); font-size: 0.9rem; line-height: 1.5; margin: 0 0 1rem 0;">
                  A sua conta de utilizador ainda não tem um Número de Sócio associado. Por favor solicite a associação do seu número à Direção.
                </p>
                <button type="button" class="btn btn-primary btn-sm" onclick="abrirModalContactoAdminPagamento()" style="background: #1c6d42; border-color: #1c6d42;">
                  ✉️ Solicitar Associação de Número de Sócio à Direção
                </button>
              </div>
            `;
          }
        }

        // Títulos e Filtros para Sócio Individual
        const pageTitle = document.querySelector('.page-title-bar h1');
        const pageDesc = document.querySelector('.page-title-bar p');
        if (pageTitle) pageTitle.textContent = 'A Minha Ficha de Sócio & Quotas';
        if (pageDesc) pageDesc.textContent = 'Área pessoal do associado: consulte a sua ficha cadastral, quotas liquidadas e solicite o pagamento diretamente à Direção da ARCA.';

        const tableTitle = document.getElementById('tableTitleSocios');
        if (tableTitle) tableTitle.textContent = userSocio ? `A Minha Ficha de Associado (Nº ${userSocio.numero} — ${userSocio.nome})` : 'A Minha Ficha de Associado';

        const filterBar = document.querySelector('.card-header-bar > div');
        if (filterBar) filterBar.style.display = 'none';

        const btnExportCsv = document.getElementById('btnExportCsv');
        if (btnExportCsv) btnExportCsv.style.display = 'none';

        const btnOpenNewSocioModal = document.getElementById('btnOpenNewSocioModal');
        if (btnOpenNewSocioModal) btnOpenNewSocioModal.style.display = 'none';

        return;
      }

      const total = socios.length;
      const ativos = socios.filter(s => s.estadoMembro === 'Ativo').length;
      const quotasPagas = socios.filter(s => s.estadoMembro === 'Ativo' && s.estado === 'Em Dia').length;
      const quotasPagasValor = quotasPagas * 6;
      const quotasPorPagar = ativos - quotasPagas;
      const quotasPorPagarValor = quotasPorPagar * 6;
      const ativosEmAtraso = socios.filter(s => s.estadoMembro === 'Ativo' && s.divida > 0).length;
      const dividaTotal = socios.filter(s => s.estadoMembro === 'Ativo').reduce((sum, s) => sum + (s.divida || 0), 0);

      const elAtivos = document.getElementById('statAtivos');
      const elAtivosSub = document.getElementById('statAtivosSub');
      const elQuotasPagas = document.getElementById('statQuotasPagas');
      const elQuotasPagasValor = document.getElementById('statQuotasPagasValor');
      const elQuotasPorPagar = document.getElementById('statQuotasPorPagar');
      const elQuotasPorPagarSub = document.getElementById('statQuotasPorPagarSub');
      const elAtivosEmAtraso = document.getElementById('statAtivosEmAtraso');
      const elValorEmAtraso = document.getElementById('statValorEmAtraso');

      if (elAtivos) elAtivos.textContent = ativos;
      if (elAtivosSub) elAtivosSub.textContent = `de ${total} registados`;
      if (elQuotasPagas) elQuotasPagas.textContent = quotasPagas;
      if (elQuotasPagasValor) elQuotasPagasValor.textContent = `${quotasPagasValor.toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2})} € recebidos`;
      if (elQuotasPorPagar) elQuotasPorPagar.textContent = quotasPorPagar;
      if (elQuotasPorPagarSub) elQuotasPorPagarSub.textContent = `quota anual 6,00 € (${quotasPorPagarValor.toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2})} €)`;
      if (elAtivosEmAtraso) elAtivosEmAtraso.textContent = ativosEmAtraso;
      if (elValorEmAtraso) elValorEmAtraso.textContent = `${dividaTotal.toLocaleString('pt-PT', {minimumFractionDigits: 2, maximumFractionDigits: 2})} € em dívida`;

      window.updateGlobalMetrics();
    }

    // Garante que o objeto do sócio tem a lista de quotas ano a ano estruturada
    function ensureSocioQuotas(socio) {
      if (Array.isArray(socio.quotas) && socio.quotas.length > 0) {
        socio.quotas.forEach(q => {
          if (q.pago && !q.reciboNumero) {
            if (socio.numero === 2) q.reciboNumero = '1350';
            else if (socio.numero === 3) q.reciboNumero = '1349';
            else if (socio.numero === 21) q.reciboNumero = '1347';
          }
        });
        return socio.quotas;
      }

      const quotas = [];
      const currentYear = 2026;
      const lastPaid = parseInt(socio.ultimaQuota) || (socio.estado === 'Em Dia' ? 2026 : 2025);

      if (socio.isento) {
        quotas.push({
          ano: 2026,
          valor: 0,
          pago: true,
          estado: 'Isento',
          data: socio.ultimaAtualizacao || '2026-01-01',
          metodo: 'Isenção Estatutária',
          recibo: false
        });
      } else if (lastPaid >= currentYear) {
        // Em dia para 2026
        const numRec2026 = (socio.numero === 2 ? '1350' : (socio.numero === 3 ? '1349' : (socio.numero === 21 ? '1347' : null)));
        quotas.push({
          ano: 2026,
          valor: 6.00,
          pago: true,
          estado: 'Pago',
          data: socio.ultimaAtualizacao || '2026-01-15',
          metodo: 'MBWay',
          recibo: true,
          reciboNumero: numRec2026
        });
        quotas.push({
          ano: 2025,
          valor: 6.00,
          pago: true,
          estado: 'Pago',
          data: '2025-03-31',
          metodo: 'Numerário',
          recibo: true,
          reciboNumero: numRec2026 ? String(parseInt(numRec2026) - 10) : null
        });
      } else {
        // Quotas por pagar desde (lastPaid + 1) até 2026
        for (let y = lastPaid + 1; y <= currentYear; y++) {
          quotas.push({
            ano: y,
            valor: 6.00,
            pago: false,
            estado: 'Por pagar',
            data: null,
            metodo: null,
            recibo: false
          });
        }
        // Incluir último ano pago para histórico
        const numRecHist = (socio.numero === 2 ? '1350' : (socio.numero === 3 ? '1349' : (socio.numero === 21 ? '1347' : null)));
        quotas.push({
          ano: lastPaid,
          valor: 6.00,
          pago: true,
          estado: 'Pago',
          data: socio.ultimaAtualizacao || `${lastPaid}-03-31`,
          metodo: 'Numerário',
          recibo: true,
          reciboNumero: numRecHist
        });
      }

      // Ordenar por ano decrescente
      quotas.sort((a, b) => b.ano - a.ano);
      socio.quotas = quotas;
      return quotas;
    }

    // Renderizar Tabela de Sócios
    function renderTable(data = socios) {
      sociosTableBody.innerHTML = '';
      applyColumnsVisibility();

      if (data.length === 0) {
        const visibleColsCount = Object.values(activeSociosCols).filter(Boolean).length || 8;
        sociosTableBody.innerHTML = `
          <tr>
            <td colspan="${visibleColsCount}" style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
              Nenhum associado encontrado para os filtros selecionados.
            </td>
          </tr>
        `;
        return;
      }

      data.forEach(s => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';

        // Badge de situação do membro
        let membroBadge = `<span class="status-pill em-dia" style="font-size: 0.78rem; padding: 2px 8px;">Ativo</span>`;
        if (s.estadoMembro === 'Falecido') {
          membroBadge = `<span class="status-pill" style="background: #e2e8f0; color: #475569; font-size: 0.78rem; padding: 2px 8px;">Falecido</span>`;
        } else if (s.estadoMembro === 'Inativo') {
          membroBadge = `<span class="status-pill pendente" style="font-size: 0.78rem; padding: 2px 8px;">Inativo</span>`;
        }

        // Coluna Em Atraso
        let emAtrasoHtml = '<span style="color: #16a34a; font-weight: 600;">Em dia</span>';
        if (s.divida > 0) {
          const anosEmAtraso = Math.round(s.divida / 6);
          emAtrasoHtml = `<span style="color: #dc2626; font-weight: 600;">${anosEmAtraso} - ${s.divida.toFixed(2).replace('.', ',')} €</span>`;
        }

        let html = '';

        // 1. Nº Sócio (Sem '#' na frente)
        if (isColVisible('numero')) {
          html += `<td><strong>${s.numero}</strong></td>`;
        }

        // 2. Nome do Sócio (Sem avatar/círculo de iniciais, nome em negrito com telefone por baixo)
        if (isColVisible('nome')) {
          const contactoSub = s.telefone ? escapeHtml(s.telefone) : (s.email ? escapeHtml(s.email) : '');
          html += `
            <td>
              <div>
                <a href="javascript:void(0)" onclick="openSocioDrawer(${s.id})" style="font-weight: 700; color: var(--text-title); text-decoration: none;">
                  ${escapeHtml(s.nome)}
                </a>
                ${contactoSub ? `<div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">${contactoSub}</div>` : ''}
              </div>
            </td>
          `;
        }

        // 3. Localidade
        if (isColVisible('localidade')) {
          const locText = s.localidade || s.morada || '—';
          html += `<td><span style="font-size: 0.88rem; color: var(--text-body);">${escapeHtml(locText)}</span></td>`;
        }

        // 4. Categoria
        if (isColVisible('categoria')) {
          html += `<td><span style="font-weight: 600; font-size: 0.88rem;">${escapeHtml(s.categoria || 'Efetivo')}</span></td>`;
        }

        // 5. Estado do Membro
        if (isColVisible('estadoMembro')) {
          html += `<td>${membroBadge}</td>`;
        }

        // 6. Último ano pago
        if (isColVisible('ultimoAno')) {
          html += `<td><span style="font-weight: 600; color: var(--text-title);">${s.ultimaQuota || '—'}</span></td>`;
        }

        // 7. Em atraso
        if (isColVisible('emAtraso')) {
          html += `<td>${emAtrasoHtml}</td>`;
        }

        // 8. Ações
        if (isColVisible('acoes')) {
          html += `
            <td style="text-align: right; white-space: nowrap;">
              ${(isOwnOnly && s.divida > 0) ? `
                <button class="btn btn-primary btn-sm" style="background: #1c6d42; border-color: #1c6d42; margin-right: 0.4rem;" onclick="event.stopPropagation(); abrirModalContactoAdminPagamento(${s.id})" title="Contactar administrador para pagar cotas">
                  ✉️ Pagar Cotas
                </button>
              ` : ''}
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openSocioDrawer(${s.id})" title="Ver Ficha Completa">
                Ver Ficha
              </button>
            </td>
          `;
        }

        tr.innerHTML = html;

        // Abrir drawer ao clicar na linha (exceto se clicou num botão ou link direto)
        tr.addEventListener('click', (e) => {
          if (!e.target.closest('button, a, input, select')) {
            openSocioDrawer(s.id);
          }
        });

        sociosTableBody.appendChild(tr);
      });

      // Re-anexar manipuladores de redimensionamento de colunas
      if (window.initTableResizers) {
        window.initTableResizers();
      }
    }

    // =========================================================================
    // 4.1. Drawer Lateral: Ficha do Sócio com Tabs de 'Dados' e 'Quotas'
    // =========================================================================
    const drawerBackdrop = document.getElementById('drawerSocio');
    const drawerHeaderTitle = document.getElementById('drawerHeaderTitle');
    const drawerContent = document.getElementById('drawerSocioContent');
    const drawerFooter = document.getElementById('drawerFooterContent');
    const tabBtnDados = document.getElementById('tabBtnDados');
    const tabBtnQuotas = document.getElementById('tabBtnQuotas');
    const tabQuotasBadge = document.getElementById('tabQuotasBadge');

    let currentDrawerSocioId = null;
    let currentDrawerTab = 'dados';

    window.openSocioDrawer = function(id, tab = 'dados') {
      const socio = socios.find(s => s.id === id);
      if (!socio || !drawerBackdrop) return;

      currentDrawerSocioId = id;
      currentDrawerTab = tab;

      ensureSocioQuotas(socio);

      // Atualizar Título do Drawer (Sem '#')
      if (drawerHeaderTitle) {
        drawerHeaderTitle.textContent = `Sócio nº ${socio.numero}`;
      }

      // Atualizar badge da tab de quotas
      const quotas = socio.quotas || [];
      const unpaidQuotas = quotas.filter(q => !q.pago);
      if (tabQuotasBadge) {
        tabQuotasBadge.textContent = unpaidQuotas.length;
        if (unpaidQuotas.length === 0) {
          tabQuotasBadge.className = 'tab-badge green';
        } else {
          tabQuotasBadge.className = 'tab-badge';
        }
      }

      // Alternar visual das tabs
      if (tabBtnDados) tabBtnDados.classList.toggle('active', currentDrawerTab === 'dados');
      if (tabBtnQuotas) tabBtnQuotas.classList.toggle('active', currentDrawerTab === 'quotas');

      renderDrawerContent();
      drawerBackdrop.classList.add('open');
    };

    window.switchDrawerTab = function(tab) {
      currentDrawerTab = tab;
      if (tabBtnDados) tabBtnDados.classList.toggle('active', tab === 'dados');
      if (tabBtnQuotas) tabBtnQuotas.classList.toggle('active', tab === 'quotas');
      renderDrawerContent();
    };

    window.closeSocioDrawer = function() {
      if (drawerBackdrop) drawerBackdrop.classList.remove('open');
      currentDrawerSocioId = null;
    };

    function renderDrawerContent() {
      if (!currentDrawerSocioId || !drawerContent) return;
      const socio = socios.find(s => s.id === currentDrawerSocioId);
      if (!socio) return;

      ensureSocioQuotas(socio);

      const currentUser = (typeof window.getArcaCurrentUser === 'function') ? window.getArcaCurrentUser() : null;
      const isAdmin = currentUser && (currentUser.perfil === 'Administrador Total' || currentUser.login === 'jorge');
      const sociosPerm = (currentUser && currentUser.permissoes_modulos && currentUser.permissoes_modulos.socios) || {};
      const canEdit = isAdmin || (sociosPerm.enabled && sociosPerm.mode === 'full' && (sociosPerm.submenus || []).includes('editar'));
      const canPay = isAdmin || (sociosPerm.enabled && sociosPerm.mode === 'full' && (sociosPerm.submenus || []).includes('pagamentos'));

      if (currentDrawerTab === 'dados') {
        // TAB 1: DADOS CADASTRAIS (EDITÁVEL & CRUD)
        drawerContent.innerHTML = `
          <form id="formDrawerSocio" onsubmit="event.preventDefault(); saveSocioDataFromDrawer();">
            <!-- IDENTIFICAÇÃO -->
            <div class="drawer-section-title">IDENTIFICAÇÃO</div>
            <div style="display: grid; grid-template-columns: 120px 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="drawer_numero">Nº de sócio *</label>
                <input type="number" id="drawer_numero" class="form-control" value="${socio.numero}" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="drawer_nome">Nome completo *</label>
                <input type="text" id="drawer_nome" class="form-control" value="${escapeHtml(socio.nome)}" required>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
              <div class="form-group">
                <label class="form-label" for="drawer_nif">NIF</label>
                <input type="text" id="drawer_nif" class="form-control" value="${escapeHtml(socio.nif || '')}" placeholder="9 dígitos" maxlength="9">
              </div>
              <div class="form-group">
                <label class="form-label" for="drawer_nascimento">Data de nascimento</label>
                <input type="date" id="drawer_nascimento" class="form-control" value="${socio.dataNascimento || ''}">
              </div>
            </div>

            <!-- CONTACTOS -->
            <div class="drawer-section-title">CONTACTOS</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="drawer_telefone">Telefone</label>
                <input type="tel" id="drawer_telefone" class="form-control" value="${escapeHtml(socio.telefone || '')}" placeholder="912 345 678">
              </div>
              <div class="form-group">
                <label class="form-label" for="drawer_email">Email</label>
                <input type="email" id="drawer_email" class="form-control" value="${escapeHtml(socio.email || '')}" placeholder="exemplo@arca.pt">
              </div>
            </div>

            <div class="form-group" style="margin-top: 1rem;">
              <label class="form-label" for="drawer_morada">Morada</label>
              <input type="text" id="drawer_morada" class="form-control" value="${escapeHtml(socio.morada || '')}" placeholder="Rua / Lugar">
            </div>

            <div style="display: grid; grid-template-columns: 140px 1fr; gap: 1rem; margin-top: 1rem;">
              <div class="form-group">
                <label class="form-label" for="drawer_codPostal">Código postal</label>
                <input type="text" id="drawer_codPostal" class="form-control" value="${escapeHtml(socio.codPostal || '')}" placeholder="0000-000">
              </div>
              <div class="form-group">
                <label class="form-label" for="drawer_localidade">Localidade</label>
                <input type="text" id="drawer_localidade" class="form-control" value="${escapeHtml(socio.localidade || 'Aguada de Baixo')}" placeholder="Localidade">
              </div>
            </div>

            <!-- ASSOCIATIVO -->
            <div class="drawer-section-title">ASSOCIATIVO</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="drawer_dataInscricao">Data de admissão</label>
                <input type="date" id="drawer_dataInscricao" class="form-control" value="${socio.dataInscricao || ''}">
              </div>
              <div class="form-group">
                <label class="form-label" for="drawer_categoria">Categoria</label>
                <select id="drawer_categoria" class="form-control">
                  <option value="Fundador" ${socio.categoria === 'Fundador' ? 'selected' : ''}>Fundador</option>
                  <option value="Efetivo" ${socio.categoria === 'Efetivo' ? 'selected' : ''}>Efetivo</option>
                  <option value="Benemérito" ${socio.categoria === 'Benemérito' ? 'selected' : ''}>Benemérito</option>
                  <option value="Juvenil" ${socio.categoria === 'Juvenil' ? 'selected' : ''}>Juvenil</option>
                  <option value="Honorário" ${socio.categoria === 'Honorário' ? 'selected' : ''}>Honorário</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
              <div class="form-group">
                <label class="form-label" for="drawer_estadoMembro">Estado</label>
                <select id="drawer_estadoMembro" class="form-control">
                  <option value="Ativo" ${socio.estadoMembro === 'Ativo' ? 'selected' : ''}>Ativo</option>
                  <option value="Falecido" ${socio.estadoMembro === 'Falecido' ? 'selected' : ''}>Falecido</option>
                  <option value="Inativo" ${socio.estadoMembro === 'Inativo' ? 'selected' : ''}>Inativo</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="drawer_ultimaQuota">Quotas pagas até (histórico)</label>
                <input type="number" id="drawer_ultimaQuota" class="form-control" value="${socio.ultimaQuota || 2026}">
              </div>
            </div>

            <div style="margin-top: 0.85rem;">
              <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer;">
                <input type="checkbox" id="drawer_isento" ${socio.isento ? 'checked' : ''}>
                <span>Isento de quotas</span>
              </label>
            </div>

            <!-- PROTEÇÃO DE DADOS (RGPD) -->
            <div class="drawer-section-title">PROTEÇÃO DE DADOS (RGPD)</div>
            <div class="form-group">
              <label class="form-label" for="drawer_rgpdData">Consentimento dado em</label>
              <input type="date" id="drawer_rgpdData" class="form-control" value="${socio.rgpdData || ''}">
              <small style="color: var(--text-muted); font-size: 0.8rem; display: block; margin-top: 0.35rem;">
                Registe a data em que o sócio autorizou o tratamento dos seus dados pessoais para fins associativos.
              </small>
            </div>

            <!-- Observações -->
            <div class="drawer-section-title">Observações</div>
            <div class="form-group">
              <textarea id="drawer_observacoes" class="form-control" rows="3" placeholder="Anotações sobre quotas, donativos, acordos...">${escapeHtml(socio.observacoes || '')}</textarea>
            </div>
          </form>
        `;

        // Rodapé do Drawer com botões Guardar e Eliminar ou aviso de Apenas Leitura
        if (drawerFooter) {
          if (canEdit) {
            drawerFooter.innerHTML = `
              <button type="button" class="btn btn-outline" style="color: #dc2626; border-color: #fca5a5;" onclick="deleteSocioFromDrawer(${socio.id})">
                Eliminar
              </button>
              <button type="button" class="btn btn-primary" onclick="saveSocioDataFromDrawer(${socio.id})">
                Guardar
              </button>
            `;
          } else {
            drawerFooter.innerHTML = `
              <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #64748b; font-size: 0.82rem; font-weight: 600;">Modo Consulta (Apenas Leitura)</span>
                <button type="button" class="btn btn-secondary" onclick="closeSocioDrawer()">Fechar</button>
              </div>
            `;
          }
        }

        if (!canEdit) {
          setTimeout(() => {
            const form = document.getElementById('formDrawerSocio');
            if (form) {
              form.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
            }
          }, 30);
        }

      } else {
        // TAB 2: QUOTAS ANO A ANO COM SELEÇÃO INDIVIDUAL
        const quotas = socio.quotas || [];
        const unpaidQuotas = quotas.filter(q => !q.pago);
        const unpaidCount = unpaidQuotas.length;
        const unpaidTotal = unpaidQuotas.reduce((sum, q) => sum + (q.valor || 6), 0);

        let quotasTableRows = '';
        if (quotas.length === 0) {
          quotasTableRows = `
            <tr>
              <td colspan="8" style="text-align: center; padding: 2rem 1rem; color: var(--text-muted);">
                Sem histórico de quotas registado para este associado.
              </td>
            </tr>
          `;
        } else {
          quotas.forEach(q => {
            const isPaid = q.pago === true;
            quotasTableRows += `
              <tr>
                <td style="text-align: center;">
                  ${!isPaid ? `
                    <input type="checkbox" class="quota-pay-check" data-ano="${q.ano}" data-valor="${q.valor || 6}" ${canPay ? 'checked' : 'disabled'} onchange="updateSelectedQuotasSummary()">
                  ` : `
                    <span style="color: #16a34a; font-weight: bold;">✓</span>
                  `}
                </td>
                <td><strong>${q.ano}</strong></td>
                <td>
                  ${!isPaid && canPay ? `
                    <input type="number" class="form-control" style="width: 75px; padding: 2px 6px; font-size: 0.85rem;" value="${q.valor || 6}" step="0.5" onchange="updateQuotaValue(${socio.id}, ${q.ano}, this.value)">
                  ` : `
                    <span>${(q.valor || 6).toFixed(2).replace('.', ',')} €</span>
                  `}
                </td>
                <td>
                  <span class="status-pill ${isPaid ? 'em-dia' : 'atrasado'}" style="font-size: 0.78rem; padding: 2px 7px;">
                    ${isPaid ? 'Pago' : 'Por pagar'}
                  </span>
                </td>
                <td style="font-size: 0.82rem; color: var(--text-muted);">${q.data || '—'}</td>
                <td style="font-size: 0.82rem;">${escapeHtml(q.metodo || '—')}</td>
                <td style="text-align: center;">
                  ${isPaid ? (() => {
                    const recNum = q.reciboNumero || (socio.numero === 2 ? '1350' : (socio.numero === 3 ? '1349' : (socio.numero === 21 ? '1347' : null)));
                    if (recNum) {
                      q.reciboNumero = recNum;
                      return `
                        <button type="button" class="btn btn-outline btn-sm" style="padding: 2px 7px; font-size: 0.75rem; font-weight: 700; color: #1c6d42; border-color: #1c6d42; background: rgba(28, 109, 66, 0.08); display: inline-flex; align-items: center; gap: 4px; cursor: pointer;" onclick="abrirReciboDeSocios('${escapeHtml(String(recNum))}', ${socio.id})" title="Abrir recibo oficial ${escapeHtml(String(recNum))} diretamente da pasta de Recibos Emitidos">
                          📄 ${escapeHtml(String(recNum))} <span style="font-size: 0.65rem;">↗</span>
                        </button>
                      `;
                    } else if (canPay) {
                      return `
                        <button type="button" class="btn btn-outline btn-sm" style="padding: 2px 6px; font-size: 0.72rem; color: #1c6d42; border-color: #1c6d42; cursor: pointer;" onclick="associarReciboAQuota(${socio.id}, ${q.ano})" title="Associar ou registar número de recibo oficial">
                          + Recibo
                        </button>
                      `;
                    } else {
                      return '—';
                    }
                  })() : '—'}
                </td>
                <td style="text-align: center;">
                  ${canPay ? (isPaid ? `
                    <button type="button" class="btn btn-outline btn-sm" style="padding: 2px 6px; font-size: 0.75rem; color: #dc2626;" title="Anular pagamento deste ano" onclick="anularPagamentoQuota(${socio.id}, ${q.ano})">
                      ✕
                    </button>
                  ` : `
                    <button type="button" class="btn btn-outline btn-sm" style="padding: 2px 6px; font-size: 0.75rem; color: #94a3b8;" title="Remover este ano" onclick="removerAnoQuota(${socio.id}, ${q.ano})">
                      ✕
                    </button>
                  `) : '<span style="color: #cbd5e1;">—</span>'}
                </td>
              </tr>
            `;
          });
        }

        drawerContent.innerHTML = `
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
              <div>
                ${unpaidCount > 0 
                  ? `<div style="font-weight: 700; color: #dc2626; font-size: 1.05rem;">${unpaidCount} quota(s) em atraso - ${unpaidTotal.toFixed(2).replace('.', ',')} €</div>` 
                  : `<div style="font-weight: 700; color: #16a34a; font-size: 1.05rem;">Todas as quotas em dia</div>`}
                <div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">
                  Último ano pago: <strong>${socio.ultimaQuota || 'Sem registo'}</strong>
                </div>
              </div>

              ${canPay ? `
                <button type="button" class="btn btn-primary" onclick="openRegistarPagamentoModal(${socio.id})" style="background: #6c584c; border-color: #6c584c;">
                  Registar pagamento
                </button>
              ` : `
                <button type="button" class="btn btn-primary" onclick="abrirModalContactoAdminPagamento(${socio.id})" style="background: #1c6d42; border-color: #1c6d42; font-weight: 700; display: inline-flex; align-items: center; gap: 0.45rem;">
                  <span>✉️</span>
                  <span>Contactar um administrador para pagar</span>
                </button>
              `}
            </div>

            <div class="table-responsive" style="border: 1px solid var(--border-light); border-radius: var(--radius-sm);">
              <table class="drawer-quotas-table">
                <thead>
                  <tr>
                    <th style="width: 38px; text-align: center;">
                      <input type="checkbox" id="checkAllDrawerQuotas" ${canPay ? 'checked' : 'disabled'} onchange="toggleSelectAllDrawerQuotas(this.checked)" title="Selecionar Todos">
                    </th>
                    <th style="width: 65px;">Ano</th>
                    <th style="width: 85px;">Valor</th>
                    <th style="width: 95px;">Estado</th>
                    <th style="width: 95px;">Data</th>
                    <th style="width: 110px;">Método</th>
                    <th style="width: 75px; text-align: center;">Recibo</th>
                    <th style="width: 45px; text-align: center;">✕</th>
                  </tr>
                </thead>
                <tbody id="drawerQuotasTableBody">
                  ${quotasTableRows}
                </tbody>
              </table>
            </div>

            ${canPay ? `
              <!-- Adicionar Novo Ano Manualmente -->
              <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 1.25rem;">
                <input type="number" id="inputNovoAnoQuota" class="form-control" style="width: 110px; padding: 0.45rem 0.65rem;" placeholder="Ano" value="${new Date().getFullYear() + 1}">
                <button type="button" class="btn btn-secondary btn-sm" onclick="adicionarAnoQuota(${socio.id})">
                  Adicionar quota
                </button>
              </div>
            ` : ''}

            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 1.25rem; line-height: 1.5;">
              As quotas do ano corrente são criadas automaticamente para sócios ativos (exceto honorários e isentos). Anos anteriores ao histórico importado contam como pagos.
            </p>
          </div>
        `;

        if (drawerFooter) {
          if (!canPay) {
            drawerFooter.innerHTML = `
              <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 0.75rem;">
                <button type="button" class="btn btn-primary btn-sm" onclick="abrirModalContactoAdminPagamento(${socio.id})" style="background: #1c6d42; border-color: #1c6d42; font-weight: 700;">
                  ✉️ Contactar Administrador para Pagar
                </button>
                <button type="button" class="btn btn-outline btn-sm" onclick="closeSocioDrawer()">Fechar</button>
              </div>
            `;
          } else {
            drawerFooter.innerHTML = `
              <button type="button" class="btn btn-outline btn-sm" onclick="closeSocioDrawer()">Fechar</button>
            `;
          }
        }
      }
    }

    // Ação: Guardar Dados Cadastrais do Sócio
    window.saveSocioDataFromDrawer = function(id = currentDrawerSocioId) {
      const socio = socios.find(s => s.id === id);
      if (!socio) return;

      const newNum = parseInt(document.getElementById('drawer_numero').value) || socio.numero;
      const newNome = document.getElementById('drawer_nome').value.trim();

      if (!newNome) {
        showToast('Por favor, indique o nome completo do associado.', 'error');
        return;
      }

      // Verificar se número já existe noutro sócio
      const conflict = socios.find(s => s.numero === newNum && s.id !== socio.id);
      if (conflict) {
        showToast(`O Nº de sócio ${newNum} já se encontra atribuído a ${conflict.nome}. Escolha outro número.`, 'error');
        return;
      }

      socio.numero = newNum;
      socio.nome = newNome;
      socio.nif = document.getElementById('drawer_nif').value.trim();
      socio.dataNascimento = document.getElementById('drawer_nascimento').value;
      socio.telefone = document.getElementById('drawer_telefone').value.trim();
      socio.email = document.getElementById('drawer_email').value.trim();
      socio.morada = document.getElementById('drawer_morada').value.trim();
      socio.codPostal = document.getElementById('drawer_codPostal').value.trim();
      socio.localidade = document.getElementById('drawer_localidade').value.trim() || 'Aguada de Baixo';
      socio.dataInscricao = document.getElementById('drawer_dataInscricao').value;
      socio.categoria = document.getElementById('drawer_categoria').value;
      socio.estadoMembro = document.getElementById('drawer_estadoMembro').value;
      socio.isento = document.getElementById('drawer_isento').checked;
      socio.rgpdData = document.getElementById('drawer_rgpdData').value;
      socio.observacoes = document.getElementById('drawer_observacoes').value;

      const newUltima = parseInt(document.getElementById('drawer_ultimaQuota').value);
      if (!isNaN(newUltima)) {
        socio.ultimaQuota = newUltima;
      }

      // Recalcular dívida e estado do associado
      if (socio.isento) {
        socio.divida = 0;
        socio.estado = 'Em Dia';
      } else {
        const currentYear = 2026;
        if (socio.ultimaQuota >= currentYear) {
          socio.divida = 0;
          socio.estado = 'Em Dia';
        } else {
          const yearsDiff = currentYear - socio.ultimaQuota;
          socio.divida = yearsDiff * 6.00;
          socio.estado = (yearsDiff === 1) ? 'Pendente' : 'Atrasado';
        }
      }

      socio.ultimaAtualizacao = new Date().toISOString().slice(0, 10);

      // Reestruturar lista de quotas se a última quota mudou
      ensureSocioQuotas(socio);

      saveSocios();
      updateStats();
      applyFilters();

      if (drawerHeaderTitle) {
        drawerHeaderTitle.textContent = `Sócio nº ${socio.numero}`;
      }

      showToast(`Ficha do sócio nº ${socio.numero} (${socio.nome}) guardada com sucesso!`, 'success');
      renderDrawerContent();
    };

    // Ação: Eliminar Sócio Definitivamente
    window.deleteSocioFromDrawer = function(id = currentDrawerSocioId) {
      const socio = socios.find(s => s.id === id);
      if (!socio) return;

      const confirmDelete = confirm(`Tem a certeza absoluta de que deseja eliminar o associado nº ${socio.numero} (${socio.nome})?\n\nEsta ação apagará permanentemente a ficha do sócio e o respetivo registo de quotas.`);
      if (!confirmDelete) return;

      socios = socios.filter(s => s.id !== id);
      saveSocios();
      closeSocioDrawer();
      updateStats();
      applyFilters();

      showToast(`Associado nº ${socio.numero} (${socio.nome}) eliminado com sucesso.`, 'info');
    };

    // =========================================================================
    // 4.2. Gestão de Quotas: Seleção, Pagamento, Adicionar e Anular
    // =========================================================================
    window.toggleSelectAllDrawerQuotas = function(checked) {
      document.querySelectorAll('.quota-pay-check').forEach(cb => cb.checked = checked);
    };

    window.updateSelectedQuotasSummary = function() {
      // Atualiza seleção caso necessário
    };

    window.updateQuotaValue = function(socioId, ano, val) {
      const socio = socios.find(s => s.id === socioId);
      if (!socio || !socio.quotas) return;
      const q = socio.quotas.find(item => item.ano === ano);
      if (q) {
        q.valor = parseFloat(val) || 6.00;
        saveSocios();
        renderDrawerContent();
      }
    };

    window.adicionarAnoQuota = function(socioId) {
      const socio = socios.find(s => s.id === socioId);
      if (!socio) return;

      const inputAno = document.getElementById('inputNovoAnoQuota');
      const ano = parseInt(inputAno ? inputAno.value : '');

      if (!ano || isNaN(ano) || ano < 1980 || ano > 2050) {
        showToast('Por favor, indique um ano válido para a quota (ex: 2027).', 'error');
        return;
      }

      ensureSocioQuotas(socio);
      const exists = socio.quotas.find(q => q.ano === ano);
      if (exists) {
        showToast(`A quota para o ano ${ano} já existe na ficha deste sócio.`, 'error');
        return;
      }

      socio.quotas.push({
        ano: ano,
        valor: 6.00,
        pago: false,
        estado: 'Por pagar',
        data: null,
        metodo: null,
        recibo: false
      });

      socio.quotas.sort((a, b) => b.ano - a.ano);

      // Recalcular dívida se o ano adicionado for menor ou igual a 2026
      if (ano <= 2026) {
        socio.divida = (socio.divida || 0) + 6.00;
        socio.estado = 'Atrasado';
      }

      saveSocios();
      updateStats();
      applyFilters();
      renderDrawerContent();
      showToast(`Quota do ano ${ano} adicionada à ficha do sócio!`, 'success');
    };

    window.anularPagamentoQuota = function(socioId, ano) {
      const socio = socios.find(s => s.id === socioId);
      if (!socio || !socio.quotas) return;

      const confirmAnular = confirm(`Deseja reverter o pagamento da quota de ${ano} para "Por pagar"?`);
      if (!confirmAnular) return;

      const q = socio.quotas.find(item => item.ano === ano);
      if (q) {
        q.pago = false;
        q.estado = 'Por pagar';
        q.data = null;
        q.metodo = null;
        q.recibo = false;

        // Recalcular último ano pago e dívida
        const paidYears = socio.quotas.filter(item => item.pago).map(item => item.ano);
        socio.ultimaQuota = paidYears.length > 0 ? Math.max(...paidYears) : (ano - 1);

        const unpaidQuotas = socio.quotas.filter(item => !item.pago && item.ano <= 2026);
        socio.divida = unpaidQuotas.reduce((sum, item) => sum + (item.valor || 6.00), 0);
        socio.estado = (socio.divida === 0) ? 'Em Dia' : (socio.divida === 6 ? 'Pendente' : 'Atrasado');

        saveSocios();
        updateStats();
        applyFilters();
        renderDrawerContent();
        showToast(`Pagamento da quota de ${ano} anulado.`, 'info');
      }
    };

    window.removerAnoQuota = function(socioId, ano) {
      const socio = socios.find(s => s.id === socioId);
      if (!socio || !socio.quotas) return;

      const confirmRemove = confirm(`Deseja remover a linha da quota de ${ano}?`);
      if (!confirmRemove) return;

      socio.quotas = socio.quotas.filter(item => item.ano !== ano);

      const unpaidQuotas = socio.quotas.filter(item => !item.pago && item.ano <= 2026);
      socio.divida = unpaidQuotas.reduce((sum, item) => sum + (item.valor || 6.00), 0);
      socio.estado = (socio.divida === 0) ? 'Em Dia' : (socio.divida === 6 ? 'Pendente' : 'Atrasado');

      saveSocios();
      updateStats();
      applyFilters();
      renderDrawerContent();
      showToast(`Quota do ano ${ano} removida.`, 'info');
    };

    // Modal: Registar Pagamento de Quotas Selecionadas
    const modalPagamento = document.getElementById('modalPagamentoQuotas');
    let pendingPaymentSocioId = null;
    let pendingPaymentYears = [];
    let pendingPaymentTotal = 0;

    window.openRegistarPagamentoModal = function(socioId) {
      const socio = socios.find(s => s.id === socioId);
      if (!socio) return;

      ensureSocioQuotas(socio);

      // Recolher checkboxes selecionadas
      const checkedBoxes = document.querySelectorAll('.quota-pay-check:checked');
      let selectedYears = [];
      let total = 0;

      if (checkedBoxes.length > 0) {
        checkedBoxes.forEach(cb => {
          const ano = parseInt(cb.getAttribute('data-ano'));
          const valor = parseFloat(cb.getAttribute('data-valor')) || 6.00;
          selectedYears.push(ano);
          total += valor;
        });
      } else {
        // Se nenhuma estava marcada, selecionar automaticamente todas as quotas por pagar
        const unpaid = socio.quotas.filter(q => !q.pago);
        if (unpaid.length === 0) {
          showToast('Este sócio já não tem nenhuma quota por pagar.', 'info');
          return;
        }
        unpaid.forEach(q => {
          selectedYears.push(q.ano);
          total += (q.valor || 6.00);
        });
      }

      // Ordenar anos
      selectedYears.sort((a, b) => a - b);

      pendingPaymentSocioId = socioId;
      pendingPaymentYears = selectedYears;
      pendingPaymentTotal = total;

      const elSocioId = document.getElementById('pagamentoSocioId');
      const elAnos = document.getElementById('pagamentoAnosTexto');
      const elTotal = document.getElementById('pagamentoValorTotal');
      const elData = document.getElementById('pagamentoData');
      const elSubtitle = document.getElementById('modalPagamentoSubtitle');
      const inputReciboNum = document.getElementById('pagamentoReciboNumero');

      if (elSocioId) elSocioId.value = socioId;
      if (elAnos) elAnos.textContent = selectedYears.join(', ');
      if (elTotal) elTotal.textContent = `${total.toFixed(2).replace('.', ',')} €`;
      if (elData) elData.value = new Date().toISOString().slice(0, 10);
      if (elSubtitle) elSubtitle.textContent = `Sócio nº ${socio.numero} - ${socio.nome}`;
      if (inputReciboNum) {
        inputReciboNum.value = (window.ARCA_RECIBOS ? window.ARCA_RECIBOS.getNextNumero() : '1351');
      }

      if (modalPagamento) modalPagamento.classList.add('active');
    };

    window.closePagamentoModal = function() {
      if (modalPagamento) modalPagamento.classList.remove('active');
      pendingPaymentSocioId = null;
      pendingPaymentYears = [];
      pendingPaymentTotal = 0;
    };

    window.handleConfirmarPagamento = function(event) {
      event.preventDefault();
      if (!pendingPaymentSocioId) return;

      const socio = socios.find(s => s.id === pendingPaymentSocioId);
      if (!socio) return;

      const metodo = document.getElementById('pagamentoMetodo').value;
      const data = document.getElementById('pagamentoData').value || new Date().toISOString().slice(0, 10);
      const notas = document.getElementById('pagamentoNotas').value.trim();
      const emitirReciboChecked = document.getElementById('pagamentoEmitirRecibo').checked;
      const inputNumRecibo = document.getElementById('pagamentoReciboNumero');
      let numRecibo = inputNumRecibo ? inputNumRecibo.value.trim() : '';

      if (!numRecibo && emitirReciboChecked) {
        numRecibo = window.ARCA_RECIBOS ? window.ARCA_RECIBOS.getNextNumero() : '1351';
      }

      ensureSocioQuotas(socio);

      // Marcar cada quota selecionada como paga
      pendingPaymentYears.forEach(ano => {
        const q = socio.quotas.find(item => item.ano === ano);
        if (q) {
          q.pago = true;
          q.estado = 'Pago';
          q.data = data;
          q.metodo = metodo;
          q.recibo = true;
          if (numRecibo) q.reciboNumero = numRecibo;
        } else {
          socio.quotas.push({
            ano: ano,
            valor: 6.00,
            pago: true,
            estado: 'Pago',
            data: data,
            metodo: metodo,
            recibo: true,
            reciboNumero: numRecibo || null
          });
        }
      });

      // Recalcular maior ano pago
      const paidYears = socio.quotas.filter(item => item.pago).map(item => item.ano);
      if (paidYears.length > 0) {
        socio.ultimaQuota = Math.max(...paidYears);
      }

      // Recalcular dívida restante
      const remainingUnpaid = socio.quotas.filter(item => !item.pago && item.ano <= 2026);
      socio.divida = remainingUnpaid.reduce((sum, item) => sum + (item.valor || 6.00), 0);
      socio.estado = (socio.divida === 0) ? 'Em Dia' : (socio.divida === 6 ? 'Pendente' : 'Atrasado');

      // Adicionar anotação histórica
      const todayFormatted = new Date().toLocaleDateString('pt-PT');
      const histText = `[${todayFormatted}] Pagamento Quotas (${pendingPaymentYears.join(', ')}) no valor de ${pendingPaymentTotal.toFixed(2)} € via ${metodo}${numRecibo ? ` (Recibo ${numRecibo})` : ''}${notas ? ` - ${notas}` : ''}`;
      socio.observacoes = socio.observacoes ? `${socio.observacoes} | ${histText}` : histText;
      socio.ultimaAtualizacao = data;

      saveSocios();

      // Sincronizar na pasta de Recibos Emitidos
      if (numRecibo && window.ARCA_RECIBOS) {
        window.ARCA_RECIBOS.registarReciboDePagamento({
          numero: numRecibo,
          data: data,
          titular: `${socio.nome} (Sócio ${socio.numero})`,
          socioId: socio.id,
          socioNumero: socio.numero,
          finalidade: `Liquidação Quotas (${pendingPaymentYears.join(', ')})`,
          valor: pendingPaymentTotal,
          metodo: metodo,
          notas: `Registo gerado no pagamento de quotas na ficha do sócio.${notas ? ' ' + notas : ''}`
        });
      }

      updateStats();
      applyFilters();

      const anosTexto = pendingPaymentYears.join(', ');
      const totalPago = pendingPaymentTotal;

      closePagamentoModal();
      renderDrawerContent();

      showToast(`Pagamento das quotas (${anosTexto}) regularizado com sucesso! Recibo ${numRecibo || 'emitido'}.`, 'success');

      // Se solicitado, emitir recibo oficial
      if (emitirReciboChecked) {
        emitirReciboMultiplo(socio.id, pendingPaymentYears, totalPago, metodo, data, numRecibo);
      }
    };

    // Modal e Ação: Abrir Recibo Diretamente da Pasta de Recibos Emitidos a partir de Sócios
    window.abrirReciboDeSocios = async function(reciboNumero, socioId) {
      if (!reciboNumero) return;
      const r = window.ARCA_RECIBOS ? window.ARCA_RECIBOS.getByNumero(reciboNumero) : null;
      const socio = socios.find(s => s.id === socioId);

      const modal = document.getElementById('modalVerReciboSocio');
      if (!modal) {
        window.location.href = `tesouraria.html?tab=recibos&recibo=${encodeURIComponent(reciboNumero)}`;
        return;
      }

      const titleEl = document.getElementById('socioReciboModalTitle');
      const infoEl = document.getElementById('socioReciboModalInfo');
      const fileAreaEl = document.getElementById('socioReciboModalFileArea');
      const btnDownload = document.getElementById('socioReciboModalBtnDownload');
      const btnGoTesouraria = document.getElementById('socioReciboModalBtnTesouraria');
      const btnAlterarNum = document.getElementById('socioReciboModalBtnAlterar');

      const numStr = r ? (r.numero || r.recibo) : reciboNumero;
      const titularStr = r ? r.titular : (socio ? `${socio.nome} (Sócio ${socio.numero})` : 'Associado ARCA');
      const dataStr = r ? (r.data ? new Date(r.data).toLocaleDateString('pt-PT') : '25/11/2026') : '25/11/2026';
      const valorStr = r ? `${parseFloat(r.valor).toFixed(2).replace('.', ',')} €` : '6,00 €';
      const metodoStr = r ? r.metodo : 'Numerário';
      const finalidadeStr = r ? r.finalidade : 'Liquidação Quota Anual';
      const notasStr = r ? (r.notas || '') : '';
      const temScan = r && (r.fileBlob || r.temFicheiro);

      if (titleEl) titleEl.textContent = `Recibo Oficial Nº ${numStr}`;
      if (infoEl) {
        infoEl.innerHTML = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; font-size: 0.88rem; margin-bottom: 1.25rem;">
            <div><span style="color: var(--text-muted); font-size: 0.78rem;">Titular:</span><br><strong>${escapeHtml(titularStr)}</strong></div>
            <div><span style="color: var(--text-muted); font-size: 0.78rem;">Data de Emissão:</span><br><strong>${dataStr}</strong></div>
            <div><span style="color: var(--text-muted); font-size: 0.78rem;">Valor Liquidado:</span><br><strong style="color: #16a34a; font-size: 1.15rem;">${valorStr}</strong></div>
            <div><span style="color: var(--text-muted); font-size: 0.78rem;">Método de Liquidação:</span><br><strong>${escapeHtml(metodoStr)}</strong></div>
            <div style="grid-column: 1 / -1;"><span style="color: var(--text-muted); font-size: 0.78rem;">Finalidade / Descritivo:</span><br><strong>${escapeHtml(finalidadeStr)}</strong></div>
            ${notasStr ? `<div style="grid-column: 1 / -1;"><span style="color: var(--text-muted); font-size: 0.78rem;">Livro de Recibos / Observações:</span><br><span style="color: var(--text-title);">${escapeHtml(notasStr)}</span></div>` : ''}
          </div>
        `;
      }

      if (fileAreaEl) {
        if (temScan && r.fileName) {
          fileAreaEl.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: rgba(28, 109, 66, 0.08); border: 1px solid rgba(28, 109, 66, 0.25); border-radius: var(--radius-sm); margin-bottom: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.65rem;">
                <span style="font-size: 1.6rem;">📄</span>
                <div>
                  <strong style="color: var(--primary); font-size: 0.9rem;">${escapeHtml(r.fileName)}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Documento oficial arquivado na pasta de Recibos Emitidos (${r.fileSize || 'PDF'})</div>
                </div>
              </div>
              <button type="button" class="btn btn-primary btn-sm" onclick="window.ARCA_RECIBOS.download('${r.id || r.numero}')">
                📥 Download
              </button>
            </div>
          `;
        } else {
          fileAreaEl.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-sm); margin-bottom: 1.25rem;">
              <div style="display: flex; align-items: center; gap: 0.65rem;">
                <span style="font-size: 1.6rem;">🏛</span>
                <div>
                  <strong style="color: var(--text-title); font-size: 0.9rem;">Livro de Recibos Físico (Recibo ${numStr})</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Pode anexar a digitalização PDF/foto na pasta de Recibos Emitidos</div>
                </div>
              </div>
              <button type="button" class="btn btn-outline btn-sm" onclick="window.ARCA_RECIBOS.download('${r ? (r.id || r.numero) : numStr}')">
                📄 Descarregar Ficha
              </button>
            </div>
          `;
        }
      }

      if (btnGoTesouraria) {
        btnGoTesouraria.onclick = () => {
          window.location.href = `tesouraria.html?tab=recibos&recibo=${encodeURIComponent(numStr)}`;
        };
      }

      if (btnDownload) {
        btnDownload.onclick = () => {
          if (window.ARCA_RECIBOS) {
            window.ARCA_RECIBOS.download(r ? (r.id || r.numero) : numStr);
          }
        };
      }

      if (btnAlterarNum) {
        btnAlterarNum.onclick = () => {
          modal.classList.remove('active');
          const novoNum = prompt(`Indique o novo número de recibo do livro físico para esta quota:`, numStr);
          if (novoNum && novoNum.trim()) {
            const trimmed = novoNum.trim();
            if (socio && socio.quotas) {
              socio.quotas.forEach(q => {
                if (String(q.reciboNumero) === String(numStr)) {
                  q.reciboNumero = trimmed;
                }
              });
              saveSocios();
              renderDrawerContent();
              showToast(`Número de recibo alterado para "${trimmed}".`, 'success');
            }
          }
        };
      }

      modal.classList.add('active');
    };

    window.closeVerReciboSocioModal = function() {
      const modal = document.getElementById('modalVerReciboSocio');
      if (modal) modal.classList.remove('active');
    };

    window.associarReciboAQuota = function(socioId, ano) {
      const socio = socios.find(s => s.id === socioId);
      if (!socio || !socio.quotas) return;
      const q = socio.quotas.find(item => item.ano === ano);
      if (!q) return;

      const defaultNum = window.ARCA_RECIBOS ? window.ARCA_RECIBOS.getNextNumero() : '1351';
      const numDigitado = prompt(`Indique o número do recibo emitido do livro físico para a quota de ${ano} (ex: 1350):`, defaultNum);
      if (!numDigitado || !numDigitado.trim()) return;

      const numFinal = numDigitado.trim();
      q.reciboNumero = numFinal;
      q.recibo = true;

      // Sincronizar na pasta de Recibos Emitidos
      if (window.ARCA_RECIBOS) {
        window.ARCA_RECIBOS.registarReciboDePagamento({
          numero: numFinal,
          data: q.data || new Date().toISOString().slice(0, 10),
          titular: `${socio.nome} (Sócio ${socio.numero})`,
          socioId: socio.id,
          socioNumero: socio.numero,
          finalidade: `Liquidação Quota ${ano}`,
          valor: q.valor || 6.00,
          metodo: q.metodo || 'Numerário',
          notas: `Recibo associado manualmente à quota de ${ano}.`
        });
      }

      saveSocios();
      renderDrawerContent();
      showToast(`Recibo nº ${numFinal} associado à quota de ${ano} com sucesso!`, 'success');
    };

    // =========================================================================
    // 4.3. Emissão e Impressão de Recibo Oficial da ARCA
    // =========================================================================
    window.emitirReciboMultiplo = function(socioId, anosArray, valorTotal, metodo, data, customNum = null) {
      const socio = socios.find(s => s.id === socioId);
      if (!socio) return;

      const numRecibo = customNum || (window.ARCA_RECIBOS ? window.ARCA_RECIBOS.getNextNumero() : Math.floor(1000 + Math.random() * 9000));
      const dataFormatada = data ? new Date(data).toLocaleDateString('pt-PT') : new Date().toLocaleDateString('pt-PT');
      const anosTexto = Array.isArray(anosArray) ? anosArray.join(', ') : (anosArray || '2026');
      const totalValor = (valorTotal || 6.00).toFixed(2);

      const printWindow = window.open('', '', 'width=800,height=650');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Recibo Oficial de Quota - ARCA Aguada de Baixo</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1a271f; line-height: 1.6; background: #ffffff; }
            .receipt-box { border: 2px solid #1c6d42; border-radius: 12px; padding: 32px; position: relative; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eaf5ee; padding-bottom: 20px; margin-bottom: 25px; }
            .logo-text h1 { margin: 0; font-size: 24px; color: #1c6d42; letter-spacing: -0.5px; }
            .logo-text p { margin: 4px 0 0 0; font-size: 13px; color: #6b7f72; }
            .receipt-title { font-size: 20px; font-weight: bold; text-align: right; color: #1c6d42; }
            .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; }
            .total-row { border-top: 1px dashed #cbd5e1; padding-top: 15px; font-size: 18px; font-weight: bold; }
            .signature { margin-top: 55px; display: flex; justify-content: space-between; text-align: center; font-size: 13px; }
            .signature div { border-top: 1px solid #94a3b8; width: 230px; padding-top: 6px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="receipt-box">
            <div class="header">
              <div class="logo-text">
                <h1>A.R.C.A.</h1>
                <p>Associação de Recreio, Cultura e Assistência de Aguada de Baixo<br>NIF: 501 234 567 &bull; Aguada de Baixo, Águeda</p>
              </div>
              <div class="receipt-title">
                RECIBO Nº ${numRecibo}/2026<br>
                <small style="font-size: 13px; color: #64748b; font-weight: normal;">Data: ${dataFormatada}</small>
              </div>
            </div>

            <div class="row">
              <span><strong>Recebemos de:</strong> ${escapeHtml(socio.nome)}</span>
              <span><strong>Sócio Nº:</strong> ${socio.numero}</span>
            </div>
            <div class="row">
              <span><strong>NIF:</strong> ${escapeHtml(socio.nif || 'Consumidor Final')}</span>
              <span><strong>Categoria:</strong> ${escapeHtml(socio.categoria || 'Efetivo')}</span>
            </div>
            <div class="row">
              <span><strong>Morada:</strong> ${escapeHtml(socio.morada || 'Aguada de Baixo')}</span>
            </div>

            <div style="background: #f1f7f3; padding: 18px; border-radius: 8px; margin: 25px 0;">
              <div class="row" style="margin: 0;">
                <span>Liquidação da Quota de Associado (${anosTexto})</span>
                <strong>${totalValor} €</strong>
              </div>
              <div style="font-size: 13px; color: #64748b; margin-top: 6px;">
                Método de Liquidação: <strong>${escapeHtml(metodo || 'Numerário')}</strong>
              </div>
            </div>

            <div class="row total-row">
              <span>Total Liquidado</span>
              <span style="color: #1c6d42; font-size: 20px;">${totalValor} €</span>
            </div>

            <div class="signature">
              <div>O Associado</div>
              <div>Pela Direção da A.R.C.A.</div>
            </div>
          </div>

          <div class="no-print" style="margin-top: 25px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 25px; font-size: 16px; background: #1c6d42; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
              🖨️ Imprimir / Guardar em PDF
            </button>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
    };

    window.emitirReciboAno = function(socioId, ano) {
      const socio = socios.find(s => s.id === socioId);
      if (!socio) return;
      const q = socio.quotas ? socio.quotas.find(item => item.ano === ano) : null;
      const valor = q ? q.valor : 6.00;
      const metodo = q ? q.metodo : 'Numerário';
      const data = q ? q.data : new Date().toISOString().slice(0, 10);
      emitirReciboMultiplo(socioId, [ano], valor, metodo, data);
    };

    window.emitirRecibo = function(id) {
      const socio = socios.find(s => s.id === id);
      if (!socio) return;
      emitirReciboMultiplo(socio.id, [socio.ultimaQuota || 2026], 6.00, 'Numerário', new Date().toISOString().slice(0, 10));
    };

    // =========================================================================
    // 4.3.1. Contactar Administrador para Pagar Cotas (Solicitação por E-mail)
    // =========================================================================
    window.abrirModalContactoAdminPagamento = function(socioId) {
      const modal = document.getElementById('modalContactoAdminPagamento');
      if (!modal) return;

      const formView = document.getElementById('modalContactoAdminFormView');
      const sucessoView = document.getElementById('modalContactoAdminSucessoView');
      if (formView) formView.style.display = 'block';
      if (sucessoView) sucessoView.style.display = 'none';

      let socio = null;
      if (socioId) {
        socio = socios.find(s => s.id === socioId || Number(s.numero) === Number(socioId));
      }
      if (!socio && isOwnOnly) {
        socio = findCurrentUserSocio();
      }

      const inputId = document.getElementById('pedidoPagamentoSocioId');
      const elNome = document.getElementById('pedidoSocioNome');
      const elNumero = document.getElementById('pedidoSocioNumero');
      const elAnos = document.getElementById('pedidoSocioAnos');
      const elValor = document.getElementById('pedidoSocioValorTotal');
      const inputEmail = document.getElementById('pedidoEmail');
      const inputTel = document.getElementById('pedidoTelefone');

      if (socio) {
        if (inputId) inputId.value = socio.id;
        if (elNome) elNome.textContent = socio.nome;
        if (elNumero) elNumero.textContent = `Nº ${socio.numero}`;

        const unpaidQuotas = (socio.quotas || []).filter(q => !q.pago);
        const anosTexto = unpaidQuotas.length > 0 
          ? unpaidQuotas.map(q => q.ano).join(', ') 
          : (socio.divida > 0 ? `${Math.round(socio.divida / 6)} ano(s) em atraso` : 'Ano corrente (2026)');
        if (elAnos) elAnos.textContent = anosTexto;

        const totalDivida = socio.divida > 0 
          ? socio.divida 
          : (unpaidQuotas.length > 0 ? unpaidQuotas.reduce((sum, q) => sum + (q.valor || 6), 0) : 6.00);
        if (elValor) elValor.textContent = `${totalDivida.toFixed(2).replace('.', ',')} €`;

        if (inputEmail && !inputEmail.value) inputEmail.value = socio.email || (currentUser ? currentUser.email : '');
        if (inputTel && !inputTel.value) inputTel.value = socio.telefone || (currentUser ? currentUser.telefone : '');
      } else {
        if (inputId) inputId.value = '';
        if (elNome) elNome.textContent = currentUser ? currentUser.nome : 'Associado';
        if (elNumero) elNumero.textContent = (currentUser && currentUser.numeroSocio) ? `Nº ${currentUser.numeroSocio}` : 'A atribuir / Por associar';
        if (elAnos) elAnos.textContent = 'Quotas em atraso';
        if (elValor) elValor.textContent = '6,00 €';
        if (inputEmail && !inputEmail.value) inputEmail.value = currentUser ? (currentUser.email || '') : '';
        if (inputTel && !inputTel.value) inputTel.value = currentUser ? (currentUser.telefone || '') : '';
      }

      modal.classList.add('active');
    };

    window.closeModalContactoAdminPagamento = function() {
      const modal = document.getElementById('modalContactoAdminPagamento');
      if (modal) modal.classList.remove('active');
    };

    window.handleSubmeterPedidoPagamento = async function(event) {
      if (event && event.preventDefault) event.preventDefault();

      const btnSubmit = document.getElementById('btnSubmeterPedidoPagamento');
      const socioId = document.getElementById('pedidoPagamentoSocioId') ? document.getElementById('pedidoPagamentoSocioId').value : '';
      const socio = socios.find(s => String(s.id) === String(socioId)) || findCurrentUserSocio();

      const nomeSocio = document.getElementById('pedidoSocioNome') ? document.getElementById('pedidoSocioNome').textContent : (currentUser ? currentUser.nome : 'Associado');
      const numSocio = document.getElementById('pedidoSocioNumero') ? document.getElementById('pedidoSocioNumero').textContent : (currentUser && currentUser.numeroSocio ? currentUser.numeroSocio : '—');
      const anosSocio = document.getElementById('pedidoSocioAnos') ? document.getElementById('pedidoSocioAnos').textContent : '—';
      const valorTotal = document.getElementById('pedidoSocioValorTotal') ? document.getElementById('pedidoSocioValorTotal').textContent : '6,00 €';
      const metodoPref = document.getElementById('pedidoMetodoPref') ? document.getElementById('pedidoMetodoPref').value : 'MBWay';
      const emailContacto = document.getElementById('pedidoEmail') ? document.getElementById('pedidoEmail').value.trim() : '';
      const telContacto = document.getElementById('pedidoTelefone') ? document.getElementById('pedidoTelefone').value.trim() : '';
      const notas = document.getElementById('pedidoNotas') ? document.getElementById('pedidoNotas').value.trim() : '';

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span>⏳</span><span>A enviar pedido...</span>';
      }

      // Preparar payload para FormSubmit
      // Token verificado e ativo: e3981b43b2aa88b76aa6ddd0bd2f0821 (arca.aguadadebaixo@sapo.pt)
      const payload = {
        _subject: `[ARCA Gestão] Pedido de Pagamento de Cotas — ${nomeSocio} (${numSocio})`,
        _template: "table",
        _captcha: "false",
        "Tipo de Pedido": "Regularização / Pagamento de Cotas de Sócio",
        "Nome do Associado": nomeSocio,
        "Número de Sócio": numSocio,
        "Anos / Quotas a Regularizar": anosSocio,
        "Valor Total Previsto": valorTotal,
        "Método de Pagamento Preferido": metodoPref,
        "E-mail de Contacto": emailContacto,
        "Telemóvel": telContacto,
        "Notas do Associado": notas || "Nenhuma nota adicional.",
        "Data do Pedido": new Date().toLocaleString('pt-PT')
      };

      try {
        await fetch('https://formsubmit.co/ajax/e3981b43b2aa88b76aa6ddd0bd2f0821', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Envio via FormSubmit AJAX:', err);
      }

      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<span>✉️</span><span>Enviar Pedido à Direção</span>';
      }

      const formView = document.getElementById('modalContactoAdminFormView');
      const sucessoView = document.getElementById('modalContactoAdminSucessoView');
      if (formView) formView.style.display = 'none';
      if (sucessoView) sucessoView.style.display = 'block';

      showToast('Pedido de pagamento enviado com sucesso à Direção!', 'success');
    };

    // =========================================================================
    // 4.4. Filtros, Pesquisa e Ordenação da Tabela de Sócios
    // =========================================================================
    const searchInput = document.getElementById('searchInput');
    const filterMembro = document.getElementById('filterMembro');
    const filterStatus = document.getElementById('filterStatus');
    const filterCategory = document.getElementById('filterCategory');
    const sortSociosSelect = document.getElementById('sortSociosSelect');

    function applyFilters() {
      if (isOwnOnly) {
        const userSocio = findCurrentUserSocio();
        renderTable(userSocio ? [userSocio] : []);
        return;
      }

      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
      const membro = filterMembro ? filterMembro.value : 'Ativo';
      const status = filterStatus ? filterStatus.value : 'all';
      const cat = filterCategory ? filterCategory.value : 'all';

      const filtered = socios.filter(s => {
        const matchesQuery = !query || 
          s.nome.toLowerCase().includes(query) ||
          s.numero.toString().includes(query) ||
          (s.nif && s.nif.toLowerCase().includes(query)) ||
          (s.morada && s.morada.toLowerCase().includes(query)) ||
          (s.email && s.email.toLowerCase().includes(query)) ||
          (s.telefone && s.telefone.includes(query)) ||
          (s.observacoes && s.observacoes.toLowerCase().includes(query));

        const matchesMembro = (membro === 'all') || (s.estadoMembro === membro);
        
        let matchesStatus = true;
        if (status === 'Em Dia') {
          matchesStatus = (s.estado === 'Em Dia');
        } else if (status === 'Atrasado') {
          matchesStatus = (s.divida > 0);
        }

        const matchesCat = (cat === 'all') || (s.categoria && s.categoria.toLowerCase() === cat.toLowerCase());

        return matchesQuery && matchesMembro && matchesStatus && matchesCat;
      });

      // Ordenação Maior / Menor ou A-Z / Z-A
      filtered.sort((a, b) => {
        if (currentSortField === 'numero') {
          return currentSortDir === 'asc' ? (a.numero - b.numero) : (b.numero - a.numero);
        }
        if (currentSortField === 'divida' || currentSortField === 'emAtraso') {
          const dA = a.divida || 0;
          const dB = b.divida || 0;
          return currentSortDir === 'asc' ? (dA - dB) : (dB - dA);
        }
        if (currentSortField === 'ultimoAno') {
          const yA = parseInt(a.ultimaQuota) || 0;
          const yB = parseInt(b.ultimaQuota) || 0;
          return currentSortDir === 'asc' ? (yA - yB) : (yB - yA);
        }
        if (currentSortField === 'nome') {
          const c = a.nome.localeCompare(b.nome || '', 'pt', { sensitivity: 'base' });
          return currentSortDir === 'asc' ? c : -c;
        }
        if (currentSortField === 'localidade') {
          const locA = a.localidade || a.morada || '';
          const locB = b.localidade || b.morada || '';
          const c = locA.localeCompare(locB, 'pt', { sensitivity: 'base' });
          return currentSortDir === 'asc' ? c : -c;
        }
        if (currentSortField === 'categoria') {
          const c = (a.categoria || '').localeCompare(b.categoria || '', 'pt', { sensitivity: 'base' });
          return currentSortDir === 'asc' ? c : -c;
        }
        if (currentSortField === 'estadoMembro') {
          const c = (a.estadoMembro || '').localeCompare(b.estadoMembro || '', 'pt', { sensitivity: 'base' });
          return currentSortDir === 'asc' ? c : -c;
        }
        return 0;
      });

      renderTable(filtered);
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (filterMembro) filterMembro.addEventListener('change', applyFilters);
    if (filterStatus) filterStatus.addEventListener('change', applyFilters);
    if (filterCategory) filterCategory.addEventListener('change', applyFilters);

    if (sortSociosSelect) {
      sortSociosSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const lastUnderscore = val.lastIndexOf('_');
        const field = val.slice(0, lastUnderscore);
        const dir = val.slice(lastUnderscore + 1);
        currentSortField = field;
        currentSortDir = dir || 'asc';
        updateSortIndicators();
        applyFilters();
      });
    }

    // =========================================================================
    // 4.5. Modal: Criar Nova Ficha de Sócio
    // =========================================================================
    const modalNewSocio = document.getElementById('modalNewSocio');
    const btnOpenNewSocio = document.getElementById('btnOpenNewSocioModal');
    const btnCloseNewSocio = document.getElementById('btnCloseNewSocioModal');
    const btnCancelNewSocio = document.getElementById('btnCancelNewSocio');
    const formNewSocio = document.getElementById('formNewSocio');

    if (btnOpenNewSocio && modalNewSocio) {
      btnOpenNewSocio.addEventListener('click', () => {
        // Sugerir próximo número de sócio disponível
        const maxNum = socios.reduce((max, s) => Math.max(max, s.numero || 0), 0);
        const elNum = document.getElementById('newNumero');
        if (elNum) elNum.value = maxNum + 1;
        modalNewSocio.classList.add('active');
      });

      if (btnCloseNewSocio) btnCloseNewSocio.addEventListener('click', () => modalNewSocio.classList.remove('active'));
      if (btnCancelNewSocio) btnCancelNewSocio.addEventListener('click', () => modalNewSocio.classList.remove('active'));

      if (formNewSocio) {
        formNewSocio.addEventListener('submit', (e) => {
          e.preventDefault();

          const numero = parseInt(document.getElementById('newNumero').value);
          const nome = document.getElementById('newNome').value.trim();
          const nif = document.getElementById('newNif').value.trim();
          const nascimento = document.getElementById('newNascimento').value;
          const telefone = document.getElementById('newTelefone').value.trim();
          const email = document.getElementById('newEmail').value.trim();
          const morada = document.getElementById('newMorada').value.trim();
          const codPostal = document.getElementById('newCodPostal').value.trim();
          const localidade = document.getElementById('newLocalidade').value.trim() || 'Aguada de Baixo';
          const categoria = document.getElementById('newCategoria').value;
          const estadoMembro = document.getElementById('newEstadoMembro').value;
          const observacoes = document.getElementById('newObservacoes').value.trim();

          if (!numero || !nome) {
            showToast('Por favor, preencha o número e o nome do associado.', 'error');
            return;
          }

          // Verificar se número já existe
          const conflict = socios.find(s => s.numero === numero);
          if (conflict) {
            showToast(`O Nº de sócio ${numero} já se encontra atribuído a ${conflict.nome}. Escolha outro número.`, 'error');
            return;
          }

          const newId = Math.max(...socios.map(s => s.id || 0), 0) + 1;
          const todayIso = new Date().toISOString().slice(0, 10);

          const newSocio = {
            id: newId,
            numero: numero,
            nome: nome,
            nif: nif,
            dataNascimento: nascimento,
            telefone: telefone,
            email: email,
            morada: morada,
            codPostal: codPostal,
            localidade: localidade,
            dataInscricao: todayIso,
            categoria: categoria,
            estadoMembro: estadoMembro,
            divida: 0,
            ultimaQuota: 2026,
            valorQuota: 6.00,
            estado: 'Em Dia',
            rgpdData: todayIso,
            observacoes: observacoes ? `Inscrição em ${todayIso}. ${observacoes}` : `Inscrição registada em ${todayIso}.`,
            quotas: [
              {
                ano: 2026,
                valor: 6.00,
                pago: true,
                estado: 'Pago',
                data: todayIso,
                metodo: 'Numerário',
                recibo: true
              }
            ]
          };

          socios.unshift(newSocio);
          saveSocios();
          updateStats();
          applyFilters();

          formNewSocio.reset();
          modalNewSocio.classList.remove('active');
          showToast(`Sócio nº ${numero} (${nome}) adicionado com sucesso!`, 'success');
        });
      }
    }

    // =========================================================================
    // 4.6. Exportar CSV Oficial Completo
    // =========================================================================
    const btnExportCsv = document.getElementById('btnExportCsv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        let csv = "data:text/csv;charset=utf-8,\uFEFF";
        csv += "Nº;Nome;NIF;Categoria;Telefone;Email;Morada;Localidade;Dívida (€);Último Ano Pago;Situação;Estado Cota;Observações\n";

        socios.forEach(s => {
          const obsClean = (s.observacoes || '').replace(/"/g, '""').replace(/\r?\n/g, ' ');
          const moradaClean = (s.morada || '').replace(/"/g, '""');
          const locClean = (s.localidade || '').replace(/"/g, '""');
          csv += `"${s.numero}";"${s.nome}";"${s.nif || ''}";"${s.categoria || 'Efetivo'}";"${s.telefone || ''}";"${s.email || ''}";"${moradaClean}";"${locClean}";"${s.divida || 0}";"${s.ultimaQuota || ''}";"${s.estadoMembro}";"${s.estado}";"${obsClean}"\n`;
        });

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csv));
        link.setAttribute("download", `ARCA_Socios_Oficial_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Lista oficial de sócios exportada com sucesso!', 'success');
      });
    }

    // Se for modo 'own' (Própria Ficha), esconder botões de exportação e criação de novos sócios e ajustar badge
    if (isOwnOnly) {
      const btnExportCsv = document.getElementById('btnExportCsv');
      if (btnExportCsv) btnExportCsv.style.display = 'none';
      const btnNewSocio = document.getElementById('btnOpenNewSocioModal');
      if (btnNewSocio) btnNewSocio.style.display = 'none';
      const colPicker = document.getElementById('btnToggleColPickerSocios');
      if (colPicker) colPicker.style.display = 'none';
      const searchBox = document.getElementById('searchSocios');
      if (searchBox) searchBox.placeholder = 'A sua ficha de associado...';

      // Atualizar badge da barra lateral de 386 para 1
      document.querySelectorAll('.app-sidebar a[href*="socios"], .sidebar-nav a[href*="socios"]').forEach(link => {
        const badge = link.querySelector('.badge, .nav-badge, span[style*="font-size"]');
        if (badge) badge.textContent = '1';
      });
    }

    // Inicialização da Tabela, Filtros e Indicadores
    initSociosColPicker();
    updateSortIndicators();
    updateStats();
    applyFilters();
  }

});
