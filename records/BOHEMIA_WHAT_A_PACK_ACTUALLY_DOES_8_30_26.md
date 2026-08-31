# WHAT A PACK ACTUALLY DOES, AND WHY IT IS NOT A HEALTH BAR
## Research for backlog row ALIVE-2 (tier 2). PEOPLE lane, 8/30/26.
## Follows records/BOHEMIA_THE_VALLEY_HAS_ANIMALS_IN_IT_8_28_26.md (tier 1).
## Dispatch item 8: ENEMIES, LOOT, and Valheim-style DANGER BY PLACE.

---

## THE ONE SENTENCE

**THE PACK DOES NOT WANT TO FIGHT YOU. IT WANTS THE THING.** Every number below
says the same thing from a different direction, and it is the opposite of the
game convention where an animal spots you and closes until one of you is dead.

---

## 1. THE DOGS ARE NOT WOLVES, AND THAT IS THE WHOLE DESIGN

The backlog row says "dog packs and coyote packs with pack AI that flanks and
breaks off". Half of that is wrong about dogs and the research says so plainly.

- Free-ranging dogs live in groups of **2 to 15**, but **feral** dogs pack while
  **urban strays are less social than expected**.
- As scavengers **they forage singly most of the time**, and form **random
  uncorrelated groups** rather than hunting parties.
- They show **less cooperation in activities such as hunting and breeding** than
  wild canids do.
- Their territories **overlap substantially** between packs, **intergroup
  encounters are frequent**, and **territorial conflict rarely results in lethal
  aggression**.
- They are **primarily scavengers dependent on human-generated waste**.

So a coordinated wolf hunt is not what a city dog does. What a city dog does is
**hold a spot with food on it, in a group, and threaten anything that comes for
it, and almost never follow through**. That is a much better encounter than a
hunt, because it has a door in it: you can leave, and so can they.

**THE DOGS ARE NOT AT THE ALLEY. THEY ARE AT WHAT IS IN THE ALLEY.** If the
player can see what the pack is standing on, the encounter explains itself with
no text.

## 2. THE COYOTES ARE THE OPPOSITE ANIMAL AND SHOULD READ THAT WAY

- Coyote territories have **very little overlap** and are **defended**. Groups
  run **five to six adults** plus that year's pups. Home ranges **2 to 30 square
  miles**.
- Free-ranging dogs: overlapping, tolerant, frequent harmless run-ins.
  Coyotes: exclusive, spaced out, rare.

Two canids, opposite social rules, and the player should be able to feel the
difference without being told: **you meet dogs often and coyotes seldom.**

## 3. AND THE MEASURED NUMBER THAT INVERTS THE CONVENTION

Edmonton, 120 volunteers, 71 neighbourhoods, **1,598 patrols**:

- coyotes seen at all in **175** of them (about **11%** of walks)
- **retreated before the person was within 40 m in 124 of 175 = 71%**
- when actually hazed (run at, shouted at): **retreated immediately in 22 of 23
  = 96%**

**ONE IN TWENTY-THREE DID NOT BACK DOWN.** That is the encounter. Not a
percentage chance to attack, a percentage chance that the thing you are trying
to scare off **does not scare**, and you find out which one you have by trying.

This is the exact same shape as tier 1's two distances, one step further out.
Tier 1: notice, then leave. Tier 2: notice, then **decide**, and one in twenty
picks the other way.

## 4. THE ALLEY IS THE MECHANIC, AND A ROGUELIKE ALREADY PROVED IT

Brogue's grouped monsters **avoid attacking in corridors when they are in
groups**, so a group does not waste its numerical advantage chasing you into a
place where only one of them can reach you. It is heat maps, not pathfinding:
one pass, scales with the number of monsters.

For Bohemia this is the whole tactical layer and it costs almost nothing:

- **The pack holds the mouth of the alley.** It does not follow.
- So a narrow place is a real out, and the player learns it by using it once.
- And it is honest to the animal: a scavenger that risks nothing does not follow
  a bigger animal into a hole.

Bohemia is turn-based on the beat and I-MOVE-YOU-MOVE, so "surround" is literal:
the pack takes the open cells around you, one per beat, and the reason to move
is that the ring closes. **THE FIGHT HAS TO MOVE YOU**, and here the thing that
moves you is arithmetic you can see on the floor.

## 5. THE DEN IS SEASONAL AND IT IS FOR PUPS

- Urban canids den in **dry culverts, storm drains, under sheds, under porches,
  vacant lots, even parking lots**. About **half of studied dens were in
  human-built structures**.
- Coyotes **use dens only for pupping**, and move pups regularly.
- Human disturbance **does not** put free-ranging dogs off a den site, and does
  put coyotes off. Same split as section 2.

Las Vegas has the storm drains, and people really do live in them. A den under
the city is not a fantasy location, it is the local one.

**SO A DEN IS NOT A TREASURE ROOM.** A den is the one place a pack **cannot**
do the thing in section 3, because it cannot leave. The 4% that does not back
down is 100% at the den. That is danger by place, from biology, with no dial.

## 6. AND THE FIRST LOOT SHOULD BE WHAT A SCAVENGER DRAGGED HOME

Not a chest. Dogs are scavengers on human waste, and this city has bodies in it.
What is at a den is what was carried there: bones, a bag torn open, a shoe, what
was in somebody's pockets before the dogs got to them. That reads as grim and
true rather than as a reward, and it is the first time the world tells you what
happened somewhere instead of telling you what you won.

The exact contents are **his**: who died and what they were carrying is canon,
not mechanism.

---

## WHAT THIS RESEARCH DOES NOT SETTLE

- how much damage anything does (NO DAMAGE BEFORE THE DIAL)
- whether the player can kill a dog, and what that costs socially
- which blocks are the bad blocks (tier 3, reserved, his)

---

## SOURCES

- Population and social biology of free-ranging dogs, J. Mammalogy
- To be or not to be social: foraging associations of free-ranging dogs in an
  urban ecosystem, acta ethologica
- Eating smart: free-ranging dogs follow an optimal foraging strategy while
  scavenging in groups, Frontiers in Ecology and Evolution
- The social organisation of a population of free-ranging dogs in a suburban
  area of Rome
- Urban coyotes were observed rarely and retreated consistently from assertive
  approaches by volunteers in neighborhoods, PLOS One 2025
- Urban coyotes select cryptic den sites near human development where conflict
  rates increase, J. Wildlife Management 2023
- Denning habits of free-ranging dogs reveal preference for human proximity,
  Scientific Reports
- Urban Coyote Research, general information; Nevada Department of Wildlife
- Brogue monster AI notes (heat maps; groups avoid corridors)

---

# WHAT SHIPPED, 8/30/26
## Gate: gates/pack_gate.js (47 claims, 0 red, 7 mutations caught)
## Tab: RUN (walk out and keep going; a pack turns up in about 49 steps)

## THE NUMBERS, MEASURED RATHER THAN ASSERTED

| | measured | where it comes from |
|---|---|---|
| back down when you push | **95.6%** over 38,946 groups | 22 of 23 hazing events |
| back down **at a den** | **0** of 6,160 | a den cannot be left |
| dog groups vs coyote groups | **3,252 to 106** over 300 seeds | overlapping vs exclusive ranges |
| group size | 2 to 6 adults | 2-15 observed, 5-6 for an urban coyote group |
| den groups | 13.9% | mine, and it is a dial |
| coats | sandy 56%, black 27%, pale 16% | weighted: a list is not a distribution |
| steps to meet a pack | **49** | on the real surface, walked |

## THE STATE LADDER, READ OFF THE GLASS

`9:settled 8:settled 7:settled 6:notice 5:notice 4:notice 3:warn 2:warn 1:warn`

The first cut of that check read twenty cells and ten cells, which is off the top
of a 378x785 screen at 44 pixel tiles, so it came back **offscreen** twice and
the claim **passed anyway**, because offscreen is not equal to warn. **A CLAIM
THAT PASSES ON A FAILED MEASUREMENT IS NOT A CLAIM** -- the same shape tier 1 had
two days ago, in a gate written after fixing it there.

## AND THE SCREEN IS PART OF THE DESIGN, NOT A CONSTRAINT ON IT

The dogs started at notice 14 and warn 7, reasoned from the animal alone. The
player sees about **eight cells**. A dog that notices you at fourteen has already
noticed you before it is on screen, so **its settled state does not exist for
anybody playing**, and half the feature is invisible.

**A STATE THE CAMERA CANNOT CONTAIN IS NOT A STATE, IT IS A COMMENT.**

The shorter numbers are also the truer ones here: free-ranging dogs beg from
people and live on our waste, so the city dog is the canid with the short flight
distance. The coyote keeps the measured forty, because for a coyote the point is
that it clocked you long before you saw it.

## *** AND THEN A GATE CALLED THE WHOLE FEATURE DEAD, AND IT WAS RIGHT ***

ORGAN REACH, rule 1: **"an organ no line in this repo calls is dead."** Two of
them, and they were **the headline**:

- `packAssert()` was defined and **never called**, so the player could not push a
  pack. The 22-in-23 finding this entire tier is built on **had no way to
  happen.**
- `BohemiaPacks.ring` was **never called**, so the alley rule -- the thing that
  makes a narrow street a real out -- ran nowhere.

The mechanism existed and nothing could reach it. That is the invisible-hats
shape, **in the same turn as a record about the invisible-hats shape**, and no
amount of looking at the screen would have found it, because what was missing was
not on the screen. Only a machine check that asks "who calls this" found it.

So the tier now has a control: **a BACK OFF button that appears only while
something is warning you**, because a control that is always there is another
bullshit button (Paolo 8/16) and a control that is never there is a dead organ.
And the ring is drawn: a warning pack **closes on the open cells around you**,
and takes none of them when you are in a narrow place, so backing into an alley
visibly stops them coming.

The gate now asks that question of itself: every function the module exports must
have a caller in the game.

## AND THE BUTTON WAS PUT IN THE WRONG PLACE TWICE

Placed by counting the CSS rules in the file: it landed **on top of** the caption
and the STANDING button with the d-pad over its right edge. Corrected by
arithmetic: still **49 pixels out**, because the container is inset from the
viewport by an amount no rule in the file states. Fixed by **measuring the
rendered boxes** -- caption 657-683, STANDING 689-720, BIKE 763-795, SLEEP
801-832, d-pad a 180x180 square at x198,y658 -- and putting the line at 577-615
and the button at 621-651.

The check is **nine points, not the centre**: A CONTROL IS REACHABLE WHEN EVERY
PART OF IT IS. The middle row passed both times it was broken. And the ruler
itself needed one fix: the exact corners of a rounded button are outside the
shape on purpose, so sampling them measures border-radius rather than reach. It
insets by the corner radius and separately checks that no other control's box
intersects it.

## FIVE THINGS ONLY LOOKING FOUND, AND TWO OF THEM WERE ALREADY SHIPPED

1. **THE FAR LEGS DREW ON THE NEAR LEGS' OWN TWO COLUMNS**, in shadow. **Every
   four-legged animal in this game has had two dark sticks under it since the
   coyote was cooked on 8/28**, which is why they read as a table. A FAR LEG AT
   THE SAME PLACE AS A NEAR LEG IS NOT A FAR LEG: further away is higher on the
   screen and offset across, so the 45 law fixes the bug on its own.
2. **THE HEAD FLOATED IN THE LOOK FRAME.** The bird has had a neck since its
   first cut and the four-legged drawing never did. **And the first neck was
   guessed** along a slope worked out on paper, and all four of its pixels landed
   on paint that was already there, so the gap survived the fix. A BRIDGE HAS TO
   BE MEASURED FROM THE TWO BANKS, NOT ESTIMATED FROM THE MIDDLE.
3. The eye sat on the **outermost pixel** of the head and read as a yellow dot
   floating beside the animal.
4. The legs used the bird's thin dark scaly leg colour, on a furred dog.
5. The button, twice, above.

## *** AND THE PATCH TOOLS COULD NOT SEE THEIR OWN STALENESS ***

Twice in one hour. A one-shot patch returns **"already applied"** the moment it
finds its marker, and never looks at whether the block it inlined is **present
and old**. So three dogs were cooked into the sprite bank and the city carried
the five-animal copy; the module's distances were re-measured and the city
carried the old numbers. Both times the edit was right, the file was right, and
**the player would have seen nothing**, while the tool printed success.

Both city patch tools now copy the module and the bank forward **every run**. And
the pack tool's sections each check **their own marker**, because a tool that
gates everything on the first marker can never add anything later -- which is how
the button came to be missing in the first place.

## REUSE-FIRST, ACTUALLY REUSED

The coyote sprite already existed and is **not redrawn**. Only three dogs are
new, and they went in as **spec rows on the existing wildlife factory**, not a
second factory, because that factory already cooks a four-legged canid from a row
and a second generator for the same animal shape is the two-mechanisms mistake
ONE ID ONE WHOLE PERSON was written about. The three dogs differ in **size** as
well as coat, so STRUCTURE-NOT-COLOR is satisfied by geometry.

## GATE LESSONS

**THE DAMAGE CHECK ASKED THE WRONG QUESTION TWICE.** NO DAMAGE BEFORE THE DIAL is
a claim about a **number**, and both early cuts asked whether a **word** appeared.
Cut one skipped a line only when that line began with a comment mark, so the
module's own header block counted as code and the gate went red over its own
sentence saying there is no damage: A COMMENT IS A BLOCK, NOT A LINE. Cut two
stripped comments and then flagged the CANNOT string that **says** there is no
damage: **A WORD IS NOT A NUMBER.** It strips comments and strings and looks for
a field or an assignment, which is the only shape a damage dial can take.

**AND A TIER 1 CLAIM WAS REPOINTED, NOT LOOSENED.** wildlife_gate asked that the
sprite bank hold **exactly** the tier 1 roster, true while tier 1 was alone in it.
The bank is now shared on purpose. It now checks every tier 1 species is drawn
**and that nothing in the bank is claimed by no module**, which is a stronger
question. Mutation-tested by cooking in an id nobody claims.

## WHAT THIS TIER STILL CANNOT DO, PRINTED BY THE GATE

- nothing here does damage and nothing here has health: no dial yet
- a den is empty until he says what is in one
- nothing in the world is marked as FOOD yet, so a pack settles for an edge
- and it does not know what a roof or a storm drain is, only openness

## *** WHAT COMES AFTER, AND HE ALREADY APPROVED IT ***

Item one of the twelve street encounters he approved on 7/26 with a plain
"Approve all" is **`feral_dog_pack`**. Item two is **`coyote_shadow`**. Those are
the two animals this tier ships.

That list has **never fired for anybody on foot.** The director that owns it is
called from exactly one place -- `stepOnce`'s `MODE==='city'` branch, which is
overmap travel at ten minutes a cell. Every reference was checked: the module is
inlined in the city, `roadDirector` builds it, `roadInterrupt` calls `consider`,
and `roadInterrupt` is called once, on that branch. **The walked surface has
never called it.**

So the next row is to fire it while you walk, and it is **mandatory** that his
approved encounter and this tier's pack are **one system**, not two things that
both mean "dogs". That is ENGINE SYNC at the design level and the mistake ONE ID
ONE WHOLE PERSON was written about. When the director fires `feral_dog_pack` on
foot it should hand you **the pack that is actually standing there**, with its own
nerve, its own den and its own coats.

`ROAD_TABLE`'s keys are road classes (arterial, strip, freeway, beltway,
interchange, rail, wash), so a walked table needs district keys and is new
content. Under EVERYTHING IS A THUMB that is mine to decide and build, because it
is not a name he reserved and there is a defensible default.
