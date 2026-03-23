# Virtual Miner Site Design Direction

## Core Language

Virtual Miner should read like a premium expedition dossier, not a neon casino and not a flat SaaS landing page. The primary mood is sunlit dust, brass instruments, survey paper, ore glow, and controlled subterranean danger. Keep the shell light and breathable, then inject depth with mineral greens, brass-gold highlights, copper heat, and teal-blue cave light.

The visual hierarchy should feel like this:

- `hero`: cinematic reveal, big atmosphere, strong typography, generous light gradients
- `game loop`: practical and readable, like equipment cards and field reports
- `systems`: denser and more technical, like control panels, ledgers, and simulation boards
- `world / biomes`: more luminous and collectible, where rarity and discovery get visual energy
- `roadmap`: expedition ledger, cleaner and more document-like than the world section
- `cta`: optimistic payoff, warmer gold and copper with a clear primary action

## Token Usage Rules

- Use `var(--vm-*)` tokens first for all new section styles.
- Reuse the compatibility aliases only when touching older atlas classes.
- Prefer `--vm-gradient-hero`, `--vm-gradient-panel`, `--vm-gradient-depth`, and `--vm-gradient-cta` over inventing new one-off backgrounds.
- Reuse a small component family across the site: section frame, stat tile, pill, panel card, data table, and callout strip.
- Keep radii soft but not bubbly. `lg` and `xl` should be the default for large surfaces.
- Use shadows to suggest depth and polish, not floating glass everywhere. Most cards should stay on `sm` or `md`.

## Typography And Rhythm

- Headlines should use the display face and feel editorial, weighty, and slightly ceremonial.
- Body copy should stay plainspoken and compact. This site sells a system-heavy game; readability matters more than ornament.
- Use the spacing scale to create breathing room between sections. The page should alternate between wide atmospheric sections and denser operational blocks.
- Numbers, odds, rarity percentages, and mining metrics should use the mono token or tabular numerals where precision matters.

## Interaction States

- Hover motion should stay restrained: lift by `1-2px`, brighten the border slightly, and resolve within `160-240ms`.
- Hero and CTA buttons can use stronger highlight sweeps, but no generic glowing blob buttons.
- Use the gold and mineral focus ring for all interactive elements. Do not rely on browser default outlines.
- If a rail or filter changes content, use visible active state plus keyboard support. For tab-like biome selectors, arrow keys should move selection and focus should remain obvious.
- Sliders, range controls, and simulation inputs must keep labels visible at all times; never hide the current value behind hover.

## Loading, Empty, And Error Expectations

- `loading`: use muted panel skeletons with a soft mineral shimmer, not spinning loaders
- `empty`: treat as an expedition gap, with calm copy and one obvious next action
- `error`: use a rust or ember-accented panel with concise copy, retry action, and enough contrast to read quickly

## Accessibility Intent

- Keep text on light surfaces at strong contrast. The muted text token is for secondary copy only.
- Do not encode rarity, state, or success with color alone. Pair color with labels, icons, or text.
- Interactive targets should remain comfortably usable on mobile; do not shrink pills or buttons below practical touch size.
- Preserve `prefers-reduced-motion` behavior by shortening reveals and removing large celebration movement where possible.
- Landmark order should remain straightforward: header, hero actions, section navigation, section content, final CTA.

## Integration Constraints

- Do not add a full dark mode in the first pass. The concept works better as a warm expedition surface with localized depth accents.
- Avoid introducing new accent hues unless product meaning requires them. The system already has enough range: iron, brass, copper, mineral, depth, ember.
- When a section needs stronger drama, deepen surface treatment and contrast before adding more color.
- Celebration moments for high rarity should feel expensive and intentional, not constant. Save the loudest visual energy for discovery or jackpot states.

## Open Product Decisions

- Decide whether the roadmap section represents launch milestones, live-ops seasons, or both.
- Confirm the primary hero action: trailer, playable prototype, or systems deep dive.
- Confirm how far jackpot celebration effects should travel: local card, section-level, or page-level takeover.
