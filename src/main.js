import './style.css';
import './styles/design-tokens.css';
import './styles/game-shell.css';
import './styles/game-mine.css';
import './styles/game-world.css';
import './styles/game-economy.css';
import './styles/game-systems.css';
import './styles/game-responsive.css';

import gameContent from './data/gameContent.js';
import { mountPlayableMiner } from './ui/game/mountPlayableMiner.js';

const PLAYABLE_SAVE_KEY = 'virtual-miner-save';

const app = document.querySelector('#app');

if (!app) {
  throw new Error('Virtual Miner could not mount because #app was not found.');
}

const meta = gameContent.meta ?? {};
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

app.innerHTML = '';
app.classList.add('vm-playable--fullscreen');

const mountOutcome = mountPlayableWithRecovery(app, { allowSaveReset: true });

if (!mountOutcome.ok) {
  app.setAttribute('data-playable-state', 'fallback');
  app.innerHTML = renderPlayableFallback({
    title: 'Game could not start.',
    copy: mountOutcome.resetAttempted
      ? 'The local save was cleared, but the game still could not load. You can try again or clear the save once more.'
      : 'Something went wrong while loading the local save. Try again or clear the save data.'
  });
  bindPlayableFallbackActions(app);
}

function renderPlayableFallback({
  title = 'Game could not start.',
  copy = 'The save data could not be loaded right now.'
} = {}) {
  return `
    <article class="vm-fallback" role="status" aria-live="polite">
      <p class="vm-fallback__eyebrow">Save Load Error</p>
      <h1 class="vm-fallback__title">${escapeHtml(title)}</h1>
      <p class="vm-fallback__copy">${escapeHtml(copy)}</p>
      <div class="vm-fallback__actions">
        <button class="vm-fallback__button" type="button" data-action="retry-playable-mount">
          Retry game
        </button>
        <button class="vm-fallback__button vm-fallback__button--ghost" type="button" data-action="reset-playable-save">
          Clear local save
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
    console.error(`Virtual Miner game failed during ${stage}.`, error);
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
      title: 'Game is still unavailable.',
      copy: 'The local save could not be recovered yet. Refresh the page and try again.'
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
