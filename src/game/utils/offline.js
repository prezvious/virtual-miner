import {
  DEFAULT_OFFLINE_CONFIG,
  DEFAULT_RARITY_TIERS,
} from '../data/rngConfig.js';
import { getCombinedRarityModifier } from './modifiers.js';
import {
  clampNumber,
  createRandomSource,
  floorNumber,
  largestRemainderAllocation,
  sumBy,
  toFiniteNumber,
} from './math.js';
import { buildOfflineTierShares, createTierIndex } from './rarity.js';

export function approximateOfflineRarityDistribution({
  totalOre = 0,
  modifier,
  modifiers,
  tiers = DEFAULT_RARITY_TIERS,
  offlineConfig = DEFAULT_OFFLINE_CONFIG,
  rng = Math.random,
} = {}) {
  const randomSource = createRandomSource(rng);
  const combinedModifier = modifier ?? getCombinedRarityModifier(modifiers);
  const distribution = {};
  const targetTotal = Math.max(0, floorNumber(totalOre, 0));
  let previousAdjustedChance = null;

  for (const tier of tiers) {
    let adjustedChance = Math.min(
      offlineConfig.maxAdjustedChance,
      toFiniteNumber(tier.baseChance, 0) * combinedModifier,
    );

    if (previousAdjustedChance != null) {
      adjustedChance = Math.min(adjustedChance, previousAdjustedChance * offlineConfig.monotonicCapRatio);
    }

    adjustedChance *= tier.offlinePenalty ?? 1;

    const expectedCount = Math.floor(targetTotal * adjustedChance);
    const variance = expectedCount * offlineConfig.varianceRatio;
    const actualCount = Math.max(
      0,
      Math.floor(expectedCount + (((randomSource() * 2) - 1) * variance)),
    );

    distribution[tier.name] = actualCount;
    previousAdjustedChance = adjustedChance;
  }

  const currentTotal = sumBy(Object.values(distribution), (value) => value);
  distribution[tiers[0]?.name ?? 'Plain'] = (distribution[tiers[0]?.name ?? 'Plain'] ?? 0) + (targetTotal - currentTotal);

  return normalizeRarityDistribution(distribution, targetTotal, tiers);
}

export function normalizeRarityDistribution(distribution, targetTotal, tiers = DEFAULT_RARITY_TIERS) {
  const tierNames = tiers.map((tier) => tier.name);
  const sanitized = Object.fromEntries(
    tierNames.map((tierName) => [tierName, Math.max(0, floorNumber(distribution?.[tierName], 0))]),
  );
  const sanitizedTotal = sumBy(Object.values(sanitized), (value) => value);

  if (sanitizedTotal === targetTotal) {
    return sanitized;
  }

  if (sanitizedTotal <= 0) {
    return {
      ...sanitized,
      [tierNames[0] ?? 'Plain']: Math.max(0, targetTotal),
    };
  }

  const allocations = largestRemainderAllocation(
    targetTotal,
    tierNames,
    (tierName) => sanitized[tierName] / sanitizedTotal,
  );

  return Object.fromEntries(allocations.map(({ entry, count }) => [entry, count]));
}

export function approximateOfflineOreDistribution({
  totalOre = 0,
  ores = [],
  unlockedBiomes = [],
  currentDepth = 0,
  biomes = [],
  modifier,
  modifiers,
  tiers = DEFAULT_RARITY_TIERS,
  offlineConfig = DEFAULT_OFFLINE_CONFIG,
  rng = Math.random,
} = {}) {
  const rarityDistribution = approximateOfflineRarityDistribution({
    totalOre,
    modifier,
    modifiers,
    tiers,
    offlineConfig,
    rng,
  });
  const oreDistribution = {};

  for (const tier of tiers) {
    const tierCount = rarityDistribution[tier.name] ?? 0;

    if (tierCount <= 0) {
      continue;
    }

    const shares = buildOfflineTierShares({
      selectedTier: tier.name,
      ores,
      unlockedBiomes,
      currentDepth,
      biomes,
    });

    if (!shares.length) {
      oreDistribution[`unknown:${tier.name}`] = (oreDistribution[`unknown:${tier.name}`] ?? 0) + tierCount;
      continue;
    }

    const allocations = largestRemainderAllocation(tierCount, shares, (entry) => entry.share, rng);

    for (const { entry, count } of allocations) {
      if (count <= 0) {
        continue;
      }

      const oreKey = entry.ore?.id ?? entry.ore?.key ?? entry.ore?.name ?? `unknown:${tier.name}`;

      oreDistribution[oreKey] = (oreDistribution[oreKey] ?? 0) + count;
    }
  }

  return {
    rarityDistribution,
    oreDistribution,
  };
}

export function summarizeOfflineMining({
  elapsedSeconds = 0,
  onlineOreRate = 0,
  conveyorSpeed = 0,
  storageCapacity = 0,
  storageFill = 0,
  averageOreValue = 0,
  refineryMultiplier = 1,
  offlineEfficiency = 0.95,
} = {}) {
  const elapsed = Math.max(0, toFiniteNumber(elapsedSeconds, 0));
  const productionRate = Math.max(0, toFiniteNumber(onlineOreRate, 0) * toFiniteNumber(offlineEfficiency, 0.95));
  const conveyorRate = Math.max(0, toFiniteNumber(conveyorSpeed, 0) * 0.95);
  const storageFree = Math.max(0, toFiniteNumber(storageCapacity, 0) - toFiniteNumber(storageFill, 0));
  const oreValue = Math.max(0, toFiniteNumber(averageOreValue, 0));
  const refineryMult = Math.max(0, toFiniteNumber(refineryMultiplier, 1));

  if (elapsed <= 0 || productionRate <= 0) {
    return {
      oreInStorage: 0,
      oreSold: 0,
      goldEarned: 0,
      productionUptime: 0,
    };
  }

  if (conveyorRate >= productionRate) {
    const oreSold = productionRate * elapsed;

    return {
      oreInStorage: 0,
      oreSold,
      goldEarned: oreSold * oreValue * refineryMult,
      productionUptime: 1,
    };
  }

  if (conveyorRate <= 0) {
    const timeToFull = storageFree / productionRate;
    const actualProductionTime = Math.min(elapsed, timeToFull);

    return {
      oreInStorage: Math.min(storageFree, productionRate * elapsed),
      oreSold: 0,
      goldEarned: 0,
      productionUptime: elapsed > 0 ? actualProductionTime / elapsed : 0,
    };
  }

  const netFillRate = productionRate - conveyorRate;
  const timeToFull = netFillRate > 0 ? storageFree / netFillRate : Number.POSITIVE_INFINITY;

  if (timeToFull >= elapsed) {
    const oreInStorage = netFillRate * elapsed;
    const oreSold = conveyorRate * elapsed;

    return {
      oreInStorage,
      oreSold,
      goldEarned: oreSold * oreValue * refineryMult,
      productionUptime: 1,
    };
  }

  const oreSoldBeforeFull = conveyorRate * timeToFull;
  const oreSoldAfterFull = conveyorRate * (elapsed - timeToFull);

  return {
    oreInStorage: storageFree,
    oreSold: oreSoldBeforeFull + oreSoldAfterFull,
    goldEarned: (oreSoldBeforeFull + oreSoldAfterFull) * oreValue * refineryMult,
    productionUptime: elapsed > 0 ? timeToFull / elapsed : 0,
  };
}

export function applyOfflineEfficiencyDecay(elapsedHours = 0) {
  const hours = clampNumber(elapsedHours, 0);

  if (hours <= 12) {
    return 1;
  }

  if (hours >= 168) {
    return 0;
  }

  return Math.max(0, 1 - ((hours - 12) / (168 - 12)));
}

export function getOfflineDepthEfficiency(autonomousExcavationLevel = 0) {
  return 0.7 + (0.03 * clampNumber(autonomousExcavationLevel, 0));
}

export function createOfflineWelcomeBackReport({
  elapsedSeconds = 0,
  rarityDistribution = {},
  oreDistribution = {},
} = {}) {
  const tierIndex = createTierIndex(DEFAULT_RARITY_TIERS);
  const highlights = Object.entries(rarityDistribution)
    .filter(([, count]) => count > 0)
    .sort((left, right) => (tierIndex[right[0]]?.order ?? 0) - (tierIndex[left[0]]?.order ?? 0))
    .slice(0, 3)
    .map(([rarity, count]) => ({ rarity, count }));

  return {
    elapsedSeconds: Math.max(0, toFiniteNumber(elapsedSeconds, 0)),
    rarityDistribution,
    oreDistribution,
    highlights,
  };
}
