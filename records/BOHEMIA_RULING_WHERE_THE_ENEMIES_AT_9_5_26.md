# WHERE THE ENEMIES AT (Paolo 9/5/26, played the run, LOCKED)
# "Awesome I just played the run. Where the enemies at bro"

## THE RULING
He walked the game and met nobody who wanted to hurt him. That is the note. The
walked street has no enemies in it, and a walked street with no danger is a
walking simulator with good clothes.

## WHAT I MEASURED BEFORE WRITING THE JOBS (so this is not a guess)
- `slices/BOHEMIA_ALPHA_0_9.html`, `BOHEMIA_CITY_WORLD.html`, `BOHEMIA_DEMO.html`:
  every occurrence of "hostile", "enemy" and "enemies" is PROSE -- quest text and
  embedded study notes. Not one of them spawns, draws or moves a hostile body.
- `engine/bohemia_between.js` (14 hits), `bohemia_loop.js` (3), `bohemia_engine.js`,
  `bohemia_save.js`, `bohemia_commitment.js`: hostility EXISTS, but only as a
  RELATIONSHIP -- a sign on an edge between you and an outfit, sorted hostile-first,
  which makes them charge you more and watch you. It is a ledger, not a body.
- `roadInterrupt` still has exactly one caller and it is inside `MODE==='city'`, so
  nothing interrupts you on foot (RUN [street encounters], open since 8/31).
- The fight itself is real and reachable (combat entry gate 26/0) -- but only through
  the city map door, never because somebody walked up to you.

## THE HONEST SENTENCE
The game knows who your enemies are. It has never once put one in front of you.

## ROUTED (top of lane, above everything else in those lanes)
- RUN [enemies exist]: hostile bodies stand, walk and close on the walked street.
- COMBAT [street fight]: bumping a hostile group starts the fight where you stand.
- PEOPLE [who is hostile]: the crowd wears the hostile sign the between-ledger
  already computes -- they watch, they follow, they block a door.
- UI [danger visible] (the coordinator's own, 9/5): you can SEE a block is dangerous
  BEFORE you walk into it. A fight that arrives with no warning on a phone is a rage
  quit, and colour is already territory; the tell rides the colour.
