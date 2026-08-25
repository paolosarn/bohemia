# EVERY PLAYER GETS THE SAME VALLEY FOREVER, AND IT IS ONE LINE
# (8/25/26, coordinator sweep 20. A LOCKED LAW OF HIS IS CONTRADICTED BY
# A CONSTANT. Decision, routed work order, and the cost of the fix stated
# honestly because it is not free.)

## 1. THE MEASUREMENT — ONE LINE
    slices/BOHEMIA_CITY_WORLD.html:20908
        const BOH_SEED_TEXT='bohemia';
        function BOH_ONE_SEED(){ return BOH_HASH_SEED(BOH_SEED_TEXT); }
    :20910
        let seed=BOH_ONE_SEED(), om=OM.buildOvermap(seed);
Every player, every install, every run, forever, gets the identical
valley. There is no other seed anywhere: a save restores its own stored
seed, and a player with NO save gets `hash('bohemia')`. There is no new-
run path that rolls a new one, no seed field, no gate about seeds, and no
backlog row.

## 2. THE LAW IT CONTRADICTS IS HIS, IT IS LOCKED, AND IT IS SPECIFIC
laws/BOHEMIA_ADDENDUM_THE_VALHEIM_SHAPE_8_4_26.md (Paolo 8/4, LOCKED),
§2, verbatim:
> "REPLAYABILITY comes from the seed + quest variety, not from forcing
> one run to eat the whole map: **different seed, different valley,
> different quest options and facts = the comeback engine.**"
He named the mechanism, in his own words, three weeks ago. **THE
MECHANISM IS DISABLED BY A CONSTANT.** Nobody decided that; it is what a
value gets when it is written once for development and never revisited.
A LIVE LAW CONTRADICTED BY LIVE CODE IS A BUG, NOT AN INTERPRETATION
CHOICE. That is CLAUDE.md's own rule and it is the whole reason this
record exists.
AND HE SAID IT AGAIN THIS WEEK, OUTSIDE THE REPO: when he asked for the
game explained in Spanish to his family, procedural replayability was one
of the features he wanted named. It is the pitch. It is currently a
`const`.

## 3. THE ARCHITECTURE ALREADY DOES WHAT HIS LAW ASKS — READ IT
This is the part that makes the finding cheap instead of terrifying.
engine/bohemia_overmap.js, buildOvermap:
    const fixed = skeleton(x,y,L);          // the REAL Las Vegas
    let d = fixed;
    if(!d){ ...; d = proceduralDistrict(x,y,r,L); }   // the FILL
    tiles[...] = {..., fixed:!!fixed, seed:(seed^...)>>>0}
**THE ENGINE ALREADY SEPARATES THE REAL CITY FROM THE PROCEDURAL FILL,
AND ALREADY THREADS A PER-CELL SEED.** The Strip, I-15's spine, the
Spaghetti Bowl, downtown, the dam, the mountains, the airport, the fort,
the Springs — those come out of `skeleton()` and are FIXED because they
are facts about a real place. Everything between them is generated. The
layout even flips the town sides per seed already (`layoutFromSeed`, "the
mirror, LOCKED").
So his law is not an unbuilt feature. IT IS A BUILT FEATURE WITH ITS
INPUT WELDED SHUT.

## 4. THE TENSION I AM NOT ALLOWED TO PAPER OVER
Two other things he has locked pull the other way, and any honest version
of this has to resolve them rather than pretend they do not exist.
- **ONE MAP (7/27, LOCKED):** "If those two can drift — different seed,
  different district, different anything — the map is decoration." READ
  IN CONTEXT that is about the phone's map and the city builder agreeing
  WITHIN a run, one source of truth, not about one seed for all time. It
  is satisfied by threading the run's seed everywhere, which the code
  already does. NOT A CONFLICT.
- **REALISM FIRST:** there is exactly one Las Vegas. A differently-shaped
  Vegas every run is LESS real, not more. **THIS ONE IS A REAL CONFLICT
  AND IT DECIDES THE SHAPE OF THE ANSWER.**
**THE RESOLUTION IS THE SPLIT THE ENGINE ALREADY BUILT: THE SKELETON IS
FIXED BECAUSE IT IS A FACT. THE FILL IS SEEDED.** The Strip is always the
Strip. Your street is not always your street. That satisfies REALISM
FIRST completely, satisfies ONE MAP completely, and delivers the comeback
engine he asked for.

## 5. THE GAMES AISLE SAYS THE SAME THING, FROM PRACTICE
The practitioner consensus on procedural worlds is not "random is good."
It is HYBRID, and the canonical teaching case is Spelunky: it generates
levels that FEEL handcrafted by assembling pre-designed chunks under
strict rules, with defined entries and exits and a guaranteed critical
path — "constraints and careful rule design produce better results than
pure randomness." Hades, Dead Cells and Slay the Spire take the same
posture: the ARRANGEMENT varies, the vocabulary does not. The general
advice practitioners give is literally our situation — layer generation
at different scales and use handcrafted elements as the building blocks.
And Valheim, WHICH IS THE GAME HE NAMED IN THE LAW, is the proof that a
seed can be a social object: seed-sharing is a large part of that game's
culture, because a seed is a place people can send each other.

## 6. THE REAL-WORLD AISLE, AND IT ARGUES FOR THE FIXED HALF
Environmental psychology has studied why people bond to places since
Altman and Low's PLACE ATTACHMENT (1992), and the mechanism is not
beauty. It is **FAMILIARITY** — named a central cognitive element — plus
time spent with people in the space, ROUTINES AND RITUALS, privacy and
territoriality, PERSONALISATION through decorating, and possessions that
carry memory. Attachments formed early and reinforced by repetition are
the strongest.
**EVERY ONE OF THOSE IS A BOHEMIA MECHANIC ALREADY.** The house you wake
up in. The neighbour one door down. Walking the same blocks until you
stop needing the arrow. The city builder letting you change the place.
The code even has a marker named `__THE_VALLEY_IS_A_PLACE__`.
SO THE RESEARCH DRAWS THE LINE FOR US: **reshuffling the geography every
run would destroy the exact mechanism that makes a player love the
valley.** Keep the skeleton. Vary the fill, the people, the jobs. That is
not a compromise between his two laws; it is the version where both are
right.

## 7. THE FINDING THAT CHALLENGES WHAT WE BELIEVE — AND IT IS THE COST
**WE BELIEVE THE GAME WORKS BECAUSE THE GATES ARE GREEN. EVERY GATE WE
HAVE HAS ONLY EVER RUN ON ONE VALLEY.**
379 registered gates. 23 whole-demo claims. Every district dossier, every
piece of approved art, every walk test, every playtest, every screenshot
he has ever thumbed — all of it on `hash('bohemia')`.
THE SHARPEST EXAMPLE IS FROM TODAY'S OWN DELTA: WORLD shipped "EVERY
DISTRICT IN THE VALLEY HAS A WAY IN: RULE NUMBER ONE IS GREEN FOR THE
FIRST TIME." That is a genuine achievement and it is proven **on one
seed.** The landlocked law's whole point is that generation can strand a
cell; whether it holds on seed two is unknown.
So the honest accounting: turning the seed on does not just enable a
feature, IT EXPOSES A LARGE SURFACE WITH ZERO EVIDENCE BEHIND IT. That is
the cost, it is real, and it is why the sequencing in §8 matters more
than the switch itself. (Same shape as sweep 16's engine finding — an
apparatus proving one instance and being read as proving the class. Noted
once, not re-argued.)

## 8. THE DECISION (mine, EVERYTHING IS A THUMB — and it is enforcing HIS
## locked law, not inventing a feature)
1. **THE SPLIT IS THE LAW: SKELETON FIXED, FILL SEEDED.** Write it down
   as the standing rule so nobody ever "fixes" it by randomising the
   Strip. It is what the engine already does; it has just never been
   stated.
2. **A NEW RUN ROLLS A NEW SEED, AND THE SEED IS VISIBLE.** Shown, and
   able to be typed in, because he named Valheim and a seed you can send
   somebody is the cheapest social feature a world game can have.
3. *** NOT BEFORE THE FRIENDS ROUND. THIS IS THE PART THAT IS NOT
   OBVIOUS. *** Round 1 must run on the canonical valley. If five
   testers each get a different world, their quit points and confusions
   are not comparable to each other or to round 2, and the protocol's
   whole value is comparison. Sweep 14 said first impressions spend once;
   spending them across five different maps spends them for nothing.
   BUILD IT NOW, SWITCH IT ON AFTER ROUND 1.
4. **THE INVARIANTS GET A GATE BEFORE THE SWITCH, NOT AFTER.** Whatever
   we believe about the valley has to hold across seeds or it was never a
   property of the game, only of `hash('bohemia')`.
5. **THE CANONICAL SEED KEEPS ITS NAME.** `'bohemia'` stays the default
   for gates, art review and anything he thumbs, so his verdicts stay
   comparable forever. A new seed is a PLAYER thing, never a test thing.

## 9. ROUTED
- **WORLD — SEED-1: UNWELD THE SEED.** A new run rolls one; the seed is
  displayed and enterable; `'bohemia'` stays the default everywhere a
  machine or a verdict looks. Do not switch it on for the demo build
  until round 1 is done (§8.3) — build the path, leave the door shut.
- **WORLD — SEED-2 / `seed_gate`, BEFORE the switch:** boot N seeds
  (start small, 8) and assert the invariants we have only ever checked on
  one — every district has a way in (the landlocked law, whose "rule
  number one" just went green on seed 'bohemia' alone), no district type
  lands where the landlocked law forbids it, the Strip/I-15/dam/mountains
  are IDENTICAL across all N because they are the fixed skeleton, and the
  walkable-land and street-access laws hold per seed. Mutation test:
  force a landlocked commercial cell on one seed -> red.
  **EXPECT REDS AND TREAT THEM AS THE POINT.** A generator that has only
  ever been observed at one input is not known to work; it is known to
  work once.
- **COORDINATOR / the friends-round record:** the sequencing in §8.3 is
  written into records/BOHEMIA_THE_FRIENDS_ROUND_IS_NOT_READY_8_24_26.md
  so nobody switches the seed on mid-round.

## 10. CONFIDENCE
- The constant, the boot path and the absence of any other seed source:
  read in place. **CERTAIN.**
- The Valheim Shape law's wording: verbatim from a LOCKED addendum in his
  own words. **CERTAIN.**
- The skeleton/fill split already existing in buildOvermap: read in
  place. **HIGH** — I read the generator's structure, not every branch of
  proceduralDistrict.
- That gates and art have only ever run on one seed: follows from the
  constant, since nothing else can produce another. **HIGH.**
- The Spelunky/hybrid practitioner consensus: trade press and
  practitioner write-ups, consistent. **MEDIUM-HIGH.**
- Place attachment and familiarity: foundational environmental
  psychology, well replicated. **HIGH** as science; the mapping to our
  mechanics is my argument, not theirs.
- That seed variety will find real bugs: a **PREDICTION**, and unlike
  most of mine it is cheap to settle — eight boots.

## SOURCES
laws/BOHEMIA_ADDENDUM_THE_VALHEIM_SHAPE_8_4_26.md §2 and
laws/BOHEMIA_ADDENDUM_ONE_MAP_7_27_26.md (both his, both LOCKED);
slices/BOHEMIA_CITY_WORLD.html:20908-20910 and :32764;
engine/bohemia_overmap.js (skeleton / proceduralDistrict / layoutFromSeed);
laws/BOHEMIA_ADDENDUM_LANDLOCKED... and the WORLD commit "EVERY DISTRICT
IN THE VALLEY HAS A WAY IN". Outside: Game Developer, "How to effectively
use procedural generation in games"; the Spelunky level-generation
teardown; practitioner write-ups on hybrid procedural level design;
Altman & Low, PLACE ATTACHMENT (1992) and the environmental-psychology
literature on familiarity, routine and personalisation as the drivers of
attachment.
