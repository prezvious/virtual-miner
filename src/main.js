import './style.css';
import './styles/design-tokens.css';
import './styles/game-shell.css';
import './styles/game-mine.css';
import './styles/game-world.css';
import './styles/game-economy.css';
import './styles/game-responsive.css';

import siteContent from './data/siteContent.js';
import { mountPlayableMiner } from './ui/game/mountPlayableMiner.js';
import { renderVirtualMinerSite } from './ui/renderVirtualMinerSite.js';

const PLAYABLE_SAVE_KEY = 'virtual-miner-save';

const app = document.querySelector('#app');

if (!app) {
  throw new Error('Virtual Miner could not mount because #app was not found.');
}

const meta = siteContent.meta ?? {};
document.title = meta.title || 'Virtual Miner';
if (meta.description) {
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', 'description');
    document.head.append(tag);
  }
  tag.setAttribute('content', meta.description);
}

// Render the full landing page — the game mounts inside [data-playable-root]
app.innerHTML = renderVirtualMinerSite(siteContent);

const playableRoot = app.querySelector('[data-playable-root]');
const gameMount = playableRoot ?? app;

if (!playableRoot) {
  // Fallback: fullscreen game if site shell didn't produce a playable root
  gameMount.classList.add('vm-playable--fullscreen');
}

const mountOutcome = mountPlayableWithRecovery(gameMount, { allowSaveReset: true });

if (!mountOutcome.ok) {
  gameMount.setAttribute('data-playable-state', 'fallback');
  gameMount.innerHTML = renderPlayableFallback({
    title: 'Command deck is temporarily unavailable.',
    copy: mountOutcome.resetAttempted
      ? 'Automatic recovery failed. You can retry the command deck or reset local deck data.'
      : 'Something went wrong loading the game. Try resetting your save data.'
  });
  bindPlayableFallbackActions(gameMount);
}

function renderPlayableFallback({
  title = 'Command deck is temporarily unavailable.',
  copy = 'The landing experience is still available while the playable runtime is being recovered.'
} = {}) {
  return `
    <article class="vm-card vm-stack vm-playable__fallback" role="status" aria-live="polite">
      <p class="vm-eyebrow">Playable Surface Offline</p>
      <h3 class="vm-subtitle">${escapeHtml(title)}</h3>
      <p class="vm-copy">
        ${escapeHtml(copy)}
      </p>
      <div class="vm-actions">
        <button class="vm-button vm-button--ghost" type="button" data-action="retry-playable-mount">
          Retry command deck
        </button>
        <button class="vm-button vm-button--ghost" type="button" data-action="reset-playable-save">
          Reset deck data
        </button>
      </div>
    </article>
  `;
}

function mountPlayableWithRecovery(root, { allowSaveReset = false } = {}) {
  const firstAttempt = mountPlayable(root, 'initial mount');
  if (firstAttempt.ok) {
    return { ok: true, resetAttempted: false };
  }

  if (!allowSaveReset) {
    return { ok: false, resetAttempted: false };
  }

  const resetApplied = resetPlayableSave();
  const secondAttempt = mountPlayable(root, 'post-reset mount');
  return {
    ok: secondAttempt.ok,
    resetAttempted: resetApplied
  };
}

function mountPlayable(root, stage) {
  try {
    mountPlayableMiner(root);
    root.removeAttribute('data-playable-state');
    return { ok: true };
  } catch (error) {
    console.error(`Virtual Miner playable surface failed during ${stage}.`, error);
    return { ok: false, error };
  }
}

function bindPlayableFallbackActions(root) {
  if (root.dataset.vmPlayableFallbackBound === 'true') {
    return;
  }

  root.dataset.vmPlayableFallbackBound = 'true';
  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const actionNode = target.closest('[data-action]');
    if (!actionNode || !root.contains(actionNode)) {
      return;
    }

    const action = actionNode.getAttribute('data-action');
    if (action !== 'retry-playable-mount' && action !== 'reset-playable-save') {
      return;
    }

    if (action === 'reset-playable-save') {
      resetPlayableSave();
    }

    const result = mountPlayableWithRecovery(root, { allowSaveReset: action === 'reset-playable-save' });
    if (result.ok) {
      delete root.dataset.vmPlayableFallbackBound;
      return;
    }

    root.setAttribute('data-playable-state', 'fallback');
    root.innerHTML = renderPlayableFallback({
      title: 'Command deck is still unavailable.',
      copy: 'The deck could not be recovered yet. Try again after a refresh.'
    });
  });
}

function resetPlayableSave() {
  try {
    localStorage.removeItem(PLAYABLE_SAVE_KEY);
    return true;
  } catch (_error) {
    return false;
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
