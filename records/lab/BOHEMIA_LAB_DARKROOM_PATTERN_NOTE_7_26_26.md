# LAB 04 PATTERN NOTE — WHAT A DARK ROOM KNOWS ABOUT LOOT THAT ZOMBOID DOES NOT

7/26/26 · LAB lane
page: `slices/lab/BOHEMIA_LAB_DARKROOM_SCAVENGE_7_26_26.html`
numbers: `records/lab/BOHEMIA_LAB_DARKROOM_TEARDOWN_7_26_26.txt`
law it serves: `laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md`

Paolo RULED the loot system before this page existed: a found thing is a resource
with a count, looting is fast, the description explains the amount, minimalistic
is the bar, and State of Decay is the reference. This page is not asking him to
re-rule any of that. It is the first emulation whose FEEL STATEMENT passes those
rulings before a line was written, which is the check the Zomboid kill added.

## FEEL STATEMENT, CHECKED FIRST
A Dark Room's scavenging feels like **reading one short paragraph and taking
everything in one tap**. Ten resources exist in the entire game. Nothing is ever
refused. Checked against his rulings: fast (two taps), resource-with-a-count
(literally `{min,max,chance}`), the prose explains the amount, minimal (10 kinds
vs Zomboid's thousands). No conflict. That is why it got built.

## THE FIVE MECHANISMS WORTH TAKING

### 1. A PLACE IS A SCENE, AND A SCENE IS PROSE + ONE TABLE
`SETPIECES[place].scenes[name] = { text, loot, buttons }`. Three fields. The
whole of looting in this game is a data model small enough to hold in your head,
which is exactly why it is fast: there is nothing to browse. **For us:** a
searchable thing in a district is one scene keyed on the container KIND, not an
inventory to page through. Our tilespec dossiers already name every tile's kind,
so the join already exists.

### 2. THE WEIGHTED BRANCH IS THE VARIETY, NOT THE ITEM LIST
`{0.25:'medicine', 0.5:'supplies', 1:'occupied'}` — same house, three different
paragraphs, three different yields. Replayability comes from WHICH SCENE, not
from which of nine hundred cans of beans spawned. **For us:** a motel room can be
picked-over, still-stocked, or occupied. That is three lines of data and it is
more interesting than three hundred item entries.

### 3. THE COUNT IS THE MECHANISM AND THE PROSE IS THE TEXTURE
"the house has been ransacked, but there is a cache of medicine under the
floorboards" → `medicine 2..5`. The words explain the number. This is clause 3 of
his loot law arriving independently in a shipped game, which is the strongest
evidence a design idea can have.

### 4. EVERYTHING WEIGHS 1
`path.js:4` — "Everything not in this list weighs 1". Only nine objects in the
game bother to have a weight, and they are all weapons. **For us:** a capacity
system does not need a weight per item. It needs a count, plus a short list of
exceptions that are heavy on purpose. Zomboid's per-item weight table is the
thing that made its looting slow, and it is optional.

### 5. TAKE-ALL NEVER REFUSES YOU
The button renames itself to "take all you can" and gives you what fits
(`Math.min(Math.floor(free/weight), numLeft)`). No error, no red text, no
inventory tetris. **For us:** the full-bag state must never be a wall you tap
into. It is just a smaller number.

### AND THE ONE FROM THE VILLAGE SIDE: A JOB EITHER RUNS WHOLE OR NOT AT ALL
`state_manager.js:365-380` checks every input of a worker row before applying
any of it; if one input is short, that row produces nothing this tick. **For us:**
a crew assignment is atomic. No half-built, no partial consumption, no debt.
That is one `if` and it kills a whole class of bug.

## HOW THE FOUR MECHANICS SIT TOGETHER, AND WHY THAT MATTERS
- **scavenging** fills the bag,
- **hauling** decides how much of it comes home,
- **supplies** is what the trip costs you (a step drinks: `MOVES_PER_WATER 1`),
- **jobs** turns what came home into something else, on a shared tick.

None of the four is interesting alone. Together they are a whole loop in about
900 lines, which is the real lesson: the loop got small enough to be fast.

## WHAT NOT TO PORT
- **Their resource names and their probabilities.** Ours are [PENDING Paolo] —
  clauses (a) and (b) of the loot law. Ten kinds is THEIR answer; he said fewer
  than State of Decay's six, and the list is his.
- **The text-adventure surface.** The lesson is the two-tap scavenge, not a
  paragraph on a black screen. Our version happens in a district you walk.
- **Combat, and FIGHT_CHANCE.** NO DAMAGE BEFORE THE DIAL. Recorded, unused.
- **The supply death spiral.** Water running out costing health per step is
  hardcore in the wrong register for us; the trip cost should be TIME, in the
  units of `laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md`.
- **The 61x61 procedural overworld.** We have a canon map and MAP LAW.
- **A "cargo drone".** The bag ladder shape is portable; that content is not.

## HONEST LIMITS
- Combat is skipped, so the `occupied` branch is a scare and not a risk. The
  branch weights are still real, but the RISK half of their scavenge is missing
  and this page cannot tell us how risk changes the feel of speed.
- This page is a REFERENCE at 30px tiles and flat top-down placeholder art. It
  says nothing about how a fast scavenge looks in the real 45-degree world.
- Their loot rolls `Math.floor(rnd()*(max-min))+min`, which can never return
  `max`. That is a real off-by-one in the shipped game; the page reproduces it
  faithfully rather than fixing it, because the job is to measure them.
- Four mechanics is more surface than LAB-03 had, and the trade is depth: their
  crafting tree, trap drops and perk system are all untouched.

## THE ONE THING THIS PAGE IS ASKING
Nothing about loot's SHAPE — that is ruled. The open question is [PENDING Paolo]
and it is content: **how many resource kinds, and what are they.** Everything
mechanical above can be built the hour that list exists.
