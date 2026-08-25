# EVERYBODY IN THIS VALLEY SPEAKS PERFECT ENGLISH, AND THAT IS THE
# BIGGEST LIE IN THE BUILD
# (8/25/26, coordinator sweep 15. A DECISION, made under EVERYTHING IS A
# THUMB, plus two routed work orders. Not a question, not a queue.)

## 0. WHY THIS IS THE HORIZON ITEM AND NOT TRIVIA
The sweep asks for the one important thing nobody has started that he has
not thought of. I checked before claiming it (the 8/17 rule: to ask
whether a system exists, find its gate first, then grep the canon):
  - `grep` for `lang`/`language`/`speaksSpanish` as an attribute across
    engine/, quests/, and the words book: **ZERO HITS.**
  - `grep` for "bilingual", "code-switch", "language barrier", "speaks
    Spanish" across BOHEMIA_BACKLOG.md and every file in laws/: **ZERO
    HITS.**
  - gates/ has no gate for it. There is no lane row for it. It is not
    [PENDING Paolo]. It has never been raised.
NOBODY HAS STARTED IT AND NOTHING IN THE MACHINE CARES.

## 1. THE MEASUREMENT
We already did the demographic research and then used ONE PERCENT of it.
engine/bohemia_people.js, in its own comment, is explicit:
> "corpse of Clark County, Nevada, and Clark County is roughly 30%
> Hispanic or Latino, ~12% Black, ~10% Asian and Pacific Islander. A name
> pool that is all [Anglo] would be a lie about Las Vegas."
So the valley's real numbers reached exactly one system: THE SURNAME
POOL. 64 given names x 64 surnames. The lane's own shipped proof image is
a character called **RUBEN NGUYEN** — and Ruben Nguyen speaks flawless,
unaccented, monolingual American English, because in this build every
single person does.
THE REAL NUMBERS, which are worse for us than the 30% headline:
  - Spanish is the most-spoken language in Clark County, **418,400+
    speakers** (Data USA, from Census ACS).
  - **362,728 Clark County adults** speak a language other than English
    (Clark County Elections' own minority-language-requirements page,
    which exists because federal law forces bilingual ballots here).
  - **139 census tracts in Clark County** are places where more than 10%
    of households contain NOBODY over 14 who speaks English only or
    speaks it "very well" (same source).
  - Nevada's limited-English population is **337,676, 11.2% of the
    state** (Migration Policy Institute state profile).
139 tracts is not a flavour note. Our valley is built out of cells. A
correct Las Vegas has ENTIRE NEIGHBOURHOODS where the language on the
street is not the language on the phone.
AND THE TEXT IS ALREADY THERE, WAITING: records/BOHEMIA_WORDS_BOOK.json
holds **1,910 authored player-facing lines** across 36 sources, 1,864 of
them citing the questbook laws they were written from. Every one is
harvested, structured, and editable in the WORDS tab. **NOT ONE OF THEM
KNOWS WHAT LANGUAGE IT IS IN.** There is no field for it.

## 2. THE FINDING THAT CHALLENGES WHAT WE BELIEVE
### WE BELIEVE: words are cheap, and he edits them later.
That is his 8/11 law and it is right, and it is right for a specific
reason we have never said out loud: THE WORDS ARE CHEAP BECAUSE THEY LIVE
IN A DATA FILE. A line is one row; changing a row is free.
### THE THING THAT IS NOT CHEAP LATER IS A MISSING COLUMN.
This is the one place the industry's evidence is blunt and unanimous, and
it is not about translation — it is about the schema underneath it.
Practitioners describe the same trap every time: studios that skip the
groundwork "pay twice: first for engineering rework to extract hardcoded
strings, then for retranslation and retesting"; retrofitting into a
finished codebase "can cost more than the translation itself"; the
summary line is **"internationalization costs almost nothing upfront.
Deferring it costs a great deal later."** The named cautionary case is
BALATRO — a finished, beloved, wildly successful game whose solo
developer had to PULL every non-English language off the store page days
before launch because the quality was inconsistent, and restore them in
phases afterward.
FOR US THE COST IS NOT EXTRACTION — our text is already externalised, so
we dodged the expensive half by accident. THE COST IS THE DECISION PER
LINE. Adding a language field to the line schema today is one field on a
generator. Adding it at line 5,000 means a human re-reads five thousand
lines and rules on each one, and that human is HIM.
**SO THE 8/11 LAW HAS AN EXPIRY DATE NOBODY NOTICED.** "I will edit it
later" holds for the CONTENT of a line forever. It does not hold for a
PROPERTY the line was never given. That is the finding that challenges
what we believe, and it is why this is a today problem and not a someday
problem.

## 3. THE OTHER AISLE, AND IT TURNS FLAVOUR INTO A MECHANIC
The real-world research on language in a collapsed system does not say
what I expected. I expected "sad, hard, unfair." What it actually says is
that language REROUTES INFORMATION, and the reroute is measurable:
  - People with limited English "face barriers to receiving timely,
    accurate, and useful disaster information, contributing in many cases
    to disproportionately adverse disaster outcomes" — the recurring
    finding across Katrina, Rita and Maria (NSF-hosted language-access
    assessment; Journal of Applied Communication Research 2025 on
    post-hurricane communication in LEP communities).
  - Official messages are received with SKEPTICISM, and fear of officials
    suppresses compliance even when the message is understood.
  - **Households with limited English rely far more heavily on INFORMAL
    SOCIAL NETWORKS — family, friends, co-ethnic community — because the
    official channel does not reach them.** (Same sources.)
  - Bilingual staff and interpreters function as literal INFORMATION
    CONDUITS during disasters (Journal of Emergency Management).
  - And the government side fails predictably: in a sample of 110 US
    counties, language-access effort in emergency plans **does not
    correlate with how many LEP residents a county actually has**
    (ScienceDirect, 2021). The preparedness is decoupled from the need.
### WHY THAT IS A GAME MECHANIC AND NOT A LECTURE
INFORMATION IS ALREADY BOHEMIA'S REAL CURRENCY. gates/phone_rings_gate.js
holds it as law in the engine's own words: "THE DAY STARTS WITH NO JOB...
only word that something came in", and the feed deliberately EXCLUDES the
phoneless, because "you can't get their quest over the phone."
WE ALREADY BUILT A TWO-CHANNEL WORLD — the phone, and the street — AND WE
SPLIT IT ON WHO OWNS A PHONE. The research says the real world splits it
on WHO SPEAKS WHAT, and that the second channel is not a downgrade: it is
FASTER AND MORE TRUSTED for the people inside it. That is a whole
information economy we have the architecture for and have never used.
THE PLAYER-FACING SHAPE, in one sentence: **the neighbour who does not
answer the phone feed already knows, because her cousin told her an hour
ago, and whether you can hear that is a thing about you.**
Which is also, quietly, the life lesson underneath — the one the game
never says out loud: THE PEOPLE THE SYSTEM DOES NOT SPEAK TO BUILT A
FASTER SYSTEM.

## 4. THE GAMES AISLE, INCLUDING THE PART THAT ARGUES AGAINST ME
**SLEEPING DOGS (United Front Games) is the closest precedent and it is
instructive in BOTH directions.** They deliberately did not translate
everything: characters "switch back and forth between languages" based on
each character's background, "as accurate as possible with what they
naturally speak," so walking the street gives you "a mix of Cantonese and
English dialogue, just like you would in real Hong Kong." They went to
Hong Kong, talked to the police and the triads, and built the language
mix as part of the research, not as a localisation task.
THE RECEPTION SPLIT, AND THIS IS THE HALF I AM NOT ALLOWED TO SKIP:
players praised the authenticity AND players complained about
"gratuitous" untranslated dialogue pulling them out. The localisation
practitioners are harsher and clearer: untranslated text "immediately
breaks a player's immersion," and worse, comprehension failures "make it
challenging for players to grasp essential game mechanics or follow the
narrative, potentially stopping their progress" — the documented failure
mode being a player who cannot tell what to do next (Legends of
Localization's untranslated-text catalogue; localisation practitioner
guides).
GHOST OF TSUSHIMA is the sharper version of the same trade: in the
Japanese dub the Mongols speak untranslated Mongolian, which is
atmosphere precisely because none of it is load-bearing.
**SO THE PRECEDENT DOES NOT SAY "PUT SPANISH IN THE GAME." IT SAYS: THE
MOMENT LANGUAGE GATES SOMETHING THE PLAYER NEEDS, IT STOPS BEING WORLD
AND STARTS BEING A BUG.** That constraint is the whole design, and it is
the reason this is safe to build.

## 5. THE DECISION (mine, under EVERYTHING IS A THUMB, correct-after)
**LANGUAGE IS A FACT ABOUT A PERSON, NOT A SETTING ON THE GAME.**
1. **THE SCHEMA GETS ITS COLUMN NOW, BEFORE LINE 1,911.** Every authored
   player-facing line carries `lang` (default `en`). One field on
   tools/bohemia_words_book.py and the .bq writer. This is the entire
   irreversible part of the whole finding and it is a day's work today
   versus a re-read of the corpus later.
2. **A PERSON'S LANGUAGE IS DERIVED, EXACTLY LIKE THEIR NAME.** The
   people module already regenerates names from the identity key and
   already weights the pool to the real valley. Language rides the same
   key with the same real numbers. Nothing new is stored. It also means
   language is CORRECTABLE WHOLESALE by editing one pool, the way the
   name pool already is.
3. **THE HARD RULE, AND IT IS NOT NEGOTIABLE: LANGUAGE NEVER GATES
   REQUIRED INFORMATION.** Anything the player MUST have to finish
   anything is always available to them. Language changes FLAVOUR, and it
   changes WHO KNOWS FIRST, and it never changes whether you can play.
   This is the Sleeping-Dogs-complaint and the comprehension research
   turned into a constraint instead of a risk.
4. **THE MECHANIC IS THE SECOND CHANNEL, NOT SUBTITLES.** Word of mouth
   already exists as a design (the phoneless who cannot be reached by
   feed). Language is the second axis on that same channel: some news
   moves through the street before it reaches the phone. Being able to
   hear it is an EDGE, never a requirement.
5. **WE ARE NOT TRANSLATING THE GAME, AND THIS RECORD IS NOT ABOUT
   TRANSLATION.** Shipping Bohemia in Spanish is a business decision,
   later, and it is HIS. What today buys is that the decision stays cheap
   instead of becoming a re-read of the whole corpus.
### WHAT IS RESERVED AND STAYS EMPTY (mechanism mine, contents his)
- WHETHER THE PLAYER CHARACTER SPEAKS ANYTHING BUT ENGLISH. That is
  identity, it is character-creation surface, and it is his. Ships
  monolingual-English until he says otherwise; the field exists so his
  ruling is a one-line change instead of a project.
- WHICH NAMED STORY PEOPLE SPEAK WHAT. Same rule as KNOWN_AT_START: the
  mechanism ships, the roster stays empty.
- WHETHER THE GAME EVER SHIPS TRANSLATED.
NOT A QUESTION TO HIM. NOT IN A QUEUE. Recorded, defaulted, and
correctable the moment he meets it.

## 6. ROUTED
- **PEOPLE — LANG-1: A PERSON HAS A LANGUAGE.** Derived from the identity
  key like the name, weighted to the real Clark County numbers in §1, and
  surfaced the way the name is surfaced (on the card, on the one action
  button). Pool replaceable by him. TAB: LIFE.
- **WORDS/QUESTS — LANG-2: THE LINE SCHEMA GETS `lang`.** Default `en` on
  all 1,910 existing lines, written by the generator, visible and
  editable in the WORDS tab. Every line drafted from here carries it.
- **GATE (a law without a machine gate is not enforced) — `language_gate`,
  same turn as LANG-2.** Three claims, and the third is the one that
  matters: (a) every authored line carries a `lang`; (b) the derived
  people pool's language mix matches the valley's real numbers within
  tolerance; (c) **NO LINE CARRYING REQUIRED INFORMATION IS
  NON-ENGLISH** — objective text, resolution buttons, the phone feed's
  job offer. Mutation test: retag one objective line and claim (c) must
  go red.

## 7. CONFIDENCE, PER CLAIM
- Nobody has started this: greps over engine/, quests/, laws/, gates/,
  backlog, all zero. **HIGH.**
- The 1,910 lines and the missing field: read from the words book's own
  `_meta`. **HIGH.**
- The Clark County numbers: Census-derived, three independent surfaces
  agreeing. **HIGH.**
- The disaster/LEP information-rerouting findings: peer-reviewed and
  government sources, consistent across Katrina, Rita, Maria. **HIGH.**
- The retrofit-cost argument: practitioner consensus, but our text is
  already externalised, so I have DISCOUNTED it to the schema-column
  claim only rather than repeating the general warning. **MEDIUM-HIGH,
  deliberately narrowed.**
- Sleeping Dogs' design intent: developer interview. **HIGH.** Its
  reception split: player-forum evidence. **MEDIUM.**
- That this makes the game better: a PREDICTION. He will meet it in the
  game and correct it, which is the only test that counts.

## SOURCES
Data USA Clark County NV profile; Clark County Elections minority
language requirements; Migration Policy Institute Nevada language
profile; NSF-hosted "Language access in emergency and disaster
preparedness" and its ScienceDirect 2021 assessment of 110 counties;
Journal of Applied Communication Research (2025), intercultural disaster
communication in LEP communities; Journal of Emergency Management,
medical interpreters and bilingual school staff as disaster information
conduits; Cambridge Disaster Medicine and Public Health Preparedness,
English proficiency and post-Maria distress; Siliconera interview with
United Front Games on Sleeping Dogs' Cantonese; Sleeping Dogs player
discussions on untranslated dialogue; Legends of Localization on
untranslated text in shipped games; SimpleLocalize on retrofitting i18n
and the Balatro launch case; plus in-repo: engine/bohemia_people.js,
records/BOHEMIA_PEOPLE_IDENTITY_7_31_26.md,
records/BOHEMIA_WORDS_BOOK.json, gates/phone_rings_gate.js.
