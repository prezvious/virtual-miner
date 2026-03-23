import {
  DEFAULT_EVENT_QUANTITY_MULTIPLIERS,
  DEFAULT_LUCKY_STRIKE,
  DEFAULT_RARITY_TIERS,
} from '../data/rngConfig.js';
import { createCounterMap } from './immutable.js';
import { getCombinedRarityModifier, getLuckyStrikeChance, normalizeKey } from './modifiers.js';
import {
  clampNumber,
  createRandomSource,
  floorNumber,
  normalizeWeights,
  sumBy,
  weightedPick,
} from './math.js';

export function createTierIndex(tiers = DEFAULT_RARITY_TIERS) {
  return Object.fromEntries((tiers ?? []).map((tier, index) => [tier.name, { ...tier, index }]));
}

export function getTierNamesAscending(tiers = DEFAULT_RARITY_TIERS) {
  return (tiers ?? []).map((tier) => tier.name);
}

export function getTierNamesDescending(tiers = DEFAULT_RARITY_TIERS) {
  return getTierNamesAscending(tiers).reverse();
}

export function createInitialRarityCounters(tiers = DEFAULT_RARITY_TIERS, initialValue = 1) {
  return createCounterMap(getTierNamesAscending(tiers), initialValue);
}

export function computePrdChance({ counter = 0, prdConstant = 0, modifier = 1 }) {
  const normalizedCounter = clampNumber(counter, 0);
  const normalizedConstant = clampNumber(prdConstant, 0);
  const normalizedModifier = clampNumber(modifier, 0);

  return Math.min(1, normalizedCounter * normalizedConstant * normalizedModifier);
}

export function computePityThresholds(tier) {
  return {
    softPityThreshold: floorNumber(tier?.softPityThreshold, Math.floor(2 / Math.max(tier?.baseChance ?? 1, Number.EPSILON))),
    hardPityThreshold: floorNumber(tier?.hardPityThreshold, Math.floor(4 / Math.max(tier?.baseChance ?? 1, Number.EPSILON))),
  };
}

export function computePityAdjustedChance({ tier, counter = 0, effectiveChance = 0 }) {
  const normalizedCounter = clampNumber(counter, 0);
  const normalizedChance = clampNumber(effectiveChance, 0, 1);
  const { softPityThreshold, hardPityThreshold } = computePityThresholds(tier);

  if (normalizedCounter >= hardPityThreshold) {
    return 1;
  }

  if (normalizedCounter < softPityThreshold || hardPityThreshold <= softPityThreshold) {
    return normalizedChance;
  }

  const pityProgress = (normalizedCounter - softPityThreshold) / (hardPityThreshold - softPityThreshold);
  const pityBoost = Math.pow(clampNumber(pityProgress, 0, 1), 0.8) * clampNumber(tier?.maxPityMultiplier, 0);

  return Math.min(1, normalizedChance * (1 + pityBoost));
}

export function resetCountersAtAndBelow(counters, obtainedTierName, tiers = DEFAULT_RARITY_TIERS, resetValue = 0) {
  const tierNames = getTierNamesAscending(tiers);
  const obtainedIndex = tierNames.indexOf(obtainedTierName);

  if (obtainedIndex === -1) {
    return { ...(counters ?? {}) };
  }

  return Object.fromEntries(
    tierNames.map((tierName, index) => [
      tierName,
      index <= obtainedIndex ? resetValue : floorNumber(counters?.[tierName], 0),
    ]),
  );
}

export function rollRarity({
  counters,
  modifier,
  modifiers,
  tiers = DEFAULT_RARITY_TIERS,
  rng = Math.random,
} = {}) {
  const randomSource = createRandomSource(rng);
  const tierIndex = createTierIndex(tiers);
  const orderedTierNames = getTierNamesDescending(tiers);
  const combinedModifier = modifier ?? getCombinedRarityModifier(modifiers);
  const workingCounters = { ...createInitialRarityCounters(tiers), ...(counters ?? {}) };
  const attempts = [];

  for (const tierName of orderedTierNames) {
    const tier = tierIndex[tierName];
    const counter = floorNumber(workingCounters[tierName], 0);
    const effectiveChance = computePrdChance({
      counter,
      prdConstant: tier.prdConstant,
      modifier: combinedModifier,
    });
    const finalChance = computePityAdjustedChance({
      tier,
      counter,
      effectiveChance,
    });
    const roll = randomSource();

    attempts.push({
      tier: tierName,
      counter,
      effectiveChance,
      finalChance,
      roll,
    });

    if (roll < finalChance) {
      return {
        rarity: tierName,
        tier,
        combinedModifier,
        counters: resetCountersAtAndBelow(workingCounters, tierName, tiers, 0),
        attempts,
        source: 'prd',
      };
    }

    workingCounters[tierName] = counter + 1;
  }

  return {
    rarity: tiers[0]?.name ?? 'Plain',
    tier: tiers[0] ?? null,
    combinedModifier,
    counters: workingCounters,
    attempts,
    source: 'fallback',
  };
}

export function rollLuckyStrike({
  eventKey = 'normal',
  cosmicMagnetismLevel = 0,
  tiers = DEFAULT_RARITY_TIERS,
  luckyStrikeConfig = DEFAULT_LUCKY_STRIKE,
  rng = Math.random,
} = {}) {
  const randomSource = createRandomSource(rng);
  const triggerChance = getLuckyStrikeChance({
    baseRate: luckyStrikeConfig.baseRate,
    eventKey,
    eventChanceMultipliers: luckyStrikeConfig.eventChanceMultipliers,
    cosmicMagnetismLevel,
  });
  const triggerRoll = randomSource();

  if (triggerRoll >= triggerChance) {
    return {
      triggered: false,
      chance: triggerChance,
      roll: triggerRoll,
      rarity: null,
      tier: null,
    };
  }

  const minimumIndex = tiers.findIndex((tier) => tier.name === luckyStrikeConfig.minimumTier);
  const eligibleTiers = (minimumIndex === -1 ? tiers : tiers.slice(minimumIndex))
    .filter((tier) => Number.isFinite(tier.luckyStrikeWeight) && tier.luckyStrikeWeight > 0);
  const tier = weightedPick(eligibleTiers, (entry) => entry.luckyStrikeWeight, randomSource) ?? eligibleTiers[0] ?? null;

  return {
    triggered: true,
    chance: triggerChance,
    roll: triggerRoll,
    rarity: tier?.name ?? null,
    tier,
  };
}

export function getBiomeCenter(biome) {
  if (!biome) {
    return null;
  }

  const depthStart = Number(biome.depthStart ?? biome.depth_start);
  const depthEnd = Number(biome.depthEnd ?? biome.depth_end);

  if (Number.isFinite(depthStart) && Number.isFinite(depthEnd)) {
    return (depthStart + depthEnd) / 2;
  }

  return Number.isFinite(Number(biome.depthCenter ?? biome.depth_center))
    ? Number(biome.depthCenter ?? biome.depth_center)
    : null;
}

function resolveBiomeMap(biomes = []) {
  if (!Array.isArray(biomes)) {
    return biomes ?? {};
  }

  return Object.fromEntries(
    biomes.flatMap((biome) => {
      const entries = [];
      const id = biome?.id ?? biome?.name;
      const name = biome?.name;

      if (id) {
        entries.push([normalizeKey(id), biome]);
      }

      if (name) {
        entries.push([normalizeKey(name), biome]);
      }

      return entries;
    }),
  );
}

export function buildEligibleOrePool({
  ores = [],
  selectedTier,
  unlockedBiomes = [],
  currentDepth = 0,
  biomes = [],
} = {}) {
  const allowedBiomes = new Set((unlockedBiomes ?? []).map((biome) => normalizeKey(biome)));
  const biomeMap = resolveBiomeMap(biomes);
  const shouldFilterBiomes = allowedBiomes.size > 0;
  const depth = clampNumber(currentDepth, 0);

  return (ores ?? [])
    .filter((ore) => normalizeKey(ore?.rarity) === normalizeKey(selectedTier))
    .filter((ore) => {
      if (!shouldFilterBiomes) {
        return true;
      }

      const biomeKey = normalizeKey(ore?.sourceBiome ?? ore?.source_biome ?? ore?.biomeId ?? ore?.biome);

      return allowedBiomes.has(biomeKey);
    })
    .map((ore) => {
      const biomeKey = normalizeKey(ore?.sourceBiome ?? ore?.source_biome ?? ore?.biomeId ?? ore?.biome);
      const biome = biomeMap[biomeKey];
      const biomeCenter = getBiomeCenter(biome);
      const distance = biomeCenter == null ? 0 : Math.abs(depth - biomeCenter);
      const proximityWeight = biomeCenter == null ? 1 : 1 / (1 + Math.pow(distance / 2000, 1.5));

      return {
        ore,
        biome,
        biomeCenter,
        distance,
        proximityWeight,
      };
    });
}

export function selectOreWithinRarity({
  ores = [],
  selectedTier,
  unlockedBiomes = [],
  currentDepth = 0,
  biomes = [],
  rng = Math.random,
} = {}) {
  const pool = buildEligibleOrePool({
    ores,
    selectedTier,
    unlockedBiomes,
    currentDepth,
    biomes,
  });
  const randomSource = createRandomSource(rng);
  const selected = weightedPick(pool, (entry) => entry.proximityWeight, randomSource) ?? pool[0] ?? null;

  return {
    selectedOre: selected?.ore ?? null,
    pool,
    totalWeight: sumBy(pool, (entry) => entry.proximityWeight),
  };
}

export function calculateOreQuantity({
  clickPower = 0,
  comboCount = 0,
  eventKey = 'normal',
  rarity,
  tiers = DEFAULT_RARITY_TIERS,
  eventQuantityMultipliers = DEFAULT_EVENT_QUANTITY_MULTIPLIERS,
} = {}) {
  const tier = tiers.find((entry) => entry.name === rarity) ?? tiers[0];
  const baseQuantity = 1;
  const clickBonus = floorNumber(clampNumber(clickPower, 0) / 10, 0);
  const comboQuantity = 1 + floorNumber(clampNumber(comboCount, 0) / 20, 0);
  const eventQuantityMultiplier = eventQuantityMultipliers[normalizeKey(eventKey)] ?? 1;
  const rarityQuantityMultiplier = tier?.quantityMultiplier ?? 1;
  const quantity = Math.max(
    1,
    floorNumber((baseQuantity + clickBonus) * eventQuantityMultiplier * comboQuantity * rarityQuantityMultiplier, 1),
  );

  return {
    quantity,
    tier,
    breakdown: {
      baseQuantity,
      clickBonus,
      comboQuantity,
      eventQuantityMultiplier,
      rarityQuantityMultiplier,
    },
  };
}

export function resolveOreDrop({
  counters,
  ores = [],
  unlockedBiomes = [],
  currentDepth = 0,
  biomes = [],
  clickPower = 0,
  comboCount = 0,
  modifiers,
  tiers = DEFAULT_RARITY_TIERS,
  luckyStrikeConfig = DEFAULT_LUCKY_STRIKE,
  cosmicMagnetismLevel = 0,
  eventKey = 'normal',
  rng = Math.random,
} = {}) {
  const luckyStrike = rollLuckyStrike({
    eventKey,
    cosmicMagnetismLevel,
    tiers,
    luckyStrikeConfig,
    rng,
  });

  if (luckyStrike.triggered) {
    const oreSelection = selectOreWithinRarity({
      ores,
      selectedTier: luckyStrike.rarity,
      unlockedBiomes,
      currentDepth,
      biomes,
      rng,
    });
    const quantity = calculateOreQuantity({
      clickPower,
      comboCount,
      eventKey,
      rarity: luckyStrike.rarity,
      tiers,
    });

    return {
      rarity: luckyStrike.rarity,
      tier: luckyStrike.tier,
      selectedOre: oreSelection.selectedOre,
      quantity: quantity.quantity,
      counters: { ...createInitialRarityCounters(tiers), ...(counters ?? {}) },
      luckyStrike,
      oreSelection,
      quantityBreakdown: quantity.breakdown,
      source: 'lucky_strike',
    };
  }

  const rarityResult = rollRarity({
    counters,
    modifiers,
    tiers,
    rng,
  });
  const oreSelection = selectOreWithinRarity({
    ores,
    selectedTier: rarityResult.rarity,
    unlockedBiomes,
    currentDepth,
    biomes,
    rng,
  });
  const quantity = calculateOreQuantity({
    clickPower,
    comboCount,
    eventKey,
    rarity: rarityResult.rarity,
    tiers,
  });

  return {
    ...rarityResult,
    selectedOre: oreSelection.selectedOre,
    quantity: quantity.quantity,
    luckyStrike,
    oreSelection,
    quantityBreakdown: quantity.breakdown,
    source: rarityResult.source,
  };
}

export function buildOfflineTierShares({
  selectedTier,
  ores = [],
  unlockedBiomes = [],
  currentDepth = 0,
  biomes = [],
} = {}) {
  const pool = buildEligibleOrePool({
    ores,
    selectedTier,
    unlockedBiomes,
    currentDepth,
    biomes,
  });

  return normalizeWeights(pool, (entry) => entry.proximityWeight)
    .filter((entry) => entry.share > 0)
    .map(({ item, share }) => ({
      ore: item.ore,
      share,
    }));
}
