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

const SCALE_SUFFIXES = [
  { threshold: 1e21, suffix: 'Sx' },
  { threshold: 1e18, suffix: 'Qi' },
  { threshold: 1e15, suffix: 'Qa' },
  { threshold: 1e12, suffix: 'T' },
  { threshold: 1e9,  suffix: 'B' },
  { threshold: 1e6,  suffix: 'M' },
  { threshold: 1e3,  suffix: 'K' },
];

export function formatLargeNumber(value) {
  const numeric = toFiniteNumber(value, 0);
  const abs = Math.abs(numeric);
  const sign = numeric < 0 ? '-' : '';

  if (abs < 1_000) {
    return integerFormatter.format(numeric);
  }

  for (const { threshold, suffix } of SCALE_SUFFIXES) {
    if (abs >= threshold) {
      const scaled = abs / threshold;

      if (scaled < 10) {
        return `${sign}${Math.floor(scaled * 100) / 100}${suffix}`;
      }
      if (scaled < 100) {
        return `${sign}${Math.floor(scaled * 10) / 10}${suffix}`;
      }
      return `${sign}${Math.floor(scaled)}${suffix}`;
    }
  }

  return integerFormatter.format(numeric);
}

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
  return `${formatLargeNumber(value)} m`;
}

export function formatCredits(value, symbol = '¢') {
  const numeric = toFiniteNumber(value, 0);
  if (Math.abs(numeric) >= 1_000) {
    return `${symbol}${formatLargeNumber(numeric)}`;
  }
  return `${symbol}${decimalFormatter.format(numeric)}`;
}

export function formatSignedDelta(value, fractionDigits = 2) {
  const numeric = toFiniteNumber(value, 0);
  const prefix = numeric > 0 ? '+' : '';

  return `${prefix}${formatDecimal(numeric, fractionDigits)}`;
}

export function formatMeters(value) {
  return `${formatLargeNumber(value)} m`;
}

export function formatSimpleNumber(value) {
  return formatLargeNumber(value);
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#96;');
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
