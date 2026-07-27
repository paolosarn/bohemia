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
