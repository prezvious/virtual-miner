export function renderSystemsSection(content = {}) {
  const systems = isRecord(content.systems) ? content.systems : content;
  const title = cleanText(systems.title, 'Systems tuned for repeatable momentum');
  const pillars = Array.isArray(systems.pillars) ? systems.pillars.slice(0, 4) : [];
  const rngLayers = Array.isArray(systems.rngLayers) ? systems.rngLayers.slice(0, 4) : [];
  const offlineSystems = Array.isArray(systems.offlineSystems) ? systems.offlineSystems : [];
  const zoneEntries = getZoneEntries(systems);

  return `
    <section class="vm-section vm-section--compact vm-systems" id="systems" aria-labelledby="vm-systems-title">
      <div class="vm-section__inner vm-stack">
        <div class="vm-section-header" data-reveal style="--vm-delay: 40ms;">
          <span class="vm-eyebrow">Systems // Pressure Management</span>
          <div class="vm-stack">
            <h2 class="vm-title" id="vm-systems-title">${escapeHtml(title)}</h2>
            <p class="vm-lead">Hybrid RNG, authored economies, and respectful offline carry make the concept readable as a product instead of a loose design note.</p>
          </div>
        </div>

        <div class="vm-systems__pillars">
          ${pillars
            .map(
              (pillar, index) => `
                <article class="vm-systems__pillar" data-reveal style="--vm-delay: ${80 + index * 60}ms;">
                  <p class="vm-kicker">System pillar</p>
                  <h3 class="vm-systems__card-title">${escapeHtml(cleanText(pillar.title, 'Core system'))}</h3>
                  <p class="vm-copy">${escapeHtml(
                    cleanText(
                      pillar.summary,
                      'This layer keeps the loop legible while giving later sessions more texture.'
                    )
                  )}</p>
                </article>
              `
            )
            .join('')}
        </div>

        <div class="vm-systems__layers" data-reveal style="--vm-delay: 120ms;">
          <div class="vm-stack">
            <p class="vm-kicker">RNG stack</p>
            <p class="vm-copy">Variance is staged in layers so jackpot moments stay dramatic without making the base loop feel hostile.</p>
          </div>
          <div class="vm-systems__layer-list">
            ${rngLayers
              .map(
                (layer) => `
                  <article class="vm-systems__layer">
                    <h3 class="vm-systems__card-title">${escapeHtml(cleanText(layer.name, 'Layer'))}</h3>
                    <p class="vm-copy">${escapeHtml(
                      cleanText(
                        layer.body,
                        'Each layer shapes expectation and preserves surprise.'
                      )
                    )}</p>
                  </article>
                `
              )
              .join('')}
          </div>
        </div>

        <div class="vm-systems__zones" data-reveal style="--vm-delay: 160ms;">
          <div class="vm-stack">
            <p class="vm-kicker">Rarity zoning</p>
            <p class="vm-copy">The rarity ladder is grouped into emotional bands so progression moves from familiar payoff to adrenaline territory.</p>
          </div>
          <div class="vm-systems__zone-grid">
            ${zoneEntries
              .map(
                ([zoneName, tiers]) => `
                  <article class="vm-systems__zone">
                    <h3 class="vm-systems__card-title">${escapeHtml(`${zoneName} band`)}</h3>
                    <ul class="vm-systems__tier-list">
                      ${tiers
                        .map(
                          (tier) => `
                            <li>
                              <span>${escapeHtml(cleanText(tier.name, `Tier ${tier.tier ?? '?'}`))}</span>
                              <span>${escapeHtml(cleanText(tier.dropRate, 'Unknown drop rate'))}</span>
                            </li>
                          `
                        )
                        .join('')}
                    </ul>
                  </article>
                `
              )
              .join('')}
          </div>
        </div>

        <div class="vm-systems__table-wrap" data-reveal style="--vm-delay: 220ms;">
          <div class="vm-stack">
            <p class="vm-kicker">Offline contract</p>
            <p class="vm-copy">The promise is explicit: stepping away should preserve trust, while active play still matters where it should.</p>
          </div>
          <table class="vm-systems__table">
            <thead>
              <tr>
                <th scope="col">System</th>
                <th scope="col">Online</th>
                <th scope="col">Offline</th>
                <th scope="col">Why it matters</th>
              </tr>
            </thead>
            <tbody>
              ${offlineSystems
                .map(
                  (item) => `
                    <tr>
                      <th scope="row">${escapeHtml(cleanText(item.system, 'System'))}</th>
                      <td>${escapeHtml(cleanText(item.online, '100%'))}</td>
                      <td>${escapeHtml(cleanText(item.offline, '0%'))}</td>
                      <td>${escapeHtml(
                        cleanText(
                          item.reason,
                          'This rule protects the return loop from feeling punishing.'
                        )
                      )}</td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function getZoneEntries(systems) {
  if (isRecord(systems.rarityZones)) {
    return Object.entries(systems.rarityZones).filter(([, tiers]) => Array.isArray(tiers));
  }

  if (!Array.isArray(systems.rarityTiers)) {
    return [];
  }

  const grouped = systems.rarityTiers.reduce((accumulator, tier) => {
    const zone = cleanText(tier.zone, 'Unknown');
    if (!accumulator[zone]) {
      accumulator[zone] = [];
    }
    accumulator[zone].push(tier);
    return accumulator;
  }, {});

  return Object.entries(grouped);
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
