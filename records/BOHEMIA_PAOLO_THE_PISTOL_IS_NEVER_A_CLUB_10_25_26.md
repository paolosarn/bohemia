# PAOLO 10/25: THE PISTOL IS NEVER A CLUB (LOCKED, rule 195; amends 185(g) and 83)

## HIS WORDS (verbatim, voice to text)
"Bro, the game still says the pistol is a club at one tile I never asked for that shit bro what the fuck"

## WHERE IT CAME FROM, HONESTLY
He never asked for a gun to be a club. Every 'club at one' in the game traces to the coordinator's words:
- Rule 83 (10/10) closed with '(the pistol is a two-tile gun, or a club at one)': the coordinator's gloss of 'all guns 2+
  minimum', never his sentence. records/target/bb/ours.json even carries that gloss inside a "quote" field as if he said it.
- Rule 185(g) (10/25) said 'he does not pistol-whip unless he chooses to': again the coordinator's words. COMBAT built it
  faithfully as the WHIP button (slices/BOHEMIA_FIGHT.html whipTap, 'WHIP: tap the man beside him. The butt, no round
  spent.') and kept the gun's butt (ours.gun_club, clubFor, armIn) as the blow when the shot is not there.

WHAT HE STILL SEES (main at b6c8c1ed):
- The crew screen and the hall (engine/bohemia_roster.js armLine): every pistol reads 'REACH 2 TO 4 TILES, A CLUB AT 1'.
  Two lies in one line: the fight's shot reaches 1 (ours.gun_min_range is 1 since rule 185), but armOf takes the javelin
  row's own range_min of 2; and ', A CLUB AT 1' is added to every gun.
- The town shop (slices/BOHEMIA_SETTLEMENT_SCREEN.html PLAIN): the pistol's line is 'A few houses off, a club up close,
  spends rounds.'
- The fight: the WHIP button beside an enemy, the 'No shot in it: he clubs with his...' line, and the stat card's 'No shot in
  it: the butt at one tile'.

## HOW BATTLE BROTHERS DOES IT (rule 33)
A ranged weapon never turns into a melee weapon. A crossbowman with no bolt reloads, or swaps to the melee weapon he carries
in his bag (the swap costs action points; Quick Hands makes the first swap free), or steps back. That is the whole answer.

## THE RULING (rule 195)
(a) THE PISTOL IS NEVER A CLUB, AND NO GUN IS: a gun shoots, from the tile beside him out to its reach. The gun's butt, the
    WHIP button and every 'club at one' word are dead, in the fight, the crew screen, the hall, the shop and the words.
(b) A GUNMAN WITH NO SHOT DOES WHAT BATTLE BROTHERS' DOES: he reloads, or swaps to the melee weapon in his bag (the two bag
    slots, RUN TWO 717be9e0; the swap's own cost), or moves. AUTO and the calculator read it the same round (rule 178(c)).
(c) Every screen says a gun's reach the way the fight measures it: a pistol 'REACH 1 TO 4 TILES', from the fight's own
    numbers (ours.gun_min_range and the shot's row), one source.
(d) Rule 83's '(the pistol is a two-tile gun, or a club at one)' and rule 185(g)'s 'unless he chooses to' are struck;
    ours.json's 'quote' fields carry only his real words.
(e) THE GATE: no player-facing string in the alpha, the demo, the fight, the crew screen, the hall or the shop says a gun is a
    club, a butt or a whip; in rolled fights no gun ever strikes as a melee weapon; every gun's reach line matches the fight.
(f) Rows: COMBAT [the pistol is never a club] FIRST when it reopens (the butt, the whip, AUTO); RUN TWO [the pistol is never
    a club, the words] beside [a two-hander wears its own name] (armLine, the shop line); line 116 on his list; EYES checks.
