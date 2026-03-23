import * as HeroSectionModule from './sections/renderHeroSection.js';
import * as LoopSectionModule from './sections/renderLoopSection.js';
import * as SystemsSectionModule from './sections/renderSystemsSection.js';
import * as WorldSectionModule from './sections/renderWorldSection.js';
import * as RoadmapSectionModule from './sections/renderRoadmapSection.js';
import * as CtaSectionModule from './sections/renderCtaSection.js';

const renderHeroSection = resolveRenderer(HeroSectionModule, 'renderHeroSection');
const renderLoopSection = resolveRenderer(LoopSectionModule, 'renderLoopSection');
const renderSystemsSection = resolveRenderer(SystemsSectionModule, 'renderSystemsSection');
const renderWorldSection = resolveRenderer(WorldSectionModule, 'renderWorldSection');
const renderRoadmapSection = resolveRenderer(RoadmapSectionModule, 'renderRoadmapSection');
const renderCtaSection = resolveRenderer(CtaSectionModule, 'renderCtaSection');

export function renderVirtualMinerSite(content = {}) {
  const shell = isRecord(content.shell) ? content.shell : {};
  const brand = isRecord(shell.brand) ? shell.brand : {};
  const navigation = Array.isArray(shell.navigation) ? shell.navigation : [];
  const footer = isRecord(content.footer) ? content.footer : {};
  const footerLinks = Array.isArray(footer.links) ? footer.links : [];

  const hero = mapHeroContent(content, brand);
  const loop = mapLoopContent(content);
  const systems = isRecord(content.systems) ? content.systems : {};
  const world = {
    ...(isRecord(content.world) ? content.world : {}),
    biomes: Array.isArray(content.biomes) ? content.biomes : []
  };
  const roadmap = isRecord(content.roadmap) ? content.roadmap : {};
  const cta = isRecord(content.cta) ? content.cta : {};
  const navCta = normalizeLink(cta.primaryAction, {
    href: '#playable',
    label: 'Enter the command deck'
  });

  return `
    <div class="vm-site" data-site="virtual-miner">
      <header class="vm-nav">
        <div class="vm-nav__inner">
          <a class="vm-nav__brand" href="#hero">
            <span class="vm-nav__badge">VM</span>
            <span class="vm-nav__meta">
              <span class="vm-nav__eyebrow">${escapeHtml(normalizeText(brand.label, 'Product concept site'))}</span>
              <span class="vm-nav__title">${escapeHtml(normalizeText(brand.name, 'Virtual Miner'))}</span>
            </span>
          </a>
          <nav class="vm-nav__links" aria-label="Primary">
            ${navigation
              .map((item) => {
                const link = normalizeLink(item, { href: '#top', label: 'Overview' });
                return `<a href="${escapeAttr(link.href)}">${escapeHtml(link.label)}</a>`;
              })
              .join('')}
          </nav>
          <a class="vm-nav__cta" href="${escapeAttr(navCta.href)}">${escapeHtml(navCta.label)}</a>
        </div>
      </header>

      <main class="vm-main">
        <span class="vm-anchor" id="top" aria-hidden="true"></span>
        ${renderSection('hero', renderHeroSection, hero)}
        ${renderSection('loop', renderLoopSection, loop)}
        ${renderPlayableSection(brand)}
        ${renderSection('systems', renderSystemsSection, systems)}
        ${renderSection('world', renderWorldSection, world)}
        ${renderSection('roadmap', renderRoadmapSection, roadmap)}
        ${renderSection('cta', renderCtaSection, cta)}
      </main>

      <footer class="vm-footer">
        <div class="vm-footer__inner">
          <div class="vm-stack">
            <p class="vm-footer__copy">${escapeHtml(
              `${normalizeText(brand.name, 'Virtual Miner')} now leads with a brand-first landing composition and keeps the dense command deck below the fold.`
            )}</p>
            <p class="vm-footer__note">${escapeHtml(
              normalizeText(
                footer.note,
                'Concept shell for a full-scale Virtual Miner marketing and product website.'
              )
            )}</p>
          </div>
          <div class="vm-footer__links">
            ${footerLinks
              .map((item) => {
                const link = normalizeLink(item, { href: '#top', label: 'Back to top' });
                return `<a class="vm-footer__link" href="${escapeAttr(link.href)}">${escapeHtml(link.label)}</a>`;
              })
              .join('')}
          </div>
        </div>
      </footer>
    </div>
  `;
}

function renderPlayableSection(brand) {
  const brandName = normalizeText(brand.name, 'Virtual Miner');
  const brandTagline = normalizeText(
    brand.tagline,
    'Editorial reveal shell for a deep idle mining game with prestige and legendary drop chases.'
  );

  return `
    <section class="vm-section vm-section--compact vm-playable" id="playable" aria-labelledby="vm-playable-title">
      <div class="vm-section__inner vm-stack">
        <div class="vm-section-header" data-reveal style="--vm-delay: 80ms;">
          <span class="vm-eyebrow">Playable Surface</span>
          <div class="vm-stack">
            <h2 class="vm-title" id="vm-playable-title">Enter the command deck after the story, not before it.</h2>
            <p class="vm-lead">${escapeHtml(brandTagline)} The denser operational UI belongs here, where it can behave like a tool without collapsing the landing-page composition.</p>
          </div>
        </div>
        <div class="vm-playable__shell" data-reveal style="--vm-delay: 140ms;">
          <div class="vm-playable__frame" data-playable-root aria-label="${escapeAttr(`${brandName} playable miner`)}"></div>
        </div>
      </div>
    </section>
  `;
}

function renderSection(sectionId, renderer, sectionContent) {
  try {
    const html = renderer(sectionContent);
    return typeof html === 'string' && html.trim() ? html : renderFallback(sectionId);
  } catch (error) {
    console.error(`Virtual Miner section render failed for ${sectionId}.`, error);
    return renderFallback(sectionId);
  }
}

function mapHeroContent(content, brand) {
  const source = isRecord(content.hero) ? content.hero : {};

  return {
    brandName: normalizeText(brand.name, 'Virtual Miner'),
    brandLabel: normalizeText(brand.label, 'Product concept site'),
    title: normalizeText(
      source.title,
      'Build a mining world that keeps moving when the player is away.'
    ),
    lead: normalizeText(
      source.description,
      'Virtual Miner positions idle mining as a respectful descent: automate extraction, push into authored biomes, and come back to momentum instead of cleanup chores.'
    ),
    primaryCta: normalizeLink(source.primaryCta, {
      href: '#playable',
      label: 'Enter the command deck'
    }),
    secondaryCta: normalizeLink(source.secondaryCta, {
      href: '#loop',
      label: 'Inspect the core loop'
    })
  };
}

function mapLoopContent(content) {
  const source = isRecord(content.loop) ? content.loop : {};
  const steps = Array.isArray(source.steps) ? source.steps.slice(0, 4) : [];
  const defaultKickers = [
    'Return to a highlight reel, not raw logs.',
    'Trustworthy automation is the product promise.',
    'Depth is where authored worldbuilding starts to matter.',
    'Rare spikes keep the comeback session memorable.'
  ];

  return {
    eyebrow: 'Core Loop // Respectful Idling',
    title: normalizeText(source.title, 'A loop designed around momentum instead of maintenance'),
    intro: normalizeText(
      source.intro,
      'Set intent, automate output, step away safely, then come back to a report that surfaces the best moments instead of exposing cleanup chores.'
    ),
    steps: steps.map((step, index) => ({
      step: `0${index + 1}`,
      title: normalizeText(step.title, 'Loop beat'),
      description: normalizeText(
        step.description,
        normalizeText(
          step.body,
          'Each pass through the loop should make the mine more capable and the world more interesting.'
        )
      ),
      kicker: normalizeText(step.kicker, defaultKickers[index] ?? defaultKickers[defaultKickers.length - 1])
    })),
    cadence: [
      { label: 'AFK carry', value: 'Up to 7 days of bounded simulation' },
      { label: 'Active session', value: 'Depth pushes and events still reward live play' },
      { label: 'Reinvestment', value: 'Every upgrade extends the next safe break window' }
    ]
  };
}

function renderFallback(sectionId) {
  return `
    <section class="vm-section" id="${escapeAttr(sectionId)}">
      <div class="vm-section__inner">
        <div class="vm-section__fallback">
          <h2 class="vm-section__fallback-title">${escapeHtml(sectionId)}</h2>
          <p class="vm-section__fallback-copy">This section is still being assembled. The landing page shell is live and ready for content.</p>
        </div>
      </div>
    </section>
  `;
}

function resolveRenderer(moduleNamespace, exportName) {
  if (typeof moduleNamespace?.[exportName] === 'function') {
    return moduleNamespace[exportName];
  }

  if (typeof moduleNamespace?.default === 'function') {
    return moduleNamespace.default;
  }

  return () => '';
}

function normalizeLink(link, fallback = {}) {
  const source = isRecord(link) ? link : {};
  const defaultLink = isRecord(fallback) ? fallback : {};
  const href = normalizeText(source.href, source.id ? `#${source.id}` : normalizeText(defaultLink.href, '#top'));
  const label = normalizeText(source.label, normalizeText(defaultLink.label, 'Learn more'));

  return { href, label };
}

function normalizeText(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
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
