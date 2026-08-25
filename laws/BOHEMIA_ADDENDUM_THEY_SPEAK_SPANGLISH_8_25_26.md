# ADDENDUM: THEY SPEAK SPANGLISH (Paolo 8/25/26, LOCKED)

## THE RULING, VERBATIM
> "in regards to the spanish ... make them speak spanglish for our game i
> like that. have it very poor english ro spanglish to give it that
> flavor ty"

## WHAT IT SETTLES
Sweep 15 (records/BOHEMIA_EVERYBODY_IN_THIS_VALLEY_SPEAKS_PERFECT_ENGLISH_
8_25_26.md) found that a Las Vegas with 418,400+ Spanish speakers had
exactly zero in the build, and put language on the roadmap as a fact
about a person. It deliberately reserved HOW that language shows up in a
line, because that is writing and writing is his.
HE JUST RULED. IT IS SPANGLISH, IN THE LINE, IN THE GAME. Not a
translation layer, not a subtitle, not a setting. The words themselves
carry it. NOTES ARE RULINGS (7/19): this is built, not re-asked.

## THE THREE REGISTERS (the mechanism half, mine, from his two words)
He named two things — "very poor english" AND "spanglish" — and they are
NOT the same register. They belong to different people, and keeping them
apart is what makes the valley sound real instead of sounding like one
joke told fifty times.
1. **ENGLISH-DOMINANT.** Grew up here. English with the occasional word
   from home, usually family, food, swearing, or something with no good
   English word. Most people.
2. **SPANGLISH.** Fluent in both, switching inside a single sentence
   because it is FASTER, not because anything is missing. This is his
   headline register and it gets the most lines.
3. **SPANISH-DOMINANT / POOR ENGLISH.** Arrived later, or never needed
   English until the grid went down. Short sentences, missing articles,
   dropped auxiliaries, words that arrive out of order. His "very poor
   english", and it belongs to SOME PEOPLE, never to all of them.

## THE RESEARCH THAT MAKES HIS RULING LAND INSTEAD OF EMBARRASSING US
This is the part worth writing down, because the difference between
Spanglish-as-flavour and Spanglish-as-mockery is one design decision.
**SPANGLISH IS NOT BROKEN ENGLISH. IT IS A FLUENT REGISTER.** The
sociolinguistics is clear on the direction even where it argues about the
details: switching inside a sentence (intra-sentential code-switching) is
characteristic of PROFICIENT bilinguals — it is what teachers and
students do with each other — and it tends to happen at points where the
two grammars line up, Poplack's equivalence constraint. The constraint
itself is contested (one Arabic-English study found 67.8% of utterances
violating it) and the honest reading of that literature is the useful
one: **violations are not caused by limited competence.** Speakers who
switch "wrongly" are not worse bilinguals. Switching is also TRIGGERED —
it is more likely after another switch, and around words that look alike
in both languages.
**SO: register 2 is a SKILL, register 3 is a GAP, and writing all of them
as register 3 would be both bad linguistics and an insult to a third of
the county.** That is the whole craft rule. His ruling gets executed
exactly; the mix is what keeps it honest.
### THE PRACTICAL WRITING RULES
- **SWITCH AT THE JOINT, NOT MID-PHRASE.** Switches land at clause and
  phrase boundaries where both grammars agree. "I told him no, pero el
  cabrón went anyway" reads real. Chopping a phrase in half does not.
- **SWITCH FOR A REASON.** Emotion, family, food, insults, prayer,
  numbers, and anything with no clean English word. Nobody switches
  randomly and a random switch is the tell of a writer who has not heard
  it.
- **NEVER PHONETIC SPELLING OF AN ACCENT.** No "joo" for "you". That is
  not a register, that is a cartoon, and it is the single most common way
  this goes wrong in shipped games.
- **REGISTER 3 IS GRAMMAR, NOT VOCABULARY.** Poor English is dropped
  articles and auxiliaries and short clauses. It is not misspelling.
- **THE MEANING SURVIVES THE SPANISH.** See the hard rule below.

## THE HARD RULE, CARRIED OVER AND UNCHANGED
**LANGUAGE NEVER GATES REQUIRED INFORMATION.** Anything the player must
have to finish anything is always understandable to a monolingual English
player. Spanglish is flavour, and it is who-knows-first, and it never
decides whether you can play. Sleeping Dogs is the precedent in both
directions — praised as authentic AND attacked as gratuitous — and the
localisation literature names the real cost: comprehension failures that
leave a player unsure what to do next. The gate claim below is what keeps
this ruling from ever becoming that bug.

## WHAT IS STILL HIS AND STAYS EMPTY
- Whether the PLAYER speaks anything but English.
- Which NAMED story people sit in which register.
- Whether the game ever ships translated (a separate, later, business
  decision — this addendum is not about translation).

## THE MACHINE HALF (a law without a machine gate is not enforced)
`language_gate`, shipping with QUESTS LANG-2:
  (a) every authored player-facing line carries a `lang` / register tag;
  (b) the derived people mix matches the real valley numbers within
      tolerance, AND the register mix is not all one register — a build
      where every Spanish-speaking character is register 3 FAILS;
  (c) **NO LINE CARRYING REQUIRED INFORMATION IS NON-ENGLISH** —
      objective text, resolution buttons, the phone feed's job offer.
Mutation tests: retag one objective line non-English -> (c) red. Flatten
every register to 3 -> (b) red.

## SOURCES
Paolo, 8/25/26. Frontiers in Psychology / PMC, "Code-Switching
Strategies: Prosody and Syntax"; Poplack's equivalence constraint and the
UNM thesis challenging its universality with Arabic-English data;
research on lexical triggering and interactive alignment in bilingual
dialogue; Siliconera interview with United Front Games on Sleeping Dogs;
Legends of Localization on untranslated text in shipped games. Prior:
records/BOHEMIA_EVERYBODY_IN_THIS_VALLEY_SPEAKS_PERFECT_ENGLISH_8_25_26.md.
