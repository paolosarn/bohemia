# BOHEMIA ADDENDUM — TIME IS SPENT BY ACTIONS (Paolo 7/26/26, LOCKED)

Paolo's words, verbatim: "like I told you, Bohemian movement is gonna be the
world moves when you move where the world moves when you spend time taking an
action or something".

This CLOSES a question the lab had written up as open. It is not a new law; it is
the ruling that makes the 120 BPM LAW / I-MOVE-YOU-MOVE explicit about WHAT moves
the world.

## THE RULING

1. **THE WORLD ADVANCES WHEN THE PLAYER SPENDS TIME.** An ACTION costs time, and
   spending that time is what advances the world. Moving one cell is one such
   action. So is swinging, talking, searching, working, waiting. The world does
   not advance on a real-time metronome and it does not advance while the player
   is sitting still deciding.

2. **THEREFORE: NO CONTINUOUS FREE WALKING IN THE OVERWORLD.** The three options
   the LAB-01 pattern note laid out (interpolate the cell / two modes / free
   walking everywhere) are ANSWERED by this ruling and are no longer a question
   for Paolo. Option 3 is dead on arrival. The player does not slide around a
   world that is holding its breath.

3. **WHAT IS STILL OURS (mechanism, not canon):** how a spent action is DRAWN.
   The turn resolving in one instant and the body being drawn moving across the
   cell during that instant is a renderer question inside this ruling, not a
   change to it. A lane may do that without asking. What it may not do is let the
   player's position become continuous input that the world has to keep up with.

4. **A COST TABLE IS CANON, NOT MECHANISM.** How much time each action costs
   (a step vs a swing vs a search vs a night's sleep) is CONTENT and stays
   [PENDING Paolo] until he rules it. No lane invents an action-cost table.

5. This supersedes any earlier reading in which the beat was a clock the world
   ran on by itself. The beat (BEAT=0.5s, 120 BPM) remains the QUANTISER — what
   things snap to — not the driver.

## GATE

No new machinery: engine/bohemia_loop.js already advances only on committed
actions and gates/bohemia_loop_gate.js + the TERRITORY-AI PACING ruling (7/24,
advanceRound is rare and quest-gated, never a heartbeat) already hold the
no-metronome half. gates/lab_gate.js holds clause 4 of the whole-mechanics
addendum, which is what keeps any lane from studying another game's walk for us
again.
