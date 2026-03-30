import {
  rollRarity,
  rollLuckyStrike,
  calculateOreQuantity,
  createInitialRarityCounters,
} from '../utils/rarity.js';
import {
  getCombinedRarityModifier,
} from '../utils/modifiers.js';
import {
  DEFAULT_RARITY_TIERS,
  DEFAULT_LUCKY_STRIKE,
} from '../data/rngConfig.js';
import {
  applyOfflineEfficiencyDecay,
  getOfflineDepthEfficiency,
} from '../utils/offline.js';
import { formatLargeNumber } from '../utils/formatters.js';

const TABS = new Set(['mine', 'economy', 'world', 'systems']);

const OFFLINE_REPORT_THRESHOLD_MS = 20_000;
const MAX_SIMULATION_MS = 1000 * 60 * 60 * 8;
const PAYROLL_INTERVAL_SECONDS = 30;
const SAVE_KEY = 'virtual-miner-save';
const SAVE_VERSION = 2;
const CONTRACT_REFRESH_SECONDS = 28;
const INCIDENT_CHECK_SECONDS = 6;

const OFFLINE_SUBSYSTEM_EFFICIENCY = {
  ore: 0.95,
  depth: 0.70,
  autoSell: 0.95,
  events: 0.40
};

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
const RARITY_WEIGHT = {
  common: 56,
  uncommon: 26,
  rare: 12,
  epic: 5,
  legendary: 1.2,
  mythic: 0.18
};
const RARITY_MULTIPLIER = {
  common: 1,
  uncommon: 1.25,
  rare: 1.8,
  epic: 2.9,
  legendary: 4.5,
  mythic: 7.2
};

const TIER_TO_ORE_RARITY = {
  Plain: 'common',
  Curious: 'common',
  Odd: 'common',
  Uncanny: 'uncommon',
  Whispered: 'uncommon',
  Haunted: 'rare',
  Hexed: 'rare',
  Enchanted: 'epic',
  Hallowed: 'epic',
  Cursed: 'epic',
  Veiled: 'legendary',
  Eldritch: 'legendary',
  Arcane: 'mythic',
  Mythic: 'mythic',
  Fabled: 'mythic'
};

const TIER_PRICE_MULTIPLIER = {
  Plain: 1.0,
  Curious: 1.15,
  Odd: 1.35,
  Uncanny: 1.6,
  Whispered: 1.9,
  Haunted: 2.3,
  Hexed: 2.8,
  Enchanted: 3.5,
  Hallowed: 4.2,
  Cursed: 5.2,
  Veiled: 6.5,
  Eldritch: 8.0,
  Arcane: 10.0,
  Mythic: 14.0,
  Fabled: 20.0
};

const SHIFT_PROFILES = {
  day: {
    id: 'day',
    name: 'Day Shift',
    description: 'Balanced production and safety. Best default for trusted idle windows.',
    productionMultiplier: 1,
    hazardMultiplier: 1,
    payrollMultiplier: 1,
    moraleDelta: 0.00022,
    fatigueDelta: 0.00052,
    disciplineDelta: 0.00018
  },
  night: {
    id: 'night',
    name: 'Night Shift',
    description: 'Higher ore pressure, weaker support in unstable darkness.',
    productionMultiplier: 1.12,
    hazardMultiplier: 1.12,
    payrollMultiplier: 1.08,
    moraleDelta: -0.00028,
    fatigueDelta: 0.00084,
    disciplineDelta: -0.00012
  },
  overtime: {
    id: 'overtime',
    name: 'Overtime Mode',
    description: 'Strong throughput at heavy fatigue, injury, and payroll cost.',
    productionMultiplier: 1.3,
    hazardMultiplier: 1.3,
    payrollMultiplier: 1.24,
    moraleDelta: -0.00048,
    fatigueDelta: 0.00142,
    disciplineDelta: -0.00034
  },
  safe: {
    id: 'safe',
    name: 'Hazard-Safe Shift',
    description: 'Stable and slower, for long offline reliability and injury control.',
    productionMultiplier: 0.82,
    hazardMultiplier: 0.72,
    payrollMultiplier: 0.94,
    moraleDelta: 0.00048,
    fatigueDelta: 0.00022,
    disciplineDelta: 0.00036
  },
  deep: {
    id: 'deep',
    name: 'Deep-Zone Specialist',
    description: 'Focuses depth progression and deep biome output at higher support demand.',
    productionMultiplier: 1.08,
    hazardMultiplier: 1.08,
    payrollMultiplier: 1.1,
    moraleDelta: -0.00016,
    fatigueDelta: 0.00092,
    disciplineDelta: 0.00006
  },
  contract: {
    id: 'contract',
    name: 'Contract Priority',
    description: 'Routes logistics to contract targets for delivery reliability.',
    productionMultiplier: 0.95,
    hazardMultiplier: 0.95,
    payrollMultiplier: 1.07,
    moraleDelta: 0.00006,
    fatigueDelta: 0.00068,
    disciplineDelta: 0.0002
  }
};

const EXTRACTION_POLICIES = {
  balanced: {
    id: 'balanced',
    name: 'Balanced Route',
    description: 'Steady extraction with stable route integrity.',
    productionMultiplier: 1,
    rarityMultiplier: 1,
    hazardDelta: 0.00022,
    depthMultiplier: 1
  },
  aggressive: {
    id: 'aggressive',
    name: 'Aggressive Cut',
    description: 'Higher throughput and depth push with greater hazard escalation.',
    productionMultiplier: 1.24,
    rarityMultiplier: 0.95,
    hazardDelta: 0.00056,
    depthMultiplier: 1.22
  },
  precise: {
    id: 'precise',
    name: 'Precision Survey',
    description: 'Lower volume, better rarity pressure and specimen integrity.',
    productionMultiplier: 0.88,
    rarityMultiplier: 1.28,
    hazardDelta: -0.00012,
    depthMultiplier: 0.86
  }
};

const UPGRADE_DEFS = [
  {
    id: 'pickaxe',
    family: 'Extraction',
    name: 'Pickaxe',
    effect: 'Increases manual click extraction.',
    baseCost: 42,
    growth: 1.31,
    softcap: 12,
    maxLevel: 25
  },
  {
    id: 'auto-drill',
    family: 'Extraction',
    name: 'Auto-Drill',
    effect: 'Raises passive ore extraction per second.',
    baseCost: 96,
    growth: 1.34,
    softcap: 24,
    maxLevel: 50
  },
  {
    id: 'workers',
    family: 'Extraction',
    name: 'Workers',
    effect: 'Uncapped labor growth with support pressure.',
    baseCost: 68,
    growth: 1.11,
    uncapped: true
  },
  {
    id: 'drone-fleet',
    family: 'Extraction',
    name: 'Drone Fleet',
    effect: 'Adds biome-wide autonomous extraction slots.',
    baseCost: 760,
    growth: 1.44,
    softcap: 8,
    maxLevel: 20
  },
  {
    id: 'storage',
    family: 'Logistics',
    name: 'Storage',
    effect: 'Raises ore capacity before production stalls.',
    baseCost: 82,
    growth: 1.3,
    softcap: 16,
    maxLevel: 30
  },
  {
    id: 'lift-speed',
    family: 'Logistics',
    name: 'Lift Speed',
    effect: 'Cuts transfer delay from deep lanes.',
    baseCost: 126,
    growth: 1.33,
    softcap: 10,
    maxLevel: 20
  },
  {
    id: 'conveyor',
    family: 'Logistics',
    name: 'Conveyor',
    effect: 'Improves auto-sell throughput and anti-clog stability.',
    baseCost: 160,
    growth: 1.4,
    softcap: 8,
    maxLevel: 20
  },
  {
    id: 'refinery',
    family: 'Value',
    name: 'Refinery',
    effect: 'Multiplies sale value and refinery throughput.',
    baseCost: 212,
    growth: 1.42,
    softcap: 7,
    maxLevel: 15
  },
  {
    id: 'ore-scanner',
    family: 'Discovery',
    name: 'Ore Scanner',
    effect: 'Raises rare-find pressure and route read quality.',
    baseCost: 194,
    growth: 1.39,
    softcap: 12,
    maxLevel: 25
  },
  {
    id: 'geology-lab',
    family: 'Discovery',
    name: 'Geology Lab',
    effect: 'Improves refinement recipes and promotion chance.',
    baseCost: 420,
    growth: 1.45,
    softcap: 5,
    maxLevel: 10
  },
  {
    id: 'dynamite',
    family: 'Excavation',
    name: 'Dynamite',
    effect: 'Increases blast depth and lowers blast cost pressure.',
    baseCost: 180,
    growth: 1.36,
    softcap: 10,
    maxLevel: 25
  },
  {
    id: 'lighting',
    family: 'Survival',
    name: 'Lighting',
    effect: 'Improves deep-zone visibility and overall efficiency.',
    baseCost: 92,
    growth: 1.28,
    softcap: 8,
    maxLevel: 15
  },
  {
    id: 'ventilation',
    family: 'Survival',
    name: 'Ventilation',
    effect: 'Reduces hazard duration and contamination penalties.',
    baseCost: 140,
    growth: 1.34,
    softcap: 10,
    maxLevel: 20
  },
  {
    id: 'dream-mining',
    family: 'Prestige',
    name: 'Dream Mining',
    effect: 'Increases offline ore efficiency.',
    baseCost: 640,
    growth: 1.52,
    softcap: 4,
    maxLevel: 10
  },
  {
    id: 'fortune-blessing',
    family: 'Prestige',
    name: 'Fortune Blessing',
    effect: 'Permanent rarity amplifier across all zones.',
    baseCost: 700,
    growth: 1.5,
    softcap: 4,
    maxLevel: 10
  },
  {
    id: 'autonomous-excavation',
    family: 'Prestige',
    name: 'Autonomous Excavation',
    effect: 'Improves offline depth progression.',
    baseCost: 730,
    growth: 1.52,
    softcap: 4,
    maxLevel: 10
  }
];

const SUPPORT_DEFS = [
  {
    id: 'barracks',
    name: 'Barracks',
    effect: 'Primary housing capacity.',
    baseCost: 120,
    growth: 1.34,
    softcap: 8,
    maxLevel: 30
  },
  {
    id: 'mess-hall',
    name: 'Mess Hall',
    effect: 'Improves morale recovery and fatigue reset.',
    baseCost: 145,
    growth: 1.33,
    softcap: 8,
    maxLevel: 25
  },
  {
    id: 'medical-bay',
    name: 'Medical Bay',
    effect: 'Reduces injury downtime after incidents.',
    baseCost: 168,
    growth: 1.35,
    softcap: 8,
    maxLevel: 25
  },
  {
    id: 'safety-office',
    name: 'Safety Office',
    effect: 'Lowers incident frequency and severity.',
    baseCost: 182,
    growth: 1.36,
    softcap: 8,
    maxLevel: 25
  },
  {
    id: 'training-hall',
    name: 'Training Hall',
    effect: 'Improves specialization and crew redeploy efficiency.',
    baseCost: 230,
    growth: 1.38,
    softcap: 6,
    maxLevel: 20
  },
  {
    id: 'equipment-lockers',
    name: 'Equipment Lockers',
    effect: 'Reduces gear shortages and deployment delays.',
    baseCost: 188,
    growth: 1.35,
    softcap: 6,
    maxLevel: 20
  },
  {
    id: 'transport-hub',
    name: 'Transport Hub',
    effect: 'Improves outpost routing and rescue dispatch speed.',
    baseCost: 250,
    growth: 1.37,
    softcap: 6,
    maxLevel: 20
  }
];

const EVENT_DEFS = [
  {
    id: 'surveyor-ghostline',
    name: "Surveyor's Ghostline",
    rarity: 'uncommon',
    family: 'route',
    duration: 25,
    description: 'Precision cuts increase rarity pressure and depth gains.'
  },
  {
    id: 'reverse-cave-in',
    name: 'Reverse Cave-In',
    rarity: 'common',
    family: 'route',
    instant: true,
    description: 'A collapse ejects ore from one biome deeper.'
  },
  {
    id: 'market-eclipse',
    name: 'Market Eclipse',
    rarity: 'uncommon',
    family: 'economy',
    duration: 30,
    description: 'Low-tier ore spikes in price while top tiers cool off.'
  },
  {
    id: 'moonwell-breach',
    name: 'Moonwell Breach',
    rarity: 'rare',
    family: 'route',
    duration: 20,
    description: 'Early access to next-band ore pool for a short window.'
  },
  {
    id: 'time-lag-pocket',
    name: 'Time-Lag Pocket',
    rarity: 'rare',
    family: 'reality',
    duration: 35,
    description: 'Ore is buffered and released later with depth-scaled bonus.'
  },
  {
    id: 'gravity-lease',
    name: 'Gravity Lease',
    rarity: 'epic',
    family: 'pact',
    duration: 15,
    requiresChoice: true,
    description: 'Trade depth for rarity or rarity for a depth lunge.'
  },
  {
    id: 'glitch-fault',
    name: 'Glitch Fault',
    rarity: 'epic',
    family: 'reality',
    duration: 20,
    description: 'One ore type duplicates aggressively but decays at event end.'
  },
  {
    id: 'furnace-marriage',
    name: 'Furnace Marriage',
    rarity: 'epic',
    family: 'economy',
    duration: 25,
    description: 'Low-tier pairs fuse upward into higher-tier outputs.'
  },
  {
    id: 'silence-protocol',
    name: 'Silence Protocol',
    rarity: 'epic',
    family: 'operations',
    duration: 20,
    description: 'Manual mining is disabled, automation surges.'
  },
  {
    id: 'debt-collector',
    name: 'Debt Collector from Below',
    rarity: 'epic',
    family: 'pact',
    duration: 120,
    description: 'Immediate credit loan with timed ore repayment pressure.'
  },
  {
    id: 'meteor-script',
    name: 'Meteor Script',
    rarity: 'legendary',
    family: 'jackpot',
    duration: 12,
    requiresChoice: true,
    description: 'Choose a rune sequence for jackpot-tier rewards.'
  },
  {
    id: 'echo-quarry',
    name: 'Echo Quarry',
    rarity: 'legendary',
    family: 'reality',
    duration: 20,
    description: 'Repeats your recent mining actions at boosted efficiency.'
  },
  {
    id: 'singularity-rehearsal',
    name: 'Singularity Rehearsal',
    rarity: 'mythic',
    family: 'jackpot',
    duration: 10,
    description: 'Reality bends: extreme rarity pressure with UI-level shock value.'
  }
];

const EVENT_WEIGHTS = {
  common: 50,
  uncommon: 25,
  rare: 13,
  epic: 8,
  legendary: 3,
  mythic: 1
};

const INCIDENT_DEFS = [
  {
    id: 'cave-in',
    name: 'Cave-In',
    description: 'Crew trapped behind a collapsed lane.',
    productionPenalty: 0.14,
    disciplinePenalty: 0.08
  },
  {
    id: 'toxic-exposure',
    name: 'Toxic Exposure',
    description: 'Contamination hit in an active extraction pocket.',
    productionPenalty: 0.1,
    disciplinePenalty: 0.06
  },
  {
    id: 'broken-lift',
    name: 'Broken Lift',
    description: 'Transfer bottleneck from damaged lift chain.',
    productionPenalty: 0.12,
    disciplinePenalty: 0.05
  },
  {
    id: 'equipment-failure',
    name: 'Equipment Failure',
    description: 'Gear breakdown from weak lockers and maintenance lag.',
    productionPenalty: 0.09,
    disciplinePenalty: 0.04
  }
];

export function createGameStore({
  biomes = [],
  rarityTiers = [],
  offlineSystems = []
} = {}) {
  const listeners = new Set();
  const normalizedBiomes = normalizeBiomes(biomes);
  const runtime = {
    rngState: seedFromBiomes(normalizedBiomes),
    passiveCarry: 0,
    autoSellCarry: 0,
    eventCooldown: randomBetween(24, 44, null),
    eventContext: {},
    payrollTimer: PAYROLL_INTERVAL_SECONDS,
    contractTimer: CONTRACT_REFRESH_SECONDS,
    incidentTimer: INCIDENT_CHECK_SECONDS,
    nextContractId: 1,
    nextIncidentId: 1
  };

  let state = createInitialState({
    biomes: normalizedBiomes,
    rarityTiers,
    offlineSystems
  });

  const savedData = loadFromStorage();
  if (savedData) {
    applySaveData(state, savedData);
  }

  reconcileState(state, runtime);
  let saveCounter = 0;

  const store = {
    subscribe(listener) {
      if (typeof listener !== 'function') {
        return () => {};
      }

      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    getState() {
      return cloneValue(state);
    },
    actions: {
      tick(timestamp = Date.now()) {
        applyTick(timestamp);
      },
      mineOnce() {
        mutate((draft) => {
          if (isManualMiningDisabled(draft)) {
            draft.notifications.unshift('Silence Protocol is active. Manual mining is temporarily disabled.');
            return;
          }

          const attempts = Math.max(1, Math.floor(computeProductionModel(draft).orePerClick));
          performMiningAttempts(draft, runtime, attempts, 'manual');
          incrementDepth(draft, computeDepthGain(draft, 1.6));
        });
      },
      blastDynamite() {
        mutate((draft) => {
          const level = getUpgradeLevel(draft, 'dynamite');
          const blastCost = Math.max(
            10,
            Math.round((120 / (1 + 0.06 * level)) * (1 + draft.currentGlobalDepth / 20_000))
          );

          if (draft.credits < blastCost) {
            draft.notifications.unshift(`Need ${formatCredits(blastCost)} to trigger a blast.`);
            return;
          }

          draft.credits -= blastCost;
          const blastDepth = 15 + (5 * level) + (0.4 * Math.pow(level, 1.35));
          incrementDepth(draft, blastDepth * 920);
          performMiningAttempts(draft, runtime, Math.max(4, Math.round(blastDepth * 0.45)), 'blast');
          draft.notifications.unshift(`Dynamite blast triggered. ${formatMeters(blastDepth * 920)} depth punched.`);
        });
      },
      sellAll() {
        mutate((draft) => {
          sellInventory(draft, true);
        });
      },
      buyUpgrade(upgradeId) {
        mutate((draft) => {
          buyUpgrade(draft, upgradeId);
        });
      },
      buySupport(buildingId) {
        mutate((draft) => {
          buySupportBuilding(draft, buildingId);
        });
      },
      claimContract(contractId) {
        mutate((draft) => {
          claimContract(draft, runtime, contractId);
        });
      },
      rerollContracts() {
        mutate((draft) => {
          rerollContracts(draft, runtime);
        });
      },
      setShift(shiftId) {
        mutate((draft) => {
          if (!canUseShift(draft, shiftId)) {
            draft.notifications.unshift('This shift policy is locked behind workforce milestones.');
            return;
          }

          draft.shiftPolicy = shiftId;
        });
      },
      setExtractionMode(modeId) {
        mutate((draft) => {
          if (EXTRACTION_POLICIES[modeId]) {
            draft.extractionMode = modeId;
          }
        });
      },
      resolveIncident(incidentId, resolution = 'dispatch') {
        mutate((draft) => {
          resolveIncident(draft, incidentId, resolution);
        });
      },
      chooseEventOption(optionId) {
        mutate((draft) => {
          chooseEventOption(draft, runtime, optionId);
        });
      },
      startRefineryBatch() {
        mutate((draft) => {
          startRefineryBatch(draft);
        });
      },
      hireContractors() {
        mutate((draft) => {
          hireContractors(draft);
        });
      },
      setTab(tabId) {
        mutate((draft) => {
          if (TABS.has(tabId)) {
            draft.activeTab = tabId;
          }
        });
      },
      selectBiome(biomeId) {
        mutate((draft) => {
          selectBiome(draft, biomeId);
        });
      },
      dismissOfflineReport() {
        mutate((draft) => {
          draft.offlineReport = null;
        });
      },
      setLocalDepth(nextDepth) {
        mutate((draft) => {
          setLocalDepth(draft, nextDepth);
        });
      },
      setCrew(role, ratio) {
        mutate((draft) => {
          setCrew(draft, role, ratio);
        });
      }
    }
  };

  return store;

  function applyTick(timestamp) {
    const nextTimestamp = Number.isFinite(Number(timestamp)) ? Number(timestamp) : Date.now();

    mutate((draft) => {
      if (!Number.isFinite(draft.lastTickAt)) {
        draft.lastTickAt = nextTimestamp;
        draft.now = nextTimestamp;
        return;
      }

      const elapsedMs = clampNumber(nextTimestamp - draft.lastTickAt, 0, MAX_SIMULATION_MS);
      if (elapsedMs <= 0) {
        draft.lastTickAt = nextTimestamp;
        draft.now = nextTimestamp;
        return;
      }

      const isOffline = elapsedMs >= OFFLINE_REPORT_THRESHOLD_MS;

      const creditsBefore = draft.credits;
      const depthBefore = draft.deepestDepth;
      const findsBefore = draft.recentFinds.length;
      const eventsBefore = draft.eventHistory.length;
      const incidentsBefore = draft.incidents.length;
      const discoveriesBefore = draft.discoveries.length;
      const inventoryBefore = draft.inventory.map((item) => ({ key: item.key, quantity: item.quantity }));

      const seconds = elapsedMs / 1000;

      if (isOffline) {
        const offlineContext = {
          totalElapsedMs: elapsedMs,
          oreProduced: 0,
          offlineEvents: 0
        };
        simulate(draft, runtime, seconds, offlineContext);

        draft.lastTickAt = nextTimestamp;
        draft.now = nextTimestamp;

        const eventsTriggered = Math.max(0, draft.eventHistory.length - eventsBefore);
        const newIncidents = Math.max(0, draft.incidents.length - incidentsBefore);
        const newDiscoveries = draft.discoveries.slice(0, Math.max(0, draft.discoveries.length - discoveriesBefore));

        const rarityBreakdown = {};
        for (const find of draft.recentFinds.slice(0, Math.max(0, draft.recentFinds.length - findsBefore))) {
          const tier = find.tierName ?? find.rarity ?? 'common';
          rarityBreakdown[tier] = (rarityBreakdown[tier] ?? 0) + (find.quantity ?? 1);
        }

        const dreamLevel = getUpgradeLevel(draft, 'dream-mining');
        const elapsedHours = elapsedMs / 3_600_000;
        const decayMult = applyOfflineEfficiencyDecay(elapsedHours);
        const effectiveEfficiency = Math.round(OFFLINE_SUBSYSTEM_EFFICIENCY.ore * decayMult * (1 + 0.005 * dreamLevel) * 100);

        draft.offlineReport = buildOfflineReport({
          elapsedMs,
          shiftName: SHIFT_PROFILES[draft.shiftPolicy]?.name ?? 'Day Shift',
          creditsEarned: Math.max(0, draft.credits - creditsBefore),
          depthGain: Math.max(0, draft.deepestDepth - depthBefore),
          recentFindCount: Math.max(0, draft.recentFinds.length - findsBefore),
          eventsTriggered,
          newIncidents: Math.max(0, newIncidents),
          oreProduced: offlineContext.oreProduced,
          rarityBreakdown,
          newDiscoveries: newDiscoveries.map((d) => ({ name: d.name, tierName: d.tierName, rarity: d.rarity })),
          offlineEfficiency: effectiveEfficiency,
          dreamMiningLevel: dreamLevel
        });
      } else {
        simulate(draft, runtime, seconds);

        draft.lastTickAt = nextTimestamp;
        draft.now = nextTimestamp;
      }
    });
  }

  function mutate(mutator) {
    mutator(state);
    reconcileState(state, runtime);
    saveCounter += 1;
    if (saveCounter >= 3) {
      saveCounter = 0;
      saveToStorage(state);
    }
    listeners.forEach((listener) => {
      listener();
    });
  }
}

function createInitialState({ biomes, rarityTiers, offlineSystems }) {
  const now = Date.now();
  const firstBiome = biomes[0] ?? createFallbackBiome();

  return {
    activeTab: 'mine',
    now,
    lastTickAt: now,
    credits: 560,
    lifetimeCredits: 560,
    debt: 0,

    biomes,
    rarityTiers: Array.isArray(rarityTiers) ? rarityTiers : [],
    offlineSystems: Array.isArray(offlineSystems) ? offlineSystems : [],
    selectedBiomeId: firstBiome.id,
    selectedBiome: firstBiome,
    biomeDepths: Object.fromEntries(biomes.map((biome) => [biome.id, 0])),
    localDepth: 0,
    deepestDepth: 0,
    currentGlobalDepth: firstBiome.globalDepth.start,
    totalDepth: getTotalDepth(biomes),

    shiftPolicy: 'day',
    extractionMode: 'balanced',

    upgrades: UPGRADE_DEFS.map((upgrade) => ({
      ...upgrade,
      level: upgrade.id === 'workers' ? 6 : 0,
      nextCost: 0,
      canBuy: true
    })),
    supportBuildings: SUPPORT_DEFS.map((building) => ({
      ...building,
      level: 0,
      nextCost: 0,
      canBuy: true
    })),

    workers: {
      temporaryWorkers: 0,
      contractorDuration: 0,
      morale: 0.72,
      fatigue: 0.18,
      discipline: 0.76,
      safetyRating: 0.7,
      payrollLoad: 0,
      breakpoints: {},
      headcount: 0,
      assignedWorkers: 0,
      effectiveWorkforce: 0,
      housingCapacity: 0,
      supportCapacity: 0
    },
    crews: {
      extraction: 0.4,
      hauler: 0.24,
      stabilization: 0.16,
      survey: 0.12,
      recovery: 0.08
    },
    mineState: {
      heat: 0.38,
      pressure: 0.34,
      air: 0.82,
      light: 0.64,
      flow: 0.58,
      charge: 0.4,
      integrity: 0.8,
      specimenIntegrity: 0.76,
      routeStability: 0.78
    },

    prdCounters: createInitialRarityCounters(DEFAULT_RARITY_TIERS, 1),
    comboCount: 0,
    lastDropTier: null,

    inventory: [],
    inventoryLoad: 0,
    storageCap: 100,
    capacityRatio: 0,
    marketEntries: [],
    averageOreValue: 0,
    refineryQueue: [],

    contracts: [],
    incidents: [],
    activeEvent: null,
    eventHistory: [],
    recentFinds: [],
    discoveries: [],
    museumScore: 0,

    notifications: [
      'Mine ready. Start digging and upgrade the first bottleneck you hit.',
      `Current zone: ${firstBiome.name}.`
    ],
    stats: {},
    offlineReport: null
  };
}

function reconcileState(state, runtime) {
  const selectedBiome = getSelectedBiome(state);
  const unlockedBiomeIds = getUnlockedBiomeIds(state);
  const exploredDepth = clampDepth(state.biomeDepths[selectedBiome.id] ?? 0, selectedBiome);
  state.biomeDepths[selectedBiome.id] = exploredDepth;
  const clampedLocalDepth = clampNumber(state.localDepth, 0, exploredDepth);

  state.selectedBiome = selectedBiome;
  state.selectedBiomeId = selectedBiome.id;
  state.localDepth = clampedLocalDepth;
  state.currentGlobalDepth = selectedBiome.globalDepth.start + clampedLocalDepth;
  state.deepestDepth = Math.max(state.deepestDepth, state.currentGlobalDepth);
  state.totalDepth = getTotalDepth(state.biomes);

  state.biomes = state.biomes.map((biome) => {
    const localDepth = clampDepth(state.biomeDepths[biome.id] ?? 0, biome);
    const ratio = biome.localDepthLimit > 0 ? localDepth / biome.localDepthLimit : 0;

    return {
      ...biome,
      unlocked: unlockedBiomeIds.has(biome.id),
      isSelected: biome.id === selectedBiome.id,
      localDepth,
      progressRatio: clampNumber(ratio, 0, 1),
      currentGlobalDepth: biome.globalDepth.start + localDepth
    };
  });

  state.upgrades = state.upgrades.map((upgrade) => {
    const nextCost = getUpgradeCost(upgrade);
    const maxed = Number.isFinite(upgrade.maxLevel) && upgrade.level >= upgrade.maxLevel;

    return {
      ...upgrade,
      nextCost,
      canBuy: !maxed && state.credits >= nextCost,
      maxed
    };
  });

  state.supportBuildings = state.supportBuildings.map((building) => {
    const nextCost = getSupportCost(building);
    const maxed = Number.isFinite(building.maxLevel) && building.level >= building.maxLevel;

    return {
      ...building,
      nextCost,
      canBuy: !maxed && state.credits >= nextCost,
      maxed
    };
  });

  const workforceModel = computeWorkforceModel(state);
  state.workers = {
    ...state.workers,
    ...workforceModel
  };

  const productionModel = computeProductionModel(state);
  state.storageCap = productionModel.storageCap;
  state.averageOreValue = productionModel.averageOreValue;
  state.inventory = normalizeInventory(state.inventory, state, productionModel);
  state.inventoryLoad = state.inventory.reduce((sum, item) => sum + item.quantity, 0);
  state.capacityRatio = state.storageCap > 0 ? clampNumber(state.inventoryLoad / state.storageCap, 0, 1) : 0;
  state.marketEntries = buildMarketEntries(state, productionModel);
  state.contracts = normalizeContracts(state.contracts, state, runtime);
  state.refineryQueue = normalizeRefineryQueue(state.refineryQueue);

  state.incidents = state.incidents
    .filter((incident) => !incident.resolved && incident.remaining > 0)
    .slice(0, 4);
  state.recentFinds = state.recentFinds.slice(0, 10);
  state.eventHistory = state.eventHistory.slice(-8);
  state.notifications = dedupeStrings(state.notifications).slice(0, 10);

  state.stats = buildStats(state, productionModel);
}

function simulate(state, runtime, seconds, offlineContext = null) {
  let remaining = Math.max(0, toNumber(seconds));
  const isOffline = offlineContext !== null;

  const dreamMiningLevel = isOffline ? getUpgradeLevel(state, 'dream-mining') : 0;
  const autoExcavationLevel = isOffline ? getUpgradeLevel(state, 'autonomous-excavation') : 0;

  let offlineOreEff = 1;
  let offlineDepthEff = 1;
  let offlineSellEff = 1;
  let offlineEventEff = 1;

  if (isOffline) {
    const elapsedHours = (offlineContext.totalElapsedMs ?? 0) / 3_600_000;
    const decayMult = applyOfflineEfficiencyDecay(elapsedHours);
    const dreamBonus = 1 + (0.005 * dreamMiningLevel);

    offlineOreEff = OFFLINE_SUBSYSTEM_EFFICIENCY.ore * decayMult * dreamBonus;
    offlineDepthEff = OFFLINE_SUBSYSTEM_EFFICIENCY.depth * decayMult * getOfflineDepthEfficiency(autoExcavationLevel);
    offlineSellEff = OFFLINE_SUBSYSTEM_EFFICIENCY.autoSell * decayMult;
    offlineEventEff = OFFLINE_SUBSYSTEM_EFFICIENCY.events * decayMult;
  }

  while (remaining > 0) {
    const step = Math.min(remaining, 2);
    remaining -= step;

    updateWorkerVitals(state, step);
    updateMineState(state, step);
    processIncidents(state, runtime, step);
    processPayroll(state, runtime, step);
    processContracts(state, runtime, step);

    if (isOffline) {
      processOfflineEvents(state, runtime, step, offlineEventEff, offlineContext);
    } else {
      processEvents(state, runtime, step);
    }

    const productionModel = computeProductionModel(state);
    const effectiveOreRate = productionModel.passiveOreRate * offlineOreEff;
    const passiveAttempts = getPassiveAttempts(runtime, effectiveOreRate, step);

    if (passiveAttempts > 0) {
      performMiningAttempts(state, runtime, passiveAttempts, isOffline ? 'offline' : 'passive');
      incrementDepth(state, computeDepthGain(state, step) * offlineDepthEff);

      if (isOffline) {
        offlineContext.oreProduced = (offlineContext.oreProduced ?? 0) + passiveAttempts;
      }
    }

    processRefinery(state, step);
    processAutoSell(state, runtime, productionModel.sellRate * offlineSellEff, step);
  }
}

function processOfflineEvents(state, runtime, seconds, efficiencyMult, offlineContext) {
  if (state.activeEvent) {
    state.activeEvent.remaining = Math.max(0, state.activeEvent.remaining - seconds);

    if (state.activeEvent.id === 'debt-collector') {
      state.activeEvent.debtTimer = Math.max(0, (state.activeEvent.debtTimer ?? 0) - seconds);
      if ((state.activeEvent.debtTimer ?? 0) <= 0 && !state.activeEvent.settled) {
        applyDebtCollectorSettlement(state);
      }
    }

    if (state.activeEvent.remaining <= 0) {
      endActiveEvent(state, runtime);
      runtime.eventCooldown = randomBetween(28, 52, runtime);
    }
    return;
  }

  runtime.eventCooldown -= seconds;
  if (runtime.eventCooldown > 0) {
    return;
  }

  if (nextRandom(runtime) > efficiencyMult) {
    runtime.eventCooldown = randomBetween(16, 30, runtime);
    return;
  }

  const safeEvents = EVENT_DEFS.filter((event) =>
    isEventEligible(state, event)
    && !event.requiresChoice
    && event.id !== 'silence-protocol'
    && event.id !== 'debt-collector'
  );

  if (!safeEvents.length) {
    runtime.eventCooldown = randomBetween(16, 30, runtime);
    return;
  }

  const weighted = safeEvents.map((event) => ({
    ore: event,
    weight: EVENT_WEIGHTS[event.rarity] ?? 1
  }));
  const event = pickWeighted(weighted, runtime);

  if (event) {
    triggerEvent(state, runtime, event);
    offlineContext.offlineEvents = (offlineContext.offlineEvents ?? 0) + 1;
  } else {
    runtime.eventCooldown = randomBetween(16, 30, runtime);
  }
}

function performMiningAttempts(state, runtime, attempts, source) {
  const availableCapacity = Math.max(0, state.storageCap - state.inventoryLoad);
  if (availableCapacity <= 0) {
    state.notifications.unshift('Storage is full. Raise Storage or Conveyor throughput.');
    return;
  }

  const maxAttempts = Math.min(4500, Math.max(0, Math.floor(attempts)));
  let logged = 0;

  for (let index = 0; index < maxAttempts; index += 1) {
    if (state.inventoryLoad >= state.storageCap) {
      break;
    }

    const drop = resolveMineDrop(state, runtime, source);
    if (!drop) {
      continue;
    }

    const incomingQuantity = Math.max(1, drop.quantity);
    const free = state.storageCap - state.inventoryLoad;
    const quantity = Math.min(free, incomingQuantity);
    if (quantity <= 0) {
      break;
    }

    if (state.activeEvent?.id === 'time-lag-pocket') {
      addEventBufferedOre(runtime, drop, quantity);
    } else {
      addInventory(state, drop, quantity);
      registerContractProgress(state, drop.key, quantity);
      registerDiscovery(state, drop, source);
      state.inventoryLoad += quantity;
    }

    if (logged < 5) {
      appendRecentFind(state, drop, quantity, source);
      logged += 1;
    }
  }
}

function resolveMineDrop(state, runtime, source) {
  const orePool = getCurrentOrePool(state);
  if (!orePool.length) {
    return null;
  }

  const rng = () => nextRandom(runtime);
  const modifiers = buildRarityModifiers(state);
  const eventKey = getActiveEventKey(state);

  const luckyStrike = rollLuckyStrike({
    eventKey,
    cosmicMagnetismLevel: 0,
    tiers: DEFAULT_RARITY_TIERS,
    luckyStrikeConfig: DEFAULT_LUCKY_STRIKE,
    rng,
  });

  let tierName;
  let tierSource = 'prd';

  if (luckyStrike.triggered && luckyStrike.rarity) {
    tierName = luckyStrike.rarity;
    tierSource = 'lucky_strike';
    state.prdCounters = createInitialRarityCounters(DEFAULT_RARITY_TIERS, 1);
  } else {
    const rarityResult = rollRarity({
      counters: state.prdCounters,
      modifiers,
      tiers: DEFAULT_RARITY_TIERS,
      rng,
    });
    tierName = rarityResult.rarity;
    tierSource = rarityResult.source;
    state.prdCounters = rarityResult.counters;
  }

  const oreRarity = TIER_TO_ORE_RARITY[tierName] ?? 'common';
  const tierPriceMult = TIER_PRICE_MULTIPLIER[tierName] ?? 1;

  const matchingPool = orePool.filter((entry) => normalizeRarity(entry.rarity) === oreRarity);
  const candidatePool = matchingPool.length > 0 ? matchingPool : orePool;

  const ore = pickWeighted(
    candidatePool.map((entry) => ({
      ore: entry,
      weight: Math.max(0.0001, (entry.veinWeight ?? 1))
    })),
    runtime
  );

  if (!ore) {
    return null;
  }

  const quantityResult = calculateOreQuantity({
    clickPower: source === 'manual' ? computeProductionModel(state).orePerClick : 0,
    comboCount: state.comboCount,
    eventKey,
    rarity: tierName,
    tiers: DEFAULT_RARITY_TIERS,
  });

  if (source === 'manual') {
    if (state.lastDropTier === tierName) {
      state.comboCount = Math.min(100, state.comboCount + 1);
    } else {
      state.comboCount = 0;
    }
  }
  state.lastDropTier = tierName;

  let rarity = oreRarity;
  let quantity = quantityResult.quantity;
  let key = ore.key;
  let name = ore.name;
  let basePrice = Math.round(ore.basePrice * tierPriceMult);

  if (state.activeEvent?.id === 'furnace-marriage' && (rarity === 'common' || rarity === 'uncommon')) {
    const promotedRarity = rarity === 'common' ? 'uncommon' : 'rare';
    rarity = promotedRarity;
    basePrice = Math.round(basePrice * 1.6);
    name = `Fused ${name}`;
    key = `${key}-fused-${promotedRarity}`;
  }

  if (state.activeEvent?.id === 'glitch-fault') {
    const context = ensureEventContext(runtime);
    if (!context.glitchKey) {
      context.glitchKey = key;
    }

    if (context.glitchKey === key) {
      quantity += 1;
      context.glitchCreated = (context.glitchCreated ?? 0) + 1;
    }
  }

  if (state.activeEvent?.id === 'surveyor-ghostline' && source === 'manual') {
    quantity += 1;
  }

  if (state.activeEvent?.id === 'echo-quarry' && source === 'manual') {
    quantity += 1;
  }

  return {
    key,
    name,
    rarity,
    tierName,
    tierSource,
    luckyStrike: luckyStrike.triggered,
    quantity,
    basePrice
  };
}

function buildRarityModifiers(state) {
  return {
    scannerLevel: getUpgradeLevel(state, 'ore-scanner'),
    fortuneLevel: getUpgradeLevel(state, 'fortune-blessing'),
    depth: state.currentGlobalDepth,
    eventKey: getActiveEventKey(state),
    uniqueResourcesDiscovered: state.discoveries.length,
    comboCount: state.comboCount,
    biome: state.selectedBiomeId,
  };
}

function getActiveEventKey(state) {
  if (!state.activeEvent) return 'normal';
  switch (state.activeEvent.id) {
    case 'surveyor-ghostline': return 'rich_vein';
    case 'singularity-rehearsal': return 'meteor';
    case 'meteor-script': return state.activeEvent.choice === 'correct-rune' ? 'gold_rush' : 'normal';
    default: return 'normal';
  }
}

function getCurrentOrePool(state) {
  const biome = getSelectedBiome(state);
  const stratum = resolveStratum(biome, state.localDepth);
  const localPool = Array.isArray(stratum?.ores) && stratum.ores.length ? stratum.ores : biome.ores;

  if (state.activeEvent?.id !== 'moonwell-breach') {
    return localPool;
  }

  const currentIndex = state.biomes.findIndex((entry) => entry.id === biome.id);
  const nextBiome = state.biomes[currentIndex + 1];

  if (!nextBiome) {
    return localPool;
  }

  const nextStratum = resolveStratum(nextBiome, state.biomeDepths[nextBiome.id] ?? 0);
  const nextPool = Array.isArray(nextStratum?.ores) && nextStratum.ores.length ? nextStratum.ores : nextBiome.ores;
  const diluted = nextPool.map((entry) => ({
    ...entry,
    veinWeight: (entry.veinWeight ?? 1) * 0.55
  }));

  return [...localPool, ...diluted];
}

function getRarityWeights(state) {
  const modifier = getCombinedRarityModifier(buildRarityModifiers(state));

  const weights = {};

  for (const rarity of RARITY_ORDER) {
    const base = RARITY_WEIGHT[rarity] ?? 1;

    if (rarity === 'common') {
      weights[rarity] = base / Math.pow(modifier, 0.56);
    } else if (rarity === 'uncommon') {
      weights[rarity] = base * Math.pow(modifier, 0.22);
    } else if (rarity === 'rare') {
      weights[rarity] = base * Math.pow(modifier, 0.9);
    } else if (rarity === 'epic') {
      weights[rarity] = base * Math.pow(modifier, 1.22);
    } else if (rarity === 'legendary') {
      weights[rarity] = base * Math.pow(modifier, 1.54);
    } else {
      weights[rarity] = base * Math.pow(modifier, 1.9);
    }
  }

  return weights;
}

function processAutoSell(state, runtime, sellRate, seconds) {
  const rawCarry = runtime.autoSellCarry + (sellRate * seconds);
  const totalToSell = Math.floor(rawCarry);
  runtime.autoSellCarry = clampNumber(rawCarry - totalToSell, 0, sellRate * 10);

  if (totalToSell <= 0) {
    return;
  }

  let remaining = totalToSell;
  const sorted = [...state.inventory].sort((left, right) => left.marketPrice - right.marketPrice);

  for (const item of sorted) {
    if (remaining <= 0) {
      break;
    }

    const reserved = getReservedQuantity(state, item.key);
    const available = Math.max(0, item.quantity - reserved);
    if (available <= 0) {
      continue;
    }

    const sold = Math.min(available, remaining);
    remaining -= sold;
    item.quantity -= sold;

    const gain = sold * item.marketPrice;
    state.credits += gain;
    state.lifetimeCredits += gain;
  }

  state.inventory = state.inventory.filter((item) => item.quantity > 0);
  state.inventoryLoad = computeInventoryLoad(state.inventory);
}

function sellInventory(state, manualSell = false) {
  if (!state.inventory.length) {
    state.notifications.unshift('No ore available for sale.');
    return;
  }

  let soldUnits = 0;
  let totalGain = 0;

  for (const item of state.inventory) {
    const reserved = getReservedQuantity(state, item.key);
    const sellable = Math.max(0, item.quantity - reserved);
    if (sellable <= 0) {
      continue;
    }

    item.quantity -= sellable;
    soldUnits += sellable;
    totalGain += sellable * item.marketPrice;
  }

  state.inventory = state.inventory.filter((item) => item.quantity > 0);
  state.inventoryLoad = computeInventoryLoad(state.inventory);

  if (totalGain <= 0) {
    state.notifications.unshift('Only protected contract or museum stock is in hold.');
    return;
  }

  state.credits += totalGain;
  state.lifetimeCredits += totalGain;

  if (manualSell) {
    state.notifications.unshift(`Sold ${soldUnits.toLocaleString('en-US')} units for ${formatCredits(totalGain)}.`);
  }
}

function startRefineryBatch(state) {
  const labLevel = getUpgradeLevel(state, 'geology-lab');
  const recipe = pickRefineryRecipe(state.inventory);

  if (!recipe) {
    state.notifications.unshift('Need enough low-tier ore to start a refinery batch.');
    return;
  }

  const sourceItems = state.inventory.filter((item) => item.rarity === recipe.sourceRarity);
  if (!sourceItems.length) {
    return;
  }

  let totalAvailable = 0;
  for (const item of sourceItems) {
    const reserved = getReservedQuantity(state, item.key);
    totalAvailable += Math.max(0, item.quantity - reserved);
  }

  if (totalAvailable < recipe.inputUnits) {
    state.notifications.unshift('Not enough non-reserved ore for this refinery recipe.');
    return;
  }

  let toConsume = recipe.inputUnits;
  for (const item of sourceItems) {
    if (toConsume <= 0) break;
    const reserved = getReservedQuantity(state, item.key);
    const available = Math.max(0, item.quantity - reserved);
    const consumed = Math.min(available, toConsume);
    item.quantity -= consumed;
    toConsume -= consumed;
  }
  state.inventoryLoad = computeInventoryLoad(state.inventory);
  const duration = Math.max(14, recipe.baseDuration / (1 + (0.18 * labLevel)));

  state.refineryQueue.push({
    id: `refinery-${Date.now()}-${state.refineryQueue.length}`,
    sourceRarity: recipe.sourceRarity,
    outputRarity: recipe.outputRarity,
    outputName: recipe.outputName,
    inputUnits: recipe.inputUnits,
    outputUnits: recipe.outputUnits,
    remaining: duration
  });

  state.notifications.unshift(`Refinery batch started: ${recipe.outputName}.`);
}

function processRefinery(state, seconds) {
  if (!state.refineryQueue.length) {
    return;
  }

  const refineryLevel = getUpgradeLevel(state, 'refinery');
  const speed = 1 + (0.1 * refineryLevel);
  const completed = [];

  state.refineryQueue = state.refineryQueue
    .map((batch) => ({
      ...batch,
      remaining: batch.remaining - (seconds * speed)
    }))
    .filter((batch) => {
      if (batch.remaining > 0) {
        return true;
      }

      completed.push(batch);
      return false;
    });

  for (const batch of completed) {
    const drop = {
      key: slugify(`refined-${batch.outputName}`),
      name: batch.outputName,
      rarity: batch.outputRarity,
      quantity: batch.outputUnits,
      basePrice: 220 * (RARITY_MULTIPLIER[batch.outputRarity] ?? 1)
    };

    const free = Math.max(0, state.storageCap - state.inventoryLoad);
    if (free <= 0) {
      state.notifications.unshift(`Refinery completed ${batch.outputName}, but storage was full. Batch was lost.`);
      continue;
    }

    const quantity = Math.min(free, drop.quantity);
    addInventory(state, drop, quantity);
    state.inventoryLoad += quantity;
    state.notifications.unshift(`Refinery completed: ${quantity}x ${batch.outputName}.`);
  }

  state.inventoryLoad = computeInventoryLoad(state.inventory);
}

function processEvents(state, runtime, seconds) {
  if (state.activeEvent) {
    state.activeEvent.remaining = Math.max(0, state.activeEvent.remaining - seconds);

    if (state.activeEvent.id === 'debt-collector') {
      state.activeEvent.debtTimer = Math.max(0, (state.activeEvent.debtTimer ?? 0) - seconds);

      if ((state.activeEvent.debtTimer ?? 0) <= 0 && !state.activeEvent.settled) {
        applyDebtCollectorSettlement(state);
      }
    }

    if (state.activeEvent.remaining <= 0) {
      endActiveEvent(state, runtime);
      runtime.eventCooldown = randomBetween(28, 52, runtime);
    }

    return;
  }

  runtime.eventCooldown -= seconds;
  if (runtime.eventCooldown > 0) {
    return;
  }

  const event = pickEvent(state, runtime);
  if (!event) {
    runtime.eventCooldown = randomBetween(16, 30, runtime);
    return;
  }

  triggerEvent(state, runtime, event);
}

function triggerEvent(state, runtime, event) {
  const detail = {
    id: event.id,
    name: event.name,
    rarity: event.rarity,
    family: event.family,
    description: event.description,
    remaining: event.duration ?? 0,
    choice: null
  };

  if (event.id === 'reverse-cave-in') {
    const burst = Math.round(12 + (state.workers.headcount * 0.2));
    performMiningAttempts(state, runtime, burst, 'event');
    incrementDepth(state, 2800);
    state.notifications.unshift('Event: Reverse Cave-In delivered a deep-zone burst.');
    state.eventHistory.unshift({
      id: `${event.id}-${state.now}`,
      name: event.name,
      outcome: `Recovered burst ore and ${formatMeters(2800)} depth jump.`
    });
    runtime.eventCooldown = randomBetween(24, 46, runtime);
    return;
  }

  if (event.id === 'debt-collector') {
    const loan = Math.round(320 + (state.currentGlobalDepth / 180));
    state.credits += loan;
    state.lifetimeCredits += loan;
    detail.loan = loan;
    detail.debtTimer = event.duration ?? 120;
    detail.target = 30 + getUpgradeLevel(state, 'workers');
    detail.targetOre = getSelectedBiome(state).signatureOre ?? 'Contract Ore';
    detail.targetOreKey = getSelectedBiome(state).ores[0]?.key ?? '';
    detail.progress = 0;
    detail.settled = false;
    state.notifications.unshift(`Event: Debt Collector offered ${formatCredits(loan)}. Repayment contract started.`);
  } else if (event.id === 'gravity-lease') {
    detail.options = [
      {
        id: 'depth-for-rarity',
        label: 'Trade depth for rarity',
        summary: 'Lose depth now, gain strong rarity pressure.'
      },
      {
        id: 'rarity-for-depth',
        label: 'Trade rarity for depth',
        summary: 'Gain immediate depth lunge, weaker drop quality.'
      },
      {
        id: 'balanced-lease',
        label: 'Keep balance',
        summary: 'Small boost to both axes without a hard trade.'
      }
    ];
  } else if (event.id === 'meteor-script') {
    const correct = ['rune-a', 'rune-b', 'rune-c'][Math.floor(nextRandom(runtime) * 3)];
    detail.correctRune = correct;
    detail.options = [
      { id: 'rune-a', label: 'Rune A', summary: 'A stable sequence etched in fire.' },
      { id: 'rune-b', label: 'Rune B', summary: 'A risky sequence pulsing with heat.' },
      { id: 'rune-c', label: 'Rune C', summary: 'A chaotic sequence with jackpot variance.' }
    ];
  }

  if (event.id === 'time-lag-pocket') {
    const context = ensureEventContext(runtime);
    context.timeLagBuffer = {};
    context.timeLagDepthStart = state.currentGlobalDepth;
  }

  state.activeEvent = detail;
  state.notifications.unshift(`Event: ${event.name} is active.`);
}

function chooseEventOption(state, runtime, optionId) {
  if (!state.activeEvent) {
    return;
  }

  if (state.activeEvent.id === 'gravity-lease') {
    if (optionId === 'depth-for-rarity') {
      const loss = Math.round(state.localDepth * 0.08);
      state.localDepth = Math.max(0, state.localDepth - loss);
      state.biomeDepths[state.selectedBiomeId] = state.localDepth;
      state.activeEvent.choice = 'depth-for-rarity';
      state.notifications.unshift(`Gravity Lease: traded ${formatMeters(loss)} for rarity pressure.`);
    } else if (optionId === 'rarity-for-depth') {
      const gain = 4800 + Math.round(getUpgradeLevel(state, 'dynamite') * 380);
      incrementDepth(state, gain);
      state.activeEvent.choice = 'rarity-for-depth';
      state.notifications.unshift(`Gravity Lease: depth lunge of ${formatMeters(gain)} secured.`);
    } else {
      const gain = 2200;
      incrementDepth(state, gain);
      state.activeEvent.choice = 'balanced-lease';
      state.notifications.unshift('Gravity Lease: balanced profile selected.');
    }

    state.activeEvent.options = [];
    return;
  }

  if (state.activeEvent.id === 'meteor-script') {
    const correct = state.activeEvent.correctRune;
    const isCorrect = optionId === correct;
    state.activeEvent.choice = isCorrect ? 'correct-rune' : 'wrong-rune';

    if (isCorrect) {
      const jackpotCredits = Math.round(680 + (state.currentGlobalDepth / 90));
      state.credits += jackpotCredits;
      state.lifetimeCredits += jackpotCredits;
      state.notifications.unshift(`Meteor Script solved. Jackpot secured: ${formatCredits(jackpotCredits)}.`);
      registerSpecialDiscovery(state, 'Celestial Fragment', 'legendary', 'event');
    } else {
      state.notifications.unshift('Meteor Script misread. Minor haul only.');
      performMiningAttempts(state, runtime, 6, 'event');
    }

    state.activeEvent.options = [];
  }
}

function endActiveEvent(state, runtime) {
  if (!state.activeEvent) {
    return;
  }

  const { id, name } = state.activeEvent;

  if (id === 'time-lag-pocket') {
    const context = ensureEventContext(runtime);
    const buffer = context.timeLagBuffer ?? {};
    const depthGain = Math.max(0, state.currentGlobalDepth - (context.timeLagDepthStart ?? state.currentGlobalDepth));
    const depthMultiplier = 1 + Math.min(2, depthGain / 6000);

    for (const buffered of Object.values(buffer)) {
      const quantity = Math.max(1, Math.floor(buffered.quantity * depthMultiplier));
      const free = Math.max(0, state.storageCap - state.inventoryLoad);
      if (free <= 0) {
        break;
      }

      const added = Math.min(free, quantity);
      addInventory(state, buffered, added);
      state.inventoryLoad += added;
      registerContractProgress(state, buffered.key, added);
      registerDiscovery(state, buffered, 'event');
    }

    state.notifications.unshift('Time-Lag Pocket collapsed. Buffered ore delivered.');
    context.timeLagBuffer = {};
  }

  if (id === 'glitch-fault') {
    const context = ensureEventContext(runtime);
    const key = context.glitchKey;
    if (key) {
      const item = state.inventory.find((entry) => entry.key === key);
      if (item) {
        const decay = Math.floor(item.quantity * 0.35);
        item.quantity = Math.max(0, item.quantity - decay);
        state.notifications.unshift(`Glitch Fault ended. ${decay.toLocaleString('en-US')} duplicated units decayed.`);
      }
    }
    context.glitchKey = '';
  }

  if (id === 'debt-collector' && !state.activeEvent.settled) {
    applyDebtCollectorSettlement(state);
  }

  state.eventHistory.unshift({
    id: `${id}-${state.now}`,
    name,
    outcome: 'Event window resolved.'
  });

  state.activeEvent = null;
  state.inventoryLoad = computeInventoryLoad(state.inventory);
}

function applyDebtCollectorSettlement(state) {
  if (!state.activeEvent || state.activeEvent.id !== 'debt-collector') {
    return;
  }

  const target = state.activeEvent.target ?? 0;
  const delivered = Math.min(target, state.activeEvent.progress ?? 0);

  if (delivered >= target) {
    const bonus = Math.round((state.activeEvent.loan ?? 0) * 0.9);
    state.credits += bonus;
    state.lifetimeCredits += bonus;
    state.workers.morale = clampNumber(state.workers.morale + 0.05, 0, 1);
    state.notifications.unshift(`Debt Collector settled. Bonus paid: ${formatCredits(bonus)}.`);
  } else {
    const shortfall = Math.max(0, target - delivered);
    const penalty = Math.round((state.activeEvent.loan ?? 0) * (0.35 + (shortfall / Math.max(target, 1)) * 0.5));
    state.credits = Math.max(0, state.credits - penalty);
    state.workers.morale = clampNumber(state.workers.morale - 0.08, 0, 1);
    state.workers.discipline = clampNumber(state.workers.discipline - 0.1, 0, 1);
    state.notifications.unshift(`Debt Collector defaulted. Penalty paid: ${formatCredits(penalty)}.`);
  }

  state.activeEvent.settled = true;
}

function processContracts(state, runtime, seconds) {
  runtime.contractTimer -= seconds;

  state.contracts.forEach((contract) => {
    if (contract.completed) {
      return;
    }

    contract.remaining = Math.max(0, contract.remaining - seconds);
    contract.claimable = contract.progress >= contract.target;
    contract.status = contract.claimable ? 'ready' : 'active';

    if (contract.remaining <= 0 && !contract.claimable) {
      contract.expired = true;
    }
  });

  const expired = state.contracts.filter((contract) => contract.expired);
  if (expired.length > 0) {
    const penalty = 18 * expired.length;
    state.workers.discipline = clampNumber(state.workers.discipline - (0.03 * expired.length), 0, 1);
    state.workers.morale = clampNumber(state.workers.morale - (0.02 * expired.length), 0, 1);
    state.credits = Math.max(0, state.credits - penalty);
    state.notifications.unshift(`Contract expirations triggered ${formatCredits(penalty)} in penalties.`);
  }

  state.contracts = state.contracts.filter((contract) => !contract.expired);

  if (runtime.contractTimer <= 0) {
    runtime.contractTimer = CONTRACT_REFRESH_SECONDS;
    while (state.contracts.length < 3) {
      state.contracts.push(createContract(state, runtime));
    }
  }
}

function createContract(state, runtime) {
  const unlockedBiomes = state.biomes.filter((biome) => biome.unlocked);
  const orePool = unlockedBiomes.flatMap((biome) =>
    biome.ores.map((ore) => ({ biome, ore }))
  );

  if (!orePool.length) {
    return {
      id: `contract-${runtime.nextContractId++}`,
      title: 'Fallback Supply Run',
      subtitle: 'No ore pool available yet.',
      targetOreKey: '',
      targetOreName: 'Fallback Ore',
      target: 8,
      progress: 0,
      reward: 120,
      remaining: 180,
      claimable: false,
      completed: false,
      status: 'active'
    };
  }

  const selected = orePool[Math.floor(nextRandom(runtime) * orePool.length)];
  const rarity = normalizeRarity(selected.ore.rarity);
  const rarityPressure = RARITY_MULTIPLIER[rarity] ?? 1;
  const target = Math.round(8 + (rarityPressure * 4) + nextRandom(runtime) * 6);
  const reward = Math.round(selected.ore.basePrice * target * (1.75 + rarityPressure * 0.35));
  const deadline = Math.round(120 + nextRandom(runtime) * 120);

  return {
    id: `contract-${runtime.nextContractId++}`,
    title: `${selected.ore.name} Delivery`,
    subtitle: `${selected.biome.name} board requests ${selected.ore.rarity} output.`,
    targetOreKey: selected.ore.key,
    targetOreName: selected.ore.name,
    target,
    progress: 0,
    reward,
    remaining: deadline,
    claimable: false,
    completed: false,
    status: 'active'
  };
}

function claimContract(state, runtime, contractId) {
  const contract = state.contracts.find((entry) => entry.id === contractId);
  if (!contract || contract.completed || !contract.claimable) {
    return;
  }

  contract.completed = true;
  contract.status = 'completed';
  state.credits += contract.reward;
  state.lifetimeCredits += contract.reward;
  state.workers.morale = clampNumber(state.workers.morale + 0.03, 0, 1);
  state.notifications.unshift(`Contract completed: ${contract.title} paid ${formatCredits(contract.reward)}.`);

  state.contracts = state.contracts.filter((entry) => !entry.completed);
  while (state.contracts.length < 3) {
    state.contracts.push(createContract(state, runtime));
  }
}

function rerollContracts(state, runtime) {
  const fee = Math.round(120 + (state.contracts.length * 45));
  if (state.credits < fee) {
    state.notifications.unshift(`Need ${formatCredits(fee)} to reroll contract board.`);
    return;
  }

  state.credits -= fee;
  state.contracts = [];
  while (state.contracts.length < 3) {
    state.contracts.push(createContract(state, runtime));
  }
  state.notifications.unshift(`Contract board rerolled for ${formatCredits(fee)}.`);
}

function registerContractProgress(state, oreKey, quantity) {
  state.contracts.forEach((contract) => {
    if (contract.completed || contract.targetOreKey !== oreKey) {
      return;
    }

    contract.progress = Math.min(contract.target, contract.progress + quantity);
    contract.claimable = contract.progress >= contract.target;
    contract.status = contract.claimable ? 'ready' : 'active';
  });

  if (state.activeEvent?.id === 'debt-collector' && state.activeEvent.targetOreKey === oreKey) {
    state.activeEvent.progress = Math.min(
      state.activeEvent.target ?? 0,
      (state.activeEvent.progress ?? 0) + quantity
    );
  }
}

function processIncidents(state, runtime, seconds) {
  runtime.incidentTimer -= seconds;

  state.incidents = state.incidents.map((incident) => ({
    ...incident,
    remaining: Math.max(0, incident.remaining - seconds)
  }));

  const expired = state.incidents.filter((i) => !i.resolved && i.remaining <= 0);
  for (const incident of expired) {
    const sev = incident.severity ?? 1;
    state.workers.morale = clampNumber(state.workers.morale - (0.05 * sev), 0, 1);
    state.workers.discipline = clampNumber(state.workers.discipline - (0.06 * sev), 0, 1);
    state.workers.safetyRating = clampNumber(state.workers.safetyRating - (0.04 * sev), 0, 1);
    state.credits = Math.max(0, state.credits - (12 * sev));
    state.notifications.unshift(`Incident "${incident.name}" expired unresolved. Safety and morale suffered.`);
    incident.resolved = true;
  }

  if (runtime.incidentTimer > 0) {
    return;
  }

  runtime.incidentTimer = INCIDENT_CHECK_SECONDS;
  const unresolved = state.incidents.filter((incident) => !incident.resolved).length;
  if (unresolved >= 4) {
    return;
  }

  const hazardTier = computeHazardTier(state);
  const fatigue = state.workers.fatigue;
  const safety = state.workers.safetyRating;
  const headcountPressure = 1 + (state.workers.headcount / 220);
  const chance = 0.008 * (1 + hazardTier * 1.8) * (1 + fatigue * 1.4) * (1.25 - safety * 0.45) * headcountPressure;

  if (nextRandom(runtime) >= chance) {
    return;
  }

  const picked = INCIDENT_DEFS[Math.floor(nextRandom(runtime) * INCIDENT_DEFS.length)];
  const severity = clampNumber(1 + Math.floor(nextRandom(runtime) * 3 + hazardTier), 1, 4);
  const responseCost = Math.round(90 * severity * (1 + state.workers.headcount / 140));

  state.incidents.unshift({
    id: `incident-${runtime.nextIncidentId++}`,
    type: picked.id,
    title: picked.name,
    description: picked.description,
    severity,
    responseCost,
    productionPenalty: picked.productionPenalty * severity,
    disciplinePenalty: picked.disciplinePenalty * severity,
    remaining: 160 + (severity * 25),
    resolved: false
  });

  state.workers.morale = clampNumber(state.workers.morale - (0.02 * severity), 0, 1);
  state.workers.discipline = clampNumber(state.workers.discipline - (0.018 * severity), 0, 1);
  state.notifications.unshift(`Incident: ${picked.name} (Severity ${severity}) requires response.`);
}

function resolveIncident(state, incidentId, resolution) {
  const incident = state.incidents.find((entry) => entry.id === incidentId && !entry.resolved);
  if (!incident) {
    return;
  }

  if (resolution === 'dispatch') {
    if (state.credits < incident.responseCost) {
      state.notifications.unshift(`Need ${formatCredits(incident.responseCost)} to dispatch rescue.`);
      return;
    }

    state.credits -= incident.responseCost;
    state.workers.morale = clampNumber(state.workers.morale + 0.03, 0, 1);
    state.workers.discipline = clampNumber(state.workers.discipline + 0.025, 0, 1);
    state.notifications.unshift('Incident resolved with rescue dispatch.');
  } else if (resolution === 'triage') {
    const triageCost = Math.round(incident.responseCost * 0.5);
    if (state.credits < triageCost) {
      state.notifications.unshift(`Need ${formatCredits(triageCost)} for triage response.`);
      return;
    }

    state.credits -= triageCost;
    state.workers.morale = clampNumber(state.workers.morale - 0.01, 0, 1);
    state.notifications.unshift('Incident triaged. Some productivity loss remains.');
  } else {
    state.workers.morale = clampNumber(state.workers.morale - 0.04, 0, 1);
    state.workers.discipline = clampNumber(state.workers.discipline - 0.05, 0, 1);
    state.notifications.unshift('Incident losses accepted. Morale and discipline dropped.');
  }

  incident.resolved = true;
  incident.remaining = 0;
}

function processPayroll(state, runtime, seconds) {
  runtime.payrollTimer -= seconds;
  if (runtime.payrollTimer > 0) {
    return;
  }

  runtime.payrollTimer += PAYROLL_INTERVAL_SECONDS;

  const profile = SHIFT_PROFILES[state.shiftPolicy] ?? SHIFT_PROFILES.day;
  const hazardTier = computeHazardTier(state);
  const headcount = state.workers.headcount;
  const training = getSupportLevel(state, 'training-hall');
  const activeContracts = state.contracts.filter((contract) => !contract.completed).length;
  const unresolvedIncidents = state.incidents.filter((incident) => !incident.resolved).length;

  const basePayroll = headcount * (1.55 + (0.08 * training));
  const hazardPay = headcount * hazardTier * 0.74;
  const overtimePremium = headcount * Math.max(0, profile.payrollMultiplier - 1) * 0.82;
  const contractBonus = state.shiftPolicy === 'contract' ? activeContracts * 4.5 : 0;
  const settlementCost = unresolvedIncidents * 12 + Math.max(0, 0.45 - state.workers.discipline) * headcount * 0.8;
  const totalPayroll = Math.round(basePayroll + hazardPay + overtimePremium + contractBonus + settlementCost);

  state.workers.payrollLoad = totalPayroll;

  if (state.credits >= totalPayroll) {
    state.credits -= totalPayroll;
    state.workers.morale = clampNumber(state.workers.morale + 0.01, 0, 1);
    return;
  }

  const shortage = totalPayroll - state.credits;
  state.credits = 0;
  state.debt += shortage;
  state.workers.morale = clampNumber(state.workers.morale - 0.06, 0, 1);
  state.workers.discipline = clampNumber(state.workers.discipline - 0.05, 0, 1);
  state.workers.fatigue = clampNumber(state.workers.fatigue + 0.04, 0, 1);
  state.notifications.unshift(`Payroll shortfall: ${formatCredits(shortage)}. Workforce stability dropped.`);
}

function updateWorkerVitals(state, seconds) {
  const profile = SHIFT_PROFILES[state.shiftPolicy] ?? SHIFT_PROFILES.day;
  const hazard = computeHazardTier(state);

  const mess = getSupportLevel(state, 'mess-hall');
  const med = getSupportLevel(state, 'medical-bay');
  const safetyOffice = getSupportLevel(state, 'safety-office');
  const housingPressure = Math.max(0, 1 - (state.workers.housingCapacity / Math.max(state.workers.headcount, 1)));
  const supportPressure = Math.max(0, 1 - (state.workers.supportCapacity / Math.max(state.workers.headcount, 1)));

  state.workers.morale = clampNumber(
    state.workers.morale
      + ((profile.moraleDelta + (mess * 0.00005) - (hazard * 0.00035) - (housingPressure * 0.0005)) * seconds),
    0,
    1
  );
  state.workers.fatigue = clampNumber(
    state.workers.fatigue
      + ((profile.fatigueDelta + (hazard * 0.00035) - (mess * 0.00004) - (med * 0.00003)) * seconds),
    0,
    1
  );
  state.workers.discipline = clampNumber(
    state.workers.discipline
      + ((profile.disciplineDelta + (safetyOffice * 0.00003) - (supportPressure * 0.00042) - (housingPressure * 0.00022)) * seconds),
    0,
    1
  );
  state.workers.safetyRating = clampNumber(
    state.workers.safetyRating
      + (((safetyOffice * 0.00004) - (hazard * 0.00025) - (state.workers.fatigue * 0.00018)) * seconds),
    0,
    1
  );

  if (state.workers.contractorDuration > 0) {
    state.workers.contractorDuration = Math.max(0, state.workers.contractorDuration - seconds);
    if (state.workers.contractorDuration <= 0) {
      state.workers.temporaryWorkers = 0;
      state.notifications.unshift('Temporary contractors rotated out.');
    }
  }
}

function updateMineState(state, seconds) {
  const profile = SHIFT_PROFILES[state.shiftPolicy] ?? SHIFT_PROFILES.day;
  const extraction = EXTRACTION_POLICIES[state.extractionMode] ?? EXTRACTION_POLICIES.balanced;
  const hazardTier = computeHazardTier(state);
  const vent = getUpgradeLevel(state, 'ventilation');
  const light = getUpgradeLevel(state, 'lighting');
  const stabilizationCrew = state.crews.stabilization ?? 0.16;

  const eqPull = 0.00015;
  state.mineState.heat = clampNumber(
    state.mineState.heat + (((0.00018 * profile.productionMultiplier) + extraction.hazardDelta + (hazardTier * 0.00018) - (vent * 0.00008) + ((0.35 - state.mineState.heat) * eqPull)) * seconds),
    0,
    1
  );
  state.mineState.pressure = clampNumber(
    state.mineState.pressure + (((0.00016 * profile.productionMultiplier) + (hazardTier * 0.00014) - (stabilizationCrew * 0.0003) + ((0.32 - state.mineState.pressure) * eqPull)) * seconds),
    0,
    1
  );
  state.mineState.air = clampNumber(
    state.mineState.air + (((vent * 0.00012) - (profile.productionMultiplier * 0.00013) - (hazardTier * 0.00008) + ((0.80 - state.mineState.air) * eqPull)) * seconds),
    0,
    1
  );
  state.mineState.light = clampNumber(
    state.mineState.light + (((light * 0.00014) - (hazardTier * 0.00005) + ((0.65 - state.mineState.light) * eqPull)) * seconds),
    0,
    1
  );
  state.mineState.flow = clampNumber(
    state.mineState.flow + ((0.00004 - (hazardTier * 0.00006) + ((0.55 - state.mineState.flow) * eqPull)) * seconds),
    0,
    1
  );
  state.mineState.charge = clampNumber(
    state.mineState.charge + (((hazardTier * 0.00007) - 0.00005 + ((0.40 - state.mineState.charge) * eqPull)) * seconds),
    0,
    1
  );
  state.mineState.integrity = clampNumber(
    state.mineState.integrity + (((stabilizationCrew * 0.0002) - (profile.productionMultiplier * 0.00016) - (hazardTier * 0.00007) + ((0.78 - state.mineState.integrity) * eqPull)) * seconds),
    0,
    1
  );
  state.mineState.specimenIntegrity = clampNumber(
    state.mineState.specimenIntegrity + ((((state.extractionMode === 'precise') ? 0.00018 : -0.00008) + (getSupportLevel(state, 'training-hall') * 0.00002) + ((0.75 - state.mineState.specimenIntegrity) * eqPull)) * seconds),
    0,
    1
  );
  state.mineState.routeStability = clampNumber(
    state.mineState.routeStability + (((state.crews.hauler * 0.00018) + (getSupportLevel(state, 'transport-hub') * 0.00003) - (hazardTier * 0.00016) + ((0.76 - state.mineState.routeStability) * eqPull)) * seconds),
    0,
    1
  );
}

function computeProductionModel(state) {
  const pickaxe = getUpgradeLevel(state, 'pickaxe');
  const drill = getUpgradeLevel(state, 'auto-drill');
  const workersLevel = getUpgradeLevel(state, 'workers');
  const drones = getUpgradeLevel(state, 'drone-fleet');
  const storage = getUpgradeLevel(state, 'storage');
  const conveyor = getUpgradeLevel(state, 'conveyor');
  const ventilation = getUpgradeLevel(state, 'ventilation');
  const lift = getUpgradeLevel(state, 'lift-speed');
  const refinery = getUpgradeLevel(state, 'refinery');
  const lighting = getUpgradeLevel(state, 'lighting');
  const dynamite = getUpgradeLevel(state, 'dynamite');

  const orePerClick = 1 + (0.75 * pickaxe) + (0.04 * Math.pow(pickaxe, 2));
  const rDrill = (0.8 * drill) + (0.06 * Math.pow(drill, 1.55));

  const rWorkersRaw = ((0.45 * workersLevel) + (0.04 * Math.pow(workersLevel, 1.45))) * (1 + (0.018 * workersLevel));
  const supportScore = 6 + (1.2 * storage) + (1.0 * conveyor) + (0.8 * ventilation) + (0.6 * lift);
  const supportEff = Math.min(1, Math.pow(supportScore / Math.max(10, workersLevel + 10), 0.55));
  const workforceEff = state.workers.headcount > 0 ? state.workers.effectiveWorkforce / state.workers.headcount : 1;
  const rWorkers = rWorkersRaw * supportEff * workforceEff;

  const droneSlots = 1 + Math.floor(drones / 5);
  const biomeEfficiency = computeBiomeEfficiency(state, lighting, ventilation);
  const rDrones = droneSlots * (1.5 + (0.25 * drones) + (0.03 * Math.pow(drones, 1.3))) * biomeEfficiency;

  const shift = SHIFT_PROFILES[state.shiftPolicy] ?? SHIFT_PROFILES.day;
  const extraction = EXTRACTION_POLICIES[state.extractionMode] ?? EXTRACTION_POLICIES.balanced;
  const incidentPenalty = state.incidents
    .filter((incident) => !incident.resolved)
    .reduce((sum, incident) => sum + incident.productionPenalty, 0);
  const eventProduction = getEventProductionModifier(state);

  const passiveOreRate = Math.max(
    0.01,
    (rDrill + rWorkers + rDrones)
      * shift.productionMultiplier
      * extraction.productionMultiplier
      * eventProduction
      * Math.max(0.15, 1 - incidentPenalty)
  );

  const storageCap = Math.max(80, Math.round(100 + (35 * storage) + (14 * Math.pow(storage, 1.45))));
  const sellRate = conveyor <= 0
    ? 0
    : Math.max(0.8, (2.5 + (1.4 * (conveyor - 1)) + (0.16 * Math.pow(conveyor - 1, 1.5))) * getEventSellModifier(state));

  const liftSpeed = 1 + (0.22 * lift) + (0.025 * Math.pow(lift, 1.25));
  const transferDelay = state.currentGlobalDepth / (120 * Math.max(1, liftSpeed));
  const transferEff = 1 / (1 + (transferDelay / 160));

  const averageOreValue = getAverageOreValue(state);
  const refineryMult = Math.pow(1.1, refinery);
  const depthRate = (
    ((0.5 * drill) + (0.02 * Math.pow(drill, 1.3)))
    + ((0.3 * dynamite) + (0.01 * Math.pow(dynamite, 1.2)))
  ) * shift.productionMultiplier * extraction.depthMultiplier * Math.max(0.3, transferEff);

  return {
    orePerClick,
    passiveOreRate,
    sellRate,
    storageCap,
    transferDelay,
    averageOreValue,
    refineryMult,
    depthRate
  };
}

function computeDepthGain(state, seconds) {
  const model = computeProductionModel(state);
  const autonomous = getUpgradeLevel(state, 'autonomous-excavation');
  const autonomyFactor = 0.7 + (0.03 * autonomous);
  const eventFactor = state.activeEvent?.id === 'gravity-lease' && state.activeEvent.choice === 'rarity-for-depth'
    ? 1.4
    : 1;

  return Math.max(0, model.depthRate * seconds * autonomyFactor * eventFactor * 420);
}

function computeBiomeEfficiency(state, lightingLevel, ventilationLevel) {
  const lightBonus = 1 + (0.015 * lightingLevel);
  const ventResist = 1 - Math.pow(0.92, ventilationLevel);
  const hazardPenalty = computeHazardTier(state) * (1 - ventResist);
  const base = Math.max(0.2, 1 - hazardPenalty);

  return base * lightBonus;
}

function computeHazardTier(state) {
  const biomeIndex = Math.max(0, state.biomes.findIndex((biome) => biome.id === state.selectedBiomeId));
  const localRatio = state.selectedBiome.localDepthLimit > 0
    ? clampNumber(state.localDepth / state.selectedBiome.localDepthLimit, 0, 1)
    : 0;
  const stateStress = (
    Math.max(0, state.mineState.heat - 0.62)
    + Math.max(0, 0.46 - state.mineState.air)
    + Math.max(0, 0.52 - state.mineState.integrity)
  );

  return clampNumber(0.08 + (biomeIndex * 0.028) + (localRatio * 0.24) + (stateStress * 0.6), 0, 1.4);
}

function getEventProductionModifier(state) {
  if (!state.activeEvent) {
    return 1;
  }

  switch (state.activeEvent.id) {
    case 'silence-protocol':
      return 1.45;
    case 'echo-quarry':
      return 1.35;
    case 'surveyor-ghostline':
      return 1.12;
    case 'singularity-rehearsal':
      return 1.75;
    default:
      return 1;
  }
}

function getEventSellModifier(state) {
  if (!state.activeEvent) {
    return 1;
  }

  if (state.activeEvent.id !== 'market-eclipse') {
    return 1;
  }

  return 1.3;
}

function isManualMiningDisabled(state) {
  return state.activeEvent?.id === 'silence-protocol';
}

function computeWorkforceModel(state) {
  const workerLevel = getUpgradeLevel(state, 'workers');
  const storage = getUpgradeLevel(state, 'storage');
  const conveyor = getUpgradeLevel(state, 'conveyor');
  const ventilation = getUpgradeLevel(state, 'ventilation');
  const lift = getUpgradeLevel(state, 'lift-speed');

  const barracks = getSupportLevel(state, 'barracks');
  const messHall = getSupportLevel(state, 'mess-hall');
  const medical = getSupportLevel(state, 'medical-bay');
  const safetyOffice = getSupportLevel(state, 'safety-office');
  const training = getSupportLevel(state, 'training-hall');
  const lockers = getSupportLevel(state, 'equipment-lockers');
  const transport = getSupportLevel(state, 'transport-hub');

  const headcount = workerLevel + state.workers.temporaryWorkers;
  const housingCapacity = 8 + (barracks * 14) + Math.floor(storage * 1.8);
  const supportCapacity = 10
    + (safetyOffice * 8)
    + (training * 6)
    + (lockers * 5)
    + (transport * 7)
    + (messHall * 4)
    + (medical * 4)
    + (ventilation * 2)
    + (lift * 2)
    + (conveyor * 1)
    + (storage * 1);

  const morale = clampNumber(state.workers.morale, 0, 1);
  const fatigue = clampNumber(state.workers.fatigue, 0, 1);
  const discipline = clampNumber(state.workers.discipline, 0, 1);
  const safetyRating = clampNumber(state.workers.safetyRating, 0, 1);

  const housingEff = Math.min(1, housingCapacity / Math.max(headcount, 1));
  const supportEff = Math.min(1, supportCapacity / Math.max(headcount, 1));
  const moraleEff = 0.7 + (0.3 * morale);
  const fatigueEff = 1 - (0.35 * fatigue);
  const disciplineEff = 0.75 + (0.25 * discipline);
  const safetyEff = 0.8 + (0.2 * safetyRating);

  const effectiveWorkforce = headcount * housingEff * supportEff * moraleEff * fatigueEff * disciplineEff * safetyEff;
  const assignedWorkers = Math.round(headcount * 0.92);

  return {
    headcount,
    assignedWorkers,
    effectiveWorkforce,
    housingCapacity,
    supportCapacity,
    breakpoints: {
      foreman: headcount >= 10,
      secondShift: headcount >= 25,
      specialization: headcount >= 50,
      outposts: headcount >= 100,
      operationsBoard: headcount >= 250,
      divisions: headcount >= 500
    }
  };
}

function hireContractors(state) {
  const fee = 220 + Math.round(state.workers.headcount * 1.4);
  if (state.credits < fee) {
    state.notifications.unshift(`Need ${formatCredits(fee)} for a temporary contractor bundle.`);
    return;
  }

  state.credits -= fee;
  state.workers.temporaryWorkers += 12;
  state.workers.contractorDuration = Math.max(state.workers.contractorDuration, 0) + 150;
  state.notifications.unshift('Contractor crew hired for a short production push.');
}

function buyUpgrade(state, upgradeId) {
  const upgrade = state.upgrades.find((entry) => entry.id === upgradeId);
  if (!upgrade) {
    return;
  }

  if (Number.isFinite(upgrade.maxLevel) && upgrade.level >= upgrade.maxLevel) {
    state.notifications.unshift(`${upgrade.name} is already at max level.`);
    return;
  }

  const cost = getUpgradeCost(upgrade);
  if (state.credits < cost) {
    state.notifications.unshift(`Insufficient credits for ${upgrade.name}.`);
    return;
  }

  state.credits -= cost;
  upgrade.level += 1;
  state.notifications.unshift(`${upgrade.name} upgraded to level ${upgrade.level}.`);
}

function buySupportBuilding(state, buildingId) {
  const building = state.supportBuildings.find((entry) => entry.id === buildingId);
  if (!building) {
    return;
  }

  if (Number.isFinite(building.maxLevel) && building.level >= building.maxLevel) {
    state.notifications.unshift(`${building.name} is already maxed.`);
    return;
  }

  const cost = getSupportCost(building);
  if (state.credits < cost) {
    state.notifications.unshift(`Insufficient credits for ${building.name}.`);
    return;
  }

  state.credits -= cost;
  building.level += 1;
  state.notifications.unshift(`${building.name} expanded to level ${building.level}.`);
}

function selectBiome(state, biomeId) {
  const biome = state.biomes.find((entry) => entry.id === biomeId);
  if (!biome) {
    return;
  }

  if (!biome.unlocked && biome !== state.biomes[0]) {
    state.notifications.unshift(`${biome.name} is still locked. Push deeper first.`);
    return;
  }

  state.selectedBiomeId = biome.id;
  state.localDepth = clampDepth(state.biomeDepths[biome.id] ?? 0, biome);
}

function setLocalDepth(state, nextDepth) {
  const biome = getSelectedBiome(state);
  const exploredDepth = state.biomeDepths[biome.id] ?? 0;
  const depth = clampNumber(toNumber(nextDepth), 0, exploredDepth);

  state.localDepth = depth;
}

const CREW_ROLES = ['extraction', 'hauler', 'stabilization', 'survey', 'recovery'];

function setCrew(state, role, ratio) {
  if (!CREW_ROLES.includes(role)) {
    return;
  }

  const newRatio = clampNumber(toNumber(ratio), 0, 1);
  const others = CREW_ROLES.filter((r) => r !== role);
  const remaining = Math.max(0, 1 - newRatio);

  // Sum current shares of other roles to redistribute proportionally
  const otherSum = others.reduce((sum, r) => sum + (state.crews[r] ?? 0), 0);

  state.crews[role] = newRatio;

  if (otherSum === 0) {
    // Distribute evenly if everything was 0
    const share = remaining / others.length;
    others.forEach((r) => { state.crews[r] = share; });
  } else {
    others.forEach((r) => {
      state.crews[r] = ((state.crews[r] ?? 0) / otherSum) * remaining;
    });
  }
}

function canUseShift(state, shiftId) {
  const milestone = state.workers.breakpoints;
  if (!SHIFT_PROFILES[shiftId]) {
    return false;
  }

  if (shiftId === 'day') {
    return true;
  }

  if (shiftId === 'night') {
    return milestone.secondShift;
  }

  if (shiftId === 'overtime' || shiftId === 'safe') {
    return milestone.secondShift;
  }

  if (shiftId === 'deep') {
    return milestone.specialization;
  }

  if (shiftId === 'contract') {
    return milestone.operationsBoard;
  }

  return false;
}

function normalizeContracts(contracts, state, runtime) {
  const active = contracts
    .filter((contract) => !contract.completed)
    .map((contract) => ({
      ...contract,
      progress: clampNumber(contract.progress, 0, contract.target),
      claimable: contract.progress >= contract.target,
      status: contract.progress >= contract.target ? 'ready' : 'active'
    }));

  while (active.length < 3) {
    active.push(createContract(state, runtime));
  }

  return active.slice(0, 3);
}

function normalizeRefineryQueue(queue) {
  if (!Array.isArray(queue)) {
    return [];
  }

  return queue
    .filter((batch) => batch && typeof batch === 'object')
    .map((batch) => ({
      ...batch,
      remaining: Math.max(0, toNumber(batch.remaining))
    }))
    .slice(0, 4);
}

function normalizeInventory(inventory, state, productionModel) {
  const refineryMult = productionModel.refineryMult;
  const marketByKey = new Map(buildMarketEntries(state, productionModel).map((entry) => [entry.key, entry.price]));

  return inventory
    .filter((item) => item && Number.isFinite(Number(item.quantity)) && item.quantity > 0)
    .map((item) => {
      const marketPrice = marketByKey.get(item.key)
        ?? Math.max(1, Math.round(item.basePrice * refineryMult));

      return {
        ...item,
        rarity: normalizeRarity(item.rarity),
        quantity: Math.floor(item.quantity),
        marketPrice,
        totalValue: Math.floor(item.quantity) * marketPrice
      };
    })
    .sort((left, right) => right.totalValue - left.totalValue);
}

function buildMarketEntries(state, productionModel) {
  const selected = getSelectedBiome(state);
  const unlocked = state.biomes.filter((biome) => biome.unlocked);
  const ores = unlocked.flatMap((biome) => biome.ores);
  const unique = new Map();

  ores.forEach((ore) => {
    if (!unique.has(ore.key)) {
      unique.set(ore.key, ore);
    }
  });

  return Array.from(unique.values())
    .map((ore) => {
      const depthBoost = 1 + ((state.currentGlobalDepth / Math.max(1, state.totalDepth)) * 0.2);
      const cycle = Math.sin((state.now / 180_000) + ore.marketIndex);
      const rarityMult = RARITY_MULTIPLIER[normalizeRarity(ore.rarity)] ?? 1;
      const eventMult = getMarketEventMultiplier(state, ore.rarity);
      const base = ore.basePrice * rarityMult * depthBoost * (1 + cycle * 0.1) * productionModel.refineryMult * eventMult;
      const price = Math.max(1, Math.round(base));

      return {
        key: ore.key,
        name: ore.name,
        rarity: normalizeRarity(ore.rarity),
        price,
        quantity: state.inventory.find((item) => item.key === ore.key)?.quantity ?? 0
      };
    })
    .sort((left, right) => right.price - left.price)
    .slice(0, 24)
    .map((entry) => ({
      ...entry,
      highlight: entry.name === selected.signatureOre
    }));
}

function getMarketEventMultiplier(state, rarity) {
  if (state.activeEvent?.id !== 'market-eclipse') {
    return 1;
  }

  const normalized = normalizeRarity(rarity);
  if (normalized === 'common' || normalized === 'uncommon' || normalized === 'rare') {
    return 2.35;
  }

  if (normalized === 'legendary' || normalized === 'mythic') {
    return 0.72;
  }

  return 0.9;
}

function getAverageOreValue(state) {
  const inventory = state.inventory;
  if (!inventory.length) {
    const entries = state.marketEntries;
    if (!entries.length) {
      return 0;
    }
    return entries.reduce((sum, entry) => sum + entry.price, 0) / entries.length;
  }

  let totalValue = 0;
  let totalQuantity = 0;
  for (const item of inventory) {
    const qty = Math.max(0, item.quantity);
    totalValue += qty * (item.marketPrice ?? item.basePrice ?? 0);
    totalQuantity += qty;
  }

  return totalQuantity > 0 ? totalValue / totalQuantity : 0;
}

function addInventory(state, drop, quantity) {
  const existing = state.inventory.find((item) => item.key === drop.key);

  if (existing) {
    existing.quantity += quantity;
    return;
  }

  state.inventory.push({
    key: drop.key,
    id: drop.key,
    name: drop.name,
    rarity: normalizeRarity(drop.rarity),
    quantity,
    basePrice: drop.basePrice,
    marketPrice: drop.basePrice,
    totalValue: drop.basePrice * quantity
  });
}

function addEventBufferedOre(runtime, drop, quantity) {
  const context = ensureEventContext(runtime);
  if (!context.timeLagBuffer) {
    context.timeLagBuffer = {};
  }

  if (!context.timeLagBuffer[drop.key]) {
    context.timeLagBuffer[drop.key] = {
      key: drop.key,
      name: drop.name,
      rarity: drop.rarity,
      basePrice: drop.basePrice,
      quantity: 0
    };
  }

  context.timeLagBuffer[drop.key].quantity += quantity;
}

function registerDiscovery(state, drop, source) {
  if (!drop || !drop.rarity) {
    return;
  }

  const rarity = normalizeRarity(drop.rarity);
  const tierName = drop.tierName ?? null;

  if (rarity === 'common' && (!tierName || tierName === 'Plain')) {
    return;
  }

  const existing = state.discoveries.find((entry) => entry.key === drop.key);
  if (existing) {
    existing.count += 1;
    return;
  }

  const displayTier = tierName ?? rarity;
  const tierMult = TIER_PRICE_MULTIPLIER[tierName] ?? (RARITY_MULTIPLIER[rarity] ?? 1);

  state.discoveries.unshift({
    id: `discovery-${drop.key}-${state.now}`,
    key: drop.key,
    name: drop.name,
    rarity,
    tierName: displayTier,
    source,
    count: 1
  });

  state.museumScore += Math.round(tierMult * 8);

  const tierLabel = tierName ? `${tierName} ${rarity}` : rarity;
  if (drop.luckyStrike) {
    state.notifications.unshift(`Lucky Strike! New discovery: ${drop.name} (${tierLabel}).`);
  } else {
    state.notifications.unshift(`New discovery logged: ${drop.name} (${tierLabel}).`);
  }
}

function registerSpecialDiscovery(state, name, rarity, source) {
  const key = slugify(name);
  const existing = state.discoveries.find((entry) => entry.key === key);
  if (existing) {
    existing.count += 1;
    return;
  }

  state.discoveries.unshift({
    id: `special-${key}-${state.now}`,
    key,
    name,
    rarity,
    source,
    count: 1
  });
  state.museumScore += Math.round((RARITY_MULTIPLIER[rarity] ?? 1) * 12);
}

function appendRecentFind(state, drop, quantity, source) {
  state.recentFinds.unshift({
    id: `${drop.key}-${state.now}-${state.recentFinds.length}`,
    key: drop.key,
    name: drop.name,
    rarity: normalizeRarity(drop.rarity),
    tierName: drop.tierName ?? null,
    luckyStrike: drop.luckyStrike ?? false,
    quantity,
    value: drop.basePrice * quantity,
    source
  });
}

function incrementDepth(state, amount) {
  const biome = getSelectedBiome(state);
  const explored = state.biomeDepths[biome.id] ?? 0;
  const nextDepth = clampDepth(explored + amount, biome);
  state.biomeDepths[biome.id] = nextDepth;
  state.localDepth = nextDepth;
}

function getReservedQuantity(state, oreKey) {
  const contractReserved = state.contracts.reduce((sum, contract) => {
    if (contract.completed || contract.targetOreKey !== oreKey) {
      return sum;
    }
    return sum + Math.max(0, contract.target - contract.progress);
  }, 0);

  const museumReserved = state.discoveries.some((entry) => entry.key === oreKey) ? 1 : 0;
  return contractReserved + museumReserved;
}

function getPassiveAttempts(runtime, ratePerSecond, seconds) {
  const target = Math.max(0, ratePerSecond * seconds);
  const attempts = Math.floor(runtime.passiveCarry + target);
  runtime.passiveCarry = runtime.passiveCarry + target - attempts;
  return attempts;
}

function computeInventoryLoad(inventory) {
  if (!Array.isArray(inventory)) {
    return 0;
  }

  return inventory.reduce((sum, item) => sum + Math.max(0, Math.floor(Number(item?.quantity) || 0)), 0);
}

function pickEvent(state, runtime) {
  const eligible = EVENT_DEFS.filter((event) => isEventEligible(state, event));
  if (!eligible.length) {
    return null;
  }

  const weighted = eligible.map((event) => ({
    ore: event,
    weight: EVENT_WEIGHTS[event.rarity] ?? 1
  }));

  return pickWeighted(weighted, runtime);
}

function isEventEligible(state, event) {
  if (event.id === 'silence-protocol') {
    return state.workers.breakpoints.specialization;
  }

  if (event.id === 'singularity-rehearsal') {
    return state.workers.breakpoints.operationsBoard;
  }

  if (event.id === 'debt-collector') {
    return state.workers.breakpoints.outposts;
  }

  return true;
}

function ensureEventContext(runtime) {
  if (!runtime.eventContext || typeof runtime.eventContext !== 'object') {
    runtime.eventContext = {};
  }
  return runtime.eventContext;
}

function getUpgradeCost(upgrade) {
  const level = upgrade.level;
  if (upgrade.uncapped) {
    return Math.round(upgrade.baseCost * (upgrade.growth ** level) * (1 + (0.012 * Math.pow(level, 1.35))));
  }

  const softcapMult = level <= upgrade.softcap
    ? 1
    : 1 + (0.02 * Math.pow(level - upgrade.softcap, 1.25));
  return Math.round(upgrade.baseCost * (upgrade.growth ** level) * softcapMult);
}

function getSupportCost(building) {
  const level = building.level;
  const softcapMult = level <= building.softcap
    ? 1
    : 1 + (0.018 * Math.pow(level - building.softcap, 1.2));
  return Math.round(building.baseCost * (building.growth ** level) * softcapMult);
}

function pickRefineryRecipe(inventory) {
  const availableByRarity = inventory.reduce((map, item) => {
    map[normalizeRarity(item.rarity)] = (map[normalizeRarity(item.rarity)] ?? 0) + item.quantity;
    return map;
  }, {});

  if ((availableByRarity.common ?? 0) >= 20) {
    return {
      sourceRarity: 'common',
      outputRarity: 'uncommon',
      inputUnits: 20,
      outputUnits: 7,
      outputName: 'Refined Composite',
      baseDuration: 46
    };
  }

  if ((availableByRarity.uncommon ?? 0) >= 14) {
    return {
      sourceRarity: 'uncommon',
      outputRarity: 'rare',
      inputUnits: 14,
      outputUnits: 5,
      outputName: 'Pressure Alloy',
      baseDuration: 58
    };
  }

  if ((availableByRarity.rare ?? 0) >= 10) {
    return {
      sourceRarity: 'rare',
      outputRarity: 'epic',
      inputUnits: 10,
      outputUnits: 3,
      outputName: 'Cathedral Ingot',
      baseDuration: 72
    };
  }

  return null;
}

function buildStats(state, productionModel) {
  const readyContracts = state.contracts.filter((contract) => contract.claimable).length;
  const unresolvedIncidents = state.incidents.filter((incident) => !incident.resolved).length;

  return {
    gps: `${(productionModel.sellRate * productionModel.averageOreValue).toFixed(1)} gold/s`,
    passiveOreRate: `${productionModel.passiveOreRate.toFixed(2)} ore/s`,
    sellRate: `${productionModel.sellRate.toFixed(2)} ore/s`,
    transferDelay: `${productionModel.transferDelay.toFixed(1)}s`,
    depthRate: `${Math.round(productionModel.depthRate * 420).toLocaleString('en-US')} m/s`,
    workforce: `${Math.round(state.workers.effectiveWorkforce).toLocaleString('en-US')} effective`,
    payroll: formatCredits(state.workers.payrollLoad),
    readyContracts: `${readyContracts}`,
    incidents: `${unresolvedIncidents}`
  };
}

function buildOfflineReport({
  elapsedMs,
  shiftName,
  creditsEarned,
  depthGain,
  recentFindCount,
  eventsTriggered,
  newIncidents,
  oreProduced = 0,
  rarityBreakdown = {},
  newDiscoveries = [],
  offlineEfficiency = 95,
  dreamMiningLevel = 0
}) {
  const panels = [
    {
      id: 'duration',
      label: 'Time Away',
      value: formatDuration(elapsedMs),
      detail: `${shiftName} shift · ${offlineEfficiency}% efficiency${dreamMiningLevel > 0 ? ` (Dream Lv.${dreamMiningLevel})` : ''}`
    },
    {
      id: 'ore',
      label: 'Ore Produced',
      value: `${Math.round(oreProduced).toLocaleString('en-US')}`,
      detail: Object.entries(rarityBreakdown)
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tier, count]) => `${tier}: ${count}`)
        .join(', ') || 'No rare drops logged'
    },
    {
      id: 'gold',
      label: 'Credits Earned',
      value: formatCredits(creditsEarned),
      detail: `From auto-sell and contract completions`
    },
    {
      id: 'events',
      label: 'Events',
      value: `${eventsTriggered} fired`,
      detail: `${newIncidents} new incident${newIncidents !== 1 ? 's' : ''} entered the board`
    },
    {
      id: 'depth',
      label: 'Depth Gained',
      value: formatMeters(depthGain),
      detail: `${recentFindCount} finds logged during session`
    },
    {
      id: 'discoveries',
      label: 'New Discoveries',
      value: `${newDiscoveries.length}`,
      detail: newDiscoveries.length > 0
        ? newDiscoveries.slice(0, 3).map((d) => `${d.name} (${d.tierName ?? d.rarity})`).join(', ')
        : 'No new specimens this session'
    }
  ];

  return {
    title: 'Away Summary',
    timeAway: formatDuration(elapsedMs),
    creditsEarned,
    highlightCount: recentFindCount + eventsTriggered,
    panels,
    summary:
      `${shiftName} gained ${formatMeters(depthGain)} depth with ${recentFindCount} logged finds. ` +
      `${eventsTriggered} events fired during the sim and ${newIncidents} new incidents appeared.`
  };
}

function normalizeBiomes(biomes) {
  if (!Array.isArray(biomes) || biomes.length === 0) {
    return [createFallbackBiome()];
  }

  return biomes.map((biome, biomeIndex) => {
    const strata = Array.isArray(biome.strata) ? biome.strata : [];

    const normalizedStrata = strata.map((stratum, stratumIndex) => ({
      id: `${biome.id}-stratum-${stratumIndex}`,
      name: stratum.name ?? `Stratum ${stratumIndex + 1}`,
      ores: (Array.isArray(stratum.ores) ? stratum.ores : []).map((ore, oreIndex) => ({
        key: slugify(`${biome.id}-${ore.name}-${stratumIndex}-${oreIndex}`),
        id: slugify(`${biome.id}-${ore.name}-${stratumIndex}-${oreIndex}`),
        name: ore.name ?? `Ore ${oreIndex + 1}`,
        rarity: normalizeRarity(ore.rarity),
        basePrice: getBasePrice(ore),
        marketIndex: (biomeIndex * 17) + (stratumIndex * 4) + oreIndex,
        veinWeight: 1
      }))
    }));

    const ores = normalizedStrata.flatMap((stratum) => stratum.ores);

    const hazards = Array.isArray(biome.hazards)
      ? biome.hazards
          .map((hazard) => {
            if (typeof hazard === 'string') {
              return hazard;
            }

            if (hazard && typeof hazard === 'object') {
              return [hazard.name, hazard.effect].filter(Boolean).join(': ');
            }

            return '';
          })
          .filter(Boolean)
      : [];

    return {
      ...biome,
      hazards,
      strata: normalizedStrata,
      ores,
      unlocked: biomeIndex === 0,
      globalDepth: {
        start: Number(biome.globalDepth?.start ?? 0),
        end: Number(biome.globalDepth?.end ?? (Number(biome.globalDepth?.start ?? 0) + Number(biome.localDepthLimit ?? 128_000)))
      },
      localDepthLimit: Number(biome.localDepthLimit ?? 128_000),
      signatureOre: biome.signatureOre ?? ores[0]?.name ?? 'Unknown ore'
    };
  });
}

function getUnlockedBiomeIds(state) {
  const unlocked = new Set();

  state.biomes.forEach((biome, index) => {
    if (index === 0 || state.deepestDepth >= biome.globalDepth.start) {
      unlocked.add(biome.id);
    }
  });

  return unlocked;
}

function getSelectedBiome(state) {
  return state.biomes.find((biome) => biome.id === state.selectedBiomeId) ?? state.biomes[0] ?? createFallbackBiome();
}

function resolveStratum(biome, localDepth) {
  if (!Array.isArray(biome.strata) || biome.strata.length === 0) {
    return null;
  }

  const ratio = biome.localDepthLimit > 0 ? clampNumber(localDepth / biome.localDepthLimit, 0, 0.999999) : 0;
  const index = Math.min(biome.strata.length - 1, Math.floor(ratio * biome.strata.length));
  return biome.strata[index];
}

function getUpgradeLevel(state, id) {
  return state.upgrades.find((upgrade) => upgrade.id === id)?.level ?? 0;
}

function getSupportLevel(state, id) {
  return state.supportBuildings.find((building) => building.id === id)?.level ?? 0;
}

function getTotalDepth(biomes) {
  return biomes.reduce((maxDepth, biome) => Math.max(maxDepth, Number(biome.globalDepth?.end ?? 0)), 0) || 128000;
}

function getBasePrice(ore) {
  if (Number.isFinite(Number(ore.priceRange?.min)) && Number.isFinite(Number(ore.priceRange?.max))) {
    return Math.round((Number(ore.priceRange.min) + Number(ore.priceRange.max)) / 2);
  }

  if (Number.isFinite(Number(ore.priceSlot))) {
    return Math.round(Number(ore.priceSlot) * 132);
  }

  return 120;
}

function clampDepth(value, biome) {
  const numeric = toNumber(value);
  return clampNumber(numeric, 0, biome.localDepthLimit ?? 0);
}

function normalizeRarity(value) {
  const normalized = String(value ?? '').trim().toLowerCase();
  return RARITY_ORDER.includes(normalized) ? normalized : 'common';
}

function createFallbackBiome() {
  const ore = {
    key: 'fallback-ore',
    id: 'fallback-ore',
    name: 'Fallback Ore',
    rarity: 'common',
    basePrice: 120,
    marketIndex: 0,
    veinWeight: 1
  };

  return {
    id: 'fallback-biome',
    name: 'Fallback Biome',
    signatureOre: ore.name,
    signatureEconomy: 'Starter extraction economy',
    miningRule: 'Mine, sell, and upgrade.',
    globalDepth: { start: 0, end: 128_000 },
    localDepthLimit: 128_000,
    hazards: [],
    ores: [ore],
    strata: [{ id: 'fallback-stratum', name: 'Starter Stratum', ores: [ore] }],
    unlocked: true
  };
}

function pickWeighted(entries, runtime) {
  const total = entries.reduce((sum, entry) => sum + Math.max(0, entry.weight), 0);
  if (total <= 0) {
    return entries[0]?.ore ?? null;
  }

  let threshold = nextRandom(runtime) * total;
  for (const entry of entries) {
    threshold -= Math.max(0, entry.weight);
    if (threshold <= 0) {
      return entry.ore;
    }
  }

  return entries[entries.length - 1]?.ore ?? null;
}

function nextRandom(runtime) {
  if (!runtime) {
    return Math.random();
  }

  runtime.rngState = (runtime.rngState * 1664525 + 1013904223) >>> 0;
  return runtime.rngState / 0x100000000;
}

function randomBetween(min, max, runtime) {
  const start = Number(min);
  const end = Number(max);
  const roll = runtime ? nextRandom(runtime) : Math.random();
  return start + ((end - start) * roll);
}

function seedFromBiomes(biomes) {
  const source = Array.isArray(biomes) && biomes.length
    ? biomes.map((biome) => biome.id).join('|')
    : 'virtual-miner';

  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function dedupeStrings(values) {
  return Array.from(new Set((Array.isArray(values) ? values : []).filter(Boolean)));
}

function slugify(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function clampNumber(value, min, max) {
  if (!Number.isFinite(Number(value))) {
    return min;
  }
  return Math.min(max, Math.max(min, Number(value)));
}

function formatCredits(value) {
  return `${formatLargeNumber(value)} cr`;
}

function formatMeters(value) {
  return `${formatLargeNumber(value)} m`;
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

function cloneValue(value) {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function saveToStorage(state) {
  try {
    const data = {
      v: SAVE_VERSION,
      lastTickAt: state.lastTickAt,
      credits: state.credits,
      lifetimeCredits: state.lifetimeCredits,
      debt: state.debt,
      selectedBiomeId: state.selectedBiomeId,
      biomeDepths: state.biomeDepths,
      deepestDepth: state.deepestDepth,
      shiftPolicy: state.shiftPolicy,
      extractionMode: state.extractionMode,
      upgrades: state.upgrades.map((u) => [u.id, u.level]),
      support: state.supportBuildings.map((b) => [b.id, b.level]),
      workers: {
        tw: state.workers.temporaryWorkers,
        cd: state.workers.contractorDuration,
        m: state.workers.morale,
        f: state.workers.fatigue,
        d: state.workers.discipline,
        s: state.workers.safetyRating
      },
      crews: state.crews,
      mine: state.mineState,
      inv: state.inventory.map((item) => ({
        k: item.key,
        n: item.name,
        r: item.rarity,
        q: item.quantity,
        p: item.basePrice
      })),
      contracts: state.contracts,
      incidents: state.incidents.filter((i) => !i.resolved),
      discoveries: state.discoveries,
      museumScore: state.museumScore,
      recentFinds: state.recentFinds.slice(0, 10),
      eventHistory: state.eventHistory.slice(0, 8),
      activeEvent: state.activeEvent,
      localDepth: state.localDepth,
      prdCounters: state.prdCounters,
      comboCount: state.comboCount,
      lastDropTier: state.lastDropTier
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (_error) {
    // Silent fail - localStorage may be full or unavailable
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return null;
    }
    const data = JSON.parse(raw);
    if (!data || (data.v !== SAVE_VERSION && data.v !== 1)) {
      return null;
    }
    return data;
  } catch (_error) {
    return null;
  }
}

function applySaveData(state, save) {
  if (!save) {
    return;
  }

  state.credits = save.credits ?? state.credits;
  state.lifetimeCredits = save.lifetimeCredits ?? state.lifetimeCredits;
  state.debt = save.debt ?? state.debt;
  state.selectedBiomeId = save.selectedBiomeId ?? state.selectedBiomeId;
  state.deepestDepth = save.deepestDepth ?? state.deepestDepth;
  state.shiftPolicy = save.shiftPolicy ?? state.shiftPolicy;
  state.extractionMode = save.extractionMode ?? state.extractionMode;
  state.museumScore = save.museumScore ?? state.museumScore;
  state.lastTickAt = save.lastTickAt ?? state.lastTickAt;

  if (save.biomeDepths) {
    Object.assign(state.biomeDepths, save.biomeDepths);
  }

  if (Array.isArray(save.upgrades)) {
    const levelMap = new Map(save.upgrades);
    state.upgrades.forEach((u) => {
      if (levelMap.has(u.id)) {
        u.level = levelMap.get(u.id);
      }
    });
  }

  if (Array.isArray(save.support)) {
    const levelMap = new Map(save.support);
    state.supportBuildings.forEach((b) => {
      if (levelMap.has(b.id)) {
        b.level = levelMap.get(b.id);
      }
    });
  }

  if (save.workers) {
    state.workers.temporaryWorkers = save.workers.tw ?? 0;
    state.workers.contractorDuration = save.workers.cd ?? 0;
    state.workers.morale = save.workers.m ?? state.workers.morale;
    state.workers.fatigue = save.workers.f ?? state.workers.fatigue;
    state.workers.discipline = save.workers.d ?? state.workers.discipline;
    state.workers.safetyRating = save.workers.s ?? state.workers.safetyRating;
  }

  if (save.crews) {
    Object.assign(state.crews, save.crews);
  }

  if (save.mine) {
    Object.assign(state.mineState, save.mine);
  }

  if (Array.isArray(save.inv)) {
    state.inventory = save.inv.map((item) => ({
      key: item.k,
      id: item.k,
      name: item.n,
      rarity: item.r,
      quantity: item.q,
      basePrice: item.p,
      marketPrice: item.p,
      totalValue: item.p * item.q
    }));
  }

  if (Array.isArray(save.contracts)) {
    state.contracts = save.contracts;
  }

  if (Array.isArray(save.incidents)) {
    state.incidents = save.incidents;
  }

  if (Array.isArray(save.discoveries)) {
    state.discoveries = save.discoveries;
  }

  if (Array.isArray(save.recentFinds)) {
    state.recentFinds = save.recentFinds;
  }

  if (Array.isArray(save.eventHistory)) {
    state.eventHistory = save.eventHistory;
  }

  if (save.activeEvent && typeof save.activeEvent === 'object') {
    state.activeEvent = save.activeEvent;
  }

  if (save.prdCounters && typeof save.prdCounters === 'object') {
    state.prdCounters = { ...createInitialRarityCounters(DEFAULT_RARITY_TIERS, 1), ...save.prdCounters };
  }

  if (Number.isFinite(Number(save.comboCount))) {
    state.comboCount = clampNumber(Number(save.comboCount), 0, 100);
  }

  if (typeof save.lastDropTier === 'string') {
    state.lastDropTier = save.lastDropTier;
  }

  const biome = state.biomes.find((b) => b.id === state.selectedBiomeId);
  if (biome) {
    const exploredDepth = state.biomeDepths[biome.id] ?? 0;
    const savedLocalDepth = Number.isFinite(Number(save.localDepth)) ? Number(save.localDepth) : exploredDepth;
    state.localDepth = clampNumber(savedLocalDepth, 0, exploredDepth);
    state.currentGlobalDepth = biome.globalDepth.start + state.localDepth;
  }
}
