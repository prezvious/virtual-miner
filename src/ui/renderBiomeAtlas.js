const DEFAULT_COLOR = '#6c7068';

export function getSelectedBiome(biomes = [], selectedBiomeId) {
  if (!Array.isArray(biomes) || biomes.length === 0) return null;
  if (selectedBiomeId == null || selectedBiomeId === '') return biomes[0];
  return biomes.find((biome) => biome?.id === selectedBiomeId) ?? biomes[0];
}

export function getActiveStratum(biome, localDepth) {
  const strata = Array.isArray(biome?.strata) ? biome.strata : [];
  if (strata.length === 0) return null;

  const depth = clampNumber(localDepth, 0, Number.isFinite(biome?.localDepthLimit) ? biome.localDepthLimit : Infinity);
  const ranges = strata.map((stratum, index) => deriveDepthRange(stratum, biome?.localDepthLimit, index, strata.length));

  const matchIndex = ranges.findIndex(({ start, end }) => depth >= start && depth <= end);
  if (matchIndex >= 0) return strata[matchIndex];

  if (depth < ranges[0].start) return strata[0];
  return strata[strata.length - 1];
}

export function renderBiomeAtlas({ biomes = [], selectedBiomeId, localDepth = 0 } = {}) {
  const safeBiomes = Array.isArray(biomes) ? biomes : [];
  const selectedBiome = getSelectedBiome(safeBiomes, selectedBiomeId);
  const selectedDepth = clampNumber(localDepth, 0, selectedBiome?.localDepthLimit ?? Infinity);
  const activeStratum = getActiveStratum(selectedBiome, selectedDepth);
  const worldDepthTotal = getWorldDepthTotal(safeBiomes);
  const selectedIndex = selectedBiome ? safeBiomes.findIndex((biome) => biome?.id === selectedBiome.id) : -1;

  if (!selectedBiome) {
    return `
      <div class="atlas-app" data-empty="true">
        <header class="atlas-hero" id="atlas-hero">
          <div class="hero-copy">
            <p class="eyebrow">Geological expedition dossier</p>
            <h1>Biome Atlas</h1>
            <p class="lead">No biome data was provided, so the atlas cannot render its excavation layers.</p>
          </div>
        </header>
      </div>
    `;
  }

  const shellStyle = buildShellStyle(selectedBiome);

  return `
    <div class="atlas-app" ${shellStyle} data-selected-biome="${escapeAttr(selectedBiome.id)}">
      <header class="atlas-hero" id="atlas-hero">
        <div class="hero-copy">
          <p class="eyebrow">Geological expedition dossier</p>
          <h1>Virtual Miner Biome Atlas</h1>
          <p class="lead">
            A luxury-grade field guide to the underground chain of biomes, each built with its own ore economy,
            hazard logic, and visual identity.
          </p>
          <p class="summary">
            Use the rail to jump between provinces, inspect the active stratum by local depth, and review ore pricing
            before drilling deeper.
          </p>
        </div>
        <aside class="hero-stats" aria-label="World summary">
          <article class="stat-chip">
            <span>Total mapped depth</span>
            <strong class="stat-value stat-value--meter">${renderMeterValue(worldDepthTotal)}</strong>
          </article>
          <article class="stat-chip">
            <span>Biomes cataloged</span>
            <strong>${safeBiomes.length.toLocaleString()}</strong>
          </article>
          <article class="stat-chip">
            <span>Selected biome span</span>
            <strong class="stat-value stat-value--range">${renderDepthRangeValue(selectedBiome.globalDepth)}</strong>
          </article>
          <article class="stat-chip">
            <span>Active layer</span>
            <strong>${escapeHtml(activeStratum?.name ?? 'Unknown')}</strong>
          </article>
        </aside>
      </header>

      <nav class="biome-rail" aria-label="Biome overview rail">
        ${safeBiomes
          .map((biome, index) => renderBiomePill(biome, index === selectedIndex, selectedDepth))
          .join('')}
      </nav>

      <main class="atlas-main">
        <section class="biome-showcase" id="${escapeAttr(selectedBiome.id)}">
          <div class="showcase-header">
            <div>
              <p class="eyebrow">Selected biome</p>
              <h2>${escapeHtml(selectedBiome.name)}</h2>
              <p class="tagline">${escapeHtml(selectedBiome.tagline ?? '')}</p>
            </div>
            <div class="depth-badge" aria-label="Biome depth">
              <span>Global depth</span>
              <strong>${formatDepthSpan(selectedBiome.globalDepth)}</strong>
            </div>
          </div>

          <div class="showcase-grid">
            <article class="identity-panel">
              <p class="eyebrow">Visual identity</p>
              <div class="identity-swatch" aria-hidden="true"></div>
              <dl class="identity-list">
                <div>
                  <dt>Palette</dt>
                  <dd>${renderPalette(selectedBiome.visualIdentity?.palette)}</dd>
                </div>
                <div>
                  <dt>Lighting</dt>
                  <dd>${escapeHtml(selectedBiome.visualIdentity?.lighting ?? 'Not specified')}</dd>
                </div>
                <div>
                  <dt>Terrain</dt>
                  <dd>${escapeHtml(selectedBiome.visualIdentity?.terrain ?? 'Not specified')}</dd>
                </div>
                <div>
                  <dt>Architecture</dt>
                  <dd>${escapeHtml(selectedBiome.visualIdentity?.architecture ?? 'Not specified')}</dd>
                </div>
                <div>
                  <dt>Atmosphere</dt>
                  <dd>${escapeHtml(selectedBiome.visualIdentity?.atmosphere ?? 'Not specified')}</dd>
                </div>
                <div>
                  <dt>UI motif</dt>
                  <dd>${escapeHtml(selectedBiome.visualIdentity?.uiMotif ?? 'Not specified')}</dd>
                </div>
              </dl>
            </article>

            <article class="economy-panel">
              <p class="eyebrow">Biome economy</p>
              <h3>${escapeHtml(selectedBiome.economySystem?.name ?? 'Untitled system')}</h3>
              <p>${escapeHtml(selectedBiome.economySystem?.summary ?? '')}</p>
              <div class="economy-callout">
                <span>Player rule</span>
                <strong>${escapeHtml(selectedBiome.economySystem?.playerRule ?? 'No rule provided')}</strong>
              </div>
              <p class="economy-overview">${escapeHtml(selectedBiome.overview ?? '')}</p>
            </article>
          </div>
        </section>

        <section class="hazard-field" aria-labelledby="hazards-title">
          <div class="section-heading">
            <p class="eyebrow">Hazards</p>
            <h2 id="hazards-title">Biome-specific risk profile</h2>
            <p>
              Each biome carries three distinct hazards. They should change how the player mines, not just how much
              damage they take.
            </p>
          </div>
          <div class="hazard-grid">
            ${renderHazards(selectedBiome.hazards)}
          </div>
        </section>

        <section class="strata-section" aria-labelledby="strata-title">
          <div class="section-heading">
            <p class="eyebrow">Strata explorer</p>
            <h2 id="strata-title">Layer by layer descent</h2>
            <p>
              The active layer is determined from local depth within the selected biome. Deeper strata should feel like
              a different extraction problem, not just a number increase.
            </p>
          </div>
          <div class="strata-controls">
            <label class="depth-control" for="local-depth">
              <span>Local depth scrubber</span>
              <input
                id="local-depth"
                name="local-depth"
                type="range"
                min="0"
                max="${Math.round(selectedBiome.localDepthLimit ?? 128000)}"
                step="500"
                value="${Math.round(selectedDepth)}"
              />
            </label>
          </div>
          <div class="strata-meta">
            <span class="pill">Local depth: ${formatMeters(selectedDepth)}</span>
            <span class="pill">Layer active: ${escapeHtml(activeStratum?.name ?? 'Unknown')}</span>
          </div>
          <div class="strata-stack">
            ${renderStrataStack(selectedBiome, activeStratum, selectedDepth)}
          </div>
        </section>

        <section class="ore-section" aria-labelledby="ore-title">
          <div class="section-heading">
            <p class="eyebrow">Ore pricing</p>
            <h2 id="ore-title">Price ranges by stratum</h2>
            <p>
              Ore prices are grouped under each stratum so the player can see how value shifts as geology gets more
              hostile and more rewarding.
            </p>
          </div>
          <div class="table-shell">
            ${renderOrePricingTable(selectedBiome)}
          </div>
        </section>

        <section class="world-section" aria-labelledby="world-title">
          <div class="section-heading">
            <p class="eyebrow">World overview</p>
            <h2 id="world-title">Biome atlas summary</h2>
            <p>Every biome in the world gets a compact summary card with its own visual and economic signature.</p>
          </div>
          <div class="overview-grid">
            ${safeBiomes.map((biome) => renderOverviewCard(biome, biome?.id === selectedBiome.id)).join('')}
          </div>
        </section>
      </main>
    </div>
  `;
}

function renderBiomePill(biome, isActive, selectedDepth) {
  const activeStratum = getActiveStratum(biome, selectedDepth);
  const classes = ['biome-pill', isActive ? 'is-active' : null].filter(Boolean).join(' ');
  return `
    <a class="${classes}" href="#${escapeAttr(biome.id)}" data-biome-id="${escapeAttr(biome.id)}">
      <span class="biome-pill-order">${String(biome.order ?? '').padStart(2, '0')}</span>
      <strong>${escapeHtml(biome.name ?? 'Unknown biome')}</strong>
      <span class="biome-pill-tagline">${escapeHtml(biome.tagline ?? '')}</span>
      <em>${escapeHtml(activeStratum?.name ?? 'No strata')}</em>
    </a>
  `;
}

function renderHazards(hazards) {
  const items = Array.isArray(hazards) ? hazards.slice(0, 3) : [];
  return items
    .map(
      (hazard, index) => `
        <article class="hazard-card hazard-card-${index + 1}">
          <p class="eyebrow">Hazard ${index + 1}</p>
          <h3>${escapeHtml(hazard?.name ?? 'Unnamed hazard')}</h3>
          <p>${escapeHtml(hazard?.effect ?? '')}</p>
          <strong>${escapeHtml(hazard?.consequence ?? '')}</strong>
        </article>
      `
    )
    .join('');
}

function renderStrataStack(biome, activeStratum, localDepth) {
  const strata = Array.isArray(biome?.strata) ? biome.strata : [];
  return strata
    .map((stratum, index) => {
      const isActive = stratum === activeStratum;
      const range = deriveDepthRange(stratum, biome?.localDepthLimit, index, strata.length);
      const classes = ['strata-card', isActive ? 'is-active' : null].filter(Boolean).join(' ');
      const ores = Array.isArray(stratum?.ores) ? stratum.ores : [];

      return `
        <article class="${classes}" data-stratum-index="${index}" data-depth-start="${range.start}" data-depth-end="${range.end}">
          <div class="strata-card-head">
            <div>
              <p class="eyebrow">Stratum ${index + 1}</p>
              <h3>${escapeHtml(stratum?.name ?? 'Unnamed stratum')}</h3>
            </div>
            <span class="depth-badge small">
              ${formatMeters(range.start)} - ${formatMeters(range.end)}
            </span>
          </div>
          <p class="matrix-line">${escapeHtml(stratum?.matrix ?? 'No matrix description')}</p>
          <p class="mining-note">${escapeHtml(stratum?.miningNote ?? '')}</p>
          <div class="ore-minicards">
            ${ores
              .map(
                (ore) => `
                  <article class="ore-mini">
                    <strong>${escapeHtml(ore?.name ?? 'Ore')}</strong>
                    <span>${escapeHtml(ore?.rarity ?? 'Unclassified')}</span>
                    <em>${formatPriceRange(ore?.priceRange)}</em>
                  </article>
                `
              )
              .join('')}
          </div>
          ${isActive ? `<p class="active-layer-note">Active at ${formatMeters(localDepth)}</p>` : ''}
        </article>
      `;
    })
    .join('');
}

function renderOrePricingTable(biome) {
  const strata = Array.isArray(biome?.strata) ? biome.strata : [];

  return `
    <table class="ore-table">
      <thead>
        <tr>
          <th>Stratum</th>
          <th>Ore</th>
          <th>Rarity</th>
          <th>Price range</th>
        </tr>
      </thead>
      <tbody>
        ${strata
          .map((stratum, stratumIndex) => {
            const ores = Array.isArray(stratum?.ores) ? stratum.ores : [];
            const rowCount = Math.max(ores.length, 1);

            if (ores.length === 0) {
              return `
                <tr class="ore-group-row">
                  <th scope="rowgroup" colspan="4">${escapeHtml(stratum?.name ?? `Stratum ${stratumIndex + 1}`)}</th>
                </tr>
                <tr>
                  <td>${escapeHtml(stratum?.name ?? `Stratum ${stratumIndex + 1}`)}</td>
                  <td colspan="3">No ores provided</td>
                </tr>
              `;
            }

            return `
              <tr class="ore-group-row">
                <th scope="rowgroup" colspan="4">${escapeHtml(stratum?.name ?? `Stratum ${stratumIndex + 1}`)}</th>
              </tr>
              ${ores
                .map(
                  (ore, oreIndex) => `
                    <tr>
                      ${oreIndex === 0 ? `<td rowspan="${rowCount}">${escapeHtml(stratum?.name ?? '')}</td>` : ''}
                      <td>${escapeHtml(ore?.name ?? 'Ore')}</td>
                      <td>${escapeHtml(ore?.rarity ?? 'Unclassified')}</td>
                      <td>${formatPriceRange(ore?.priceRange)}</td>
                    </tr>
                  `
                )
                .join('')}
            `;
          })
          .join('')}
      </tbody>
    </table>
  `;
}

function renderOverviewCard(biome, isSelected) {
  const classes = ['overview-card', isSelected ? 'is-selected' : null].filter(Boolean).join(' ');
  return `
    <article class="${classes}" id="overview-${escapeAttr(biome.id)}" data-biome-id="${escapeAttr(biome.id)}">
      <p class="eyebrow">Biome ${String(biome.order ?? '').padStart(2, '0')}</p>
      <h3>${escapeHtml(biome.name ?? 'Unnamed biome')}</h3>
      <p class="overview-tagline">${escapeHtml(biome.tagline ?? '')}</p>
      <p>${escapeHtml(biome.overview ?? '')}</p>
      <div class="overview-meta">
        <span>${formatDepthSpan(biome.globalDepth)}</span>
        <span>${escapeHtml(biome.economySystem?.name ?? 'No economy system')}</span>
      </div>
      <button class="overview-trigger" type="button" data-biome-id="${escapeAttr(biome.id)}">Inspect biome</button>
    </article>
  `;
}

function buildShellStyle(biome) {
  const palette = biome?.visualIdentity?.palette ?? {};
  const base = palette.base || DEFAULT_COLOR;
  const accent = palette.accent || DEFAULT_COLOR;
  const glow = palette.glow || DEFAULT_COLOR;
  return `style="--biome-base:${escapeAttr(base)}; --biome-accent:${escapeAttr(accent)}; --biome-glow:${escapeAttr(glow)};"`;
}

function renderPalette(palette = {}) {
  const base = palette.base || DEFAULT_COLOR;
  const accent = palette.accent || DEFAULT_COLOR;
  const glow = palette.glow || DEFAULT_COLOR;
  return `
    <span class="palette-sample"><i style="background:${escapeAttr(base)}"></i>${escapeHtml(base)}</span>
    <span class="palette-sample"><i style="background:${escapeAttr(accent)}"></i>${escapeHtml(accent)}</span>
    <span class="palette-sample"><i style="background:${escapeAttr(glow)}"></i>${escapeHtml(glow)}</span>
  `;
}

function getWorldDepthTotal(biomes) {
  const depths = (Array.isArray(biomes) ? biomes : [])
    .map((biome) => biome?.globalDepth)
    .map((depth) => toDepthRange(depth))
    .filter(Boolean);

  if (depths.length === 0) return 0;
  return Math.max(...depths.map((depth) => depth.end));
}

function deriveDepthRange(stratum, biomeLimit, index, total) {
  const parsed = toDepthRange(stratum?.depth);
  if (parsed) return parsed;

  const limit = Number.isFinite(biomeLimit) && biomeLimit > 0 ? biomeLimit : total * 32000;
  const span = limit / Math.max(total, 1);
  const start = Math.round(index * span);
  const end = Math.round((index + 1) * span);
  return { start, end };
}

function toDepthRange(value) {
  if (value == null) return null;
  if (typeof value === 'object' && !Array.isArray(value)) {
    const start = Number(value.start);
    const end = Number(value.end);
    if (Number.isFinite(start) && Number.isFinite(end)) return { start, end };
  }

  if (Array.isArray(value) && value.length >= 2) {
    const start = Number(value[0]);
    const end = Number(value[1]);
    if (Number.isFinite(start) && Number.isFinite(end)) return { start, end };
  }

  if (typeof value === 'string') {
    const matches = value.match(/\d+(?:\.\d+)?/g);
    if (matches && matches.length >= 2) {
      const start = Number(matches[0]);
      const end = Number(matches[1]);
      if (Number.isFinite(start) && Number.isFinite(end)) return { start, end };
    }
  }

  return null;
}

function formatDepthSpan(value) {
  const range = toDepthRange(value);
  if (!range) return 'Uncharted';
  return `${formatMeters(range.start)} - ${formatMeters(range.end)}`;
}

function formatMeters(value) {
  const amount = Math.round(Number(value) || 0);
  return `${amount.toLocaleString()}m`;
}

function renderMeterValue(value) {
  const amount = formatMeterNumber(value);
  return `
    <span class="stat-value-line">
      <span class="stat-value-number">${amount}</span>
      <span class="stat-value-unit">m</span>
    </span>
  `;
}

function renderDepthRangeValue(value) {
  const range = toDepthRange(value);
  if (!range) return escapeHtml('Uncharted');

  return `
    <span class="stat-value-line">
      <span class="stat-value-number">${formatMeterNumber(range.start)}</span>
      <span class="stat-value-unit">m</span>
    </span>
    <span class="stat-value-separator" aria-hidden="true">-</span>
    <span class="stat-value-line">
      <span class="stat-value-number">${formatMeterNumber(range.end)}</span>
      <span class="stat-value-unit">m</span>
    </span>
  `;
}

function formatMeterNumber(value) {
  return Math.round(Number(value) || 0).toLocaleString();
}

function formatPriceRange(priceRange) {
  if (priceRange == null) return 'Unpriced';
  if (typeof priceRange === 'string') return escapeHtml(priceRange);
  if (typeof priceRange === 'number') return `${Math.round(priceRange).toLocaleString()} cr`;

  if (Array.isArray(priceRange) && priceRange.length >= 2) {
    const min = Number(priceRange[0]);
    const max = Number(priceRange[1]);
    const unit = priceRange[2] ? ` ${escapeHtml(String(priceRange[2]))}` : ' cr';
    if (Number.isFinite(min) && Number.isFinite(max)) {
      return `${Math.round(min).toLocaleString()} - ${Math.round(max).toLocaleString()}${unit}`;
    }
  }

  if (typeof priceRange === 'object') {
    const min = Number(priceRange.min);
    const max = Number(priceRange.max);
    const unit = priceRange.unit ? ` ${escapeHtml(String(priceRange.unit))}` : ' cr';
    if (Number.isFinite(min) && Number.isFinite(max)) {
      return `${Math.round(min).toLocaleString()} - ${Math.round(max).toLocaleString()}${unit}`;
    }
    if (Number.isFinite(min)) return `${Math.round(min).toLocaleString()}${unit}`;
    if (Number.isFinite(max)) return `${Math.round(max).toLocaleString()}${unit}`;
  }

  return escapeHtml(String(priceRange));
}

function clampNumber(value, min, max) {
  const num = Number(value);
  if (!Number.isFinite(num)) return min;
  return Math.min(Math.max(num, min), max);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#96;');
}
