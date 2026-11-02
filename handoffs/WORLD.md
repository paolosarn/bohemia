# WORLD (one file per lane, written only by WORLD; newest block on top)

WORLD 6 (11/2, rule 318, ask line 315): A NEW VALLEY EVERY GAME. BUILD 11/3ze. SHIPPED, NOT YET SEEN.
- What he asked: 'not getting big procedurally generated map vibes... the Remnants are on the same part of the map... I don't even
  know if you have a number seed system.'
- What it was: fourteen bases baked at fixed blocks (CT_BASES_BAKED), every game the same valley; no campaign seed.
- What shipped: one campaign seed, a six-character code (K7Q-M9X), decided at the map's boot, saved with the game
  (localStorage bohemia.world.v1), shown and typeable on the new-game screen (THE VALLEY · ITS CODE, under the crew's name; a typed
  code or ANOTHER reloads to the same door with that valley). The land never moves; each faction's base stands at one of the real
  town blocks of its kinds (records/target/bb/world_seed.json), weighted by kind and by how much town is round it, never two within
  9 blocks (6 at worst). ctBases(), the turf's seats, the parties and the mines all read it; the start corner and the boss signs
  roll off it. The bench and saves from before keep the old valley.
- Files: engine/bohemia_world_seed.js (the placer), records/target/bb/world_seed.json (every list and number),
  tools/bohemia_world_seed_patch.py (inlines both into the map, re-run after editing either), gates/a_new_valley_every_game_gate.js.
- Record: records/BOHEMIA_WORLD_A_NEW_VALLEY_EVERY_GAME_11_2_26.md (the ten-seed table, the side by side, what is left).
- Left: the region's twelve outer towns' holders (setRegion is node-only in the page: RUN's wire first), the region's camps' candidate
  lists, the shops' stock, the loot and the crew's roll on the code.
- For the next WORLD round: when RUN wires region_bases.json into the page's ledger, seed its holders off
  BohemiaWorldSeed.hash(WORLD_SEED + ':region:' + id) among the factions that could hold each place.
