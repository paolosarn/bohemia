# NOBODY IN THIS VALLEY SPOKE SPANISH, AND WHEN THEY DID, THE CITY MADE
# THEM ALL SPEAK ENGLISH AGAIN
# (8/25/26, PEOPLE lane. LANG-1 + LANG-2 + the hard rule's machine.)

## HIS RULING
> "in regards to the spanish ... make them speak spanglish for our game i like
> that. have it very poor english ro spanglish to give it that flavor ty"

laws/BOHEMIA_ADDENDUM_THEY_SPEAK_SPANGLISH_8_25_26.md. It had no machine.

## WHAT WAS THERE BEFORE
This module's own comment has said since 7/31 that Clark County is "roughly 30%
Hispanic or Latino" and that an all-Anglo name pool "would be a lie about Las
Vegas." That finding reached exactly ONE system: the surname pool. The lane's
own shipped proof character is **RUBEN NGUYEN**, and Ruben Nguyen spoke flawless
monolingual English, because in this build every single person did.

---

## LANG-1: A PERSON HAS A LANGUAGE

Three registers, derived from the identity key on a THIRD independent stream
alongside the two the name already uses. Nothing stored, so the same neighbour
is the same person on any device forever, exactly like their name.

| register | who | share |
|---|---|---|
| `en` | grew up here, the odd word from home | 81.5% |
| `spanglish` | fluent in both, switching mid sentence because it is FASTER | 14.4% |
| `es` | arrived later, or never needed English until the grid went down | 4.1% |

**THE ARITHMETIC IS IN THE OPEN so the next session can check it rather than
trust it.** 418,475 Clark County residents 5+ speak Spanish at home (ACS) out of
2,265,461 (2020 census) = 18.5%. 45% of them speak English less than "very well"
(ACS 2009-2013). The ACS scale is very well / well / not well / not at all, and
register 3 is the "not well / not at all" end, roughly half of that 45% in
published breakdowns. **THAT HALF IS MY ESTIMATE AND IT IS SAID OUT LOUD** in
the code rather than buried: 45% x ~50% = ~22% of Spanish speakers.

### AND IT CLUSTERS, WHICH IS WHAT MAKES IT A MECHANIC INSTEAD OF A SPRINKLE

**139 census tracts in Clark County** are places where more than 10% of
households contain nobody over 14 who speaks English only or speaks it "very
well." Clark County has roughly 500 tracts. Our valley is built out of cells.

```
BARRIO   27.8% of blocks   en 470  spanglish 400  es 130
REST     72.2% of blocks   en 948  spanglish  45  es   7
```

The two mixes **average back to the county to the nearest tenth of a percent**,
so the neighbourhoods cost the valley nothing in accuracy. Measured over 126,000
derived people on 3,000 blocks: en 814.7, spanglish 144.2, es 41.1 per 1000, and
the top decile of blocks is 57% Spanish-speaking against a bottom decile of 2%.

### THE CARD
A `SPEAKS` row, in the identity half, above WORKS. **It is the exact opposite of
the NAME row and that is why it sits beside it:** a name is a thing you have to
be GIVEN, and a language is a thing you already have. You have been standing in
front of them while they talk. Present tense, so it is eyesight and not a
timetable (7/31, THE DAY IS NOT FOR READING).

---

## THE WORDS: 244 -> 558 LINES, 58 -> 152 BUCKETS

Every role x act bucket, every situational bucket and six factions written in
both registers. Each cites the questbook per DIALOGUE ALWAYS REFERS TO THE
CATALOGUE, ids resolving and titles verbatim:

| cite | what it bought |
|---|---|
| `Q036.W1` A VOICE AS A WHOLE CHARACTER | nobody here gets a backstory, they get a register, and the register does the work |
| `Q129.W6` THE REGISTER OF THE AFTERMATH IS MILD | switching languages is written as ordinary, never as an event |
| `Q030.W8` COMMUNITY AS A SURVIVAL RESOURCE | the street channel is faster and more trusted, not a downgrade |
| `Q075.W4` THE FAMILY IS THE POINT | family is the most reliable real-world trigger for a switch |
| `Q045.W8` THE RETELLING CULTURE | what a block knows, it knows because somebody told somebody |

The craft rules from the law, held in the writing: switches land at clause
joints ("Third shift this week **y el medidor** still reads the same"), they
happen for a reason, register 3 is GRAMMAR and never misspelling ("Meter say the
same. Every week the same."), and there is no phonetic accent spelling anywhere.

**`linesFor` asks for the register first and falls back to plain English.** That
one line is the hard rule in the mouth: THE FAILURE MODE OF A MISSING REGISTER
IS ENGLISH, NEVER SILENCE, so no bucket can go mute by gaining a register.

## LANG-2: EVERY LINE KNOWS WHAT LANGUAGE IT IS IN

All **2,224** lines carry `lang`, shown as a chip in the WORDS tab (only when it
is not English: a tag on 1,910 rows is noise, a tag on the 314 that switch is
information), searchable, and in the export.

The expensive thing later was never the CONTENT of a line. His 8/11 law is right
and a line is one row. **THE EXPENSIVE THING IS A MISSING COLUMN**: one function
on a harvester today, five thousand hand rulings at line 5,000, and the human
doing that reading is him.

---

## THE HARD RULE, AND WHY IT NEEDED A CLOSED SET

**LANGUAGE NEVER GATES REQUIRED INFORMATION.** The localisation research names
the real cost and Sleeping Dogs got attacked for it: flavour that quietly turns
into a player standing still because the thing telling them what to do is in a
language they do not read.

A promise cannot be checked. So the Spanish this game may say is a **CLOSED,
DECLARED SET** of 188 words, each with its English meaning, written by the
factory **from the lines it actually ships** so the lexicon cannot drift from
the mouth. `gates/language_gate.js` sweeps **696 required-information strings**
(every `@OBJ`, `@OPT` and `@LOG` in every canon quest, the one action button in
all three registers, every row of the person card) and proves not one contains a
word from it.

`ES_ONLY` is the half of that set that cannot be mistaken for English, **derived
against this game's own English corpus rather than picked by hand**: "no",
"son", "me" and "ya" are words in both languages, and a sweep that flagged them
would go red on every English objective in the build. **A CLAIM THAT CRIES WOLF
GETS SWITCHED OFF, WHICH IS THE SAME AS NEVER HAVING WRITTEN IT.**

---

## THREE REAL DEFECTS, ALL FOUND BY MEASURING AND NONE BY READING

### 1. THE WALKED CITY WAS 100% ENGLISH

`ctPerson` handed `personOf` **the city's one global seed as a BLOCK seed**, so
`blockMixOf` returned the same answer for every person alive. The whole valley
was one kind of neighbourhood, decided by a coin flip on load, and the
clustering the entire finding was built on **could not happen at all**.

```
before the fix   en 100.0%   spanglish 0.0%   es 0.0%     1,277 of 1,277 people
after            en  87.1%   spanglish 9.9%   es 3.1%     top decile 38% Spanish
```

Every engine-side claim was green the whole time. **VERIFY ON THE REAL SURFACE
(7/18) is the only reason this was found**, and it is the entire justification
for the gate's section G.

### 2. TWO IDENTITIES FOR ONE PERSON

`ctPerson` re-keys a person to the city record AFTER `personOf` returns and
re-derives the NAME from the new key. The language had already been derived, off
the old one. So a person's name came from one identity and their language from
another. **Nothing visibly broke, which is exactly why it would have sat there:
both answers are stable, they are just answers about two different people.**

### 3. THE VOCABULARY YARDSTICK ATE ITS OWN OUTPUT

The factory builds its "words this game has said in English" corpus from
`BOHEMIA_WORDS_BOOK.json` -- which is harvested FROM the barks the factory
writes. On the SECOND run, every Spanish word it had just shipped came back in
as English, and the sweep list collapsed from 183 words to 5. The hard rule's
claim would have stayed green while catching nothing.

**A CHECKER WHOSE INPUT IS ITS OWN OUTPUT IS NOT A CHECKER.** The tell was that
the build gave a different answer depending on what order two tools were run in.
The `lang` field LANG-2 put on every line is what makes the filter exact.

## AND A GAP BETWEEN TWO GOOD GUARD RAILS

`slices/BOHEMIA_CITY_WORLD.html` carried a **47,907-byte copy of an 81,931-byte
module**. `tools/bohemia_city_talk_patch.py` inlines it correctly but regenerates
the whole talk surface from an 8/3 constant, and that surface has grown 3,400
lines since, so it **correctly refuses to run** rather than delete another lane's
work. The engine sync gate keys on `const BOH_*` declarations and this module is
an IIFE, so it has never watched it either. Two good guard rails with a hole
between them, and the city is the surface he walks up to somebody on.

`tools/bohemia_people_resync.py` replaces only the bytes between the module
markers. `language_gate` section F fails if a shipped frame drifts again.

**FLAGGED, NOT CLAIMED (SHARED):** the general version of this. Any inlined
module that is not a `const BOH_*` is unwatched by the sync gate. I fixed the one
that blocked my own work and named the class rather than reaching into another
lane's gate.

---

## THE GATE: 63 CLAIMS, ~23 SECONDS

Sections: the ruling on disk, A every line knows its language, B the mix is the
county and it clusters, C **the hard rule**, D the lexicon is a real closed set,
E somebody can actually say it, F the shipped frames carry the current module,
G **the walked city, counted**.

### THE MUTATION PROOF
Each break run against the real gate, tree restored byte-for-byte after.

| break | result |
|---|---|
| **M1** one objective written in Spanish | **2 red**, naming the file, the line and the words it found |
| **M2** the city fix reverted (the exact code that was there) | **4 red**: `en 100.0% spanglish 0.0% es 0.0%` |
| **M3** every register flattened to poor English | **8 red**, including the law's own named failure |
| **M5** the lexicon self-poisoned | **4 red** -- the **ANTI-VACUITY** claim first, while the headline claim stayed green on 696 strings |
| **M6** the English fallback removed | **3 red**, including the walked city going silent |

**M5 is the one worth remembering.** The headline claim -- the one this whole
gate exists for -- read "696 strings swept, 0 Spanish" and was **completely
vacuous**, because the thing it sweeps with had been emptied. The only reason it
was caught is a claim whose entire job is to prove the sweep can still find
something.

## TWO WEAK CLAIMS OF MINE, BOTH CAUGHT BY THE MUTATIONS

- **"it does not travel with the name"** was `return n > 0` after a loop that
  computed nothing. True forever, for a reason unrelated to the rule. It now
  measures 64 given names and reports the worst skew: 4.1 points on an 18.5%
  base, which is noise.
- **"A BUCKET WITH NO REGISTER FALLS BACK TO ENGLISH"** sampled `keeper:scav`,
  which HAS a spanglish twin. It was named after the fallback and never once
  exercised it, and it survived M6 unchanged. The bucket is now FOUND rather
  than named, so it stays honest as more registers get written.

Plus one I caught before the gate existed: `base_forms` split on any apostrophe,
so `o'clock` read as the Spanish word `o` and two perfectly good English
objectives were flagged out of 507. **A FALSE ALARM IS WHAT KILLS A GATE**, not
a miss. And one assertion that pinned today's layout instead of today's rule
(SPEAKS at exactly NAME+1) -- the sixth time this lane has made that mistake.

## THE MACHINE

| file | what |
|---|---|
| `engine/bohemia_people.js` | the registers, the county weights, the clustering, `langOf`, `esWordsIn`, the SPEAKS row, the register-aware mouth |
| `tools/bohemia_bark_factory.py` | 314 register lines, the 188-word lexicon, the gloss check |
| `tools/bohemia_words_book.py` | `lang` on all 2,224 lines, the WORDS tab chip |
| `tools/bohemia_people_resync.py` | the inlined copies, refreshed without touching anybody else's work |
| `tools/bohemia_city_language_patch.py` | the two city defects |
| `gates/language_gate.js` | 63 claims |

---

## HOW THIS WAS VERIFIED, AND WHY NOT WITH THE FULL SUITE

`origin/main` is **22 RED with 72 gates that never ran** (COMBAT lane, 8/25: 422
gates at 10.6s against a 2700s budget, so a "full pass" covers 83% of the gates
and returns 22 reds, and that is the state of main itself). A full-suite number
from that baseline is noise, not signal.

So: **every gate that touches any file this change edits** was found by sweeping
`gates/` for the nine filenames involved, and all 105 of them were run directly.
Every red was A/B'd against a clean `origin/main` worktree.

| gate | verdict |
|---|---|
| `language_gate` | **63 / 0**, mine, new |
| `dialogue_catalogue_gate` | **RED, AND IT WAS MINE.** Fixed. See below. |
| `organ_reach_gate` | **RED, AND IT WAS MINE.** Fixed. See below. |
| `banks_used`, `canvas_memory`, `full_res`, `invisible_schedule`, `no_prison`, `one_world_tab`, `run_people`, `run_beat`, `run_gate`, `time_to_play`, `vista_beat`, `walk_deadlock` | **12 gates, red on clean `origin/main` with the identical failure lines.** Not one of them is mine. |
| `doors_fresh` | **FLAKY, CONFIRMED INDEPENDENTLY.** 2 red in 4 runs on an untouched clean `origin/main` worktree. The COMBAT lane called this one flaky today and it is. |
| `look_gate` | the documented mtime artifact, `records/BOHEMIA_FOR_THE_ART_LANE_LOOK_STALENESS_MEASURES_CHECKOUT_AGE_8_19_26.md`. All 15 "stale" pictures photograph the ALPHA (12) or the CITY frame (3), and every lane that ships anything moves those two mtimes. Not one of the pictures shows anything this change touched. **I did not touch the timestamps.** A gate cleared by backdating a file is a gate deleted. |
| everything else (90 gates) | green |

**105 gates run, 15 red, 2 of them mine and both fixed.** The other 13 are the
state of main: 12 identical on a clean checkout and one mtime artifact.

## THE TWO REDS THAT WERE MINE

**`dialogue_catalogue_gate`** split bucket keys on `:` and read
`work@spanglish` as an act the sim has never heard of, so it called 56 correct
buckets INVENTED. A GATE MUST NEVER OUTRANK A RULING (8/1): the rule is right
and stays, it just had to learn the newer shape. Splitting the suffix off makes
it **stronger** -- the register is now validated against the engine's own list,
so `worker:work@klingon` is caught too. Mutation-proved by planting exactly
that.

**`organ_reach_gate`** reported `esWordsIn` as reached by NOTHING ANYWHERE, and
it was right to ask. Two things were true: it IS tooling-only on purpose (the
hard rule is about what must never reach the surface, so the thing that checks
it belongs off the surface by definition), and the sweep **could not see the
call** because `tools/bohemia_organ_reach.js` counts callers TEXTUALLY and the
gate had it aliased as `P`. The function is now called by its published name --
the module registers itself as `BohemiaPeople`, so that is its name and not a
dodge -- and the exemption carries the written reason RULE 2 demands.

**FLAGGED FOR THE ORGAN-REACH LANE, NOT REACHED INTO:** that tool already
documents this blind spot for modules passed as VALUES ("a textual count is a
lie"). The `require`-under-an-alias case is the same shape and it is not
covered. Any function only ever called through an alias reads as dead.
