# BOHEMIA ADDENDUM — THE MOBILE CAMP (Paolo 7/27/26, LOCKED)

Paolo's words, verbatim, after playing the Valheim comfort-loop model:

> "awesome so i am in love with the mobile camp idea. idk about how it impacts hp
> points but i could see it impact hp regen and stamina points and stamina regen
> potentially. and it would be on a timer it would be set for how many tiles you
> move and shit. considering it takes you a full day to walk across the map back
> and forth. and im not super sure on the food crafting system. like i thought it
> would just suck up from the resources pool you know. again water,food,and build
> shit are clumped into one category essentially. so i think it would suck from
> that and loot in the world would add to that you know. i liked the idea of
> chilling at camp and then the option of sleeping and shit. i think it should
> impact hp so if people dont want to give a fuck about that its okay too. but we
> want to reawrd them with hp stamina regen and more stamina points. compared to
> combat style of rogue fable 4 it would be like plus 1 or 2 or 3 stamina points
> type shit. a camp where u can apply a bandage. a place a companion can pull out
> a bullet from your body. apply gauze. i liked this valheim shit alot."

This is the constitution of Bohemia's survival system. It is a VERDICT (the
Valheim model is APPROVED as a reference) and a set of RULINGS in one message.

## THE LAW

1. **THE CAMP IS MOBILE.** "i am in love with the mobile camp idea." Bohemia's
   camp is not a base you return to, it is a thing you CARRY and SET DOWN. That
   makes where you camp a decision and makes what you brought to camp with you a
   second decision. Nothing in the survival system may assume a fixed home.

2. **THE BUFF TIMER IS MEASURED IN TILES MOVED, NOT IN SECONDS.** "it would be
   on a timer it would be set for how many tiles you move and shit." This is the
   biggest mechanical ruling in the message and it is a perfect fit with
   `laws/BOHEMIA_ADDENDUM_TIME_IS_SPENT_BY_ACTIONS_7_26_26.md`: the world moves
   when you spend an action, so a buff burns down when you SPEND MOVEMENT, not
   while you stand still reading a menu. Valheim's 480-seconds-plus-60-per-level
   becomes N TILES plus M TILES per comfort level. A clock that runs while the
   player is idle is forbidden here.

3. **THE SCALE: A FULL DAY IS ACROSS THE MAP AND BACK.** "considering it takes
   you a full day to walk across the map back and forth." So half a day is one
   crossing, and any buff duration in tiles is judged against that.

4. **ONE CLUMPED RESOURCE POOL, AND EATING DRAWS FROM IT.** "im not super sure on
   the food crafting system. like i thought it would just suck up from the
   resources pool... water, food, and build shit are clumped into one category
   essentially. so i think it would suck from that and loot in the world would add
   to that." So:
   - there is NO food-crafting tree, NO recipes, and NO individual food items;
   - water + food + building material are ONE category;
   - a camp action SPENDS from that pool;
   - looting the world ADDS to that pool.
   This also settles the shape of clause (a) of
   `laws/BOHEMIA_ADDENDUM_LOOT_IS_RESOURCES_FAST_7_26_26.md`: the resource kinds
   are very few and this one is a clump, not a shopping list.

5. **THE REWARD IS REGEN AND STAMINA, NOT A BIG HEALTH BAR.** "i could see it
   impact hp regen and stamina points and stamina regen... we want to reward them
   with hp stamina regen and more stamina points." The three payoffs are:
   **health regen, stamina regen, and MORE STAMINA POINTS.**

6. **MAX HEALTH MAY MOVE, AND IGNORING THE CAMP MUST STAY PLAYABLE.** "i think it
   should impact hp so if people dont want to give a fuck about that its okay
   too." A player who never camps is WEAKER, never blocked. Nothing in the
   survival system may become mandatory.

7. **THE NUMBERS ARE TINY — ROGUE FABLE IV SCALE, NOT VALHEIM SCALE.**
   "compared to combat style of rogue fable 4 it would be like plus 1 or 2 or 3
   stamina points type shit." So a good camp is **+1, +2 or +3 stamina points**.
   Valheim's 25 health growing to 148 is the WRONG register for us and no Bohemia
   system may inherit it. Small integers a player can hold in their head.

8. **THE CAMP IS ALSO THE MEDICAL STATION.** "a camp where u can apply a bandage.
   a place a companion can pull out a bullet from your body. apply gauze." So camp
   actions include FIRST AID, and a COMPANION can perform a treatment ON you that
   you cannot do to yourself. That is the first ruled mechanical role for a
   companion.

9. **CHILL, AND THEN SLEEP AS AN OPTION.** "i liked the idea of chilling at camp
   and then the option of sleeping and shit." Two distinct camp states: the short
   one you take because you are passing through, and SLEEP as a bigger, optional
   commitment. Sleep is one of the spent blocks named in
   `laws/BOHEMIA_ADDENDUM_THE_MOMENT_IS_ANY_SPENT_BLOCK_7_26_26.md`.

10. **COMFORT IS APPROVED AS A MECHANISM.** "i liked this valheim shit alot" plus
    "i am in love with the mobile camp idea" is an APPROVE on the loop he played:
    what is around your rest spot extends how long the buff lasts. Ported to
    clauses 1 and 2, that means: what you CARRIED and SET DOWN extends how many
    TILES the buff survives.

## WHAT THIS KILLS

- **Food as items, and any food-crafting tree.** Dead before it existed. No
  recipes, no cooking stations, no per-food stat lines in Bohemia.
- **Valheim's stat magnitudes.** 25 -> 148 health is out of register. Anything
  that inherits it is wrong by clause 7.
- **Real-time buff timers.** A duration in seconds is illegal by clause 2.
- **A fixed home base as the survival anchor.** Clause 1.

## STILL [PENDING Paolo] — AND NOBODY INVENTS THESE

a) **THE POOL'S NAME AND WHETHER IT IS LITERALLY ONE NUMBER.** He said water, food
   and build material are "clumped into one category essentially". One counter, or
   one category holding two or three things, is his call.
b) **HOW MANY TILES** a rest is worth, and how many tiles each comfort level adds.
c) **HOW MUCH SUPPLY** each camp action spends (eat, bandage, gauze, the bullet).
d) **WHETHER MAX HEALTH MOVES AT ALL** — he said "idk" and then "i think it
   should", which is a lean, not a ruling. It stays a switch until he sets it.
e) **THE EXACT STAMINA NUMBERS** inside his +1/+2/+3 range, and the base pools.
f) **WHAT LIMITS HOW MUCH CAMP YOU CAN CARRY.** Clause 1 implies a limit; he has
   not named one.
g) **THE CAMP ITEM LIST.** What the carried comfort things actually are. He named
   none for Bohemia; the Valheim names (rug, hearth, banner) are theirs, not ours.

## GATE

`gates/camp_dial_gate.js`, written the same turn, because a law without a machine
gate is not enforced. It asserts the mechanical clauses directly against
`slices/lab/BOHEMIA_LAB_MOBILE_CAMP_DIAL_7_27_26.html`:
- clause 2: the buff burns on TILES and standing still for any length of time
  never reduces it;
- clause 4: one pool, no food items anywhere, every camp action spends from it,
  and looting adds to it;
- clause 5: the payoffs are health regen, stamina regen and stamina points;
- clause 6: with the camp never used the game is still playable and nothing is
  blocked;
- clause 7: every stat magnitude is a small integer and no buff exceeds +3
  stamina points;
- clause 8: bandage, gauze and a COMPANION-ONLY bullet removal all exist;
- clause 9: chill and sleep are distinct;
- and the [PENDING] values are DIALS, not defaults dressed up as decisions — the
  gate fails if a pending value is hardcoded where he cannot reach it.

---

# AMENDED THE SAME DAY — CLAUSES 11 TO 15 (Paolo 7/27/26, second message, LOCKED)

His words, verbatim:

> "YEAH LIKE SETTING UP CAMP TAKES TIME MIND U IN ACT 1 ITS PROBABLY WHEN U WILL
> NEED TO CAMP THE MOST, WHEN THEYRE MAYBE ISNT A LOT OF FRIENLY OPTIONS OF HOTELS
> OR FRIENDLY FACTION HOUSING UNLESS U HOOF IT TO A HOMIES HOUSE
>
> ACT 2 A LITTLE LESS
>
> ACT 3 MORE HOTEL AND FRIENDLY LOCATIONS AVIALABLE WHERE U CAN JUST HANG OUT TYPE
> SHIT
>
> I LIKED IT WHEN WE COMBINE SOME OF THESE VALUES WITH THE FOOD EATING VALUES FROM
> THE VALHEIM REFERENCE SHIT THAT WILL BE COOL. OBIOUSLY HANGING OUT TAKES UP TIME
> AS WELL. TIME PASSES BY REASONABLE AMOUNTS WHEN U PRESS THESE BUTTONS. ALSO IDK
> HOW IT SHOULD WORK DOWN THE LINE BUT IF WE GET SHOT IN COMBAT DO WE ALWAYS NEED
> TO PREVENT BLOOD LOSS? LIKE AFTER EVERY DUNGEON OR RAIDER OR ENEMY FACTION AREA
> WE CLEAR AND
>
> IM NOT SURE HOW MANY TILES YOU WALK OR HOW MUCH INGAME TIME PASSES BEFORE THE
> THE BUFFS RUN OUT THOUGH WELL WORK MORE ON THAT!"

## 11. SETTING UP CAMP COSTS TIME

"SETTING UP CAMP TAKES TIME." So the camp is not free to deploy. Setting it down
is a SPENT BLOCK in the sense of
`laws/BOHEMIA_ADDENDUM_THE_MOMENT_IS_ANY_SPENT_BLOCK_7_26_26.md`, and that cost is
what makes "do I camp here or push on" a decision instead of a habit.

## 12. EVERY CAMP BUTTON SPENDS IN-GAME TIME, IN REASONABLE AMOUNTS

"OBIOUSLY HANGING OUT TAKES UP TIME AS WELL. TIME PASSES BY REASONABLE AMOUNTS
WHEN U PRESS THESE BUTTONS." So there are now TWO clocks and they are not the same
clock:

- **BUFF DURATION IS MEASURED IN TILES** (clause 2). It burns when you move.
- **CAMP ACTIONS SPEND IN-GAME TIME.** Hanging out, sleeping, eating, patching
  yourself up — each one moves the world's clock by a reasonable amount.

Both are true at once and neither replaces the other. Standing still still never
burns a buff; pressing a button still costs the day.

## 13. THE ACT SCARCITY CURVE — THE CAMP MATTERS MOST IN ACT 1

"IN ACT 1 ITS PROBABLY WHEN U WILL NEED TO CAMP THE MOST, WHEN THEYRE MAYBE ISNT A
LOT OF FRIENLY OPTIONS OF HOTELS OR FRIENDLY FACTION HOUSING UNLESS U HOOF IT TO A
HOMIES HOUSE. ACT 2 A LITTLE LESS. ACT 3 MORE HOTEL AND FRIENDLY LOCATIONS
AVIALABLE WHERE U CAN JUST HANG OUT TYPE SHIT."

- **ACT 1:** almost no friendly shelter. A homie's house exists but you have to
  HOOF IT there. The mobile camp is the answer, and it is needed most.
- **ACT 2:** a little more friendly shelter, so a little less camping.
- **ACT 3:** hotels and friendly locations are available and you can just hang out.

So the camp is an ACT-1 SURVIVAL TOOL THAT BECOMES OPTIONAL, and the curve is
FRIENDLY SHELTER DENSITY, not a nerf to the camp. This is also the first ruled
mechanical difference between the three acts, and it means the same three camp
verbs (hang out / sleep / patch up) must work in BOTH a camp you set down and a
friendly location you walk into — the difference being that a real roof costs no
setup time and is more comfortable.

## 14. THE CAMP BUFF AND THE EATING BUFF COMBINE

"I LIKED IT WHEN WE COMBINE SOME OF THESE VALUES WITH THE FOOD EATING VALUES FROM
THE VALHEIM REFERENCE SHIT THAT WILL BE COOL."

So eating is not just a top-up, it is its own buff that STACKS with the camp buff,
in the shape Valheim's food had (a lasting bonus with a duration that decays) —
but obeying clause 4 (it comes out of the ONE POOL, there are no food items) and
clause 2 (its duration is in TILES) and clause 7 (the magnitudes are tiny).
Camp buff + meal buff, added, both burning down as you walk.

## 15. HIS OPEN QUESTION, ASKED OF ME, AND IT IS STILL HIS TO ANSWER

"IDK HOW IT SHOULD WORK DOWN THE LINE BUT IF WE GET SHOT IN COMBAT DO WE ALWAYS
NEED TO PREVENT BLOOD LOSS? LIKE AFTER EVERY DUNGEON OR RAIDER OR ENEMY FACTION
AREA WE CLEAR AND..."

He is naming the CHORE RISK: if every cleared area ends in mandatory first aid,
the medical system becomes a tax you pay for playing well. That is a real danger
and it is the same failure that killed the Zomboid loot page.

Three policies are implemented as a DIAL so he can feel the difference rather than
read about it, and the recommendation is written into
`records/BOHEMIA_BLOOD_LOSS_OPTIONS_7_27_26.md`:
  0 ALWAYS      every hit that bleeds must be treated or it keeps costing health
  1 SELF-LIMITING  bleeding stops on its own after a while; treating it early
                   saves you the health it would have cost
  2 ONLY SERIOUS   ordinary fights do not leave a bleed at all; only a real wound
                   (the bullet) needs the camp
STILL [PENDING Paolo]. Nobody picks this for him.

## AND HE PARKED THE NUMBERS HIMSELF

"IM NOT SURE HOW MANY TILES YOU WALK OR HOW MUCH INGAME TIME PASSES BEFORE THE
BUFFS RUN OUT THOUGH WELL WORK MORE ON THAT!"

So clause (b) stays open BY HIS OWN INSTRUCTION, and now so does the time side.
Nothing in this repo may harden a tile count or a time cost into a default while
that sentence stands.

## NEW [PENDING Paolo] FROM THIS MESSAGE

h) **HOW LONG SETTING UP CAMP TAKES** (clause 11).
i) **THE TIME COST OF EVERY CAMP BUTTON** (clause 12) — "reasonable amounts" is
   the brief, not a number.
j) **HOW MUCH TIME A TILE OF WALKING COSTS.** Derivable from his own scale ruling
   (across the map and back is a full day) but he has not said it, so it is a dial
   that SHOWS its derivation.
k) **HOW MANY FRIENDLY SHELTERS EXIST PER ACT** (clause 13), and what they are
   called.
l) **THE MEAL BUFF'S SIZE AND TILE DURATION** (clause 14).
m) **THE BLOOD-LOSS POLICY** (clause 15).

## GATE, AMENDED

`gates/camp_dial_gate.js` gains the clauses above: setting up camp must cost time;
every camp action must move the clock; the ACT dial must change how much friendly
shelter exists (and act 1 must have the least); a friendly location must give the
same three verbs with no setup cost; the meal buff must stack with the camp buff
and burn in tiles; and all three blood-loss policies must be reachable and behave
differently. And the standing rule holds: every value above is a DIAL, because he
said in the same breath that he has not decided the numbers.

---

# AMENDED AGAIN 7/27/26 — CLAUSE 16: THE SCALE IS SETTLED, AND A REST IS 75% OF VEGAS

His words, verbatim:

> "How many steps would it take in our scale of game to walk across Vegas with that
> math you want you need one rest to walk across 75% of Las Vegas"

## 16. ONE REST CARRIES YOU 75% OF THE WAY ACROSS LAS VEGAS

This answers clause (b), which had been open since the law was written, and it
answers it in a UNIT rather than a number — which is why it survives any later
change to the map.

**THE ARITHMETIC, ALL OF IT FROM OUR OWN FILES. Nothing here is invented:**

| what | value | where it comes from |
|---|---|---|
| cells across the valley | 96 | `engine/bohemia_overmap.js:20` — `OVER_N=96` |
| walkable tiles per cell | 128 | `engine/bohemia_world.js:613` — `var T = 128` |
| metres per walkable tile | 0.75 | `engine/bohemia_overmap.js:20` — `CELL_M=0.75`, the SLOT SCALE LAW |
| **steps across Vegas** | **12,288** | 96 x 128, and `laws/BOHEMIA_GDD_v5.md:37` says the fine layer is 12288 x 12288 |
| metres across Vegas | 9,216 m = 9.2 km | 12,288 x 0.75 |
| seconds per step | 3.52 s | clause 3: a day is across AND back, so 86,400 / 24,576 |
| hours for one crossing | 12 h | 12,288 x 3.52 s |

**SO: ACROSS VEGAS IS 12,288 STEPS.** And his ruling makes one rest worth:

> **9,216 steps = 6.9 km = 9 hours of walking = 75% of the city.**

Which lands exactly where he aimed it: **you cannot quite cross Las Vegas on one
rest.** You come up 3,072 steps short and you have to stop once. That is the whole
design in one number, and it is now the default on the dial page rather than a
guess.

## WHAT CLAUSE 16 KILLS

- **Toy-scale numbers.** The dial page previously had `REST_TILES` capped at 120
  and `TILE_MINUTES` at 18, both calibrated to that page's little test map. At the
  real map size a step is 3.5 SECONDS, not 18 minutes — the old default was 300x
  too slow, and it was wrong the moment it met the real valley. It is corrected and
  the mistake is written down here rather than quietly patched.
- **Absolute tile counts as the unit for a rest.** The unit is now PERCENT OF A
  CROSSING, because that is the unit he actually thinks in, and it stays true if
  the map is ever rescaled.

## CALLED ON HIS DELEGATION — 75% IS THE CAMP YOU ACTUALLY BUILD

The open question was whether "one rest" meant a bare tent or a camp with the kit
out. He answered it by handing it back: **"Do what you think is best."** So it is
called, and it is called as MY decision under his delegation, reversible by one
word from him:

**75% IS THE DRESSED CAMP.** A bare tent is 60% of a crossing; each thing you
carried and set down adds 5%; the full kit of three brings it to exactly **75% =
9,216 steps = his number.**

Three reasons, and the third is the one that decided it:
1. **Otherwise comfort is decoration.** If a bare tent already carried you 75% of
   the way across Vegas, the kit would be worth a rounding error — and comfort is
   the mechanism he said he was in love with.
2. **It makes clause 1 mean something.** The camp is MOBILE, so "what did I choose
   to carry" is supposed to be a decision. It only is one if the kit is what earns
   the crossing.
3. **It protects HIS OWN design target at the top of the range.** He aimed at "one
   rest gets you 75% of the way", i.e. you must stop once to cross the city. If 75%
   were the BARE camp, a dressed one would reach 90% and very nearly cross —
   weakening the exact thing he was aiming at. With 75% as the DRESSED number, the
   target holds for the BEST rest in the game: even a fully kitted camp comes up
   3,072 steps short. The gate asserts that at the top of the range now, not the
   bottom.

Gated: `S5` pins 60 + 3 x 5 = 75, `S6` pins that to 9,216 steps, `S7` proves a bare
tent is strictly worse, and `S8` proves even the dressed camp cannot cross.

Also still open, unchanged: clauses (a), (c), (d), (e), (f), (g), (i), (k), (l),
(m). And his own instruction still stands — "WELL WORK MORE ON THAT" — so no other
tile or time number may harden into a default.

## GATE, AMENDED AGAIN

`gates/camp_dial_gate.js` grows the S-series, which pins the scale to the engine so
the answer can never drift from the world the game actually builds: 96 cells x 128
tiles = 12,288 steps; 0.75 m each; 9.2 km; 3.52 s a step; a rest is 75% of that and
measures back as 75%; ONE BARE REST CANNOT CROSS VEGAS and comes up exactly 3,072
steps short; a slept camp can. Mutation-tested: changing the valley to 80 cells
reds six checks, and quietly moving his 75 to 50 reds five.

---

# AMENDED 7/27/26 — CLAUSE 17: THE STEP CLOCK IS NOT THE DAY CLOCK, AND I HAD BLURRED THEM

His words, verbatim, correcting me:

> "Only thing I want you to understand is that I know you made a big on you know
> tiles as well, which is super important. I'm glad you have that math, but that's
> just if you were walking now you have to understand a lot of things in this game.
> Will take up time and time will pass just by taking actions in this game and you
> really need to understand that sort of clock when you think about how long you get
> lifted up for your camp and shit. Its just just the amount of steps the buff makes
> you feel good for"

## 17. A BUFF'S LENGTH IS STEPS. THE DAY'S LENGTH IS ACTIONS. NEVER TRADE ONE FOR THE OTHER.

**WHAT I GOT WRONG.** Clause 16's arithmetic is correct and he says so. What I then
did with it was not: I wrote "9,216 steps = 9 hours of walking" and let that stand
as though it described how much of the player's day the buff covers. **It does not.
It only describes a player who does nothing but walk, and no such player exists in
this game.** A day here is eaten by looting, talking, fighting, camping, treating a
wound, sleeping — everything the TIME IS SPENT BY ACTIONS law already said. Steps
are one small slice of what consumes a day.

**SO THE TWO CLOCKS ARE FORMALLY SEPARATE, AND THEY ALWAYS WERE:**

| | burns on | does NOT burn on |
|---|---|---|
| **the buff** | STEPS you take | time, actions, standing still, sleeping |
| **the day** | EVERY action, walking included | nothing — it only moves when you act |

**THE CONSEQUENCE THAT MATTERS FOR SIZING THE CAMP:** a rest worth 9,216 steps is
NOT "most of one day". If the player spends the afternoon searching a motel and the
evening at a companion's place, the day rolls over and the buff has barely moved.
**A single rest can span several in-game days.** That makes the camp buff STRONGER
in practice than the step number makes it look, and it is the thing to hold in mind
when he sets the final numbers. It also makes clause 2 load-bearing rather than
merely elegant: if the buff burned on TIME, a player who stopped to do anything
would be punished for playing the game.

**WHAT THIS FORBIDS, IN THIS REPO, FROM NOW ON:**
- Presenting a step count as an equivalent duration of PLAY. "9,216 steps = 9 hours"
  is only true of a pure walk and must always say so.
- Sizing any buff by asking "how much of a day is this" — the answer depends on what
  the player does, which is unknowable at design time. Size it in STEPS, and in
  crossings, which is his unit.
- Any buff that ticks on the clock instead of on steps. Clause 2, now with a reason.

**WHAT THE PAGE DOES ABOUT IT** (`slices/lab/BOHEMIA_LAB_MOBILE_CAMP_DIAL_7_27_26.html`):
- the "ACROSS VEGAS 12,288 steps" line now says **"12 h IF YOU DID NOTHING BUT
  WALK"**, because that caveat is the whole point;
- the buff reads **"9,216 STEPS LEFT — steps only, actions cost the day, never the
  buff"**, and no longer converts itself into hours;
- the HUD splits the day into **time spent walking vs time spent doing things**, so
  the gap between the two clocks is visible while he plays;
- and there is a **SPEND AN HOUR ON SOMETHING** button — deliberately unnamed,
  because what the real actions are is his — which eats an hour of the day and
  ZERO steps of buff. Press it three times and watch the day die while the buff sits
  still. That is clause 17 in the hand instead of on paper.

## GATE

`camp_dial_gate.js` gains the C-series: an action burns day and never buff; walking
burns both; the day's accounting really splits into walking versus doing; a buff can
outlive a whole in-game day of actions; and the page never presents a step count as
a duration of play without the "if you only walked" caveat attached.
