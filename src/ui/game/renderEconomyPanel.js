export function renderEconomyPanel(state = {}, uiState = {}) {
  const inventory = normalizeInventory(state.inventory);
  const inventoryLoad = Number(state.inventoryLoad) || 0;
  const storageCap = Math.max(1, Number(state.storageCap) || 1);
  const capacityRatio = clamp(inventoryLoad / storageCap, 0, 1);
  const credits = Number(state.credits) || 0;
  const lifetimeCredits = Number(state.lifetimeCredits) || 0;
  const marketEntries = normalizeMarketEntries(state.marketEntries);
  const upgrades = normalizeUpgrades(state.upgrades);
  const support = normalizeSupport(state.supportBuildings);
  const contracts = normalizeContracts(state.contracts);
  const refineryQueue = normalizeRefineryQueue(state.refineryQueue);
  const sellDisabled = inventory.every((item) => item.quantity <= 0);
  const highestPrice = marketEntries[0];
  const payroll = Number(state.workers?.payrollLoad) || 0;
  const readyContracts = contracts.filter((contract) => contract.claimable).length;
  const upgradeModalView = uiState?.upgradeModalView === 'support' ? 'support' : 'upgrades';
  const upgradeModalOpen = Boolean(uiState?.upgradeModalOpen);

  return `
    <section class="vm-economy" aria-label="Economy operations">
      <header class="vm-economy__hero" data-surface="cta">
        <div class="vm-economy__hero-copy">
          <p class="vm-economy__eyebrow">Shop</p>
          <h2 class="vm-economy__title">Sell ores, buy upgrades, and grow your mine!</h2>
          <p class="vm-economy__copy">
            ${escapeHtml(
              highestPrice
                ? `${highestPrice.name} sells for ${formatCredits(highestPrice.price)} right now.`
                : 'Dig, sell, and upgrade to earn more coins!'
            )}
          </p>
        </div>
        <div class="vm-economy__hero-actions">
          <button
            class="vm-economy__primary"
            type="button"
            data-action="sell-all"
            ${sellDisabled ? 'disabled' : ''}
          >
            Sell All
          </button>
          <div class="vm-economy__capacity" aria-label="Backpack capacity">
            <div class="vm-economy__capacity-copy">
              <span class="vm-economy__capacity-label">Backpack</span>
              <strong class="vm-economy__capacity-value">${formatSimpleNumber(inventoryLoad)} / ${formatSimpleNumber(storageCap)}</strong>
            </div>
            <div class="vm-economy__capacity-bar" aria-hidden="true">
              <span style="width:${Math.round(capacityRatio * 100)}%"></span>
            </div>
          </div>
        </div>
        <dl class="vm-economy__totals">
          <div class="vm-economy__total">
            <dt>Your Coins</dt>
            <dd>${formatCredits(credits)}</dd>
          </div>
          <div class="vm-economy__total">
            <dt>Total Earned</dt>
            <dd>${formatCredits(lifetimeCredits)}</dd>
          </div>
          <div class="vm-economy__total">
            <dt>Worker Pay</dt>
            <dd>${formatCredits(payroll)}</dd>
          </div>
          <div class="vm-economy__total">
            <dt>Jobs Ready</dt>
            <dd>${readyContracts}</dd>
          </div>
        </dl>
      </header>

      <div class="vm-economy__grid">
        <section class="vm-economy__section">
          <div class="vm-economy__section-head">
            <div>
              <p class="vm-economy__kicker">Your Items</p>
              <h3 class="vm-economy__section-title">What you're carrying</h3>
            </div>
            <p class="vm-economy__section-note">Items saved for jobs and your collection won't be sold.</p>
          </div>
          <div class="vm-economy__inventory">
            ${
              inventory.length
                ? inventory
                    .map(
                      (item) => `
                        <article class="vm-economy__inventory-row">
                          <div class="vm-economy__inventory-main">
                            <div class="vm-economy__rarity vm-economy__rarity--${item.rarityClass}"></div>
                            <div>
                              <h4>${escapeHtml(item.name)}</h4>
                              <p>${escapeHtml(item.rarityLabel)}</p>
                            </div>
                          </div>
                          <dl class="vm-economy__inventory-meta">
                            <div>
                              <dt>Amount</dt>
                              <dd>${formatSimpleNumber(item.quantity)}</dd>
                            </div>
                            <div>
                              <dt>Worth</dt>
                              <dd>${formatCredits(item.totalValue)}</dd>
                            </div>
                          </dl>
                        </article>
                      `
                    )
                    .join('')
                : `
                    <article class="vm-economy__empty">
                      <h4>Nothing in your backpack yet</h4>
                      <p>Head to the <strong>Mining</strong> tab and hit <strong>Dig!</strong> to start finding ores. Your haul shows up here once you dig.</p>
                    </article>
                  `
            }
          </div>
        </section>

        <section class="vm-economy__section">
          <div class="vm-economy__section-head">
            <div>
              <p class="vm-economy__kicker">Prices</p>
              <h3 class="vm-economy__section-title">What things are worth</h3>
            </div>
            <p class="vm-economy__section-note">Check prices to know what to sell first.</p>
          </div>
          <div class="vm-economy__market">
            ${
              marketEntries.length
                ? marketEntries
                    .map(
                      (entry) => `
                        <article class="vm-economy__market-row">
                          <div>
                            <h4>${escapeHtml(entry.name)}</h4>
                            <p>${escapeHtml(entry.rarityLabel)}</p>
                          </div>
                          <dl class="vm-economy__market-meta">
                            <div>
                              <dt>Price</dt>
                              <dd>${formatCredits(entry.price)}</dd>
                            </div>
                            <div>
                              <dt>You have</dt>
                              <dd>${formatSimpleNumber(entry.quantity)}</dd>
                            </div>
                          </dl>
                        </article>
                      `
                    )
                    .join('')
                : `
                    <article class="vm-economy__empty">
                      <h4>No market prices yet</h4>
                      <p>Ore prices appear once you start digging. Rarer ores from deeper zones are worth more coins.</p>
                    </article>
                  `
            }
          </div>
        </section>
      </div>

      <section class="vm-economy__section vm-economy__upgrade-launch" data-surface="depth">
        <div class="vm-economy__section-head">
          <div>
            <p class="vm-economy__kicker">Upgrades</p>
            <h3 class="vm-economy__section-title">Make your mine better</h3>
          </div>
          <p class="vm-economy__section-note">All upgrades and helper buildings are here.</p>
        </div>
        <div class="vm-economy__launcher-actions">
          <button
            class="vm-economy__primary"
            type="button"
            data-action="open-upgrade-modal"
            data-upgrade-modal-view="upgrades"
          >
            Open Upgrades
          </button>
          <button
            class="vm-economy__secondary"
            type="button"
            data-action="open-upgrade-modal"
            data-upgrade-modal-view="support"
          >
            Open Helpers
          </button>
        </div>
      </section>

      <div class="vm-economy__grid vm-economy__grid--secondary">
        <section class="vm-economy__section">
          <div class="vm-economy__section-head">
            <div>
              <p class="vm-economy__kicker">Jobs</p>
              <h3 class="vm-economy__section-title">Tasks to complete</h3>
            </div>
            <button class="vm-economy__secondary" type="button" data-action="reroll-contracts">
              New Jobs
            </button>
          </div>
          <div class="vm-economy__cards">
            ${
              contracts.length
                ? contracts
                    .map(
                      (contract) => `
                        <article class="vm-economy__card vm-economy__card--contract">
                          <div class="vm-economy__card-head">
                            <div>
                              <h4>${escapeHtml(contract.title)}</h4>
                              <p>${escapeHtml(contract.subtitle)}</p>
                            </div>
                            <span class="vm-economy__reward">${formatCredits(contract.reward)}</span>
                          </div>
                          <div class="vm-economy__progress" aria-hidden="true">
                            <span style="width:${Math.round(contract.progressRatio * 100)}%"></span>
                          </div>
                          <div class="vm-economy__card-foot">
                            <strong>${formatSimpleNumber(contract.progress)} / ${formatSimpleNumber(contract.target)} | ${contract.timer}</strong>
                            <button
                              class="vm-economy__secondary"
                              type="button"
                              data-action="claim-contract"
                              data-contract-id="${escapeAttr(contract.id)}"
                              ${contract.claimable ? '' : 'disabled'}
                            >
                              ${contract.claimable ? 'Claim' : 'In Progress'}
                            </button>
                          </div>
                        </article>
                      `
                    )
                    .join('')
                : `
                    <article class="vm-economy__empty">
                      <h4>No jobs available yet</h4>
                      <p>Jobs unlock as your mine grows. Keep digging and hiring workers — new contracts will appear here. Hit <strong>New Jobs</strong> to refresh.</p>
                    </article>
                  `
            }
          </div>
        </section>

        <section class="vm-economy__section">
          <div class="vm-economy__section-head">
            <div>
              <p class="vm-economy__kicker">Workshop</p>
              <h3 class="vm-economy__section-title">Crafting queue</h3>
            </div>
            <button class="vm-economy__secondary" type="button" data-action="start-refinery">
              Craft
            </button>
          </div>
          <div class="vm-economy__cards">
            ${
              refineryQueue.length
                ? refineryQueue
                    .map(
                      (batch) => `
                        <article class="vm-economy__card">
                          <div class="vm-economy__card-head">
                            <div>
                              <h4>${escapeHtml(batch.outputName)}</h4>
                              <p>${escapeHtml(`${batch.inputUnits} in → ${batch.outputUnits} out`)}</p>
                            </div>
                            <span class="vm-economy__level">${escapeHtml(batch.outputRarity)}</span>
                          </div>
                          <div class="vm-economy__progress" aria-hidden="true">
                            <span style="width:${Math.round(batch.progressRatio * 100)}%"></span>
                          </div>
                          <div class="vm-economy__card-foot">
                            <strong>${escapeHtml(`${Math.ceil(batch.remaining)}s remaining`)}</strong>
                          </div>
                        </article>
                      `
                    )
                    .join('')
                : `
                    <article class="vm-economy__empty">
                      <h4>Nothing being crafted</h4>
                      <p>Turn common ores into rarer, more valuable ones!</p>
                    </article>
                  `
            }
          </div>
        </section>
      </div>

      ${renderUpgradeModal({
        upgrades,
        support,
        upgradeModalView,
        upgradeModalOpen
      })}
    </section>
  `;
}

export function bindEconomyPanel(root, store) {
  void root;
  void store;
}

function renderUpgradeModal({
  upgrades,
  support,
  upgradeModalView,
  upgradeModalOpen
}) {
  const showingSupport = upgradeModalView === 'support';
  const title = showingSupport ? 'Helper Buildings' : 'Upgrades';
  const subtitle = showingSupport
    ? 'Buildings and services that let you hire more workers.'
    : 'Make your mine stronger and hire more workers.';

  return `
    <div class="vm-economy-modal-backdrop${upgradeModalOpen ? ' is-open' : ''}" ${upgradeModalOpen ? '' : 'hidden'}>
      <button
        class="vm-economy-modal__veil"
        type="button"
        data-action="close-upgrade-modal"
        aria-label="Close upgrades"
      ></button>

      <section class="vm-economy-modal" role="dialog" aria-modal="true" aria-labelledby="vm-upgrade-modal-title">
        <header class="vm-economy-modal__header">
          <div>
            <p class="vm-economy__kicker">Upgrades</p>
            <h3 class="vm-economy__section-title" id="vm-upgrade-modal-title">${escapeHtml(title)}</h3>
            <p class="vm-economy__section-note">${escapeHtml(subtitle)}</p>
          </div>
          <button
            class="vm-economy__secondary vm-economy-modal__close"
            type="button"
            data-action="close-upgrade-modal"
          >
            Close
          </button>
        </header>

        <div class="vm-economy-modal__tabs" role="tablist" aria-label="Upgrade system views">
          <button
            class="vm-economy-modal__tab${showingSupport ? '' : ' is-active'}"
            type="button"
            role="tab"
            aria-selected="${showingSupport ? 'false' : 'true'}"
            data-action="set-upgrade-modal-view"
            data-upgrade-modal-view="upgrades"
          >
            Mine Upgrades
          </button>
          <button
            class="vm-economy-modal__tab${showingSupport ? ' is-active' : ''}"
            type="button"
            role="tab"
            aria-selected="${showingSupport ? 'true' : 'false'}"
            data-action="set-upgrade-modal-view"
            data-upgrade-modal-view="support"
          >
            Helper Buildings
          </button>
        </div>

        <div class="vm-economy-modal__body">
          <div class="vm-economy__cards">
            ${showingSupport ? renderSupportCards(support) : renderUpgradeCards(upgrades)}
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderUpgradeCards(upgrades) {
  if (!Array.isArray(upgrades) || upgrades.length === 0) {
    return `
      <article class="vm-economy__empty">
        <h4>No upgrades yet</h4>
        <p>Upgrades appear as you play.</p>
      </article>
    `;
  }

  return upgrades
    .map(
      (upgrade) => `
        <article class="vm-economy__card">
          <div class="vm-economy__card-head">
            <div>
              <h4>${escapeHtml(upgrade.name)}</h4>
              <p>${escapeHtml(upgrade.meta)}</p>
            </div>
            <span class="vm-economy__level">Lv ${formatSimpleNumber(upgrade.level)}</span>
          </div>
          <div class="vm-economy__card-foot">
            <strong>${formatCredits(upgrade.nextCost)}</strong>
            <button
              class="vm-economy__secondary"
              type="button"
              data-action="buy-upgrade"
              data-upgrade-id="${escapeAttr(upgrade.id)}"
              ${upgrade.canBuy ? '' : 'disabled'}
            >
              ${upgrade.cta}
            </button>
          </div>
        </article>
      `
    )
    .join('');
}

function renderSupportCards(support) {
  if (!Array.isArray(support) || support.length === 0) {
    return `
      <article class="vm-economy__empty">
        <h4>No helpers yet</h4>
        <p>Helper buildings appear as you play.</p>
      </article>
    `;
  }

  return support
    .map(
      (building) => `
        <article class="vm-economy__card">
          <div class="vm-economy__card-head">
            <div>
              <h4>${escapeHtml(building.name)}</h4>
              <p>${escapeHtml(building.effect)}</p>
            </div>
            <span class="vm-economy__level">Lv ${formatSimpleNumber(building.level)}</span>
          </div>
          <div class="vm-economy__card-foot">
            <strong>${formatCredits(building.nextCost)}</strong>
            <button
              class="vm-economy__secondary"
              type="button"
              data-action="buy-support"
              data-support-id="${escapeAttr(building.id)}"
              ${building.canBuy ? '' : 'disabled'}
            >
              ${building.cta}
            </button>
          </div>
        </article>
      `
    )
    .join('');
}

function normalizeInventory(inventory) {
  if (!Array.isArray(inventory)) {
    return [];
  }

  return inventory
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => ({
      key: item.key || `inventory-${index}`,
      name: item.name || readableLabel(item.key || `inventory-${index}`),
      quantity: Number(item.quantity) || 0,
      totalValue: Number(item.totalValue) || (Number(item.marketPrice) || 0) * (Number(item.quantity) || 0),
      rarityLabel: item.rarity || 'Unknown',
      rarityClass: rarityClass(item.rarity || 'unknown')
    }))
    .sort((left, right) => right.totalValue - left.totalValue);
}

function normalizeMarketEntries(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry, index) => ({
      key: entry.key || `market-${index}`,
      name: entry.name || readableLabel(entry.key || `market-${index}`),
      price: Number(entry.price) || 0,
      quantity: Number(entry.quantity) || 0,
      rarityLabel: entry.rarity || 'Unknown'
    }))
    .sort((left, right) => right.price - left.price)
    .slice(0, 8);
}

function normalizeUpgrades(upgrades) {
  if (!Array.isArray(upgrades)) {
    return [];
  }

  return upgrades
    .filter((upgrade) => upgrade && typeof upgrade === 'object')
    .map((upgrade, index) => ({
      id: upgrade.id || `upgrade-${index}`,
      name: upgrade.name || readableLabel(upgrade.id || `upgrade-${index}`),
      level: Number(upgrade.level) || 0,
      nextCost: Number(upgrade.nextCost) || 0,
      canBuy: Boolean(upgrade.canBuy),
      meta: `${upgrade.family || 'Upgrade'} | ${upgrade.effect || 'Makes your mine better'}`,
      cta: upgrade.maxed ? 'Maxed' : (upgrade.canBuy ? 'Upgrade' : 'Locked')
    }));
}

function normalizeSupport(supportBuildings) {
  if (!Array.isArray(supportBuildings)) {
    return [];
  }

  return supportBuildings
    .filter((building) => building && typeof building === 'object')
    .map((building, index) => ({
      id: building.id || `support-${index}`,
      name: building.name || readableLabel(building.id || `support-${index}`),
      effect: building.effect || 'Helps your mine grow',
      level: Number(building.level) || 0,
      nextCost: Number(building.nextCost) || 0,
      canBuy: Boolean(building.canBuy),
      cta: building.maxed ? 'Maxed' : (building.canBuy ? 'Build' : 'Locked')
    }));
}

function normalizeContracts(contracts) {
  if (!Array.isArray(contracts)) {
    return [];
  }

  return contracts
    .filter((contract) => contract && typeof contract === 'object')
    .map((contract, index) => {
      const target = Math.max(1, Number(contract.target) || 1);
      const progress = Math.max(0, Number(contract.progress) || 0);
      const remaining = Math.max(0, Number(contract.remaining) || 0);

      return {
        id: contract.id || `contract-${index}`,
        title: contract.title || 'Job',
        subtitle: contract.subtitle || 'Deliver specific ores',
        reward: Number(contract.reward) || 0,
        target,
        progress,
        progressRatio: clamp(progress / target, 0, 1),
        claimable: Boolean(contract.claimable),
        timer: `${Math.ceil(remaining)}s`
      };
    });
}

function normalizeRefineryQueue(queue) {
  if (!Array.isArray(queue)) {
    return [];
  }

  return queue
    .filter((batch) => batch && typeof batch === 'object')
    .map((batch, index) => {
      const remaining = Math.max(0, Number(batch.remaining) || 0);
      const baseDuration = Math.max(1, Number(batch.baseDuration) || remaining || 1);

      return {
        id: batch.id || `batch-${index}`,
        outputName: batch.outputName || 'Crafted Item',
        outputRarity: batch.outputRarity || 'unknown',
        inputUnits: Number(batch.inputUnits) || 0,
        outputUnits: Number(batch.outputUnits) || 0,
        remaining,
        progressRatio: clamp(1 - (remaining / baseDuration), 0, 1)
      };
    });
}

function formatSimpleNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return '0';
  }

  return Math.round(numeric).toLocaleString('en-US');
}

function formatCredits(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return '0 coins';
  }
  return `${Math.round(numeric).toLocaleString('en-US')} coins`;
}

function rarityClass(label) {
  return String(label ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'quiet';
}

function readableLabel(value) {
  return String(value ?? '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .trim();
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
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
