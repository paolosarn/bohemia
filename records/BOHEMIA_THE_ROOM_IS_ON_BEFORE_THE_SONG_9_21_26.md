# THE ROOM IS ON BEFORE THE SONG (9/21/26, SOUNDS lane) -- [first sound], SHIPPED
## The first thing you hear, and it is a room rather than a jingle

> **THE ROW IS UN-HELD BECAUSE IT IS LOADING, WHICH IS RULE 18 ITEM ONE.** The
> coordinator's default, written off this lane's own measurement (c88d7cc2): the loading
> screen ends in one BEGIN tap, the first sound plays ON that tap, and it covers the gap to
> the first song. "A room hum under the bible, not a jingle."
> **Ship test: sound within one beat of the tap on a 4x phone profile.** MET, measured at
> 0.14 s against a 0.5 s beat.

Tab: **RUN**, the moment the door closes. Gate: `FIRST SOUND`, 19/0.

---

## 1. WHAT WAS ALREADY THERE, AND WHY IT WAS HALF THE ANSWER

The PULSE (9/5) is a looping half-second buffer handed to the audio thread, built for this
exact window. **It is the right mechanism and this round did not change a byte of it.** The
main thread blocks for seconds while the city builds, and a buffer loop is the only thing
that can be heard through that. His recipe, his GAP of 0.3125, his level of 0.020: untouched.

But measured against this lane's school page from the same round
(records/BOHEMIA_WHAT_ANALOG_HORROR_SOUNDS_LIKE_9_21_26.md), it is a **heartbeat**, and a
heartbeat is a body, not a room:

    it is two thumps, 58->34 Hz and 50->30 Hz, so it is ENTIRELY sub-bass
    it is rhythmic, so it is an event repeating, never a continuous bed
    and the shipped mix already has that problem everywhere: 96% of this game's sound
      energy is below 320 Hz, and 0.02% is above 5 kHz, which is the hiss band, empty

The school page's ten rules say the genre's two instruments are **hum and hiss, and they sit
at opposite ends of the band.** The game had the bottom and none of the top.

**AND THE TOP IS THE HALF A PHONE CAN PLAY.** A handset speaker is a few millimetres of cone
in a sealed body; it rolls off hard below a few hundred hertz. 30 to 58 Hz is where a phone
has nothing at all. So the heartbeat, on the only surface that counts, is the quietest thing
in the game by accident.

> **SO THIS SHIPS THE ROOM THE HEARTBEAT IS STANDING IN.** One looping buffer, on the same
> tap, three of the ten rules satisfied at once: rule 1 (there is always a room and it is
> never digital zero), rule 3 (hiss is broadband and lives up high), rule 7 (silence is ON,
> because there is a carrier under it).

---

## 2. WHAT IS IN IT, AND EVERY NUMBER IS A MACHINE'S OR HIS

    the hum ......... 60 Hz plus 120 and 180, falling away. North American mains, and this
                      valley is Las Vegas. Dead steady, because a grid frequency is: the
                      tape wobble in school rule 5 belongs to sounds that came off tape.
    the hiss ........ white noise, broadband, which is the thing the shelf has four of
                      sixty-five of.
    the band ........ 100 Hz to 5 kHz, and it DECLARES ITS MACHINE: an AM broadcast, because
                      10 kHz channel spacing leaves 5 kHz of audio. Under school rule 4 a
                      narrow sound is only right if it is narrow to something.
    the loop ........ 4.0 s, which is 8 beats at 120 BPM and exactly 240 cycles of 60 Hz, so
                      the hum crosses the seam in phase BY ARITHMETIC. The hiss cannot be
                      periodic, so its tail is blended into its head over 80 ms.
    the level ....... NOT CHOSEN. Derived at run time from his own approved heartbeat, on
                      RMS, at a stated 60%.

**THE LEVEL IS THE ONE THING I PICKED, AND IT IS A RATIO, NOT A NUMBER.** The room carries
60% of the heartbeat's energy, so the heartbeat stays the thing you notice and the room is
what it sits in. Measured on the shipping build: room 0.0021452 against heartbeat 0.0035744,
**0.6002x against the 0.6 asked.** Matched on rms and never on peak, on purpose: a thump has
a high peak and little energy, a bed is the other way round, and matching peaks would have
put the room far louder than the thing it is supposed to sit under. Because it reads the
heartbeat's buffer at run time, **if he ever changes the heartbeat's level the room follows
it and cannot drift.** The 60% goes to the VOTE tab.

**AND THE TWO FILTERS ARE NOT A FILTER PASS** (rule 20(b), school rule 10). They are inside
this one voice's own chain, which IS the machine the sound came off. Nothing was added to the
master bus and nothing should ever be.

---

## 3. THE ONE JUDGEMENT BEYOND WHAT THE ROW ASKED, SAID PLAINLY

The row asks for the gap covered. School rule 1 says a bed never reads digital zero and rule
7 says a silence keeps its carrier. **A room that died the instant the song started would
satisfy the row and break the law written in the same round.** So when the song arrives the
room **ducks to a third of itself and keeps running.** There is no path in it that reaches
zero, and the gate checks that.

It ducks from the one place in the build that knows a note is really going into the graph,
the same line the heartbeat hands over on, and the build's own comment explains why that is
the only honest place: a transport being STARTED is not a song being AUDIBLE.

**Extending the bed across the whole street is [quiet floor], which is HELD. This does not do
that.** The room starts on the tap and stays at a floor. That is the whole scope.

---

## 4. HOW IT IS PROVEN, AND WHY THE GATE DOES NOT WATCH AND WAIT

**THREE POLLING INSTRUMENTS WERE BUILT THIS ROUND AND ALL THREE WERE THROWN AWAY.** The third
failed in the way that decided the gate's whole design:

On a 4x phone profile each round trip into the page costs about two seconds. Ninety samples
spanned a hundred and ninety-eight seconds, and **the first sample landed eighty seconds
after the tap.** It reported "first sound 84 s after the tap".

> **THAT WAS NOT THE GAME. THAT WAS MY OWN OBSERVATION LATENCY WITH A TIMESTAMP ON IT.** The
> number was never published. The build's own comment says the same thing about main-thread
> meters: across the city build they record NO SAMPLES AT ALL.

So **nothing is observed.** The audio thread is asked what it SCHEDULED, which is a fact that
exists whether or not the main thread is alive to see it. A buffer booked to start at context
time 0.14 s is heard at 0.14 s even if the main thread then blocks for nine seconds, and that
is the entire reason this sound is a looping buffer instead of a scheduler.

**AND THE TAP IS CONTEXT-TIME ZERO, WHICH IS A MEASUREMENT AND NOT A CONVENIENCE:** there are
zero AudioContexts in existence before the door is tapped, not even a suspended one, because
a browser will not start audio without a gesture. The context is created BY the tap. So "within
one beat of the tap" is exactly "startedAt within one beat of context time", with **no wall
clock anywhere in the claim.**

### THE GATE, 19 CLAIMS, 0 RED, ON A VERIFIED 4.67x
    the throttle is real (warmed yardstick) ............. 4.67x measured
    the door was really there and really opened ......... visible, then closed
    the tap is context-time zero ........................ 0 audio objects before it
    the room reports for itself ......................... yes
    the room is running after the tap ................... yes
    SOUND WITHIN ONE BEAT OF THE TAP .................... booked at 0.142 s, beat is 0.5 s
    it makes a sound at all ............................. peak 0.0041, rms 0.0013
    THERE IS ENERGY UP HIGH ............................. 11.8% above 1 kHz, 5.6% above 4 kHz
                                                          (the whole shipped mix: 0.02%)
    the band stops where the machine stops .............. 2.9% above the declared 5 kHz
    the hum is mains or a harmonic of it ................ 118 Hz = 2x 60 Hz, 2.0 Hz off an
                                                          exact harmonic on a 10.8 Hz bin
    the missing fundamental is explained ................ 60 Hz at 0.166, 120 Hz at 0.309
    it never reads digital zero ......................... 0 exact zeros in 176,400 samples
    it sits under the heartbeat at the stated ratio ..... 0.6002x against 0.6 asked
    and it is genuinely quieter .......................... yes
    the loop seam does not tick .......................... 0.41x the buffer's own typical step
    the hum crosses the seam in phase by arithmetic ...... 240 whole cycles
    the song makes it quieter, not silent ............... ducks to 0.33, lands at 0.0015
    no page errors ....................................... 0
    WITHOUT THE ROOM THE CLAIM GOES RED ................. mutated run reports not running

**THE SEAM CLAIM HAS NO ABSOLUTE TOLERANCE IN IT.** It is the step across the loop point
against the buffer's own typical step, measured in the same buffer. Five of this lane's own
thresholds have now measured the box instead of the game, so there is not a sixth in here.

**THE MUTATION GOES IN BEFORE THE DOOR OPENS, NOT AFTER THE READING IT FALSIFIES.** This lane
shipped a control once that ran after its own reading and controlled nothing.

---

## 5. ONE GATE CLAIM WAS WRONG AND THE SOUND WAS RIGHT, WHICH IS WORTH MORE THAN THE FIX

The first run went red on one claim: it asked for the strongest bin under 300 Hz to be 60 Hz,
and measured **118 Hz**.

The cause is that two of my own school-page rules pull against each other. Rule 4 declares an
AM band with a 100 Hz low corner. **A 100 Hz highpass takes about 10 dB off a 60 Hz
fundamental.** A hum heard through a transmitter loses its fundamental, which is exactly what
a transmitter does to a hum.

**AND THE ANSWER WAS ALREADY WRITTEN IN RULE 2's OWN PARAGRAPH:** a fluorescent ballast hums
at 120 Hz, twice mains, because the magnetic force peaks twice per cycle. 118 Hz is one bin
off 120 on a 10.8 Hz bin.

So the claim now tests **what rule 2 actually says**, "60 Hz or an integer multiple of it",
prints which multiple it found, and a second claim checks that 60 Hz really does sit below
120 Hz so "the low corner ate the fundamental" is a measured statement rather than an excuse.

> **THAT IS NOT LOOSENING A TEST TO MAKE IT PASS. It is testing the rule as written instead
> of the narrower thing I typed by mistake, and the difference is that the corrected claim
> can still fail: a hum at 90 Hz would go red.**

---

## 6. AND A TYPO OF MINE RAN THROUGH THREE INSTRUMENTS THIS ROUND

The heartbeat's accessor is **`__pulseState`**. I read **`__pulseStats`** in three separate
instruments this round. It does not exist, so `window.__pulseStats && ...` returned undefined,
and every one of those instruments reported a plausible **`false`** instead of an error.

> **THE DANGEROUS MISTAKE IS NOT THE ONE THAT CRASHES. It is the one that hands back a
> believable value.** In the first of those runs it read as "the pulse is off", which I was
> one step from writing down as a finding about the game.

The new room is therefore spelled `__roomState`, matching the build's own convention, and the
gate asserts that the accessor is a function before it reads anything from it.

---

## 7. WHAT THIS DID NOT TOUCH

    the heartbeat .................... untouched, recipe, GAP and level
    the 65 approved sounds ........... untouched, none cooked, none deleted
    the 142 songs .................... untouched
    the transport and 120 BPM ........ untouched
    the street's ambience bed ........ untouched, that is [quiet floor] and it is HELD
    new nodes ........................ two filters and one gain, for one voice
    cooked ........................... nothing

Build stamp: **BUILD 9/21a - THE ROOM IS ON**.

---

## 8. TO THE VOTE TAB WHEN THE ALPHA OPENS ON IT

1. **The room sits at 60% of the heartbeat's energy.** WHY: somebody had to decide which of
   the two you notice first, and I made the heartbeat win.
2. **It ducks to a third when the song lands instead of stopping.** WHY: a room that stops is
   a file that ended, but he may want the song to have the place to itself.
3. **The machine is an AM broadcast, 100 Hz to 5 kHz.** WHY: it makes the loading room and
   the music the same transmitter, which is the answer this lane's school gave to his own
   sound ruling being amended.
