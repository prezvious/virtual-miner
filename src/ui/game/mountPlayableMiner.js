import gameContent from '../../data/gameContent.js';
import { createGameStore } from '../../game/core/store.js';
import { renderEconomyPanel, bindEconomyPanel } from './renderEconomyPanel.js';
import { renderGameShell } from './renderGameShell.js';
import { renderMinePanel, bindMinePanel } from './renderMinePanel.js';
import { renderSystemsPanel, bindSystemsPanel } from './renderSystemsPanel.js';
import { renderWorldPanel, bindWorldPanel } from './renderWorldPanel.js';

export function mountPlayableMiner(container) {
  if (!container) {
    throw new Error('Playable Virtual Miner could not mount because a container was not provided.');
  }

  const uiState = {
    upgradeModalOpen: false,
    upgradeModalView: 'upgrades',
    shortcutsOpen: false
  };

  const store = createGameStore({
    biomes: gameContent.biomes ?? [],
    rarityTiers: gameContent.systems?.rarityTiers ?? [],
    offlineSystems: gameContent.systems?.offlineSystems ?? []
  });

  let renderScheduled = false;
  let tickHandle = null;
  let unsubscribe = () => {};
  let unbindShellControls = () => {};

  /* ── Scroll-aware rendering ──
   * Track whether the user is actively scrolling or touching.
   * Defer innerHTML-based re-renders while interaction is live so the
   * browser's native scroll tracking isn't killed by DOM destruction. */
  let interactionActive = false;
  let interactionTimer = null;
  let deferredRender = false;
  let restoringScroll = false;
  let restoreTimer = null;

  function markInteraction() {
    if (restoringScroll) return;
    interactionActive = true;
    clearTimeout(interactionTimer);
    interactionTimer = setTimeout(() => {
      interactionActive = false;
      if (deferredRender) {
        deferredRender = false;
        if (!renderScheduled) {
          renderScheduled = true;
          window.requestAnimationFrame(() => {
            renderScheduled = false;
            render();
          });
        }
      }
    }, 150);
  }

  function addScrollGuards() {
    container.addEventListener('scroll', markInteraction, { capture: true, passive: true });
    container.addEventListener('touchstart', markInteraction, { passive: true });
    container.addEventListener('touchmove', markInteraction, { passive: true });
    window.addEventListener('scroll', markInteraction, { passive: true });
  }

  function removeScrollGuards() {
    container.removeEventListener('scroll', markInteraction, { capture: true });
    container.removeEventListener('touchstart', markInteraction);
    container.removeEventListener('touchmove', markInteraction);
    window.removeEventListener('scroll', markInteraction);
    clearTimeout(interactionTimer);
    clearTimeout(restoreTimer);
  }

  try {
    addScrollGuards();

    unsubscribe = store.subscribe(() => {
      if (!renderScheduled) {
        renderScheduled = true;
        window.requestAnimationFrame(() => {
          renderScheduled = false;
          if (interactionActive) {
            deferredRender = true;
            return;
          }
          render();
        });
      }
    });

    unbindShellControls = wireShellControls(container, store, uiState, render);
    invokeStoreAction(store, 'tick', Date.now());
    render();

    tickHandle = window.setInterval(() => {
      invokeStoreAction(store, 'tick', Date.now());
    }, 1000);
  } catch (error) {
    teardownMount();
    container.innerHTML = '';
    throw error;
  }

  return {
    store,
    destroy() {
      teardownMount();
      container.innerHTML = '';
    }
  };

  function teardownMount() {
    if (tickHandle !== null) {
      window.clearInterval(tickHandle);
      tickHandle = null;
    }

    unsubscribe();
    unsubscribe = () => {};

    unbindShellControls();
    unbindShellControls = () => {};

    removeScrollGuards();
    delete container.dataset.vmGameBound;
    renderScheduled = false;
  }

  function render() {
    const state = store.getState();

    /* Save all scroll positions:
     * - window.scrollY: the real page scroll (on mobile, panels use overflow:visible
     *   so the document scrolls, not the panel elements)
     * - tabs scrollLeft: horizontal tab bar scroll on small screens
     * - panel/aside scrollTop: used on desktop where aside has overflow-y:auto */
    const windowScroll = window.scrollY;
    const tabs = container.querySelector('.vm-game-shell__tabs');
    const mainPanel = container.querySelector('.vm-game-shell__panel');
    const aside = container.querySelector('.vm-game-shell__aside');
    const tabsScroll = tabs ? tabs.scrollLeft : 0;
    const mainScroll = mainPanel ? mainPanel.scrollTop : 0;
    const asideScroll = aside ? aside.scrollTop : 0;

    const focused = document.activeElement;
    const focusAction = focused && container.contains(focused) ? focused.getAttribute('data-action') : null;
    const focusTab = focused && container.contains(focused) ? focused.getAttribute('data-tab') : null;

    restoringScroll = true;
    clearTimeout(restoreTimer);

    container.innerHTML = renderGameShell({
      state,
      minePanel: renderMinePanel(state),
      economyPanel: renderEconomyPanel(state, uiState),
      worldPanel: renderWorldPanel(state),
      systemsPanel: renderSystemsPanel(state, gameContent.systems ?? {}),
      shortcutsOpen: uiState.shortcutsOpen
    });

    bindMinePanel(container, store);
    bindEconomyPanel(container, store);
    bindWorldPanel(container, store);
    bindSystemsPanel(container, store);

    /* Restore all scroll positions */
    window.scrollTo({ top: windowScroll, behavior: 'instant' });
    const newTabs = container.querySelector('.vm-game-shell__tabs');
    const newMainPanel = container.querySelector('.vm-game-shell__panel');
    const newAside = container.querySelector('.vm-game-shell__aside');
    if (newTabs) {
      newTabs.scrollLeft = tabsScroll;
    }
    if (newMainPanel) {
      newMainPanel.scrollTop = mainScroll;
    }
    if (newAside) {
      newAside.scrollTop = asideScroll;
    }

    if (focusAction) {
      const selector = focusTab
        ? `[data-action="${focusAction}"][data-tab="${focusTab}"]`
        : `[data-action="${focusAction}"]`;
      const target = container.querySelector(selector);
      if (target) {
        target.focus();
      }
    }

    restoreTimer = setTimeout(() => { restoringScroll = false; }, 50);
  }
}

function wireShellControls(root, store, uiState, render) {
  if (root.dataset.vmGameBound === 'true') {
    return () => {};
  }

  const handleClick = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const actionNode = target.closest('[data-action]');

    if (!actionNode || !root.contains(actionNode)) {
      return;
    }

    const action = actionNode.dataset.action;

    switch (action) {
      case 'open-upgrade-modal':
        uiState.upgradeModalOpen = true;
        uiState.upgradeModalView = actionNode.dataset.upgradeModalView === 'support' ? 'support' : 'upgrades';
        render();
        break;
      case 'close-upgrade-modal':
        uiState.upgradeModalOpen = false;
        render();
        break;
      case 'set-upgrade-modal-view':
        uiState.upgradeModalOpen = true;
        uiState.upgradeModalView = actionNode.dataset.upgradeModalView === 'support' ? 'support' : 'upgrades';
        render();
        break;
      case 'mine-once':
        invokeStoreAction(store, 'mineOnce');
        break;
      case 'blast-dynamite':
        invokeStoreAction(store, 'blastDynamite');
        break;
      case 'sell-all':
        invokeStoreAction(store, 'sellAll');
        break;
      case 'buy-upgrade':
        invokeStoreAction(store, 'buyUpgrade', actionNode.dataset.upgradeId);
        break;
      case 'buy-support':
        invokeStoreAction(store, 'buySupport', actionNode.dataset.supportId);
        break;
      case 'claim-contract':
        invokeStoreAction(store, 'claimContract', actionNode.dataset.contractId);
        break;
      case 'reroll-contracts':
        invokeStoreAction(store, 'rerollContracts');
        break;
      case 'start-refinery':
        invokeStoreAction(store, 'startRefineryBatch');
        break;
      case 'set-shift':
        invokeStoreAction(store, 'setShift', actionNode.dataset.shift);
        break;
      case 'set-extraction-mode':
        invokeStoreAction(store, 'setExtractionMode', actionNode.dataset.mode);
        break;
      case 'resolve-incident':
        invokeStoreAction(store, 'resolveIncident', actionNode.dataset.incidentId, actionNode.dataset.resolution);
        break;
      case 'choose-event-option':
        invokeStoreAction(store, 'chooseEventOption', actionNode.dataset.optionId);
        break;
      case 'hire-contractors':
        invokeStoreAction(store, 'hireContractors');
        break;
      case 'set-tab':
        invokeStoreAction(store, 'setTab', actionNode.dataset.tab);
        break;
      case 'select-biome':
        invokeStoreAction(store, 'selectBiome', actionNode.dataset.biomeId);
        break;
      case 'dismiss-offline-report':
        invokeStoreAction(store, 'dismissOfflineReport');
        break;
      case 'toggle-shortcuts':
        uiState.shortcutsOpen = !uiState.shortcutsOpen;
        render();
        break;
      default:
        break;
    }
  };

  const handleChange = (event) => {
    const input = event.target;

    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    if (input.matches('[data-action="set-local-depth"]')) {
      invokeStoreAction(store, 'setLocalDepth', Number(input.value));
    }

    if (input.matches('[data-action="set-crew-ratio"]')) {
      invokeStoreAction(store, 'setCrew', input.dataset.crewRole, Number(input.value) / 100);
    }
  };

  const handleKeydown = (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    const key = event.key;

    if (uiState.shortcutsOpen) {
      if (key === 'Escape' || key === '?') {
        uiState.shortcutsOpen = false;
        render();
      }
      return;
    }

    if (uiState.upgradeModalOpen) {
      if (key === 'Escape') {
        uiState.upgradeModalOpen = false;
        render();
      }
      return;
    }

    switch (key.toLowerCase()) {
      case '1':
        invokeStoreAction(store, 'setTab', 'mine');
        break;
      case '2':
        invokeStoreAction(store, 'setTab', 'economy');
        break;
      case '3':
        invokeStoreAction(store, 'setTab', 'world');
        break;
      case '4':
        invokeStoreAction(store, 'setTab', 'systems');
        break;
      case 'd':
        invokeStoreAction(store, 'mineOnce');
        break;
      case 'b':
        invokeStoreAction(store, 'blastDynamite');
        break;
      case 's':
        invokeStoreAction(store, 'sellAll');
        break;
      case 'u':
        uiState.upgradeModalOpen = true;
        uiState.upgradeModalView = 'upgrades';
        render();
        break;
      case 'h':
        uiState.upgradeModalOpen = true;
        uiState.upgradeModalView = 'support';
        render();
        break;
      case 'r':
        invokeStoreAction(store, 'rerollContracts');
        break;
      case 'f':
        invokeStoreAction(store, 'startRefineryBatch');
        break;
      case 'c': {
        const currentState = store.getState();
        const claimable = (currentState.contracts ?? []).find(
          (contract) => contract.claimable && !contract.completed
        );
        if (claimable) {
          invokeStoreAction(store, 'claimContract', claimable.id);
        }
        break;
      }
      case '?':
        uiState.shortcutsOpen = !uiState.shortcutsOpen;
        render();
        break;
      case 'escape':
        uiState.shortcutsOpen = false;
        render();
        break;
      default:
        break;
    }
  };

  try {
    root.addEventListener('click', handleClick);
    root.addEventListener('change', handleChange);
    root.addEventListener('keydown', handleKeydown);
  } catch (error) {
    root.removeEventListener('click', handleClick);
    root.removeEventListener('change', handleChange);
    root.removeEventListener('keydown', handleKeydown);
    throw error;
  }

  root.dataset.vmGameBound = 'true';

  return () => {
    root.removeEventListener('click', handleClick);
    root.removeEventListener('change', handleChange);
    root.removeEventListener('keydown', handleKeydown);
    delete root.dataset.vmGameBound;
  };
}

function invokeStoreAction(store, actionName, ...args) {
  const action = store?.actions?.[actionName];

  if (typeof action !== 'function') {
    return;
  }

  action(...args);
}
