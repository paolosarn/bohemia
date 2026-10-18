# EYES AND EARS -- [the soundscape judged] -- ROUND ONE: SCHOOL
### 10/9/26 -- session eyes-5vql33

Row (rule 80a, Paolo 10/9: "so many sounds in Battle Brothers... we're not even touching the
surface"), SOUNDS [the soundscape]. With a real instrument, every audio node hooked: the
settlement, the map and the fight as they are now, how many distinct sounds play in sixty seconds
and at what levels under the song; the same after SOUNDS' first round; beside Grok ask 23's
catalogue as the floor; the three sounds that read fake named. This round is research only, no
measuring, per this lane's own two-round law.

## REUSE-FIRST: THE HOOK ALREADY EXISTS, THIS LANE BUILT IT

Before designing anything new, checked this lane's own prior tools (tools/bohemia_eyes_ears_live.js,
E4, 9/5/26) and found the exact mechanism the row asks for already built and proven: it wraps
`window.playSFX` without replacing it (the real sound still plays), counts every distinct event
name asked for over N seconds into a plain object, and -- the important part -- carries a POSITIVE
CONTROL: after the walk, it fires one sound by hand and checks the counters actually moved, so a
zero is never silently read as silence when it could be a blind hook. It also checks `MUS.AC.state`
directly (not `window.MUS`, a documented trap: a top-level `const` is a global binding but not a
window property, and reading the wrong one reported "no AudioContext" through a whole walk once).
This is the right shape and most of it survives untouched into round two's instrument.

TWO REAL GAPS, NAMED NOW SO ROUND TWO BUILDS AROUND THEM, NOT INTO THEM:
1. **It counts calls, not levels.** `window.playSFX(ev, when, mul)` is wrapped, but the row also
   wants "at what levels under the song," and the level lives one layer deeper -- the engine's own
   source (slices/BOHEMIA_ALPHA_0_9.html, playSFX) builds a vector `v` carrying `v.gain` and hands
   it to `BOH_SFX.render(v, AC, dest, at)`, which is ALSO already wrapped by the E4 tool (for a
   render counter) but throws the vector away. Round two's extension is small: keep `v.gain` from
   the same wrap that is already there, nothing new to design.
2. **It walks a surface that is dead.** The E4 tool's reach is the old street walk (arrow keys, a
   `.pb` movement pad inside the CITY_WORLD frame) -- CLAUDE.md's own pillar line is explicit that
   this walk is retired (THE WALK IS DEAD, 9/28). Round two cannot reuse the REACH, only the HOOK;
   the three real screens this row names (settlement, map, fight) are reached the way every other
   tool this lane has built this session already reaches them (the proven L1-L9 loop-gate pattern,
   toMap(), the fight-reach pattern from [a stranger's five minutes judged]), not re-derived.

## WHAT "UNDER THE SONG" ACTUALLY MEANS, SOURCED

The row's own two-part ask (how many sounds, and at what level) is not just thorough for its own
sake -- it is the professionally correct question, not the naive one. Checked the real craft: a
raw count of simultaneous sounds is not what working game-audio mixers actually manage against.
AUDITORY MASKING is the real, named phenomenon (one sound becomes inaudible because another occupies
the same frequency region at the same time, and masking spreads upward in frequency more easily
than downward) -- which is why real mixing is governed by PRIORITISATION AND DUCKING, not a layer
budget: a warning or a footstep has to win the mix over ambience and music by being treated
differently, not by there being fewer sounds overall. A standard real framework (Peck's five
categories -- sound effects, Foley, ambience, music, dialogue, cited via a University of Hull
paper) is the real taxonomy a count should probably be bucketed into, rather than one flat number.
This confirms the row's own instinct: "how many AND at what level" is the right pair of questions,
and round two's write-up should report both, bucketed by category where the engine's own event
names make that possible (SFX event names already carry their kind, e.g. `step_`, `door_`, `UI_`).
[Auditory masking -- IRPR Sound glossary](https://sounddesign.irpr.agency/glossary/auditory-masking/)
[Game Audio Mixing Demystified](https://www.asoundeffect.com/?p=695995)
[Sound layer categories (Peck), via University of Hull](https://hull-repository.worktribe.com/OutputFile/381358)

## THE STATED FLOOR, CHECKED FRESH: STILL NOT LANDED

Grok ask 23 ("EVERY SOUND IN BATTLE BROTHERS AND WHEN IT PLAYS... a table, one row a sound, with
its source") is listed in reference/BOHEMIA_GROK_ASKS.md as the NEXT ask, not yet answered -- no
catalogue page exists in reference/library/grok/ for it. Confirmed fresh, not assumed from an
earlier round's different finding (that was the Battle Brothers SCREENSHOT gap, a different thing).
Round one's own rule (12, a dependency is a premise not a gate) applies the same way it did for
[the soundscape]'s own claim: there is a real "before" to measure right now (what we actually play
today) without Grok's table; the table becomes the comparison floor once it lands, not a blocker.

## "READS AS FAKE" NEEDS AN EAR, NOT JUST A HOOK

The row asks to name the three sounds that read as fake (not real material). SOUNDS' own round one
this session states its method plainly: "every struck sound this lane ships is synthesized from its
object's real physics, never a sample file" (records/BOHEMIA_SOUNDS_THE_SOUNDSCAPE_LIST_10_9_26.md,
cited on the board), with his own ruling on what "real material" means still pending his thumb (VOTE
item what-real-material-means-for-a-sound-10-9). A hook counts WHICH sounds played; it cannot judge
whether one sounds synthetic. This lane's own E18 tool (tools/bohemia_eyes_hear.js) already solved
the adjacent problem for music -- point `MUS.AC`/the SFX bus at an `OfflineAudioContext` and render
the engine's own scheduled output to a real WAV file -- the same render-to-file approach lets round
two actually LISTEN to each distinct sound (not grep its code) before naming any as fake, consistent
with this lane's standing rule never to report a defect it has not reproduced on the glass (or here,
the speaker).

## WHAT ROUND TWO BUILDS, ARMED BY THIS

1. Extend tools/bohemia_eyes_ears_live.js's two existing wraps (playSFX, BOH_SFX.render) to also
   capture `v.gain` per call and `MUS.MAST.gain.value` at the same instant, giving a real level
   figure, not just a count -- the hook already exists, this is one more field on an object already
   being filled.
2. Reach the three real screens (settlement, map, fight) with this session's own proven reach
   patterns, not the retired walk; sixty real seconds on each, counted and leveled.
3. Report counts bucketed by the real taxonomy (SFX/ambience/UI/music) where event names allow it,
   not one flat number, per the sourced masking/mixing reasoning above.
4. Render a handful of the most-played distinct sounds to real WAV files (E18's own technique) and
   listen before naming any of the three as fake, rather than guessing from the event name.
5. Compare against Grok ask 23 once it lands; report its absence plainly if it has not, same as
   round one found.

## ROUTED

Nothing to route yet -- school round. Grok ask 23's absence is the coordinator's own queue, not
chased by this lane.

## SHIP TEST FOR THIS ROUND

The instrument this row needs is not a blank page: this lane's own E4 tool already built the real
hook (wrap, don't replace; count distinct events; a positive control against a blind zero) and its
two real gaps are named precisely enough that round two is an extension, not a rebuild. The row's
"count and level" pairing is confirmed as the professionally correct question via real sourced
craft (auditory masking, mixing-by-priority over mixing-by-count), not just thorough phrasing.
Grok ask 23 is confirmed, fresh, still unlanded. The "reads as fake" half is given a real method
(render to a file and listen, this lane's own E18 technique) instead of being left to a guess from
code. NO MEASURING THIS ROUND, per the lane's own two-round law. Round two next.
