# BOHEMIA — GRAVEYARD GATE (7/16/26)

## GRAVEYARD IS FINAL was being enforced by everybody remembering
It wasn't. Nobody can.

The failure mode is not somebody lovingly resurrecting a killed asset. It is a
config file three docs deep still **pointing at one**, months later, because the
kill happened somewhere else and nothing ever swept for the pointers.

## What the first run found: 29 live references to dead things

**`SKIN_TONES_HOMELESS` — killed 7/10** ("DOWN — DEAD (graveyard). Agents use
the world skins like everyone; the RAGS carry the homeless read"). Six days
later it was still being *instructed*, not just remembered:

```
BOHEMIA_DEMO_FLOW_7_10_26.md:17         skin:'SKIN_TONES_HOMELESS'
SKIN_REGRADE_INTEGRATION.md:27          const tones = isHomeless ? SKIN_TONES_HOMELESS : SKIN_TONES;
AGENT_REVEAL_INTEGRATION.md:14          agents paint with SKIN_TONES_HOMELESS
AGENT_LOOK_7_10_26.js:2                 (SKIN_TONES_HOMELESS lives there)
GRAPHICS_LAWS_MASTER_7_16_26.md         x8
```

That last one is the worst. The **laws master** — the document that is supposed
to BE the law — was instructing the engine to paint agents with a palette Paolo
killed. And `AGENT_LOOK.js` claimed the array "lives there" in the palettes
file, where the only thing living is its tombstone. The demo agent config would
have resolved to undefined.

**`addRuinFlanks` / `ruin_frag` — killed 7/14** (RF0 DOWN, SIDEWALK SANCTITY).
The function was deleted from the call path and **the body was left in the
module** with a comment calling it "the graveyard record." 548 bytes of working
code that places ruins on sidewalks, sitting inside a live module, one call site
from resurrecting a verdict Paolo already made. That is not a record. That is a
loaded gun. The record belongs in `bohemia_graveyard.txt`, which is where it is
now. Buried in all five carriers.

## The gate
`bohemia_graveyard_gate.py` greps the tree for every token in
`bohemia_graveyard.txt` and sorts the hits:

- **TOMBSTONE** — the line records the kill (DEAD / KILLED / graveyard / do not
  re-add / DOWN). **Legal.** The record is how the law is remembered.
- **LIVE REFERENCE** — the line uses the token as if it still works. **Violation.**

Tokens are regexes, deliberately. A bare `orbit` substring matched
"addenda now orbit GDD v4" on the first run — prose, not a corpse. A gate that
cries wolf gets ignored, which is how you get 29 real ones hiding behind one
false one.

## Now
**21 tombstones, 0 live references.** Every fix applied Paolo's own verdict text,
not my judgement: agents use `SKIN_TONES_WORLD`, no branch, no second tone array,
the rags carry the read.

## Registry (`bohemia_graveyard.txt`)
`SKIN_TONES_HOMELESS` · `addRuinFlanks` · `ruin_frag` · `NEUROLINK_GLOW_V1/V2` ·
dial patterns `orbit` and `pulse2`. One line each: what died, when, what replaced
it. Add a line when something dies and the sweep is automatic forever.

## Gates green
sync 11 modules / graveyard 0 live / graphics 83-0 / line 18-18 / sidewalk 13-13 /
tan 12-12 / scale 12-12 / lightreg 25-25 / V11 13-13.

## Five for five
ENGINE SYNC · TAN WALL · SIDEWALK SANCTITY · LINE COLOR · GRAVEYARD IS FINAL.
Every one locked, every one enforced by memory, every one already violated.
