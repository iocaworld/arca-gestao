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
  // 4. Módulo de Sócios Oficial da A.R.C.A. (socios.html)
  // =========================================================================
  const sociosTableBody = document.getElementById('sociosTableBody');

  if (sociosTableBody) {
    const STORAGE_KEY = 'arca_socios_data_v3';
    const VERSION_KEY = 'arca_socios_version';
    const currentVersion = (typeof ARCA_SOCIOS_DATA_VERSION !== 'undefined') ? ARCA_SOCIOS_DATA_VERSION : '2026-11-25_v3';
    const storedVersion = localStorage.getItem(VERSION_KEY);

    // Carregar Base de Dados Oficial dos 425 Sócios (substituindo dados antigos)
    let socios;
    if (storedVersion !== currentVersion || !localStorage.getItem(STORAGE_KEY)) {
      socios = (typeof ARCA_SOCIOS_BASE !== 'undefined') ? JSON.parse(JSON.stringify(ARCA_SOCIOS_BASE)) : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(socios));
      localStorage.setItem(VERSION_KEY, currentVersion);
    } else {
      try {
        socios = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!Array.isArray(socios) || socios.length < 50) {
          socios = (typeof ARCA_SOCIOS_BASE !== 'undefined') ? JSON.parse(JSON.stringify(ARCA_SOCIOS_BASE)) : [];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(socios));
        }
      } catch (e) {
        socios = (typeof ARCA_SOCIOS_BASE !== 'undefined') ? JSON.parse(JSON.stringify(ARCA_SOCIOS_BASE)) : [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(socios));
      }
    }

    function saveSocios() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(socios));
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
    const SOCIOS_COLS_KEY = 'arca_socios_cols_v3';
    const DEFAULT_SOCIOS_COLS = {
      numero: true,
      nome: true,
      morada: false,
      nif: true,
      categoria: true,
      contacto: true,
      divida: false,
      estadoMembro: true,
      estado: true,
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
        morada: 'Morada / Localidade',
        nif: 'NIF',
        categoria: 'Categoria',
        contacto: 'Contacto (Telef. & Email)',
        divida: 'Dívida / Saldo (€)',
        estadoMembro: 'Situação (Ativo / Falecido / Inativo)',
        estado: 'Estado da Cota',
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

    // Indicadores do Topo
    function updateStats() {
      const total = socios.length;
      const ativos = socios.filter(s => s.estadoMembro === 'Ativo').length;
      const emDia = socios.filter(s => s.estadoMembro === 'Ativo' && s.estado === 'Em Dia').length;
      const pendentes = socios.filter(s => s.estadoMembro === 'Ativo' && (s.estado === 'Pendente' || s.estado === 'Atrasado')).length;

      const elTotal = document.getElementById('statTotal');
      const elAtivos = document.getElementById('statAtivos');
      const elEmDia = document.getElementById('statEmDia');
      const elPendentes = document.getElementById('statPendentes');

      if (elTotal) elTotal.textContent = total;
      if (elAtivos) elAtivos.textContent = ativos;
      if (elEmDia) elEmDia.textContent = emDia;
      if (elPendentes) elPendentes.textContent = pendentes;

      // Atualizar badge do menu lateral
      document.querySelectorAll('.nav-item-badge').forEach(b => {
        b.textContent = ativos;
      });
    }

    // Renderizar Tabela com Colunas Dinâmicas
    function renderTable(data = socios) {
      sociosTableBody.innerHTML = '';
      applyColumnsVisibility();

      if (data.length === 0) {
        const visibleColsCount = Object.values(activeSociosCols).filter(Boolean).length || 6;
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

        // Status pill class
        let statusClass = 'em-dia';
        if (s.estado === 'Pendente') statusClass = 'pendente';
        if (s.estado === 'Atrasado') statusClass = 'atrasado';

        // Badge de situação do membro
        let membroBadge = `<span style="background: rgba(28,109,66,0.12); color: #1c6d42; padding: 3px 8px; border-radius: 6px; font-weight: 600; font-size: 0.78rem;">Ativo</span>`;
        if (s.estadoMembro === 'Falecido') {
          membroBadge = `<span style="background: #e2e8f0; color: #475569; padding: 3px 8px; border-radius: 6px; font-weight: 600; font-size: 0.78rem;">Falecido</span>`;
        } else if (s.estadoMembro === 'Inativo') {
          membroBadge = `<span style="background: rgba(217,119,6,0.12); color: #d97706; padding: 3px 8px; border-radius: 6px; font-weight: 600; font-size: 0.78rem;">Inativo</span>`;
        }

        // Iniciais para avatar
        const words = (s.nome || 'S').split(' ').filter(Boolean);
        const initials = words.length > 1 ? (words[0][0] + words[words.length - 1][0]).toUpperCase() : (words[0] ? words[0].slice(0, 2).toUpperCase() : 'SC');

        let html = '';

        if (isColVisible('numero')) {
          html += `<td><strong>#${s.numero}</strong></td>`;
        }
        if (isColVisible('nome')) {
          html += `
            <td>
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; flex-shrink: 0;">
                  ${initials}
                </div>
                <div>
                  <a href="javascript:void(0)" onclick="openSocioDrawer(${s.id})" style="font-weight: 700; color: var(--text-title); text-decoration: none;">
                    ${escapeHtml(s.nome)}
                  </a>
                  ${!isColVisible('morada') && s.morada ? `<div style="font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(s.morada)}</div>` : ''}
                </div>
              </div>
            </td>
          `;
        }
        if (isColVisible('morada')) {
          html += `<td><span style="font-size: 0.85rem; color: var(--text-body);">${escapeHtml(s.morada || '-')}</span></td>`;
        }
        if (isColVisible('nif')) {
          html += `<td><code>${escapeHtml(s.nif || '-')}</code></td>`;
        }
        if (isColVisible('categoria')) {
          html += `<td><span style="font-weight: 600;">${escapeHtml(s.categoria)}</span></td>`;
        }
        if (isColVisible('contacto')) {
          html += `
            <td>
              <div>${escapeHtml(s.telefone || '-')}</div>
              <small style="color: var(--text-muted);">${escapeHtml(s.email || '-')}</small>
            </td>
          `;
        }
        if (isColVisible('divida')) {
          let dividaHtml = '<span style="color: #059669; font-weight: 600;">0.00 €</span>';
          if (s.divida > 0) {
            dividaHtml = `<strong style="color: #dc2626;">${s.divida.toFixed(2)} €</strong>`;
          } else if (s.divida < 0) {
            dividaHtml = `<strong style="color: #059669;">+${Math.abs(s.divida).toFixed(2)} € (Crédito)</strong>`;
          }
          html += `<td>${dividaHtml}</td>`;
        }
        if (isColVisible('estadoMembro')) {
          html += `<td>${membroBadge}</td>`;
        }
        if (isColVisible('estado')) {
          if (s.estadoMembro === 'Falecido') {
            html += `<td><span class="status-pill" style="background: #f1f5f9; color: #64748b;">Arquivo</span></td>`;
          } else if (s.estadoMembro === 'Inativo') {
            html += `<td><span class="status-pill atrasado">Suspenso</span></td>`;
          } else {
            html += `
              <td>
                <span class="status-pill ${statusClass}">${s.estado} (${s.ultimaQuota || '2026'})</span>
              </td>
            `;
          }
        }
        if (isColVisible('acoes')) {
          html += `
            <td style="text-align: right;">
              <div style="display: inline-flex; gap: 0.4rem;">
                <button class="btn btn-outline btn-sm" onclick="openSocioDrawer(${s.id})" title="Ver Ficha Completa">
                  Ver Ficha
                </button>
                ${s.estadoMembro === 'Ativo' ? (
                  s.estado !== 'Em Dia' ? `
                    <button class="btn btn-primary btn-sm" onclick="liquidarQuota(${s.id})" title="Registar Liquidação Quota 2026">
                      Pagar
                    </button>
                  ` : `
                    <button class="btn btn-secondary btn-sm" onclick="emitirRecibo(${s.id})" title="Imprimir Recibo Oficial">
                      Recibo
                    </button>
                  `
                ) : ''}
              </div>
            </td>
          `;
        }

        tr.innerHTML = html;
        sociosTableBody.appendChild(tr);
      });
    }

    // Ação: Liquidar Quota
    window.liquidarQuota = function(id) {
      const socio = socios.find(s => s.id === id);
      if (socio) {
        socio.ultimaQuota = 2026;
        socio.divida = 0;
        socio.estado = 'Em Dia';
        socio.ultimaAtualizacao = new Date().toISOString().slice(0, 10);
        const todayStr = new Date().toLocaleDateString('pt-PT');
        socio.observacoes = (socio.observacoes ? socio.observacoes + ' | ' : '') + `[${todayStr}] Quota 2026 liquidada (6.00 €)`;
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

      let statusBadge = `<span class="status-pill em-dia">Quota Regularizada (${socio.ultimaQuota || 2026})</span>`;
      if (socio.estado === 'Pendente') statusBadge = `<span class="status-pill pendente">Quota Pendente (${socio.ultimaQuota || 2025})</span>`;
      if (socio.estado === 'Atrasado') statusBadge = `<span class="status-pill atrasado">Quota em Atraso (${socio.ultimaQuota || 'Sem registo'})</span>`;
      if (socio.estadoMembro === 'Falecido') statusBadge = `<span class="status-pill" style="background:#f1f5f9;color:#64748b;">Associado Falecido (Arquivo)</span>`;
      if (socio.estadoMembro === 'Inativo') statusBadge = `<span class="status-pill atrasado">Associado Inativo / Desvinculado</span>`;

      let membroTag = `<span style="background: rgba(28,109,66,0.12); color: #1c6d42; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.85rem;">Ativo</span>`;
      if (socio.estadoMembro === 'Falecido') membroTag = `<span style="background: #e2e8f0; color: #475569; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.85rem;">Falecido</span>`;
      if (socio.estadoMembro === 'Inativo') membroTag = `<span style="background: rgba(217,119,6,0.12); color: #d97706; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.85rem;">Inativo</span>`;

      const words = (socio.nome || 'S').split(' ').filter(Boolean);
      const initials = words.length > 1 ? (words[0][0] + words[words.length - 1][0]).toUpperCase() : (words[0] ? words[0].slice(0, 2).toUpperCase() : 'SC');

      drawerContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--primary); color: #fff; font-size: 1.5rem; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0.75rem;">
            ${initials}
          </div>
          <h2 style="font-size: 1.4rem; color: var(--text-title); line-height: 1.3;">${escapeHtml(socio.nome)}</h2>
          <div style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.35rem;">
            Sócio Nº <strong>#${socio.numero}</strong> &bull; Categoria <strong>${escapeHtml(socio.categoria)}</strong> &bull; ${membroTag}
          </div>
          <div style="margin-top: 0.75rem;">${statusBadge}</div>
        </div>

        <div style="background: var(--bg-page); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem; letter-spacing: 0.05em;">Dados Cadastrais</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.9rem;">
            <div><strong>NIF:</strong> ${escapeHtml(socio.nif || '-')}</div>
            <div><strong>Nascimento:</strong> ${escapeHtml(socio.dataNascimento || '-')}</div>
            <div><strong>Telefone:</strong> ${escapeHtml(socio.telefone || '-')}</div>
            <div><strong>Email:</strong> ${escapeHtml(socio.email || '-')}</div>
            ${socio.oldNumero ? `<div><strong>OLD Nº:</strong> ${escapeHtml(socio.oldNumero)}</div>` : ''}
            ${socio.grupo ? `<div><strong>Grupo:</strong> ${escapeHtml(socio.grupo)}</div>` : ''}
          </div>
          <div style="margin-top: 0.75rem; font-size: 0.9rem;">
            <strong>Morada:</strong> ${escapeHtml(socio.morada || 'Aguada de Baixo')}
          </div>
        </div>

        <div style="background: #ffffff; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem; letter-spacing: 0.05em;">Situação Financeira & Quotas</h4>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem;">
            <span>Valor Oficial da Quota Anual:</span>
            <strong>6.00 €</strong>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; margin-top: 0.5rem;">
            <span>Último Ano Liquidado:</span>
            <strong style="color: var(--primary);">${socio.ultimaQuota || 'Sem registo'}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; margin-top: 0.5rem;">
            <span>Dívida / Saldo em Aberto:</span>
            <strong>${socio.divida > 0 ? `<span style="color:#dc2626;">${socio.divida.toFixed(2)} € em atraso</span>` : (socio.divida < 0 ? `<span style="color:#059669;">+${Math.abs(socio.divida).toFixed(2)} € (Saldo a favor)</span>` : `<span style="color:#059669;">0.00 € (Sem dívida)</span>`)}</strong>
          </div>
          ${socio.ultimaAtualizacao ? `
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
              <span>Última Atualização Registada:</span>
              <span>${socio.ultimaAtualizacao}</span>
            </div>
          ` : ''}
        </div>

        <!-- Observações e Pautas Oficiais -->
        <div style="background: rgba(28,109,66,0.04); border: 1px solid rgba(28,109,66,0.15); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.8rem; text-transform: uppercase; color: var(--primary); margin-bottom: 0.5rem; letter-spacing: 0.05em;">Anotações & Histórico Financeiro</h4>
          <p style="font-size: 0.88rem; color: var(--text-body); margin: 0; white-space: pre-line; line-height: 1.5;">
            ${escapeHtml(socio.observacoes || 'Sem anotações ou ocorrências pendentes registadas nesta ficha.')}
          </p>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
          <button class="btn btn-secondary" style="flex: 1;" onclick="emitirRecibo(${socio.id})">
            📄 Emitir Recibo Oficial
          </button>
          ${socio.estadoMembro === 'Ativo' && socio.estado !== 'Em Dia' ? `
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
      const valor = (socio.valorQuota || 6).toFixed(2);

      const printWindow = window.open('', '', 'width=780,height=600');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Recibo de Quota - ARCA Aguada de Baixo</title>
          <style>
            body { font-family: -apple-system, system-ui, sans-serif; padding: 40px; color: #1a271f; line-height: 1.6; background: #ffffff; }
            .receipt-box { border: 2px solid #1c6d42; border-radius: 12px; padding: 30px; position: relative; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eaf5ee; padding-bottom: 20px; margin-bottom: 25px; }
            .logo-text h1 { margin: 0; font-size: 24px; color: #1c6d42; }
            .logo-text p { margin: 0; font-size: 13px; color: #6b7f72; }
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
              <span><strong>Recebemos de:</strong> ${escapeHtml(socio.nome)}</span>
              <span><strong>Sócio Nº:</strong> #${socio.numero}</span>
            </div>
            <div class="row">
              <span><strong>NIF:</strong> ${escapeHtml(socio.nif || 'Consumidor Final')}</span>
              <span><strong>Categoria:</strong> ${escapeHtml(socio.categoria)}</span>
            </div>
            <div class="row">
              <span><strong>Morada:</strong> ${escapeHtml(socio.morada || 'Aguada de Baixo')}</span>
            </div>

            <div style="background: #f1f7f3; padding: 15px; border-radius: 8px; margin: 25px 0;">
              <div class="row" style="margin: 0;">
                <span>Liquidação da Quota Anual de Associado (${socio.ultimaQuota || 2026})</span>
                <strong>${valor} €</strong>
              </div>
            </div>

            <div class="row total-row">
              <span>Total Liquidado</span>
              <span style="color: #1c6d42;">${valor} €</span>
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
      showToast(`Recibo emitido para ${socio.nome}!`, 'success');
    };

    // Filtros, Pesquisa e Ordenação
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
        const matchesStatus = (status === 'all') || (s.estado === status);
        const matchesCat = (cat === 'all') || (s.categoria.toLowerCase() === cat.toLowerCase());

        return matchesQuery && matchesMembro && matchesStatus && matchesCat;
      });

      // Ordenação Maior / Menor ou A-Z / Z-A
      filtered.sort((a, b) => {
        if (currentSortField === 'numero') {
          return currentSortDir === 'asc' ? (a.numero - b.numero) : (b.numero - a.numero);
        }
        if (currentSortField === 'divida') {
          const dA = a.divida || 0;
          const dB = b.divida || 0;
          return currentSortDir === 'asc' ? (dA - dB) : (dB - dA);
        }
        if (currentSortField === 'nome') {
          const c = a.nome.localeCompare(b.nome || '', 'pt', { sensitivity: 'base' });
          return currentSortDir === 'asc' ? c : -c;
        }
        if (currentSortField === 'categoria') {
          const c = (a.categoria || '').localeCompare(b.categoria || '', 'pt', { sensitivity: 'base' });
          return currentSortDir === 'asc' ? c : -c;
        }
        if (currentSortField === 'estado') {
          const c = (a.estado || '').localeCompare(b.estado || '', 'pt', { sensitivity: 'base' });
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
            id: newNumero,
            numero: newNumero,
            nome,
            nif,
            categoria,
            telefone,
            email,
            morada,
            divida: 0,
            dataInscricao: new Date().toLocaleDateString('pt-PT'),
            ultimaQuota: 2026,
            valorQuota: 6.00,
            estadoMembro: 'Ativo',
            estado: 'Em Dia',
            observacoes: `Inscrição efetuada em ${new Date().toLocaleDateString('pt-PT')}.`
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

    // Exportar CSV Oficial Completo
    const btnExportCsv = document.getElementById('btnExportCsv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        let csv = "data:text/csv;charset=utf-8,\uFEFF";
        csv += "Nº;Nome;NIF;Categoria;Telefone;Email;Morada;Dívida (€);Último Ano Pago;Situação;Estado Cota;Observações\n";

        socios.forEach(s => {
          const obsClean = (s.observacoes || '').replace(/"/g, '""').replace(/\r?\n/g, ' ');
          const moradaClean = (s.morada || '').replace(/"/g, '""');
          csv += `"${s.numero}";"${s.nome}";"${s.nif || ''}";"${s.categoria}";"${s.telefone || ''}";"${s.email || ''}";"${moradaClean}";"${s.divida || 0}";"${s.ultimaQuota || ''}";"${s.estadoMembro}";"${s.estado}";"${obsClean}"\n`;
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

    // Inicializar Tabela, Colunas Personalizadas, Ordenação e Indicadores
    initSociosColPicker();
    updateSortIndicators();
    updateStats();
    applyFilters();
  }

});
