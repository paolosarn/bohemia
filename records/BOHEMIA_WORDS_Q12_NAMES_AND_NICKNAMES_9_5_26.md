# WORDS Q12 -- NAMES AND NICKNAMES
# VAMILY research round, 9/5/26, lane WORDS (words-8dqrnq). MODE: RESEARCH.
# The question, verbatim: "Names and nicknames. How people in a collapsed city
# name each other and places (real post-disaster naming, gang and crew naming),
# and what that does for a player learning who is who."

## THE ANSWER IN ONE LINE
**Not one proper name is spoken anywhere in this game. 57 people talk across 27
quests and every single one of them is a job title. We built a full naming engine,
64 given names, 48 surnames, a law that a name must be earned, and then we put the
names on BUTTONS instead of in MOUTHS. In the best game ever built about learning
who people are, the mouths do the naming and the notebook only records it. We built
the notebook and skipped the evidence.**

## 1. THE FINDING THAT PROVES US WRONG
Every quest speaker, counted:

    57 distinct speakers across 27 quests, the scenes and the asking module.
    NAMES: 0.

    keeper 43   watch 27   sergeant 21   lineman 20   neighbor 20   hauler 20
    worker 20   scav 19    clerk 18      voice 17     mother 17     owner 16
    trader 16   pastor 15  medic 14      haunt 12     quartermaster 11 ...

Job titles, family words, and placeholders. `voice`, `dark`, `line`, `any`.

Then I searched all 1,669 NPC-spoken lines for any capitalised word in
mid-sentence position, which is where a proper noun lives:

    proper-noun candidates found: 4
    reading all four: "Sorry" x3 and "Tonight". ZERO real names.

**Nobody in Bohemia ever says anybody's name. Nobody ever says a place's name.**

And the vocative number this lane already trusts, because it agreed across three
unrelated corpora, makes the size of that hole exact:

    lines that address the person they are talking to
    FILM 22.8%    KOTOR 23.9%    REAL SPEECH 31.4%    BOHEMIA 1.0%

Measured tight, our 1.0% is 16 lines, and I read all 16. Every one uses an address
NOUN, never a name: man 5, friend 3, boss 2, then hermano, kid, mijo, mija, hombre,
compa, one each. **We are twenty to thirty times below every corpus, and the entire
shortfall is names.**

## 2. THE ENGINE ALREADY DOES THIS PROPERLY, WHICH IS THE PART THAT STINGS
`engine/bohemia_people.js` is not missing a naming system. It has a good one:

    GIVEN     64 first names, deliberately mixed (Marisol, Kwame, Thuy, Ezekiel,
              Xiomara, Delroy, Citlali, Trinh, Amaury, Socorro)
    SURNAME   48 (Rivera, Okonkwo, Nguyen, Whitfield, Salcedo, Kimura, Fontenot)
    nameOf()  returns NULL for a stranger no matter what pool exists
    headingOf() falls back to the trade until the player has actually asked
    addressOf() owns the grammar: "TALK TO THE SCAVENGER" but "TALK TO RUBEN"

And the law in the file header, in the module's own words:

    "A NAME IS EARNED, NEVER GIVEN."

That is correct, it matches the real record exactly (see section 3), and it is
enforced. **The names are just never spoken.** They appear on a button and on a
card. Not one line of dialogue in the game produces one.

**SO NAMING IN BOHEMIA IS AN INTERFACE FACT AND NOT A SOCIAL FACT.** The machine
will label somebody Ruben. No human being in the valley will ever call him that.

And the same is true of places. The districts are TYPES, not names: mountain,
desert, strip, resort, mall, downtown, suburb, industrial. The landmark kit
describes its pieces as "apron", "service drive", "exhibit hall". **There is not a
single proper place name a player can hear.**

## 3. THE REAL RECORD, AND IT AGREES WITH OUR OWN LAW
Two separate bodies of evidence, and they converge on one rule.

**MEXICAN APODOS.** Nearly everybody has one, from a neighbour to the taco vendor.
They are **physically descriptive, often derogatory on the surface, and always
clever**: la larga, la chaparra, el prieto, el guero, la flaca, el gordo. What
reads as an insult in Anglo culture is affection here. And the reason given for why
they matter is the thing a writer should steal: **an apodo shows that somebody
looked at you long enough to see you.**

**GANG AND PRISON MONIKERS.** A study of 87 gang-affiliated inmates found **almost
two thirds of nicknames referred to BEHAVIOURAL characteristics**, 76% were
received before incarceration, and 66 of the 87 liked being called by theirs. They
are **always given by fellow members**, and they are **rarely negative**. The
literature separates three things and the distinction is usable as-is:

    ALIAS     a temporary name to conceal who you are
    NICKNAME  endearment or derogation, from the people around you
    MONIKER   a name used inside a subculture and unknown outside it

**THE INVARIANT ACROSS BOTH: YOU CANNOT GIVE YOURSELF ONE.** A name you picked for
yourself is not a name, it is a claim. Our engine already says this. The real world
says it twice, from two directions, one affectionate and one criminal.

**AND PLACES WORK THE SAME WAY.** Critical toponymy finds communities naming places
after respected residents, events, or a natural feature, and in colonial Singapore
residents ran a whole **informal naming system parallel to the official street
signs**. That is the mechanic for a collapsed Las Vegas: **the official name is on a
rusted sign nobody reads, the real name is what happened there, and which one you
use says which world you came from.**

## 4. WHAT THE BEST GAME ON THIS EXACT QUESTION DOES
**RETURN OF THE OBRA DINN is a whole game about learning who sixty people are**, and
its architecture is the inverse of ours:

- **The mouths do the naming.** You learn who somebody is because other people in
  the memory ADDRESS them, argue with them, complain about them by name.
- **The book only records.** The logbook photograph gets clearer as evidence
  accumulates; the manifest lists nationality; identities confirm in batches of
  three so a guess is never free.
- **Lateral evidence is the whole pleasure.** An accent, a pipe, a jacket, a
  position on deck. The name is a conclusion the player reaches, never a label they
  are handed.

**WE BUILT THE LOGBOOK AND SKIPPED THE MEMORIES.** Our `nameOf()` is the manifest.
Our quests are the memories, and in ours nobody addresses anybody.

## 5. WHAT THIS ASKS FOR, WHICH IS SMALL
1. **PEOPLE SAY EACH OTHER'S NAMES.** The gap is 1.0% against a floor of 22.8%. A
   third-person mention is worth more than a direct address: "the man who fixed the
   corner tap" becomes a name the second time somebody uses it, and the player has
   met him without meeting him.
2. **THE NICKNAME IS THE CHEAPEST CHARACTERISATION IN THE GAME AND IT IS FREE.**
   One apodo tells you a physical fact, a relationship, and a temperature in two
   words, and it obeys the Spanglish law without adding Spanish (a name is not
   translated, so it costs nothing against the 8/26 cap).
3. **NOBODY NAMES THEMSELVES, EVER.** That is the rule from both bodies of
   evidence and it is already our engine's law. A person who introduces themselves
   with a nickname is lying or dangerous, and that is a usable tell rather than a
   restriction.
4. **A PLACE IS NAMED FOR WHAT HAPPENED THERE.** Not for a type. "The lit street"
   already exists in our build as a phrase in somebody's mouth, and it is the best
   place name in the game. Nobody planned it.
5. **AND THE LAW STAYS: I DO NOT NAME THE STORY PEOPLE.** `KNOWN_AT_START` and
   `LINES` ship EMPTY and `people_gate.js` goes red if either gains a row. Every
   name in the bank is either from the engine's own generated pool or a shape with
   a blank in it. **The mechanism is mine, the cast is Paolo's**, and nothing here
   may become canon by being shipped.

## ROUTED
- **WORDS**  Q12 answered. Next open is Q13 [rumours spread], and it is the direct
  sequel: a rumour cannot travel without a name to travel about.
- **WORDS**  NEW ROW `SAY-THE-NAME`: raise the address rate off 1.0% toward the
  22.8% floor, with third-person mentions doing most of the work. Held until
  MODE: BUILD.
- **PEOPLE**  The naming engine is correct and unused. Two things it does not have:
  an APODO layer (a conferred nickname, distinct from the given name) and a way for
  a name to enter play through a MOUTH rather than a button. Both are pools and
  both are replaceable, exactly like GIVEN and SURNAME.
- **WORLD / CITY**  Places are types, not names. A vernacular layer over the
  official one costs nothing and is how a real collapsed city talks about itself.
- **UI**  The interface should RECORD a name the player already heard somebody say,
  never hand one over. Anything the player was told is worth less than anything they
  worked out.
Test material: banks/BOHEMIA_WORDS_TEST_LINES.md, all `draft:true`, none in the game.

## SOURCES
- Mexican apodo culture: near-universal, conferred by family, friends and
  coworkers, physically descriptive, affectionate under a surface that reads as
  insult in Anglo culture, and understood as evidence that somebody sees you.
- Nickname usage by gang members (87 gang-affiliated inmates): almost two thirds of
  nicknames referred to behavioural characteristics, 76% acquired before
  incarceration, 66 of 87 liked being called by theirs; nicknames are always given
  by fellow members and are rarely negative. Alias, nickname and moniker are
  distinct categories.
- Critical toponymy: place naming as social and political practice; communities
  naming for respected residents, events and natural features; colonial Singapore's
  informal naming system running parallel to the official street names.
- Return of the Obra Dinn: sixty identities established through lateral evidence
  (accents, clothing, position, the manifest), confirmed in batches of three, with
  the logbook recording what the memories said rather than telling the player.
- This lane's own three-corpus vocative measure, trusted only because the corpora
  agree: FILM 22.8%, KOTOR 23.9%, REAL SPEECH 31.4%.
- Our own build: 57 distinct speakers with zero names; 4 proper-noun candidates in
  1,669 lines, all four read and all four false; 16 vocatives, all read, all
  address nouns; engine/bohemia_people.js GIVEN 64, SURNAME 48, nameOf(),
  headingOf(), addressOf() and the earned-name law; districts as types and landmark
  pieces as generic nouns.
