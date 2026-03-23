export function renderCtaSection(content = {}) {
  const cta = isRecord(content.cta) ? content.cta : content;
  const eyebrow = cleanText(cta.eyebrow, 'Build From the Shell');
  const title = cleanText(cta.title, 'Turn the concept into a full product surface');
  const description = cleanText(
    cta.description,
    'Section-level ownership keeps the website modular while the shared content model preserves the world, systems, and progression story.'
  );
  const primaryAction = normalizeLink(cta.primaryAction, {
    href: '#playable',
    label: 'Enter the command deck'
  });
  const secondaryAction = normalizeLink(cta.secondaryAction, {
    href: '#roadmap',
    label: 'Review roadmap'
  });
  const notes = Array.isArray(cta.notes) && cta.notes.length
    ? cta.notes.slice(0, 3)
    : [
        'Shared content model across sections.',
        'Biome atlas reused as product narrative input.',
        'Independent section renderers can evolve without breaking the shell.'
      ];

  return `
    <section class="vm-section vm-section--compact vm-cta" id="cta" aria-labelledby="vm-cta-title">
      <div class="vm-section__inner">
        <div class="vm-cta__panel" data-reveal style="--vm-delay: 80ms;">
          <span class="vm-eyebrow">${escapeHtml(eyebrow)}</span>
          <h2 class="vm-title" id="vm-cta-title">${escapeHtml(title)}</h2>
          <p class="vm-lead">${escapeHtml(description)}</p>
          <div class="vm-actions">
            <a class="vm-button" href="${escapeAttr(primaryAction.href)}">${escapeHtml(primaryAction.label)}</a>
            <a class="vm-button vm-button--ghost" href="${escapeAttr(secondaryAction.href)}">${escapeHtml(secondaryAction.label)}</a>
          </div>
          <ul class="vm-cta__notes">
            ${notes
              .map(
                (note) => `
                  <li>${escapeHtml(
                    cleanText(
                      note,
                      'Keep the shell modular and the product story coherent.'
                    )
                  )}</li>
                `
              )
              .join('')}
          </ul>
        </div>
      </div>
    </section>
  `;
}

function normalizeLink(link, fallback = {}) {
  const source = isRecord(link) ? link : {};
  const href = cleanText(source.href, cleanText(fallback.href, '#top'));
  const label = cleanText(source.label, cleanText(fallback.label, 'Explore'));

  return { href, label };
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
