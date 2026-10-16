# BOHEMIA — NOBODY HAS EVER BELONGED TO ANYTHING
### 8.11.26 — FACTIONS lane. Went looking for the demo's most visible gap and found that faction membership has been dead in the real game since the day it shipped. Its gate was green for nine days because it tested a shape the caller never produces.

---

## HOW IT WAS FOUND

"We have a demo to ship." So instead of building another system I went to the
integration ledger and asked what a player actually sees. Two things in my lane were
zero:

```
does the run react to standing?          0 references
are his faction COLOURS worn in the run?  0 references
```

He picked **13 faction colours and 14 marks on 8/2**. `FACTION_LOOK` and
`FACTION_MOTIF` have sat in `bohemia_dress.js` since, and the run has never loaded the
module. So I went to wire it — and it rendered nothing at all.

## THE BUG

```js
function factionOf(agent, cell, bases){
  if(!agent||!bases||!bases.length||!cell) return null;
  ...
  return near[pickRoll%near.length].name||null;
}
```

It takes an **array** of `{name, x, y}`.

The only caller that exists is `bohemia_loop.js`'s boot:

```js
ctx.factionBases[fid] = { x: d.pos[0], y: d.pos[1] };
```

An **object keyed by faction id**, values `{x, y}`, **no `name`, no `.length`.**

So the first line returned `null` for every person in the valley, every time. Measured
against real boot data before the fix: **0 of 60 affiliated standing directly on a
faction base.** After: **13 of 60**, returning real ids like `Anarchists`.

**Nobody has ever belonged to anything in a real run.**

## WHY THE GATE DID NOT CATCH IT — the part worth keeping

`gates/faction_membership_gate.js` is 50 claims and it was green the whole time,
including a claim that measures the split across 4,033 agents at 29.9% and calls it
even. It passed because of this:

```js
const BASES = [
  { name: 'REMNANTS', x: 20, y: 20 },
  ...
];
```

**A fixture is not the caller.** The gate proved the mechanism against a shape nothing
in the game produces, and every number it printed was true about the fixture and
irrelevant to the world. That is a new variant of the disease this lane has now hit
five times: not *authored and unread*, not *readable but discouraged*, but
**gated against the wrong shape** — which is worse, because the green is louder.

## THE FIX

`normalizeBases()` accepts both forms — the array, and the loop's object keyed by
faction id (the key becomes the name, sorted for determinism so the pick stays stable).
Normalised in `factionOf` rather than in the loop **on purpose**: the loop's object form
is what other code already reads, and changing that contract to suit this function would
move the breakage rather than fix it.

And the gate now boots the **real loop** and hands `factionOf` the **real
`ctx.factionBases`**:

```
real ctx.factionBases: 14 bases, 18/80 of a crowd standing on one affiliated
FACTION MEMBERSHIP GATE: 55 passed, 0 failed
```

Plus two guards so the fix cannot rot: an empty bases object must still yield nobody
(a normaliser that invents ground is worse than the bug), and the array form must still
work — this ADDED a shape, it did not swap one.

## WHAT IS NOW ON SCREEN

The run loads `bohemia_dress.js` and the person you walk up to tells you who they run
with, in **his** colour, with **his** mark:

```
RUNS WITH THE TRADES · PLATE
```

Derived, never assigned — `factionOf` keyed to the seat so it survives a save, most
people belong to nobody, and both the colour and the mark are read out of his tables.
Somebody who runs with nobody says **nothing**: most of the valley is unaffiliated and a
label on all of them is noise, not information.

The bodies on the street are real baked characters; **re-costuming them is the clothes
lane's pipeline and I did not cut into it.** This is NPC identity, which is this lane's.

## *** THE DEMO BLOCK IS IN A FACTION DEAD ZONE — [PENDING, not mine to tune] ***

Measured after the fix:

```
demo block                [37,22]
nearest base   Caravans   20 cells away
REACH_CELLS               12
within reach              0 of 14 bases
affiliated on the block   0 of 11 people
```

The mechanism is correct and the block is genuinely outside every faction's pull. So
**the allegiance line will show nothing in the demo as it stands**, and that is a real
fact about where the block sits, not a bug.

Two ways to change it and **both are somebody else's call**, which is why I did neither:

1. **Move the demo block nearer a base.** MAP LAW: Claude never designs map layouts.
2. **Raise `REACH_CELLS` (12) or `AFFILIATED_RATE` (0.30).** Both are marked
   `[PENDING Paolo]` in the source. Tuning them so a demo looks busier is fitting the
   world to the screenshot, and that is exactly the move this project keeps punishing.

---
*BOHEMIA — Nobody Has Ever Belonged To Anything — 8.11.26*
*A fixture is not the caller. Fifty green claims about a shape the game never passes are fifty claims about nothing.*
