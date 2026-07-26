# BOHEMIA BACKLOG (the fleet's queue — read via THE GO PROCEDURE)

Rules (full doctrine: laws/BOHEMIA_AUTONOMY_DOCTRINE_7_26_26.md): topmost
unblocked item in YOUR lane; [PENDING Paolo] items are SKIPPED, never resolved;
only Paolo/verdicts add direction-class items; agents may append (discovered)
items; every item works to the Definition of Done. Entry shape:
GOAL | DoD beyond the standard | DON'T TOUCH | needs-verdict-before-volume?

## RUN
   [DONE 7/26] THE FIRST CONNECTED RUN — shipped, gated (run_gate.js, 69
   assertions, both forks + inside the real alpha). Record:
   records/BOHEMIA_THE_FIRST_CONNECTED_RUN_7_26_26.txt.
0. SAVE/LOAD for the run (RULED 7/26, both addenda): sleep saves + free
   manual saves + autosave; death loads closest save; the save is ONE
   portable versioned blob (device prefs excluded) with export/import,
   per laws/BOHEMIA_ADDENDUM_SAVES_AND_CLOUD_7_26_26.md. | save->reload->
   identical state proven headless + export/import round-trip | engine/
   bohemia_loop.js (flag needs to WORLD) | no — fully ruled.
1. Phone-feel pass on the run (touch responsiveness at arm's length): real
   device-shaped viewports, hold-to-walk tuning, tap-to-step target sizes,
   the objective bar at arm's length. | run_gate extended with a real-device
   viewport pass | engine/bohemia_loop.js (flag needs to WORLD) | no.
2. (discovered) WIDEN THE RUN: the run is one seed-7 block. Walking off the
   block into the neighbouring district is the next real milestone — needs the
   world model's plot-to-plot transition, not new content. | run_gate proves a
   second district reached on foot | district engines (CITY lane owns them) | no.
3. (discovered) The player is not registered in ctx.scheduler, so the run's
   grid clock is the block sim's, not the loop's turn scheduler. Engine request
   for WORLD: a player actor the run can commit() through. | loop gate section
   | engine/bohemia_loop.js | no.
4. (discovered) Only S01 is wired into the run. Once placement is ruled, the
   other twenty canon quests should be reachable from a run surface too. |
   run_gate covers a second quest end to end | quest text | [PENDING Paolo
   placement].

## WORLD
1. DONE 7/26 (awaiting verdict): quest placement CANDIDATES shipped, 3 per quest,
   rendered on the real valley in the alpha's LIFE tab. Factory:
   engine/bohemia_quest_placement.js, judge:
   tools/bohemia_quest_placement_judge.py, gate: QUEST PLACEMENT. NEXT (blocked on
   his picks): APPLY the picked placements as a casting-bridge override + extend
   the gate to prove the override sticks across save/reload. | [PENDING Paolo].
2. World bridge deepening: quest outcomes visibly move factions on the map.
   | proven headless, deterministic | pacing ruling: no background ticking | no.
3. Engine support requests flagged by RUN (as they arrive, priority). | per
   request | — | no.
4. (discovered 7/26) Faction bases are an even stride across the district list, so
   all 14 factions sit on suburb tracts and hold exactly 1 cell each. Territory
   that reads like territory (a faction whose ground matches its trade) is a
   direction-class call, so it stays [PENDING Paolo] — but the MECHANISM (base
   placement preferring a kind a faction's own canon names) is buildable the moment
   he rules. | — | bootFactions is the seam | [PENDING Paolo].

## CITY
1. MARRY COMMERCIAL (discovered, CITY 7/26). The corner plaza has NEVER been
   registered with the district kit (it never binds K, and the registration sits
   behind a `typeof K` guard that silently swallowed it), so the walked city
   still renders commercial from the LEGACY PREFAB STAMPS — not the canon plaza,
   nothing enterable. Binding K is one line and turns walkable_gate RED: on a
   single W or N street the generator builds only ONE store strip and parking
   fills the rest (drive 61% vs content 30%). Fix the mid-block/single-edge form
   FIRST, then bind K. Full numbers in the module's own head comment + records/
   BOHEMIA_INTERIORS_EVERYWHERE_7_26_26.md. | walkable_gate green with commercial
   swept + interiors_gate proves a plaza store is enterable | the S/corner form is
   approved, do not reshape it | the mid-block plaza form is [PENDING Paolo] per
   the module's own NOTES — surface it as rendered candidates, do not pick one.
2. GARAGE + CRYPT INTERIORS IN THE ALPHA (discovered, CITY 7/26). The engine
   DISPATCHES a building's interior by kind (garage -> multi-deck parking, crypt
   -> vault hall, everything else -> rooms) and world_gate proves it. The alpha's
   STEP-INSIDE renders the ROOMS kind only, so walking into a parking structure
   or a mausoleum gets you a floorplan instead of decks/vaults. Embed
   bohemia_garage.js + bohemia_crypt.js in CITY_B64 (resync tool exists now) and
   branch the render the way the engine branches. | interiors_gate extended to
   assert all three kinds render | engine dispatch is correct, do not touch it |
   the deck/vault LOOK = judge before volume.
3. INTERIOR DRESSING (discovered, CITY 7/26). Rooms are flat role-tinted plates
   with wear + wall AO. Every district dossier already describes what is inside
   ("registers + coolers + aisles up front", "rows of rusted lockers, a dead
   shower block") — furniture/props per ROLE, off the dossiers, reuse-first from
   banks/. | per-role prop pass gated | never invent contents a dossier
   does not state | yes, fresh look.
4. Interiors everywhere: DONE 7/26 (records/BOHEMIA_INTERIORS_EVERYWHERE_7_26_26
   .md). Left standing: THE UNDERGROUND behind wash's sewer tunnel mouth is a
   LIFE-lane below-grade level, not a room in a footprint. [PENDING — LIFE lane]
5. District volume: next Pocket-City-type gaps that fit the dead world, on
   the KIT, full touchpoint list per the architecture map. | per-district gate
   x6 configs | bespoke strip/casino (Paolo's hand) | new district LOOK =
   judge before volume.
6. (discovered, coordinator 7/25) RIG_B64/PREFAB_B64 byte-lock holes + sync-
   canon gaps (PLOTGEN/POWERGRID/FLOORPLAN/TRANSITIONS). NON-COOK item. |
   new byte-lock gates registered | — | no.
   (CITY 7/26 note: tools/bohemia_city_module_resync.py now re-syncs every
   engine module inlined in CITY_B64 and `--check` reports staleness, which is
   the freshness half of this item for the CITY app. It caught commercial +
   suburb + district_kit all silently behind. The remaining half is the same
   treatment for RIG_B64/PREFAB_B64.)

## COMBAT
0. ALLY-IN-COMBAT foundation (RULED 7/26, companions addendum): the encounter
   system supports friendly combatants on the player's side — spawn, target
   correctly, go down but never permanently die. Mechanism only; WHO joins
   and companion personalities are Paolo's/quest canon. | proven headless: an
   ally fights alongside through the real bus, downed ally never deleted |
   CITY_B64 | no.
1. DONE 7/26 (v66): encounter handoff hardening for the RUN. Contract:
   laws/BOHEMIA_ADDENDUM_RUN_HANDOFF_CONTRACT_7_26_26.md. Quest context in,
   dead/spared/fled out, declared LEAK LIST, cold handoff with the tab never
   opened, READY queue, abort, loud errors, no splash. 5 back-to-back
   EXECUTED headless in combat_lab_gate sections 5-6, plus a real-surface
   Playwright proof. The cold handoff went 12.9s -> 14ms (blocking font).
2. Combat grammar graduation: stack candidates in ONE judge surface. | judge
   reachable from alpha, side-by-side anchors | — | yes (thumbs then build
   the winner).
3. (discovered 7/26, RUN lane's call) The alpha SHELL carries the same
   render-blocking cross-origin font link the combat demo did. Combat fixed
   its own blob only (lane discipline). Same one-line fix, whole-game boot
   payoff: `media="print" onload="this.media='all'"`. NON-COOK.
4. (discovered 7/26) The demo's melee/nerve loop re-rolls `pickRandomFaction`
   twice on a quest handoff (startGame + the shuffle hook). Harmless, same
   distribution, but it is duplicate work on the enter path. NON-COOK tidy.

## CHARACTER
1. (DONE 7/26 -- records/BOHEMIA_BODYVAR_SLIDERS_7_26_26.txt) ONE-RIG VARIATION
   SLIDERS. Shipped with gates/bodyvar_gate.js + a real-browser clip-set sweep.
   The RANGES are now waiting on Paolo's thumb; do not re-cook them, and do not
   wire per-NPC randomisation until he rules on it.
2. Wardrobe: new SHAPES (structure-not-color), taste-filtered before
   surfacing. | structure_gate | — | fresh shapes = thumbs.
3. Music pool volume in approved styles, taste-filtered. | music gates | — |
   fresh songs = thumbs.

## QUESTS
1. DONE 7/26 (S10-S21 shipped, corpus 9 -> 21, gate hardened with 5 new checks,
   laws/BOHEMIA_ADDENDUM_TWELVE_MORE_CANON_QUESTS_7_26_26.md). Sitting is live in
   the alpha: LIFE tab -> THE 12 NEW CANON QUESTS. Awaiting thumbs.
2. Act-1 main-quest beats from the locked lore (cold open -> flash-flood climax)
   drafted as .bq chains. | same bar as S10-S21, plus chain continuity proven
   headless | engine code, the alpha | yes.
3. (discovered 7/26) MULTI-QUEST CHAIN SUPPORT: nothing in the format or the
   runtime lets quest B read that quest A resolved (S09 -> S06 is a chain only in
   prose). Act-1 beats need it. NON-COOK item: a cross-quest flag surface on
   ctx.quests + a gate proving A's ending really opens B. | new gate section |
   the .bq format's no-stat-gates law is untouchable | no.
4. (discovered 7/26) The batch plants unread flags (opened_the_deep,
   aired_the_method, killed_the_token, walked_them_out, owes_the_cartel,
   sold_the_forger). Nothing consumes them. Wiring them to world beats is
   [PENDING Paolo] at the canon level; the mechanism half is item 3.

## SHARED / ANY IDLE SESSION (non-cook)
1. VERDICT TOOLING upgrade per the doctrine: one AGGREGATED judge page across
   lanes grouped by discipline, side-by-side anchors, APPROVE/CBB/KILL
   buttons, kill-reason tags, .txt export. | replaces per-lane judge sprawl;
   gate: the page exists + exports parse | — | no (tooling, not art).
2. [PRIORITY UP 7/26, Paolo direct order — approved-assets-first addendum]
   CANON EXEMPLAR INDEX + KILL-REASON TAXONOMY distilled from banks +
   graveyard post-mortems (machine-readable; cooking tools cite which
   exemplar anchored each cook). | reusefirst-style gate extension | — | no.
3. DRIFT CANARY harness: re-render fixed approved anchors, diff vs blessed.
   | canary gate registered | — | no.
