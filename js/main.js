/**
 * A.R.C.A. - Aguada de Baixo | Gestão
 * Scripts da Plataforma
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Autenticação na Página Principal (index.html)
  // =========================================================================
  const loginForm = document.getElementById('arcaLoginForm');
  const loginAlert = document.getElementById('loginAlert');
  const loginBtn = document.getElementById('loginBtn');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');

      const user = usernameInput.value.trim();
      const pass = passwordInput.value.trim();

      if (!user || !pass) {
        showLoginAlert('Por favor, indica o utilizador e a palavra-passe.', 'error');
        return;
      }

      // Feedback visual e transição
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<span>A validar...</span>';
      showLoginAlert('Sessão iniciada com sucesso! A carregar a gestão...', 'success');

      setTimeout(() => {
        window.location.href = 'socios.html';
      }, 1000);
    });
  }

  function showLoginAlert(msg, type) {
    if (!loginAlert) return;
    loginAlert.textContent = msg;
    loginAlert.className = `alert-message ${type === 'success' ? 'alert-success' : 'alert-error'}`;
    loginAlert.style.display = 'block';
  }

  // =========================================================================
  // 2. Módulo de Gestão de Sócios (socios.html)
  // =========================================================================
  const sociosTableBody = document.getElementById('sociosTableBody');

  if (sociosTableBody) {
    // Dados iniciais de sócios da ARCA (com persistência em LocalStorage)
    const STORAGE_KEY = 'arca_socios_data_v1';
    
    let socios = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
      { id: 1, numero: 1, nome: "Jorge Cunha", nif: "214589632", categoria: "Efetivo", telefone: "912 345 678", email: "jorge.cunha@arca.pt", morada: "Aguada de Baixo", ultimaQuota: 2026, estado: "Em Dia" },
      { id: 2, numero: 2, nome: "Manuel António Rodrigues", nif: "189456123", categoria: "Benemérito", telefone: "913 222 333", email: "m.rodrigues@email.pt", morada: "Aguada de Baixo", ultimaQuota: 2026, estado: "Em Dia" },
      { id: 3, numero: 14, nome: "Maria Clara Santos", nif: "235689147", categoria: "Efetivo", telefone: "961 888 999", email: "clara.santos@gmail.com", morada: "Barrô", ultimaQuota: 2025, estado: "Pendente" },
      { id: 4, numero: 23, nome: "Fernando José Almeida", nif: "198753214", categoria: "Efetivo", telefone: "925 444 555", email: "fernando.almeida@arca.pt", morada: "Aguada de Baixo", ultimaQuota: 2026, estado: "Em Dia" },
      { id: 5, numero: 35, nome: "Tiago Silva Ferreira", nif: "256987412", categoria: "Juvenil", telefone: "933 111 222", email: "tiago.silva@sapo.pt", morada: "Aguada de Baixo", ultimaQuota: 2024, estado: "Atrasado" },
      { id: 6, numero: 42, nome: "Ana Beatriz Ramos", nif: "241589632", categoria: "Efetivo", telefone: "918 777 666", email: "ana.ramos@outlook.pt", morada: "Águeda", ultimaQuota: 2026, estado: "Em Dia" },
      { id: 7, numero: 58, nome: "Carlos Eduardo Pinto", nif: "178965412", categoria: "Efetivo", telefone: "964 333 444", email: "carlos.pinto@email.com", morada: "Aguada de Baixo", ultimaQuota: 2026, estado: "Em Dia" },
      { id: 8, numero: 74, nome: "Rui Pedro Oliveira", nif: "223366554", categoria: "Efetivo", telefone: "921 654 987", email: "rui.pedro@arca.pt", morada: "Aguada de Cima", ultimaQuota: 2025, estado: "Pendente" }
    ];

    function saveSocios() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(socios));
    }

    // Renderizar Indicadores Estatísticos
    function updateStats() {
      const total = socios.length;
      const emDia = socios.filter(s => s.estado === 'Em Dia').length;
      const pendentes = socios.filter(s => s.estado === 'Pendente' || s.estado === 'Atrasado').length;
      const novos = socios.filter(s => s.numero >= 70).length;

      document.getElementById('statTotal').textContent = total;
      document.getElementById('statEmDia').textContent = emDia;
      document.getElementById('statPendentes').textContent = pendentes;
      document.getElementById('statNovos').textContent = novos;
    }

    // Renderizar Tabela
    function renderTable(data = socios) {
      sociosTableBody.innerHTML = '';

      if (data.length === 0) {
        sociosTableBody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
              Nenhum associado encontrado com os filtros selecionados.
            </td>
          </tr>
        `;
        return;
      }

      data.forEach(s => {
        const tr = document.createElement('tr');

        let statusClass = 'em-dia';
        if (s.estado === 'Pendente') statusClass = 'pendente';
        if (s.estado === 'Atrasado') statusClass = 'atrasado';

        tr.innerHTML = `
          <td><strong>#${s.numero}</strong></td>
          <td>
            <div style="font-weight: 600; color: var(--text-title);">${s.nome}</div>
            <small style="color: var(--text-muted);">${s.morada}</small>
          </td>
          <td><code>${s.nif}</code></td>
          <td>${s.categoria}</td>
          <td>
            <div>${s.telefone || '-'}</div>
            <small style="color: var(--text-muted);">${s.email || '-'}</small>
          </td>
          <td><strong>${s.ultimaQuota}</strong></td>
          <td>
            <span class="badge-status ${statusClass}">${s.estado}</span>
          </td>
          <td style="text-align: right;">
            ${s.estado !== 'Em Dia' ? `
              <button class="btn-action btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.8rem;" onclick="liquidarQuota(${s.id})">
                Regularizar
              </button>
            ` : `
              <span style="color: var(--color-green); font-size: 0.85rem; font-weight: 600;">Regular</span>
            `}
          </td>
        `;
        sociosTableBody.appendChild(tr);
      });
    }

    // Regularizar Quota
    window.liquidarQuota = function(id) {
      const socio = socios.find(s => s.id === id);
      if (socio) {
        if (confirm(`Confirmar registo do pagamento da quota 2026 para ${socio.nome}?`)) {
          socio.ultimaQuota = 2026;
          socio.estado = 'Em Dia';
          saveSocios();
          updateStats();
          applyFilters();
        }
      }
    };

    // Filtros e Pesquisa
    const searchInput = document.getElementById('searchInput');
    const filterStatus = document.getElementById('filterStatus');
    const filterCategory = document.getElementById('filterCategory');

    function applyFilters() {
      const query = (searchInput.value || '').toLowerCase().trim();
      const status = filterStatus.value;
      const cat = filterCategory.value;

      const filtered = socios.filter(s => {
        const matchesQuery = 
          s.nome.toLowerCase().includes(query) ||
          s.numero.toString().includes(query) ||
          s.nif.includes(query) ||
          (s.morada && s.morada.toLowerCase().includes(query));

        const matchesStatus = (status === 'all') || (s.estado === status);
        const matchesCat = (cat === 'all') || (s.categoria === cat);

        return matchesQuery && matchesStatus && matchesCat;
      });

      renderTable(filtered);
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (filterStatus) filterStatus.addEventListener('change', applyFilters);
    if (filterCategory) filterCategory.addEventListener('change', applyFilters);

    // Modal: Novo Sócio
    const modalNewSocio = document.getElementById('modalNewSocio');
    const btnOpenNewSocio = document.getElementById('btnOpenNewSocioModal');
    const btnCloseNewSocio = document.getElementById('btnCloseNewSocioModal');
    const btnCancelNewSocio = document.getElementById('btnCancelNewSocio');
    const formNewSocio = document.getElementById('formNewSocio');

    if (btnOpenNewSocio && modalNewSocio) {
      btnOpenNewSocio.addEventListener('click', () => modalNewSocio.classList.add('active'));
      btnCloseNewSocio.addEventListener('click', () => modalNewSocio.classList.remove('active'));
      btnCancelNewSocio.addEventListener('click', () => modalNewSocio.classList.remove('active'));

      formNewSocio.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('newNome').value.trim();
        const nif = document.getElementById('newNif').value.trim();
        const categoria = document.getElementById('newCategoria').value;
        const telefone = document.getElementById('newTelefone').value.trim();
        const email = document.getElementById('newEmail').value.trim();
        const morada = document.getElementById('newMorada').value.trim() || 'Aguada de Baixo';

        const maxNum = socios.reduce((max, s) => Math.max(max, s.numero), 0);
        const newNumero = maxNum + 1;

        const newSocio = {
          id: Date.now(),
          numero: newNumero,
          nome,
          nif,
          categoria,
          telefone,
          email,
          morada,
          ultimaQuota: 2026,
          estado: 'Em Dia'
        };

        socios.unshift(newSocio);
        saveSocios();
        updateStats();
        applyFilters();

        formNewSocio.reset();
        modalNewSocio.classList.remove('active');
        alert(`Sócio #${newNumero} - ${nome} registado com sucesso!`);
      });
    }

    // Exportar CSV
    const btnExportCsv = document.getElementById('btnExportCsv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
        csvContent += "Nº Sócio;Nome;NIF;Categoria;Telefone;Email;Morada;Última Quota;Estado\n";

        socios.forEach(s => {
          csvContent += `"${s.numero}";"${s.nome}";"${s.nif}";"${s.categoria}";"${s.telefone}";"${s.email}";"${s.morada}";"${s.ultimaQuota}";"${s.estado}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `ARCA_Socios_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }

    // Inicialização
    updateStats();
    renderTable();
  }

});
