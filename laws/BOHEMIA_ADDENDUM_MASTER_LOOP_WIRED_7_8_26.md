# BOHEMIA — MASTER LOOP WIRED (7/8/26)

## What changed
The Master Systems Map's #1 gap ("the critical missing piece") is now POURED.
The nine islands boot into one driven engine. bohemia_loop.js filled its three
empty sockets and wired the two [STUB]s.

## Poured this session
1. bootFactions — creates FactionWorld on rng.branch('factions'), loads canon
   (loadFactionCanon: standings + constraints), act ceiling from the dynasty fold.
2. FACTION BASE PLACEMENT [GAP->done] — each selectable faction seated at a
   worldMap.factionSlots coordinate, deterministically by sorted id; nearest
   district claimed as founding territory (world.owner set).
3. ENFORCE-CONSTRAINTS [STUB->done] — shiftStanding wrapped so every standing
   write is clamped to canon (war locks, protected floors, pair caps). Lore
   locks can no longer drift. world._canonWired = true.
4. bootEconomy [GAP->done] — one DistrictEconomy per worldMap district; districts
   near trade hubs get a SUPPLY faucet (geographic source hookup).
5. bootEntities [GAP->done] — persistent Spawner bound to (seed, DeltaStore);
   spawn regions come from districts via enemyRuleForDistrict.
6. Boot ORDER fix — bootDynasty moved before bootFactions so the act ceiling
   feeds canon faction power.

## Engine bundle bug fixed
bohemia_engine.js had the RIG retarget engine concatenated AFTER the module
engine; its tail `module.exports = API` was clobbering the BohemiaEngine export
(Core/Save/etc were invisible to require). Fixed: the rig tail now ATTACHES
(module.exports.Retarget = API) instead of overwriting. All 13 modules + 80
engine tests still green after the fix.

## Verification
- bohemia_loop_gate.js: 31/31 PASS. Proves: all nine islands present on ctx,
  factions loaded + based + territory-claimed, canon-wired shiftStanding,
  economy district-per-map, ONE clock drives + heartbeat mirrors (no drift),
  deterministic faction seating (same seed => same bases), LOD runs on driven
  world, save round-trips through the live loop.
- engine self-test: 80/80, all 13 modules OK.

## Map status now
LAYER 3 master loop: [GAP] -> [SOLID+WIRED]. Layer 4 content islands: now
driven (factions/economy/entities wired to worldMap geography). Remaining per
map: Layer 5 tile/prop/camera render [GAP] (the art pipeline — partly underway
via the tile factory), Layer 6 player-facing shell [GAP] (correctly last).

## Files
- bohemia_loop.js (poured)
- bohemia_engine.js (export bug fixed)
- bohemia_loop_gate.js (new permanent gate, 31 tests)
