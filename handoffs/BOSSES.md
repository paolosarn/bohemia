# BOSSES (written only by the BOSSES lane)

## BOSSES 4, 11/3/26: THE BURN, THE SURVEYOR, THE CLIMB, EACH WHOLE, ASSETS FIRST (rules 330, 337, 338; ask line 341), BUILD 11/3zzzl
Record: records/BOHEMIA_BOSSES_FOUR_TO_SIX_11_3_26.md. Gate: gates/bosses_act_one_gate.js now walks all six (BOSSES_EVERY_SECOND as before).
- ASSETS FIRST: each man his own model through COOK ARMOUR's pipe (tools/bohemia_bosses_four_to_six_11_3_26.py: roll, look <id>, batch,
  pack, cards, purple), his weapon on his hand's bone (own_kit): THE BURN a soot-black turnout coat, leather fire helmet, jerrycan, lit
  flare, the fire axe; THE SURVEYOR a hi-vis vest, white hard hat, map tube, plumb bob, the range pole; THE CLIMB an oxblood bellhop
  jacket under an orange harness, rope, pillbox cap, the hoist's hook on a chain. Faces in PORTRAIT's manifest.
- HIS PLACE before and after (tools/bohemia_bosses_paint_four_to_six_11_3_26.py, rows added to slices/boss_places/boss_places.json):
  THE FUEL YARD (one fire, then four barrels for anybody), THE SURVEY OFFICE (one window, then the map on a board), THE HOIST (the cage
  at the top, then down and the top floors lit); marks barrel, stake, rope. The things he hands you: hand_burn/survey/climb.png
  (tools/bohemia_bosses_what_they_hand_you_11_3_26.py fuel map hook).
- LEAD-UP: ABUELA PAZ / THE MARK, MANNY / THE MAN AT THE BAR, NENA / THE FLYER (records/target/bb/boss_act_one.json).
- VERBS, each its own kind of place (the phone shows one): LIGHT A FIRE (at night, a dark block off a town, once a night; your fires
  light 2 blocks at night: slices/BOHEMIA_CITY_WORLD.html sightLit and fogRadius, marked __THE_BOSS_FIRES_LIGHT_THE_NIGHT__), FILL IN
  THE MAP (on a road, once a day, fogReveal 10), GO UP (beside a tower, once a tower, 12 batteries). verbs_order puts them before COOK.
- LESSONS are the fight's own rules (a boss fight never deals COMBAT MAPS 3's place boards): the axe's Round Swing, the spotters'
  height, the hook's whip reach. Boards: landfill, ruin, casino.
- PROOF: the six-boss gate 108/1 (run 4: THE BURN's held finger once); fixed by the runs: a boss past the valley's edge gets his place
  behind his men, his own verb first at his own place, a two-handed boss weapon drops the rolled shield (BOHEMIA_FIGHT.html, marked).
- NOTES FOR HOME (rules 343, 347, 349: notes only): the prize on your lot and negotiable or not, in the record's section 7.
- VOTE: bosses-the-burn-11-3, bosses-the-surveyor-11-3, bosses-the-climb-11-3 (records/target/bosses_four_to_six/VOTE_BOSS_*.webp, moving).
NEXT: the other thirteen of act one the same way; TUNING owns 1.6x/1.4x, 2 blocks, 10 blocks, 12 batteries; if he wants every power
side by side on the phone, that is UI's band.

## BOSSES FIX, 11/3/26: WHAT A KILL DOES (rule 338, ask line 346), BUILD 11/3zzf
Record: records/BOHEMIA_BOSSES_WHAT_A_KILL_DOES_11_3_26.md. Gate: gates/bosses_act_one_gate.js (A5m, A5b, A5f, A5i, A6c; BOSSES_EVERY_SECOND=<dir>
takes a picture a second after the win).
- MEASURED: a stranger never saw the change (the map came back dark and a six-line card covered his place in a second); the map
  after wore a cracked skull, a door, two plates and a 9-second plate, his men standing on the changed place; a grey THE POT IS
  COOLING showed on every block.
- THE MOMENT HE FALLS (slices/bohemia_bosses.js (5)): the camera to his place, the before, the after rolling in like a tape, on this
  lane's glass over the map; then the one who asked says one line for the valley and holds out the thing (his pot, wrench, filter:
  slices/boss_places/hand_*.png, tools/bohemia_bosses_what_they_hand_you_11_3_26.py through DIRECTION's rig) with one plain line,
  numbers in it; TAKE IT flies it onto the phone's verb button; then a minute's hush (the next asker waits).
- THE MAP AFTER: WORLD TWO's skull, door and plate stand down for a painted place (slices/bohemia_his_map.js, marked); no 9-second
  plate; the name faint and boxless under the place when close; the place painted beside his men, never under them.
- USING IT: the button shows the thing and lights only where it works (no grey cooling button), a tube flicker as it comes on
  (slices/bohemia_phone.js, marked); every use plays the change where he stands and the number rises off his men.
NEXT: the other sixteen take a row each (after.valley, verb.hand, verb.first.rise) and a model each in the hand tool; a sharper
wrench jaw; UI 4's tooltip takes over the held finger.

## BOSSES 2, 11/2/26: EACH HIS OWN LOOK, A LEAD-UP, A VERB THAT MAKES SENSE (rule 330, ask lines 328 and 329), BUILD 11/3zt
Record: records/BOHEMIA_BOSSES_EACH_HIS_OWN_LOOK_A_LEAD_UP_A_VERB_THAT_MAKES_SENSE_11_2_26.md. Gate: gates/bosses_act_one_gate.js.
- THE POT, THE TAP, THE FILTER each in HIS OWN look on the people's rig (tools/bohemia_bosses_the_three_men.py, CHARACTER's tool
  pointed at three one-man types; slices/fight_rig boss_*_0, kind 'boss'; faces in PORTRAIT's manifest), in the fight and on his
  meet card (face talking, title, lesson).
- Each place PAINTED in the map's own look, before and after, two beat frames (tools/bohemia_bosses_paint_their_places_11_2_26.py,
  the district factory's parts through COOK's map rig render; slices/boss_places/). No pixel-row art left in slices/bohemia_bosses.js;
  WORLD TWO's lights-back-on dots stand down where a place is painted and are gone at the far zoom.
- The lead-up (CONTENT's mouth card): the one who lost something asks (TÍA CARMEN, EL CHINO, DOC REYES), one of your men reads the
  sign out, his place is marked; when he falls she comes back and says what the verb does in plain words and numbers.
- The phone's verb button is one plain line, a held finger shows a sentence (minimal, for UI 4 to take over), the first use says
  what it did on the map and the feed.
NEXT: the other sixteen of act one (a row each in boss_act_one.json, an entry each in the two tools); UI 4's tooltip takes over the
verb's; the pot lid and the valve wrench as CHARACTER clay pieces.

## BOSSES 1, 11/2/26: ACT ONE'S FIRST THREE BOSSES, END TO END (rule 302, ask line 287), BUILD 11/2zzg
Record: records/BOHEMIA_BOSSES_ACT_ONE_THE_FIRST_THREE_11_2_26.md.
