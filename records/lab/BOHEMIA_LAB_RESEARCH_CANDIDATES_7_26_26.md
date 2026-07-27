# BOHEMIA LAB — WHICH GAMES ARE ACTUALLY LIKE OURS, AND WHOSE CODE CAN WE GET

7/26/26 · LAB lane · research dossier
asked for by Paolo: "Do big brain online research for games that are just like
ours or like a combination of what we're going for that you can like pretend you
have the code by looking online making the model and then we can implement it in
our actual game."

## THE HARD RULE THIS DOSSIER OBEYS

Two rulings bound the search before it started:

1. **A REFERENCE IS NOT NEUTRAL** (`records/BOHEMIA_ZOMBOID_LOOT_KILL_7_26_26.txt`).
   Every candidate below gets a ONE-LINE FEEL STATEMENT checked against his
   standing rulings. If the feel conflicts, the emulation is dead before it is
   written — that is the whole lesson of the Zomboid kill.
2. **THE NUMBERS MUST BE SOURCED** (`gates/lab_gate.js` clause 5). A lab page
   fails the build if a constant loses its `file:line`. So "can we get the code"
   is not a nice-to-have, it decides whether a candidate can be an EMULATION at
   all.

That splits every candidate into one of two deliverables:

- **EMULATION** — the real source is readable, every number cites a real file and
  line, the gate can cross-check it. This is what the lab has shipped so far.
- **MODEL** — no source exists in the open, so the numbers come from
  documentation. Still useful, but it must be LABELED a model, cite the doc page
  per number, and the gate needs a new row type before one can ship. Nobody
  should ever be able to mistake a model for a measurement.

## BOHEMIA'S COMBINATION, AS A CHECKLIST

No single game is this. That is the point — we are looking for the games that own
one column each.

| # | System | Where it lives for us |
|---|--------|----------------------|
| A | Roguelite hardcore run, real stakes | the run lane |
| B | City-builder: you build and upgrade a place | world / city |
| C | The DISTRICT is the unit of the city | the district kit, tilespec dossiers |
| D | Time is SPENT by actions; the world resolves at a moment | `laws/…TIME_IS_SPENT_BY_ACTIONS…`, `engine/bohemia_resolve.js` |
| E | Scavenging is FAST; a find is a resource with a count | `laws/…LOOT_IS_RESOURCES_FAST…` |
| F | Crew assigned to jobs that take time | LIFE / SOCIAL (unbuilt) |
| G | Faction standing with a ceiling that only a commitment moves | `makeCeiling` in `bohemia_resolve.js` |
| H | Relationships that ration and wall | `makeRation` in `bohemia_resolve.js` |
| I | It happens in a WORLD YOU WALK, not in menus | his 7/26 ruling on the Stardew lab |
| J | Clout / a feed | the FEED phase, unbuilt |

## THE CANDIDATES

### 1. A DARK ROOM — Doublespeak Games, 2013 · **SOURCE: YES, VERIFIED**
Owns: **E**, **F**, and half of **D**.
Source checked by actually fetching it this turn:
`raw.githubusercontent.com/doublespeakgames/adarkroom/master/script/*.js` — the
whole game, in JavaScript, the language our engine already speaks. MIT.
**FEEL:** reading one short paragraph and taking everything in one tap; ten
resources exist in the entire game.
**CHECK against his rulings:** passes every clause of the loot law — fast (two
taps), resource-with-a-count (`{min,max,chance}`), the prose explains the amount,
minimal. No conflict.
Numbers that matter: `LEAVE_COOLDOWN 1` is the ENTIRE time cost of looting a
place; `path.js:4` says "everything not in this list weighs 1"; the medicine
cache is literally `min 2, max 5` — "you found like three"; ten worker rows are
the whole city economy, and a row runs whole or not at all.
**STATUS: BUILT, THEN KILLED THE SAME DAY.** Paolo, 7/27: "That was really bad so
bad so bad." `BOHEMIA_LAB_DARKROOM_SCAVENGE_7_26_26.html` is DEAD, deleted and
graveyarded and LOOT IS NOW A CLOSED LAB SUBJECT (second loot kill in two days).
Post-mortem: `records/BOHEMIA_DARKROOM_LOOT_KILL_7_27_26.txt`. Read it before
trusting anything in this row: the feel statement above passed his RULINGS and
still produced something he hated, because a paragraph and one button is not a
fast search, it is no search.

### 2. CATACLYSM: DARK DAYS AHEAD — open source, 20 years running · **SOURCE: YES, VERIFIED**
Owns: **D** outright, plus **F** and a form of **B**.
Source checked by fetching: `raw.githubusercontent.com/CleverRaven/Cataclysm-DDA/master/`
gives `src/*.cpp` and the whole `data/json` tree. C++ plus JSON data.
**FEEL:** every single action has a declared duration and you feel the clock
move; scavenging is the most granular in any game ever shipped.
**CHECK:** its **loot is an ANTI-reference** — more item bloat than Zomboid, so
clause 4 of the loot law kills that half outright. Its **TIME half passes and is
exactly what we are missing**: `mission_companion.cpp` sends a companion away for
a declared block — `1_hours`, `4_hours`, `10_hours`, `20_hours` — and pays out on
a rate times hours worked (`merch_amount = 3 * hours`). That is "you spend a
block, the world resolves and pays you", in shipped open source, with real
numbers. It is the shape of the ACTION COST table that is currently
[PENDING Paolo].
**RANKED #1 IF HE EVER ASKS FOR ANOTHER EMULATION — and it is NOT authorised.**
After two loot kills this lane builds nothing without him naming the subject
himself. Its loot side is out of bounds permanently.

### 3. REBUILD 3: GANGS OF DEADSVILLE — Northway Games, 2015 · **SOURCE: NO**
Owns: **B**, **C**, **F**, **G** — structurally the closest game to Bohemia found.
An isometric randomly-generated city where your base is a set of **city blocks**,
each block's building type deciding what it yields; survivors have five jobs
(scavenger, soldier, builder, engineer, leader) and get assigned out; rival
**factions** work against you inside your own city; playable turn-based.
Numbers are documented, not sourced: four resources (**food, materials, ammo,
fuel**), an average block cleared in **1-2 days**, **1-2 scavengers optimal**
(one lowers your equipment odds, three-plus is wasted).
**FEEL:** you assign people to blocks and days pass; the city is a map of blocks
you either hold or do not.
**CHECK:** passes — four resources is more minimal than State of Decay, and the
block IS our district.
**Unity, no source dump found.** Deliverable would be a MODEL, not an emulation.

### 4. STATE OF DECAY 2 — Undead Labs · **SOURCE: NO** (his own named reference)
Owns: **E** — and he named it himself, so it is the standard the loot law points at.
Documented numbers: the **rucksack is the unit** — a food rucksack weighs 8 lbs
and holds **3 units of food** (5 in a Green Zone); a fuel rucksack is **1-3 cans
and you do not know which until you open it**; you carry **one rucksack at a
time**, in its own slot; the **Wits** skill makes a survivor search **faster and
more quietly**.
**FEEL:** you go out for one bag, you know roughly what is in it, and getting it
home is the game.
**CHECK:** passes by definition. "A food rucksack holds 3 units" IS "you found
like three", and searching being fast-and-quiet as a SKILL answers his open
question (d) about noise.
UE4, no source. Deliverable would be a MODEL.

### 5. PERSONA 5 ROYAL — Atlus · **SOURCE: NO**
Owns: **D**, **H**, **G**.
Documented: **two time slots a day** (afternoon, evening) and **414 free slots**
in a whole playthrough; 23 confidants at **max rank 10**, up to **3 points per
interaction**, hidden **social-stat gates** that wall a rank until you have
levelled the stat, and hard **calendar deadlines**.
**FEEL:** the calendar is the enemy; every evening you choose who to disappoint.
**CHECK:** passes, and it independently confirms two mechanisms already ported
into `engine/bohemia_resolve.js` — the RATION (a hard count of chances per
period) and the CEILING (a wall that only a commitment moves). It is the single
best reference for the MOMENT TABLE that is [PENDING Paolo]: their answer is TWO
moments a day, and it is enough for a 100-hour game.

### 6. THIS WAR OF MINE — 11 bit studios · **SOURCE: PARTIAL** (official mod tool)
Owns: **D**, and the tone.
Documented: scavenging is a **night window, 9pm to 5am, ONE survivor**, and if
they are not out by 5am they come home late, wounded, or not at all; the pack is
**12 to 17 stacks depending on who you sent** and there is **no backpack
upgrade** — the devs deliberately cut inventory upgrades.
**FEEL:** one trip a night, and who you send is the decision.
**CHECK:** passes hard on **D** — the night IS a spent block, which is our ruled
model, and "who you send" is our crew question. A published mod tool exposes real
data, so a limited emulation may be possible; not verified this turn.

### 7. DARKEST DUNGEON — Red Hook · **SOURCE: NOT VERIFIED**
Owns: **A**, **B**, **H**.
Documented: a **hamlet you upgrade with heirlooms**, stress-relief buildings with
a limited number of **activity SLOTS** (the Abbey's Cloister upgrade takes it to
3), a roster you expand through the Stage Coach, and a week that is one run plus
one round of town.
**FEEL:** the town is a machine for repairing people you are about to break again.
**CHECK:** passes on **A** and **B**. Its data ships as plain JSON in the install
directory, which is why it has a huge modding scene — but no fetchable mirror was
confirmed this turn, so treat source as unproven.

### 8. FROSTPUNK — 11 bit studios · **SOURCE: NO**
Owns: a single column, **the minimal resource count**: a whole city builder runs
on **coal, wood, steel, raw food / rations, and steam cores**. Five, and one of
those is a rare part.
**FEEL:** one number (heat) is life, and every other resource feeds it.
**CHECK:** passes as evidence for clause 4 — a city builder does not need many
resource kinds. Useful as a citation in an argument, not worth a lab page.

### 9. PROJECT ZOMBOID — **DEAD. DO NOT PROPOSE AGAIN.**
Killed by ruling 7/26 for loot pace: "that was really bad and not fun."
`gates/bohemia_graveyard.txt` holds the tombstone. Listed here only so no future
session rediscovers it as a good idea.

## THE HOLE NOTHING FILLS: J, THE FEED

Searched, and there is no game with an in-game social feed whose source or even
whose numbers are obtainable. The only mechanism worth writing down is the shape
common to the few that exist: **posting SPENDS clout, and performance earns it
back**, so the feed is a resource you can overdraw. That is our RATION mechanism
pointed at a different noun — `makeRation` already does it.
So: **the FEED axis has no reference, and that is a finding, not a gap to fill
with invention.** When it gets built it gets built from his canon.

## THE RANKING, AND WHAT EACH ONE COSTS

| Rank | Target | Deliverable | Fills | Why now |
|------|--------|-------------|-------|---------|
| 1 | **Cataclysm: DDA** — faction camps + activity durations | EMULATION (source verified) | **D**, F | The only open-source answer to the one question his own ruling opened: what does an action COST, and what does a crew you sent away bring back |
| 2 | **Rebuild 3** — blocks, jobs, factions | MODEL (needs a new gate row type) | B, C, F, G | Structurally the closest game to Bohemia that exists |
| 3 | **State of Decay 2** — the rucksack | MODEL | E | His own named reference, and it answers the noise question |
| 4 | **This War of Mine** — the night run | EMULATION if the mod tool holds up | D | One spent block, one person sent |
| 5 | **Persona 5 Royal** — two slots a day | MODEL, or just a citation | D, H, G | Confirms two mechanisms we already ported; cheapest of all to use |

Below the line: Darkest Dungeon (source unproven), Frostpunk (a citation, not a
page).

## WHAT I AM NOT DOING WITHOUT HIS WORD

- Not building #2 through #5. Two of them need a **new gate row type for MODELS**
  before they are legal to ship, and inventing that on my own is exactly the
  "found a legal way to ship anyway" move that `STOP PRODUCING` forbids.
- Not touching the loot CONTENT questions. Resource kinds, yield ranges, search
  cost in time, and re-search / noise are clauses (a) through (d) of the loot law
  and they are **[PENDING Paolo]**.
- Not proposing Zomboid again in any form.
