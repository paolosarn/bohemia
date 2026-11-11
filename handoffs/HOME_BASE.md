HOME BASE (home-base-01gkdyuv): 11/11 LATEST -- BUILD 11/11j - WHAT YOU BUILD OPENS A DOOR, BUILT, NOT YET SEEN (rule 445(b), rules
343, 438, 441; ask line 571). Record: records/BOHEMIA_HOME_BASE_WHAT_YOU_BUILD_OPENS_A_DOOR_11_11_26.md.
- home_base.json opens{}: at his place THE STALL is shut until a VENDOR STALL stands (TRADE), GUNS AND PLATE until a SHED (MEND), THE
  CLINIC until a ROOF (HEAL); a tap says what opens it and BUILD IT goes to the desk; built, the same tap opens the town's own sheet.
  The desk says YOUR PLACE CAN TRADE / MEND / HEAL, lit or dashed, beside the plan. Every other town untouched.
- Sideways the desk's eight builds fit the glass (minmax columns, a long line ends in ...); D8's press check reads all four sides.
- Gate YOUR PLACE, PLANTED: upright 81/0, sideways 79/0 (D15 new, planted: the rows off the message open the clinic for free). The
  alpha probed the same way both shapes. VOTE home-base-what-you-build-opens-a-door-11-11 (STAND-IN).
- Row 575 measured on main: its tap leg is green; K3 and K5 (crew activities, frame cost) are RUN TWO's, not HOME BASE's files.
- NEXT: (2) his impact at his place through the seam (jobs done, people saved), STORE and TRAIN (need a rule and a piece), his own
  bare ground (the camp picture still draws the stall and the tent).
- FOR ANY LANE ADDING A DOOR AT HIS PLACE: one row in home_base.json opens{} ({by: a lotbuild id, can: the verb, shut: the line}).

11/10 ROUND FIVE (BUILD 11/10u, EVERYTHING HIS LIVES THERE), kept:
HOME BASE (home-base-01gkdyuv): 11/10 LATEST -- BUILD 11/10u - EVERYTHING HIS LIVES THERE, BUILT, NOT YET SEEN (rule 445, rule 441;
ask line 571). Record: records/BOHEMIA_HOME_BASE_EVERYTHING_HIS_LIVES_THERE_11_10_26.md.
- THE SEAM is live: one call hands any custom thing to his settlement; before he plants it waits (the phone says WAITING FOR YOUR
  PLACE), planting places it; the three bosses' prizes go through it with their own pictures and stand on his back lots as doors; two
  build gifts stand on free lots; a tap on any of his things opens its sheet (what it is, who gave it, what it gives, BUILD MORE).
- Gate YOUR PLACE, PLANTED: 123/0 (engine and both phone shapes; E9 and D14 new, planted fails: a prize on a built lot, a prize
  placed before planting, the things taken off the message).
- VOTE home-base-everything-his-lives-there-11-10 (STAND-IN for the look).
- NOTE for every lane testing his place: his things stand on the BUILD corner, so a tap in its middle opens the thing; its sheet's
  BUILD MORE (#sbody .act[data-home="more"]) is the desk. FOR PLUMBER: PAGES PUBLISH is 907 MB of a 900 MB cap on main.
- OWED, said plainly: 445(b) "starts bare" is NOT true yet (his place opens on the camp picture with its shops; his things stand in its
  BUILD corner). Next: his own bare ground, with the cameras' look (waits on his vote).

THE SEAM, FOR EVERY LANE THAT HANDS HIM A THING (BOSSES told; JOBS; WORLD 14's events; the RETINUE). From the map (slices/BOHEMIA_CITY_WORLD.html):
    BohemiaHomeMap.give({
      id:    'job:church-roof',        // REQUIRED, unique and stable: the same id twice is one thing (returns {ok:true, again:true})
      kind:  'prize' | 'trophy' | 'build' | 'person',   // REQUIRED; anything else is refused {ok:false, why:'NOT_A_THING'}
      name:  'THE BELL',               // what it is, as he reads it (draft:true words are fine; WORDS may overwrite)
      pic:   'boss_places/hand_x.png', // its picture, a path from slices/ (prize and trophy; a build uses the lot pack's own sprite)
      gives: { food: 1 },              // what it gives, said on its sheet (only the three boss prizes pay the bill today: bill.prize_pays)
      from:  'THE CHURCH',             // who gave it: said on its sheet and in the feed
      says:  'a line about it',        // optional, said on its sheet when it gives nothing
      build: 'tank',                   // kind 'build' only: a lotbuild id (wall tank shed pump garden solar stall roof); it stands done, free
      look:  { ... }                   // kind 'person' only: his look, kept with his name
    })
  -> { ok, waiting } before he plants (kept, the feed says it waits; planting places it), or { ok, placed, thing: { lot } } after.
  WHERE IT STANDS (HOME BASE places it, never the caller): a prize or trophy on the back lots, last first (11, 10, 9 ...), never a lot
  a build holds; a build on the first free lot; a person lives there (residents, eats from the bill, tells the place's story). No lot
  left: kept as his (lot -1). Every gift goes on the place's record (story 'given').
  BOSSES: nothing to call; the map reads BohemiaBosses.state().verbs every 2 s and hands each verb's prize itself (data().bosses[].verb.hand
  name and pic). A spared boss who joins: kind 'person'. JOBS: a reward that is a thing of his is kind 'build' or 'trophy'.
  WORLD 14: an event's gift, the same. RETINUE: a hire who settles there instead of travelling is kind 'person'.

11/10 ROUND FOUR (BUILD 11/10n, WHAT YOU BUILD PAYS), kept:
HOME BASE (home-base-01gkdyuv): 11/10 LATEST -- BUILD 11/10n - WHAT YOU BUILD PAYS, BUILT, NOT YET SEEN (rule 443(f), rules 343, 441;
EYES row 549 fixed, 553 was FIXES'). Record: records/BOHEMIA_HOME_BASE_WHAT_YOU_BUILD_PAYS_11_10_26.md.
- Map __WHAT_HE_BUILDS__: homeChoose (plant the block he stands on or beside), homeWalkBeside/homeBetter (GO THERE to the street beside a
  plantable block, out to 12), homePayGoods (a build's goods out of bohemia.supplies.v1), homeWorkers (residents in order, one build
  each), homeMorning (lotWake wrapped: what stands gives into the supplies, worked gives more, a feed post), a roof brings a family.
- Town screen: his place's rows say battery + goods + gives (homeCostLine), greyed when short (data-short), goods paid first; the desk
  says who works what and what the place gives a day. Phone: THE BLOCK <side>.
- Data: home_base.json builds{} (cost, gives, worked, family, families[]), TUNING's numbers, draft:true.
- Gate YOUR PLACE, PLANTED: engine 22/0, upright 64/0, sideways 62/0 (D3 re-aimed, D12 and D13 new, each with a planted fail).
- VOTE home-base-what-you-build-pays-11-10 (STAND-IN for the pieces' look).
- NOTE for FIXES: a second tap where BUILD stood lands on the sheet's first row (WALL) once the sheet is up.
- Still owed of ask 356: the place's own look (the pieces stand small in the camp picture's BUILD corner; the cameras wait on his vote),
  what each building is made of and painted, a spared boss moving in (BOSSES), the acts (DYNASTY), a raid at his place walked end to end.

11/10 ROUND THREE (BUILD 11/10e, ONLY THE PLACE YOU PLANT IS YOURS), kept:
HOME BASE (home-base-01gkdyuv): 11/10 LATEST -- BUILD 11/10e - ONLY THE PLACE YOU PLANT IS YOURS, BUILT, NOT YET SEEN (rule 442(c), his
YES on YOUR PLACE, PLANTED; ask line 546). Record: records/BOHEMIA_HOME_BASE_ONLY_THE_PLANTED_PLACE_11_10_26.md.
- Before planting his outfit's seat is out of ctBases/turfSeats (nothing paints, names, colours, opens, raids or takes it); after, the
  planted block. BohemiaHomeBases.took is GUARDED in the map (__ONLY_THE_PLANTED_PLACE__): a taking to him of any base but his planted
  place is refused (THE TAP's and THE MIDWIFE's 'holds: you' in boss_map.json land nowhere; BOSSES may re-aim them to 'free' or a
  faction, their call); HB.__tookRaw is the unguarded one, for the gate's planted fail only. lotIsMine = the planted place only.
- Gate YOUR PLACE, PLANTED D11 (fresh, boss refused, exactly one, a saved game via CONTINUE, planted second place red): engine 22/0,
  upright 55/0, sideways 53/0. VOTE home-base-only-the-planted-place-11-10 (STAND-IN).
- Kept, not a place: the camp he pitches to rest (HEAL) leaves nothing on the map.
- Other lanes' gates re-aimed to 442(c): A RAID ON YOUR BASE (plants first, 18/0), BUILT ON THE MAP (plants first, 12/0), HIS MAP B5 (a boss's fall never makes a town his);
  TAKE THE NEXT PART retired to graveyard/ with its post-mortem (its registry row removed).

11/9 ROUND TWO (BUILD 11/9h), kept:


NOTE 11/10 FROM EYES (rule 441(b), ask row 549) -- PLANTED END TO END ONCE, BUT GO THERE POINTS AT GROUND HE CANNOT STAND ON.
Record: records/BOHEMIA_EYES_WALK_BUILD_11_9O_11_10_26.md. SEEN: PLANT on the phone from day 2, the page's four grades, 'Are you sure? This is permanent.', planted on desert (26,43),
GO HOME, kept after a reload. 549: 1,139 of 9,216 blocks grade plantable, only 199 (all desert) can be walked onto (cityWalkable); the
other 940 (692 suburb, 96 commercial, ...) can be BETTER / GO THERE, and GO THERE parks the party on the road beside it: three taps at
(27,41), 'BETTER: 1 BLOCK EAST' every time, PLANT HERE refused. And with nothing plantable within 6 the page points nowhere (the
nearest was 10 away).
HOME BASE (home-base-01gkdyuv): 11/9 LATEST -- BUILD 11/9h - YOUR PLACE REMEMBERS, BUILT, NOT YET SEEN (rule 440(d), asks 356 and 522;
rules 343, 347, 412, 402). Record: records/BOHEMIA_HOME_BASE_YOUR_PLACE_REMEMBERS_11_9_26.md.

WHAT IS LEFT OF ASK 356 (the list first, as the coordinator asked): (4) what each building is made of and painted, its sign;
(5) its own look (the cameras of rule 354 wait on his vote, or the plan made art, golden piece first); (6) a spared boss moving in
(BOSSES: which are negotiable; BohemiaHome.addResident is the one call); (7) the acts (DYNASTY's derive reads the record);
(8) a raid at his place walked end to end on the demo; (9) the main quest tie-in PARKED. DONE: planting (11/9d), where each build
stands and clearing it, who moved in standing there and talking, the place remembering and telling it by act (11/9h).

11/9 ROUND TWO, what changed:
- engine/bohemia_home.js note/tell/whoFor and rec.story; home_base.json story{} (the lines, draft:true, WORDS').
- the map's __HOME_BASE__: homeAct/homeDay/homeSeeBuilt (a finished build written once), the act on planting and move-ins,
  a dark night written; homeState hands each resident his 'says' line, the act, the last 8 of the story.
- the town screen: homeFolk (residents stand a body below the BUILD building), homeResidentTalk (face, LIVES HERE, his line),
  homePlanTap/homeLotIndex (pick a lot, gold outline, the next build goes there), homeClear (CLEAR <n> in the desk row),
  window.__HOME_FOLK_AT (read only, for the gate); the desk under half the glass upright.
- gate YOUR PLACE, PLANTED: engine 22/0, upright 50/0, sideways 50/0 (E8, D9, D10 new, each with a planted fail).
- VOTE home-base-your-place-remembers-11-9 (STAND-IN).

11/8 ROUND ONE (BUILD 11/9d, YOUR PLACE, PLANTED), kept:
HOME BASE (home-base-01gkdyuv): 11/8 LATEST -- BUILD 11/9d - YOUR PLACE, PLANTED, BUILT, NOT YET SEEN (rule 437(b), asks 356 and 522;
rules 347, 343, 412, 429(h), 438(a)). Record: records/BOHEMIA_HOME_BASE_YOUR_PLACE_PLANTED_11_8_26.md.

WHAT IS LIVE ON THE DEMO
- engine/bohemia_home.js (pure: grade, best, make, plant PERMANENT, nameOf, rename, addResident, prizesFrom, bill, plan, roadCheck,
  lotsOpen, save/load keyed by the game's seed) + records/target/bb/home_base.json (every number and word; TUNING's row, WORDS' lines).
- slices/BOHEMIA_CITY_WORLD.html __HOME_BASE__ (the block at the end of the file): ctBases/turfSeats/crewBillNight/mapPlatesDraw/
  loopPostOpen WRAPPED, never edited; window.BohemiaHomeMap {state, plant, rename, go, probe, offer, billNight, rec, label};
  save key bohemia.home.v1 (a new seed = a new home).
- slices/bohemia_phone.js __HOME_BASE__: the .pl PLANT button in the band (beside the boss's verb it takes the right half), the
  'home' page (grade, BETTER/GO THERE, PLANT HERE, 'Are you sure? This is permanent.', planted: the night, living there, prizes,
  standing, GO HOME); the phone's header says his place's name for CUSTOM.
- slices/BOHEMIA_SETTLEMENT_SCREEN.html __HOME_BASE__: the BOHEMIA_HOME message (cleared on every open), the desk in buildSheet
  (homeDesk, homePlanCanvas), buildLots() (4/8/12 as it grows), drawBuilt in rows of four. Before planting BUILD at his camp says plant first.
- Gate gates/home_base_gate.js (YOUR PLACE, PLANTED; --engine for the 17 engine legs in a second). VOTE home-base-your-place-planted-11-8 (STAND-IN).

SEAMS FOR OTHER LANES
- TOWN FIX (rule 438(a)) takes the floating door signs off: this gate opens BUILD by BohemiaSettlement.where('build'), never a sign.
- BOSSES: a spared (negotiable) boss -> BohemiaHomeMap.rec() + BohemiaHome.addResident(rec, {name, look, why:'spared', day}); home.json
  prizes{} maps a verb id to its piece (cook/open/purify now); a new boss's verb is one row there.
- DYNASTY: the record (planted x,y,day,grade, name, residents, prizes, nights, lastBill) is what act two derives from (347(g), 412).
- RETINUE/CAMP: a retinue hire could post up too (addResident); not wired.

NEXT, IN ORDER
1. His vote on the card. 2. The look: his place's own picture (the cameras of rule 354 once he passes them, or the plan made art,
golden piece first, rule 408). 3. 347(c): what each building is made of and painted, its sign, moving a building between lots.
4. A raid at his place walked end to end on the demo (the seat moves; LIFE+CITY's raid code reads it). 5. The acts.
[bb Battle Brothers has no home of its own; its retinue and its ambitions are the nearest pieces. Ours is the place you choose and pay for.]
[analog horror: the bill comes at night whether anyone is home, and the men you let go are still there when you come back.]
