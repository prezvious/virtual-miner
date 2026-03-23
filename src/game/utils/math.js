export function clampNumber(value, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) {
  const numeric = toFiniteNumber(value, min);

  return Math.min(Math.max(numeric, min), max);
}

export function toFiniteNumber(value, fallback = 0) {
  const numeric = Number(value);

  return Number.isFinite(numeric) ? numeric : fallback;
}

export function floorNumber(value, fallback = 0) {
  return Math.floor(toFiniteNumber(value, fallback));
}

export function safeLog1p(value) {
  return Math.log1p(Math.max(0, toFiniteNumber(value, 0)));
}

export function sumNumbers(values) {
  return values.reduce((sum, value) => sum + toFiniteNumber(value, 0), 0);
}

export function sumBy(items, iteratee) {
  return items.reduce((sum, item, index) => sum + toFiniteNumber(iteratee(item, index), 0), 0);
}

export function weightedPick(items, getWeight, rng = Math.random) {
  const weightedItems = items
    .map((item, index) => ({ item, index, weight: Math.max(0, toFiniteNumber(getWeight(item, index), 0)) }))
    .filter((entry) => entry.weight > 0);

  if (!weightedItems.length) {
    return null;
  }

  const totalWeight = sumBy(weightedItems, (entry) => entry.weight);
  const roll = clampNumber(rng(), 0, 0.999999999999) * totalWeight;

  let cursor = 0;

  for (const entry of weightedItems) {
    cursor += entry.weight;

    if (roll < cursor) {
      return entry.item;
    }
  }

  return weightedItems[weightedItems.length - 1].item;
}

export function normalizeWeights(items, getWeight) {
  const weightedItems = items.map((item, index) => ({
    item,
    weight: Math.max(0, toFiniteNumber(getWeight(item, index), 0)),
  }));
  const totalWeight = sumBy(weightedItems, (entry) => entry.weight);

  if (totalWeight <= 0) {
    return weightedItems.map(({ item }) => ({ item, weight: 0, share: 0 }));
  }

  return weightedItems.map(({ item, weight }) => ({
    item,
    weight,
    share: weight / totalWeight,
  }));
}

export function largestRemainderAllocation(total, entries, getShare, rng = Math.random) {
  const targetTotal = Math.max(0, floorNumber(total, 0));
  const prepared = entries.map((entry, index) => {
    const share = Math.max(0, toFiniteNumber(getShare(entry, index), 0));
    const raw = share * targetTotal;
    const base = Math.floor(raw);

    return {
      entry,
      base,
      remainder: raw - base,
      tieBreaker: clampNumber(rng(), 0, 1),
    };
  });

  const allocated = sumBy(prepared, (item) => item.base);
  let remainderBudget = targetTotal - allocated;

  prepared.sort((left, right) => {
    if (right.remainder !== left.remainder) {
      return right.remainder - left.remainder;
    }

    return right.tieBreaker - left.tieBreaker;
  });

  for (const item of prepared) {
    if (remainderBudget <= 0) {
      break;
    }

    item.base += 1;
    remainderBudget -= 1;
  }

  return prepared.map(({ entry, base }) => ({ entry, count: base }));
}

export function createRandomSource(seedRandom) {
  return typeof seedRandom === 'function' ? seedRandom : Math.random;
}
