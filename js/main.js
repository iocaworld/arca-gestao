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
    document.querySelectorAll('.nav-item-badge').forEach(b => {
      b.textContent = ativos;
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
        quotas.push({
          ano: 2026,
          valor: 6.00,
          pago: true,
          estado: 'Pago',
          data: socio.ultimaAtualizacao || '2026-01-15',
          metodo: 'MBWay',
          recibo: true
        });
        quotas.push({
          ano: 2025,
          valor: 6.00,
          pago: true,
          estado: 'Pago',
          data: '2025-03-31',
          metodo: 'Numerário',
          recibo: true
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
        quotas.push({
          ano: lastPaid,
          valor: 6.00,
          pago: true,
          estado: 'Pago',
          data: socio.ultimaAtualizacao || `${lastPaid}-03-31`,
          metodo: 'Numerário',
          recibo: true
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
            <td style="text-align: right;">
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openSocioDrawer(${s.id})" title="Ver e Editar Ficha Completa">
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

        // Rodapé do Drawer com botões Guardar e Eliminar
        if (drawerFooter) {
          drawerFooter.innerHTML = `
            <button type="button" class="btn btn-outline" style="color: #dc2626; border-color: #fca5a5;" onclick="deleteSocioFromDrawer(${socio.id})">
              Eliminar
            </button>
            <button type="button" class="btn btn-primary" onclick="saveSocioDataFromDrawer(${socio.id})">
              Guardar
            </button>
          `;
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
                    <input type="checkbox" class="quota-pay-check" data-ano="${q.ano}" data-valor="${q.valor || 6}" checked onchange="updateSelectedQuotasSummary()">
                  ` : `
                    <span style="color: #16a34a; font-weight: bold;">✓</span>
                  `}
                </td>
                <td><strong>${q.ano}</strong></td>
                <td>
                  ${!isPaid ? `
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
                  ${isPaid ? `
                    <button type="button" class="btn btn-outline btn-sm" style="padding: 2px 6px; font-size: 0.75rem;" onclick="emitirReciboAno(${socio.id}, ${q.ano})" title="Emitir Recibo">
                      Recibo
                    </button>
                  ` : '—'}
                </td>
                <td style="text-align: center;">
                  ${isPaid ? `
                    <button type="button" class="btn btn-outline btn-sm" style="padding: 2px 6px; font-size: 0.75rem; color: #dc2626;" title="Anular pagamento deste ano" onclick="anularPagamentoQuota(${socio.id}, ${q.ano})">
                      ✕
                    </button>
                  ` : `
                    <button type="button" class="btn btn-outline btn-sm" style="padding: 2px 6px; font-size: 0.75rem; color: #94a3b8;" title="Remover este ano" onclick="removerAnoQuota(${socio.id}, ${q.ano})">
                      ✕
                    </button>
                  `}
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

              <button type="button" class="btn btn-primary" onclick="openRegistarPagamentoModal(${socio.id})" style="background: #6c584c; border-color: #6c584c;">
                Registar pagamento
              </button>
            </div>

            <div class="table-responsive" style="border: 1px solid var(--border-light); border-radius: var(--radius-sm);">
              <table class="drawer-quotas-table">
                <thead>
                  <tr>
                    <th style="width: 38px; text-align: center;">
                      <input type="checkbox" id="checkAllDrawerQuotas" checked onchange="toggleSelectAllDrawerQuotas(this.checked)" title="Selecionar Todos">
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

            <!-- Adicionar Novo Ano Manualmente -->
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 1.25rem;">
              <input type="number" id="inputNovoAnoQuota" class="form-control" style="width: 110px; padding: 0.45rem 0.65rem;" placeholder="Ano" value="${new Date().getFullYear() + 1}">
              <button type="button" class="btn btn-secondary btn-sm" onclick="adicionarAnoQuota(${socio.id})">
                Adicionar quota
              </button>
            </div>

            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 1.25rem; line-height: 1.5;">
              As quotas do ano corrente são criadas automaticamente para sócios ativos (exceto honorários e isentos). Anos anteriores ao histórico importado contam como pagos.
            </p>
          </div>
        `;

        if (drawerFooter) {
          drawerFooter.innerHTML = `
            <button type="button" class="btn btn-outline btn-sm" onclick="closeSocioDrawer()">Fechar</button>
          `;
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

      if (elSocioId) elSocioId.value = socioId;
      if (elAnos) elAnos.textContent = selectedYears.join(', ');
      if (elTotal) elTotal.textContent = `${total.toFixed(2).replace('.', ',')} €`;
      if (elData) elData.value = new Date().toISOString().slice(0, 10);
      if (elSubtitle) elSubtitle.textContent = `Sócio nº ${socio.numero} - ${socio.nome}`;

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
        } else {
          socio.quotas.push({
            ano: ano,
            valor: 6.00,
            pago: true,
            estado: 'Pago',
            data: data,
            metodo: metodo,
            recibo: true
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
      const histText = `[${todayFormatted}] Pagamento Quotas (${pendingPaymentYears.join(', ')}) no valor de ${pendingPaymentTotal.toFixed(2)} € via ${metodo}${notas ? ` - ${notas}` : ''}`;
      socio.observacoes = socio.observacoes ? `${socio.observacoes} | ${histText}` : histText;
      socio.ultimaAtualizacao = data;

      saveSocios();
      updateStats();
      applyFilters();

      const anosTexto = pendingPaymentYears.join(', ');
      const totalPago = pendingPaymentTotal;

      closePagamentoModal();
      renderDrawerContent();

      showToast(`Pagamento das quotas (${anosTexto}) regularizado com sucesso!`, 'success');

      // Se solicitado, emitir recibo oficial
      if (emitirReciboChecked) {
        emitirReciboMultiplo(socio.id, pendingPaymentYears, totalPago, metodo, data);
      }
    };

    // =========================================================================
    // 4.3. Emissão e Impressão de Recibo Oficial da ARCA
    // =========================================================================
    window.emitirReciboMultiplo = function(socioId, anosArray, valorTotal, metodo, data) {
      const socio = socios.find(s => s.id === socioId);
      if (!socio) return;

      const numRecibo = Math.floor(1000 + Math.random() * 9000);
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
    // 4.4. Filtros, Pesquisa e Ordenação da Tabela de Sócios
    // =========================================================================
    const searchInput = document.getElementById('searchInput');
    const filterMembro = document.getElementById('filterMembro');
    const filterStatus = document.getElementById('filterStatus');
    const filterCategory = document.getElementById('filterCategory');
    const sortSociosSelect = document.getElementById('sortSociosSelect');

    function applyFilters() {
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

    // Inicialização da Tabela, Filtros e Indicadores
    initSociosColPicker();
    updateSortIndicators();
    updateStats();
    applyFilters();
  }

});
