# UNLIMITED WORKERS SYSTEM

The `Workers` upgrade should not behave like a single endless DPS bar.

It should behave like mine expansion.

Every new worker increases output pressure, but also increases the need for:

- supervision
- shifts
- housing
- safety
- logistics
- payroll
- specialization
- rescue capacity

That is the point of making Workers the only uncapped branch.

The branch should keep gold meaningful forever, but the reward for buying more workers should be operational depth, not just inflation.

## Design Goals

- Make the uncapped branch feel like expansion, not number spam.
- Turn labor into a management layer that fits the mine-operations fantasy.
- Create soft caps through support pressure, not hard caps through arbitrary limits.
- Make offline mining more interesting by letting the player configure staffing behavior.
- Make authored biomes matter by requiring different crew assignments and support models.
- Add late-game gold sinks that feel like business decisions.
- Preserve player trust by making consequences readable, recoverable, and understandable.

## Core Workforce Loop

The workforce loop should be:

1. hire or recruit workers
2. house and support them
3. assign them into crews
4. schedule their shifts
5. route them into biomes and outposts
6. pay them and manage morale
7. handle accidents, fatigue, and unrest
8. scale into a larger labor organization

This makes `Workers` the branch that turns the mine from a machine into a company.

## System Overview

The workforce system should track at least these values:

- `Headcount`: total owned workers plus temporary hires
- `Assigned Workers`: workers currently placed into crews or shifts
- `Housing Capacity`: how many workers the mine can support physically
- `Support Capacity`: how many workers the mine can operate safely and efficiently
- `Morale`: willingness to work well under current conditions
- `Fatigue`: accumulated exhaustion from dangerous or intense schedules
- `Discipline`: stability of the workforce under stress
- `Safety Rating`: accident resistance of the current operation
- `Payroll Load`: recurring gold pressure created by scale

`Headcount` should be uncapped.

`Effective Workforce` should not be uncapped.

That distinction is critical.

The player can always buy more workers, but unsupported workers should perform worse, create more incidents, and increase labor cost pressure.

## Recommended High-Level Workforce Equation

Use the uncapped worker purchase as the source of labor volume, then gate real value through support systems.

```text
Headcount              = PermanentWorkers + TemporaryWorkers
HousingEff             = min(1.0, HousingCapacity / max(Headcount, 1))
SupportEff             = min(1.0, SupportCapacity / max(Headcount, 1))
MoraleEff              = 0.70 + 0.30 * Morale
FatigueEff             = 1.00 - 0.35 * Fatigue
DisciplineEff          = 0.75 + 0.25 * Discipline
SafetyEff              = 0.80 + 0.20 * SafetyRating

EffectiveWorkforce     = Headcount
                      * HousingEff
                      * SupportEff
                      * MoraleEff
                      * FatigueEff
                      * DisciplineEff
                      * SafetyEff
```

All behavioral systems in this document should feed those multipliers.

That keeps the model readable:

- more workers still matter
- support still matters
- bad management hurts output without deleting progress

## 1. Workforce Breakpoints

The most important rule is that worker milestones should unlock new operating layers.

The player should feel the mine becoming larger and more complex at specific thresholds.

### Breakpoint Ladder

**10 workers: Foreman**

- Unlock the first `Foreman Slot`.
- A Foreman is assigned to one biome lane or one crew cluster.
- Foremen reduce idle waste, improve discipline, and make small accident events less frequent.
- This is the first point where the player stops managing a pile of workers and starts managing a team.
- The UI unlock should be a small crew roster with one leadership slot.

**25 workers: Second Shift**

- Unlock `Day Shift` and `Night Shift`.
- The player can now schedule two operating blocks instead of one always-on labor state.
- Offline returns should show performance by shift.
- This is where labor becomes a scheduling game instead of a flat production game.

**50 workers: Crew Specialization**

- Unlock specialist crew templates.
- Workers can now be grouped by role and trained for tasks instead of serving as a single pooled stat.
- This is the real beginning of authored biome play for labor.

**100 workers: Biome Outposts**

- Unlock persistent staffing in remote biomes.
- Outposts reduce reassignment delay, improve local safety, and let the player maintain a standing presence instead of redeploying from the surface every time.
- This should be the moment the world starts to feel spatially real.

**250 workers: Central Operations Board**

- Unlock a management screen for staffing, incidents, payroll, contracts, and shift policy.
- This is the point where the player stops micromanaging crews one by one and starts issuing mine-wide directives.
- It should also unlock smarter automation rules.

**500+ workers: Regional Mining Divisions**

- Unlock semi-autonomous divisions split by biome band, geographic region, or mining doctrine.
- Divisions allow the player to scale beyond direct crew-by-crew control.
- This is the late-game expression of the uncapped branch: the mine becomes an organization.

### Why Breakpoints Matter

Without breakpoints, the worker branch is just a number sink.

With breakpoints:

- the player gets a new interface layer
- the mine gets a new management problem
- gold spending creates new choices, not just faster bars

That is how the uncapped branch stays interesting at high count.

## 2. Shift System

The shift system should make offline mining more trustworthy and active play more expressive.

The player is not only deciding how many workers they own.

They are deciding how those workers behave while the mine runs.

### Shift Structure

At minimum, the mine should support:

- `Day Shift`
- `Night Shift`

Later systems can overlay special policies on top of those templates.

Each shift should define:

- labor intensity
- hazard tolerance
- biome priority
- contract priority
- morale impact
- fatigue gain
- accident modifier
- payroll modifier

### Recommended Shift Types

**Day Shift**

- Baseline balanced schedule
- Standard wages
- Normal accident rates
- Best default for trusted AFK play

**Night Shift**

- Slightly lower support efficiency in dark or unstable biomes unless specialized crews are assigned
- Slight wage premium
- Better performance in darkness-adapted or stealth-sensitive biomes if supported properly
- Feels riskier but efficient when optimized

**Overtime Mode**

- Higher extraction and haul throughput
- Faster fatigue accumulation
- Higher injury chance
- Increased wage multiplier
- Best for short active sessions and emergency contract pushes

**Hazard-Safe Shift**

- Lower production
- Lower accident chance
- Lower fatigue gain
- Stronger hazard resistance and better discipline retention
- Best default for long offline windows

**Deep-Zone Specialist Shift**

- Better performance in deeper biomes
- Worse efficiency in shallow routes
- Higher support demand and better chance to trigger deep discoveries
- Best for players pushing progression instead of pure income

**Contract Priority Shift**

- Crews, transport, and protected storage all favor contract targets
- Lower incidental ore variety
- Better contract completion reliability
- Useful when demand is more important than raw output

### Offline Resolution

The shift system should be central to offline simulation.

When the player leaves, the mine should not simply run one hidden formula.

It should resolve according to the selected shift plan.

Recommended behavior:

- `Balanced / Safe` plans produce lower but more stable returns
- `Aggressive / Overtime` plans produce higher raw returns but more fatigue, accidents, and payroll pressure
- offline reports should clearly show which shift produced the result

That makes coming back to the game feel like reading an operations summary instead of collecting a generic idle reward.

## 3. Workforce Support Infrastructure

If workers are uncapped, the mine must physically and institutionally support them.

Support buildings should act as secondary sinks created by labor expansion.

They should not feel optional for long.

### Core Support Buildings

**Barracks**

- Primary housing capacity building
- Prevents overcrowding penalties
- Base requirement for sustainable workforce growth

**Mess Hall**

- Improves morale recovery
- Reduces fatigue carryover between shifts
- Makes overtime less punishing

**Medical Bay**

- Reduces injury downtime
- Improves rescue survival outcomes
- Lowers long-tail productivity losses after accidents

**Safety Office**

- Lowers accident frequency
- Improves discipline after bad events
- Reduces compliance penalties and settlement payouts

**Training Hall**

- Unlocks and upgrades specialization
- Improves veteran growth
- Increases crew reassignment efficiency because trained workers lose less productivity when moved

**Equipment Lockers**

- Reduces gear shortages
- Lowers deployment delay
- Improves performance in hostile biomes by ensuring correct equipment is issued

**Transport Hub**

- Reduces travel time between surface, outposts, and deep lanes
- Makes rescue dispatch faster
- Improves multi-biome staffing and contract response

### Support Philosophy

These buildings should not simply add passive buffs.

They should support specific labor pressures:

- Barracks solve crowding
- Mess Hall solves fatigue recovery
- Medical Bay solves injury downtime
- Safety Office solves incident frequency
- Training Hall solves specialization and scaling
- Lockers solve readiness
- Transport Hub solves geographic coordination

That makes expansion feel legible.

Every building answers a real workforce problem.

## 4. Morale, Fatigue, and Discipline

This is the main soft-cap layer for uncapped workers.

The game should not say "you cannot buy more workers."

It should say:

"You can buy more workers, but if you scale badly, your labor force becomes expensive, exhausted, and unreliable."

### Morale

Morale represents willingness, confidence, and buy-in.

Morale should rise from:

- fair payroll
- safe conditions
- successful rescues
- good food and housing
- discovery moments
- contract completion bonuses

Morale should fall from:

- unpaid wage pressure
- repeated accidents
- overcrowding
- unsafe shift policies
- excessive black-market labor usage
- prolonged overtime

Low morale should reduce:

- synergy
- discovery quality
- contract reliability
- crew reassignment speed

### Fatigue

Fatigue represents wear, exhaustion, and accumulated strain.

Fatigue should rise from:

- overtime
- deep-zone assignments
- hazard-heavy biomes
- poor mess hall support
- long rescue chains

Fatigue should lower:

- idle efficiency
- hazard resistance
- morale retention
- accident avoidance

Fatigue should recover through:

- safer shifts
- rest cycles
- better housing
- mess hall quality
- medical support

### Discipline

Discipline represents order and compliance under pressure.

It is not the same as morale.

A crew can be low-morale but still disciplined.

Discipline should fall when:

- payroll is missed
- accidents go unresolved
- black-market hires dominate the workforce
- outposts are neglected
- support systems lag too far behind headcount

Low discipline should create:

- absenteeism
- theft or loss events
- ignored shift assignments
- higher unrest risk
- more severe accident escalations

This gives the worker branch a real management ceiling without destroying player agency.

## 5. Crew Assignment by Biome

Workers should not exist only as a global number.

They should exist as crews assigned to actual places.

That is how labor finally connects to authored biomes.

### Assignment Model

Workers should first be grouped into crews, then assigned by biome and role.

Recommended crew roles:

- `Extraction Crew`
- `Hauler Crew`
- `Stabilization Crew`
- `Survey Crew`
- `Recovery Crew`

Each crew should have:

- a size
- a training focus
- a current shift
- a morale state
- a fatigue state
- a biome affinity
- a travel status

### Example Specialist Crews

**Lava Crew**

- Better heat tolerance
- Lower efficiency outside volcanic biomes
- Stronger performance in Magma Chamber, Abyss Core, and similar bands

**Fossil Recovery Crew**

- Preserves specimen integrity
- Lower raw ore rate
- Best for museum and contract-grade discoveries

**Crystal Integrity Crew**

- Better at clean extraction in fragile formations
- Reduces shatter loss in crystal and geode biomes

**Toxic Vent Crew**

- Better ventilation handling
- Higher performance in sulfur, spore, and contamination-heavy zones

**Darkness-Adapted Crew**

- Better at low-light biomes
- Stronger performance in Shadow Rift and similar regions

### Reassignment Friction

Crew reassignment should not be free.

It should cost:

- travel time
- temporary efficiency
- transport capacity

Biome outposts and transport hubs should reduce this friction.

That makes local staffing a strategic commitment.

## 6. Recruitment Market

The recruitment market gives the uncapped worker branch a source layer.

The player should not only buy anonymous labor from a generic button forever.

They should be making labor sourcing decisions.

### Recruitment Sources

**Standard Hiring**

- Cheap
- Reliable
- Generic workers
- Best for early and stable expansion

**Premium Specialists**

- Expensive upfront and expensive payroll
- Arrive with specialization or strong traits
- Best for deep biomes, fragile extraction, and contract runs

**Temporary Contractors**

- No permanent housing burden
- Higher shift cost
- Good for short contract pushes or event windows

**Biome-Native Crews**

- Better local efficiency in specific biome families
- Harder to acquire consistently
- Add world flavor and long-term build identity

**Black-Market Labor**

- Strong short-term throughput
- Lower discipline
- Higher accident risk
- Higher settlement risk after bad streaks

### Recruitment Market Behavior

The market should refresh periodically and offer:

- worker count packages
- specialist candidates
- contract labor bundles
- traited crews
- emergency hires after disasters

This system adds economic texture to the unlimited branch.

Scaling labor becomes a sourcing decision, not a single purchase pattern.

## 7. Payroll, Wages, and Labor Tax

An uncapped workforce needs recurring economic pressure.

Without payroll, workers become pure upside.

With payroll, the player must decide whether current scale is actually profitable.

### Payroll Components

**Base Wages**

- Paid per worker or per crew
- Scales with specialization quality

**Hazard Pay**

- Added for dangerous biome assignments
- Higher in heat, toxic, collapse-prone, or deep-zone routes

**Overtime Premium**

- Added when the player pushes high-intensity shifts
- Strong sink for active optimization sessions

**Contract Completion Bonuses**

- Paid when crews are assigned to priority delivery work
- Improves morale if paid consistently

**Settlements and Labor Penalties**

- Trigger after repeated accidents, unpaid obligations, or severe discipline loss
- Prevent the player from riding unsafe high-yield labor forever

### Recommended Payroll Equation

```text
BasePayroll        = sum(WorkerBaseWage by assigned workers)
HazardPay          = sum(BiomeHazardPremium by assigned workers)
OvertimePremium    = sum(ShiftOvertimePremium by assigned workers)
ContractBonuses    = sum(ActiveContractCrewBonus)
SettlementCost     = IncidentPenalty + UnrestPenalty + CompliancePenalty

TotalPayroll       = BasePayroll + HazardPay + OvertimePremium + ContractBonuses + SettlementCost
```

This should resolve every payroll cycle and appear in return reports.

The player should understand exactly why labor is costing what it costs.

## 8. Accident and Rescue System

More labor should create more operational risk.

That risk should be legible, theme-rich, and recoverable.

### Core Accident Examples

**Cave-In**

- Traps crews
- Blocks route throughput
- Can damage nearby outpost support

**Toxic Exposure**

- Injures assigned workers
- Lowers output in the affected crew until treated

**Broken Lift**

- Delays shift transfer, ore movement, and emergency response
- Cascades into payroll inefficiency because labor waits without producing

**Equipment Failure**

- Lowers a crew's effectiveness
- More common when locker support and safety standards are weak

### Incident Structure

Every incident should define:

- trigger
- severity
- affected crew
- impacted biome
- immediate production loss
- recovery cost
- rescue window

### Rescue Layer

Rescues should act like mini-events.

The player can decide to:

- spend gold for an immediate response
- reroute nearby crews
- use medical and transport capacity
- accept losses to protect the wider mine

Good rescues should improve morale.

Bad rescues should damage morale and discipline.

That makes the rescue system an emotional counterweight to pure extraction.

## 9. Housing and Expansion Map

As worker count rises, the mine base should physically expand.

This is the visual and structural expression of the uncapped branch.

### Recommended Base Expansion Ladder

**Worker Camp**

- First visible housing cluster
- Small morale and housing baseline

**Deep Barracks**

- Larger housing block for mid-scale operations
- Supports second shift and improved fatigue recovery

**Outpost Tunnels**

- Connect surface operations to biome outposts
- Improve redeployment and rescue flow

**Biome-Specific Bunkers**

- Local support buildings for dangerous regions
- Reduce hazard penalties for assigned crews

**Central Command Station**

- Headquarters for payroll, shift policies, and incident response
- Required for true large-scale coordination

### Expansion Map Role

The expansion map should not only be decorative.

It should:

- define housing capacity
- define support reach
- define outpost network coverage
- define rescue speed
- define where labor pressure is strongest

This turns workforce growth into visible mine development.

## 10. Worker-Triggered Discoveries

Worker discoveries should be extremely rare.

They should not be common enough to farm through brute-force headcount.

They should feel like legends, rumors, or unexpected field reports.

### Discovery Rule

Worker-triggered discoveries should come from designated exploration-capable crews, not from every worker tick.

That prevents the uncapped branch from turning rare content into an inevitability.

Recommended rule:

- only `Survey`, `Recovery`, or `Expedition` crews can roll for worker discoveries
- only a limited number of discovery rolls can occur per biome per shift
- higher headcount improves coverage, not raw infinite discovery spam

### Example Discovery Types

**Hidden Side Tunnels**

- Unlock short-term side routes
- May expose new ore pockets or event chains

**Fossils**

- Feed the museum and intact specimen systems
- Best found by recovery crews in fossil bands

**Relics**

- Extremely rare account-level finds
- May unlock codex entries, prestige hooks, or contract chains

**Abandoned Machinery**

- Can become repair projects, temporary bonuses, or permanent facility unlocks

**Rumor-Based Anomaly Events**

- Crew reports open short-lived anomaly windows
- These should feel like "someone found something strange" moments

### Recommended Discovery Equation

Keep the base chance very small and heavily bottlenecked by expedition capacity.

```text
DiscoveryRollsPerShift = ExpeditionCrewCount + OutpostSurveySlots
BaseDiscoveryChance    = 0.00002
DangerBonus            = 1 + LocalHazardTier * 0.15
VeteranBonus           = 1 + VeteranCrewRatio * 0.35
MoraleBonus            = 0.85 + 0.15 * Morale

DiscoveryChance        = BaseDiscoveryChance * DangerBonus * VeteranBonus * MoraleBonus
```

This should be rare enough that a discovery is memorable, not expected.

## 11. System Progression by Stage

### Early Workforce Stage

Focus:

- headcount growth
- foreman unlock
- barracks
- stable day shift

Player fantasy:

- "I hired a team."

### Mid Workforce Stage

Focus:

- second shift
- specialization
- morale and fatigue management
- first accidents and rescues

Player fantasy:

- "I run crews."

### Late Workforce Stage

Focus:

- outposts
- recruitment market choices
- payroll optimization
- biome staffing

Player fantasy:

- "I operate a mine network."

### Endgame Workforce Stage

Focus:

- central operations board
- divisions
- large payroll
- high-risk staffing doctrines
- ultra-rare worker discoveries

Player fantasy:

- "I run a mining company."

## 12. Why This Fixes the Unlimited Branch

This design solves the main failure mode of uncapped workers.

The branch no longer means:

- buy workers
- get more DPS
- repeat forever

It now means:

- buy workers
- unlock a new layer of management
- solve support problems
- choose staffing doctrines
- scale the mine geographically
- handle labor risk
- discover extremely rare operational rewards

That is the right fantasy for this website.

The uncapped branch becomes the backbone of the operations simulator instead of the branch that trivializes it.

## Final Recommendation

Workers should remain the only uncapped upgrade.

But from `10 workers` onward, the player should no longer think of them as a stat purchase.

They should think of them as a growing organization with:

- supervisors
- shifts
- housing
- specialization
- payroll
- outposts
- incidents
- discoveries

That is what makes the uncapped branch feel deep, scalable, and aligned with the authored mine world.
