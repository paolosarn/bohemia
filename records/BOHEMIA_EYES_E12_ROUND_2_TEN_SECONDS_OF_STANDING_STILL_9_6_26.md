# EYES AND EARS -- E12 [silence standing] -- ROUND TWO OF TWO: THE CHECK
## TEN SECONDS OF STANDING STILL
### 9/6/26 -- session eyes-5vql33 -- measured on the shipped alpha, at iPhone size

School: `records/BOHEMIA_EYES_E12_ROUND_1_SCHOOL_WHAT_A_QUIET_PLACE_SOUNDS_LIKE_9_6_26.md`
Machine: `tools/bohemia_eyes_quiet.js` (and `--muted`)
Data: `records/BOHEMIA_EYES_QUIET_9_6_26.json`, `records/BOHEMIA_EYES_QUIET_MUSIC_OFF_9_6_26.json`
Gap list for SOUNDS: `banks/eyes/BOHEMIA_EYES_E12_GAP_LIST_9_6_26.json` (draft:true)

---

## THE ANSWER, IN ONE LINE

**The valley does not go quiet when you stand still. It goes to ZERO.** With the music
muted, in three places, for ten seconds each, the shipped game put out **digital silence:
not one sample above zero, and every octave band pinned at the meter's own floor.** Zero
sound events. Nothing to tell one place from another because there is nothing at all.

Everything a standing player hears is the soundtrack. Underneath it there is no world.

---

## WHICH FINDING FROM ROUND ONE CHANGED HOW I MEASURED

The lane's MODE requires this sentence, and it changed the answer twice.

**School's counter-finding was that measuring a LEVEL is the wrong instrument.** A silent
valley and a valley with a properly quiet bed differ by a handful of decibels and both read
as "quiet". So this measures four things: floor, event rate, spectrum, and difference
between places. That mattered immediately: with the music on, the floor read -22 to -38
dBFS, which looks like a game that is making sound. The EVENT RATE said **zero**, and the
event rate was right.

**And school's floor numbers set the bar.** Real wilderness sits at 30-40 dBA and seldom
below 30-35. Nothing outdoors is silent. So the reading that mattered was not "is it quiet"
but "is there a floor at all", and there is not one.

---

## HOW IT WAS MEASURED

An init script patches `AudioNode.prototype.connect` before any page script runs. Anything
that connects to a real destination is also connected to a silent tap: BS.1770 K-weighting
filters, an analyser for the spectrum, and a script processor that sees every sample. The
tap therefore hears the true mixed output of the running game, including anything I do not
know the name of. This is not an offline render of an asset (that was E4) and it is not a
grep. It is what comes out of the speaker.

Sample rate 44100, so the 48 kHz K-weighting coefficients are approximate here; that is
written into the data file rather than hidden, and it does not matter to a result of zero.

---

## THE FOUR NUMBERS, MUSIC OFF, THREE PLACES

| | floor | events in 10s | spectrum, every band |
|---|---|---|---|
| where the game opens | **digital silence** | **0** | -140 dB (the meter's floor) |
| seventy steps out | **digital silence** | **0** | -140 dB |
| seventy more, across | **digital silence** | **0** | -140 dB |

Widest gap between any two places, in any octave band: **0.0 dB.**

## THE SAME THING, MUSIC ON

| | floor (K-weighted) | events in 10s |
|---|---|---|
| where the game opens | -22 to -25 dBFS | 0 to 1 |
| seventy steps out | -36 to -38 dBFS | 0 |
| seventy more, across | -36 to -39 dBFS | 0 |

Every decibel in that table is the soundtrack.

---

## FOUR CONTROLS RAN, AND THREE OF THEM KILLED A CLAIM I WAS ABOUT TO MAKE

This is the part of the round that took the work.

### 1. RULE ZERO, the positive control -- PASSED, every run
A ten-second capture reporting zero is exactly what a broken tap reports, and this lane has
already printed a confident zero off counters nobody incremented. So every run ends by
firing one known sound by hand. The tap heard it every time: **-34, -35, -38, -50.9 dBFS**
across the runs, including in the music-muted run that reported silence. **The silence is
real, not a deaf instrument.**

### 2. THE NULL CONTROL -- killed the answer to question four
The first working run showed the floor falling -23, -32, -36 across three places, which
reads as "the places differ" and would have been the headline. So: three captures at the
**same spot, back to back, without a step taken.** Result: **16.4 dB of spread standing
still, against 16.2 dB across the three places.** Doing nothing moved the number as much as
crossing the valley did. It was the music changing song, not the place.

Across runs the standing-still spread was 5.5, 14.0 and 16.4 dB. **The soundtrack's own
swing is as big as any effect I was trying to measure**, which is why question four could
only be answered with the music muted, and why the tool got a `--muted` mode.

### 3. THE WALK WITNESS -- caught a harness bug that would have faked three places
The first version walked with arrow keys. **140 presses, zero footsteps.** Then `w`, taps on
the canvas, drags, and touchscreen taps: zero, zero, zero, zero. This is a phone game and it
walks on an **on-screen d-pad**, buttons with class `.pb` inside the city frame. The game was
fine. My harness was pressing keys at a game that has no keys, and without a witness I would
have reported three places and measured one, three times.

### 4. THE PICTURE WITNESS -- added because the footstep witness turned out to be the wrong one
Even on the d-pad the parent-side footstep counter never fired, so a second, independent
witness was added: sample the canvas on a 32x32 grid before and after the walk and count how
many samples changed, with **standing still measured as the threshold rather than guessed.**
Standing still changed 0.7% of the picture; the walks changed 3.6% and 3.4%. In a later run
the standing threshold drifted to 2.8% and the walks read 5.3% and 2.8%, which is not a
clean separation. **So: movement is proven in one run and not in another, and I am saying so
rather than picking the run I liked.** It does not change the answer, because the reading
was digital silence and zero events either way: if the player moved, that is three places
with nothing in them; if not, it is one place with nothing in it.

The parent's footstep function being the wrong witness for the walked city is a fact about
this harness, not a defect in the game, and it is not being routed as one.

---

## WHAT THIS MEANS AGAINST SCHOOL

- **KEYNOTE: absent.** School: no real outdoor place is silent; the floor is about 30 dBA
  and it is made of wind, distance and your own body. Ours is zero. Not low. Zero.
- **SIGNAL: present but only while moving.** Footsteps work. Standing still there is nothing
  to listen to, and standing still is most of what a player does while reading a card,
  choosing, or thinking.
- **SOUNDMARK: cannot exist yet.** With the music off, all three places measure identically
  at the meter's floor, so the gap between them is 0.0 dB in every band. You cannot tell one
  part of this valley from another with your eyes shut, because there is nothing to tell
  apart. This was the word nobody in the project had used and it now has a number: zero.
- **The 2020 lockdown finding still stands and is now the target.** A dead city measured only
  5-7 dB below a live one, and what changed was the character, not the level. The fix is not
  a volume: it is taking the machines out of the keynote and letting what was always
  underneath come up.

---

## THE GAP LIST FOR SOUNDS

The coordinator already opened **SOUNDS [quiet floor] THERE-IS-NO-SILENT-OUTDOORS** off my
school round, and its own text says "Pairs with EYES E12 round two." So this round adds no
new bounce-back line -- a second line for the same defect would be noise, and this lane gets
one line, not a queue. The measurement below is what that row was waiting for.

`banks/eyes/BOHEMIA_EYES_E12_GAP_LIST_9_6_26.json`, two words each, in the order I would fix
them:

1. **NOTHING PLAYS** -- with the music off the game outputs digital silence and zero events
   in ten seconds, in three places. The cooked bed has no caller. This is the whole job.
2. **NO SPREAD** -- three places measure 0.0 dB apart in every band. Until the bed exists
   there is nothing to make a place sound like itself.
3. **MUSIC CARRIES** -- the soundtrack is doing 100% of the work, and its own swing while a
   player stands still is up to 16 dB. Whatever floor arrives has to sit under that without
   fighting it.
4. **SILENCE UNCHOSEN** -- nothing in the code ever decides to be quiet. School said a chosen
   silence and a missing call sound identical from outside and only the code can tell them
   apart. Here the code says: absence.
5. **BREATHE ANYWAY** -- constant volume past 30-40 minutes causes listening fatigue and this
   is a 100 hour game, so the answer is never "turn it on and leave it on". Scatter the
   detail as randomized one-shots and keep it out of the loop.
6. **TEMPO FREE** -- rule 7's 120 BPM is not a constraint here: tempo-locked ambient
   scattering is a standard documented mode.
7. **RUNS OUT** -- hang the ambient event rate on THE-VALLEY-RUNS-OUT and the world gets
   quieter as it dies, with no new system written by anybody.

---

## BLIND SPOTS, DECLARED RATHER THAN COUNTED CLEAN

- Three spots on one surface, all outdoors. **No interior was measured**, and an interior is
  a different acoustic question. The job asked for three places and got three spots.
- Standing still is not the only quiet state. A menu, a loading beat and a shut door are
  each their own capture and none was taken.
- The music-muted captures mute one bus. A sound effect was proved to still pass through
  that mute before any conclusion was drawn from it, but a third bus, if one exists, would
  not have been caught.
- Headphones and a phone speaker are different instruments. This measures the signal, not
  the speaker.
- 44100 Hz, so the K-weighting is approximate. Irrelevant to a result of zero, and it would
  matter if this were ever used to compare two real floors.

---

## SHIP TEST FOR THIS JOB, AND WHETHER IT IS MET
The job said: measure what a player hears in ten seconds of standing still, in three places,
and hand SOUNDS the gap list. Three places, ten seconds each, measured twice over (music on
and music off), with four controls, and the gap list is written and attached to the row that
was waiting for it. **E12 is SHIPPED with both rounds.**
