# THE VALLEY HAS ANIMALS IN IT
## Backlog row ALIVE-1, the other half. PEOPLE lane, 8/28/26.
## Gate: gates/wildlife_gate.js (30 claims, 0 red, 3 mutations caught)
## Tab: RUN (walk out of the house; something is on the wall in eight steps)

---

## WHY THIS AND NOT MORE PEOPLE

Measured the same day, with the population slider at its **ceiling**, about
96,885 people: **twenty-three walks in thirty-two still meet nobody.** The
valley is roughly 151 square kilometres and a step is about a metre.

**AMBIENCE DOES NOT NEED A CENSUS.** A resident has to live somewhere in all of
that and be found. A raven is placed next to the player. The scale that beats
the slider does not apply here at all.

Measured on the glass: **something living is on screen in eight steps**, against
a median of 323 steps for a person.

And his own 8/25 bestiary research said it before any of this was built:

> "the reason the city feels dead is not that we lack enemies. It is that we
> lack ANIMALS. Ravens on a roofline, rats at a bin, a coyote crossing the wash
> three blocks away and not caring about you ... Tier 1 is mostly not an enemy
> system at all. It is set dressing that moves, and it is the cheapest fix on
> this list for the loudest complaint on his list."

---

## THE ROSTER, AND THE GATE CHECKS IT RATHER THAN TRUSTING IT

Five species, every one of them out of section 2 of the research, which is
Nevada and Clark County material:

| | wants | when | what it does when you come close |
|---|---|---|---|
| **RAVEN** | height: a roofline, a wall | day | flushes at 5 cells, alert at 9 |
| **GRACKLE** | open ground | day, not the afternoon heat | up all at once at 3 |
| **PIGEON** | a ledge and the pavement under it | day | hops off at 3 |
| **RAT** | against a wall, in cover | night only | gone into it at 2 |
| **COYOTE** | a long open run, a corridor | dawn and dusk | **nothing. keeps walking.** |

A claim reads every species id back against the research file, so a roster
cannot quietly drift off its sources into invention.

---

## AND THE REACTION IS THE FEATURE

Researched 8/28. Every write-up of why game animals work lands not on the animal
but on what it does about **you**: small animals "scuttling away whenever they
hear anything bigger than them", cranes taking flight as you approach. Ghost of
Tsushima's lead systems designer on the other half: "in just their ambient
presence" animals make a world feel alive.

**A BIRD THAT SITS THERE IS SCENERY. A BIRD THAT LEAVES WHEN YOU GET CLOSE IS
ALIVE, and it costs one distance check.**

**TWO DISTANCES, NOT ONE, and that is ethology rather than a design idea.** The
literature on urban corvids measures **alert distance** and **flight initiation
distance** separately: the bird notices you at one range and leaves at a shorter
one. So every species looks up before it goes, and the looking up is the half
that reads as alive.

**AND A FEEDING ANIMAL LETS YOU GET CLOSER.** Measured in hooded crows, which
"alerted later and escaped at shorter distance if they were feeding during
approach". Both distances are cut when an animal is on food, which hands us
per-situation variation for nothing. (The world does not mark anything as food
yet, so this is built and dormant. That is in the module's own CANNOT list.)

**AND EXACTLY ONE OF THEM DOES NOT CARE, ON PURPOSE.** The research wrote that
animal down already. The coyote's indifference only reads as indifference
because the ravens flush. A ROSTER WHERE EVERYTHING REACTS THE SAME WAY HAS NO
CHARACTER IN IT, and that is a gate claim, not a preference.

They also **stay gone** once flushed. An animal that popped back the moment you
stepped away would make the street a fruit machine instead of a place.

---

## THE ART TOOK THREE PASSES AND THEN ONE REVERSAL

**Cut one:** a tall oval with the head stacked on top, reasoned from "you are
above it, so the long axis runs away from you." Rendered and looked at: **three
bowling pins with a yellow eye.**

**Cut two:** laid the body down on a diagonal. Better, and still not a bird. The
body was so big it swallowed the head, the beak and the tail, so all three read
as a lumpy horizontal mass with an eye stuck on the front.

**Cut three:** shrink the body and let the head, the beak and the tail **leave
the silhouette.** At sixteen pixels a bird is not a rendering, it is four marks
in the right relationship, and everything that does not leave the silhouette is
invisible.

Not one of those three problems is visible in any number.

**AND THEN I JUDGED THEM ON THE WRONG SURFACE AND NEARLY KILLED THEM.** On a 7x
contact sheet the birds read as lizards, and I wrote down that they were bad and
that the system should ship with the art named as a failure. Then I put them in
the game and looked: **at 1:1, on a wall, at a 44 pixel tile, they read as
birds.** A contact sheet at seven times size is a magnifying glass held to
something designed to be seen at one. VERIFY ON THE REAL SURFACE is a law about
art, and it caught me judging a cook on a bench instead of in the game.

**AND THE 45 DEGREE ART LAW IS HELD IN THE SHAPE A CREATURE HAS.** This bank is
deliberately **not** registered in `art_45_gate`, whose proxies are an ellipse
stack at the base and a lit top face over darker wall rows, because everything
registered there is hardware standing on the ground. **A RAVEN HAS NO BASE.**
Running that ruler on a bird is a broken ruler pointed at the wrong subject. The
law is held instead as: you are above it, the top is sky-lit, three tones
minimum so it is not a silhouette, and not left-right symmetrical, because a
three-quarter view never is.

---

## TWO OF MY OWN RULERS BROKE, AND BOTH ARE THE SAME MISTAKE

**1. The lighting check split the CANVAS in half and called the rat lit from
underneath.** Measured row by row, the rat is a **low** animal sitting in rows 7
to 12 of a sixteen-row sprite, so the canvas midline put one pixel of it in
"upper" and everything else in "lower". Its own halves are **310 against 185**:
lit from above by a mile. The ruler was measuring where the animal sat in the
box. It splits at the animal's own midline now.

**2. The real-surface check read "far" at twelve cells**, which is off the top
of a 390x844 screen at 44 pixel tiles, so it could not tell "it has not noticed
me" from "it is not on the screen". A CLAIM THAT CANNOT TELL ITS TWO ANSWERS
APART IS NOT A CLAIM.

**And one in the game itself, found the same way:** the draw pass recorded every
sighting it drew, including the ones it drew into the three-tile cull margin so
they do not pop at the edge. A probe walking the street reported a flock it
could not see, seven cells past the right edge. It records only what landed
inside the canvas now. A CLAIM THAT COUNTS THE THING INSTEAD OF READING IT, in
the newest code in the file.

---

## MUTATIONS

| broken | red |
|---|---|
| the coyote made to care, so nothing ignores you | 1 |
| one distance instead of two, so it leaves without ever looking up | 1 |
| a species that is out at every hour of the day | 1 |

---

## WHAT THIS TIER CANNOT DO, PRINTED BY THE GATE

- it is not danger: nothing here can hurt you and nothing here can be hurt
- it is not loot: a carcass as a resource is tier 2 and does not exist yet
- and it does not know what a roof is, only what the ground reports

Tier 2 (dog packs and coyote packs, pack AI, a den with what the dogs dragged
home) and tier 3 (whoever holds the worst blocks, which is reserved and his) are
different rows and are not this.
