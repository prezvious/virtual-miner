const SHIFT_ORDER = ['day', 'night', 'overtime', 'safe', 'deep', 'contract'];
const SHIFT_LABELS = {
  day: 'Day',
  night: 'Night',
  overtime: 'Overtime',
  safe: 'Safe',
  deep: 'Deep',
  contract: 'Contract'
};
const EXTRACTION_ORDER = ['balanced', 'aggressive', 'precise'];
const EXTRACTION_LABELS = {
  balanced: 'Balanced',
  aggressive: 'Aggressive',
  precise: 'Precise'
};

export function renderMinePanel(state = {}) {
  const selectedBiome = state.selectedBiome?.name || 'Uncharted route';
  const currentDepth = formatMeters(state.currentGlobalDepth);
  const localDepth = formatMeters(state.localDepth);
  const canSell = Number(state.inventoryLoad) > 0;
  const mode = typeof state.extractionMode === 'string' ? state.extractionMode : 'balanced';
  const activeShift = typeof state.shiftPolicy === 'string' ? state.shiftPolicy : 'day';

  const breakpoints = state.workers?.breakpoints || {};
  const availableShifts = SHIFT_ORDER.filter((id) => isShiftUnlocked(id, breakpoints));
  const mineState = normalizeMineState(state.mineState);
  const incidents = normalizeIncidents(state.incidents);
  const activeEvent = normalizeEvent(state.activeEvent);
  const recentFinds = normalizeFinds(state.recentFinds);
  const blastLevel = Number(state.upgrades?.find((entry) => entry.id === 'dynamite')?.level) || 0;
  const silenceActive = state.activeEvent?.id === 'silence-protocol';

  return `
    <section class="vm-mine" aria-label="Mining operations">
      <header class="vm-mine__hero">
        <div class="vm-mine__hero-copy">
          <p class="vm-mine__eyebrow">Your Mine</p>
          <h3 class="vm-mine__title">Dig and discover in real time</h3>
          <p class="vm-mine__copy">
            Zone: ${escapeHtml(selectedBiome)} | Total depth: ${escapeHtml(currentDepth)} | Zone depth: ${escapeHtml(localDepth)}
          </p>
        </div>
        <div class="vm-mine__hero-actions">
          <button class="vm-mine__primary" type="button" data-action="mine-once" ${silenceActive ? 'disabled' : ''}>${silenceActive ? 'Paused' : 'Dig!'}</button>
          <button class="vm-mine__secondary" type="button" data-action="blast-dynamite" ${silenceActive ? 'disabled' : ''}>
            Dynamite (Lv ${blastLevel})
          </button>
          <button
            class="vm-mine__secondary"
            type="button"
            data-action="sell-all"
            ${canSell ? '' : 'disabled'}
          >
            Sell Items
          </button>
        </div>
      </header>

      <section class="vm-mine__panel">
        <div class="vm-mine__panel-head">
          <div>
            <p class="vm-mine__kicker">Work Schedule</p>
            <h4>Choose when your workers dig</h4>
          </div>
          <p>${escapeHtml(renderShiftHint(breakpoints))}</p>
        </div>
        <div class="vm-mine__chips">
          ${availableShifts
            .map((shiftId) => `
              <button
                class="vm-mine__chip${shiftId === activeShift ? ' is-active' : ''}"
                type="button"
                data-action="set-shift"
                data-shift="${escapeAttr(shiftId)}"
              >
                ${escapeHtml(SHIFT_LABELS[shiftId] ?? shiftId)}
              </button>
            `)
            .join('')}
        </div>
      </section>

      <section class="vm-mine__panel">
        <div class="vm-mine__panel-head">
          <div>
            <p class="vm-mine__kicker">Digging Style</p>
            <h4>Pick how your workers dig</h4>
          </div>
        </div>
        <div class="vm-mine__chips">
          ${EXTRACTION_ORDER
            .map((modeId) => `
              <button
                class="vm-mine__chip${modeId === mode ? ' is-active' : ''}"
                type="button"
                data-action="set-extraction-mode"
                data-mode="${escapeAttr(modeId)}"
              >
                ${escapeHtml(EXTRACTION_LABELS[modeId] ?? modeId)}
              </button>
            `)
            .join('')}
        </div>
      </section>

      <section class="vm-mine__panel">
        <div class="vm-mine__panel-head">
          <div>
            <p class="vm-mine__kicker">Mine Conditions</p>
            <h4>How your mine is doing</h4>
          </div>
        </div>
        <div class="vm-mine__meters">
          ${mineState
            .map((item) => `
              <article class="vm-mine__meter-row">
                <div class="vm-mine__meter-head">
                  <span>${escapeHtml(item.label)}</span>
                  <strong>${escapeHtml(item.value)}</strong>
                </div>
                <div class="vm-mine__meter-bar" aria-hidden="true">
                  <span style="width:${item.percent}%"></span>
                </div>
              </article>
            `)
            .join('')}
        </div>
      </section>

      <section class="vm-mine__panel">
        <div class="vm-mine__panel-head">
          <div>
            <p class="vm-mine__kicker">Special Events</p>
            <h4>${escapeHtml(activeEvent.title)}</h4>
          </div>
          <p>${escapeHtml(activeEvent.timer)}</p>
        </div>
        <p class="vm-mine__copy">${escapeHtml(activeEvent.description)}</p>
        ${
          activeEvent.options.length
            ? `
              <div class="vm-mine__chips">
                ${activeEvent.options
                  .map((option) => `
                    <button
                      class="vm-mine__chip"
                      type="button"
                      data-action="choose-event-option"
                      data-option-id="${escapeAttr(option.id)}"
                    >
                      ${escapeHtml(option.label)}
                    </button>
                  `)
                  .join('')}
              </div>
            `
            : ''
        }
      </section>

      <section class="vm-mine__panel">
        <div class="vm-mine__panel-head">
          <div>
            <p class="vm-mine__kicker">Dangers</p>
            <h4>Fix problems before things get worse</h4>
          </div>
        </div>
        ${
          incidents.length
            ? `
              <div class="vm-mine__incidents">
                ${incidents
                  .map((incident) => `
                    <article class="vm-mine__incident">
                      <div>
                        <h5>${escapeHtml(incident.title)}</h5>
                        <p>${escapeHtml(incident.description)}</p>
                      </div>
                      <p>Danger ${incident.severity} | Cost ${incident.responseCost}</p>
                      <div class="vm-mine__incident-actions">
                        <button
                          class="vm-mine__secondary"
                          type="button"
                          data-action="resolve-incident"
                          data-incident-id="${escapeAttr(incident.id)}"
                          data-resolution="dispatch"
                        >
                          Send Help
                        </button>
                        <button
                          class="vm-mine__secondary"
                          type="button"
                          data-action="resolve-incident"
                          data-incident-id="${escapeAttr(incident.id)}"
                          data-resolution="triage"
                        >
                          Quick Fix
                        </button>
                        <button
                          class="vm-mine__secondary"
                          type="button"
                          data-action="resolve-incident"
                          data-incident-id="${escapeAttr(incident.id)}"
                          data-resolution="abandon"
                        >
                          Skip
                        </button>
                      </div>
                    </article>
                  `)
                  .join('')}
              </div>
            `
            : `
              <article class="vm-mine__empty">
                <h5>All safe!</h5>
                <p>No dangers right now. Keep your workers happy and rested!</p>
              </article>
            `
        }
      </section>

      <section class="vm-mine__panel">
        <div class="vm-mine__panel-head">
          <div>
            <p class="vm-mine__kicker">Recent Discoveries</p>
            <h4>What you found recently</h4>
          </div>
        </div>
        ${
          recentFinds.length
            ? `
              <ul class="vm-mine__find-feed">
                ${recentFinds
                  .map((find) => `
                    <li data-rarity="${escapeAttr(find.rarity)}"${find.tierName ? ` data-tier="${escapeAttr(find.tierName)}"` : ''}>
                      <strong>${escapeHtml(find.name)}</strong>
                      <span>${escapeHtml(find.meta)}</span>
                    </li>
                  `)
                  .join('')}
              </ul>
            `
            : `
              <article class="vm-mine__empty">
                <h5>Nothing found yet</h5>
                <p>Start digging to find ores and treasures!</p>
              </article>
            `
        }
      </section>
    </section>
  `;
}

export function bindMinePanel(root, store) {
  void root;
  void store;
}

function isShiftUnlocked(shiftId, breakpoints) {
  if (shiftId === 'day') {
    return true;
  }
  if (shiftId === 'night' || shiftId === 'overtime' || shiftId === 'safe') {
    return Boolean(breakpoints.secondShift);
  }
  if (shiftId === 'deep') {
    return Boolean(breakpoints.specialization);
  }
  if (shiftId === 'contract') {
    return Boolean(breakpoints.operationsBoard);
  }
  return false;
}

function renderShiftHint(breakpoints) {
  if (!breakpoints.secondShift) {
    return 'Get 25 workers to unlock more schedules.';
  }
  if (!breakpoints.specialization) {
    return 'Get 50 workers to unlock deep mining.';
  }
  if (!breakpoints.operationsBoard) {
    return 'Get 250 workers to unlock job-focused mining.';
  }
  return 'All schedules unlocked!';
}

function normalizeMineState(mineState) {
  const source = mineState && typeof mineState === 'object' ? mineState : {};

  const entries = [
    ['heat', 'Heat'],
    ['pressure', 'Pressure'],
    ['air', 'Air'],
    ['light', 'Light'],
    ['flow', 'Flow'],
    ['charge', 'Charge'],
    ['integrity', 'Integrity'],
    ['specimenIntegrity', 'Sample Quality'],
    ['routeStability', 'Path Stability']
  ];

  return entries.map(([key, label]) => {
    const numeric = clamp(Number(source[key]), 0, 1);
    return {
      key,
      label,
      percent: Math.round(numeric * 100),
      value: `${Math.round(numeric * 100)}%`
    };
  });
}

function normalizeIncidents(incidents) {
  if (!Array.isArray(incidents)) {
    return [];
  }

  return incidents
    .filter((incident) => incident && typeof incident === 'object')
    .slice(0, 4)
    .map((incident) => ({
      id: incident.id || '',
      title: incident.title || 'Incident',
      description: incident.description || 'Operational disruption detected.',
      severity: Number.isFinite(Number(incident.severity)) ? Number(incident.severity) : 1,
      responseCost: formatCredits(incident.responseCost)
    }));
}

function normalizeEvent(activeEvent) {
  if (!activeEvent || typeof activeEvent !== 'object') {
    return {
      title: 'No active event',
      description: 'The mine is stable. New event windows will open as operations continue.',
      timer: '--',
      options: []
    };
  }

  return {
    title: activeEvent.name || 'Active event',
    description: activeEvent.description || 'An event rule is currently active.',
    timer: `${Math.max(0, Math.ceil(Number(activeEvent.remaining) || 0))}s`,
    options: Array.isArray(activeEvent.options)
      ? activeEvent.options
          .filter((option) => option && typeof option === 'object')
          .slice(0, 3)
          .map((option) => ({
            id: option.id || '',
            label: option.label || option.id || 'Select'
          }))
      : []
  };
}

function normalizeFinds(recentFinds) {
  if (!Array.isArray(recentFinds)) {
    return [];
  }

  return recentFinds
    .filter((find) => find && typeof find === 'object')
    .slice(0, 8)
    .map((find) => {
      const tierLabel = find.tierName ?? find.rarity ?? 'common';
      const luckyTag = find.luckyStrike ? ' ★' : '';
      return {
        name: find.name || 'Unknown item',
        rarity: find.rarity || 'common',
        tierName: find.tierName || null,
        meta: `${tierLabel}${luckyTag} | x${formatSimpleNumber(find.quantity)} | ${formatCredits(find.value)}`
      };
    });
}

function formatMeters(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return '0 m';
  }
  return `${Math.round(numeric).toLocaleString('en-US')} m`;
}

function formatCredits(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return '0 coins';
  }
  return `${Math.round(numeric).toLocaleString('en-US')} coins`;
}

function formatSimpleNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return '0';
  }
  return Math.round(numeric).toLocaleString('en-US');
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#96;');
}
