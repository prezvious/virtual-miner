const raritySpan = {
  common: 18,
  uncommon: 24,
  rare: 30,
  epic: 38,
  legendary: 52
};

const makeOre = (name, rarity, priceSlot, note) => {
  const min = priceSlot * 120;
  const max = min + raritySpan[rarity];

  return {
    name,
    rarity,
    priceSlot,
    priceRange: { min, max },
    note
  };
};

export default [
  {
    id: 'topsoil-quarry',
    name: 'Topsoil Quarry',
    order: 1,
    globalDepth: { start: 0, end: 128000 },
    localDepthLimit: 128000,
    tagline: 'Rootbound earth with living price memory.',
    overview:
      'This biome is built from stacked farm soil, buried cobble, and mineral root systems that react to careless digging. Players learn to harvest around the living layers instead of stripping them flat. The economy rewards clean cuts, intact root lattices, and fast recovery from collapses.',
    visualIdentity: {
      palette: { base: '#8b6b43', accent: '#6b8e4d', glow: '#f0b24d' },
      lighting: 'Filtered daylight leaks through root vents and shallow sinkholes.',
      terrain: 'Loam, clay, chalk pockets, and buried fieldstone packed around root webs.',
      architecture: 'Timber braces, survey stakes, and reclaimed farm frame tunnels.',
      atmosphere: 'Wet soil, pollen dust, sap scent, and soft grit falling from above.',
      uiMotif: 'Survey markers, graft lines, and layered depth stamps.'
    },
    economySystem: {
      name: 'Root Ledger',
      summary:
        "Preserving root channels raises the next layer's value, while aggressive strip-mining lowers local price stability.",
      playerRule:
        'Finish a stratum without severing the root mesh and the following ore band receives a temporary price bonus.'
    },
    hazards: [
      {
        name: 'Rootlash Entanglement',
        effect: 'Fibrous roots whip around drills and slow extraction speed.',
        consequence: 'Combo chains stall until the player clears the bind.'
      },
      {
        name: 'Sinkpan Collapse',
        effect: 'Hidden soft spots give way under weight and swallow nearby tunnels.',
        consequence: 'The player drops into a lower pocket and loses stored ore from the impacted lane.'
      },
      {
        name: 'Lampblack Swarm',
        effect: 'Soot-heavy insects clog lights and coat nearby surfaces.',
        consequence: 'Vision radius shrinks until ash vents are cleared.'
      }
    ],
    strata: [
      {
        name: 'Loam Verge',
        depth: '0-32000m',
        matrix: 'Loose humus, buried cobble, and root threads stitched through damp dirt.',
        miningNote: 'Fast to cut, but root threads can redirect tool paths and waste swings.',
        ores: [
          makeOre('Taproot Amber', 'common', 1, 'Warm resin trapped in root knots near the surface.'),
          makeOre('Fieldglass', 'uncommon', 2, 'Green glass formed from ancient plow shards and silica seep.')
        ]
      },
      {
        name: 'Tiller Shelf',
        depth: '32000-64000m',
        matrix: 'Packed clay, worm channels, and hardpan stitched with buried stones.',
        miningNote: 'Clay rebounds on impact, so repeated hits are more efficient than single heavy strikes.',
        ores: [
          makeOre('Plow Nickel', 'rare', 3, 'Dense nickel that forms where old farm tools oxidized underground.'),
          makeOre('Seedstone', 'uncommon', 4, 'Pebbled mineral nodules that mimic dried seed pods.')
        ]
      },
      {
        name: 'Burrow Ledger',
        depth: '64000-96000m',
        matrix: 'Chalk pockets, dry root vaults, and fossilized burrow corridors.',
        miningNote: 'Open chambers encourage chain mining, but cave ceilings can fracture without warning.',
        ores: [
          makeOre('Thorn Quartz', 'rare', 5, 'Quartz splinters that grow along old root scars.'),
          makeOre('Moss Argent', 'epic', 6, 'Soft silver ore wrapped in mineral moss and sap haze.')
        ]
      },
      {
        name: 'Bedrock Garden',
        depth: '96000-128000m',
        matrix: 'Pressured stone with root fossils, mineral veins, and deep fungal residue.',
        miningNote: 'Deep cuts here are slow but highly profitable if the player avoids collapse damage.',
        ores: [
          makeOre('Clayrite', 'epic', 7, 'Ceramic ore hardened by centuries of pressure and mineral salt.'),
          makeOre('Crown Flint', 'legendary', 8, 'Dark flint crowned with luminous mineral veins.')
        ]
      }
    ]
  },
  {
    id: 'sediment-drift',
    name: 'Sediment Drift',
    order: 2,
    globalDepth: { start: 128000, end: 256000 },
    localDepthLimit: 128000,
    tagline: 'A market made of moving silt and fossil memory.',
    overview:
      'This biome is a layered floodplain fossilized under pressure, where every cut changes the sediment map. Players earn more when they mine in the correct order because the strata remember how they were opened. The deeper bands trade in relics, shells, and pressure-formed gems that only stabilize after long exposure.',
    visualIdentity: {
      palette: { base: '#5c6f7d', accent: '#b48b54', glow: '#f3e0b4' },
      lighting: 'Refracted light filters through suspended grit and shallow mineral water.',
      terrain: 'Laminated mud, shellbeds, marl sheets, and compressed silt ridges.',
      architecture: 'Curving channels, contour shelves, and flood-cut retaining walls.',
      atmosphere: 'Fine dust, wet clay, faint water pressure, and drifting mineral flakes.',
      uiMotif: 'Contour lines, depth gauges, and river map overlays.'
    },
    economySystem: {
      name: 'Strata Tithe',
      summary:
        'Keeping sediment bands intact raises the payout of the next band, while overmixing layers weakens local certainty but improves relic odds.',
      playerRule:
        'Clear each sediment band in sequence to stack a rolling price bonus on the next unlocked layer.'
    },
    hazards: [
      {
        name: 'Silt Blindness',
        effect: 'Thick particulate clouds cover ore nodes and confuse depth markers.',
        consequence: 'Mining speed drops until the player vents or filters the chamber.'
      },
      {
        name: 'Compass Slip',
        effect: 'Magnetic grains rotate bearings and distort tunnel orientation.',
        consequence: 'Route planning becomes unreliable and shortcut paths misalign.'
      },
      {
        name: 'Tidal Burp',
        effect: 'Pressure pockets blast heavy sludge into nearby shafts.',
        consequence: 'The player is pushed back and exposed layers may collapse.'
      }
    ],
    strata: [
      {
        name: 'Delta Wash',
        depth: '0-32000m',
        matrix: 'Soft river mud, broken shells, and gravel fans laid down by ancient currents.',
        miningNote: 'Easy to clear, but loose pockets can bury fresh openings if left unsupported.',
        ores: [
          makeOre('Shell Tin', 'common', 9, 'Tin plated by shell fragments and river salt.'),
          makeOre('Drift Opal', 'uncommon', 10, 'Pale opal formed in silt seams that moved with the current.')
        ]
      },
      {
        name: 'Silt Archive',
        depth: '32000-64000m',
        matrix: 'Laminated clay, leaf prints, fishbone seams, and compressed reed beds.',
        miningNote: 'Each clean slice reveals a new fossil line, so careful excavation increases returns.',
        ores: [
          makeOre('Archive Copper', 'rare', 11, 'Copper plates stamped by pressure and silt memory.'),
          makeOre('Pebble Jet', 'common', 12, 'Black jet stone trapped in rounded pebble clusters.')
        ]
      },
      {
        name: 'Pressure Bands',
        depth: '64000-96000m',
        matrix: 'Hard marl, sealed clay, and mineral ribbons compressed by long flood cycles.',
        miningNote: 'The layer resists burst mining, rewarding steady extraction over heavy impact.',
        ores: [
          makeOre('Reed Platinum', 'epic', 13, 'Platinum threaded with reed fibers preserved under pressure.'),
          makeOre('Basin Garnet', 'rare', 14, 'Deep red garnet crystallized in low-flow lake beds.')
        ]
      },
      {
        name: 'Current Bed',
        depth: '96000-128000m',
        matrix: 'Glassy marl, riverstone plates, and pressure-locked channels that still shift slightly.',
        miningNote: 'The bed can suddenly re-route forces, so players must keep tunnels open for drainage.',
        ores: [
          makeOre('Flood Pearl', 'legendary', 15, 'Large pearls grown in mineral pockets shaped by flood surges.'),
          makeOre('Tide Cobalt', 'epic', 16, 'Blue cobalt ore hardened by repeated tidal pressure.')
        ]
      }
    ]
  },
  {
    id: 'ironvein-tunnels',
    name: 'Ironvein Tunnels',
    order: 3,
    globalDepth: { start: 256000, end: 384000 },
    localDepthLimit: 128000,
    tagline: 'A living metal spine with charged rail seams.',
    overview:
      'This biome behaves like an underground forge network, with iron ribs that conduct heat and power across the whole layer stack. Players can turn the charge system into profit if they keep the rails stable. Overheating and magnetic recoil make careless mining expensive.',
    visualIdentity: {
      palette: { base: '#2f3338', accent: '#b55b39', glow: '#4de3e8' },
      lighting: 'Pulse-lit seams flicker through iron ribs and slag pockets.',
      terrain: 'Ferric shale, basalt ribs, slag glass, and metallic dust plates.',
      architecture: 'Rail arches, riveted braces, and forged conduit walls.',
      atmosphere: 'Hot iron, ozone, spark bursts, and low mechanical hum.',
      uiMotif: 'Gauges, circuit etching, and rail schematic lines.'
    },
    economySystem: {
      name: 'Backbone Forge',
      summary:
        'Charged seams refine ore values when the rail network stays stable, but overheating can wipe the bonus and trigger a reset.',
      playerRule:
        'Mine while the tunnel charge is stable to convert heat into a temporary price boost for nearby ores.'
    },
    hazards: [
      {
        name: 'Magnet Nerves',
        effect: 'Magnetic pulses pull tools toward walls and metal veins.',
        consequence: 'Precision drops and the player wastes swings against the tunnel edges.'
      },
      {
        name: 'Rivet Fracture',
        effect: 'Old braces snap when the tunnel vibrates too hard.',
        consequence: 'Support loss opens cave-ins that block the most valuable lanes.'
      },
      {
        name: 'Railstatic Bloom',
        effect: 'Electric arcs chain through wet ore and active machinery.',
        consequence: 'Stored power and automation efficiency temporarily fall.'
      }
    ],
    strata: [
      {
        name: 'Rust Verge',
        depth: '0-32000m',
        matrix: 'Oxidized shale, iron dust, and brittle surface ribs crusted in red rust.',
        miningNote: 'Quick to break, but rust dust can foul exposed machinery if left unattended.',
        ores: [
          makeOre('Anvil Ore', 'common', 17, 'Blocky iron lumps that ring like forged anvils.'),
          makeOre('Spark Hematite', 'uncommon', 18, 'Hematite flecked with tiny spark traces.')
        ]
      },
      {
        name: 'Rail Halls',
        depth: '32000-64000m',
        matrix: 'Ribbed basalt and iron rails that look engineered rather than natural.',
        miningNote: 'Rails can be harvested as a pathing bonus if the player keeps the charge aligned.',
        ores: [
          makeOre('Track Iron', 'rare', 19, 'Dense iron following the hall rails in clean bands.'),
          makeOre('Bolt Quartz', 'uncommon', 20, 'Quartz nodes locked around old fastener points.')
        ]
      },
      {
        name: 'Magnet Wedge',
        depth: '64000-96000m',
        matrix: 'Charged stone, ferric shards, and needle-like ore seams under tension.',
        miningNote: 'The magnetic field changes tool angles, so deliberate mining lines matter more than speed.',
        ores: [
          makeOre('Coil Magnetite', 'epic', 21, 'Magnetite curled into dense coil shapes.'),
          makeOre('Grate Copper', 'rare', 22, 'Copper lattice trapped in iron grate formations.')
        ]
      },
      {
        name: 'Forge Depths',
        depth: '96000-128000m',
        matrix: 'Slagglass walls, furnace scars, and heat-cracked vents still radiating power.',
        miningNote: 'The deepest layer rewards stable, heat-managed extraction and punishes overdriven drills.',
        ores: [
          makeOre('Furnace Platinum', 'legendary', 23, 'Platinum alloyed by furnace pressure and radiant heat.'),
          makeOre('Crucible Gold', 'epic', 24, 'Gold sealed in glassy crucible pockets.')
        ]
      }
    ]
  },
  {
    id: 'underground-river',
    name: 'Underground River',
    order: 4,
    globalDepth: { start: 384000, end: 512000 },
    localDepthLimit: 128000,
    tagline: 'A moving water market with pressure and current.',
    overview:
      'This biome follows a hidden river system that keeps shifting the value of the surrounding stone. Players need to mine with the current instead of fighting it, because blocked channels generate the worst outcomes. Channels, falls, and submerged vaults all carry different ore blends depending on how much flow is preserved.',
    visualIdentity: {
      palette: { base: '#214f63', accent: '#8fc7d9', glow: '#c7fff4' },
      lighting: 'Reflections from moving water and cold mineral sheen.',
      terrain: 'Wet gravel, submerged stone, spring vents, and flood-polished walls.',
      architecture: 'Arched culverts, water gates, and submerged terraces.',
      atmosphere: 'Cold mist, dripping echoes, current rumble, and clear mineral air.',
      uiMotif: 'Ripples, flow arrows, and tide line markers.'
    },
    economySystem: {
      name: 'Current Lease',
      summary:
        'Keeping channels open improves ore prices, while damming the river triggers surges that damage efficiency and reduce payout.',
      playerRule:
        'Preserve a path for water through each stratum to unlock stronger active bonuses and safer extraction.'
    },
    hazards: [
      {
        name: 'Undertow Bite',
        effect: 'Strong pull drags loose ore and tools toward hidden drains.',
        consequence: 'Dropped resources can be lost to the current if not recovered quickly.'
      },
      {
        name: 'Chill Pocket',
        effect: 'Sudden cold hardens mud and traps active shafts in ice-like clay.',
        consequence: 'Movement slows and the player must reopen the lane by force.'
      },
      {
        name: 'Echo Flood',
        effect: 'Sound vibrates through the channel and triggers a pressure surge.',
        consequence: 'Floodwater floods adjacent rooms and reduces short-term visibility.'
      }
    ],
    strata: [
      {
        name: 'Banked Run',
        depth: '0-32000m',
        matrix: 'River silt, rounded gravel, and shallow mineral seep lines.',
        miningNote: 'The easiest layer, but loose waterlogged pockets can slide into fresh tunnels.',
        ores: [
          makeOre('Brine Zinc', 'common', 25, 'Zinc laced with dissolved salt and stream residue.'),
          makeOre('Reed Jade', 'uncommon', 26, 'Jade wrapped in reed-like mineral fibers.')
        ]
      },
      {
        name: 'Flood Shelf',
        depth: '32000-64000m',
        matrix: 'Slick stone ledges, algae film, and mossy flood platforms.',
        miningNote: 'Mining open shelves too quickly can expose unstable water basins below.',
        ores: [
          makeOre('Undertow Opal', 'rare', 27, 'Opal with a watery interior that shimmers like a pull current.'),
          makeOre('Canal Argent', 'uncommon', 28, 'Silver-white ore formed along carved canal walls.')
        ]
      },
      {
        name: 'Understream Vault',
        depth: '64000-96000m',
        matrix: 'Submerged ledges, pressure pockets, and mineral springs tucked under the river bed.',
        miningNote: 'Players get better returns for opening linked chambers rather than isolated holes.',
        ores: [
          makeOre('Current Ruby', 'epic', 29, 'Ruby crystallized in the direction of the river flow.'),
          makeOre('Basin Pearl', 'rare', 30, 'Pearl clusters grown in deep mineral basins.')
        ]
      },
      {
        name: 'Estuary Core',
        depth: '96000-128000m',
        matrix: 'Black water caverns, pressure stone, and mineral springs feeding the deepest channel.',
        miningNote: 'The core rewards precise flow management and punishes any blocked exit path.',
        ores: [
          makeOre('Deepflow Diamond', 'legendary', 31, 'Diamond grown in long-flow pressure pockets.'),
          makeOre('Tidemark Electrum', 'epic', 32, 'Electrum marked by tidal mineral bands and flood lines.')
        ]
      }
    ]
  },
  {
    id: 'fungal-grotto',
    name: 'Fungal Grotto',
    order: 5,
    globalDepth: { start: 512000, end: 640000 },
    localDepthLimit: 128000,
    tagline: 'A living cave where spores set the market tone.',
    overview:
      'This biome is a damp fungal ecosystem that metabolizes mineral seams into strange, high-value ores. Players can cultivate the cave for better yields, but the same biology also spreads corruption if it is ignored. Humidity, light, and active growth become strategic resources instead of flavor dressing.',
    visualIdentity: {
      palette: { base: '#35513a', accent: '#d7c45e', glow: '#7df0c7' },
      lighting: 'Bioluminescent caps and soft fungal pulse light the chamber.',
      terrain: 'Peat mats, damp limestone, root veils, and sponge-like mineral shelves.',
      architecture: 'Mycelial arches, cap domes, and thread-woven tunnel ribs.',
      atmosphere: 'Humid air, sweet rot, drifting spores, and soft organic crackle.',
      uiMotif: 'Petal rings, thread maps, and growth halos.'
    },
    economySystem: {
      name: 'Spore Dividend',
      summary:
        'Healthy fungus raises nearby ore quality, while toxic blooms spread decay that cuts value and slows progress.',
      playerRule:
        "Maintain the grotto's growth balance to improve drop quality and unlock stronger ore bands deeper in the cave."
    },
    hazards: [
      {
        name: 'Spore Bloom',
        effect: 'A sudden cloud of spores blurs the chamber and settles on gear.',
        consequence: 'The player suffers slower mining and reduced clarity until the bloom is vented.'
      },
      {
        name: 'Mycelial Stitch',
        effect: 'Threadlike fungus knits tunnel exits shut as soon as they are opened.',
        consequence: 'Paths reroute and previously safe shortcuts become trapped.'
      },
      {
        name: 'Lantern Mold',
        effect: 'Light-eating mold drains lamp power and dims the cave floor.',
        consequence: 'Visibility shrinks and rare ore becomes harder to spot.'
      }
    ],
    strata: [
      {
        name: 'Spore Lawn',
        depth: '0-32000m',
        matrix: 'Peat mats, fungus felt, and damp soil filled with soft cap growth.',
        miningNote: 'Easy to cut, but disturbing the lawn can trigger local spore clouds.',
        ores: [
          makeOre('Puffstone', 'common', 33, 'Light stone that cracks like dried mushroom caps.'),
          makeOre('Myco Nickel', 'uncommon', 34, 'Nickel tangled through mycelium veins.')
        ]
      },
      {
        name: 'Hyphae Maze',
        depth: '32000-64000m',
        matrix: 'Threadlike root mesh, wet limestone, and branching fungal corridors.',
        miningNote: 'Pathfinding matters here because the maze reknits behind the player over time.',
        ores: [
          makeOre('Thread Opal', 'rare', 35, 'Opal grown inside fine fungal threads.'),
          makeOre('Cap Copper', 'uncommon', 36, 'Copper formed under thick cap clusters.')
        ]
      },
      {
        name: 'Bloom Vault',
        depth: '64000-96000m',
        matrix: 'Bioluminescent shelves, compost crystal, and layered fungal columns.',
        miningNote: 'The vault pays best when light and moisture are kept stable across the room.',
        ores: [
          makeOre('Lantern Amber', 'epic', 37, 'Amber that stores lantern light inside resin pockets.'),
          makeOre('Spindle Argent', 'rare', 38, 'Silver ore shaped by spindle-like fungal spires.')
        ]
      },
      {
        name: 'Sporesink Heart',
        depth: '96000-128000m',
        matrix: 'Saturated fungal cathedral walls, dark compost stone, and deep root vessels.',
        miningNote: 'This deepest layer rewards carefully managed growth and punishes unattended decay.',
        ores: [
          makeOre('Mycelium Sapphire', 'legendary', 39, 'Sapphire laced with living mycelial filaments.'),
          makeOre('Bloomcore Onyx', 'epic', 40, 'Heavy onyx grown in the fungal core around nutrient wells.')
        ]
      }
    ]
  }
];
