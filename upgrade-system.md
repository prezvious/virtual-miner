# UPGRADE SYSTEM

The UPGRADE SYSTEM should not feel like a flat list of "+1%" purchases. It should behave like a layered mine operations machine where every upgrade solves a visible bottleneck: production, storage, sell throughput, depth, rarity, or survival.

## Key Findings

- The current docs already imply a bottleneck economy, not a flat "buy anything, numbers go up" system.
- The mine already has 4 real pressures: production, storage, sell throughput, and depth.
- Rare drops already have math support through Scanner, Depth, and Prestige modifiers.
- Offline progression is already constrained by storage and conveyor, which means logistics upgrades should be just as important as extraction upgrades.
- The strongest direction is: upgrades should constantly ask the player, `What is currently slowing my mine down?`

## Recommended Upgrade System Concept

The UPGRADE SYSTEM should work as a layered operations machine.

The player loop becomes:

1. Mine ore.
2. Hit a bottleneck.
3. Buy the upgrade branch that solves that bottleneck.
4. Push deeper.
5. Unlock a new bottleneck.
6. Repeat.

That means upgrades should be grouped into systems:

- Extraction: Pickaxe, Auto-Drill, Workers, Drone Fleet
- Logistics: Storage, Lift Speed, Conveyor
- Value: Refinery
- Discovery: Ore Scanner, Geology Lab
- Excavation: Drill depth scaling, Dynamite
- Survival: Lighting, Ventilation
- Prestige: Dream Mining, Fortune Blessing, Autonomous Excavation

Under this model, not every branch should scale forever. The cleaner design is:

- Finite infrastructure upgrades: capped branches that solve bottlenecks, unlock breakpoints, and eventually complete.
- One uncapped upgrade: a deliberate endless sink that keeps late-game gold meaningful without replacing the bottleneck economy.

## Finite vs Uncapped Upgrade Rule

Most upgrades should have hard caps because they represent machine tiers, facility tiers, or technology milestones. Capping them keeps progression readable and forces the player to rotate between systems instead of buying one branch forever.

The single uncapped upgrade should be **Workers**.

Why Workers:

- It fits the fantasy: a mine can always hire more labor.
- It naturally creates pressure on storage, lift speed, conveyor, and ventilation.
- It works as a permanent gold sink after the structural systems are completed.
- It keeps the player question aligned with the core loop: `Can my mine actually support more workers?`

Suggested starting caps for the finite branches:

- Pickaxe: `L_max = 25`
- Auto-Drill: `L_max = 50`
- Storage: `L_max = 30`
- Dynamite: `L_max = 25`
- Conveyor: `L_max = 20`
- Refinery: `L_max = 15`
- Ore Scanner: `L_max = 25`
- Lift Speed: `L_max = 20`
- Lighting: `L_max = 15`
- Ventilation: `L_max = 20`
- Geology Lab: `L_max = 10`
- Drone Fleet: `L_max = 20`
- Dream Mining: `L_max = 10`
- Fortune Blessing: `L_max = 10`
- Autonomous Excavation: `L_max = 10`

## Upgrade Families

### Extraction

Handles raw ore generation through active play and passive mining. In this family, Workers is the only uncapped branch.

### Logistics

Controls how much ore the player can hold, move, and sell without stalling the mine.

### Value

Improves how much gold each unit of ore is worth once it reaches the sell loop.

### Discovery

Improves rare finds, ore quality, and higher-value outcomes from the same mining effort.

### Excavation

Pushes the mine deeper, faster, and more efficiently.

### Survival

Reduces biome penalties and protects mining efficiency in hazardous environments.

### Prestige

Improves long-term progression through offline efficiency, rarity scaling, and passive depth growth.

## Upgrade Inventory

### Extraction Upgrades

**Pickaxe**  
Increases click power. This is the first upgrade players buy, and it remains relevant throughout the game because manual clicking can always produce more than auto-mining, creating an incentive for active play. The cost scaling is moderate: early levels are cheap for quick onboarding, while higher levels become expensive but powerful.

**Auto-Drill**  
Increases passive ore production per second. This is the most important upgrade for transitioning into idle play. Every level feels significant because the increase in passive income is immediately visible on the display.

**Workers**  
Passive units that increase ore per second with a synergy bonus. They are more expensive per unit than the Drill, but they scale better in the late game because of their synergy. Workers should remain the only uncapped upgrade in the base economy, but they should stop behaving like a simple infinite production stat very early.

At low counts, Workers are just labor. At scale, Workers should become a full operations layer with breakpoints, shifts, crew specialization, biome assignment, support infrastructure, payroll pressure, accident risk, and ultra-rare worker-led discoveries. That means the value of buying more workers should increasingly depend on whether the mine can house, schedule, equip, supervise, and safely deploy them.

The detailed design for that layer now belongs in `unlimited-workers-system.md`. The short version is:

- `10 workers`: unlock Foreman
- `25 workers`: unlock second shift
- `50 workers`: unlock crew specialization
- `100 workers`: unlock biome outposts
- `250 workers`: unlock central operations board
- `500+ workers`: unlock regional mining divisions

This keeps Workers uncapped while making the branch feel like mine expansion instead of late-game inflation.

**Drone Fleet**  
A late-game upgrade. Drones automatically explore already unlocked biomes and bring back ore. Each drone can be assigned to a different biome. The Drone Fleet is the ultimate idle upgrade: the game effectively plays itself across all biomes at the same time.

### Logistics Upgrades

**Storage**  
Increases ore capacity. This is critical because when storage is full, mining stops. This upgrade acts as a gating mechanism, ensuring that players cannot hoard infinite ore without investing in capacity. However, the scaling is generous, since players should not feel frustrated too often by storage filling up.

**Lift Speed**  
Reduces the time needed to transfer ore from deep underground to storage. In the early game, this is instant and mostly irrelevant, but at depths of thousands of meters, ore transfer begins to have delays that can be mitigated with this upgrade.

**Conveyor**  
Unlocks and increases auto-sell speed. Level 0 means there is no auto-sell. Level 1 is a game changer. At higher levels, ore is sold almost instantly after being mined, allowing gold income to flow nonstop.

### Value Upgrades

**Refinery**  
Multiplies the selling price of all ore. This is a silent powerhouse upgrade whose impact becomes more noticeable over time. A level 10 Refinery combined with Legendary ore can generate more gold than 100x Common ore without a refinery.

### Discovery Upgrades

**Ore Scanner**  
Increases the chance of rare drops. This is the most dopamine-driven upgrade because its effect is probabilistic, but players can still feel the results: "Since upgrading the Scanner, I've been getting more Gold." The Scanner also unlocks a visual indicator in the mining area that shows "rare vein detected nearby" when the probability is high.

**Geology Lab**  
Unlocks ore identification. Before unlocking the lab, rare ores may appear as "Unknown Minerals" and must be identified before they can be sold. The lab speeds up identification and increases the chance that an ore will be identified as a higher tier.

### Excavation Upgrades

**Dynamite**  
Increases depth per blast and reduces blast cost. This upgrade feels the most eventful because the results are instant and dramatic, with screen shake and sudden depth jumps. Players who invest in Dynamite can reach new biomes faster.

### Survival Upgrades

**Lighting**  
Improves visibility in dark biomes, which translates into minor bonuses to all stats while the player is in deeper biomes. It also makes the game visuals clearer and more appealing.

**Ventilation**  
Reduces the duration of hazard effects. It is especially useful in the Toxic Mine and Lava Cave. It also improves worker efficiency in dangerous biomes.

### Prestige Upgrades

**Dream Mining**  
Improves offline mining efficiency and helps idle progression feel trustworthy instead of heavily penalized.

**Fortune Blessing**  
Improves rare-tier outcomes through prestige scaling and acts as a permanent rarity amplifier.

**Autonomous Excavation**  
Improves offline depth progression so the mine can continue pushing into deeper layers while the player is away.

## Global Cost Equation

Use two cost models: one for finite upgrades, and one for the single uncapped branch.

### Finite Upgrade Cost

```text
Cost_u(L)      = round(B_u * G_u^L * Softcap_u(L))     for 0 <= L < L_max_u
Softcap_u(L)   = 1                                     if L <= S_u
Softcap_u(L)   = 1 + 0.02 * (L - S_u)^1.25            if L > S_u
```

### Uncapped Worker Cost

```text
Cost_workers(L) = round(B_w * G_w^L * (1 + 0.012 * L^1.35))
```

- `B_u` = base cost
- `G_u` = growth multiplier
- `S_u` = softcap start level
- `L_max_u` = hard cap for finite upgrades
- `B_w` and `G_w` = worker-specific constants

This preserves milestone-based progression for structural systems while giving the economy one endless spending sink.

## Workforce Expansion Layer

The uncapped worker branch should not end at raw extraction math.

Once the player begins scaling labor, the game should branch into a second layer of workforce management:

- `Workforce Breakpoints` turn milestones into new management systems.
- `Shift Scheduling` determines how trusted or risky offline labor becomes.
- `Support Infrastructure` creates secondary sinks through housing, safety, training, and transport.
- `Morale, Fatigue, and Discipline` create a soft cap without hard-capping headcount.
- `Crew Assignment By Biome` makes authored biomes matter operationally.
- `Recruitment and Payroll` turn labor into an economic decision, not pure upside.
- `Accidents and Rescue` create consequences and recovery gameplay.
- `Worker-Triggered Discoveries` make scaled labor capable of finding content the player cannot click into existence.

The detailed rules for that system are defined in `unlimited-workers-system.md`, but the design intent belongs here because it changes what the uncapped branch means. The branch is no longer:

- buy more workers for more output

It becomes:

- buy more workers
- unlock a new operating layer
- solve the support problems created by that growth
- scale the mine into a real organization

## Existing Equations Already Supported By Current Docs

These are already present or strongly implied in the project:

```text
R_online                = R_drill + R_workers + R_bots + R_drones
offline_efficiency      = 0.95 + (0.05 * dream_mining_level / max_dream_mining_level)
R_offline_final         = R_online * offline_efficiency

depth_rate_online       = (0.5 * L_drill + 0.02 * L_drill^1.3)
                        + (0.3 * L_dynamite + 0.01 * L_dynamite^1.2)

offline_depth_efficiency = 0.70 + (0.03 * L_autonomous_excavation)

scanner_mod             = 1 + 0.08 * L_scanner + 0.005 * L_scanner^1.3
prestige_mod            = 1 + 0.12 * L_fortune
depth_mod               = 1 + ln(1 + depth / 1000) * 0.15
RareModifier M          = scanner_mod * prestige_mod * biome_mod * depth_mod * event_mod * collection_mod * combo_mod
```

## Recommended Equations For Missing Systems

### Extraction System

```text
OrePerClick   = 1 + 0.75 * L_pickaxe + 0.04 * L_pickaxe^2
R_drill       = 0.8 * L_drill + 0.06 * L_drill^1.55

R_workers_raw = (0.45 * L_workers + 0.04 * L_workers^1.45) * (1 + 0.018 * L_workers)
SupportScore  = 6 + 1.2 * L_storage + 1.0 * L_conveyor + 0.8 * L_ventilation + 0.6 * L_lift
SupportEff    = min(1.0, (SupportScore / (L_workers + 10))^0.55)
R_workers     = R_workers_raw * SupportEff

DroneSlots    = 1 + floor(L_drone_fleet / 5)
R_drones      = DroneSlots * (1.5 + 0.25 * L_drone_fleet + 0.03 * L_drone_fleet^1.3) * biome_efficiency
```

This makes Workers genuinely uncapped without letting them break the design. The player can always buy more workers, but unsupported labor becomes inefficient if logistics and survival systems lag behind.

### Logistics System

```text
StorageCap    = 100 + 35 * L_storage + 14 * L_storage^1.45

SellRate      = 0                                                   if L_conveyor = 0
SellRate      = 2.5 + 1.4 * (L_conveyor - 1) + 0.16 * (L_conveyor - 1)^1.5   if L_conveyor >= 1

LiftSpeed     = 1 + 0.22 * L_lift + 0.025 * L_lift^1.25
TransferDelay = depth / (120 * LiftSpeed)

NetFillRate   = max(0, R_passive - SellRate)
TimeToFull    = (StorageCap - stored_ore) / max(NetFillRate, 0.01)
```

### Value System

```text
RefineryMult  = 1.10^L_refinery
GoldPerSecond = min(SellRate, R_total_arriving) * AvgOreValue * RefineryMult
```

### Discovery System

```text
IdentifyTime    = 30 / (1 + 0.18 * L_geology_lab)
PromotionChance = min(0.22, 0.008 * L_geology_lab + 0.0015 * L_geology_lab^1.5)
```

### Excavation System

```text
BlastDepth      = 15 + 5 * L_dynamite + 0.4 * L_dynamite^1.35
BlastCost       = (120 / (1 + 0.06 * L_dynamite)) * (1 + depth / 20000)
```

### Survival System

```text
LightBonus       = 1 + 0.015 * L_lighting
VentResist       = 1 - 0.92^L_ventilation
HazardPenalty    = BaseHazardPenalty * (1 - VentResist)
HazardDuration   = BaseHazardDuration * (1 - VentResist)
biome_efficiency = (1 - HazardPenalty) * LightBonus
```

## Runtime Economy Equation

This is the equation that should decide whether the mine feels healthy or clogged:

```text
R_passive = R_drill + R_workers + R_drones
R_total   = R_passive + manual_click_rate * OrePerClick

GoldPerSecond = min(SellRate, R_total_arriving) * AvgOreValue * RefineryMult
```

If `R_passive` rises but `SellRate` and `StorageCap` do not, the player feels the choke immediately. That is good design, because it makes logistics meaningful.

## Recommended "Smart Upgrade" Math

The shop should not only show cost. It should show payback.

```text
PaybackTime_u = Cost_u(L) / max(DeltaGPS_u, 0.01)
Score_u       = (DeltaGPS_u / Cost_u(L)) * BottleneckWeight_u * UnlockWeight_u
```

This lets the UI surface:

- Best short-term gold upgrade
- Best depth-push upgrade
- Best rarity upgrade
- Current bottleneck fixer

That makes the upgrade screen feel strategic instead of noisy.

## Balance Rules

- Most upgrades should be finite. Workers should be the only uncapped branch.
- Finite upgrades should end on meaningful breakpoints, not arbitrary huge numbers.
- Workers should use aggressive cost scaling and support-dependent efficiency.
- If Worker levels rise faster than Storage, Conveyor, Lift Speed, and Ventilation, marginal returns should fall immediately.
- Use slow cost growth for `Pickaxe`, `Storage`, and `Lighting`.
- Use medium cost growth for `Drill`, `Workers`, `Lift`, and `Ventilation`.
- Use fast cost growth for `Conveyor`, `Refinery`, `Scanner`, `Geology Lab`, and `Drone Fleet`.
- Unlock secondary systems only when the player first feels the problem.
- Give major breakpoint moments at `L1`, `L5`, `L10`, `L20`.
- Make `Conveyor L1` a dramatic unlock.
- Make `Scanner` and `Geology Lab` the late-game quality engine.
- Make `Storage + Conveyor + Refinery` the main AFK trust triangle.
- Make `Pickaxe + Dynamite + Scanner` the active-play high-risk triangle.
- Make `Workers` the long-tail late-game sink, not the branch that replaces every other branch.

## Final Recommendation

Yes, this system should absolutely have specific mathematical equations per branch. But with this concept, the best version is not every upgrade being infinite.

The stronger design is:

- finite structural upgrades that solve visible bottlenecks,
- one uncapped upgrade that absorbs excess gold,
- and math that forces the uncapped branch to depend on the rest of the mine.

That makes Virtual Miner's UPGRADE SYSTEM feel like a mine operations simulator instead of a spreadsheet where one endless branch becomes the only correct purchase.
