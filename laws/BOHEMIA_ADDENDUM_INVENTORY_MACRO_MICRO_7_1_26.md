# BOHEMIA — ADDENDUM: INVENTORY + THE MACRO/MICRO LINE
_Filed 7.1.26. Status: BUILT + tested (25 inventory tests, 144 total green)._

## The problem this settles
"Does the engine track how many bullets are in my inventory?" It does now — but the
important part is HOW, because jamming ephemeral player state into the generational
fold would have quietly wrecked the whole save architecture.

## THE LAW: two tiers of "stuff", opposite storage strategies
- **MACRO (folds, deterministic, tiny, survives 100 years):** consequential/permanent
  things — faction alliances, cleared camps (deltas), district investment, and
  economic CAPACITY like "the dynasty runs an ammo-production operation." This is
  the choice log + fold + delta store already built.
- **MICRO (ephemeral, session state, plain save blob):** bullets in your mag, this
  gun, 3 painkillers, carry weight. Changes every few seconds. Needs zero 100-year
  determinism. Folding every trigger-pull would bloat the choice log into garbage.

These two tiers touch at EXACTLY ONE seam and nowhere else (see below). Keeping that
line clean is the rule that lets Bohemia stay buildable at scale.

## What got built — `BohemiaEngine.Inventory` (11th module)
A pure-function module over a plain blob:
`{ ammo:{type:count}, items:[{id,qty,wt}], equipped:{slot:itemId}, maxWeight }`
- **Ammo:** `addAmmo`, `spendAmmo` (returns false = dry click), `ammoCount`. This is
  the trigger-pull path combat calls every shot.
- **Items:** `addItem` (respects carry weight, allows partial adds so loot never
  silently voids), `removeItem` (auto-unequips a fully-removed item), `hasItem`,
  `currentWeight`, `canCarry`.
- **Equip:** `equip`/`unequip`/`equipped` — slot→itemId, item must be owned.
- Lives on the save (`save.inventory`), NOT in the choice log, NOT in deltas.
  Save schema bumped v6→v7; old saves migrate to an empty inventory.

## THE ONE MACRO SEAM: `resupplyFromEconomy(inv, type, capacity, {ceiling})`
The single place micro and macro touch. `capacity` is a macro number the caller
reads from the economy/fold (rounds-per-period the dynasty's ammo operation yields);
this tops up micro ammo up to an optional ceiling. Pure — no hidden economy calls
inside. So: bullets-in-your-gun are micro; "the dynasty makes bullets" is macro; the
faucet between them is this one function. Ammo-the-resource is economy; ammo-in-mag
is inventory.

## Why this matters for the ambition
This is the same discipline that lets three 100-year playstyles diverge for nearly
free: engine stays small and generic, content/state is data. Inventory could have
been the thing that broke it (a firehose of per-second changes); instead it's cleanly
quarantined as ephemeral save state with one deliberate seam to the deterministic core.

## PENDING Paolo (not built, flagged):
- Per-round ammo weight (currently negligible; a rule can override).
- Item definitions / roster (ids, weights, stack caps) — [PENDING, Paolo's call on
  the actual item list + naming].
- Whether equipped weapon type gates which ammo `spendAmmo` pulls (combat wiring).
- Ceiling/mag-size values per weapon — combat design, [PENDING].

## Engine
`bohemia_engine.js` — md5 `47d1774ee33b0fe8e1ca870911822154`, save v7, 11 modules,
bundle self-check green.
