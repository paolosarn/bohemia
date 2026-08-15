# BOHEMIA ADDENDUM — THE REWIND / GHOST TIME (Paolo 8/15/26, LOCKED in
# principle, routed to the coordinator by name: "I might need your help
# coordinating this Prince of Persia rewind time effect thing... we're
# just gonna need to be able to have storage for like the last 200 moves
# and maybe different perks make it go crazy... I hate save scumming and
# I think this should be a nice solution... it will look like a VFX tape
# going backwards... especially for combat or non-combat... I really
# think we can pull this off.")

## 1. THE RULING (LOCKED in principle; the dials below are open)
BOHEMIA GETS A REWIND. You can pull time backwards over your recent
moves. It is the answer to SAVE-SCUMMING: instead of policing the player
with save rules, the game gives the take-back a BODY inside the fiction.
- STORAGE: the last ~200 moves (he first said 30, then settled on 200 —
  200 is the number, and see §4: both are cheap).
- IT PLAYS AS A GHOST-TIME VFX: the screen runs backwards like a tape.
  Not a menu, not a load — a thing you watch happen.
- COMBAT AND NON-COMBAT both.
- PERKS EXTEND IT ("maybe different perks make it go crazy") — the
  progression hook is his, and it is a good one: the ladder is not "more
  damage", it is MORE TIME.
- PAIRS WITH TIGHTER SAVING: "imagine if like Fallout 4 and New Vegas
  hardcore mode you can only save when you slept, and that might be true
  here." DIRECTION, NOT YET LOCKED (he hedged it: "might"). Sleep-save
  already exists in the build, so this is a switch, not a system.

## 2. HE INDEPENDENTLY ARRIVED AT THE ORIGINAL DESIGNER'S EXACT FRAMING
Jordan Mechner on how Sands of Time began: "Is it possible to have a
button on the controller that will just rewind, LIKE REWINDING A
VIDEOTAPE? The engineers took that as a challenge, and we built the whole
game around it." Paolo, with no knowledge of that quote: "it will look
like a VFX tape going backwards." Same image, same instinct. The
documented DESIGN INTENT was also his: the rewind existed so you would
not have to die and restart so often — frustration relief, not a puzzle
gimmick.

## 3. THE CHALLENGE FINDING — AND IT IS AIMED AT HIS OWN PROPOSAL
A rewind can destroy the exact stakes it was meant to protect. The
XCOM ironman discourse is twenty years of players saying the same thing:
save-scumming is a SELF-CONTROL problem, and ironman works because it is
a COMMITMENT DEVICE — it removes the choice rather than asking for
discipline. An unlimited free rewind is save-scumming with better VFX: it
moves the scum button INTO the game and re-creates the problem it solves.
So the rewind MUST be bounded. Sands of Time bounded it with sand tanks.
BUT — and this is the second-order trap, which is why the cost model is
the one question worth his ruling — A SCARCE REWIND RE-CREATES SCUMMING
BY ANOTHER DOOR: when the take-back is a precious consumable, players
reload the SAVE to avoid spending it. Hoarding is scumming's cousin.
That tension is real, it is the whole design, and it is §7's question.

## 4. FEASIBILITY: THIS IS FAR CHEAPER HERE THAN IN THE GAMES THAT MADE
## IT FAMOUS, AND THE MECHANISM IS ALREADY IN THE BUILD
Jonathan Blow's GDC account of Braid is the practitioner reference, and
its headline lesson is a warning: he REJECTED event-sourcing (recording
what happened and replaying it) as "fragile, annoying and complicated"
and recorded WORLD STATE instead, into ring buffers. Braid's hard part
was fitting 30-60 minutes of CONTINUOUS 60fps physics into ~40 MB.
WE DO NOT HAVE BRAID'S PROBLEM, for three reasons already true:
1. OUR MOVES ARE DISCRETE. I-MOVE-YOU-MOVE and the 120 BPM law mean the
   game already advances in beats. "The last 200 moves" is 200 discrete
   states, not 200 seconds of continuous simulation.
2. OUR WORLD IS SEED-DERIVED. The valley is regenerated from `seed`, not
   stored, so a snapshot does not carry the world.
3. A FULL STATE SNAPSHOT ALREADY EXISTS AND IS TINY. `reportState()` in
   the city world already serializes the whole game as:
   `{v, seed, day, min, hx, hy, cx, cy, mode, riding, hzoom, loop:
   DAY.serialize(), quest: DQ.serialize(), purse, market}`.
SO THE REWIND IS A RING BUFFER OF THE SNAPSHOT WE ALREADY TAKE. The
mechanism is not to be invented; it is to be kept. That is REUSE-FIRST at
its best, and it is why 200 moves and 30 moves cost the same order of
memory — the honest number must still be MEASURED (§6), not assumed.
AND THE BUILD ALREADY AGREES WITH HIM PHILOSOPHICALLY. The persistence
code's own comment: "Never a time machine: there is no second slot to
scum back to." The save was designed anti-scum before he said the word.

## 5. THE LORE — AND A CANON TENSION THAT MUST NOT BE STEAMROLLED
He tied it to the Amalgamation and the fifth dimension. That instinct is
right and the fit is beautiful: a fifth-dimensional intelligence is,
definitionally, something that moves along an axis you cannot.
BUT: PERMANENT AMBIGUITY IS LOCKED CANON (GDD v2 — the Amalgamation's 5D
nature is "intentional and permanent"), and the tone work reaffirmed it
as EXPLAIN THE HANDS, NEVER THE GHOSTS. If the game ever states that the
Amalgamation grants the rewind, we have EXPLAINED THE GHOST and spent
the best mystery in the world on a mechanic tooltip.
THE RESOLUTION, and it costs nothing: ASSOCIATE, NEVER EXPLAIN.
- The rewind is never given a stated mechanism. No tooltip, no lore
  dump, no character says how it works.
- IT LOOKS LIKE THEM. PURPLE RESERVATION is already law — purple belongs
  to the Amalgamation ALONE, and a purity gate sweeps for it. So a purple
  ghost-time effect SAYS "this is them" without a single word, and it is
  the only thing in the game allowed to say it. The law we already have
  does the storytelling for free.
- People may have theories. The game never confirms one. That is the
  wiki-culture outcome the tone research says we want.

## 6. THE RISKS TO MEASURE, NOT ASSUME
- MEMORY: 200 snapshots against the measured ~224MB iOS ceiling, on top
  of the frame caches. Almost certainly trivial (small objects, no world
  data) — MEASURE IT AND WRITE THE NUMBER DOWN.
- DETERMINISM: state-restore must be exact. Anything derived at runtime
  from a mutable global rather than from the snapshot will drift — the
  restore path is where this system lives or dies, and it deserves a gate
  that rewinds N moves and asserts byte-identical state.
- THE QUEST/WITNESS ORGANS: rewinding must un-say what the world said.
  The valley remembers (standing, witnesses, the feed) — a rewind that
  restores your position but not the world's memory of you is a bug that
  will feel like cheating. The snapshot already carries loop/quest state;
  standing and witness state must ride along.
- DEATH SEMANTICS: how the rewind interacts with the ROGUELITE run and
  permadeath is NOT settled here and is [PENDING Paolo]. Do not assume.

## 7. THE ONE QUESTION (per the 8/4 question-format law; realism leads)
See the coordinator's ask in the turn that shipped this. THE COST MODEL is
the only fork that changes the build, and the trap in §3 is why it cannot
be defaulted quietly.

## 8. ROUTING
- COMBAT owns the combat rewind (he already gave that chat the combat
  feedback directly, this turn).
- RUN owns the non-combat rewind, the ring buffer, and the restore path —
  it owns the snapshot (`reportState`), the save, and the day loop. RUN IS
  THE PRIMARY OWNER of the machinery; COMBAT consumes it.
- SOUNDS: the ghost-time effect wants a reverse-tape sound; his ear rules.
- CHARACTER/ART: the purple ghost VFX (§5), inside PURPLE RESERVATION.
- NOT DEMO-BLOCKING. This must not displace RUN P0-DOOR or SOUNDS
  P0-WALK. It is the biggest MECHANIC on the horizon and it is safe to
  build after the demo's front door works.

## 9. ALSO CAPTURED THIS TURN (combat feedback he typed in the COMBAT
## chat; recorded here only so the cross-lane parts are not lost)
- MAX RANGE, HIS INTERIM RULING: "whatever the character's maximum range
  is for right now, just a couple tiles bigger than all the enemies."
  Concrete, buildable now, replaces guessing.
- Longer range later becomes a PERK / level-up stat, not a base buff.
- CHAIN SHOTS: a bonus that chains shot after shot, gated by gun type —
  a big rifle needs a KILLSHOT to chain, a pistol may chain on a headshot
  without a kill. Accuracy falls off over distance.
- HE SAW NO FACE CHANGE while taking heavy damage. CROSS-LANE, which is
  why it is here: the wounded FACE is CHARACTER's surface and the damage
  state is COMBAT's — neither lane alone owns it, so it can fall between
  them. Whoever picks it up says so in the handoff.
- He stood still and still hit everything after finding cover: he wants
  MORE MOVEMENT in fights.
