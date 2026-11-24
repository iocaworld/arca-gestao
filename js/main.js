/**
 * A.R.C.A. - Aguada de Baixo | Gestão Geral v2.0
 * Scripts e Lógica Funcional
 */

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

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 2. Controlo da Barra Lateral Mobile (Sidebar Toggle)
  // =========================================================================
  const mobileToggle = document.getElementById('mobileSidebarToggle');
  const appSidebar = document.querySelector('.app-sidebar');

  if (mobileToggle && appSidebar) {
    mobileToggle.addEventListener('click', () => {
      appSidebar.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        if (!appSidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
          appSidebar.classList.remove('open');
        }
      }
    });
  }

  // =========================================================================
  // 3. Autenticação na Página Principal (index.html)
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
        if (loginAlert) {
          loginAlert.textContent = 'Por favor, indique o utilizador e a palavra-passe.';
          loginAlert.className = 'alert-message alert-error';
          loginAlert.style.display = 'block';
        }
        return;
      }

      if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span>A validar acesso...</span>';
      }

      if (loginAlert) {
        loginAlert.textContent = 'Acesso autorizado! A abrir o painel...';
        loginAlert.className = 'alert-message alert-success';
        loginAlert.style.display = 'block';
      }

      setTimeout(() => {
        window.location.href = 'painel.html';
      }, 700);
    });
  }

  // =========================================================================
  // 4. Módulo de Sócios Avançado (socios.html)
  // =========================================================================
  const sociosTableBody = document.getElementById('sociosTableBody');

  if (sociosTableBody) {
    const STORAGE_KEY = 'arca_socios_data_v2';

    // Base de dados inicial de sócios da ARCA
    let socios = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
      { id: 1, numero: 1, nome: "Jorge Cunha", nif: "214589632", categoria: "Efetivo", telefone: "912 345 678", email: "jorge.cunha@arca.pt", morada: "Rua Principal, Aguada de Baixo", dataInscricao: "15/03/1998", ultimaQuota: 2026, valorQuota: 15.00, estado: "Em Dia", historico: ["2024", "2025", "2026"] },
      { id: 2, numero: 2, nome: "Manuel António Rodrigues", nif: "189456123", categoria: "Benemérito", telefone: "913 222 333", email: "m.rodrigues@email.pt", morada: "Largo do Rossio, Aguada de Baixo", dataInscricao: "20/01/1984", ultimaQuota: 2026, valorQuota: 25.00, estado: "Em Dia", historico: ["2024", "2025", "2026"] },
      { id: 3, numero: 14, nome: "Maria Clara Santos", nif: "235689147", categoria: "Efetivo", telefone: "961 888 999", email: "clara.santos@gmail.com", morada: "Rua das Flores, Barrô", dataInscricao: "10/05/2012", ultimaQuota: 2025, valorQuota: 15.00, estado: "Pendente", historico: ["2024", "2025"] },
      { id: 4, numero: 23, nome: "Fernando José Almeida", nif: "198753214", categoria: "Efetivo", telefone: "925 444 555", email: "fernando.almeida@arca.pt", morada: "Av. Central, Aguada de Baixo", dataInscricao: "05/11/2005", ultimaQuota: 2026, valorQuota: 15.00, estado: "Em Dia", historico: ["2024", "2025", "2026"] },
      { id: 5, numero: 35, nome: "Tiago Silva Ferreira", nif: "256987412", categoria: "Juvenil", telefone: "933 111 222", email: "tiago.silva@sapo.pt", morada: "Rua do Pavilhão, Aguada de Baixo", dataInscricao: "12/09/2021", ultimaQuota: 2024, valorQuota: 7.50, estado: "Atrasado", historico: ["2024"] },
      { id: 6, numero: 42, nome: "Ana Beatriz Ramos", nif: "241589632", categoria: "Efetivo", telefone: "918 777 666", email: "ana.ramos@outlook.pt", morada: "Rua da Igreja, Águeda", dataInscricao: "03/04/2018", ultimaQuota: 2026, valorQuota: 15.00, estado: "Em Dia", historico: ["2024", "2025", "2026"] },
      { id: 7, numero: 58, nome: "Carlos Eduardo Pinto", nif: "178965412", categoria: "Efetivo", telefone: "964 333 444", email: "carlos.pinto@email.com", morada: "Quinta do Sol, Aguada de Baixo", dataInscricao: "18/07/2015", ultimaQuota: 2026, valorQuota: 15.00, estado: "Em Dia", historico: ["2024", "2025", "2026"] },
      { id: 8, numero: 74, nome: "Rui Pedro Oliveira", nif: "223366554", categoria: "Efetivo", telefone: "921 654 987", email: "rui.pedro@arca.pt", morada: "Rua dos Pinheiros, Aguada de Cima", dataInscricao: "22/02/2026", ultimaQuota: 2025, valorQuota: 15.00, estado: "Pendente", historico: ["2025"] }
    ];

    function saveSocios() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(socios));
    }

    // Indicadores do Topo
    function updateStats() {
      const total = socios.length;
      const emDia = socios.filter(s => s.estado === 'Em Dia').length;
      const pendentes = socios.filter(s => s.estado === 'Pendente' || s.estado === 'Atrasado').length;
      const novos = socios.filter(s => s.numero >= 70).length;

      const elTotal = document.getElementById('statTotal');
      const elEmDia = document.getElementById('statEmDia');
      const elPendentes = document.getElementById('statPendentes');
      const elNovos = document.getElementById('statNovos');

      if (elTotal) elTotal.textContent = total;
      if (elEmDia) elEmDia.textContent = emDia;
      if (elPendentes) elPendentes.textContent = pendentes;
      if (elNovos) elNovos.textContent = novos;
    }

    // Renderizar Tabela
    function renderTable(data = socios) {
      sociosTableBody.innerHTML = '';

      if (data.length === 0) {
        sociosTableBody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
              Nenhum associado encontrado para os filtros selecionados.
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

        // Iniciais para avatar
        const initials = s.nome.split(' ').map(n => n[0]).slice(0, 2).join('');

        tr.innerHTML = `
          <td><strong>#${s.numero}</strong></td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; flex-shrink: 0;">
                ${initials}
              </div>
              <div>
                <a href="javascript:void(0)" onclick="openSocioDrawer(${s.id})" style="font-weight: 700; color: var(--text-title); text-decoration: none;">
                  ${s.nome}
                </a>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${s.morada}</div>
              </div>
            </div>
          </td>
          <td><code>${s.nif}</code></td>
          <td><span style="font-weight: 600;">${s.categoria}</span></td>
          <td>
            <div>${s.telefone || '-'}</div>
            <small style="color: var(--text-muted);">${s.email || '-'}</small>
          </td>
          <td>
            <span class="status-pill ${statusClass}">${s.estado} (${s.ultimaQuota})</span>
          </td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 0.4rem;">
              <button class="btn btn-outline btn-sm" onclick="openSocioDrawer(${s.id})" title="Ver Ficha">
                Ver Ficha
              </button>
              ${s.estado !== 'Em Dia' ? `
                <button class="btn btn-primary btn-sm" onclick="liquidarQuota(${s.id})" title="Registar Quota 2026">
                  Pagar
                </button>
              ` : `
                <button class="btn btn-secondary btn-sm" onclick="emitirRecibo(${s.id})" title="Imprimir Recibo">
                  Recibo
                </button>
              `}
            </div>
          </td>
        `;
        sociosTableBody.appendChild(tr);
      });
    }

    // Ação: Liquidar Quota
    window.liquidarQuota = function(id) {
      const socio = socios.find(s => s.id === id);
      if (socio) {
        socio.ultimaQuota = 2026;
        socio.estado = 'Em Dia';
        if (!socio.historico.includes('2026')) socio.historico.push('2026');
        saveSocios();
        updateStats();
        applyFilters();
        showToast(`Quota 2026 regularizada com sucesso para ${socio.nome}!`, 'success');
      }
    };

    // Ação: Abrir Ficha do Sócio (Drawer Lateral)
    const drawerBackdrop = document.getElementById('drawerSocio');
    const drawerContent = document.getElementById('drawerSocioContent');

    window.openSocioDrawer = function(id) {
      const socio = socios.find(s => s.id === id);
      if (!socio || !drawerBackdrop || !drawerContent) return;

      let statusBadge = `<span class="status-pill em-dia">Quota Regularizada</span>`;
      if (socio.estado === 'Pendente') statusBadge = `<span class="status-pill pendente">Quota Pendente</span>`;
      if (socio.estado === 'Atrasado') statusBadge = `<span class="status-pill atrasado">Quota Atrasada</span>`;

      drawerContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--primary); color: #fff; font-size: 1.5rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0.75rem;">
            ${socio.nome.split(' ').map(n=>n[0]).slice(0,2).join('')}
          </div>
          <h2 style="font-size: 1.5rem; color: var(--text-title);">${socio.nome}</h2>
          <div style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.2rem;">Sócio Nº <strong>#${socio.numero}</strong> &bull; Categoria <strong>${socio.categoria}</strong></div>
          <div style="margin-top: 0.75rem;">${statusBadge}</div>
        </div>

        <div style="background: var(--bg-page); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem; letter-spacing: 0.05em;">Dados Pessoais</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.9rem;">
            <div><strong>NIF:</strong> ${socio.nif}</div>
            <div><strong>Inscrição:</strong> ${socio.dataInscricao || '15/01/2020'}</div>
            <div><strong>Telefone:</strong> ${socio.telefone || '-'}</div>
            <div><strong>Email:</strong> ${socio.email || '-'}</div>
          </div>
          <div style="margin-top: 0.75rem; font-size: 0.9rem;">
            <strong>Morada:</strong> ${socio.morada}
          </div>
        </div>

        <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem; letter-spacing: 0.05em;">Situação de Quotas</h4>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem;">
            <span>Valor Anual da Quota:</span>
            <strong>${socio.valorQuota ? socio.valorQuota.toFixed(2) : '15.00'} €</strong>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; margin-top: 0.5rem;">
            <span>Último Ano Liquidado:</span>
            <strong style="color: var(--primary);">${socio.ultimaQuota}</strong>
          </div>
          <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-light); font-size: 0.85rem; color: var(--text-muted);">
            Histórico recente: ${socio.historico ? socio.historico.join(', ') : '2024, 2025'}
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
          <button class="btn btn-secondary" style="flex: 1;" onclick="emitirRecibo(${socio.id})">
            📄 Emitir Recibo Oficial
          </button>
          ${socio.estado !== 'Em Dia' ? `
            <button class="btn btn-primary" style="flex: 1;" onclick="liquidarQuota(${socio.id}); openSocioDrawer(${socio.id});">
              Confirmar Quota 2026
            </button>
          ` : ''}
        </div>
      `;

      drawerBackdrop.classList.add('open');
    };

    window.closeSocioDrawer = function() {
      if (drawerBackdrop) drawerBackdrop.classList.remove('open');
    };

    // Ação: Emitir e Imprimir Recibo Oficial da ARCA
    window.emitirRecibo = function(id) {
      const socio = socios.find(s => s.id === id);
      if (!socio) return;

      const numRecibo = Math.floor(1000 + Math.random() * 9000);
      const dataHoje = new Date().toLocaleDateString('pt-PT');

      const printWindow = window.open('', '', 'width=780,height=600');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Recibo de Quota - ARCA Aguada de Baixo</title>
          <style>
            body { font-family: -apple-system, system-ui, sans-serif; padding: 40px; color: #231f1c; line-height: 1.6; }
            .receipt-box { border: 2px solid #a65a3c; border-radius: 12px; padding: 30px; position: relative; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #faf7f2; padding-bottom: 20px; margin-bottom: 25px; }
            .logo-text h1 { margin: 0; font-size: 24px; color: #a65a3c; }
            .logo-text p { margin: 0; font-size: 13px; color: #8c8275; }
            .receipt-title { font-size: 20px; font-weight: bold; text-align: right; }
            .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; }
            .total-row { border-top: 1px dashed #ccc; padding-top: 15px; font-size: 18px; font-weight: bold; }
            .signature { margin-top: 50px; display: flex; justify-content: space-between; text-align: center; font-size: 13px; }
            .signature div { border-top: 1px solid #777; width: 220px; padding-top: 5px; }
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
                <small style="font-size: 13px; color: #666; font-weight: normal;">Data: ${dataHoje}</small>
              </div>
            </div>

            <div class="row">
              <span><strong>Recebemos de:</strong> ${socio.nome}</span>
              <span><strong>Sócio Nº:</strong> #${socio.numero}</span>
            </div>
            <div class="row">
              <span><strong>NIF:</strong> ${socio.nif}</span>
              <span><strong>Categoria:</strong> ${socio.categoria}</span>
            </div>
            <div class="row">
              <span><strong>Morada:</strong> ${socio.morada}</span>
            </div>

            <div style="background: #faf7f2; padding: 15px; border-radius: 8px; margin: 25px 0;">
              <div class="row" style="margin: 0;">
                <span>Liquidação da Quota Anual de Associado (${socio.ultimaQuota})</span>
                <strong>${socio.valorQuota ? socio.valorQuota.toFixed(2) : '15.00'} €</strong>
              </div>
            </div>

            <div class="row total-row">
              <span>Total Liquidado</span>
              <span style="color: #a65a3c;">${socio.valorQuota ? socio.valorQuota.toFixed(2) : '15.00'} €</span>
            </div>

            <div class="signature">
              <div>O Associado</div>
              <div>Pela Direção da A.R.C.A.</div>
            </div>
          </div>

          <div class="no-print" style="margin-top: 25px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 25px; font-size: 16px; background: #a65a3c; color: white; border: none; border-radius: 8px; cursor: pointer;">
              🖨️ Imprimir / Guardar em PDF
            </button>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      showToast(`Recibo emitido para ${socio.nome}!`, 'success');
    };

    // Filtros e Pesquisa
    const searchInput = document.getElementById('searchInput');
    const filterStatus = document.getElementById('filterStatus');
    const filterCategory = document.getElementById('filterCategory');

    function applyFilters() {
      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
      const status = filterStatus ? filterStatus.value : 'all';
      const cat = filterCategory ? filterCategory.value : 'all';

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
      if (btnCloseNewSocio) btnCloseNewSocio.addEventListener('click', () => modalNewSocio.classList.remove('active'));
      if (btnCancelNewSocio) btnCancelNewSocio.addEventListener('click', () => modalNewSocio.classList.remove('active'));

      if (formNewSocio) {
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
            dataInscricao: new Date().toLocaleDateString('pt-PT'),
            ultimaQuota: 2026,
            valorQuota: categoria === 'Juvenil' ? 7.50 : 15.00,
            estado: 'Em Dia',
            historico: ['2026']
          };

          socios.unshift(newSocio);
          saveSocios();
          updateStats();
          applyFilters();

          formNewSocio.reset();
          modalNewSocio.classList.remove('active');
          showToast(`Sócio #${newNumero} (${nome}) adicionado com sucesso!`, 'success');
        });
      }
    }

    // Exportar CSV
    const btnExportCsv = document.getElementById('btnExportCsv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        let csv = "data:text/csv;charset=utf-8,\uFEFF";
        csv += "Nº;Nome;NIF;Categoria;Telefone;Email;Morada;Última Quota;Estado\n";

        socios.forEach(s => {
          csv += `"${s.numero}";"${s.nome}";"${s.nif}";"${s.categoria}";"${s.telefone}";"${s.email}";"${s.morada}";"${s.ultimaQuota}";"${s.estado}"\n`;
        });

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csv));
        link.setAttribute("download", `ARCA_Socios_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Lista de sócios exportada com sucesso!', 'success');
      });
    }

    // Inicializar Tabela e Indicadores
    updateStats();
    renderTable();
  }

});
