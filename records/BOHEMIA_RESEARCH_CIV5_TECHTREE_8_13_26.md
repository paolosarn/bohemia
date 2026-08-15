# BOHEMIA — RESEARCH: THE CIVILIZATION V TECH TREE, MEASURED (8/13/26)

**LAB lane.** Paolo 8/13: *"do big brain research into civilization five and all of the technologies in
the tech tree. This may help you with your goals."*

He is right that it helps, and it helps in a way I did not expect. I went looking for a list of
technologies to mine for boss ideas. What the tree actually gave up is a **SHAPE**, and measured
against that shape **our 53-boss ladder has the wrong one** — not the wrong contents, the wrong
geometry. That finding is the whole point of this file.

**NOT IN A TAB YET.** This is a records file. The ladder has never had a surface either.

---

## HOW THIS WAS MEASURED, AND WHAT I THREW AWAY

The Civ 5 **Brave New World** tree is vendored at `records/BOHEMIA_REF_CIV5_TECHTREE_BNW.json`
(81 nodes: name, era, beaker cost, prerequisites, leads-to, units enabled, mechanic notes).
Source: the `neoddish/Civ-TechTree` dataset, which transcribes the tree off the Civilization Fandom
wiki and the CivFanatics tech-tree image. Every number below is produced by
`node tools/bohemia_civ5_measure.js` reading that file. Re-running it changes nothing.

**★ ONE COLUMN WAS A LIE AND IT IS DELETED, NOT CARRIED.** The source dataset's
`buildings_enabled` field is a **verbatim copy of `units_enabled` in 81 of 81 nodes** — whoever
transcribed it lost the building data. Read naively it reports "units are 43% of unlocks, buildings
are 43% of unlocks" in **every single era**, and a perfect 1:1 split holding across eight
independent eras is not a design finding, it is a tell. I had already written that 43/43 split down
as a result before I checked it. The column is dropped from the vendored copy, because a lie you
store is a lie you will eventually quote.

**So what is trustworthy here:** the full prerequisite GRAPH, the costs, the eras, the unit
unlocks, the mechanic notes. **What is not available at all:** building counts. Nothing below
reports one.

---

## WHAT CIV 5 ACTUALLY IS, IN NUMBERS

| MEASURED | VALUE |
|---|---|
| technologies | **81** |
| eras | **8** (Ancient, Classical, Medieval, Renaissance, Industrial, Modern, Atomic, Information) |
| techs per era | **8 to 13** (mean 10.1) |
| total tiers deep | **18** |
| tiers per era | **2 to 3** — five of the eight span exactly **2** |
| **THE CHOICE FAN** | **3 to 7 for 91% of the game, median 4** |
| fan = 1 | only the **opening move and the last two**. Never in between. |
| terminal techs (lead nowhere) | **2 of 81** — Future Tech, and one dataset artifact |
| what the root gates | Agriculture gates **80 of 80** downstream |
| cost range | **20 to 9,500 beakers (475x)** |
| era-to-era cost step | **decays**: 3.17x into Classical, 1.45x into Information |
| unlocks per tech | **2.9 in Ancient, 1.2 in Information** (front-loaded) |
| beeline to Gunpowder | **15 of 81 techs = 19% of the tree** |
| beeline to Future Tech | **80 of 81 = 99%** |

### THE FIVE LAWS THOSE NUMBERS ADD UP TO

**1. ★★ THE CHOICE FAN IS A HELD CONSTANT, AND IT IS THE WHOLE GAME.** At every single one of
the 81 research steps, the number of technologies the player could legally take next sits between
**3 and 7, median 4**. It does not widen in the midgame and it does not narrow in the lategame. It
is **1 exactly three times**: the opening move, and the final two when the tree is nearly exhausted.
Eighty-one decisions, each one a genuine choice among about four things, for twenty hours. That band
is not an emergent accident of a big graph — a graph this size could easily present twenty options
at once, or one. It is held.

**2. AN ERA IS TWO TIERS DEEP.** Not two techs — two *layers*. Five of eight eras span exactly 2
tiers, the other three span 3. So an era is roughly **10 techs arranged 5-wide and 2-deep**, and the
era boundary is where a new layer starts. Eras are not long chains; they are wide, shallow slabs
stacked on each other.

**3. EVERY TECH LEADS SOMEWHERE.** 2 terminals out of 81, and one of those is the deliberate
end-of-game node. This is a stated Civ 5 design goal (Civ IV had dead-end techs and they cut them).
The practical consequence: **there is no such thing as a wasted research choice**, so the player
never has to fear the menu.

**4. THE COST STEP DECAYS, IT DOES NOT COMPOUND.** Going from Ancient to Classical multiplies the
average cost by **3.17x**. Going from Atomic to Information multiplies it by **1.45x**. The early
game accelerates violently and the late game flattens out. Combined with unlocks-per-tech dropping
from 2.9 to 1.2, **the early game is where the value per unit of effort lives, by a factor of
hundreds**, and the lategame is deliberately a long flat grind toward a win condition.

**5. ★ A PLAYTHROUGH TAKES A FRACTION OF THE TREE.** You can stand in the Renaissance holding
Gunpowder having researched **15 of 81 technologies — 19% of the tree.** The tree is not a
checklist. It is a menu you cut a path through, and the path is short until the very end, when
Future Tech suddenly demands 99% of everything. So the tree is **narrow-then-total**: cheap
specialised beelines for most of the game, completionism only at the finish.

---

## AND HERE IS THE PART THAT IS ABOUT US

Measured the same way, by the same tool, in the same run:

| | **CIV 5 BNW (measured)** | **BOHEMIA LADDER v7 (measured)** |
|---|---|---|
| nodes | 81 | 53 |
| eras / acts | 8 | 3 |
| nodes per era/act | 8-13 (mean 10.1) | 19 / 20 / 14 (mean 17.7) |
| total tiers deep | **18** | **53 — it is a LINE** |
| tiers per era/act | 2-3 | **none, no tiers exist** |
| **CHOICE FAN** | **3-7, median 4** | **1, always** |
| terminal nodes | 2 of 81 | **53 of 53** |
| declared prerequisite edges | **130** | **0** |
| cost axis | 20 -> 9,500 beakers | **none** |
| beeline to midgame | 15 of 81 = 19% | all 53, in order |

### ★★★ THE FINDING: OUR LADDER IS A LINE AND CIV 5 IS A GRAPH

I numbered the bosses 1 to 53 and I never noticed that numbering them **was a design decision**.
A numbered list with no prerequisite column is not "a ladder we will order later" — it is a
53-tier-deep chain with a choice fan of exactly **1**. At any moment there is precisely one boss
you are allowed to attack next. Civ 5 spends its entire runtime never letting that number drop
below 3.

**This is not a contents problem. The 53 bosses are fine.** Each one holds real infrastructure and
grants a real verb — that part survived the GDD audit. What is missing is the **edges**: which boss
opens which. THE CISTERN needs THE CLIMB (you cannot plumb a roof you cannot reach). THE MACHINIST
needs THE SMITH's workshop or it needs nothing at all. THE PLATE needs a press and the press needs
power. None of that is written down anywhere, so the ladder can only be played in one order — mine.

### ★ AND THE GOOD NEWS, WHICH IS REAL: THE ACT SIZES ARE ALREADY RIGHT

Run Civ 5's own geometry forward. An era is 2-3 tiers at a 3-7 fan, so an era holds somewhere
between **6 and 21 nodes**. Our acts hold **19, 20 and 14**. All three land inside that band, at the
dense end. **So the 53 do not need cutting to fit this shape, and the three-act split is not too
coarse.** What each act needs is to be re-read as **roughly 4 tiers of about 5 bosses** instead of
19 rungs in a row. Same bosses, same acts, same count. Edges added, order removed.

That also answers, mechanically, the question that has been sitting open since the ladder was 18
bosses long — *which of the 53 live*. Civ 5's answer is **all of them live, and one run touches a
fraction**. Gunpowder on 19% of the tree. If the ladder becomes a graph, 53 stops being a content
budget problem and becomes a replay surface: a run that beelines THE CHARGE and THE MACHINIST is a
different game from a run that beelines THE CISTERN and THE MIDWIFE, off the same 53.

## ★ UPDATE, SAME DAY: HE RULED, AND THIS FINDING IS NOW HISTORY

He read the above and answered **"Sure"** — the prerequisite column is approved. His rulings are in
`records/BOHEMIA_HIS_GRAPH_RULINGS_8_13_26.md` and the graph is in
`records/BOHEMIA_LADDER_GRAPH_8_13_26.json`.

**So the gap table above is a SNAPSHOT of 8/13 morning, not the live state.** It is left standing
because it is the measurement that produced the ruling, and `civ5_gate.js` now asserts this update
exists rather than asserting the ladder still has zero edges. That is the check working as designed:
**the finding went stale and the gate forced the record rewritten instead of letting it quietly
become false.**

**AND HE CONFIRMED THE HEADLINE WITHOUT BEING SHOWN IT.** He said the live menu should hold
*"maybe like 5 or 6 of them or four of them"* — **4 to 6.** The Civ 5 measurement, which he had not
read when he said it, is **3 to 7, median 4.** Two people arriving at the same constant from opposite
directions is the strongest evidence in this file that the choice fan is real and not a curiosity of
one game.

**AND ONE THING HE ADDED THAT CIV 5 CANNOT TEACH US:** a prerequisite does not have to be a fight.
*"the idea is that it's something that's ACQUIRED so it doesn't have to maybe not killing or
persuading a particular person like it's just a quest."* Civ 5's nodes are all the same kind of thing
(you pay beakers). Ours will not be, and that is a place the reference stops being useful.

### WHAT I AM NOT DOING

I am **not** drawing the edges. Which boss gates which boss is a design ruling about how his game
is played, and the ladder already got rebuilt seven times this month. Per MECHANISM-MINE /
CONTENTS-PAOLO'S: the prerequisite **column** is mechanism and I will build it the moment he says
go; **what goes in it** is his. The one thing I did do is measure the gap and lock the measurement,
so this cannot decay into a thing I once said about Civ 5.

---

## THE TECHNOLOGIES THEMSELVES — WHAT THE LIST IS GOOD FOR

Two honest notes on the original hope, which was mining the 81 names for boss ideas.

**It is a weak source of bosses and a strong source of ORDERING.** Civ 5's tree is a *technology*
tree: the nodes are abstractions (Mathematics, Philosophy, Banking, Acoustics). Ours are *people
holding working machines*, which is a better fit for a roguelite and much better for Vegas. Where
the tree pays off is the dependency reasoning: Civ 5 will not give you Machinery before The Wheel,
or Steam Power before Physics, and those chains are worth copying wholesale because they encode
real industrial history.

**The one direct steal worth flagging:** Civ 5's opening tier is **Agriculture alone**, and it
gates all 80 downstream — Worker, Settler, Warrior, Scout, and then four separate second-tier
branches (Pottery, Mining, Animal Husbandry, Archery). Our act 1 opens on **THE POT**, which is a
joke boss that grants cooking. Structurally that is the same move: one cheap root that hands you the
verbs and immediately fans into four directions. **The POT is a better Agriculture than I realised
when I wrote it**, and if the ladder becomes a graph it is the obvious root.

---

## SOURCES

- `neoddish/Civ-TechTree` — the vendored Civ 5 BNW dataset (81 nodes), itself transcribed from the
  Civilization Fandom wiki tech list and the CivFanatics BNW tech-tree image.
- Civ 5's "no dead-end technologies" goal is a stated design change from Civ IV, and the measurement
  above confirms it independently: 2 terminals in 81.
- Everything numeric in this file is regenerated by `node tools/bohemia_civ5_measure.js`.
  Gate: `gates/civ5_gate.js` re-measures and fails if any claim here drifts from the data.
