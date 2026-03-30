import { formatMeters, formatSimpleNumber, escapeHtml } from '../../game/utils/formatters.js';

const BREAKPOINTS = [
  { key: 'foreman', workers: 10, label: 'First Boss' },
  { key: 'secondShift', workers: 25, label: 'Night Shift' },
  { key: 'specialization', workers: 50, label: 'Expert Workers' },
  { key: 'outposts', workers: 100, label: 'Zone Bases' },
  { key: 'operationsBoard', workers: 250, label: 'Headquarters' },
  { key: 'divisions', workers: 500, label: 'Mining Empire' }
];

export function renderSystemsPanel(state = {}, content = {}) {
  const howToPlay = normalizeCards(content.howToPlay);
  const coreLoop = normalizeLoop(content.coreLoop);
  const guideCards = normalizeCards(content.guideCards);
  const offlineSystems = normalizeOfflineSystems(content.offlineSystems);
  const rarityZones = normalizeRarityZones(content);
  const depthBands = normalizeDepthBands(content.depthBands);
  const summary = buildSummary(state, depthBands);
  const goals = buildGoals(state, content.goalTracks, depthBands);

  return `
    <section class="vm-systems-panel" aria-label="Game systems and help">
      <header class="vm-systems-panel__hero" data-surface="mineral">
        <div>
          <p class="vm-systems-panel__eyebrow">Systems</p>
          <h3 class="vm-systems-panel__title">Learn the rules, then push deeper.</h3>
          <p class="vm-systems-panel__copy">
            This page explains the core loop, mining rules, offline progress, rarity tiers, and current goals.
          </p>
        </div>
        <dl class="vm-systems-panel__metrics">
          <div>
            <dt>Zones open</dt>
            <dd>${escapeHtml(summary.unlockedZones)}</dd>
          </div>
          <div>
            <dt>Deepest depth</dt>
            <dd>${escapeHtml(summary.deepestDepth)}</dd>
          </div>
          <div>
            <dt>Discoveries</dt>
            <dd>${escapeHtml(summary.discoveries)}</dd>
          </div>
          <div>
            <dt>Current band</dt>
            <dd>${escapeHtml(summary.currentBand)}</dd>
          </div>
        </dl>
      </header>

      <section class="vm-systems-panel__section">
        <div class="vm-systems-panel__section-head">
          <div>
            <p class="vm-systems-panel__kicker">How to Play</p>
            <h4>Start here</h4>
          </div>
          <p>Four steps to turn a small mine into a deep one.</p>
        </div>
        <div class="vm-systems-panel__card-grid">
          ${howToPlay
            .map(
              (card, index) => `
                <article class="vm-systems-panel__card">
                  <span class="vm-systems-panel__card-index">${escapeHtml(`0${index + 1}`)}</span>
                  <h5>${escapeHtml(card.title)}</h5>
                  <p>${escapeHtml(card.body)}</p>
                </article>
              `
            )
            .join('')}
        </div>
      </section>

      <section class="vm-systems-panel__section">
        <div class="vm-systems-panel__section-head">
          <div>
            <p class="vm-systems-panel__kicker">Core Loop</p>
            <h4>What a strong run looks like</h4>
          </div>
          <p>Every return session should feed the next upgrade and the next depth push.</p>
        </div>
        <ol class="vm-systems-panel__loop">
          ${coreLoop
            .map(
              (step) => `
                <li class="vm-systems-panel__loop-item">
                  <span class="vm-systems-panel__loop-step">${escapeHtml(step.step)}</span>
                  <div>
                    <h5>${escapeHtml(step.title)}</h5>
                    <p>${escapeHtml(step.body)}</p>
                  </div>
                </li>
              `
            )
            .join('')}
        </ol>
      </section>

      <section class="vm-systems-panel__section">
        <div class="vm-systems-panel__section-head">
          <div>
            <p class="vm-systems-panel__kicker">Game Systems</p>
            <h4>What makes the mine work</h4>
          </div>
          <p>These systems control how safe, fast, and rewarding your mine becomes.</p>
        </div>
        <div class="vm-systems-panel__card-grid vm-systems-panel__card-grid--wide">
          ${guideCards
            .map(
              (card) => `
                <article class="vm-systems-panel__card vm-systems-panel__card--wide">
                  <h5>${escapeHtml(card.title)}</h5>
                  <p>${escapeHtml(card.body)}</p>
                </article>
              `
            )
            .join('')}
        </div>
      </section>

      <section class="vm-systems-panel__section vm-systems-panel__grid-two">
        <article class="vm-systems-panel__panel">
          <div class="vm-systems-panel__section-head">
            <div>
              <p class="vm-systems-panel__kicker">Offline Progress</p>
              <h4>What keeps running while you are away</h4>
            </div>
          </div>
          <div class="vm-systems-panel__table-wrap">
            <table class="vm-systems-panel__table">
              <thead>
                <tr>
                  <th scope="col">System</th>
                  <th scope="col">Online</th>
                  <th scope="col">Offline</th>
                </tr>
              </thead>
              <tbody>
                ${offlineSystems
                  .map(
                    (item) => `
                      <tr>
                        <th scope="row">${escapeHtml(item.system)}</th>
                        <td>${escapeHtml(item.online)}</td>
                        <td>${escapeHtml(item.offline)}</td>
                      </tr>
                    `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
          <ul class="vm-systems-panel__bullets">
            ${offlineSystems
              .map((item) => `<li>${escapeHtml(item.reason)}</li>`)
              .join('')}
          </ul>
        </article>

        <article class="vm-systems-panel__panel">
          <div class="vm-systems-panel__section-head">
            <div>
              <p class="vm-systems-panel__kicker">Rarity Bands</p>
              <h4>Where the best drops live</h4>
            </div>
          </div>
          <div class="vm-systems-panel__rarity-zones">
            ${rarityZones
              .map(
                (zone) => `
                  <section class="vm-systems-panel__rarity-zone">
                    <h5>${escapeHtml(zone.name)}</h5>
                    <ul>
                      ${zone.tiers
                        .map(
                          (tier) => `
                            <li>
                              <span>${escapeHtml(tier.name)}</span>
                              <strong>${escapeHtml(tier.dropRate)}</strong>
                            </li>
                          `
                        )
                        .join('')}
                    </ul>
                  </section>
                `
              )
              .join('')}
          </div>
        </article>
      </section>

      <section class="vm-systems-panel__section vm-systems-panel__grid-two">
        <article class="vm-systems-panel__panel">
          <div class="vm-systems-panel__section-head">
            <div>
              <p class="vm-systems-panel__kicker">Zone Bands</p>
              <h4>How the world scales</h4>
            </div>
          </div>
          <div class="vm-systems-panel__bands">
            ${depthBands
              .map(
                (band) => `
                  <article class="vm-systems-panel__band">
                    <div class="vm-systems-panel__band-head">
                      <strong>${escapeHtml(band.label)}</strong>
                      <span>${escapeHtml(band.depthLabel)}</span>
                    </div>
                    <p>${escapeHtml(band.summary)}</p>
                    <p class="vm-systems-panel__band-biomes">${escapeHtml(band.biomes)}</p>
                  </article>
                `
              )
              .join('')}
          </div>
        </article>

        <article class="vm-systems-panel__panel">
          <div class="vm-systems-panel__section-head">
            <div>
              <p class="vm-systems-panel__kicker">Current Goals</p>
              <h4>Good targets for the next session</h4>
            </div>
          </div>
          <div class="vm-systems-panel__goals">
            ${goals
              .map(
                (goal) => `
                  <article class="vm-systems-panel__goal">
                    <div class="vm-systems-panel__goal-head">
                      <h5>${escapeHtml(goal.title)}</h5>
                      <span>${escapeHtml(goal.progress)}</span>
                    </div>
                    <p>${escapeHtml(goal.body)}</p>
                  </article>
                `
              )
              .join('')}
          </div>
        </article>
      </section>
    </section>
  `;
}

export function bindSystemsPanel(root, store) {
  void root;
  void store;
}

function normalizeCards(cards) {
  return Array.isArray(cards)
    ? cards
        .filter((card) => card && typeof card === 'object')
        .slice(0, 4)
        .map((card) => ({
          title: cleanText(card.title, 'System'),
          body: cleanText(card.body, 'More details appear as you keep playing.')
        }))
    : [];
}

function normalizeLoop(steps) {
  return Array.isArray(steps)
    ? steps
        .filter((step) => step && typeof step === 'object')
        .slice(0, 4)
        .map((step, index) => ({
          step: cleanText(step.step, `0${index + 1}`),
          title: cleanText(step.title, 'Loop step'),
          body: cleanText(step.body, 'This step keeps the next run moving.')
        }))
    : [];
}

function normalizeOfflineSystems(items) {
  return Array.isArray(items)
    ? items
        .filter((item) => item && typeof item === 'object')
        .slice(0, 4)
        .map((item) => ({
          system: cleanText(item.system, 'System'),
          online: cleanText(item.online, '100%'),
          offline: cleanText(item.offline, '0%'),
          reason: cleanText(item.reason, 'This system behaves differently while you are away.')
        }))
    : [];
}

function normalizeRarityZones(content) {
  const source = content?.rarityZones && typeof content.rarityZones === 'object'
    ? Object.entries(content.rarityZones)
    : [];

  return source
    .filter(([, tiers]) => Array.isArray(tiers))
    .map(([name, tiers]) => ({
      name: cleanText(name, 'Rarity'),
      tiers: tiers.slice(0, 5).map((tier) => ({
        name: cleanText(tier.name, 'Unknown'),
        dropRate: cleanText(tier.dropRate, '--')
      }))
    }));
}

function normalizeDepthBands(items) {
  return Array.isArray(items)
    ? items
        .filter((item) => item && typeof item === 'object')
        .slice(0, 4)
        .map((item) => ({
          label: cleanText(item.label, 'Band'),
          depthLabel: cleanText(item.depthLabel, 'Depth unknown'),
          summary: cleanText(item.summary, 'Each band changes the mining economy.'),
          biomes: Array.isArray(item.biomes) ? item.biomes.join(' / ') : cleanText(item.biomes, 'Biome list unavailable')
        }))
    : [];
}

function buildSummary(state, depthBands) {
  const biomes = Array.isArray(state.biomes) ? state.biomes : [];
  const discoveries = Array.isArray(state.discoveries) ? state.discoveries : [];
  const unlockedZones = biomes.filter((biome) => biome.unlocked).length;
  const currentBand = getCurrentBand(depthBands, Number(state.deepestDepth) || 0);

  return {
    unlockedZones: `${unlockedZones}/${biomes.length || 0}`,
    deepestDepth: formatMeters(state.deepestDepth),
    discoveries: formatSimpleNumber(discoveries.length),
    currentBand
  };
}

function buildGoals(state, tracks, depthBands) {
  const trackMap = Array.isArray(tracks)
    ? new Map(
        tracks
          .filter((track) => track && typeof track === 'object')
          .map((track) => [track.title, cleanText(track.body, 'Keep building the mine.')])
      )
    : new Map();

  const workers = Number(state.workers?.headcount) || 0;
  const discoveries = Array.isArray(state.discoveries) ? state.discoveries.length : 0;
  const museumScore = Number(state.museumScore) || 0;
  const biomes = Array.isArray(state.biomes) ? state.biomes : [];
  const nextWorkerGoal = BREAKPOINTS.find((entry) => workers < entry.workers);
  const nextBiome = biomes.find((biome) => !biome.unlocked);
  const nextBand = getNextBand(depthBands, Number(state.deepestDepth) || 0);
  const nextDiscoveryTarget = discoveries < 5 ? 5 : discoveries < 15 ? 15 : discoveries < 30 ? 30 : discoveries + 10;
  const nextScoreTarget = museumScore < 250 ? 250 : museumScore < 1000 ? 1000 : museumScore + 500;

  return [
    {
      title: 'Grow your crew',
      body: nextWorkerGoal
        ? `${trackMap.get('Unlock more tools') ?? 'Hire more workers to unlock stronger systems.'} Next unlock: ${nextWorkerGoal.label}.`
        : 'All worker unlock tiers are open. Keep scaling the mine for stronger late-game output.',
      progress: nextWorkerGoal ? `${formatSimpleNumber(workers)}/${formatSimpleNumber(nextWorkerGoal.workers)} workers` : 'Max tier open'
    },
    {
      title: 'Reach the next zone',
      body: nextBiome
        ? `Push deeper until ${nextBiome.name} opens. ${nextBand ? `Next band: ${nextBand.label}.` : ''}`
        : 'Every current zone is open. Keep pushing for more depth and stronger haul value.',
      progress: nextBiome ? `${formatMeters(state.deepestDepth)} now` : 'All zones unlocked'
    },
    {
      title: 'Expand your collection',
      body: trackMap.get('Chase high rarity finds') ?? 'Rare discoveries raise your long-term collection progress.',
      progress: `${formatSimpleNumber(discoveries)}/${formatSimpleNumber(nextDiscoveryTarget)} finds`
    },
    {
      title: 'Raise museum score',
      body: trackMap.get('Stabilize the mine') ?? 'A stronger mine supports better discoveries and more score.',
      progress: `${formatSimpleNumber(museumScore)}/${formatSimpleNumber(nextScoreTarget)} score`
    }
  ];
}

function getCurrentBand(depthBands, deepestDepth) {
  const value = Number(deepestDepth) || 0;

  for (const band of depthBands) {
    const [start, end] = parseDepthRange(band.depthLabel);
    if (value >= start && value <= end) {
      return band.label;
    }
  }

  return depthBands[0]?.label ?? 'Unknown';
}

function getNextBand(depthBands, deepestDepth) {
  const value = Number(deepestDepth) || 0;

  return depthBands.find((band) => {
    const [start] = parseDepthRange(band.depthLabel);
    return value < start;
  }) ?? null;
}

function parseDepthRange(value) {
  const matches = String(value ?? '').match(/([\d,]+)m\s*-\s*([\d,]+)m/);
  if (!matches) {
    return [0, Number.MAX_SAFE_INTEGER];
  }

  return matches.slice(1).map((part) => Number(part.replaceAll(',', '')) || 0);
}

function cleanText(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

