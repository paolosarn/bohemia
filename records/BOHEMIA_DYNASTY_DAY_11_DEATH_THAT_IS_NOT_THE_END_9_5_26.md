# DYNASTY STUDY -- ROUND 11 (Q11): DEATH THAT IS NOT THE END
# (DYNASTY lane, 9/5/26. MODE: RESEARCH -- nothing here is implemented.)
# VAMILY row: DYNASTY Q11 [lasting death], "Death that is not the end. How games
# without permadeath and without a run still make a death matter across
# generations (the wounds that carry, day 4's scar)."
# Rounds 1-10: records/BOHEMIA_DYNASTY_DAY_1..10_*.md (round 6 carries a
# correction written in round 7: I published a false negative there.)
# THE GRIEF WORDS ARE NOT THIS LANE'S. The WORDS lane shipped Q8 [grief talk] and
# a GRIEF DINNER scene; this round stays on the machine and does not restate them.
# Game titles appear in SOURCES only (the 8/28 law as amended 9/5).

## 1. THE GAMES AISLE -- THE HONEST COMPLAINT AND THE HONEST FIX
The complaint is old and exact: a game presents death as tragic while its
systems let you undo it with a reload, a respawn timer, or another attempt.
**Death is a loading screen.** The fixes the craft has actually landed on are all
one idea in different clothes: **something is taken and does not come back**, or
**the world keeps the consequence** rather than the character sheet.
That is the whole games answer, and our project already refuses the easy version
of it: THERE ARE NO RUNS, so we cannot make death matter by resetting anything.

## 2. THE REAL AISLE -- A SCAR IS NOT DAMAGE, IT IS A REPAIR THAT NEVER FINISHES
Wound-healing biology, which is what "day 4's scar" is actually about:
- Mature scar tissue tops out at roughly **four fifths of the tensile strength
  of the skin it replaced. The gap never closes.**
- Scar tissue **does not get its equipment back**: no hair follicles, no oil
  glands, no sweat glands. A deep enough injury destroys them and they are not
  rebuilt.
- Uninjured skin is a **basket weave** of collagen that stretches every way.
  Scar is laid down in a hurry in **parallel bundles running one way**: strong
  enough, but stiffer, shinier, and visibly different.
- Remodelling runs **twelve to eighteen months**, so a scar at three months is a
  midpoint and not a verdict. The structural limits are permanent anyway.
> **A SCAR IS NOT A NUMBER GOING DOWN. IT IS A PART OF YOU THAT WORKS
> DIFFERENTLY, FOREVER, AND CAN BE POINTED AT.**
That distinction is the whole reason a scar can exist in a game that has
**NO DAMAGE BEFORE THE DIAL**: it is a state, not a subtraction.

## 3. *** THE ONE SENTENCE ***
> **A DEATH SHOULD COST A SEAT, A PIECE OF SOMEBODY'S BODY THAT NEVER COMES
> BACK, AND ONE PERSON WHO USED TO ANSWER. NOT A LIFE, BECAUSE WE DO NOT HAVE
> LIVES.**

## 4. THE MEASUREMENT -- WE ALREADY BUILT THE BEST HALF, AND IT RUNS IN DAYS
### (a) THE GOOD PART: A DEATH ALREADY REORGANISES THE WORLD
`engine/bohemia_succession.js` exists, is 271 lines, and is **called** (from the
mandate module and the walked city). Its rules, from the locked addendum:
- **Roles hold requirements, never a hardcoded person**, so killing a holder
  writes a delta and the role re-queries. Storing the person IS the soft-lock.
- **A vacancy is a contested event with a winner**, never silent reassignment.
  Kill the moderate and a hardliner can take the seat and now hates you.
- **It takes time, on a fuse**, resolvable on the forward-compute while the
  player is elsewhere.
- And it cannot soft-lock: living claimants first, then a replacement the
  faction sends, and if nobody can fill it the thread **closes with a
  consequence ripple, never an error.**
**That is a death mattering, built, and it is exactly the games aisle's "the
world keeps the consequence" answer.** Say it before saying what is wrong.
### (b) BUT THE FUSE IS IN DAYS AND THE LAW ASKS FOR DECADES
```js
function fuseFor(nClaimants) { return nClaimants <= 1 ? 2 : 2 + nClaimants * 3; }
function tick(state, toDay) { ... if (day < s.fuse) continue; ... }
```
An uncontested seat resolves in **two days**. Five claimants is **seventeen**.
The locked law says: *"the struggle PLAYS OUT over time, not instant. The crazy
story consequences intentionally bloom in **decade 2 and 3**."*
> **THE MECHANISM IS RIGHT AND THE CLOCK IS THREE ORDERS OF MAGNITUDE SHORT.**
Same shape as round 9's century rule: a locked law, a built mechanism, and a
number that cannot reach what the law asks for.
### (c) AND A DEATH IN THE FOLD IS ONE BOOLEAN
```js
else if (e.event === 'death') { const n = fam.tree.find(x => x.id === e.who); if (n) n.alive = false; }
```
That is the entire consequence of dying in the dynasty engine. Round 3 measured
there is no name on that node; round 4 measured `wounds` is written and never
read.
### (d) *** AND THE ONLY SCARS IN BOHEMIA ARE ON A MOUNTAIN ***
Searched the engine for scar, injury, maimed, crippled. **POSITIVE CONTROL
FIRST**, because this is exactly where round 6 caught me: 18 hits for `scar` and
most of them are **`scarcity`**. The real ones are:
- `bohemia_mountain.js`: **`rockfall scar`**, *"a fresh pale scar"* on a cliff
  face, with the boulders that came from it sitting on the talus below.
- `bohemia_engine.js`: the word **"combat scars"** in a comment listing a
  DISTRICT's standing pressures, which drift over beats.
> **THE MOUNTAIN SCARS. THE DISTRICT SCARS. THE PERSON DOES NOT.**
Scope stated: engine searched, every hit read, slices not swept, so the honest
claim is that this is what I found and where I looked.

## 5. *** THE FINDING THAT PROVES US WRONG ***
### THE INSTINCT IS TO MAKE DEATH COST THE PLAYER SOMETHING. WE ALREADY HAVE A BETTER ANSWER AND WE UNDERBUILT ITS CLOCK.
The genre's answer is subtraction: take money, take gear, take progress. We
cannot use it and should not want to -- THERE ARE NO RUNS, and round 4 already
found the fold is a ratchet that cannot subtract anyway.
**The answer we already own is better: a death is a VACANCY, and the world
contests it.** That is built, called, soft-lock-proof, and it is the thing the
craft says works. What is missing is not a mechanic. **It is a clock that can
reach decade two.**
### AND THE HALF THAT IS ABOUT BODIES
Our world can carry a permanent mark and our people cannot. A cliff keeps the
pale patch where the rock came off. A district carries combat scars as a
standing pressure that drifts for ten thousand beats. **A person who was nearly
killed carries nothing at all.**
> **WE GAVE THE GEOLOGY A MEMORY OF INJURY AND NOT THE FAMILY.**
And round 5 already found the missing half of the same idea from the other side:
healing is the one cost of ageing with **no compensation**, and it is time rather
than power, so it needs no damage number. A scar is that finding made permanent.
### EIGHTH ROUND, SAME SHAPE, AND NOW IT IS THE LANE'S REAL OUTPUT
Rounds 1, 2, 5, 6: right mechanism, wrong subject. Round 7: right answer, wrong
department. Rounds 8, 9: permanent things at three-valued resolution. Round 10:
the hardest structure already solved in a camera law. Round 11: **the right
mechanism, the right subject, and a clock too short to reach the story.**

## 6. WHAT WE TAKE AND WHAT WE REFUSE
**TAKE**
- **A death is a vacancy.** Already built, already called, already the craft's
  answer. Nothing new to design.
- **A fuse that can reach a generation.** The law says decade two and three; the
  code says a fortnight. The mechanism is fine; the number is his.
- **A scar as a state, not a subtraction.** A part of a person that works
  differently and can be pointed at. This is how a permanent injury lives inside
  NO DAMAGE BEFORE THE DIAL.
- **A wound that can be read** (round 4's row) so a scar has something to be
  the scar OF.
- **One person who used to answer.** Round 7 found neglect costs more the closer
  you are; the same curve says a death close to you should be felt through who
  no longer picks up, which is the standing web's own shape.
**REFUSE**
- **Any damage, health or armour number, including the four-fifths figure in
  section 2.** That number is REAL BIOLOGY AND IT IS NOT SHIPPABLE: the SHAPE is
  "a repair that never fully finishes", and how much is his dial. I have written
  the shape and deliberately not the value.
- **Subtracting from the player on a death.** No lost money, no lost gear, no
  lost progress. There are no runs and the fold cannot subtract anyway.
- **Permadeath.** Not the row, not the game, and the row's own title rules it out.
- **A second death system.** Succession exists and is correct. This is a clock
  and a body, not a rebuild.
- **Restating the grief words.** Another lane shipped them and this round does
  not touch them.

## 7. ROUTED (proposals for the coordinator -- only the coordinator adds jobs)
- **WORLD -- THE-FUSE-CANNOT-REACH-A-DECADE.** `fuseFor` returns days; the locked
  succession law asks for consequences blooming in decade two and three. Sits
  beside round 9's century-rule row as the same class of gap: a good mechanism
  with a clock too short for the story it serves.
- **CHARACTER or COMBAT -- A SCAR IS A STATE.** The mountain has one and a person
  does not. No damage number, no health number: a part that works differently and
  can be named.
- **WORLD -- THE-FOLD'S-DEATH-IS-ONE-BOOLEAN** (folds into round 3's and round
  4's existing row rather than opening a new one).
- **DYNASTY (this lane).** Q12 [heir's hour] is the last OPEN row and inherits
  all of this: what the heir finds is a seat somebody took, a mark on a body, and
  a person who does not answer.

## 8. CONFIDENCE
- Section 4, every quoted line, `fuseFor`, `tick`, the fold's death branch, the
  scar hits and the `scarcity` control: **MEASURED** today, scope stated.
- The succession law's "decade 2 and 3" and its three rules: **VERBATIM** from
  the locked addendum.
- Scar tensile strength topping out around four fifths, the missing follicles and
  glands, the parallel-bundle versus basket-weave collagen, and the twelve to
  eighteen month remodelling: consistent clinical and wound-healing summaries.
  **HIGH** on the qualitative facts, which are textbook. **MEDIUM** on the
  fraction, which I saw as a summarised figure rather than in a primary source,
  and which section 6 refuses to ship anyway.
- The games aisle: community and encyclopedic writing on death and permadeath
  alternatives. **MEDIUM-HIGH** as a description of the complaint and the common
  fixes; it is not a study.
- Sections 3, 5, 6 and 7: **MY ARGUMENT AND MY ROUTING.**

## SOURCES
NAMED AS RULERS, NOT AS REFERENCES, AND NONE IS A REFERENCE GAME FOR ANY
DEPARTMENT. REAL AISLE: clinical and wound-healing summaries of scar formation,
maturation and permanent structural difference from uninjured skin. GAMES AISLE:
encyclopedic and community writing on death in games, permadeath and its
alternatives, read for the shape of the complaint and the common fixes only.
IN-REPO: laws/BOHEMIA_ADDENDUM_SUCCESSION_AND_BUNKERGUY_7_1_26.md (quoted);
engine/bohemia_succession.js (`fuseFor`, `tick`, `vacate`, `claim`, `resolve`);
engine/bohemia_engine.js (the fold's `death` branch, the district pressures
comment); engine/bohemia_mountain.js (`rockfall scar`); and rounds 3, 4, 5, 7 and
9 of this study. The WORDS lane's Q8 [grief talk] record and GRIEF DINNER scene
are noted as owning the words half and were deliberately not restated here.
