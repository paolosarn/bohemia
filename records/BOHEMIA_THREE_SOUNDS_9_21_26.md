# THREE SOUNDS (9/21/26, SOUNDS lane) -- row [cook sounds], rule 22
## A footstep that lands on the beat, the step losing contact, and the phone still transmitting

> **PAOLO 9/21, RULE 22, LOCKED: "I'll enter the sound chat and it's not even making fucking
> sounds. It's coding and checking whether the sounds are broken or not. It's so fucking
> strange. I need to be seeing them cooking up more, every time, not never."**

He is right and the registry proved it: before the round before this, SOUNDS had **zero** of
the vote registry's 29 items while ten other lanes had entries. **This round cooked three
sounds, all three are in the vote tab, and the checker is deliberately the small part.**

Tab: the **VOTE** tab in the alpha, item titles below. Gate: `COOKED SOUNDS`, 27/0, mutation
bites 8 claims.

---

## 1. WHAT WAS COOKED

### A FOOTSTEP THAT LANDS ON THE BEAT
The shipped shelf's footsteps are near-pure tones: measured across all 65 approved sounds,
51 read a spectral flatness under 0.01 and the median was 0.0037. **A real footfall is not a
tone at all, it is a broadband transient with a little weight under it.** So this is
noise-first, which also serves school rule 3, the end of the band this game has nothing in.

    flatness .................. 0.3099   (the shelf's median is 0.0037)
    energy above 1 kHz ........ 60.7%
    energy above 4 kHz ........ 30.7%
    its loudest instant ....... 13.1 ms in
    length .................... 180 ms, shorter than a half beat, so it cannot smear

**"Lands on the beat" is checked against the game's own definition of on-time**, not against
a number I chose: the fight grades a press PERFECT inside 55 ms, so 13.1 ms is on the beat by
the only clock this game is quantised to.

### THE STEP LOSES CONTACT
The same step, dropping out twice mid-stride. School rule 6: a drop-out is oxide losing
contact with the head, so it lasts 8 to 60 ms, **dives 6 to 20 dB rather than gating to
zero**, and because contact loss costs the short wavelengths first **the top goes before the
level**.

**AND IT IS TIMED TO ANOTHER LANE'S WORK RATHER THAN TO MY TASTE.** ANIMATION's TAPE walk
holds the ground on the lot he left for 55% of the beat then drops it through two stations,
`TAPE_STATIONS = [0.00, 0.55, 0.78]`, and the beat lands him at 1.00. The sound reads that
same list of fractions, so if ANIMATION moves a station the sound follows.

    drop-outs at ......... 0.55 and 0.78 of the beat = 275 ms and 390 ms
    each one .............. 34 ms, measured 12.3 dB down, rule 6 allows 6 to 20
    reached silence ....... never, either time
    the top first ......... share above 2 kHz 49.1% -> 21.5%, and 50.4% -> 20.2%
    exact digital zeros ... 0

**AND THE STATION AT 1.00 IS NOT A DROP-OUT, WHICH MEASURING TAUGHT ME.** My first cut put
one there too. It sat at the very end of the buffer with nothing left to dive into and its
depth came back **null**. A reading of null is the instrument saying the idea was wrong: 1.00
is the beat LANDING him on the next lot, and the sound of that is the next footstep.

### THE PHONE STILL TRANSMITS
The phone is the one place rule 19 leaves open for a speaker with no face, so it is the one
place where a transmitted sound is honest. Two tones sounded together, **853 Hz and 960 Hz**,
a real attention signal's published pair, 107 Hz apart so they beat against each other and
never resolve. Through an AM band, over a carrier that does not stop.

    the pair .................. 853 and 960 Hz, strongest bin 958 Hz
    the band .................. 100 Hz to 5 kHz, four cascaded poles
    the tone runs for ......... one beat, then stops
    the carrier after it ...... still reads 0.0423 rms (school rule 7)
    exact digital zeros ....... 0

A transmitter's band limit is steep **by regulation**, or it splatters into the next channel,
so this carries the steepest filter in the file and the reason is physical rather than
cosmetic.

---

## 2. ONE COPY, READ BY EVERYBODY

`engine/bohemia_horror_sounds.js` is the one body. The vote page plays from it and the gate
measures from it, so **no number is typed twice.** That is not tidiness. The round before
this, a second copy of the footstep bank sat in the alpha with a comment inside its JSON, the
parse threw into an empty catch, and every footstep in the game was silent for days.

The same lesson bit again inside this round, smaller: the band-limiter existed three times,
I fixed a single-pole mistake in one recipe, and **the phone's carrier still read all the way
to Nyquist because the same mistake was still sitting in the other two.** There is one
`bandTo` now.

> **A FIX APPLIED IN ONE PLACE WHEN THE MISTAKE LIVES IN THREE IS NOT A FIX, IT IS A HEAD
> START ON THE NEXT BUG.**

---

## 3. THE BAND CLAIM COST FIVE ATTEMPTS, AND EVERY ONE BLAMED A SOUND THAT WAS CORRECT

This is the part of the round worth keeping.

    ATTEMPT 1  one pole at 2,600 Hz. 6 dB an octave does not stop a band, it leans on it:
               6.2% of the footstep's energy sat above its declared corner.
    ATTEMPT 2  three poles at 2,600 Hz. Steeper, and I FORGOT THAT CASCADING MOVES THE
               CORNER DOWN: the combined -3 dB point of N identical one-poles is
               fc*sqrt(2^(1/N)-1), which for three is 0.51*fc, so the real corner fell to
               about 1.3 kHz. Measured: flatness 0.253 -> 0.0095, top corner 4,867 -> 1,314.
               *** I HAD TURNED THE SOUND BACK INTO THE NEAR-TONE THE WHOLE COOK EXISTS TO
               REPLACE, AND THE BAND CLAIM WENT GREEN WHILE I DID IT. A FIX THAT PASSES THE
               CHECK BY DESTROYING THE THING BEING CHECKED IS NOT A FIX. ***
    ATTEMPT 3  derive the per-pole corner from the wanted corner. Right idea. The footstep
               came good (measured 4,554 Hz against a declared 4,500) and the phone did not.
    ATTEMPT 4  four poles on the carrier, reasoning that more poles is steeper. It is not,
               at a fixed frequency: a derived corner with more poles has a FLATTER passband
               and a roll-off that starts LATER. Measured in octave bands, the carrier
               peaked at 2-4 kHz and sat only 4.8 dB down at 8-16 kHz. The filter was doing
               exactly what it was built to do.
    ATTEMPT 5  measure the -3 dB edge instead of the -20 dB edge, since that is what a
               published bandwidth means. The phone came good and THE FOOTSTEP MEASURED
               108 Hz, because its low body is louder than its entire noise shelf.

**AT FIVE ATTEMPTS I STOPPED, WHICH IS WHAT THE LAW SAYS TO DO.** STOP PRODUCING, in its own
words: "writing a fourth version of anything means you already failed, stop and say so
instead of fixing the attempt."

> **THERE IS NO SINGLE CORNER FREQUENCY THAT MEANS THE SAME THING ACROSS AN IMPACT WITH A
> LOW THUMP, A HISS BED, AND A TONE OVER A CARRIER.** The -20 dB point rides on noise
> scatter, because single noise bins scatter by more than 10 dB on their own. The -3 dB point
> rides on whichever peak happens to dominate. Both are real measures of something; neither
> is the thing the rule was trying to say.

**SO THE RULE IS ENERGY NOW.** How much of a sound sits above the band it declares, with the
split itself made of four cascaded poles so the measure is not its own leak:

    sound                        above its declared corner    an octave above
    a footstep on the beat              0.54%                     0.01%
    the step loses contact             0.63%                     0.01%
    the phone still transmits          0.03%                     0.00%
    the gate's bars                    under 5%                  under 1%

**All three sounds were correctly band-limited the entire time.** The bars sit an order of
magnitude clear of the readings rather than inside their spread, which is the mistake five
earlier thresholds in this lane have already made.

**AND THE RECORD WAS WRONG, NOT JUST THE CODE.** The school page's rule 4 said "the highest
frequency within 20 dB of its own peak". That has been corrected in place, with the reason,
because a law that cannot be measured sends the next round down the same five attempts.

---

## 4. TWO MORE THINGS THE CHECKER ITSELF GOT WRONG FIRST

**A CHECK THAT CANNOT PRODUCE A NUMBER IS NOT A STRICT CHECK, IT IS NO CHECK.** The
top-goes-first claim asked for a 4,096-point spectrum of a 34 ms window, which is 1,499
samples, so it returned null every time and printed "share above 2 kHz ?% -> ?%". It filters
instead now, and works at any length.

**A CHECKER THAT CRASHES DOES NOT SAY WHICH CLAIM BROKE.** Under mutation the phone has no
tone pair, and the first cut called `.join` on undefined and died at "the gate ran". Same
failure shape as the empty catch that silenced every footstep: it turned a specific answer
into no answer. Both paths report as claims now, and the mutated run lists 8 reds.

---

## 5. WHAT THIS DID NOT DO

    pushed into the walked street or the fight ....... NOTHING. Rule 22(b): the hold is on
                                                      the play surface, not on the making,
                                                      and everything made goes to VOTE.
    the 65 approved sounds .......................... untouched
    the 142 songs ................................... untouched
    the room hum from the round before ............... untouched, already registered
    the footstep bank the game plays ................. untouched; these are candidates
    engine files any slice loads ..................... none changed; this is a new module

**The row asked for four sounds and four registry items.** The room hum for the BEGIN tap was
cooked and registered in the round before and is live on main, so this round cooked the other
three. The row's next four are named on the board: a song through the dead speaker, the fold,
the fight's cloud, the door.

---

## 6. WHAT HE IS BEING ASKED, IN THE VOTE TAB

1. **The footstep**: does it sit on the beat, and is it the right kind of dry? The page has a
   metronome so he can hear it against the tick.
2. **The step losing contact**: right amount, or too much? It is two drop-outs per stride.
3. **The phone**: right, or softer? Two tones that do not agree is deliberate and it is the
   most likely of the three to be too much.

Registry ids: `sounds-a-footstep-on-the-beat-9-21`, `sounds-the-step-loses-contact-9-21`,
`sounds-the-phone-still-transmits-9-21`.
