import bandA from './biomes-band-a.js';
import bandB from './biomes-band-b.js';
import bandC from './biomes-band-c.js';
import bandD from './biomes-band-d.js';

const RAW_BANDS = [
  {
    id: 'band-a',
    label: 'Surface Chain',
    summary: 'Early layers teach rhythm, risk, and route selection without overwhelming the player.',
    biomes: bandA,
  },
  {
    id: 'band-b',
    label: 'Pressure Frontier',
    summary: 'Automation begins to matter as hazards, rarity spikes, and route discipline collide.',
    biomes: bandB,
  },
  {
    id: 'band-c',
    label: 'Deep Mantle',
    summary: 'Midgame biomes lean into spectacle, specialization, and stronger economic identity.',
    biomes: bandC,
  },
  {
    id: 'band-d',
    label: 'Mythic Descent',
    summary: 'Late-game layers turn the world into an endgame chase built around prestige and legendary drops.',
    biomes: bandD,
  },
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
  ['Singularity', 'Legendary', '0.000001% - 0.00001%'],
].map(([name, zone, dropRate], index) => ({
  tier: index + 1,
  name,
  zone,
  dropRate,
}));

const OFFLINE_SYSTEMS = [
  {
    system: 'Ore Production',
    online: '100%',
    offline: '95%',
    reason: 'Mining yield stays strong so stepping away feels safe, not punishing.',
  },
  {
    system: 'Depth Progress',
    online: '100%',
    offline: '70%',
    reason: 'Progress continues, but pushing deeper still rewards active sessions.',
  },
  {
    system: 'Auto-Sell',
    online: '100%',
    offline: '95%',
    reason: 'Inventory pressure stays low and the return loop is cleaner.',
  },
  {
    system: 'Event Generation',
    online: '100%',
    offline: '40%',
    reason: 'Flashpoint moments remain special and tied to live play.',
  },
];

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
          text: palette.text ?? '#f5efe3',
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
              depthRange: toDepthRange(stratum.depth),
            }))
          : [],
        ores: Array.isArray(biome.ores)
          ? biome.ores.map((ore) => ({
              ...ore,
              name: toTitleCase(ore.name),
              rarity: cleanText(ore.rarity),
              note: cleanText(ore.note),
              priceRange: priceLookup[ore.priceSlot] ?? priceLookup[maxPriceSlot] ?? null,
            }))
          : [],
      };
    })
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
}

export function createSiteContent() {
  const biomes = normalizeBiomes(RAW_BANDS.flatMap((band) => band.biomes));
  const depthBands = buildDepthBands(biomes);
  const featuredBiomes = pickFeaturedBiomes(biomes);

  return {
    meta: {
      title: 'Virtual Miner | Idle Mining That Respects Player Time',
      description:
        'A full-scale idle mining concept built around respectful offline progression, hybrid RNG, biome-specific economies, and cinematic return loops.',
    },
    shell: {
      brand: {
        name: 'Virtual Miner',
        label: 'Product Concept Site',
        tagline: 'Editorial reveal shell for a deep idle mining game with prestige and legendary drop chases.',
      },
      navigation: [
        { id: 'hero', label: 'Overview' },
        { id: 'loop', label: 'Loop' },
        { id: 'playable', label: 'Command Deck' },
        { id: 'systems', label: 'Systems' },
        { id: 'world', label: 'World' },
        { id: 'roadmap', label: 'Roadmap' },
        { id: 'cta', label: 'Playbook' },
      ],
    },
    hero: {
      eyebrow: 'Idle Mining, Reframed',
      title: 'Build a mining world that keeps moving when the player is away.',
      description:
        'Virtual Miner is positioned as a respectful idle game: automate extraction, push into authored biomes, and come back to meaningful progress instead of cleanup chores.',
      supportingCopy:
        'The shell turns the atlas prototype into a broader product narrative spanning world structure, hybrid RNG, prestige planning, and the welcome-back report loop.',
      primaryCta: { href: '#playable', label: 'Enter the command deck' },
      secondaryCta: { href: '#loop', label: 'Inspect the core loop' },
      stats: [
        { value: '95%', label: 'Offline ore output retained' },
        { value: `${biomes.length}`, label: 'Biome economies in the concept world' },
        { value: `${RAW_BANDS.length}`, label: 'World bands staged across progression' },
        { value: `${RARITY_TIERS.length}`, label: 'Rarity tiers from common to singularity' },
      ],
      featureCards: [
        {
          title: 'Offline respect',
          body: 'Core systems remain productive even after long breaks, with a 7-day absolute simulation cap to keep the economy readable.',
        },
        {
          title: 'RNG with memory',
          body: 'Pseudo-random distribution, pity timers, and lucky strikes work together so rare finds stay thrilling without feeling rigged.',
        },
        {
          title: 'Biomes as product pillars',
          body: 'Each descent zone carries a visual palette, mining rule, hazard language, and signature economy instead of acting like a reskin.',
        },
      ],
      spotlightBiomes: featuredBiomes.slice(0, 3),
    },
    loop: {
      title: 'A loop designed around momentum instead of maintenance',
      intro:
        'The product shell centers on four beats: set intent, automate output, let the simulation work, then return to a welcome-back report that surfaces the best moments.',
      steps: [
        {
          title: 'Mine with intent',
          body: 'Players choose routes, watch strata behavior, and push toward ore or event thresholds instead of tapping endlessly.',
        },
        {
          title: 'Lock in automation',
          body: 'Upgrades, auto-sell, and production systems convert the active session into an engine the player can trust.',
        },
        {
          title: 'Step away safely',
          body: 'Offline systems keep the mine alive, with tuned efficiency values that reward investment without erasing active play.',
        },
        {
          title: 'Return to a report, not a spreadsheet',
          body: 'The comeback loop highlights ore volume, depth gained, notable discoveries, and milestone events in a single readable summary.',
        },
      ],
      principles: [
        'Respect player time without flattening mastery.',
        'Keep the return loop exciting through surfaced highlights.',
        'Let authored biomes drive progression identity.',
      ],
    },
    systems: {
      title: 'Systems tuned for long-term obsession',
      pillars: [
        {
          title: 'Hybrid adaptive RNG',
          summary: 'PRD smooths streaks, pity builds pressure, and lucky strikes preserve the outlier jackpot moment.',
        },
        {
          title: 'Offline simulation as a product promise',
          summary: 'Ore, selling, and partial depth progress continue so the game feels generous instead of needy.',
        },
        {
          title: 'Biome-specific economies',
          summary: 'Each zone introduces distinct signatures, hazards, and extraction logic that reshape how upgrades pay off.',
        },
        {
          title: 'Dream Mining prestige',
          summary: 'Prestige is framed as a larger aspiration system, not just a reset, with layered progression hooks for late-game play.',
        },
      ],
      rarityTiers: RARITY_TIERS,
      rarityZones: groupRarities(RARITY_TIERS),
      rngLayers: [
        { name: 'PRD', body: 'Smooths variance so base rarity feels fair over time.' },
        { name: 'Pity Timer', body: 'Raises hidden pressure after dry spells on top-end rewards.' },
        { name: 'Lucky Strike', body: 'Injects genuine surge moments so a return session can still shock the player.' },
      ],
      offlineSystems: OFFLINE_SYSTEMS,
    },
    world: {
      title: 'A vertical world built like a campaign map',
      summary:
        'The shell keeps biome data reusable from the atlas prototype, but repackages it as a marketing surface: a guided descent through authored economies and visual regimes.',
      totalDepthLabel: formatMeters(getDeepestPoint(biomes)),
      depthBands,
      featuredBiomes,
      biomeShowcase: biomes.map((biome) => ({
        id: biome.id,
        name: biome.name,
        depthLabel: biome.depthLabel,
        signatureEconomy: biome.signatureEconomy,
        miningRule: biome.miningRule,
        signatureOre: biome.signatureOre,
        hazards: biome.hazards.slice(0, 3),
        palette: biome.palette,
      })),
      economyHighlights: featuredBiomes.map((biome) => ({
        name: biome.name,
        body: `${biome.signatureEconomy} Active rule: ${biome.miningRule}`,
      })),
    },
    roadmap: {
      title: 'Roadmap from prototype to full product pitch',
      phases: [
        {
          phase: 'Phase 01',
          title: 'Respectful idle core',
          body: 'Ship the offline simulation promise, welcome-back reporting, and foundational upgrade economy.',
        },
        {
          phase: 'Phase 02',
          title: 'World-scale authored progression',
          body: 'Expand the concept atlas into a structured descent where each band changes the player’s mental model.',
        },
        {
          phase: 'Phase 03',
          title: 'Prestige and legendary pressure',
          body: 'Introduce Dream Mining loops, long-tail rarity targets, and stronger late-game reason to optimize.',
        },
        {
          phase: 'Phase 04',
          title: 'Mythic endgame surface',
          body: 'Connect the final biomes into event-heavy, prestige-aware systems that feel like a true endpoint layer.',
        },
      ],
    },
    cta: {
      eyebrow: 'Build From the Shell',
      title: 'The atlas is now content input. The website becomes the product narrative.',
      description:
        'This shell is designed to let specialized section renderers own visual execution while a central content model keeps the story, world data, and systems aligned.',
      primaryAction: { href: '#playable', label: 'Enter the command deck' },
      secondaryAction: { href: '#roadmap', label: 'Review roadmap' },
      notes: [
        'Offline depth can continue while away, but with a tuned cap.',
        'A 7-day absolute offline window keeps simulation bounded.',
        'The welcome-back report is treated as a first-class experience, not an afterthought.',
      ],
    },
    footer: {
      note: 'Concept shell for a full-scale Virtual Miner marketing and product website.',
      links: [
        { href: '#hero', label: 'Overview' },
        { href: '#playable', label: 'Command Deck' },
        { href: '#world', label: 'World' },
        { href: '#roadmap', label: 'Roadmap' },
      ],
    },
    biomes,
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
      miningRule: biome.miningRule,
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
        end: last?.globalDepth?.end ?? first?.globalDepth?.end ?? 0,
      }),
      biomes: normalized.map((biome) => biome.name),
    };
  });
}

function groupRarities(rarities) {
  return rarities.reduce((groups, rarity) => {
    if (!groups[rarity.zone]) groups[rarity.zone] = [];
    groups[rarity.zone].push(rarity);
    return groups;
  }, {});
}

function getDeepestPoint(biomes) {
  return biomes.reduce((maxDepth, biome) => Math.max(maxDepth, biome.globalDepth?.end ?? 0), 0);
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
      max: Math.round(maxPrice),
    };
    minPrice *= 1.45;
    maxPrice *= 1.55;
  }

  return lookup;
}

function toDepthRange(value) {
  if (!value || typeof value.start !== 'number' || typeof value.end !== 'number') return null;
  return { start: value.start, end: value.end };
}

function formatDepthRange(range) {
  if (!range || typeof range.start !== 'number' || typeof range.end !== 'number') return 'Depth unknown';
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

const siteContent = createSiteContent();

export default siteContent;
