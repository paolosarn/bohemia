# THE SAND WAS ONE FILTER (9/24/26, SOUNDS lane) -- [band helper], inside [not sand]
## Every noise sound in the game leaned on it, it leaked a third of each one, and fixing it
## corrected a sentence this lane wrote twice and quoted three times

> **PAOLO 9/23 IN THE TAB:** *"it all sounded like sand"*, *"NOT THIS SAND SOUNDING SHIT
> LIKE IM ON THE Beach"*, *"kinda dogshit"*. Three sounds down in one batch.
>
> **RULED (coordinator 9/24), row [band helper]:** *"fix the helper at the nominal corner,
> re-render every noise sound, and register each one that CHANGED as a REDO quoting his up
> vote; an approved sound that breaks the lane's own rule is a redo, not a keep."*

---

## 1. WHAT THE HELPER WAS DOING, MEASURED ON AN HONEST RULER

`bandTo` is the one band-limiter every recipe in this module calls. It took the corner a
person means and **derived a HIGHER per-pole corner** so that the combined -3 dB point would
land on the number asked for. Mathematically that is correct about the -3 dB point and it is
useless about everything else: the roll-off had barely begun at the corner.

Measured on white noise through an FFT band sum, declared corner 5,000 Hz:

    design                        -3 dB     energy above 5 kHz    above 10 kHz
    derived, 2 one-poles          5,383          37.9%               17.4%    <- shipped
    derived, 4 one-poles          5,728          35.8%               14.1%
    derived, 8 one-poles          6,471          39.3%               15.8%
    one-poles AT the corner, 4    2,231           3.4%                0.3%
    one-poles AT the corner, 8    1,542           0.16%               0.0007%
    BUTTERWORTH order 2           4,996          14.2%                1.05%
    BUTTERWORTH order 4           4,998           6.05%               0.019%
    BUTTERWORTH order 6           4,998           3.69%               0.0005%
    BUTTERWORTH order 8           5,001           2.65%               0%       <- ships now

School rule 4 asks for **under 5% above the corner and under 1% an octave above it.** The
thing that shipped read **37.9% and 17.4%**.

---

## 2. AND THAT TABLE CORRECTS A SENTENCE I WROTE TWICE AND QUOTED THREE TIMES

> **"MORE POLES AT A DERIVED CORNER HAS A FLATTER PASSBAND AND A ROLL-OFF THAT STARTS
> LATER, SO MORE POLES MAKES IT WORSE."**

That sentence is in the module's own comments, in the flip's record, and on the VAMILY board.
**It is false.** Derived at 2, 4 and 8 poles all sit between 35.8% and 39.3%, and the 4-pole
version is the **best** of the three. The pole count was never the story. **The derived corner
was the whole story.**

The earlier reading came off a ruler that cascaded four one-pole **high**-passes at the
frequency it named, and cascading raises a high-pass's corner exactly as it lowers a
low-pass's: four poles at fc turn over at **2.299 x fc**. So "the share above 5,000 Hz" was
really the share above 11,500 Hz.

> **A FINDING TAKEN WITH A BROKEN RULER IS NOT A FINDING.** This one survived three records
> before anybody re-measured it, and it shaped two rounds of work: it is why two recipes were
> carrying their own extra poles as a patch.

**AND THE ROW'S OWN WORDING WOULD HAVE BEEN THE OTHER MISTAKE.** "Fix the helper at the
nominal corner" taken literally gives four one-poles at 5 kHz turning over at **2,231 Hz** --
the band destroyed and the life filtered out of the sound, which is a failure this lane
already shipped once and had to revert. Said out loud rather than followed blindly.

---

## 3. WHAT SHIPS: A REAL FILTER

Cascaded biquads with **Butterworth** Q values, at the nominal corner, order 8 by default.
Flat to the corner, the -3 dB **on** the number (5,001 Hz against 5,000 asked, measured with
an impulse), then 48 dB an octave.

**AND ORDER 8 IS NOT A COMPROMISE, IT IS THE REALISTIC NUMBER:** a broadcast mask is steep
**by regulation**, because a transmitter that leaks splatters into the next channel. The
order carries **a floor of 6**, because order 4 measures 6.05% against a 5% bar, so a caller
can ask for more and never for less. **A knob that can only be set wrong is not a knob.**

**THE BOTTOM END IS DELIBERATELY UNTOUCHED**, one one-pole high-pass exactly as before. The
defect measured is above the corner, and moving two ends at once would make his next verdict
unreadable. Same reasoning that left the room's duck alone when he ruled on its level.

**AND THE TWO PATCHES ARE GONE.** The flip and the broadcast each carried their own extra
poles to plug what the helper leaked. A fix in one place when the mistake lives in the shared
part is a head start on the next bug, which is this file's oldest lesson, and it was being
broken by the file itself.

---

## 4. EVERY SOUND CHANGED, AND HERE IS EVERY NUMBER

    sound                    above its own band        brightness        changed
    a footstep on the beat   27.55%  ->  3.32%       3,604 -> 1,607       yes
    the step loses contact   28.85%  ->  3.37%       3,765 -> 1,661       yes
    THE DOOR                 15.96%  ->  1.63%       2,196 ->   831       yes   he voted UP
    THE FIGHT'S CLOUD         6.06%  ->  0.84%       1,216 ->   779       yes   he voted UP
    THE ROOM                  5.56%  ->  0.54%         813 ->   317       yes   he voted UP
    A SONG THROUGH THE SPEAKER 1.41% ->  0.14%         449 ->   331       yes   he voted UP
    THE FOLD                  1.48%  ->  0.13%         333 ->   198       yes   he voted UP
    THE PHONE                 0.48%  ->  0.05%         960 ->   923       yes   he voted UP
    the tape is slipping      1.05%  ->  0.12%         403 ->   328       yes
    the broadcast             0.008% ->  0.05%         906 ->   918       yes
    a footstep that is not sand  no band              2,264 -> 2,264      no    (no noise in it)

**SIX OF THE SEVEN HE VOTED UP CHANGED.** Every one of them is a REDO by the coordinator's
own ruling, and one item puts them in front of him rather than six, because he has already
told this lane what a queue full of near-identical asks feels like ("7 options here man wtf").

---

## 5. *** AND THE FINDING OF THE ROUND: THE SAND-BUILT FOOTSTEP WAS ONLY EVER NOISE BECAUSE
## OF THE LEAK ***

    flatness, the measure of how noise-like a sound is
      with the leaking band     0.2283
      with an honest band       0.0003        a 748-FOLD FALL

> **WHAT MADE THAT SOUND READ AS NOISE AT ALL WAS THE ENERGY SITTING OUTSIDE THE BAND IT
> CLAIMED.** Inside an honest band the noise recipe is a dull thud, not a footfall.

He killed it for sounding like sand. The measurement now says it was **never a footstep**: it
was a filtered hiss whose only texture lived above its own limit. That is the strongest
possible argument for the modelled footstep that landed last round, and it arrived by
accident while fixing something else.

It also flipped one of my own gate claims on its head. The claim asked for the modelled
footstep to be **less** noise-like than the sand one, which held only while the ruler was
wrong. With an honest band the modelled impact is the one with texture in it (0.0081 against
0.0003) and the claim now asks for the real relationship.

---

## 6. AND THE ROOM'S TWO COPIES WERE NEVER THE SAME ROOM

The room hum exists twice: in the game (the alpha) and in this module, and the checker holds
them together. **It compared six CONSTANTS -- length, hum, low, high, seam, level -- and never
the filter.**

    the game    ONE low-pass section at Q 0.7 (order 2)   14.2% of a noise bed above its corner
    the module   cascaded one-poles at a derived corner    37.9%

So the constants matched, the gate was green, and the judge page was playing a measurably
different room from the one in his ears, for rounds.

> **A DUPLICATION CHECK THAT COMPARES THE NUMBERS AND NOT THE MACHINE IS NOT A DUPLICATION
> CHECK.** This is the subtlest form of the trap this lane keeps writing about, and it hid
> inside the very claim written to catch it.

Both are a Butterworth of order 8 now, **the gate compares the order**, and the game reports
it through the room's own probe so nobody has to read it out of the source. The room's LEVEL
looks after itself: it is derived at run time from its own rms against his heartbeat, so a
narrower band cannot quietly change how loud the room sits.

---

## 7. THE COOK: THREE TAPS, AND THE THIRD ONE IS THE REAL QUESTION

**THE SAND IS OUT OF THE ONES YOU LIKED.** Each button plays the same three sounds he voted
yes on -- the door, the cloud, the song -- one after another with a beat of air between, so
he is hearing the filter and nothing else.

    A   AS YOU HEARD THEM      the old chain, unchanged
    B   THE SAND OUT           the honest filter, an AM broadcast at 5 kHz. Ships.
    C   THE SAND OUT AND A     the honest filter, a CASSETTE at 14 kHz
        DIFFERENT MACHINE

    measured, how much of each sits above the band it claims
              A        B        C
    door    15.96%   1.63%    1.66%     brightness 2,196 -> 831 -> 4,987
    cloud    6.06%   0.84%    0.36%     brightness 1,216 -> 779 -> 2,038
    song     1.41%   0.14%    0.19%     brightness   449 -> 331 ->   761

**C IS THE FORK AND IT IS WORTH MORE THAN THIS ONE ITEM:** B is boxed in and C is open, and
what separates them is *which machine this valley is recorded on*. Both are in school rule
4's own list. **B ships because AM is the machine this lane already declared and he has never
ruled on it, and because one thing changed at a time is how this round was run.** C is in
front of him because it is his call, not mine.

**AND A IS BUILT BY THE SAME FUNCTION AS B AND C**, through one flag inside the helper. The
"before" side of an A/B must never be a second copy of the recipe: that is the duplication
that silenced every footstep in this game for days, and the song through the speaker already
solved it the same way by switching the transmitter off rather than keeping two tunes.

---

## 8. WHAT THE GATE HOLDS NOW

**COOKED SOUNDS 93 ok / 0 failed, and `--mutate` bites 23 (was 21).**

    THE BAND'S CORNER IS THE CORNER IT NAMES        -3 dB at 5,001 Hz for 5,000 asked,
                                                   measured with an IMPULSE, which is the
                                                   filter's own response and not a guess
    AND ALMOST NOTHING GETS PAST IT                2.646% above, 0% an octave up
    AND THE OLD CHAIN REALLY DID LEAK              39.279%, so the before is not a straw man
    AND THE ORDER HAS A FLOOR                      a caller asking for 2 gets 6
    AND NO RECIPE PATCHES THE HELPER FROM OUTSIDE  0 left, was 2
    AND THE Q VALUES ARE BUTTERWORTH               not a shape somebody liked
    AND THE ROOM IS THE SAME FILTER, not only the same numbers

**THE DEBT LIST IS DELETED BECAUSE IT WAS PAID.** Last round froze four leaks (27.55%,
28.85%, 15.96%, 6.06%) as a ratchet, with the note that a checker going red the day its ruler
is fixed breaks the suite for twenty lanes. This round the four measure 3.32%, 3.37%, 1.63%
and 0.84%, so rule 4's real bars are asserted outright again. **A RATCHET IS SUPPOSED TO
END.**

**MUTATION IS THE PRECISE ONE:** put the old leaking chain back inside the helper. The two
honest claims go red with the exact old numbers, and "the old chain really did leak" stays
**green**, which is correct because it asks for the legacy path by name.

**ONE SOUND IS NOT ASKED AND IT IS NOT AN EXCUSE:** the flip is **killed** (rule 32e, the
second rejection), and its gap is deliberately wider-banded than its station because that is
the whole AGC mechanism, so the AM corner it declares never described it. **The third time
this lane has caught a claim asking the wrong question of a sound.** A dead recipe gets named,
not a green tick.

---

## 9. TWO MISTAKES OF MINE THIS ROUND, BOTH CAUGHT BY THE GATE I WAS WRITING

**THREE CLAIMS WENT RED ABOUT A FILTER THAT WAS WORKING**, because I read the whole reading
object into the variable meant to hold the honest half, so every number came back
`undefined`. **An undefined is not a measurement**, and a claim that prints one is reporting
on itself.

**AND THE FILTER CLAIM READ "ORDER NULL" ABOUT A CHAIN THAT IS RIGHT THERE IN THE FILE**,
because it searched a 6,000-character window and the filter lives further down the object than
the constants do. **A window that is too small does not report a missing thing, it reports
nothing, and that reads exactly like a defect.**

---

## 10. WHAT THIS DID NOT DO

    re-cooked the tape or the flip     NOTHING. Two of the three he killed are still waiting
                                       and they need real material the way the footstep got
                                       it. New ids, quoting his words.
    moved the bottom of any band       NOTHING, on purpose, so his next verdict is readable.
    touched his approved 65            NOTHING. Those are BOH_SFX inside the alpha and they
                                       never used this helper; their own keep/redo list and
                                       its ratchet are unchanged.
    decided which machine the valley   NOTHING. B ships, C is in front of him, and the reason
    is recorded on                     B leads is that it changes one thing and not two.
