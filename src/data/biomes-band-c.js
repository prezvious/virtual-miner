export default [
  {
    id: 'frozen-depths',
    name: 'Frozen Depths',
    order: 11,
    globalDepth: { start: 1280000, end: 1408000 },
    localDepthLimit: 128000,
    tagline: 'Where the ice remembers every strike.',
    overview:
      'Frozen Depths is a pressure sealed world of buried frost, brittle blue stone, and silent seams that can split without warning. It rewards careful routing and fast extraction because cold undermines stockpiles almost as fast as the hazards do.',
    visualIdentity: {
      palette: { base: '#dceef7', accent: '#8fb9cf', glow: '#bff6ff' },
      lighting: 'Refracted glacier light leaks through the walls like a dim underwater noon.',
      terrain: 'Powdered permafrost, froststone plates, and glassy ice ridges form the soil ladder.',
      architecture: 'Buried ice ribs and frozen archways create narrow tunnels with hard edges.',
      atmosphere: 'Hushed, brittle, and breath-fog cold with constant micro-cracking in the distance.',
      uiMotif: 'Frosted panels, crack lines, and pale cyan depth markers.'
    },
    economySystem: {
      name: 'Thermal Debt Ledger',
      summary:
        'Ore value depends on heat retention. Cold stock loses premium unless the player warms it or sells quickly through insulated routing.',
      playerRule:
        'Keep ore moving or park it in heated storage, or the market price falls one tier at a time.'
    },
    hazards: [
      {
        name: 'Rime Lock',
        effect: 'Freezing vapor clamps drill heads and conveyor joints, slowing all movement in the lane.',
        consequence: 'If ignored, extraction speed drops enough to erase the zone bonus.'
      },
      {
        name: 'Whiteout Echo',
        effect: 'Surface glare spills into the mine and briefly masks nearby seams and traps.',
        consequence: 'Players can misread tunnel shape and waste turns on dead ends.'
      },
      {
        name: 'Frostbite Yield',
        effect: 'Repeated mining in one seam chills the deposit and lowers its payout.',
        consequence: 'Staying in place too long creates a direct efficiency penalty.'
      }
    ],
    strata: [
      {
        name: 'Snowglass Shelf',
        depth: '0-32000m',
        matrix: 'Powdered permafrost packed around translucent slushstone and thin ice films.',
        miningNote: 'Light strikes can reveal hidden seams, but each reveal also triggers a cold pulse.',
        ores: [
          {
            name: 'Glacierine',
            rarity: 'Uncommon',
            priceSlot: 81,
            note: 'A soft blue crystal that sells best while still partially frozen.'
          },
          {
            name: 'Cryosteel Vein',
            rarity: 'Rare',
            priceSlot: 82,
            note: 'Dense ore that holds its value only if moved through heated stock paths.'
          }
        ]
      },
      {
        name: 'Sleet Pressure',
        depth: '32001-64000m',
        matrix: 'Compressed hail bands and ice shale fused into hard, slamming layers.',
        miningNote: 'Heavy impacts can fracture adjacent tiles, which is useful but risky.',
        ores: [
          {
            name: 'Brine Quartz',
            rarity: 'Rare',
            priceSlot: 83,
            note: 'Salted crystal pockets that keep a high melt premium.'
          },
          {
            name: 'Frostwake Nickel',
            rarity: 'Epic',
            priceSlot: 84,
            note: 'Conductive metal that gains bonus value when extracted in a clean chain.'
          }
        ]
      },
      {
        name: 'Mirror Chasm',
        depth: '64001-96000m',
        matrix: 'Reflective ice plates float over trapped air voids and brittle black seams.',
        miningNote: 'Breaking one tile can duplicate nearby hazard triggers one tile over.',
        ores: [
          {
            name: 'Polarshard Amber',
            rarity: 'Epic',
            priceSlot: 85,
            note: 'Amber with frozen insects that makes collectors pay a premium.'
          },
          {
            name: 'Auralith Glass',
            rarity: 'Legendary',
            priceSlot: 86,
            note: 'A resonant crystal that rings out when it is mined correctly.'
          }
        ]
      },
      {
        name: 'Subzero Rootbed',
        depth: '96001-128000m',
        matrix: 'Ancient tundra fossils sealed under black ice and compacted snow clay.',
        miningNote: 'The deeper layers slow movement sharply but increase rare seam density.',
        ores: [
          {
            name: 'Heartfreezium',
            rarity: 'Legendary',
            priceSlot: 87,
            note: 'A core mineral that only holds top value when warmed immediately.'
          },
          {
            name: 'Dusk Permafrite',
            rarity: 'Mythic',
            priceSlot: 88,
            note: 'A dark frost relic that survives pressure and sells as a luxury export.'
          }
        ]
      }
    ]
  },
  {
    id: 'bioluminescent-deep',
    name: 'Bioluminescent Deep',
    order: 12,
    globalDepth: { start: 1408000, end: 1536000 },
    localDepthLimit: 128000,
    tagline: 'Glow is currency and silence is decay.',
    overview:
      'Bioluminescent Deep is a living cavern lit by pulsing spores, reef moss, and luminous veins. It turns darkness into a tax, so the player must mine inside the light field or watch value bleed away.',
    visualIdentity: {
      palette: { base: '#0b2631', accent: '#5ad7a3', glow: '#b9ffea' },
      lighting: 'Cold green pulses drift through the waterlogged stone like a heartbeat.',
      terrain: 'Silt, reefroot, and slick limestone create soft surfaces that drink in light.',
      architecture: 'Organic arches and hanging growths frame each tunnel like a submerged temple.',
      atmosphere: 'Wet, vibrant, and faintly tidal with constant shimmer and drifting spores.',
      uiMotif: 'Neon pulse bars, soft bloom halos, and organic curve dividers.'
    },
    economySystem: {
      name: 'Pulse Tithe Relay',
      summary:
        'Ore must remain charged by ambient glow to keep its full sale price. Dark travel drains the charge and lowers the payout tier.',
      playerRule:
        'Stay inside illuminated blooms or route hauls through glowing chambers to preserve value.'
    },
    hazards: [
      {
        name: 'Lumen Bloom',
        effect: 'A sudden flare overexposes the tunnel and floods the screen with radiant haze.',
        consequence: 'The player loses precision and can clip into nearby growth barriers.'
      },
      {
        name: 'Sporeside Drift',
        effect: 'Loose spores tug carts and loose resources sideways through wet air.',
        consequence: 'Hauls can slip off the intended path if the player lingers too long.'
      },
      {
        name: 'Prism Hunger',
        effect: 'Bright ore clusters consume local light and dim the chamber around them.',
        consequence: 'The room slowly becomes less profitable unless the player resets the glow network.'
      }
    ],
    strata: [
      {
        name: 'Lantern Silt',
        depth: '0-32000m',
        matrix: 'Soft silt mixed with algae threads, pearl dust, and faintly luminous mud.',
        miningNote: 'Every strike briefly brightens nearby seams and exposes hidden veins.',
        ores: [
          {
            name: 'Mossflare Opal',
            rarity: 'Uncommon',
            priceSlot: 89,
            note: 'An opal that glows brighter the longer it stays near living spores.'
          },
          {
            name: 'Tidebeam Cinnabar',
            rarity: 'Rare',
            priceSlot: 90,
            note: 'A warm red mineral favored by collectors who pay for stable glow.'
          }
        ]
      },
      {
        name: 'Spore Lantern Belt',
        depth: '32001-64000m',
        matrix: 'Thick fungal shelves and glow moss mats woven across damp stone ribs.',
        miningNote: 'The layer refreshes ambient light, but only if the player keeps moving.',
        ores: [
          {
            name: 'Verdant Phosphor',
            rarity: 'Rare',
            priceSlot: 91,
            note: 'A living mineral that must be sold before the pulse cycle fades.'
          },
          {
            name: 'Glimmer Tuberite',
            rarity: 'Epic',
            priceSlot: 92,
            note: 'A bulbous crystal prized for its stable internal flicker.'
          }
        ]
      },
      {
        name: 'Reefroot Vault',
        depth: '64001-96000m',
        matrix: 'Coral-like root stone and thick bioglass columns pack the chambers tightly.',
        miningNote: 'Breaking one node can spread a light chain through adjacent growth fields.',
        ores: [
          {
            name: 'Coralume Silver',
            rarity: 'Epic',
            priceSlot: 93,
            note: 'Silver fused with marine glow that sells best as a matched set.'
          },
          {
            name: 'Symbiote Jade',
            rarity: 'Legendary',
            priceSlot: 94,
            note: 'A green mineral that remains vibrant only while the cavern is alive.'
          }
        ]
      },
      {
        name: 'Abyssal Bloomfield',
        depth: '96001-128000m',
        matrix: 'Deep water stone, phosphor roots, and dense black bloom cores press together.',
        miningNote: 'The lowest layer rewards continuous illumination with larger ore clusters.',
        ores: [
          {
            name: 'Nightspark Amber',
            rarity: 'Legendary',
            priceSlot: 95,
            note: 'A deep amber that stores light and releases it as sale value.'
          },
          {
            name: 'Pulseglass Crown',
            rarity: 'Mythic',
            priceSlot: 96,
            note: 'A rare bloom crystal that commands a premium if delivered fully charged.'
          }
        ]
      }
    ]
  },
  {
    id: 'tectonic-rift',
    name: 'Tectonic Rift',
    order: 13,
    globalDepth: { start: 1536000, end: 1664000 },
    localDepthLimit: 128000,
    tagline: 'Mining on a moving fault line.',
    overview:
      'Tectonic Rift is a fractured industrial abyss where the floor keeps shifting under the player. It turns timing into profit, rewarding those who mine during safe windows and avoid the harsh price of direct seismic damage.',
    visualIdentity: {
      palette: { base: '#241a18', accent: '#cf6b39', glow: '#ffd18b' },
      lighting: 'Heat leaks through fault cracks in sharp, unstable bands of orange light.',
      terrain: 'Basalt plates, shattered shale, and lifted crust slices create jagged layers.',
      architecture: 'Split pillars and fault-bent braces lean at odd angles as if the mine is alive.',
      atmosphere: 'Tense, metallic, and vibrating with low rumble before every shift.',
      uiMotif: 'Broken grid lines, seismic bars, and warning slashes.'
    },
    economySystem: {
      name: 'Faultline Futures',
      summary:
        'Ore prices rise during instability windows and fall when the ground goes still. The biome pushes the player to trade on timing rather than raw volume.',
      playerRule:
        'Mine in short bursts around tremor peaks, then get out before the fault penalty lands.'
    },
    hazards: [
      {
        name: 'Shear Jump',
        effect: 'A plate shift snaps the player sideways into a neighboring tunnel segment.',
        consequence: 'Positioning errors can separate the player from the best vein.'
      },
      {
        name: 'Platewake Bloom',
        effect: 'Fresh rock bursts upward and blocks an active lane with hot debris.',
        consequence: 'The player must reroute immediately or lose the harvest window.'
      },
      {
        name: 'Plate Debt',
        effect: 'Repeated drilling accumulates stress in the floor and lowers stability.',
        consequence: 'Overmining one area can trigger a cascading efficiency crash.'
      }
    ],
    strata: [
      {
        name: 'Rift Crust',
        depth: '0-32000m',
        matrix: 'Thin crust plates with ash seams and exposed stone edges.',
        miningNote: 'Simple bursts produce high yield, but the floor reacts to every heavy hit.',
        ores: [
          {
            name: 'Ashline Copper',
            rarity: 'Uncommon',
            priceSlot: 97,
            note: 'Copper marked by ash streaks and valued for fast turnover.'
          },
          {
            name: 'Quake Tin',
            rarity: 'Rare',
            priceSlot: 98,
            note: 'Tin that spikes in value whenever the fault shakes.'
          }
        ]
      },
      {
        name: 'Jolt Mantle',
        depth: '32001-64000m',
        matrix: 'Hot rock shelves buckle under pressure and split into uneven lanes.',
        miningNote: 'Short delays between strikes can catch the next tremor bonus.',
        ores: [
          {
            name: 'Fault Ember',
            rarity: 'Rare',
            priceSlot: 99,
            note: 'A glowing shard that trades higher during active seismic pulses.'
          },
          {
            name: 'Seamshock Zinc',
            rarity: 'Epic',
            priceSlot: 100,
            note: 'A conductive ore that thrives in unstable ground.'
          }
        ]
      },
      {
        name: 'Catacomb Fault',
        depth: '64001-96000m',
        matrix: 'Collapsed corridors and tilted stone vaults crisscross the broken earth.',
        miningNote: 'Collapsed vaults hide better ore, but the paths are harder to read.',
        ores: [
          {
            name: 'Riftite Silver',
            rarity: 'Epic',
            priceSlot: 101,
            note: 'Silver threaded with stress lines and priced for precision extraction.'
          },
          {
            name: 'Tremor Garnet',
            rarity: 'Legendary',
            priceSlot: 102,
            note: 'A deep red crystal that sells highest immediately after a quake.'
          }
        ]
      },
      {
        name: 'Shatter Spine',
        depth: '96001-128000m',
        matrix: 'Knife-edged basalt ridges and pressure folded stone dominate the descent.',
        miningNote: 'The deepest zone gives the best event spikes, but only for quick, disciplined runs.',
        ores: [
          {
            name: 'Spinecore Platinum',
            rarity: 'Legendary',
            priceSlot: 103,
            note: 'Platinum formed along a fault backbone and sold as high-grade reserve metal.'
          },
          {
            name: 'Oathslip Obsidian',
            rarity: 'Mythic',
            priceSlot: 104,
            note: 'A glassy black ore that rewards perfect timing and punishes hesitation.'
          }
        ]
      }
    ]
  },
  {
    id: 'echo-cavern',
    name: 'Echo Cavern',
    order: 14,
    globalDepth: { start: 1664000, end: 1792000 },
    localDepthLimit: 128000,
    tagline: 'Sound is the map and the warning.',
    overview:
      'Echo Cavern is a resonant chamber world where each strike becomes part of the navigation system. The biome rewards rhythm and punishes noise pollution, so the most profitable players mine with deliberate cadence.',
    visualIdentity: {
      palette: { base: '#1f2330', accent: '#8f6bd8', glow: '#ffd38c' },
      lighting: 'Soft amber reflections bounce across dark stone in delayed, visible waves.',
      terrain: 'Ringstone, hollow limestone, and suspended dust basins shape the tunnel geometry.',
      architecture: 'Vaulted corridors and bell-shaped hollows create dramatic acoustic chambers.',
      atmosphere: 'Reverberant, deep, and tense with every movement bouncing back a moment later.',
      uiMotif: 'Waveform lines, concentric rings, and delayed pulse markers.'
    },
    economySystem: {
      name: 'Resonance Brokerage',
      summary:
        'Ore value depends on how cleanly the player maintains a stable mining rhythm. Matching cadence keeps resonance high and unlocks premium pricing.',
      playerRule:
        'Keep the same swing tempo and avoid random burst mining if you want the bonus to hold.'
    },
    hazards: [
      {
        name: 'Feedback Spiral',
        effect: 'Repeating sound loops feed back into the chamber and distort the control overlay.',
        consequence: 'The player can lose track of the active lane for several seconds.'
      },
      {
        name: 'Hollow Mimic',
        effect: 'A fake vein echoes the last mined pattern and appears valuable when it is not.',
        consequence: 'Chasing the mimic wastes time and breaks the resonance chain.'
      },
      {
        name: 'Staggered Reverberation',
        effect: 'Delayed echoes desync movement timing and create uneven tunnel responses.',
        consequence: 'Mining rhythm slips, which cuts price bonuses immediately.'
      }
    ],
    strata: [
      {
        name: 'Whisper Limestone',
        depth: '0-32000m',
        matrix: 'Pale limestone and fine dust hold faint audio traces in every seam.',
        miningNote: 'Quiet mining preserves the resonance chain and exposes hidden pockets.',
        ores: [
          {
            name: 'Whistle Calcite',
            rarity: 'Uncommon',
            priceSlot: 105,
            note: 'A fragile crystal that sings when struck at the right cadence.'
          },
          {
            name: 'Chime Quartz',
            rarity: 'Rare',
            priceSlot: 106,
            note: 'Quartz tuned for stable rhythm-based payouts.'
          }
        ]
      },
      {
        name: 'Ringstone Arcade',
        depth: '32001-64000m',
        matrix: 'Circular stone ribs and hollow arches amplify every footfall.',
        miningNote: 'Balanced strikes boost the room, but uneven swings create interference.',
        ores: [
          {
            name: 'Aria Basalt',
            rarity: 'Rare',
            priceSlot: 107,
            note: 'Basalt with tonal bands that sell better in matched sets.'
          },
          {
            name: 'Tonefoil Copper',
            rarity: 'Epic',
            priceSlot: 108,
            note: 'A reflective copper sheet that carries resonance perfectly.'
          }
        ]
      },
      {
        name: 'Chamber Veil',
        depth: '64001-96000m',
        matrix: 'Hanging mineral curtains and dust veils soften the sound in this layer.',
        miningNote: 'The veil rewards patient extraction and punishes noisy reroutes.',
        ores: [
          {
            name: 'Vesper Onyx',
            rarity: 'Epic',
            priceSlot: 109,
            note: 'Dark stone with a clean tonal ring and strong collector demand.'
          },
          {
            name: 'Resonant Jet',
            rarity: 'Legendary',
            priceSlot: 110,
            note: 'A glossy mineral that returns a perfect echo when mined at full rhythm.'
          }
        ]
      },
      {
        name: 'Null Bell Depths',
        depth: '96001-128000m',
        matrix: 'Soundless caverns absorb every strike and amplify only the most precise ones.',
        miningNote: 'Perfect cadence becomes extremely profitable, but any mistake cuts the chain hard.',
        ores: [
          {
            name: 'Bellwrought Silver',
            rarity: 'Legendary',
            priceSlot: 111,
            note: 'Silver shaped by silence and prized for ceremonial trade.'
          },
          {
            name: 'Mute Crownstone',
            rarity: 'Mythic',
            priceSlot: 112,
            note: 'A royal mineral that only reveals its worth after a flawless echo run.'
          }
        ]
      }
    ]
  },
  {
    id: 'gilded-vault',
    name: 'Gilded Vault',
    order: 15,
    globalDepth: { start: 1792000, end: 1920000 },
    localDepthLimit: 128000,
    tagline: 'Every strike is audited.',
    overview:
      'Gilded Vault is a buried treasury built from old empire stone, sealed coin dust, and ceremonial ore chambers. The biome is about compliance and conversion, so the player earns more by obeying the vault rules than by forcing the richest vein.',
    visualIdentity: {
      palette: { base: '#f1e2b6', accent: '#b68a2b', glow: '#fff1c9' },
      lighting: 'Warm gold light reflects off every surface like a hidden auction house.',
      terrain: 'Coin dust, regalia clay, and polished orework create a dense imperial floor.',
      architecture: 'Vault ribs, ledger columns, and sealed arch doors mark each depth band.',
      atmosphere: 'Rich, formal, and slightly oppressive with the feel of a guarded archive.',
      uiMotif: 'Engraved frames, embossed seals, and luminous gold counters.'
    },
    economySystem: {
      name: 'Tithing Mint',
      summary:
        'Each haul pays a vault tithe before it can be converted. In return, premium ores can be recast into high-value bullion with a strong refinement bonus.',
      playerRule:
        'Keep the vault quota satisfied or the conversion chain locks and the richest ores lose their premium.'
    },
    hazards: [
      {
        name: 'Ledger Snare',
        effect: 'A hidden accounting net traps unregistered ore and delays its sale.',
        consequence: 'The player must clear the hold or the cargo becomes illiquid.'
      },
      {
        name: 'Crowned Silt',
        effect: 'Fine gold dust solidifies around boots and slows movement in the lower halls.',
        consequence: 'Slow travel makes quota runs harder to complete on time.'
      },
      {
        name: 'Vault Oath',
        effect: 'Breaking the mining sequence triggers a seal review that pauses output.',
        consequence: 'A bad run can force the player to rebuild trust before the next premium window.'
      }
    ],
    strata: [
      {
        name: 'Coin Dust Terraces',
        depth: '0-32000m',
        matrix: 'Loose coin dust, powdered marble, and old stamp fragments form the first terrace.',
        miningNote: 'Small, steady extractions gain the best minting efficiency.',
        ores: [
          {
            name: 'Minted Feldspar',
            rarity: 'Uncommon',
            priceSlot: 113,
            note: 'A stamped mineral that sells above average when processed cleanly.'
          },
          {
            name: 'Crown Nickel',
            rarity: 'Rare',
            priceSlot: 114,
            note: 'A registry metal that gains value when extracted in full slabs.'
          }
        ]
      },
      {
        name: 'Regalia Clay',
        depth: '32001-64000m',
        matrix: 'Heavy clay holds ceremonial fragments and thin gilt threads.',
        miningNote: 'The clay favors careful extraction because rough strikes lower the mint bonus.',
        ores: [
          {
            name: 'Scepter Mica',
            rarity: 'Rare',
            priceSlot: 115,
            note: 'Glinting sheets that fit the premium export tier of the vault.'
          },
          {
            name: 'Aureate Shale',
            rarity: 'Epic',
            priceSlot: 116,
            note: 'A shale layer veined with gold that refines into compact bars.'
          }
        ]
      },
      {
        name: 'Basilica Orework',
        depth: '64001-96000m',
        matrix: 'Grand stone vaults hide dense seams inside cathedral-like rock chambers.',
        miningNote: 'The chamber rewards full clears and punishes partial grabs with tithe loss.',
        ores: [
          {
            name: 'Choir Electrum',
            rarity: 'Epic',
            priceSlot: 117,
            note: 'A bright alloy that carries temple-grade sale multipliers.'
          },
          {
            name: 'Reliquary Platinum',
            rarity: 'Legendary',
            priceSlot: 118,
            note: 'Platinum sealed in shrine stone and valued as a reserved asset.'
          }
        ]
      },
      {
        name: 'Sunken Treasury',
        depth: '96001-128000m',
        matrix: 'Collapsed treasure vaults, fused bars, and relic vault doors line the bottom.',
        miningNote: 'Deep conversions are strongest here, but only if the tithe ledger is balanced.',
        ores: [
          {
            name: 'Vaultfire Gold',
            rarity: 'Legendary',
            priceSlot: 119,
            note: 'Gold that glows like a sealed furnace and sells at a deluxe rate.'
          },
          {
            name: 'Imperial Halo Ore',
            rarity: 'Mythic',
            priceSlot: 120,
            note: 'The crown jewel of the biome, recastable into elite bullion.'
          }
        ]
      }
    ]
  }
];
