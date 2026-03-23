const DEFAULT_LOOP = {
  eyebrow: 'Core Loop // Respectful Idling',
  title: 'A loop designed around momentum instead of maintenance',
  intro:
    'Set intent, automate output, step away safely, then come back to a report that highlights the best moments instead of exposing cleanup chores.',
  steps: [
    {
      step: '01',
      title: 'Read the return session',
      description:
        'Open on the welcome-back report so the mine feels like an ongoing operation instead of a paused spreadsheet.',
      kicker: 'Return to the best moments first.'
    },
    {
      step: '02',
      title: 'Stabilize the machine layer',
      description:
        'Spend gold on drills, workers, storage, and conveyors so AFK mining stays close to peak efficiency.',
      kicker: 'Trustworthy automation is the product promise.'
    },
    {
      step: '03',
      title: 'Push the descent',
      description:
        'Use active play to reach deeper biomes, new hazards, and stronger economies that never appear near the surface.',
      kicker: 'Depth is where authored worldbuilding starts to matter.'
    },
    {
      step: '04',
      title: 'Chase the rarity spike',
      description:
        'PRD, pity pressure, and lucky moments create the burst window that turns a normal shift into a memorable haul.',
      kicker: 'Rare spikes keep the comeback session memorable.'
    }
  ],
  cadence: [
    {
      label: 'AFK carry',
      value: 'Up to 7 days of bounded simulation'
    },
    {
      label: 'Active session',
      value: 'Depth pushes and events still reward live play'
    },
    {
      label: 'Reinvestment',
      value: 'Every upgrade extends the next safe break window'
    }
  ]
};

export function renderLoopSection(content = {}) {
  const loop = normalizeLoopContent(content);

  const steps = loop.steps
    .map(
      (step, index) => `
        <li class="vm-loop__item" data-reveal style="--vm-delay: ${80 + index * 60}ms;">
          <div class="vm-loop__item-head">
            <span class="vm-loop__step">${escapeHtml(step.step)}</span>
            <h3 class="vm-loop__item-title">${escapeHtml(step.title)}</h3>
          </div>
          <p class="vm-loop__description">${escapeHtml(step.description)}</p>
          <p class="vm-loop__kicker">${escapeHtml(step.kicker)}</p>
        </li>
      `
    )
    .join('');

  const cadence = loop.cadence
    .map(
      (item, index) => `
        <div class="vm-loop__cadence-item" data-reveal style="--vm-delay: ${140 + index * 60}ms;">
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
        </div>
      `
    )
    .join('');

  return `
    <section class="vm-section vm-loop" id="loop" aria-labelledby="vm-loop-title">
      <div class="vm-section__inner vm-stack">
        <div class="vm-section-header" data-reveal style="--vm-delay: 40ms;">
          <span class="vm-eyebrow">${escapeHtml(loop.eyebrow)}</span>
          <div class="vm-stack">
            <h2 class="vm-title" id="vm-loop-title">${escapeHtml(loop.title)}</h2>
            <p class="vm-lead">${escapeHtml(loop.intro)}</p>
          </div>
        </div>
        <ol class="vm-loop__sequence" aria-label="Core game loop">
          ${steps}
        </ol>
        <div class="vm-loop__cadence" aria-label="Loop cadence">
          ${cadence}
        </div>
      </div>
    </section>
  `;
}

function normalizeLoopContent(content) {
  const source = content?.loop && typeof content.loop === 'object' ? content.loop : content;

  return {
    eyebrow: normalizeText(source?.eyebrow, DEFAULT_LOOP.eyebrow),
    title: normalizeText(source?.title, DEFAULT_LOOP.title),
    intro: normalizeText(source?.intro, DEFAULT_LOOP.intro),
    steps: normalizeSteps(source?.steps, DEFAULT_LOOP.steps),
    cadence: normalizeCadence(source?.cadence, DEFAULT_LOOP.cadence)
  };
}

function normalizeSteps(steps, fallback) {
  if (!Array.isArray(steps) || steps.length === 0) {
    return fallback;
  }

  return steps
    .filter((step) => isRecord(step))
    .slice(0, 4)
    .map((step, index) => ({
      step: normalizeText(step.step, fallback[index]?.step ?? fallback[0].step),
      title: normalizeText(step.title, fallback[index]?.title ?? fallback[0].title),
      description: normalizeText(
        step.description,
        normalizeText(step.body, fallback[index]?.description ?? fallback[0].description)
      ),
      kicker: normalizeText(step.kicker, fallback[index]?.kicker ?? fallback[0].kicker)
    }));
}

function normalizeCadence(cadence, fallback) {
  if (!Array.isArray(cadence) || cadence.length === 0) {
    return fallback;
  }

  return cadence
    .filter((item) => isRecord(item))
    .slice(0, 4)
    .map((item, index) => ({
      label: normalizeText(item.label, fallback[index]?.label ?? fallback[0].label),
      value: normalizeText(item.value, fallback[index]?.value ?? fallback[0].value)
    }));
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

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
