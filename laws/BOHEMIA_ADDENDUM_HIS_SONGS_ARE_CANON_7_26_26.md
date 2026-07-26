# BOHEMIA ADDENDUM — HIS SONGS ARE CANON, AND THE MACHINE CHECKS IT (Paolo 7/26/26)

> "Well, first off you're not editing any of the actual songs right, like you're
> just editing bullshit and the different layers right, like I don't want you
> touching the actual songs themselves, bro."
> — Paolo, 7/26/26

LOCKED. This is a ruling, and per A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED it
ships with its gate the same turn.

---

## 1. THE LAW

**No session edits one of Paolo's approved songs quietly. Ever.**

The songs are CONTENTS. They are his, judged by his ear in the studio, and they
are not raw material for somebody's feature to improve. A session that finds a
song inconvenient does not fix the song; it fixes its own layer, or it stops and
asks.

This is MECHANISM-MINE / CONTENTS-PAOLO'S applied to audio, and it is the same
shape as RIG LAW ("Paolo's painted regions are SACROSANCT: never reshape, mesh,
mirror, or fix region geometry") and the byte-locked visual constitution. The
pattern repeats because it keeps being the thing that goes wrong.

**THE LAW IS NOT A BAN ON NEW MUSIC.** The music lane cooks new songs and that is
its entire job. What is banned is a song changing SILENTLY — as a side effect of
a feature, a bad merge, or a session deciding a creeper would feel better with a
straighter kick. A song may change. It may never change quietly.

## 2. WHAT COUNTS AS "THE SONG"

Locked, because it is what he judged:

| body | what it is |
|---|---|
| `OVERWORLD_SONGS` | the 6 encounter creepers: every note, pattern, key, kit, lead voice |
| `MLOOPS` | his 46 approved vibe songs |
| `MFACTIONS` | the 28 faction song slots, all CANON |
| `SONG_ARR` / `SONG_ROOT` | the 7/3 TWO MINUTE LAW form and its key movement |
| `synthV` / `drumV` | the voice banks every song is played with |
| the 2-kill and 4-kill rungs | his 7/3 LOCKED intensity law |
| `klay` layer styles | how each song intensifies in its own way |

NOT locked, deliberately, or the next session cannot ship a mix change without a
fight:

- layers that play ALONGSIDE the songs (the v75 FIGHT PULSE),
- when the shuffle swaps a track (v76),
- the metronome, the UI, the readouts.

Those are mechanism. They are mine and they are supposed to move.

## 3. THE GATE

`gates/song_lock_gate.js`, registered in the fleet suite as **SONG LOCK**.
20 checks, 0 fail.

Every locked body is byte-hashed against `records/BOHEMIA_SONG_LOCK.json`. **If a
hash moves and the manifest does not, the build fails**, and the failure prints
what changed, how many bytes, and both options in plain English.

Changing a song legitimately means running `node gates/song_lock_gate.js --write`
and saying why in the commit. That puts the change in the diff where Paolo can
see it, instead of inside a 32MB base64 blob where nobody would ever notice.

**IT WAS PROVEN BY TAMPERING, NOT BY ASSERTION.** SLOW CREEP's kick was edited
from its canon `[0,10]` to a four-on-the-floor `[0,4,8,12]` — precisely the
change he is worried about someone making — and the gate failed the build:

```
FAIL UNTOUCHED: OVERWORLD_SONGS (1359 bytes)
     expected md5 e68552af654b3beb5272c220167a2bec
     found    md5 8c6269dd0e9376e27c6a20c06a12f2ad
     IF IT IS NOT INTENDED: something edited Paolo's canon music. Revert it.
```

The tamper was then reverted and the alpha verified clean against git.

## 4. THE RECORD FOR THE WORK THAT PROMPTED THE QUESTION

v75 (THE FIGHT PULSE) and v76 (THE SONGS PLAY OUT) changed **zero bytes** of any
song. Verified by hashing every music body at `70e2061` (before the work) against
the shipped build:

```
OVERWORLD_SONGS   e68552af654b3beb5272c220167a2bec -> e68552af654b3beb5272c220167a2bec
MLOOPS            6c5ccf3608a340a277ef16fd269261d4 -> 6c5ccf3608a340a277ef16fd269261d4
MFACTIONS         81c64ebcce5636ee6265e9f72becbb4b -> 81c64ebcce5636ee6265e9f72becbb4b
synthV            619d9629f37beef9eeb2dc07dbbc6670 -> 619d9629f37beef9eeb2dc07dbbc6670
SONG_ARR / SONG_ROOT / songCtx / drumV / the rungs / klay   all IDENTICAL
```

What those two versions actually did: added a separate drum layer that plays
alongside (switchable OFF, at which point the track is byte-for-byte what it
always was), changed WHEN the shuffle hands over the next song, replaced a 415Hz
UI beep with an existing drum voice, and corrected display text and gate
arithmetic.

## 5. THE LESSON

He should not have to ask, and when he does ask, the answer should not be a
promise. It should be a hash. **A rule I merely intend to follow is not a rule;
it is a habit, and habits are exactly what the graveyard sweep of 7/16 found
broken six times over.** The moment he expressed the worry, the worry became a
gate.
