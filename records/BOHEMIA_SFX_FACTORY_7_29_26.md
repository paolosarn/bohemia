# THE SFX FACTORY — SHIPPED 7/29/26 (SOUNDS lane, item 0)

Paolo's own progress ledger, 7/28: **sound effects 0%**. The only zero on the
board. He ordered a dedicated sounds chat on 7/29 and greenlit this as the first
thing it builds. It is in the game now, in the **MUSIC tab**, top of the panel.

## WHAT SHIPPED

**60 sounds, 12 moments, one sitting.** Tap a sound, hear it, thumb it. Five
candidates for each of: footstep on dirt, footstep on asphalt, footstep on
gravel, door opens, door shuts, pick something up, you land a hit, blocked,
kill-on-the-beat, UI tap, phone buzzes, saved.

**A sound is not a file — it is 22 numbers.** The whole batch is 20 KB of
parameters that synthesize at play time. Nothing is downloaded, nothing is
stored, and the 33 MB alpha did not get heavier by a single sample. A sound he
approves is banked as its vector, and the vector reproduces it exactly.

| piece | where | what it is |
|---|---|---|
| the synth + spec + generator | `engine/bohemia_sfx.js` (BOH_SFX) | typed spec, 12 recipes, deterministic generator, Web Audio renderer |
| the mount | `tools/bohemia_sfx_factory.py` | inlines the engine verbatim + builds the judge surface into the MUSIC tab |
| the judge surface | MUSIC tab of the alpha | thumbs, a note per sound, comment box, SUN MODE, EXPORT as .txt |
| the bank | `banks/BOHEMIA_SFX_BANK_7_29_26.txt` | **EMPTY** — filled only from a verdict |
| the fast gate | `gates/sfx_gate.js` | spec / grid / determinism / bank-empty / the surface |
| the audio gate | `gates/sfx_render_gate.py` | renders all 60 in a real browser and measures the waveform |

## THE LAWS IT ANSWERS TO

**120 BPM / EVERY DURATION IS A NOTE.** Every time value in a vector is in
BEATS and quantized to a 16th of a beat (31.25 ms). Attack, hold, decay, the
pitch-jump moment, every extra strike of a multi-hit crunch. A kill landing on
the beat and a hi-hat landing on the beat are then the same event.

**ONE AUDIOCONTEXT, THE PARENT'S.** The factory takes the MUSIC studio's
context, master gain and brickwall limiter and builds nothing of its own. A
second audio engine is banned by the lane intent, and iOS gives a page a handful
of contexts before it stops making sound at all.

**SCREECH LAW.** No `createDelay`, no `createConvolver`, nothing that rings by
loop — and the render gate proves it on the waveform, not by grepping: every
candidate is measured silent 60 ms past its own spec'd length.

**MECHANISM-MINE / CONTENTS-PAOLO'S.** The synth ships. The bank is empty.
`BOH_SFX.play()` on an unbanked event is silent on purpose: **the game makes no
sound he did not choose.**

## WHAT THE MACHINE CAUGHT THAT A READ-THROUGH WOULD NOT HAVE

Three real defects, all found by measuring actual audio and none visible in the
parameters:

1. **Eight candidates rendered differently on the second render.** The node
   cleanup timer is a wall-clock timer, and an OfflineAudioContext renders
   faster than the wall clock — so the graph was being torn down in the middle
   of its own render. Fixed: cleanup is realtime-only.
2. **The twelve families were 20 dB apart.** A bandpass at Q 5 throws most of a
   saw away, so BLOCK and the asphalt footsteps came out near-silent next to
   KILL. He would have been thumbing *which ones he could hear*. Every family's
   makeup gain is now measured off the real render onto a deliberate loudness
   ladder — a kill still dwarfs a footstep, because it should.
3. **The makeup gain was in the wrong place.** It sat before the bitcrusher, and
   a WaveShaper curve clamps anything past ±1 — so driving a crushed voice
   hotter hard-clipped four of the five PICKUP candidates to a single flat level
   instead of making them louder. Makeup belongs after the filter and after the
   crusher, which is where it is now.

Two more things the batch does on purpose: **candidate 1 of every event is the
recipe un-jittered**, so "none of these" can never mean "you never played me the
straight one"; and **no two candidates differ by volume alone** — two recipes
were jittering their output gain and that was taken out, because five volumes of
one sound is not a choice.

## HOW A VERDICT BECOMES THE GAME'S SOUND

1. MUSIC tab → SOUND EFFECTS → thumb up the one that should BE the sound
2. EXPORT SFX → `bohemia_sfx.txt` → share into the chat
3. the winner's VECTOR line goes into `banks/BOHEMIA_SFX_BANK_7_29_26.txt`
   beside the verdict file that produced it, and into `BOH_SFX.setBank()`
4. `gates/sfx_gate.js` fails any bank line that cites no verdict file

APPROVE unlocks volume — variants of an approved sound (a footstep needs 3-4
alternations so a walk does not machine-gun one sample). KILL graveyards the
candidate with a post-mortem. Silence on the whole batch is itself a verdict
(UNJUDGED IS DEAD) and the batch will not be re-surfaced.

## PROOF

- `gates/sfx_gate.js` — 73 checks green. Proved it can fail: defeated the beat
  quantizer, watched it go red on the grid law, restored.
- `gates/sfx_render_gate.py` — 752 checks green across 60 rendered candidates.
  Proved it can fail: moved one recipe's makeup gain, watched 11 fingerprint
  checks go red, restored.
- `records/BOHEMIA_SFX_FINGERPRINTS_7_29_26.txt` — peak / rms / length /
  brightness for all 60, off the real render. A recipe edit that moves any of
  them past tolerance fails the build instead of quietly handing him a different
  sound than the one he judged.
- `slices/BOHEMIA_SFX_JUDGE_PROOF_7_29_26.png` — the surface, shot on a real
  390 px phone viewport.

## NOT DONE, ON PURPOSE

The run is still silent. Wiring these to real footsteps needs the beat clock the
run does not have yet (SOUNDS backlog item 1: the walk's BEAT=500 is a hardcoded
constant and no tempo crosses the postMessage vocabulary), and it needs a verdict
saying which sound a step makes. Both are the next two moves, in that order.
