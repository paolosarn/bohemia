# BOHEMIA — LIFE SESSION BRIEF (7/19/26)

You are the LIFE session: you own the PEOPLE of Bohemia — agents, economy,
factions acting. The stage exists (world model session: districts, homes,
floorplans). The wardrobe exists (78 canon garments). The quests exist. Your
job is to make the valley ALIVE.

## READ ORDER (before any work)
CLAUDE.md -> 00_START_HERE_NEXT_SESSION.md -> this file ->
laws/BOHEMIA_WORLD_MODEL_ROADMAP_7_18_26.md -> the GDD factions section ->
laws/BOHEMIA_ADDENDUM_LOOP_DROPPED_7_19_26.md (no run-reset assumptions).

## YOU OWN
- AGENTS: people with homes (world-model houses), jobs, daily routines on the
  120 BPM world clock. OCCUPANCY LAW holds (one body per cell).
- DRESS: agents wear the canon wardrobe (78 items, records/BOHEMIA_CLOTHING_
  CANON.txt). MECHANISM-MINE/CONTENTS-PAOLO'S: outfit-assignment MACHINERY is
  yours; which faction wears WHAT is Paolo's ruling -- build empty tables.
- ECONOMY: post-collapse scarcity (water, power, food, barter). GROUNDED IN
  THE REAL: real economics of collapse, no fantasy.
- FACTIONS ACTING: patrols patrol what they light (PATROL canon), territory
  pressure, the Network eerily perfect in public. Faction DRESS/COLOR canon
  stays Paolo's.

## HARD BOUNDARIES
- NEVER edit slices/BOHEMIA_ALPHA_0_9.html while another session is flying it
  (ONE-ALPHA LAW: one session touches the alpha at a time). Build in
  engine/bohemia_life*.js + standalone judge slices, wired via SLICES_MANIFEST
  (the suburb-judge pattern). Anything needing Paolo's judgment = an
  interactive in the SLICE menu, never a chat PNG.
- FACTORY LAW: every system ships as a factory WITH ITS OWN GATE, wired into
  gates/bohemia_gates.py, same turn. Green or it does not ship.
- VERIFY ON THE REAL SURFACE. GRAVEYARD IS FINAL. Commit every decision.

## FIRST JOBS
1. Agent spec + routine engine (typed spec, generator, gate): wake/work/eat/
   sleep on the beat, homes from world(), jobs from districts.
2. Wardrobe wiring: dress generated agents from canon garments (assignment
   tables EMPTY pending Paolo).
3. A walkable LIFE slice: one block, agents living a day. Judge tool for Paolo.
Branch: claude/life-session. Push branch + fold to main per ship flow.
