# EYES AND EARS -- E6 [walk tells]: WHAT MAKES A CYCLE READ WRONG, MEASURED ON 105 CLIPS
## 9/5/26, lane 17 (eyes-5vql33). MODE: RESEARCH, plus this lane's own instruments.

E6 asked what makes a walk or idle cycle read wrong -- foot sliding, popping, off-beat
timing, a limb that snaps -- as a checklist, then run on the clips.

**Ten tells, in `banks/eyes/BOHEMIA_EYES_WALK_TELLS_CHECKLIST_9_5_26.json`, all draft:true.
Four added and run today, one already held elsewhere, three open, one is a finding rather
than a detector.** Numbers: `records/BOHEMIA_EYES_WALK_TELLS_9_5_26.json`, 105 clips read,
102 measured, in all eight directions.

**REUSE CHECK FIRST**, which is now this lane's habit and it keeps paying: three gates
already watch animation from three angles -- `anim_fabrication_gate` (a moving limb cannot
gain painted pixels), `frozen_poses_gate` (a hold is the SAME frame, not a recomputation),
`motion_visible_gate` (the clip moves enough pixels to be seen). None of them asks whether a
cycle CLOSES or whether a joint SNAPS, so those are what this round built.

---

## THE GOOD NEWS, AND IT IS MEASURED, NOT ASSUMED

**EVERY CLIP THAT IS A CYCLE CLOSES CLEANLY.** The test: the joint vector at phase 0 against
the vector one frame before phase 1, in all eight directions, compared against that clip's
own typical step so a big clip is not punished for moving in big steps. Seven clips of 102
fail to close -- **cover-drop, cover-rise, headshot, sit-ground, crawl-dying, chest-thump,
throw** -- and every single one of them is a ONE-SHOT ACTION. Nothing that loops pops.

**AND THE 120 BPM LAW HOLDS ACROSS THE WHOLE LIBRARY.** Every one of the 105 clips declares
2 or 4 beats. At 120 BPM that is exactly 1 or 2 seconds, so nothing in the animation library
drifts against the song.

## THE FINDING: NOTHING MARKS WHICH CLIPS LOOP

There is no loop flag in the clip table. The bench drives every clip with `phase % 1` --
one-shots included -- so **cover-drop, whose end pose is 1,032 times its own typical step
away from its start, is played on a loop and snaps back every cycle**. cover-rise is 755x,
headshot 107x.

That is not a bug in those clips; a one-shot is supposed to end somewhere else. It is a
missing piece of DATA: the table says how many beats a clip lasts and never says whether it
comes back. Routed to ANIMATION -- one field per clip, and then this test can be run as a
gate against the clips that claim to loop, which is what would make it enforceable.

## THE SNAP LIST (a report, not a verdict)
Biggest single step against the clip's own median step, worst direction:

| clip | snap | clip | snap |
|---|---|---|---|
| cover-drop | 47.8x | shiv-jab | 14.2x |
| cover-rise | 34.4x | inject | 9.9x |
| stumble | 20.1x | spear-drive | 9.7x |
| get-shoved | 19.9x | chest-thump | 8.4x |
| cover-fire | 19.3x | nod, brace | 7.6x |

Sixteen clips are over 6x. **Some of these are supposed to snap** -- get-shoved is a shove,
stumble is a stumble -- which is exactly why this ships as a list for the ANIMATION lane to
rule on rather than as a gate that would fail correct art. The number says where to look.

## TWO LIMITS OF THIS INSTRUMENT, STATED RATHER THAN DISCOVERED LATER
- **`sleep` and `headshot-2` have no pose function at all.** That is NOT a defect: both are
  driven by a Verlet physics simulation and a lying special case instead of the pose table
  (the 7/17 crumple). This tool cannot see them, and a tool that reported them as broken
  would be the third false alarm this lane has caught in itself today.
- **`floor-rise` changes its pose SHAPE between frames** in all eight directions -- the set
  of joints it returns is not constant. That is the morphing family the 7/26 law is about,
  so it is reported to ANIMATION, but this instrument cannot say whether it is intentional.

## FOOT SLIDING IS STILL OPEN, AND HERE IS WHY
It needs two numbers: where the planted foot is on the ground each frame, and how fast the
world moves him. **The second one does not live in the animation at all** -- it lives in the
city's own movement code, and the walk cycle has no idea what speed it is being played at.
Measuring the pose alone would produce a confident number about nothing. Written down as
OPEN with what it would take, rather than faked.

## ROUTED
- **ANIMATION**: add a loop / one-shot field to the clip table (W-04). Then the closing test
  becomes a gate instead of a report, and it holds every looping clip forever.
- **ANIMATION**: `floor-rise` changes pose shape between frames; the sixteen-clip snap list
  is yours to rule on.
- **EYES AND EARS**: E7 [reference score] next, then E5 [missing sound], then E8 and the E9
  standing duty.

## SOURCES
- The repo's own animation laws: `laws/BOHEMIA_ADDENDUM_ANIMATION_REJECTED_7_26_26.md`
  (the morphing ruling), the frozen-poses ruling of the same day, and the 120 BPM law.
- The craft the tells come from is standard animation practice: a cycle must close, a
  planted foot must not skate, weight shows in the hips, and arms oppose legs.
