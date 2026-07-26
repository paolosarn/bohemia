# ADDENDUM: REUSE-FIRST IS LOCKED, WITH A GATE (Paolo 7/22/26, LOCKED)

## THE RULING, VERBATIM
"make it a new rule check out the approved assets first before cooking
please write it in the project please."

## WHY THIS EXISTS
The 7/21 reuse-first law (laws/BOHEMIA_ADDENDUM_ACT_ASSET_TIERS_7_21_26)
already said this in prose. Paolo asked directly the next day whether it
was actually being followed. Honest audit: NO, not always -
tools/bohemia_bake_factory.py (an assembly tool) reads from approved banks
before compositing; tools/bohemia_house_art_factory.py (built overnight
7/21, before the 7/21 law existed) does not - it cooked painted roof/wall/
door art from tone ramps with zero check against the corpus first. The law
was real but not machine-enforced. Per CLAUDE.md's own standing rule -
"A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED" - that gap is exactly what
this addendum closes.

## THE LAW
Before any tool cooks NEW graphic pixels for Bohemia, it must document
that it checked the approved/candidate corpus (banks/) first. Concretely,
every art-cooking tool (any tools/*_factory.py or tools/*_cook*.py file -
the naming convention this repo already uses for art generators) must
carry BOTH:
  1. A `REUSE CHECK:` block in its module docstring stating what it looked
     at (bank names) and what it found - either "used X for Y" (and then
     actually opens that bank as a real source) or "checked X/Y/Z, nothing
     fit because ___" (a genuine reason, not a rubber stamp).
  2. If it claims a bank was reused, the source code must actually read
     that banks/*.txt file - a claim in a docstring with no corresponding
     `open('banks/...')` call does not count.
Cooking without doing this first is the violation this law names. This
does NOT ban original art - fresh cooks are still how gaps get filled -
it bans cooking WITHOUT FIRST LOOKING to see if the gap is already closed.

## THE GATE
gates/reusefirst_gate.py sweeps every tools/*_factory.py and
tools/*_cook*.py file for the `REUSE CHECK:` docstring block, and where
that block names a bank as USED, verifies the script actually opens it.
Registered in gates/bohemia_gates.py. Runs every ship, same as every other
law in this repo.

## GRANDFATHERING
Files that predate 7/22 and cook art without any reuse check are NOT
exempt - they get the check retroactively added the same turn this law
lands (bohemia_house_art_factory.py's REUSE CHECK block, added 7/22,
documents honestly that the original cook skipped this and names what
SHOULD have been checked, discovered afterward via
BOHEMIA_PERIMETER_WALL_POOL and BOHEMIA_DOOR_EW_BANK). No new art-cooking
tool ships without one going forward - the gate is not advisory.
