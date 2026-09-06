# EYES AND EARS -- E5 [missing sound]: THE GAP LIST, EVERY VERDICT MEASURED TODAY
## 9/5/26, lane 17 (eyes-5vql33). MODE: RESEARCH, plus this lane's own instruments.

E5 asked what we are missing against the best-sounding games -- occlusion, reverb by space,
distance colour, the bed, stings -- as a gap list with a two-word verdict each.

**Ten gaps, ten two-word verdicts, and every one of them is backed by a measurement taken on
the real surface today rather than an opinion about what good games do.**
List: `banks/eyes/BOHEMIA_EYES_SOUND_GAP_LIST_9_5_26.json` (draft:true).

---

## FIRST: E4's ALARM IS WITHDRAWN, AND THE HARNESS THAT RAISED IT IS FIXED

E4 reported a walk in which the game rendered ZERO sounds, and refused to call it a finding
because the same run showed the audio engine down. **That refusal was right, and the reason
was a bug in my own harness: it read `window.MUS`, and the music studio is declared with
`const`, which makes a global BINDING but not a window PROPERTY.** `window.MUS` is undefined
while `MUS` works perfectly. Five instrument bugs this lane has now caught in itself in one
day, and this is the cheapest and most embarrassing of them.

With bare names, the harness tells the truth, and the truth is good news:

| measured, walking, day started | |
|---|---|
| audio engine at four checkpoints | **running, running, running, running** |
| walked cells the city reported | 31 |
| footstep calls in the shell | **31** |
| sounds rendered at the audio bus | **32** |

**THE FOOTSTEP CHAIN WORKS END TO END.** City posts, shell hears, factory renders. The game
is not silent when you walk.

**CONFIRMED AGAIN ON 9/5 BY A SECOND, FIXED INSTRUMENT (E8).** The live harness had two more
counters that nothing incremented -- the render count and the footstep count were read from
variables whose wraps had quietly stopped being in the file, so they printed zero forever and
looked exactly like silence. Both are hooked by bare name now, and the tool fires one sound by
hand after every run as a POSITIVE CONTROL: no zero from it means anything unless the control
moved the counters first. With that in place: **41 renders and 40 footstep calls in 20 seconds
of walking**, every one of them `step_dirt`. The numbers in this record came from dedicated
scripts and stand; the harness now agrees with them.

## AND THEN THE MEASUREMENT THAT MATTERS: STAND STILL AND IT IS

**35 seconds standing still, day started, engine running, music playing: ZERO sound effects
asked for and ZERO rendered.** Not a bird, not a wire, not a wind. `air_day`, `air_night`
and `air_inside` are APPROVED, cooked and measurable -- E4 measured all three -- and
**nothing in the game ever calls them.**

That is the day-22 finding, still standing, with a number on it now: the valley makes no
sound of its own. The SOUND lane fixed the MUSIC half of this today (the city now sends
where you are, and the song follows). The ambience half is cooked and unplayed.

## THE TEN GAPS

| # | thing | verdict | the measurement behind it |
|---|---|---|---|
| 1 | the ambience bed | **COOKED, UNPLAYED** | 35 s still: 0 asked, 0 rendered; three air beds approved |
| 2 | footsteps | **LIVE, MONOTONE** | 31 of 31 steps reported the surface `dirt` |
| 3 | reverb by space | **BUILT, LIVE** | the city posts a space (OPEN, three times in one walk); four spaces exist with their own numbers |
| 4 | occlusion | **NOT BUILT** | nothing filters a sound by a wall between it and you |
| 5 | distance colour | **NOT BUILT** | the darkness number is per SPACE, never per DISTANCE |
| 6 | a threshold you can hear | **NOT BUILT** | the four spaces switch instantly; crossing a doorway is silent |
| 7 | stings | **MUSIC ONLY** | stings live in the music studio, not the effects factory |
| 8 | ducking under a card | **NOT BUILT** | no sidechain: nothing steps aside when a card comes up |
| 9 | the phone speaker | **HALF LOST** | E4: 22 events lose over half their energy below 500 Hz; 4 are inaudible on a phone |
| 10 | anybody watching the mix | **NOBODY IS** | nothing meters the game's own output while it plays |

## WHAT THE BEST-SOUNDING GAMES DO, AND WHAT OF IT WE CAN HAVE
The industry's split is **obstruction** (the direct path is blocked but the reflections still
arrive, like a pillar in a room) against **occlusion** (a wall between two rooms). The
treatment is the same shape in both: **low-pass the direct sound, leave the room's wet tail
alone**, and let distance drive both level and colour. Middleware does it with ray tracing
and reverb buses.

**WE CANNOT USE A REVERB BUS AND WE DO NOT NEED ONE.** The SCREECH LAW (7/8) forbids delay
lines and convolvers, and the factory already builds space out of FINITE SOURCES -- scheduled
early reflections at falling gain and a filtered noise burst for the tail. Occlusion in that
world is a low-pass on the dry layer with the reflection layer untouched, which is three
numbers on an existing recipe, not a new engine. **Every verdict above was written to respect
that law**; not one of them asks for a bus.

## ROUTED
- **SOUNDS**: play the bed (gap 1) -- it is the one where the work is already done and only
  the call is missing. Then occlusion and distance colour, both of which fit inside the
  existing space recipe.
- **SOUNDS**: 31 of 31 steps came back `dirt`. That may be a yard, or the surface lookup may
  be falling back. One look settles it.
- **EYES AND EARS**: gap 10 is mine. E4 measured every asset alone; nothing has ever metered
  the MIX while the game plays. That is the next instrument, and it makes E9's standing duty
  able to say "this ship got louder" instead of "these files measure fine".

## SOURCES
- The obstruction / occlusion split and its treatment (low-pass the direct path, keep the
  wet tail; distance drives level and colour): the standard Wwise and FMOD practice, e.g.
  blog.nightonmars.com/sound-occlusion-unity-fmod and the propagation literature.
- Our own constraint: the SCREECH LAW, and `engine/bohemia_sfx.js`'s header on building space
  as sources rather than processors.
- E4's asset measurements: `records/BOHEMIA_EYES_E4_THE_EARS_9_5_26.md`.
