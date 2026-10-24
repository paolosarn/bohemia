# THE TRAIT BEFORE YOU HIRE (RUN TWO, 10/24/26, row [the trait before you hire], rule 133, TUNING's change 9)

Rule 133 (Paolo 10/23): 'the whole point of this project was to be like Battle Brothers but quicker and funner for normies, also
kind of hardcore vibes if you're fucking around too much.' TUNING's change 9 (records/BOHEMIA_TUNING_QUICKER_AND_FUNNER_FOR_NORMIES_THE_TEN_CHANGES_10_23_26.md):
'a recruit's card shows his face, his 3 best things as stars, his one trait in plain words, his price and his nightly cost...
HARDCORE KEPT: a bad trait is still a bad trait.' Battle Brothers hides a recruit's traits behind a try-out fee; the friendlier
games (Darkest Dungeon's stagecoach) show the quirks up front. No card (rule 127): he meets it at the next post.

## WHY IT WAS LEFT LAST ROUND, AND WHAT WAS WRONG ABOUT THAT

Last round's note: 'no trait table with its numbers is in the repo (PEOPLE's heirs file names traits, no effects; the library holds
one trait page, Asthmatic) and the wiki is behind this box's wall'. Measured this round: the loose folder
(reference/library/grok/wiki/pages/, 196 pages) has one; THE LIBRARY'S OWN TARBALL (reference/library/grok/wiki/PAGES_ALL.tar.gz,
2,256 pages, bb_all/) HAS ALL 74 the wiki's Traits page lists (CORE_WIKITEXT.md, '# PAGE Traits', its {{:Name}} transclusions).
engine/bohemia_goodbros.js (PEOPLE, 10/9) had said the same thing ('No master Battle Brothers trait list exists anywhere in this
codebase'); it was in the tarball the whole time.

## THE TABLE (tools/bohemia_run2_traits_from_the_wiki.py -> records/target/bb/traits.json)

Every trait page's <onlyinclude> row, its Effects cell kept verbatim, each effect parsed (a stat and a number, flat or percent, or
'special' for a sentence). AT THE POST: a recruit can be dealt it, and every effect is a flat number on the eight stats the fight
reads, so the card's promise is the fight's arithmetic:

| trait | the wiki's numbers | ours, in plain words (draft:true) |
|---|---|---|
| Brave | +5 Resolve | Does not scare easy. |
| Clumsy | -5 Melee Skill | All thumbs. |
| Cocky | +5 Resolve, -5 Melee Defense, -5 Ranged Defense | Thinks he is the best. |
| Craven | -10 Resolve | Runs first. |
| Dexterous | +5 Melee Skill | Good hands. |
| Fainthearted | -5 Resolve | Shakes when it starts. |
| Fearless | +10 Resolve | Nothing scares him. |
| Fragile | -10 Hitpoints | Breaks easy. |
| Hesitant | -10 Initiative | Slow to move. |
| Paranoid | +5 Melee Defense, +5 Ranged Defense, -30 Initiative | Watches his back. |
| Quick | +10 Initiative | Moves first. |
| Strong | +10 Fatigue | Carries more. |
| Sure Footing | +5 Melee Defense | Hard to knock down. |
| Swift | +5 Ranged Defense | Hard to hit from far. |
| Tough | +10 Hitpoints | Takes a beating. |

LEFT OUT, NAMED (59), never printed as a promise the fight does not keep: a percent of damage (Huge, Tiny, Drunkard, Brute's
head damage), of experience (Bright, Dumb), of the daily pay (Greedy), a sight (Eagle Eyes, Short Sighted, Night Owl, Night
Blind), a sentence (Lucky, Iron Jaw, Iron Lungs, Athletic, Survivor, Determined, Weasel...), a status (Old), a trait suffered
through events (Fat: the Traits page's own example), the cult's, the arena's and the player's, and the fears and hatreds of
greenskins and undead the valley does not have. Each carries its why in the file; when the fight reads a percent or a sentence,
flipping at_the_post is the tool's one rule.

## THE POST

- One trait a man (the card shows one: change 9; Battle Brothers deals 0 to 2), from the fifteen his background allows (the wiki's
  own traits_excluded per background, records/target/bb/backgrounds.json), seeded by the place, the week and the man: the same man
  has the same trait all week, on every visit.
- The card: his whole 3D body with his gun, his face, his name and background, what his gun does, THE TRAIT (its name, green when
  all good, red when all bad, plain when mixed; a few plain words; the wiki's numbers in the card's own short names, '+10 FAT'),
  then his eight stats WITH THE TRAIT ON THEM, a moved number bold and coloured on UI's receipt paper with an arrow (never colour
  alone), his three stars, his price and his night.
- Hired, he walks in with it: bohemia.hired.v1 keeps traits [id], the trait's words, the stats his card showed and his base roll;
  the crew screen shows the trait on his page ('STRONG  Carries more.  +10 FAT') and its hand-over carries stats and traits.

## THE FIGHT (two additive lines in slices/BOHEMIA_FIGHT.html, COMBAT's file, the way [climbing] put c.perks in)

The company map takes m.stats and m.traits; crewUnit uses a hired man's card stats instead of a fresh roll, AND STILL DRAWS THE
ROLL, so the dice stream for every man and enemy after him is unchanged (gate leg: the same seed with and without his stats deals
the same band in the same places). Before this the fight re-rolled every man's stats from his background at every fight, so the
card he was hired from was never his fight. Origin men (no stats handed) are rolled as before.

## STILL NOT IN THE DEMO'S FIGHT, NAMED (RUN's file)

The demo's nfOpts() hands the fight BOH_START.picks().company (the origin's men, background and level), never the crew screen's
company or the men in bohemia.hired.v1, so a man hired at a post is counted for the bill and the party size but never stands in a
fight. FOR RUN: hand the fight the crew screen's company (BohemiaCrewDoor.company(), bohemia.company.v1, which now carries a hired
man's stats and trait) or append bohemia.hired.v1's men; the trait and the card's numbers then fight with him.

## MEASURED (gates/the_trait_before_you_hire_gate.js, 12/0)

- H1: 74 of 74 listed traits read; the 15 at the post re-read from their own pages by the gate (its own regex, the tarball
  extracted fresh): the same numbers; 59 left out, each with a why.
- H2: 24 men at camps, towns and fortresses in two places: every one shows one trait in plain words with the wiki's numbers,
  10 different traits, none his background excludes. H3: every stat on every card is his roll plus his trait, the moved ones
  marked. H4: the same men, the same traits on a second visit.
- H5: OCTAVIO WHITAKER (farmhand, STRONG) hired: kept with strong and FAT 118 (108 + 10); the crew screen's page reads 'STRONG
  Carries more. +10 FAT' and its hand-over carries both.
- H6: a fight handed that company gives him HP 67, RES 36, INI 108, his card's; the band and its places identical with and
  without his stats.

## GATES RUN (rule 13)

THE TRAIT BEFORE YOU HIRE 12/0 (new), THE TOWN AND THE HIRE 11/0, THE SETTLEMENT SCREEN 74/0, THE HIRE SHOWS THE WHOLE MAN 10/0,
THE HIRE PRICE IS THE FORMULA 10/0, CLIMBING 15/0, THE KEEPERS SPEAK 48/0, THE ARRIVAL 37/0. THE REBUILT FIGHT PLAYS: see the
ship commit (measured on this tree and on clean main).

## FOUND AND FIXED BEFORE IT SHIPPED

The settlement screen already had a TRAITS (the place's traits: market day, raided) and a traitLine() (the keepers' trait lines).
My first names reused both and would have broken every place's traits and keepers' lines (a hoisted function wins). Renamed
MEN_TRAITS and manTraitLine; a sweep for duplicate function names in the file finds none.

## ROUTED

- PEOPLE: engine/bohemia_goodbros.js's 'NOT YET LIVE: traits... no master trait list' is answered by records/target/bb/traits.json;
  the roll lives in the settlement screen (hireTrait) until you want it in the goodbros roll.
- TUNING: the fifteen are the wiki's numbers as they stand; Battle Brothers deals 0 to 2 a man, the card shows one.
- COMBAT: two additive lines in your fight (the company map, crewUnit's roll), gated; when the fight reads a percent of damage
  or a sentence (Huge, Lucky, Iron Jaw), the tool's at_the_post opens those traits to the post.
- RUN: the hired man into the demo's fight (above).
- WORDS: the 'says' lines are draft:true.
