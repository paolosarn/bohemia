# I BUILT THE BOTTOM OF HIS DOCUMENT (8/20/26, COMBAT lane)

> **Paolo, 8/20:** *"bro i gave you a whole document to play like rgue fable 4
> this is not even close. how do i shoot a car?"*

**Third rejection of this lane's direction in three days.** STOP PRODUCING
(7/26) says a second rejection ends the feature for the session, that a green
gate is never an argument, and that *"a turn that says I stopped, here is the one
thing blocking everything is a GOOD turn."* So nothing was built this turn except
the correction of two false claims. This file is the finding.

---

## 1. THE SMALL ANSWER: YOU CANNOT SHOOT A CAR

I told him to shoot a car. **There is no way to shoot a car.** Measured, not
guessed: `carHeat` has exactly two callers in the shipped blob.

| how a car actually heats | who does it |
|---|---|
| a round of **theirs** that the car **you are hiding behind** ate | passive, you are being shot at |
| **your own grenade** landing within `CAR_BLAST` | 2 per fight |

Your own rounds do not touch a car. There is no verb. So V170's whole "no new
button, he learns it by doing what he was going to do anyway" argument was
resting on an action the build has never had, and **the gate I wrote asserted
that same false sentence** — a gate marking its own homework in the most literal
way available. Corrected in `combat_lab_gate.js`, `fight_moves_you_gate.js`, the
V170 record and the handoff, the same day.

**The rule this breaks is one I already had:** VERIFY ON THE REAL SURFACE. I
verified the smoke on the real surface. I never verified the sentence telling him
how to reach it.

---

## 2. THE REAL ANSWER: I BUILT THE BOTTOM OF HIS DOCUMENT

The teardown spec ranks its own 68 rows with stars. Counted this turn:

| priority | BUILT | SPECED | differs-on-purpose |
|---|---|---|---|
| ★★★ | **1** | 3 | 0 |
| ★★ | **1** | 5 | 0 |
| ★ | 2 | 4 | 2 |
| unstarred | **18** | 27 | 5 |

**Two of the ten highest-priority rows are built. Eighteen of the fifty lowest
are.** Six versions in three days — V164 movement asymmetry, V165 vision, V167
encounter curve, V168 the spotter, V169 the open book, V170 the smoke — and all
but one of them is an unstarred or one-star row. I worked the list from the
bottom, in the order the "machines" happened to be routed to this lane, and
called it forward motion because every one of them gated green.

**A green gate on a low-priority row is not progress toward the thing he asked
for. It is motion.**

---

## 3. AND THE DOCUMENT ALREADY SAID WHY IT FEELS FLAT

**RF4-25 (★★★), our own diff column, written before any of this shipped:**

> **"ABSENT."** 5 real types exist and **"none of them read each other. This is
> the actual answer to 'why does the fight feel flat'."**

*(Quoted in its own case. The first draft of this file put that sentence in
capitals and presented it as verbatim; the gate below searched for the capitals,
went red, and caught the misquote. A verbatim quote that is not verbatim is the
same defect as a number typed beside a constant instead of read from it.)*

The row it is drawn from:

> *"Enemies synergize when in groups, with each new enemy treated differently
> depending on what group it spawns with, creating exponential growth in
> complexity... the same enemy added to 5 very different groups should produce 5
> very different combat encounters."*

**Verified this turn rather than repeated.** Every enemy brain in the blob —
`pressAI`, `coverSeekAI`, `enterAim`, `grenadeTurn`, `meleeTurnRun` — does
iterate the roster, and **every single one of those loops is occupancy**, marked
in the source `/* one body per spot */`: do not stand where another body is
standing. Not one enemy's decision depends on what another enemy **is** or is
**doing**. Five archetypes, five solo actors sharing a room.

That is why V167 could put three to six bodies on the board and the fight got
*easier* per body. More actors, zero interaction. Adding a sixth man to five men
who ignore each other adds one man, not a group.

**The other two ★★★ rows are also unbuilt:**

- **RF4-36, which the document itself calls "the most important line in any of
  this"**: the deliberate tension between traditional-roguelike tactics and
  boomer-shooter mayhem. Our diff says the shooter half is already real and *"the
  decision layer is what is missing."*
- **RF4-14, "the single most important line in RF4's design notes"**: the
  anti-idle-turn rule. *"There is almost never a turn in which the player is not
  either using an ability or moving into position to use an ability in the next
  turn or two."* Our diff: **"NOT MEASURED, and it is the right question to ask
  of our fight."** Still not measured, three weeks later. It is a property, not a
  feature, and it is the one number that would have told me the fight was flat
  before he had to.

---

## 4. WHAT THE NEXT COMBAT SESSION DOES

**Not another machine.** In this order:

1. **MEASURE THE IDLE TURN (RF4-14).** Play the shipped fight and count the
   turns where the player has nothing worth doing but WAIT. That number is the
   flatness, stated. It costs one harness and no design, and it is the honest
   baseline every later claim gets compared against.
2. **BUILD RF4-25, ENEMIES READING EACH OTHER.** The document names it as the
   answer to the exact complaint. It is not a new archetype and not a new button:
   it is the existing five types looking at each other before they decide. The
   sniper holds while the blades close; the blades push harder while the sniper
   has a line; the bot walks into the open only when somebody is suppressing.
   Same five enemies, five different fights.
3. **ONLY THEN** the shoot-the-car verb, and only because a burning car with no
   way to light it is a feature that does not exist.

**RF4-54 (terrain kills) was next on the old plan and it is a ★★ row, but it
comes after RF4-25**, because terrain that five solo actors ignore is one more
system nobody reads.

---

## 5. THE PROCESS FINDING, WHICH IS THE REUSABLE PART

**A ranked document was sitting in the repo with stars on it and I never counted
the stars.** I let the "machine" numbering — an internal routing decision from
the RF4 lift — set my order, and the machines are not ranked by how much they
change the feel. Six ships, all green, all measured, all real, and the top of his
list untouched.

**THE TEST, before any lane pops its next item:** *is this one of the top rows of
the document the work is drawn from, and if not, why am I doing it first?*
"It was routed to my lane" is not an answer. "It gated green" is not an answer.
