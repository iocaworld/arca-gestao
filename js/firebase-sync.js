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
      snapshot.forEach(doc => {
        cloudUsers.push(doc.data());
      });

      // Garantir que as contas base de gestão (Jorge, Artur, Direção) estão sempre presentes no Firestore
      const hasJorge = cloudUsers.some(u => (u.login && u.login.toLowerCase() === 'jorge') || u.id === 1);
      if (!hasJorge || cloudUsers.length < 2) {
        console.log('[ARCA Firebase] A sincronizar/semear contas oficiais da ARCA na nuvem...');
        await window.seedInitialUsersToCloud();
        
        // Recarregar
        const refreshedSnap = await firestore.collection('utilizadores').get();
        cloudUsers = [];
        refreshedSnap.forEach(doc => cloudUsers.push(doc.data()));
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
        snapshot.forEach(doc => {
          cloudUsers.push(doc.data());
        });

        // Garantir que as contas base (Jorge, Raqueli, Artur, etc.) nunca desaparecem
        const seedUsers = (typeof window.getArcaUtilizadores === 'function') ? window.getArcaUtilizadores() : [];
        seedUsers.forEach(seed => {
          const exists = cloudUsers.some(c => 
            (c.login && c.login.toLowerCase() === (seed.login || '').toLowerCase()) || 
            (c.id && seed.id && c.id === seed.id)
          );
          if (!exists) {
            cloudUsers.push(seed);
            if (typeof window.saveArcaUtilizadorToCloud === 'function') {
              window.saveArcaUtilizadorToCloud(seed);
            }
          }
        });

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

  // Guardar ou Atualizar Utilizador na Nuvem
  window.saveArcaUtilizadorToCloud = async function(user) {
    const firestore = initFirebase();
    if (!firestore || !user || !user.id) return false;

    try {
      const docId = String(user.id);
      await firestore.collection('utilizadores').doc(docId).set(user, { merge: true });
      console.log(`[ARCA Firebase] Utilizador ${user.nome} (ID: ${user.id}) gravado na nuvem.`);
      return true;
    } catch (err) {
      console.warn('[ARCA Firebase] Erro ao gravar utilizador na nuvem:', err);
      return false;
    }
  };

  // Eliminar Utilizador na Nuvem
  window.deleteArcaUtilizadorFromCloud = async function(userId) {
    const firestore = initFirebase();
    if (!firestore || !userId) return false;

    try {
      const docId = String(userId);
      await firestore.collection('utilizadores').doc(docId).delete();
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
