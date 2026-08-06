# BOHEMIA ADDENDUM — EVERY PIXEL IS ANSWERED FOR (Paolo 7/31/26, LOCKED)

Paolo, verbatim:

> "Commercial rebuilt is like 65 % mall is like 40% i need you to be able to write
> about everything u draw at all times not a single pixel on screen answered for bro"

## THE RULING

**If I cannot write what a pixel IS, it does not ship.** Not the tile code — the
pixel. At all times, for every district, for every surface he looks at.

This is not new in spirit. EXPLAIN-EVERY-TILE (7/18) already says every non-ground
tile must map to a named thing in the district's legend, and the DISTRICT DOSSIER
LAW (7/19) already requires the full note section. Both were GREEN on commercial
and mall when he scored them 65% and 40%. **So the existing laws were satisfied
and the work was still unanswerable, which means the laws were measuring the
wrong thing.**

## WHAT THEY WERE MEASURING, AND WHY IT WAS NOT ENOUGH

`legendOk` asks: does every code appear in the palette? That is a spellcheck. It
passes a district where 4,600 tiles are a code called "dead lawn" whose entire
account is "the dead campus lawn". Thirty per cent of the plot, one clause, no
answer. The dossier law asks for a note section and gets one — written once, at
build time, describing the intent rather than the pixels that actually landed.

The gap between them is where 35% of commercial and 60% of mall lives:
**area that is legal, named, and means nothing.**

## THE THREE TESTS A PIXEL HAS TO PASS NOW

1. **NAMED.** It resolves to a legend entry. (The old bar. Kept.)
2. **WRITTEN.** That entry has a real act-1 account — what you are looking at, in
   this dead world, in a sentence that could only be about this thing. A stub
   ("dead ground", "pavement") is a failure, not a pass. And it must resolve to a
   layer: ground / structure / overhead / prop / portal, plus solid, plus what is
   inside if you can go in.
3. **EARNED.** It is there for a reason a person could state. Filler that exists
   because the rect had to be filled with something is the thing he is scoring at
   40%. A district that is mostly one undifferentiated code has not earned it,
   whatever that code is called.

## THE ANSWER SHEET

He does not dig in files (CLAUDE.md), so a dossier in `records/` he never opens is
not an answer, it is an alibi. **Every district gets an ANSWER SHEET he can look
at**: the plot as rendered, beside every code in it — swatch, name, what it is in
act 1, its layer, whether it blocks, what is inside it, how many tiles and what
percent of the plot. Every colour on the render has a line. If a colour has no
line, that is the bug, visible at a glance.

`tools/bohemia_answer_sheet.py` builds it. `gates/answered_for_gate.js` holds the
three tests above across every registered district.

## THE SCORES THIS RULING CAME WITH

- COMMERCIAL rebuilt: **65%** — better, not done.
- MALL rebuilt: **40%** — a fail. Its concourse and lots are exactly the
  "legal, named, meaningless area" this addendum exists to kill.

Both stay open. Neither is approved. The reference remains the HIGH SCHOOL at 89%
(7/31).

## WHAT THIS DOES NOT CHANGE

BUILD THE WORLD (7/31): quests, factions and the economy stay OFF. ACT ONE ONLY
(7/28). MECHANISM-MINE / CONTENTS-PAOLO'S — an answer sheet describes what is
drawn; it never invents names, signage text or canon he reserved.
