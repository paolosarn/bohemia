# A TAPE DECK IS NOT MADE OF HISS (9/27/26, SOUNDS lane) -- row [not sand]
## The two sounds he killed, rebuilt out of the machine's own geometry, and the four rulers that lied on the way

> **PAOLO 9/23, ON BOTH OF THESE:** *"it all sounded like sand"* (the tape, DOWN) and
> *"kinda dogshit"* (the flip, DOWN). **RULE 32e** makes the band-limited-noise **recipe**
> the graveyard, not the individual sound, so both come back as NEW ids from real material
> (rule 15b). The recipe does not come back at all.

---

## 0. FIRST, A DATE ON THIS LANE'S OWN BOARD WAS WRONG, AND IT MATTERED

The registry id of the killed flip is `sounds-what-a-flip-sounds-like-9-25` and the board
said SHIPPED 9/25. **His verdict on it is dated 9/23.** A vote cannot predate the item it is
about, so one of the two was wrong, and before building anything this round I checked which:

    git log f8b3280      the flip sound really shipped   9/23
    the verdicts export  he voted it down                9/23

**SO THE SOUND AND THE VOTE ARE BOTH 9/23 AND THE "9/25" IS A LABEL THIS LANE TYPED AHEAD OF
ITSELF**, in the id and on the row. That is not cosmetic. It decided what I was allowed to
build: if the down were a SECOND down on the flip, rule 32e and STOP PRODUCING end the flip
for the session and a third version is the violation. It is the FIRST down on the flip, and
the second rejection belongs to the **noise recipe** (the run, the tape and the flip in one
batch), which is why a re-cook from real material is legal and another noise-built sound is
not.

> **THE RULE I WAS ABOUT TO GET WRONG BY READING A SUMMARY INSTEAD OF THE PRIMARY SOURCE.**
> The board's own sentence, "three DOWN in one batch: the tape, the run, the flip", read at a
> glance, plus a fresh-looking down on a flip id, says second rejection, stop. The export of
> his actual taps says otherwise. A ruling is what he tapped, not what a row says about it.

---

## 1. WHAT A CASSETTE DECK IS ACTUALLY MADE OF

Four things, and hiss is not among them:

    1. PLASTIC BEING KNOCKED       the lever, the head assembly, the shell seating
    2. THE SPEED NOT HOLDING       wow and flutter, ON the programme, not beside it
    3. THE TAPE COMING UP TO SPEED a real deck sweeps UP over about a tenth of a second
    4. THE SIGNAL GOING AWAY       a drop-out is oxide LOST, so it is silence, not noise

> **THE HISS EVERYBODY REACHES FOR IS THE TAPE'S NOISE FLOOR, WHICH IS THE ONE PART OF A
> CASSETTE A PHONE SPEAKER IN A DEAD VALLEY WOULD NEVER REPRODUCE**, and it is the part this
> lane reached for three times running.

---

## 2. EVERY RATE IN THE SOUND IS THE WHEEL'S OWN GEOMETRY

The Compact Cassette standard fixes the tape speed at 1 7/8 inches per second, which is
**4.7625 cm/s exactly**. A wheel's rotation rate is that speed over its circumference, so
there is nothing left to choose:

    capstan          2 mm across   ->  7.5798 rev/s    THE FLUTTER RATE
    pinch roller     6 mm across   ->  2.5266 rev/s
    hub, empty      22 mm across   ->  0.6891 rev/s    THE WOW RATE AT THE START OF A SIDE
    reel, full      38 mm across   ->  0.3989 rev/s    THE WOW RATE AT THE END OF ONE

> **AND THAT LAST PAIR IS THE WHOLE SOUND. THE WOW RATE FALLS AS THE SIDE PLAYS**, because
> the tape piling onto the take-up reel makes it fatter, so it turns slower for the same tape
> speed. A deck at the end of a side breathes slower than the same deck at the start. That is
> why a tape sounds **tired** rather than **broken**, and it costs one parameter to be true
> instead of invented.

**MEASURED ON A STEADY TONE THROUGH THE DECK'S OWN SPEED FUNCTION**, five points across a
side, the geometry against the sound:

    through   the geometry says   the sound says   disagreement
    0.00           0.6891 Hz         0.6912 Hz        +0.31%
    0.25           0.6165            0.6159          -0.10%
    0.50           0.5440            0.5424          -0.30%
    0.75           0.4715            0.4740          +0.54%
    1.00           0.3989            0.3971          -0.47%

And each wheel on its own: the reel reads **0.349% at 0.6453 Hz** against its own 0.6455, the
capstan **0.080% at 7.5782 Hz** against its own 7.5798.

**WHAT THIS REPLACES:** the wobble rate in this file was **1.4 Hz**, which is inside school
rule 5's window and **corresponds to no part of any machine**. It was a number somebody liked.

---

## 3. FOUR RULERS LIED THIS ROUND AND THE CONTROLS CAUGHT ALL FOUR

This is the part of the round worth keeping.

**(a) FLATNESS CANNOT TELL MY NEW SOUND FROM THE ONE HE KILLED.** The spectral flatness of
the tape he called sand reads **0.0000**; the flatness of the new deck reads **0.0000** too.
Both numbers are correct and both are useless, because the loudest window of either sound is
a musical note. Last round flatness was the right ruler (the sand footstep really was mostly
noise); this round it is the wrong one.

> **SO FLATNESS IS DELIBERATELY NOT THE EVIDENCE HERE, AND THE GATE SAYS SO ON ITS FACE.**
> A ruler that cannot separate two things proves nothing about either of them. The honest
> check is structural: does the shipped function call the noise generator at all.

**(b) MY WOBBLE RULER READ A 318% PITCH SPREAD ON A SONG.** I measured zero crossings per
20 ms block on the deck's own output. A tune changes notes every 460 ms, so what I measured
was the tune. **A WOBBLE IN A READ SPEED CANNOT BE MEASURED ON A TUNE.** That is what
`wowProbe` already existed for, and the fix was to reuse the lesson: a steady tone through
the same speed function.

**(c) THEN THE SAME RULER READ 2.85% ON A TONE WITH THE WOBBLE SWITCHED OFF.** Counting
crossings in a 20 ms block at 440 Hz gives about 17.6 of them, so one crossing either way is
5.7%: **the ruler's own resolution was eight times the 0.35% it was aimed at.**

> **THE CONTROL IS THE ONLY REASON THAT NEVER REACHED A RECORD.** I ran it first this time
> because of what the band ruler cost two rounds ago, and it came back reading the same
> number with the thing switched off as with it switched on. Three "measurements" went in the
> bin in one step.

**(d) AND THE RATE RULER THAT DID WORK STILL COULD NOT SEE THE DRIFT.** The gate's proven
wow analyser takes a 1024-point transform of the frequency track, one bin of which is
440/1024 = **0.43 Hz**. The drift being claimed is 0.689 down to 0.399 Hz, which is
**0.29 Hz: smaller than one bin.** On that ruler the three rates read 0.859, 0.430 and
0.430 Hz, which are two bins, one bin and one bin.

> **THREE NUMBERS THAT LOOK LIKE A MEASUREMENT AND ARE THE RULER'S GRID.** At 8192 points one
> bin is 0.054 Hz and the peak is interpolated, and the same three rates then agree with the
> geometry to within 0.54%.

---

## 4. WHAT SHIPS

**ITEM ONE, THE DECK IS NOT THE HISS.** Press play: the lever, the head and roller arriving
**45 ms** later, then the song sweeping up to speed. Two knocks and not one, because one knock
is a button and two are a machine. The knock is the shell's own plate modes off the same
function the footstep uses (**polystyrene, 1.2 mm walls, 64 mm across: lowest mode 493 Hz,
ringing 32 ms, ten modes**), so no third copy of that idea exists. The song sits **4.7 dB
under the clunk** in rms, which is what a mechanical clunk really does next to music.

    the spin-up, measured on a 4 kHz probe, as a percentage of final speed
      first 100 ms   40.5%      first 200 ms   71.2%
      first 400 ms   94.5%      after 2.5 s   100.0%
      THE CONTROL with the ramp switched off reads 100.0% in the first window

**A reads 0.358% of wobble, inside school rule 5's 0.15 to 0.60%. C, the worn deck, reads
0.635% and is OUTSIDE it, which is what worn means:** a deck that tired is a deck outside the
spec the standard sets for it. **I wrote "still inside rule 5" in the recipe first and the
measurement said otherwise**, so the comment now carries the number.

**ITEM TWO, A FLIP IS A TAPE CHANGING.** The law already said a flip is a tape changing; this
is that, and not a picture of it. **It is one tap and always available, so he hears it
hundreds of times, and the failure mode is not "too quiet", it is "I am sick of it".** So: two
knocks 155 ms apart, **0.500 s against a 0.5 s beat**, no riser, no whoosh, no sting.

> **AND IT IS HONEST ABOUT WHAT IT IS NOT.** A real tape change takes several seconds. This is
> the last part of one, the part you actually hear. Option C is the fuller three-knock version
> and it runs **0.655 s**, so it is **marked as not fitting a beat rather than trimmed to look
> like it does**.

**AND IT DECLARES NO BAND AT ALL.** The killed flip published a 5,000 Hz AM ceiling while its
own gap was built wider-banded than any AM channel on purpose, so the number it published
never described the sound. This one is heard with your ears in the room, so there is nothing
to be wrong about.

---

## 5. A DEFECT IN A SOUND HE APPROVED, FOUND BY A RULER BUILT FOR SOMETHING ELSE

Checking that my two new sounds do not end on a step, I measured the neighbours:

    songThroughSpeaker (he voted UP)   ends at 0.050992   biggest step in it 0.1074
    songOnTape (he voted DOWN)         ends at 0.069033   biggest step in it 0.1027
    the deck (new)                     ends at 0.000000   biggest step in it 0.5767
    the tape change (new)              ends at 0.000000   biggest step in it 0.6197

**THE SONG HE VOTED UP ENDS ON HALF OF ITS OWN BIGGEST STEP, WHICH IS A CLICK AT THE END OF
AN APPROVED SOUND.** It is named here and in the gate's own claim text and **not quietly
patched**, because changing a sound he approved is a REDO by this row's own ruling and it is
not this round's row. It is first on the next list.

---

## 6. WHAT THIS ROUND DID NOT DO

    touched the noise recipe          NOTHING. It is the graveyard (rule 32e), and the
                                      broadcast that leans on it is still out of his queue.
    fixed the approved song's tail    NOT DONE, named in section 5. A 12 ms fade on a sound
                                      he already approved is a redo, not a tidy-up.
    wired the flip to DYNASTY's flip  NOTHING. The sound exists before the surface needs it;
                                      when the flip lands, this is what it plays.
    re-cut the demo                   NOTHING (rule 14a: only RUN cuts it).

## 7. GATES

    COOKED SOUNDS   125 ok / 0 failed, and --mutate turns 38 claims red (was 27)
    the mutation for these two is precise and it is three falsifiers in one:
      the deck is given the hiss everybody reaches for, so the structural claim can fail
      both wobbles go to zero and the tape starts AT speed, so nine claims can fail
      the tape change becomes ONE knock, which is a button and not a mechanism
    and one claim only became a claim when it was shown the wrong deck: THE MECHANISM IS TWO
    KNOCKS stayed green under the first mutation because nothing reached the deck's knock
    count, so the recipe now takes a `knocks` parameter that exists for the falsifier alone.
    PAGE  slices/BOHEMIA_THE_DECK_AND_THE_FLIP_9_27_26.html, 10 of 10 buttons play,
          0 page errors, 0 number blocks empty or reading undefined, verified on the glass.
