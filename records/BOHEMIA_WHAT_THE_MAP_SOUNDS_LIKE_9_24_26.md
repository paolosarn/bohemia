# WHAT THE MAP SOUNDS LIKE (9/24/26, SOUNDS lane) -- [bb ambience], round one
## The map already makes more noise than the street does, and the street makes none

> **RULE 33, PAOLO 9/24, "an executive decision":** the valley is crossed on a MAP the
> Battle Brothers way, a party marker, tap where to go, **time passes**. The row asks for
> **the map's sound from real material, the clock audible.**
>
> **RULE 33g, his words:** *"Battle Brothers is just a bunch of pictures... we can do more
> and put more life into it with this analog horror pixel direction."* So every [bb ...]
> page ends with **what MOVES here that BB's picture does not.**

---

## 1. FIRST, WHAT OURS DOES TODAY, MEASURED ON THE REAL SURFACE

Rule 33(a) says the map **is** the city view we already have: one squeeze out. So this is
measurable now, and it was measured before anything was designed. Every audio node the page
starts was counted by wrapping `start()` **before the page loaded**, because a node that has
already started cannot be counted afterwards.

    THE STREET, 30 seconds standing still          0 audio nodes
    THE MAP, 30 seconds sitting on it             19 audio nodes  (3 buffers, 16 oscillators)

**TWO SEPARATE BOOTS AGREE ON 19.** The game's own probes at the same moment: the music
reports not playing, the room hum reports running, the pulse off.

> **THE MAP IS THE NOISIER SURFACE AND THE STREET IS SILENT, WHICH IS BACKWARDS.** Standing
> still on the street, where a person is, the game makes nothing at all. Sixteen oscillators
> fire on the map in half a minute, roughly one every two seconds, while the music says it is
> not playing.

**AND I COULD NOT SAY WHICH CALLER**, so I am not guessing. My first attempt at attributing
them captured a stack out of a template string, every escape broke, and the run reported
**22 syntax errors and ZERO nodes** -- which reads exactly like a silent game.

> **AN INSTRUMENT THAT THROWS DOES NOT REPORT SILENCE, IT REPORTS NOTHING, AND I NEARLY WROTE
> THE NOTHING DOWN.** The only reason I did not is that the run before it, with a working
> arm, had already said 19.

The 0-on-the-street number is this lane's own two open rows confirmed on this build with a
fresh measurement: `[eyes: bed unplayed]` (the beds are cooked, approved and played nowhere)
and `[quiet floor]` (there is no silent outdoors).

---

## 2. WHAT BATTLE BROTHERS DOES, AND WHAT I WILL NOT PRETEND TO KNOW

**WHAT IT DOES WELL, AND IT IS ONE THING DONE THOROUGHLY:** the overworld's sound is
**ambient music that changes with the state of the world, not with the player's input.** Day
and night are different, terrain and region colour it, and it keeps going whatever you do.
Nothing on that map is triggered by your marker moving. The result is that travel feels like
*time passing* rather than like *an action being performed*, and that is exactly the feeling
rule 33 is asking for.

**AND WHAT IS ABSENT IS THE MORE USEFUL HALF:** the map has no sound for the thing the map is
actually about. Time passes and you hear no clock. A road is faster than dirt and the ground
under the marker never says so. A party crosses your path and the first you know is the
picture.

> **I AM NOT GOING TO LIST THAT GAME'S TRACKS OR CLAIM A MECHANIC I HAVE NOT VERIFIED.** The
> two paragraphs above are what I am confident of. Anything finer than that would be me
> filling a school page with confident sentences, which is the failure mode of a school round
> and this lane has enough real measurements to avoid it.

---

## 3. THE SHAPE FOR US, UNDER NO SAND AND THE BIBLE

    BB                                   OURS
    ambient music, state-driven          KEEP IT. The music engine already follows the clock
                                         and the district; that machinery exists and needs
                                         no new cook.
    nothing marks time                   THE CLOCK IS AUDIBLE. This round's cook.
    the ground is silent under you       the surface under the party says what it is, from
                                         the footstep model that landed 9/24: concrete and
                                         asphalt already sound different because their
                                         moduli differ. Not this round.
    a still picture                      rule 33g: it moves. Section 5.

**AND EVERYTHING FROM HERE IS BUILT FROM REAL MATERIAL (rule 32e), WHICH FOR A MAP MEANS
STRUCK AND RUBBED OBJECTS AND NOT A HISS BED.** The lane just spent a round proving that the
noise recipe's texture lived entirely in the part leaking outside its own band; a map bed
built that way would be the fifth sand sound.

---

## 4. THE COOK: WHAT THIS VALLEY STRIKES ON THE HOUR

**Not one noise generator in any of the three**, and every partial ratio is a **published
series** rather than a set of numbers I liked.

**A TUNED BELL IS TUNED TO A MINOR THIRD.** A founder tunes the partials, and the third one
is a **minor** third, 6/5:

    0.5  hum        1.0  prime      1.2  tierce (MINOR)      1.5  quint
    2.0  nominal    2.5  deciem     3.0  undecim             4.0  double octave

That minor tierce is the entire character of a bell, it is why every bell anybody has ever
heard sounds sad, and it is **this lane's own no-major-third rule agreeing with a bell founder
by accident.**

**A STRUCK BAR OR PIPE IS INHARMONIC**, and that is why it clangs instead of ringing. The
transverse modes of a free-free bar are the classic series:

    1 : 2.756 : 5.404 : 8.933 : 13.34

which is not a chord at all. Measured, the pipe comes out **702 Hz bright against the bell's
265**, which is that inharmonicity showing up as brightness and not as a setting.

**HIGHER MODES DIE FIRST, WHICH IS PHYSICS.** Damping rises with frequency, so:

    the bell     rings 1.608 s at the hum and 0.201 s at its top partial     8.0x
    cracked      0.723 s
    the pipe     2.030 s at the fundamental, 0.152 s at the top

**A CRACK IS THE REALISTIC ONE AND IT LEADS.** A crack stops the shell moving as one piece, so
the partials go off the tuning they were cast to and the ring collapses. Nothing in this valley
has been maintained for ten years. REALISM FIRST: A is the cracked bell.

    measured, all three
      the strike lands on the beat   0.6, 0.5 and 11.6 ms, against the fight's 55 ms PERFECT
      the ring runs on past it       legal: the 120 BPM law is about when a sound STARTS
      every declared partial is      the bell's first five read -2.9, 0, -2.2, -8.9, -5.6 dB
      really in the sound            under its loudest bin, the pipe's first three 0, -0.9, -4.2
      nothing clips                  0.85 peak on all three, through a tanh
      no ring is chopped             last sample 0.000000 on all three

**AND I GOT THE DAMPING WRONG TWICE BEFORE IT WAS THE MATERIAL'S.** The first table was
**twenty times too damped and the bell rang for 85 milliseconds**, which is not a bell at all.
Metals barely lose energy: bronze and steel sit around a loss factor of 1e-4 to 1e-3. Then the
correction went too far the other way: at the bronze's own figure the hum rings **9.6 s**,
which is a cathedral bell and longer than any buffer worth holding, and measuring the last
quarter of the buffer found **0.21 rms still going when the samples ran out.**

> **THIS IS A TOWN BELL, AND WHAT LIMITS A TOWN BELL IS NOT THE BRONZE, IT IS HOW HARD IT
> RADIATES AND HOW IT IS MOUNTED.** So 0.18% and a 1.6 s hum, which is what a town bell really
> does. **The numbers are the material's and the mounting's; the first cut's were mine.**

**AND THE END OF EVERY BUFFER IS FADED**, a raised cosine over 200 ms, because a chopped ring
is a click. The gate checks the last sample against the sound's own biggest step rather than
taking the fade on trust.

**AND THE GATE HAD TO BE SHOWN A SINE BEFORE IT ADMITTED A HOLE.** Nine claims were written
for the three strikes and eight of them went red the moment the cook was swapped for a bare
sine. The ninth, the one that checks every declared partial is really in the sound, **passed**
-- on a sound with **one** partial in it:

    the mutation returns one ratio   ->  one reading  ->  0 dB under its own loudest bin
    and `every` on a one-item list is always true

> **A CLAIM NOTHING CAN FALSIFY IS NOT A CLAIM**, and this one only asked whether the partials
> it FOUND were loud enough, never how many there were supposed to be. A struck object is a
> SET of modes; one mode is a tone. It now asserts the count first, eight for the bell and five
> for the pipe, and the mutation count went from 27 red to 28.

---

## 5. RULE 33g: WHAT MOVES HERE THAT BB'S PICTURE DOES NOT

    THE HOUR IS STRUCK             BB's map has no clock in it. Ours does, and it is an
                                   OBJECT being hit, which means it can be broken. A cracked
                                   bell IS the state of the world, audible, for free.
    IT DECAYS IN FRONT OF YOU      a still picture cannot do 1.608 s of anything. The bell
                                   warms as it fades because its top dies first, and that is
                                   eight seconds of movement in a sound nobody animated.
    IT CAN CHANGE WITHOUT A NEW    the same function makes the bell, the cracked bell and the
    ASSET                          pipe out of one partial table. Whatever the valley has
                                   THIS act is what strikes, so the three acts can strike
                                   three different objects with nothing new drawn.
    AND IT IS THE FIRST SOUND      the thing that marks time on a map where time is the
    THE MAP HAS EVER HAD           mechanic. BB fills that silence with music; we put a
                                   machine in it.

---

## 6. WHAT THIS ROUND DID NOT DO

    wired the strike to the clock     NOTHING. The map's hour is WORLD's and RUN's surface;
                                      this is the sound, in VOTE, ready before it is needed,
                                      and how often it strikes is a design call I have not
                                      taken.
    touched the music on the map      NOTHING. The state-driven music is the half BB does well
                                      and we already have it.
    said which caller makes the 19    NOTHING, and the instrument that tried is named above
                                      along with why its answer was thrown away.
    a map bed                         NOT COOKED, on purpose. A bed is the thing the noise
                                      recipe was for, and rule 32e killed that recipe. A bed
                                      from real material is its own round.
