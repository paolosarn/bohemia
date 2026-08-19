# ONE THING THAT IS THEIRS (8/19/26, PEOPLE lane)

## WHERE TO SEE IT: the **RUN** tab. Walk up to anybody, press the one button
## at the bottom of the screen, then press ASK THEIR NAME. The line under NAME
## is theirs and nobody else's. Come back to the same person after dark and
## they say the other half of it.

---

## THE HOLE, IN ONE LINE

Every person in the valley was interchangeable.

Measured before a word was written:

| table | keys | what it actually is |
|---|---|---|
| `bohemia_people.js` LINES | 58 | BUCKETS. `faction:Blues`, `scav:work`, `when:night`. Every Blue in the valley says the same five sentences. |
| `bohemia_people.js` REACTIONS | 19 | all about the PLAYER. `saw:`, `heard:`, `rung:`, `met:`. |
| anything that belongs to ONE person | **0** | |

Both of those tables are good and neither is a self. A faction having a voice is
not a person having one.

## WHY IT MATTERS MORE THAN IT SOUNDS

The tone research (records/BOHEMIA_TONE_RESEARCH_R1_8_12_26.md, finding 1) says
it in one sentence:

> **A CHARACTER NOBODY LAUGHED WITH IS A CHARACTER NOBODY MOURNS.**

The demo's whole shape is the cold open where the sibling dies. That cannot land
in a valley of 297 interchangeable bodies, because the player has never been
charmed by anybody in it. Undertale's devastation works BECAUSE of its comedy,
not despite it: endearing flavour first, then the game puts what you love in
harm's way.

R1 also named the delivery slot, exactly:

> "the ask-their-name system is a built-in JOKE DELIVERY SLOT: what a stranger
> says when you ask their name is where Undertale would put the first laugh."

That slot has been shipped and standing empty since 7/31. You asked, you got a
surname and five mechanical rows.

## WHAT SHIPPED

**22 shapes x 40 nouns = 304 distinct quirks, each written in TWO registers.**
608 possible utterances out of 106 authored pieces (44 lines, 22 tells, 40
nouns). Every one tagged `draft:true` and editable in the **WORDS** tab.

A quirk is SHAPE x SPECIFIC:
- the SHAPE is the human pattern, played deep (craft card 2: one quirk, deep,
  not wide). "cannot be interrupted partway through a small routine."
- the SPECIFIC is the noun that makes the image sharp (craft card 1:
  SPECIFICITY, never the generic noun). "a valet ticket numbered forty-one."

Specifics are TYPED (object / place / ritual) and a shape declares which it
takes, so the machine can never hand a ritual to a shape that wanted a thing you
can hold. That typing is the difference between a factory and a mad-lib.

DERIVED, NEVER STORED, exactly like the person themselves: bohemia_people keys a
human as (blockSeed, house, slot), so their quirk comes off the same three
numbers. Same person, same bit, on any device, on any load, forever. Nothing is
saved and nothing can desync.

## THE PART THAT IS THE ACTUAL IDEA: FUNNY AND SCARY ARE ONE DIAL

R1 finding 3, benign violation theory (McGraw/HuRL): humour is a VIOLATION
appraised as SAFE. Fear and laughter are the same event with a different safety
reading, and the switch is perceived distance. "Funny-to-traumatizing whiplash
is not mixing two tones, it is MOVING ONE DIAL."

**The valley already had that dial and it is physical.** So every quirk is
authored twice AS THE SAME PERSON. Same trait, same object, same human:

> **In the light:** "Hang on, I'm winding a watch that does not run. You can't
> interrupt it. It doesn't work if you interrupt it."
>
> **In the dark:** "Don't. I'm winding a watch that does not run. If I lose
> count I start again and I don't want to be out here that long."

> **In the light:** "I know yours already. I know everybody's on this block.
> It's counting the lit windows, that's the whole trick."
>
> **In the dark:** "I know yours. I know who's stopped being on this block, too.
> Six. It's counting the lit windows."

It is never a different quirk and never a different person. You liked them on a
lit corner in the afternoon; you meet them again at ten at night off the grid
and the thing you liked is the thing that frightens you. R1 said walking between
the two IS the tone transition. This is that, and it cost no new system.

## FOUR THINGS THAT WENT WRONG, AND WHAT EACH ONE TAUGHT

### 1. TEMPLATE SUBSTITUTION HAS NO GRAMMAR
The first build produced, on the real module output:

    "Mine's the same as his was. a slot handle snapped off at the base, both of us."
    "counting the lit windows before bed. That's how I know."

One bug wearing two hats: a phrase written to sit in the middle of a sentence,
dropped at the START of one. A solo writer cannot eyeball 44 lines x 40 nouns.
So the grammar moved INTO THE SPEC and became machine-checked: no slot is ever
sentence-initial, no object phrase carries an internal comma, every ritual is a
bare person-neutral gerund. The factory now refuses to write on a violation, and
quirk_gate re-checks all 608 renderings.

### 2. A GUARANTEE THAT IS PROBABILISTIC IS NOT A GUARANTEE
304 combinations drawn 32 times is a birthday problem, and measurement found it
sitting exactly where the maths says: **1.63 duplicate pairs per block on
average, seven on the worst block in three hundred.** The hash was fine (all 22
shapes and all 304 combinations come out evenly across 12,800 people). The pool
is simply smaller than a block and always will be.

So `spreadOver()` makes it exact: hand it a block's people and it walks them in
sorted order and moves anybody who landed on a taken combination to the next
free one. **1.63 becomes 0.00, and 94.7% of people keep their own draw.** It
advances the NOUN before the SHAPE on purpose: four people on a block who all
drew "cannot be interrupted" become four people with four different routines,
which is a street.

### 3. *** THE FEATURE WAS ABOUT TO SHIP BACKWARDS, AND ONLY THE REAL SURFACE KNEW ***
This is the one worth remembering. The register was decided by `dayDark()`,
which asks "is this block on a live circuit". Everything read correctly. The
gate was green.

Driven for real on the walked surface:

| measured | |
|---|---|
| valley tiles on a live circuit | **358 of 9,216 (3.9%)** |
| people who live on one | **131 of 5,007 (2.6%)** |
| conversations that would have played the DREAD line | **97.4%** |

The joke would have been unreachable. The entire reason the feature exists, the
thing R1 spent a finding on, would have shipped switched off, and every gate
would have stayed green because every gate would have been asking the same
wrong question.

**A DIAL SOLDERED TO ONE END IS NOT A DIAL.**

The fix was not a new rule, it was the city's own. An unpowered lot at noon is
not dark, it is a lot. The renderer has always known this and says so in one
line when it decides whether a room is dark:

    if (isNight() && !(POWER.at(INSIDE.tx, INSIDE.ty)||{}).live)

That IS LIGHT=TERRITORY, and it is what the law is actually about: nobody
patrols the DARK, and the dark is a time as well as a place. Same question,
asked the same way, one definition of dark in the file instead of two that would
drift.

Re-measured after: lit at 07:00, 10:00, 13:00 and 16:00; dark at 19:00, 22:00
and 02:00. Night is 11 hours of 24, so roughly half of meetings land in each,
and the player crosses between them by walking onto a live block OR by waiting
for morning.

## AND THE ROW LANDS WHEN THE NAME DOES NOT

Six of the sixteen introductions refuse a name or make you earn it somewhere
else. Ask a Cartel member and you get nothing. Under the old card that was a
dead end: you pressed the only social button the game has and the world said no,
and a third of the valley was unmeetable.

The quirk row is independent of whether the name landed. You asked, so they said
something. That is the better joke anyway.

## WHAT IS HIS AND STAYS HIS

Not one person is named. Not one establishment is named either, because what is
still standing in Vegas is map canon and map canon is his. The nouns are things,
not brands. Every line is a `draft:true` attempt under ALWAYS MAKE AN ATTEMPT
(8/11) and every one of them is in the WORDS tab with its citation under it,
where he retypes whatever he wants.

## THE CITATIONS (a claim the machine checks, never a name-drop)

Resolved against records/BOHEMIA_QUESTBOOK_LAW_INDEX.json at build time, titles
compared VERBATIM. 6 findings, 5 studies, 3 masters:

| id | master | title |
|---|---|---|
| Q013.W4 | craft | ABSURD WITH HEART (never JUST a gag) |
| Q013.W5 | craft | COMMITMENT TO THE BIT |
| Q014.W9 | craft | PERSONALITY AS THE PUZZLE |
| Q017.W3 | craft | READ-THE-PERSON (partly randomized) |
| Q022.P4 | ports | W5 (humanize the functional |
| Q031.X2 | flaws | STRESS/BLEAKNESS IS RELENTLESS |

Q031.X2 is the one that argues with itself and is the reason the lit register
exists at all: the corpus files unbroken bleakness as a **FLAW**, not a virtue.
"Let the grimness have texture and the occasional small warmth so it's
endurable." Here that warmth is placed on the map rather than sprinkled: it
lives where the light is, which is where the player is actually safe.

## THE MACHINE

| file | what |
|---|---|
| `tools/bohemia_quirk_factory.py` | the spec, the shapes, the nouns, the citation and grammar checkers |
| `engine/bohemia_quirk.js` | generated. `quirkOf`, `spreadOver`, `lineFor`, `tellFor`, `count` |
| `records/BOHEMIA_QUIRKS.json` | the record and the WORDS-tab source |
| `tools/bohemia_city_quirk_patch.py` | the wiring, idempotent, refuses a diff that removes lines |
| `gates/quirk_gate.js` | 32 assertions, 18 of them driving the real alpha in a real browser |
| `gates/dialogue_catalogue_gate.js` | 59 -> 62 |
| `tools/bohemia_words_book.py` | `parse_quirks`, so every line is editable |

### 4. AND ONE MORE THIS LANE HAD ALREADY SHIPPED ONCE
The block spread is cached, keyed on the cell. Moving the POPULATION DIAL changes
who is standing here without changing where here is, so the cache would hand back
a crowd that no longer exists and every new arrival would fall through to their
raw, un-de-collided draw. That is exactly the PPL_PEOPLE bug from 8/16, and
bohemia_population bumps `RULES_V` for precisely this reason: its own comment
says EVERY CONSUMER KEYS ITS CACHE ON RULES_V. This is a consumer, and now it
does. Measured with the fix removed: 458 people in, 458 stale people out.

Mutation-tested, three ways it could rot:
- made the lookup return the same answer for everybody -> **4 assertions red**
  (A10, A11, A17, A18)
- stopped the row reaching the card -> **3 assertions red** (B5, B6, B7)
- keyed the spread cache on the cell alone -> **B17 red**

B7 exists because B6 compares the card against the runtime and both live in the
same file: if the runtime drifted they would drift together and agree. B7 checks
the pixels against records/BOHEMIA_QUIRKS.json, outside the browser entirely, so
a wrong-but-consistent surface still fails.

## WHAT THIS DOES NOT DO

The tell (what you can SEE about somebody before they speak) is authored, gated
and reachable through `tellFor()`, and **it is not on the card yet**. The line
was the finding; the tell is the next surface for it, and it wants a place that
is not another row.

Two people in a district of four hundred DO share a habit. That is a city, and
it is correct. The guarantee is scoped to the street, which is the group the
player can hold in their head at once.
