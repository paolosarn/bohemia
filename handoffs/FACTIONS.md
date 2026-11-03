# FACTIONS (written only by the FACTIONS lane)

## FACTIONS (BEASTS 2), 11/3/26: EVERY BEAST ITS OWN BODY (rule 345, ask line 354), BUILD 11/3zzy (the bull) and 11/3zzza (the six)
Record: records/BOHEMIA_BEASTS_EVERY_BEAST_ITS_OWN_BODY_11_3_26.md. His words on THE FERAL BULL: 'They look wayyy to similar to the
og coyote the wolf actually'. Measured: every rig beast was the Khronos Fox's one mesh stretched.
- THE BUILDER: tools/bohemia_beasts_every_beast_its_own_body.py keeps only the Fox's skeleton; each animal's body is grown from its
  real measures in metres (metaball anatomy, calibrated), its bones moved to its own joints, its skin weighted by the part each
  vertex grew from, its own 24-frame walk on its own gait (GAITS, STRIDE), its own attack (ATTACKS), its coat painted from the 3D
  shape with its mark (tags, the camel's stitched neck patch, the lion's GPS collar, the coyote's mange, the dog's collar). Then the
  five-beasts tool's pose / render / pack (bpy 4.2 in a python3.11 venv; a beast is 2 to 6 minutes at 24 samples on 2 cores).
  `<venv>/bin/python tools/bohemia_beasts_every_beast_its_own_body.py model|pose|render <name>` then `pack <a,b,...>`; models in
  reference/models/bohemia/own_body/, the measures in records/target/beasts_own_body/<name>_audit.json.
- SHIPPED: the bull (559517cb), Camelops, the mountain lion, the feral hog, the coyote, the dire wolf, the feral dog (f7346a72), each
  in the fight's own sheet under its old look name (nothing in the fight's rules or data changed).
- VOTE: one card, beasts2-every-beast-its-own-body-11-3 (slices/vote/BEASTS_EVERY_BEAST_ITS_OWN_BODY.html): WAS beside a man of
  ours beside NOW for each, a line-up of all seven, every beast's eight facings. The old sheets' SE rows are kept in
  slices/vote/beasts_was/ for it.
WHAT IS LEFT (no Paolo needed): the cave hyena is still the Fox reshape (not in his note); ANIMATION may refine the walk and attack
tables; his verdict on the card decides the next pass.

## FACTIONS (BEASTS), 11/3/26: FIVE MORE BEASTS THAT CAN REALLY LIVE IN THE MOJAVE (ask line 343), BUILD 11/3zzb
Record: records/BOHEMIA_FACTIONS_FIVE_MORE_BEASTS_11_3_26.md (the Mojave test with sources, the mammoth answered, what shipped).
- THE FIVE, each through the rig in eight facings (tools/bohemia_factions_five_more_beasts.py: the Fox reshaped by the hyena tool's
  reshape plus our NECK, HUMP and HORNS, the coat from the 3D shape, the poses tool's Hit and Fall, DIRECTION's master rig, packed
  into slices/fight_rig/beast_<x>.webp and merged into fight_rig.json): COYOTE (eats the dead), MOUNTAIN LION (hides, waits, jumps
  and pins; it CLIMBS roofs), FERAL HOG (the gash bleeds; water ground only), CAMELOPS (kicks every man beside it), FERAL BULL
  (charges 2 to 4 tiles down a straight line, knocks flat).
- THE DATA in records/target/bb/bohemia_enemies.json (5 factions, 5 rows on their wiki twins: Wolf, Serpent, Hyena, Unhold, Unhold;
  5 brains; numbers gash, kick, charge, feed, lurk.wait_rounds; mix, count_scale, the road's by_act, holds and night). The fight
  folds the beast block in (ownEnemies: rig look, attack page, climbs) and builds the rules (slices/BOHEMIA_FIGHT.html beastLanded,
  kickAll, charge, feed, the lion's wait; cannotClimb reads ours.climbers.climbs).
- Skipped and why: the Shasta ground sloth (no living mother its size), the golden eagle and the Gila monster (they do not fight a
  crew). The mammoth: only at Lake Mead's shore, act three at the earliest.
- PROOF: tools/bohemia_factions_five_more_beasts_shots.js (his phone upright, four of his men): every rule fired, page errors 0
  (records/target/factions_five_beasts/shots.json). VOTE: five items, slices/vote/FACTIONS_FIVE_MORE_BEASTS.html#<beast>.
WHAT IS LEFT (no Paolo needed): the camel's N, NE and NW stills read thin (a camel from behind is thin; three passes, stopped); a
kick clip and a horn-hook clip (the bite stands in) are ANIMATION's; the map's own 'beasts' mix could take the five by act (COMBAT);
prices for hide, meat, camel milk and a live Gila monster (ECONOMY); words draft:true (WORDS); numbers tuned:false (TUNING).
Render cost: bpy 4.2 in a python3.11 venv; a beast is about 5 minutes on one core (the camel 15).
