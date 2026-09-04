# BB STUDY — DAY 16: THE PLAYER ONLY LIVES ONCE, AND IT CHANGES WHAT WE
# ARE ALLOWED TO TAKE
# (coordinator, on his trigger. Days 1-15: records/BOHEMIA_BB_STUDY_DAY_*.md)
# *** THIS DAY AUDITS THE STUDY ITSELF. ***

## 0. THE QUESTION FIFTEEN DAYS SHOULD HAVE ASKED FIRST
We have spent fifteen days taking mechanisms out of a game that is built
to be **PLAYED AGAIN**, and putting them into a game that is explicitly
**PLAYED ONCE**: no runs, one continuous life across three generations,
~100 hours to complete, and — measured below — **one valley, forever.**
**SO: WHICH OF THE THINGS WE TOOK ONLY PAY OFF IF YOU START OVER?**
Nobody has checked, and it is the coordinator's job, not a lane's.

## 1. THE GAME HE NAMED IS A REPLAY MACHINE
Its best-loved systems are VARIANCE systems, and variance pays off across
playthroughs:
- **ELEVEN ORIGINS.** Each is a different starting scenario with
  *"different starting characters, equipment, resources, and special rules
  for your campaign"*, and *"most of them impact it from beginning to
  end."* Peasant Militia starts you with twelve badly equipped peasants,
  a bigger roster and battle size, and a rule that you may only ever hire
  lowborn men. That is not a difficulty setting; **it is a different
  game**, and its entire payoff is that there is a next campaign.
- **THE WORLD IS GENERATED FRESH** each campaign.
- **YOU CHOOSE YOUR CRISIS AT THE START** (day 11), or leave it random.
- **PERMADEATH PLUS NO RELOADING** (day 4) makes each campaign a
  different story by construction.
- **WIDE STAT RANGES ON CHEAP RECRUITS** (day 8) — the lucky farmhand who
  rivals a professional. **That story requires rolling many rosters.**
**EVERY ONE OF THOSE IS A MACHINE FOR MAKING THE SECOND CAMPAIGN DIFFERENT
FROM THE FIRST. WE DO NOT HAVE A SECOND CAMPAIGN.**

## 2. THE MEASUREMENT: ONE VALLEY, FOREVER, AND IT IS A CONST
```
const BOH_SEED_TEXT='bohemia';
function BOH_ONE_SEED(){ return BOH_HASH_SEED(BOH_SEED_TEXT); }
let seed=BOH_ONE_SEED(), om=OM.buildOvermap(seed);
```
And a search for any way to change it — a new-seed control, a random
seed, a seed input — returns **ZERO**. (This was found in an earlier sweep
and is already routed as WORLD SEED-1/SEED-2; day 16 is not re-routing it,
it is using it.)
Plus the locked rulings: **THERE ARE NO RUNS**, death is a reload not a
reset, and the dynasty is three generations that **INHERIT** rather than
restart. Add it up and the shape is unambiguous: **ONE WORLD, ONE
CONTINUOUS LIFE, ONE HUNDRED HOURS, AND YOU NEVER SEE IT FRESH AGAIN.**

## 3. THE AUDIT — WHAT THIS STUDY TOOK, MARKED
Honest bookkeeping on my own routing. Most of it survives, and that is
worth saying plainly.
### PAYS OFF IN A SINGLE LIFE (the large majority)
The offer gate and the two reputation axes; price with a place, wants,
friction; orders as intents; guns bad in close; no cover-and-hold; going
back for her; responsiveness; marks that persist; territory and the named
circuit owner; the landlord rule; the payroll motor and the obligation
burn; the former trade; the verb tree; loot as access; the one-way stock;
the fixer; coalition escalation; critical slowing down; morale on by
default; the rout as a decision; being able to withdraw; more keys on the
twelve encounters; the end of the day; the cold hand; the heat and the
work/rest cycle; armour that costs tempo.
**All of those land the first time, on one playthrough, for one player.**
### NEEDS A SECOND PLAYTHROUGH, AND WILL LAND FLAT
1. **WIDE STAT RANGES ON CHEAP PEOPLE (day 8's variance half).** "The
   beggar who became a legend" is a story told across many rosters. Roll
   once and it is not a story, it is a dice result. **KEEP the background
   as WHAT SOMEBODY STILL THINKS THEY ARE; DROP the variance-as-story
   argument.** (Day 8 already refused stat packages for other reasons, so
   this only removes a justification, not a row.)
2. **A CRISIS CHOSEN OR RANDOMISED AT THE START (day 11).** Variety across
   campaigns is worth exactly nothing when there is one campaign. **What
   survives is the SHAPE — foretold, buildup, not optional, escalation by
   coalition. What dies is "and next time you get a different one."**
   The act turn is authored, not rolled, and it is his.
3. **ORIGINS / STARTING SCENARIOS, ENTIRELY.** Not routed and must not
   be. Eleven different openings is a replay feature, and our opening is
   a fixed authored scene he has already ruled (the 7/19 match-cut, the
   cold open, the creator at the fold).
**THAT IS THREE ITEMS OUT OF FIFTY-TWO ROWS, AND ONE OF THEM WAS NEVER
ROUTED. The study holds up. But it holds up better with this written
down than without it.**

## 4. *** THE FINDING THAT CHALLENGES WHAT WE BELIEVE, AND IT IS THE
## OTHER HALF OF THE SAME COIN ***
There is a hard result about one-shot versus repeated interaction, and it
is the most useful thing I have read in sixteen days.
- In a **ONE-SHOT** encounter, the rational move is to defect. In a
  **REPEATED** one, cooperation emerges and wins.
- Axelrod's tournament found the winner was the simplest program entered:
  **TIT FOR TAT** — open nice, then copy what the other side did last
  time. Four lines of code.
- The mechanism has a name: **THE SHADOW OF THE FUTURE.** *"If the
  players expect to meet again, they are more likely to cooperate than
  when dealing with a 'one time only' counterpart."*
### WHAT THAT MEANS HERE, AND IT IS A STRUCTURAL ADVANTAGE WE HAVE NOT
### NOTICED WE HAVE
**BECAUSE WE NEVER RESET, EVERY RELATIONSHIP IN BOHEMIA IS A REPEATED
GAME.** One valley forever, one continuous life, three generations that
inherit standings, territory and unhealed wounds. **THE SHADOW OF THE
FUTURE IS NOT A METAPHOR IN THIS GAME. IT IS THE ARCHITECTURE.**
And that retroactively explains why day 1, day 6 and day 12 all landed on
the same thing without knowing it: the reputation web, the
what-you-are-known-to-do axis, the man who lives to tell people. **Those
are not flavour systems. They are the payoff of not resetting**, and BB
structurally cannot have them, because it throws the world away.
### AND THE INVERSE IS THE WARNING
**ANYTHING THAT MAKES AN ENCOUNTER ONE-SHOT IS TELLING THE PLAYER TO
DEFECT**, and it destroys the exact advantage our structure gives us for
free. We already have one measured, from day 12:
> **A man who breaks runs to distance 30 and is DELETED.**
The single person who would have carried your reputation out of that
fight — the one who tells people what you did — is removed from the
world. **We built the shadow of the future and then despawned it.**
The same test applies everywhere: a district you clear and never revisit,
a person who exists only inside one quest, a faction whose memory resets
at a day boundary (which day 7 found and PEOPLE already fixed once).

## 5. WHAT WE TAKE, AND WHAT WE REFUSE
**TAKE:** the shadow of the future as an explicit design goal — the
player should be able to SEE that they will meet this person, this
faction and this block again; tit-for-tat as the model for how a faction
responds (open nice, copy what you did last, forgive on the next
cooperation), because it is four lines and it is the winner; and the
dynasty as the longest shadow any game gets to cast.
**REFUSE:** origins and starting scenarios; a rolled crisis; variance
whose payoff is a second playthrough; and — the sharp one — **any
encounter that ends with a person or a place leaving the world.** In a
game that never resets, deleting somebody is throwing away the mechanism
that makes the whole thing work.

## 6. ROUTED
- **SHARED — BB-ONE-LIFE-AUDIT.** Written into the backlog so no lane
  builds a replay feature by accident: three things this study surfaced
  need a second playthrough to pay off and must not be built — wide
  stat-variance as a story engine, a rolled/chosen crisis, and origins.
  Everything else in the fifty-two survives on one life. Anyone adding a
  BB- row asks first: **does this pay off the FIRST time?**
- **PEOPLE — BB-THE-SHADOW.** Make the future visible. A faction's
  response follows the winning shape — open nice, copy what you did last
  time, forgive when you cooperate again — and the player must be able to
  see that this is a person they will meet again. Cheap first version:
  **the man you spared turns up.** Pairs with day 1's BB-KNOWN-FOR and
  day 12's BB-THE-ROUT, and it is the reason both of those matter.
- **RUN / COMBAT — BB-NOBODY-DESPAWNS.** A man who breaks currently runs
  to distance 30 and is deleted. He should go back into the world, carry
  what happened, and be somewhere later. In a game that never resets, a
  despawn is not a cleanup, it is throwing away the only witness.
**RUNNING ORDER:** behind the demo. BB-NOBODY-DESPAWNS rides with day
12's BB-THE-ROUT (same behaviour, same file), and BB-ONE-LIFE-AUDIT is a
bookkeeping row anybody can land in ten minutes.

## 7. CONFIDENCE
- The one-seed measurement and the absence of any seed control:
  **MEASURED**, and consistent with the earlier sweep that routed WORLD
  SEED-1/SEED-2. The despawn behaviour is day 12's measurement, quoted.
- BB's origins, their special rules, and the Peasant Militia specifics:
  wiki and player guides plus the developers' dev blog #114 as reported;
  the blog is proxy-blocked here and was NOT read directly.
  **MEDIUM-HIGH.**
- Axelrod's tournament, TIT FOR TAT winning as the simplest entry, and
  the shadow of the future: foundational and heavily replicated, with a
  real later literature arguing about how far the tournament results
  generalise. **HIGH** for the shadow-of-the-future mechanism; I am using
  tit-for-tat as a design shape, not claiming it is optimal in general.
- §3's audit and §4's application: **MY ARGUMENT AND MY ROUTING**, and
  §3 is me marking my own earlier work, which is the part most worth
  double-checking.

## SOURCES
Battle Brothers wiki (Origins) and dev blog #114 as reported, plus player
guides, for the eleven company origins, their special rules and the
Peasant Militia example. Robert Axelrod, "The Evolution of Cooperation"
and the 1980 tournament, for TIT FOR TAT and the shadow of the future,
plus the later experimental literature on repeated versus one-shot play.
IN-REPO: slices/BOHEMIA_CITY_WORLD.html (`BOH_SEED_TEXT`,
`BOH_ONE_SEED`), records/BOHEMIA_ONE_VALLEY_FOREVER_IS_A_CONST_NOT_A_
DECISION_8_25_26.md, laws/BOHEMIA_ADDENDUM_THERE_ARE_NO_RUNS_AND_COMBAT_
IS_RF4_ON_THE_BEAT_8_26_26.md, laws/BOHEMIA_ADDENDUM_THE_DYNASTY_LIVES_
8_28_26.md, laws/BOHEMIA_ADDENDUM_DEATH_IS_A_RELOAD_7_26_26.md, and days
1-15 of this study.
