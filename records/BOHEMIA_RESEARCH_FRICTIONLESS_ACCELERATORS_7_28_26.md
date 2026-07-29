# RESEARCH — THE FRICTIONLESS ACCELERATORS (7/28/26, coordinator, on Paolo's
# ask: "whats something u think can be frictionless and help us speed so much
# stuff along. do big brain online research")

THE QUESTION BEHIND THE QUESTION: Paolo's friction is not build speed — the
fleet ships constantly. His friction is (a) HIS OWN JUDGMENT LOAD (he does
not want to be the pixel artist, does not want to fight over pixels) and
(b) systems at 0-5% that feel far away (sound 0%, NPCs 5%, items 5%). So the
right accelerator produces BIG FELT PROGRESS while adding LITTLE OR NOTHING
to his judge pile. Two candidates cleared that bar in research; both are
routed. Everything else surveyed is noted at the bottom with why not now.

=============================================================================
## PICK 1 — THE SFX FACTORY (sound: 0% -> real, with near-zero Paolo cost)
=============================================================================
THE RESEARCH: the indie world standardized this problem years ago. The
sfxr -> bfxr -> jsfxr/jfxr lineage generates game sound effects PROCEDURALLY
— no recordings, no audio artist, no asset files. You pick a category
(pickup / shot / explosion / jump / hit / UI blip) and the tool synthesizes
the sound from ~20 parameters (waveform, pitch envelope, attack/decay,
etc.). Thousands of shipped indie games sourced their entire SFX pass this
way. Critically for us: jsfxr is a JAVASCRIPT port that runs on Web Audio —
the exact stack the alpha's music engine already uses. Sounds are ~20 numbers
each, not files: they fit the one-file alpha with zero asset weight.

WHY IT IS THE PERFECT BOHEMIA FACTORY (the factory law, applied):
- TYPED SPEC: an SFX is a named event + a parameter vector. The spec is tiny
  and machine-checkable.
- GENERATOR: a synthesis module in the alpha's own audio engine (one
  AudioContext already lives in the parent — reality map).
- BATCH OUTPUT: cook 8-12 candidates per game event (footstep dirt, footstep
  concrete, door, pickup, hit, block, kill-on-beat, UI tap, phone buzz,
  save chime, rain, fire crackle...) — a judge page plays them side by side.
- KILL/APPROVE: Paolo judges a sound in TWO SECONDS by ear. A 60-sound mega
  batch is ONE sitting — compare that to a 60-tile art batch. This is the
  cheapest verdict-per-item pipeline the game can have.
- GATE: every approved sound stores its parameter vector in a bank;
  regression = replay the vector, hash the rendered buffer.
- 120 BPM LAW native: combat/kill sounds quantize to the beat clock the dial
  already owns; sfx duration in beats, per EVERY-DURATION-IS-A-NOTE.
- MECHANISM-MINE / CONTENTS-PAOLO'S: the synth + judge page are mechanism;
  which sound the kill makes is his verdict.
WHO: the CHARACTER/SOUND lane (owns audio) — MUSIC's 30% infrastructure is
the on-ramp; the run/combat integration points are already mapped (the
handoff vocabulary, the beat clock).
WHY IT COUNTS DOUBLE: sound is 0% BY HIS OWN NUMBER, and game-feel research
has said for a decade that audio+juice moves perceived quality more per hour
of work than almost anything (the "juice it or lose it" school). The walk
with footsteps, door creaks and a kill-crack on the beat will FEEL like a
different game while costing him one listening session.

=============================================================================
## PICK 2 — PLAYTEST TELEMETRY (his playtests become data, not memory)
=============================================================================
THE RESEARCH: small-team playtesting practice is unanimous on two points.
(1) DROP-OFF POINTS — where the player quits — guide design better than any
survey or interview. (2) Even simple logging beats flying blind, and most of
what matters needs no external service: session length, path walked, deaths,
where the session ended, what got tapped. Studios visualize exactly this as
movement/death heatmaps to find chokepoints and dead zones; the technique
scales down to one tester (Paolo) because HE is the entire audience whose
behavior matters.

WHY IT IS FRICTIONLESS FOR US SPECIFICALLY:
- Paolo's playtests currently produce only what he remembers to voice-text
  afterwards, and every lane then interrogates him ("could you get out of
  the suburb?"). The 7/27 trapped-by-the-copy-menu bug took HIS words to
  find; a log of "180 taps on the d-pad, position never moved" finds it
  in one line, no conversation.
- BUILD: the run already has a save-blob/export pattern — add a lightweight
  event log (positions per step, cell crossings, enters/leaves, verbs used,
  fights, deaths, saves, session end point) accumulated in the same way and
  EXPORTED THE SAME WAY (one text blob he pastes into any chat, exactly like
  save export — a flow he already does).
- CONSUME: any session pastes the log through a small reader that renders
  the walk as a path-heatmap over the real map + a plain-English digest
  ("session 14 min; quit 40s after entering the mall; never opened the
  phone; 3 fights, died in none"). Playtest notes become first-class
  verdicts (doctrine §7) WITHOUT him having to write them.
- PRIVACY/WEIGHT: local only, in the blob he chooses to paste; no service,
  no network, no third-party tool.
WHO: RUN lane (it owns the surface + save/export pattern); the reader is
SHARED tooling.
WHY IT COUNTS DOUBLE: it converts the thing he ALREADY DOES for fun
(playtesting) into the fleet's highest-truth input, and it directly reduces
the "upsetness down the line" he predicts — fewer questions at him, fewer
wrong guesses about what happened on his phone.

=============================================================================
## SURVEYED AND NOT PICKED (so nobody re-litigates)
=============================================================================
- ITEM/NPC CONTENT FACTORIES: real needs (both 5%) but NOT frictionless —
  their bottleneck is Paolo-canon (what items exist, who the NPCs are),
  which is exactly the judgment load to protect. They queue behind rulings.
- EXTERNAL AI ART SERVICES: violates the harness path already ruled (AI
  makes tiles UNDER the quality harness, in-house).
- THIRD-PARTY ANALYTICS PLATFORMS: overkill for one tester; local blob wins.
- MORE PARALLEL CHATS: the fleet is at its coordination limit; the 7/28
  board-numbering collision shows the cost of more writers, not less.

SOURCES (research 7/28): bfxr (bfxr.net), jsfxr (github.com/chr15m/jsfxr),
jfxr (github.com/ttencate/jfxr), usfxr (Unity port, github.com/zeh/usfxr);
telemetry practice: salivity.github.io telemetry-heatmaps article, The Level
Design Book playtesting chapter (book.leveldesignbook.com), Game Developer
"Game Telemetry with DNA Tracking on Assassin's Creed", gamineai 2026 free
telemetry tools roundup.
