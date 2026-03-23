const DEFAULT_HERO = {
  brandName: 'Virtual Miner',
  brandLabel: 'Product concept site',
  title: 'Build a mining world that keeps moving when the player is away.',
  lead:
    'Virtual Miner positions idle mining as a respectful descent: automate extraction, push into authored biomes, and come back to momentum instead of cleanup chores.',
  primaryCta: {
    label: 'Enter the command deck',
    href: '#playable'
  },
  secondaryCta: {
    label: 'Inspect the core loop',
    href: '#loop'
  }
};

export function renderHeroSection(content = {}) {
  const hero = normalizeHeroContent(content);

  return `
    <section class="vm-hero" id="hero" aria-labelledby="vm-hero-title">
      <div class="vm-hero__backdrop" aria-hidden="true">
        <div class="vm-hero__strata">
          <span class="vm-hero__band vm-hero__band--surface"></span>
          <span class="vm-hero__band vm-hero__band--glow"></span>
          <span class="vm-hero__band vm-hero__band--deep"></span>
          <span class="vm-hero__band vm-hero__band--core"></span>
        </div>
        <div class="vm-hero__shaft">
          <span class="vm-hero__lift"></span>
          <span class="vm-hero__signal"></span>
          <span class="vm-hero__ore"></span>
        </div>
      </div>
      <div class="vm-hero__inner">
        <div class="vm-hero__copy" data-reveal="hero">
          <p class="vm-hero__eyebrow">${escapeHtml(hero.brandLabel)}</p>
          <p class="vm-hero__brand">${escapeHtml(hero.brandName)}</p>
          <h1 class="vm-hero__title" id="vm-hero-title">${escapeHtml(hero.title)}</h1>
          <p class="vm-hero__lead">${escapeHtml(hero.lead)}</p>
          <div class="vm-hero__actions">
            <a class="vm-hero__action vm-hero__action--primary" href="${escapeAttribute(hero.primaryCta.href)}">
              ${escapeHtml(hero.primaryCta.label)}
            </a>
            <a class="vm-hero__action vm-hero__action--secondary" href="${escapeAttribute(hero.secondaryCta.href)}">
              ${escapeHtml(hero.secondaryCta.label)}
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function normalizeHeroContent(content) {
  const source = content?.hero && typeof content.hero === 'object' ? content.hero : content;
  const primaryCta = normalizeLink(source?.primaryCta, DEFAULT_HERO.primaryCta);
  const secondaryCta = normalizeLink(source?.secondaryCta, DEFAULT_HERO.secondaryCta);

  return {
    brandName: normalizeText(source?.brandName, DEFAULT_HERO.brandName),
    brandLabel: normalizeText(source?.brandLabel, DEFAULT_HERO.brandLabel),
    title: normalizeText(source?.title, DEFAULT_HERO.title),
    lead: normalizeText(source?.lead, DEFAULT_HERO.lead),
    primaryCta,
    secondaryCta
  };
}

function normalizeLink(value, fallback) {
  if (!isRecord(value)) {
    return fallback;
  }

  return {
    label: normalizeText(value.label, fallback.label),
    href: normalizeText(value.href, fallback.href)
  };
}

function normalizeText(value, fallback) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
