# COMBAT 10/26: FATIGUE COMES BACK EVERY TURN, AND RUNNING OUT NEVER ENDS A FIGHT (rules 283 and 285)

## HIS WORDS
283: "with a shield and one hand weapon... fatigue doesn't get restored, or if I chill out it doesn't go down... fatigue creeping all
the way up and then after it's done I can't attack anymore for the whole fight, and that's incorrect."
285: "there's no calculations for stamina regeneration, especially if I'm ending my turn not taking any action... if I run out of
stamina in a match it's over, what the fuck."

## WHAT WAS WRONG, MEASURED ON THE LIVE RULES (tools: the gate's own F1, headless)
newRound() did take Battle Brothers' 15 off every man every round. But a man of his ringed by three takes +5 for every hit and +2 for
every block or dodge (rules.json fatigue.on_struck, on_dodge_or_block; maces 10 and 20), and three men swinging at him put back as
much as the 15 took off, or more. One man with a car door and a spear among three brigands, swinging when his breath allowed and
ending his turn to rest when it did not: 70 of 296 of his turns winded, the longest run 13; resting he went 81 -> 83 -> 83 of 83.
In the heaviest body and helmet (maximum 21): 220 of 295 winded, the longest run 15. He never swung again: his 'it's over'.
The recovery ran for his men (the code was right); nothing on the screen said how much came back; RECOVER was the perk's only.

## THE COORDINATOR'S FOUR SUSPECTS, EACH ANSWERED
1. THE HITS OUTRUN THE 15: TRUE. Ringed by three, +5 a hit and +2 a block put back as much as came off, and more (resting, 81 -> 83
   -> 83 of 83). Fixed: a rest brings 30, and the hits of a rest are owed until after his next swing.
2. A HEAVY KIT'S CEILING: TRUE for the worst kits. The heaviest body and helmet with a car door and a full bag leave a maximum of 0 to
   21; where his own blow costs more than his maximum no rest can buy a swing (60 of the gate's AUTO men): his card says TOO HEAVY TO
   SWING at the lineup and in the fight (283(c)); every other kit swings the turn after one rest.
3. A LIVE PATH THAT SKIPS IT, OR A STALE BAR: FALSE. newRound() runs on every path (AUTO and by hand, the fight page and the demo's
   door are one page); the card's bar reads the engine's fatigue over his maximum every turn (the gate's F5, phone and computer).
4. NOTHING ON SCREEN SHOWS IT: TRUE. Fixed: the wind glyph and the number over him at each of his turns, the faint +N on his card.
(The live site is out of this container's reach; the measuring was on the live rules headless and on the real fight page, which is
the page the demo's door opens.)

## THE FIX (slices/BOHEMIA_FIGHT.html, COMBAT's rules and its fight screen)
- A REST (283(b), 285(b)): END TURN with no AP spent is a rest. At his next turn ours.rest_recovery (30, a new sourced row, the
  coordinator's default) comes back instead of 15. The fatigue hits and blocks put on a resting man is OWED, never taken off the
  30 [COORDINATOR'S DEFAULT, rule 205]: it lands when his next turn that spends closes, after his swing (tire(), restOrNot()).
- RECOVER FOR ANY WINDED MAN OF HIS (283(b)): the perk's own numbers (half his fatigue, 9 AP), without the perk, while his blow
  costs more breath than he has left; his button by hand only (AUTO never presses it, rule 231; theirs keep the perk's rule).
- HE SEES IT (285(c)): as a man of his begins his turn, by hand or on AUTO, the wind glyph and what came back float over him
  (+15, +30 after a rest); his card's line reads the engine's AP and FAT with a faint +15, or +30 while he has spent nothing this
  turn (an END TURN now is a rest); the bar is the engine's fatigue over his maximum.
- A WINDED MAN OF HIS RESTS ON AUTO (283(d)): AUTO ends the turn of a man of his too winded for his own blow with nothing spent, a
  rest (it kept him shuffling: in the heaviest kit 1,670 of 3,624 of his turns winded, one man 30 turns running).
- THE REST LASTS until his next turn begins (u.resting); u.lastRest says what the last turn was.
- A KIT THAT LEAVES NO SWING (283(c)): when his own blow costs more breath than his kit's maximum, his card says TOO HEAVY TO SWING
  (draft), at the lineup and in the fight.

## THE GATE: FATIGUE COMES BACK EVERY TURN (gates/fatigue_comes_back_every_turn_gate.js, in the suite, slow)
8/0. F1 ringed by three, 40 rolled fights in the heaviest kit and 40 in his light one: 1,546 turns of his, 437 winded, the longest
run 1; after a rest he could swing 552 of 552 (before: 70 of 296 winded, runs of 13; heavy 220 of 295, runs of 15). F2 841 turns
after a turn that spent got the 15 (or all he had), 552 after a rest got exactly the 30 with the rest's hits owed. F3 AUTO, his crew
of three in the heaviest kit, 60 rolled fights: 2,284 turns, 395 winded, the longest run 1 (before 30); 60 men whose kit leaves no
swing at all (the blow costs more than the kit's maximum) left to F6. F4 RECOVER without the perk: 82 -> 41; a man not winded may
not. F5 his phone and his computer, by hand: 8 turns read, the wind glyph over him the number that came back (+15, +30 after a
rest), his card's bar the engine's fatigue over his maximum, the faint +N on his card every turn, RECOVER lit when winded. F6 a kit
that leaves no swing: 'TOO HEAVY TO SWING' on his card at the lineup. F7 nothing threw.

## ROUTED
- TUNING: ours.rest_recovery 30 (the coordinator's default) and the owed hits; the stupid-move watch can count winded turns now
  (FIGHT.winded). NOTEd.
- COMBAT TWO (the AUTO brain): AUTO never rests on purpose; a man of his on AUTO who ends a turn with nothing spent rests by the
  rules. Whether AUTO should rest a winded man is yours (rule 231 keeps RECOVER off AUTO). NOTEd.
- EYES: the breath tag at each of his men's turns, +30 after an END TURN with nothing spent; a car door man ringed by three swings
  again the turn after a rest.
