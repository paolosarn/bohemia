# THE KEEP/REDO LIST (9/24/26, SOUNDS lane) -- [analog horror sound], round two of two
## The bible says most of the shelf is a KEEP, and that is the finding

> **RULE 20, PAOLO 9/20, LOCKED:** *"the sounds have to complement that... everything
> that's a sound has to be thought about as analog horror."*
>
> **ROUND ONE** was the school page: ten rules, each ending in a number a checker can read,
> and a measurement that two of the ten were met and both by luck.
> **ROUND TWO** is this: every sound the game ships today, one line each, KEEP or REDO.

---

## 1. THE HEADLINE, AND IT SAVES A WHOLE ROUND OF WRONG WORK

**DIRECTION'S BIBLE, RULE 8: DIEGETIC OR DEAD.** *"Static, scanlines, tape damage and
drop-outs exist only inside in-world screens and speakers. The lens is an eye."*

My own school page's rule 4 says **every** sound declares which machine it came off, and
*"a sound with no declared machine is not done."* Put those two sentences side by side and
they contradict each other, on the same date, and the bible wins: **a footfall under your
own boot did not come off a machine.** There is no tape to wobble and no oxide to lose
contact. Asking rule 4 of it is asking a real sound to pretend it is a recording.

> **SO THE REDO LIST IS NOT SIXTY-FIVE SOUNDS. IT IS FIVE, PLUS A COUNT OF DULL IMPACTS.**
> The cheapest order in round one's own record had "a machine per sound, all 65" as item
> two. That item is **wrong** and this round kills it. Rule 4 belongs to the five sounds
> that really do arrive through a speaker.

**AND THE TIE IS NOT MINE TO BREAK ON TASTE.** DIRECTION decides the look and the bible IS
the taste written down; this lane does not judge tone. What this lane can do is measure, so
the contradiction is settled by citing the bible rather than by preferring my own page.

    measured, all 65 approved sounds, classified once and only once
      57   HEARD WITH YOUR OWN EARS     no machine. Rules 1, 3 and 8 apply; 4, 5 and 6 do not
       3   A MACHINE YOU CAN POINT AT   a generator, a transformer, a lit sign. Rule 2 binds it
       5   THROUGH A SPEAKER            the one class rule 4 can be asked of

The table is `banks/BOHEMIA_WHAT_MACHINE_IS_IT_9_24_26.json`, draft:true, one line per
sound, and the gate refuses a sound that has no line in it.

---

## 2. HOW THE SHELF READS, MEASURED THROUGH THE GAME'S OWN ENGINE

65 of 65 approved events rendered from `BOH_SFX` inside the shipped alpha at the variant
index **he** approved (the first, so the reading is deterministic and a threshold cannot be
measuring the dice). Every band share sums to 1.000000 on every row, which is the receipt
that the ruler is not wrong.

    median share of energy above 4 kHz          0.273%
    sounds with more than 1% above 4 kHz        14 of 65
    sounds that read as noise at all            3 of 65   (flatness over 0.05)
    page errors while measuring                 0

**AND TWO INDEPENDENT RULERS AGREE, WHICH IS WORTH MORE THAN EITHER.** Round one counted
**51 of 65** sounds as near-pure tones using spectral flatness on a different window. This
round, counting energy above 4 kHz, puts **51 of 65** under one percent. Two measurements
taken for different reasons landing on the same fifty-one is the first time a number in this
lane has been confirmed by something other than itself.

**THE THREE THAT REALLY ARE NOISE:** sand_more 94.1% above 4 kHz, cover_more 26.2%,
chip_more 16.7%. Those are the shape the rest are missing, and they are proof the engine can
already do it: round one counted 447 noise buffers and 580 filters across the 65, so **no
new machinery is needed for any of this.**

---

## 3. THE REDO CRITERION, AND WHY IT IS NOT "MAKE EVERYTHING BRIGHTER"

A blanket rule would be wrong and the data says so: `air_night` is 99.6% below 80 Hz,
`heartbeat` 93.1%, `wind_gust` 99.4%. **A night bed, a heart and wind genuinely live down
there** and dragging them up to satisfy a checker would be the exact mistake this lane
already made twice, filtering the life out of a correctly built sound to please a bad ruler.

So the machine table marks **hard contact** per sound: **two hard things touching.**

> A boot on concrete, brass on a floor, a magazine seating, a door against its frame: the
> contact is a step change in air pressure, and a step change is broadband by definition.
> A version of it with nothing above 500 Hz is a filtered tone, not a recording of the
> event.

**31 of the 65 are hard contact.** The bar for one is **1% of its energy above 4 kHz**, and
the bar is grounded rather than picked: 30x under this lane's own cooked footstep (30.7%),
16x under the dullest sound that already reads as noise (16.7%), and two orders of magnitude
over the shelf's median (0.273%) -- clear of both spreads instead of sitting inside one.

The sounds that are a body or the air are **not** marked, are **not** held to that bar, and
are named in the table so nobody re-cooks them by accident.

---

## 3b. AND THE LIST, MEASURED: 37 KEEP, 28 REDO OF 65

    REDO, 28
      21 hard contact with no top end   block 0.289%, boots_go 0.058%, demolish 0.032%,
                                        dirt_take 0.829%, door_more 0.360%, hit 0.064%,
                                        melee_hit 0.370%, parts_pass 0.151%,
                                        pickup 0.236%, set_down 0.329%, seton_more 0.013%,
                                        shot_more 0.193%, step_asphalt 0.768%,
                                        step_concrete 0.281%, step_dirt 0.215%,
                                        step_sand 0.095%, step_wood 0.024%,
                                        tread_more 0.170%, walk_more 0.618%,
                                        wood_more 0.755%  (all against a 1% bar)
       3 a hum off the grid             generator 51.87 Hz, power_on 90.47 Hz,
                                        sign_alive 123.27 Hz
       5 through a speaker with nothing save_chime, time_pass, ui_tap, ui_back, ui_deny
         under them saying so

    KEEP, 37   including all three beds, the heart, the wind, the two brightest impacts
               the game owns (sand_more 94.1%, cover_more 26.2%) and step_gravel 9.5%,
               which proves the shelf can do it and 21 of its cousins do not

> **FIVE OF THE SIX FOOTSTEPS ARE A REDO AND step_gravel IS A KEEP.** Gravel measures 9.5%
> above 4 kHz and concrete 0.281%. They were cooked by the same factory for the same job,
> so nothing about the engine or the effort explains the gap: **a sidewalk is telling his
> ears it is a filtered thud while a gravel path is telling them the truth.** His break list
> has said the sidewalks are wrong since the first play, and that is the ear's half of it.
> And this round DOUBLED how often he hears a footstep while running, which puts these at
> the top of the redo order on frequency alone.

---

## 3c. RULE 2 GETS A NUMBER FOR THE FIRST TIME, AND ALL THREE MACHINES ARE OFF THE GRID

Round one scored rule 2 as *"PART MET. whether the pitches are 60 Hz multiples is NOT
measured yet."* Now it is.

    generator     51.87 Hz   0.86 x mains   13.6% off 60
    power_on      90.47 Hz   1.51 x mains   halfway between 60 and 120, near neither
    sign_alive   123.27 Hz   2.05 x mains   2.7% off a ballast's 120

**A live North American circuit hums at 60 Hz and a fluorescent ballast at 120, twice mains,
because the magnetic force peaks twice a cycle.** None of the three sits on it. The sign is
close enough that it was clearly built for a ballast and missed; the generator and the block
coming alive are not near anything.

> **AND THE FIRST CUT OF THIS MEASUREMENT NEARLY PUT A FALSE ACCUSATION IN THIS FILE.** It
> read the generator at **54 Hz** and the sign at **118 Hz** and I was about to write down
> that neither hums at the grid's pitch. One bin of the window it is read in is 10.77 Hz,
> which at 60 Hz is **eighteen percent** -- 54 Hz is simply the nearest bin below 60 and
> 118 is the nearest bin to 120. **A MEASUREMENT CANNOT ANSWER A QUESTION FINER THAN ITS OWN
> RESOLUTION, and a 3% rule read through an 18% ruler is not a reading.**

**SO THE RULER IS NOW CHECKED BEFORE IT IS USED, ON FREQUENCIES WE KNOW EXACTLY:**

    asked      raw bin        refined
     60 Hz     64.60  +7.67%   59.898  -0.17%
    120 Hz    118.43  -1.31%  120.118  +0.10%
    180 Hz    183.03  +1.69%  179.828  -0.10%
    853 Hz    850.56  -0.29%  853.160  +0.02%

The refined reading is good to **0.17%** at worst, the raw bin out by up to **7.67%**. So
the tolerance rule 2 is held to is **1%**, which is six times this instrument's own measured
error rather than a number off a page, and both readings are kept on every row so nobody can
read the wrong one again.

---

## 4. THE FIVE THAT REALLY DO COME THROUGH A SPEAKER

    save_chime   SAVED                 nothing in the world makes this noise
    time_pass    HOURS GO BY           an abstraction with no body
    ui_tap       UI TAP
    ui_back      BACK / CLOSE
    ui_deny      YOU CANNOT DO THAT    and rule 23 gives this one a job

**THESE ARE REDOS FOR A REASON THAT IS NOT THEIR BAND.** Measured, four of the five already
sit inside a telephone's 3.4 kHz by accident, which is round one's finding exactly: *the
shelf is narrow to nothing.* What they lack is everything else a speaker leaves on a sound
-- hiss under it, a carrier that does not stop (rule 7), the band meaning something. And
under rule 8 a chime with no body in the world is the definition of non-diegetic: **it has
to come out of the phone in his pocket or it should not exist.**

`ui_deny` is the one with a job already waiting: rule 23 (Paolo 9/22) says a refused press
**says why**, and the device that says it is the phone in his hand.

---

## 5. WHAT THE GATE DOES, AND WHY IT IS GREEN ON A SHELF THAT BREAKS EIGHT RULES

`gates/analog_horror_sound_gate.js`. Round one refused to write this and said why in its own
record: a checker written then goes red on 65 sounds and eight of ten rules at once and
breaks the suite for twenty lanes over work nobody has been asked for. So it is a
**ratchet**, the pattern `reference_check_gate.py` already settled on in this repo.

    TODAY'S SHELF IS FROZEN      records/target/BOHEMIA_THE_KEEP_REDO_LIST_9_24_26.json
    NOTHING MAY GET DULLER       a sound losing 10% of its top end against 9/24 is red
    NOTHING MAY CLIP             school rule 8, over the whole shelf
    NOTHING MAY WIDEN PAST ITS SPEAKER
    A NEW SOUND IS HELD OUTRIGHT any sound added from now meets its class's rules with no
                                 grandfathering at all
    AND EVERY SOUND IS CLASSIFIED both directions: an unclassified sound is red, and so is
                                 a table row for a sound that no longer exists

**THE DEBT CAN ONLY SHRINK.** That is the whole design: a floor under the shelf, never a
target, and the keep/redo list printed on every run so the number is in front of whoever
reads it. **ANALOG HORROR SOUND 11 ok / 0 failed, and it prints 37 KEEP and 28 REDO.**

**MUTATION PROVEN, AND THE MUTATION IS REAL RATHER THAN CALCULATED:** the brightest sound on
the shelf loses half its top end and one sound loses its line in the machine table, both
injected **before any claim runs**. The ratchet claim and the classification claim go red.
This lane has already shipped a mutation that turned out to be a no-op, so a control that is
an arithmetic prediction instead of an actual change is not a control.

**AND IT MEASURES WITH THE TOOL'S OWN BODY, NOT A COPY.**
`tools/bohemia_the_keep_redo_list.js` exports the measuring function and the gate calls it.
A checker carrying its own copy of a ruler is the duplication that silenced every footstep
in this game for days, wearing a different hat.

---

## 5b. AND THE ROUND COOKED, BECAUSE A ROUND THAT ONLY CHECKS DID NOT HAPPEN

Rule 22: **THE VALLEY STILL BROADCASTS**, registered in the VOTE tab, three options, one tap
each, no vote on the page, notes save themselves. It is the redo the list puts first, and it
is the one thing the bible names that the game does not do at all.

Its own record is inside this round's commit; the short version: **bible rule 9 says the
machines keep talking on a schedule and the content never acknowledges you, and there is no
broadcast, no PA and no scheduled emission anywhere in the build.** So: a dead authority's
transmitter plays the two-tone attention signal, then a bar of dead air, and the announcement
never comes. The pair is the real published one (853 and 960 Hz together) and the standard
asks for at least **eight seconds**, which at 120 BPM is exactly **sixteen beats, four bars**,
with nothing bent. A is the transmitter working, B is the same one after ten years unattended
(+5.6 dB of hiss, a slipping head, two 34 ms drop-outs 12 dB down and off the beat), C is B
on repeat, which is the question that matters: repetition is the dread and repetition is also
how he gets sick of a sound.

    measured, and every number off the rendered buffer
      four bars of signal, one of air     8.0 s + 2.0 s = 10.0 s, 5 bars exactly
      the pair really leaves              +35.0 dB and +40.7 dB louder in the signal than
                                          in the dead air
      the carrier does not stop           0 digital zeros in 441,000 samples; the air holds
                                          0.02486 then 0.02479 rms, a carrier not a fade
      it stays in its own machine         0.02% above 5 kHz, 0.00% an octave up
      ten years is audible as hiss        1.90x the clean carrier, +5.6 dB
      it can repeat forever               the wrap step is 0.00835 against this sound's own
                                          99.9th-percentile step of 0.11134

**AND TWO POLES WERE NOT ENOUGH, MEASURED, WHICH IS THE FLIP'S FINDING BITING A SECOND
TIME.** The dead air is the carrier ALONE, which is pure band-limited noise, and noise is
where `bandTo`'s derived corner leaks: two tail poles read **9.99%** above 5 kHz here, which
fails school rule 4 outright, and four took it to under 5%. The flip's own sweep said the
same thing in its own table and this is the second sound to need it. **The shared helper is
still not touched, and it is still on the handoff with its measurement.**

---

## 6. TWO INSTRUMENT FAILURES, BOTH MINE, BOTH CAUGHT

**THE FIRST CUT TIMED OUT FOR THREE MINUTES AGAINST A BUILD THAT WAS PERFECTLY LOADED.** It
waited on `window.BOH_SFX`, and the engine is declared with a lexical binding, which lives in
its script's scope and never becomes a property of `window`. So the wait could never end and
the report would have read as "the alpha does not carry the sound engine". **The same shape
as every other false negative in this lane's records:** an instrument asking a question the
build was never going to answer, and blaming the build for the answer.

**AND IT OPENS THE ALPHA OVER HTTP, NOT AS A FILE**, because of this lane's own 9/23 finding
that every gate opening the alpha as a local file is blind: three of the four loading lines
ask their question inside the city iframe, whose origin over `file://` is "null", so the read
throws and the catch turns *"I am not allowed to look"* into *"not done"*. Nothing here
touches the door at all, but the server costs one line and removes the whole class.

---

## 7. WHAT THIS ROUND DID NOT DO

    re-cooked anything on the list   NOTHING. The list is the deliverable and the redos are
                                     their own work, each a new id under rule 30 going
                                     through the bible first.
    changed a sound he approved      NOTHING. His indices are byte for byte untouched and
                                     this round rendered them rather than editing them.
    touched the shared band helper   NOTHING, and it is still on the handoff with its
                                     measurement: bandTo leaks above a derived corner on
                                     noise and every noise sound in the module uses it.
    scored rule 9                    NOT THIS LANE'S. WORDS Q27 and PORTRAIT own the voice.
