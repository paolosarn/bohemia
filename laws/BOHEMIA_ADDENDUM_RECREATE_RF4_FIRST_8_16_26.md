# BOHEMIA ADDENDUM — RECREATE ROGUE FABLE IV FIRST, DIFFERENTIATE SECOND
# (Paolo 8/16/26, LOCKED, direction-class: "the reference lab and the
# combat chats are going to be working together to make a live
# recreation of Rogue Fable 4 for our game bar none. idc if its a rip
# off. we are going to do this right!!! and then we'll make it different
# once we have that product. this will require indoor combat for the most
# part so we can really feel the juice we are squeezing.")

## 1. WHAT CHANGED — IT IS A RE-SEQUENCING, NOT A NEW DIRECTION
RF4 has been the named combat reference since GDD v3, and
laws/BOHEMIA_ADDENDUM_COMBAT_DNA_RF4_6_30_26.md (6/30) already says
"steal everything good from Rogue Fable IV, do it better, with guns, on
the 120 BPM dial." That doc's stance was SHARE THE SKELETON, DIFFERENT
BODY — never build the surface, only the philosophy.
TODAY HE FLIPPED THE ORDER, and newest date wins: BUILD THE RECREATION
FIRST, get it genuinely working and fun, THEN diverge.
NOTHING IN THE 6/30 DOC IS REPEALED. Its five "where guns + 120 BPM beat
it" theses (execution as a second skill axis, rhythm as a dimension RF4
lacks, guns change the geometry, no time-tax, difficulty from shape not
tricks) ARE THE PHASE-TWO SPEC, ALREADY WRITTEN. That is the gift here:
he does not have to invent "and then make it different" later — it is
sitting in a file from June, and phase 1 is what makes it real.

## 2. WHAT RF4 ACTUALLY IS, MECHANICALLY (the target, from its own
## designer's published words and patch notes)
- THE DESIGN GOAL: squeeze the depth, complexity and challenge of
  traditional roguelikes into runs COMPLETABLE IN UNDER AN HOUR, and
  approachable by players new to the genre. Density, not length.
- DELIBERATELY FREE OF STAT AND FORMULA BLOAT. Critical information is
  presented IN THE WORLD AND ON THE FIELD OF BATTLE, not buried in menus
  and sheets. (This is the same instinct as our normie-easy clause.)
- COMBAT IS MOBILITY, POSITIONING, TIMING AND TARGET SELECTION. Not
  stat-checks, not DPS races.
- DEEP, OPEN-ENDED CHARACTER DEVELOPMENT balanced to encourage WIDE BUILD
  VARIETY. Runs differ because builds differ.
- SCOPE: a procedural dungeon of 13 zones, 250+ monsters, 30+ bosses,
  ending in a climactic named boss.
- UNIFICATION IS ITS LIVING DESIGN PRINCIPLE. Update 1.36's overhaul
  collapsed many messy one-off damage-boost effects into ONE unified
  stat, POWER ("the single go-freaking-nuts effect"), and did the same
  for Protection/Block — explicitly "streamlining while MAINTAINING OR
  INCREASING depth." The lesson to steal is not a number; it is the
  ruthlessness about collapsing near-duplicate systems.
- AND THE ONE THAT PROVES HIS INDOOR INSTINCT: abilities READ THE ROOM.
  Infusion-of-Storms grants +1 Power "when ending turn WIDE OPEN, meaning
  NOT ADJACENT TO ANY WALLS." Walls are MECHANICS in RF4, not scenery.

## 3. WHY INDOOR IS RIGHT, AND WHY WE ARE READY FOR IT
His reason ("so we can really feel the juice we are squeezing") is the
correct one and §2's last bullet is the proof: a fight only has
positioning depth if the geometry MEANS something, and a room means more
than an open street. Doorways are chokepoints, corners are cover, wide
open is exposure. Outdoors on a 65-mile valley, that geometry dissolves.
WHAT WE ALREADY HAVE FOR IT:
- INTERIOR-MATCHES-EXTERIOR (7/19, LOCKED): every interior floor plate is
  exactly the building's footprint w x h. Interiors are already REAL,
  DIMENSIONED SPACES, not abstractions.
- The tilespec LAYERING law already classifies PORTAL tiles ("go INTO an
  interior: door, garage ramp, tunnel mouth") and marks what is solid.
  Walls and doors are already typed data.
- The cover system (per-enemy tucked/peeking/firing, LOS gating) is
  already the gun-native positioning game the 6/30 doc named.
WHAT IS MISSING IS THE SAME WIRE THE DEMO BOARD ALREADY FLAGGED: on the
walked surface there is NO COMBAT ENTRY POINT (records/BOHEMIA_DEMO_
STATUS_BOARD_8_14_26.md row 1 — every "combat" occurrence in the city
world is a comment or CSS). INDOOR COMBAT AND THAT MISSING WIRE ARE THE
SAME JOB: walk in a door, fight in the room.

## 4. TWO LANES, ONE SYSTEM — THE SEAM IS NAMED HERE ON PURPOSE
He put TWO chats on this, and ONE SYSTEM ONE SESSION is law. This is
exactly the collision the coordinator exists to prevent, and sweep 13's
finding applies directly: component verification is not interface
verification — so the interface gets written down BEFORE either lane
starts.
- **LAB OWNS THE TEARDOWN.** It studies RF4 and produces THE SPEC: a
  numbered, mechanical inventory of RF4's systems — turn/energy model,
  ability economy, the Power unification, enemy design rules, zone and
  boss structure, build/character development, what it DELIBERATELY
  OMITS — plus a DIFF against what Bohemia already has. LAB WRITES NO
  COMBAT CODE. Its charter is one session, one system, one named game;
  this is that, exactly.
- **COMBAT OWNS THE IMPLEMENTATION.** It is the only lane that edits
  combat code, and it builds FROM the spec, citing spec item numbers in
  its commits so the seam is traceable in both directions.
- **THE SEAM IS A FILE**, not a conversation: records/BOHEMIA_RF4_
  TEARDOWN_SPEC.md. Numbered items, each with a status (SPECED / BUILT /
  DIFFERS-ON-PURPOSE). Neither lane edits the other's column. If COMBAT
  needs a mechanic the spec does not cover, it asks for a spec item — it
  does not invent one and it does not go read RF4 itself. That is how two
  chats stay one system.

## 5. THE ONE CONSTRAINT, STATED AS A BUILD INSTRUCTION
He said "idc if it's a rip off," and on the part that matters he is
right: GAME MECHANICS AND SYSTEMS ARE NOT COPYRIGHTABLE. Recreate the
systems freely and exactly — that is a legitimate, well-trodden
development strategy, and clone-then-differentiate is how a large share
of good games began.
WHAT IS NOT FREE IS EXPRESSION: names, art, text, monster and ability
names, UI layout, and the game's title. So: never copy a name, a string,
an icon or a screen. This costs us NOTHING, because every one of those is
being reskinned to post-crash Vegas anyway — the Wizard Yendor is not
walking into this game. Build the machine, write our own words on it.

## 6. RELATIONSHIP TO THE DEMO
NOT demo-blocking and must not displace RUN P0-DOOR, SOUNDS P0-WALK or
RUN P0-SAVE. But it is not disconnected either: the combat-entry wire
(§3) is demo row 1's missing piece, so the FIRST thing this effort ships
— walk through a door, fight in the room — pays the demo immediately.
Everything after that is post-demo depth.
