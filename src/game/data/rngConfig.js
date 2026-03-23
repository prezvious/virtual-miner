const RARITY_TIER_DEFINITIONS = [
  { name: 'Plain', zone: 'Familiar', prdConstant: 0.209, expectedRolls: 3, quantityMultiplier: 1.0, maxPityMultiplier: 3 },
  { name: 'Curious', zone: 'Familiar', prdConstant: 0.1275, expectedRolls: 5, quantityMultiplier: 1.0, maxPityMultiplier: 3 },
  { name: 'Odd', zone: 'Familiar', prdConstant: 0.0786, expectedRolls: 7, quantityMultiplier: 0.9, maxPityMultiplier: 3 },
  { name: 'Uncanny', zone: 'Familiar', prdConstant: 0.048, expectedRolls: 10, quantityMultiplier: 0.8, maxPityMultiplier: 3 },
  { name: 'Whispered', zone: 'Familiar', prdConstant: 0.029, expectedRolls: 15, quantityMultiplier: 0.7, maxPityMultiplier: 3 },
  { name: 'Haunted', zone: 'Excitement', prdConstant: 0.0175, expectedRolls: 24, quantityMultiplier: 0.5, maxPityMultiplier: 5, luckyStrikeWeight: 30 },
  { name: 'Hexed', zone: 'Excitement', prdConstant: 0.0107, expectedRolls: 37, quantityMultiplier: 0.4, maxPityMultiplier: 5, luckyStrikeWeight: 25 },
  { name: 'Enchanted', zone: 'Excitement', prdConstant: 0.0064, expectedRolls: 59, quantityMultiplier: 0.3, maxPityMultiplier: 5, luckyStrikeWeight: 18 },
  { name: 'Hallowed', zone: 'Excitement', prdConstant: 0.0038, expectedRolls: 95, quantityMultiplier: 0.25, maxPityMultiplier: 5, luckyStrikeWeight: 12 },
  { name: 'Cursed', zone: 'Adrenaline', prdConstant: 0.0021, expectedRolls: 161, quantityMultiplier: 0.2, maxPityMultiplier: 8, luckyStrikeWeight: 7 },
  { name: 'Veiled', zone: 'Adrenaline', prdConstant: 0.0012, expectedRolls: 286, quantityMultiplier: 0.15, maxPityMultiplier: 8, luckyStrikeWeight: 4 },
  { name: 'Eldritch', zone: 'Adrenaline', prdConstant: 0.00058, expectedRolls: 556, quantityMultiplier: 0.1, maxPityMultiplier: 8, luckyStrikeWeight: 2 },
  { name: 'Arcane', zone: 'Legendary', prdConstant: 0.00025, expectedRolls: 1250, quantityMultiplier: 0.08, maxPityMultiplier: 15, luckyStrikeWeight: 1.2, offlinePenalty: 0.8 },
  { name: 'Mythic', zone: 'Legendary', prdConstant: 0.00009, expectedRolls: 3333, quantityMultiplier: 0.05, maxPityMultiplier: 15, luckyStrikeWeight: 0.5, offlinePenalty: 0.6 },
  { name: 'Fabled', zone: 'Legendary', prdConstant: 0.000029, expectedRolls: 10000, quantityMultiplier: 0.03, maxPityMultiplier: 15, luckyStrikeWeight: 0.3, offlinePenalty: 0.3 },
];

export const DEFAULT_RARITY_TIERS = deepFreeze(
  RARITY_TIER_DEFINITIONS.map((tier, index) => {
    const baseChance = 1 / tier.expectedRolls;

    return {
      ...tier,
      index,
      order: index + 1,
      baseChance,
      softPityThreshold: Math.floor(2 / baseChance),
      hardPityThreshold: Math.floor(4 / baseChance),
    };
  }),
);

export const DEFAULT_BIOME_MODIFIERS = deepFreeze({
  topsoil_quarry: 1.0,
  sediment_drift: 1.02,
  ironvein_tunnels: 1.05,
  underground_river: 1.08,
  fungal_grotto: 1.12,
  magma_chamber: 1.18,
  crystal_cathedral: 1.25,
  sulfur_wastes: 1.3,
  fossil_abyss: 1.38,
  geode_hollow: 1.45,
  frozen_depths: 1.55,
  bioluminescent_deep: 1.65,
  tectonic_rift: 1.78,
  echo_cavern: 1.9,
  gilded_vault: 2.05,
  plasma_vein: 2.25,
  petrified_world: 2.5,
  shadow_rift: 2.8,
  astral_mines: 3.2,
  abyss_core: 4.0,
});

export const DEFAULT_EVENT_MODIFIERS = deepFreeze({
  normal: 1.0,
  rich_vein: 1.5,
  gold_rush: 3.0,
  earthquake: 2.0,
  meteor: 5.0,
});

export const DEFAULT_EVENT_QUANTITY_MULTIPLIERS = deepFreeze({
  normal: 1,
  rich_vein: 3,
  gold_rush: 1,
  earthquake: 2,
  meteor: 1,
});

export const DEFAULT_LUCKY_STRIKE = deepFreeze({
  baseRate: 0.0015,
  minimumTier: 'Haunted',
  eventChanceMultipliers: {
    normal: 1.0,
    rich_vein: 1.0,
    gold_rush: 3.0,
    earthquake: 1.0,
    meteor: 5.0,
  },
});

export const DEFAULT_OFFLINE_CONFIG = deepFreeze({
  varianceRatio: 0.1,
  monotonicCapRatio: 0.9,
  maxAdjustedChance: 0.99,
});

export const DEFAULT_RNG_CONFIG = deepFreeze({
  tiers: DEFAULT_RARITY_TIERS,
  biomeModifiers: DEFAULT_BIOME_MODIFIERS,
  eventModifiers: DEFAULT_EVENT_MODIFIERS,
  eventQuantityMultipliers: DEFAULT_EVENT_QUANTITY_MULTIPLIERS,
  luckyStrike: DEFAULT_LUCKY_STRIKE,
  offline: DEFAULT_OFFLINE_CONFIG,
});

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);

  for (const child of Object.values(value)) {
    deepFreeze(child);
  }

  return value;
}
