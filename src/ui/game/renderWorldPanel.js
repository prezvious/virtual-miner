import { formatMeters, formatSimpleNumber, escapeHtml, escapeAttr } from '../../game/utils/formatters.js';
import { clampNumber } from '../../game/utils/math.js';

const BREAKPOINT_ORDER = [
  { key: 'foreman', workers: 10, label: 'First Boss' },
  { key: 'secondShift', workers: 25, label: 'Night Shift' },
  { key: 'specialization', workers: 50, label: 'Expert Workers' },
  { key: 'outposts', workers: 100, label: 'Zone Bases' },
  { key: 'operationsBoard', workers: 250, label: 'Headquarters' },
  { key: 'divisions', workers: 500, label: 'Mining Empire' }
];

export function renderWorldPanel(state = {}) {
  const biomes = normalizeBiomes(state.biomes);
  const selectedBiomeId = state.selectedBiomeId || biomes[0]?.id || '';
  const breakpoints = normalizeBreakpoints(state.workers?.breakpoints, state.workers?.headcount);
  const discoveries = normalizeDiscoveries(state.discoveries);
  const eventHistory = normalizeEventHistory(state.eventHistory);
  const depthSummary = normalizeDepthSummary(state);
  const crewMix = normalizeCrewMix(state.crews, state.workers?.headcount);

  return `
    <section class="vm-world" aria-label="World and operations board">
      <header class="vm-world__hero">
        <div>
          <p class="vm-world__eyebrow">World</p>
          <h3 class="vm-world__title">Explore zones and grow your team</h3>
          <p class="vm-world__copy">
            Open new zones, grow your crew, and plan the next depth push.
          </p>
        </div>
        <dl class="vm-world__hero-metrics">
          <div>
            <dt>Current depth</dt>
            <dd>${escapeHtml(depthSummary.current)}</dd>
          </div>
          <div>
            <dt>Deepest ever</dt>
            <dd>${escapeHtml(depthSummary.deepest)}</dd>
          </div>
          <div>
            <dt>World size</dt>
            <dd>${escapeHtml(depthSummary.total)}</dd>
          </div>
        </dl>
      </header>

      <section class="vm-world__panel">
        <div class="vm-world__panel-head">
          <div>
            <p class="vm-world__kicker">Zones</p>
            <h4>Pick where to mine</h4>
          </div>
          <p>Zones open: ${biomes.filter((biome) => biome.unlocked).length}/${biomes.length}</p>
        </div>
        <div class="vm-world__biome-grid">
          ${biomes
            .map((biome) => `
              <article class="vm-world__biome-card${biome.id === selectedBiomeId ? ' is-active' : ''}${biome.unlocked ? '' : ' is-locked'}">
                <div>
                  <h5>${escapeHtml(biome.name)}</h5>
                  <p>${escapeHtml(biome.depthLabel)}</p>
                </div>
                <p>${escapeHtml(biome.signature)}</p>
                <div class="vm-world__biome-progress" aria-hidden="true">
                  <span style="width:${biome.progressPercent}%"></span>
                </div>
                <div class="vm-world__biome-foot">
                  <span>${escapeHtml(`${biome.progressPercent}% explored`)}</span>
                  <button
                    class="vm-world__button"
                    type="button"
                    data-action="select-biome"
                    data-biome-id="${escapeAttr(biome.id)}"
                    ${biome.unlocked ? '' : 'disabled'}
                  >
                    ${biome.id === selectedBiomeId ? 'Selected' : (biome.unlocked ? 'Go Here' : 'Locked')}
                  </button>
                </div>
              </article>
            `)
            .join('')}
        </div>
      </section>

      <section class="vm-world__panel">
        <div class="vm-world__panel-head">
          <div>
            <p class="vm-world__kicker">Team Milestones</p>
            <h4>Hire more workers to unlock new features</h4>
          </div>
          <p>Workers: ${formatSimpleNumber(state.workers?.headcount)}</p>
        </div>
        <div class="vm-world__breakpoints">
          ${breakpoints
            .map((entry) => `
              <article class="vm-world__breakpoint${entry.unlocked ? ' is-unlocked' : ''}">
                <strong>${escapeHtml(entry.label)}</strong>
                <span>${escapeHtml(`${entry.workers} workers`)}</span>
                <p>${escapeHtml(entry.status)}</p>
              </article>
            `)
            .join('')}
        </div>
      </section>

      <section class="vm-world__panel">
        <div class="vm-world__panel-head">
          <div>
            <p class="vm-world__kicker">Your Team</p>
            <h4>Who does what</h4>
          </div>
          <button class="vm-world__button" type="button" data-action="hire-contractors">
            Hire Workers
          </button>
        </div>
        <p class="vm-world__copy">Drag sliders to change how your workers are assigned. Total always stays at 100%.</p>
        <div class="vm-world__crew-sliders">
          ${crewMix
            .map((entry) => `
              <div class="vm-world__crew-row">
                <div class="vm-world__crew-label">
                  <span>${escapeHtml(entry.label)}</span>
                  <strong>${escapeHtml(entry.percent)}</strong>
                </div>
                <input
                  class="vm-world__crew-slider"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value="${escapeAttr(String(entry.rawPercent))}"
                  data-action="set-crew-ratio"
                  data-crew-role="${escapeAttr(entry.role)}"
                  aria-label="${escapeAttr(entry.label + ' crew percentage')}"
                />
                <p class="vm-world__crew-detail">${escapeHtml(entry.count)}</p>
              </div>
            `)
            .join('')}
        </div>
      </section>

      <section class="vm-world__panel">
        <div class="vm-world__panel-head">
          <div>
            <p class="vm-world__kicker">Mining Depth</p>
            <h4>Choose how deep to dig</h4>
        </div>
        <strong>${escapeHtml(depthSummary.current)}</strong>
      </div>
        <label class="vm-world__slider-label" for="vm-local-depth-input">
          ${escapeHtml(renderDepthStratumLabel(state.localDepth, state.selectedBiome?.localDepthLimit))}
        </label>
        <input
          id="vm-local-depth-input"
          class="vm-world__slider"
          type="range"
          min="0"
          max="${escapeAttr(String(Number(state.selectedBiome?.localDepthLimit) || 0))}"
          value="${escapeAttr(String(Number(state.localDepth) || 0))}"
          step="500"
          data-action="set-local-depth"
        />
        <div class="vm-world__depth-ticks" aria-hidden="true">
          <span>Surface</span>
          <span>Shallow</span>
          <span>Mid</span>
          <span>Deep</span>
          <span>Extreme</span>
        </div>
        <p class="vm-world__copy">${escapeHtml(renderDepthHint(state.localDepth, state.selectedBiome?.localDepthLimit))}</p>
      </section>

      <section class="vm-world__panel">
        <div class="vm-world__panel-head">
          <div>
            <p class="vm-world__kicker">Collection</p>
            <h4>Your rare finds and prizes</h4>
          </div>
          <p>Collection points: ${formatSimpleNumber(state.museumScore)}</p>
        </div>
        ${
          discoveries.length
            ? `
              <ul class="vm-world__discovery-list">
                ${discoveries
                  .map((item) => `
                    <li>
                      <strong>${escapeHtml(item.name)}</strong>
                      <span>${escapeHtml(item.meta)}</span>
                    </li>
                  `)
                  .join('')}
              </ul>
            `
            : `
              <article class="vm-world__empty">
                <h5>Collection is empty</h5>
                <p>Your rarest finds earn collection points and show up here. Dig deeper to discover legendary and mythic ores!</p>
              </article>
            `
        }
      </section>

      <section class="vm-world__panel">
        <div class="vm-world__panel-head">
          <div>
            <p class="vm-world__kicker">Event History</p>
            <h4>What happened in your mine</h4>
          </div>
        </div>
        ${
          eventHistory.length
            ? `
              <ul class="vm-world__history-list">
                ${eventHistory
                  .map((entry) => `
                    <li>
                      <strong>${escapeHtml(entry.name)}</strong>
                      <span>${escapeHtml(entry.outcome)}</span>
                    </li>
                  `)
                  .join('')}
              </ul>
            `
            : `
              <article class="vm-world__empty">
                <h5>No events in your history</h5>
                <p>Special events appear as you mine. Events can boost drops, unlock bonuses, or create challenges - keep digging.</p>
              </article>
            `
        }
      </section>
    </section>
  `;
}

export function bindWorldPanel(root, store) {
  void root;
  void store;
}

function normalizeBiomes(input) {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.map((biome) => {
    const progress = clampNumber(Number(biome.progressRatio), 0, 1);
    return {
      id: biome.id || '',
      name: biome.name || 'Unknown zone',
      unlocked: Boolean(biome.unlocked),
      depthLabel: formatDepthLabel(biome.globalDepth),
      signature: biome.signatureEconomy || biome.miningRule || 'Unexplored zone.',
      progressPercent: Math.round(progress * 100)
    };
  });
}

function normalizeBreakpoints(raw, headcount) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const workers = Number(headcount) || 0;

  return BREAKPOINT_ORDER.map((entry) => {
    const unlocked = Boolean(source[entry.key]);
    const missing = Math.max(0, entry.workers - workers);

    return {
      ...entry,
      unlocked,
      status: unlocked ? 'Unlocked' : `${missing} more workers needed`
    };
  });
}

function normalizeCrewMix(rawCrews, headcount) {
  const crews = rawCrews && typeof rawCrews === 'object' ? rawCrews : {};
  const total = Number(headcount) || 0;

  const roles = [
    ['extraction', 'Diggers'],
    ['hauler', 'Carriers'],
    ['stabilization', 'Safety Team'],
    ['survey', 'Scouts'],
    ['recovery', 'Rescue Team']
  ];

  return roles.map(([key, label]) => {
    const ratio = clampNumber(Number(crews[key]), 0, 1);
    const rawPercent = Math.round(ratio * 100);
    return {
      role: key,
      label,
      rawPercent,
      percent: `${rawPercent}%`,
      count: `${Math.round(total * ratio).toLocaleString('en-US')} workers`
    };
  });
}

function renderDepthStratumLabel(localDepth, maxDepth) {
  const max = Number(maxDepth) || 1;
  const depth = Number(localDepth) || 0;
  const ratio = clampNumber(depth / max, 0, 1);

  if (ratio < 0.15) return 'Surface layer - mostly common ores';
  if (ratio < 0.35) return 'Shallow layer - uncommon finds start here';
  if (ratio < 0.55) return 'Mid layer - rare ores become available';
  if (ratio < 0.75) return 'Deep layer - epic and legendary deposits';
  return 'Extreme depth - mythic ores and rich veins';
}

function renderDepthHint(localDepth, maxDepth) {
  const max = Number(maxDepth) || 1;
  const depth = Number(localDepth) || 0;
  const ratio = clampNumber(depth / max, 0, 1);

  if (ratio < 0.15) return 'Dig deeper to find better ores. Deeper = rarer drops.';
  if (ratio < 0.55) return 'Going deeper costs more stability. Balance depth with mine health.';
  return 'At this depth: higher value drops, more danger. Watch your mine conditions!';
}

function normalizeDiscoveries(discoveries) {
  if (!Array.isArray(discoveries)) {
    return [];
  }

  return discoveries
    .filter((entry) => entry && typeof entry === 'object')
    .slice(0, 10)
    .map((entry) => ({
      name: entry.name || 'Unknown discovery',
      meta: `${entry.rarity || 'rare'} | x${formatSimpleNumber(entry.count)} | ${entry.source || 'mine'}`
    }));
}

function normalizeEventHistory(events) {
  if (!Array.isArray(events)) {
    return [];
  }

  return events
    .filter((entry) => entry && typeof entry === 'object')
    .slice(0, 8)
    .map((entry) => ({
      name: entry.name || 'Event',
      outcome: entry.outcome || 'No result yet.'
    }));
}

function normalizeDepthSummary(state) {
  return {
    current: formatMeters(state.currentGlobalDepth),
    deepest: formatMeters(state.deepestDepth),
    total: formatMeters(state.totalDepth)
  };
}

function formatDepthLabel(depth) {
  if (!depth || typeof depth !== 'object') {
    return 'Depth unknown';
  }

  const start = Number(depth.start);
  const end = Number(depth.end);
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return 'Depth unknown';
  }

  return `${Math.round(start).toLocaleString('en-US')}m - ${Math.round(end).toLocaleString('en-US')}m`;
}

