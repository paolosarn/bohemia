# PAOLO 10/26: EVERY LEVEL HE EARNS WAITS FOR HIM (LOCKED, rule 281; a bug)

## HIS WORDS (verbatim, voice to text)
"Also, can you check? Is there a bug when it comes to leveling up my characters level five and I was only able to level them up one
time like if I sit on it and they keep level up and I haven't put stats in it that means I still have that many rounds to upgrade my
character, so I don't know if you have that part fucked up but come on."

## WHAT THE CODE MEANS TO DO (coordinator, read on main)
engine/bohemia_roster.js levelUp() queues each level's rolls on m.rolls (oldest first) and adds its perk point; raise() spends the oldest
one; grant() climbs as many levels as the XP buys; the crew screen shows 'LEVEL N: PICK 3 TO RAISE (k LEVELS WAITING)' and saveClimb()
keeps m.rolls. So the design banks every level. On the real path he reached level 5 and could raise only once: a level is being lost or
applied without him somewhere between the fight's XP, the loot screen's LEVEL UP, the hand-over and the crew screen (or the origin
door's levels are taken for him and the screen shows the level without the rolls).

## HOW BATTLE BROTHERS DOES IT (rule 33)
Every level a brother gains waits with a plus on his portrait: its attribute rolls and its perk point stay until you spend them, as many
levels as he has banked, one at a time.

## THE RULING (rule 281)
(a) Every level a man earns waits for him: its rolls and its perk point bank, as many as he has earned, until he spends them one at a
    time; nothing spends one for him; nothing loses one (a reload, the crew screen opened or never, the loot screen, a camp, a fight).
(b) The crew card shows how many levels wait (a plus and the count, rule 224's icons), and the level shown is never higher than the
    levels he has had the chance to spend, except the levels an origin's door hands him already spent (said on his card).
(c) THE GATE: on the live path, a man who earns three levels across two fights without opening the crew screen shows three waiting,
    raises three times, gets three perk points; after a reload too; phone and computer.
(d) RUN FOUR [every level waits for him] FIRST after [scrap is tape] (the fight's XP lands through its screen); RUN TWO NOTE (the crew
    screen's level-up); line 221; EYES checks.
