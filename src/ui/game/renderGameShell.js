import { formatSimpleNumber, formatLargeNumber, escapeHtml, escapeAttr } from '../../game/utils/formatters.js';
import { clampNumber } from '../../game/utils/math.js';

const TAB_DEFS = [
  {
    id: 'mine',
    label: 'Mine',
    kicker: 'Dig and react',
    summary: 'Mine ore, handle hazards, and catch active events.'
  },
  {
    id: 'economy',
    label: 'Shop',
    kicker: 'Sell and upgrade',
    summary: 'Turn ore into coins, upgrades, contracts, and refinery output.'
  },
  {
    id: 'world',
    label: 'World',
    kicker: 'Zones and crew',
    summary: 'Open new zones, manage workers, and plan your next depth push.'
  },
  {
    id: 'systems',
    label: 'Systems',
    kicker: 'Rules and goals',
    summary: 'Learn the loop, check progress rules, and see good next targets.'
  }
];

export function renderGameShell({
  state = {},
  minePanel = '',
  economyPanel = '',
  worldPanel = '',
  systemsPanel = '',
  shortcutsOpen = false
} = {}) {
  const activeTab = normalizeTab(state.activeTab);
  const selectedBiome = getBiomeLabel(state.selectedBiome);
  const credits = formatCredits(state.credits);
  const lifetimeCredits = formatCredits(state.lifetimeCredits);
  const inventoryLoad = formatNumber(state.inventoryLoad);
  const carryingCapacity = formatNumber(state.storageCap);
  const capacityRatio = getCapacityRatio(state.capacityRatio, state.inventoryLoad, state.storageCap);
  const notifications = normalizeNotifications(state.notifications);
  const stats = normalizeStats(state.stats);
  const contracts = summarizeContracts(state.contracts);
  const offlineReport = normalizeOfflineReport(state.offlineReport);
  const workforce = normalizeWorkforce(state.workers);
  const eventCard = normalizeEventCard(state.activeEvent);

  return `
    <section class="vm-game" data-active-tab="${escapeAttr(activeTab)}" aria-label="Virtual Miner">
      <div class="vm-game-shell" data-active-tab="${escapeAttr(activeTab)}">
        <header class="vm-game-shell__hud" aria-label="Game summary">
          <section class="vm-game-command">
            <p class="vm-game-command__eyebrow">Mine Base</p>
            <div class="vm-game-command__headline">
              <div>
                <h1 class="vm-game-command__title">Virtual Miner</h1>
                <p class="vm-game-command__copy">
                  Dig, sell, upgrade, unlock zones, and keep the mine earning even while you are away.
                </p>
              </div>
              <div class="vm-game-command__focus">
                <span class="vm-game-command__focus-label">Zone</span>
                <strong class="vm-game-command__focus-value">${escapeHtml(selectedBiome)}</strong>
              </div>
            </div>
          </section>

          <section class="vm-game-hud-strip" aria-label="Core metrics">
            <article class="vm-game-metric-card">
              <span class="vm-game-metric-card__label">Coins</span>
              <strong class="vm-game-metric-card__value">${escapeHtml(credits)}</strong>
              <span class="vm-game-metric-card__detail">Spend coins on upgrades, buildings, and worker growth.</span>
            </article>
            <article class="vm-game-metric-card">
              <span class="vm-game-metric-card__label">Total earned</span>
              <strong class="vm-game-metric-card__value">${escapeHtml(lifetimeCredits)}</strong>
              <span class="vm-game-metric-card__detail">Your full all-time coin total.</span>
            </article>
            <article class="vm-game-metric-card">
              <span class="vm-game-metric-card__label">Storage</span>
              <strong class="vm-game-metric-card__value">${escapeHtml(`${inventoryLoad} / ${carryingCapacity}`)}</strong>
              <span class="vm-game-metric-card__detail">${escapeHtml(formatPercent(capacityRatio))} full.</span>
            </article>
            <article class="vm-game-metric-card">
              <span class="vm-game-metric-card__label">Rewards ready</span>
              <strong class="vm-game-metric-card__value">${escapeHtml(String(contracts.ready))}</strong>
              <span class="vm-game-metric-card__detail">${escapeHtml(contracts.detail)}</span>
            </article>
          </section>

          ${
            offlineReport
              ? `
                <section class="vm-game-offline" aria-label="Offline progress report">
                  <div class="vm-game-offline__header">
                    <div>
                      <p class="vm-game-offline__eyebrow">While you were away</p>
                      <h2 class="vm-game-offline__title">${escapeHtml(offlineReport.title)}</h2>
                    </div>
                    <button
                      class="vm-game-offline__dismiss"
                      type="button"
                      data-action="dismiss-offline-report"
                    >
                      Got it!
                    </button>
                  </div>
                  <div class="vm-game-offline__stats">
                    ${(offlineReport.panels ?? []).map((panel) => `
                      <div class="vm-game-offline__stat">
                        <span class="vm-game-offline__stat-label">${escapeHtml(panel.label)}</span>
                        <strong class="vm-game-offline__stat-value">${escapeHtml(String(panel.value))}</strong>
                        ${panel.detail ? `<span class="vm-game-offline__stat-detail">${escapeHtml(panel.detail)}</span>` : ''}
                      </div>
                    `).join('')}
                    ${!(offlineReport.panels ?? []).length ? `
                      <div class="vm-game-offline__stat">
                        <span class="vm-game-offline__stat-label">Time away</span>
                        <strong class="vm-game-offline__stat-value">${escapeHtml(offlineReport.timeAway)}</strong>
                      </div>
                      <div class="vm-game-offline__stat">
                        <span class="vm-game-offline__stat-label">Coins earned</span>
                        <strong class="vm-game-offline__stat-value">${escapeHtml(offlineReport.creditsEarned)}</strong>
                      </div>
                      <div class="vm-game-offline__stat">
                        <span class="vm-game-offline__stat-label">Highlights</span>
                        <strong class="vm-game-offline__stat-value">${escapeHtml(String(offlineReport.highlightCount))}</strong>
                      </div>
                    ` : ''}
                  </div>
                  <p class="vm-game-offline__copy">${escapeHtml(offlineReport.summary)}</p>
                </section>
              `
              : ''
          }
        </header>

        <nav class="vm-game-shell__tabs" role="tablist" aria-label="Game tabs">
          ${TAB_DEFS.map((tab) => renderTabButton(tab, activeTab)).join('')}
        </nav>

        <main class="vm-game-shell__panel" aria-live="polite">
          ${renderSurface(TAB_DEFS[0], activeTab, minePanel)}
          ${renderSurface(TAB_DEFS[1], activeTab, economyPanel)}
          ${renderSurface(TAB_DEFS[2], activeTab, worldPanel)}
          ${renderSurface(TAB_DEFS[3], activeTab, systemsPanel)}
        </main>

        <aside class="vm-game-shell__aside" aria-label="Status board">
          <section class="vm-game-sidecard vm-game-sidecard--cargo">
            <div class="vm-game-sidecard__header">
              <p class="vm-game-sidecard__eyebrow">Backpack</p>
              <strong class="vm-game-sidecard__title">Storage</strong>
            </div>
            <p class="vm-game-sidecard__copy">
              ${escapeHtml(`${inventoryLoad} of ${carryingCapacity} slots used. Sell items before your backpack overflows!`)}
            </p>
            <div class="vm-game-meter" style="--vm-game-meter:${escapeAttr(String(capacityRatio))}">
              <span class="vm-game-meter__fill" aria-hidden="true"></span>
            </div>
            <div class="vm-game-sidecard__meta">
              <span>How full</span>
              <strong>${escapeHtml(formatPercent(capacityRatio))}</strong>
            </div>
            <button
              class="vm-game-sidecard__button"
              type="button"
              data-action="sell-all"
              ${Number(state.inventoryLoad) > 0 ? '' : 'disabled'}
            >
              Sell Items
            </button>
          </section>

          <section class="vm-game-sidecard">
            <div class="vm-game-sidecard__header">
              <p class="vm-game-sidecard__eyebrow">Workers</p>
              <strong class="vm-game-sidecard__title">${escapeHtml(`${workforce.headcount} workers hired`)}</strong>
            </div>
            <p class="vm-game-sidecard__copy">${escapeHtml(workforce.summary)}</p>
            <dl class="vm-game-mini-grid">
              <div>
                <dt>Working</dt>
                <dd>${escapeHtml(workforce.effective)}</dd>
              </div>
              <div>
                <dt>Happiness</dt>
                <dd>${escapeHtml(workforce.morale)}</dd>
              </div>
              <div>
                <dt>Tiredness</dt>
                <dd>${escapeHtml(workforce.fatigue)}</dd>
              </div>
            </dl>
          </section>

          <section class="vm-game-sidecard">
            <div class="vm-game-sidecard__header">
              <p class="vm-game-sidecard__eyebrow">Events</p>
              <strong class="vm-game-sidecard__title">${escapeHtml(eventCard.title)}</strong>
            </div>
            <p class="vm-game-sidecard__copy">${escapeHtml(eventCard.copy)}</p>
            <dl class="vm-game-mini-grid">
              <div>
                <dt>Status</dt>
                <dd>${escapeHtml(eventCard.status)}</dd>
              </div>
              <div>
                <dt>Timer</dt>
                <dd>${escapeHtml(eventCard.timer)}</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>${escapeHtml(eventCard.family)}</dd>
              </div>
            </dl>
          </section>

          ${
            notifications.length || stats.length
              ? `
                <section class="vm-game-sidecard">
                  <div class="vm-game-sidecard__header">
                    <p class="vm-game-sidecard__eyebrow">Status</p>
                    <strong class="vm-game-sidecard__title">Recent updates</strong>
                  </div>
                  ${
                    notifications.length
                      ? `
                        <ul class="vm-game-feed vm-game-feed--signals" aria-label="Notifications">
                          ${notifications.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
                        </ul>
                      `
                      : ''
                  }
                  ${
                    stats.length
                      ? `
                        <dl class="vm-game-statlist" aria-label="Additional stats">
                          ${stats
                            .map(
                              (item) => `
                                <div>
                                  <dt>${escapeHtml(item.label)}</dt>
                                  <dd>${escapeHtml(item.value)}</dd>
                                </div>
                              `
                            )
                            .join('')}
                        </dl>
                      `
                      : ''
                  }
                </section>
              `
              : ''
          }

          <button
            class="vm-shortcuts-toggle"
            type="button"
            data-action="toggle-shortcuts"
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts (?)"
          >?</button>
        </aside>
      </div>

      ${shortcutsOpen ? renderShortcutsOverlay() : ''}
    </section>
  `;
}

function renderTabButton(tab, activeTab) {
  const isActive = tab.id === activeTab;

  return `
    <button
      id="vm-tab-${escapeAttr(tab.id)}"
      class="vm-game-tab${isActive ? ' is-active' : ''}"
      type="button"
      role="tab"
      aria-selected="${isActive ? 'true' : 'false'}"
      aria-controls="vm-panel-${escapeAttr(tab.id)}"
      tabindex="${isActive ? '0' : '-1'}"
      data-action="set-tab"
      data-tab="${escapeAttr(tab.id)}"
    >
      <span class="vm-game-tab__kicker">${escapeHtml(tab.kicker)}</span>
      <strong class="vm-game-tab__label">${escapeHtml(tab.label)}</strong>
      <span class="vm-game-tab__summary">${escapeHtml(tab.summary)}</span>
    </button>
  `;
}

function renderSurface(tab, activeTab, panelHtml) {
  const isActive = tab.id === activeTab;
  const safePanel = typeof panelHtml === 'string' && panelHtml.trim()
    ? panelHtml
    : `<div class="vm-game-surface__empty">No ${escapeHtml(tab.label.toLowerCase())} panel available.</div>`;

  return `
    <section
      id="vm-panel-${escapeAttr(tab.id)}"
      class="vm-game-surface${isActive ? ' is-active' : ''}"
      role="tabpanel"
      aria-labelledby="vm-tab-${escapeAttr(tab.id)}"
      ${isActive ? '' : 'hidden'}
    >
      <header class="vm-game-surface__header">
        <div>
          <p class="vm-game-surface__eyebrow">${escapeHtml(tab.kicker)}</p>
          <h2 class="vm-game-surface__title">${escapeHtml(tab.label)}</h2>
        </div>
        <p class="vm-game-surface__summary">${escapeHtml(tab.summary)}</p>
      </header>
      <div class="vm-game-surface__body">
        ${safePanel}
      </div>
    </section>
  `;
}

function normalizeTab(value) {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return TAB_DEFS.some((tab) => tab.id === normalized) ? normalized : 'mine';
}

function getBiomeLabel(selectedBiome) {
  if (typeof selectedBiome === 'string' && selectedBiome.trim()) {
    return selectedBiome.trim();
  }

  if (selectedBiome && typeof selectedBiome === 'object') {
    return selectedBiome.name || selectedBiome.label || selectedBiome.id || 'Uncharted zone';
  }

  return 'Uncharted zone';
}

function summarizeContracts(contracts) {
  const items = Array.isArray(contracts) ? contracts : [];
  const active = items.filter((item) => !matchesStatus(item, ['done', 'complete', 'completed', 'claimed'])).length;
  const ready = items.filter((item) => matchesStatus(item, ['ready', 'claimable'])).length;
  const total = items.length;

  if (!total) {
    return {
      detail: 'No jobs in queue.',
      active: 0,
      ready: 0,
      total: 0
    };
  }

  return {
    detail: `${active} active job${active === 1 ? '' : 's'} with ${ready} ready to collect.`,
    active,
    ready,
    total
  };
}

function matchesStatus(item, statuses) {
  const status = typeof item?.status === 'string' ? item.status.trim().toLowerCase() : '';
  return statuses.includes(status);
}

function normalizeNotifications(notifications) {
  if (Array.isArray(notifications)) {
    return notifications
      .map((item) => {
        if (typeof item === 'string') {
          return item.trim();
        }

        if (item && typeof item === 'object') {
          return item.message || item.title || item.label || '';
        }

        return '';
      })
      .filter(Boolean)
      .slice(0, 4);
  }

  if (typeof notifications === 'string' && notifications.trim()) {
    return [notifications.trim()];
  }

  return [];
}

function normalizeStats(stats) {
  if (!stats || typeof stats !== 'object') {
    return [];
  }

  return Object.entries(stats)
    .filter(([, value]) => value != null && value !== '')
    .slice(0, 5)
    .map(([label, value]) => ({
      label: humanizeKey(label),
      value: String(value)
    }));
}

function normalizeOfflineReport(offlineReport) {
  if (!offlineReport || typeof offlineReport !== 'object') {
    return null;
  }

  return {
    title: firstString(offlineReport.title, offlineReport.heading) || 'Welcome Back!',
    timeAway: firstString(offlineReport.timeAway, offlineReport.duration) || 'Welcome back',
    creditsEarned: Number.isFinite(Number(offlineReport.creditsEarned))
      ? formatCredits(offlineReport.creditsEarned)
      : '0 coins',
    highlightCount: Number.isFinite(Number(offlineReport.highlightCount))
      ? Number(offlineReport.highlightCount)
      : 0,
    panels: Array.isArray(offlineReport.panels) ? offlineReport.panels : [],
    summary: firstString(offlineReport.summary, offlineReport.message) || 'Your mine kept working while you were away!'
  };
}

function normalizeWorkforce(workers) {
  const source = workers && typeof workers === 'object' ? workers : {};
  const headcount = Math.max(0, Math.floor(Number(source.headcount) || 0));
  const effective = Math.max(0, Math.floor(Number(source.effectiveWorkforce) || 0));
  const morale = Math.round((Number(source.morale) || 0) * 100);
  const fatigue = Math.round((Number(source.fatigue) || 0) * 100);

  return {
    headcount,
    effective: effective.toLocaleString('en-US'),
    morale: `${morale}%`,
    fatigue: `${fatigue}%`,
    summary: `Beds ${formatSimpleNumber(source.housingCapacity)} | Help ${formatSimpleNumber(source.supportCapacity)} | Pay ${formatCredits(source.payrollLoad)}`
  };
}

function normalizeEventCard(activeEvent) {
  if (!activeEvent || typeof activeEvent !== 'object') {
    return {
      title: 'No events right now',
      copy: 'All clear! Something exciting will happen soon.',
      status: 'Idle',
      timer: '--',
      family: '--'
    };
  }

  return {
    title: activeEvent.name || 'Active event',
    copy: activeEvent.description || 'Event modifier active.',
    status: 'Live',
    timer: `${Math.max(0, Math.ceil(Number(activeEvent.remaining) || 0))}s`,
    family: activeEvent.family || 'mixed'
  };
}

function getCapacityRatio(explicitRatio, load, capacity) {
  const normalizedExplicit = clampNumber(Number(explicitRatio), 0, 1);
  if (Number.isFinite(normalizedExplicit)) {
    return normalizedExplicit;
  }

  const safeLoad = Number(load);
  const safeCapacity = Number(capacity);

  if (!Number.isFinite(safeLoad) || !Number.isFinite(safeCapacity) || safeCapacity <= 0) {
    return 0;
  }

  return clampNumber(safeLoad / safeCapacity, 0, 1);
}

function formatCredits(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return '0 coins';
  }
  return `${formatLargeNumber(amount)} coins`;
}

function formatNumber(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toLocaleString('en-US') : '0';
}

function formatPercent(value) {
  return `${Math.round(clampNumber(value, 0, 1) * 100)}%`;
}

function humanizeKey(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\w/, (match) => match.toUpperCase());
}

function firstString(...values) {
  return values.find((value) => typeof value === 'string' && value.trim())?.trim() || '';
}

function renderShortcutsOverlay() {
  const shortcuts = [
    ['1', 'Mine tab'],
    ['2', 'Shop tab'],
    ['3', 'World tab'],
    ['4', 'Systems tab'],
    ['D', 'Dig for ore'],
    ['B', 'Use dynamite'],
    ['S', 'Sell all items'],
    ['U', 'Open upgrades'],
    ['H', 'Open helpers'],
    ['R', 'Get new jobs'],
    ['F', 'Start crafting'],
    ['C', 'Collect a job reward'],
    ['Esc', 'Close popup'],
    ['?', 'Show / hide shortcuts'],
  ];

  return `
    <div class="vm-shortcuts-overlay" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
      <button class="vm-shortcuts-overlay__backdrop" type="button" data-action="toggle-shortcuts" aria-label="Close shortcuts"></button>
      <div class="vm-shortcuts-overlay__panel">
        <div class="vm-shortcuts-overlay__header">
          <h3 class="vm-shortcuts-overlay__title">Keyboard Shortcuts</h3>
          <button class="vm-economy__secondary vm-shortcuts-overlay__close" type="button" data-action="toggle-shortcuts">Close</button>
        </div>
        <div class="vm-shortcuts-overlay__grid">
          ${shortcuts.map(([key, label]) => `
            <div class="vm-shortcuts-overlay__item">
              <kbd class="vm-shortcuts-overlay__key">${escapeHtml(key)}</kbd>
              <span class="vm-shortcuts-overlay__label">${escapeHtml(label)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
