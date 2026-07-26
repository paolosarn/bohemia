# LAB 03 — ONE WORLD: WHAT PUTTING THE MECHANICS IN A PLACE ACTUALLY CHANGED

Lane: LAB. Law: `laws/BOHEMIA_ADDENDUM_LAB_IS_WHOLE_MECHANICS_7_26_26.md`
Playable: `slices/lab/BOHEMIA_LAB_STARDEW_WORLD_7_26_26.html`
Numbers: `records/lab/BOHEMIA_LAB_STARDEW_MECHANICS_TEARDOWN_7_26_26.txt` and
`records/lab/BOHEMIA_LAB_STARDEW_TOWNWALK_FEEL_LEDGER_7_26_26.txt` (every value
in the page's SDV block is cited in one of those two, plus the one row below)
Gate: `gates/lab_gate.js` (walks this world and plays every loop inside it)

Paolo: "are you able to code these into the walkable version of Stardew Valley
made earlier pull up to the mini lake you can start fishing pull up on your
potential spouse. Do all of this pull up on your farm."

Yes. That is this page. One town, one clock, one purse. Walk to the dock and
fish, walk to the plot behind your house and farm it, walk up to her and court
her, walk to your bed and the whole world resolves at once.

## OURS, DECLARED (the only number here that is not in the two records)

```
REACH_TILES        1      ours (declared)     how close you must stand to talk
```

Stardew resolves this with a facing-tile check plus a bounding-box overlap that
only makes sense with its sprite sizes. One tile is the honest translation. The
fish table, the crop phase tables, the gift tastes and which fish bites at which
depth are also ours and are labelled CONTENT on the page itself.

---

## WHAT THE MERGE TAUGHT, WHICH IS THE ACTUAL FINDING

The three mechanics did not change at all. Not one number moved. What changed is
everything around them, and that is worth writing down because it is the part
that transfers to Bohemia.

### 1. THE WALK STOPPED BEING A FEATURE AND BECAME A SENTENCE STRUCTURE

On its own the walk was a feel study, which is what Paolo rejected. In a world
with three mechanics on it, the walk is the verb that joins them: *go there, do
that.* Its whole job is to make the doing feel earned and to put distance between
decisions. Nobody should ever judge a walk on its own again, including us.

### 2. ONE BUTTON, AND THE WORLD DECIDES WHAT IT MEANS

There is exactly one action button. What it says depends on what you are standing
in front of: CAST at water, USE TOOL at soil, TALK next to her, SLEEP at the bed,
HOLD TO REEL once a fish is on. The tile you are about to act on is outlined in
yellow, so the button is never a mystery.

That is the whole UI. A thumb, a stick, and one contextual verb. It is also the
answer to a problem we have: our phone UI keeps growing buttons because each
system asks for its own. **A world-addressed verb does not need a button per
mechanic; it needs a rule for what is in front of you.**

### 3. RANGE IS A DESIGN DECISION, NOT A DETAIL

The moment a mechanic lives in a place, it needs an answer to "how close is close
enough". Too tight and the player fights the grid; too loose and you talk to
someone through a wall. One tile of slack in a 3/4-tile-wide body reads as
generous without ever being wrong. This is the same lesson as the fishing
tolerance and the corner slip: **forgiveness is a number, and it is small.**

### 4. THE DAY IS THE ONLY THING THE MECHANICS SHARE

Fishing, farming and courtship never touch each other. They share exactly one
thing: the rollover. Sleep, and the crops advance or stall, the soil dries, her
friendship decays if you did not say hello, the wedding countdown ticks, and her
schedule resets. Three systems, one integration point, zero coupling.

**That is the architecture to copy.** Not "an event bus". One clock, one moment
where everything resolves, and no system allowed to know about another.

### 5. SLEEPING BECAME THE MOST INTERESTING BUTTON IN THE GAME

Because everything resolves at once, going to bed is a real decision with a real
payoff. It also lands exactly on Paolo's ruling that the world moves when you
spend time: **the biggest chunk of time you can spend is a night, and it is the
one that changes the most.**

### 6. THE DISTANCES ARE THE PACING

The plot is four tiles from your door and the dock is thirty tiles away across
the whole map. That is the difference between a chore you do every morning and a
trip you plan. Nothing in the code enforces that. **The map is the difficulty
curve, and it is authored in tiles.**

---

## FOR BOHEMIA (recommendations, unchanged in substance from LAB-02)

The pattern list in `BOHEMIA_LAB_STARDEW_MECHANICS_PATTERN_NOTE_7_26_26.md`
stands. This page adds four:

1. **ONE CONTEXTUAL VERB.** Our run already has a talk trigger and a door bump.
   Making them one button whose label comes from what you face would remove UI
   instead of adding it, and it is the shape a phone wants.
2. **ONE RESOLVE POINT.** We have SLEEP AND SAVE. Make it the single moment the
   world moves: who took territory, who noticed you, what the feed said
   overnight. One clock, no coupling.
3. **RANGE AS A DECLARED NUMBER.** Reach, talk distance and interaction slack
   should be one named constant, not three ad-hoc checks.
4. **DISTANCE IS PACING.** Where a thing sits on the map is a bigger tuning knob
   than any number inside it. That is a MAP LAW matter and therefore Paolo's.

## WHAT NOT TO PORT

- **The three mechanics themselves.** Still not asked for, still not a pitch.
  Fishing, crops and courtship stay in this reference.
- **A continuous free walk.** The walk in here is Stardew's because this is
  Stardew. Bohemia's is RULED: the world moves when you spend time on an action
  (`laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md`). The contextual
  verb, the reach constant and the single resolve point all work exactly as well
  on an action-based walk, which is why they are the recommendations and the walk
  is not.
- **Interiors bigger than their buildings.** Stardew does it everywhere; every
  interior here is exactly its exterior footprint because our law is locked, and
  the gate measures it.
- **The content tables.** Fish, crops, gift tastes and bite-by-depth are ours,
  crude, and labelled on the page.

## PAOLO'S UNRULED MUSING, RECORDED AND NOT ACTED ON

"in our world it's gonna most likely be like a Hydro farm pool or something I
don't know but yeah." Recorded verbatim, treated as thinking out loud, NOT as
canon. No hydro farm, pool, or growing system has been added to Bohemia, no
Bohemia content was invented from it, and nothing in this reference page is
dressed as ours. If he rules it, it becomes a CITY/WORLD backlog item with his
words as the source.

## HONEST LIMITS

- The mechanics are the same three, at the same depth. No new systems.
- The NPC keeps a real schedule but has no dialogue, no heart events and no
  reaction to being courted beyond the point economy.
- Fishing has no bait, tackle, treasure or quality roll; farming has no crop
  quality, giant crops or greenhouse; marriage has no children or divorce.
- Which fish bites at which depth is ours, declared, and deliberately crude.
- Sections above about their code are facts. The recommendations are my opinion
  and are for Paolo to accept or bin.
