# BOHEMIA — ADDENDUM: FACTIONS + ECONOMY WIRED INTO THE LOOP (LOCKED)
### 7.22.26 — Paolo said "let's stop with the phone app for now, what else can we do big brain for the game." This is pure backend/engine work, zero phone UI touched.

---

## WHAT THIS IS
`bohemia_loop.js`'s `bootFactions(ctx)` and `bootEconomy(ctx)` were empty
`[SEAM]`/`[GAP]` stubs since the loop scaffold was first poured (7/1). Per
ENGINE SYNC LAW / read-before-build discipline, `bohemia_engine.js` was
searched before writing anything new — it already contained two fully-built,
never-wired modules:

- **`BohemiaEngine.Economy`** — a three-currency (ELECTRICITY / MEDICINE /
  CLOUT) faucet/sink/tank model per district, with a monopoly-proof invariant
  (`MAX_PRODUCER_SHARE = 0.6`) and medicine-quality waste below 0.5.
- **`BohemiaEngine.Factions`** + **`BohemiaEngine.FactionCanon`** — a standing-
  rung faction world (`HOSTILE < COLD < NEUTRAL < WARM < FWU`) with territory,
  and a canon loader that reads `engine/BOHEMIA_faction_graph.json` — a REAL
  data file whose own `_meta` states "Derived from GDD v2 §9... All canon;
  nothing invented": 14 selectable map factions (Reds, Blues, Anarchists,
  Colorful, Church, Network, Trades, Caravans, Volunteers, Remnants, Cartel,
  Mob, Homeless, Custom) plus 4 non-territorial "social_force" identity groups
  (Pures, Panthers, La Familia, Triads).

Also discovered: an ORPHANED integration-test spec, `gates/bohemia_loop_gate.js`
— not registered in the main gate suite, crashing on run — that already fully
specified the correct wiring shape (31 assertions: canon-wired standings,
real coordinate seating, district-count parity, determinism, save round-trip).
Nothing here was invented; this session filled two empty sockets to match
specs that already existed.

## WHAT WAS BUILT
**`bootFactions(ctx, opts)`**: builds a real `FactionWorld` from the canon
graph (`opts.factionGraph` or the graph required at module load), loads every
selectable faction via `FactionCanon.loadFactionCanon` (correct power per
act, initial standings/constraints from the relation labels — permanent-war,
prey-tax, professional-respect, etc.), then wraps `world.shiftStanding` so
EVERY future standing change is clamped through `enforceConstraints` (war
floors, protection floors for Volunteers/Caravans, pair min/max) — canon
constraints are load-bearing, not decorative. Factions are seated on REAL
`ctx.worldMap.factionSlots` coordinates via a seeded deterministic shuffle
(MAP LAW: Claude decided WHICH faction sits on WHICH already-placed slot,
never invented a position), then each claims its nearest unclaimed district
as founding territory.

**`bootEconomy(ctx)`**: builds a real per-district `Economy`. Every district
gets a small electricity sink. The worldgen dam and solar sites each become
TWO faucets on their nearest district — a `'grid'` faucet (the shared public
supply) and a smaller `'Network'` faucet (the skim) — directly modeling the
already-locked house-of-cards canon: power/water has no single owner, but
"the Network skims covertly." Splitting each source this way also keeps any
single producer safely under the engine's own `MAX_PRODUCER_SHARE = 0.6`
invariant by construction, without hand-tuning rates to dodge it.

`ctx.factions`, `ctx.factionConstraints`, `ctx.factionBases`, `ctx.economy`
are now live, non-null fields on every booted `GameContext`.

## THE BUG FOUND AND FIXED WHILE WIRING THIS
Passing the canon graph through required adding a `DEFAULT_FACTION_GRAPH`
constant to the file's UMD wrapper. First pass declared it in the OUTER
wrapper function's scope and assumed the inner "factory" function (which
holds all of the loop's real logic) could see it by closure. It can't: in
`(function(root, factory){ ... })(globalThis, function(E, Sched, BQ, BQRT){
...factory body... })`, the factory function is a SIBLING argument to the
call, not lexically nested inside the outer function's body — it only ever
sees `E`/`Sched`/`BQ`/`BQRT` because those are passed in as real call
arguments. Every loop test file that didn't pass `opts.factionGraph`
explicitly hit `ReferenceError: DEFAULT_FACTION_GRAPH is not defined`; the
orphaned gate script never caught it only because it always supplied
`factionGraph` explicitly, short-circuiting the `||` before the broken
reference was ever evaluated. Fixed by threading `DEFAULT_FACTION_GRAPH`
through as an explicit parameter to `factory(...)`. Worth remembering for
any future edit to this file's outer wrapper: nothing declared there is
visible inside the factory body unless it's passed through as a parameter.

## VERIFIED
- `gates/bohemia_loop_gate.js`: 31/31, now registered as gate `LOOP
  FACTIONS+ECONOMY` in `gates/bohemia_gates.py`.
- Zero regressions: all 9 pre-existing `engine/bohemia_loop_*_tests.js` files
  (channel, clout, entities, feed, ledger, profile, quests, slice, talk) —
  145 assertions total — still pass unchanged.
- Full suite: `python3 gates/bohemia_gates.py --fast` — ALL GATES GREEN.

## PENDING, PAOLO'S CALL (not decided, not invented)
- Tuning the actual electricity faucet/sink rates (currently placeholder
  values chosen only to satisfy the monopoly invariant, not balance-tested).
- Whether any site besides dam/solar should produce electricity.
- Medicine faucet placement — currently ZERO medicine sources exist anywhere
  in the economy. This is a deliberate empty table (MECHANISM-MINE /
  CONTENTS-PAOLO'S), not a bug — inventing a medicine source would be
  inventing content that has no ruling yet.
- Whether founding territory beyond "nearest unclaimed district to your
  seated base" should be canon, or something Paolo places by hand later
  (MAP LAW would still apply if so).

---
*BOHEMIA — Factions + Economy Wiring — 7.22.26*
*Two islands, already built, finally bridged. Nothing new invented — just plumbed.*
