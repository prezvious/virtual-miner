export default [
  {
    id: 'plasma-vein',
    name: 'Plasma Vein',
    order: 16,
    globalDepth: { start: 1920000, end: 2048000 },
    localDepthLimit: 128000,
    tagline: 'Live wire strata where ore must be cooled before it can be sold.',
    overview:
      'Plasma Vein is a charged underworld of glowing fault lines, snapped conduits, and mineral pulses that behave more like machinery than rock. The biome rewards fast extraction, but every drill step risks building a charge chain that can lock up the whole shaft if the player ignores it.',
    visualIdentity: {
      palette: { base: '#1f2740', accent: '#ff7a2f', glow: '#7cf0ff' },
      lighting: 'Sharp orange pulses cut through a deep cobalt field, with strobe-like flashes that follow active mining nodes.',
      terrain: 'Basalt ribs fused with transparent slag, broken by molten seams that arc between exposed ore veins.',
      architecture: 'Exposed coil pylons, heat sinks, and angular relay braces that make the mine look like a contained reactor.',
      atmosphere: 'The air hisses with static, hot metal dust, and brief shockwaves that ripple through loose rock.',
      uiMotif: 'Charge bars, arc tracers, and bright warning rings that pulse when the shaft is nearing overload.'
    },
    economySystem: {
      name: 'Capacitor Haul',
      summary: 'Ore prices rise while charge is stable, but spike mining can overload the vein and force a cooldown tax on the entire run.',
      playerRule: 'Keep extraction tempo balanced so value stays high without triggering a chain outage.'
    },
    hazards: [
      {
        name: 'Arcflash Bloom',
        effect: 'Mining too long without venting charge causes nearby rock to surge, slowing drill speed by 18%.',
        consequence: 'The player has to pause and bleed off power or risk a temporary shaft lock.'
      },
      {
        name: 'Glassline Feedback',
        effect: 'Reflective plasma seams bounce part of the next strike back into the tunnel, cutting local yield by 12%.',
        consequence: 'Repeated hits on the same vein become less efficient until the seam is split open from a new angle.'
      },
      {
        name: 'Magnet Lash',
        effect: 'Loose ore snaps toward field anchors and drags adjacent pickups into brittle walls.',
        consequence: 'Players lose a portion of uncollected drops unless they collect quickly or install stabilizers.'
      }
    ],
    strata: [
      {
        name: 'Arc Scab',
        depth: '0-32000m',
        matrix: 'Charred crust with shallow charge pockets and fractured slag plates.',
        miningNote: 'Fast to break, but each vein leaves behind a brief static residue that must be cleared before the next strike.',
        ores: [
          {
            name: 'Ampflare Shard',
            rarity: 'uncommon',
            priceSlot: 121,
            note: 'A bright starter ore that stores a tiny burst of heat in every chunk.'
          },
          {
            name: 'Pulse Garnet',
            rarity: 'rare',
            priceSlot: 122,
            note: 'A heated crystal used to stabilize early power tools.'
          }
        ]
      },
      {
        name: 'Relay Ash',
        depth: '32000-64000m',
        matrix: 'Ash-dark soil threaded with conductive grit and thin relay fibers.',
        miningNote: 'Strikes can jump between adjacent blocks, rewarding careful lane carving over brute force.',
        ores: [
          {
            name: 'Grid Ember',
            rarity: 'rare',
            priceSlot: 123,
            note: 'Sells well because it holds its charge even after transport.'
          },
          {
            name: 'Volt Prism',
            rarity: 'epic',
            priceSlot: 124,
            note: 'A prismatic mineral that improves machine throughput when smelted.'
          }
        ]
      },
      {
        name: 'Conduit Spine',
        depth: '64000-96000m',
        matrix: 'Lattice stone wrapped around dormant power channels and heat vents.',
        miningNote: 'Breaking one block can awaken a nearby conduit, so route planning matters more than raw speed.',
        ores: [
          {
            name: 'Current Opal',
            rarity: 'epic',
            priceSlot: 125,
            note: 'A high-value stone that stores directional current for later use.'
          },
          {
            name: 'Tesla Cinder',
            rarity: 'legendary',
            priceSlot: 126,
            note: 'An unstable relic ore that briefly increases every other ore price in the haul.'
          }
        ]
      },
      {
        name: 'Live Circuit Bed',
        depth: '96000-128000m',
        matrix: 'A near-sentient floor of fused wirestone, sparking channels, and hot glass seams.',
        miningNote: 'The deepest layer rewards long combo chains, but breaking a bad tile can collapse the whole line of ore around it.',
        ores: [
          {
            name: 'Neon Coilite',
            rarity: 'legendary',
            priceSlot: 127,
            note: 'A coil-rich crystal that pays best when extracted in large untouched clusters.'
          },
          {
            name: 'Sunshock Core',
            rarity: 'mythic',
            priceSlot: 128,
            note: 'The highest-value ore in the biome, prized for one-time reactor fabrication.'
          }
        ]
      }
    ]
  },
  {
    id: 'petrified-world',
    name: 'Petrified World',
    order: 17,
    globalDepth: { start: 2048000, end: 2176000 },
    localDepthLimit: 128000,
    tagline: 'A fossil graveyard where every block remembers a living shape.',
    overview:
      'Petrified World is a buried snapshot of an extinct landscape, preserved as stone bark, bone shelves, and mineralized root systems. The biome centers on careful extraction, because intact relic layers pay more than shattered ones and the mine punishes careless carving.',
    visualIdentity: {
      palette: { base: '#4a4238', accent: '#b8895f', glow: '#f2d2a6' },
      lighting: 'Muted amber light filters through dusty layers and catches on polished fossil edges.',
      terrain: 'Stone trunks, ribbed shale, and layered fossil flats that break into museum-grade fragments.',
      architecture: 'Shelf-like arches, specimen frames, and conservatory braces that make each shaft feel curated.',
      atmosphere: 'Dry grit, brittle echoes, and the quiet sense of working inside a giant preserved habitat.',
      uiMotif: 'Archive tags, specimen stamps, and integrity rings that show how intact a fossil vein remains.'
    },
    economySystem: {
      name: 'Relic Integrity',
      summary: 'Ore value scales with how cleanly the fossil layer is extracted, so the best route is often the least destructive one.',
      playerRule: 'Use measured cuts and leave fragile clusters intact until the right tools are available.'
    },
    hazards: [
      {
        name: 'Ribsnap Cave-in',
        effect: 'Breaking a support fossil can drop nearby strata and crush loose ore nodes.',
        consequence: 'The player loses a portion of nearby yield unless they reinforce the layer first.'
      },
      {
        name: 'Dust Mummy Bloom',
        effect: 'Fine fossil powder clogs filters, reducing tool speed and lowering scan clarity.',
        consequence: 'Hidden ore becomes harder to locate until ventilation clears the chamber.'
      },
      {
        name: 'Marble Echo',
        effect: 'Repeated strikes reverberate through the bed and trigger delayed crack lines.',
        consequence: 'A successful node can split into lower-value fragments if the player keeps hammering the same spot.'
      }
    ],
    strata: [
      {
        name: 'Barkstone Shelf',
        depth: '0-32000m',
        matrix: 'Wood-grain limestone with leaf imprints and shallow root channels.',
        miningNote: 'The layer is forgiving, but intact fossil patterns raise sell value if the surface stays unbroken.',
        ores: [
          {
            name: 'Ringroot Amber',
            rarity: 'uncommon',
            priceSlot: 129,
            note: 'A warm resin stone used to start relic contracts.'
          },
          {
            name: 'Moss Flint',
            rarity: 'rare',
            priceSlot: 130,
            note: 'A flint-like mineral that sells higher when gathered from undisturbed pockets.'
          }
        ]
      },
      {
        name: 'Bone Choir',
        depth: '32000-64000m',
        matrix: 'Curved bone seams stacked like a buried colonnade under compact marl.',
        miningNote: 'Adjacent bones amplify one another, so the player can chain clean breaks for a bonus payout.',
        ores: [
          {
            name: 'Marrow Quartz',
            rarity: 'rare',
            priceSlot: 131,
            note: 'A pale crystal formed inside fossil marrow cavities.'
          },
          {
            name: 'Spine Jet',
            rarity: 'epic',
            priceSlot: 132,
            note: 'A sharp black stone used for precision tools and collector orders.'
          }
        ]
      },
      {
        name: 'Trunk Archive',
        depth: '64000-96000m',
        matrix: 'Petrified tree rings and compressed sap veins packed into dense terraces.',
        miningNote: 'Cuts through one ring can expose hidden resin pockets in the next, rewarding smart sequence mining.',
        ores: [
          {
            name: 'Sapstone',
            rarity: 'epic',
            priceSlot: 133,
            note: 'A glossy mineral that improves shipment preservation.'
          },
          {
            name: 'Briar Slate',
            rarity: 'legendary',
            priceSlot: 134,
            note: 'A thorny fossil slab prized for museum-grade display pieces.'
          }
        ]
      },
      {
        name: 'Root Vault',
        depth: '96000-128000m',
        matrix: 'Knotted root catacombs, compressed spores, and old sediment sealed into one hard shell.',
        miningNote: 'The deepest layer rewards patience, because every major fracture can expose a hidden cache beneath it.',
        ores: [
          {
            name: 'Casket Amber',
            rarity: 'legendary',
            priceSlot: 135,
            note: 'A sealed resin relic that fetches premium prices in clean condition.'
          },
          {
            name: 'Extinct Bloomstone',
            rarity: 'mythic',
            priceSlot: 136,
            note: 'A one-of-a-kind fossil crystal that powers relic auctions.'
          }
        ]
      }
    ]
  },
  {
    id: 'shadow-rift',
    name: 'Shadow Rift',
    order: 18,
    globalDepth: { start: 2176000, end: 2304000 },
    localDepthLimit: 128000,
    tagline: 'A mine where darkness is a resource and light is a liability.',
    overview:
      'Shadow Rift is built around missing light, not hidden light. The biome converts darkness into value, so players are rewarded for moving through near-black shafts while managing the risk of losing track of paths, loot, and even the direction of the tunnel itself.',
    visualIdentity: {
      palette: { base: '#17181f', accent: '#5666ff', glow: '#b5a2ff' },
      lighting: 'Low-key indigo lighting appears only where the player has claimed a section, with everything else swallowed by black.',
      terrain: 'Charcoal rock, void cracks, and thin gray veins that seem to fade when stared at directly.',
      architecture: 'Thin bridge ribs, signal posts, and anchor sigils that keep routes from dissolving into the dark.',
      atmosphere: 'Muted sound, drifting ash, and the feeling that the mine is listening before it answers.',
      uiMotif: 'Dim radar sweeps, absent-space outlines, and hollow markers that only appear when danger is near.'
    },
    economySystem: {
      name: 'Light Debt Ledger',
      summary: 'Keeping strong lights active increases safety but lowers payout, while mining in controlled darkness raises ore value.',
      playerRule: 'Balance visibility against profit by using the cheapest possible light footprint for the current route.'
    },
    hazards: [
      {
        name: 'Absence Siphon',
        effect: 'Bright equipment drains value from nearby shadow ore by making it inert.',
        consequence: 'The player earns less until lights are throttled back or repositioned.'
      },
      {
        name: 'False Floor Echo',
        effect: 'The cavern mirrors old tunnel shapes and tricks the player into following dead routes.',
        consequence: 'Time is lost on empty shafts unless anchor markers are placed carefully.'
      },
      {
        name: 'Null Bloom',
        effect: 'A patch of total dark spreads outward and suppresses all nearby scanning tools.',
        consequence: 'Visible map coverage shrinks, forcing manual navigation until the bloom fades.'
      }
    ],
    strata: [
      {
        name: 'Gloam Edge',
        depth: '0-32000m',
        matrix: 'Faintly reflective shale with soot veins and shallow void pockets.',
        miningNote: 'This layer is safe enough for setup, but every bright action reduces the shadow bonus slightly.',
        ores: [
          {
            name: 'Umbral Chip',
            rarity: 'uncommon',
            priceSlot: 137,
            note: 'A common shadow ore used to seed the darkness economy.'
          },
          {
            name: 'Dusk Glass',
            rarity: 'rare',
            priceSlot: 138,
            note: 'A dark shard that sells better when collected with minimal lighting.'
          }
        ]
      },
      {
        name: 'Hush Vein',
        depth: '32000-64000m',
        matrix: 'Sound-dampening stone and compressed ash that blunts every step and strike.',
        miningNote: 'Quiet mining boosts returns, but loud tools can wake dormant faults and collapse the lane.',
        ores: [
          {
            name: 'Mute Onyx',
            rarity: 'rare',
            priceSlot: 139,
            note: 'A dense stone that stores silence as a market premium.'
          },
          {
            name: 'Noct Rill',
            rarity: 'epic',
            priceSlot: 140,
            note: 'A liquid-dark mineral that improves shadow calibration systems.'
          }
        ]
      },
      {
        name: 'Blind Corridor',
        depth: '64000-96000m',
        matrix: 'Collapsed passages with light-eating crystal dust and broken direction markers.',
        miningNote: 'The layer rewards players who keep a consistent route, because stray branches become costly to recover.',
        ores: [
          {
            name: 'Void Slate',
            rarity: 'epic',
            priceSlot: 141,
            note: 'A flat black mineral used in stealth-grade machine housings.'
          },
          {
            name: 'Night Thread',
            rarity: 'legendary',
            priceSlot: 142,
            note: 'A filament ore that commands a premium in darkness-sensitive rigs.'
          }
        ]
      },
      {
        name: 'Black Seal',
        depth: '96000-128000m',
        matrix: 'A sealed chamber of heavy darkstone where the air feels folded inward.',
        miningNote: 'The deepest layer pays best when no light touches the extraction point until the final break.',
        ores: [
          {
            name: 'Eclipse Shard',
            rarity: 'legendary',
            priceSlot: 143,
            note: 'A rare black crystal that peaks in price during full-shift darkness.'
          },
          {
            name: 'Deep Hollow Crown',
            rarity: 'mythic',
            priceSlot: 144,
            note: 'The highest-tier shadow relic in the biome, prized for elite clandestine shipments.'
          }
        ]
      }
    ]
  },
  {
    id: 'astral-mines',
    name: 'Astral Mines',
    order: 19,
    globalDepth: { start: 2304000, end: 2432000 },
    localDepthLimit: 128000,
    tagline: 'A star chart buried underground, complete with shifting constellations.',
    overview:
      'Astral Mines turns geology into navigation art. Ores are arranged by unstable celestial alignments, so the player earns more by mining in sync with the current star pattern than by simply drilling the richest block first.',
    visualIdentity: {
      palette: { base: '#121827', accent: '#8bd0ff', glow: '#ffe08a' },
      lighting: 'Cold blue ambient light is crossed by gold star paths that move across the rock face like drifting constellations.',
      terrain: 'Fine lunar dust, meteor slag, and glassy crater stone threaded with sky-metal flecks.',
      architecture: 'Oral-like rings, astrolabe supports, and mirrored survey rails that make the shafts feel mapped rather than dug.',
      atmosphere: 'Thin air, gentle static, and a sense that the ceiling is much farther away than it looks.',
      uiMotif: 'Orbit rings, phase glyphs, and alignment meters that show when the biome is in a favorable sky state.'
    },
    economySystem: {
      name: 'Star Chart Bids',
      summary: 'Ore prices shift with alignment windows, so the best haul is the one sold at the right celestial phase.',
      playerRule: 'Delay selling until the alignment favors the ore type you just extracted.'
    },
    hazards: [
      {
        name: 'Orbit Slip',
        effect: 'Mining too fast shifts the local gravity lane and drifts nearby blocks out of reach.',
        consequence: 'The player must spend extra time recentering the shaft before mining can resume cleanly.'
      },
      {
        name: 'Meteor Draft',
        effect: 'Hot debris rains through upper vents and dents fresh ore, lowering intact sell value.',
        consequence: 'Top-side routes become less efficient unless they are shielded or mined quickly.'
      },
      {
        name: 'Parallax Bloom',
        effect: 'The same tunnel appears in two different places, creating false duplication in the map overlay.',
        consequence: 'Players can waste time chasing mirrored routes if they ignore the alignment tracker.'
      }
    ],
    strata: [
      {
        name: 'Comet Loam',
        depth: '0-32000m',
        matrix: 'Dusty impact soil mixed with tiny glass beads and cooled tail fragments.',
        miningNote: 'The layer is easy to open, but ore value depends on whether it is collected during the current star window.',
        ores: [
          {
            name: 'Comet Chalk',
            rarity: 'uncommon',
            priceSlot: 145,
            note: 'A soft mineral used for early alignment contracts.'
          },
          {
            name: 'Orbit Amber',
            rarity: 'rare',
            priceSlot: 146,
            note: 'A bright fossilized resin that sells better when aligned with a favorable phase.'
          }
        ]
      },
      {
        name: 'Starmetal Drift',
        depth: '32000-64000m',
        matrix: 'Fine metallic sand and thin meteor threads that scatter under tool impact.',
        miningNote: 'Small movements can shift the ore cluster, so wide strikes outperform narrow spam.',
        ores: [
          {
            name: 'Sider Coil',
            rarity: 'rare',
            priceSlot: 147,
            note: 'A compact metal loop used in precision sky rigs.'
          },
          {
            name: 'Nova Tine',
            rarity: 'epic',
            priceSlot: 148,
            note: 'A high-grade spike ore that spikes in value during active constellation windows.'
          }
        ]
      },
      {
        name: 'Eclipse Terrace',
        depth: '64000-96000m',
        matrix: 'Tiered dark stone with eclipse bands that dim and brighten in a repeating cycle.',
        miningNote: 'Harvesting during the bright band yields lower safety but much higher payout.',
        ores: [
          {
            name: 'Phase Quartz',
            rarity: 'epic',
            priceSlot: 149,
            note: 'A shift crystal that powers timing-sensitive machines.'
          },
          {
            name: 'Halo Jet',
            rarity: 'legendary',
            priceSlot: 150,
            note: 'A polished black gemstone that commands top prices at the end of a cycle.'
          }
        ]
      },
      {
        name: 'Zenith Fault',
        depth: '96000-128000m',
        matrix: 'A near-open vault of star glass, suspended dust, and mapped pressure lines.',
        miningNote: 'This deepest layer rewards perfect timing more than raw speed, because each strike can reshape the next alignment pulse.',
        ores: [
          {
            name: 'Zenith Stariron',
            rarity: 'legendary',
            priceSlot: 151,
            note: 'A rare alloy ore that feeds late-game celestial equipment.'
          },
          {
            name: 'Astral Regent',
            rarity: 'mythic',
            priceSlot: 152,
            note: 'The biome crown ore, valued for producing one-per-server artifacts.'
          }
        ]
      }
    ]
  },
  {
    id: 'abyss-core',
    name: 'The Abyss Core',
    order: 20,
    globalDepth: { start: 2432000, end: 2560000 },
    localDepthLimit: 128000,
    tagline: 'The final descent where pressure, heat, and gravity all stop agreeing.',
    overview:
      'The Abyss Core is the deepest, harshest biome in the set, built around crushing pressure and a central furnace that behaves like a living treasury. It is designed to feel like a final exam: the deeper the player goes, the more the mine tries to collapse, heat up, or pull the shaft apart at once.',
    visualIdentity: {
      palette: { base: '#1b1211', accent: '#ff4d2e', glow: '#ffd06a' },
      lighting: 'Red-orange underlight leaks from fissures and turns the bedrock into a furnace outline.',
      terrain: 'Pressure glass, magma scars, and black mantle stone that fractures in long ruler-straight cuts.',
      architecture: 'Massive brace crowns, furnace gates, and load-bearing rings built to hold a hostile center in place.',
      atmosphere: 'Heavy heat shimmer, grinding pressure noise, and a constant sense of the ground trying to move upward.',
      uiMotif: 'Pressure gauges, burn warnings, and core rings that tighten as the player approaches the center.'
    },
    economySystem: {
      name: 'Core Seigniorage',
      summary: 'Ore gains extra value only when pulled from high-pressure zones and cooled without cracking, making precision extraction essential.',
      playerRule: 'Mine in short controlled bursts and extract valuable ore before the heat curve ruins the haul.'
    },
    hazards: [
      {
        name: 'Gravity Shear',
        effect: 'A pressure spike bends the tunnel and pulls loose blocks sideways into the wall.',
        consequence: 'The player loses route stability and must re-anchor the shaft.'
      },
      {
        name: 'Heat Null',
        effect: 'A cold pocket forms inside the furnace layer and causes tool systems to desync.',
        consequence: 'Mining speed drops sharply until thermal balance is restored.'
      },
      {
        name: 'Pressure Maw',
        effect: 'The core breathes inward and crushes any exposed ore left too long in open air.',
        consequence: 'Uncollected drops can be damaged or lost if the player overextends.'
      }
    ],
    strata: [
      {
        name: 'Magma Skin',
        depth: '0-32000m',
        matrix: 'Thin lava crust over black glass and heat-scarred stone.',
        miningNote: 'The layer is volatile but profitable, and every clean cut briefly cools a small local zone.',
        ores: [
          {
            name: 'Cinder Bloom',
            rarity: 'uncommon',
            priceSlot: 153,
            note: 'A hot blossom-like ore that starts the core economy.'
          },
          {
            name: 'Forge Shard',
            rarity: 'rare',
            priceSlot: 154,
            note: 'A hard slab of heat-proof ore used for deep equipment casings.'
          }
        ]
      },
      {
        name: 'Pressure Lattice',
        depth: '32000-64000m',
        matrix: 'Interlocked mantle plates compressed into a hard grid of load-bearing stone.',
        miningNote: 'The lattice rewards precise drilling because each clean cut reduces later pressure backlash.',
        ores: [
          {
            name: 'Load Ruby',
            rarity: 'rare',
            priceSlot: 155,
            note: 'A red crystal that becomes more valuable under sustained pressure.'
          },
          {
            name: 'Anvil Zeolite',
            rarity: 'epic',
            priceSlot: 156,
            note: 'A dense mineral used to stabilize violent core machines.'
          }
        ]
      },
      {
        name: 'Mantle Furnace',
        depth: '64000-96000m',
        matrix: 'Superheated stone beds with vent cracks and molten seams running between them.',
        miningNote: 'Breaking one vent can release a brief heat surge that boosts rare ore output for a short window.',
        ores: [
          {
            name: 'Kiln Obsidian',
            rarity: 'epic',
            priceSlot: 157,
            note: 'A furnace black mineral that sells best in large intact plates.'
          },
          {
            name: 'Ember Crownstone',
            rarity: 'legendary',
            priceSlot: 158,
            note: 'A crown-shaped core relic used in premium final-tier fabrication.'
          }
        ]
      },
      {
        name: 'Singularity Hollow',
        depth: '96000-128000m',
        matrix: 'A compressed empty center where gravity warps the edge of every block.',
        miningNote: 'The deepest layer favors short, deliberate extraction cycles because the ore value collapses if the player over-drills.',
        ores: [
          {
            name: 'Abyss Heart',
            rarity: 'legendary',
            priceSlot: 159,
            note: 'The signature deep ore of the biome, valued for its unstable core charge.'
          },
          {
            name: 'Null Monarch',
            rarity: 'mythic',
            priceSlot: 160,
            note: 'The final ore in the set, reserved for the most dangerous and profitable extraction runs.'
          }
        ]
      }
    ]
  }
];
