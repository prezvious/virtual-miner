export function renderWorldSection(content = {}) {
  const world = isRecord(content.world) ? content.world : content;
  const title = cleanText(world.title, 'A vertical world with authored economies');
  const summary = cleanText(
    world.summary,
    'Every band in the descent changes the feel of mining, upgrading, and cashing out.'
  );
  const depthBands = Array.isArray(world.depthBands) ? world.depthBands.slice(0, 4) : [];
  const featuredBiomes = Array.isArray(world.featuredBiomes)
    ? world.featuredBiomes.slice(0, 3)
    : Array.isArray(world.biomeShowcase)
      ? world.biomeShowcase.slice(0, 3)
      : Array.isArray(world.biomes)
        ? world.biomes.slice(0, 3)
        : [];

  return `
    <section class="vm-section vm-world" id="world" aria-labelledby="vm-world-title">
      <div class="vm-section__inner vm-stack">
        <div class="vm-section-header" data-reveal style="--vm-delay: 40ms;">
          <span class="vm-eyebrow">World // Descent Atlas</span>
          <div class="vm-stack">
            <h2 class="vm-title" id="vm-world-title">${escapeHtml(title)}</h2>
            <p class="vm-lead">${escapeHtml(summary)}</p>
          </div>
        </div>

        <div class="vm-world__descent">
          ${depthBands
            .map(
              (band, index) => `
                <article class="vm-world__band" data-reveal style="--vm-delay: ${80 + index * 60}ms;">
                  <div class="vm-world__band-meta">
                    <span>${escapeHtml(cleanText(band.label, 'Band'))}</span>
                    <span>${escapeHtml(cleanText(band.depthLabel, 'Depth band'))}</span>
                  </div>
                  <h3 class="vm-world__card-title">${escapeHtml(cleanText(band.summary, 'Each depth band should change the economy and the emotional tone of the run.'))}</h3>
                  <p class="vm-world__band-biomes">${escapeHtml(getBiomeNames(band.biomes))}</p>
                </article>
              `
            )
            .join('')}
        </div>

        <div class="vm-world__featured">
          ${featuredBiomes
            .map(
              (biome, index) => `
                <article class="vm-world__biome" data-reveal style="${buildBiomeStyle(biome.palette)}--vm-delay: ${120 + index * 70}ms;">
                  <p class="vm-world__biome-depth">${escapeHtml(cleanText(biome.depthLabel, 'Depth unknown'))}</p>
                  <h3 class="vm-world__biome-title">${escapeHtml(cleanText(biome.name, 'Biome'))}</h3>
                  <p class="vm-copy">${escapeHtml(
                    cleanText(
                      biome.signatureEconomy,
                      'Every biome should change the economy enough to feel like a new chapter.'
                    )
                  )}</p>
                  <p class="vm-world__biome-rule">${escapeHtml(
                    cleanText(
                      biome.miningRule,
                      'Read the terrain, then route upgrades around it.'
                    )
                  )}</p>
                </article>
              `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function getBiomeNames(biomes) {
  if (!Array.isArray(biomes) || biomes.length === 0) {
    return 'Biome roster loading';
  }

  return biomes.map((biome) => cleanText(biome.name ?? biome)).filter(Boolean).join(' / ');
}

function buildBiomeStyle(palette) {
  if (!isRecord(palette)) {
    return '';
  }

  const accent = cleanText(palette.accent || palette.primary, '#f5c96b');
  const background = cleanText(palette.background, '#10141b');
  const text = cleanText(palette.text, '#f5efe3');

  return `--vm-biome-accent:${escapeAttr(accent)};--vm-biome-bg:${escapeAttr(background)};--vm-biome-text:${escapeAttr(text)};`;
}

function cleanText(value, fallback = '') {
  const text = typeof value === 'string' && value.trim() ? value.trim() : fallback;

  return text
    .replaceAll('Ã¢â‚¬â„¢', "'")
    .replaceAll('Ã¢â‚¬â€œ', '-')
    .replaceAll('Ã¢â‚¬Å“', '"')
    .replaceAll('Ã¢â‚¬Â', '"');
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
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
