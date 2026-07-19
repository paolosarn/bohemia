# BOHEMIA LIFE — THE PEOPLE SPEC (7/19/26, LIFE session, mechanism only)

The LIFE ladder from the world-model roadmap, built. This documents the typed
spec and the grounding so no future session re-derives it. MECHANISM here is
locked by gates; every CONTENTS decision stays Paolo's and is listed at the
bottom as PENDING.

## THE MODULES (each a factory with its own gate, per FACTORY LAW)
- engine/bohemia_agents.js  -> gates/life_gate.js    (LIFE, 14 checks)
- engine/bohemia_dress.js   -> gates/dress_gate.js   (DRESS, 9 checks)
- engine/bohemia_economy.js -> gates/economy_gate.js (ECONOMY, 13 checks)
All three registered in gates/bohemia_gates.py the same turn.

## THE AGENT (typed spec)
    agent = {
      id: 'H<house>-<n>',          // mechanical designation. NAMES ARE PAOLO'S.
      seed,                        // hash(blockSeed, house, n) - deterministic
      home: { building, bedRoom }, // a real world-model building + a real 'bed'
                                   // room index in its floorplan (round-robin,
                                   // households fill bedrooms before doubling)
      job:  { kind:'site'|'scav', district, dir, dist },
                                   // 'site' = a REAL neighboring job district
                                   // read off the overmap (commercial /
                                   // industrial / medical / solar, radius 3);
                                   // 'scav' = subsistence sweep of the block
      faction: null,               // until Paolo rules. FACTION_ASSIGN = {}
      outfit: { base, legs, feet, [outer, head, face, neck, hands, waist] },
                                   // canon wardrobe only (bohemia_dress)
      sched: [ {t0,t1,act,where} ] // the full 1440-minute day, no gaps
    }
Placement is BY the world model: BohemiaAgents.agentsForPlot(world, x, y).

## THE CLOCK
One world-turn = one world-minute; DAY_TURNS = 1440. The scheduler's turn
counter stays the only time source (I-MOVE-YOU-MOVE). In a judge tool's WATCH
mode one 120 BPM beat (0.5s) advances one turn: a full day in 12 minutes.
FLAGGED ABSTRACTION (standard roguelike time): a walker covers 1 tile (0.75 m)
per turn; literal walking speed would be ~112 tiles/minute. Distances on the
block therefore cost world-hours, and the schedule absorbs the commute inside
the work block. If Paolo ever wants literal time-distance, the dial is one
constant (tiles per turn) plus the gate.

## VACANCY - THE DIE-OFF (Paolo 7/19, same day: "I hope you're not making
## every house have inhabitants... the suburb should absolutely reflect that")
Most homes are ABANDONED SHELLS. OCCUPIED_RATE (bohemia_agents) is the
die-off dial; deterministic per house. Ships at 0.30 (~70% of the city gone)
as a FLAGGED PLACEHOLDER - the real number (90% dead? 50%?) is Paolo's canon
ruling on the map, [PENDING Paolo]. Gate: most homes empty at default, dial
fills at 1 / empties at 0. Abandoned houses stay enterable (they are world,
and later: scavenge).

## THE DAY (jittered per agent; only the NETWORK is ever eerily exact)
CORRECTED same day (Paolo: "people are gonna wake up at different times,
they're gonna go to different places at different times"): v1's single mold
with small jitter made the block surge the gate together. Now FOUR life
archetypes, gated for coexistence + spread:
  worker (site job, shift starts staggered 05:30-09:00, walks out the gate)
  scav   (subsistence sweep on its own clock, midday heat shelter)
  keeper (barely leaves: tends the house, one daily errand)
  watch  (sleeps late, walks the block at dusk, in by ~23:30)
Wake times spread over hours (gated >= 2.5h range on a packed block).
Grounded in desert subsistence: wake ~06:00 (work early, Mojave heat), morning
ration at home, employed walk out the gate to the job site (~07:00-15:00),
scavengers sweep the block with a midday shelter break (~12:00-14:30, the
40C+ hours), evening free on the streets, home by ~22:30, sleep.
Household size: weights 1/2/3/4 -> 30/35/20/15%, mean ~2.2 (LV pre-collapse
averaged ~2.6/household; survivor groups consolidate but shrink).
EMPLOY_RATE 60% where a site is in range; everyone else scavenges.

## THE SIM (block-level, in the LIFE slice + gate)
OCCUPANCY LAW: one body per exterior cell, player included; blocked bodies
wait and replan, never clip, never teleport (gated). Agents at home stand in
their real floorplan rooms (sleepers in their bed room) and are visible when
you walk into the house. Off-block workers are 'away' until the walk home.
REAL-SURFACE FIND (7/19, banked): the gate's approach road is single-file, so
a body standing on it BLOCKADES the whole commute. The player IS a body. The
slice spawns the player off the choke; the emergent blockade itself is kept -
it is true to the laws and reads as world texture, not a bug.

## THE DRESS (bohemia_dress)
Wardrobe source of truth = the clothing factory's GARMENTS array in the alpha
(that session's system, READ, never edited). tools/bohemia_wardrobe_extract.py
banks canon rows as NAME|layer|midhex -> banks/BOHEMIA_WARDROBE_CANON_7_19_26
.txt (78 at extraction). DRESS gate compares bank count to the alpha's live
canon count: wardrobe grows -> gate goes red -> rerun the extractor.
Everyone owns base+legs+feet; extras by grounded odds (outer 25% cold desert
nights, head 35% sun, face 15% dust, neck 12%, hands 10%, waist 20%).
FACTION_DRESS = {} EMPTY until Paolo rules faction dress canon.

## THE ECONOMY (bohemia_economy)
Post-collapse scarcity, real anchors:
- water 4 L/day/adult (3 sedentary, 6-8 desert labor), food 1 ration =
  ~2000 kcal, meds highest value-to-weight (true in every real collapse).
- Starting stocks are the block's REAL standing water: ~200 L water heater +
  containers per house; ~8-14 days pantry per resident.
- Prices are BARTER quoted in salvage-kg (commodity money: history says
  cigarettes/ammo/fuel take over when fiat dies; WHICH commodity is Bohemia's
  is canon -> [PENDING Paolo], one NUMERAIRE constant swaps it).
- Scarcity pricing is hyperbolic in days-of-supply, capped at 40x (the
  Sarajevo siege band: staples moved 10-100x), monotone (gated: less supply
  is never cheaper). CONSERVATION gated: stock delta === produced - consumed,
  shortfalls logged, nothing negative.
- A dark block holds zero grid power (CLUSTERED POWER 12% law). Scavenge
  yield halves per ~180 days of picking the same ground.

## THE SURFACE (judge tool, per the workflow law: interactive, never chat PNG)
slices/BOHEMIA_LIFE_SLICE_7_19_26.html, stable pointer slices/BOHEMIA_LIFE_
CURRENT.html, loaded by the new LIFE tab in the alpha (lazy iframe, same
pattern as SLICE; tab bar scrolls). WATCH/STEP modes, x1/x4, SUN MODE, tap-
to-inspect any resident (schedule + outfit + job), the block ledger HUD,
thumbs per aspect + comments + EXPORT .txt.

## PENDING PAOLO (contents, never mine - the empty tables wait)
- FACTION_ASSIGN: who belongs to which faction, where each faction lives.
- FACTION_DRESS: faction dress canon (+ his renaming/act/rarity passes).
- FACTION_ECONOMY: who taxes/rations/controls which market.
- THE COMMODITY MONEY (NUMERAIRE) + currency logos.
- NAMES: agents carry H3-2 designations until he names people.
- Whether the world-ambient grade applies to agent dress at world scale.
- Death/failure meaning (LOOP DROPPED 7/19) - nothing in LIFE assumes it.
