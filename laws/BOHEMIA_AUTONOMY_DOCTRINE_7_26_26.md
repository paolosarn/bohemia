# BOHEMIA — THE AUTONOMY DOCTRINE (Paolo 7/26/26, LOCKED — "that's my dream process")

Paolo's words: "ideally in my world everything was autonomous and I didn't have
to speak five paragraphs into each chat... literally all I want to do is thumb
things up or thumbs down or actually playtest them live... all chats when they
reply back to me will give me a TLDR breakdown and tell me what to thumbs up
and thumbs down."

This doctrine makes that law. It binds EVERY session, every lane, every reply.
Grounded in the 7/26 executive research (Pixar dailies pre-filtering, studio
verdict grammars, agent-fleet practice, commander's-intent one-word ops) — the
research record lives in this file's commit and the coordinator's findings.

=============================================================================
## 1. THE ONE-WORD LAW (Paolo's entire input vocabulary)
=============================================================================
Paolo never writes task prompts. His words to any session:
- **FIRST word of a NEW session names its lane**: "run" / "world" / "city" /
  "combat" / "character" / "sounds" / "art" / "lab" / "coordinator" ("quests"
  is HIBERNATED per the 7/26 ruling — a session opened with it replies one
  line and stops). That word both assigns the lane and means GO.
  ("sounds" added 7/29 by Paolo — "i should just make a dedicated sounds
  chat". "sound" and "music" resolve to the same lane. AUDIO MOVED: the
  CHARACTER lane no longer owns music/sfx — one system one session.) A fresh session that can't match its first word to a
  lane asks ONE word back ("which lane?") and nothing else.
- **After that, "go"** (or any single word, or garbled transcription, or "continue"):
  execute THE GO PROCEDURE (§2). The word carries zero information except
  "execute now" — never parse it, never ask what he meant.
- **"verdicts in"**: verdict .txt files have landed in records/ — process them
  (approve->volume, CBB->ship frozen, kill->graveyard+post-mortem), run the
  post-sitting check ("does any verdict imply a gate or exemplar change?"),
  then GO.
- **"status"**: read-only plain-English rollup (coordinator style), then stop.
- ANYTHING ELSE he says is a RULING or CORRECTION: record it (NOTES ARE
  RULINGS), act on it, never debate it. A question back to him is allowed ONLY
  as a thumbable either/or (two concrete rendered options), never an essay.

=============================================================================
## 2. THE GO PROCEDURE (deterministic — no branching that needs Paolo)
=============================================================================
1. Read CLAUDE.md -> 00_START_HERE_NEXT_SESSION.md -> your lane's section of
   BOHEMIA_BACKLOG.md -> your lane INTENT (§6). Before planning any
   engine-adjacent work, check laws/BOHEMIA_ENGINE_REALITY_MAP_7_28_26.md —
   the evidence-cited map of what the engine actually supports (EXISTS /
   PARTIAL / MISSING, file:line proof). Never assume a capability either way
   when the map already answers it.
2. If your lane has a task mid-flight in the handoff: RESUME it.
3. Else POP the topmost backlog item in YOUR lane whose dependencies are met.
   If an item is [PENDING Paolo], SKIP it (pending blocks nothing) and take
   the next. Never resolve a pending item yourself.
4. THROTTLE: if the verdict queue already holds 60+ unjudged fresh items
   fleet-wide, do only NON-COOK work (gate hardening, refactors, dossiers,
   sync-canon gaps, byte-lock holes) — never out-render the director.
5. Work to the DEFINITION OF DONE (§4). Ship. Rewrite the handoff. Reply in
   the CONTRACT format (§3). End turn.
Agents may APPEND discovered work (bugs, debt, gate gaps) to their backlog
section, tagged (discovered). Only Paolo (or a verdict) adds direction-class
items. Inventing canon-level work is forbidden (MECHANISM-MINE).

=============================================================================
## 3. THE REPLY CONTRACT (every session, every turn, no exceptions)
=============================================================================
AMENDED 7/26/26 by Paolo, LOCKED: "What input do you need for me? You gotta have
that at the bottom of each chat. I told you to make me a TLDR and it's not at the
very bottom of the screen every time, it's very annoying."

THE ORDER IS NOW BOTTOM-UP. He reads from the bottom of his screen. Anything he
has to scroll up for does not exist. So the two things he acts on -- WHAT I NEED
FROM HIM, and the TLDR -- are the LAST things on screen, always, in this order:

  1. The work. Short. What changed, in plain English. No process narration, no
     options essays, no philosophy, no file paths (he does not read code).
  2. **JUDGE THIS** -- numbered, one-look-one-verdict, side-by-side with the
     nearest approved anchor. If nothing: "Nothing to judge."
     **NAME THE TAB** (Paolo 7/28, LOCKED -- "I need you to always tell me what
     tab I can find this shit in"): every anchor, and every other thing in the
     reply he could look at, names THE TAB it lives in -- RUN / CHARACTER /
     CLOTHES / ANIMATION / RIG / COMBAT / MUSIC / CITY / MAP / SLICE / LIFE --
     in plain words. Never a file path, never "the judge page". If it is in no
     tab, the reply says "NOT IN A TAB YET" in those words, because a thing he
     cannot reach does not exist to him. The link is the door; the tab is the
     room. Full law: laws/BOHEMIA_ADDENDUM_NAME_THE_TAB_7_28_26.md
  3. **Proof line** -- gates green + deploy-verified + buildstamp. A green metric
     proves NON-VIOLATION only; never cite it as proof of quality, and never lead
     with it.
  4. **WHAT I NEED FROM YOU** -- the decisions blocking me, numbered, each one a
     concrete choice he can answer in a word. "Nothing, I'm good" if there is
     none. THIS IS THE SECOND-TO-LAST THING ON SCREEN, EVERY TIME.
  5. **TLDR** -- the two-sentence plain-English bottom line (sentence 1 = what I
     did, sentence 2 = what he should do with it and why it matters). THE LAST
     THING ON SCREEN, EVERY TIME.
  6. The play link, on its own line after, when a ship happened (existing law).

WHY THIS IS A LAW AND NOT A PREFERENCE: for a whole session the ask sat buried
mid-reply behind measurements, and he had to hunt for it every single turn while
already frustrated. A question he cannot find is a question I did not ask.

=============================================================================
## 4. DEFINITION OF DONE (the contract that kills false-done)
=============================================================================
- Full gate suite GREEN (one pass per ship, per the 7/25 ruling).
- New law/invariant => new gate, same turn, registered.
- VERIFIED ON THE REAL SURFACE: screenshot/render of the actual alpha canvas
  for anything visual. Screenshot-or-it-didn't-happen.
- Deploy verified: a Pages run containing your sha concluded SUCCESS.
- Handoff rewritten, stamp updated, verdict queue updated.
FORBIDDEN SHORTCUTS (pre-named; doing any = the failure the doctrine exists
to stop): weakening/disabling/skipping a gate; editing a gate to pass code
(only ever the reverse); stubs presented as done; marking a queue item
resolved without a verdict file; citing a green metric as quality; declaring
canon in unruled territory. Verification runs as a DIFFERENT code path than
the work (fresh-eyes subagent or the real gate suite, never self-attestation).

=============================================================================
## 5. THE VERDICT PIPELINE (Paolo's side of the machine)
=============================================================================
- Verdict vocabulary: **APPROVE** (unlocks volume/variants), **CBB** ("could
  be better" — ships, frozen, never spawns variants), **KILL** (graveyard +
  auto-drafted post-mortem tagged with kill-reasons). Optional one-line note;
  the note IS the record.
- Candidates are BATCHED BY DISCIPLINE (all clothing together, all buildings
  together, all audio together) across lanes — never interleaved by session.
- Queue cap ~60 fresh items; over cap = fleet cooks nothing new (§2.4).
- STALE UNJUDGED IS DEAD (7/26 ruling): bulk silence is a verdict; never
  re-surface old batches.
- Post-sitting mandatory step: does any verdict imply a gate change or an
  exemplar-index change? If yes, that's the next backlog item.
- DRIFT CANARY (spirit loop): periodically re-render fixed approved anchors
  through the current pipeline and diff against their blessed renders; any
  drift on an anchor = a pipeline change escaped review = stop and flag.
- SHARED SUBSTRATE IS JUDGED EARLY: anything other lanes build ON (a kit, a
  palette, a spec, a layering scheme) needs a verdict BEFORE dependents
  start; leaf content flows autonomously after.

=============================================================================
## 6. LANE INTENTS (commander's intent — the tiebreaker when unruled)
=============================================================================
Derived ONLY from Paolo's recorded rulings; a lane resolves novel small calls
toward its intent instead of pinging him. Canon-level gaps stay [PENDING].
- RUN: the game must FEEL good one-thumbed on an iPhone in portrait; when in
  doubt choose feel and responsiveness over features. Get Paolo playing.
- WORLD: a real, queryable, quest-driven valley; slow world, loud stories —
  the sim serves the quests, never runs away (pacing ruling).
- CITY/LIFE: a dead world that reads FINISHED and USED at a glance — dense,
  walkable, iconic-readable (Pocket City bar), never a void, never a placeholder.
- COMBAT: the dial + movement-forward toolkit; kills land on the beat; juice
  over realism, readability over simulation.
- CHARACTER: SHADOWS ARE A SEPARATE LAYER — shading never lives in a
  garment/body/prop's own pixels, it is a render-time pass (7/26 addendum);
  THE RIG IS LAW — all body/animation work derives from
  BAKED.pose and its layering, never a new body (7/26 addendum, rig check
  mandatory); silhouettes readable at arm's length; structure over
  color; one rig, variation by sliders; 120 BPM everything.
- SOUNDS (dedicated lane, Paolo 7/29): everything audible — music, the SFX
  factory, mix/ducking, beat plumbing to other surfaces. 120 BPM law is the
  spine: EVERY DURATION IS A NOTE; one AudioContext (the parent's), never a
  second audio engine. Sounds are synthesized parameters, not asset files
  (the one-file alpha stays light). Juice over realism; a sound's job is to
  make the moment FEEL landed. Batches arrive as one listen-and-thumb page.
- ART: the target screen is the constitution; art ships as coherent SETS
  judged in context, never loose tiles; referenced always (approved corpus +
  named outside references), invented never; 2-tile doors, human scale.
- LAB: one session, one system, one named game — working emulation,
  placeholder art, never touches the alpha; ships a playable page + feel
  ledger + pattern note; Paolo's play is the verdict; the lab never ports.
- QUESTS: grounded in the real (science/economics/behavior), a life lesson
  underneath without preaching, loudness-tagged clout, never stat-gated.

=============================================================================
## 7. THE THREE LOOPS (health check)
=============================================================================
- MACHINE loop (continuous): cook, gate, ship leaf content inside approved canon.
- TASTE loop (per sitting): fresh candidates in, verdicts out, volume unlocked.
- SPIRIT loop (playtest + drift canaries + coordinator audits): catches what
  the other two structurally miss. Playtest notes are first-class verdicts —
  a session converts each into a ruling, a backlog item, or a candidate.
Healthy = the machine loop never waits on chat, nothing reaches Paolo's eyes
that a gate could have killed, and no canon changes without a verdict trail.
Paolo's rhythm: 2-3 short judge sittings + 1-2 playtests a week. That's the
whole job. Everything else is the fleet's.
