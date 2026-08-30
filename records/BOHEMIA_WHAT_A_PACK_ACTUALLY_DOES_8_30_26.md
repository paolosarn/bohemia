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
