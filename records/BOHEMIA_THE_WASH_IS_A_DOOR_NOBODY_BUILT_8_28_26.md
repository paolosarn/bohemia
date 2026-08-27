# THE WASH IS NOT TOO COMMON. IT IS TOO EMPTY — AND THE ENGINE ALREADY
# SAYS WHAT IS SUPPOSED TO BE DOWN THERE.
# (8/28/26, coordinator sweep 22. His wash complaint, measured; a finding
# that says his own fix would break it; and the thing under it that
# nobody has started.)

## 0. FIRST, A CORRECTION TO MY OWN WORK, AND IT IS THE BIGGEST THING
## I TOOK FROM THE HANDOFF
The WORLD lane corrected me on the wall-opacity finding and they were
right. I wrote "there is no wall-opacity system in this build" and routed
a lane to go build one. **IT HAS EXISTED SINCE 8/3**, on his own ruling
that day, and it fires on 60 of 60 trials. The real bug was that all
three fade rules were BINARY, so a wall crossed 0.65 of alpha in a single
footstep — which is what he actually saw. They fixed it and gated it.
**THEIR LESSON IS NOW MY STANDING RULE:** *a negative result is a claim
about your instrument until you have shown the instrument could have seen
a positive one.* I have written "nobody has started this" in eight sweeps
this month. Every one of those needed a positive control and did not get
one. From here they get one.

## 1. THE WASH, MEASURED
    node: buildOvermap(seed 'bohemia'), 96x96 = 9,216 cells
      WASH CELLS:              51  (0.55% of the valley)
      WASH CELLS TOUCHING ANOTHER WASH CELL:  44 of 51  (86%)
      LONGEST UNBROKEN RUN:    8 cells
**HE IS RIGHT ABOUT WHAT HE SEES AND HIS OWN DIAGNOSIS IS THE PART THAT
IS WRONG, SO BOTH GO IN THE RECORD.**
- "A wash should be a rare occurrence" — **IT ALREADY IS.** Half a
  percent of the map. He guessed that himself ("not super rare").
- "Never back to back like that" — **86% OF WASH CELLS ARE BACK TO BACK,
  AND THAT IS CORRECT.** A wash is a drainage CHANNEL. The real Las Vegas
  Wash is one continuous channel running to Lake Mead. Scattered
  single-cell washes would not be rare washes, they would be HOLES. The
  code draws it as a polyline and takes every cell within 0.8 of the line
  (`bohemia_overmap.js:607`), which is exactly how you draw a channel.
- **AND THE 8-CELL RUN IS NOT A BUG EITHER — IT IS THE ARTERIAL SPACING.**
  Arterials sit on every ninth row and column (`x%9===0||y%9===0`) and are
  resolved BEFORE the wash, so the longest a channel can run before a
  street crosses it is eight. The system is doing precisely what it was
  told. 8 is the design, not a defect.
**SO WHAT IS HE ACTUALLY LOOKING AT?** His screenshot answers it: a long
dark gravel corridor with nothing in it and a person standing at the
bottom. **THE PROBLEM IS NOT HOW OFTEN THE WASH APPEARS. IT IS THAT
WALKING EIGHT CELLS OF IT IS EIGHT CELLS OF NOTHING.**
That is this repo's own WALKABLE-LAND LAW in spirit — he wrote it against
a fire station that was 8% building and 52% empty apron. The wash is
terrain rather than a district so the letter of that law does not catch
it. The spirit catches it exactly.

## 2. AND THE ENGINE ALREADY WROTE DOWN THE ANSWER, MONTHS AGO
`engine/bohemia_overmap.js`, in its own comment, directly above the line
that places the wash:
> "LAS VEGAS WASH: dry channel toward Lake Las Vegas, BROKEN UP by the
> surface streets crossing it. **You can hop down into it; it is the
> ENTRANCE to the storm/sewer system underneath the city where the
> Homeless live.**"
**THAT SYSTEM DOES NOT EXIST.** There is no underground. The wash is a
corridor to a place nobody built, which is the precise reason it reads as
a void: it is a door, and there is nothing behind the door.

## 3. THE HORIZON ITEM: THE TUNNELS ARE REAL, AND THEY ARE EXTRAORDINARY
This is the "one important thing nobody has started" and it is not
invented — it is the most famous true thing about the underside of Las
Vegas, and our engine already reserved a seat for it.
- **THERE ARE OVER 300 MILES OF FLOOD TUNNELS UNDER LAS VEGAS**, built as
  storm drains to keep the streets from flooding during monsoon season.
- **HUNDREDS OF PEOPLE LIVE IN THEM**, under the casinos, in a hidden
  matrix of storm drains. This is documented, not folklore — Snopes has
  fact-checked it; the journalist Matthew O'Brien spent years down there
  and wrote *Beneath the Neon* and later *Dark Days, Bright Nights*.
- **THE DETAIL IS THE GAME.** O'Brien found a man sleeping in an elevated
  bed suspended above the water. Another in a plywood hut. People down
  there in summer simply because IT IS COOL — which lands directly on our
  heat law, where heat is the daily condition of the Mojave.
- **AND THE DANGER IS BUILT IN.** The tunnels exist because of flash
  flooding. A storm on the surface is a lethal event underground. That is
  a hazard with a real cause, a warning sign, and a clock.
- O'Brien founded a nonprofit, Shine a Light, to help the people living
  there. **THE PEOPLE DOWN THERE ARE PEOPLE.** Anything we build must
  hold that or it becomes a monster level, and this valley already has a
  faction of "the phoneless: homeless" whom the game's own quest feed
  deliberately cannot reach.

## 4. THE OTHER AISLE, AND IT IS A WARNING, NOT AN ENDORSEMENT
**FALLOUT 3'S DC METRO IS THE CAUTIONARY TALE AND WE SHOULD READ IT
BEFORE WE BUILD ANYTHING.** Bethesda routed a ruined city's traversal
through underground tunnels. Joel Burgess, one of its level designers,
describes the intent honestly: multiple ways in and out, alternate routes
circling back, players popping up in new places — and he names the cost,
that it "made it more difficult to design gameplay to be compelling
regardless of the player's direction."
The player verdict was harsher and it is consistent: **confusing, mazy,
dead ends, and lines that connected in ways that did not make sense.** The
sharpest criticism is the one that applies to us directly: *an open world
where the only way from A to B is an underground tunnel is not good open
world design.*
**SO THE RULE WRITES ITSELF: THE UNDERGROUND IS NEVER THE ONLY WAY
ANYWHERE.** It is a shortcut, a hiding place, a resource and a
neighbourhood. It is never mandatory traversal. That single constraint is
the difference between the best idea on our board and Fallout 3's most
criticised system.

## 5. THE FINDING THAT CHALLENGES WHAT WE BELIEVE
**WE BELIEVE EMPTY SPACE IS CHEAP.** The Valheim law says so in his own
words: about 20% of the world gets seen and the unexplored ocean is a
FEATURE. That is true for a world you look at from a distance.
**IT IS FALSE FOR A CORRIDOR YOU ARE FORCED TO WALK.** A wash is not
background — the streets cross it, so the player walks INTO it, eight
cells at a time, at the game's own pace of 0.084 of a day per cell. The
same emptiness that reads as scale from the mountain reads as **a chore**
at ground level. Distance decides whether emptiness is atmosphere or
tedium, and our law only ever considered one of those distances.
**THAT IS WHY HIS COMPLAINT LANDED ON THE WASH SPECIFICALLY AND NOT ON
THE DESERT**, which is far emptier and which he has never once complained
about. He walks the desert past. He walks the wash THROUGH.

## 6. THE DECISION (mine, EVERYTHING IS A THUMB)
1. **THE WASH STAYS EXACTLY AS RARE AND AS CONTINUOUS AS IT IS.** 0.55%
   is right, and a channel is continuous or it is not a channel. His
   diagnosis is the one part of his report I am not executing, and this
   record says why in his own numbers rather than quietly ignoring it.
2. **FILL THE EIGHT CELLS.** Whatever a real flood channel has in it:
   the water line on the wall, the silt, the shopping trolley, the graffiti,
   a mattress, the mouth of a pipe. This is the cheap half and it fixes
   most of what he is seeing.
3. **THE PIPE MOUTH IS A DOOR, AND SOMETHING IS BEHIND IT.** The
   underground gets built, starting with one tunnel, because the engine
   has promised it since the wash was written.
4. **IT IS NEVER THE ONLY ROUTE ANYWHERE.** Fallout 3 already paid for
   that lesson on our behalf.
5. **THE PEOPLE DOWN THERE ARE PEOPLE.** Not a monster tier. If it ever
   reads as a dungeon full of enemies, it went wrong.

## 7. ROUTED
- **WORLD — WASH-FILL:** dress the channel. Do not change its frequency
  or break its continuity; the numbers in §1 are the argument.
- **WORLD / PEOPLE — UNDER-1: ONE TUNNEL.** The mouth in the wash, one
  stretch of drain, and it goes somewhere. Not 300 miles. One.
  Constraints: never mandatory traversal; a flood hazard with a warning
  and a clock; and it is cool down there, which is a real reason to go in
  a valley where heat is the daily condition.
- **NOT ROUTED, DELIBERATELY:** any wash-frequency change, and any
  treatment of the tunnel population as an enemy faction. The first
  contradicts the measurement, the second contradicts the truth.

## 8. CONFIDENCE
- The wash numbers: generated and counted in node against the canonical
  seed. **CERTAIN.**
- The 8-cell run equalling arterial spacing: read from the placement
  order in the source. **HIGH.**
- The tunnels, the 300 miles, the hundreds of residents: journalism plus
  a Snopes fact-check plus two published books. **HIGH.**
- The Fallout 3 criticism: a named developer's own dev diary plus
  consistent player consensus. **HIGH** for what was said; the mapping to
  us is my argument.
- That filling the channel fixes his complaint: a **PREDICTION**, and he
  is the test.

## SOURCES
In-repo: engine/bohemia_overmap.js (the wash polyline at :607, the
arterial spacing, and the comment naming the storm system), the
WALKABLE-LAND LAW, laws/BOHEMIA_ADDENDUM_THE_VALHEIM_SHAPE_8_4_26.md.
Outside: Matthew O'Brien, *Beneath the Neon: Life and Death in the
Tunnels of Las Vegas* and *Dark Days, Bright Nights*; NPR's coverage of
the Las Vegas tunnel community; Snopes' fact-check on people living in
the tunnels; Joel Burgess's Fallout 3 level-design dev diary and the
player criticism of the DC metro on Steam and No Mutants Allowed.
