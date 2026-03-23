import { clampNumber, toFiniteNumber } from './math.js';

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatCompactNumber(value) {
  return compactFormatter.format(toFiniteNumber(value, 0));
}

export function formatInteger(value) {
  return integerFormatter.format(toFiniteNumber(value, 0));
}

export function formatDecimal(value, fractionDigits = 2) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: clampNumber(fractionDigits, 0, 20),
  }).format(toFiniteNumber(value, 0));
}

export function formatPercent(value, fractionDigits = 2) {
  const normalized = toFiniteNumber(value, 0);
  const percentage = normalized <= 1 ? normalized * 100 : normalized;

  return `${formatDecimal(percentage, fractionDigits)}%`;
}

export function formatMultiplier(value, fractionDigits = 2) {
  return `${formatDecimal(value, fractionDigits)}x`;
}

export function formatDepth(value) {
  return `${formatInteger(value)} m`;
}

export function formatCredits(value, symbol = '¢') {
  return `${symbol}${decimalFormatter.format(toFiniteNumber(value, 0))}`;
}

export function formatSignedDelta(value, fractionDigits = 2) {
  const numeric = toFiniteNumber(value, 0);
  const prefix = numeric > 0 ? '+' : '';

  return `${prefix}${formatDecimal(numeric, fractionDigits)}`;
}

export function formatDuration(totalSeconds = 0) {
  let remaining = Math.max(0, Math.floor(toFiniteNumber(totalSeconds, 0)));
  const hours = Math.floor(remaining / 3600);

  remaining -= hours * 3600;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining - (minutes * 60);
  const parts = [];

  if (hours) {
    parts.push(`${hours}h`);
  }

  if (hours || minutes) {
    parts.push(`${minutes}m`);
  }

  parts.push(`${seconds}s`);

  return parts.join(' ');
}
