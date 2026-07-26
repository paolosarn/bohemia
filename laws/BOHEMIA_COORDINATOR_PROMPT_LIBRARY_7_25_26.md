# BOHEMIA — COORDINATOR PROMPT LIBRARY (7/25/26)

Dispatch-ready prompts drafted by the coordinator for Paolo. He fires them; the
coordinator never dispatches. Each is plumbed against
laws/BOHEMIA_COORDINATOR_ARCHITECTURE_MAP.md + the target lane's own recorded
NEXT notes + Paolo's stated priority 7/25: "I need to feel it, I have to play
test it" — everything aims at getting him playing.

FIRE ORDER: 1 now (02 World Model). 2 the moment 1 merges (the 01 slot, reborn
as the RUN lane). 3 and 4 now, parallel-safe. A is a one-time job for any free
session. B is a walk-away marathon cook for 05 (or any cook session), best after
A exists but legal without it.

=============================================================================
## PROMPT 1 → 02 WORLD MODEL — THE RECONCILE (fire NOW)
=============================================================================
You're rescuing the quest system onto main, and the reason matters: I want to PLAY
this game, and every playable quest is stranded on branch
claude/bohemia-quest-log-access, a SEPARATE git history with no common ancestor to
main. Main has zero playable quests. Bring it all across without breaking anything.

BASE = main. Port the additive files clean (none exist on main): quests/bq/S01-S09
+ README, engine/bohemia_quest_runtime.js + all its tests + the loop-subsystem
tests, gates/bohemia_canon_quests_gate.js, the lore addenda in laws/ and the
questbook corpus. The ONE hard file is engine/bohemia_loop.js: main's is 635 lines
(territory AI + real-world boot + the locked quest-gated pacing ruling), the quest
lane's is 957 (quest runtime wiring, CLOUT scoring, feed, profile, ledger, talk-
trigger, quest channels). Take MAIN's as the base and hand-port the quest lane's
subsystems on top. NEVER auto-merge that file. Union the registries: register CANON
QUESTS in bohemia_gates.py, reconcile music_gate .js vs .py, union graveyard/
superseded/sync_canon. DROP the quest lane's stale copies of overmap/blockgen/
graphics/marking tools, keep main's. Both histories independently wired factions+
economy into the loop boot, pick main's wiring, don't blend. Full gate suite green
AND all 9 quests proven to play to COMPLETE on the reconciled loop before you ship.
Full step-by-step: laws/BOHEMIA_COORDINATOR_FINDINGS_7_25_26.md on the coordinator
branch. When this lands, the RUN gets built on top of it, so ship it clean.

=============================================================================
## PROMPT 2 → 01 SLOT REBORN AS THE RUN LANE (fire when Prompt 1 merges)
=============================================================================
New charter: you are the RUN lane now. The island's been rescued to main, story
work is done for the moment. Your job is the thing no session has ever owned: the
FIRST CONNECTED PLAYABLE RUN, stitched from systems that ALL ALREADY EXIST. No new
systems. Stitching only.

THE RUN: I spawn in a canon suburb house, walk out the real door onto the real
street, walk the block, step up to an NPC and the talk-trigger offers me a quest
from the rescued nine (start with S01 The Meter Reader, it's the electricity one,
self-contained), I do it, something goes loud, it hands off into a real combat
encounter via the existing BOHEMIA_ENCOUNTER postMessage bridge to the combat
frame, BOHEMIA_COMBAT_END hands back, I walk home, the completed quest posts to
the feed with its CLOUT weight. One loop, start to finish, on my phone, one thumb.

It lives in the SLICE tab of the one alpha (one-alpha law, no separate page). The
quest runtime, talk-trigger, clout scoring and feed all exist in the reconciled
loop; the walkable street, doors and interiors exist in the slice surface; the
combat bridge exists in the parent shell. You are wiring, not inventing. Quest NPC
placement is a MAP LAW call: pick ONE sensible placement, flag it [PENDING Paolo]
in the handoff, I'll rule it after I feel the run. Phone feel is part of the job:
if walking feels like ass at arm's length, that's a bug, fix it. Verify on the
real surface: headless Playwright on the actual alpha, full run start to finish,
zero console errors, and remember G is a page-level const not window.G. New gate
same turn: run_gate.js, boots the slice, executes the full loop headless, asserts
quest COMPLETE + feed post + return home. Register it in bohemia_gates.py. Ship
big, update the buildstamp, merge to main, link me. I want to play this.

=============================================================================
## PROMPT 3 → 03 LIFE + CITY (fire NOW, parallel-safe)
=============================================================================
Re-aim at the stage the first run happens on. I'm about to actually WALK this
game, so the street-level experience is the product now. From your own next-notes,
in this order: (1) the SLICE-tab walk surface where the run starts, one canon
suburb block dressed to FINISHED: real doors enterable (door art is canon),
interiors real per interior=exterior law, yards/props/lamps dense, no bald tiles.
Hold the render-and-look bar: walk it yourself headless and LOOK at the pixels.
(2) Agents at world scale from your recorded next: neighbors homed and scheduled
on the block so the street I walk isn't empty, commute pattern from the LIFE spec,
occupancy law holds. (3) Then, only after 1+2: the 4-lot big buildings and
landmark zoom from your notes. Stay OUT of engine/bohemia_loop.js entirely, the
reconcile owns that file right now, no exceptions. Your surface is the slice/city/
life tabs and district engines. Sync discipline: any district engine edit means
re-run bohemia_map_tab.py and the relevant city patch, map_tab_gate + city_tab_gate
green, full suite before ship. Buildstamp, merge, link.

=============================================================================
## PROMPT 4 → 04 COMBAT (fire NOW, parallel-safe)
=============================================================================
Two jobs, both from your own open threads. (1) THE HANDOFF: the first playable run
is about to call you. The parent-shell bridge already exists (BOHEMIA_ENCOUNTER in,
BOHEMIA_COMBAT_END out). Make the enter/exit path bulletproof for run use: an
encounter can start from a quest context, resolve, and return cleanly with the
outcome (dead/spared/fled per the mercy mechanics), no state leaking between
encounters, repeatable back-to-back without a reload. Prove it headless: fire 5
encounters in a row through the real postMessage bus, zero errors, gate it in
combat_lab_gate. (2) THE VERDICT BATCH: graduate the winning combat grammar. Stack
every candidate needing my thumbs into ONE judge surface reached from the alpha,
sun mode, export .txt, so I can rule the whole backlog in one sitting instead of
dribs. Discipline you already know but it's law: decode COMBAT_B64 FRESH from HEAD,
never a scratch decode, parallel sessions live in that blob. Full suite before
ship, not spot checks. Buildstamp, merge, link.

=============================================================================
## PROMPT A → ANY FREE SESSION — BUILD THE TASTE ENGINE (one-time job)
=============================================================================
Big standalone job, no check-ins, cook until done. You're building THE PAOLO
TASTE CANON: my flavor, distilled from every ruling I've ever made, turned into
a machine that pre-filters every future batch.

STEP 1, THE SWEEP: read EVERY verdict export in records/ (*_VERDICT_*.txt, the
music verdicts, clothing waves, house skins, heroes, markings, signals), every
graveyard entry + post-mortem in gates/bohemia_graveyard.txt, every law that was
born from a reaction of mine (45-degree, tan 85/15, walkable-land, structure-not-
color, iconic-readability, the pocket-city style bible, the hero v1-v5 arc), and
every quoted reaction of mine preserved in the handoff and laws/. That corpus IS
my taste, recorded.

STEP 2, THE DISTILL: write laws/BOHEMIA_PAOLO_TASTE_CANON.md organized by
category (buildings, districts, clothing, music, animation, props, UI copy).
For each: hard NEVERs (each citing the exact verdict/post-mortem it came from),
strong LIKES (cited the same way), and open territory where I have no recorded
ruling yet, marked honestly as UNKNOWN, never guessed. Newest ruling wins on
any conflict, same as canon law.

STEP 3, THE MACHINE: build tools/bohemia_taste_filter.py, a pre-judge kill pass
any factory can call: takes a candidate batch, checks it against every machine-
checkable NEVER (flat side-on, purple outside Amalgamation, black outlines, tan
ratio violations, recolor-posing-as-new-shape, pavement-dominant layouts), kills
violators with a named reason, and writes a TASTE REPORT of what it killed and
why. Wire it into the standing factories as a standard pre-filter stage. New law
= new gate, same turn: taste_gate.py asserts the canon file exists, every NEVER
cites a source, and factories document a TASTE CHECK like they document REUSE
CHECK. Register it in bohemia_gates.py.

THE LINE THAT NEVER MOVES: the filter KILLS, it never APPROVES. Nothing ships as
canon without my real thumbs. This narrows what reaches me, it never replaces me.
Full suite green, commit, merge, handoff. This should be a long, thorough cook,
the sweep alone is 30+ files. Take your time and get my voice right.

=============================================================================
## PROMPT B → 05 CHARACTER & SOUND — THE LONG AUTONOMOUS COOK (walk-away)
=============================================================================
Marathon cook, no check-ins, I'm not here. The rule that makes this legal:
APPROVAL UNLOCKS VOLUME. You only cook in categories where I already approved the
pattern, so nothing needs me mid-flight. Stack everything into ONE mega verdict
at the end.

THE MENU, in priority order, cook as much as you can: (1) VOLUME on approved
clothing SHAPES: every approved silhouette gets its full colorway spread plus
2-3 new SHAPE variants per family in the approved style (shapes are the
headline, structure_gate enforces). (2) The WOMAN RIG: ruled and locked
(laws/BOHEMIA_ADDENDUM_WOMAN_RIG_7_21_26.md), the pose functions are skeleton-
relative, build the full carryover: rig, wardrobe fit, all 8 directions, anim
clips passing the same gates as the male rig. Painted regions SACROSANCT, never
reshape. (3) VOLUME on approved music styles: more songs per approved category
pool, same instrumentation DNA as the approved batches, tagged into the pools.
(4) District hero VOLUME: the districts that still have no hero building, baked
through the SAME approved iso3d pipeline and style as the 15 that shipped.

DISCIPLINE, non-negotiable: taste-filter every batch against
laws/BOHEMIA_PAOLO_TASTE_CANON.md if it exists (kill matches to my recorded
NEVERs before I ever see them). REUSE CHECK before cooking new pixels. Decode
COMBAT_B64 fresh from HEAD if you touch it. Verify on the real surface,
screenshot the real tabs headless, not gate numbers. Full suite green before
every intermediate ship, ship in waves not one giant drop, buildstamp each wave.

THE ENDING: one judge surface in the alpha with EVERYTHING stacked, thumbs, per-
item comments, sun mode, export .txt. I come back, rule the whole thing in one
sitting. Rejects to the graveyard with post-mortems, no re-cooks of dead things.

=============================================================================
## STANDING NOTE: PURE-PLUMBING WORK LIST (zero taste, any idle session)
=============================================================================
Zero-verdict work any idle session can chew: close the RIG_B64/PREFAB_B64
byte-lock holes (no maintainer tool, no gate — see the architecture map); add
PLOTGEN/POWERGRID/FLOORPLAN/TRANSITIONS to gates/bohemia_sync_canon.txt; interiors
for every district under interior=exterior; more gate-proven .bq quests stacked
for Paolo's read (parse clean, validate zero-errors, play to COMPLETE, placement
left [PENDING Paolo]).
