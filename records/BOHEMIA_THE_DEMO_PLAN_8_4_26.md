# THE DEMO PLAN (Paolo 8/4/26: "I really want to have a demo for this game
# out like asap bro" — DEMO ASAP is now the fleet's converging priority)

THE RULING: a public-ready DEMO is the next milestone the whole fleet
converges on. Every lane weighs its queue against ONE question: does this
block the demo? Demo-critical work outranks lane-local wants; everything
else keeps grinding autonomously but never at demo work's expense.

## THE CUT — RULED 8/4 (Paolo: "I want that main quest origin in it when ur
## sibling dies and you get to see the outlook in the city type shit")
THE ORIGIN + ONE GOOD DAY:
1. THE COLD OPEN (the locked 7/19 opening vision): night, the family home
   under attack, the combat tutorial IS the family-defense fight, the
   SIBLING DIES, it ends saving your mother. Implied, never graphic.
   Fireworks night (the 10-year anniversary of the 4th of July).
2. THE VISTA: the mountain overlook where you SEE the whole valley for the
   first time — the BotW-style outlook, already locked canon as a RETURN
   point that upgrades per act. The demo's money shot.
3. THEN ONE GOOD DAY: wake -> 2-3 quests -> walk finished-looking streets
   -> one talk, one dial fight -> GET PAID -> spend at a trading hub ->
   camp -> sleep-save holds.
ALSO RULED 8/4: SQUIGGLE VOICES for all characters — Animal-Crossing-class
gibberish speech (synthesized babble per dialogue line; each character's
voice = a few synth parameters derived from their identity seed, so every
person sounds like themselves with ZERO voice acting and zero audio files).
Demo-critical: dialogue that makes sound reads alive; silent portraits
read dead.

## THE CRITICAL PATH (owner — status)
1. THE GAME DAY loop closes (RUN 00 — top of queue). The spine.
2. THE LOOK lands: the ultracode tile-board cook (ART — swarm fired 8/4),
   desert ground fix, the dead pass, district generic-pass upgrade.
3. MINIMUM SOUND SET: footsteps by ground, door, hit/kill on beat, UI tap,
   save chime (SOUNDS — factory queued). A silent demo reads broken.
4. 3-5 PLAYABLE QUESTS: demo-legal via hardcoded placements (the S01
   pattern — the generic placement rule stays [PENDING Paolo], NOT a demo
   blocker; scaffolding is disposable by the run lane's own charter).
5. COMBAT HANDOFF SPEED: re-land warming without the stale-bake bug
   (COMBAT — queued with the extraction). First fight can't stall.
6. SAVE DURABILITY MINIMUM: persist() + one-tap export (RUN 00b). A demo
   player who loses a save never comes back.
7. THE FIRST FIVE MINUTES: an opening that needs zero explanation — the
   scripted-scene runtime (PEOPLE 0sc) playing a minimal cold open, or a
   clean wake-up-and-go if the cold open isn't ready. No tutorial text
   walls.
8. PERF: the run adopts the streaming engine (RUN 0d) so district
   crossings don't hitch on a phone; frame-time probe rides along.
9. DEMO GATE: one integration test that plays the whole day headless +
   deploy-verified on the real link. The demo is a BUILD, not a vibe.
10. THE COLD OPEN SCENE (PEOPLE 0sc scripted-scene runtime + RUN consumes +
   COMBAT supplies a tutorial-tier family-defense encounter). Casualty
   specifics stay his "leaning" per the 7/19 addendum — build the locked
   shape.
11. THE VISTA (RUN + CITY): the overlook moment rendering the whole valley
   from the mountain — the city view machinery already renders the valley;
   this is a camera moment + a walkable overlook spur, not a new renderer.
12. THE FAMILY CAST (CHARACTER): father, mother, brother, sister on the
   rig with looks fit for the cold open — the demo's first named bodies
   beside the player. Rig law, approved wardrobe, shadows separate.
13. SQUIGGLE VOICES (SOUNDS): the babble-voice synth on the existing audio
   stack — per-character parameters, speaks per dialogue line through the
   dialogue runtime. Judged by ear like the SFX batches.

## WHAT DOES NOT BLOCK THE DEMO (keeps cooking, ships when ready)
City-builder gameplay (design in flight), the faction standing system,
companions, verticality/stairs, weather (nice if it lands), the vehicle
ladder, Ghost Time Layer, the CD/radio full system, quest volume beyond 5,
NPC named-cast depth. The demo sells the DAY; the rest sells the game.

## HONEST TIMELINE (no wishful numbers)
With lanes converged: the game day 1-2 weeks; art board landing over the
same window (swarm output + judging sitting); sounds minimum days; perf/
save fixes small. A demo-quality build is realistically 3-5 WEEKS out
(early-to-mid September), gated mostly by Paolo's judge sittings on the
art avalanche and his playtest passes on the day loop. "ASAP" = every
week of September it slips is a week some lane spent on non-demo work.

## ITEMS — his same-message question ("do we open another chat for items")
RECOMMENDATION RECORDED: NOT YET. Items are contents-heavy (rosters,
weights, what exists = Paolo's rulings, all [PENDING] in the GDD) and
mechanism-light (the engine Inventory micro/macro split is BUILT, 25
tests; the NO-INVENTORY-GAME ruling caps the player-facing side to
lightweight use-not-manage). For the demo, "items" = quest payouts +
medicine + camp supplies, which the economy skeleton (WORLD EC) already
owns as goods. Open a dedicated items chat AFTER the demo, when his item
rosters unblock real volume — a chat opened now would sit blocked on
pendings. Revisit at demo ship.
