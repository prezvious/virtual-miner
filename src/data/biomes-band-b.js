const makePriceRange = (slot) => ({
  min: slot * 100,
  max: slot * 100 + 99
});

export default [
  {
    id: 'magma-chamber',
    name: 'Magma Chamber',
    order: 6,
    globalDepth: { start: 640000, end: 768000 },
    localDepthLimit: 128000,
    tagline: 'A living crucible where pressure turns stone into leverage.',
    overview:
      'Magma Chamber is built around controlled heat rather than raw danger. Players profit by balancing vent pressure, holding the crust stable, and timing extractions while the rock is still plastic enough to yield rare metal blooms.',
    visualIdentity: {
      palette: { base: '#2c0f0a', accent: '#ff6a1a', glow: '#ffd27a' },
      lighting: 'Underlit by magma seams and furnace vents that pulse through the dark.',
      terrain: 'Obsidian shelves, pumice drifts, slag pockets, and black glass ribs.',
      architecture: 'Basalt arches, vent chimneys, and ribbed vaults baked by repeated eruptions.',
      atmosphere: 'Heat haze, ash fall, and the constant suggestion that the floor is still moving.',
      uiMotif: 'Cracked thermometers, ember gauges, and warning lines that shimmer like hot metal.'
    },
    economySystem: {
      name: 'Thermal Seigniorage',
      summary: 'Ore value rises when the chamber stays inside a stable heat band, but the price drops if the player vents too aggressively or lets the crust harden.',
      playerRule: 'Keep chamber heat between 40 and 70 percent to preserve the premium on molten-era ore.'
    },
    hazards: [
      {
        name: 'Flashboil Surge',
        effect: 'A pocket of superheated steam erupts through a fresh cut and scrambles timing for a short burst.',
        consequence: 'Mining speed drops until the vent cycle settles.'
      },
      {
        name: 'Basalt Bloom',
        effect: 'Rapid cooling grows stone petals over exposed seams and seals the current tunnel face.',
        consequence: 'The player must reopen blocked paths before the next extraction window.'
      },
      {
        name: 'Cinder Lung',
        effect: 'Fine ash gets into the shaft and thickens the air in deeper layers.',
        consequence: 'Idle efficiency decays unless the player clears or filters the route.'
      }
    ],
    strata: [
      {
        name: 'Ash Veil Shelf',
        depth: '0-32000m',
        matrix: 'Powdered basalt, soot layers, and soft slag pockets that still remember the last eruption.',
        miningNote: 'Fast to cut, but unstable ash can collapse if the player tunnels too straight.',
        ores: [
          {
            name: 'Vent Copper',
            rarity: 'Common',
            priceSlot: 41,
            priceRange: makePriceRange(41),
            note: 'A reliable conductor metal that sells steadily in furnace-fed markets.'
          },
          {
            name: 'Glass Cinder',
            rarity: 'Uncommon',
            priceSlot: 42,
            priceRange: makePriceRange(42),
            note: 'A heat-fused shard ore prized for tool casings and sealed piping.'
          }
        ]
      },
      {
        name: 'Ridge Furnace',
        depth: '32000-64000m',
        matrix: 'Hardened lava curtains, heat-baked shale, and narrow ribbons of blackstone.',
        miningNote: 'Drills overheat unless cycled, so sustained output matters more than burst speed.',
        ores: [
          {
            name: 'Kiln Iron',
            rarity: 'Rare',
            priceSlot: 43,
            priceRange: makePriceRange(43),
            note: 'A dense iron variant that keeps its edge even after repeated thermal shock.'
          },
          {
            name: 'Magma Pearl',
            rarity: 'Rare',
            priceSlot: 44,
            priceRange: makePriceRange(44),
            note: 'A round, glassy ore ball formed inside lava bubbles and valued by refineries.'
          }
        ]
      },
      {
        name: 'Pressure Crucible',
        depth: '64000-96000m',
        matrix: 'Compressed scoria, sealed basalt bubbles, and hot fractures that release ore in pulses.',
        miningNote: 'Fracture spikes can open concealed pockets, rewarding careful stress management.',
        ores: [
          {
            name: 'Coretin',
            rarity: 'Epic',
            priceSlot: 45,
            priceRange: makePriceRange(45),
            note: 'A rare alloy seed that anchors high-temperature engines and armored casings.'
          },
          {
            name: 'Fume Silver',
            rarity: 'Epic',
            priceSlot: 46,
            priceRange: makePriceRange(46),
            note: 'A bright silver that condenses in gas pockets and pays well during vent cycles.'
          }
        ]
      },
      {
        name: 'Spine of the Chamber',
        depth: '96000-128000m',
        matrix: 'Molten vault walls, obsidian pillars, and pressure seams that only open after a full vent reset.',
        miningNote: 'Rare ore appears in short windows, so the player has to time every strike around the chamber pulse.',
        ores: [
          {
            name: 'Pyrocrest',
            rarity: 'Mythic',
            priceSlot: 47,
            priceRange: makePriceRange(47),
            note: 'A crest-shaped crystal metal formed where fire pressure folds into a single ridge.'
          },
          {
            name: 'Sear Gold',
            rarity: 'Mythic',
            priceSlot: 48,
            priceRange: makePriceRange(48),
            note: 'A gold alloy tempered by repeated flame exposure and sold as an elite heat reserve.'
          }
        ]
      }
    ]
  },
  {
    id: 'crystal-cathedral',
    name: 'Crystal Cathedral',
    order: 7,
    globalDepth: { start: 768000, end: 896000 },
    localDepthLimit: 128000,
    tagline: 'A silent vault where sound splits into light.',
    overview:
      'Crystal Cathedral turns mining into a refractive discipline. Every cut changes the way light and sound travel, so the player profits by preserving clean lines, keeping resonance low, and harvesting ore before the chamber loses its harmony.',
    visualIdentity: {
      palette: { base: '#132038', accent: '#7be7ff', glow: '#f1dbff' },
      lighting: 'Prismatic shafts of light rebound off every facet and turn movement into color.',
      terrain: 'Faceted quartz walls, mirrored dust, and clear crystal buttresses.',
      architecture: 'Stained-glass spines, choir loft terraces, and translucent nave towers.',
      atmosphere: 'A held-breath silence broken only by ringing echoes and soft spectral hums.',
      uiMotif: 'Prism angles, halo lines, and glass-clean panels with luminous edges.'
    },
    economySystem: {
      name: 'Refraction Tithe',
      summary: 'Ore gains a stronger market premium when the cathedral remains intact and the player avoids cracking too many facets.',
      playerRule: 'Protect the chamber geometry; excess shattering lowers the tithe and weakens the payout curve.'
    },
    hazards: [
      {
        name: 'Choir Fracture',
        effect: 'A resonant crack travels through the nave and knocks loose shards from the ceiling.',
        consequence: 'The next extraction cycle is interrupted by falling crystal debris.'
      },
      {
        name: 'Prism Blindness',
        effect: "Overexposed reflections overload the miner's sense of direction and color balance.",
        consequence: 'Navigation markers weaken until the player reorients through a dark pocket.'
      },
      {
        name: 'Cathedral Feedback',
        effect: 'Repeated drilling sends a looping echo through the walls and amplifies microfractures.',
        consequence: 'The following collapse check becomes more severe if the player keeps pushing.'
      }
    ],
    strata: [
      {
        name: 'Clerestory Dust',
        depth: '0-32000m',
        matrix: 'Powdered quartz, fallen tracery, and bright dust that drifts like ground glass.',
        miningNote: 'Gentle extraction is rewarded because rough cutting confuses the light map.',
        ores: [
          {
            name: 'Hush Quartz',
            rarity: 'Common',
            priceSlot: 49,
            priceRange: makePriceRange(49),
            note: 'A quiet crystal used for low-noise housings and refined lens work.'
          },
          {
            name: 'Bell Opal',
            rarity: 'Uncommon',
            priceSlot: 50,
            priceRange: makePriceRange(50),
            note: 'A soft-ringing opal that trades well in prestige architecture markets.'
          }
        ]
      },
      {
        name: 'Nave Crystal',
        depth: '32000-64000m',
        matrix: 'Load-bearing crystal columns and glass soil that fractures in long, elegant lines.',
        miningNote: 'Clean cuts preserve value, while rough cuts can shatter entire corridors of premium material.',
        ores: [
          {
            name: 'Choir Topaz',
            rarity: 'Rare',
            priceSlot: 51,
            priceRange: makePriceRange(51),
            note: 'A golden topaz that carries resonance and is wanted by signal engineers.'
          },
          {
            name: 'Aural Sapphire',
            rarity: 'Rare',
            priceSlot: 52,
            priceRange: makePriceRange(52),
            note: 'A blue crystal tuned to vibration, valuable for precision instruments.'
          }
        ]
      },
      {
        name: 'Reredos Seam',
        depth: '64000-96000m',
        matrix: 'Heavier gem rock threaded with conductive crystal veins and thin mirror seams.',
        miningNote: 'Power use triggers resonance discounts, so the player has to balance output against chamber integrity.',
        ores: [
          {
            name: 'Psalm Ruby',
            rarity: 'Epic',
            priceSlot: 53,
            priceRange: makePriceRange(53),
            note: 'A deep red ruby that stores harmonic charge for advanced drill arrays.'
          },
          {
            name: 'Canticle Zircon',
            rarity: 'Epic',
            priceSlot: 54,
            priceRange: makePriceRange(54),
            note: 'A bright zircon shaped by repeated chants of pressure and worth a strong ceremonial premium.'
          }
        ]
      },
      {
        name: 'Apex Rosewindow',
        depth: '96000-128000m',
        matrix: 'Suspended crystal lattice, mirror dust, and almost weightless stone bridges.',
        miningNote: 'Rare harvest only appears if the cathedral stays intact long enough to unlock the upper bloom.',
        ores: [
          {
            name: 'Sanctum Diamond',
            rarity: 'Mythic',
            priceSlot: 55,
            priceRange: makePriceRange(55),
            note: 'A flawless diamond grown in still air and treated as a vault-grade reserve.'
          },
          {
            name: 'Radiant Beryl',
            rarity: 'Mythic',
            priceSlot: 56,
            priceRange: makePriceRange(56),
            note: 'A glass-bright beryl that sells as the final refinement of a pristine chamber.'
          }
        ]
      }
    ]
  },
  {
    id: 'sulfur-wastes',
    name: 'Sulfur Wastes',
    order: 8,
    globalDepth: { start: 896000, end: 1024000 },
    localDepthLimit: 128000,
    tagline: 'A corrosive field that taxes breath, tools, and certainty.',
    overview:
      'Sulfur Wastes is a hostile economy built on contamination. Players earn more when they extract quickly and pay less exposure tax, but leaving a tunnel open too long turns the surrounding air and soil into a liability.',
    visualIdentity: {
      palette: { base: '#3a3021', accent: '#d7bf43', glow: '#ffea8a' },
      lighting: 'Diffuse sickly daylight spills through gas clouds and reflective salt crusts.',
      terrain: 'Sulfur dunes, chalk pans, acid crust, and brittle mineral foam.',
      architecture: 'Corroded pylons, dead vent stacks, and warning-stamped containment ribs.',
      atmosphere: 'A stinging haze with dry thunder and the smell of old matches.',
      uiMotif: 'Hazard stamps, gas mask silhouettes, and warning stripes cut into matte panels.'
    },
    economySystem: {
      name: 'Volatile Duty',
      summary: 'Safe extraction builds a duty meter that raises sale price, while every hazard hit taxes the payout and can erase the bonus.',
      playerRule: 'Mine in short, controlled bursts so the duty meter stays profitable instead of becoming a corrosion bill.'
    },
    hazards: [
      {
        name: 'Caustic Mire',
        effect: 'Acidic sludge pools around drill cuts and starts eating hardware durability.',
        consequence: 'Repair costs rise until the player clears the affected shaft.'
      },
      {
        name: 'Yellow Haze',
        effect: 'Thick sulfur fog lowers visibility and smears the scanner feed.',
        consequence: 'Range and map clarity shrink until the player reaches cleaner air.'
      },
      {
        name: 'Breath Debt',
        effect: 'Every second spent in an unsealed pocket charges the player for air filtration.',
        consequence: 'Idle play becomes expensive unless the route is ventilated properly.'
      }
    ],
    strata: [
      {
        name: 'Sour Top',
        depth: '0-32000m',
        matrix: 'Sulfur powder, salt crust, and thin mineral crusts that crunch under the drill.',
        miningNote: 'Entry is easy, but exposure starts building almost immediately.',
        ores: [
          {
            name: 'Brassrot',
            rarity: 'Common',
            priceSlot: 57,
            priceRange: makePriceRange(57),
            note: 'A tarnished brass ore with a strong market for corrosion-resistant fittings.'
          },
          {
            name: 'Limeburn',
            rarity: 'Uncommon',
            priceSlot: 58,
            priceRange: makePriceRange(58),
            note: 'A calcium-heavy ore that trades well in neutralizing compounds and filters.'
          }
        ]
      },
      {
        name: 'Vapor Step',
        depth: '32000-64000m',
        matrix: 'Condensed gas pockets, brittle alunite, and hollow ground that vents through each strike.',
        miningNote: 'The player must open vents in a pattern or risk choking the entire lane.',
        ores: [
          {
            name: 'Fume Tin',
            rarity: 'Rare',
            priceSlot: 59,
            priceRange: makePriceRange(59),
            note: 'A light tin that forms only where sulfur vapor cools in a steady draft.'
          },
          {
            name: 'Acid Amber',
            rarity: 'Rare',
            priceSlot: 60,
            priceRange: makePriceRange(60),
            note: 'A resinous amber charged with acid salts and sold to specialty refiners.'
          }
        ]
      },
      {
        name: 'Brine Scar',
        depth: '64000-96000m',
        matrix: 'Brackish mud, sulfur shale, and saturated layers that slow tools with every pass.',
        miningNote: 'Heavy layers reduce drill tempo until the player neutralizes the pocket and drains the brine.',
        ores: [
          {
            name: 'Murk Nickel',
            rarity: 'Epic',
            priceSlot: 61,
            priceRange: makePriceRange(61),
            note: 'A dark nickel that forms in the mud line and commands a high industrial rate.'
          },
          {
            name: 'Pale Cobalt',
            rarity: 'Epic',
            priceSlot: 62,
            priceRange: makePriceRange(62),
            note: 'A washed cobalt ore that survives acid better than conventional alloy feedstock.'
          }
        ]
      },
      {
        name: 'Bitter Sink',
        depth: '96000-128000m',
        matrix: 'Ash salts, mineral foam, and dead pockets where the air is almost fully spent.',
        miningNote: 'Rare ores appear only after the haze clears, so the player has to survive before they can profit.',
        ores: [
          {
            name: 'Ghost Sulfide',
            rarity: 'Mythic',
            priceSlot: 63,
            priceRange: makePriceRange(63),
            note: 'A pale sulfide that vanishes in wet air and sells as an exotic chemistry input.'
          },
          {
            name: 'Crown Pyrite',
            rarity: 'Mythic',
            priceSlot: 64,
            priceRange: makePriceRange(64),
            note: 'A crown-shaped pyrite bloom valued by collectors and sealed industrial buyers.'
          }
        ]
      }
    ]
  },
  {
    id: 'fossil-abyss',
    name: 'Fossil Abyss',
    order: 9,
    globalDepth: { start: 1024000, end: 1152000 },
    localDepthLimit: 128000,
    tagline: 'A buried archive where every cut can wake a different age.',
    overview:
      'Fossil Abyss rewards restraint rather than speed. The player earns the best returns by preserving specimens, working through sediment in layers, and treating every fracture as a possible museum-grade loss.',
    visualIdentity: {
      palette: { base: '#1d1b1a', accent: '#a89a83', glow: '#e8d6b8' },
      lighting: 'Dim mineral lamps and bone-white reflections bounce softly off the trench walls.',
      terrain: 'Fossil marl, shell grit, compressed clay, and ribbed stone beds.',
      architecture: 'Rib vaults, skull bridges, and sediment pillars that look assembled by an ancient hand.',
      atmosphere: 'Dust motes, old pressure, and a quiet sense that the ground is catalogued history.',
      uiMotif: 'Ledger bones, stratigraphic ticks, and archive labels with faint specimen seals.'
    },
    economySystem: {
      name: 'Museum Share Ledger',
      summary: 'Intact fossils increase the museum dividend, while broken specimens lower future demand and shrink the biomes premium tier.',
      playerRule: 'Mine like a curator: careful extraction pays better than brute force, and damaged finds should be avoided when possible.'
    },
    hazards: [
      {
        name: 'Ribquake',
        effect: 'A fossil plate shifts under pressure and snaps a long seam through the trench floor.',
        consequence: 'New corridors become blocked until the player clears the bone slide.'
      },
      {
        name: 'Amber Fever',
        effect: 'Resin pockets warm up and throw the scanner into a bright, misleading shimmer.',
        consequence: 'Price estimates become unstable until the chamber cools.'
      },
      {
        name: 'Coffin Bloom',
        effect: 'Ancient spores or trapped microbes wake inside sealed stone and begin filling the shaft.',
        consequence: 'The player loses clean-air efficiency until the pocket is vented.'
      }
    ],
    strata: [
      {
        name: 'Dust Reliquary',
        depth: '0-32000m',
        matrix: 'Powdered marl, shell grit, and fragile sediment that still holds surface-era relics.',
        miningNote: 'Easy to enter, but careless drilling reduces the value of any fossils recovered here.',
        ores: [
          {
            name: 'Index Bone',
            rarity: 'Common',
            priceSlot: 65,
            priceRange: makePriceRange(65),
            note: 'A catalog-ready bone mineral that is useful in restoration and archival work.'
          },
          {
            name: 'Archive Flint',
            rarity: 'Uncommon',
            priceSlot: 66,
            priceRange: makePriceRange(66),
            note: 'A hard flint pressed from the archive layer and valued for clean tooling.'
          }
        ]
      },
      {
        name: 'Mammoth Shelf',
        depth: '32000-64000m',
        matrix: 'Pressed bone beds, limestone ribs, and thick stone where intact specimens are common.',
        miningNote: 'The player gains better payouts by cutting around the specimen instead of through it.',
        ores: [
          {
            name: 'Ledger Amber',
            rarity: 'Rare',
            priceSlot: 67,
            priceRange: makePriceRange(67),
            note: 'A translucent amber used to store specimens and bind fragile museum shipments.'
          },
          {
            name: 'Fossil Jade',
            rarity: 'Rare',
            priceSlot: 68,
            priceRange: makePriceRange(68),
            note: 'A green mineral that grows around preserved shells and sells to collectors.'
          }
        ]
      },
      {
        name: 'Silt Sarcophagus',
        depth: '64000-96000m',
        matrix: 'Dense clay, fern prints, and petrified mud that locks details into the layer like a mold.',
        miningNote: 'The pace slows, but specimen quality rises sharply if the player respects the layer seams.',
        ores: [
          {
            name: 'Grave Quartz',
            rarity: 'Epic',
            priceSlot: 69,
            priceRange: makePriceRange(69),
            note: 'A quartz body that traps old sediment in a clean, high-value geological record.'
          },
          {
            name: 'Specimen Opal',
            rarity: 'Epic',
            priceSlot: 70,
            priceRange: makePriceRange(70),
            note: 'A museum-grade opal that holds ancient patterning and brings strong display value.'
          }
        ]
      },
      {
        name: 'Ancestor Trench',
        depth: '96000-128000m',
        matrix: 'Compressed bones, tooth seams, and mineralized tendon packed into a near-solid archive wall.',
        miningNote: 'Rare finds require surgical extraction and reward players who avoid overcutting the trench face.',
        ores: [
          {
            name: 'Ancestry Onyx',
            rarity: 'Mythic',
            priceSlot: 71,
            priceRange: makePriceRange(71),
            note: 'A black onyx formed around deep remains and prized by memorial and archive buyers.'
          },
          {
            name: 'Titan Marrow',
            rarity: 'Mythic',
            priceSlot: 72,
            priceRange: makePriceRange(72),
            note: 'A dense marrow stone harvested from the oldest remains in the abyss and bought at premium rates.'
          }
        ]
      }
    ]
  },
  {
    id: 'geode-hollow',
    name: 'Geode Hollow',
    order: 10,
    globalDepth: { start: 1152000, end: 1280000 },
    localDepthLimit: 128000,
    tagline: 'A shell of stone hiding pocket worlds inside.',
    overview:
      'Geode Hollow is a cave of nested chambers and hidden premiums. The player profits by preserving sealed pockets, opening them in the right order, and avoiding chain cracks that destroy the value stored inside the shell.',
    visualIdentity: {
      palette: { base: '#18252b', accent: '#7cb6a6', glow: '#f4ffb3' },
      lighting: 'Dappled chamber light spills from hidden geodes and makes every pocket look alive.',
      terrain: 'Rounded stone shells, hollow pebbles, crystal eggs, and concentric mineral bands.',
      architecture: 'Nested domes, faceted shells, and cavity walls that look grown rather than built.',
      atmosphere: 'Soft pulses, mineral chimes, and the feeling that the cave is breathing through its seams.',
      uiMotif: 'Concentric rings, split-seam markers, and gem pockets framed like nested diagrams.'
    },
    economySystem: {
      name: 'Cavity Premium',
      summary: 'Intact geode pockets gain a premium the longer they remain sealed, but that premium collapses if the shell is cracked too wide.',
      playerRule: 'Open pockets carefully and in sequence; premature burst mining lowers the value of the entire chamber.'
    },
    hazards: [
      {
        name: 'Shell Pop',
        effect: 'A stressed geode bursts and throws sharp mineral fragments through the lane.',
        consequence: 'The player loses premium value and takes a brief safety penalty.'
      },
      {
        name: 'Pocket Echo',
        effect: 'Sound repeats through the cavities and lures the drill path toward false openings.',
        consequence: 'Hidden rooms can be skipped unless the player rechecks the chamber map.'
      },
      {
        name: 'Dendrite Bloom',
        effect: 'Crystalline growth spreads across exposed walls and coats tools in conductive dust.',
        consequence: 'Mining speed slows until the bloom is cleared or bypassed.'
      }
    ],
    strata: [
      {
        name: 'Pebble Skin',
        depth: '0-32000m',
        matrix: 'Rounded stone skins and hollow pebbles that hide small pockets inside the outer shell.',
        miningNote: 'Fast to clear, but many pockets are dead ends unless the player probes carefully.',
        ores: [
          {
            name: 'Nest Agate',
            rarity: 'Common',
            priceSlot: 73,
            priceRange: makePriceRange(73),
            note: 'A layered agate formed in tiny cavities and sold for ornamental nesting work.'
          },
          {
            name: 'Pebble Citrine',
            rarity: 'Uncommon',
            priceSlot: 74,
            priceRange: makePriceRange(74),
            note: 'A warm citrine found in the skin layer and valued for pocket-sized luxury goods.'
          }
        ]
      },
      {
        name: 'Bubble Mantle',
        depth: '32000-64000m',
        matrix: 'Air pockets inside limestone eggs and thin crystal membranes that shift the map as they connect.',
        miningNote: 'The player needs to open rooms in the right order or waste time on empty cavities.',
        ores: [
          {
            name: 'Cavity Tourmaline',
            rarity: 'Rare',
            priceSlot: 75,
            priceRange: makePriceRange(75),
            note: 'A striped tourmaline that forms on the interior wall of sealed cavities.'
          },
          {
            name: 'Hollow Spinel',
            rarity: 'Rare',
            priceSlot: 76,
            priceRange: makePriceRange(76),
            note: 'A bright spinel with a hollow core, prized by jewelers for balanced cuts.'
          }
        ]
      },
      {
        name: 'Lattice Heart',
        depth: '64000-96000m',
        matrix: 'Interlocking crystal shells and mineral lace that wrap around larger chambers like scaffolding.',
        miningNote: 'Rare ores hide on internal walls, so the best approach is to mine the shell without breaking the heart.',
        ores: [
          {
            name: 'Geode Moonstone',
            rarity: 'Epic',
            priceSlot: 77,
            priceRange: makePriceRange(77),
            note: 'A moonstone grown in layered geodes and bought by high-end decorative manufacturers.'
          },
          {
            name: 'Seam Peridot',
            rarity: 'Epic',
            priceSlot: 78,
            priceRange: makePriceRange(78),
            note: 'A bright peridot that runs along cavity seams and pays well when extracted intact.'
          }
        ]
      },
      {
        name: 'Core Orchard',
        depth: '96000-128000m',
        matrix: 'Giant geode chambers and seedlike crystal clusters that look planted rather than grown.',
        miningNote: 'Opening the chamber releases premium veins, so the player has to decide when the shell is ready to harvest.',
        ores: [
          {
            name: 'Orchard Alexandrite',
            rarity: 'Mythic',
            priceSlot: 79,
            priceRange: makePriceRange(79),
            note: 'An alexandrite cluster with shifting color bands and a very high collector premium.'
          },
          {
            name: 'Vault Tanzanite',
            rarity: 'Mythic',
            priceSlot: 80,
            priceRange: makePriceRange(80),
            note: 'A deep tanzanite grown in sealed vault pockets and sold as the final chamber prize.'
          }
        ]
      }
    ]
  }
];
