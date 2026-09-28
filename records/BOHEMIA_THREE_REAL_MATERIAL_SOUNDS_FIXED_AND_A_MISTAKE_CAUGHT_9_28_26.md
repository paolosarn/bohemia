# THREE REAL-MATERIAL SOUNDS HE KILLED, FIXED AT THE ROOT (9/28/26, SOUNDS lane) -- row [not sand], round five
## And a second mistake this same round: editing a judged sound in place instead of giving it a new id

> **CONTINUING [not sand] (rule 5). He voted on round four's cooks and three went down
> with real, specific words. His bugs beat the queue (VAMILY rule 8), so this round
> answers those before anything else.**

---

## 1. THE FOOTSTEP: "REVERB OF LIKE A GLASS JAR"

`footstepModelled`'s "shoe" layer was three pure sine tones (1800, 3100, 4700 Hz, an
8 ms decay), and the recipe's own comment already named it as a guess two rounds ago:
*"THE SHOE, AND IT IS THE ONE PART I PICKED... I have no published figures for a shoe,
so this is named as a guess instead of dressed up as physics."*

**MEASURED ON THE RENDERED BUFFER, NOT ASSUMED:**

    the 1800 Hz tone alone         25.0% of the loudest window's total energy
    all three shoe tones together  33.9% of it
    the ground's own 227 Hz mode    1.0%

Three isolated, inharmonically related pure tones (ratios 1.72, 2.61, 1.52 to each
other, none a simple fraction) ringing together over the same few milliseconds is the
textbook definition of a glass or bell timbre. It is the EXACT mechanism the
struck-hour bell uses on purpose (published inharmonic ratios, a clean tonal ring),
landing here by accident.

**FIXED BY DELETION.** The contact click (a monopole radiating the rate of change of
a real Hertzian force pulse) is already broadband by construction, and grit (a sum of
real tiny impacts) is already dense; between them a heel does not need three invented
tones to sound bright. Nothing replaces the layer.

    flatness       0.0081  ->  0.0858   (more texture, less ping)
    peak bin       1800 Hz (a guess)  ->  226 Hz (the slab's own published mode)

---

## 2. THE DECK AND THE FLIP: "I HATED ALL THESE NOISES"

Both share one shell (`clackInto`, `SHELL`). Measured:

    flatness              0.0000   (a near-pure tone)
    493 Hz fundamental    55.8% of the loudest window, alone

A 32 ms clean ring at `SHELL.loss = 0.02` -- the bare material's own figure, and this
shell is not free: it is held in a hand and seated against a mechanism, so it is
damped by everything touching it. Same reasoning as the footstep's own slab-on-grade
correction from two rounds ago, reused rather than re-argued.

**RAISED TO 0.22.** The fundamental now rings 2.9 ms, in the same range as the
footstep's own ground modes (0.4 to 3.5 ms). 493 Hz's share of the loudest window fell
to 15.9%, close to the footstep's own peak-bin share (11.9%) on the fix he has not yet
objected to.

---

## 3. BOTH REGISTERED AS REDOS, NEITHER PAGE NEEDED A LINE CHANGED

Rule 15b: a redo is a new id that names the old one and quotes why he killed it. The
old three ids keep their DOWN and never render again.

    sounds-a-footstep-that-is-not-glass-9-28
    sounds-the-deck-does-not-ring-9-28
    sounds-the-flip-is-a-knock-not-a-chime-9-28

Both judge pages read the shipped recipe live, never a copy, so neither needed
editing. Verified on the glass: 3 of 3 and 10 of 10 buttons play, 0 page errors.

**A SECOND DOWN ON ANY ONE OF THESE THREE ENDS IT FOR THE SESSION** (STOP PRODUCING).
This is the first redo of each.

---

## 4. THE HUM-PITCH FIX, AND A MISTAKE CAUGHT BEFORE IT SHIPPED

Item 1 of last round's own NEXT list: `generator` (51.87 Hz, 13.6% off 60),
`power_on` (90.47 Hz, "near neither" 60 nor 120) and `sign_alive` (123.27 Hz, 2.7% off
120) all hum off the grid's own pitch.

**BUILT THE FIX, MEASURED IT CLEAN, ALMOST SHIPPED IT WRONG.** `generator` -> 60 Hz
(a 2-pole alternator at 3,600 RPM makes 60 Hz mains BY the shaft speed, not by choice),
measured 60.5. `power_on` -> 115 Hz static with its rising slide kept, measured
119.6 Hz, 0.3% off 120 (a transformer/ballast on the public grid). Both under 1%.

**`sign_alive` EXPOSED A REAL FLOOR, NOT A MISSED NUMBER.** This recipe is
`synth:'instrument'`, a borrowed sample voice, and `bodyInstrument()` rounds `hz` to
the nearest SEMITONE of a 220 Hz reference before pitch-shifting the sample. Proved by
feeding two different static `hz` values through two different jit ranges and getting
the identical 123.273 Hz back both times. The nearest semitone to 120 Hz on that grid
is 123.47 Hz, 2.89% away; the next one down is 116.54, 2.88% the other side. There is
no semitone within 1% of 120 at all -- a sample voice snapped to this grid has a floor
no jit range can cross.

**AND THEN I EDITED A JUDGED SOUND IN PLACE, WHICH THIS LANE'S OWN GATE EXISTS TO
CATCH.** All three hums are APPROVED (`generator`:[0,1,2,3], `power_on`:[0,4],
`sign_alive`:[4] in `__SFX_APPROVED`), and `verdict_frozen_gate.py` -- written 8/16,
after Paolo said *"I didn't see the new sound effect"* and thirty of his thumbs turned
out to be silently reassigned to a different sound under the same id -- is explicit:
*"The fix for a red is never to re-bless the file: it is to give the new sound a NEW
EVENT ID."* I ran `sfx_render_gate.py --record` first (which DOES offer a `--record`
flag for exactly this kind of drift) and only afterward ran `verdict_frozen_gate.py`,
which failed on all nine judged candidates: *"A judged id changed what it sounds
like. Do NOT re-bless."*

**CAUGHT BEFORE THE COMMIT WENT TO MAIN, REVERTED CLEANLY:** the fingerprint
re-record was discarded (`git checkout --`), and the three recipe blocks were
restored to their exact pre-round text from the parent commit. Re-ran both gates:
`verdict_frozen_gate.py` 6/0, `sfx_render_gate.py` clean. The diff against the
previous commit is now a pure subtraction -- nothing else touched.

**THE LESSON, WRITTEN DOWN SO IT IS NOT RELEARNED:** `sfx_render_gate.py`'s own
`--record` flag is real but it answers a DIFFERENT question (did an engine refactor
accidentally change a sound nobody meant to touch) than `verdict_frozen_gate.py`'s
question (did a sound Paolo already thumbed change what it sounds like). The second
gate is newer (8/16 vs 7/29) and it is the one written specifically for pitch/timbre
edits to approved content. Any future edit to a `RECIPE` entry with a nonempty
`__SFX_APPROVED` list needs a NEW event id, not an in-place change, no matter how
correct the physics is. **THE RIGHT FIX, NOT BUILT THIS ROUND:** either three new
event ids in `bohemia_sfx.js` with the corrected pitch as fresh unjudged candidates,
or -- better, since the current VOTE TAB is the one authoritative judge surface and
the old MUSIC-tab SFX sheet predates that consolidation -- three small hum recipes in
`bohemia_horror_sounds.js` (this file already has the physical-modelling machinery
and the VOTE tab integration this round used four times), sidestepping the frozen-id
question entirely by never touching the old system.

---

## 5. GATES

    COOKED SOUNDS 134 ok / 0 failed, --mutate bites 37 (footstep/deck/flip fixes)
    FOOTSTEP GATE 24/0
    VERDICT-FROZEN GATE 6/0 (after the revert; was 1 FAILED on all 9 judged hum candidates)
    SFX RENDER GATE clean (after the revert; was 18 FAILED, drift on generator/power_on/sign_alive)
    ANALOG HORROR SOUND 11/0 (generator, power_on now print as KEEP in the list; sign_alive
    correctly still prints as REDO at its true measured value, since it was reverted)
    Both judge pages (footstep, deck+flip) verified 3/3 and 10/10 buttons playing, 0 errors.
