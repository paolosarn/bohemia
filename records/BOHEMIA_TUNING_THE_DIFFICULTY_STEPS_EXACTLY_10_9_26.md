# TUNING ROUND 8 -- [the difficulty steps] WHAT EACH BATTLE BROTHERS DIFFICULTY CHANGES, EXACTLY (10/9/26)
# Row: VAMILY TUNING [the difficulty steps], MODE RESEARCH (rule 38g). For the door's difficulty stamp (UI) and COMBAT [the enemy math].
# EVERY NUMBER BELOW IS FROM THE WIKI DUMP, READ HERE (reference/library/grok/wiki/PAGES_ALL, wiki pages: Game Mechanics
# "Difficulty levels", Hit Chance, Level and Experience, Ammunition, Medical Supplies, Tools and Supplies) unless marked
# "Grok, unverified" (GROK_60 enemy math, GROK_119 prices). Wiki text is CC BY-SA 3.0, battlebrothers.fandom.com.
# Nothing here is converted to batteries: that is ECONOMY's data file. Nothing is built.

## 1. THERE ARE TWO DIFFICULTIES, NOT ONE, PLUS A SAVE RULE
BB asks for COMBAT difficulty and ECONOMIC difficulty separately (each Beginner / Veteran / Expert), and a third,
independent switch, IRONMAN. Our five-tier package (EASY to BOHEMIAN) is one number for something BB splits in three.

## 2. COMBAT DIFFICULTY (what Beginner, Veteran, Expert change in a fight)
| | Beginner | Veteran | Expert |
| your hit roll | 5 points better (roll minus 5) | normal | normal |
| enemy hit roll | 5 points worse (roll plus 5) | normal | normal |
| experience | +10% for every character | normal | normal |
| late-game crisis | arrives 5 days later | normal | normal |
| enemy groups | easier groups later | normal | HARDER GROUPS APPEAR SOONER |
Also on every setting: combat difficulty sets the defence bonus a man gets for moving through zones of control while
auto-retreating. "Higher combat difficulty means harder enemy groups appear sooner" is the whole enemy effect; Grok
GROK_60 (unverified) reads it as a higher COUNT and a higher TIER together (more leaders, fewer thugs), and the open
COMBAT row counts each step above Veteran as 20 days of scaling. NOT changed by any difficulty: enemy equipment and
stats ("enemies carry the same equipment with the same stats on all difficulty levels") and what towns stock.

## 3. ECONOMIC DIFFICULTY (what the same three names change in the money)
| | Beginner | Veteran | Expert |
| contract pay | normal (100%) | normal (100%) | 90% (the Game Guide's table; the Mechanics page's '10% less per level' means Expert only) |
| carry cap: tools and supplies | 200 | 150 | 150 |
| carry cap: ammunition | 500 | 300 | 300 |
| carry cap: medical supplies | 150 | 100 | 100 |
| selling prices at settlements | normal | normal | 10% LOWER |
| deserters | leave | leave | TAKE THEIR EQUIPMENT WITH THEM |
(CORRECTED 10/10: the Game Guide table gives contract rewards and selling prices as 100/100/90 percent, so only Expert is lower and Beginner equals Veteran; my earlier +10 percent for Beginner was wrong. The quartermaster follower adds +100 ammo and +50 tools and medicine on top of every column.)
Starting funds are a separate triple in the current build, named High / Medium / Low (older builds: Beginner /
Veteran / Expert):
| | crowns | provisions | tools | ammo | medicine |
| High   | 2500 | 50 | 40 | 80 | 30 |
| Medium | 2000 | 50 | 20 | 40 | 20 |
| Low    | 1500 | 50 | 10 | 20 | 10 |
Grok GROK_119 (unverified): on Expert a city hall buys your goods at about 17.7 to 19.7 percent of their worth by
relations, a village hall about 13.6 to 15.6.

## 4. IRONMAN IS A SAVE RULE, NOT A DEATH RULE
Ironman: the game autosaves and you cannot make manual saves, so you live with every decision. It does NOT change
the odds of dying; those are the fixed 33% survival from my 10/9 wiki check. My earlier pages said Ironman "makes
death permanent": that was wrong. Ironman and Beginner EACH delay the late-game crisis by 5 days (so a Beginner
Ironman run gets 10).

## 5. THE FINDING THAT PROVES US WRONG (again)
My 10/1 page said our five tiers "barely move anything" because the top tier is only 21% more enemy hits. Read
against this page that was the wrong lever to blame: BB's own accuracy lever is the same size and smaller (5
points, Beginner only; none for Expert). BB's difficulty is felt through THREE OTHER THINGS we do not touch at all:
the COUNT and TIER of enemy groups and how soon they arrive; MONEY (pay down 10% a step, prices down 10% on Expert,
a smaller pack on every step); and the XP and crisis timing on Beginner. Our tiers move the aim and the dial and
nothing in the economy or the groups. Nothing in this is Paolo's number to set; he said "you optimize that".

## 6. WHAT THE DOOR AND COMBAT CAN TAKE FROM THIS (rows, proposed, not built)
combat.hit_roll_shift [-5 Beginner, 0, 0]; combat.xp_mult [1.10, 1, 1]; combat.crisis_delay_days [5, 0, 0] and
ironman.crisis_delay_days 5; combat.group_days_per_step 20 (the open COMBAT row; Expert counts as Veteran plus a step);
econ.contract_pay_mult [1.10? read as 1.0 / 0.9 per step, wiki states only the step], econ.carry_caps [tools, ammo,
medicine] per column above, econ.sell_mult_expert 0.90, econ.deserter_keeps_gear [false, false, true],
start.kit [High, Medium, Low]. Ours are batteries and our own pack (food, water, ammo, medicine); ECONOMY converts.
THE ONE DECISION THE DOOR MAKES, for the manager and not for him: split the stamp in two (combat, economy) plus the
Ironman checkbox, as BB does, or keep one. Recommendation: two plus the checkbox, because the wiki shows they are
independent and the old ONE-number weld is exactly the assist-versus-pressure problem found on 10/1.

## ROUTED
- UI (the door's stamp): section 1 and the three controls.
- COMBAT [the enemy math]: section 2 (hit-roll shift, 20 days a step, count and tier), and the rows in section 6.
- ECONOMY: section 3 as percentages and caps to convert to batteries.
- TUNING [numbers table]: the draft file gains these as `references`.
- Test material: the VOTE page is draft:true, never in the game.

## CORRECTED 10/10: contract pay is 100 / 100 / 90 percent for Beginner / Veteran / Expert (Game Guide, 'Economic difficulty and other effects'). Beginner is NOT +10 percent. The row in section 3 and the VOTE page are fixed; the references row econ.contract_pay_step in the draft table should read econ.contract_pay_mult [1.0, 1.0, 0.9].
