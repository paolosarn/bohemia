# THE LAST SIXTEEN CELLS (8/19/26, WORLD lane)

**The valley is 99.9% built. The nine cells that are left are not mine to build.**

`gates/walked_surface_gate.js` named eleven district types with no module at all. Five were
buildable; six are identity. The five are built.

| | cells | what it is |
|---|---|---|
| `convention` | 6 | the LVCC: two column-free exhibit halls, a glazed concourse spine, a dock wall |
| `prison` | 4 | a Nevada desert facility: units round a services core, double perimeter, sally port |
| `dam` | 4 | Hoover: an arch wall, four intake towers, two spillways, the powerhouse U |
| `minigp` | 1 | a kart circuit: road course, pit lane, paddock, tyre walls |
| `fort` | 1 | the Old Mormon Fort: adobe square, corner bastion, Las Vegas Creek |

**9,207 of 9,216 cells (99.9%) drawn by their own module**, up from 99.7%.

---

## EVERY ONE OF THEM IS A CLUSTER, AND THAT IS THE WHOLE DESIGN

A convention centre is **288 m across** and a cell is 96 m. Built per cell, the 3×2 blob
becomes **six small convention centres in a row** — the identical defect the airfield had
before 7/26 and the Strip had before 8/18. So all five lay out in **valley coordinates**
against the bounds of the whole blob, and each cell copies its own window onto one plan.
Measured: the two convention cells come back with 8 and 7 codes at 50% and 36% dominance —
different windows, one building.

That needed a change in the world model too. `DISTGEN` handed every generator `{cw, ch,
streets}` and nothing else, so a district could not know it was part of something bigger.
Entries can now declare `cluster:true` and get their blob's bounds, the way `SURFACEGEN`
has since 7/26.

---

## THE PRISON HAS A PERIMETER, DECLARED RATHER THAN HIDDEN

Paolo 8/16, LOCKED: *"no perimeter walls until I tell you, bro no fencing no nothing bro."*
That ruling killed fences I had added to districts that never needed them, and it holds
everywhere in this file **except the prison**, where the perimeter **is** the building —
and where `jail` already ships a walled secure yard with four guard towers, approved and
untouched since 7/19. Same class, same precedent.

It has **one cut in the wire**, because a district you cannot leave is a prison in the wrong
sense (Paolo 8/1: *"make sure I cant be locked in any certain district ever again"*).

---

## ~~A DIVERGENCE WORTH KNOWING ABOUT~~ — **WITHDRAWN 8/19. IT WAS MY OWN BUG.**

**This section originally claimed the walked surface and the world model disagree about
where the fort and the dam are. That is false, and I shipped it to main as a discovery.**

I censused the landmarks with `world('bohemia')`. `world()` read
`seed = (seed>>>0) || 1`, and `'bohemia'>>>0` is **0** — so it fell through to **seed 1**
and built a completely different valley. Not a degraded one: measured afterwards, **43.8%
of cells came back a different district**, suburb where the arterial is, mountain where the
solar farm is. Passing the seed as a **number**, the two maps are **identical — 0 of 9,216
cells apart**. The fort is at (40,23) and the dam at (9,89)–(10,90) in both, which is where
this file's five modules were built for.

**The bug was never in the map. It was in a function that accepted nonsense and answered
anyway** — and the one seed is written as the TEXT `bohemia` everywhere in the laws, the
handoff and this repo's own docs, so every caller writing the obvious thing got a different
world in silence.

Fixed: `world()` hashes text with the same function the walked surface uses, so
`world('bohemia')` and the page build one valley; a number still works; and anything else
**throws**, because a silent fallback to a different world is worse than a crash — a crash
gets fixed the same hour. Held by `world_gate.js`.

## WHAT IS LEFT IS NINE CELLS AND THEY ARE ALL PAOLO'S

`sphere` (4), `luxor`, `strat`, `sign` (the Welcome sign), `highroller`, `springs`.

Every one is a **named, real Las Vegas landmark**. What each one IS in Bohemia — who holds
it, what it became, whether it still stands — is his ruling, and building them first would
invent canon he reserved (MECHANISM-MINE / CONTENTS-PAOLO'S). They stay on the gate's debt
list with `[PENDING Paolo]` written beside each one.
