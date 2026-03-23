import {
  DEFAULT_BIOME_MODIFIERS,
  DEFAULT_EVENT_MODIFIERS,
  DEFAULT_LUCKY_STRIKE,
} from '../data/rngConfig.js';
import { clampNumber, safeLog1p, toFiniteNumber } from './math.js';

export function normalizeKey(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function getScannerModifier(scannerLevel = 0) {
  const level = clampNumber(scannerLevel, 0);

  return 1 + (0.08 * level) + (0.005 * Math.pow(level, 1.3));
}

export function getPrestigeModifier(fortuneLevel = 0) {
  return 1 + (0.12 * clampNumber(fortuneLevel, 0));
}

export function getBiomeModifier(biome, biomeModifiers = DEFAULT_BIOME_MODIFIERS) {
  const key = normalizeKey(typeof biome === 'string' ? biome : biome?.id ?? biome?.name);

  return biomeModifiers[key] ?? 1;
}

export function getDepthModifier(depth = 0) {
  return 1 + (safeLog1p(toFiniteNumber(depth, 0) / 1000) * 0.15);
}

export function getEventModifier(eventKey = 'normal', eventModifiers = DEFAULT_EVENT_MODIFIERS) {
  return eventModifiers[normalizeKey(eventKey)] ?? 1;
}

export function getCollectionModifier(uniqueResourcesDiscovered = 0) {
  return 1 + (0.01 * clampNumber(uniqueResourcesDiscovered, 0));
}

export function getComboModifier(comboCount = 0) {
  return 1 + (Math.min(clampNumber(comboCount, 0), 100) * 0.003);
}

export function getCombinedRarityModifier(input = {}) {
  const scannerModifier = input.scannerModifier ?? getScannerModifier(input.scannerLevel);
  const prestigeModifier = input.prestigeModifier ?? getPrestigeModifier(input.fortuneLevel ?? input.prestigeLevel);
  const biomeModifier = input.biomeModifier ?? getBiomeModifier(input.biome, input.biomeModifiers);
  const depthModifier = input.depthModifier ?? getDepthModifier(input.depth);
  const eventModifier = input.eventModifier ?? getEventModifier(input.eventKey, input.eventModifiers);
  const collectionModifier = input.collectionModifier ?? getCollectionModifier(input.uniqueResourcesDiscovered);
  const comboModifier = input.comboModifier ?? getComboModifier(input.comboCount);

  return (
    scannerModifier *
    prestigeModifier *
    biomeModifier *
    depthModifier *
    eventModifier *
    collectionModifier *
    comboModifier
  );
}

export function getLuckyStrikeChance({
  baseRate = DEFAULT_LUCKY_STRIKE.baseRate,
  eventKey = 'normal',
  eventChanceMultipliers = DEFAULT_LUCKY_STRIKE.eventChanceMultipliers,
  cosmicMagnetismLevel = 0,
} = {}) {
  const eventModifier = eventChanceMultipliers[normalizeKey(eventKey)] ?? 1;
  const cosmicMagnetismBonus = 1 + (0.1 * clampNumber(cosmicMagnetismLevel, 0));

  return baseRate * eventModifier * cosmicMagnetismBonus;
}
