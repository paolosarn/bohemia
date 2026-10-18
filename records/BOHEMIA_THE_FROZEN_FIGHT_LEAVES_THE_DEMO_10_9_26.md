# THE FROZEN FIGHT LEAVES THE DEMO (PLUMBER 10/9/26, row [first load], round 3; rule 66a, rule 63)

PAOLO 10/5: "I feel like I gotta wait 40 seconds for this shit to load."
Round 1 (records/BOHEMIA_WHY_THE_DEMO_MAKES_A_PHONE_WAIT_10_9_26.md) measured the wait and handed RUN the
download cut; round 2 (records/BOHEMIA_THE_CAST_BAKE_IS_A_THIRD_OF_THE_BOOT_10_9_26.md) handed RUN the
processor cut. This round is the first one that changes the live demo by itself, because the thing it cuts
is made by this lane's own tool: the demo is CUT from the alpha by tools/bohemia_cut_the_demo.js, at every
deploy. KEPT CLAIMED (rule 6): the title is still over two seconds and NEW GAME still over eight.

## THE ANSWER FIRST

The demo page carried the old, frozen fight (rule 63) as one string, `COMBAT_B64`: **2.67 MB of the page's
6.30 MB of text, 1.31 MB of its 2.51 MB gzipped**. Half of what a phone downloads for the page, and the
title waits for the whole page to be read. COMBAT measured and gated that the demo never opens it (aaf6ee2,
ONE FIGHT in the suite) and routed the bytes to this row.

The cut now empties it on the demo. The workshop (the alpha) keeps the whole fight for its COMBAT tab.

| first open, fresh browser, phone-speed processor (4x), served like GitHub Pages | before | after |
|---|---|---|
| the demo page, text | 6.30 MB | **3.63 MB** |
| the demo page, gzipped (what the phone downloads) | 2.51 MB | **1.19 MB** |
| title on screen | 5.4 s, 3.5 s | **2.8 s, 2.7 s** |
| NEW GAME ready | 96.8 s, 85.0 s | **85.5 s, 81.6 s** |
| downloaded before NEW GAME is ready | 29.7 MB | **27.1 MB** (the page is read twice before ready: the build watcher; RUN's hunk ends that) |

Two runs each, alternating on one machine (before, after, before, after). The first "before" ran cold and
read slow; the second, 3.5 s and 85.0 s, matches the last two rounds on a faster box (3.6 s, 86 to 89 s).
**The title is the clear win: 3.5 s to 2.7 s, against a goal of 2.** The page is half the size, and the
title waits for all of it. NEW GAME moves a few seconds, inside the noise of two runs: that wait is the
processor, and round 2's hunks (with RUN) are its fix.

## WHY THIS IS SAFE, AND WHAT WOULD HAPPEN IF IT WERE NOT

- Exactly one line of the demo changes: `const COMBAT_B64='...'` becomes `const COMBAT_B64=''`. Every
  reader of the name still finds it.
- The only thing that reads it is `ensureCombatFrame`. Its callers on the demo, read from the page: the
  COMBAT tab (cut from the demo in the cutter's step 1), the idle warm (stands down while NEW_FIGHT_ON,
  aaf6ee2), `runEncounterIn` (only the old RUN slice sends its message, and the demo never loads it),
  `startColdOpen` (no caller), `combatSetEncounter` and `abortEncounter` (no caller, and abort only acts on
  an old-fight encounter), and `cityEncounterIn`, which opens the rebuilt fight first and falls back to the
  old one only if opening the rebuilt one THROWS.
- On that one failure path, the player now gets a blank frame where he used to get the frozen fight, the
  one Paolo could not leave on 10/1 (rule 57). Both are a trap; the fix for either is the rebuilt fight not
  throwing, and ONE FIGHT is the gate that watches the door.
- `atob('')` is `''`, so nothing throws; the alpha is not touched; the deploy cuts the same way, so the
  live demo and the committed one stay the same file (DEMO BUILD).

## WHAT ELSE MOVED WITH IT (this lane's gates, so the cut does not read as drift)

- BUILD SIZE: its "the alpha and the demo are still the same game" leg measured the raw size gap; it now
  subtracts the blob the cut takes out on purpose, read off both files every run, so any OTHER drift still
  trips it.
- DEMO STALENESS (EYES' meter, a report that never fails): its self-test asked for the fight's font in the
  demo's copy of the fight; the demo has no copy now, so it asks the alpha's, and the report says so.
- FIRST LOAD: CEIL_MB 33 -> 30 (27.1 MB measured plus 10%; never raised).
- BUILD SIZE, this lane's own: the inventory refreshed (it was 33.7 days old, a red of its own); the ratchet
  locked the demo's budgets down, 5.20 -> 3.92 MB raw and 1.87 -> 1.29 MB gzipped, and the gate went 8 red -> 5.
  The five left were red before this round and are named in the handoff: the alpha's own size (it still
  carries the fight, on purpose), the unreachable files ([excavate]'s move, waiting on Paolo), the biggest
  block (the same fight, in the alpha), and the inventory disagreeing with PAGES PUBLISH about the site's size.

## STILL HANDED TO RUN (unchanged)

`python3 tools/bohemia_first_load_hunks.py --write` (row [load hunks] in RUN's section): the download cut
before NEW GAME (round 1) and the bind cut (round 2), measured at 87 -> 67 s. This round's cut and those six
hunks do not touch each other; together they are the whole of this row's handed-over work.
