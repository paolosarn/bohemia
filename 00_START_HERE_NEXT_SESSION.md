=== BOHEMIA HANDOFF (DIETED 7/26/26 — the pointer, never the pile) ===
FILENAME LAW: this file is always named 00_START_HERE_NEXT_SESSION.md, lives at
repo root, sorts first, and is REWRITTEN at the end of every working session.
There is only ever ONE.

DIET LAW (coordinator, Paolo-ordered 7/25): this file stays UNDER ~500 LINES.
Sessions append their entry at the TOP of the LANE STATUS section and TRIM the
oldest entries into laws/BOHEMIA_STATE_OF_PLAY (append, dated) when the cap
nears. The full pre-diet pile (4,387 lines, every entry 7/17-7/25) is preserved
verbatim at archive/BOHEMIA_HANDOFF_PILE_THRU_7_25_26.md and in git history.
Nothing was deleted; it was relocated.

READ ORDER: CLAUDE.md -> this file -> laws/BOHEMIA_COORDINATOR_ARCHITECTURE_MAP.md
(the whole machine: engine spine, the B64 embed/resync chains, gates, lanes) ->
BOHEMIA_CANON_INDEX.md -> your own lane's brief in laws/.

=============================================================================
## HOT LOCKED RULINGS (newest first — read before building anything)
=============================================================================
- ONE VALLEY (7/26, WORLD lane, machine-locked): the MAP tab renders the SAME
  valley the phone runs. It sat on seed 1337 for months while the game boots the
  text seed 'bohemia'; the map Paolo explored was never the map his quests were
  cast into. Pinned to the engine's own hashSeed('bohemia') in
  tools/bohemia_map_tab.py, asserted in gates/map_tab_gate.js. Never hand-type a
  seed number into a surface again.
- NO PULL REQUESTS, EVER + ONE GATE PASS PER SHIP (Paolo 7/25, LOCKED, in
  CLAUDE.md ship flow). Push main directly, run the full suite once per ship.
  (Also: the stale PR badges #10-#20 on the reused character/sound branch name
  are 7/17-7/18 relics — ignore them, never click them.)
- THE FEMALE RIG IS DEAD — ONE RIG + VARIATION SLIDERS (Paolo 7/25, LOCKED):
  laws/BOHEMIA_ADDENDUM_ONE_RIG_VARIATIONS_7_25_26.md. Read it before touching
  bodies. The woman-rig v1-v4 arc is superseded by this ruling.
- V-NECK TEES GRAVEYARDED (Paolo verdict 7/25, screenshot: "delete these
  terrible"). Graveyard is final.
- HERO BEAT: beat 1 is canon for EVERY song (7/24 ruling). The ||1 default is
  intentional; never "fix" it.
- TERRITORY-AI PACING (7/24, LOCKED): advanceRound stays RARE and QUEST-GATED,
  never a tick/heartbeat. Written into engine/bohemia_loop.js.
- TLDR LAW for the coordinator (7/25): every coordinator reply to Paolo ends
  with a plain-English TLDR; assume zero coding knowledge.

=============================================================================
## LANE STATUS (as of the 7/26 diet — details in the archived pile + git log)
=============================================================================
WORLD MODEL (02): 7/26 — WHERE THE QUESTS HAPPEN. Backlog WORLD-1 shipped: a
placement CANDIDATE factory (engine/bohemia_quest_placement.js) proposes 3
addresses per canon quest by crossing the quest's OWN prose with each district's
OWN dossier (records/tilespec) over the already-generated valley. MAP LAW held:
candidates only, Paolo picks. Judge surface in the alpha (LIFE tab -> WHERE THE
QUESTS HAPPEN): real valley from above, a pin per option, three REAL cell renders
per quest, tap one, export .txt. Gate QUEST PLACEMENT registered + green (20
checks: real cells only, anchor === the live cast, byte-identical across runs, no
stacking, page fresh + reachable). Record:
records/BOHEMIA_QUEST_PLACEMENT_CANDIDATES_7_26_26.md. Also fixed the same turn:
ONE VALLEY (above). WAITING ON: his picks, then apply them as a casting-bridge
override. Earlier: 9 playable canon quests (S01-S09) + quest runtime + casting
bridge live in the phone; quests move the factions (world bridge); CANON QUESTS
gate green.

LIFE + CITY (03): WALK-THIS-GAME redirect fully shipped — (1) SLICE walk
surface dressed to FINISHED, (2) neighbors homed+scheduled on the block,
(3) 4-lot big buildings + landmark zoom. Zoom-build: the city builder IS a
zoom of the one iso view (Paolo 7/25). 15 district heroes on the map.

COMBAT (04): v65 — music ramps at 2 and 4 kills (Paolo's ruling), on top of
the v54-55 mobility toolkit + time-of-day shuffle. Combat gates green.

CHARACTER/SOUND (05): marathon cook waves 1-3 shipped (music batch 20 = 9
faction-pool songs; wardrobe volume 29 items + 3 new shapes; woman-rig
candidate arc v1-v4 — now superseded by the ONE-RIG ruling above). Music
batches 18/19 shipped earlier same day. Session told to stand down 7/26 for
the repo cleanup; its mega-verdict stack is pending Paolo (below).

QUEST/LORE (01): its island content is rescued to main. The branch
claude/quest-log-access-ufcu1u still exists with its full separate history
(169 unique commits) — kept for reference until a session confirms nothing
else needs porting, then it can be retired to the archive. Per the
coordinator's plan this lane is chartered to be REBORN AS THE RUN LANE
(laws/BOHEMIA_COORDINATOR_PROMPT_LIBRARY_7_25_26.md, Prompt 2).

CONNECTED-RUN (branch claude/connected-run): the run-lane start exists — 2
additive commits (BOHEMIA_RUN_CURRENT.html base + S01 + Playwright harness
green). Unmerged, additive-only, waiting for its session to continue.

TASTE ENGINE: laws/BOHEMIA_PAOLO_TASTE_CANON.md + tools/bohemia_taste_filter.py
landed on main, validated both directions against Paolo's own past verdicts.
Factories pre-filter batches against his recorded NEVERs before he sees them.
The filter KILLS, it never APPROVES — that line never moves.

COORDINATOR (07): read-only across lanes. Produced the architecture map, the
findings (quest-rescue plan since executed, collision watch), the prompt
library, and this diet. REPO CLEANUP: DONE, both phases (7/26). The full
pre-slim history (every commit 7/16-7/26, all branches) lives permanently in
paolosarn/bohemia-vault, byte-verified before the rewrite; main is a SLIM
GENESIS of the identical tree. Procedure + keep-it-slim rules:
laws/BOHEMIA_ADDENDUM_REPO_DIET_7_25_26.md. Future slims repeat the same
archive-first procedure; the coordinator watches repo weight on check-ins.

=============================================================================
## PENDING PAOLO (the shelf — never decide these for him)
=============================================================================
- THE MEGA VERDICT (FRESH items only, per the UNJUDGED-IS-DEAD ruling 7/26):
  the marathon waves Paolo has never seen — music batch 20, wardrobe volume,
  plus whatever lanes stack next. STALE unjudged banks are presumed dismissed,
  never re-surfaced (laws/BOHEMIA_ADDENDUM_UNJUDGED_IS_DEAD_7_26_26.md).
- QUEST PLACEMENT PICKS (fresh, 7/26): 9 quests x 3 addresses in the alpha's LIFE
  tab. One tap per quest. Unpicked = stays where it is.
- FACTION TERRITORY SHAPE (discovered 7/26): every faction sits on a suburb tract
  and holds exactly 1 cell, because bases are an even stride across the district
  list. Whether a faction's ground should match its trade is HIS call; the
  mechanism is a small change to bootFactions the moment he rules.
- One-rig VARIATION SLIDERS: scope/next step after the 7/25 ruling.
- Combat grammar graduation batch (stacked per Prompt 4) when surfaced.
- Older shelf items live in the archived pile under their original sections.

=============================================================================
## NEXT UP (the standing plan)
=============================================================================
1. THE RUN: connected-run continues per Prompt 2 in the prompt library —
   house -> street -> S01 -> combat handoff -> home -> feed post, one thumb,
   on the phone. That's the milestone that turns judging into playtesting.
2. After the run: mega verdict sitting, then volume on whatever he approves.
=== END — keep this file under ~500 lines; the pile is the archive, not here ===
