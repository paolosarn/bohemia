# DAY 37 — A SMALL GROUP CANNOT CARRY ONE OF ITS OWN.

ECONOMY lane, VAMILY row `[carry cost]` Q37. MODE: RESEARCH — DO NOT IMPLEMENT.
Round 37. Claimed 9/13/26 `economy-vamily-knxaeh`, commit 81b794a.

> **THE ROW, VERBATIM:** "What it costs a small group to carry one of its own: real
> material on evacuating an injured person on foot (how far, how many, how fast, what
> gets left behind), and how the best games have priced a downed companion without
> killing them. Deliver the slow-down and the food cost for PEOPLE [lock them]."

---

## 0. THE FINDING THAT PROVES US WRONG

The row asks for a **slow-down**. That word assumes the group carries the person and
walks less far. The real material says something harder.

**Wilderness evacuation planning calls for three teams of six to eight people rotating
through a litter carry** — eighteen to twenty-four bodies — and the working rule is
**six well-rested bearers for every one mile**, at **one to two hours per mile**. In
ideal conditions a litter makes about **one mile an hour with a team of fifteen to
twenty.**

Bohemia's company is not eighteen people. It is two, three, four.

**A party of four does not have six bearers, so a party of four cannot make one mile.**
That is not a slow-down. It is a wall, and it is the whole answer.

The physiology agrees and is measured rather than modelled: a **four-person team
sustains a continuous carry for 16.9 minutes**; a two-person team, 12.3. Grip strength
after a carry falls **20 to 42 percent**. By carry method the sustained times are 2.7
minutes by hand, 14.5 over the shoulder, 25.4 hip-and-shoulder.

So the honest deliverable is not "you walk at half speed." It is **you walk about a
kilometre and the day is over**, and a design that hands a party of four a stretcher is
a design that made up a number the record refuses.

---

## 1. WHAT WE HAVE TODAY (measured before researching)

**The promise is built and the price is not.** `engine/bohemia_down.js` shipped 9/12
from PEOPLE, and it is a good module: `fall()` has exactly one outcome, `heal()` always
finishes, and there is deliberately no way to make a kept person dead. Three lengths,
every one traced to Paolo's own words:

    HURT.knocked  7 days    'KNOCKED ABOUT'            draft:true
    HURT.leg      90 days   'A LEG THAT NEEDS A SEASON'
    HURT.hand     365 days  'A HAND THAT NEEDS A YEAR'

Exports: `HURT, KINDS, fall, isDown, daysLeft, say`. **There is no carry, no slow-down,
no food cost and no weight anywhere in it.** A person falls, is hurt for a long time,
and comes back, and between those two facts they cost nothing at all.

**And nothing else in the game carries anybody.** `grep` across all of `engine/` for
stretcher, litter, carrying a body, carrying a wounded or downed person, or slowing a
party: **zero hits.** The gap the row names is total, not partial.

**The company is computed, not a roster.** `engine/bohemia_company.js` (QUESTS, 9/13)
derives membership every time from three ledgers the world already keeps — a bond, a
witness, a roof — and says in its own header why: *"a roster is a list somebody has to
maintain, and the moment it exists it can disagree with the world."* There is no size
cap, because there is no list. That matters here: **whatever this round delivers has to
work for a party of two, because the game will hand you one.**

**The movement numbers, re-read rather than remembered**
(`records/BOHEMIA_A_STREET_THAT_IS_NOT_FASTER_9_5_26.md`):

| | |
|---|---|
| broken ground | 0.084 min/cell — about nine metres a minute |
| pavement | 0.042 min/cell — twice the speed |
| a sixteen-hour day, off the roads | **8.6 km** |
| a sixteen-hour day, on the roads | **17.1 km** |
| the valley, corner to corner | **9.2 km** |

So an ordinary day off the roads is **0.93 of a valley**, and on the roads **1.86**.

**The food number:** `GOODS.food = {unit:'ration', need:1, base:1.5, note:'1 ration =
~2000 kcal'}`. **Flat, per person, per day, regardless of what that person did.**

---

## 2. THE REAL AISLE

### HOW MANY, AND HOW FAR

The planning figures are consistent across wilderness medicine and military practice
and they are all much larger than a game party:

- **Three teams of six to eight, rotating,** for a single litter evacuation.
- **Six well-rested bearers per mile.** One to two hours per mile.
- **One mile an hour in ideal conditions, with fifteen to twenty people.**
- Military bearers work **in teams of four to six**; two men only in good conditions,
  and then for short distances.
- Manual carries without a litter run **50 to 300 metres** depending on method. The arms
  carry is good for **up to 50 metres**. The two-man fore-and-aft is the preferred
  two-man carry for distance because it is less tiring, which is the whole reason it
  wins.

### WHAT IT DOES TO THE PEOPLE DOING IT

- **Four-person team: 16.9 minutes** of continuous carry. **Two-person team: 12.3.**
  The bigger team lasted longer *and* worked at lower intensity.
- Sustained times by method: **hand 2.7 min, shoulder 14.5, hip-shoulder 25.4, load-
  carrying-equipment system 21.7.** The hand carry, the one a panicking group reaches
  for first, is worth under three minutes.
- **Grip strength falls 20 to 42 percent** after an exhausting carry. The people who put
  the stretcher down cannot then hold anything.
- For scale, professional mountain rescuers walk at **3.6 km/h** carrying packs. A full
  litter operation makes **1.6 km/h with twenty people.** Carrying somebody is less than
  half the speed of walking with a heavy load, and it needs five times the people.

### WHAT GETS LEFT BEHIND (the row's fourth question, and the best material in the round)

The retreat from Shenkursk, January 1919, forty miles over three nights at thirty to
forty below:

**The hundred most seriously wounded left FIRST**, strapped to sleds and sent down the
road ahead of everybody, pulled by horses. And the healthy men marching behind them
**discarded their own boots** — the leather soles were too slippery on the ice — and
finished the retreat in their stocking feet, which cost a great many frozen toes.

That is the answer, and it is not the answer a designer would guess. **The group does
not slow down to the wounded man's pace. It reorders itself around him and pays in
things it abandons.** The wounded went first, on the only transport there was, and the
price was paid by the people who were fine, in their own kit, afterwards.

### AND THE ONE HONEST CHECK ON OUR OWN FOOD TABLE

Walking a level surface is about **3.5 METs**; carrying heavy loads is about **8**. One
MET is roughly one kcal per kilogram per hour. For a 70 kg person over our own
sixteen-hour day:

    walking   3.5 METs -> 3,920 kcal = 1.96 rations
    carrying  8   METs -> 8,960 kcal = 4.48 rations
    ratio 2.29x

**Which says our flat one-ration day feeds a person about half of what sixteen hours of
walking actually burns.** Not a bug and not a request: a valley whose people are quietly
on half rations is exactly right for this game, and it is worth having written down
once, with the arithmetic, rather than discovered later as a surprise.

---

## 3. THE GAMES AISLE

**The campaign layer is the reference with standing here, and it did not price the
carry at all.** Its downed man is not carried and is not dead. He goes in **reserve** —
he travels with the company, he is out of the fight, and what you lose is what he was
giving you.

The shape, in its own terms:

- **Light injuries heal in 1 to 3 days, heavier ones 5 to 7.** Short lengths, many of
  them, not one long punishment.
- **Two ways to heal.** In the field, medicine is consumed little by little over time,
  it heals faster while camped, and **there is a chance the wound turns bad while you
  are moving.** Or at a temple, where recovery is faster and safer and there is no
  gangrene risk.
- **"Most injuries reduce combat power significantly, so it is better to place them in
  reserve until the injuries are resolved."** The player's own optimal play is to bench
  him. The game never has to force it.

The pattern worth taking, and it lines up exactly with what the coordinator already
armed `[lock them]` with on 9/12: **the weight of a fall is what you lose while they are
down, and moving with them costs more than being somewhere with them.** Not a stretcher.
Not a pace penalty. A contribution that is gone, and a journey that is worse than a
camp.

No game he has not named entered this design.

---

## 4. THE DELIVERABLE FOR PEOPLE `[lock them]`

Three numbers, each with its premise, none of them typed from taste.

### THE SLOW-DOWN: **8x, AND IT IS A DISTANCE CAP, NOT A PACE**

From six fresh bearers per mile, against our own 8.6 km day off the roads:

| party | km carried before everybody is spent | share of a day | slow-down |
|---|---|---|---|
| 2 | 0.54 km | 6% | **16x** |
| 3 | 0.80 km | 9% | **11x** |
| **4** | **1.07 km** | **12%** | **8x** |
| 6 | 1.61 km | 19% | 5x |
| 8 | 2.15 km | 25% | 4x |

And the continuous-carry wall says the same thing from the other side: 16.9 minutes at
litter pace is **0.45 km, 5% of a day.**

**Ship it as a cap, not a multiplier.** "You move at one eighth speed" invites a player
to shrug and walk anyway. **"You got them one kilometre and that was the day"** is the
true sentence and the one that makes him think. The valley is 9.2 km corner to corner,
so **a party of four carrying one of their own cannot cross it in a week.**

Roads do not rescue you. On pavement the ordinary day doubles to 17.1 km, so the
carrying party is **16x** behind instead of 8x. A road you cannot use at speed is worse
than no road, which is the correct and unpleasant feeling.

### THE FOOD COST: **ONE MORE RATION, PER BEARER, FOR THE DAY**

The METs ratio is 2.29x. Rounded it is two, and **EVERYTHING COSTS ONE (8/15) makes the
increment exactly one.** The law picks the number and the physiology says it is the right
one, which is the only order those two should ever go in.

    a normal day       5 people, 5 rations, 8.6 km
    a day carrying one 5 people, 9 rations, 1.07 km   (4 bearers at two, the downed at one)
                       = 1.8x the food for 12% of the distance
                       = *** 14x the food per kilometre ***

**And the downed person still eats his full one and produces nothing.** That costs
nothing new to build, because our need table is already flat per person. It is the
cheapest true thing in this round.

### THE THIRD NUMBER, WHICH IS THE ACTUAL MECHANIC: **YOU DO NOT HAVE TO CARRY THEM**

Both aisles arrive here from opposite ends. The real record says a party of four
**cannot** carry somebody anywhere useful. The campaign layer says the fun version was
never the stretcher: it was the reserve, the short healing lengths, and **moving being
worse than staying.**

So the shape `[lock them]` should build:

1. **Leave them somewhere.** Shenkursk's answer: the wounded go first, to the nearest
   place that is not here, and the group pays for it in what it abandons.
2. **Or take them with you and pay the cap.** One kilometre, double food for every
   bearer, and the day is gone.
3. **And moving is worse than being still.** The campaign layer's field-versus-temple
   split, in our own terms: healing runs while you camp and goes badly on the road.

Which makes **carrying a real choice instead of a tax**, and it means a locked person
who falls costs you a day, a kilometre, double food and their whole contribution for
seven days, ninety, or three hundred and sixty-five — without one hair of NO DAMAGE
BEFORE THE DIAL being touched. Nobody dies. It just costs, the way it really costs.

---

## 5. WHAT THIS ROUND DID NOT DECIDE

- **Whether a party of two can carry at all.** 0.54 km says almost not. Whether the game
  refuses the verb outright at two people is a feel call on his surface, not mine.
- **What "somewhere" is** when you leave them. A building, a town, a person. PEOPLE and
  LIFE+CITY cast that.
- **Whether the infection-while-moving idea belongs here.** It is the campaign layer's
  and it is good, and it is a new failure state, which is exactly the kind of thing this
  lane proposes and does not smuggle in.
- **The 1-3 and 5-7 day lengths.** Ours are 7 / 90 / 365 and they are HIS, from his own
  sentence. The short foreign lengths are named as contrast, never as a correction.
- **Changing the ration.** Section 2 measures that our day feeds about half of what it
  burns. Written down, not touched.

---

## 6. ROUTED

- **PEOPLE `[lock them]`** — the three numbers in section 4. The slow-down is **a 1 km
  cap for a party of four, not a pace multiplier**; the food is **one extra ration per
  bearer**; and the mechanic the record actually supports is **not carrying them**.
- **PEOPLE `[down not dead]`** — `bohemia_down.js` is a good module with no price in it.
  Everything above attaches to `fall()` and nothing above needs a new state.
- **COMBAT `[downed body]`** — their row already says the body can be reached and
  carried. The carry is where these numbers land on the board.
- **WORLD** — the 8x and 16x are against the movement table, so if pavement or the
  sixteen-hour day ever move, these move with them. They are ratios on purpose.
- **QUESTS** — "the wounded went first and the healthy walked home in their socks" is a
  first ask that needs no invention. It is the oldest shape there is.
- **COORDINATOR** — nothing blocking. One premise in the pendings: our ration feeds about
  half a walking day, and that is probably right for this game.

---

## 7. THE GATE NOTE

**Pre-push pass** (the gates that read the files in this diff): economy, purse, payday,
attempt, canon rot, demo blockers, language. Results in the commit.

**Full suite unmeasured since 765e8c5** — front-page rule 13 (coordinator 9/13): THE
SUITE LINE has not been posted yet, 331 of 603 gates never ran inside a 45-minute
budget, and the honest sentence until PLUMBER posts the first line is exactly that one.
No red on this diff is mine because this diff touches no gate's inputs but records,
the bank and the board.

**And the same project-level hole, round 22 of naming it.** These gates check that a part
does what it says. Nothing checks that two parts agree, that a part keeps working for as
long as the game lasts, that it is the right part to have, or that the parts form a loop
that closes.

This round's instance: **`bohemia_down.js` and the movement system have never met.** A
person can fall and the party walks 8.6 km that day exactly as if nobody had. Both parts
are correct on their own and there is no check anywhere that a downed person is supposed
to change what the group can do — because "supposed to" is not a thing any gate here can
express.

## 8. THE PROBE NOTE

Nothing broke this round, which is worth one line rather than silence: every number above
came out of `bohemia_down.js`, `bohemia_economy.js`, `bohemia_company.js` and the 9/5
movement record on the first read, because rounds 31, 34 and 36 already paid for the
signatures. The kept-mistakes list in DAY 36 section 9 is still the live one.

---

*ECONOMY round 37. Research only. Nothing in the game changed.*
