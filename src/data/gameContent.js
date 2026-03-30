import bandA from './biomes-band-a.js';
import bandB from './biomes-band-b.js';
import bandC from './biomes-band-c.js';
import bandD from './biomes-band-d.js';

const RAW_BANDS = [
  {
    id: 'band-a',
    label: 'Surface Chain',
    summary: 'Starter zones that teach digging, selling, and safe progression.',
    biomes: bandA
  },
  {
    id: 'band-b',
    label: 'Pressure Frontier',
    summary: 'Mid-depth zones where hazards, rarities, and routing matter more.',
    biomes: bandB
  },
  {
    id: 'band-c',
    label: 'Deep Mantle',
    summary: 'Late-midgame zones built around specialization and stronger ore value.',
    biomes: bandC
  },
  {
    id: 'band-d',
    label: 'Mythic Descent',
    summary: 'Endgame zones for prestige chases and top-tier finds.',
    biomes: bandD
  }
];

const RARITY_TIERS = [
  ['Common', 'Familiar', '50% - 75%'],
  ['Uncommon', 'Familiar', '20% - 40%'],
  ['Rare', 'Familiar', '5% - 15%'],
  ['Epic', 'Familiar', '1% - 4%'],
  ['Legendary', 'Familiar', '0.1% - 0.8%'],
  ['Mythic', 'Excitement', '0.05% - 0.5%'],
  ['Ethereal', 'Excitement', '0.01% - 0.08%'],
  ['Transcendent', 'Excitement', '0.005% - 0.03%'],
  ['Secret', 'Adrenaline', '0.001% - 0.005%'],
  ['Divine Secret', 'Adrenaline', '0.0004% - 0.002%'],
  ['Prismatic Secret', 'Adrenaline', '0.0001% - 0.0008%'],
  ['Glitched', 'Adrenaline', '0.00003% - 0.0002%'],
  ['Voidbound', 'Legendary', '0.00001% - 0.00008%'],
  ['Celestial', 'Legendary', '0.000005% - 0.00003%'],
  ['Singularity', 'Legendary', '0.000001% - 0.00001%']
].map(([name, zone, dropRate], index) => ({
  tier: index + 1,
  name,
  zone,
  dropRate
}));

const OFFLINE_SYSTEMS = [
  {
    system: 'Ore Production',
    online: '100%',
    offline: '95%',
    reason: 'Your mine keeps earning while you are away.'
  },
  {
    system: 'Depth Progress',
    online: '100%',
    offline: '70%',
    reason: 'Depth still moves, but active play is still better for deep pushes.'
  },
  {
    system: 'Auto-Sell',
    online: '100%',
    offline: '95%',
    reason: 'Storage stays cleaner so comeback sessions are easier to read.'
  },
  {
    system: 'Event Generation',
    online: '100%',
    offline: '40%',
    reason: 'Most special moments still favor live play.'
  }
];

const HOW_TO_PLAY = [
  {
    title: 'Dig for ore',
    body: 'Use manual digging to start your haul, trigger finds, and kick your mine into motion.'
  },
  {
    title: 'Sell and upgrade',
    body: 'Turn ore into coins, then spend those coins on tools, storage, workers, and support buildings.'
  },
  {
    title: 'Push new zones',
    body: 'Go deeper, unlock new biomes, and mine richer pools with tougher hazards and better rewards.'
  },
  {
    title: 'Come back stronger',
    body: 'Offline progress keeps the mine working so every return session starts with momentum.'
  }
];

const CORE_LOOP = [
  {
    step: '01',
    title: 'Start a run',
    body: 'Dig manually, test a zone, and check which bottleneck shows up first.'
  },
  {
    step: '02',
    title: 'Build the machine',
    body: 'Upgrade output, storage, transport, and crew support so passive mining gets stronger.'
  },
  {
    step: '03',
    title: 'Push deeper',
    body: 'Use live play to break into harder zones, better rarity pools, and stronger economy spikes.'
  },
  {
    step: '04',
    title: 'Reinvest the return',
    body: 'Come back to ore, coins, contracts, and discoveries, then spend that gain on the next push.'
  }
];

const GUIDE_CARDS = [
  {
    title: 'Rarity rolls',
    body: 'Rare finds use streak smoothing, pity pressure, and lucky surges so jackpot moments stay exciting without feeling unfair.'
  },
  {
    title: 'Mine stability',
    body: 'Heat, pressure, air, light, integrity, and route stability all shape how safe and efficient your run feels.'
  },
  {
    title: 'Workers and support',
    body: 'Workers scale your mine, but housing, morale, safety, and support buildings decide how well that growth holds together.'
  },
  {
    title: 'Contracts and refining',
    body: 'Jobs turn targeted ore into fast cash, while the refinery upgrades low-rarity stock into stronger outputs.'
  }
];

const GOAL_TRACKS = [
  {
    title: 'Stabilize the mine',
    body: 'Keep storage, airflow, and support ahead of ore output so the mine does not choke itself.'
  },
  {
    title: 'Unlock more tools',
    body: 'Hire more workers to open new shifts, stronger policies, and deeper specialization.'
  },
  {
    title: 'Reach new bands',
    body: 'Each world band changes the mining economy and gives you stronger target drops.'
  },
  {
    title: 'Chase high rarity finds',
    body: 'Collect rare, epic, legendary, and mythic discoveries to raise your museum score and long-term progress.'
  }
];

export function createGameContent() {
  const biomes = normalizeBiomes(RAW_BANDS.flatMap((band) => band.biomes));
  const depthBands = buildDepthBands(biomes);
  const featuredBiomes = pickFeaturedBiomes(biomes);

  return {
    meta: {
      title: 'Virtual Miner',
      description: 'A playable idle mining game about digging, upgrades, zones, rare finds, and offline progress.'
    },
    biomes,
    systems: {
      rarityTiers: RARITY_TIERS,
      rarityZones: groupRarities(RARITY_TIERS),
      offlineSystems: OFFLINE_SYSTEMS,
      howToPlay: HOW_TO_PLAY,
      coreLoop: CORE_LOOP,
      guideCards: GUIDE_CARDS,
      goalTracks: GOAL_TRACKS,
      depthBands,
      featuredBiomes
    }
  };
}

function pickFeaturedBiomes(biomes) {
  return [0, 4, 9, 14, 19]
    .map((index) => biomes[index])
    .filter(Boolean)
    .map((biome) => ({
      id: biome.id,
      name: biome.name,
      depthLabel: biome.depthLabel,
      palette: biome.palette,
      signatureEconomy: biome.signatureEconomy,
      miningRule: biome.miningRule
    }));
}

function buildDepthBands(biomes) {
  return RAW_BANDS.map((band) => {
    const normalized = biomes.filter((biome) => band.biomes.some((source) => source.id === biome.id));
    const first = normalized[0];
    const last = normalized[normalized.length - 1];

    return {
      id: band.id,
      label: band.label,
      summary: band.summary,
      depthLabel: formatDepthRange({
        start: first?.globalDepth?.start ?? 0,
        end: last?.globalDepth?.end ?? first?.globalDepth?.end ?? 0
      }),
      biomes: normalized.map((biome) => biome.name)
    };
  });
}

function groupRarities(rarities) {
  return rarities.reduce((groups, rarity) => {
    if (!groups[rarity.zone]) {
      groups[rarity.zone] = [];
    }
    groups[rarity.zone].push(rarity);
    return groups;
  }, {});
}

export function normalizeBiomes(items) {
  const maxPriceSlot = getMaxPriceSlot(items);
  const priceLookup = buildPriceLookup(maxPriceSlot);

  return items
    .map((biome) => {
      const palette = biome.palette ?? {};
      const globalDepth = biome.globalDepth ?? biome.depth ?? {};

      return {
        ...biome,
        palette: {
          ...palette,
          accent: palette.accent ?? palette.primary ?? '#f5c96b',
          primary: palette.primary ?? palette.accent ?? '#f5c96b',
          background: palette.background ?? '#10141b',
          text: palette.text ?? '#f5efe3'
        },
        description: cleanText(biome.description),
        signatureEconomy: cleanText(biome.signatureEconomy ?? 'Specialized extraction economy'),
        miningRule: cleanText(biome.miningRule ?? 'Read terrain and optimize your route.'),
        signatureOre: biome.signatureOre ? toTitleCase(biome.signatureOre) : 'Unknown',
        hazards: Array.isArray(biome.hazards)
          ? biome.hazards
              .map((hazard) => {
                if (typeof hazard === 'string') {
                  return cleanText(hazard);
                }

                if (hazard && typeof hazard === 'object') {
                  return cleanText(hazard.name ?? hazard.effect ?? '');
                }

                return '';
              })
              .filter(Boolean)
          : [],
        globalDepth,
        depthLabel: formatDepthRange(globalDepth),
        strata: Array.isArray(biome.strata)
          ? biome.strata.map((stratum) => ({
              ...stratum,
              note: cleanText(stratum.note),
              depthRange: toDepthRange(stratum.depth)
            }))
          : [],
        ores: Array.isArray(biome.ores)
          ? biome.ores.map((ore) => ({
              ...ore,
              name: toTitleCase(ore.name),
              rarity: cleanText(ore.rarity),
              note: cleanText(ore.note),
              priceRange: priceLookup[ore.priceSlot] ?? priceLookup[maxPriceSlot] ?? null
            }))
          : []
      };
    })
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
}

function getMaxPriceSlot(items) {
  return items.reduce((maxSlot, biome) => {
    const biomeMax = (biome.ores ?? []).reduce((oreMax, ore) => Math.max(oreMax, ore.priceSlot ?? 0), 0);
    return Math.max(maxSlot, biomeMax);
  }, 0);
}

function buildPriceLookup(maxSlot) {
  const lookup = {};
  let minPrice = 10;
  let maxPrice = 35;

  for (let slot = 1; slot <= maxSlot; slot += 1) {
    lookup[slot] = {
      min: Math.round(minPrice),
      max: Math.round(maxPrice)
    };
    minPrice *= 1.45;
    maxPrice *= 1.55;
  }

  return lookup;
}

function toDepthRange(value) {
  if (!value || typeof value.start !== 'number' || typeof value.end !== 'number') {
    return null;
  }
  return { start: value.start, end: value.end };
}

function formatDepthRange(range) {
  if (!range || typeof range.start !== 'number' || typeof range.end !== 'number') {
    return 'Depth unknown';
  }
  return `${formatMeters(range.start)} - ${formatMeters(range.end)}`;
}

function formatMeters(value) {
  return `${Number(value).toLocaleString('en-US')}m`;
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function toTitleCase(value) {
  return String(value ?? '')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

const gameContent = createGameContent();

export default gameContent;
