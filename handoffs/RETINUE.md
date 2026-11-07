RETINUE (chat 26, the camp followers; retinue-01gkdyus, opened by the coordinator for rule 425(c), ask line 206; written only by this
lane). 11/7 LATEST -- BUILD 11/7r - THE RETINUE: EIGHTEEN PEOPLE, MET IN TOWN. BUILT, NOT YET SEEN (rule 179). Ask line 206 marked.
Record: records/BOHEMIA_RETINUE_THE_EIGHTEEN_PEOPLE_11_7_26.md. VOTE card retinue-the-eighteen-11-7.

WHAT IS LIVE (the demo and the alpha):
- Every town's hall: three of Battle Brothers' eighteen followers a week (dealt by the town's name and the week, the file's
  met_per_place), each a person of the dead Las Vegas: his own fresh face, name, role, his effect on one line, TAKE ON with the
  price (the hall's own 44 px row, rule 402 amended). A tap on the face or name opens his whole body, who he was and his words,
  said out of his mouth. No CLOUT, every hire shut; with a place by the fire a tap takes him on, his price once (rule 56), the map
  told (campSync). The old CAMP STAFF (BohemiaFollowers.offerFor) is gone from the hall: it charged and nobody joined.
- The camp: each follower with you stands by his piece as himself (bohemia_camp_look.js folk(), campFollower: true), a tap opens
  WHO TRAVELS WITH YOU: all eighteen as tiles (face, role, his own 44 px button), yours first, the tapped one picked with his line
  under them; one glass upright and on its side.
- The Negotiator works: the town's relations at dawn, a good word fades x0.85, a grudge mends x1.15 (relDawn, BohemiaRelations.dawn
  opts). Eleven of eighteen work.
- One id: a follower with you is dealt to nobody's street (BohemiaRigBodies.isCompany reads BohemiaCamp.looks()).

FILES: records/target/bb/retinue.json (THE DATA, a modder's file: name, was, look, price, does, nums, ask, joins, reads, shut);
engine/bohemia_camp.js (__THE_RETINUE_DATA__: the rows' copy between __RETINUE_ROWS__ marks, read again from the file at load;
LIVE/MORE/NUMS/WORD/READY built from them; row, rows, price, inTown, meet, looks); tools/bohemia_retinue_bake.js (writes the copy;
--check); slices/BOHEMIA_SETTLEMENT_SCREEN.html (__THE_RETINUE__: retinueHere, retinueCard, retinueTile, retinueGrid, retinueTake, retinueFig,
retinueSay; the hall's block; the camp sheet's rows; the CSS; one line in openPerson; relDawn passes the Negotiator);
slices/bohemia_camp_look.js (__THE_RETINUE__ in folk()); engine/bohemia_relations.js (dawn opts); engine/bohemia_rig_bodies.js
(isCompany); gates/the_retinue_gate.js (new, registered as THE RETINUE); gates/settlement_screen_gate.js and
gates/the_hire_price_is_the_formula_gate.js (their CAMP STAFF legs RE-AIMED at the retinue); the stamp; the demo re-cut.

A MODDER: edit a row of records/target/bb/retinue.json and reload; then `node tools/bohemia_retinue_bake.js` so the shipped copy
matches (THE RETINUE's R2 goes red until you do).

GATES (each run alone on this tree): THE RETINUE 29/0 (R9 on the baked demo), --plant exits 1 (R5, R6 red); settlement screen 75/0 on the merged tree (the shop strip
bottles fixed upstream); the hire price 10/0; trade goods carried 26/0; the camp gate C4 ok (its C2 C5 C6 C7 are red on main too); demo build green.

HOOKS FOR OTHER LANES (each shut follower names you in the file's `shut`; read his number, then set his `shut` to null and `reads` to
your screen, and THE RETINUE counts him as working):
- RUN TWO and UI TWO: the agent, BohemiaCamp.has('agent'): every town's jobs on the phone from anywhere.
- WORLD and COMBAT: the bounty hunter, plus('champions') more champions, champPayLo/Hi a head on the spoils.
- RUN: the brigand (caravans out of sight, has('brigand')); the cartographer (placePayLo/Hi for a place found, the map that fills in).
- ECONOMY: the quartermaster (caps on tape, meds, rounds: plus('tapeRoom') ...); the trader (plus('tradeGoods'), rule 425(b)).
- Nobody yet: the alchemist (crafting).
- PORTRAIT: person_woman_0..3 have no wound patches (records/target/portrait/wounds/<look>.json 404s once, quietly).
- ANIMATION: the followers stand still at camp; a work act each (the cook stirring, the smith hammering) would read as his job.

NOT DONE, NEXT, IN ORDER: (1) the seven shut, as their lanes' systems land; (2) Battle Brothers' unlock conditions for the later
followers (not every one for hire from the start), research first; (3) the followers' work acts at camp.
[bb Battle Brothers: the retinue is hired in a town, five places by renown, a one-time price and one lasting effect each.]
[analog horror: Earl's dark screens still show him something some nights; Rusty's scanner talks when nobody is left to be talking.]
