# BOSSES, 11/21/26: THE MIDWIFE, THE LADDER'S 19TH, MET AND NEVER FOUGHT, AND ACT ONE'S CLOSE (the coordinator's routine 'BOSSES: the Midwife is yours')

The routine (rule 461, as amended 11/21): 'neither PEOPLE nor DYNASTY has a lane open, so you build her yourself, whole, from their
records (the relationship from PEOPLE's, the birth from DYNASTY's). If one piece needs a ruling he has never given (how act one turns
into act two), build the boss and her verb and leave that one piece written plainly in your handoff, then go on to the 20th.'

## HIS RULINGS SHE IS BUILT FROM (none rewritten)
- The ladder (records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md row 94): THE MIDWIFE holds 'every birth in the valley'; the lock 'nothing
  guarantees the line continues'; her verb 'bring a birth through, AND THIS CLOSES ACT 1'.
- The ladder's item 4: 'very important to the main quest actually very important. must have a relationship and shit to before act 1
  closes.'
- WORLD TWO's boss_map row 19 (records/target/bb/boss_map.json): her radio sign, her place among medical, chapel, suburb, 'how':
  'meet' (arriving is enough, never a fight), 'falls': lights 3 and 'holds': 'you' (the nearest home base passes to the company).
- DYNASTY's records: 'whether there is a partner at all, who, whether there is a child, how many, and every name: HIS'
  (records/BOHEMIA_DYNASTY_DAY_7_A_PARTNER_AND_A_CHILD_9_5_26.md); 'A CHILD IS NOT A THING YOU CARRY. A CHILD IS A REASON OTHER PEOPLE
  COME TO YOUR HOUSE'; engine/bohemia_family.js: marry() refuses to run without a partner handed to it ('WHO YOU CAN MARRY IS PAOLO'S').
- PEOPLE's standing web (engine/bohemia_standing.js, on the map's page): whoVouches, the named people warm on you because they saw or
  heard what you did.

## WHAT SHE IS
- MET, NEVER FOUGHT. WORLD TWO already had her: arriving at her house fells her in its map (no fight). The gate checks it: no card asks
  for a fight and nothing is handed to the fight's door.
- HER MARK ON THE MAP (slices/bohemia_bosses.js (27) HER CRADLES): 3 houses on street blocks round her house where a birth is coming:
  a dark front, one candle in the window, a pail by the door (records/target/bosses_the_midwife, tools/bohemia_bosses_the_midwife_
  places_11_21_26.py). Nothing hostile: she is a person to reach, and the houses wait for her.
- HER HOUSE: THE BIRTH HOUSE, a low stucco house with a porch light and a sheet on the line (before: curtains drawn, a basin and towels on
  the step; after: the door open and lit, a cradle on the porch).
- HER VERB, DELIVER: beside one of those houses, once a day, the birth is brought through: the window warm and a cradle by the door for
  good (kept after a reload), +25 CLOUT (the valley reads it). It comes right after THE WARD's TREAT in the band.
- HER PRIZE: the after card says HER BAG IS YOURS over her bag (an old leather doctor's bag, a towel out of it); she herself moves into
  your place through HOME BASE's seam (a person) and stands on CAM 3 THE PEOPLE.
- HER WORDS: none (rules 454(a), 465). Her fight card does not exist; her one line is left empty until his voice is written.

## ACT ONE'S CLOSE, AND THE ONE PIECE HE HAS NEVER RULED
- THE RELATIONSHIP HE MADE A REQUIREMENT is read, never invented: act one closes on the first birth brought through ONLY IF somebody in
  the valley speaks for you (BohemiaStanding.whoVouches on the map's own minds: a named person warm on you). No partner is chosen, no
  child is the player's, nobody is named: that is his. With nobody speaking for you the birth still counts and the close waits; the
  moment somebody does, the next tick closes it.
- WHAT CLOSING DOES HERE: the day, who spoke for you and the births are kept in this file's state (BohemiaBosses.actOne(), kept after a
  reload), and 'bohemia:act-one-closes' is sent with them for DYNASTY. 'ACT ONE' rises off the crew.
- *** NOT RULED, LEFT PLAIN: WHAT ACT TWO IS WHEN ACT ONE CLOSES. Nothing here flips an act or changes the era (engine/bohemia_acts.js,
  DYNASTY's flip, is untouched). Whether the close starts act two at once, opens the flip, hands the company to an heir, or only marks
  the act done for the flip he already has, is his to say. ***

## THE GATE
gates/the_next_three_change_the_map_gate.js "THE MIDWIFE" (THE MIDWIFE CHANGES THE MAP, registered): K1 (the houses, nothing of hers
yours before her), B0 and B1 for a met boss (meetAt: the walk is the meeting), B2, G1, V1 (DELIVER), A1 (the close waits for somebody who
speaks for you, or closes if somebody already does), B3 (the words when she is met: never 'down'), A2 (with somebody, it closes, is kept, DYNASTY is told; the standing web's answer
planted for one call when nobody in the gate's game speaks for you yet), H1 (CAM 3), R1. Planted fails each (B3's is P7).

## WHAT RAN (rule 441: met end to end on the real page)
- The demo upright (phone_portrait): THE MIDWIFE CHANGES THE MAP 22 passed, 0 failed. Every boss before her first through the map's own
  fell(); her radio at 51,47, her house 59,23; met with no fight card and nothing handed to the fight's door; DELIVER at 62,27 brought 1
  birth through (+25 CLOUT, cooling); nobody in the gate's game spoke for her, so act one WAITED ('nobody speaks for you yet'); with the
  standing web's answer planted for one call it closed (day 1, births 1) and 'bohemia:act-one-closes' was heard; after a reload she is
  still met, 1 birth, act one closed, the cradle kept; CAM 3 THE PEOPLE drew 4 with her on the glass.
- The alpha on its side (phone_portrait:alpha): 22 passed, 0 failed, the same legs; CAM 3 drew 7 with her on the glass.
- Every planted fail turned its leg red (P1, P2, P4, P5 twice, P6 twice).

## SEEN ON HER OWN VOTE PICTURE, FIXED BEFORE THE SHIP
- The first VOTE picture said 'THE MIDWIFE IS DOWN' twice: her card's head (this lane's, slices/bohemia_bosses.js) and the map's line
  after a fall (WORLD TWO's slices/bohemia_his_map.js, which BOSSES also edited on 11/9). She is met, never fought, so neither may say
  she is down. NOW: a met boss's card head reads 'YOU MET THE MIDWIFE' and the map's line 'You met THE MIDWIFE.' followed by what
  changed, as before. Only the meet branch changed; every fought boss's line is byte for byte as it was (rule 465). Gate B3, planted P7.
- The run above was on the tree before main moved and before this fix. AGAIN ON THE MERGED TREE (main at 2944852e0, WORLD 15's
  11/21b, with B3): the demo upright 24 passed, 0 failed (her radio 49,34, her house 41,22, the map's line 'You met THE MIDWIFE. The
  lights are back on.', her card 'YOU MET THE MIDWIFE', DELIVER at 41,26, act one waited then closed, kept after a reload, CAM 3 drew
  4 with her); the alpha on its side 24 passed, 0 failed (her house 47,49, DELIVER at 51,46, CAM 3 drew 4 with her).
- SHIPPED AS BUILD 11/21e (11/21a to 11/21d were taken by other lanes while her gate ran). Main moved once more after the merged run:
  COMBAT FOUR's swamp and COOK SIX's home center, the fight page and fight art only; she is met, never fought, and the ladder before her
  falls through the map's own fell(), so no leg of her gate opens that page.
- HIS VOTES OF 11/21 (rule 466, saved while this ran): the 16 boss cards he voted on are all YES, no notes.
