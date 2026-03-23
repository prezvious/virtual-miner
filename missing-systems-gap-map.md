# Missing Systems Gap Map

## Purpose

This document replaces the older `missing-core-mechanics.txt` draft.

The previous file focused on isolated actions like clicking, auto-mining, depth gain, and selling. That is not enough for the current website concept.

The website is not selling "an idle clicker with ores." It is selling a mine operations game:

- authored biomes with distinct rules
- hybrid RNG with discovery moments
- high-trust offline simulation
- automation with bottlenecks
- route choice, hazard management, and payout optimization
- prestige as long-term mine strategy

The main problem is not a lack of ore math. The main problem is that the mine is not yet modeled as a coherent system.

## Core Diagnosis

The concept is currently strongest in these areas:

- rarity framing
- offline simulation math
- event fantasy
- biome flavor and authored world identity

The concept is currently weakest in these areas:

- player decision-making
- mine-state simulation
- logistics and processing
- risk resolution
- contract and market structure
- persistence of consequences across systems

In short:

- production exists
- payout exists
- flavor exists
- but the operating model of the mine is still mostly implied

That is the real gap.

## The Correct Design Spine

If Virtual Miner is going to match the website concept, the game should be structured around three interlocking loops.

### 1. Active Loop

The active loop should not be "click to get more ore." It should be:

1. choose a route or biome lane
2. read the current mine state
3. mine with a specific extraction style
4. manage hazards or preserve local bonuses
5. decide what to store, process, sell, or reserve
6. cash out on the current window before the advantage collapses

This makes active play about judgment, timing, and pattern recognition.

### 2. Idle Operations Loop

The idle loop should not be "numbers keep going up." It should be:

1. assign workers, bots, and drones
2. configure logistics and sell rules
3. choose what systems to stabilize while away
4. accept that some subsystems run well offline and others degrade
5. return to a report that explains both gains and losses

This makes offline play feel trusted but not brainless.

### 3. Meta Progression Loop

The long-term loop should be:

1. unlock deeper bands and new biomes
2. master new rulesets
3. complete discovery and contract layers
4. build around a specific mine strategy
5. prestige into a stronger or different specialization

This makes prestige feel like a strategic reset, not just a multiplier reset.

## System-Level Gaps

## 1. Missing Mine-State Simulation

The current concept references many local conditions, but there is no unified model for them.

This is the biggest missing layer.

The game needs a shared mine-state framework that biome mechanics, hazards, automation, events, and value systems can all use.

Recommended shared state families:

- `heat`
- `pressure`
- `air / contamination`
- `light / darkness`
- `flow / drainage`
- `charge / magnetic stability`
- `integrity / collapse risk`
- `specimen integrity`
- `route stability`

Without this layer, biome identity stays cosmetic.

With this layer, each biome can behave differently using the same systemic vocabulary.

Examples:

- Magma Chamber cares about heat bands and venting.
- Sulfur Wastes cares about toxic air and ventilation.
- Shadow Rift cares about light footprint.
- River biomes care about flow and blocked exits.
- Fossil Abyss cares about specimen integrity.
- Plasma Vein cares about charge buildup and bleed-off.

Current gap:

- these states are described in prose
- but they are not formalized as gameplay resources, thresholds, penalties, or opportunity windows

## 2. Missing Player Decision Layer

The current mechanic draft explains how ore is generated, but not how the player makes meaningful choices.

The website concept implies that the player should be making decisions such as:

- where to mine
- how aggressively to mine
- whether to preserve or exploit the local layer
- whether to stabilize the route or push for payout
- whether to sell now, process later, or reserve for contracts
- whether to specialize in depth, rarity, logistics, or curation

These decisions need rule support.

Currently underdefined:

- route selection
- biome switching
- lane specialization
- safe vs risky extraction
- local state management
- session goal selection

If these are not defined, the game becomes mathematically deep but strategically flat.

## 3. Missing Contracts and Directed Demand

Contracts are referenced in the offline system, but there is no real contract game yet.

This is a major gap because contracts are one of the best ways to turn a passive economy into a decision economy.

Contracts should create demand for:

- specific ore families
- specific rarity tiers
- intact specimens
- refinery outputs
- biome-specific items
- timed deliveries
- event-sensitive materials

A real contract system needs:

- contract generation rules
- rarity and biome weighting
- refresh cadence
- deadline logic
- failure or expiration outcomes
- reroll costs
- reputation or ranking effects
- multi-step chains
- premium clauses

Without contracts, the economy has supply but not enough structured demand.

## 4. Missing Logistics and Throughput Gameplay

Storage and conveyor exist, but they are still treated like support features instead of core gameplay systems.

For the website concept to land, logistics should become part of the mine fantasy.

The player should feel like they are operating a production chain, not just emptying a bag.

Missing logistics systems:

- ore routing rules by type, rarity, or destination
- heated, insulated, dark-safe, or filtered paths
- refinery intake priority
- protected handling for discoveries and contract items
- overflow behavior
- jam, slowdown, or contamination logic
- route maintenance costs
- lane-specific throughput

This is especially important because several biomes already imply logistics-specific mechanics:

- Frozen Depths implies heated storage and insulated transfer.
- Shadow Rift implies low-light routes.
- Sulfur Wastes implies ventilation and sealed transport.
- Gilded Vault implies conversion and tithe handling.

## 5. Missing Refinery as a Real System

Refinery currently reads as a multiplier. That is too weak.

The concept snapshot already mentions refinery queues, which implies a much larger system.

The refinery should likely support:

- time-based processing
- recipes or conversion trees
- biome-specific materials
- purity or specimen rules
- contract-grade outputs
- bullion or relic recasting
- queue management
- priority and bottleneck decisions

A stronger refinery system would create more strategic tension:

- sell raw now for fast liquidity
- process later for premium value
- reserve rare ore for contracts
- convert biome-specific drops into prestige or museum value

Without this, the economy is overly direct.

## 6. Missing Discovery, Collection, and Museum Logic

The concept references discoveries, collection bonuses, museum entries, and curator-style mining, but the rules are missing.

This matters because discovery is one of the strongest emotional promises in the website concept.

This layer needs clear answers:

- what counts as a discovery
- what counts as an intact discovery
- whether first-find rewards are account-wide or run-wide
- how duplicates behave
- how collection bonuses are earned
- whether there are set bonuses by biome, rarity, fossil family, or artifact type
- how museum value differs from sale value

This system is also a natural bridge between:

- RNG
- biome mastery
- contracts
- prestige
- welcome-back reporting

Right now it is conceptually present but mechanically absent.

## 7. Missing Automation Assignment Model

Workers, bots, and drones are mentioned, but they are not governed by a real assignment system yet.

If the game fantasy is "mine operations," automation should not just be flat DPS with skins.

Automation should support:

- lane assignment
- biome affinity
- task roles
- scouting vs extraction vs transport vs stabilization
- redeploy cost or delay
- staffing limits
- specialization upgrades
- hazard vulnerability

Potential automation roles:

- extractor
- hauler
- stabilizer
- surveyor
- vent technician
- curator
- refiner

This would make automation a build language instead of a larger-number language.

## 8. Missing Hazard Resolution Framework

Hazards exist in almost every biome description, but the concept does not define a single shared answer to:

- how hazards trigger
- how they escalate
- how they expire
- how they are countered
- how they affect active and idle systems
- how multiple hazards interact

This needs a real framework.

Each hazard should define at least:

- trigger condition
- affected subsystem
- severity
- duration
- player response
- automation response
- economic consequence

Affected subsystems could include:

- extraction speed
- scanner accuracy
- visibility
- local payout bonus
- route throughput
- specimen integrity
- drill stability
- automation uptime

Without this, hazards are only flavor text.

## 9. Missing Event Scheduler and Rule Resolution

The event concept is strong, but event logic is not yet operational.

This is dangerous because events touch everything.

The event system needs:

- spawn weights
- biome eligibility
- event families
- cooldown rules
- exclusivity rules
- offline spawn limits
- offline resolution behavior
- player choice handling
- stack order with biome and prestige modifiers
- jackpot and anti-spam safeguards

There is also a structural question:

Are events global disruptions, local lane anomalies, contract-side modifiers, or short lived market windows?

They can be all four, but they need to be categorized so their behavior is predictable.

## 10. Missing Prestige Structure

Prestige is referenced, but the reset model is underdesigned.

This is another critical gap because prestige should reorganize the whole game.

The prestige system needs to define:

- reset trigger
- prestige currency
- carryover rules
- hard persistence rules
- what resets
- what partially persists
- what permanently unlocks
- what new strategic branches become available

Prestige should not only make numbers bigger.

It should let players choose identities, for example:

- active combo hunter
- depth specialist
- contract magnate
- automation manager
- curator and museum specialist
- event manipulator

If prestige does not reshape playstyle, it becomes a chore loop.

## 11. Missing Session Structure

The current concept is good at long-form growth, but weaker at answering:

"What should I do in this session right now?"

The game needs stronger short-session structure through:

- daily objectives
- shift goals
- targeted anomalies
- rotating contract boards
- biome mastery tasks
- welcome-back recommendations
- event response prompts

This would create cleaner play rhythms:

- log in
- choose a goal
- configure the mine
- push one or two high-value windows
- leave with intention

## 12. Missing Economic Sinks and Strategic Spending

The current economy is mostly upward.

That is dangerous in an idle game with strong offline retention.

The game needs strong sinks, such as:

- contract rerolls
- route stabilization
- vent clearing
- scanner sweeps
- museum restoration
- refinery experiments
- workforce specialization
- anomaly access fees
- prestige preparation costs

These sinks should not feel punitive. They should feel like business decisions.

## Cross-System Rules Still Missing

These are not separate features. They are critical glue rules.

### Offline Edge Cases

- storage fills during offline event window
- contract expires while away
- discovery obtained while auto-sell is active
- refinery input stalls because output storage is full
- hazard state persists into return session
- multi-day offline return skips important biome moments

### Protection Rules

- contract ore should be lockable
- museum-grade finds should be protected from auto-sell
- refined outputs should be protectable by route rules
- event artifacts should bypass normal junk routing

### Modifier Resolution

The game needs a consistent order of operations for:

- biome rules
- local mine state
- event modifiers
- scanner bonuses
- prestige bonuses
- combo state
- contract clauses
- market multipliers

Without a defined resolution order, balance becomes unstable.

## Current Website Promise vs Current Design Coverage

### Already Promised Well

- authored biomes
- memorable rarity ladder
- strong offline trust
- event spectacle
- prestige as a pillar

### Not Yet Backed by Full Systems

- mine operations fantasy
- route management
- hazard counterplay
- logistics depth
- refinement decisions
- museum and specimen curation
- contract-driven play
- specialization via prestige

The site currently promises a richer game than the mechanic docs support.

## Recommended Redesign Priorities

## Priority 1: Define the Simulation Backbone

Design these first:

- universal mine-state framework
- hazard framework
- route and lane framework
- logistics protection rules

This is the substrate that biome identity depends on.

## Priority 2: Define the Decision Economy

Design next:

- contracts
- refinery
- discovery and museum
- session goals

This is the substrate that player agency depends on.

## Priority 3: Define the Operations Layer

Design next:

- worker, bot, and drone assignments
- automation roles
- route maintenance
- bottleneck visibility

This is the substrate that the "mine management" fantasy depends on.

## Priority 4: Redefine Prestige

Design next:

- reset rules
- specialization trees
- persistent unlocks
- long-term strategic identity

This is the substrate that replayability depends on.

## Priority 5: Reattach Events to the Real Systems

Design last, after the backbone exists:

- event scheduler
- event family categories
- event resolution rules
- offline event handling

This is the substrate that event quality depends on.

## Recommended Immediate Next Document Set

Instead of going back to a single mechanic list, the next docs should probably be:

1. `mine-state-framework.md`
2. `contracts-and-demand-system.md`
3. `logistics-and-routing-system.md`
4. `discovery-museum-and-specimen-system.md`
5. `automation-assignment-framework.md`
6. `prestige-specialization-model.md`
7. `event-resolution-framework.md`

## Final Summary

Virtual Miner does not primarily need more ore mechanics.

It needs a stronger operating model.

The real missing systems are:

- shared mine-state simulation
- route-based decision-making
- contracts and directed demand
- logistics and protected handling
- refinery processing depth
- discovery and museum structure
- automation assignment roles
- hazard resolution logic
- prestige specialization
- session-level objective structure

Once those exist, the current rarity, biome, offline, and event concepts will have something solid to attach to.

Until then, the game risks feeling more like a polished incremental economy than the authored mine simulator the website is promising.
