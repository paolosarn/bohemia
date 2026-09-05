# BB STUDY -- DAY 22: THE CITY MAKES NO SOUND WHEN NOTHING IS HAPPENING
# (coordinator, on his trigger. Days 1-21: records/BOHEMIA_BB_STUDY_DAY_*.md)
# HIS LOUDEST PLAYTEST COMPLAINT WAS "THE CITY SEEMS DEAD ASF" AND TWENTY-ONE
# DAYS NEVER ASKED WHETHER IT IS DEAD BECAUSE YOU CANNOT HEAR IT.

## 0. THE QUESTION
Sound is the last big untouched system in this study: 3 incidental
mentions across 21 records. And it is not a side dish here -- the 120 BPM
LAW says **everything quantizes to the beat**, so the clock this whole
game runs on is a musical one. **What does Bohemia sound like when you are
just standing in it?**

## 1. TWO THINGS I EXPECTED TO FIND, AND BOTH WERE WRONG. SAY SO FIRST.
**(a) "WALKING IS SILENT."** Three records dated 8/20 and 8/21 say exactly
that. **STALE.** Footsteps are built: `__surfaceOf` classifies **six**
surfaces (gravel, asphalt, wood, concrete, sand, dirt), ported from the RUN
slice's classifier rather than reinvented, with a correct fallback so an
unapproved surface plays the old sound instead of going quiet. Its own
comment records the fix: Paolo approved step_concrete, step_sand and
step_wood in his 8/12 sweep and *"had NEVER HEARD ANY OF THEM in the game,
because the six-surface classifier lives in the RUN slice and the city is
what he actually walks."*
**(b) "THE CITY SENDS NO SOUND AT ALL."** My first sweep looked for the RUN
slice's message names (`BOHEMIA_SFX`, `BOHEMIA_SFX_AT`, `BOHEMIA_NPCSTEP`)
and got **zero in the walked city**, which reads as a catastrophe. **The
positive control killed it:** the city uses a different vocabulary --
`bohemiaCitySfx` (7 sends) and `BOHEMIA_STEP`. **Fourth time this
discipline has saved a false finding. A NEGATIVE RESULT IS A CLAIM ABOUT
YOUR INSTRUMENT.**
**THERE IS A SOUND LANE AND IT HAS BEEN WORKING.** The architecture is
right: ONE AudioContext, the parent's, because *"the city is an iframe and
must never build a second audio graph"*; the frame posts the event and the
shell renders it through the shared limiter; `placeSound` does real
distance, pan and occlusion; UI sounds are DERIVED from the button's state
(a withheld verb plays `ui_deny`) *"never by reading a label"*; and stings
get their own channel because *"a sting is not a playSFX, it is a figure in
the score."* None of that is the problem.

## 2. THE MEASUREMENT -- 14 SOUNDS OUT OF 65, AND EVERY ONE IS A REACTION
The bank is `banks/BOHEMIA_SFX_APPROVED_8_20_26.json`: **65 named sounds,
185 approved variants** after eight thumb sweeps. (Three records say "97
approved sounds". The bank says 65 names. **The 97 is stale or counting
something else; the number to quote is 65.**)
**WHAT THE WALKED CITY CAN ACTUALLY PRODUCE**, counted by what it SENDS,
not what its text mentions:
```
come_up      waking up            door_drag    a door
phone_buzz   a job arrives (x2)   sleep_sink   going to bed
went_down    you go down
ui_tap / ui_back / ui_deny        derived from the button
BOHEMIA_STEP -> step_asphalt / _concrete / _dirt / _gravel / _sand / _wood
```
**FOURTEEN OF SIXTY-FIVE.** And the shape matters more than the count:
> **EVERY SINGLE ONE IS A REACTION TO SOMETHING THE PLAYER DID.**
> **STAND STILL AND THE VALLEY MAKES NO SOUND AT ALL.**
(Mention-vs-use checked one name at a time. `block` appears 25 times in the
city and every one is a city block; `eat` appears inside `heat` and
`repeat`. Neither is ever sent.)

## 3. *** AND THE BED IS BUILT. HE GAVE IT A PERFECT SWEEP. THE SURFACE HE
## WALKS NEVER ASKS FOR IT. ***
Three sounds in that bank are the sound of a place simply existing, and the
MUSIC tab's own labels say what they are:
```
air_day     "THE VALLEY AT MIDDAY"  -- outside, in the heat.
                                       what you hear when nothing is happening
air_night   "THE VALLEY AT NIGHT"   -- outside, after dark. THIS ONE IS THE HORROR
air_inside  "INSIDE A BUILDING"     -- a room with nobody in it but you
```
**ALL THREE ARE FIVE VARIANTS OUT OF FIVE, THUMBS UP. FIFTEEN OF FIFTEEN.
His cleanest sweep in the whole bank, on the three sounds that mean THE
WORLD IS THERE.** They are **never sent by the walked city.**
The bed itself (`AMB`) is finished and thoughtful -- indoors picks
`air_inside`, outdoors picks `air_night` before 06:00 or from 19:00 and
`air_day` otherwise; a random 40-95 second gap; its own bus at 0.4 of the
judged level; and it stops entirely when the reports stop so it can never
play over him judging candidates. Its own header says the point out loud:
> *"a rare sound so the valley is not dead air... What it does is make the
> place feel occupied by nothing."*
### THE CAUSE IS ONE MESSAGE, AND FOUR SYSTEMS RIDE IT
`AMB.where` has exactly one caller: the `BOHEMIA_WHERE` handler. That
handler also does three other things in the same line:
```js
LISTENER.inside = !!d.inside;   // occlusion: is a wall between us
AMB.where(d);                   // the ambience bed
musicPhase(d);                  // day / dusk / night music pool
timePass(d);                    // the passage-of-time cue
```
**`BOHEMIA_WHERE` is posted by `slices/BOHEMIA_RUN_CURRENT.html`, every
four seconds. THE WALKED CITY NEVER POSTS IT.** Positive control: the
city's only two hits for that string are **filenames inside comments**
(`BOHEMIA_WHERE_THE_GOOD_STREET_PIXELS_ARE_7_31_26.md`). Not sends.
**THAT IS THE 8/14 ONE-WALKED-SURFACE MIGRATION AGAIN, AND IT IS THE FIFTH
SYSTEM IT STRANDED.** Day 6 found the faction world; this is the ambience
bed, the occlusion listener, the music clock and the time cue, all on one
four-second heartbeat that stopped being sent when the surface changed.
**A MIGRATION LIST IS A DELETION LIST FOR EVERYTHING NOT ON IT** (day 6's
own rule) -- and this is what it deletes when nothing crashes.
### AND THE MUSIC IS PERMANENTLY NIGHT
`CITYMUS.phase` ships hardcoded `'NIGHT'`, and **`musicPhase(d)` is the only
thing in the build that ever assigns it.** So on the surface he walks, the
phase never leaves NIGHT and `phaseCat()` returns OVERWORLD NIGHT forever.
The alpha's own 8/4 block already found and fixed this once, for the RUN:
> *"CITYMUS.phase shipped hardcoded to 'NIGHT'... The clock landed. Nobody
> set it... over 200 draws, THE MARKER ON THE DOOR came up ZERO times -- the
> one song in this entire project he has ever said he likes ('now one of my
> new favorite songs that you've made'), tagged OVERWORLD DAY by his own
> hand, unplayable in the run since the day he tagged it."*
**IT WAS FIXED ON 8/4 AND THE MIGRATION UNFIXED IT.** The song he likes is
tagged OVERWORLD DAY and the walked city can never be in day.

## 4. WHAT THE GAME HE NAMED DOES -- AND IT IS THE ANSWER TO DAY 13
BB's ambience is **per-terrain and per-settlement**, and the devs' stated
goal was that you *feel immersed in the terrain your figurine stands on*:
- coast: seagulls and waves. swamp: insects and frogs. snow: icy wind.
- **at night**: wolves howling in forests, crickets in the steppe.
- **settlements have their own**: people, dogs, cats and chickens, plus
  smithy hammering, temple sermons, and tavern laughter and singing.
**THE PLACE TELLS YOU WHAT IT IS BEFORE YOU LOOK AT IT.**
Day 13 measured that our roadside director asks for 70% of its moments out
of 25% of its content and concluded **stop counting content and count
COMBINATIONS.** Sound is the cheapest combination multiplier we own: it
needs no new pixels, it passes no art gate, and the material is already
approved. **A district that sounds different IS different, at zero art
cost.**

## 5. THE OTHER AISLE -- AND IT SETTLES WHAT "DEAD" SOUNDS LIKE
- **KEYNOTE SOUNDS (R. Murray Schafer, acoustic ecology).** He separates
  the **keynote** -- the background bed, named after the key of a piece of
  music -- from **signals** (foreground sounds meant to be noticed) and
  **soundmarks** (sounds a community values). The finding that matters:
  **keynote sounds are not listened to consciously, but they deeply imprint
  a person's sense of PLACE.** That is `air_day` / `air_night` /
  `air_inside`, described in the literature before we named them. **We ship
  only signals. We have no keynote.**
- And it is **reciprocal**: a soundscape gives a community its identity AND
  encourages certain behaviour from the people in it. Which is
  LIGHT=TERRITORY arriving through the ear.
- **WHAT A CITY ACTUALLY SOUNDS LIKE WHEN THE MACHINES STOP.** The 2020
  lockdowns are the largest measurement ever taken: human-generated
  high-frequency ground noise fell **by up to 50%**, the longest and most
  prominent such drop in recorded history, **largest in the densest cities**
  -- and the detail that decides our design: **signals that had always been
  there, previously buried, became clearly audible.**
> *** DEAD IS NOT SILENT. DEAD IS A DIFFERENT BED. *** A city with the
> machines off does not lose its sound, it loses the LAYER THAT WAS MASKING
> EVERYTHING ELSE. Wind gets loud. A generator four blocks away gets loud.
> A dog gets loud. **Post-collapse Las Vegas should be the most sonically
> distinctive place we could have picked, and right now it is the quietest
> room in the build.**

## 6. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE ***
Day 13 took his loudest complaint -- **"THE CITY SEEMS DEAD ASF"** -- and
answered it entirely in the visual and content domain: more encounters,
more combinations, more density, and a correct refusal to invent canon.
**NOBODY ASKED WHETHER IT IS DEAD BECAUSE IT MAKES NO SOUND.** He was
describing a feeling, and we assumed the feeling came from what he could
SEE. Standing still in Bohemia produces **absolute silence** -- not quiet,
not sparse, **nothing** -- and no amount of drawing fixes that.
**AND THIS IS THE CHEAPEST UNFINISHED THING IN THE ENTIRE STUDY.** The
sounds are recorded. He gave the three bed sounds a perfect fifteen-for-
fifteen sweep. The bed logic is written, tuned and documented. The audio
bus, the limiter and the placement model all exist and are correct. **What
is missing is one message, sent every four seconds, from the surface he
walks.**

## 7. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** the keynote bed, on the walked surface. Per-place ambience the
way BB does it, because it is combinations not content. A lit circuit that
hums, since `generator` (4 of 5) and `power_on` (2 of 5) are approved and
never sent. And the music clock reconnected so the day pool can be reached.
**REFUSE:** new sound cooks. **The bank is not the bottleneck -- 51 of 65
approved sounds are unreachable already**, and recording more while the
approved ones cannot play is the seventeen-invisible-hats shape for the
fourth time. Also refused: a second audio graph in the city iframe (the
module already refused it, correctly), and any ambience loud enough to
compete -- the 0.4 bus he was told about before he thumbed is the plan he
approved.

## 8. ROUTED
- **SOUND / RUN -- BB-THE-CITY-SENDS-WHERE.** The walked city posts
  `BOHEMIA_WHERE` with `inside` and `night` on a four-second heartbeat, the
  way the run slice has since 8/1. **ONE MESSAGE, FOUR SYSTEMS: the
  ambience bed, the occlusion listener, the music phase and the time cue.**
  No new sound, no new art, no ruling from him. **Take this first.**
- **MUSIC / SHARED -- BB-THE-DAY-SONG-PLAYS.** `CITYMUS.phase` is hardcoded
  `'NIGHT'` and `musicPhase` is the only assignment in the build, so the
  walked surface is permanently night and the one song he has ever said he
  likes cannot come up. Rides the row above; verify by phase, not by
  reading the code, because **this exact bug was fixed once already and the
  migration undid it.**
- **SOUND / WORLD -- BB-THE-BED-IS-THE-PLACE.** Per-district ambience on
  BB's model, once the heartbeat exists: the bed picks by where you are
  standing, not just day/night/inside. This is day 13's combination
  multiplier at zero art cost. **WHICH place sounds like WHAT is canon and
  therefore his; the mechanism is ours.**
- **SOUND / WORLD -- BB-A-LIT-BLOCK-HUMS.** LIGHT=TERRITORY is live code on
  the walked surface and every circuit carries an owner. `generator` and
  `power_on` are approved and unreachable. **A block with power should be
  audible from the next street** -- day 6's "name the circuit owner"
  arriving through the ear, and it needs no name to work.
**RUNNING ORDER:** behind the demo, EXCEPT that BB-THE-CITY-SENDS-WHERE is
worth pulling forward -- a demo that is silent when you stand still is the
first thing a stranger notices, and it is the smallest fix in this study.

## 9. CONFIDENCE
- 65 named sounds / 185 approved variants; the 14 the city can produce; the
  five explicit `bohemiaCitySfx` sends; the six footstep surfaces; and
  `air_day`/`air_night`/`air_inside` at 5 of 5 each: **MEASURED** today,
  mention-vs-use checked name by name.
- `BOHEMIA_WHERE` sent only by the run slice, the city's two hits being
  filenames in comments, and `musicPhase` being the sole assignment to
  `CITYMUS.phase` (hardcoded `'NIGHT'`): **MEASURED WITH POSITIVE
  CONTROLS.**
- The stale "walking is silent / 97 sounds" records and the 8/4 music-phase
  fix: **QUOTED FROM THE REPO.**
- BB's per-terrain and per-settlement ambience lists: developer blog
  material via search; **the blog itself is proxy-blocked here and was NOT
  read directly. MEDIUM-HIGH.**
- Schafer's keynote / signal / soundmark distinction and the claim that
  keynotes imprint a sense of place without being consciously heard:
  standard acoustic-ecology material. **HIGH.**
- The 2020 seismic quieting (up to 50%, largest in dense cities, concealed
  signals becoming audible): published in *Science*, July 2020, 300+
  stations. **HIGH.**
- Section 6's argument that "dead asf" is partly an audio problem, and
  section 8: **MY ARGUMENT AND MY ROUTING.**

## SOURCES
Battle Brothers developer blog material on ambient sound that adjusts to
the worldmap surroundings (seagulls and waves on the coast, insects and
frogs in swamps, icy winds in snow, wolves howling at night in forests,
crickets in the steppe) and on settlement ambience (people, dogs, cats,
chickens, smithy hammering, temple sermons, tavern laughter and singing).
R. Murray Schafer's soundscape framework and the World Soundscape Project:
keynote sounds, sound signals and soundmarks, and the finding that keynotes
are not consciously listened to yet imprint a sense of place. "Global
quieting of high-frequency seismic noise due to COVID-19 pandemic lockdown
measures", *Science*, July 2020, and reporting on it. IN-REPO:
banks/BOHEMIA_SFX_APPROVED_8_20_26.json; slices/BOHEMIA_CITY_WORLD.html
(`__surfaceOf`, the seven `bohemiaCitySfx` sends, `BOHEMIA_STEP`, and the
absence of `BOHEMIA_WHERE`); slices/BOHEMIA_ALPHA_0_9.html (`AMB`,
`placeSound`, `LISTENER.inside`, `musicPhase`, `timePass`, `CITYMUS.phase`,
the MUSIC tab labels and the `SETTLED` verdict table);
slices/BOHEMIA_RUN_CURRENT.html (the `BOHEMIA_WHERE` post); and days 6 and
13 of this study.
