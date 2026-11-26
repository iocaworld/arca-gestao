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
