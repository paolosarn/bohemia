# WHAT A FLIP SOUNDS LIKE (9/25/26, SOUNDS lane) -- [flip sound]
## A receiver crossing years, and the gap is the future he has not built

> **RULE 31, PAOLO 9/23:** *"play all three at the same time and flip through them... see the
> progress in the future from your past action... the city is built like shit because you're
> not making enough of an impact in your earlier act."*
>
> **The law's own words for what the flip is under the bible:** *"a phone that shows you a
> face that has not been born yet."*

---

## 1. THE ONE FACT THAT DECIDED EVERYTHING ELSE

The law says the flip is **one tap on the phone, always available, no place to walk to, no
mode change.**

> **SO THIS IS NOT A MOMENT. IT IS A SOUND HE WILL HEAR HUNDREDS OF TIMES, AND THE FAILURE
> MODE IS NOT "TOO QUIET", IT IS "I AM SICK OF IT".**

Everything follows from that: it fits inside **one beat**, it has no riser, no whoosh and no
stinger, and it never announces itself. A whoosh here would be the same violation as a whoosh
on the fight's cloud, which this lane already ruled out: *a sound effect pretending to be a
mechanism.*

---

## 2. REALISM FIRST, AND THE MECHANISM IS A REAL ONE

What does it really sound like to move between two recordings of the same place at different
times? **A receiver retuning.** And the honest detail, the one that carries the whole meaning,
is **AGC**: when a carrier drops, a receiver's automatic gain control winds the gain **up**
hunting for signal, so the gap between two stations is **louder** and **wider-banded** than
either station.

That is not a flourish. It is what every analog receiver does, and it is why inter-station
hiss is the loudest thing on the dial.

> **THE GAP IS THE SOUND OF A MACHINE TURNING ITSELF ALL THE WAY UP LISTENING FOR SOMETHING
> THAT IS NOT THERE YET.**

**AND SO THE SOUND REPORTS WHAT THE CITY REPORTS.** Rule 31 says the future is derived from
the earlier acts' ledgers and early on it is a ruin. A thin act has less to receive, so the
hunt is longer and the swell is bigger.

**THE LEDGER IS NOT MINE.** One parameter, `signal` 0 to 1, and DYNASTY owns the derivation.
This file ships the mechanism and a default of full signal, so nothing here decides how
ruined his future is. Mechanism mine, contents theirs.

**Nothing new entered the game.** The band is the same AM transmitter every other sound came
off. The carrier is the same 60 Hz mains the room hum and the fold use, because it is the same
grid in every act. Nothing pitches up or down: a pitch move would make this a transition
effect instead of a machine.

    measured, what ships
      full act   gap 0.12 s, +6.0 dB over the station
      half built gap 0.21 s, +12.1 dB
      a ruin     gap 0.30 s, +15.6 dB, and the station it lands on has lost its harmonics
      every one  0.500 s exactly, and a beat is 0.500 s
      zeros      0 at every state (school rule 1)

---

## 3. MY FIRST CUT MEASURED THE GAP QUIETER THAN THE STATION

    carrier 0.30, hiss 0.16, hold 3.2  ->  gap 0.66x the station, -3.6 dB

**Backwards from the mechanism the entire sound is built on.** A coherent hum at 0.30 carries
far more rms than band-limited noise at 0.34, so the carrier drowned the swell.

> **THE SOUND WAS WRONG, NOT THE RULER.** This lane has spent whole rounds discovering the
> opposite, and the discipline is the same either way: find out which one is lying before
> changing anything.

---

## 4. AND THEN I SWEPT A COPY OF THE RECIPE INSTEAD OF THE RECIPE

To find better levels I wrote a standalone re-implementation of the flip's shape and swept
that. It reported **0.52x** where the real function reads **0.66x**, because its filters were
not these filters.

> **A SWEEP BUILT ON A COPY IS NOT MEASURING THE RECIPE.** That is the duplication trap that
> silenced every footstep in this game for days, wearing a different hat: the copy was going
> to hand me numbers to write into the real thing.

Fixed by making the three levels **options on the real function** and sweeping that. 64
combinations, against a grounded target: real inter-station hiss runs **+6 to +12 dB** over a
tuned station, because an AGC has 20 to 30 dB of range and nothing to hold it down.

---

## 5. THE BAND LEAK, AND IT IS A FINDING ABOUT THE SHARED HELPER

The gate's "no carrier, no band" claim went red, and the number said why: **the station leaked
21% of its energy above its own 5 kHz corner**, which fails this lane's own school rule 4
(under 5% above the machine's number).

Raising the shared band helper's pole count **made it worse**, and here is the reason:

    bandTo DERIVES a per-pole corner so the combined -3 dB lands on the number asked for
      2 poles  -> each pole at  7,769 Hz
      4 poles  -> each pole at 11,495 Hz
      8 poles  -> each pole at 16,620 Hz

> **MORE POLES AT A DERIVED CORNER HAS A FLATTER PASSBAND AND A ROLL-OFF THAT STARTS LATER.**
> That sentence is already in this lane's record, from the band claim that cost five attempts.
> I walked into it again from the other side.

**AND WHY NOBODY HAD SEEN IT: IT IS INVISIBLE ON TONES.** The phone's carrier reads 0.05%
above its corner through the identical call, because tones have nothing up there to pass.
**On noise the tail is fully exposed.** Every noise-based sound in this module shares that
helper, so this is worth the next round's attention and is on the handoff.

Fixed for the flip with poles **at** the nominal corner rather than a derived one:

    tail poles   station above 5 kHz   gap above 5 kHz   ratio   gap/station loudness
    0            21.19%                41.36%            1.95x   1.77x
    2            3.10%                 10.51%            3.39x   1.44x
    4            0.55%                  4.63%            8.45x   1.29x

**AND TIGHTENING THE BAND COSTS THE SWELL ITS SIZE**, because the gap's extra top was carrying
some of its loudness. The two have to be tuned together, so the AGC was re-swept with the band
fixed. Two of fifteen combinations met both conditions; what ships is **hold 10, carrier 0.18,
two tail poles**: rule 4 satisfied at 3.1%, and the swell back at exactly **+6.0 dB**, the
bottom of the real band.

**AND ONE MEASUREMENT I THREW AWAY RATHER THAN PRINT.** I measured the real -3 dB corner and
it read **86 Hz at every pole count**, which is meaningless: the envelope peak sits on the
60 Hz carrier, so "the highest frequency within 3 dB of the peak" describes the hum and not
the band. That is the same failure this lane already wrote down (*the footstep measured
108 Hz*). It is not in the gate, because a number that does not mean what its name says is
worse than no number.

---

## 6. THE RUINED ACT IS DELIBERATELY WORSE THAN ANY REAL RADIO

    full act   +6.0 dB   the bottom of the real +6 to +12 dB band
    a ruin    +15.6 dB   ABOVE what a real receiver does

**Said out loud rather than smuggled:** that is on purpose. A future he has not built should
sound worse than any radio ever made. It is the one place this sound leaves the real number
behind, and it leaves it in the direction the game is about.

---

## 7. WHAT THE GATE HOLDS

Six claims, every number found in the rendered buffer:

    THE FLIP FITS INSIDE ONE BEAT at every ledger state
    THE GAP IS LOUDER THAN EITHER STATION, which is what an AGC really does
    AND A THINNER ACT HUNTS LONGER AND LOUDER
    AND THE GAP HAS NO BAND, with the station itself under rule 4's 5%
    THE GRID IS ON IN BOTH ACTS (school rule 7), and nothing pitches
    AND IT NEVER READS DIGITAL ZERO (school rule 1)

**MUTATION PROVEN:** replace the flip with a plain crossfade (`holdX` 0, no AGC), which is
what every transition sound in every game already is and is exactly what this is not. The two
loudness claims go red naming **0.644x, -3.8 dB**. The band and grid claims stay green, which
is correct: killing the AGC does not move the band or the carrier, and they are guarded by
their own construction.

**COOKED SOUNDS 69 ok / 0 failed, and 13 claims go red under mutation (was 11).**

---

## 8. WHAT THIS DID NOT DO

    wired the flip to anything      NOTHING. DYNASTY owns the flip and rule 31 says the demo
                                    does not change. This is the sound, in VOTE, ready before
                                    DYNASTY needs it, which is exactly what the row asked for.
    decided how ruined the future   NOTHING. `signal` is a parameter and the derivation is
    is                              DYNASTY's. The default is full signal so this file's
                                    default decides nothing about his world.
    touched the shared band helper  NOTHING, and that is a judgement call rather than
                                    laziness: every noise sound in the module uses it, so
                                    changing it changes sounds he has already voted up.
                                    Named on the handoff with the measurement.
