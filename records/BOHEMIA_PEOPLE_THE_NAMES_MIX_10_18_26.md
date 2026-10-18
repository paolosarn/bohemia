# THE NAMES MIX: A NAME IS TWO WORDS (PEOPLE, 10/18/26)

Row: PEOPLE [the names mix] MORE-WHITE-NAMES-KEEP-IT-NATURAL. Under the hold
(rule 88): a page is the ship. NOT IN A TAB (a page). Bank:
banks/BOHEMIA_THE_NAMES_MIX_10_18_26.json, draft:true, nothing live reads it.
Gate: gates/the_names_mix_gate.js (THE NAMES MIX).

His words, 9/21, voting the names at your door UP: "a little more percentage of
white people names and we're good. Try to keep it natural. Hella Hispanic shit
going on. This game isn't a Hispanic game, chill out."

## 1. THE CENSUS (cited)

U.S. Census Bureau, QuickFacts, Clark County, Nevada (the latest vintage on the
page, read 10/18/26; https://www.census.gov/quickfacts/clarkcountynevada):

| group | share |
|---|---|
| Hispanic or Latino | 33.4% |
| White alone, not Hispanic or Latino | 35.6% |
| Black or African American alone | 14.4% |
| Asian alone | 12.5% |

Cross-check: Nevada Legislative Counsel Bureau, 2020 Population and Racial Data
Report, Nevada Counties (2020 count 2,265,461). It counts a multiracial person in
every group they chose, so its shares run higher; QuickFacts is the one used.
The 9/22 pass used "about 32% Hispanic and 41% white"; 41% is an older figure and
is retired here.

The bank rounds to five shares that add to 100: Hispanic 33, white 36, Black 13,
Asian 12, two or more backgrounds 6 (draws from every pool, the old way). The
die-off was not selective (TEN YEARS COLD), so the census stands for the valley.

## 2. WHAT IS LIVE, MEASURED

Two places hand out names today:

1. **The engine's bank** (engine/bohemia_people.js, GIVEN and SURNAME, the names
   he voted UP plus the 9/22 additions): 90 given names, 98 surnames. Counted
   one list at a time it looks fixed: 28 of 90 given names read Hispanic (31%),
   35 of 98 surnames (36%). That is what the 9/22 pass checked.
2. **The hire posts** (RUN TWO's settlement screen, HIRE_NAMES, draft): 16 one-word
   names, the men you actually hire. 12 of 16 read Hispanic (75%): Chuy, Lalo,
   Neto, Beto, Tavo, Memo, Pancho, Lupe, Yesenia, Marisol, Ofelia, Nacho.

## 3. THE FINDING. PROVES US WRONG

*** A NAME IS TWO WORDS, AND THE 9/22 FIX COUNTED ONE AT A TIME. ***

The engine draws the first name and the surname from two independent streams (its
own comment: "so a common first name and a common surname do not travel together
across the valley"). So a person's name reads Hispanic if EITHER word does. Each
list sits near the county, but together, over 20,000 people drawn by the engine's
own hash: **56.0%** of the valley's names read Hispanic, against a county that is
33.4% Hispanic. That is the "hella Hispanic" he heard, and it survived a fix that
was right about each list and wrong about the person.

And the people he meets most, the men at the post, are 75% Hispanic names, from a
list nobody measured, with two that read as a joke to an American ear (Pancho,
Nacho).

Real names are not independent. A woman named Guadalupe is far more likely to be
a Delgado than a Lindquist. Mixing two lists at random does not make a natural
city; it makes every third person half of somebody else.

## 4. THE DESIGN (draft; the crossover numbers are TUNING's)

Draw WHO FIRST, then the name. Each person gets a background from the census
shares, then a first name and a surname by that background, with real crossover:

| background | share | first name | surname |
|---|---|---|---|
| Hispanic | 33% | Hispanic pool 65%, common pool 35% | Hispanic 85%, rest 15% |
| white | 36% | common pool | rest 95%, Hispanic 5% (married in) |
| Black | 13% | Black pool 45%, common pool 55% | rest 95%, Hispanic 5% |
| Asian | 12% | Asian pool 50%, common pool 50% | Asian 85%, rest 15% |
| two or more | 6% | any name | any name |

The census shares are measured. The crossover shares (a Hispanic man named
Travis, a surname that married in) are honest guesses, marked draft, for TUNING.

Surnames split HISPANIC / ASIAN / REST, as the 9/22 note said, because Black and
white American surnames are mostly the same pool.

**Nothing of his is deleted.** All 90 given names and 98 surnames sit in exactly one
pool (the gate checks). Added this round, so each pool has room:
- common first names: Rachel, Heather, Amber, Megan, Shannon, Dana, Brooke, Carly,
  Jodie, Tammy, Lacey, Corinne, Cody, Dustin, Shane, Kyle (the common pool had only
  8 women's names out of 39)
- Black first names: Tasha, Monique, Ebony
- Filipino first names and surnames: Arnel, Jun, Rowena, Marites, Danilo, Liza;
  Bautista, Pascual, Tolentino, Dizon, Manalo, Macaraeg. Filipinos are Las Vegas's
  biggest Asian group, and the pool had none.

**Measured under the bank: 36.3%** of names read Hispanic (census 33.4%; the few
extra points are the married-in surnames and the mixed families, which is what
natural looks like). The most common full name is under 1% of the valley.

## 5. TWENTY SAMPLE NAMES (the gate draws these and checks they are on this page)

Marisol Trejo, Ofelia Prieto, Nadia Rucker, Hazel Marchetti, Renata Sandoval,
Cody Tillman, Casimir Whitfield, Cyrus Aguilar, Wendell Escobar, Bishop Lozano,
Wyatt Okonkwo, Socorro Bonilla, Malachi Stanton, Jarvis Tran, Colton Hargrove,
Liza Pham, Guadalupe Larkin, Jamal Doyle, Esperanza Prieto, Renata Tillman

Before and after, in one line each:
- names that read Hispanic, the engine: 56.0% -> 36.3% (census 33.4%)
- names that read Hispanic, the post: 75% -> the bank's 36.3% once RUN TWO wires it
- white background: unmeasured (no background existed) -> 36% (census 35.6%)

## 6. THE SCHOOL LINES

[bb names] Battle Brothers ties a man's name to his background: each background
picks from its own name list (the northern list, and from Blazing Deserts a
southern list for the southern men), so where a man is from and what he is called
travel together, and nobody is half one list and half another. This is from the
game's own scripts; our wiki tarball has no page on it (searched: none of the
pages under "name" covers recruit names). The bank does the same: background
first, name second. BETTER THAN BATTLE BROTHERS: their lists are one per region
and a region is one people; ours is one city of five, so the crossover (a Hispanic
Travis, a married-in Delgado) is the part Battle Brothers never needed.

[ah] Analog horror leans on names that feel found, not made up: a roster on a
clipboard, a name on a mailbox, a missing-person flyer. A real name mix from the
real county is what makes those props land; a name that reads like a generator
picked it breaks the spell. No sound or pixel this round (the hold).

## 7. ROUTED

- RUN TWO: wire the hire post to the bank's rule (a recruit's background, then
  his first name), keyed the way the post already keys a name; Pancho and Nacho go.
  The post's 16 names also include 5 that read as women (Lupe, Yesenia, Marisol,
  Ofelia, Kiki) on Battle Brothers' backgrounds, which are men; that is RUN TWO's
  and PEOPLE's next look, not decided here.
- PEOPLE (this lane, when the hold lifts): the engine's generatedName draws by
  background with this bank; NAME_READS gains the 25 added names.
- TUNING [recruit odds]: the crossover shares in section 4 are guesses, for the
  one table.
- WORDS: no lines here; the player never speaks Spanglish (his first votes), and
  this bank carries names only.

No VOTE item, no demo change, no question.
