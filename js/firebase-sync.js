// =========================================================================
// ARCA - Sincronização em Tempo Real com Google Cloud Firestore
// Projeto: arca-gestao-af345
// =========================================================================

const ARCA_FIREBASE_CONFIG = {
  projectId: "arca-gestao-af345",
  appId: "1:638800434029:web:eda34bd495b6895b408064",
  storageBucket: "arca-gestao-af345.firebasestorage.app",
  apiKey: "AIzaSyC2es0kH6zjln0yTiUyVk0KbkttapMbYlk",
  authDomain: "arca-gestao-af345.firebaseapp.com",
  messagingSenderId: "638800434029",
  measurementId: "G-9L63X10HLD"
};

(function() {
  let db = null;
  let isInitialized = false;

  function initFirebase() {
    if (isInitialized) return db;
    if (typeof firebase === 'undefined') {
      console.warn('[ARCA Firebase] SDK do Firebase ainda não carregado.');
      return null;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(ARCA_FIREBASE_CONFIG);
      }
      db = firebase.firestore();
      isInitialized = true;
      console.log('[ARCA Firebase] Cloud Firestore inicializado com sucesso.');
      return db;
    } catch (err) {
      console.warn('[ARCA Firebase] Erro ao inicializar Firestore:', err);
      return null;
    }
  }

  // Obter instância do Firestore
  window.getArcaFirestore = function() {
    return initFirebase();
  };

  // Carregar utilizadores da Nuvem (Firestore) e sincronizar com localStorage
  window.syncArcaUtilizadoresFromCloud = async function(onUpdated) {
    const firestore = initFirebase();
    if (!firestore) return null;

    try {
      const snapshot = await firestore.collection('utilizadores').get();
      let cloudUsers = [];
      let deletedIds = [];
      try {
        deletedIds = JSON.parse(localStorage.getItem('arca_deleted_user_ids') || '[]');
      } catch (e) {}

      snapshot.forEach(doc => {
        const u = doc.data();
        if (u && u.id && !deletedIds.includes(Number(u.id))) {
          cloudUsers.push(u);
        }
      });

      // Se a base de dados na nuvem estiver completamente vazia, semear contas iniciais
      const hasJorge = cloudUsers.some(u => (u.login && u.login.toLowerCase() === 'jorge') || Number(u.id) === 1);
      if (!hasJorge && cloudUsers.length === 0) {
        console.log('[ARCA Firebase] A sincronizar/semear contas oficiais da ARCA na nuvem...');
        await window.seedInitialUsersToCloud();
        
        // Recarregar
        const refreshedSnap = await firestore.collection('utilizadores').get();
        cloudUsers = [];
        refreshedSnap.forEach(doc => {
          const u = doc.data();
          if (u && u.id && !deletedIds.includes(Number(u.id))) {
            cloudUsers.push(u);
          }
        });
      }

      // Garantir número de sócio correto para Raquel Alexandra Marques da Cunha (Sócia nº 414)
      const rIdx = cloudUsers.findIndex(c => c.login === 'raquel.cunha');
      if (rIdx !== -1 && (!cloudUsers[rIdx].numeroSocio || cloudUsers[rIdx].numeroSocio === 305)) {
        cloudUsers[rIdx].numeroSocio = 414;
      }

      // Ordenar por ID crescente
      cloudUsers.sort((a, b) => (a.id || 0) - (b.id || 0));

      // Atualizar cache local
      localStorage.setItem('arca_utilizadores_v2', JSON.stringify(cloudUsers));
      console.log(`[ARCA Firebase] ${cloudUsers.length} utilizadores sincronizados da nuvem.`);

      if (typeof onUpdated === 'function') {
        onUpdated(cloudUsers);
      }
      return cloudUsers;
    } catch (err) {
      console.warn('[ARCA Firebase] Aviso ao sincronizar com nuvem (a usar cache local):', err.message);
      return null;
    }
  };

  // Subscrição em Tempo Real (onSnapshot)
  window.listenArcaUtilizadoresRealtime = function(callback) {
    const firestore = initFirebase();
    if (!firestore) return null;

    try {
      return firestore.collection('utilizadores').onSnapshot((snapshot) => {
        const cloudUsers = [];
        let deletedIds = [];
        try {
          deletedIds = JSON.parse(localStorage.getItem('arca_deleted_user_ids') || '[]');
        } catch (e) {}

        snapshot.forEach(doc => {
          const u = doc.data();
          if (u && u.id) {
            // Se o utilizador foi eliminado pelo administrador, ignorar
            if (deletedIds.includes(Number(u.id))) return;
            cloudUsers.push(u);
          }
        });

        // Garantir APENAS que a conta do Administrador Total Jorge (ID 1) está sempre presente
        const hasAdmin = cloudUsers.some(c => (c.login && c.login.toLowerCase() === 'jorge') || Number(c.id) === 1);
        if (!hasAdmin) {
          const adminSeed = {
            id: 1,
            nome: "Jorge Manuel da Silva Cunha",
            login: "jorge",
            username: "@jorge",
            email: "scunhajorge@gmail.com",
            telefone: "966 100 115",
            morada: "Rua Direita, 45 - Aguada de Baixo",
            numeroSocio: 1,
            perfil: "Administrador Total",
            estado: "Ativo",
            motivo_suspensao: "",
            data_registo: "2024-01-10",
            data_rgpd: "2024-01-10",
            ultimo_acesso: "Hoje",
            foto: "",
            permissoes_modulos: {
              painel: { enabled: true, mode: "full", submenus: ["indicadores"] },
              socios: { enabled: true, mode: "full", submenus: ["consultar", "editar", "quotas", "pagamentos"] },
              tesouraria: { enabled: true, mode: "full", submenus: ["resumo", "contas", "movimentos", "recibos"] },
              direcao: { enabled: true, mode: "full", submenus: ["membros", "atas", "comunicados"] },
              desporto: { enabled: true, mode: "full", submenus: ["diretor", "delegado", "fisio", "seguros"] },
              documentos: { enabled: true, mode: "full", submenus: ["consultar", "upload", "gerir"] },
              administracao: { enabled: true, mode: "full", submenus: ["utilizadores", "configuracoes", "seguranca"] }
            }
          };
          cloudUsers.unshift(adminSeed);
          window.saveArcaUtilizadorToCloud(adminSeed);
        }

        // Garantir número de sócio correto para Raquel Alexandra Marques da Cunha (Sócia nº 414)
        const rIdx = cloudUsers.findIndex(c => c.login === 'raquel.cunha');
        if (rIdx !== -1 && (!cloudUsers[rIdx].numeroSocio || cloudUsers[rIdx].numeroSocio === 305)) {
          cloudUsers[rIdx].numeroSocio = 414;
        }

        cloudUsers.sort((a, b) => (a.id || 0) - (b.id || 0));
        localStorage.setItem('arca_utilizadores_v2', JSON.stringify(cloudUsers));
        if (typeof callback === 'function') {
          callback(cloudUsers);
        }
      }, (err) => {
        console.warn('[ARCA Firebase] Erro no listener em tempo real:', err.message);
      });
    } catch (err) {
      console.warn('[ARCA Firebase] Falha ao iniciar listener:', err);
      return null;
    }
  };

  // Guardar ou Atualizar Utilizador na Nuvem (Gravação Completa)
  window.saveArcaUtilizadorToCloud = async function(user) {
    const firestore = initFirebase();
    if (!firestore || !user || !user.id) return false;

    try {
      const docId = String(user.id);
      
      // Remover do registo de eliminados caso tenha sido recriado
      try {
        let deletedIds = JSON.parse(localStorage.getItem('arca_deleted_user_ids') || '[]');
        deletedIds = deletedIds.filter(id => id !== Number(user.id));
        localStorage.setItem('arca_deleted_user_ids', JSON.stringify(deletedIds));
      } catch (e) {}

      // Sanitizar dados para Firestore (sem valores undefined)
      const cleanUser = {
        id: Number(user.id),
        login: String(user.login || '').trim(),
        username: String(user.username || ('@' + (user.login || ''))).trim(),
        nome: String(user.nome || '').trim(),
        email: String(user.email || '').trim(),
        telefone: String(user.telefone || '').trim(),
        morada: String(user.morada || 'Aguada de Baixo').trim(),
        numeroSocio: (user.numeroSocio !== null && user.numeroSocio !== undefined && user.numeroSocio !== '') ? Number(user.numeroSocio) : null,
        perfil: String(user.perfil || 'Utilizador Geral').trim(),
        estado: String(user.estado || 'Ativo').trim(),
        password: String(user.password || 'arca2026').trim(),
        data_registo: String(user.data_registo || new Date().toISOString().slice(0, 10)),
        data_rgpd: String(user.data_rgpd || new Date().toISOString().slice(0, 10)),
        ultimo_acesso: String(user.ultimo_acesso || 'Nunca'),
        motivo_suspensao: String(user.motivo_suspensao || ''),
        foto: String(user.foto || ''),
        permissoes_modulos: user.permissoes_modulos || {}
      };

      // Substituição completa do documento no Firestore (sem merge) para persistir remoção de módulos desativados
      await firestore.collection('utilizadores').doc(docId).set(cleanUser);
      console.log(`[ARCA Firebase] Utilizador ${cleanUser.nome} (ID: ${cleanUser.id}) gravado com sucesso na nuvem.`);
      return true;
    } catch (err) {
      console.warn('[ARCA Firebase] Erro ao gravar utilizador na nuvem:', err);
      return false;
    }
  };

  // Eliminar Utilizador na Nuvem Definitivamente
  window.deleteArcaUtilizadorFromCloud = async function(userId) {
    const firestore = initFirebase();
    if (!firestore || !userId) return false;

    try {
      const numId = Number(userId);
      const docId = String(userId);

      // 1. Marcar como eliminado localmente para nunca ressuscitar
      try {
        const deletedIds = JSON.parse(localStorage.getItem('arca_deleted_user_ids') || '[]');
        if (!deletedIds.includes(numId)) {
          deletedIds.push(numId);
          localStorage.setItem('arca_deleted_user_ids', JSON.stringify(deletedIds));
        }
      } catch (e) {}

      // 2. Apagar por ID direto do documento
      await firestore.collection('utilizadores').doc(docId).delete();

      // 3. Salvaguarda: caso o documento tenha sido gravado com outro docId, procurar por campo id
      const qSnap = await firestore.collection('utilizadores').where('id', '==', numId).get();
      qSnap.forEach(async (doc) => {
        if (doc.id !== docId) {
          await doc.ref.delete();
        }
      });

      console.log(`[ARCA Firebase] Utilizador ID ${userId} eliminado permanentemente da nuvem.`);
      return true;
    } catch (err) {
      console.warn('[ARCA Firebase] Erro ao eliminar utilizador da nuvem:', err);
      return false;
    }
  };

  // Remover e-mail específico de todo o sistema (Nuvem e Local)
  window.purgeEmailFromArcaSystem = async function(targetEmail) {
    if (!targetEmail) return;
    const cleanTarget = targetEmail.trim().toLowerCase();

    // 1. Limpar do localStorage
    try {
      const local = JSON.parse(localStorage.getItem('arca_utilizadores_v2')) || [];
      const filtered = local.filter(u => !(u.email && u.email.trim().toLowerCase() === cleanTarget));
      if (filtered.length !== local.length) {
        localStorage.setItem('arca_utilizadores_v2', JSON.stringify(filtered));
        console.log(`[ARCA Firebase] E-mail ${cleanTarget} removido do cache local.`);
      }
    } catch (e) {}

    // 2. Limpar do Cloud Firestore
    const firestore = initFirebase();
    if (firestore) {
      try {
        const snap = await firestore.collection('utilizadores').get();
        snap.forEach(async (doc) => {
          const data = doc.data();
          if (data && data.email && data.email.trim().toLowerCase() === cleanTarget) {
            console.log(`[ARCA Firebase] A apagar conta com e-mail ${cleanTarget} da nuvem (Doc ID: ${doc.id})`);
            await firestore.collection('utilizadores').doc(doc.id).delete();
          }
        });
      } catch (err) {
        console.warn('[ARCA Firebase] Erro ao purgar e-mail do Firestore:', err);
      }
    }
  };

  // Semear utilizadores padrão na nuvem
  window.seedInitialUsersToCloud = async function() {
    const firestore = initFirebase();
    if (!firestore) return;

    const seedUsers = (typeof window.getArcaUtilizadores === 'function') ? window.getArcaUtilizadores() : [];
    if (!seedUsers.length) return;

    const batch = firestore.batch();

    seedUsers.forEach(u => {
      if (u && u.id) {
        const docRef = firestore.collection('utilizadores').doc(String(u.id));
        batch.set(docRef, u, { merge: true });
      }
    });

    try {
      await batch.commit();
      console.log('[ARCA Firebase] Contas padrão semeadas com sucesso no Firestore!');
    } catch (err) {
      console.warn('[ARCA Firebase] Erro ao semear contas:', err);
    }
  };

  // Inicialização automática ao carregar
  document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
  });
})();
