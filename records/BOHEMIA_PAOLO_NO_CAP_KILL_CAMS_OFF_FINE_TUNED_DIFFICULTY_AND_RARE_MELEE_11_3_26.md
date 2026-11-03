# NO CAP ON THE FIGHT, THE KILL CAMS SWITCH, DIFFICULTY FINE-TUNED, RARE MELEE MEN (Paolo 11/3; VAMILY rules 378 to 380, 351(a) amended; ask lines 407 to 410)

## HIS WORDS (verbatim, transcription kept)
"make sure that there's not a cap on the amount of players on screen enemy and my company I like I don't know why it feels like there's
a cap. Maybe I'm tweaking but make sure there's no coded cap of how many Enemies can be on the screen right now."
"Kill cams came in like ugly dogshit they are far from final lets have a killcam setting while u still work on it its fucking with the
visuals they are that bad / Toggle kill cams on or off"
"And for difficulty, please do more research on all of our numbers and what battle brothers did really get really good. I feel like
they have to make it like twice as many means to be difficulty Enemies difficulty. I feel like battle brothers from easy to hard just
tweaked the numbers tiny so slightly to make it harder and it was awesome u can feel how fine tuned the game was"
"and yeah more rare melee guys all the rare guys i saw were ranged only"
(With a full VOTE export: 6 new verdicts, all YES: combat-place-pass-11-3b, combat-place-shore-11-3b 'Wip', combat-place-airport-11-3b
'Wip', words2-a-tweet-sounds-like-a-human-11-3, run2-no-tape-round-the-phone-11-3, words2-the-radio-lives-in-the-feed-11-3. Its
'anything else' line is the one already logged 11/2.)

## RULE 378. NO CAP ON HOW MANY FIGHT (he was not tweaking: there are caps, measured by the coordinator)
1. MEASURED: (a) slices/BOHEMIA_FIGHT.html rowsOf(): his men stand in two rows of ours.formation.slots_per_row = 9 (18 places, Battle
   Brothers' two battle lines); a 19th man and past is pushed into a row already full, and centred() writes him at a negative index,
   so he is silently left off the board. (b) slices/BOHEMIA_CITY_WORLD.html roadFightRoster(): a road event's enemy party is
   Math.min(8, ...): never more than 8, whatever the party's own size. (c) the roaming party size (partySizeOf, partyMath) has its own
   day-one clamp (crew + 1 on day 1) that is a rule, not a cap; any other clamp found is reported.
2. THE RULE: no code caps how many men stand on a fight board, his or theirs. Everybody in the fight is on the board. Past two rows,
   his men take a third row and more behind; the board grows to fit (rule 'the map is fat', nothing black); the enemy party is the
   party's real size. The only limits are the ones he ruled (the formation's two lines are where men START; the rest stand behind).
3. GATE: a fight with 30 of his and 40 of theirs puts all 70 on the board; a road event with a party of 14 puts 14 in the fight;
   no man is ever placed off the board.
4. LANES: COMBAT 7 (the fight file); WORLD 8 (the map's road-fight roster and the party math).
5. [bb] Battle Brothers fields at most 12 of yours (two lines of 9 slots, 12 placed) and lets enemy parties grow large; ours: no cap on
   either side, his word.

## RULE 379. THE KILL CAMS SWITCH, OFF FOR NOW
1. A KILL CAMS row on the game's one settings card (behind the gear, beside the FIGHTS difficulty row, the same way
   slices/bohemia_difficulty.js does it): ON or OFF, held from the next kill.
2. DEFAULT OFF while they are being reworked ("far from final... fucking with the visuals"). They come back ON by default only when he
   says they are good.
3. THE REWORK: what made them ugly is COMBAT 7's to find from the shipped clips (the punch-in is a camcorder digital zoom on the
   compositor: scaled pixels blur and smear, the tags step aside); the bar is the starred loading-screen feeds and the 3-D look.
4. GATE: OFF means no kill cam plays and nothing on the board changes; ON plays them as built.
5. LANE: COMBAT 7, first.

## RULE 380. DIFFICULTY IS FINE TUNING, BATTLE BROTHERS' WAY (amends rule 351(c)(d))
1. His read: our levels feel like they double the enemies; Battle Brothers moved from easy to hard by small numbers, and you can feel
   how fine-tuned it is. The levels are SMALL, MEASURED steps on the numbers (enemy count, tier, their aim and defence, your aim, pay,
   prices, the clock of champions), never a wall of more men.
2. Research first, from the library: every number Battle Brothers' combat and economic difficulty touches, how big each step is
   (Beginner, Veteran, Expert, Legendary), written beside ours, then ours set in the one table so each level is a few percent off the
   next, run through the closeness sim (rule 370): close fights that still feel good on every level.
3. GATE: no level changes the enemy count by more than the table's step; every level's numbers are within the step of the next.
4. LANE: TUNING 2.

## RULE 351(a) AMENDED. MORE RARE MELEE MEN
- Every rare he saw was a shooter. The rare men are half or more melee: the hedge knight's, the swordmaster's, the gladiator's, the
  beast slayer's kin in Bohemia's skins (the cage fighter from the Mob's pit, the ex-casino head of security with a baton, the lineman
  with a splitting maul, the rodeo hand with a bullwhip), each starting with his melee weapon and an edge a player can read.
- LANE: HIRES (opened this round).
