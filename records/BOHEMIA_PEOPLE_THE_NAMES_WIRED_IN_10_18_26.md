# THE NAMES WIRED IN: ONE ROLL, THE COUNTY'S MIX (PEOPLE, 10/18/26)

Row: PEOPLE [the names wired in] THE-MIX-IN-THE-GAME. The plan was the names mix
(6bb2be0c, a page under the hold); the coordinator released this lane (sweep AR,
17:16: 23 lanes running, only DYNASTY, WORDS and LIFE+CITY held by rule 88) and wrote
this row with the game rolling from the plan and a sheet in VOTE as its end state.

His words, 9/21, voting the names at your door UP: "a little more percentage of white
people names and we're good. Try to keep it natural. Hella Hispanic shit going on.
This game isn't a Hispanic game, chill out."

WHERE YOU SEE IT: the demo, any town on the map, tap the hall (the men at the post) or
any building (the keeper over the mouth); and the VOTE tab, item WHO STANDS AT THE POST.

## 1. WHAT WAS LIVE, MEASURED ON THE REAL SCREENS

Three surfaces named people three ways:

| who | how they were named | measured |
|---|---|---|
| the men at the post | 16 one-word names (HIRE_NAMES) | 12 of 16 read Hispanic; Pancho and Nacho; women's names on men's faces (Kiki, Yesenia) |
| the keepers | the same nine names in all 26 places | LUPE at every hall, IRMA the armourer on whatever face the place drew: 66 of 146 keepers with a name that reads one way stood on a face that reads the other (45%) |
| a stranger who tells you his name | first name and surname drawn apart | 56.0% of names read Hispanic, the county is 33.4% |

## 2. THE FINDING. PROVES US WRONG

*** THE SHORT LIST WAS NOT A SHARE PROBLEM. IT WAS LOSING HIM MEN HE PAID FOR. ***

We read his 9/21 note as a percentage to fix. Measured on the company screen it is
worse: the company keeps a hired man by his NAME (BOHEMIA_ROSTER_SCREEN.html, open():
a hired man whose name a hired man already has is skipped; the climb save is keyed by
name too). With sixteen one-word names, two hires share a name all the time. On the
real company screen, hiring CHUY, CHUY and NETO gives a company of 14, not 15: the
second CHUY was paid for and never shows up. Over the 1,274 men the posts offer in the
26 places' first thirteen weeks, a company that hires eight of them hits a repeated
name **87.7%** of the time. Under the roll: **0.34%**. Two of the old sixteen (Lupe,
Marisol) are also starting crewmates' names, so a hired LUPE shared the crew LUPE's save.

A name is not decoration. In a game where the roster is keyed by a name, a short list
of names is a bug, and the fix for his note fixes it too. The rest (0.34%) is RUN TWO's
to close by keying a hire by an id (ROUTED).

## 3. THE DESIGN, WIRED (engine/bohemia_names.js)

ONE ROLL, used by all three surfaces. Who first, then the name: a background from the
census shares (Hispanic 33, white 36, Black 13, Asian 12, two or more 6; Census
QuickFacts, Clark County), then a first name and a surname by that background with
the crossover the names mix wrote (TUNING's numbers). The pools are the names mix's,
plus the ten Hispanic men's names who-the-face-is added (that pool had three men in 28).
Every first name carries what it reads as (who-the-face-is's reading); a name that goes
both ways (Kai, Sunny, Dana, Anh) fits either.

- **the post**: keyed by the post and the slot ('post:' + place + week + slot), and the
  name reads as the face the slot drew (PORTRAIT's fresh portrait; three of the twelve
  faces read as women). Two words. Pancho and Nacho are gone.
- **the keepers**: keyed by the place and the building; the name reads as the face the
  place drew for him; his role after it ('SHANNON PIKE, AT THE HALL'). Each place has
  its own nine people now. THE ELDER stays a title (the arrival speaks under it, and the
  whole town calls him that, as Battle Brothers' village elder).
- **the strangers**: engine/bohemia_people.js generatedName(key, sex) rolls through it;
  the city frame carries the roller byte for byte in front of the people engine
  (tools/bohemia_people_resync.py puts it there). readsAs answers for the new names.
- the company screen's 48 px slot shows a hire's first word; his card shows both.

Nothing he voted UP is gone: all 90 first names and 98 surnames are in the roll.

## 4. MEASURED, BEFORE AND AFTER

On the real settlement screen (tools/bohemia_people_names_wired_in.js, the 26 places,
the first week, no situation moving the post, a local server the way Pages serves it):

| | before | now |
|---|---|---|
| recruits read, named on their card | | 98 of 98 |
| recruit's name reads as his face | women's names on men's faces | 98 of 98 |
| keepers' names reading as their face | 80 of 146 | 172 of 172 |
| different named keepers in the valley | 9 | 170 of 172 |
| a company of 8 hires repeats a name | 87.7% | 0.34% |
| page errors | | 0 |

Through each surface's own code, 1,000 rolls each (gates/the_names_wired_in_gate.js):

| | post | keepers | strangers |
|---|---|---|---|
| Hispanic background | 31.4% | 33.7% | 29.3% |
| white background | 38.9% | 36.7% | 38.6% |
| names that read Hispanic | 34.4% | 36.9% | 33.7% |
| name reads as the face | 1,000 of 1,000 | 1,000 of 1,000 | (no face) |
| the most common full name | 3 | 3 | 4 |

The census is 33.4% Hispanic. The stranger's draw was 56.0%; the post's list 75%.

THE GATE: THE NAMES WIRED IN (gates/the_names_wired_in_gate.js), in the suite; seven
mutations each turn it red (a fixed list back at the post, the post forgetting the face,
a keeper with a fixed name, the roll leaning Hispanic, the stranger skipping the roll, a
stale roller in the city, a name on the sheet that is not the roll). The names mix and
who-the-face-is gates keep their before as history (their legs C, E, G, H rewritten as
their own text said to the day the bank was wired; G2 is the post today: each face meets
about a hundred names, not four).

## 5. THE SHEET: TWELVE AT THE POST

slices/vote/PEOPLE_THE_NAMES_WIRED_IN_10_18.png: the screen's own hire cards with
PORTRAIT's fresh portraits, the first week, and under each what the old list called him.

| now | was | where | face |
|---|---|---|---|
| Silas Sutton | Kiki | THE STRIP (Mob) | cast_longcoat |
| Kai Dorsey | Nacho | THE STRIP (Mob) | cast_shortcoat |
| Ruben Arroyo | Neto | THE STRIP (Mob) | cast_satchel |
| Travis Fontenot | Memo | THE STRIP (Mob) | cast_shorts |
| Delroy Kimura | Chuy | THE STRIP (Mob) | cast_widebrim |
| Citlali Munoz | Beto | THE STRIP (Mob) | cast_skirt |
| Octavio Whitaker | Neto | HENDERSON | cast_pack |
| Esteban Novak | Memo | HENDERSON | cast_barearms |
| Ruben Cisneros | Kiki | HENDERSON | cast_widebrim |
| Paloma Rivera | Nacho | HENDERSON | cast_skirt |
| Otis Kirkland | Pancho | LAKE MEAD MARINA | cast_satchel |
| Ezekiel Ashby | Yesenia | LAKE MEAD MARINA | cast_shorts |

Six of these twelve read Hispanic; over all 98 men at the 26 posts it is 29.6%, and over
1,000 rolls 34.4% (section 4): twelve is a small hand.

## 6. THE SCHOOL LINES

[bb names] Battle Brothers names a recruit once, when he is made, from his
background's own list, and the man is an object in the roster: you can rename any
brother on his character screen and nothing breaks, because nothing is keyed by the
name. Ours did the first half (now: who first, then the name) and broke the second
(the company keeps a man by his name). BETTER THAN BATTLE BROTHERS: their keepers
are buildings; ours are people of that place with a face and a name that agree.

[ah] The same clerk standing in every town is a real horror beat, the one who is
everywhere; the game was spending it by accident, 26 times, on LUPE at every hall.
Now each place has its own people, so the wrongness stays available for a time the
story means it. No sound or pixel made this round beyond the sheet.

## 7. ROUTED

- RUN TWO: (1) key a hire by an id, not his name (BOHEMIA_ROSTER_SCREEN.html open()
  skips a hired man whose name a hired man has; saveClimb and afterFight key by name);
  two-word names make it 0.34% of eight-hire companies, an id makes it 0.
  (2) Told, not asked: this row changed one line in your company screen (the 48 px slot
  shows the first word of a hire's name; aria-label and the card keep the whole) and
  the hire post and keepers in your settlement screen (hireName, keeperName, KEEPERS'
  role). (3) ONE KEY DRAWS THE MAN is still yours: the face roll is unchanged, and 91.2%
  of men at a post wear a crewmate's face. (4) The four contract clients (Dona Carmen,
  Beto, Marisol Ortiz, Old Tavo) are written people, the same in every place; left as
  written.
- DYNASTY: the three prepared names (engine/bohemia_acts.js nameFor) come from
  generatedName, so they roll from the mix now; the names a valley prepares changed.
- PORTRAIT: a new face needs its reading in engine/bohemia_names.js MIX.faces, or its
  name is a man's or a woman's half the time each.
- TUNING: the crossover shares are still guesses, in MIX.givenRule and MIX.surnameRule.
- MODS: the MIX block is the whole content of the roll, a data file in waiting.
- Four old workshop slices still draw the old way: RUN_CURRENT and WHO_KNOWS_WHO carry
  their own old copy of the people engine, RUN_SLICE_7_26 and THE_THREE_BEFORE_ACT_ONE load
  it by script tag without the roller. None is loaded by the demo (the RUN tab routes to
  the city frame, which carries the roller).

No question.
