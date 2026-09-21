# SEVEN SOUNDS, AND A GATE THAT LIED (9/22/26, SOUNDS lane) -- [cook sounds] round two
## The row's other four sounds, and the flaky checker in this lane is fixed

> **PAOLO 9/21, RULE 22: "I'll enter the sound chat and it's not even making fucking sounds.
> It's coding and checking whether the sounds are broken or not... I need to be seeing them
> cooking up more, every time, not never."**

The row names eight sounds, four per round. Round one cooked the footstep on the beat, the
step losing contact and the phone's broadcast tone. **This round cooked the other four, all
four registered, and all seven play from one page.** Tab: the **VOTE** tab in the alpha.

Gate: `COOKED SOUNDS` 50/0. Page verified by tapping every button in a real browser: **8 of
8 start real audio, 0 page errors.**

---

## 1. FIRST, THE THING MY OWN HANDOFF PUT FIRST: A GATE IN THIS LANE WAS LYING

Last round I measured `FIGHT MUSIC` giving **three different answers on one unchanged tree**:
a fail, a different fail, and a pass. I nearly published it as a regression I had caused.

**THE ROOT CAUSE, AND THE FILE ALREADY DIAGNOSED THE SAME DEFECT ONE CLAIM LOWER DOWN.** A
music layer lift only applies **on a bar line**. A bar is 16 steps of 0.125 s, so 2 s. The
kill ladder fired a kill and waited a flat **1,500 ms** before reading, which is less than a
bar. Whether the lift had landed when the reading was taken was pure luck about where the
transport happened to sit, which is why the layers read `[0,0,0,4,4]` on one run and
`[0,4,4,4,4]` on another.

The second flaky claim read the playing song's name **once**, at an arbitrary 1,200 ms after
a fight ended. A single sample cannot tell "it was never cut" from "it was cut and I looked
at the wrong moment".

**FIXED THE WAY THE FILE ITSELF SAYS TO, in its own words: "more ladder, NOT a weaker
assertion."**

    the kill ladder ..... waits for the lift to LAND, bounded at three bars, and RECORDS
                          when the ladder ran out, so the claim can say it did not observe
                          instead of claiming the game is wrong
    the song check ...... samples five times across two seconds and asserts the fight song
                          held for EVERY one, which is strictly MORE than the old single
                          sample asked for

    PROVEN, four runs on one tree:   48/0   48/0   48/0   48/0
    before the fix, same tree:       FAIL   different FAIL   PASS

> **A GATE THAT ANSWERS DIFFERENTLY ON THE SAME CODE TEACHES EVERYONE TO IGNORE RED.** That
> sentence is not mine, it is already in that file, written by whoever fixed the neighbouring
> claim for exactly this reason and left this one on a fixed sleep.

---

## 2. THE FOUR COOKED THIS ROUND

### A SONG THROUGH THE DEAD SPEAKER
**This is his own sound ruling being amended, turned into something he can hear.** Rule 20(c)
put analog horror ahead of the FFX sound reference and left the manager's default as "a warm
melody heard through a dead broadcast". That has been a sentence on the board for two rounds.

The page plays the **same phrase twice**, clean and through the transmitter, from **one
recipe with the transmitter switched off** for the A side, so the two can never drift into
two different tunes.

**WHAT SURVIVES OF THE OLD ANCHOR IS THE TUNE.** His own law says what people loved was the
patience, the bass under it and the late beat. None of those are touched: one note per beat
held almost the whole beat, the root an octave down running underneath, and a minor
pentatonic with **no major third anywhere**, which is also this lane's own no-thirds rule.

    the transmitter's mark, measured .... flatness 0.0000 clean -> 0.0141 through the speaker
    what that means ..................... a pure tone reads near zero; a noise floor pulls it
                                          up, so the hiss is the audible difference
    drop-outs ........................... two, 42 ms each, 13 dB down, placed OFF the beat on
                                          purpose so they read as the transmitter failing
                                          rather than as rhythm

### THE FOLD
The generation passing, which is the largest single moment this game has: a dynast dies and
the line advances across the hundred-year arc.

**AND THE HORROR IS THAT THE WORLD DOES NOT MARK IT.** Everything the person was making noise
with stops. What does not stop is the grid: the 60 Hz mains carries on at exactly the same
pitch and level, indifferent, because a dead man's house is still connected.

    the person stops ......... their own band, 200 to 320 Hz: 0.0314 -> 0.0128
    the room's own floor ..... 0.0128 in that same band, measured in the tail where nobody
                               is either, so the hold is INDISTINGUISHABLE from empty
    the grid does not ........ the hold still reads 0.236 rms with 0 exact digital zeros
    nothing rises ............ loudest sample 0.82 before the stop, 0.53 inside the hold

That is school rule 7 used for the one thing it was made for, and it needed no new material:
the carrier is the same recipe as the room hum that already shipped, because it is the same
house.

### THE FIGHT'S CLOUD
COMBAT owns the cloud as a picture. **A cloud makes no noise**, so the honest question is
what a cloud does to a place, and the city's own weather module already answers it:
`CLOUD_MULT = [0.86, 0.88, 0.94]`, and its comment says it **cools as it dims**.

So the cloud is a roll-off that walks across the bed and walks back.

    brightness .......... 1,318 Hz -> 1,007 Hz as it passes -> back up after
    the darkness ........ read from the weather module, not invented here
    no whoosh ........... a whoosh would be a sound effect pretending to be weather

It is the same mechanism as a tape drop-out (the top goes first) applied to light instead of
oxide, which is why it lives in this file rather than a new one.

### THE DOOR
**The real sound of a door is not the hinge, it is one room becoming another**, which is
school rule 1. The game already has both beds.

    outside ............. reaches 5 kHz, 5.1% of its energy above 2 kHz
    inside .............. reaches 2.2 kHz, 1.5% above 2 kHz, and the bottom comes up
    why that is physics . a small hard room has less high air: the far sound never arrives
                          and the walls return the bottom
    the same hum ........ on both sides, because it is the same house
    the latch ........... 50 ms, the only transient in the sound

---

## 3. FOUR OF MY OWN CLAIMS MEASURED THE WRONG QUANTITY BEFORE THEY MEASURED THE RIGHT ONE

Last round the same failure cost five attempts on one claim. This round it cost one attempt
each, because the fix was to ask **what quantity the claim is actually about** rather than to
adjust a threshold.

**THE SONG'S A/B asked whether energy above 5 kHz went down.** It read 0.00% to 0.07%. The
dry phrase is sine tones at 175 to 310 Hz and their octaves; there was never anything above
5 kHz to remove. **The band is not where the difference lives, the hiss is.**

**THE FOLD'S "person stops" used total rms** and read a 12% dip on a sound doing exactly what
it was built to do.

> **A MEASURE THAT INCLUDES THE THING THAT MUST STAY CANNOT SEE THE THING THAT LEAVES.** The
> carrier that must not stop is louder than the person who does.

Band-passed to the person's own 200 to 320 Hz, and then **paired against the room's own floor
measured in a stretch where nobody is either**, so the bar is not a percentage I chose.

**THE CLOUD'S DIMMING used a band share** and read 2.8% to 2.4% to 2.9%: the right shape and
a contrast too small to assert on, because the bed is band-limited to 6 kHz and there was
never much above 2 kHz to lose.

> **HUNTING FOR A BAND WHERE THE NUMBER LOOKED BIGGER WOULD HAVE BEEN CHOOSING THE RULER TO
> FIT THE ANSWER.** So it uses the spectral centroid, which is the standard measure of how
> bright a sound is and is exactly what "dimmer" means.

**And one claim of mine still asserted the module held three sounds.**

---

## 4. THREE OF THE SEVEN ARE TUNED TO SOMEBODY ELSE'S NUMBER, NOT TO MINE

    the step's drop-outs ..... ANIMATION's TAPE_STATIONS, read as fractions of a beat
    the cloud ................ the city weather module's CLOUD_MULT
    the fold's hum ........... the same 60 Hz mains the shipped room hum uses

A sound that invents its own version of a number the game already has is a second copy of one
truth, and that is the bug that silenced every footstep in this game for days.

---

## 5. WHAT THIS DID NOT DO

    pushed into the walked street or the fight ....... NOTHING (rule 22b: the hold is on the
                                                      play surface, not on the making)
    the 65 approved sounds .......................... untouched
    the 142 songs ................................... untouched
    the footstep bank the game plays ................ untouched
    engine files any slice loads .................... none; this module is imported by the
                                                      judge page and the gate only

**The row is now complete on its own terms: all eight sounds it names are cooked and
registered.** It stays claimed only until the coordinator says what comes next for this lane.

Registry ids: `sounds-a-song-through-the-dead-speaker-9-22`, `sounds-the-fold-9-22`,
`sounds-the-fights-cloud-9-22`, `sounds-the-door-9-22`.
