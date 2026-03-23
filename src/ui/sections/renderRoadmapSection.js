export function renderRoadmapSection(content = {}) {
  const roadmap = isRecord(content.roadmap) ? content.roadmap : content;
  const title = cleanText(roadmap.title, 'Roadmap from concept shell to full product pitch');
  const phases = Array.isArray(roadmap.phases) ? roadmap.phases.slice(0, 4) : [];

  return `
    <section class="vm-section vm-section--compact vm-roadmap" id="roadmap" aria-labelledby="vm-roadmap-title">
      <div class="vm-section__inner vm-stack">
        <div class="vm-section-header" data-reveal style="--vm-delay: 40ms;">
          <span class="vm-eyebrow">Roadmap // Delivery Sequence</span>
          <div class="vm-stack">
            <h2 class="vm-title" id="vm-roadmap-title">${escapeHtml(title)}</h2>
            <p class="vm-lead">The delivery story reads in sequence: trustworthy idling first, authored world structure second, long-tail prestige pressure after the core fantasy is stable.</p>
          </div>
        </div>

        <ol class="vm-roadmap__list">
          ${phases
            .map(
              (phase, index) => `
                <li class="vm-roadmap__item" data-reveal style="--vm-delay: ${80 + index * 60}ms;">
                  <div class="vm-roadmap__step">
                    <span>${escapeHtml(cleanText(phase.phase, `Phase ${index + 1}`))}</span>
                    <span class="vm-roadmap__index">${escapeHtml(`0${index + 1}`)}</span>
                  </div>
                  <h3 class="vm-roadmap__title">${escapeHtml(cleanText(phase.title, 'Delivery phase'))}</h3>
                  <p class="vm-copy">${escapeHtml(
                    cleanText(
                      phase.body,
                      'Each phase should add a new layer of player trust, authored worldbuilding, or endgame pressure.'
                    )
                  )}</p>
                </li>
              `
            )
            .join('')}
        </ol>
      </div>
    </section>
  `;
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
