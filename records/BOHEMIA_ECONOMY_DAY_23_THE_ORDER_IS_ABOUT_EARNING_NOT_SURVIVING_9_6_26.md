# ECONOMY -- ROUND 23: THE ORDER IS ABOUT EARNING, NOT ABOUT SURVIVING
# (ECONOMY lane, 9/6/26. MODE: RESEARCH -- nothing here is implemented.)
# Question Q23 [who eats first], verbatim from VAMILY.md:
#   "When a household cannot feed everybody, who eats: real research on how
#    families ration under scarcity, in what order, and what that does to the
#    people who go without. Deliver the rule our households should follow when the
#    shelves empty."
# Named DAY 23 for the machine. A round is one VAMILY and is never called a day
# to Paolo (NO CALENDAR TALK, 9/5, LOCKED).
#
# THE LAWS THIS ROUND WORKS INSIDE: NO DAMAGE BEFORE THE DIAL, and his own 9/5
# four-verb ruling that there is no meter on the player's body -- "he is not
# hungry, THEY are." Both are correct and nothing here touches either.

## 0. THE HEADLINE

The game cannot ask this question yet, because there is nobody at the table.

> **`day:ate` TAKES ONE RESOURCE AT NIGHTFALL, WHOEVER IS DEPENDING ON YOU. A
> HOUSEHOLD OF TWO AND A HOUSEHOLD OF NINE COST EXACTLY THE SAME. There is no
> headcount anywhere in `upkeep(purse, verb, ref, day)`.**

And the real record says the rule households actually use is not the one I would
have written:

> **FAMILIES RATION BY ECONOMIC CONTRIBUTION, NOT BY NEED. The earner eats first,
> because if he cannot work tomorrow nobody eats at all.**

> **AND IT IS THE WRONG RULE, MEASURED AGAINST WHO ACTUALLY DIES. In famine, women
> outlive men by about 40%. The household feeds the person who would have lasted
> longest anyway.**

## 1. WHAT I MEASURED ON OUR OWN BUILD FIRST

### 1a. THE DAY EATS ONE, HOWEVER MANY ARE AT THE TABLE
```
a household of 1  -> the day took 1
a household of 2  -> the day took 1
a household of 5  -> the day took 1
a household of 9  -> the day took 1
```
`VERBS['day:ate']` is `{ currency:'resources', about:'the people who depend on you
ate' }` and `upkeep()` takes a purse, a verb, a ref and a day. **There is no
size.** So the sentence on the card is true and the arithmetic under it cannot be.

The valley knows how many people there are: `bohemia_housing.js` exposes
`residentsAt`, `capacity` and `valleyPeople`, and round 12 measured it live.
**Nothing in the eating path reads any of it.**

### 1b. AND RUNNING OUT IS DELIBERATELY NOT A FAILURE, WHICH IS RIGHT
The walked surface says so where it fires:
> *"Running out is not a failure state here, it is a refusal the ledger records --
> what it COSTS you is BB-OBLIGATION-BURN's row, not this one."*

That is the correct call and it is his law: NO DAMAGE BEFORE THE DIAL, and no
meter on the player's body. **The refusal is honest and the consequence is somebody
else's row, and that row is OPEN.**

### 1c. AND THE ROW IT POINTS AT ALREADY HAS THE RIGHT ANSWER IN IT
`BB-OBLIGATION-BURN` on the WORLD board, still `OPEN` as [neglect costs], is
already written and it is good:
> *"survival meters are the most reliably hated mechanic in the genre... the
> punishment is a person walking away, not a bar draining... You do not die of
> poverty in that game, YOU END UP ALONE."*
> *"A SOCIAL BURN IS NOT DAMAGE. Hunger needs a rate. 'Three people are waiting on
> you' needs nothing but the truth."*

**That last sentence is the whole design and it was written weeks ago.** What this
round adds is the part it does not have: WHO the three people are, and which of
them goes without.

## 2. THE REAL AISLE

### 2a. THE ORDER IS BY CONTRIBUTION, NOT BY NEED
The finding is consistent and it is uncomfortable:

> **Studies of household food distribution in Asia found allocation was based on
> ECONOMIC CONTRIBUTION rather than need.** Social norms favour the breadwinner
> because he is seen as producing the household's income, so he is fed to protect
> his earning.

The order that falls out of it, reported across low-income settings: **the earner,
then the children, then the adult women last -- including pregnant women.** In
rural Ethiopia adolescent girls are expected to eat after they have served the male
members of the family. Children are the one group commonly given priority even in
scarcity; adult women are commonly last.

**It is not cruelty and it is not ignorance.** It is a household making the same
calculation an economy makes: protect the thing that produces, because tomorrow
depends on it.

### 2b. AND IT IS THE WRONG CALCULATION, MEASURED
> **During famines, females generally have a mortality advantage over males.**

The physiology, modelled: a thirty-year-old woman at 70 kg would survive about
**144 days** without food against **95 days** for a man of the same age and weight,
from higher body fat and lower metabolism. Across observed mean body mass in 48
countries, **women would survive on average about 40% longer**, and the advantage
actually observed across famines ranges from 5% to 210%.

And the deaths do not land where the rule points:

> **The highest famine mortality is in the very young and the elderly.**

So the household feeds the earner, who is the person best able to work and the
person who would have lasted the shortest time; it feeds the children second, who
are among the two groups that die most; and it puts last the adults who can go
without longest. **The order is optimised for the household's output, not its
lives, and it costs lives to do it.**

### 2c. AND GOING WITHOUT DOES NOT UNDO
This is the part that matters most for a game about three generations.

Undernutrition in a child's first thousand days produces **stunting, which is
largely irreversible**: it cannot be treated, only prevented. The World Bank's
figure is that **a 1% loss in adult height from childhood stunting costs about
1.4% of adult productivity**, and stunting can cut individual earnings by **up to
7%.**

**Honest caveat, because it cuts against the cleaner story:** catch-up growth is
real. Around half of children stunted at age one are no longer stunted at age eight
even without intervention. So it is not a sentence, it is a heavy weight on the
scale.

> **A CHILD WHO WENT WITHOUT IN GENERATION ONE IS A SHORTER, POORER ADULT IN
> GENERATION TWO. That is not a metaphor for inheritance. It is inheritance, and it
> is measurable.**

## 3. THE GAMES AISLE, IN PLAIN WORDS
(No game he has not named enters the design; these are mechanics as mechanics.)

Our own canon settled this before I got here and both halves are already right:
- **SURVIVAL METERS ARE THE MOST RELIABLY HATED MECHANIC IN THE GENRE**, and the
  criticism is not that they are hard, it is that they are busywork.
- **THE PUNISHMENT SHOULD BE A PERSON WALKING AWAY, NOT A BAR DRAINING.**
- **ONE THING, NOT FIVE METERS, AND IT SCALES WITH SUCCESS** so a bigger operation
  is a bigger obligation.

Round 20 added the number that backs the third one: undoing somebody's work costs
36% of their output and severs their enjoyment of it. **A household you cannot feed
is the same shape: the loss that matters is the person, not the bar.**

## 4. *** THE FINDING THAT PROVES US WRONG ***

I came into this round expecting to deliver a need-based rule: the weakest eat
first, because that is what a decent household does and what a player would expect
to be rewarded for.

> **REAL HOUSEHOLDS DO THE OPPOSITE, ON PURPOSE, AND THEY ARE NOT WRONG TO. THEY
> FEED THE EARNER, BECAUSE A HOUSEHOLD THAT STOPS EARNING STOPS EATING. AND THE
> MEASURED RESULT IS THAT THEY PROTECT THE PERSON WHO NEEDED PROTECTING LEAST.**

That is a better mechanic than the one I was going to write, because it is a real
decision with a real cost on both sides and no correct answer:

- **Feed the earner** and the household keeps its income, and the people who go
  without are the ones the record says survive longest, and one of them is a child
  whose growth does not come back.
- **Feed by need** and you do the decent thing and you may have nobody able to work
  the next morning.

**And it needs no meter, no damage and no number he has to rule.** It is a name and
a consequence: somebody specific went without, and the valley remembers who.

## 5. THE RULE, DELIVERED

Mechanism only; every name, number and ruling stays his. Nothing here adds damage,
a hunger bar, or a meter on anybody's body.

**1. THE DAY SHOULD COST WHAT THE HOUSEHOLD IS.** Today it costs one, always.
`bohemia_housing.js` already answers `residentsAt` and `valleyPeople` and nothing
in the eating path asks. **Everything costs one is untouched: what changes is how
many ones, not what one is.**

**2. WHEN IT CANNOT BE PAID, THE ANSWER IS A NAME, NOT A FAILURE.** The purse
already refuses honestly and records it. What is missing is the sentence after:
**somebody specific went without, and it is a person the player can picture.**
BB-OBLIGATION-BURN's own line -- *"three people are waiting on you needs nothing
but the truth"* -- is exactly this, one step further on.

**3. THE ORDER IS BY CONTRIBUTION, AND THE PLAYER SHOULD FEEL THAT IT IS WRONG.**
Do not offer a menu of who eats. **Let the household do what real households do,
tell the player who went without, and let him decide whether to change it.** The
rule is realistic, the discomfort is the point, and REALISM FIRST says the
realistic option leads.

**4. GOING WITHOUT LEAVES A MARK THAT DOES NOT COME OFF.** This is DYNASTY's, not
ours, and it is the strongest inheritance hook in the whole study: a child who went
hungry in generation one is a smaller, poorer adult in generation two. Round 12's
housing and the century ledger are already the surfaces that carry across acts.

**5. AND NOBODY DIES OF IT.** NO DAMAGE BEFORE THE DIAL, and BB-OBLIGATION-BURN
already says the punishment is a person walking away. **The household that goes
without does not starve on screen. It leaves.**

## 6. REFUSED

- **A HUNGER METER, ON THE PLAYER OR ON ANYBODY.** His 9/5 ruling and NO DAMAGE
  BEFORE THE DIAL, and the genre's most reliably hated mechanic besides.
- **DEATH FROM GOING WITHOUT.** Same laws. The consequence is leaving, not dying.
- **A MENU OF WHO EATS.** Section 5.3. A screen that asks the player to rank people
  by worth is a different, worse game, and the real rule is that the household
  already decided.
- **MODELLING THE MORTALITY DIFFERENCE.** The 40% figure is why the contribution
  rule is tragic; it is not a stat to put in a character. Recorded as the reason,
  not proposed as a mechanic.
- **RULING WHAT A HOUSEHOLD EATS PER HEAD.** Numbers are contents and contents are
  his. Section 5.1 is the shape.
- **ANYTHING GRATUITOUS.** This subject is real and the record is grim; the design
  above is a name and a departure, and that is as far as it should go.
- **ANY IMPLEMENTATION.** MODE: RESEARCH.

## 7. ROUTED

**TO WORLD, on `day:ate` and on [neglect costs] BB-OBLIGATION-BURN:**
1. **THE DAY EATS ONE, WHOEVER IS AT THE TABLE.** A household of two and a
   household of nine cost the same, and the valley already knows the difference.
2. **THE ROW THE REFUSAL POINTS AT IS STILL OPEN**, and its own text already
   carries the right design. What this round adds is who goes without.

**TO LIFE + CITY, who own housing:**
3. **HOUSING KNOWS THE HEADCOUNT AND THE MEAL DOES NOT ASK.** `residentsAt` is
   live; the eating path does not call it. Same class as every other finding in
   this lane: built, correct, connected to nothing.

**TO DYNASTY, and this is the one worth taking:**
4. **A CHILD WHO WENT WITHOUT IS A POORER ADULT.** 1% of adult height is about 1.4%
   of adult productivity; stunting cuts earnings by up to 7% and is largely
   irreversible, with real but partial catch-up. **This is the most concrete
   inheritance mechanic this lane has found in twenty-three rounds**, and it is
   measured rather than invented.

**TO PEOPLE and WORDS:**
5. **THE PERSON WHO WENT WITHOUT NEEDS A NAME AND ONE LINE.** Not a statistic on a
   card. The whole cost of this system is whether the player can picture them.

**TO THE COORDINATOR, for Paolo:**
6. **[PENDING Paolo]** Who is at the player's table? The four verbs say "the people
   who depend on you" and the game has never said who they are. **Until somebody is
   named, nobody can go without.**

## 8. TEST MATERIAL
`banks/BOHEMIA_ECONOMY_TEST_LINES_9_5_26.md`, sections KKKKK through OOOOO. Every
line `draft:true`, in the bank, never in the game.

## 9. SOURCES

REAL AISLE
- Intrahousehold food allocation by economic contribution rather than need;
  breadwinner priority; children given priority even in scarcity while adult women
  including pregnant women come last; adolescent girls in rural Ethiopia eating
  after serving male family members --
  pmc.ncbi.nlm.nih.gov/articles/PMC11190659/ ;
  academic.oup.com/wbro/article-abstract/28/1/52/1685600 ;
  journals.sagepub.com/doi/pdf/10.1177/156482659801900111
- Famine mortality and the female survival advantage: a 30-year-old woman at 70 kg
  modelled at 144 days without food against 95 for a man, about 40% longer on
  average across 48 countries with an observed range of 5% to 210%, and the highest
  mortality falling on the very young and the elderly --
  pubmed.ncbi.nlm.nih.gov/23302114/ ;
  cambridge.org/core/journals/journal-of-biosocial-science/article/abs/sex-and-agerelated-mortality-profiles-during-famine-testing-the-body-fat-hypothesis/A409DECD25516115F91DCF7115ADDE62
- Stunting in the first 1000 days as largely irreversible; a 1% loss of adult
  height costing about 1.4% of productivity; earnings cut by up to 7%; and the
  honest counterweight that around half of children stunted at one are not stunted
  at eight -- exemplars.health/topics/stunting/what-is-childhood-stunting ;
  thelancet.com/journals/lanpub/article/PIIS2468-2667(17)30154-8/fulltext ;
  sciencedirect.com/science/article/pii/S216183132200326X ;
  thedocs.worldbank.org/en/doc/6a5a48b6a843ded1e609ac1c94009f47-0310062023/original/Reforms-for-a-Brighter-Future-Discussion-Note-1-Reducing-Child-Stunting.pdf

GAMES AISLE (mechanics only; no game he has not named enters the design)
- BOHEMIA_BACKLOG.md, BB-OBLIGATION-BURN: survival meters as the genre's most
  reliably hated mechanic and the criticism being busywork; the punishment being a
  person walking away rather than a bar draining; one thing rather than five
  meters, scaling with success; and a social burn not being damage
- records/BOHEMIA_ECONOMY_DAY_20 (the Sisyphus numbers), re-cited not re-derived

OUR OWN REPO (every figure measured this round)
- engine/bohemia_purse.js (VERBS, upkeep and its signature),
  engine/bohemia_housing.js (residentsAt, capacity, valleyPeople)
- slices/BOHEMIA_CITY_WORLD.html: onNightfall() and the single day:ate post, with
  its own comment routing the cost to BB-OBLIGATION-BURN
- VAMILY.md WORLD section: [neglect costs] BB-OBLIGATION-BURN still OPEN
- records/BOHEMIA_ECONOMY_DAY_12 (housing measured live), DAY_15 (buying delivers
  nothing, so the resource never arrives to be eaten) -- re-cited, not re-derived

## 10. GATE STATE THIS ROUND

Green, run this round: economy 13/0, payday 38/0, purse 28/0, attempt 15/0,
canon rot 13/0, demo blockers 22/0, language 81/0, **housing 18/0.**

`housing_gate` is 18 for 18 over the module that knows exactly how many people live
in what the player built, while the meal that feeds them has never asked. Every
assertion in it is true. It checks that capacity grows when you build, that
residents are capped by the valley, that housing does not create people. **Nothing
asks whether anything downstream reads the number**, because that is a question
about two modules rather than one.

Eighth round running where a green suite and a real finding are both correct at
once. The pattern this lane named in round 21 and refined in 22 holds unchanged:

> **THESE GATES CHECK THAT A PART DOES WHAT IT SAYS. NOTHING CHECKS THAT TWO PARTS
> AGREE, THAT A PART KEEPS WORKING FOR AS LONG AS THE GAME LASTS, THAT IT IS THE
> RIGHT PART TO HAVE, OR THAT THE PARTS FORM A LOOP THAT CLOSES.**

Not this lane's to fix, and not a criticism of any gate.
