# THE DEAD, THE NAME, THE SOUND, THE STRIP, THE SHOP AND THE FIGHT NOTES (Paolo 11/3; VAMILY rules 360 to 367; ask lines 384 to 391)

## HIS WORDS (verbatim, transcription kept)
"Also, I feel like we don't see enough corpses even throughout the world or you know in the combat map I understand what we're doing
is is you know the maps not very big of a corpse won't realistically show up, but I feel like we should take the opportunity to make
things as realistic as possible, bro, like in this economic apocalypse like bro at least 1 billion at least billions of people have
died and shit"
"In the loading menu, why do you have like that day shoot sound effects playing I don't like that shit that's terrible... vibe killer
you have the same sound effect that's playing like when the day speed speeds up and even though I don't even like it and it's very
loud even in the regular game like it should be a lot quieter when I'm actually playing the game and it should not be anywhere near
the fucking loading menus... the volume of it has to go really down"
"don't put any writing anywhere that's called Las Vegas. Bohemia is Las Vegas... scour all the lines of any text in the game if it's
called Las Vegas no, it's called Bohemia"
"the tweet shit is still fucked man just make sure that whole box is for the text not cut in half... there should always be text
there that transitions to other text not just be empty"
"when I buy helmets or buy armor like it makes other armor unavailable to purchase or disappears"
"a new perk potentially called decoy... the description: did you seriously just walk around with a cardboard cut out... you can set it
down, enemy can as well... the enemy can have abilities as well"
"enemies [are] not prioritized... Battle Brothers [enemies are] slightly intelligent, they try to preserve their [lives]... a lot of
our enemies should be climbing on tops as high as they can, reasonable"
"if you press the flee button, it's like auto but it's like running away, my turn, and you have to reach the edge of the map... I still
don't see the retreat button working properly, it just auto ends the fight"
"Yo, I accidentally denied you access to something... I didn't mean to deny it." (the coordinator's follow-up to COMBAT 7: re-sent)

## RULE 360. THE DEAD ARE EVERYWHERE (realism; canon: two to three billion died in the first decade, laws/BOHEMIA_GDD_v2.md)
- Every fight board and the world show the dead at the rate the fiction earns: a body in a car, under a tarp, in a sleeping bag in a
  doorway, a row of body bags at a clinic, bones in the desert by a dead car, a grave mound with a cross of rebar, a mass grave at a
  stadium's edge; more in the city's poor blocks and the old camps, fewer where people still live and bury.
- Analog horror at the source, never gore for its own sake: covered, half seen, the shoes, a hand, the flies, the smell told in a line.
  Respectful and real: the dead were people, and the living moved them, robbed them or buried them, so every body tells which.
- Real models through the master rig (rule 337), poses that read at fight size, dressed in the runway law's clothes gone to rag.
- Gate: every place's board carries its dead past a floor set per place in the data; the map's blocks too.
- Lanes: COOK DEAD (new) makes them; COMBAT MAPS 3 places them on the boards after its roads; WORLD places them on the map.

## RULE 361. NO SPEED SOUND NEAR THE LOADING MENU, AND IT IS QUIET IN PLAY
- The start screen plays only its camera feed's own quiet sound (rule 348). Nothing from the game behind it reaches it: no speed-up
  sound, no tick, no buzz.
- Measured by the coordinator on the demo's start screen (autoplay allowed, no tap, 20 s): the game's own playSFX fires there
  (phone_buzz and come_up from combatMsgIn, through the haptics wrapper), plus a 23 s buffer and the synth instrument. The menu is
  not silent behind its feed.
- The day-speed-up sound in play goes WAY down (he has disliked it for a while): a whisper, under everything else.
- Gate: the start screen hears nothing but its feed; the speed sound's peak sits under a set ceiling against the game's mix.
- Lane: FIXES finds the exact sound and fixes both; UI 6's freeze gate (rule 358) adds the silence leg.

## RULE 362. IT IS CALLED BOHEMIA
- No player-facing text says "Las Vegas" or "Vegas". The city is BOHEMIA. Compound names follow: North Las Vegas is NORTH BOHEMIA,
  the Las Vegas Wash is THE WASH (or the Bohemia Wash), Las Vegas Boulevard is the Strip or BOHEMIA BOULEVARD. Real places that are not
  the city's name keep theirs (Henderson, Boulder City, Pahrump, Red Rock, the Strip, Lake Mead).
- Records, laws and code comments may keep the real name; they are for the machine. Everything a player can read may not.
- Gate: every data file and page a player reads fails on "Las Vegas" or "Vegas".
- Lane: WORDS 2 (new) sweeps every line and builds the gate.

## RULE 363. THE STRIP IS NEVER EMPTY (amends rule 329's "then it sinks out")
- One post at a time, each its read time; then the next post steps in: a new one at once, else the strip walks back through the last
  six posts and round again. The box is always text, and the text fills it (rule 350).
- SHIPPED by the coordinator this round (slices/bohemia_phone.js stripPaint, STRIP_BACK = 6), measured on the demo: 30 s of samples,
  the posts cycled newest to oldest and round, a new post stepped in at once, zero empty samples.

## RULE 364. THE SHOP KEEPS ITS ARMOUR (a bug)
- Buying a helmet or a body armour makes other armour disappear from the shop or become unbuyable. A purchase takes that one item off
  the shelf (Battle Brothers' stock), never another.
- Lane: FIXES, with a gate leg: buy each armour piece in turn, every other piece is still there and buyable.

## RULE 365. RETREAT IS A RUN FOR THE EDGE (Battle Brothers' way; a bug he has reported for a long time)
- The flee button does not end the fight. It is AUTO, running away: on your turn every man of yours runs for the nearest edge of the
  board; a man who reaches the edge is out and safe; a man caught is fought; the fight ends when all of yours are out or down.
- Enemies that break run for the edges the same way (Battle Brothers' fleeing).
- Lane: COMBAT 7, first after its current items.

## RULE 366. THE ENEMY WANTS TO LIVE AND TAKES THE HIGH GROUND (Battle Brothers' AI is the floor)
- Enemies are a little smart: they pick targets (the hurt, the alone, the shooter in reach), they keep their own alive (a hurt man
  steps back, a losing side breaks and flees, a man outnumbered does not walk into five), and they CLIMB: shooters take the roofs and
  the highest ground they can reach (rule 321: height is accuracy; rule 328: climb or attack).
- Enemies have abilities too, the same kinds his men have.
- Lane: COMBAT 7, after the retreat.

## RULE 367. THE DECOY (a perk; his name and his line)
- DECOY: "Did you seriously just walk around with a cardboard cutout?" (his words, the perk's description). You set the cutout down on
  a tile; enemies treat it as a man (it draws their attacks and their shots) until it is knocked down. Enemies can have it too.
- Mechanic draft (TUNING's numbers): one per fight, costs the action, a set number of hits.
- Lane: COMBAT 7, after the enemy's smarts and the kill cams.

## THE COORDINATOR'S ROUND
- The strip: shipped (rule 363). The approved follow-up re-sent to COMBAT 7 with the new list in order: its items 2 and 3, rows
  139/152/229, THE RETREAT, THE ENEMY'S SMARTS, THE KILL CAMS, THE DECOY.
- FIXES: the speed sound and the menu's silence, the shop bug, with its items 9 (the words half), 10 and the morning leg.
- New: WORDS 2 (rule 362) and COOK DEAD (rule 360).
- BEASTS 2: the cheap clone's marks (rule 359).
