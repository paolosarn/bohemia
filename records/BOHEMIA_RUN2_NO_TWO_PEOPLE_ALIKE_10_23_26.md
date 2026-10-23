# RUN TWO [no two people alike] (rule 121(i)), 10/23/26

PAOLO 10/19: "THERE'S SO MANY OF THE SAME HATS AND SHIT ON THE CHARACTERS... ALL THE CLAY PEOPLE HAVE LIKE 2 OPTIONS FOR
CUSTOMIZATIONS, IT'S INSANE." The coordinator's note of his nineteenth votes: "give them hairstyles... the whole
enchilada"; hair first, hats rare; the cone hat and the odd wraps out of the random mix; every top, cut and face piece in
play. Rule 123: no card; he meets it while playing.

## THE GAP, MEASURED BEFORE

- The game's 3D people were 13 gang looks (one man per gang: slices/BOHEMIA_RIG_CAST.json) and 3 barber cuts for every
  crowd (slices/BOHEMIA_RIG_PEOPLE.json). A gang's party on the map was one man drawn twice.
- The map at its middle zoom drew 69 people from 14 different looks (measured with the probe below, this round).
- The towns' keepers and crowds were the 13 gang looks drawn with repeats: the same Red twice on one street.
- A band of twelve in the fight wore the six looks of its pool, each twice.
- CHARACTER had made every piece on the 3D man (the barber's book: 21 cuts, 21 hats, 14 face pieces, 80 tops, 74
  coats, beards, marks, skins) and a person builder, and nobody rolled the people.

## WHAT WAS BUILT

tools/bohemia_run2_no_two_people_alike.py, nothing drawn new (rule 121(b)):

- ROLL: CHARACTER's own roll (skin by the valley's census, a cut weighted to the gang, hair colour, face shape, facial
  hair 45 percent, a mark 20, a hat 12 over a short cut only, never the cone or the wraps, a face piece 10) plus a top
  and a coat inside the gang's colours. 152 people: 8 for each of the 13 gangs and 48 of the places' own people. A
  repeat is re-drawn. Re-rolling with more places' people keeps the first 116 the same (measured).
- BUILD: CHARACTER's person builder (its person_body taught the top and the coat in memory, its file not edited).
- RENDER: DIRECTION's master rig patched in memory the way COMBAT renders the fight (24 samples, persistent data, no
  movers' light pass, no dents). Stand in eight turns, the walk in eight (not for the 36 places' people who only stand),
  and the head of the same model: rest and the four speak-along mouths (A E O M), squared with PORTRAIT's own
  hand_off_window into face/<key>_<64|128>.png. ONE ID, ONE WHOLE PERSON.
- INDEX: engine/bohemia_people_mix.js, who everybody is, read by engine/bohemia_rig_bodies.js (has, src, standing,
  people, person, cast) and engine/bohemia_crew_faces.js (has, src: his own face files).
- MAP SHEETS: RUN's bake (unedited) per gang, twelve a sheet at most, slices/rig_mix/<name>.png/.json and an index.
- FIGHT: COMBAT's poses laid on each person's model (its tool, unedited), the six fight clips rendered the fight's way,
  his stand and walk from the street render, packed into HIS GANG'S CELL so the gang's gun sheet sits in his hands
  (same skeleton, same poses, same 57 px a metre, same ground point; only the clothes differ). The places' people take
  YOU's cell and guns. 144 frames a man instead of 504 with his own three guns.

## WHERE HE MEETS IT

- THE TOWNS (settlement screen): a place deals one hand of the valley's people; each keeper's door and each crowd spot
  takes its own card. Nobody on the screen is anybody else; a spot keeps its man at night and on market day; each
  person talks under his own head. The crowd's names read as the face (a beard reads as a man, the skin band picks the
  people the name comes from).
- THE MAP: a gang's party is two of its gang; a crowd is the places' own people; THE SEAT KEEPER gives each person on the
  glass a man nobody else on that frame has, and he keeps him while he stays on screen.
- THE HALL AND THE CREW SCREEN: the men at the post are rolled people with a fight sheet, never one already in your
  company; the crew card shows his own still and face.
- THE FIGHT: the band pools keep their first look and then deal their gangs' rolled people; each man takes the first look
  in his pool nobody on the board wears (his men's included).

## MEASURED AFTER (round 2, the first ship: the towns and the map)

- THE ROLL: 152 people, 152 different by every piece; in play 21 cuts, 8 hair colours, 13 face shapes, 11 skin tones,
  69 tops, 46 coats, 7 hats (9 people, hats rare), 9 face pieces, 11 beards, 8 marks; no cone hat, no wrap on a head.
- THE TOWNS: 36 screens (camp, town and fortress at four places, by day, by night, on market day), 460 people drawn,
  nobody twice on any screen, all rolled, each talking under his own head; the market-day street fetched 56 different
  people's renders; two towns share at most a third of their people. Was: 13 gang looks with repeats.
- THE MAP (the demo's own map, the parties out on the road): at the default zoom 95 different of 95 drawn (was 19 of
  95), at 1.4 69 of 69 (was 14 of 69), at 2.4 10 of 10 (was 4 of 10); 15 people sheets fetched by then.
- BYTES: the map's 17 sheets 7.7 MB in all, each fetched the first time its gang is drawn (a crowd never fetches one);
  the towns fetch each person's own 8 stills and faces (the published people 36 MB; the 78 MB of walk and portrait
  frames are source, kept unpublished in records/run2/people).
- GATES: NO TWO PEOPLE ALIKE 15/0 (new, in the suite), THE PEOPLE OF THE PLACE 40/0 (was 31; a NO TWO ALIKE leg on every
  tier and night, market day, the night keeps each spot's man, two towns), settlement 74/0, every speaker 10/0, ask the
  crowd 46/0, names wired 66/0, who the face is 46/0, the map has its people 19/0, the living map 22/0, keepers 26/0,
  keeper lines 48/0, roster and posts 28/0, one man one look 8/0, equip 7/0, no face from a body 23/0, each man his own
  skin 5/0. Four of this lane's source-shape legs re-aimed at the new code, same meaning.

## STILL TO DO IN THIS ROW

- THE LAYERS: CHARACTER [the clothes look real] landed while these rendered (rule 129: layers that show; his trousers,
  shoes and gear rolled off each person's id). The 152 are rebuilt with it and swapped in place (same files).
- THE FIGHT AND THE HALL: 51 people (each gang's first three and the hall's twelve) through COMBAT's poses, packed into
  their gang's cell with their gang's guns (one man measured: the gun sits in his hands as in the gang's own man's); the
  hall then deals only rolled men the fight can draw. The gate's hall, crew and fight legs land with them.

## FOUND ON THE WAY

- The pipeline's first person took 96 s on this box (4 cores); a batch of two 2-thread workers ran 0.63 people a minute,
  four 1-thread workers 0.96 (the build and the export are single-threaded; four overlap them).
- One sheet for 116 people would be 126,000 px tall, past what a phone decodes: twelve a sheet.
- COMBAT's pack() would have dropped the people on its next run: it now keeps every kind 'person' look and its face.

## ROUTED

- COMBAT: the fight's people are data (slices/fight_rig/person_*.webp, fight_rig.json kind 'person', ours.json bands);
  freeLook() in BOHEMIA_FIGHT.html is the one code line (a band never repeats a man while its pool has one free).
- RUN: the map's people are from slices/rig_mix (__NO_TWO_ALIKE__ in BOHEMIA_CITY_WORLD.html); the demo frames the map,
  so it lands with no cut. His two men on the map (company pool) and HIM are unchanged.
- PORTRAIT and CHARACTER (paused): nothing asked; their tools were imported, never edited.
