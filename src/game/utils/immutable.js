import { toFiniteNumber } from './math.js';

export function freezeCopy(value) {
  return deepFreeze(structuredCloneSafe(value));
}

export function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);

  for (const child of Object.values(value)) {
    deepFreeze(child);
  }

  return value;
}

export function copyObject(value = {}) {
  return { ...value };
}

export function copyArray(value = []) {
  return Array.isArray(value) ? [...value] : [];
}

export function mapValues(object, iteratee) {
  return Object.fromEntries(
    Object.entries(object ?? {}).map(([key, value]) => [key, iteratee(value, key)]),
  );
}

export function withUpdatedKey(object, key, updater) {
  return {
    ...(object ?? {}),
    [key]: updater(object?.[key]),
  };
}

export function mergeDefined(...sources) {
  return sources.reduce((accumulator, source) => {
    for (const [key, value] of Object.entries(source ?? {})) {
      if (value !== undefined) {
        accumulator[key] = value;
      }
    }

    return accumulator;
  }, {});
}

export function createCounterMap(keys, initialValue = 0) {
  const baseValue = toFiniteNumber(initialValue, 0);

  return Object.fromEntries((keys ?? []).map((key) => [key, baseValue]));
}

export function resetCounterKeys(counterMap, keysToReset, resetValue = 0) {
  const keySet = new Set(keysToReset ?? []);
  const nextValue = toFiniteNumber(resetValue, 0);

  return mapValues(counterMap ?? {}, (value, key) => (keySet.has(key) ? nextValue : value));
}

function structuredCloneSafe(value) {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}
