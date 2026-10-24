# THE ONE BEAT (SOUNDS 10/24/26, row [more music, on the one beat], rule 158) AND THE NOTE FOR COMBAT

## HIS WORDS (10/24, LOCKED)
'every time you press a button it's a request, and the game will do those actions on the BPM of how it's supposed to be;
everything is supposed to be on this BPM clock of the music, and we totally lost sight of that in this revamp... I know
some of the songs are more like background hums and without drums, but we have made this universal BPM music thing for
a whole reason, just to give that extra layer of love.'

## WHAT WAS WRONG (measured before the change)
1. The clock was always running under a hum: the song's transport (MUS) books every sixteenth on the audio clock whether
   the song has drums or not. Nobody outside the transport could read it. The fight keeps its own clock
   (slices/BOHEMIA_FIGHT.html onBeat(), beatMs()), started from its own UI.t0, so its quarter beats have no relation to
   the song's.
2. The beat jumped every time the music changed. Three swap points (the street's CITYMUS.play, the room's takeOver, the
   MUSIC tab's PLAY), the song start with no pulse, and the stall re-anchor all put the next note at 'now + 0.06 s', a
   random phase. Measured by the gate's own net (B5): a mid-beat swap the old way lands 239 ms off the beat it left.

## WHAT SHIPPED
tools/bohemia_sounds_the_one_beat_block.js, inlined into the alpha by tools/bohemia_sounds_the_one_beat_patch.py
(idempotent), the demo cut from it (tools/bohemia_cut_the_demo.js). Gate THE ONE BEAT (gates/the_one_beat_gate.js),
12/0 on the demo.
- Every beat the transport books into the live context is stamped as HEARD (the audio context's output timestamp, so a
  phone's 10 to 40 ms and a Bluetooth speaker's 150+ ms of output delay are inside the number).
- A song swap, a song start and a stall land the new song's first note on the NEXT BEAT OF THE SAME GRID; the song's
  bar starts over with the song (step 0), the beat does not move. Measured: 0.07 ms off the old grid (was 239).
- With the drums held four seconds: 8 beats booked on the grid, worst 0.62 ms off. Stopped: the grid runs on ('held');
  started again the song comes in 0.07 ms off it.
- Every booked beat within 0.12 ms of 500 ms apart; twelve random asks within 0.14 ms of the booked beats.

## ROUND TWO OF THE SAME PART: EXACT ON THE TRANSPORT'S CLOCK, AND THE SLIP
- A swap, a start and a stall on the same audio context now count whole beats from the last booked beat on the
  transport's own clock (exact: 0.00 ms), instead of converting through the heard stamps (0.06 ms of stamp jitter).
- FOUND: the first alpha run with a song render running beside it went red with one heard gap of 530 ms. The transport
  booked that beat exactly 500 ms after the last one; the AUDIO slipped 30 ms (an underrun: the context's clock stops
  while the wall clock runs), so the beat he would hear really moved, and the grid followed it, which is the job. Alone
  on a quiet box the alpha is 12/0. The gate now holds the beat claims on the transport's clock (it cannot slip against
  itself) and COUNTS the heard slips, failing past three in four seconds. This is the phone story PLUMBER measured on
  9/18 (one beat in twelve late on a phone-shaped CPU): on a phone the heard beat slips, and a fight that reads
  BOHEMIA_BEAT at the moment of the request lands on the beat the speaker is actually playing.

## THE NOTE FOR COMBAT: EXACTLY HOW THE FIGHT READS THE BEAT
The fight runs in the iframe #fightFrame. The shell hands it the reader on its own window: `window.BOHEMIA_BEAT` inside
the fight is set by the shell on the first beat after the frame exists (and `window.parent.BOHEMIA_BEAT` is the same
object; the frame is same-origin). Read it at the moment of the request, never cache a time.

    BOHEMIA_BEAT.next(div, leadMs)   ms from NOW until the first heard grid point at 1/div of a beat that is at least
                                     leadMs from now. div: 1 beat, 2 half, 4 quarter, 8 eighth, 16 (anything else snaps
                                     DOWN to a power of two). A DELTA: true in the fight's own clock.
    BOHEMIA_BEAT.now()               { on, src: 'song'|'pulse'|'held'|'free', bpm: 120, beatMs: 500, phase 0..1,
                                       beatInBar 0..3, bar, msToBeat }
    BOHEMIA_BEAT.div(n)              the power of two n snaps to

The drop-in for the fight's onBeat (slices/BOHEMIA_FIGHT.html, the line
`function onBeat(t) { const h = beatMs() / 4; return UI.t0 + Math.ceil((t - UI.t0) / h - 1e-6) * h; }`):

    /* THE SONG'S BEAT (rule 158; the shell's BOHEMIA_BEAT, SOUNDS 10/24): a request lands on the music's own grid;
       the speed picks a finer division of the same grid, never a different clock. Standalone, its own clock. */
    function songBeat() { try { return window.BOHEMIA_BEAT || (window.parent !== window && window.parent.BOHEMIA_BEAT) || null; } catch (_e) { return null; } }
    function onBeat(t, div) {
      const B = songBeat(), d = div || 4;
      if (B) { const n = performance.now(); return n + B.next(d, Math.max(0, t - n)); }
      const h = beatMs() / d; return UI.t0 + Math.ceil((t - UI.t0) / h - 1e-6) * h;
    }

`t` stays in the fight's performance.now() ms exactly as today (UI.animEnd + beatMs() * BREATH_BEATS and the rest), so
every caller keeps working; the answer is now a point on the song's grid. THE SPEED (rule 158(b)): pick the division
from the speed, never divide the clock: 1x a quarter beat (4), 2x an eighth (8), 4x a sixteenth (16), i.e.
`BOHEMIA_BEAT.div(4 * UI.speed)`. beatMs() can keep dividing by the speed for how LONG a move plays; only WHERE it
starts goes through onBeat. AUTO and by hand go through the same onBeat, so both are requests on the same grid.

If the fight would rather keep its own grid than ask every time: every beat it also gets a message
`{ type:'BOHEMIA_BEAT', on, src, bpm, msPerBeat, inMs, beatInBar, bar, epoch }` (inMs: the next beat lands that many ms
after the message is read; epoch: the same beat in epoch ms, convert with the fight's own performance.timeOrigin:
`epoch - performance.timeOrigin` is the fight's performance.now() of that beat). Post `{ type:'BOHEMIA_BEAT_ASK' }` to
the parent for one at once (the gate measures the answer).

## WHAT IS NOT DONE HERE
The fight file is COMBAT's (rule 158, COMBAT open this round). SOUNDS did not touch slices/BOHEMIA_FIGHT.html. The run's
own beat bridge (BOHEMIA_RUN_BEAT, 7/29) is untouched; it still announces booked time, not heard time.
