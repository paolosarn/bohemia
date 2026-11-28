# FIGHT SCREEN 4: THE PRESS IS SAID (BUILD 11/28h)

VAMILY rule 482 ('the new guns and drones on the fight screen reading clear and punchy'); ARMORY 3's guns (rule 489); the coordinator's
order of 11/27 to FIGHT SCREEN 4: 'then the next thing on the fight screen that is not clear and punchy yet, upright and sideways, never
choppy; built the rule 495 way'. draft:true words, STAND-IN until he votes.

## MEASURED BEFORE (main f780c31f8, tools/bohemia_fight_screen_the_aim_line.js BEFORE=1: the shipped fight page at phone size, his man
## handed each new piece, theirs stood where its shot reaches, a finger on the man aimed at)

| piece | the aim line said | what one tap really does (the rules) |
|---|---|---|
| Guard Carbine (burst 3) | '55% to hit. A hit: -16 health, -24 armour.' / '30 left.' | 3 rounds, each its own roll: 55%, 45%, 35% (recoil 10 a round, ours.armory_fire.burst) |
| Box SMG (burst 4) | '56% to hit...' / '30 left.' | 4 rounds: 56%, 46%, 36%, 26% |
| Belt-Fed SAW (6, traverse) | '55% to hit...' / 'The blast strikes 3 of theirs.' / '100 left.' | 6 rounds walk across the man and the house each side of him, two passes: 2 tries a house, 55% then 45% |
| Rocket Launcher | '26% to hit...' / 'The blast strikes 3 of theirs.' | the house hit and the 8 round it |
| Double shotgun (cone) | '56% to hit...' / 'The blast strikes 2 of theirs.' / '2 left.' | as said |
| Ranch AR (semi) | '55% to hit...' / '30 left.' | one round, as said |

On its side the aim line sits in the strip between the turn order and AUTO, two lines high: a shotgun's, a belt's and a rocket's third
line was cut (the rounds left never showed on its side). That part was there before the new guns.

## WHAT WAS BUILT, WHERE THE CAUSE WAS (rule 495(e))

The cause: the aim line (slices/BOHEMIA_FIGHT.html aimLines/aimSay, this lane's) asked the rules for one chance and one count and had
one hard-coded sentence for any shape ('The blast strikes'); the burst's numbers lived in the rules and never reached the words.
- `aimPress(u, t)` (the aim line's own section): what a tap does when it is more than one try, read from the rules' own numbers
  (FIGHT.preview's chance, FIGHT.burstOf, ours.armory_fire.burst.recoil_per_round, hit_chance.cap, the shape's tiles as burstOn walks
  them: passes = rounds / houses), never a second copy of the rule.
- `records/target/bb/weapon_shapes.json`: the words, a modder's file: top-level "aim" (default, burst, burst_shape, left) and a row's own
  "aim" (Traverse: 'The belt walks across {houses} houses: {foes} of theirs.'; Fire Rocket: 'The rocket takes the house and the {ring}
  round it: {foes} of theirs.'). The old hard-coded sentence is gone; a shape with no words of its own says the default.
- The chance line for a burst: '3 rounds a tap, each a try: 55%, 45%, 35% to hit. A hit: -16 health, -24 armour.'; for a burst that walks
  a shape: '6 rounds a tap, 2 tries a house: 55%, 45% to hit...'; the rounds line: '30 left, 3 a tap.'
- ON ITS SIDE: each aim line is its own piece (span.ln between the same <br>s: its text unchanged for every reader); in the strip the
  breaks give way and the lines run on with a dot between them (#say.instrip .ln), so three lines fit the strip's two.

## GATE

`gates/the_press_is_said_gate.js` THE PRESS IS SAID (registered) 7/0, upright and on its side: A1 the burst (the carbine's three tries
the recoil apart, the SMG's four), A2 the belt, A3 the rocket, A4 the shotgun and a semi-auto as they were, A5 every aim line on the
glass uncut at 11 points and up, errors; planted (the aim words taken out of the shapes file): A1 and A2 red.
Also green: THE GUNS GROW UP 28/0, EVERY WEAPON HAS ITS RANGE BANDS 15/0, THE FIGHT SAYS WHAT IS WEAK 11/0, HEIGHTS YOU CAN READ 4/0,
A CHAMPION READS 9/0 (re-run on the rebased tree), DEMO BUILD 25/0; PATCH LAYERS R1 R2 at the ratchet (R5 42/41 red on main: the
copied hz/rngOf in four board files, another lane's, named in FIGHT SCREEN 4's handoff).

## NOTES

- The belt's tries are the aimed man's chance; a man in the next house rolls against his own defence (the line says the aimed man's).
- Champion names (records/target/bb/bohemia_enemies.json champions.read.she_first): MOTHER and MERCY added for CHARACTER 4's new
  names (Mother Dust, Mercy Vale), so the read says HER for them. The bodies are CHARACTER's (ONE ID, ONE WHOLE PERSON, flagged).

[bb Battle Brothers' tooltip for a skill names its shots and its area before you fire; ours says the rounds a tap, each try's chance and the houses it walks]
[analog horror: the gun counts its own rounds out loud on the paper, and every try after the first is worse]
