# BOHEMIA — ADDENDUM: COMBAT SHOT RESOLUTION LAYER
_Filed 7.1.26. Status: BUILT + tested (23 combat tests, 167 total green). Extends the Combat / Dead Eye Dial addenda._

## What this is
The referee between the Dead Eye Dial (presentation — HOW WELL you hit) and the
world (WHO dies, what it COSTS). `BohemiaEngine.Combat` takes a dial RESULT plus the
shooter's ammo state and returns a pure outcome. It does NOT run the dial, does NOT
animate. Structure now; damage/mag values tuned live later.

## Honors the locked combat canon
- **Ammo is scarce → a shot spends one round; a DRY mag BLOCKS the shot** (`fired:false, reason:'dry'`, no round spent, caller charges no turn). Grounded in the locked rifle-ammo-rarity rule.
- **Hit tiers** from dial accuracy: killshot (clean kill, advances chain), vital (big damage + stun), graze (chip), miss. Bands are [PENDING Paolo tuning]; structure is fixed.
- **Killshot chain = ONE action.** resolveChain runs consecutive killshots as a single turn (the locked "8 perfect kills = 1 turn"), stops the instant the chain breaks (a vital/graze/miss) or ammo runs dry.
- **No stun-lock.** A vital stuns a survivor, but a second vital canNOT refresh the freeze until the target has had a full turn back (tickStuns advances the clock once per world turn). Re-vitaling still chips HP, just can't extend the freeze. Matches the locked rule.
- **Vital that KILLS a low enemy continues the chain; vital that only stuns does NOT.**

## API
- `tierForAccuracy(acc)` -> tier
- `resolveShot({inv, ammoType, target, accuracy|tier, damage})` -> `{fired, reason?, tier, damage, killed, stunned, chain}`
- `resolveChain(inv, targets, shots, damage)` -> `{kills, shotsFired, brokeOn, dry}`
- `tickStuns(targets)` — advance stun clocks one turn

## The macro/micro tie-in
resolveShot spends ammo via Inventory.spendAmmo — so combat rides the ephemeral
inventory tier, never the fold. Bullets are micro; the shot resolver is micro; the
only macro contact anywhere is Inventory.resupplyFromEconomy. Clean.

## PENDING Paolo:
- Accuracy→tier band cutoffs (placeholder 0.92 / 0.70 / 0.40).
- Per-weapon damage tables + mag sizes.
- Weapon roster + which ammo type each weapon pulls.
- Fork #2 (vital chain-continuation across all tiers vs clean-kill-only at Bohemian) and #4 (auto-target vs manual rotate-to-face) still open from the combat addendum.

## Engine
`bohemia_engine.js` — md5 `8de572fea0bd86f23cc219a113d2d552`, save v7, 12 modules, bundle green.
