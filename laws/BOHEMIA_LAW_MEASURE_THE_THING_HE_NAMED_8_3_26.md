# MEASURE THE THING HE NAMED (Paolo 8/3/26, LOCKED)

> "I NEED YOU TO MAKE PERMANAENT AWESOME CHANGES TO THIS GAME RIGHT NOW AND MAKE LAWS
> EVERY OTHER SESSION has to listen to... we cant be doing one off shit where u do good
> in this session or something and in another session it has no fucking clue man."

This is that law. It binds EVERY session, every lane, forever.

---

## WHY IT EXISTS

On 8/3, three separate complaints of his had already been "answered" by sessions that
measured something ADJACENT to what he said. All three answers were green, written up,
and wrong.

| he said | what got measured | what was true |
|---|---|---|
| "id dint see the side door" | `drawImage` calls counted: 4 per door | the east one was painted over by the next wall, the west one landed 37px away. **A counted draw is not a visible door.** |
| (the world died on entry) | the page loaded with zero errors | the world threw the moment you walked into a suburb. **A page that loads is not a world that runs.** |
| "why when i enter a house i cant go left and right" | flood-filled every reachable cell: 94 of them | he lands ON the door cell with a jamb either side. Left is wall, right is wall. **A reachable cell is not a pressed direction.** |

One mistake, three lanes, one day. Each time the proxy was easier to measure than the
thing, and each time the proxy passed.

---

## THE LAW

**1. MEASURE THE THING HE NAMED, NOT THE THING NEXT TO IT.**
If he says a button does nothing, PRESS THE BUTTON. If he says he cannot see something,
READ THE PIXELS WHERE IT SHOULD BE. If he says he cannot move, DRIVE THE MOVER. A gate
whose evidence is one step removed from his sentence is not evidence.

**1b. MEASURE IT WHERE HE IS STANDING.**
A number taken somewhere he never goes is not a number about his game. The east/west
door gate swept the whole 96x96 valley, found side doors in commercial and farm,
reported "22 of 22 buildings" and went green -- while the SUBURB he spawns in had ZERO,
because the suburb is a separate realizer branch the pass never touched. He said "id
dint see the side door" three times and was right every time. Every gate that measures
coverage of anything must assert it IN THE SPAWN DISTRICT, by name, first.

**2. A GATE MUST BE ABLE TO FAIL FOR THE REASON HE COMPLAINED.**
Before you register a gate, ask: *if his exact complaint were true right now, would this
gate be red?* If the answer is no, the gate is decoration. The door-jamb gate counted
calls and could never have gone red while he stared at a door with no frame on it.

**3. RENDER IT AND LOOK AT IT.**
Machine-green is necessary and never sufficient for anything he SEES. Draw it, crop it,
open the image. The interior-surfaces work was green, coherent and looked like a texture
sheet; the only thing that caught it was looking.

**4. A DIFF IS BETTER THAN A COUNT.**
Where you can, render WITH the change and WITHOUT it and diff the pixels in the exact
region he described, plus a CONTROL region that must NOT change. A count proves a thing
ran. A diff proves a thing arrived.

**5. WHEN THE SUITE GOES RED, PROVE WHOSE IT IS. NEVER GUESS.**
```
git worktree add -f /tmp/base<sha> <the sha you branched from>
cd /tmp/base<sha> && node gates/<the_red_one>.js
```
Same pass/fail counts on both sides = it was already broken, say so with the number.
Different counts = it is yours, fix it. `git worktree remove --force` when done.
"I think that one was already failing" is not allowed. It costs one command.

**6. A DERIVED ARTIFACT IS NOT DERIVED UNTIL YOU RE-DERIVE IT.**
FIVE files inline the engine modules. Change one engine file and all five go stale
silently, along with `CITY_B64` itself:
```
python3 tools/bohemia_city_module_resync.py      # the alpha's CITY blob
node    tools/build_current_slice.js             # the phone slice
node    tools/build_run_slice.js                 # the run slice
python3 tools/bohemia_map_tab.py                 # the MAP tab embed
python3 tools/bohemia_quest_placement_judge.py   # the quest judge page
```
A fix he cannot see is not a fix, and "I didn't see nothing new" is a complaint this
repo has eaten three times.

**7. APPROVED-BUT-UNUSED IS A DEFECT, AND IT IS THE MOST COMMON DEFECT IN THIS REPO.**
Seven times in one month, art he approved or bought was sitting in `banks/` while the
game drew something else: border walls, the bought sidewalk, footsteps, traffic signals,
door swing clips, door jambs, the entire interior pool. **Before building anything, grep
`banks/` for it.** If you find approved art that ships zero bytes, that IS the task.

**8. A COMMENT CLAIMING A BUG IS FIXED IS NOT A GATE.**
`bohemia_suburb.js` carried a 7/26 comment explaining that a binding bug had been fixed.
The bug was still live on 8/3, in the exact form the comment described, because the
comment was the only thing enforcing it. If it matters, it has a gate. If it has no gate,
it is not enforced (repo law since 7/16, restated here because it keeps being true).

---

## THE DOOR LAW, SETTLED (8/3)

> "WY IS IT WHEN IM IN THE OUTSIDE OF A BUILDING I CAN ENTER IT FROM JUST WALKING TO ANY
> WALL OF THE BUILDING NOW IM MAGICALLY IN THE BUILDING."

**A DOOR GOES WHERE AN ENTERABLE BUILDING MEETS GROUND A PERSON CAN STAND ON, one per
contiguous run of that frontage, and nowhere else.** Never hashed, never a dice roll:
read off the plot the generator already made, so every door is reachable by construction.
`entry.enter` is the gate on which masses qualify, so a fence never gets a front door.

**A MASS WITH NO WALKABLE FRONTAGE STAYS PERMEABLE ON PURPOSE.** Inventing a door for it
recreates the 7/27 bug (doors on backyard walls facing a dead lot with no way to reach
them), and sealing it without one locks him out of a building forever. The residual is
PRINTED by the gate every run so it can never be quietly forgotten.

Coverage is a RATCHET that only goes up: `gates/everydoor_gate.js`, floor 35% today
(reading 39%), against 11% before the door pass. The gate also asserts a minimum mass
count so coverage can never be "won" by deleting buildings.

---

## THE SIDEWALK LAW, EXTENDED (8/3)

D1 ("houses or buildings should NEVER SIT ON THE SIDEWALK EVER ANYWHERE IN THE WORLD",
7/31) was true in ONE district out of forty, and the reason was an ADDRESS: `layWalks()`
was private inside `bohemia_suburb.js` where nothing else could call it.

**A PUBLIC STREET IS DECLARED, NEVER GUESSED.** A legend `kind:'drive'` row with
`street:true` is a public right-of-way and wears a walk. A driveway apron, a lot aisle, a
truck court and a haul road are NOT streets, and D1's own text lets an apron cross the
walk. Default is false, so a district that declares nothing is unchanged and ungated.
Without that declaration the only rule you could write FAILS THE SUBURB, the one district
that was already correct, on 1,928 legal garage-to-apron adjacencies.

`K.layWalks` / `K.streetCodes` / `K.canPlaceMass` / `K.D1_EXEMPT` are kit primitives now.
Gate: `gates/d1_kerb_gate.js`, sweeping the whole registry, never one module.

---

## HOW TO ADD TO THIS LAW

New law = new gate, SAME TURN. Add the clause here, add the gate to
`gates/bohemia_gates.py`, and put the measured number in both. A clause with no number
and no gate is a wish.
