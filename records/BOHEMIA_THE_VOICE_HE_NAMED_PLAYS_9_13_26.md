# THE VOICE HE NAMED PLAYS (9/13/26, SOUNDS lane)
## [lead never sounds] + [melody first] + [three retagged] — the three EYES E18 bounce-backs

> **HIS RULING (8/2).** On THE MARKER ON THE DOOR: *"one of my new favorite songs
> that you've made great job."* The row he was talking about says
> `inst:{b:'abyssbass', l:'brokenrosary'}`, and the batch 22 verdict records it as
> *"lead brokenrosary"*.

**NOTES ARE RULINGS (7/19). The row is his content.** EYES E18 found that the voice
named in it is scheduled zero times. Censused across the live library, it was not
one song.

---

## THE HEADLINE: 109 OF 142 SONGS NAMED A LEAD THAT NEVER SOUNDED

Measured off the engine's own schedule, 24 bars a song, all 142 live songs:

    the named lead, scheduled ANYWHERE            33 of 142
    the named lead, never scheduled at all       109 of 142
    THE TUNE carried by a bare triangle oscillator  135 of 142
    the tune carried by the voice the row names       6 of 142

The melody branch reached the named lead **only** when `mel==='hymn'` or the lead
was literally `'bell'`. The shelf is 52 songs on `longs`, 51 on `call`, 19 on
`seed8`, 16 on `drive16`: four of the five melody styles could never get there.

So 120 distinct lead voices, every one of them cooked, in the rack, and named by
him, were replaced at play time by **one** sound: a triangle wave through a 2200 Hz
lowpass. The whole shelf had the same instrument on top of it.

### AND EVERY NOTE WAS ATTRIBUTED BY ITS CALL SITE, NOT BY ITS NAME

This is the part that made the measurement trustworthy. The bass, the section-A
accent and the lead can all name the same voice, and the bass gain (0.13) is not a
reliable tell. So the note log records the **line number of the call site out of a
stack trace**. Eleven distinct sites came back and they line up with the code
exactly: kick, hat, bass twice, the accent, two pads, the arp, the hymn cadence,
the bell, and the bare oscillator.

> **A NOTE ATTRIBUTED BY ITS GAIN IS A GUESS. A NOTE ATTRIBUTED BY ITS CALL SITE
> IS A MEASUREMENT.**

---

## THE FIX IS TWO CHANGES, AND ONE OF THEM IS A FLOOR

**1. THE RACK ANSWERS EVERY NAME.** `synthV` is 581 `kind===` branches and, until
now, **nothing after them** — an unknown name rendered silence. The tail now builds
the same bare triangle-into-a-lowpass the melody branch used to build inline, so an
unrecognised name degrades to *exactly what 135 songs played before this round*
instead of vanishing. Measured: **0 of 142 live songs name a lead, a bass or an
accent the rack lacks**, so it fires zero times today. It is a floor, not a change —
and without it, change 2 would mean one typo in a future song row silently deletes
that song's melody.

**2. THE TUNE PLAYS THE VOICE THE ROW NAMES**, resolved by **the mapping already in
this function**: `whistle → karp`, `arp → acid`, `pluck → bell`. I invented nothing.
Those three are abstract lead *kinds* rather than rack voices, and the section-A
accent has resolved them that way since the day it shipped. The resolver is that
line lifted into `MUS.leadVoice()` so the tune and the accent cannot drift apart,
and the gate re-derives **both sides out of the file** so neither can be edited
alone.

The kill-layer `melody` style was the same bug in two more call sites, and got the
same resolver.

### WHAT WAS DELIBERATELY LEFT ALONE

| thing | left alone because |
|---|---|
| the hymn cadence and the bell branch | they already play the named lead. 6 songs that work do not get rewritten to match a new line |
| the gain, 0.07 | the number this branch already used. Changing it would be a taste call wearing a bug fix's clothes |
| every note, scale, kick array and voice in every row | CONTENTS-PAOLO'S. Not one byte of song data is touched |

Note **length** stays the engine's `_fsd`, which is `sd` doubled when
`feel==='half'` — the faithful translation of the oscillator's own decay, so a
half-time song keeps its long notes.

### AFTER

    the tune is the voice the row names        142 of 142
    the tune is a bare oscillator                0 of 142

---

## THE LEVELS, BECAUSE 135 SONGS' WORTH OF MELODY CHANGED INSTRUMENT

This shelf already has one song peaking 13x the median, so a voice swap this wide
without measuring the levels would have been a guess. Rendered the four bars where
the tune actually plays (section B, bars 4 to 8), all 142 songs, before and after:

| | before | after |
|---|---|---|
| median peak | 0.3112 | **0.3107** |
| median rms | 0.0300 | 0.0315 |
| songs that went silent | — | **0** |
| songs that got quieter than half | — | **0** |
| songs more than 2x louder | — | **1** |

The shelf did not move. **One song did: MENU — LIGHTS ACROSS THE VALLEY, 0.220 →
1.064**, which is over full scale pre-limiter. Its lead is `farlights`, used by no
other song on the shelf.

**And I checked whether that was my own doing before blaming the voice.** The
suspect was the doubled note length on a half-time song, so the whole shelf was
re-rendered with `sd` instead of `_fsd`: **1.064 either way.** It is the voice, not
the note length, and the half-time character stays.

It is **reported, not re-balanced**: the song is thumbed BURIED, so no player
reaches it, and its voice mix is his content. It joins THE GAPS IN THE HYMNAL
(7.956, 25.6x the median, CANON) on the list, and the gate now asserts those two
are the **only** two over full scale, so a third is news.

---

## [melody first]: THE PREMISE WAS MEASURED ON THE WRONG SURFACE

The bounce-back said our patience is pointed at the wrong element: *drums 0.0s,
bass 0.0s, melody 8.0s*, where his anchor has the melody already playing when the
beat arrives.

**Measured on the street, on all 142 songs, with the drum hold from round 3 on:**

    the section-A accent    0.0s     on 142 of 142
    THE TUNE               8.0s      (8.0 on 116, 8.25 on 20, 8.5 on 6)
    THE KIT               16.0s      on 138, and 23.5s on the other 4

    the tune arrives AFTER the kit on 0 of 142 songs

**The melody is already playing when the beat arrives, by eight seconds, on every
song on the shelf.** That is the shape his anchor is famous for, and it has been
true since round 3 (93a7bc63) held the kit for a phrase.

EYES rendered with no game surface owning the music, which is **the MUSIC tab** —
where the kit is deliberately never held, because sixteen silent bars at the top of
a candidate he is judging is an artefact, not a song. On that surface the
arrangement genuinely is inverted, by design and by ruling.

> **A MEASUREMENT TAKEN ON THE WRONG SURFACE IS NOT A WEAK FINDING, IT IS A FINDING
> ABOUT A DIFFERENT GAME.** EYES' instrument was right, its number was right, and
> its conclusion was about the judge page.

**And my own first cut of the re-measurement made the mirror-image mistake.** It
lumped every call site in the lead block into one bucket and reported the melody
entering at **0.000s on all 142 songs**, which contradicted EYES outright. EYES was
right: the note at 0.000s is the sparse accent, and the tune is at 8.000s. **A
BUCKET WIDE ENOUGH TO HOLD TWO THINGS ANSWERS A QUESTION ABOUT NEITHER.**

So nothing moves on this row. The number is in the gate, measured with the street
on, so it cannot quietly stop being true.

---

## [three retagged]: TWO, NOT THREE, AND THE REASON IS A LAW

Measured through the engine, the songs whose own data brings the drum in late —
the trait his anchor is famous for — are **four**, not three:

| song | first kit hit | verdict |
|---|---|---|
| MENU — PURPLE DAWN | 23.5s | **BURIED** |
| MENU — DEAD VALLEY DAWN | 23.5s | CANON |
| MENU — LIGHTS ACROSS THE VALLEY | 23.5s | **BURIED** |
| MENU — THE POWER STILL ON SOMEWHERE | 23.5s | CANON |

All four carry an empty kick array, so their first drum is the bar-11 fill. The
card said three because its late-beat term printed the top ten and the fourth fell
outside them.

**GRAVEYARD IS FINAL**, so two of the four are not moved. Measured: the overworld
pool builder already refuses a buried song (`MUS.V[n+'#1']!==0`), so the tag would
have been inert as well as wrong — and the gate holds both facts, so this reason
cannot quietly stop being true either.

**The two CANON ones go to OVERWORLD DUSK/DAWN**, and the pool goes from **2 songs
to 4** — the thinnest pool on the shelf, carried in this lane's handoff as a hole
since round 1. Both songs are named for first light, and his own 8/26 words about
the second are *"i liked the power still on somewhere when it was calm."* A calm
song at the calm edge of the day: **REALISM FIRST**, and it fills the hole.

**Nothing is taken away.** The MENU tag stays, so both keep their job at the front
door, and `menu:true` stays on the row — which is where his 8/26 ruling
(*"menu music doesnt get impacted by intensity type shit"*) is read from, so a menu
song on the street still never intensifies.

---

## VERIFIED ON THE REAL SURFACE, AND THE CONTROL IS THE SAME SONG

Not offline. The shipped alpha in real Chromium, the real AudioContext, the real
street shuffle, real seconds, with `synthV` recording what came out:

| build | song | its named lead | times heard |
|---|---|---|---|
| plain `origin/main` | TWO COINS FOR THE FERRYMAN | obolbell | **0** |
| this change | TWO COINS FOR THE FERRYMAN | obolbell | **5** |
| the cut demo | TWO COINS FOR THE FERRYMAN | obolbell | **5** |

Same song, same step (98), same conditions, no page errors on any of the three.

**And the first run of that probe lied, for the oldest reason in this lane.** A
fixed 26-second wait landed on step 62 — **two steps** before the song's own B
section — and reported that the lead was never heard about a tune that was not due
yet. Worse, the song turned over mid-wait, so the notes counted belonged to two
songs. It polls for the condition now and clears its log whenever the song changes.
**A FIXED WAIT IS NOT AN EVENT**, which this lane has now written down three times.

---

## THE GATE, AND THE MUTATION THAT HAD TO BE THROWN AWAY

`gates/named_lead_gate.py`, in the suite as **NAMED LEAD**, 33 claims, 35 seconds.

**Its first mutation was worthless and it looked fine.** To prove the detector
bites, it pointed `MUS.leadVoice` at a name the rack does not have — and the census
read 57, 24, 60, 72 notes. Of course it did: the census compares what was scheduled
against **what the resolver asked for**, and a bogus name is still a name that got
scheduled.

> **A MUTATION THAT DOES NOT REPRODUCE THE DEFECT ONLY PROVES THE CHECK CAN SEE
> SOMETHING ELSE.**

The mutation now reproduces the defect itself: the tune's voice call is intercepted
by its call site and a bare triangle built in its place, which is the `else` branch
that stood there until this round. The tune then reads **0** named notes and counts
the oscillator instead.

**And that mutation immediately caught a second, worse hole in my own gate.** With
the old bug fully restored, the claim "the named lead is scheduled" still **passed
on two of six songs** — because when a row has no `am` field, the **section-A
accent** has always played the lead. The accent was answering a question about the
tune. The accent's own call sites are found in the file and excluded now, and the
headline claim is about the tune alone.

**Then the gate red-flagged one of my own sentences.** The claim
"the melody is already playing when the beat arrives **on the street**" was being
measured by a census that runs with `CITYMUS.on` false — the MUSIC tab — so it read
the kit at 0.0s and failed. It runs a second, small census with the street on now.
**A CLAIM ABOUT ONE SURFACE MEASURED ON ANOTHER IS NOT A WEAK CLAIM, IT IS THE
WRONG ONE** — and that is the third time this round the same mistake showed up,
twice in my instruments and once in the bounce-back itself.

---

## WHAT THIS CHANGES FOR HIM

Every song on the shelf now plays the instrument its own row names. Before this,
120 different cooked voices — bells, pianos, organs, choirs, horns, harps — were all
replaced at play time by one triangle wave, so the whole 142-song shelf had the same
sound on top of it. That is the biggest change to what the game sounds like that this
lane has shipped, and it took no new cook and no note of his being touched.

Tab: **MUSIC** for the shelf, and you hear it on the street in **RUN**.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new song, no new
tag beyond two entries in a table that already exists, no new event and no new
number.

    python3 gates/bohemia_gates.py --only "NAMED LEAD"

Build 9/13 - THE VOICE HE NAMED PLAYS.

---

## POSTSCRIPT: THE BEAT CHECKER HAD FOUR FAULTS AND THE BEAT HAD NONE

The lane's pre-push pass went 10 of 12 green. One red was ROOM SONG going red for
the work going right (above). The other was **BEAT FIRST, which guards the 120 BPM
LAW**, so it was not going to be waved through.

**FIRST, THE THING THAT WAS AT RISK, MEASURED DIRECTLY.** A bare oscillator is three
nodes; some rack voices COMPUTE A BUFFER IN JAVASCRIPT. `playStep` runs on the main
thread at 120 BPM, so if the named voices cost meaningfully more per note, the law
breaks. Timed across all 142 songs, 24 bars each, both trees:

| | main | this change |
|---|---|---|
| median cost per step | 0.1188 ms | **0.0677 ms** |
| worst average, any song | 0.5221 ms | 0.8263 ms |
| worst single step | 53.9 ms | 60.8 ms |
| **any step over the 125 ms budget** | **none** | **none** |

The typical step got **cheaper**, because a rack voice is often simpler than an
oscillator plus a filter. The worst single step lands on a *different song* in each
tree (53.9 ms on THE COUNTING ROOM on main, 4.5 ms on the same song here), which is
what a first-call warm-up looks like, not a per-note cost. Only two songs' average
more than doubled, to 0.227 ms, which is 0.2% of the budget.

**THEN THE GATE ITSELF, FOUR TIMES OVER.** Twenty runs, ten a tree, and across every
single one of them the claim that actually matters read the same: **the song's first
note landed 0.00 ms off the pulse grid, 20 of 20, on both builds.**

1. **A GATE THAT ONLY PRINTS ITS NUMBERS WHEN IT FAILS CANNOT BE COMPARED ACROSS
   RUNS.** This is why 9/6 noticed the flake and could do nothing with it. Fixed
   first, before any diagnosis: it now always prints what it measured.
2. **A SAMPLER WHOSE WINDOW IS SHORTER THAN ITS OWN STEP DETECTS BY LUCK.** The meter
   listened through 23 ms of history and polled every **41 ms** (measured, now
   printed), so 18 ms of every step was unwatched and a thump could hide in the
   hole. The window is 46 ms now and covers the step.
3. **A MISSED THUMP IS NOT A WRONG TEMPO.** The claim wanted 60% of lub-to-lub gaps
   within 60 ms of half a second, which a meter that drops one thump can never give:
   the gap becomes 1.0 or 1.5 and the tempo is untouched. Gaps of `[2, 0.47, 0.528]`
   were passing while `[1.481, 0.531, 1.489, 0.99, 0.51]` failed, on the same build.
   Now every gap must be a whole number of half-seconds.
4. **A TOLERANCE TIGHTER THAN THE INSTRUMENT'S OWN RESOLUTION MEASURES THE
   INSTRUMENT.** The last red was a gap of 0.560 judged against a fixed 60 ms, by an
   instrument whose timestamps are good to 21-46 ms. The tolerance is derived from
   the sampler's own measured step plus window now, with a guard that says so out
   loud if the machine ever gets too slow for the claim to mean anything.
5. **A CLAIM THAT FAILS WHEN THE GAME GETS FASTER IS ASSERTING THE LOAD, NOT THE
   FEATURE.** The coverage claim was really the city iframe's parse time, which
   swings **3.0 s to 15.5 s on identical code** (15.0 eight times, 5.0 four times,
   3.0 twice) against a floor of 4.0 sitting inside that range. It failed hardest
   exactly when the game loaded fastest. The length is printed now; the law is
   carried by the four exact claims that were already there.

**BOTH FIXES MUTATION-PROVED, and the mutations were built to isolate the claims.**
A pulse rendered at 0.65 s while the code still *declares* SEC 0.5 and BPM 120 — so
every declared number passes and only the sound is wrong — is caught on 8 gaps at a
67 ms tolerance. The pulse-start hook made a no-op reds the replacement claim first.
The game file was mutated in place both times and restored from backup; git confirms
nothing of either mutation remains.

**AFTER: 10 of 10 green on both trees, 18 claims.** Before: 1 of 5 red on plain
`origin/main`, 2 of 5 on this branch, same pulse.

> **FOUR FAULTS IN ONE GATE, ALL FOUR IN THE INSTRUMENT, NONE IN THE BEAT** — and a
> coin flip had been deciding every lane's ship.
