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
      const OFFICIAL_USER_IDS = new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]);
      let deletedIds = [];
      try {
        deletedIds = JSON.parse(localStorage.getItem('arca_deleted_user_ids') || '[]');
        // Apenas o Administrador Total (Jorge, ID 1) não pode constar na lista de eliminados
        if (Array.isArray(deletedIds) && deletedIds.includes(1)) {
          deletedIds = deletedIds.filter(id => Number(id) !== 1);
          localStorage.setItem('arca_deleted_user_ids', JSON.stringify(deletedIds));
        }
      } catch (e) { deletedIds = []; }

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

      // Se houver membros oficiais do seed que ainda não existem na nuvem, adicioná-los e persistir
      const seedList = (typeof window.getArcaUtilizadoresSeed === 'function') 
        ? window.getArcaUtilizadoresSeed() 
        : ((typeof window.getArcaUtilizadores === 'function') ? window.getArcaUtilizadores() : []);

      let missingSeeds = [];
      seedList.forEach(su => {
        if (!deletedIds.includes(Number(su.id))) {
          const exists = cloudUsers.some(cu => 
            Number(cu.id) === Number(su.id) || 
            (cu.login && su.login && cu.login.toLowerCase() === su.login.toLowerCase()) ||
            (cu.nome && su.nome && cu.nome.trim().toLowerCase() === su.nome.trim().toLowerCase())
          );
          if (!exists) {
            missingSeeds.push(su);
          }
        }
      });

      if (missingSeeds.length > 0) {
        console.log(`[ARCA Firebase] A registar ${missingSeeds.length} membros oficiais em falta no Firestore...`);
        const batch = firestore.batch();
        missingSeeds.forEach(su => {
          const docRef = firestore.collection('utilizadores').doc(String(su.id));
          batch.set(docRef, su, { merge: true });
          cloudUsers.push(su);
        });
        try {
          await batch.commit();
        } catch (errBatch) {
          console.warn('[ARCA Firebase] Erro ao gravar batch de membros:', errBatch);
        }
      }

      // DEDUPLICAÇÃO ESTRITA: Garantir que não há utilizadores repetidos por ID ou por login
      const seenIds = new Set();
      const seenLogins = new Set();
      const uniqueCloudUsers = [];

      // Ordenar dando prioridade aos IDs oficiais (1 a 23)
      cloudUsers.sort((a, b) => {
        const isOfficialA = OFFICIAL_USER_IDS.has(Number(a.id)) ? 0 : 1;
        const isOfficialB = OFFICIAL_USER_IDS.has(Number(b.id)) ? 0 : 1;
        if (isOfficialA !== isOfficialB) return isOfficialA - isOfficialB;
        return (Number(a.id) || 0) - (Number(b.id) || 0);
      });

      for (const u of cloudUsers) {
        const uId = Number(u.id);
        const uLog = (u.login || '').trim().toLowerCase();
        if (!seenIds.has(uId) && (!uLog || !seenLogins.has(uLog))) {
          seenIds.add(uId);
          if (uLog) seenLogins.add(uLog);
          uniqueCloudUsers.push(u);
        }
      }
      cloudUsers = uniqueCloudUsers;

      // Garantir permissões e atributos do Presidente Jorge (ID: 1)
      const jIdx = cloudUsers.findIndex(c => Number(c.id) === 1 || (c.login && c.login.toLowerCase() === 'jorge'));
      if (jIdx !== -1) {
        cloudUsers[jIdx].perfil = 'Administrador Total';
        cloudUsers[jIdx].orgao = 'Direção';
        cloudUsers[jIdx].cargo = 'Presidente';
        cloudUsers[jIdx].estado = 'Ativo';
        cloudUsers[jIdx].permissoes_modulos = {
          painel: { enabled: true, mode: "full", submenus: ["indicadores", "avisos"] },
          socios: { enabled: true, mode: "full", submenus: ["consultar", "editar", "pagamentos", "exportar"] },
          tesouraria: { enabled: true, mode: "full", submenus: ["caixa", "recibos", "fornecedores", "pos"] },
          direcao: { enabled: true, mode: "full", submenus: ["membros", "membros_gestao", "atas", "exercicio"] },
          desporto: { enabled: true, mode: "full", submenus: ["diretor", "delegado", "fisio", "seguros"] },
          documentos: { enabled: true, mode: "full", submenus: ["consultar", "upload", "eliminar"] },
          administracao: { enabled: true, mode: "full", submenus: ["utilizadores_ver", "utilizadores_gerir", "pedidos", "logs"] }
        };
      }

      // Garantir número de sócio correto para Raquel Alexandra Marques da Cunha (Sócia nº 414)
      const rIdx = cloudUsers.findIndex(c => c.login === 'raquel.cunha');
      if (rIdx !== -1 && (!cloudUsers[rIdx].numeroSocio || cloudUsers[rIdx].numeroSocio === 305)) {
        cloudUsers[rIdx].numeroSocio = 414;
      }

      // Ordenar por ID crescente
      cloudUsers.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));

      // Atualizar cache local
      localStorage.setItem('arca_utilizadores_v2', JSON.stringify(cloudUsers));
      console.log(`[ARCA Firebase] ${cloudUsers.length} utilizadores sincronizados da nuvem (sem duplicados).`);

      if (typeof onUpdated === 'function') {
        onUpdated(cloudUsers);
      }
      return cloudUsers;
    } catch (err) {
      console.warn('[ARCA Firebase] Aviso ao sincronizar com nuvem (a usar cache local):', err.message);
      return null;
    }
  };

  // =========================================================================
  // Subscrição em Tempo Real (onSnapshot) - Estritamente para Alertas Pendentes
  // =========================================================================
  // Listener restrito apenas para novos pedidos de registo que aguardam aprovação (0 a poucos documentos)
  window.listenPedidosPendentesRealtime = function(callback) {
    const firestore = initFirebase();
    if (!firestore) return null;

    try {
      return firestore.collection('utilizadores').where('estado', '==', 'Pendente').onSnapshot((snapshot) => {
        const pendentes = [];
        snapshot.forEach(doc => {
          const u = doc.data();
          if (u && u.id) pendentes.push(u);
        });
        if (typeof callback === 'function') {
          callback(pendentes);
        }
      }, (err) => {
        console.warn('[ARCA Firebase] Erro ao escutar pedidos pendentes:', err.message);
      });
    } catch (err) {
      console.warn('[ARCA Firebase] Falha ao iniciar listener restrito:', err);
      return null;
    }
  };

  // Compatibilidade: substitui o onSnapshot da lista completa por leitura normal sob demanda
  window.listenArcaUtilizadoresRealtime = function(callback) {
    // Em vez de manter um listener aberto na coleção inteira, efetua uma leitura única normal (getDocs)
    window.syncArcaUtilizadoresFromCloud(callback);
    return () => {}; // No-op unsubscribe
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
        orgao: String(user.orgao || 'Nenhum').trim(),
        cargo: String(user.cargo || '').trim(),
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

      // 2. Apagar imediatamente da base de utilizadores local (arca_utilizadores_v2)
      try {
        let users = JSON.parse(localStorage.getItem('arca_utilizadores_v2') || '[]');
        users = users.filter(u => Number(u.id) !== numId);
        localStorage.setItem('arca_utilizadores_v2', JSON.stringify(users));
      } catch (e) {}

      // 3. Apagar imediatamente da base de órgãos sociais se existir (arca_membros_orgaos_v4)
      try {
        let membros = JSON.parse(localStorage.getItem('arca_membros_orgaos_v4') || '[]');
        membros = membros.filter(m => Number(m.id) !== numId);
        localStorage.setItem('arca_membros_orgaos_v4', JSON.stringify(membros));
      } catch (e) {}

      // 4. Apagar por ID direto do documento
      await firestore.collection('utilizadores').doc(docId).delete();

      // 5. Salvaguarda: caso o documento tenha sido gravado com outro docId, procurar por campo id
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

  // =========================================================================
  // GESTÃO E SINCRONIZAÇÃO DE ATAS DA DIREÇÃO NA NUVEM (FIRESTORE)
  // =========================================================================
  const ARCA_ATAS_STORAGE_KEY = 'arca_atas_v1';

  window.syncArcaAtasFromCloud = async function(onUpdated) {
    const firestore = initFirebase();
    if (!firestore) return null;

    try {
      const snapshot = await firestore.collection('atas').get();
      let cloudAtas = [];
      let deletedIds = [];
      try {
        deletedIds = JSON.parse(localStorage.getItem('arca_deleted_ata_ids') || '[]');
      } catch (e) {}

      snapshot.forEach(doc => {
        const a = doc.data();
        if (a && a.id && !deletedIds.includes(Number(a.id))) {
          cloudAtas.push(a);
        }
      });

      // Se o Firestore não tiver atas ou estiver incompleto, semear com as atas oficiais da ARCA
      const seedList = (typeof window.getArcaAtasSeed === 'function') ? window.getArcaAtasSeed() : [];
      let missingSeeds = [];
      seedList.forEach(sa => {
        if (!deletedIds.includes(Number(sa.id))) {
          const exists = cloudAtas.some(ca => Number(ca.id) === Number(sa.id) || (ca.referencia && ca.referencia === sa.referencia));
          if (!exists) {
            missingSeeds.push(sa);
          }
        }
      });

      if (missingSeeds.length > 0) {
        console.log(`[ARCA Firebase] A sincronizar ${missingSeeds.length} atas oficiais para o Firestore...`);
        const batch = firestore.batch();
        missingSeeds.forEach(sa => {
          const docRef = firestore.collection('atas').doc(String(sa.id));
          batch.set(docRef, sa, { merge: true });
          cloudAtas.push(sa);
        });
        try {
          await batch.commit();
        } catch (e) {
          console.warn('[ARCA Firebase] Erro ao gravar batch de atas:', e);
        }
      }

      // Ordenar por ID decrescente (mais recentes primeiro)
      cloudAtas.sort((a, b) => (b.numero || b.id || 0) - (a.numero || a.id || 0));

      // Guardar na cache local
      localStorage.setItem(ARCA_ATAS_STORAGE_KEY, JSON.stringify(cloudAtas));
      console.log(`[ARCA Firebase] ${cloudAtas.length} atas sincronizadas da nuvem.`);

      if (typeof onUpdated === 'function') {
        onUpdated(cloudAtas);
      }
      return cloudAtas;
    } catch (err) {
      console.warn('[ARCA Firebase] Aviso ao sincronizar atas da nuvem:', err.message);
      return null;
    }
  };

  window.saveArcaAtaToCloud = async function(ata) {
    const firestore = initFirebase();
    if (!firestore || !ata || !ata.id) return false;

    try {
      const docId = String(ata.id);

      // Limpar do registo de eliminados
      try {
        let deletedIds = JSON.parse(localStorage.getItem('arca_deleted_ata_ids') || '[]');
        deletedIds = deletedIds.filter(id => id !== Number(ata.id));
        localStorage.setItem('arca_deleted_ata_ids', JSON.stringify(deletedIds));
      } catch (e) {}

      // Sanitizar dados
      const cleanAta = {
        id: Number(ata.id),
        numero: Number(ata.numero || ata.id),
        referencia: String(ata.referencia || '').trim(),
        tipo: String(ata.tipo || 'Reunião de Direção').trim(),
        data: String(ata.data || new Date().toISOString().slice(0, 10)),
        horaInicio: String(ata.horaInicio || '21:00').trim(),
        horaFim: String(ata.horaFim || '').trim(),
        local: String(ata.local || 'Pavilhão Carlos Almeida, Aguada de Baixo').trim(),
        presidiu: String(ata.presidiu || 'Jorge Manuel da Silva Cunha').trim(),
        secretariou: String(ata.secretariou || 'Raquel Alexandra Marques da Cunha').trim(),
        presencas: Array.isArray(ata.presencas) ? ata.presencas : [],
        outrasPresencas: String(ata.outrasPresencas || '').trim(),
        pontos: Array.isArray(ata.pontos) ? ata.pontos : [],
        estado: String(ata.estado || 'Rascunho').trim(),
        observacoes: String(ata.observacoes || '').trim(),
        assinaturas: Array.isArray(ata.assinaturas) ? ata.assinaturas : [],
        anexos: Array.isArray(ata.anexos) ? ata.anexos : [],
        criadoEm: String(ata.criadoEm || new Date().toISOString()),
        atualizadoEm: new Date().toISOString()
      };

      await firestore.collection('atas').doc(docId).set(cleanAta);
      console.log(`[ARCA Firebase] Ata ${cleanAta.referencia || cleanAta.id} gravada com sucesso no Firestore.`);
      return true;
    } catch (err) {
      console.warn('[ARCA Firebase] Erro ao gravar ata na nuvem:', err);
      return false;
    }
  };

  window.deleteArcaAtaFromCloud = async function(ataId) {
    const firestore = initFirebase();
    if (!firestore || !ataId) return false;

    try {
      const numId = Number(ataId);
      const docId = String(ataId);

      try {
        const deletedIds = JSON.parse(localStorage.getItem('arca_deleted_ata_ids') || '[]');
        if (!deletedIds.includes(numId)) {
          deletedIds.push(numId);
          localStorage.setItem('arca_deleted_ata_ids', JSON.stringify(deletedIds));
        }
      } catch (e) {}

      await firestore.collection('atas').doc(docId).delete();
      console.log(`[ARCA Firebase] Ata ID ${ataId} eliminada do Firestore.`);
      return true;
    } catch (err) {
      console.warn('[ARCA Firebase] Erro ao eliminar ata do Firestore:', err);
      return false;
    }
  };

  // =========================================================================
  // GESTÃO E SINCRONIZAÇÃO DE AGENDAS (JOGOS, EVENTOS, REUNIÕES, TAREFAS)
  // =========================================================================

  const ARCA_AGENDA_STORAGE_KEY = 'arca_gestao_agenda_v2';
  const ARCA_DELETED_AGENDA_KEY = 'arca_deleted_agenda_ids';

  window.syncArcaAgendaFromCloud = async function(onUpdated) {
    const firestore = initFirebase();
    if (!firestore) return null;

    try {
      const snapshot = await firestore.collection('agenda_gestao').get();
      let cloudItems = [];
      let deletedIds = [];
      try {
        deletedIds = JSON.parse(localStorage.getItem(ARCA_DELETED_AGENDA_KEY) || '[]');
      } catch (e) {}

      const seedList = (typeof window.getArcaAgendaSeed === 'function') ? window.getArcaAgendaSeed() : [];

      // Verificar se o Firestore ainda tem os jogos de exemplo antigos
      let needsFullMigration = false;
      snapshot.forEach(doc => {
        const item = doc.data();
        if (item && item.categoria === 'jogos') {
          // Os jogos oficiais têm criadoPor com 'Importação'
          if (!item.criadoPor || (!item.criadoPor.includes('Importação') && Number(item.id) <= 11)) {
            needsFullMigration = true;
          }
        }
        if (doc.id === '12' && item && item.categoria === 'eventos') {
          needsFullMigration = true;
        }
      });

      if (needsFullMigration || snapshot.empty) {
        console.log('[ARCA Firebase] A efetuar migração integral da coleção agenda_gestao para a época oficial 2026/27 (55 registos)...');
        // Apaga todos os docs antigos da coleção agenda_gestao
        const deleteBatch = firestore.batch();
        snapshot.forEach(doc => {
          deleteBatch.delete(doc.ref);
        });
        try {
          await deleteBatch.commit();
        } catch(e) {}

        // Grava os 55 registos oficiais do seedList
        const writeBatch = firestore.batch();
        seedList.forEach(si => {
          const docRef = firestore.collection('agenda_gestao').doc(String(si.id));
          writeBatch.set(docRef, si);
        });
        try {
          await writeBatch.commit();
        } catch(e) {}

        cloudItems = seedList.filter(si => !deletedIds.includes(Number(si.id)));
      } else {
        snapshot.forEach(doc => {
          const item = doc.data();
          if (item && item.id && !deletedIds.includes(Number(item.id))) {
            cloudItems.push(item);
          }
        });

        // Garantir que nenhum seed está em falta
        let missingSeeds = [];
        seedList.forEach(si => {
          if (!deletedIds.includes(Number(si.id))) {
            const exists = cloudItems.some(ci => Number(ci.id) === Number(si.id));
            if (!exists) {
              missingSeeds.push(si);
            }
          }
        });

        if (missingSeeds.length > 0) {
          const batch = firestore.batch();
          missingSeeds.forEach(si => {
            const docRef = firestore.collection('agenda_gestao').doc(String(si.id));
            batch.set(docRef, si, { merge: true });
            cloudItems.push(si);
          });
          try {
            await batch.commit();
          } catch(e) {}
        }
      }

      cloudItems.sort((a, b) => new Date(b.data + 'T' + (b.horaInicio || '00:00')) - new Date(a.data + 'T' + (a.horaInicio || '00:00')));
      localStorage.setItem(ARCA_AGENDA_STORAGE_KEY, JSON.stringify(cloudItems));
      try { localStorage.removeItem('arca_gestao_agenda_v1'); } catch(e) {}

      if (typeof onUpdated === 'function') {
        onUpdated(cloudItems);
      }
      return cloudItems;
    } catch(err) {
      console.warn('[ARCA Firebase] Aviso ao sincronizar agenda da nuvem:', err.message);
      return null;
    }
  };

  window.saveArcaAgendaToCloud = async function(item) {
    const firestore = initFirebase();
    if (!firestore || !item || !item.id) return false;

    try {
      const docId = String(item.id);

      // Desmarcar dos apagados se existir
      try {
        let deletedIds = JSON.parse(localStorage.getItem(ARCA_DELETED_AGENDA_KEY) || '[]');
        deletedIds = deletedIds.filter(id => id !== Number(item.id));
        localStorage.setItem(ARCA_DELETED_AGENDA_KEY, JSON.stringify(deletedIds));
      } catch (e) {}

      const cleanItem = {
        id: Number(item.id),
        categoria: String(item.categoria || 'jogos').trim(),
        tipo: String(item.tipo || 'Geral').trim(),
        titulo: String(item.titulo || '').trim(),
        subtitulo: String(item.subtitulo || '').trim(),
        data: String(item.data || new Date().toISOString().slice(0, 10)),
        horaInicio: String(item.horaInicio || '09:00').trim(),
        horaFim: String(item.horaFim || '').trim(),
        local: String(item.local || 'Pavilhão Carlos Almeida, Aguada de Baixo').trim(),
        ambito: String(item.ambito || 'Casa').trim(),
        seccao: String(item.seccao || 'Geral').trim(),
        escalao: String(item.escalao || 'Geral').trim(),
        adversario: String(item.adversario || '').trim(),
        responsavel: String(item.responsavel || 'Jorge Manuel da Silva Cunha').trim(),
        contacto: String(item.contacto || '').trim(),
        estado: String(item.estado || 'Confirmado').trim(),
        descricao: String(item.descricao || '').trim(),
        logistica: String(item.logistica || '').trim(),
        criadoPor: String(item.criadoPor || 'Jorge Manuel da Silva Cunha').trim(),
        criadoEm: String(item.criadoEm || new Date().toISOString()),
        atualizadoEm: new Date().toISOString()
      };

      await firestore.collection('agenda_gestao').doc(docId).set(cleanItem, { merge: true });
      console.log(`[ARCA Firebase] Agendamento ID ${cleanItem.id} (${cleanItem.titulo}) gravado no Firestore.`);
      return true;
    } catch (err) {
      console.warn('[ARCA Firebase] Erro ao gravar agendamento na nuvem:', err);
      return false;
    }
  };

  window.deleteArcaAgendaFromCloud = async function(itemId) {
    const firestore = initFirebase();
    if (!firestore || !itemId) return false;

    try {
      const numId = Number(itemId);
      const docId = String(itemId);

      try {
        const deletedIds = JSON.parse(localStorage.getItem(ARCA_DELETED_AGENDA_KEY) || '[]');
        if (!deletedIds.includes(numId)) {
          deletedIds.push(numId);
          localStorage.setItem(ARCA_DELETED_AGENDA_KEY, JSON.stringify(deletedIds));
        }
      } catch (e) {}

      await firestore.collection('agenda_gestao').doc(docId).delete();
      console.log(`[ARCA Firebase] Agendamento ID ${itemId} eliminado do Firestore.`);
      return true;
    } catch (err) {
      console.warn('[ARCA Firebase] Erro ao eliminar agendamento do Firestore:', err);
      return false;
    }
  };

  // =========================================================================
  // SINCRONIZAÇÃO DE LOGS, AUDITORIA E ATIVIDADES (COLEÇÃO 'logs_atividades')
  // =========================================================================

  window.saveArcaLogToCloud = async function(logEntry) {
    const firestore = initFirebase();
    if (!firestore || !logEntry || !logEntry.id) return false;

    try {
      const docId = String(logEntry.id);
      await firestore.collection('logs_atividades').doc(docId).set(logEntry, { merge: true });
      return true;
    } catch (err) {
      console.warn('[ARCA Firebase] Erro ao gravar log de auditoria na nuvem:', err);
      return false;
    }
  };

  window.syncArcaLogsFromCloud = async function(onUpdated) {
    const firestore = initFirebase();
    if (!firestore) return null;

    try {
      const snapshot = await firestore.collection('logs_atividades').orderBy('timestamp', 'desc').limit(200).get();
      let cloudLogs = [];
      snapshot.forEach(doc => {
        const item = doc.data();
        if (item && item.id) cloudLogs.push(item);
      });

      if (cloudLogs.length > 0) {
        const localLogs = (typeof window.getArcaAuditLogs === 'function') ? window.getArcaAuditLogs() : [];
        const logsMap = new Map();
        localLogs.forEach(l => logsMap.set(String(l.id), l));
        cloudLogs.forEach(l => logsMap.set(String(l.id), l));

        const merged = Array.from(logsMap.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        localStorage.setItem('arca_audit_logs_v1', JSON.stringify(merged));

        if (typeof onUpdated === 'function') onUpdated(merged);
        return merged;
      }
    } catch (err) {
      console.warn('[ARCA Firebase] Erro ao sincronizar logs de auditoria da nuvem:', err);
    }
    return null;
  };

  window.updateArcaLogRevertidoInCloud = async function(logId, revertidoData) {
    const firestore = initFirebase();
    if (!firestore || !logId) return false;

    try {
      await firestore.collection('logs_atividades').doc(String(logId)).update({
        revertido: true,
        revertidoEm: revertidoData?.revertidoEm || new Date().toISOString(),
        revertidoPor: revertidoData?.revertidoPor || 'Administrador',
        notaReversao: revertidoData?.notaReversao || 'Reversão concluída'
      });
      return true;
    } catch (err) {
      console.warn('[ARCA Firebase] Erro ao atualizar estado de reversão do log na nuvem:', err);
      return false;
    }
  };

  // =========================================================================
  // SINCRONIZAÇÃO DE PEDIDOS E VALIDAÇÕES DE UTILIZADORES ('pedidos_admin')
  // =========================================================================

  window.saveArcaPedidoAdminToCloud = async function(pedido) {
    const firestore = initFirebase();
    if (!firestore || !pedido || !pedido.id) return false;

    try {
      const docId = String(pedido.id);
      await firestore.collection('pedidos_admin').doc(docId).set(pedido, { merge: true });
      return true;
    } catch (err) {
      console.warn('[ARCA Firebase] Erro ao gravar pedido ao administrador na nuvem:', err);
      return false;
    }
  };

  window.syncArcaPedidosAdminFromCloud = async function(onUpdated) {
    const firestore = initFirebase();
    if (!firestore) return null;

    try {
      const snapshot = await firestore.collection('pedidos_admin').orderBy('timestamp', 'desc').limit(150).get();
      let cloudPedidos = [];
      snapshot.forEach(doc => {
        const item = doc.data();
        if (item && item.id) cloudPedidos.push(item);
      });

      if (cloudPedidos.length > 0) {
        const localPedidos = (typeof window.getArcaPedidosAdmin === 'function') ? window.getArcaPedidosAdmin() : [];
        const map = new Map();
        localPedidos.forEach(p => map.set(String(p.id), p));
        cloudPedidos.forEach(p => map.set(String(p.id), p));

        const merged = Array.from(map.values()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        localStorage.setItem('arca_pedidos_admin_v1', JSON.stringify(merged));

        if (typeof onUpdated === 'function') onUpdated(merged);
        return merged;
      }
    } catch (err) {
      console.warn('[ARCA Firebase] Erro ao sincronizar pedidos ao administrador da nuvem:', err);
    }
    return null;
  };

  window.updateArcaPedidoAdminStatusInCloud = async function(pedidoId, statusData) {
    const firestore = initFirebase();
    if (!firestore || !pedidoId) return false;

    try {
      await firestore.collection('pedidos_admin').doc(String(pedidoId)).update(statusData);
      return true;
    } catch (err) {
      console.warn('[ARCA Firebase] Erro ao atualizar estado do pedido na nuvem:', err);
      return false;
    }
  };

  // Inicialização automática ao carregar
  document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
  });
})();
