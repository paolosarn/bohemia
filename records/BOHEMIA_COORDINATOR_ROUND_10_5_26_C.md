# COORDINATOR ROUND 10/5 C (SWEEP U), from 04013d0c (sweep T) to 6842b998

## WHAT THE LANES SHIPPED (five commits, five lanes)
- COMBAT [the enemy math] 4d1eb0f (rule 75b): FIGHT_OPTS.party as ids, kinds and counts, or {faction, count, days, difficulty}; FIGHT_OPTS.cap from the origin; ours.enemy_tiers early/middle/late from day 1/20/60 capped at 100, each difficulty step above Veteran counts as 20 days, a late party of four brings its leader; each man armed from his enemies.json row; day 1 thug, thug, lesser raider (armour 79) against day 100 leader, marauders, raiders, marksmen (armour 155). THE REBUILT FIGHT PLAYS 100/0. Stamp 10/5c.
- RUN TWO [the market] d8379e26 (rule 75d): camp one guns-and-plate stall; town and fortress a smith and an armourer on COMBAT TWO's buildings; stock from weapons.json and armor.json by tier band, seeded per place; price max(1, value/10); the keeper says the price; buying spends into the stash, selling back pays half (unsourced, TUNING); the board shows skulls and pay (30/60/90). Settlement gate 35/0.
- UI [the settlement's labels] f1d6064a (rule 71a): settleTag, a torn receipt tag with tape, name in CASING, line in ROM, 44 pt, shown only while the finger is down; the keeper's goods and prices as receipt lines. Gate 10/0.
- WORDS [the weapons' lines] dede662c (rule 75e): the brief's five examples were not in the live table; the seven real weapon jobs (pistol, shotgun, rifle, pipe, sledge, car door, bottles) each got one plain line from the class average; nothing on a screen yet, said plainly.
- SOUNDS [the map's sounds] round two cec07913: the hidden frame's heartbeat stays fresh on the MAP tab (measured ten samples), so the ambience bed now plays there too; RUN [the map hears] narrowed to the travel state.

## GROK
GROK_112 (the mix: a budget and a weighted list with a post-pick multiplier, from the makers' Menace diary; the militia scale cap 14 and field 16 from a script read), GROK_113 (morale states and the check caps from the wiki; the kill math from a player sheet, marked as such), GROK_114 (the damage split from the wiki: armour takes its number, 0.1 ignores armour, head 1.5, falls, bleed, poison). All stamped; routed to COMBAT [the enemy math] round two (rules.json carries each with its page; the picker becomes budget-and-weights with draft weights).

## THE LINES
DEPLOY: 2738 SUCCESS, 2737 cancelled under it (one in 35; watch). COOK: 368 items, 322 verdicts, 47 waiting. SUITE: the fight 100/0, the settlement 35/0, the labels 10/0. CUT: the market and the enemy math DONE. Open-row check passes.

## THE ONE THING HE HAS NOT OPENED
THE MARKET. In the DEMO, tap a town, touch the smith or the armourer: Battle Brothers' stock in our names, the keeper says the price in batteries, a buy spends it. He said this hour he still could not buy; the ship landed after his play.
