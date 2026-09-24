# IT ALL SOUNDED LIKE SAND (9/24/26, SOUNDS lane) -- [not sand], round one
## He was right, my own ruler was hiding why, and the leak was 51 times bigger than it read

> **PAOLO 9/23 IN THE TAB, THREE SOUNDS DOWN IN ONE BATCH:**
> *"These are all dogshit and unimpressive u needs to REALLY MAKE NEW SANDS NOT THIS SAND
> SOUNDING SHIT LIKE IM ON THE Beach"* (the run)
> *"Bro this shit was like all sand sounding bro it all sounded like sand"* (the tape)
> *"Kinda dogshit"* (the flip)
>
> Rule 32e, `laws/BOHEMIA_ADDENDUM_THE_SECOND_VOTES_9_24_26.md` s5: **the band-limited-noise
> RECIPE is the graveyard, not one sound.**

---

## 1. HE IS RIGHT, AND THE PROOF IS IN MY OWN FILE

Every sound this lane cooked starts the same way: `noiseInto()` for the material, `bandTo()`
to take the top off. **That is white noise with a filter on it, and white noise with a filter
on it is the sound of sand.** Four cooks in a row were made of it. He heard one thing four
times and said so three times.

**What he KEPT all have a real source** and it is not a coincidence: the door (one room
becoming another), the cloud (the city's own weather numbers), the song (a tune), the fold
(a person stopping while the grid does not), the phone (a published two-tone signal), the
room (60 Hz mains). Every one of those is a THING. The four he killed are a texture.

---

## 2. AND MY OWN BAND RULER WAS HIDING THE REASON, BY A FACTOR OF 51

The gate has been printing "the share of its energy above the band it declares" for rounds:
0.54%, 0.63%, 0.03%. Those numbers were measured by cascading **four one-pole high-pass
filters at the declared corner.**

> **CASCADING RAISES A HIGH-PASS'S CORNER EXACTLY AS IT LOWERS A LOW-PASS'S.** Four poles at
> fc turn over at **2.299 x fc**. So "the share above 5,000 Hz" was really the share above
> 11,500 Hz, and two and a third octaves of the thing being measured went past unmeasured.

**THIS IS THE `bandTo` LESSON RUNNING IN THE OTHER DIRECTION, IN MY OWN INSTRUMENT.** That
lesson is already written down twice in this lane's records -- *more poles at a derived corner
has a flatter passband and a roll-off that starts later* -- and I walked into the mirror image
of it while holding the page it is written on.

Replaced with an **FFT band sum, which has no corner to move.** Same loudest window as every
other spectral number here. The real numbers:

    sound                      reported    really    above an octave up
    a footstep on the beat        0.54%    27.55%    11.64%      KILLED 9/23
    the step loses contact        0.63%    28.85%    12.37%      KILLED 9/23
    the door                      0.04%    15.96%     6.83%      he voted it UP
    the fight's cloud             0.04%     6.06%     1.61%      he voted it UP
    the phone still transmits     0.03%     0.48%     0.17%      fine
    a song through the speaker    0.07%     1.41%     0.53%      fine
    the fold                      0.04%     1.48%     0.68%      fine
    the tape is slipping             --     1.05%     0.29%      fine

> **THE TWO WORST ARE THE TWO HE KILLED FOR SOUNDING LIKE SAND, AND THAT IS WHAT SAND IS:
> BAND-LIMITED NOISE WHOSE BAND IS NOT ACTUALLY LIMITED.** Nearly a third of each of them
> sits above the line it was built to stop at. The coordinator's line on [band helper] --
> *"the 21% leak is likely the sand itself"* -- is now measured, and the true numbers are
> bigger than 21%.

**A NUMBER THAT DOES NOT MEAN WHAT ITS NAME SAYS IS WORSE THAN NO NUMBER.** Third time this
lane has written that sentence about its own instrument, and the first time it cost him a
verdict rather than costing me a round.

**IT IS A RATCHET, NOT A RED.** Four sounds going red the day a ruler is fixed would break
the suite for twenty lanes over work nobody has done yet. The four leaks are frozen at
today's readings, printed on every run with KILLED or REDO OWED beside them, and tightened by
5% of the frozen value rather than an absolute window, because an absolute window stops
checking as the number shrinks -- a mistake this lane has already shipped once.

---

## 3. THE COOK: A FOOTSTEP WITH NOT ONE NOISE GENERATOR IN IT

Rule 32e says new sounds come from real material: recorded, sampled, or **physically
modelled from a named object.** There is no sample library here, so it is the third.

**A footstep is one hard thing hitting another.** Three parts, and only the third is a guess:

**(1) THE CONTACT, AND IT IS WHY A SIDEWALK IS BRIGHT.** A Hertzian impact is a half-sine
force pulse of duration tau, and that pulse's spectrum is flat to about 1/tau and falls away
above it. A heel on concrete is about **0.4 ms**, so it carries to about **2,500 Hz**. On
asphalt, an order of magnitude softer, the contact lasts **1.1 ms** and only reaches about
**909 Hz**. The pulse radiates directly as well as exciting the ground, and a monopole
radiates the RATE OF CHANGE of the force, so the direct part is a bipolar click. **That click
is the top end, and it is not noise.**

**(2) THE GROUND'S OWN MODES, COMPUTED, NOT CHOSEN.** A slab is a plate, and a simply
supported square plate has modes at `f(m,n) = (pi/2) * sqrt(D/(rho*h)) * (m^2+n^2)/a^2` with
`D = E*h^3/(12*(1-v^2))`. Feed it published constants and the pitch falls out with no choice
left in it:

    concrete  E 30 GPa  rho 2400  v 0.20   ->  first mode 227.3 Hz
    asphalt   E  3 GPa  rho 2300  v 0.35   ->  first mode  76.8 Hz
    boards    E 13 GPa  rho  500  v 0.30   ->  first mode 149.6 Hz

A 100 mm slab, 1.2 m across, is the ordinary sidewalk spec.

**(3) THE SHOE, WHICH IS THE GUESS AND IS LABELLED ONE.** Three short modes in the low kHz
with an 8 ms decay. A heel is small and stiff so its modes are up there, but I have no
published figures for a shoe, so it says so instead of dressing up a choice as physics.

**AND GRIT, WHICH IS WHY IT IS NOT A DOORBELL.** Thirteen partials with no noise is a PING.
A real footfall is dense because the ground is not smooth: a couple of dozen grains crush
under the heel, each one its own tiny impact. **That is a sum of impulses, not a hiss bed**,
and it is where the density comes from in the real world. The times are laid out by a fixed
integer sequence so a checker gets the same buffer twice; what is modelled is WHEN particles
arrive, never a random waveform.

**AND A WALK IS TWO CONTACTS:** heel, then the foot going flat 90 ms later, which is a real
walk and is well inside one 500 ms beat. The second contact is softer, so its tau is longer
and it is duller, which the same arithmetic gives for free.

    measured, and the comparison IS his complaint
      flatness            0.0081 against the sand one's 0.2283      28x less noise-like
      brightness          2,264 Hz against 3,604 Hz
      energy above 4 kHz  9.29% concrete, 7.81% asphalt             real top end, from the
                                                                    contact and not from hiss
      a sidewalk is not a road   brightness 2,264 vs 1,542 Hz, slabs at 227.3 vs 76.8 Hz
      on the beat         loudest instant 2.1 ms in (PERFECT is 55 ms), two contacts, 0.5 s
      noise generators    0, read off the shipped function's own text

**THE STRUCTURAL CHECK IS THE IMPORTANT ONE.** "It is not made of noise" cannot be taken off
a spectrum, because a dense impact and a hiss bed can land near each other. It is a fact
about how the thing was built, so the gate reads the shipped function's text: the one he
called sand calls `noiseInto()`, this one does not call it at all.

**MUTATION PROVEN, AND THE FALSIFIER IS THE SAND ITSELF** rather than a sine: replace the new
footstep with the old one and all five substantive claims go red. `--mutate` bites 21 claims,
up from 13.

---

## 4. ONE THING I CORRECTED MID-BUILD, AND THE CORRECTION WAS PHYSICS

The first cut used concrete's **own internal loss factor, 0.06**, and the slab rang for 23 ms
at 227 Hz. **That is a bell, not a sidewalk**, and the measured top end came out at 0.002% --
worse than the shipped sound I was replacing, because a long loud low ring swamps a 0.4 ms
click in any energy share.

> **A SLAB ON GRADE IS NOT A FREE PLATE.** It is lying on soil, and the soil and the
> radiation take the energy out of it far faster than the concrete's own damping ever would.
> On grade the effective loss is several tenths, which gives a few milliseconds of ring,
> which is what a pavement really does.

Floorboards on joists genuinely DO ring, so they keep a low loss, and that difference is
audible and correct. The three loss factors are **engineering estimates and the table says so
on its face**, next to the E, rho and v that are published.

**AND THE BOARDS CASE IS BUILT AND NOT OFFERED.** It measures 0.001% above 4 kHz, because a
53 ms ring at 150 Hz swamps a 0.4 ms click over the window the share is taken on. That is a
limitation of the share measure as much as of the sound, it is not one of the two options he
is given, and it needs its own round rather than a fudge now.

---

## 5. WHAT I PULLED OUT OF HIS QUEUE, AND WHY THAT IS THE POINT

**THE VALLEY STILL BROADCASTS was cooked this round, measured, gated, and is NOT in the VOTE
tab.** It is the dead authority's transmitter, which is bible rule 9 and is genuinely missing
from the game -- but its carrier and its wear are band-limited noise, which is the recipe rule
32e just graveyarded. **Putting it in front of him would have been the fourth sand sound in a
row.**

> STOP PRODUCING, 7/26: *"a frozen lane produces NOTHING; finding a legal way to ship anyway
> IS the violation."* It stays in the module, held by its own gate claims, and it reaches the
> VOTE tab only if it is rebuilt from real material.

---

## 6. AND HIS OTHER VOTE, SET WITHOUT ASKING AGAIN

**HOW LOW THE ROOM went UP with one letter: "B".** B on that page is rel 0.025, and rule 32e
says it in words too: *"The room stays at B (lower still)."*

    0.60   ->   -4.4 dB under the heartbeat   what he heard and hated
    0.05   ->  -26.0 dB                        what shipped last round
    0.025  ->  -32.0 dB                        his pick, shipped this round

**That crosses a line this lane wrote itself** -- under about -30 dB a bed on a handset starts
losing to the room he is really sitting in -- and **he heard both and picked the quieter one**,
so the trade is his and it is made. The gate now holds his letter exactly rather than a range,
because a range lets a later round drift the level back up inside it and stay green.

---

## 7. WHAT THIS DID NOT DO

    touched the shared band helper   NOTHING YET, and now there is a real number for it: the
                                     leak it causes is 28% and not 21%, measured on an honest
                                     ruler. Fixing it re-renders every noise sound in the
                                     module, which is a round of its own and is [not sand]'s
                                     next line.
    re-cooked the tape or the flip    NOTHING. Two of the three he killed are still waiting,
                                     and they need real material the way the footstep just
                                     got it. New ids, quoting his words.
    wired the new footstep into the  NOTHING. His approved bank is untouched and the game
    game                             still plays what he thumbed on 7/30. This is a candidate
                                     in VOTE; it goes in when he says so.
    fixed the boards case            NAMED, NOT FIXED, with its number and the reason.
