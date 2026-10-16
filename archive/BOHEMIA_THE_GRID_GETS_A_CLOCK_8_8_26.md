# THE GRID GETS A CLOCK
**8/8/26. WORLD lane. GDD v3 brownouts and blackouts, mechanism only, every number
still his. Machine: `gates/brownout_gate.js` 20/0.**

---

## WHAT WAS MISSING

`bohemia_powergrid.js` has answered `at(x,y)` with **the same thing forever**: 12% of
circuits live, every live one owned. A constant.

**A valley whose lit 12% never flickers is a valley where LIGHT = TERRITORY never has a bad
night**, and CLUSTERED POWER is scenery instead of a system. Brownouts and blackouts were
designed and **LOCKED in GDD v3** and sat in nobody's queue until the 8/4 mechanics routing
found them.

`engine/bohemia_brownout.js` adds a **time axis to the grid and nothing else.** It does not
decide who owns what, does not move territory, does not touch the light pass. It answers one
new question: **is this circuit up right now.**

## EVERY NUMBER IN IT IS HIS, AND THE MODULE SAYS SO OUT LOUD

How often the grid fails, how long an outage holds, how wide it spreads — that is the pace
of the apocalypse, and it is exactly what MECHANISM-MINE reserves. So the five dials are
**null**, and with none of them set the module **runs, changes nothing, and reports
`NO_RULING` by name**, naming which dials are missing. Same contract `bohemia_world_resolve.js`
uses.

**No defaults.** A default here would be me designing the thing he reserved, and a zero that
looks like a decision is what gets built on by accident.

## THE ONE DISTINCTION THE GDD DREW, KEPT

**A brownout is not a small blackout.** A browned-out circuit is still **energised** and
still **owned** — the lights are just too weak to hold ground. So it reports `live:true` with
`dim:true`, and LIGHT = TERRITORY gets to decide what a dim circuit is worth. Collapsing it
to "off" would have thrown the whole distinction away, and it would have been the easy thing
to do.

## THE INVARIANT THAT MATTERS MOST

**An outage can only ever take light away.** It can never light a cell that was dark, the lit
set can never grow, and a dead circuit stays dead. Walked over the real 96×96 valley across
**144 turns**: zero violations. If that ever broke, territory could be *gained* by the grid
failing, which is nonsense the rest of the system would quietly absorb.

Deterministic throughout: an outage is a pure function of `(seed, day, turn)`. The same
valley fails the same way for everybody, and a save reloaded mid-blackout is still
mid-blackout.

## THREE MACHINES CAUGHT ME IN ONE RUN, AND ALL THREE WERE RIGHT

- **My own gate flagged my own comment.** It searched the source for `Math.random` and
  matched the line that says *"no Date, no Math.random"*. **A checker that cannot tell a
  mention from a use is the broken one** (craft law, 8/1) — so the gate strips comments and
  looks for a *call* now. Fix the ruler, never the target.
- **`map_bound_gate` caught me hard-coding 96** to scan the valley. The world knows its own
  size. The house bug in miniature, in a gate I had just written to catch other things.
- **`canon_rot_gate` caught two dead citations.** The tilespec tool ends every dossier with
  *"Gate: `gates/<name>_gate.js`"* — an assumption that was true while every district was
  hand-built, and **stopped being true the moment a factory registered twelve at once.**
  It cites only gates that exist now, and names the ones that genuinely cover the district.

That last one is the interesting one: the twelve-landmark factory was correct, and it broke
a *citation convention* two files away that nobody would have thought to check. **A citation
is a claim a machine can check — so only make the ones that hold.**

---

*Filed under the TRUTH HIERARCHY: on any conflict the newest date wins.*
