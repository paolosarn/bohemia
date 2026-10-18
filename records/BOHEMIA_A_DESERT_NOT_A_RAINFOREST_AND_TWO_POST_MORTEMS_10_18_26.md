# A DESERT, NOT A RAINFOREST, AND TWO POST-MORTEMS

SOUNDS lane, 10/18/26, row `[a desert, not a rainforest]` (THREE-FIXES-HE-NAMED), the new age (VAMILY rules 112
to 115: the coordinator opens the chat, the round runs to the end, no check-in, no question). His thirteenth votes,
10/17, on this lane's cards:

- `sounds-the-settlement-heard-whole-10-17` UP, with the note: *"I just heard too many bird noises and insect
  noises, like you know in a economic apocalypse Las Vegas that probably doesn't sound like rainforest, too many
  birds going on, but yeah, I like it."*
- `sounds-the-recap-speaks-10-16` DOWN: *"Bro, this voice was so fucking bad. I don't know if you gotta put
  filters on top of it but holy shit that was so fucking bad."*
- `sounds-the-title-is-detuned-10-5` DOWN: *"The hiss noise is way too loud and even then the music behind it
  like sucks ass, bro."*
- UP with no words: the night's insects (the travel clip's), the board's nail, the barber's clippers.
- DOWN with no words: the armourer's rivets, the smith's hammer, paper against the post, a can on the counter.

The row's end state: the settlement bed thinned to what the Mojave has at that hour (recordings, counted); the
recap voice pulled until a voice that passes exists; the title's hiss at a level and the music redone or removed;
all three in VOTE; real material only.

## FIX ONE: THE BED, COUNTED

What he heard on 10/17 (`bed_day_rainforest`, kept under that name for the A/B): a hen clip with 8 calls in its
5 seconds and a songbird clip with 10, both LOOPING for the whole 24 s under the wind, and a rooster crowing once
every loop. By construction (the 20 ms onset counter in `tools/bohemia_from_a_recording.py`, `count_calls`):
**418.5 animal calls a minute.** The night bed had the crickets at -6 dB under the wind for the whole loop: a
chorus.

What the Mojave has, from outside the repo (the real-world angle rule 6 asks for):

- Las Vegas's own birds are the great-tailed grackle, the mourning dove, the house finch, the rock pigeon and the
  house sparrow ([UNLV's campus wildlife guide](https://www.unlv.edu/news/article/unlvs-wild-side), a birder's walk
  down [the Strip](https://www.10000birds.com/birding-las-vegas.htm), the [Las Vegas Advisor](https://www.lasvegasadvisor.com/amp/question/trees-birds-emerald-island/)
  on grackles in parking lots). Heard one at a time across a lot, not as a canopy.
- A pre-dawn Mojave field recording near Welcome Spring is catalogued with **no animal sound at all**, only wind
  through the Joshua trees and shrubs ([University of Utah collections](https://collections.lib.utah.edu/details?id=1119479)).
- Crickets exist in the Mojave in the warm months ([Acoustic Atlas, Mojave National Preserve, August](https://acousticatlas.org/item.php?id=803)),
  and a camper's desert night is quiet enough that a kangaroo rat is heard from forty feet; the loud things at
  night are coyotes, owls and a far road, not insects ([Desert's teaching](https://westminsterexpedition.substack.com/p/deserts-teaching)).

So the wind is the bed. The thinned recipe (`BEDS` in the tool, ids `bed_day` and `bed_night`, so the settlement
page plays them without a line changed, NOTES ARE RULINGS):

| bed | what changed | calls a minute | 2 to 6 kHz band (where birds and crickets live) against the whole |
|---|---|---|---|
| day, 10/17 | hens and birds looping, a rooster every loop | 418.5 | -15.2 dB |
| **day, 10/18** | the wind; ONE hen call at 5 s (-20 dB, far); ONE two-chirp phrase at 15.5 s (-22 dB); the rooster out of the bed | **7.5** | -17.9 dB |
| night, 10/17 | the crickets at -6 dB for the whole loop | 108 (a steady chirp counts every stroke) | -9.7 dB |
| **night, 10/18** | the crickets at -18 dB, twelve down: one far cricket somewhere, not a chorus; the fire barrel stays | 108 | **-16.6 dB** (6.9 dB down) |

The far pool thinned with it (the settlement page's `scheduleFar`): the rooster moved there as `far_rooster`
(peak -20 dB), the crow left the night pool (a crow does not call at night; the night pool is the siren and the
helicopter), and the gap between far things grew from 14-32 s to 20-50 s.

`--check` now holds these numbers: the day bed must be under a tenth of the rainforest's calls (7.5 against 418.5
passes; 42 would fail), the night's cricket band at least 6 dB down (6.9 passes). CHECK PASS: 14 sounds, 5 beds,
5 events, every peak under -1 dBFS after the mp3, no click, every source CC0. The bar's murmur file is the 10/17
render untouched (its room is ray-traced, so a re-render drifts by a fraction of a dB; the voted file stays).

The rooster's own clip, the hen's and the bird's are the same CC0 recordings as 10/17 (jsbarrett's hen, dwareing's
chirping birds, dudermensch's rooster); nothing new was pulled, nothing was synthesised.

## FIX TWO: THE RECAP VOICE, PULLED

`slices/BOHEMIA_FIGHT.html` no longer loads `engine/bohemia_narrator.js` and its `showOver()` no longer calls
`speak()`. The screen is silent again, as it was before 10/16. The wrapper file stays: it is a toggle, a cancel
and a tap-to-stop around whatever voice is plugged in, and the day a voice that passes exists (a real recorded
one; this lane fakes no voices, and no recording host is reachable from the build box, measured 10/17) it is the
plug. `gates/narrator_gate.js` keeps its three behaviour claims on the wrapper and FLIPS the fight's claim: it
plants a stub narrator on the real recap page, runs `showOver('won')`, and proves nothing was asked to speak, then
reads the fight's source for a script tag or a `speak(` call (8/0).

POST-MORTEM (GRAVEYARD IS FINAL, `gates/bohemia_graveyard.txt`): the phone's own speech engine reading player-facing
text is dead, with or without a filter chain on it. His words name the filter idea and reject it in the same
breath. What was wrong was not the rate or the pitch: a text-to-speech engine is a performance of a sentence by a
machine that has no idea what the sentence is, and in a game whose every sound is a real thing in a real room it
was the one sound with no body. The lesson is the same as the sand rule: a sound with no material behind it does
not pass, and a voice is a material. The judge page `slices/BOHEMIA_THE_RECAP_SPEAKS_10_16_26.html` stays with his
words across its top and no suggestion it is live.

Not in VOTE: there is nothing to hear in a pull, and a text-only item is a NO by his first votes (TEXT ITEMS ARE
BORING). The coordinator's brief carries it.

## FIX THREE: THE TITLE, FROM A RECORDING

The 10/5 title was the engine's noise generator as its hiss (`songThroughSpeaker`'s HISS at 0.28 of full scale
inside the broadcast band) under an oscillator phrase on a 3 percent flat deck. POST-MORTEM: his two complaints
are one complaint. The hiss was loud because it was a generator with nothing in it but level, and the music was
bad because it was the lane's own pentatonic phrase on a sine, the thing he has said since 10/10 sounds coded.
Neither can be fixed by turning a knob on the same construction; GRAVEYARD IS FINAL and the function stays in
the engine as evidence only (its comment says so; the gate's three measurements of it still run so nothing goes
red for the wrong reason). A DEAD SHAPE DOES NOT COME BACK UNDER A NEW NAME: not a quieter generator, not a
slower phrase.

The replacement starts from a recording, like every sound since 10/17 (`TITLES` in the tool, files in
`slices/vote/title_heard/`):

| candidate | what it is | level | the part above 2 kHz, where hiss lives |
|---|---|---|---|
| A `title_wind` | toiletrolltube's CC0 wind, the same one under the settlement, through the tape at full depth and a 6 kHz low-pass, 32 s, loops | **-30.0 dB rms** (asked -30), peak -18.2 | -18.4 dB under the whole |
| B `title_wind_and_bell` | the same wind, and JarredGibb's CC0 church bell at HALF SPEED (an octave down, twice as long), one strike at 3 s (-4 dB) and one at 19 s (-7 dB), in the hall room at 50 percent wet | -30.0 dB rms, peak -17.3 | -18.5 dB |

The hiss is now a stated number, held by `--check` (rms within 1 dB of the ask). Found on the way: Pedalboard's
`Limiter` adds make-up gain (+6.75 dB on a -36 dB test), so a limiter after the level stage silently undid it on
the first render; the level is set by pure gain and the ceiling by a scale-down, never a limiter after the level.

The music question answered both ways, as the row allows: A removes it, B redoes it as one real bell. The bell at
half speed is the whole theme; there is no phrase, no scale, no oscillator anywhere in the file.

NOTHING IS WIRED. The title screen plays nothing, as it did before 10/5. Unjudged is silent.

## THE PAGES, PROVED ON A DRIVEN PHONE (390x844, over http)

```
A DESERT, NOT A RAINFOREST  SOUND ON -> bed_day; RAINFOREST -> bed_day_rainforest; NIGHT -> bed_night_rainforest;
                            DESERT -> bed_night; the count table 4 rows; errors 0
THE TITLE IS THE DESERT     SOUND ON; PLAY A -> title_wind looping; PLAY B -> title_wind_and_bell; 2 cards; errors 0
THE SETTLEMENT HEARD WHOLE  SOUND ON -> bed_day (the thinned one); NIGHT -> bed_night; 5 beds in the manifest;
                            the screen live; errors 0
```

## REGISTERED

- `sounds-a-desert-not-a-rainforest-10-18`, kind sound, draft:true, options A (the desert as it is here) / B
  (thinner still: the wind and the fire only, no bird and no cricket at all). Page
  `slices/BOHEMIA_A_DESERT_NOT_A_RAINFOREST_10_18_26.html`.
- `sounds-the-title-is-the-desert-10-18`, kind sound, draft:true, options A (the wind alone, no music) / B (the
  wind and the slow bell). Page `slices/BOHEMIA_THE_TITLE_IS_THE_DESERT_10_18_26.html`.

## GATES (rule 13: the pre-push pass, by name)

- `gates/narrator_gate.js` 8/0 (was 7/0; the fight's claim flipped to the pull, one source claim added).
- `gates/cooked_sounds_gate.js` 240/0, unchanged (the title's three measurements still run on the evidence function).
- `tools/bohemia_from_a_recording.py --check` PASS with the two new holds.
- `gates/vote_tab_gate.js`: the two new items pass the shape claims (two sentences, "you hear it"). The gate then
  reads "the newest thing is at the top [top is undefined]" and times out on `page.fill`: with zero red-tagged
  items and the two new ones untagged behind the fold, nothing is in front, and the gate assumes a row in front.
  Reproduced on a clean tree (the same timeout; the four TUNING items red as before). The gate's assumption is
  UI's ([the triage filter]); routed in the handoff, not patched from this lane.

## WHAT THIS ROUND DID NOT DO, SAID PLAINLY

- No voice. A recorded human voice is the only road left for the recap and the narrator, and the box cannot
  reach a recording host; this is PLUMBER [the toolchain] territory, named 10/16 and still true.
- The four wordless DOWNs (rivets, hammer, paper, the can) are not re-cooked here: each was an engine-built
  sound, and the 10/17 settlement already answers those buildings from recordings (`armourer_rivets`,
  `build_hammer_and_saw`, `stall_can` from a real can). Their graveyard lines are owed by the [the settlement's
  sounds] row's next round, which retires an engine call per round against this vote.
- The thinned bed is in the VOTE tab as a candidate and plays on the settlement judge page; the live settlement
  screen in the demo still plays what it played (the wire is the next round's one line per building, after A/B).
